
# NIMBLE
##### Currently this project is under heavy development. There are some major fixes coming soon.
More Docs Coming Soon.

## Prerequisites
* [Node.js](http://nodejs.org/) (with NPM)

## Installation

* `(sudo) npm install -g nimbleservice`

## Running / Development

*  to create a new nimble service 
 * Create a Folder Named foo: `nimble new foo`
 * Go Inside the folder: `cd foo`
 * Generate a Service that listens to the route bar: `nimble api bar`
 * Start The Server: `nimble s`
* Visit your app at [http://localhost:4242/bar](http://localhost:4242/bar).

## Some Built In Validations
Nimble comes packaged with some built in validations for your model. We use Google's Caja (the sanitize package) as the default sanitizer, furthermore we have built in some really nice features around the mongoose setter. So far we have provided some common transformations.
* sentence case
 * lor ipsom. dol amore. --> Lor ipsom. Dol amore. 
* lower case
 * Myemail@Mail.com --> myemail@mail.com
* upper case
 * acme inc --> ACME INC
* title case
 * acme inc --> Acme Inc
* number
 * '1234' --> 1234 
* sanitize

## Mimimal setup required...
### Open your config file...
```js
    module.exports = {
    
        verbose : false,

        reportGlobalVars : true,

        port : 4242,  // What port should this service handle

        bodyParser : 'json', // What Kind of API is this [https://www.npmjs.com/package/body-parser]
        
        // Used For Session
        redis : {
          host: 'localhost',
          port: 6379,
          key : 'sess:' // <---- Change this to match your session key in redis
        },
        cookie : {
          name : 'yourcookie.sid',  // <---- Change this to match your cookie name
        },
        // MongoDB
        mongodb : {
            host : 'localhost',
            port : 27017,
            database : 'yourdatabase' // <!-- CHANGE THIS to match your database
        },
        
        // CSRF
        csrf : {
            // Coming Soon
        }

    }
```

### Now Open Up your Model File 
(This will be pre-generated, all you have to do is define your model)

```js
    /*
        Desription of Model
        :: Boilerplate
        About Mongoose :: mongoosejs.com
    */
    var mongoose = require('nimbleservice').mongoose,
        Schema = mongoose.Schema,
        validator = require('nimbleservice').validate,
        setter = require('nimbleservice').setter;
    /* Edit Your Model Below */
    
    var Bar = new Schema({
        // <--- Define your model in here
        /* Example
            name : {
                type : String,
                setter : setter.titleCase
            },
            address : {
                type : String
            }
        */
    });
    
    // This is put in for your convinience (_id to id)
    Bar.virtual('id').get(function(){
        return this._id.toHexString();
    });
    
    Bar.set('toJSON', {
        virtuals: true
    });

    mongoose.model('Bar', Bar);
    module.exports = mongoose.model('Bar');
```

### Lastly Setup your Policy,
(this is also pre-generated)
```js
module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"});
    },

    authenticated : function (req, res) {
        if (req.session) {
            if (req.session.loggedin) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};
```


### AT this point your up and running and have A Fully functioning REST SERVICE




## GITHUB
* [nimbleservice](http://github.com/charliemitchell/mikros) 