var Model = require('./model');
require('nimbleservice').colors;

module.exports = {
    GET : function (req, res) {
        Model.find(function (a,b) {
            res.send(b);
        });
    },
    
    findOne : function (req, res) {
         Model.find({_id: req.params.id},function (a,b) {
            res.send(b);
        });
    },

    POST : function (req, res) {
        new Model(req.body).save(function (err, doc) {
            if (err) {
                console.log('oops! Could not save the model'.red);
                res.json({auth : true, error : "Error saving the model"})
            } else {
                res.json({auth : true, results : doc });
            }

        });
    },

    // Using the Upsert method *Works
    PUT : function (req, res) {

        Model.findOne({_id: req.params.id}).remove(function () {
            req.body._id = req.params.id;
            new Model(req.body).save();
            res.send(req.body);
        });
    },

    // *works
    DELETE : function (req, res) {
        Model.findOne({_id: req.params.id}).remove(function () {
        });
        res.send(req.params.id)
    }
}