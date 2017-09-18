var app= angular.module("iexpress");

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/userDashboard");

	$stateProvider
	.state("adminLogin",{
		url:	"/adminLogin",
		templateUrl : "views/adminLogin.html",
		controller:"adminLoginCtrl"

	})
	.state("adminDashboard",{
		url:	"/adminDashboard",
		templateUrl:	"views/adminDashboard.html",
		controller:"adminDashboardCtrl"

	})	
	.state("userLogin",{
		url:	"/userLogin",
		templateUrl : "views/userLogin.html",
		controller:"userLoginCtrl"

	})
	.state("userDashboard",{
		url:	"/userDashboard",
		templateUrl : "views/userDashboard.html",
		controller:"userDashboardCtrl"

	})	
	.state("userPostScreen",{
		url:	"/userPostScreen/:tagId",
		templateUrl : "views/userPostScreen.html",
		 params: {
		        tagName: null,
		        tagDesc:null
		},
		controller:"userPostScreenCtrl"

	})

});
