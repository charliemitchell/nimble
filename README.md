
# NIMBLE
##### Currently this project is under heavy development...
Expect there to be a bit of version-itus until v1.0.0

## Prerequisites
* [Node.js](http://nodejs.org/) (with NPM)
* [Redis](http://redis.io/)
* [Mongo DB](http://mongodb.org/)

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
            
        port : 4242,  // <--------- What port should this service handle
        
        redis : {
          host: 'localhost',
          port: 6379,
          key : 'sess:' // <-------- Change this to match your session key in redis
        },

        cookie : {
          name : 'yourcookie.sid',  // <---- Change this to match your cookie name
        },
        
        mongodb : {
            host : 'localhost',
            port : 27017,
            database : 'yourdatabase' // <!-- CHANGE THIS to match your database
        }

        // etc...
    }
```

### Now Open Up your Model File 
(This will be pre-generated, all you have to do is define your model)

```js
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
```

### Lastly Setup your Policy,
(this is also pre-generated)
```js
module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"}); <---- What do you do when they are not logged in
    },

    authenticated : function (req, res) {
        if (req.session) {
            if (req.session.loggedin) { <--- what key on the session say's they are logged in ?
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
* [nimbleservice](http://github.com/charliemitchell/nimble) 