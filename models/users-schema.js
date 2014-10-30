(function(){
	'use strict';

	var mongoose = require('mongoose');

	 

	module.exports = function() {

			 
			// this initializes the schema for the model
			var Users = mongoose.Schema({name: String,
										fbId:  { 
									        type:   Number, 
									        unique: true,
									        index:  true
									        },
									    photo: String,
									    email: 
									    	{ type : String , lowercase : true, unique: true,index:  true},    
										createdate: { type: Date, default: Date.now() } ,
										phone: { 
									        type:   String, 
									        unique: true
									        },
								        isadmin: { type: Boolean, default: false}
												      
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

