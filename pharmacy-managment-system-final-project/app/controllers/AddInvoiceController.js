app.controller('AddInvoiceController', function ($scope, $routeParams, CustomerService, InvoiceService, medicineService , InvoiceMedicineService) {
    $scope.CustomerID = $routeParams.id;
    $scope.Invoice = {};
    $scope.Invoice.payment_method = ""
    $scope.Invoice.details = ""
    $scope.Invoice.date = ""
    $scope.Customer = {};
    $scope.InvoicesList = [];
    $scope.NoOfInvoice = 0;
    $scope.MedicineList = [];
    $scope.TotalDiscount = 0
    $scope.TotalPrice = 0
    $scope.invoiceID=0

    $scope.NeededMedicineList = [{
        MedicineInfo: null,
        availableQuantity: 0,
        ExpiryDate: '',
        BoxQuantity: 0,
        Price: 0,
        Discount: 0,
        Total: 0,
    }];

    CustomerService.getCustomerByID($scope.CustomerID)
        .then(function (response) {
            $scope.Customer = response.data[0];
            $scope.Invoice.customer_id = $scope.Customer.id;
        });

    InvoiceService.getInvoices()
        .then(function (response) {
            $scope.InvoicesList = response.data;
            $scope.NoOfInvoice = $scope.InvoicesList.length + 1;
        });

    medicineService.getMedicines()
        .then(function (response) {
            $scope.MedicineList = response.data;
        });

    $scope.AddNewRow = function () {
        $scope.NeededMedicineList.push({
            MedicineInfo: {},
            availableQuantity: 0,
            ExpiryDate: '',
            BoxQuantity: 0,
            Price: 0,
            Discount: 0,
            Total: 0,
        });
    };

    $scope.RemoveRow = function (index) {
        $scope.NeededMedicineList.splice(index, 1);
    };

    $scope.SelectMedicine = function (row) {
        if (row.MedicineInfo) {
            if (!row.MedicineInfo.quantity) {
                alert(`You can't add ${row.MedicineInfo.name} because it's out of stock`)
                row.MedicineInfo = {}

                return
            }
            row.availableQuantity = row.MedicineInfo.quantity;
            row.ExpiryDate = row.MedicineInfo.expiry_date;
            row.Price = row.MedicineInfo.price;
            row.BoxQuantity = null;
            row.Discount = 0;
            row.Total = 0;
        }
        //console.log($scope.NeededMedicineList)
    };

    $scope.UpdateTotal = function (row) {

        if (row.BoxQuantity && row.Price) {
            row.Total = row.BoxQuantity * row.Price * (1 - (row.Discount / 100));
        } else {
            row.Total = 0;
        }
        if (row.BoxQuantity > row.availableQuantity) {
            alert('The Needed Quantity exceeded the Available Quanity ')
            row.BoxQuantity = row.availableQuantity
        }
        $scope.CalacuateTotal()
    };

    $scope.CalacuateTotal = function () {
        var totalDiscount = 0, totalPrice = 0
        $scope.NeededMedicineList.forEach(function (med) {
            totalPrice += med.BoxQuantity * med.Price;
            totalDiscount += (med.BoxQuantity * med.Price * (med.Discount / 100));
        });
        $scope.TotalDiscount = totalDiscount
        $scope.TotalPrice = totalPrice
        $scope.GrandTotal = totalPrice - totalDiscount
        $scope.Invoice.total = $scope.GrandTotal
        $scope.Invoice.discount = $scope.TotalDiscount

    }

    $scope.SaveInvoice = function () {

        InvoiceService.AddInvoice($scope.Invoice)
            .then(function (response) {

                $scope.invoiceID = response.data[0].id;

                //console.log("Invoice Created:", invoiceID);

                  alert("New Invoice Added")
                  $scope.SaveInvoice_SecondPart()
                  $scope.NewCustomer = {}

            })
            .catch(function (err) {
                console.log("Error Adding New Invoice: ", err)
            })

    }
   
    $scope.SaveInvoice_SecondPart = function(){

        $scope.NeededMedicineList.forEach(med=>{
            $scope.Connect_Obj ={
                invoice_id:$scope.invoiceID,
                medicine_id:med.MedicineInfo.id,
                quantity:med.BoxQuantity,
                price:med.Price,
            }
            $scope.MedicineCopy = angular.copy(med.MedicineInfo)
            $scope.MedicineCopy.quantity = med.MedicineInfo.quantity - med.BoxQuantity
            
            InvoiceMedicineService.ConnectInvoice_Medicine($scope.Connect_Obj)
            .then(function(){
                console.log(med)
            })

            medicineService.EditMedicine($scope.MedicineCopy)
            .then(function(){

            })
        })

    }

});