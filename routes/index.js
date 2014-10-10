var express = require('express');
var httpProxy = require('http-proxy');

var router = express.Router();
var bodyParser = require('body-parser')
var httpProxy = require('http-proxy');  
var proxy = new httpProxy.createProxyServer();

 
var app = express();
var app_proxy_url = function() {
    if(app.get('env') === 'development')
    	return  'http://127.0.0.1:2368';
    else
    	return 'http://blog-bonimbayit.herokuapp.com'
};

 
router.use(bodyParser.urlencoded({ extended: false })); 
router.use(bodyParser.json()); 


router.get('/blog*', function (req, res, next) {  
    req.headers.host = app_proxy_url();
    proxy.web(req, res, {
         target: app_proxy_url()
     
        
    });
});
 
router.post('/blog*', function (req, res, next) {
    req.headers.host = app_proxy_url();
    post_options = {
      headers: {
          //'Referer':'127.0.0.1:3000/'
      	  //'url': 'http://127.0.0.1:2368',

          'Content-Type': 'application/x-www-form-urlencoded'
          //'Content-Type': 'X-Forwarded-Proto',
          //'Content-Type':'application/octet-stream'
          //'X-Requested-With':'XMLHttpRequest',
          //'Content-Type': 'application/x-www-form-urlencoded',
          //'Host': '127.0.0.1:2368'
         
      }  
        };
    proxy.web(post_options, res, {
        target: app_proxy_url()
    });
});
router.delete('/blog*', function (req, res, next) {
    proxy.web(req, res, {
        target: app_proxy_url()
    });
});
router.put('/blog*', function (req, res, next) {
    proxy.web(req, res, {
        target: app_proxy_url()
    });
});

/* GET home page. */
router.get('/', function(req, res) { 
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' });

});

/* GET home page. */
router.get('/kablanim/:type/:area', function(req, res) {
  res.render('kablanim', { title: 'התקבלו 8 קבלנים בשרון' });

 
 

 


});
module.exports = router;
