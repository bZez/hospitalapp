// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic'])
var hospitalApp = angular.module('starter', ['ionic', 'ngCordova']);

hospitalApp
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


hospitalApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('menu', {
            url: '/menu',
            templateUrl: 'templates/menu.html',
            controller: 'MenuCtrl'
        })
        .state('explore', {
            url: '/explore/:id',
            templateUrl: 'templates/explore.html',
            controller: 'ExploreCtrl'
        })
        .state('emirates', {
            url: '/emirates',
            templateUrl: 'templates/emirates.html',
            controller: 'EmiratesCtrl'
        })
        .state('hospitaltype', {
            url: '/hospitaltype',
            templateUrl: 'templates/hospitaltype.html',
            controller: 'HospTypeCtrl'
        })
        .state('hospitals', {
            url: '/emirates/:emirateId',
            templateUrl: 'templates/hospitals.html',
            controller: 'HospitalCtrl'
        })
        .state('hospitals', {
            url: '/hosptype/:hospTypeId',
            templateUrl: 'templates/hospitals.html',
            controller: 'HospitalCtrl'
        })
        .state('hospitals', {
            url: '/provider',
            templateUrl: 'templates/hospitals.html',
            controller: 'HospitalCtrl'
        })
        .state('documents', {
            url: '/documents',
            templateUrl: 'templates/documents.html',
            controller: 'DocumentCtrl'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'templates/contact.html',
            controller: 'ContactCtrl'
        });
        /*
        .state('lists', {
            url: '/lists/:categoryId',
            templateUrl: 'templates/lists.html',
            controller: 'ListsController'
        })
        .state('items', {
            url: "/items/:listId",
            templateUrl: "templates/items.html",
            controller: "ItemsController"
        });
        */
    $urlRouterProvider.otherwise('/menu');
});


var db = null;

hospitalApp.controller("MenuCtrl", function($scope, $ionicPlatform, $ionicLoading, $location, $ionicHistory, $cordovaSQLite) {
 	
 	$scope.menus = [{"img": "images/explore.png", "title": "EXPLORE", "subtitle": "Find hospitals by locations"},
				{"img": "images/document.png", "title": "DOCUMENTS", "subtitle": "Download important documents"}, 
				{"img": "images/contact.png", "title": "CONTACT US", "subtitle": "Call or email us"}];
	
   	$ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    $ionicPlatform.ready(function() {
        $ionicLoading.show({ template: 'Loading...' });
        if(window.cordova) {
            window.plugins.sqlDB.copy("populated.db", function() {
                db = $cordovaSQLite.openDB("populated.db");
                $location.path("/menu");
                $ionicLoading.hide();
            }, function(error) {
                console.error("There was an error copying the database: " + error);
                db = $cordovaSQLite.openDB("populated.db");
                $location.path("/menu");
                $ionicLoading.hide();
            });
        } else {
            db = openDatabase("websql.db", '1.0', "My WebSQL Database", 2 * 1024 * 1024);
            db.transaction(function (tx) {
				// Types
                tx.executeSql("DROP TABLE IF EXISTS tblHospTypes");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblHospTypes (id integer primary key, type_name text)");
                tx.executeSql("INSERT INTO tblHospTypes (type_name) VALUES (?)", ["Hospital"]);
                tx.executeSql("INSERT INTO tblHospTypes (type_name) VALUES (?)", ["Clinic"]);

				// Emirates
                tx.executeSql("DROP TABLE IF EXISTS tblEmirates");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblEmirates (id integer primary key, emirate_name text)");
                tx.executeSql("INSERT INTO tblEmirates (emirate_name) VALUES (?)", ["Dubai"]);
                tx.executeSql("INSERT INTO tblEmirates (emirate_name) VALUES (?)", ["Abu Dhabi"]);
            	
            	// Hospitals
                tx.executeSql("DROP TABLE IF EXISTS tblHospitals");
                //tx.executeSql("CREATE TABLE IF NOT EXISTS tblCategories (id integer primary key, category_name text)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblHospitals (id integer primary key, hosp_lat integer, hosp_lon integer, hosp_name text, hosp_area text, hosp_type text, hosp_emirate text)");
                //tx.executeSql("CREATE TABLE IF NOT EXISTS tblTodoListItems (id integer primary key, todo_list_id integer, todo_list_item_name text)");
                tx.executeSql("INSERT INTO tblHospitals (hosp_lat,hosp_lon,hosp_name,hosp_area,hosp_type,hosp_emirate) VALUES (?,?,?,?,?,?)", ["100","100","Emirates International Hospital","Al Ain Main Street","Hospital","Dubai"]);
                //tx.executeSql("INSERT INTO tblCategories (category_name) VALUES (?)", ["Chores"]);
                //tx.executeSql("INSERT INTO tblCategories (category_name) VALUES (?)", ["School"]);
            });
            $location.path("/menu");
            $ionicLoading.hide();
            
        }
    });
});
 
hospitalApp.controller("ExploreCtrl", function($scope, $ionicPlatform, $cordovaSQLite) {

 	$scope.expItems = [{"id":"1", "img": "images/explore.png", "title": "EMIRATES", "subtitle": "Hospitals by Emirates"},
				{"id":"2", "img": "images/document.png", "title": "TYPE", "subtitle": "Hospitals by Type"}, 
				{"id":"3", "img": "images/contact.png", "title": "PROVIDER", "subtitle": "Hospitals by Provider"}];
				
    $scope.getExpItems = function (id) {
    	if(id == 1) {
        	$window.location.href = ('#/emirates');
    	} else if(id == 2) {
    		$window.location.href = ('#/hospitaltype');
    	} else {
    		$window.location.href = ('#/provider');
    	}
    }


});
 	
hospitalApp.controller("EmiratesCtrl", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
 $scope.emirates = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, emirate_name FROM tblEmirates";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.emirates.push({id: res.rows.item(i).id, emirate_name: res.rows.item(i).emirate_name});
                }
            }
        }, function (err) {
            console.error(err);
        });
    });
});
 
hospitalApp.controller("HospTypeCtrl", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
 	$scope.hospTypes = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, type_name FROM tblHospTypes";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.hospTypes.push({id: res.rows.item(i).id, type_name: res.rows.item(i).type_name});
                }
            }
        }, function (err) {
            console.error(err);
        });
    });
});

hospitalApp.controller("HospitalCtrl", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
  	$scope.hospitals = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, hosp_name FROM tblHospitals";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.hospitals.push({id: res.rows.item(i).id, hosp_name: res.rows.item(i).hosp_name, hosp_area: res.rows.item(i).hosp_area});
                }
            }
        }, function (err) {
            console.error(err);
        });
    });
});

hospitalApp.controller("DocumentCtrl", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
 
});

hospitalApp.controller("ContactCtrl", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
 
});
