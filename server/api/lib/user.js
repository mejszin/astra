module.exports = function (app) {
    app.locals.usernameExists = (username) => {
        var exists = false;
        Object.keys(app.locals.user_data).forEach(function(token) {
            if (username == app.locals.user_data[token].username) {
                exists = true;
            };
        })
        return exists;
    };

    app.locals.isToken = (token) => {
        return (token in app.locals.user_data);
    }
    
    app.locals.isUser = (user_id) => {
        // TODO:
        return true;
    }

    app.locals.newUser = async (username, password) => {
        if (app.locals.usernameExists(username)) { return undefined };
        var token = app.locals.randomString();
        var user_id = app.locals.randomString();
        var salt_hash = await app.locals.newSaltHash(password);
        app.locals.user_data[token] = {
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

    app.locals.getUser = (token, user_id = null) => {
        if (token in user_data) {
            if (user_id == null) {
                return app.locals.user_data[token];
            } else {
                // TODO: Search for user_id
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    app.get('/user/get', (req, res) => {
        console.log('/user/get', req.query);
        const { token } = req.query;
        if (app.locals.isToken(token)) {
            // Success
            res.status(200).send(app.locals.getUser(token));
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });
    
    app.get('/user/login', async (req, res) => {
        console.log('/user/login', req.query);
        const { username, password } = req.query;
        if (app.locals.usernameExists(username)) {
            var token = await app.locals.findCredentials(username, password);
        } else {
            var token = null;
        }
        if (token != null) {
            // Success
            var user = app.locals.getUser(token);
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
            var token = await app.locals.newUser(username, password);
            if (token != undefined) {
                // Success
                app.locals.writeUsers();
                res.status(200).send({ token: token });
            } else {
                res.status(204).send();
            }
        } else {
            // Bad request
            res.status(400).send();
        }
    });
}