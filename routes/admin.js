var express = require('express');
var app = express(); 
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
var _ = require('underscore');
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bonimbayit@gmail.com',
        pass: 'ynvfhfjtgnfklccq'
    }
});

var kue = require('kue')
  , jobs = kue.createQueue('admin');


require('../db/db_connect');
require('../models/init_schema');

router.get('/', function(req, res) { 
  if (req.isAuthenticated()) {res.redirect('/admin/home')}
  res.render('admin/index', { title: 'בונים בית - התחבר'});
}); 
      

router.get('/home',ensureAuthenticated, function(req, res) { 
  res.render('admin/home', { title: 'בונים בית - אדמין',user: req.user});
}); 

router.get('/contractor_count/:status',ensureAuthenticated, function(req, res) { 
  var status = req.param('status');
  if(status=='0') {
    Contractors.find(function(err, data) {
              res.json({count:data.length});
            });   
  } else {
    Contractors.find({status:status},function(err, data) {
              res.json({count:data.length});
            });   
  }
  
  
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
  var query = Contractors.findById(id).populate('forwards').sort({'date_created': -1});

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
  
   
   Contractors.findByIdAndUpdate( mongoose.Types.ObjectId(req.body.contractor_id), { $pull : { feedbacks : { _id : mongoose.Types.ObjectId(req.body._id) } } }, function(err){
    res.json({});
   } )

    
    
    
  
    

});


router.post('/contractors/update', function(req, res, next) {
  var timer = 1000*60*60*2  // 2 hours
  if (app.get('env') == 'development') {timer = 1000 }
  var _id = req.body._id;
  delete req.body._id;
   req.body.last_editor = req.user.name
   req.body.last_edit_time = Date.now();

  // var contractor_publish = false;
  // if(req.body.status == '2222' && (req.body.date_published===null || req.body.date_publishe==='null' || req.body.date_published===undefined || req.body.date_publishe==='undefined') ) 
  //           {req.body.date_published = Date.now();
  //             contractor_publish = true;
  //           }
  
  Contractors.findOneAndUpdate({ _id:_id },{$set: req.body},{upsert: true},function(err,contractor){
    if(err){ 
    	res.json({err: err});
    	return next(); }
    //run delta if is published
    var contractorAreas = _.map(contractor.areas, function(value, key) {
      return value.id;
    });
    var contractorTypes = _.map(contractor.contractor_types, function(value, key) {

      return value.id;
    });
     
    if(contractor.status=="2222"){
                  var contractor_publish = jobs.create('contractor_publish', {
                       contractor: _id
                      ,contractorTypes:contractorTypes
                      ,contractorAreas:contractorAreas 
                  }).delay(timer)
                    .priority('high')
                    .save()
                
                 jobs.promote()
                }; 

    res.json(contractor);
   
  });
});

jobs.process('contractor_publish', function(job, done){
   
  //console.log(job.data.contractorTypes,job.data.contractorAreas)
   Contractors.findById(job.data.contractor).exec(function(err, contractor){
    if(err){ return next(err); }
    User
      //.find({sendmail:{'$ne': false}, usersearchcontractors:{ $elemMatch: { type: {"$in" : job.data.contractorTypes} },$elemMatch: { area: {"$in" : job.data.contractorAreas} } } }
      //.find( { usersearchcontractors: { $all: [ { "$elemMatch" : {area: {"$in" :job.data.contractorAreas}} }, { "$elemMatch" : { type :{"$in":job.data.contractorTypes}  } } ] } } 
        .find( { usersearchcontractors: { $all: [ { "$elemMatch" : {area: {"$in" :job.data.contractorAreas}, type: {"$in":job.data.contractorTypes } } } ] } } 


        ,function(err, user) {
          if(err){ 
            console.log(err);
            return next(); 
          }
          //console.log(user)

          //return 1
             _.each(user, function(value, key) {
               if(contractor.forwards.indexOf(value._id) == -1){ // if the contractor not sent to this user
                  var email = jobs.create('email', {
                      email_data: {data:contractor, name:value.name} 
                    , template: 'contractor_publish'
                    , name:value.name
                    , to: value.email
                    , bcc:'bonimbayit@gmail.com'
                    , subject: 'עדכון: בקשר להמלצות על קבלן שביקשת' 
                     

                  }).delay(1000)
                    .priority('high')
                    .save()
                
                 jobs.promote(); 

                 // update user with this contractor
                 contractor.forwards.push(mongoose.Types.ObjectId(value._id));

               };//if(contractor.forwards.indexOf(value._id) == -1)
               
            });  // _.each(user, function(value, key) {
            contractor.save(); // TODO : check if need to save
        });
    //console.log(contractor)
  });
   
   
   console.log("contractor_publish:"+job.id)
   done();
});



// test authentication
function ensureAuthenticated(req, res, next) {
  //console.log(req.user.isadmin)
if (req.isAuthenticated() && req.user.isadmin) { return next(); }
res.redirect('/')
}

module.exports = router;
