var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
    title: String,
    content: String,
    createTime: {
        type: Date,
        default: Date.now,
    }
});

var News = mongoose.model('News', NewsSchema);