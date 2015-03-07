var express = require('express');
var app = express(); 
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var mongoose = require('mongoose')
var User = mongoose.model('Users'); 
var Contractors = mongoose.model('Contractors'); 
var _ = require('underscore');
var nodemailer = require('nodemailer');
var cache = require('memory-cache');
var blog_url = 'http://127.0.0.1:2368';
var builder = require('xmlbuilder');
var dateFormat = require('dateformat');
var moment = require('moment');
var BLOG_URL = 'http://127.0.0.1:2368';
if (app.get('env') === 'production') {BLOG_URL='http://178.62.196.54/blog'  }

var random = require("random-js")(); // uses the nativeMath engine
var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bonimbayit@gmail.com',
        pass: 'ynvfhfjtgnfklccq'
    }
});   

var kue = require('kue')
  , jobs = kue.createQueue('me');

var __DEV_NOTICE = "";
if (app.get('env') == 'development') {__DEV_NOTICE = "[סביבת פיתוח]";}
require('../db/db_connect');
require('../models/init_schema');
var ContractorsClicks = mongoose.model('ContractorsClicks'); 



router.get('/',ensureAuthenticated, function(req, res) { 

  //console.log(new Date().getDay());
  if(!req.user.parent_area)
   {return res.redirect('/me/update');}
  else
   {res.render('me/home', { title: 'בונים בית - ' + req.user.name ,user: req.user});}
}); 


router.post('/contractor/request/', function(req, res, next) {
    //result = 1 : user dont have cellphone on db
    //result = 2 : done
    //result = 1 : error
    //console.log(req.user.phone);
     
    if(req.body.user_phone) {
      //console.log(req.body.user_phone);
      User.findOneAndUpdate(
          {email: req.user.email },
          {phone: req.body.user_phone},
          {upsert: true},
          function(err,user){
             if(err){console.log(err); return res.json({result:3});} else
             {
              req.user.phone = req.body.user_phone;
              req.logIn(user, function(err) {
                    if (err) { return res.json({result:3}); }
                    else {
                       
                      // sent email to client
                      SendMailAndSMS(req);

                      return res.json({result:2}); 
                    }
                 });
             }
           
          });
    } 
    else {
      if(!req.user.phone ) {
      //console.log('req.user.phone='+req.user.phone);
      return res.json({result:1}); 
     } else {
      // call job
      
      SendMailAndSMS(req);
      return res.json({result:2}); 
     }
    }
    

    
     

    //res.json({result:2}); 

});

router.get('/friends/:number_of_freinds_to_return',ensureAuthenticated, function(req, res) { 

  var parent_area = req.user.parent_area;
  User.find({parent_area:parent_area},{name:1,fbId:1,photo:1,email:1,step:1,area:1}).sort('_id').limit(req.param('number_of_freinds_to_return')).exec(function(err,users){
      if(err){console.log(err); return res.json({result:false});} else
      {
          User.count({parent_area:parent_area}, function( err, count){
              res.jsonp({users:users,count:count,parent_area:parent_area})
          })
           
      }

   }

  );

  //console.log(new Date().getDay());
 
}); 

router.get('/update',ensureAuthenticated, function(req, res) { 

  //console.log(new Date().getDay());
  res.render('me/update', { title: 'בונים בית - ' + req.user.name ,user: req.user});
}); 


router.get('/articles/:tag',ensureAuthenticated, function(req, res) { 
  
  request('http://178.62.196.54/blog/tag/'+req.param('tag')+'/json/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
       res.json(JSON.parse(body));
    } else {res.json({error:error})}
  })
         
}); 


router.post('/update',ensureAuthenticated, function(req, res, done) {
    
    is_user_phone = req.user.phone ? true : false;

    //get the parent_area from json file
    var area_types = require('../public/json/areas_types.json');
    var parent_area = _.where(area_types, {label: req.body.area});
   
    User.findOneAndUpdate(
                {email: req.user.email },
                {phone: req.body.phone, step:req.body.step, area: req.body.area, parent_area: parent_area[0].parent_area},
                {upsert: true},
                function(err,user){
                   if(err){console.log(err); return res.json({ok:false});} else
                   {
                    req.logIn(user, function(err) {
                                                      if (err) { return next(err); }
                                                     

                                                      if(!is_user_phone && req.user.phone.length>0) { // The first time the user updatephone lets send mail to us to add hom to wahtsapp

                                                        var to = 'bonimbayit@gmail.com';
                                                        if (app.get('env') == 'development') {to = 'ronbelson@gmail.com';}
                                                        //console.log(user);
                                                         jobs.create('email', {
                                                            email_data: {user_name:user.name,area:user.area,user_phone:user.phone} 
                                                          , template: 'add_me_to_whatsapp'
                                                          , name:req.user.name
                                                          , to: to
                                                          , subject: __DEV_NOTICE+'עוד בונה רוצה שתוסיף אותו לקבוצת הווטסאפ: ' + req.user.name 
                                                           

                                                        }).delay(50)
                                                          .priority('high')
                                                          .save()
                                                      
                                                       jobs.promote(); 


                                                      }


                                                      return res.json({ok:true});
                                                  });
                                                             }
                 
                });
    
    
});


