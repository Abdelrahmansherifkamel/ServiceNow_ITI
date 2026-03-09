app.controller("adminController", function($scope, $location, adminService) {

    $scope.user = {};

    $scope.login = function() {
        adminService.login($scope.user.email, $scope.user.password)
        .then(function(response) {
            if(response.data.length > 0){
                alert("Login successful");
                $location.path("/dashboard"); // Redirect to dashboard
            } else {
                alert("Invalid credentials");
            }
        });
    };

});