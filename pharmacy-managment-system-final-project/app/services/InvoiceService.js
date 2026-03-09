app.service('InvoiceService', function ($http, SUPABASE_CONFIG) {
    const ApiLink = SUPABASE_CONFIG.URL + "invoices";
    const headers = {
        "apikey": SUPABASE_CONFIG.API_KEY,
        "Authorization": "Bearer " + SUPABASE_CONFIG.API_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    };

    this.getInvoices = function () {
        return $http.get(ApiLink, { headers: headers });
    };

    this.getInvoiceByID = function (id) {
        return $http.get(ApiLink + "?id=eq." + id, { headers: headers });
    };

    this.AddInvoice = function (Invoice) {
        return $http.post(ApiLink, Invoice, { headers: headers });
    };

    this.EditInvoice = function (Invoice) {
        return $http.patch(ApiLink + "?id=eq." + Invoice.id, Invoice, { headers: headers });
    };

    this.DeleteInvoice = function (id) {
        return $http.delete(ApiLink + "?id=eq." + id, { headers: headers });
    };
});