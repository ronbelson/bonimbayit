var express = require('express');
var httpProxy = require('http-proxy');

var router = express.Router();
var bodyParser = require('body-parser')
var request = require('request');
var cache = require('memory-cache');
//var jsonQuery = require('json-query')
var  posts = { posts: [] }
var blog_url = 'http://127.0.0.1:2368'
var app = express(); 

router.use(function(req, res, next) 
{
  
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


/* GET home page. */
router.get('/', function(req, res) { 
  //console.log('render the page')
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' , posts: posts});
  //res.send(posts);
});

/* Thhankyou page. */

router.get('/thankyou/:type/:msg', function(req, res) { 
  res.render('thankyou', { msg: req.param("msg") , title: 'תודה על הרישום לבונים בית' , posts: posts});

});

router.get('/filecosts/', function(req, res) { 
  res.render('filecosts', {  title: 'בונים בית - הורדת קובץ עלויות בניה' , posts: posts});

});

/* GET home page. */
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


  



});

module.exports = router;
