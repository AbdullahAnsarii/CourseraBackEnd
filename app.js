var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session); //will store sessions in this project

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var Dishes = require('./models/dishes');
var app = express();

let url = 'mongodb://localhost:27017/conFusion';
let connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected correctly to server');
}, (err)=>{console.log(err);})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//ye random no. hai jo signed cookie k liye use hota hai
//app.use(cookieParser('12345-67890-09876-54321'));
//session bnaya hai
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}))

function auth(req, res, next){
  //chk if username and password is present in cookie
  console.log(req.session);
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
    let user = auth[0];
    let pass = auth[1];
    if(user == "admin" && pass == "password"){
      //agr saahi credentials hon to cookie create krke agy bhjddo
      //res.cookie('user','admin',{signed: true});
      req.session.user = 'admin'; // initialize session
      next();
    }else{
      let err = new Error("You are not authenticated");
      res.setHeader("WWW-authenticate", "Basic");
      err.status = 401;
      next(err);
    }
    }
  else{
    //mtlb agr cookie hai
    if (req.session.user === 'admin'){
      next();
    }
    else{
      let err = new Error("You are not authenticated");
      res.setHeader("WWW-authenticate", "Basic");
      err.status = 401;
      next(err);
    }
  }
  
}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
