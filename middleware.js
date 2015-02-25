require('colors');
var redis = require("redis"),
    config = require(process.cwd() + '/config'),
    client = redis.createClient(config.redis.port, config.redis.host),
    verbose = require('./logger').onVerbose;

var middleware = {

    extend : function (obj) {
        Object.keys(obj).forEach(function (key) {
            verbose("Nimble: Registering Middleware:".grey, (key).grey);
            this[key] = obj[key];
        }.bind(middleware));
        return middleware;
    },

    onRequest : function (req, res, next) {
        next();
    },

     // Private, best not to edit this, instead use onAfterPost, onAfterGet, onAfterController, etc...
    onAfterResponse : function (req, res) {
        var type = req.method;
        middleware.onAfterController(req, res);
        if (middleware["onAfter" + type]) {
            middleware["onAfter" + type](req,res)
        }
    },

    // Gets The Session Object from Redis
    readSession : function (req, res, next) {
        
        if (req.cookies) {
            if (req.cookies[config.cookie.name]) {
                var id = req.cookies[config.cookie.name].split('.')[0].replace('s:', config.redis.key);
                client.get(id, function (err, data) {
                    req.session = JSON.parse(data);
                    next();
                });
            } else {
                next();
            }
        } else {
            next();
        }
        
    },

    onAfterController : function () {},
    onAfterGET : function () {},
    onAfterPOST : function () {},
    onAfterPUT : function () {},
    onAfterDELETE : function () {}
};

module.exports = middleware;