let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('./models/user');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); //use to verify sign and create tokens
let config = require('./config');
const user = require('./models/user');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretkey, {expiresIn: 3600}); //signing token
}

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//extracting token from header
opts.secretOrKey = config.secretkey;
//authenticating user
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT Payload: " + jwt_payload);
        user.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err){
                return done(err, false);//if error
            }
            else if (user){
                return done(null, true);//if user found
            }
            else{
                return done(null, false);//if user is not found
            }
        })
    }))
   
exports.verifyUser = passport.authenticate('jwt', {session: false});