var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var mongoose = require('mongoose')
var User = mongoose.model('Users'); 
var Contractors = mongoose.model('Contractors'); 
var ContractorsFeedbacks = mongoose.model('ContractorsFeedbacks'); 
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


router.post('/contractors/feedback', function(req, res, next) {
  var _id = req.body._id;
  var contractors_feedbacks = new ContractorsFeedbacks(JSON.parse(req.body.feedbacks));


  Contractors.findOne({_id: _id}, function (err, contractor) {
    if(err){ 
      res.json({err: err});
      return next(); }
    

    contractor.feedbacks.push(contractors_feedbacks);
    contractor.save(function(err, contractor){
    if(err){ 
      res.json({err: err});
      return next(err); }

    res.json(contractors_feedbacks);
    });
    
  });

});

router.post('/contractors/feedback/delete', function(req, res, next) {
  
   //console.log(req.body.contractor_id);
   Contractors.update({_id: req.body.contractor_id}, {$pull: {feedbacks: {_id: req.body._id}}})
   // Contractors.update({_id: req.body.contractor_id}, {$pull: {feedbacks: {_id: req.body._id}}}, function(err, data){
   //    if(err){ 
   //    res.json({err: err});
   //    return next(err); }
   //    //console.log(err, data);
   //    res.json(data);
   //  }); 
    res.json({});

});


router.post('/contractors/update', function(req, res, next) {
  var _id = req.body._id;
  delete req.body._id;
   req.body.last_editor = req.user.name
   req.body.last_edit_time = Date.now();
  Contractors.findOneAndUpdate({ _id:_id },{$set: req.body},{upsert: true},function(err,data){
    if(err){ 
    	res.json({err: err});
    	return next(); }

    res.jsonp(data);
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
