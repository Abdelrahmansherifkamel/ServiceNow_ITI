app.controller('medicineController', function($scope, $http, SUPABASE_CONFIG, medicineService, companyService) {
    $scope.medicines = [];
    $scope.isEditing = false;
    $scope.newMedicine = {};
    $scope.companies = [];

    // Check admin role from local storage
    var adminUser = JSON.parse(localStorage.getItem('adminUser'));
    $scope.adminRole = adminUser ? adminUser.role : null;

    // Load medicines from DB
    $scope.loadMedicines = function() {
        medicineService.getAll().then(function(res) {
            $scope.medicines = res.data;
        });
    };

    // Load companies for dropdown
    $scope.loadCompanies = function() {
        companyService.getAll().then(function(res) {
            $scope.companies = res.data;
        });
    };

    // Call on controller load
    $scope.loadMedicines();
    $scope.loadCompanies();

    // 1. Validation: Check for Duplicate Names
    $scope.addMedicine = function() {
        // Check if name already exists in our local array
        var exists = $scope.medicines.some(function(m) {
            return m.name.toLowerCase() === $scope.newMedicine.name.toLowerCase() && m.id !== $scope.newMedicine.id;
        });

        if (exists) {
            alert("Error: A medicine with this name already exists in the inventory!");
            return;
        }

        if ($scope.isEditing) {
            $scope.updateMedicine();
        } else {
            $scope.saveNewMedicine();
        }
    };

    // 2. Save New Record
    $scope.saveNewMedicine = function() {
        $http.post(SUPABASE_CONFIG.URL + "medicines", $scope.newMedicine, {
            headers: { 'apikey': SUPABASE_CONFIG.API_KEY, 'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY }
        }).then(function() {
            alert("Medicine added successfully!");
            $scope.resetForm();
            $scope.loadMedicines(); // Refresh list
        });
    };

    // 3. Load Data into Form for Editing
    $scope.editMedicine = function(medicine) {
        $scope.isEditing = true;
        // Create a copy so changes don't reflect in table until saved
        $scope.newMedicine = angular.copy(medicine);
        // Scroll to top of form
        window.scrollTo(0, 0);
    };

    // 4. Update Existing Record
    $scope.updateMedicine = function() {
        var id = $scope.newMedicine.id;
        // Remove joined object before sending back to DB
        delete $scope.newMedicine.companies; 

        $http.patch(SUPABASE_CONFIG.URL + "medicines?id=eq." + id, $scope.newMedicine, {
            headers: { 'apikey': SUPABASE_CONFIG.API_KEY, 'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY }
        }).then(function() {
            alert("Medicine updated successfully!");
            $scope.resetForm();
            $scope.loadMedicines();
        });
    };

    // 5. Delete Record
    $scope.deleteMedicine = function(id) {
        if ($scope.adminRole !== 'manager') {
            alert("Only managers can delete medicines.");
            return;
        }
        $http.delete(SUPABASE_CONFIG.URL + "medicines?id=eq." + id, {
            headers: { 'apikey': SUPABASE_CONFIG.API_KEY, 'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY }
        }).then(function() {
            alert("Medicine deleted.");
            $scope.loadMedicines();
        });
    };

    $scope.resetForm = function() {
        $scope.newMedicine = {};
        $scope.isEditing = false;
    };
});