(function(){
	'use strict';

	var mongoose = require('mongoose');
	var Users = require('./users-schema');
	 

	module.exports = function() {

			 
			// this initializes the schema for the model
			var Contractors = mongoose.Schema({ 
												name: String,
												company_name: {
												    type: String,
												    unique: true,
										            index:  true
										        },
												phone: { 
											        type:   String, 
											        unique: true,
											        index:  true
										        },
										        email: String,
										        address: String,
										        status: {
										        	type:Number,
										        	index:  true
										        },
										        date_created: { type: Date, default: Date.now() } ,
										        areas: { area: String},
										        comments: [ContractorsComments],  
										        forwards: [Users.schema],  
												      
				});

			var ContractorsComments = new mongoose.Schema({
				  author: String,
		    	  phone: String,
		    	  email: String,
		    	  comment: String,
		    	  createdate: { type: Date, default: Date.now() }
			});



			
			// now we compile our model and register it 

			mongoose.model('Contractors', Contractors);

			// If, for example, we assume the model's name is Kitten,
			// then we would have used the following to compile and register it:
			// mongoose.model('Kitten', Kitten);

			// once this has been done, one can obtain the model
			// in other files with
			// Kitten = mongoose.model('Kitten'); 

	};

}());

