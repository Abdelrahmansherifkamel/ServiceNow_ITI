app.controller('dashboardController', function($scope, $http, $location, SUPABASE_CONFIG) {
    // 1. Session Security
    var loggedInUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!loggedInUser) {
        $location.path('/login');
        return;
    }
    
    $scope.adminName = loggedInUser.name;
    // Ensure we use the role from the object or the direct localStorage key
    $scope.adminRole = loggedInUser.role || localStorage.getItem('adminRole');

    $scope.stats = {
        customers: 0,
        medicines: 0,
        outOfStock: 0,
        invoices: 0,
        companies: 0
    };
    $scope.pharmacists = [];

    const commonHeaders = {
        'apikey': SUPABASE_CONFIG.API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY
    };

    // 2. Fetch Stats
    function getStats() {
        // Total Customers
        $http.get(SUPABASE_CONFIG.URL + "customers?select=id", { headers: commonHeaders })
            .then(res => $scope.stats.customers = res.data.length);

        // Total Medicines
        $http.get(SUPABASE_CONFIG.URL + "medicines?select=id,quantity", { headers: commonHeaders })
            .then(res => {
                $scope.stats.medicines = res.data.length;
                // Calculate Out of Stock locally from the same request to save API calls
                $scope.stats.outOfStock = res.data.filter(m => m.quantity <= 0).length;
            });

        // Total Invoices
        $http.get(SUPABASE_CONFIG.URL + "invoices?select=id", { headers: commonHeaders })
            .then(res => $scope.stats.invoices = res.data.length);

        // Total Companies (If Manager)
        if ($scope.adminRole === 'manager') {
            $http.get(SUPABASE_CONFIG.URL + "companies?select=id", { headers: commonHeaders })
                .then(res => $scope.stats.companies = res.data.length);
            
            loadPharmacistPerformance();
        }
    }

    // 3. Requirement: Pharmacist Performance Table
    function loadPharmacistPerformance() {
        // Fetch all users with role pharmacist
        $http.get(SUPABASE_CONFIG.URL + "admin?role=eq.pharmacist&select=id,name,email", { headers: commonHeaders })
            .then(res => {
                $scope.pharmacists = res.data;
                
                // For each pharmacist, count their specific invoices
                $scope.pharmacists.forEach(p => {
                    // Assuming your invoices table has a 'created_by' or 'pharmacist_id' column
                    $http.get(SUPABASE_CONFIG.URL + "invoices?created_by=eq." + p.id + "&select=id", { headers: commonHeaders })
                        .then(invRes => {
                            p.invoice_count = invRes.data.length;
                        }).catch(() => p.invoice_count = 0);
                });
            });
    }

    // 4. Requirement: Visualizations
    function renderCharts() {
        $http.get(SUPABASE_CONFIG.URL + "medicines?select=name,quantity,companies(name)", {
            headers: {
                'apikey': SUPABASE_CONFIG.API_KEY,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.API_KEY
            }
        }).then(function(res) {
            const medicines = res.data;

            // PIE CHART: Medicines per Manufacturer (company)
            const companyCount = {};
            medicines.forEach(m => {
                const company = m.companies ? m.companies.name : 'Unknown';
                companyCount[company] = (companyCount[company] || 0) + 1;
            });
            const pieLabels = Object.keys(companyCount);
            const pieData = Object.values(companyCount);

            const pieCanvas = document.getElementById('manufacturerPieChart');
            if (pieCanvas) {
                new Chart(pieCanvas, {
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieData,
                            backgroundColor: [
                                '#28a745', '#007bff', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'
                            ]
                        }]
                    }
                });
            }

            // BAR CHART: Medicine Quantity
            const barLabels = medicines.map(m => m.name);
            const barData = medicines.map(m => m.quantity);

            const barCanvas = document.getElementById('medicineQuantityBarChart');
            if (barCanvas) {
                new Chart(barCanvas, {
                    type: 'bar',
                    data: {
                        labels: barLabels,
                        datasets: [{
                            label: 'Quantity',
                            data: barData,
                            backgroundColor: '#007bff'
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }
        });
    }

    // Call after stats are loaded
    setTimeout(renderCharts, 500);

    $scope.logout = function() {
        localStorage.clear();
        $location.path('/login');
    };

    // Initialize
    getStats();
    // Use a slight delay to ensure Chart.js canvas elements are rendered in the DOM
    setTimeout(renderCharts, 500);
});