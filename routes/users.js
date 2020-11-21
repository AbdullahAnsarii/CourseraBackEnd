var express = require('express');
var router = express.Router();
let User = require('../models/user');
let bodyParser = require('body-parser');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null){
      let err = new Error("The user " + req.body.username + "already exists");
      res.statusCode = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user) => {
    res.statusCode = 200; // then 2 baar issliye qk 2 promises hain pehly find krna k username already exist to nh agr nahi to add krdo to 2 ops horhe
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration successfull', user:user});

  }, (err) => next(err))
  .catch((err) => next(err));
})

router.post('/login', (req, res, next) => {
  if(!req.session.user){
    let authHeader = req.headers.authorization;
    if(!authHeader){
      let err = new Error("You are not authenticated");
      res.setHeader("WWW-authenticate", "Basic");
      err.status = 401;
      next(err);
      return;
    }
    let auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    let username = auth[0];
    let password = auth[1];
    User.findOne({username: username})
    .then((user)=>{
      if(user === null){
        let err = new Error("The username " + username + "doesnot exists");
        err.statusCode = 403;
        return next(err);
      }
      else if(user.password !== password){
        let err = new Error("The password you entered is incorrect");
        err.statusCode = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('you are successfully authenticated');
      }
      })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else{
    let err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
})
module.exports = router;
