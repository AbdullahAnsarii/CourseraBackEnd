let mongoose = require('mongoose');
let schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
//username password already provided by passportlocalmongoose
let user = new schema({
    admin: {
        type: Boolean,
        default: false
    }
})
user.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', user);