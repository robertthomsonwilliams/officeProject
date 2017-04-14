var mongoose = require('mongoose'),
	Schema = mongoose.Schema
 
var bcrypt = require('bcrypt');
var UserSchema = new Schema({
	// Images:[{Image:{type:String}}],
	Image1:{type:String, default:''},
	Image2:{type:String, default:''},
	Image3:{type:String, default:''},
	Image4:{type:String, default:''},
	Image1Url:{type:String, default:''},
	Image2Url:{type:String, default:''},
	Image3Url:{type:String, default:''},
	Image4Url:{type:String, default:''},
	Salutation:{type:String},
	FirstName:{type:String,default:'', maxlength:'40'},
	LastName:{type:String, default:'', maxlength:'40'},
	Email:{type:String, maxlength:'254'},
	UserRole:{type:String},
	Password:{type:String, maxlength:'100'},
	DOB:{type:Date},
	Gender:{type:String},
	ProfileStartDate:{type:Date, default:Date.now()},
	Address:{type:String},
	Country:{type:String},
	State:{type:String},
	City:{type:String},
	Zipcode:{type:Number},
	Status:{type:String, default:'Active'},
	Location1:{type:String},
	child:{type:String , defialut:""},
	Location2:{type:String},
	otp:{type:String},
	otpStatus:{type:String, default:""}
	// Address:[{
	// 	country:{type:String},
	// 	state:{type:String},
	// 	city:{type:String},ß
	// 	street1:{type:String},
	// 	street2:{type:String},
	// 	pincode:{type:String}
	// }],
	// Images:[{
	// 	Image:{type:String},
	// 	Image:{type:String},
	// 	Image:{type:String},
	// 	Image:{type:String}
	// }],
	// video:[String],
	// Location:[{
	// 	locationName:{type:String},
	// 	latitude:{type:String},
	// 	logitude:{type:String}
	// }]

})


var userSchema = mongoose.model('userSchema', UserSchema);
module.exports = userSchema;
// ------- For Super Admin Creation ---------// 
var superAdminCreation = mongoose.model('userSchema', UserSchema);
var superAdmin;
var autoInvoke = function(){
	superAdminCreation.findOne({Email:"nikhil@gmail.com"},function(err, data){
		if(err){
			throw err;
		}
		else if(data!=null){
			
			console.log('Super admin already created');
			
		}
		else{
				var bcryptPassword="";

			bcrypt.hash("hinikhil", 9, function(err, hash) {
 			
   			bcryptPassword=hash;

			superAdmin = superAdminCreation({Email:"nikhil@gmail.com", Password:bcryptPassword, UserRole:"SuperAdmin", FirstName:"nikhil"});
			superAdmin.save(function(err, data){
				if(err){
					console.log(err);
				}
				else{
					console.log('Super admin created successfully');
				}
			})
		}) //end of bcrypt scope

		}
	})
};
autoInvoke();

//At begning Array for Images removed because of Sheshnath, Array didn't for address too because of FrontEnd Requirement.

// var UserSchema = new Schema({
// 	Images:[{Imagee:{type:String},Image:{type:String},Image:{type:String},Image:{type:String}}],
// 	Salutation:{type:String},
// 	FirstName:{type:String,},
// 	LastName:{type:String},
// 	Email:{type:String},
// 	UserRole:{type:String},
// 	Password:{type:String},
// 	DOB:{type:Date},
// 	Gender:{type:String},
// 	ProfileStartDate:{type:Date},
// 	Address:[{ Country:{type:String},State:{type:String},City:{type:String},Zipcode:{type:Number}}],
// 	Location1:{type:String},
// 	Location2:{type:String},
// 	Otp:{type:String},
// 	OtpStatus:{type:String, default: ""}