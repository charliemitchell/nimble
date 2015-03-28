var rabbit = require("wascally");

// ##Auto Nack On Errors
// ## After this call, any new callbacks attached via handle will be wrapped in a try/catch
// rabbit.nackOnError(); 

// ## Rejects unhandled messages so that will will not be requeued
// rabbit.rejectUnhandled(); 

// ## Sends all unhandled messages back to the queue.
// rabbit.nackUnhandled();


module.exports = {

    publish: function(options) {
        rabbit.publish(options.exchange || module.exports.config.rabbitDefaults.exchange, {
            type: options.type || config.rabbitDefaults.type,
            body: options.body,
            routingKey: options.routingKey || module.exports.config.rabbitDefaults.routingKey
        });
    },

    subscribe: function(options) {
        rabbit.handle(options.type, options.handler);
    },

    config : {

        rabbitDefaults : {
            routingKey : 'routingKey',
            type : 'message',
            exchange : 'exchange'
        },

        rabbit: {

            connection: {
                user: 'guest',
                pass: 'guest',
                server: process.env.LOCALHOST || 'localhost',
                port: 5672,
                vhost: '%2f'
            },

            queues: [{
                name: 'cloudamqp-queue',
                subscribe: true,
                durable: true
            }],

            exchanges: [{
                name: "exchange",
                type: "direct",
                persistent: true,
                durable: true
            }],

            bindings: [{
                exchange: 'exchange',
                target: 'cloudamqp-queue',
                keys: ["routingKey"]
            }]
        }
    }

};