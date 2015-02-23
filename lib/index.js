module.exports = {
    server : function () {
        require('../service')();
    },
    middleware : require('../middleware'),
    validate : require('../validate'),
    setter : require('../setter'),
    logger : require('../logger'),
    mongoose : require('mongoose'),
    colors : require('colors'),
    lodash : require('lodash')
}