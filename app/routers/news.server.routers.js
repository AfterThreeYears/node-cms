var newsController = require('../controllers/news.server.controller');

module.exports = (app) => {
    app.route('/news')
        .get(newsController.list)
        .post(newsController.create)
    app.route('/news/:nid')
        .get(newsController.get);
    
    app.param('nid', newsController.getById);
}