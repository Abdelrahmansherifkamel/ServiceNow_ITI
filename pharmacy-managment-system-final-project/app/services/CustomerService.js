app.service('CustomerService', function ($http) {
    const ApiLink = "https://gwbcssuizkovahvvpakw.supabase.co/rest/v1/customers"
    const ApiKey = "sb_publishable_yQdWZgva3wXi65JrTiFU8A_gX5Ld0BJ"
    const headers = {
        "apikey": ApiKey,
        "Authorization": "Bearer " + ApiKey,
        "Content-Type": "application/json"
    }
    this.getCustomers = function () {
        return $http.get(ApiLink, { headers: headers })
    }
    this.getCustomerByID = function (id) {
        return $http.get(ApiLink + "?id=eq." + id, { headers: headers })
    }
    this.AddCustomer = function (Customer) {
        return $http.post(ApiLink, Customer, { headers: headers })
    }
    this.EditCustomer = function (Customer) {
        return $http.patch(ApiLink + "?id=eq." + Customer.id, Customer, { headers: headers })
    }
    this.DeleteCustomer = function (id) {
        return $http.delete(ApiLink + "?id=eq." + id, { headers: headers })
    }
    this.EditCustomer = function (Customer) {
        $scope.ChosenCustomer = angular.copy(Customer);
    };
})