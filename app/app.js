var app = angular.module('app', ['ngRoute', 'ngCookies', 'ui.bootstrap','angularUtils.directives.dirPagination','firebase','ui.router','cfp.loadingBar','luegg.directives','xml']);

app.run(function ($rootScope,$location,$cookieStore) {

     
              $location.path('/main');
   
                     
  });



app.config(function($stateProvider, $urlRouterProvider,paginationTemplateProvider,cfpLoadingBarProvider,$compileProvider,$httpProvider,x2jsProvider) {

    cfpLoadingBarProvider.includeSpinner = false;
    paginationTemplateProvider.setPath('bower_components/angular-utils-pagination/dirPagination.tpl.html');
     $httpProvider.interceptors.push('xmlHttpInterceptor');
     $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);


    $stateProvider

     .state('category',{
        	url:"/category",
        	templateUrl:'templates/category.html',
        	controller:'ProductCtrl'
        })
        .state('main',{
            url:"/main",
            templateUrl:'templates/main.html',
            controller:'ProductCtrl'
        })

       
       	.state('productlist',{
       		url:"/productlist",
       		templateUrl:'templates/productlist.html',
       		controller:'ProductListCtrl'
       	})
        ;
$urlRouterProvider.otherwise("/main");



});



app.controller("ProductCtrl",['$scope','$http','$location','$cookieStore','passData','cfpLoadingBar','getAllData','initializeData', function ($scope,$http,$location,$cookieStore,passData,cfpLoadingBar,getAllData,initializeData){

	$scope.products = [];
	$scope.hotItems = [];



 $scope.loadData = function () {


 	cfpLoadingBar.start();
 	$http.get('http://deals.ebay.com/feeds/xml').success(function (data) {
    $scope.products = data.EbayDailyDeals.Item;
    console.log(data);
    getAllData.setData($scope.products);
 	$scope.hotItems=data.EbayDailyDeals.MoreDeals.MoreDealsSection;
 	initializeData.setData($scope.hotItems);
 	cfpLoadingBar.complete();
    });

 }


 $scope.byCategory = function (itemArray){
 
 		cfpLoadingBar.start();
 		
 		$scope.itemArray = $scope.hotItems[itemArray];

 		passData.setData($scope.itemArray);
 		$location.path('/productlist');
 }


}]);


app.controller("ProductListCtrl", ['$scope','passData','cfpLoadingBar',function ($scope,passData,cfpLoadingBar){
	cfpLoadingBar.complete();
	$scope.dataArr = passData.getData();

}])	;

app.controller("HomeCtrl",['$scope','$location','$firebase','getAllData','passData','initializeData', function ($scope,$location,$firebase,getAllData,passData,initializeData){

	$scope.redirect = function (){
			$location.path('/category');
	}

	$scope.backToHome = function (){
		$location.path('/main');
	}

	$scope.saveToDatabase = function (){

		var con = confirm("Are you sure?");

		if(con==true){
					var ref = new Firebase("https://pdmhackathon.firebaseio.com/pdmhackathon/Products");
			var ref2 = new Firebase("https://pdmhackathon.firebaseio.com/pdmhackathon/MoreDealsSection");



	
	

				if(getAllData.getData() ){
			var xmlArr = getAllData.getData();
			var xmlArr2 = initializeData.getData();
			removeURL();
			
			for(var x = 0;x<xmlArr.length;x++){
			

			ref.push({"ItemId":xmlArr[x].ItemId,
				"ConvertedCurrentPrice":xmlArr[x].ConvertedCurrentPrice,"DealUrl":xmlArr[x].DealURL,
				"PictureUrl":xmlArr[x].PictureURL,"PriceDisplay":xmlArr[x].PriceDisplay,
				"Quantity":xmlArr[x].Quantity,"QuantitySold":xmlArr[x].QuantitySold,"PrimaryCategoryId":xmlArr[x].PrimaryCategoryId,
				"PrimaryCategoryName":xmlArr[x].PrimaryCategoryName,"SavingsRate":xmlArr[x].SavingsRate});
			}
			
			
						
		}

		if(initializeData.getData()){
			var xmlArr2 = initializeData.getData();
			console.log(xmlArr2);
			var y=0;
				for(var x=0;x<xmlArr2.length;x++){
					if(x!=21 || x!=24 || x!=25){

				for(y=0;y<xmlArr2[x].Item.length;y++){
							ref2.child(x).push({"ItemId":xmlArr2[x].Item[y].ItemId,
							"ConvertedCurrentPrice":xmlArr2[x].Item[y].ConvertedCurrentPrice,"DealUrl":xmlArr2[x].Item[y].DealURL,
							"PictureUrl":xmlArr2[x].Item[y].PictureURL,"PriceDisplay":xmlArr2[x].Item[y].PriceDisplay,
							"Quantity":xmlArr2[x].Item[y].Quantity,"QuantitySold":xmlArr2[x].Item[y].QuantitySold,"PrimaryCategoryId":xmlArr2[x].Item[y].PrimaryCategoryId,
							"PrimaryCategoryName":xmlArr2[x].Item[y].PrimaryCategoryName,"SavingsRate":xmlArr2[x].Item[y].SavingsRate});
							console.log("success");
			}

					}
					
					}
					
					alert("success");
				}


		}
		
		
	
	}

	/*
		


	*/

	function removeURL() {
		var rem = new Firebase("https://pdmhackathon.firebaseio.com/pdmhackathon/");
		rem.remove();
	}
}]);

app.controller("OtherController",function ($scope){
     $scope.pageChangeHandler = function(num) {
          console.log('Page changed to ' + num);
  };
});

app.factory('passData', function (){
	var itemArr = [];
	return{

		setData:function (item) {
			itemArr = item;
		},

		getData:function () {
			return itemArr;
		}
	}


});

app.factory('getAllData', function (){
	var allData = [];

	return{

		setData:function (item) {
			allData = item;
		},

		getData:function () {
			return allData;
		}

	}
});

app.factory('initializeData', function () {
	var allData = [];

	return{

		setData:function (item) {
			allData = item;
		},

		getData:function () {
			return allData;
		}

	}
}
);