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

var {{model}} = new Schema({
});

{{model}}.virtual('id').get(function(){
    return this._id.toHexString();
});

{{model}}.set('toJSON', {
    virtuals: true
});

/* 
    If you don't want to use mongoose's default behavior for determining collection names
    you can specify the exact name of your collection by using this instead.
    switch to this ----> mongoose.model('{{model}}', {{model}}, '{{model}}');
    Otherwise mongoose will use follow REST and pluralize what it thinks a resource is.
    So If your model was "Customer" then it would create a resource (collection) "Customers". 
    By Specifying the 3rd paramater, you are telling mongoose that you would like to force a specific collection name.
*/

mongoose.model('{{model}}', {{model}});

module.exports = mongoose.model('{{model}}');