var config = require('./config');

module.exports = {
    secret : '{{secret}}',
    cookie : {
        maxAge: 24 * 60 * 60 * 1000,
        redis_prefix : config.redis.key,
        domain : ''
    }
}