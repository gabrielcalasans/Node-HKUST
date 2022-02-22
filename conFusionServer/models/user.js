var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema ({
    admin: {
        type: Boolean,       
        default: false
    }    
});

User.plugin(passportLocalMongoose); // adiciona automaticamente suporte ao usuario e senha

module.exports = mongoose.model('User', User);