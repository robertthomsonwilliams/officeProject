var express = require('express'),
app = express(),
bodyParser =  require('body-parser'),
UserSchema = require('./models/userSchema'),
DeviceSchema = require('./models/deviceSchema'),
config = require('./config'),
jwt = require('jsonwebtoken');
	//---------OTP MODIFY
	var nodemailer = require('nodemailer');  
    var fs = require('fs');
    var config = require('./config');
    var cloudinary = require('cloudinary');
    var bcrypt = require('bcrypt');
    		var gcm = require('node-gcm');

 //COMMON ERRORS--------------start-----------------------

//1.return is done when res.json is to be used --> return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
//2.return not used when res.send is used ---> res.send({ResponseCode:200, ResponseMessage: "Profile Updated.",UserRole: updateResult.UserRole});
//3.Mismatch between code and ResponseCode
//4.sending ResponseCode=201  but checking ResponseCode=200
//5.ng-model variables accessed by $scope
//6.scope of method matters in cloudinary and bcrypt
//7.it is faster to store images in url and send than saving images (images less than 20KB give better response)


//---------------------------end-------------------------

//----------------- All Checked ON ADvanced Rest Client ----------------//
exports.createProfile = function(req, res){
	 	console.log("req body of createProfile" + JSON.stringify(req.body));	 		
	 		console.log("Create Profile --> UserId : "+req.body.UserId);	

			//saving encoded images in request.body to cloud and then modifying the req.body
			//if req.body.Image1!='' then do below
			//req.body.Image1 -->binary-->store in cloudinary-->get URL-->req.body.Image1=result.url
			//if req.body.Image2!='' then do below
			//req.body.Image2 -->binary-->store in cloudinary-->get URL-->req.body.Image2=result.url

			
	 	 	UserSchema.findOneAndUpdate({_id:req.body.UserId},req.body,{new:true}, function(err, updateResult){
		 	if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error."});
			console.log(err);
		    }else if(updateResult!=null)
		    {
			//console.log("Create Profile Updated Rsult ------- > :" +updateResult);	
			var LastImage="";		
			if(updateResult.Image4!='')
			{
				LastImage=updateResult.Image4;
			}
			else if(updateResult.Image3!='')
			{
				LastImage=updateResult.Image3;
			}
			else if(updateResult.Image2!='')
			{
				LastImage=updateResult.Image2;
			}
			else if(updateResult.Image1!='')
			{ 
				LastImage=updateResult.Image1;
			}

//Store last image on cloud and get the url and send it.
//--------start----------------//			
//console.log("1 LastImage= " +LastImage);
 		var img_base64 = LastImage;
 		//b) we are creating binary image here from given base64 image
 		binaryData = new Buffer(img_base64, 'base64');
 		//console.log("2 binaryData=" +binaryData);  		
   		// c) making image at server here and naming it as test.jpeg
   		fs.writeFile("test.jpeg", binaryData, "binary", function (err) {
	                if(err){
		                console.log("error in writing file "+err+" and binarydata="+binaryData);
	    	        }
   		});
//Step-2 :Setting Cloudinary configuration
   	      cloudinary.config({ 
	     'cloud_name': config.cloudinary_cloud_name, 
	     'api_key': config.cloudinary_api_key, 
	     'api_secret': config.cloudinary_api_secret
   });
   		//Step-3 :uploading created image test.jpeg in Step-1 on cloudinary
   		 cloudinary.uploader.upload("test.jpeg",function(result) {	                 
                 //checking the url of uploaded image sent to us by Cloudinary
   		 console.log("image url ="+result.url);
//--------end----------//		
		 res.send({ResponseCode:200, ResponseMessage: "Profile Updated.", FeedList:updateResult, LastImage:LastImage , ImageURL:result.url });
		});
      }
      else
      {
		res.send({ResponseCode:200, ResponseMessage: "No record Found"});

      }
 	})
 }
