var methodOverride = require('method-override')
var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routes/index');
var admin  = require('./routes/admin');
if (app.get('env') === 'development') { var config = require('./oauth-dev.js');} else {var config = require('./oauth-production.js');}
var passport = require('passport')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'ikush' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/admin', admin);

app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){ });

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/admin' }),
    function(req, res) {
          res.redirect('/admin/home');
    });

app.get('/logout', function(req, res){ req.logout(); res.redirect('/'); });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    
    res.render('404', {  title: 'בונים בית - הורדת קובץ עלויות בניה ' , posts: { posts: [] } });
    
    //next(err);
});

 

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        console.log('error:' +err);
        res.render('error', {
            message: err.message,

            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
