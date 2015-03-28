#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    child = require('child_process'),
    argv = require('optimist').argv,
    config = {};

require('colors')

// Get the nimble version
var version = JSON.parse(fs.readFileSync(path.join((__dirname).replace('bin', ""), '/package.json'))).version;

// IF Running `nimble -v`
if (argv.v || argv.version || (argv._[0] && _.contains(['v', 'version'], argv._[0]))) {
    console.log('v' + version);
}

// If Running Nimble with out any args
else if (argv._.length === 0) {
    console.log('');
    console.log('Welcome to Nimble! (v' + version + ')');
    console.log('');
}

// If starting the server
else if (argv.s || argv.server || argv.up || argv.u || (argv._[0] && _.contains(['s', 'server', 'up', 'u'], argv._[0]))) {
    require(process.cwd() + '/node_modules/nimbleservice/service')(config);
}

// If Creating an API
else if (argv.a || argv.api || (argv._[0] && _.contains(['a', 'api'], argv._[0]))) {
    // Important We don't want to lose any work by accidently typing the wrong command
    if (fs.existsSync(path.join(process.cwd(), '/package.json'))) {
        console.log("It looks like you already created a service. Nimble will refuse to overwrite an existing service. Coming Soon: 'nimbleapi' this framework will support multiple APIs.".red);
        return;
    }

    if (argv._[1]) {
        console.log("Generating API For", argv._[1]);

        var blueprint = "blueprint";

        ncp(path.resolve((__dirname).replace('bin', ""), 'blueprint'), process.cwd(), function(err) {
            console.log(process.cwd());

            fs.writeFileSync('./src/model.js', fs.readFileSync('./src/model.js', 'utf-8').replace(/{{model}}/g, argv._[1]));
            fs.writeFileSync('./src/router.js', fs.readFileSync('./src/router.js', 'utf-8').replace(/{{api}}/g, argv._[1]));
            var nimble = (__dirname).replace('bin', ""),
                node_modules = process.cwd() + '/src/node_modules/nimbleservice';

            fs.mkdirSync(process.cwd() + '/src/node_modules');
            fs.mkdirSync(process.cwd() + '/src/node_modules/nimbleservice');

            var package = fs.readFileSync('./src/package.json', 'utf-8');

            // If rabbit MQ is Specified, add it's dependencies :: otherwise : remove it
            if (argv._[2] && _.contains(['r', 'rabbit'], argv._[2])) {
                var pack = ',\n    "wascally" : "^0.2.3"';
                package = package.replace('"nimbleservice" : "0.3.1"', '"nimbleservice" : "0.3.1"' + pack)
                fs.writeFileSync('./src/package.json', package);
            } else {
                fs.unlinkSync('./src/rabbit.js');
            }

            // Try to write the author in
            if (process.env.USER) {
                package = package.replace('"author": ""', '"author": "' + process.env.USER + '"');
                fs.writeFileSync('./src/package.json', package);
            }

            console.log("Setting up a Vagrantfile...");
            fs.writeFileSync('./Vagrantfile', fs.readFileSync('./Vagrantfile', 'utf-8').replace("{{synced-folder}}", process.cwd()));


            console.log("Installing Packages...".yellow);

            // Install any Dependencies
            var npm = child.spawn('npm', ['install'], {
                cwd: process.cwd() + '/src'
            });

            npm.stdout.setEncoding('utf8');
            npm.stdout.on('data', function(stdout) {
                console.log(('NPM >  ' + stdout).yellow);
            });

            npm.on('close', function(code) {

                if (code === 0) {
                    console.log("All Done! ".green);
                } else {
                    console.log("ERROR: NPM could not install required packages, You will have to do it manually".red)
                }
            });

        });
        console.log(path.resolve(__dirname, 'blueprint'), process.cwd())
    } else {
        console.log("You need to choose a name for the api you wish to generate");
    }
}

// If Creating a new directory
else if (argv.new || argv.n || (argv._[0] && _.contains(['n', 'new'], argv._[0]))) {
    if (argv._[1]) {
        var folder = path.join(process.cwd(), argv._[1]);
        fs.mkdirSync(folder);
        fs.writeFileSync(path.join(folder, 'nimbleservice.txt'), "This Service initialized by " + process.env.USER || "nimbleservice");
        console.log('Creating service.. cd into ' + argv._[1] + ' and run "nimble api yourapi"');
    }
}

