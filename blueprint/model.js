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

mongoose.model('{{model}}', {{model}});
module.exports = mongoose.model('{{model}}');