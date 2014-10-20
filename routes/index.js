var express = require('express');
var httpProxy = require('http-proxy');

var router = express.Router();
var bodyParser = require('body-parser')
var httpProxy = require('http-proxy');  
var proxy = new httpProxy.createProxyServer();

 
//var app = express();
//var app_proxy_url = function() {
//    if(app.get('env') === 'development')
//    	return  'http://127.0.0.1:2368';
//    else
//    	return 'http://blog-bonimbayit.herokuapp.com'
//};

  
//router.use(bodyParser.urlencoded({ extended: false })); 
//router.use(bodyParser.json()); 


//router.get('/blog*', function (req, res, next) {  
//    req.headers.host = 'blog-bonimbayit.herokuapp.com';
//    proxy.web(req, res, {
//         target: 'blog-bonimbayit.herokuapp.com'
//     
        
//    });
//});
 
// router.post('/blog*', function (req, res, next) {
//     req.headers.host = app_proxy_url();
//     post_options = {
//       headers: {
//           //'Referer':'127.0.0.1:3000/'
//       	  //'url': 'http://127.0.0.1:2368',

//           'Content-Type': 'application/x-www-form-urlencoded'
//           //'Content-Type': 'X-Forwarded-Proto',
//           //'Content-Type':'application/octet-stream'
//           //'X-Requested-With':'XMLHttpRequest',
//           //'Content-Type': 'application/x-www-form-urlencoded',
//           //'Host': '127.0.0.1:2368'
         
//       }  
//         };
//     proxy.web(post_options, res, {
//         target: app_proxy_url()
//     });
// });
// router.delete('/blog*', function (req, res, next) {
//     proxy.web(req, res, {
//         target: app_proxy_url()
//     });
// });
// router.put('/blog*', function (req, res, next) {
//     proxy.web(req, res, {
//         target: app_proxy_url()
//     });
// });

/* GET home page. */
router.get('/', function(req, res) { 
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' });

});

/* Thhankyou page. */

router.get('/thankyou/:type/:msg', function(req, res) { 
  res.render('thankyou', { msg: req.param("msg") , title: 'תודה על הרישום לבונים בית' });

});

router.get('/filecosts/', function(req, res) { 
  res.render('filecosts', {  title: 'בונים בית - הורדת קובץ עלויות בניה' });

});

/* GET home page. */
router.get('/kablanim/:type/:area', function(req, res) {
  res.render('kablanim', { title: 'התקבלו 8 קבלנים בשרון' });


});

/*  */
router.post('/contact', function(req, res) {
  //console.log(req);
  data_json = (req.body);
  //console.log(data_json);
  
  var mandrill = require('mandrill-api/mandrill');
  var mandrill_client = new mandrill.Mandrill('FIuK1588pNxIn1NSyZCE8g');
  var message = {
    //"html":  '<p style="float:right;">התקבלה פניה חדשה מהאתר:</p><p style="float:right;>שם ואימייל:' +  req.param("email") + ',' + req.param("name") + '</p>',
    "text": "שם ואימייל: " +  data_json.email + " , " + data_json.name + ", טלפןן: " + data_json.phone + ", הודעה: " +  data_json.message  ,
    "subject": "בונים בית - פניה מ" + req.param("name") ,
    "from_email": data_json.email,
    "from_name": data_json.email.name,
    "to": [{
            "email": "bonimbayit@gmail.com",
            "name": "בונים בית",
            "type": "to"
        }],
    "headers": {
        "Reply-To": data_json.email
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
