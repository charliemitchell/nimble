var Model = require('./model');

require('nimbleservice').colors;

function onError (res, err) {
    res.status(500).json({
        error : err
    });
}

module.exports = {

    GET : function (req, res) {
        Model.find(function (err, doc) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json(doc);
            }    
        });
    },
    
    findOne : function (req, res) {
         Model.findOne({
            _id: req.params.id
        }).exec(function (err, doc) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json(doc);
            }    
        });
    },

    POST : function (req, res) {
        new Model(req.body).save(function (err, doc) {
            if (err) {
                onError(res, err);
            } else {
                // You should set a location header when POSTing
                res.location('http://www.{{mywebapp.com}}/api/{{model}}/' + doc._id).json(doc);
            }
        });
    },

    PUT : function (req, res) {

        Model.findOne({_id: req.params.id}).remove(function (err) {
            if (err) {
                onError(res, err);
            } else {
                req.body._id = req.params.id;
                new Model(req.body).save(function (err, doc) {
                    if (err) {
                        onError(res, err);
                    } else {
                        res.status(200).json(doc);
                    }
                });
            }
        });
    },

    DELETE : function (req, res) {
        Model.findOne({_id: req.params.id}).remove(function (err) {
            if (err) {
               onError(res, err);
            } else {
                res.status(200).send(req.params.id);
            }
        });
    }
}