router.get('/userclicks',ensureAuthenticated, function(req, res, done) {
    //console.log(req.user);
    User.find(
          {email: req.user.email },
          function(err,user){
             if(err){console.log(err); return res.json({error:err});} else
             {
               
               return res.json({userclicks: user[0].userclicks});
             }
           
          });

    
    
});

// router.post('/contractor_request',ensureAuthenticated, function(req, res, done) {
//     //console.log(req.user);
//     return res.json({ok:true});
    
// });


router.get('/contractors', ensureAuthenticated, function(req, res, next) {
  //Contractors.find({ contractor_types:{ $elemMatch: { id:  'שלד' } } ,status:'2222' , areas: { $elemMatch: { id:  req.user.area} } }, {'name':1, '_id':1,'company_name':1,'phone_display':1,'email':1,'contractor_types':1,'areas':1,'feedbacks':1},function(err, data) {

  Contractors.find( { $or: [{status:'2222'},{status:'8888'}] , areas: { $elemMatch: { id:  req.user.area} } }, {'name':1, '_id':1,'company_name':1,'phone_display':1,'email':1,'contractor_types.id':1,'areas.id':1,'feedbacks':1,'status':1},{sort:{ status: 1, display_priority:-1 }},function(err, data) {
    if(err){ return next(err); }
    //console.log(data);
    res.json(data);
  });
}); 


router.get('/test', function(req, res, next) {
  res.json({ok:ok})
});


function SendMailAndSMS(req) {


  var contractor_phone = req.body.contractor_phone_display ? req.body.contractor_phone_display: req.body.contractor_phone;
  if(!req.body.contractor_userclick)
   {

    //console.log("here");
    jobs.create('userclicks', {
      contractor_id  : req.body.contractor_id,
      user_email : req.user.email

    }).delay(50)
      .priority('high')
      .save()
      jobs.promote(); 
    

    //push click to contractor
    jobs.create('ContractorClick', { contractor_id:req.body.contractor_id,user_id:req.user._id
      }).delay(50)
        .priority('high')
        .save()  
        jobs.promote(); 
    
        

    //send sms to contractor
    jobs.create('SendSMS', {is_contractor:true,phone:contractor_phone,message:'הי ' + req.body.contractor_name + ' קיבלתי עליך המלצות באתר בונים בית מכמה בונים, אם תוכל לחזור אלי להצעת מחיר לטלפון  ' + req.user.phone + ' תודה, ' +  req.user.name
      }).delay(50)
        .priority('high')
        .save()  
        jobs.promote(); 
    } //end if
                  


  //send sms to user
  jobs.create('SendSMS', {is_contractor:false,phone:req.user.phone,message: 'בבקשה, מספר הטלפון של ' + req.body.contractor_name + ' (' + req.body.contractor_types + '): ' + contractor_phone  + ' , בהצלחה ואני פה לכל בעיה ועזרה, תומר חן - אתר בונים בית http://bonimbayit.co.il' 
    }).delay(50)
      .priority('high')
      .save()  
      jobs.promote(); 

  
  
  //SendSMS({is_contractor:false,phone:req.user.phone,message: 'בבקשה, מספר הטלפון של ' + req.body.contractor_name + ' (' + req.body.contractor_types + '): ' + contractor_phone  + ' , בהצלחה ואני פה לכל בעיה ועזרה, תומר חן - אתר בונים בית http://bonimbayit.co.il' });
  //SendSMS({is_contractor:true,phone:contractor_phone,message:'פנה אלי ' + req.user.name + ' וביקש הצעת מחיר ממך, אם תוכל להתקשר חזרה לבונה לטלפון ' + req.user.phone + ', תודה, תומר חן - אתר בונים בית http://bonimbayit.co.il' });
  
  //return;
  var bcc = '';
  if (app.get('env') != 'development') {bcc = 'bonimbayit@gmail.com';}
  var email_to_builder = jobs.create('email', {
                  email_data: {contractor_id:req.body.contractor_id,contractor_name:req.body.contractor_name,contractor_phone_display:req.body.contractor_phone_display, contractor_email:req.body.contractor_email,contractor_types:req.body.contractor_types,user:req.user} 
                , template: 'contractor_request_to_builder'
                , name:req.user.name
                , to: req.user.email
                , bcc:bcc
                , subject: __DEV_NOTICE+'הנה הטלפון של ' + req.body.contractor_name +  ' שביקשת [תומר חן מאתר מבונים בית]'
                 

              }).delay(1000)
                .priority('high')
                .save()
            
             jobs.promote(); 
             //console.log({contractor_id:req.body.contractor_id,contractor_name:req.body.contractor_name,contractor_phone_display:req.body.contractor_phone_display, contractor_email:req.body.contractor_email,user:req.user});


  if(req.body.contractor_email){
    var to = req.body.contractor_email

    if (app.get('env') == 'development') {to = 'ronbelson@gmail.com';}
    var email_to_contractor = jobs.create('email', {
                  email_data: {contractor_id:req.body.contractor_id,contractor_name:req.body.contractor_name,contractor_phone_display:req.body.contractor_phone_display, contractor_email:req.body.contractor_email,user:req.user} 
                , template: 'contractor_requestt_to_contractor'
                , name:req.user.name
                , to: to
                , bcc:bcc
                , subject: __DEV_NOTICE+'לקוח מאתר בונים בית ביקש שתחזור אליו לגבי עבודה'
                 

              }).delay(1000)
                .priority('high')
                .save()
            
             jobs.promote(); 

  }

  

   

  
  //console.log(xml);


 
 //console.log(req.body);
 //console.log(req.user);


}


