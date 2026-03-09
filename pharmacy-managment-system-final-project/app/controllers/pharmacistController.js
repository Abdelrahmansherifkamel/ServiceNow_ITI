app.controller('pharmacistController', function($scope, $http, SUPABASE_CONFIG) {
    $scope.pharmacists = [];

    function loadPharmacists() {
        $http.get(SUPABASE_CONFIG.URL + "admin?role=eq.pharmacist", {
            headers: {
                'apikey': SUPABASE_CONFIG.API_KEY,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY
            }
        }).then(function(res) {
            $scope.pharmacists = res.data;
        });
    }
    loadPharmacists();

    // Add pharmacist
    $scope.addPharmacist = function () {
        $http.post(SUPABASE_CONFIG.URL + "admin", $scope.newPharmacist, {
            headers: {
                'apikey': SUPABASE_CONFIG.API_KEY,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        }).then(function () {
            alert("Pharmacist added!");
            $scope.newPharmacist = {};
            loadPharmacists();
        }, function () {
            alert("Failed to add pharmacist.");
        });
    };

    // Edit pharmacist
    $scope.editPharmacist = function(pharmacist) {
        $scope.editingPharmacist = angular.copy(pharmacist);
        // Show modal if you have one
    };

    $scope.savePharmacistEdit = function() {
        $http.patch(SUPABASE_CONFIG.URL + "admin?id=eq." + $scope.editingPharmacist.id, $scope.editingPharmacist, {
            headers: {
                'apikey': SUPABASE_CONFIG.API_KEY,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        }).then(function () {
            alert("Pharmacist updated!");
            $scope.editingPharmacist = null;
            loadPharmacists();
        }, function () {
            alert("Failed to update pharmacist.");
        });
    };

    // Delete pharmacist
    $scope.deletePharmacist = function(id) {
        if(confirm("Are you sure you want to delete this pharmacist?")) {
            $http.delete(SUPABASE_CONFIG.URL + "admin?id=eq." + id, {
                headers: {
                    'apikey': SUPABASE_CONFIG.API_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY
                }
            }).then(function () {
                alert("Pharmacist deleted!");
                loadPharmacists();
            }, function () {
                alert("Failed to delete pharmacist.");
            });
        }
    };
});