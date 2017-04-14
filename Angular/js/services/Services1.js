
app.service('ListUsers',function($http){
this.myForm={};
	return{

    //BOTH ADMIN AND SUPERADMIN
    LoginSuperadminOrAdmin: function(data) {
      return $http.post('/SuperadminOrAdmin/LoginSuperadminOrAdmin', data);
    },
     DeleteUserSuperadminOrAdmin: function(data) {
      return $http.put('/SuperadminOrAdmin/DeleteUserSuperadminOrAdmin',data);
    },
    FillDefaultDetailsSuperadminOrAdmin: function(data) {
      return $http.post('/SuperadminOrAdmin/FillDefaultDetailsSuperadminOrAdmin',data);
    },
    editUsersDetailsSuperadminOrAdmin: function(data) {
      return $http.post('/SuperadminOrAdmin/editUsersDetailsSuperAdminOrAdmin',data);
    },

    //ONLY SUPERADMIN
    ListUsersSuperAdmin: function() {
      return $http.get('/Superadmin/ListUsersSuperadmin');
    }, 
     AddAdminDetailsSuperAdmin: function(data) {
      return $http.post('/Superadmin/AddAdminDetailsSuperAdmin',data);
    },

    //ONLY ADMIN
     ListUsersAdmin: function() {
      return $http.get('/Admin/ListUsersAdmin');
    },
     SignupAdmin: function(data) {
      return $http.post('/Admin/SignupAdmin',data);
    }
	}


});