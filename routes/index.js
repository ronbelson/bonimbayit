var express = require('express');
var httpProxy = require('http-proxy');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
var _ = require('underscore');
var path           = require('path')
  , templatesDir   = path.join(__dirname, '../emails')
  , emailTemplates = require('email-templates');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('FIuK1588pNxIn1NSyZCE8g');
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bonimbayit@gmail.com',
        pass: 'ynvfhfjtgnfklccq'
    }
});

var kue = require('kue')
  , jobs = kue.createQueue();
  kue.app.listen(4000);
  
//memcached
//var Memcached = require('memcached');
//var memcached = new Memcached('localhost:11211');
//var lifetime = 86400; //24hrs


var app = express(); 
var  posts =  [] ;
var blog_url = 'http://127.0.0.1:2368';
var site_email = 'ronbelson@gmail.com';
if (app.get('env') === 'production') {site_email='bonimbayit@gmail.com'}
var config_passport = require('../oauth-production.js');
if (app.get('env') == 'development') {config_passport = require('../oauth-dev.js');}

var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

require('../db/db_connect');
require('../models/init_schema');
var User = mongoose.model('Users'); 
var Contractors = mongoose.model('Contractors'); 

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// config
passport.use(new FacebookStrategy({
 clientID: config_passport.facebook.clientID,
 clientSecret: config_passport.facebook.clientSecret,
 callbackURL: config_passport.facebook.callbackURL,
 profileFields:config_passport.facebook.profileFields
},
function(accessToken, refreshToken, profile, done) {
 var User = mongoose.model('Users'); 
 User.findOne({ fbId: profile.id }, function(err, user) {
    if(err) { 
        console.log(err);
        var err = new Error(err);
        throw err;
         }
    if (!err && user != null) {
      done(null, user);
    } else {
      var email = profile.emails;

      var user = new User({
        fbId: profile.id,
        name: profile.displayName,
        photo: profile.photos[0].value

      });
      // var email = profile.emails;
      // console.log(email)
      // if (email!='undefined' || email!=undefined )
      //   { user.push({'email':profile.emails[0].value})}
      user.save(function(err) {
        if(err) {
          console.log(err);
          var err = new Error(err);
          throw err;
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
    });
    }
    ));

//DONT REMOVE DOWN
//TODO : ignure db schema on pathes
router.use(function(req, res, next) 
{
  
  var postsPaths = ['/','/filecosts/', '/json/blog'];
  
  //if (  _.contains( req.path,postsPaths)==false ) return next();
  if (postsPaths.indexOf(req.path)==-1) return next();
  
  //TODO map reduce for small json requuest
  posts_cache = cache.get('posts');
  
  if(posts_cache==null) 
  { 
    
    if (app.get('env') === 'production') {blog_url='http://178.62.196.54/blog'  }
    request(blog_url+'/json/', function (error, response, body) 
      { 
  
        if (!error && response.statusCode == 200) 
          {
            // memcached.set('posts', body, lifetime, function( err, result ){
            //   if( err ) console.error( err );
            //   console.dir( result );
            // });

            cache.put('posts', body, 1000*60*60*3) // Time in ms
            console.log('put cache')
             
            posts = JSON.parse(body);
           
            next(); 
          } 

      }) 
  } else {
           
             
           posts = JSON.parse(posts_cache); 
           next();
         }   
 
  
});

/* GET home page. */
router.get('/', function(req, res) { 
  console.log('render the page')
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' , posts: posts});
  //res.send(posts);
});

router.get('/json/blog', function(req, res) { 

  res.jsonp(posts);
});




router.post('/search/', function(req, res,next) {
   //'/search/:type/:area/:email/:name'
   var data_json = (req.body);
   var contractors_match ;
   var timer = 1000*60*3
   if (app.get('env') == 'development') {timer = 1000 }

   //console.log(data_json);
   
    
   User.findOne({ email: data_json.EMAIL }, function(err, user) {
      if(err) { 
          console.log(err);
          var err = new Error(err);
          throw err;
           }
      
      
      if (!err && user != null) {
        
       
        user.usersearchcontractors.push({ type: data_json.MMERGE2 , area: data_json.MMERGE1  });
       // user.userforwardcontractors.push(contractors_match);
          //console.log(user)
        //user.usersearchcontractors.push({ type: data_json.MMERGE2 , area: data_json.MMERGE1 });
        user.save(function(err) {
          if(err) {
            console.log(err);
            var err = new Error(err);
            throw err;
          } else {
            console.log("saving user usersearchcontractors ...");
            
          };
        });  
        
      } else 
        {
         
        var user = new User({
          name: data_json.name,
          email: data_json.EMAIL,
          usersearchcontractors: [{ type: data_json.MMERGE2 , area: data_json.MMERGE1}]
        });
        
        
        user.save(function(err) {
          if(err) {
            console.log(err);
            var err = new Error(err);
            throw err;
          } else {
            console.log("saving user ...");
            
          };
        });
      };

          Contractors.find({ contractor_types:{ $elemMatch: { id:  data_json.MMERGE2 } } ,status:'2222' , areas: { $elemMatch: { id:  data_json.MMERGE1 } } },function(err, data) {
            _.each(data, function(value, key) {
                if(value.forwards.indexOf(user._id) == -1){ // if the contractor not sent to this user
                     Contractors.findOne({_id: value._id}, function (err, contractor) {
                     if(err){ return err; next(); }
                     contractor.forwards.push(mongoose.Types.ObjectId(user._id));
                     contractor.save(function(err, contractor){
                       if(err){return (err); next(); }
                      }); // contractor.save
                    }); //  Contractors.findOne
                 }; //  if(value.forwards.indexOf
            });  // _.each(data, function(value, key) {
            
            var email_template = 'recommand_contractor_not_found'
            if(data.length>0) {email_template = 'recommand_contractor'}
          
                var email = jobs.create('email', {
                      email_data: {data:data, name:data_json.name} 
                    , template: email_template
                    , name:data_json.name
                    , to: data_json.EMAIL
                    , bcc:'bonimbayit@gmail.com'
                    , subject: 'בקשר להמלצות על קבלן ' + data_json.MMERGE2 + ' ב' + data_json.MMERGE1
                     

                  }).delay(timer)
                    .priority('high')
                    .save()
                
                 jobs.promote(); 

                res.json({result:'done'})
            
      }); // Contractors.find(

    });
      
  
  
  
  


  
});


/* Thankyou page. */

router.get('/thankyou/:type/:msg', function(req, res) { 
   
  //console.log(posts)
  res.render('thankyou', { msg: req.param("msg") , title: 'תודה על הרישום לבונים בית' , posts: posts });


});

router.get('/filecosts/', function(req, res) { 
  res.render('filecosts', {  title: 'בונים בית - הורדת קובץ עלויות בניה' , posts: posts});

});




router.get('/kablanim/:type/:area', function(req, res) {
  res.render('kablanim', { title: 'התקבלו 8 קבלנים בשרון' , posts: posts});


});



/*  */
router.post('/contact', function(req, res) {
  //console.log(req);
  data_json = (req.body);
  
  
  var subject = data_json.subject;
  var name    = data_json.name;
  var phone   = data_json.phone;

  if (name === undefined || name === "undefined")     {name = "ללא שם"}
  if (subject === undefined ||  subject === "undefined")  {subject = "בונים בית - פניה מ";}
  if (phone === undefined ||  phone === "undefined")  {phone = "לא הועבר";}

  var message = {
    //"html":  '<p style="float:right;">התקבלה פניה חדשה מהאתר:</p><p style="float:right;>שם ואימייל:' +  req.param("email") + ',' + req.param("name") + '</p>',
    "text": "שם ואימייל: " +  data_json.EMAIL + " , " + name + ", טלפון: " + phone + ", הודעה: " +  data_json.message  ,
    "subject": subject + name ,
    "from_email": data_json.EMAIL,
    "from_name": name,
    "to": [{
            "email": "bonimbayit@gmail.com",
            //"email": "ronbelson@gmail.com",
            "name": "בונים בית",
            "type": "to"
        }],
    "headers": {
        "Reply-To": data_json.EMAIL
    }};

    
  var async = true;
	var ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
	    //console.log(result);
	    //console.log(message);
	    res.contentType('json');
        res.send({ result: result });

	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	     //console.log(result);
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});





// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}


});

module.exports = router;


jobs.process('email', function(job, done){
  emailTemplates(templatesDir, function(err, template) {
                   template(job.data.template, job.data.email_data, function(err, html, text) {
                   
                    transport.sendMail({
                          from: 'תומר חן - בונים בית <bonimbayit@gmail.com>',
                          to: job.data.to,
                          bcc: job.data.bcc,
                          subject: job.data.subject,
                          html: html,
                          // generateTextFromHTML: true,
                          text: text
                        }, function(err, responseStatus,callback) {
                          if (err) {
                            console.log(err);
                            //res.status(500)
                          } else {
                            //console.log(data);
                            
                            
                          }
                     }); //transport.sendMail({
                  }); //  template('recommand_contractor',
               }); // emailTemplates(templatesDir

  console.log('done '+job.id)
  done();
});

