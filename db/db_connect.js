// mongo= connect
var mongoose = require('mongoose');
var express = require('express');
var app = express(); 
var db_url = 'mongodb://localhost/production';

if ('development' === app.get('env')) {db_url = 'mongodb://localhost/test';}

mongoose.connect(db_url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('connection do mongodb done');
    });

module.exports = db; 