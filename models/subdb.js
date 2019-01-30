var mongoose = require("mongoose");

var schema = new mongoose.Schema({testcode:'string' , 
   sub: 'string'  , staff: 'string'  });
 
module.exports = mongoose.model('subdb', schema);   