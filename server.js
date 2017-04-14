
var express = require('express'),
	app = express(),
 	bodyParser =  require('body-parser'),
	config = require('./config'),
	mongoose = require('mongoose'),
	user_action = require('./user_action')
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db);

//cloudinary
var cloudinary = require('cloudinary');

//Setting Cloudinary configuration
          cloudinary.config({ 
         'cloud_name': config.cloudinary_cloud_name, 
         'api_key': config.cloudinary_api_key, 
         'api_secret': config.cloudinary_api_secret
   });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/');
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json({
    limit: '500mb'
}));
app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 5000000
}));

app.use(express.static('Angular'));
app.post('/userSignup',user_action.userSignup);//done
app.post('/Login',user_action.login);//done
app.post('/createProfile',user_action.createProfile);//update profile
app.post('/storeImages',user_action.storeImages);// Image 
app.post('/getLastImage',user_action.getLastImage);
app.post('/storeImagesCloundinary',user_action.storeImagesCloundinary);//Store Images by 
app.post('/showUserDetails',user_action.showUserDetails);
app.post('/deleteUserDetails',user_action.deleteUserDetails);
app.post('/showRoleData',user_action.showRoleData);// Master API for ALL Roles
app.post('/getAllMinusKing',user_action.getAllMinusKing);//done
app.post('/getGirls',user_action.getGirls);//done
app.post('/getBoys',user_action.getBoys);//done
app.post('/getKings',user_action.getKings);//done



//ADMIN 
app.post('/Admin/SignupAdmin',user_action.userSignup);//For Admin Signup by Admin
app.get('/Admin/ListUsersAdmin',user_action.getAllAdmin);//  For Superadmin list of users


//SUPERADMIN
app.get('/Superadmin/ListUsersSuperadmin',user_action.getAllSuperAdmin);//  For Superadmin list of users
app.post('/Superadmin/AddAdminDetailsSuperAdmin',user_action.userSignup);//For Admin Add by SuperAdmin


//BOTH
app.post('/SuperadminOrAdmin/LoginSuperadminOrAdmin',user_action.login);//For Superadmin/Admin Login
app.put('/SuperadminOrAdmin/DeleteUserSuperadminOrAdmin',user_action.DeleteUserSuperadminOrAdmin);//For Superadmin/Admin disable status
app.post('/SuperadminOrAdmin/FillDefaultDetailsSuperadminOrAdmin',user_action.FillDefaultDetailsSuperAdminOrAdmin);//For Superadmin/Admin showUserDetails
app.post('/SuperadminOrAdmin/editUsersDetailsSuperadminOrAdmin',user_action.editUsersDetailsAdminOrSuperAdmin);//For Superadmin/Admin modify profile


//Forget Password Collection.
app.post('/forgetPassword',user_action.forgetPassword);//done
app.post('/verifyOtp',user_action.verifyOtp);//done
app.post('/updatePwd',user_action.updatePwd);//done



//case study-push notification

app.post('/push/userSignup',user_action.pushuserSignup);//done
app.post('/push/Login',user_action.pushLogin);//done

app.post('/push/getAll',user_action.pushgetAll);//done
app.post('/push/showUserDetails',user_action.pushshowUserDetails);//done

app.post('/push/sendMessage',user_action.pushsendMessage);//done
app.post('/push/recieveNotification',user_action.pushrecieveNotification);//done
app.post('/push/deleteDevice',user_action.pushdeleteDevices);//done






// start the server
app.listen(config.port,function(){
	console.log("welcome to the node.js world" +config.port);
});
