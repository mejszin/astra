module.exports = function (app) {
    app.locals.newTag = (token, tag_name, tag_color) => {
        if (app.locals.isToken(token)) {
            let tag_id = app.locals.randomString();
            app.locals.user_data[token].data.tags[tag_id] = {
                name: tag_name,
                color: tag_color,
            };
            return true;
        } else {
            return false;
        }
    }

    app.get('/tags', (req, res) => {
        console.log('/tags', req.query);
        const { token, name, color } = req.query;
        if (app.locals.isToken(token)) {
            app.locals.newTag(token, name, color);
            app.locals.writeUsers();
            res.status(200).send();
        } else {
            // Unauthorized
            res.status(401).send();
        }
    });
}