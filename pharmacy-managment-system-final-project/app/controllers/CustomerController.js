app.controller('CustomerController', function ($scope, $http, SUPABASE_CONFIG) {

    $scope.CustomersList = [];
    $scope.newCustomer = {};
    $scope.ChosenCustomer = {};

    $scope.adminRole = localStorage.getItem('adminRole');
    // Use a shared header object to prevent repetition
    const headers = {
        'apikey': SUPABASE_CONFIG.API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY,
        'Content-Type': 'application/json'
    };

    // 1. Load customers (Changed to $scope so it can be called from outside if needed)
    $scope.loadCustomers = function() {
        $http.get(SUPABASE_CONFIG.URL + "customers?order=name.asc", { headers: headers })
            .then(function (res) {
                $scope.CustomersList = res.data; // This matches your ng-repeat="c in CustomersList"
            })
            .catch(function(err) {
                console.error("Supabase Fetch Error:", err);
            });
    };

    // 2. Add customer
    $scope.addCustomer = function () {
        $http.post(SUPABASE_CONFIG.URL + "customers", $scope.newCustomer, { headers: headers })
            .then(function () {
                alert("Customer registered successfully!");
                $scope.newCustomer = {}; // Reset the form fields
                $scope.loadCustomers(); // Refresh the table
            })
            .catch(function (err) {
                alert("Failed to add customer. Check RLS policies in Supabase.");
            });
    };

    // 3. Edit customer - Matching your HTML'ng-click="editCustomer(c)"
    $scope.EditCustomer = function (customer) {
        $scope.ChosenCustomer = angular.copy(customer);
        // Triggering the modal using native Bootstrap 5
        var myModal = new bootstrap.Modal(document.getElementById('editModal'));
        myModal.show();
    };

    // 4. Save edit
    $scope.SaveEditCustomer = function () {
        // We use PATCH to only update changed fields
        $http.patch(SUPABASE_CONFIG.URL + "customers?id=eq." + $scope.ChosenCustomer.id, 
            {
                name: $scope.ChosenCustomer.name,
                phone: $scope.ChosenCustomer.phone,
                address: $scope.ChosenCustomer.address,
                medical_illness: $scope.ChosenCustomer.medical_illness
            }, { headers: headers })
            .then(function () {
                alert("Customer updated!");
                // Hide modal
                var modalInstance = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                if (modalInstance) modalInstance.hide();
                $scope.loadCustomers();
            })
            .catch(function (err) {
                alert("Update failed.");
            });
    };

    // 5. Delete customer
    $scope.deleteCustomer = function (id) {
        if (confirm("Are you sure you want to delete this customer?")) {
            $http.delete(SUPABASE_CONFIG.URL + "customers?id=eq." + id, { headers: headers })
                .then(function () {
                    $scope.loadCustomers();
                });
        }
    };

    // Initialize the list on load
    $scope.loadCustomers();
});