exports.editUsersDetailsAdminOrSuperAdmin = function(req, res){
		//admin will send the details in body and we will update it
		//admin will not send Images so no need to store them in database or cloudinary hence removed that code
		//no need to return Feedlist..just return ResponseCode:200, ResponseMessage: "Profile Updated."
	 		console.log("req body of editUsersDetailsAdminOrSuperAdmin" + JSON.stringify(req.body));	 
	 		console.log("modify Profile --> UserId : "+req.body.UserId);	
	 	 	UserSchema.findOneAndUpdate({_id:req.body.UserId},req.body,{new:true}, function(err, updateResult){
		 	if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error."});
			console.log(err);
		    }else if(updateResult!=null)
		    	{
			res.send({ResponseCode:200, ResponseMessage: "Profile Updated.",UserRole: updateResult.UserRole});
    		  }
    		  else
    		  {
			res.send({ResponseCode:200, ResponseMessage: "No record Found"});
      }
 	})
 }
 exports.FillDefaultDetailsSuperAdminOrAdmin = function(req, res){
 	console.log(" ShowUserDetails req.body 1 =========: "+req.body.UserId);
 	var _id = req.body.UserId;
 	if(!_id){
 		return res.json({ResponseCode:400, ResponseMessage: "UserId is missing."})
 	}
 	UserSchema.findOne({_id:_id})
 	.exec(function(err, user_info){
 		if(err){
 			res.send({ResponseCode:400, ResponseMessage: "Error"});
 			console.log(err);
 		}else{
 			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
 		}
 	})
 }
exports.storeImages=function(req,res){
 	//Image uploading
 		//Step-1
 		//image send from client in string of Base64
 		//Schema has Images Array --> Images:[{Image:{type:String}}] -->
 		// JSON Request of Array will be like this—> “Image":[{"Image":"sdasdsq"},{"Image":"wedsads"}]
 		//so client should send the 4 Images in request body like this so that it can be stored in Schema
 		//and then we can read it here
 			console.log(req.body.UserId);
 		//store images in Images Array of Schema
 	 	UserSchema.findOneAndUpdate({_id:req.body.UserId},req.body,{new:true}, function(err, updateResult){
 		if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error"});
			console.log(err);
		}else{
			console.log("success-3");	

				var LastImage='';
			if(updateResult.Image4!='')
			{
				LastImage=updateResult.Image4;
			}
			else if(updateResult.Image3!='')
			{
				LastImage=updateResult.Image3;
			}
			else if(updateResult.Image2!='')
			{
				LastImage=updateResult.Image2;
			}
			else if(updateResult.Image1!='')
			{ 
				LastImage=updateResult.Image1;
			}
		   // res.send({ResponseCode:200, ResponseMessage: "Success",result:updateResult,image:image_result.url});
		res.send({ResponseCode:200, ResponseMessage: "Success",result:updateResult,LastImage:LastImage});
		}
 	})
}
//---------------------------{Modifed for SheshNath Pandey}---------------------//
 exports.getLastImage=function(req,res){
 	if(!req.body.UserId){
 		return res.json({ResponseCode:400, ResponseMessage: "UserId is missing."})
 	}
 	UserSchema.findOne({_id:req.body.UserId}).exec(function(err, result){
 		if(err){
 			res.send({ResponseCode:400, ResponseMessage: "Error"});
 			console.log(err);
 		}
 		else	
 		{
 			console.log(result);
			//result.Image is an array containing Images
			//Objective : send last Image 
			//Solution : find length of array and send Image(length-1) in response
			// var length=result.Images.length;
			// console.log("length="+length);
			// res.send({ResponseCode:200, ResponseMessage: "Success",LastImage:result.Images[length-1]});
			var LastImage='';
			if(updateResult.Image4!='')
			{
				LastImage=updateResult.Image4;
			}
			else if(updateResult.Image3!='')
			{
				LastImage=updateResult.Image3;
			}
			else if(updateResult.Image2!='')
			{
				LastImage=updateResult.Image2;
			}
			else if(updateResult.Image1!='')
			{ 
				LastImage=updateResult.Image1;
			}
			res.send({ResponseCode:200, ResponseMessage: "Success",result:result,LastImage:LastImage});	
		}
	})
 }
