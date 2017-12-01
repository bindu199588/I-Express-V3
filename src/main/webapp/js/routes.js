var app= angular.module("iexpress");

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/userLogin");

	$stateProvider
	.state("adminLogin",{
		url:	"/adminLogin",
		templateUrl : "views/adminLogin.html",
		controller:"adminLoginCtrl",
		isAdmin : true,
		redirectPage: 'adminDashboard'
	})
	.state("adminDashboard",{
		url:	"/adminDashboard",
		templateUrl:	"views/adminDashboard.html",
		controller:"adminDashboardCtrl",
		isAdmin : true,
		authenticate: true
	})	
	.state("userLogin",{
		url:	"/userLogin",
		templateUrl : "views/userLogin.html",
		controller:"userLoginCtrl",
		isAdmin : false,
		redirectPage: 'userDashboard',
		params:{
			event: null
		}
	})
	.state("userDashboard",{
		url:	"/userDashboard",
		templateUrl : "views/userDashboard.html",
		controller:"userDashboardCtrl",
		params:{
			eventData : null
		},
		isAdmin : false,
		authenticate: true

	})	
	.state("userPostScreen",{
		url:	"/userPostScreen/:tagId",
		templateUrl : "views/userPostScreen.html",
		 params: {
		        tagName: null,
		        tagDesc: null,
		        eventData : null
		},
		controller:"userPostScreenCtrl",
		isAdmin : false,
		authenticate: true

	})
	//$urlRouterProvider.deferIntercept(true);
});
