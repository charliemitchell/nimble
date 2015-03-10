var config = require('./config'),
    rabbit = require("wascally");

// ##Auto Nack On Errors
// ## After this call, any new callbacks attached via handle will be wrapped in a try/catch
// rabbit.nackOnError(); 

// ## Rejects unhandled messages so that will will not be requeued
// rabbit.rejectUnhandled(); 

// ## Sends all unhandled messages back to the queue.
// rabbit.nackUnhandled();


module.exports = {

    publish: function(options) {
        rabbit.publish(options.exchange || config.rabbitDefaults.exchange, {
            type: options.type || config.rabbitDefaults.type,
            body: options.body,
            routingKey: options.routingKey || config.rabbitDefaults.routingKey
        });
    },

    subscribe: function(options) {
        rabbit.handle(options.type, options.handler);
    }
};