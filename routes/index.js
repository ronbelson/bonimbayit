var express = require('express');
//var httpProxy = require('http-proxy');

var router = express.Router();

//var blogProxy = httpProxy.createProxyServer();


// Route /blog* to Ghost
//router.get("/blog*", function(req, res){ 
  //  blogProxy.web(req, res, { target: 'http://127.0.0.1:2368' });
//});

 

var httpProxy = require('http-proxy');  
var proxy = new httpProxy.createProxyServer();

router.get('/blog*', function (req, res, next) {  
    //req.headers.host = 'blog-bonimbayit.herokuapp.com';
    proxy.web(req, res, {
        target: 'blog-bonimbayit.herokuapp.com'
    });
});
 

/* GET home page. */
router.get('/', function(req, res) { 
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' });

});

/* GET home page. */
router.get('/kablanim/:type/:area', function(req, res) {
  res.render('kablanim', { title: 'התקבלו 8 קבלנים בשרון' });

 
//router.use(express.urlencoded()); 
//router.use(express.json()); 


});
module.exports = router;
