module.exports = function () {
    require('./logo')();
    require('./exitHandler')();
    
    var application_root = __dirname,
        globalReport = require('./globalReport'),
        express = require("express"),
        path = require("path"),
        mongoose = require('mongoose'),
        config = require(process.cwd() +'/config'),
        config_session = require(process.cwd() +'/session'),
        app = express(),
        router = require(process.cwd() +'/router'),
        controller = require(process.cwd() +'/controller'),
        middleware = require(process.cwd() +'/middleware'),
        colors = require('colors'),
        cookieParser = require('cookie-parser'),
        policies = require(process.cwd() +'/policies'),
        verbose = require('./logger').onVerbose,
        applyPolicy = function (policy, method) {
            return function (req, res) {
                if (policy) {
                    if (policies[policy]) {
                        if (policies[policy](req, res)) {
                            method(req, res);
                        } else {
                            policies.onFailure(req, res);
                        }
                    } else {
                        console.log(("Nimble: The Policy '" + policy + "' Does Not exist, therefore the request was denied").red);
                        policies.onFailure(req, res);
                    }
                } else { // No Policy, Allow it
                    method(req, res);
                }
                
            }
        };


    verbose("Nimble: Exposing Global Objects".yellow);

    // Expose any Globals
    require(process.cwd() +'/globals')(global, function () {
        
        verbose('Nimble: Globals Registered ::'.magenta, (globalReport()).magenta);
        

        // Connect To MongoDB using our ORM
        mongoose.connect('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database);
        verbose("Nimble: Connecting To".yellow, ('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database).yellow);

        verbose("Nimble: Configuring Express Server".yellow)
        // Config

        app.use(require('body-parser')[config.bodyParser]());
        app.use(require('method-override')());
        app.use(cookieParser());
        app.use(middleware.readSession);   
        app.use(middleware.onRequest);
        
        app.use(function (req, res, next) {
            req.on("end", function() {
                middleware.onAfterResponse(req, res);
            });
            next();
        });

        app.use(app.router);
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        

        // Bind The Routes
        //GET
        if (router.GET) {
            router.GET.forEach(function (route) {
                verbose("Nimble: Binding Route :: GET".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                app.get(route.path, applyPolicy(route.policy, controller[route.action]));
            });
        }

        // POST
        if (router.POST) {
            router.POST.forEach(function (route) {
                verbose("Nimble: Binding Route :: POST".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                app.post(route.path, applyPolicy(route.policy, controller[route.action]));
            });
        }

        // PUT
        if (router.PUT) {
            router.PUT.forEach(function (route) {
                verbose("Nimble: Binding Route :: PUT".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                app.put(route.path, applyPolicy(route.policy, controller[route.action]));
            });
        }

        // DELETE
        if (router.DELETE) {
            router.DELETE.forEach(function (route) {
                verbose("Nimble: Binding Route :: DELETE".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                app.delete(route.path, applyPolicy(route.policy, controller[route.action]));
            });
        }
        

        // Allow Using Custom Middleware
        if (middleware.custom) {
            middleware.custom(app, express);
        }

        // Launch server
        app.listen(config.port || 4242);
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
          console.log('Nimble: Server Listening On:'.green, (add + ':' + config.port.toString()).green);
        });
    });
}