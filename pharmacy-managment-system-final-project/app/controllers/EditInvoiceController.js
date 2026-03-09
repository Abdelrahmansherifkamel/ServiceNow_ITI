app.controller('EditInvoiceController', function ($scope, $routeParams, InvoiceService, InvoiceMedicineService, CustomerService, medicineService) {

    $scope.InvoiceID = $routeParams.id
    $scope.InvoiceCustomer = ""
    $scope.Invoice_medList = []
    $scope.Invoice = {}
    $scope.MedicineList = []

    $scope.AddNewRow = function () {
        $scope.Temp_Invoice_medList.push({
            MedicineInfo: {},
            id: 0,
            invoice_id: 0,
            medicine_id: 0,
            price: 0,
            quantity: 0,
            subtotal: 0

        });
    };

    $scope.UpdateTotal = function (row) {

        row.price = row.MedicineInfo.price
        row.subtotal = row.price * row.quantity
        if (row.quantity > row.MedicineInfo.quantity) {
            alert('The Needed Quantity exceeded the Available Quanity ')
            row.quantity = row.MedicineInfo.quantity
        }
        $scope.CalacuateTotal()
    };
    $scope.CalacuateTotal = function () {
        var totalPrice = 0
        $scope.Temp_Invoice_medList.forEach(function (med) {
            totalPrice += med.quantity * med.price;
        });
        $scope.TotalPrice = totalPrice

    }

    medicineService.getMedicines()
        .then(function (response) {
            $scope.MedicineList = response.data
        })

    InvoiceService.getInvoiceByID($scope.InvoiceID)
        .then(function (response) {

            $scope.Invoice = response.data[0]
            $scope.Invoice.date = new Date($scope.Invoice.date)
            $scope.GrandTotal

            CustomerService.getCustomerByID($scope.Invoice.customer_id)
                .then(function (response) {
                    $scope.InvoiceCustomer = response.data[0]
                })

            InvoiceMedicineService.getMedicine_ByInvoice($scope.InvoiceID)
                .then(function (response) {

                    $scope.Invoice_medList = response.data
                    $scope.Temp_Invoice_medList = angular.copy($scope.Invoice_medList)

                    $scope.Invoice_medList.forEach(IMed => {

                        var med = $scope.MedicineList.find(m => m.id == IMed.medicine_id)

                        IMed.MedicineInfo = med

                    })
                    $scope.Temp_Invoice_medList.forEach(IMed => {

                        var med = $scope.MedicineList.find(m => m.id == IMed.medicine_id)

                        IMed.MedicineInfo = med

                    })
                    $scope.Temp_Invoice_medList.forEach(row => {
                        row.price = row.MedicineInfo.price
                        row.subtotal = row.price * row.quantity
                    })
                    $scope.CalacuateTotal()

                    $scope.RemoveRow = function (index) {
                        $scope.Temp_Invoice_medList.splice(index, 1);
                    };
                    console.log("Test", $scope.Temp_Invoice_medList)

                    $scope.UpdateInvoice = function () {

                        $scope.Invoice_medList.forEach(element => {

                            var SearchRes = $scope.Temp_Invoice_medList.find(m => m.medicine_id == element.medicine_id)
                            if (SearchRes === undefined) {

                                InvoiceMedicineService.DeleteSingleMedicine_FromInvoice(element.id)
                                    .then(function () {

                                        element.MedicineInfo.quantity = element.MedicineInfo.quantity + element.quantity
                                        console.log("Habal")
                                        medicineService.EditMedicine(element.MedicineInfo)
                                            .then(function () {

                                            })
                                    })



                            } else {
                                // console.log("LEsa")
                                InvoiceMedicineService.EditSingleMedicine_Invoice({
                                    id: SearchRes.id,
                                    invoice_id: SearchRes.invoice_id,
                                    medicine_id: SearchRes.medicine_id,
                                    quantity: SearchRes.quantity,
                                    price: SearchRes.price,
                                }).then(function () {

                                    element.MedicineInfo.quantity = element.MedicineInfo.quantity + element.quantity - SearchRes.quantity

                                    console.log(element.MedicineInfo.quantity + element.quantity - SearchRes.quantity)
                                    medicineService.EditMedicine(element.MedicineInfo)
                                        .then(function () {

                                        })


                                })
                            }




                        })

                        let Invoice_total = 0
                        $scope.Temp_Invoice_medList.forEach(element => {
                            Invoice_total += element.subtotal
                            var SearchRes = $scope.Invoice_medList.find(m => m.medicine_id == element.medicine_id)
                            if (SearchRes === undefined) {
                                element.medicine_id = element.MedicineInfo.id
                                element.invoice_id = $scope.InvoiceID
                                InvoiceMedicineService.ConnectInvoice_Medicine({
                                    invoice_id: element.invoice_id,
                                    medicine_id: element.medicine_id,
                                    price: element.price,
                                    quantity: element.quantity,

                                }).then(function () {
                                    element.MedicineInfo.quantity = element.MedicineInfo.quantity - element.quantity
                                    medicineService.EditMedicine(element.MedicineInfo)
                                        .then(function () {

                                        })
                                })
                            }


                        })
                        $scope.Invoice.total = Invoice_total
                        InvoiceService.EditInvoice($scope.Invoice)
                            .then(function () {
                                alert("The invoice has been updated successfully")
                            })


                        // Here






                    }

                    //here

                })

        })





})