var express = require('express');
var httpProxy = require('http-proxy');
var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');

var  posts = { posts: [] }
var blog_url = 'http://127.0.0.1:2368'
var app = express(); 
var config_passport = require('../oauth-production.js');
if (app.get('env') == 'development') {config_passport = require('../oauth-dev.js');}

var mongoose = require('mongoose')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

require('../db/db_connect');
require('../models/init_schema');


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

/* GET home page. */
router.get('/', function(req, res) { 
  //console.log('render the page')
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' , posts: posts});
  //res.send(posts);
});


 
router.get('/contractors/:company_name/:phone', function(req, res) {

    // note that since this has a callback, the
    // save happens asychronously. So, the find
    // that follows may not (probably will not)
    // retrieve the contractor you're trying to save.
    
      
    var Contractor = mongoose.model('Contractors');

    var contractor  = new Contractor({ 
                      company_name: req.param('company_name') ,
                      phone: req.param('phone') }); 


    contractor.save(function (err) {
      if (err) {
          // TODO Warning message
          console.error('could not save ' + err.message);
          res.send(err.message);     
        } 
      else {
        Contractor.findById(contractor, function (err, contractor) {
          if (err) {
            console.error('could not find Contractor after insert new');
            throw err;
          } 
          
          if ( contractor.length <= 0 ) {
           res.send({error: 'I have no Contractor'});
          } 
          else {
             res.send(contractor); 
               }  
          });
      }
        
      });
});

router.get('/contractors', function(req, res) {
  
   var Contractor = mongoose.model('Contractors'); 

   Contractor.find( function (err, contractor) {
        if (err) {
          console.error('could not find Contractor');
          throw err;
        } 
        
        if ( contractor.length <= 0 ) {
         res.send({error: 'I have no Contractor'});
        } 
        else {
           res.send(contractor);   
        }
         

    });
  
});


/* Thankyou page. */

router.get('/thankyou/:type/:msg', function(req, res) { 
  res.render('thankyou', { msg: req.param("msg") , title: 'תודה על הרישום לבונים בית' , posts: posts});

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
  //console.log(data_json);
  
  var mandrill = require('mandrill-api/mandrill');
  var mandrill_client = new mandrill.Mandrill('FIuK1588pNxIn1NSyZCE8g');
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




//TODO : ignure db schema on pathes
router.use(function(req, res, next) 
{
  console.log(req.path)
  var postsPaths = ['/','/filecosts/','/thankyou/'];
  var _ = require('underscore');
  if ( !  _.contains(postsPaths, req.path) ) return next();
  
  //TODO map reduce for small json requuest
  posts_cache = cache.get('posts');

  if(posts_cache==null) 
  {
    
    if (app.get('env') === 'production') {blog_url='http://178.62.196.54/blog'  }
    request(blog_url+'/json/?limit=100', function (error, response, body) 
      {
  
        if (!error && response.statusCode == 200) 
          {
  
            //cache.put('posts', body, 1000*60*60*3) // Time in ms
            posts = JSON.parse(body);
            next(); 
          } 

      }) 
  } else {
           posts = JSON.parse(posts_cache); 
           next();
         }   
 
  
});

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}


});

module.exports = router;
