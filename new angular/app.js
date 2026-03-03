
angular.module("myApp", [])
.service("ProductService", function($http){

    const API_URL = "https://spnuxpfrtluagbirquiv.supabase.co/rest/v1/products";

    const config = {
        headers: {
            "apikey": "YOUR_SUPABASE_API_KEY",
            "Authorization": "Bearer YOUR_SUPABASE_API_KEY",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    };

    this.getProducts = function(){
        return $http.get(API_URL, config);
    };

    this.createProduct = function(product){
        return $http.post(API_URL, product, config);
    };

    this.updateProduct = function(product){
        return $http.patch(API_URL + "?id=eq." + product.id, product, config);
    };

    this.deleteProduct = function(id){
        return $http.delete(API_URL + "?id=eq." + id, config);
    };
})

.controller("ProductController", function($scope, ProductService){

    $scope.products = [];
    $scope.newProduct = {};
    $scope.isEdit = false;
    $scope.loading = false;

    // LOAD
    $scope.loadProducts = function(){
        $scope.loading = true;

        ProductService.getProducts()
        .then(function(response){
            $scope.products = response.data;
        })
        .catch(function(error){
            console.log("Error loading products", error);
        })
        .finally(function(){
            $scope.loading = false;
        });
    };

    $scope.loadProducts();


    // ADD
    $scope.addProduct = function(){
        ProductService.createProduct($scope.newProduct)
        .then(function(){
            $scope.loadProducts();
            $scope.newProduct = {};
        })
        .catch(function(error){
            console.log("Error creating product", error);
        });
    };


    // EDIT
    $scope.editProduct = function(product){
        $scope.isEdit = true;
        $scope.newProduct = angular.copy(product);
    };


    // UPDATE
    $scope.updateProduct = function(){
        ProductService.updateProduct($scope.newProduct)
        .then(function(){
            $scope.loadProducts();
            $scope.newProduct = {};
            $scope.isEdit = false;
        })
        .catch(function(error){
            console.log("Error updating product", error);
        });
    };


    // DELETE
    $scope.deleteProduct = function(id){
        if(!confirm("Are you sure?")) return;

        ProductService.deleteProduct(id)
        .then(function(){
            $scope.loadProducts();
        })
        .catch(function(error){
            console.log("Error deleting product", error);
        });
    };


    // CANCEL
    $scope.cancelEdit = function(){
        $scope.isEdit = false;
        $scope.newProduct = {};
    };

});