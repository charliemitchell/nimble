#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    child = require('child_process');

require('colors')
var argv = require('optimist').argv;
var config = {};

// Get the nimble version
var version = JSON.parse(fs.readFileSync(path.join((__dirname).replace('bin', ""), '/package.json'))).version;

if (argv.v || argv.verbose || (argv._[0] && _.contains(['v', 'verbose'], argv._[0]))) {
    config.verbose = true;
}


if (argv.v || argv.version || (argv._[0] && _.contains(['v', 'version'], argv._[0]))) {
    console.log('v' + version);
} else if (argv._.length === 0) {
    console.log('');
    console.log('Welcome to Nimble! (v' + version + ')');
    console.log('');
} else if (argv.s || argv.server || (argv._[0] && _.contains(['s', 'server'], argv._[0]))) {
    require(process.cwd() + '/node_modules/nimbleservice/service')(config);
} else if (argv.a || argv.api || (argv._[0] && _.contains(['a', 'api'], argv._[0]))) {
    // Important We don't want to lose any work by accidently typing the wrong command
    if (fs.existsSync(path.join(process.cwd(), '/model.js'))) {
        console.log("It looks like you already created a service. Nimble will refuse to overwrite an existing service. Coming Soon: 'nimbleapi' this framework will support multiple APIs.".red);
        return;
    }
    
    if (argv._[1]) {
        console.log("Generate API For", argv._[1]);
        ncp(path.resolve((__dirname).replace('bin', ""), 'blueprint'), process.cwd(), function(err) {
            fs.writeFileSync('./model.js', fs.readFileSync('./model.js', 'utf-8').replace(/{{model}}/g, argv._[1]));
            fs.writeFileSync('./router.js', fs.readFileSync('./router.js', 'utf-8').replace(/{{api}}/g, argv._[1]));
            var nimble = (__dirname).replace('bin', ""),
                node_modules = process.cwd() + '/node_modules/nimbleservice';

            fs.mkdirSync(process.cwd() + '/node_modules');
            fs.mkdirSync(process.cwd() + '/node_modules/nimbleservice');

            if (argv._[2] && _.contains(['r', 'rabbit'], argv._[2])) {
                var package = fs.readFileSync('./package.json', 'utf-8'),
                    pack = ',\n    "wascally" : "^0.2.3"';
                fs.writeFileSync('./package.json', package.replace('"nimbleservice" : "latest"', '"nimbleservice":"latest"' + pack));
            }

            console.log("Installing Packages...".yellow);

            var npm = child.spawn('npm', ['install'], {
                cwd : process.cwd()
            });
            npm.stdout.setEncoding('utf8');
            npm.stdout.on('data', function(stdout) {
                console.log(('NPM >  ' +stdout).yellow);
            });

            npm.on('close', function (code) {
                
                if (code === 0) {
                    console.log("All Done! ".green);
                } else {
                    console.log("ERROR: NPM could not install required packages, You will have to do it manually".red)
                }
            });

            // ncp(nimble, node_modules, function(err) {
            //     console.log(err ? err : "Succes");
            // });
        });
        console.log(path.resolve(__dirname, 'blueprint'), process.cwd())
    } else {
        console.log("You need to choose a name for the api you wish to generate");
    }
} else if (argv.new || argv.n || (argv._[0] && _.contains(['n', 'new'], argv._[0]))) {
    if (argv._[1]) {
        var folder = path.join(process.cwd(), argv._[1]);
        fs.mkdirSync(folder);
        console.log('Creating service.. cd into ' +argv._[1] +  ' and run "nimble api yourapi"');
    }
}