//==========  with cloudnary ============================//
exports.storeImagesCloundinary=function(req,res){
   // SINGLE IMAGE ----start---------------
 		//Step-1 : Converting Client image in base64 to binary and storing it
                // on server as test.jpeg
 		// //a) image send from client in string of Base64
 		var img_base64 = req.body.Images;
 		// //b) we are creating binary image here from given base64 image
 		binaryData = new Buffer(img_base64, 'base64');
   		// // c) making image at server here and naming it as test.jpeg
   		fs.writeFile("test.jpeg", binaryData, "binary", function (err) {
   			if(err){
   				console.log("error in writing file "+err+" and binarydata="+binaryData);
   			}
   		});
   		// //Step-2 :Setting Cloudinary configuration
   		cloudinary.config({ 
   			'cloud_name': config.cloudinary_cloud_name, 
   			'api_key': config.cloudinary_api_key, 
   			'api_secret': config.cloudinary_api_secret
   		});
   		// //Step-3 :uploading created image test.jpeg in Step-1 on cloudinary
   		cloudinary.uploader.upload("test.jpeg",function(result) {
                // //checking the url of uploaded image sent to us by Cloudinary
                 console.log("image url ="+result.url);
                 res.send({ResponseCode:200, ResponseMessage: "Success",ImageURL:result.url});	
             });
   	}
 //------------------------------------- For Array end-------------------------------------------------/
 exports.showRoleData = function(req, res){
 	UserSchema.findOne({_id:req.body.UserId}).exec(function(err, result){
 		if(err){
 			res.send({ResponseCode:400, ResponseMessage: "Error"});
 			console.log(err);
 		}
 		else{
					//return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
					if(result.UserRole=='King')
					{
						console.log("showRoleData User is King : ")
						UserSchema.find().where('UserRole').in(['Queen','Boy','Girl']).exec(function(err, user_info){
							if(err){
								res.send({ResponseCode:400, ResponseCode: "Error"});
								console.log(err);
							}
							else{

								return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
							}
						})
					}
					else if (result.UserRole=='Queen')
					{
						console.log("showRoleData User is Queen")
						UserSchema.find().where('UserRole').equals('Girl').exec(function(err, user_info){
							if(err){
								res.send({ResponseCode:400, ResponseMessage: "Error"});
								console.log(err);
							}else{
								return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
							}
						})
					}
					else if (result.UserRole=='Boy')
					{
						console.log("showRoleData User is Boy")
						UserSchema.find().where('UserRole').equals('King').exec(function(err, user_info){
							if(err){
								res.send({ResponseCode:400, ResponseMessage: "Error"});
								console.log(err);
							}else{
								return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
							}
						})
					}
					else if (result.UserRole=='Girl')
					{

						console.log("showRoleData User is Girl")
						UserSchema.find().where('UserRole').equals('Boy').exec(function(err, user_info){
							if(err){
								res.send({ResponseCode:400, ResponseMessage: "Error"});
								console.log(err);
							}else{
								return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
							}
						})
					}
					else if (result.UserRole=='Admin')
					{
						UserSchema.find().exec(function(err, user_info){
							if(err){
								return res.json({ResponseCode:400, ResponseMessage: "User not found."})
							}else{
								res.send({ResponseCode: 200, FeedList: user_info,ResponseMessage: "Success"});
							}
						})
					}


				}
			})
 }
 exports.showUserDetails = function(req, res){
 	console.log(" ShowUserDetails req.body 1 =========: "+req.body.UserId);
 	var _id = req.body.UserId;
 	if(!_id){
 		return res.json({ResponseCode:400, ResponseMessage: "UserId is missing."})
 	}
 	UserSchema
 	.findOne({_id:_id})
 	.where('Status')
 	.equals('Active')
 	.exec(function(err, user_info){
 		if(err){
 			res.send({ResponseCode:400, ResponseMessage: "Error"});
 			console.log(err);
 		}else{
 			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
 		}
 	})
 }
