const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.jsonParser = bodyParser.json()
app.locals.urlencodedParser = bodyParser.urlencoded({ extended: true })

const PORT = 88;

const VERSION = 'v0.0.1';

const fs = require('fs');

const user_data_path = './data/users.json';
var user_data = fs.existsSync(user_data_path) ? JSON.parse(fs.readFileSync(user_data_path)) : {};

const task_data_path = './data/tasks.json';
var task_data = fs.existsSync(task_data_path) ? JSON.parse(fs.readFileSync(task_data_path)) : {};

const bcrypt = require('bcrypt');
const { title } = require('process');

const methods = {};

methods.randomString = (length = 8) => {
    var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = '';
    for (var i = 0; i < length; i++) {
        id += char_set.charAt(
            Math.floor(Math.random() * char_set.length)
        );
    }
    return id;
}

methods.getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000);
}

methods.writeUsers = () => {
    fs.writeFileSync(user_data_path, JSON.stringify(user_data));
}

methods.writeTasks = () => {
    fs.writeFileSync(task_data_path, JSON.stringify(task_data));
}

methods.isToken = (token) => {
    return (token in user_data);
}

methods.isUser = (user_id) => {
    // TODO:
    return true;
}

methods.newSaltHash = (password) => {
    return new Promise((resolve) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, function(err, hash) {
                resolve([salt, hash]);
            });
        })
    });
};

methods.newUser = async (username, password) => {
    if (methods.usernameExists(username)) { return undefined };
    var token = methods.randomString();
    var user_id = methods.randomString();
    var salt_hash = await methods.newSaltHash(password);
    user_data[token] = {
        id: user_id,
        alias: username,
        username: username,
        password: {
            salt: salt_hash[0],
            hash: salt_hash[1],
        },
        data: {
            pinned_tasks: [],
            tags: {},
        },
    };
    return token;
}

methods.getUser = (token, user_id = null) => {
    if (token in user_data) {
        if (user_id == null) {
            return user_data[token];
        } else {
            // TODO: Search for user_id
            return undefined;
        }
    } else {
        return undefined;
    }
}

methods.newTag = (token, tag_name, tag_color) => {
    if (methods.isToken(token)) {
        let tag_id = methods.randomString();
        user_data[token].data.tags[tag_id] = {
            name: tag_name,
            color: tag_color,
        };
        return true;
    } else {
        return false;
    }
}

methods.usernameExists = (username) => {
    var exists = false;
    Object.keys(user_data).forEach(function(token) {
        if (username == user_data[token].username) {
            exists = true;
        };
    })
    return exists;
};

methods.findCredentials = async (username, password) => {
    return new Promise((resolve, reject) => {
        Object.keys(user_data).forEach(async function(token) {
            if (username == user_data[token].username) {
                const result = await bcrypt.compare(password, user_data[token].password.hash);
                resolve(result ? token : null);
            } else {
                resolve(null);
            }
        });
    });
};

methods.getUserTasks = (user_id) => {
    if (user_id in project_data.users) {
        result = [];
        Object.keys(task_data).forEach(task_id => {
            if (task_data[task_id].owner == user_id) {
                result.push(task_data[task_id]);
            }
        });
        return result;
    } else {
        return undefined;
    }
}

methods.newTask = (user_id, title, description) => {
    let task_id = methods.randomString();
    let current_time = methods.getTimestampInSeconds();
    task_data[task_id] = {
        id: task_id,
        owner: user_id,
        time: {
            created: current_time,
            updated: current_time,
        },
        content: {
            title: title,
            description: description,
        },
        variables: {},
        history: {},
    }
    return true;
}

app.get('/ping', (req, res) => {
    console.log('/ping', req.query);
    res.status(200).send('Pong!');
});

app.get('/user/get', (req, res) => {
    console.log('/user/get', req.query);
    const { token } = req.query;
    if (methods.isToken(token)) {
        // Success
        res.status(200).send(methods.getUser(token));
    } else {
        // Unauthorized
        res.status(401).send();
    }
});

app.get('/user/login', async (req, res) => {
    console.log('/user/login', req.query);
    const { username, password } = req.query;
    if (methods.usernameExists(username)) {
        var token = await methods.findCredentials(username, password);
    } else {
        var token = null;
    }
    if (token != null) {
        // Success
        var user = methods.getUser(token);
        res.status(200).send({ id: user.id, token: token });
    } else {
        // Unauthorized
        res.status(401).send();
    }
});

app.get('/user/new', async (req, res) => {
    console.log('/user/new', req.query);
    const { username, password } = req.query;
    if ((username != undefined) && (password != undefined)) {
        var token = await methods.newUser(username, password);
        if (token != undefined) {
            // Success
            methods.writeUsers();
            res.status(200).send({ token: token });
        } else {
            res.status(204).send();
        }
    } else {
        // Bad request
        res.status(400).send();
    }
});

app.get('/user/tasks', (req, res) => {
    console.log('/user/tasks', req.query);
    const { token } = req.query;
    if (methods.isToken(token)) {
        let user = methods.getUser(token);
        let tasks = methods.getUserTasks(user.id);
        // Success
        res.status(200).send(tasks);
    } else {
        // Unauthorized
        res.status(401).send();
    }
});

app.get('/user/tasks/new', (req, res) => {
    console.log('/user/tasks/new', req.query);
    const { token, title, description } = req.query;
    if (methods.isToken(token)) {
        let user = methods.getUser(token);
        methods.newTask(user.id, title, description);
        methods.writeTasks();
        // Success
        res.status(200).send();
    } else {
        // Unauthorized
        res.status(401).send();
    }
});

app.get('/user/tags/new', (req, res) => {
    console.log('/user/tags/new', req.query);
    const { token, name, color } = req.query;
    if (methods.isToken(token)) {
        methods.newTag(token, name, color);
        methods.writeUsers();
        res.status(200).send();
    } else {
        // Unauthorized
        res.status(401).send();
    }
});

app.listen(PORT, () => console.log(`It's alive on port ${PORT}!`));