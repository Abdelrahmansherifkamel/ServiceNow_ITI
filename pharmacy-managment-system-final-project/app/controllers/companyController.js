app.controller('companyController', function($scope, $http, $location, SUPABASE_CONFIG) {
    var adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser || adminUser.role !== 'manager') {
        alert("Access denied: Only managers can view this page.");
        $location.path('/dashboard');
        return;
    }

    $scope.companies = [];
    $scope.newCompany = {};
    $scope.isEditing = false;
    $scope.searchQuery = ""; // For the table filter

    const headers = {
        'apikey': SUPABASE_CONFIG.API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    // Load Companies from Supabase
    $scope.loadCompanies = function() {
        $http.get(SUPABASE_CONFIG.URL + "companies?select=*", { headers: headers })
            .then(res => {
                $scope.companies = res.data;
            })
            .catch(err => {
                console.error("Error loading companies:", err);
            });
    };

    // Save or Update with Validation Logic
    $scope.saveCompany = function() {
        // 1. Validation: Ensure Name is provided
        if (!$scope.newCompany.name || $scope.newCompany.name.trim() === "") {
            alert("Company name is required.");
            return;
        }

        // 2. Validation: Check for Duplicate Names (Case-Insensitive)
        var isDuplicate = $scope.companies.some(function(c) {
            // If editing, exclude the current company from the duplicate check using ID
            return c.name.toLowerCase() === $scope.newCompany.name.toLowerCase() && c.id !== $scope.newCompany.id;
        });

        if (isDuplicate) {
            alert("Validation Error: A company named '" + $scope.newCompany.name + "' already exists.");
            return;
        }

        // 3. Validation: Basic Email Format Check
        if ($scope.newCompany.email) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test($scope.newCompany.email)) {
                alert("Please enter a valid email address.");
                return;
            }
        }

        // 4. Execution: Update or Insert
        if ($scope.isEditing) {
            // Update existing record
            $http.patch(`${SUPABASE_CONFIG.URL}companies?id=eq.${$scope.newCompany.id}`, $scope.newCompany, { headers: headers })
                .then(() => { 
                    alert("Profile Updated Successfully"); 
                    $scope.resetForm(); 
                    $scope.loadCompanies(); 
                });
        } else {
            // Create new record
            $http.post(SUPABASE_CONFIG.URL + "companies", $scope.newCompany, { headers: headers })
                .then(() => { 
                    alert("Company Registered Successfully"); 
                    $scope.resetForm(); 
                    $scope.loadCompanies(); 
                });
        }
    };

    // Delete Company Record
    $scope.deleteCompany = function(id) {
        if (confirm("Warning: Deleting this company may affect medicines linked to it. Continue?")) {
            $http.delete(`${SUPABASE_CONFIG.URL}companies?id=eq.${id}`, { headers: headers })
                .then(() => {
                    alert("Company deleted.");
                    $scope.loadCompanies();
                });
        }
    };

    // Prepare Form for Editing
    $scope.editCompany = function(c) {
        $scope.isEditing = true;
        // Use angular.copy to prevent the table from updating instantly while typing
        $scope.newCompany = angular.copy(c);
        // Scroll to the top so the admin sees the form is ready
        window.scrollTo(0, 0); 
    };

    // Reset Form State
    $scope.resetForm = function() {
        $scope.newCompany = {};
        $scope.isEditing = false;
    };

    // Initial Data Load
    $scope.loadCompanies();
});