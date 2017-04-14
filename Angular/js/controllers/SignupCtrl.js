
app.controller('SignupCtrl', function($scope,$window, $state, ListUsers) {

    $(window).scrollTop(0, 0);

   // $scope={}; --> this will make every model element of view as null so dont do it
 
    $scope.signup = function(){
          var FirstName =   $scope.modelFirstName ;
          var LastName =   $scope.modelLastName ;
          var UserRole =   $scope.modelUserRole ;
          var Email =   $scope.modelEmail ;
          var Status =   "Active" ;
          var Password =   $scope.modelPassword ;

          var data = {
            "FirstName":FirstName,
            "LastName":LastName,
            "UserRole":UserRole,
            "Email":Email,
            "Status":Status,
            "Password":Password
            }
            console.log("data is : " +data)

      ListUsers.SignupAdmin(data).success(function(res) {
          
        if (res.ResponseCode == 200) {
          alert("Sign up successful");
            $state.go('Login')
               
        }

         else if (res.ResponseCode == 400) {
            console.log("error");
        }


    }).error(function(status, data) {
    })

        
	
    }

})
