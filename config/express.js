const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../public')))

    const db = require('../config/mongoose');
    db();

    require('../app/routers/news.server.routers')(app);

    app.use((req, res, next) => {
        res.status(404);
        try {
            return res.json('Not Found');
        } catch (error) {
            console.error('404');
        }
    });

    app.use((err, req, res, next) => {
        if (!err) next();
        try {
            res.status(500);
            return res.json(err.message || 'server error')
        } catch (error) {
            console.error('500');
        }
    });
    return app;
};