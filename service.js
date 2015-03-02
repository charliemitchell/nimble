module.exports = function () {
    var hooks,
        fs = require('fs');

    // Prevent Version Issue
    if (fs.existsSync(process.cwd() +'/hooks.js')) {
        hooks = require(process.cwd() +'/hooks');
    } else {
        console.log("nimbleservice now supports a hooks file. Grab one from our github at http://raw.githubusercontent.com/charliemitchell/nimble/master/blueprint/hooks.js");
        hooks = {};
    }

    var config = require(process.cwd() +'/config');
        
    // Support Hiding the logo
    if (config.hideLogo !== true) {
        require('./logo')();
    } else {
        console.log("  > Service Starting...".green)
    }

    require('./exitHandler')();

    var application_root = __dirname,
        globalReport = require('./globalReport'),
        express = require("express"),
        path = require("path"),
        mongoose = require('mongoose'),
        config_session = require(process.cwd() +'/session'),
        app = express(),
        server = require('http').Server(app),
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

    if (hooks.app) {
        verbose("Nimble: Configuring App");
        hooks.app(server, app, express);
    }

    verbose("Nimble: Exposing Global Objects".yellow);

    // Expose any Globals
    require(process.cwd() +'/globals')(global, function () {
        
        verbose('Nimble: Globals Registered ::'.magenta, (globalReport()).magenta);
        
        if (hooks.onBeforeMongoose) {
            verbose("Nimble: Configuring Mongoose");
            hooks.onBeforeMongoose(mongoose, server, app, express);
        }

        // Connect To MongoDB using our ORM
        mongoose.connect('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database);

        verbose("Nimble: Connecting To".yellow, ('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database).yellow);

        verbose("Nimble: Configuring Express Server".yellow)
        // Config

        if (hooks.onBeforeBodyParser) {
            verbose("Nimble: onBeforeBodyParser");
            hooks.onBeforeBodyParser(server, app, express);
        }
        
        app.use(require('body-parser')[config.bodyParser]());
        
        
        if (hooks.onBeforeMethodOverride) {
            verbose("Nimble: onBeforeMethodOverride");
            hooks.onBeforeMethodOverride(server, app, express);
        }

        app.use(require('method-override')());
        
        if (hooks.onBeforeCookieParser) {
            verbose("Nimble: onBeforeCookieParser");
            hooks.onBeforeCookieParser(server, app, express);
        }

        app.use(cookieParser());


        if (hooks.onBeforeReadSession) {
            verbose("Nimble: onBeforeReadSession");
            hooks.onBeforeReadSession(server, app, express);
        }

        // Support Users Who don't need a session
        if (!config.sessionless) {
            verbose("Nimble: Using Session Middleware");
            app.use(middleware.readSession);
        } else {
            verbose("Nimble: Skipping Session Middleware");
        }

        app.use(middleware.onRequest);
        
        app.use(function (req, res, next) {
            req.on("end", function() {
                middleware.onAfterResponse(req, res);
            });
            next();
        });

        if (hooks.onBeforeRouter) {
            verbose("Nimble: onBeforeRouter");
            hooks.onBeforeRouter(server, app, express);
        }

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
            middleware.custom(server, app, express);
        }

        if (hooks.onBeforeListen) {
            verbose("Nimble: onBeforeListen");
            hooks.onBeforeListen(server, app, express);
        }

        // Launch server
        server.listen(config.port || 4242);

        if (hooks.onAfterListen) {
            verbose("Nimble: onBeforeListen");
            hooks.onAfterListen(server, app, express);
        }

        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
          console.log('  > Nimble: Server Listening On:'.green, (add + ':' + config.port.toString()).green);
        });

    });
}