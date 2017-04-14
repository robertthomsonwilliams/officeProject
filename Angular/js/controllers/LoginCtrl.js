app.controller('LoginCtrl', function($scope, $window, $state, ListUsers) {

    $(window).scrollTop(0, 0);


    $scope.login = function() {
            var data = {
            "Email":$scope.Email,
            "Password":$scope.Password
            }            
        console.log("Email : "+data.Email + " Password : "+data.Password);

        ListUsers.LoginSuperadminOrAdmin(data).success(function(res) {

            if (res.ResponseCode == 200) {

                alert(res.ResponseMessage);   

                if(res.UserRole=="SuperAdmin")
                {
                    localStorage.setItem("UserRole","SuperAdmin");
                    
                    //localStorage.setItem("FirstName",res.FirstName);

                     $state.go('ListUsersSuperAdmin')
                }
                 else if(res.UserRole=="Admin")
                {
                      localStorage.setItem("UserRole","Admin");
                       //localStorage.setItem("FirstName",res.FirstName);

                     $state.go('ListUsersAdmin')
                }
            

            } else if (res.ResponseCode == 400) {
                alert(res.ResponseMessage);
            }
        }).error(function(status, data) {
        })
    }
})