// If Running The Set Command
else if (argv.set || (argv._[0] && _.contains(['set'], argv._[0]))) {
    if (argv.port || (argv._[1] && _.contains(['port'], argv._[1]))) {
        var config,
            Dockerfile;

        try {
            config = fs.readFileSync('./config.js', 'utf8');

            if (config.match(/(port).*(\/\*ns-port\*\/)/)) {
                config = config.replace(/(port).*(\/\*ns-port\*\/)/, 'port : ' + argv._[2] + ', /*ns-port*/');
                fs.writeFileSync('./config.js', config);
            } else {
                console.log("Error: Can not set port in config.js because either it is not in the config.js file or it is missing the /*ns-port*/ comment".red);
                console.log("Example: \n port : 4242, /*ns-port*/");
                console.log("Eventually you will not need the comment, but for now, it is needed");
            }

        } catch (err) {
            console.log("Are you sure you are in a nimble project?\nBe sure you cd into the src director before running this command".red);
            process.exit(0);
        }

        try {
            Dockerfile = fs.readFileSync('../Dockerfile', 'utf8');
            if (Dockerfile.match(/(EXPOSE).*(#ns-port)/)) {
                Dockerfile = Dockerfile.replace(/(EXPOSE).*(#ns-port)/, 'EXPOSE ' + argv._[2] + ' #ns-port');
                fs.writeFileSync('../Dockerfile', Dockerfile);
            } else {
                console.log("Error: Can not set port in the Dockerfile because either it was never exposed or it is missing the #ns-port comment".red);
                console.log("Example: \n EXP 4242 #ns-port");
                console.log("Eventually you will not need the comment, but for now, it is needed");
            }

        } catch (err) {
            console.log("Only Updating config.js because a Dockerfile was not detected");
        }
    }
}

// If running the stub command
else if (argv.stub || (argv._[0] && _.contains(['stub'], argv._[0]))) {
    (function() {
        var pathToStub = argv._[1],
            model = argv.model,
            package,
            npm = child.spawn('npm', ['install'], {
                cwd: process.cwd() + '/src'
            });

        if (fs.existsSync(path.join(process.cwd(), '/package.json'))) {
            console.log("It looks like you already created a service. Nimble will refuse to overwrite an existing service. Coming Soon: 'nimbleapi' this framework will support multiple APIs.".red);
            return;
        }

        if (!model) {
            console.log('Error: You need to specify the model, --model users'.red);
            console.log('Try Again'.red);
            return;
        }

        if (!pathToStub) {
            console.log('Error: You need to specify the path to the stub, nimble stub /path/to/stub --model users'.red);
            console.log('Try Again'.red);
            return;
        }

        if (fs.existsSync(pathToStub)) {

            ncp(pathToStub, process.cwd(), function(err) {

                fs.writeFileSync('./src/model.js', fs.readFileSync('./src/model.js', 'utf-8').replace(/{{model}}/g, model));
                fs.writeFileSync('./src/router.js', fs.readFileSync('./src/router.js', 'utf-8').replace(/{{api}}/g, model));
                package = fs.readFileSync('./src/package.json', 'utf-8');

                if (!package) {
                    console.log("Error: You must have a package.json file in your stub\nTry Again".red);
                    return;
                }

                // Try to write the author in
                if (process.env.USER) {
                    package = package.replace('"author": ""', '"author": "' + process.env.USER + '"');
                    fs.writeFileSync('./src/package.json', package);
                }

                if (fs.existsSync('./Vagrantfile')) {
                    console.log("Setting up a Vagrantfile...");
                    fs.writeFileSync('./Vagrantfile', fs.readFileSync('./Vagrantfile', 'utf-8').replace("{{synced-folder}}", process.cwd()));
                }


                console.log("Installing Packages...".yellow);

                // Install any Dependencies
                npm.stdout.setEncoding('utf8');
                npm.stdout.on('data', function(stdout) {
                    console.log(('NPM >  ' + stdout).yellow);
                });

                npm.on('close', function(code) {

                    if (code === 0) {
                        console.log("All Done! ".green);
                    } else {
                        console.log("ERROR: NPM could not install required packages, You will have to do it manually".red)
                    }
                });

            });

        } else {

            console.log('The Path ' + pathToStub + ' Does Not Exist'.red);
            if (pathToStub.charAt(0) === '/') {
                console.log("Absolute Path: ", pathToStub);
            } else {
                console.log("Absolute Path: ", path.join(process.cwd(), pathToStub));
            }
        }

    }());
}