module.exports = {
    
    sessionless : false, // Set True if you don't want to use a session

    verbose : false,

    reportGlobalVars : true,

    port : 4242,  // What port should this service handle

    bodyParser : 'json', // What Kind of API is this [https://www.npmjs.com/package/body-parser]
    
    // Used For Session
    redis : {
      host: 'localhost',
      port: 6379,
      key : 'sess:'
    },
    cookie : {
      name : 'yourcookie.sid',
      secret: 'Your session secret'
    },

    // MongoDB
    mongodb : {
        host : 'localhost',
        port : 27017,
        database : 'yourdatabase'
    },
    
    // CSRF
    csrf : {

    },

    // Rabbit MQ / Wascally ()

    rabbitDefaults : {
        routingKey : 'routingKey',
        type : 'message',
        exchange : 'exchange'
    },

    rabbit: {
        connection: {
            user: 'guest',
            pass: 'guest',
            server: 'localhost',
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