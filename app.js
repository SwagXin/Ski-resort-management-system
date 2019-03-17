var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var svgCaptcha=require('svg-captcha');
var session=require('express-session');
var bodyParser=require('body-parser');

var app = express();
var mongoose=require('./config/mongoose');
var db=mongoose();
// view engine setup
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler

//session持久化配置
app.use(session({
  secret: "ski",
  key: "ski",
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//超时时间
  saveUninitialized: true,
  resave: false,
}));

//验证码
app.get('/captcha',function (req,res) {
  var captcha = svgCaptcha.create({
    size:1,
    ignoreChars:'0oOlI',
    noise:5,
    color:true,
    background:'#c4c4c5'
  });
  //放在session中
  req.session.captcha = captcha.text;
  console.log( req.session.captcha);
  res.set('Content-Type', 'image/svg+xml');
  res.status(200).send(captcha.data);
});
require('./routes/admin')(app);
require('./routes/index')(app);
/*官网后台做操作是需要，登录验证*/
app.use(function(req,res,next){
  if (!req.session.user) {
    if(req.url=="/login"||req.url=="/register"){
      next();//如果请求的地址是登录则通过，进行下一个请求
    }
    else
    {
      res.redirect('/login');
    }
  } else if (req.session.user) {
    next();
  }
});



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers错误处理程序
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler生产错误处理程序
// no stacktraces leaked to user没有堆栈跟踪泄漏给用户
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
