app.service('InvoiceMedicineService', function ($http) {
    const ApiLink = "https://gwbcssuizkovahvvpakw.supabase.co/rest/v1/invoice_items"
    const ApiKey = "sb_publishable_yQdWZgva3wXi65JrTiFU8A_gX5Ld0BJ"
    const headers = {
        "apikey": ApiKey,
        "Authorization": "Bearer " + ApiKey,
        "Content-Type": "application/json"
    }
    
    this.ConnectInvoice_Medicine = function (Connection) {
        return $http.post(ApiLink , Connection, { headers: headers })
    }
    this.getMedicine_ByInvoice = function (invoiceID) {
        return $http.get(ApiLink + "?invoice_id=eq." + invoiceID, { headers, headers })
    }
    this.EditMedicine_Invoice = function(MedInvo){
        return $http.patch(ApiLink + "?invoice_id=eq." + MedInvo.id, MedInvo, { headers: headers })
    }
    this.EditSingleMedicine_Invoice = function(MedInvo){
        return $http.patch(ApiLink + "?id=eq." + MedInvo.id, MedInvo, { headers: headers })
    }
    this.DeleteMedicines_FromInvoice = function (invoiceID) {
        return $http.delete(ApiLink + "?invoice_id=eq." + invoiceID, { headers: headers })
    }
    this.DeleteSingleMedicine_FromInvoice = function (ID) {
        return $http.delete(ApiLink + "?id=eq." + ID, { headers: headers })
    }
});