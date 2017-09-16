var mongoose = require('mongoose');
var config = require('./config');

module.exports = () => {
    var db = mongoose.connect(config.mongoose);
    require('../app/models/news.server.model');
    return db;
};