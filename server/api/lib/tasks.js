module.exports = function (app) {
    app.locals.getUserTasks = (user_id) => {
        result = [];
        Object.keys(app.locals.task_data).forEach(task_id => {
            if (app.locals.task_data[task_id].owner == user_id) {
                result.push(app.locals.task_data[task_id]);
            }
        });
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
            history: {},
        }
        return true;
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
            res.status(200).send();
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });
}