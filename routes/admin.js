var express = require('express');
var httpProxy = require('http-proxy');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var mongoose = require('mongoose');

var app = express(); 
var mongoose = require('mongoose')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

 

require('../db/db_connect');
require('../models/init_schema');

router.get('/', function(req, res) { 
  //console.log('render the page')
  res.render('admin/index', { title: 'בונים בית - התחבר'});
}); 


router.get('/home',ensureAuthenticated, function(req, res) { 
  res.render('admin/home', { title: 'בונים בית - אדמין',user: req.user});
}); 

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

module.exports = router;
