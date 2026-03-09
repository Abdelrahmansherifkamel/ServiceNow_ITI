app.service("adminService", function($http, SUPABASE_CONFIG) {

    var headers = {
        apikey: SUPABASE_CONFIG.API_KEY,
        Authorization: "Bearer " + SUPABASE_CONFIG.API_KEY
    };

    this.login = function(email, password) {
        return $http.get(
            SUPABASE_CONFIG.URL + "admin?email=eq." + email + "&password=eq." + password,
            { headers: headers }
        );
    };

});