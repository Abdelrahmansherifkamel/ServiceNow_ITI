app.controller('AddCustomerController', function ($scope, CustomerService) {

    $scope.NewCustomer = {}
    $scope.AddNewCustomer = function () {

        CustomerService.AddCustomer($scope.NewCustomer)
            .then(function () {
                alert("New Customer Added")
                $scope.NewCustomer = {}
            })
            .catch(function (error) {
                console.log("Error Adding New Customer ", error)
            })

    }
    $scope.ClearInputFields = function(){
    $scope.NewCustomer = {}
    }


});