jobs.process('ContractorClick', function(details, done){
  //console.log(details.data);
  var contractors_clicks = new ContractorsClicks({ user: mongoose.Types.ObjectId(details.data.user_id) });


    Contractors.findOne({_id: details.data.contractor_id}, function (err, contractor) {
      if(err){ 
        console.log({err: err});
         }
      

      contractor.clicks.push(contractors_clicks);
      contractor.save(function(err, contractor){
      if(err){ 
        console.log({err: err});
         }

        if (app.get('env') == 'development') console.log('push click to contractor:' + details.data.contractor_id);
      });
      
    });

 done();
});

jobs.process('SendSMS', function(details, done){
//function SendSMS(details) {
    // Format of hour for sms -> 23/02/2015 21:32
    var time2send =  dateFormat(new Date(), "dd/mm/yyyy H:MM");
    
    if(details.data.is_contractor) {
      
      var day = new Date().getDay();
      var hour = moment().hour();
      //console.log(hour);
      time2send  = moment(new Date());  // Just Moment object , need to add .toDate() 
      var isWeekend = (day == 6) || (day == 5);    // 6 = Saturday, 5 = friday
      //var time2send =  dateFormat(new Date(), "dd/mm/yyyy h:MM");
      
      time2send = (hour>17) ? time2send.add((24-hour)+random.integer(8, 13),"hours") : time2send;
      time2send = (hour<8) ? time2send.add((8-hour)+random.integer(1, 4),"hours") : time2send;

      if(isWeekend) {
         time2send = (day == 5) ? time2send.add(2,"days") : time2send.add(1,"days");  // 6 = Saturday, 5 = friday
        }
      
      time2send = dateFormat(time2send, "dd/mm/yyyy H:MM")

    }

    //console.log(details.data.is_contractor);
    //console.log(time2send);
    //done();
    //return;

    if (app.get('env') == 'development')  console.log(time2send);
    //return
    var phone_to =  (app.get('env') == 'development') ? '0543300540' : details.data.phone; 

    var xml = builder.create('Inforu')
    .ele('User')
      .ele('Username', 'bonimbayit')
      .up()
      .ele('Password', 'bon454')
      .up()
    .up()
    .ele('Content', {'Type': 'sms'})
      .ele('Message', details.data.message)
      .up()
    .up()
    .ele('Recipients')
      .ele('PhoneNumber',phone_to)
      .up()
    .up()
    .ele('Settings')
      .ele('Sender', 'BonimBayit')
      .up()
      .ele('MessageInterval', '0')
      .up()
      .ele('TimeToSend', time2send) 
      .up()
      .ele('DelayInSeconds', '1')
      .up()
    .up()
    .end({ pretty: false});
    
    request({
      method: 'POST',
      url: "http://api.inforu.co.il/SendMessageXml.ashx?InforuXML=" + xml,
      encoding: 'utf-8',
      json: false   // <--Very important!!!
      //headers: {
      //    "content-type": "application/xml",  // <--Very important!!!
      //},
      //body: myJSONObject
  }, function (error, response, body){
       //TODO if error send mail
       if (app.get('env') == 'development') console.log(error);
       if (app.get('env') == 'development') console.log(response.body);
  });


 done();
});


// test authentication
function ensureAuthenticated(req, res, next) {
//if (app.get('env') == 'development') return next();
if (req.isAuthenticated()) { return next(); }
res.redirect('/signup')
}

module.exports = router;
