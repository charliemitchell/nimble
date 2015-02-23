var middleware = require('nimbleservice').middleware.extend({
    // Will get called on every request, befor anything is handled
    onRequest : function (req, res, next) {
        console.log((req.method + ":").cyan, (req.url).cyan);
        next();
    },

    // this method will execute on EVERY response
    onAfterController : function (req, res) {
        
    },

    // This method will only execute after a GET Request
    onAfterGET : function (req, res) {
        
    },
    
    // This method will only execute after a POST Request
    onAfterPOST : function (req, res) {
        
    },

    // This method will only execute after a PUT Request
    onAfterPUT : function (req, res) {
        
    },

    // This method will only execute after a DELETE Request
    onAfterDELETE : function (req, res) {
        
    }
});

module.exports = middleware;