//------------------------------------All are Checked and Working According To Pandey--------------------------------------//
// For Seshnath Pandey Tested Apis
exports.login = function(req, res){
	console.log("login : "+req.body.Email+" Password : "+ req.body.Password);
	 //validations ----start------
	 if(req.body.Email=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Email field is empty."})
	 if(req.body.Password=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Password field is empty."})
	 // // //c) check Valid Email
	 // var emailPattern =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	 // if(!emailPattern.test(req.body.Email))
	 // 	return res.json({ResponseCode:400, ResponseMessage:"Not a valid Email."})
 	 //validations ----end------
 	 UserSchema.findOne({Email:req.body.Email}, function(err, user_login_info){
 	 	if(err){
 	 		return res.json({ResponseCode:401, ResponseMessage:"Server error."})
 	 	}else if(!user_login_info){
 	 		return res.json({ResponseCode:401, ResponseMessage: "Incorrect Email"})
 	 	}else{
			//email database me mil gaya ..now match password using bcrypt.compare
			bcrypt.compare(req.body.Password, user_login_info.Password, function(err, result) {
    		// result == true 
    		if(result)
    		{
    			res.send({ResponseCode: 200, ResponseMessage:"Login Successful.",UserId: user_login_info._id,UserRole: user_login_info.UserRole,FirstName:user_login_info.FirstNamegetAllAdmin});

    		}
    		else {
    			res.send({ResponseCode: 400, ResponseMessage:"Incorrect Password"});
    		}			
			});	//end of bcrypt scope			
		}
	})
 	}
// For Singup
exports.userSignup = function(req, res){
	console.log("req body of userSignUp--", JSON.stringify(req.body)); 

	console.log("1:"+req.body.UserRole);

	 //a) Email field not empty
	 if(req.body.Email=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Email field is empty"})
	// //  //b) Password field not empty
	 if(req.body.Password=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Password field is empty"})
	 
	 if(typeof req.body.UserRole=='undefined')
	 	return res.json({ResponseCode:401, ResponseMessage:"UserRole in Required"})

	// // //c) check Valid Email

	var emailPattern = (/^([a-zA-Z0-9@*#]{8,15})$/);
		return res.json({ResponseCode:401, ResponseMessage:"Not a valid Email"})

	//d) check strong Password
	   var passwordPattern=(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
		//^		     				Start anchor
		//(?=.*\d)                  should contain at least one digit
		//(?=.*[a-z])               should contain at least one lower case
		//(?=.*[A-Z])               should contain at least one upper case
		//[a-zA-Z0-9]{8,}           should contain at least 8 from the mentioned characters
		//$							End anchor
	if(!passwordPattern.test(req.body.Password))	
		return res.json({ResponseCode:401, ResponseMessage:"Not a strong password"})




	UserSchema.findOne({Email:req.body.Email},function(err,result){
		if(err){

			 return res.json({ResponseCode:401, ResponseMessage: "Server Error."})
		}
		else if(result){
   					//email found
   				   res.send({ResponseCode: 401, ResponseMessage:"Email already exists"});
   				}
   				else{
   						//email not found...save
   						var bcryptPassword="";	
   						bcrypt.hash(req.body.Password, 9, function(err, hash) {
 			 			// Store hash in your password DB. 
			 			 bcryptPassword=hash;
			 			 req.body.Password=bcryptPassword;
			 			 console.log("bcryptPassword :" +bcryptPassword)
			 			 var userSchema = new UserSchema(req.body);
			 			 userSchema.save(function(err, resultUser){
			 			 	if(err){
			 			 			
			 			 		res.send({ResponseCode:400, ResponseMessage: "Error."});
			 			 		console.log(err);
			 			 	}
			 			 	else{
			 			 			
			 			 		res.send({ResponseCode: 200, ResponseMessage:"Success.", UserId:resultUser._id, UserRole:resultUser.UserRole});
			 			 	}
			 			 });

						}); // end of bcrypt scope
   					}
   				}) //end of findOne scope
}



exports.deleteUserDetails = function(req, res){
	console.log("In deleteUserDetails req.body"+req.body);
	var _id = req.body.UserId;
	if(!_id){
		res.send({ResponseCode:400, ResponseMessage: "UserId is missing."})
	}	
	UserSchema.findOneAndUpdate({_id:_id},{$set:{Status:'Inactive'}},{new:true}, function(err, updateResult){
		if(err){
			res.send({ResponseCode:400, message: "Interal Server Error."});
			console.log(err);
		}else{
			 res.send({ResponseCode:200, message:"User Deleted Successfully."});
		}
	})	
}
exports.DeleteUserSuperadminOrAdmin = function(req, res){
	console.log("In DeleteUserSuperadminOrAdmin req.body"+req.body);
	var _id = req.body.UserId;
	if(!_id){
		res.send({ResponseCode:400, ResponseMessage: "UserId is missing."})
	}	
	UserSchema.findOneAndUpdate({_id:_id},{$set:{Status:'Inactive'}},{new:true}, function(err, updateResult){
		if(err){
			res.send({ResponseCode:400, message: "Interal Server Error."});
			console.log(err);
		}else{
			 res.send({ResponseCode:200, message:"User Deleted Successfully."});
		}
	})	
}
// for ALL King
exports.getAllMinusKing = function(req, res){	
	UserSchema.find().where('UserRole').in(['Queen','Boys','Girl']).exec(function(err, user_info){
		if(err){
			res.send({ResponseCode:400, ResponseCode: "Error"});
			console.log(err);
		}else{
			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
		}
	})
}

// Fir Girsls
exports.getGirls = function(req, res){
	UserSchema.find().where('UserRole').equals('Girl').exec(function(err, user_info){
		if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error"});
			console.log(err);
		}else{
			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
		}
	})
}
// For Boys
exports.getBoys = function(req, res){	
	UserSchema.find().where('UserRole').equals('Boy').exec(function(err, user_info){
		if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error"});
			console.log(err);
		}else{
			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
		}
	})
}
// For King
exports.getKings = function(req, res){
	UserSchema.find().where('UserRole').equals('King').exec(function(err, user_info){
		if(err){
			res.send({ResponseCode:400, ResponseMessage: "Error"});
			console.log(err);
		}else{
			return res.json({ResponseCode:200, FeedList:user_info,ResponseMessage: "Success"});
		}
	})
}

exports.getAllSuperAdmin = function(req,res){
 			UserSchema.find()
 			.where('UserRole')
 			.nin(['SuperAdmin'])
 			.exec(function(err, user_info){
 				if(err){
 					return res.json({ResponseCode:400, ResponseMessage: "User not found."})
 				}else{
 					res.send({ResponseCode: 200, FeedList: user_info,ResponseMessage: "Success"});
 				}
 			})
}	
exports.getAllAdmin = function(req,res){
			console.log("API :"+req)
 			UserSchema.find()
 			.where('UserRole')
 			.nin(['Admin','SuperAdmin'])
 			.exec(function(err, user_info){
 				if(err){
 					return res.json({ResponseCode:400, ResponseMessage: "User not found."})
 				}else{
 					res.send({ResponseCode: 200, FeedList: user_info,ResponseMessage: "Success"});
 				}
 			})
}	

//------ Not Mentioned in Office Documents.
//----- Mailer (otp) start
exports.forgetPassword = function(req,res){
	console.log("============================>"+req.body.Email);
	if(!req.body.Email){
		res.json({code:400,message:"Please enter valid Email Id."})
	}
	else
	{
		UserSchema.findOne({Email:req.body.Email},function(err,data){
			if(err){
				throw err;
			}
			else if(!data){
				res.json({code:400, message:"Emain Id Dose't Exist."})
			}else{
				var smtpTransport = nodemailer.createTransport({
					   service: "Gmail",
					   auth: {
					   	user: "nj7870@gmail.com",
					   	pass: "Nikhil.1"
					   }
					});
				var text="";
				var otppossible ="1234567890asdfasdff";
				for(var i=0;i<5;i++)
				{
					text += otppossible.charAt(Math.floor(Math.random() * otppossible.length));

				}
				console.log("otp---",text);
					smtpTransport.sendMail({  //Email options
						from: "nikhil9839181726@gmail.com", // sender address.  Must be the same as authenticated user if using Gmail.
						to: req.body.Email, // receiver
						subject: "Forget password otp", // subject
						text: "Your otp is "+ text // body
						}, function(error, response){  //callback
							if(error){
								console.log(error);
								res.send({code:400, message:error})
							}else{
							//res.send({code:200, message:"mail sent."})
							data.otp = text;
							data.otpStatus = "otpSend";
							data.save(function(err,data){
								if(err){
									return res.json({code:400,message:"not found"})
								}else{
									return res.json({code:200,data:data})
								}
							})
						}
					});
				}
			})
	}
}
exports.verifyOtp= function(req,res){
	if(!req.body.otp){
		return res.json({code:400,message:"Please Enter OTP First."})
	}
	else
	{
		UserSchema.findOne({Email:req.body.Email},{Password:0},function(err,result)
		{
			if(err)
			{
				res.json({code:400,message:"Server Error."});
			}
			else
			{
				if(result.otp==req.body.otp)
				{
					result.otpStatus="verfied";
					result.save(function(err,result)
					{
						if(err)
						{
							res.json({code:400,message:"Data Not Found."});
						}
						else
						{
							res.json({code:200,message:"OTP Veified."});
						}

					});
				}
				else
				{
					res.json({code:401,message:"Incorrect OTP."})
				}
			}
		})
	}
}
exports.updatePwd = function(req,res){
	UserSchema.findOneAndUpdate({Email:req.body.Email},{$set:{Password:req.body.Password}},{new:true}, function(err, updateResult){
		if(err){
			res.send({code:400, message: "Interl Server Error."});
			console.log(err);
		}else{
			return res.json({code:202, message:"Password Updated.",Password:req.body.Password});
		}
	})

}

// case study ---start


exports.pushuserSignup = function(req, res){

	console.log("req body of userSignUp--", JSON.stringify(req.body)); 



	 //a) Email field not empty
	 if(req.body.DeviceId=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"deviceId is empty"})
	// //  //b) Password field not empty
	 if(req.body.Password=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Password field is empty"})



	DeviceSchema.findOne({DeviceId:req.body.DeviceId},function(err,result){
		if(err){

			 return res.json({ResponseCode:401, ResponseMessage: "Server Error."})
		}
		else if(result){
   					//email found
   				   res.send({ResponseCode: 401, ResponseMessage:"deviceId already exists"});
   				}
   				else{
   						//email not found...save
   						var bcryptPassword="";	
   						bcrypt.hash(req.body.Password, 9, function(err, hash) {
 			 			// Store hash in your password DB. 
			 			 bcryptPassword=hash;
			 			 req.body.Password=bcryptPassword;

			 			 console.log("bcryptPassword :" +bcryptPassword)

			 			 var deviceSchema = new DeviceSchema(req.body);

			 			 deviceSchema.save(function(err, resultUser){

			 			 	if(err){
			 			 			
			 			 		res.send({ResponseCode:400, ResponseMessage: err});
			 			 		console.log(err);
			 			 	}
			 			 	else{
			 			 			
			 			 		res.send({ResponseCode: 200, ResponseMessage:"Success.", RegisteredId:resultUser._id});
			 			 	}
			 			 });

						}); // end of bcrypt scope
   					}
   					
   				}) //end of findOne scope

}

exports.pushLogin = function(req, res){


	console.log("login : "+req.body.RegisteredId+" Password : "+ req.body.Password);

	 //validations ----start------


	 if(req.body.Email=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"deviceId is empty."})
	 if(req.body.Password=='')
	 	return res.json({ResponseCode:401, ResponseMessage:"Password field is empty."})




 	 DeviceSchema.findOne({_id:req.body.RegisteredId}, function(err, user_login_info){
 	 	if(err){
 	 		return res.json({ResponseCode:401, ResponseMessage:"Server error."})
 	 	}else if(!user_login_info){
 	 		return res.json({ResponseCode:401, ResponseMessage: "Incorrect deviceId"})
 	 	}else{
			//email database me mil gaya ..now match password using bcrypt.compare
			bcrypt.compare(req.body.Password, user_login_info.Password, function(err, result) {
    		// result == true 
    		if(result)
    		{
    			res.send({ResponseCode: 200, ResponseMessage:"Login Successful.",RegisteredId: user_login_info._id});

    		}
    		else {
    			res.send({ResponseCode: 400, ResponseMessage:"Incorrect Password"});
    		}			
			});	//end of bcrypt scope			
		}
	})
 	}

exports.pushgetAll = function(req, res){

	//get all the records of the table and display them on the screen

	DeviceSchema.find().exec(function(err, user_info){
		if(err){
			return res.json({ResponseCode:400, ResponseMessage: "Server Error"})
		}else{
			res.send({ResponseCode: 200, List: user_info,ResponseMessage: "Success"});
		}
	})



}


 exports.pushshowUserDetails = function(req, res){
 	
 	var _id = req.body.RegisteredId;
 	if(!_id){
 		return res.json({ResponseCode:400, ResponseMessage: "UserId is missing."})
 	}
 	DeviceSchema
 	.findOne({_id:_id})
 	.exec(function(err, user_info){
 		if(err){
 			res.send({ResponseCode:400, ResponseMessage: "Error"});
 			console.log(err);
 		}else{
 			return res.json({ResponseCode:200, List:user_info,ResponseMessage: "Success"});
 		}
 	})
 }


exports.pushsendMessage = function(req, res){

		var message = new gcm.Message({data: {message: req.body.Message}});
		var regTokens = [req.body.RegistrationId];
		var sender = new gcm.Sender("ENTER GCM API KEY");


		//save the message details in the schema sendMessageArray

		//uncomment after you get the API key from GCM

		// sender.send(message, { registrationTokens: regTokens }, function (err, response) {

		// 	if (err){

		// 		console.error(err);
		// 		res.send({ResponseCode:400, ResponseMessage: "Error."});
			

			//} else     {


			//update Message details in the schema after message sent successfully using gcm

			 console.log("req.body.FromRegistrationId"+req.body.FromRegistrationId +"req.body.ToRegistrationId :" +req.body.ToRegistrationId)

			DeviceSchema.findOneAndUpdate({_id:req.body.FromRegistrationId},{$push:{SendMessageDetails:{RegisteredID:req.body.ToRegistrationId,Message:req.body.Message}}},{new:true}, function(err, result){
			
			if(err){
			res.send({code:400, message: "Error"});
	
			}
			else
			{

					res.send({ResponseCode:200, ResponseMessage: "Message Sent",Data:result});
			}
            });

			
				
			//}

		//});

	}

 exports.pushrecieveNotification = function(req, res){


	var _id = req.body.RegistrationId;

	console.log("req.body.RegistrationId "+req.body.RegistrationId)
	if(!_id){
		res.send({ResponseCode:400, ResponseMessage: "RegistrationId is missing."})
	}	
	DeviceSchema.findOneAndUpdate({_id:_id},{$set:{RecieveNotification:false}},{new:true}, function(err, updateResult){
		if(err){
			res.send({ResponseCode:400, ResponseMessage: "Interal Server Error."});
			console.log(err);
		}else{
			 res.send({ResponseCode:200, ResponseMessage:"Notification facility disabled",updateResult:updateResult});
		}
	})	


	}


exports.pushdeleteDevices = function(req, res){

DeviceSchema.remove({_id: req.body.RegisteredId}, function(err, userDeleted){
 		return res.json({ResponseCode:200, ResponseMessage:"Device deleted"});

})
}




