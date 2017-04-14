
var mongoose = require('mongoose'),
	Schema = mongoose.Schema


var DeviceSchema = new Schema({

Image:{type:String},

DeviceName:{type:String},

DeviceId:{type:String,required:true,unique:true} ,

RecieveNotification:{type:Boolean,default:true},

Password:{type:String},

FacebookProfileName:{type:String},  

FacebookEmail:{type:String},

SendMessageDetails:[{ RegisteredID : {type :String}
	,Message : {type:String}}]

})


var deviceSchema = mongoose.model('deviceSchema', DeviceSchema);
module.exports = deviceSchema;