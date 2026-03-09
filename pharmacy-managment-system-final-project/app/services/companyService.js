app.service("companyService", function($http, SUPABASE_CONFIG) {

    var headers = {
        apikey: SUPABASE_CONFIG.API_KEY,
        Authorization: "Bearer " + SUPABASE_CONFIG.API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation"
    };

    this.getAll = function() {
        return $http.get(SUPABASE_CONFIG.URL + "companies", { headers: headers });
    };

    this.add = function(company) {
        return $http.post(SUPABASE_CONFIG.URL + "companies", company, { headers: headers });
    };

    this.delete = function(id) {
        return $http.delete(SUPABASE_CONFIG.URL + "companies?id=eq." + id, { headers: headers });
    };

});