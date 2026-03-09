app.controller('InvoiceController', function ($scope, InvoiceService, CustomerService, InvoiceMedicineService, medicineService) {
    $scope.InvoicesList = []
    $scope.CustomerMap = {}
    $scope.MedicineMap = {}
    $scope.SearchByName = ""
    $scope.MedicinesInInvoice = []
    $scope.InvoiceCustomer = ""
    $scope.isLoading = false

    $scope.adminRole =  localStorage.getItem('adminRole');

    Promise.all([
        CustomerService.getCustomers(),
        medicineService.getMedicines()
    ]).then(function ([CustomersResponse, MedicineResponse]) {
        $scope.CustomersList = CustomersResponse.data
        $scope.CustomersList.forEach(customer => {
            $scope.CustomerMap[customer.id] = customer.name
        });

        MedicineResponse.data.forEach(med => {
            $scope.MedicineMap[med.id] = [med.name, med.category]
        })
        $scope.RenderTable()

    }).catch(function (err) {
        console.log("Error loading data", err);
    });




    $scope.RenderTable = function () {
        $scope.isLoading = true
        InvoiceService.getInvoices()
            .then(function (response) {
                $scope.InvoicesList = response.data
                $scope.InvoicesList.forEach(invoice => {
                    invoice.customerName = $scope.CustomerMap[invoice.customer_id]
                })
            })
            .catch(function (error) {
                console.log("Error Loading Invoices", error)
            })
            .finally(function () {
                $scope.isLoading = false
            });


    }

    $scope.GenerateInvoice = function (SelectedInvoice, $index) {

        console.log(SelectedInvoice)

        $scope.InvoiceDate = new Date(SelectedInvoice.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });


        Promise.all([
            CustomerService.getCustomerByID(SelectedInvoice.customer_id),
            InvoiceMedicineService.getMedicine_ByInvoice(SelectedInvoice.id)
        ]).then(function ([CustomerResponse, InvoiceMedResponse]) {
            $scope.InvoiceCustomer = CustomerResponse.data[0]
            $scope.MedicinesInInvoice = InvoiceMedResponse.data

            $scope.MedicinesInInvoice.forEach(MI => {
                MI.medicine_description = $scope.MedicineMap[MI.medicine_id]
            })

            //   console.log($scope.MedicinesInInvoice)

            var MainTable = [
                [
                    { text: 'MEDICINE', style: 'tableHeader' },
                    { text: 'QUANTITY', style: 'tableHeader', alignment: 'left' },
                    { text: 'PRICE', style: 'tableHeader', alignment: 'left' },
                    { text: 'TOTAL', style: 'tableHeader', alignment: 'left' }
                ]
            ];

            var subtotal = 0;
            $scope.MedicinesInInvoice.forEach(med => {
                subtotal += med.subtotal;
                MainTable.push([
                    {
                        stack: [
                            { text: med.medicine_description[0], bold: true },
                            { text: med.medicine_description[1], fontSize: 9, color: 'gray' }
                        ],
                        margin: [0, 5]
                    },
                    { text: med.quantity.toString(), margin: [20, 5] },
                    { text: '$ ' + med.price.toFixed(2), margin: [0, 5] },
                    { text: '$ ' + med.subtotal.toFixed(2), margin: [0, 5] }
                ]);
            });

            MainTable.push([
                { text: '', colSpan: 4, border: [false, true, false, false], borderColor: ['#006339'] },
                '', '', ''
            ]);

            var finalTotal = subtotal - SelectedInvoice.discount;
            var InvoiceContent = {
                content: [

                    { canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 2, color: '#006339' }] },
                    { text: 'INVOICE', style: 'mainHeader', margin: [0, 20, 0, 20] },
                    {
                        columns: [
                            {
                                width: '*',
                                stack: [
                                    { text: 'PharmaCare', bold: true },
                                    '123 Nile Street, Zamalek, Cairo, Egypt',
                                    '+2010-1234-5678',
                                    'pharmacare@gmail.com'
                                ],
                                style: 'addressLabel'
                            },
                            {
                                width: 180,
                                stack: [
                                    { text: 'BILLED TO', bold: true, color: '#006339' },
                                    $scope.InvoiceCustomer.name,
                                    $scope.InvoiceCustomer.phone,
                                    $scope.InvoiceCustomer.address,
                                ],
                                style: 'addressLabel',
                                alignment: 'left'
                            }
                        ]
                    },

                    {
                        margin: [0, 0, 0, 20],
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 180,
                                table: {
                                    body: [
                                        [{ text: 'Invoice No', bold: true, border: [] }, { text: $index, border: [] }],
                                        [{ text: 'Issue Date', bold: true, border: [] }, { text: ': ' + $scope.InvoiceDate, border: [] }],
                                        [{ text: 'Payment Method', bold: true, border: [] }, { text: ': ' + SelectedInvoice.payment_method, border: [] }]

                                    ]
                                },
                                layout: 'noBorders',
                                margin: [0, 20, 0, 0]
                            }
                        ]
                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 80, 80, 80],
                            body: MainTable
                        },
                        layout: {
                            alignment: 'right',
                            hLineWidth: function (i, row) {
                                if (i == 1)
                                    return 0
                                else return 0.5
                            },
                            vLineWidth: function () { return 0; },
                            hLineColor: function () { return '#afb0b5'; }
                        }
                    },
                    {
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 180,
                                margin: [0, 10, 0, 0],
                                table: {
                                    body: [
                                        [{ text: 'Sub Total', border: [] }, { text: '$ ' + subtotal.toFixed(2), border: [], alignment: 'right' }],
                                        [{ text: 'Discount', border: [] }, { text: '$ ' + SelectedInvoice.discount.toFixed(2), border: [], alignment: 'right' }],
                                        [
                                            { text: 'TOTAL', fillOpacity: 0.1, fillColor: '#006339', color: '#006339', bold: true },
                                            { text: '$ ' + finalTotal.toFixed(2), fillColor: '#006339', color: 'white', bold: true, alignment: 'right' }
                                        ]
                                    ]
                                }
                            }
                        ]
                    },
                    { text: 'THANK YOU FOR YOUR Purchase', style: 'footerTitle', margin: [0, 40, 0, 5], color: '#006339' },
                    { text: 'Invoice Terms:', fontSize: 10, bold: true },
                    { text: 'E.g Payment Instructions (Account Number , Bank Account Holder , Credit Card) or (Cash Payment) .', fontSize: 10 }
                ],
                styles: {
                    mainHeader: { fontSize: 40, bold: true, color: '#006339', letterSpacing: 2 },
                    addressLabel: { fontSize: 10, lineHeight: 1.2 },
                    tableHeader: { fillColor: '#006339', color: 'white', bold: true, fontSize: 11, margin: [5, 2] },
                    footerTitle: { fontSize: 12, bold: true, color: '#006339' }
                }
            };

            pdfMake.createPdf(InvoiceContent).open();


        })


    }

    $scope.RemoveInvoice = function (invoiceID) {

        if (!confirm("Are you Sure you want to Delete this invoice ?")) return;

        Promise.all([
            InvoiceMedicineService.getMedicine_ByInvoice(invoiceID),
            InvoiceService.DeleteInvoice(invoiceID)
        ]).then(function () {
            $scope.RenderTable()
        })



    }


})