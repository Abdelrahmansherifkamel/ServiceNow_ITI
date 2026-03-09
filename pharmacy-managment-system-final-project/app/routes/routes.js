app.config(function ($routeProvider) {

    $routeProvider

        .when("/login", {
            templateUrl: "app/views/login.html",
            controller: "LoginController"
        })

        .when("/companies", {
            templateUrl: "app/views/companies.html",
            controller: "companyController"
        })

        .when("/medicines", {
            templateUrl: "app/views/medicines.html",
            controller: "medicineController"
        })
        .when("/dashboard", {
            templateUrl: "app/views/dashboard.html",
            controller: "dashboardController"
        })
        .when("/pharmacists", {
            templateUrl: "app/views/pharmacist.html",
            controller: "pharmacistController"
        })
        .when("/invoices", {
            templateUrl: "app/views/InvoicesView.html",
            controller: "InvoiceController"
        })
        .when("/customers", {
            templateUrl: "app/views/CustomersView.html",
            controller: "CustomerController"
        })
        .when("/AddInvoicView/:id", {
            templateUrl: "app/views/AddInvoicView.html",
            controller: "AddInvoiceController"

        })
        .when("/EditInvoiceView/:id", {
            templateUrl: "app/views/EditInvoiceView.html",
            controller: "EditInvoiceController"
        })
        .otherwise({
            redirectTo: "/login"
        });

});