module.exports = function (app) {
    app.locals.getUserTasks = (user_id) => {
        result = [];
        Object.keys(app.locals.task_data).forEach(task_id => {
            if (app.locals.task_data[task_id].owner == user_id) {
                result.push(app.locals.task_data[task_id]);
            }
        });
        return result;
    }
    
    app.locals.newTask = (user_id, title, description) => {
        let task_id = app.locals.randomString();
        let current_time = app.locals.getTimestampInSeconds();
        app.locals.task_data[task_id] = {
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
            feed: {},
        }
        return true;
    }

    app.locals.getTask = (task_id) => {
        if (task_id in app.locals.task_data) {
            return app.locals.task_data[task_id];
        } else {
            return undefined;
        }
    };

    app.locals.deleteTasks = (task_id) => {
        if (task_id in app.locals.task_data) {
            delete app.locals.task_data[task_id];
        }
    }

    app.locals.newFeed = (task_id, data) => {
        if (task_id in app.locals.task_data) {
            let feed_id = app.locals.randomString();
            app.locals.task_data[task_id].feed[feed_id] = data;
        }
    }

    app.locals.deleteFeed = (task_id, feed_id) => {
        if (task_id in app.locals.task_data) {
            if (feed_id in app.locals.task_data[task_id].feed) {
                delete app.locals.task_data[task_id].feed[feed_id];
            }
        }
    }

    app.get('/tasks', (req, res) => {
        console.log('/tasks', req.query);
        const { token } = req.query;
        if (app.locals.isToken(token)) {
            let user = app.locals.getUser(token);
            let tasks = app.locals.getUserTasks(user.id);
            // Success
            res.status(200).send(tasks);
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });

    app.get('/tasks/new', (req, res) => {
        console.log('/tasks/new', req.query);
        const { token, title, description } = req.query;
        if (app.locals.isToken(token)) {
            let user = app.locals.getUser(token);
            app.locals.newTask(user.id, title, description);
            app.locals.writeTasks();
            // Success
            res.status(200).send({});
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });

    app.get('/tasks/delete', (req, res) => {
        console.log('/tasks/delete', req.query);
        const { token, task_id } = req.query;
        if (app.locals.isToken(token)) {
            app.locals.deleteTask(task_id);
            app.locals.writeTasks();
            // Success
            res.status(200).send({});
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });

    app.get('/tasks/feed', (req, res) => {
        console.log('/tasks/feed', req.query);
        const { token, task_id } = req.query;
        if (app.locals.isToken(token)) {
            let task = app.locals.getTask(task_id);
            if (task != undefined) {
                // Success
                res.status(200).send(task.feed);
            } else {
                // No content
                res.status(204).send();
            }
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });

    
    app.post('/tasks/feed/new', (req, res) => {
        console.log('/tasks/feed/new', req.query);
        const { token, task_id } = req.query;
        const data = req.body;
        if (app.locals.isToken(token)) {
            app.locals.newFeed(task_id, data);
            app.locals.writeTasks();
            // Success
            res.status(200).send({});
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });

    app.get('/tasks/feed/delete', (req, res) => {
        console.log('/tasks/feed/delete', req.query);
        const { token, task_id, feed_id } = req.query;
        if (app.locals.isToken(token)) {
            app.locals.deleteFeed(task_id, feed_id);
            app.locals.writeTasks();
            // Success
            res.status(200).send({});
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });
}