var mongoose = require('mongoose');
var News = mongoose.model('News');
var redisClient = require('../../config/redis');

const REDIS_NEWS_PREFIX = 'NEWS_';

const getNewsFromMongo = (id, cb) => {
    console.log('query from mongo');
    News
    .findById({_id: mongoose.Types.ObjectId(id)})
    .then((data) => {
        if (data) {
            console.log('set redis');
            redisClient.set(REDIS_NEWS_PREFIX + id, JSON.stringify(data));
            cb(null, data);
        }
    }).catch((err) => {
        return cb(err, null);
    });
};
const getNewsFromRedis = (id, cb) => {
    console.log('query from redis');
    redisClient.get(REDIS_NEWS_PREFIX + id, (err, data) => {
        if (err) return cb(err, null);
        try {
            data = JSON.parse(data);
        } catch (error) {
            return cb(error, null);
        }
        cb(null, data);
    })
};

module.exports = {
    create(req, res, next) {
        var news = new News(req.body);
        news.save().then(() => {
            return res.json(news);
        }).catch((err) => {
            return next(err);
        });
    },
    list(req, res, next) {
        var pagesize = +req.query.pagesize || 10;
        var pagestart = +req.query.pagestart || 1;
        News
        .find()
        .skip( (pagestart - 1) * pagesize )
        .limit(pagesize)
        .exec()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err)
        });
    },
    getById(req, res, next, id) {
        if (!id) return next(new Error('news not found'));
        
        getNewsFromRedis(id, (err, data) => {
            if (err) return next(err);
            if (!data) {
                getNewsFromMongo(id, (err, data) => {
                    if (err) return next(err);
                    if (!data) {
                        return next(new Error('not found'));
                    }
                    req.news = data;
                    return next();
                });
            } else {
                req.news = data;
                next();
            }
        });
    },
    get(req, res, next) {
        console.time('go');
        res.json(req.news);
        console.timeEnd('go');
    } 
}
