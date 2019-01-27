var mongoose = require("mongoose") ,
passportLocalMongoose = require("passport-local-mongoose");


var schema = new mongoose.Schema({username:'string' , 
   password: 'string'  , regno: 'string' , name: 'string' , dept: 'string'  }); 


schema.plugin(passportLocalMongoose);


module.exports = mongoose.model('user', schema);
