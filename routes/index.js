var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) { 
  res.render('index', { title: 'בונים בית,יומן הבנייה המקיף בישראל' });

});

/* GET home page. */
router.get('/belson', function(req, res) {
  res.render('index', { title: 'belson' });


});
module.exports = router;
