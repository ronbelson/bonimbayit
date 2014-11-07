var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var app = express(); 
var mongoose = require('mongoose')
var User = mongoose.model('Users'); 
var Contractors = mongoose.model('Contractors'); 
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

 

require('../db/db_connect');
require('../models/init_schema');

router.get('/', function(req, res) { 
  if (req.isAuthenticated()) {res.redirect('/admin/home')}
  res.render('admin/index', { title: 'בונים בית - התחבר'});
}); 


router.get('/home',ensureAuthenticated, function(req, res) { 
  res.render('admin/home', { title: 'בונים בית - אדמין',user: req.user});
}); 
 
router.post('/contractors', function(req, res, next) {
  var contractor = new Contractors(req.body);

  contractor.save(function(err, contractor){
    if(err){ return next(err); }

    res.json(contractor);
  });
});

router.get('/contractors', function(req, res, next) {
  Contractors.find().sort({'date_created': -1}).exec(function(err, contractors){
    if(err){ return next(err); }
    res.json(contractors);
  });
}); 

router.param('contractor', function(req, res, next, id) {
  var query = Contractors.findById(id);

  query.exec(function (err, contractor){
    if (err) { return next(err); }
    if (!contractor) { return next(new Error("can't find contractor")); }

    req.contractor = contractor;
    return next();
  });
});

router.get('/contractors/:contractor', function(req, res) {
  res.json(req.contractor);
});

router.post('/contractors/update', function(req, res, next) {
  console.log('in 1')
  Contractors.findOneAndUpdate({ _id:req.body._id },{$set: req.body},{upsert: true},function(err,data){
    if(err){ 
    	console.log('in 2')
    	res.json(err);
    	return next(); }
    console.log('in 3')
    res.jsonp(data);
    console.log('in 4')
  });
});
// router.post('/contractors/:contractor', function(req, res, next) {
   
//   contractor = req.contractor ;
//   console.log(contractor)
//   contractor.update({'_id':contractor._id},{upsert: true},function(err,contractor){
//     if(err){ 
//     	    res.json(err);
//     		return next(); 
//     	    }
//     console.log(contractor)
//     res.json({success:'success'});
    
//   });
// });

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

module.exports = router;
