var express = require('express');
var app = express(); 
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var mongoose = require('mongoose')
var User = mongoose.model('Users'); 
var Contractors = mongoose.model('Contractors'); 
var Lost = mongoose.model('Lost'); 
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

var posts = [{}];
var kue = require('kue')
  , jobs = kue.createQueue('admin');

var __DEV_NOTICE = "";
if (app.get('env') == 'development') {__DEV_NOTICE = "[סביבת פיתוח]";}
require('../db/db_connect');
require('../models/init_schema');

router.get('/', function(req, res) { 
  if (req.isAuthenticated()) {res.redirect('/admin/home')}
  res.render('admin/index', { title: 'בונים בית - התחבר'});
}); 
      

router.get('/home',ensureAuthenticated, function(req, res) { 
  res.render('admin/home', { title: 'בונים בית - אדמין',user: req.user});
}); 

router.get('/lost/', function(req, res) { 
  Lost.find({}, function(err, lost) {
     res.jsonp(lost);

  })
 
});

router.get('/count/searches',ensureAuthenticated, function(req, res) { 
  User.aggregate( {$match: {'usersearchcontractors.0': {$exists: true}}}, {$unwind: '$usersearchcontractors'}, {$group: {_id: null, count: {$sum: 1}}} )
   .exec(function(err, data){
    if(err){  res.json({err:err}); }
    res.json(data);
  });

    
}); 
 
///admin/statistics/1  the date diff for going days back (1 day back in this example, 0 for today)
router.get('/statistics/:daydiff',ensureAuthenticated, function(req, res) { 
  var Day= new Date().getDate() - req.param("daydiff")
  if(Day.toString().length==1) {Day='0'+Day;}
   
  var date = new Date(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+Day+'T00:00:00.000Z')
  var max_date = new Date(new Date(date).getTime() + 60 * 60 * 24 * 1000);
  //console.log(date,max_date);
  User.find( {"isadmin":false,  "usersearchcontractors.createdate": {"$gt": date,"$lt": max_date }},{"usersearchcontractors.time2work":1,"usersearchcontractors.createdate":1,"usersearchcontractors.area":1,"usersearchcontractors.type":1,"name":1,"email":1})
  //,{"usersearchcontractors.createdate":1,"usersearchcontractors.area":1,"usersearchcontractors.type":1,"name":1,"email":1}
   .where('usersearchcontractors.createdate').gt(date)

   .exec(function(err, data){
    if(err){  res.json({err:err})}
      else {res.json(data);};  
    
  });

   
}); 

router.get('/statistics_mail/:daydiff',ensureAuthenticated, function(req, res) { 
  var Day= new Date().getDate() - req.param("daydiff")
  if(Day.toString().length==1) {Day='0'+Day;}
   
  var date = new Date(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+Day+'T00:00:00.000Z')
  
  User.find( { userforwards: {$exists: true, $not: {$size: 0}}, "isadmin":false,  "usersearchcontractors.createdate": {"$lt": date }},{"name":1,"email":1,"userforwards":1})
  
   .where('usersearchcontractors.createdate').lt(date)

   .exec(function(err, data){
    if(err){  res.json({err:err})}
      
      else {
        var emails =[]
        for(var i = 0; i < data.length; i++) {
          emails.push(data[i].email);
        }
        res.send(emails);
      };  
    
  });

   
}); 



router.get('/userfind/:emailorphone',ensureAuthenticated, function(req, res) { 
  User.find( {$or:[{email:req.param('emailorphone')},{phone:req.param('emailorphone')},{name:req.param('emailorphone')}]})
    .populate({
          path: 'userforwards',
          select: 'name _id phone contractor_types feedbacks'
         
        })
    

    .exec(function(err, user) {
              if(err){  res.json({err:err}); }
              

              res.json(user[0]);

               });   
           

   
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
  var query = Contractors.findById(id).populate('forwards').sort('forwards:{createdate: 1}'); //TODO  fix sort. notwork

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

router.get('/test', function(req, res, next) {
  res.json({ok:ok})
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
    if(err){ return done(); }
    //console.log(contractor.status,contractor.contractor_types,contractor.areas)
    if(contractor.status!='2222') {console.log(job.id+' canceld');return done({result:'status is not valid'});}
    

    // Delete all lost searches in the db thab this contractor handle them
    Lost.remove( { area: {"$in" :job.data.contractorAreas}, type: {"$in":job.data.contractorTypes } } 
      ,function(err) {
          if(err){ 
            console.log(err);
            return done(); 
          }

          //done
    });

    User
      //.find({sendmail:{'$ne': false}, usersearchcontractors:{ $elemMatch: { type: {"$in" : job.data.contractorTypes} },$elemMatch: { area: {"$in" : job.data.contractorAreas} } } }
      //.find( { usersearchcontractors: { $all: [ { "$elemMatch" : {area: {"$in" :job.data.contractorAreas}} }, { "$elemMatch" : { type :{"$in":job.data.contractorTypes}  } } ] } } 
        .find( { usersearchcontractors: { $all: [ { "$elemMatch" : {area: {"$in" :job.data.contractorAreas}, type: {"$in":job.data.contractorTypes } } } ] } } 

          
        ,function(err, user) {
          if(err){ 
            console.log(err);
            return next(); 
          }
           

          //return 1
            
             _.each(user, function(value, key) {

               if(contractor.forwards.indexOf(value._id) == -1){ // if the contractor not sent to this user
                 
                  var email = jobs.create('email', {
                      email_data: {data:contractor, name:value.name,_id:value._id} 
                    , template: 'contractor_publish'
                    , name:value.name
                    , to: value.email
                    , bcc:'bonimbayit@gmail.com'
                    , subject: __DEV_NOTICE+'עדכון: בקשר להמלצות על קבלן שביקשת' 
                     

                  }).delay(1000)
                    .priority('high')
                    .save()
                
                 jobs.promote(); 

                 // update  contractor with this user
                 contractor.forwards.push(mongoose.Types.ObjectId(value._id));
                // var update_user = new User(value);
                // update_user.userforwards.push(mongoose.Types.ObjectId(contractor._id))
                 //console.log(contractor._id)
                // User.findOneAndUpdate( {email:value.email} ,{$push: {userforwards:  mongoose.Types.ObjectId(contractor._id) } });
                 User.findOne({ email: value.email, sendmail:{ $ne: false } }, function(err, userpush) {
                    if(err) { 
                        console.log(err);
                        var err = new Error(err);
                        throw err;
                         }
                     
                     
                    if (!err && userpush != null) {
                      
                     console.log(contractor._id)
                     userpush.userforwards.push(mongoose.Types.ObjectId(contractor._id));
                     userpush.save(function(err) {
                        if(err) {
                          console.log(err);
                          var err = new Error(err);
                          throw err;
                        } else {
                          console.log("saving user userforwards ...");
                          
                        };
                      });  
                    }
                  });  

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
if (app.get('env') == 'development') return next();
if (req.isAuthenticated() && req.user.isadmin) { return next(); }
res.redirect('/')
}

module.exports = router;
