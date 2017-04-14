app.controller('ListUsersAdminCtrl', function($scope, $window,  $state,ListUsers) {
    $(window).scrollTop(0, 0);

    $scope.isVisible = false; // will hide div

   var localParentFirstName= localStorage.getItem("FirstName");

    ListUsers.ListUsersAdmin().success(function(res) {
        if (res.ResponseCode == 200) {
        	
            $scope.currentPage = 0;
            $scope.pageSize = 2;


             
            var count=Object.keys(res.FeedList).length;

            console.log("count"+count);

            $scope.numberOfPages=function(){
                return Math.ceil(count/$scope.pageSize);                
            }

                $scope.ListOfUsers = res.FeedList;
                
       
            //console.log("List =====>" + JSON.stringify(res))         
    

        } 


        else if (res.ResponseCode == 400) {
        alert(res.responseMessage);
        }
    }).error(function(status, data) {
    })


//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});



    $scope.delete = function(UserId) {       
         var data = {
            "UserId":UserId
            }
           
        ListUsers.DeleteUserSuperadminOrAdmin(data).success(function(res) {
            if (res.ResponseCode == 200) {
             
                ListUsers.ListUsersAdmin().success(function(res) {
                    $scope.ListOfUsers = res.FeedList

                  
                     $state.go('ListUsersAdmin');
                

                }).error(function(status, data) {
                })
            } 
            else if (res.ResponseCode == 400) {
                alert(res.responseMessage);
            }
                
        }).error(function(status, data) {
        })
    }





})
