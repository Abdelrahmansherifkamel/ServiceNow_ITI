app.service("medicineService", function($http, SUPABASE_CONFIG) {

    var headers = {
        apikey: SUPABASE_CONFIG.API_KEY,
        Authorization: "Bearer " + SUPABASE_CONFIG.API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation"
    };

    this.getAll = function() {
        return $http.get(
            SUPABASE_CONFIG.URL + "medicines?select=*,companies(name)",
            { headers: headers }
        );
    };

    this.add = function(medicine) {
        return $http.post(SUPABASE_CONFIG.URL + "medicines", medicine, { headers: headers });
    };
    this.getMedicines = function () {
        return $http.get(SUPABASE_CONFIG.URL + "medicines", { headers: headers })
    }
    this.getMedicineByID = function (id) {
        return $http.get(SUPABASE_CONFIG.URL + "medicines?id=eq." + id, { headers: headers })
    }
   
    this.EditMedicine = function (Medicine) {
        return $http.patch(SUPABASE_CONFIG.URL + "medicines?id=eq." + Medicine.id, Medicine, { headers: headers })
    }

});