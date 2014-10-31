// mongo= connect
var mongoose = require('mongoose');
var express = require('express');
var app = express(); 
var db_url = 'mongodb://localhost/production';

if ('development' === app.get('env')) {db_url = 'mongodb://localhost/test';}

mongoose.connect(db_url);
var db = mongoose.connection;
db.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  var err = new Error(err);
  throw err;
  return console.log(err);
});

db.once('open', function callback () {
    console.log('connection do mongodb done');
    });

module.exports = db; 