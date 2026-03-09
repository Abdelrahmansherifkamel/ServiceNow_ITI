app.controller('LoginController', function($scope, $http, $location, SUPABASE_CONFIG) {
    $scope.user = {};
    $scope.loading = false;
    $scope.errorMessage = "";

    $scope.login = function() {
        if (!$scope.user.email || !$scope.user.password) {
            alert("Please enter both email and password.");
            return;
        }

        $scope.loading = true;
        $scope.errorMessage = "";

        // Normalize email to lowercase
        var emailQuery = encodeURIComponent($scope.user.email.trim().toLowerCase());
        var passwordQuery = encodeURIComponent($scope.user.password);

        var queryUrl = SUPABASE_CONFIG.URL + "admin?email=eq." + emailQuery + 
                       "&password=eq." + passwordQuery + 
                       "&select=id,name,email,role";

        $http({
            method: 'GET',
            url: queryUrl,
            headers: {
                'apikey': SUPABASE_CONFIG.API_KEY,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.loading = false;

            if (response.data && response.data.length > 0) {
                const adminData = response.data[0];

                // 1. Save the full record for general use
                localStorage.setItem('adminUser', JSON.stringify(adminData));
                
                // 2. Save role and name specifically for easy access in other controllers
                localStorage.setItem('adminRole', adminData.role); 
                localStorage.setItem('adminName', adminData.name);

                // Success notification
                alert("Welcome back, " + adminData.name + " (" + adminData.role + ")");
                
                // Redirect to the dashboard route
                $location.path('/dashboard');
            } else {
                $scope.errorMessage = "Invalid credentials";
                alert("Login failed: Incorrect email, password, or role not assigned.");
            }

        }, function errorCallback(error) {
            $scope.loading = false;
            console.error("Supabase Connection Error:", error);
            $scope.errorMessage = "Database connection failed. Check your API keys.";
        });
    };
});