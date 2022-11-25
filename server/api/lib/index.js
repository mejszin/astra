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

app.locals.user_data_path = './data/users.json';
app.locals.user_data = fs.existsSync(app.locals.user_data_path) ? JSON.parse(fs.readFileSync(app.locals.user_data_path)) : {};

app.locals.task_data_path = './data/tasks.json';
app.locals.task_data = fs.existsSync(app.locals.task_data_path) ? JSON.parse(fs.readFileSync(app.locals.task_data_path)) : {};

const bcrypt = require('bcrypt');
const { title } = require('process');

app.locals.randomString = (length = 8) => {
    var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = '';
    for (var i = 0; i < length; i++) {
        id += char_set.charAt(
            Math.floor(Math.random() * char_set.length)
        );
    }
    return id;
}

app.locals.newSaltHash = (password) => {
    return new Promise((resolve) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, function(err, hash) {
                resolve([salt, hash]);
            });
        });
    });
};

app.locals.findCredentials = async (username, password) => {
    return new Promise((resolve, reject) => {
        Object.keys(app.locals.user_data).forEach(async function(token) {
            if (username == app.locals.user_data[token].username) {
                const result = await bcrypt.compare(password, app.locals.user_data[token].password.hash);
                resolve(result ? token : null);
            } else {
                resolve(null);
            }
        });
    });
};

app.locals.getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000);
}

app.locals.writeUsers = () => {
    fs.writeFileSync(app.locals.user_data_path, JSON.stringify(app.locals.user_data));
}

app.locals.writeTasks = () => {
    fs.writeFileSync(app.locals.task_data_path, JSON.stringify(app.locals.task_data));
}

require('./user.js')(app);
require('./tasks.js')(app);
require('./tags.js')(app);

app.get('/ping', (req, res) => {
    console.log('/ping', req.query);
    res.status(200).send('Pong!');
});

app.listen(PORT, () => {
    console.log(`It's alive on port ${PORT}!`);
    console.log(app.routes);
});