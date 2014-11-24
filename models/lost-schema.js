(function(){
	'use strict';

	var mongoose = require('mongoose');
	 
	 

	module.exports = function() {

			 
			// this initializes the schema for the model
			var Lost = mongoose.Schema({
										
										type:String,
										area:String,
		    	  					    createdate: { type: Date, default: Date.now() },
		    	  					    numoflost: {type: Number,default:0,index:  true}
				                     });
			Lost.index({ type: 1, area: 1}, { unique: true ,sparse: true});
			mongoose.model('Lost', Lost);

			// If, for example, we assume the model's name is Kitten,
			// then we would have used the following to compile and register it:
			// mongoose.model('Kitten', Kitten);

			// once this has been done, one can obtain the model
			// in other files with
			// Kitten = mongoose.model('Kitten'); 

	};

}());