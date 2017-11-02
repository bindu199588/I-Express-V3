var app= angular.module("iexpress");

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/userLogin");

	$stateProvider
	.state("adminLogin",{
		url:	"/adminLogin",
		templateUrl : "views/adminLogin.html",
		controller:"adminLoginCtrl",
		isAdmin : true
	})
	.state("adminDashboard",{
		url:	"/adminDashboard",
		templateUrl:	"views/adminDashboard.html",
		controller:"adminDashboardCtrl",
		isAdmin : true

	})	
	.state("userLogin",{
		url:	"/userLogin",
		templateUrl : "views/userLogin.html",
		controller:"userLoginCtrl",
		isAdmin : false

	})
	.state("userDashboard",{
		url:	"/userDashboard/:eventId",
		templateUrl : "views/userDashboard.html",
		controller:"userDashboardCtrl",
		params:{
			eventName : null
		},
		isAdmin : false

	})	
	.state("userPostScreen",{
		url:	"/userPostScreen/:eventId/:tagId",
		templateUrl : "views/userPostScreen.html",
		 params: {
		        tagName: null,
		        tagDesc: null,
		        eventName: null
		},
		controller:"userPostScreenCtrl",
		isAdmin : false

	})

});
