var express = require('express');
var httpProxy = require('http-proxy');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var mongoose = require('mongoose');

var app = express(); 
if (app.get('env') === 'development') { var config = require('../oauth-dev.js');} else {var config = require('../oauth-production.js');}
var mongoose = require('mongoose')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// config
passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

require('../db/db_connect');
require('../models/init_schema');

router.get('/', function(req, res) { 
  //console.log('render the page')
  res.render('admin/index', { title: 'בונים בית - התחבר'});
}); 


router.get('/home',ensureAuthenticated, function(req, res) { 
  //console.log('render the page')
  res.render('admin/home', { title: 'בונים בית - אדמין',user: req.user});
}); 

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

module.exports = router;
