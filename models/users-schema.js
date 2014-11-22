(function(){
	'use strict';

	var mongoose = require('mongoose');
	var Contractors = require('./contractors-schema');
	 

	module.exports = function() {

			 
			// this initializes the schema for the model
			var Users = mongoose.Schema({name: {type:String,index:  true},
										fbId:  { 
									        type:   Number, 
									        unique: true,
									        sparse: true,
									        index:  true
									        },
									    photo: String,
									    email: 
									    	{ type : String ,
									    	 lowercase : true,
									    	 unique: true,
									    	 sparse: true,
									    	 index:  true 
									    	},    
										createdate: { type: Date, default: Date.now() } ,
										phone: { 
									        type:   String									       
									        },
									    address: {
								              street: String,
								              city:   String
								            },
								        sendmail: {type: Boolean},
								        usersearchcontractors: [UserSearchcontractors],
								        userforwards:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Contractors',unique: true,sparse: true }],
								        //userforwardcontractors: [Contractors],								        			
								        //userforwardcontractors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contractors',index: true, unique: true }],
								        isadmin: { type: Boolean, default: false}
												      
				});

			var UserSearchcontractors = new mongoose.Schema({
				  type:{ type:String,index:  true },
		    	  area: { type:String,index:  true },
		    	  createdate: { type: Date, default: Date.now() }
			});

			 
			
			// now we compile our model and register it 

			mongoose.model('Users', Users);

			// If, for example, we assume the model's name is Kitten,
			// then we would have used the following to compile and register it:
			// mongoose.model('Kitten', Kitten);

			// once this has been done, one can obtain the model
			// in other files with
			// Kitten = mongoose.model('Kitten'); 

	};

}());