let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('./models/user');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
