var app= angular.module("iexpress",["ngRoute", "ngMessages","ngMaterial","ui.router"]);


app.run(function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/*
 * START APP CONFIG
 */
//app.config(function($provide) {
//  $provide.decorator('$rootScope', function ($delegate) {
//    var _emit = $delegate.$emit;
//    $delegate.$emit = function () {
//      console.log.apply(console, arguments);
//      _emit.apply(this, arguments);
//    };
//    return $delegate;
//  });
//});


/*
 *END APP CONFIG
 */

/*
 * START FACTORIES 
 */

app.factory('pageLoader',function(){
	var isLoading = false;
	return{
		setLoading: function(loading){
			isLoading = loading;
		},
		getLoading:function(){
			return isLoading;
		}
	}
	
});

app.factory('UserAuthenticationService',function($http,$state,$q){
	var thisFactory = {};
	
	thisFactory.encryptCookie = function(cookieString){	
		return $http.post("encryptString",cookieString)
		.then(response => {
			return response.data;
		})
		.catch(err => console.log("ERROR IN ENCRYPTION"+err))
	}
	thisFactory.decryptCookie = function(cookieString){
		return $http.post("decryptString",cookieString)
		.then(response => {
			return response.data
			
		})
		.catch(err => console.log("ERROR IN DECRYPTION"+err))
	}
	thisFactory.getLoginCookie = function(isAdmin) {
		if(!isAdmin){
			 var name = "I-Express" + "=";
		}
		else{
			 var name = "I-ExpressAdmin" + "=";
		}
	    var ca = document.cookie.split(';');
    	for(var i = 0; i < ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
    	return "";
	}	
	thisFactory.setLoginCookie = function(cookieName,isAdmin){
		var d = new Date();
		var expTime = 60*60*1000*24  // 1 day
		d.setTime(d.getTime() + expTime);
		var expiresCookie = "expires="+ d.toUTCString() + ";";
		thisFactory.encryptCookie(cookieName)
		.then(result => {
			if(isAdmin){
				var eventCookie = "I-ExpressAdmin" + "=" + result + ";" ;
			}
			else{
				var eventCookie = "I-Express" + "=" + result + ";" ;
			}
			document.cookie = eventCookie + expiresCookie + "path=/"
		})
	}
	thisFactory.removeLoginCookie = function(isAdmin){
		var d	= new Date(0);
		d.setTime(d.getTime());
		var expiresCookie = "expires="+ d.toUTCString() + ";";
		if(isAdmin){
			var eventCookie = "I-ExpressAdmin" + "= ;" ;
		}
		else{
			var eventCookie = "I-Express" + "= ;" ;
		}		
		document.cookie = eventCookie + expiresCookie + "path=/";
		return;
	}	
	thisFactory.loginUser = function(eventId,eventName,access_code){
		return $http({
		    method: 'POST',
		    url: 'loginUser',
		    data: {
				eventId:eventId,
				eventName : eventName,
				access_code: access_code
		    }
		})
		.then(function(response){
			if(response.data){
				thisFactory.setLoginCookie(eventName.trim()+eventId,false);
				return true;
			}
			else{
				return false;
			}
		},function(error){
			console.log("ERROR IN LOGGING IN USER");
		})	
	}
	thisFactory.loginAdmin = function(username,password){
		var config = {
			username: username,
			password: password
		}
		return $http.post("loginAdmin",config)
		.then(function(response){
			if(response.data){
				thisFactory.setLoginCookie(username,true);
				return true;
			}
			else{
				return false;
			}
		},function(error){
			console.log("ERROR IN LOGGING IN ADMIN")
		})
		//if success setlogin cookie
	}
	
	thisFactory.isLoggedInAdmin = function(){
		var existingCookie = thisFactory.getLoginCookie(true);
		if(existingCookie!=null && existingCookie !=""){
			return true
		}
		return false
	}
	thisFactory.isLoggedInUser = function(accessCookieName){
		var existingCookie = thisFactory.getLoginCookie(false);
		if(existingCookie!=null && existingCookie !=""){
			return thisFactory.decryptCookie(existingCookie)
			.then(result=>{			
				if(result == accessCookieName){
					return true;
				}
				else {
					return false
				}
			})
		}
		else{
			return $q((resolve,reject) => {				
	    		return resolve(false);
			})
		}
		
		
		
	}
	thisFactory.logout = function(isAdmin){
		thisFactory.removeLoginCookie(isAdmin);
		return true;
	}	
	return thisFactory
});

/*
 * END FACTORIES
 */



/* 
 * START CONTROLLERS
 *  
 */


app.controller("indexController",function($rootScope,$scope){});

////////////////////////////////////////////////////////////////////////////////////
//////////          CONTROLLER FOR ADMIN DASHBOARD     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("adminDashboardCtrl",function($scope,$http,$state,$mdDialog,pageLoader,UserAuthenticationService){	
	/*
	 * GET THE LIST OF ALL EXISTING EVENTS
	 */
	if(!UserAuthenticationService.isLoggedInAdmin()){
		$state.go("adminLogin",{},{location:false});
	}
	
	else{
    	$scope.isAdmin = true
    	$scope.logout = function(){
    		if(UserAuthenticationService.logout($scope.isAdmin)){
    			$state.go("adminLogin",{},{location:false});
    		}
    		else{
    			console.log("UNABLE TO LOGOUT")
    		}    			
    	}
		$scope.loadEvents = function(){
			$http.get("getAllEvents")
			.then(function(response){
				$scope.eventList = response.data;			
				$scope.setThisEventActive(0);//MARK THE FIRST EVENT AS ACTIVE BY DEAFAULT
			},function(error){
				console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
			});
		}	
		$scope.loadEvents();
		$scope.disableEvent=function(index){
			var event = $scope.eventList[index];
			var config = {
					params:{
						eventId: event['id'],
						is_active : !event['isactive']
					}
			}
			$http.get("disableEvent",config)
			.then(function(response){
				//console.log("EVENT STATUS CHANGED" + response);
			},function(error){
				console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
			})
		}
		
		$scope.editEvent = function(ev,index){
			$mdDialog.show({
				controller: 'editEventModalController',
			      templateUrl: 'views/modals/editEventModal.html',
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: false,
			      locals:{
			    	  eventData:{
			    		  name:$scope.eventList[index]['name'],
			    		  description:$scope.eventList[index]['description'],
			    		  eventId : $scope.eventList[index]['id'],
			    		  is_active:$scope.eventList[index]['isactive']
			    	  }
			      }
			})
			.then(function(answer){
				$scope.loadEvents();
			},function(){
				
			})
		}
		$scope.editTag = function(ev,index){
			$mdDialog.show({
				controller: 'editTagModalController',
			      templateUrl: 'views/modals/editTagModal.html',
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: false,
			      locals:{
			    	  tagData:{
			    		  name:$scope.tagsList[index]['name'],
			    		  description:$scope.tagsList[index]['description'],
			    		  eventId : $scope.tagsList[index]['event_id'],
			    		  tagId:$scope.tagsList[index]['id']
			    	  }
			      }	
			})
			.then(function(answer){
				$scope.getTagsForEventId($scope.activeEvent['id']);
			},function(){
				
			})
		}
		/* 
		 * SET THE SELECTED EVENT AS ACTIVE
		 */
		$scope.setThisEventActive = function(index){
			$scope.activeEventIndex = index;
			$scope.activeEvent = $scope.eventList[index];
			$scope.getTagsForEventId($scope.activeEvent['id']);
			$scope.getTimeLineGraph($scope.activeEvent['id'],null);
		}
		
		$scope.getTimeLineGraph =function(eventId,tagId){
			var config = {
					params:{
						eventId:eventId,
						tagId : tagId,
					}
			}
			$http.get("getEventGraphData",config)
			.then(response =>{
				var graphData = $scope.graphData = response.data;				
				var seriesArray =[];
				var names = {0:'UPSET',1:'SAD',2:'NEUTRAL',3:'HAPPY',4:'GLAD'}
				for(k=0;k<5;k++){
					seriesArray[k] = {name:names[k],data:[]};
				}
				
				for(i=0;i < graphData["0"].length;i++){
					totalCount = graphData["0"][i]['count'] + graphData["1"][i]['count'] + graphData["2"][i]['count'] + graphData["3"][i]['count'] +graphData["4"][i]['count']
					
					for(j = 0;j < 5;j++){
						tempObject = {
								x:new Date(graphData[j][i]['created_on']),
								y:parseFloat((graphData[j][i]['count']/totalCount) * 100)
						}
						seriesArray[j]['data'].push(tempObject);
					}
				}
				console.log(seriesArray)
				constructGraph(seriesArray);				
			})
			.catch(err=> console.log("ERROR GETTING GRAPH"+err));
		}
		
		
		
		
		/*
		 * GET ALL TAGS RELATED TO THE EVENT
		 */
		$scope.getTagsForEventId = function(eventId){		
			var config ={
					params:{
						eventId : eventId
					}
			}
			$http.get("getTagsFromEventId",config)
			.then(function(response){
				$scope.tagsList = response.data
			},function(error){
				console.log("ERROR IN GETTING EVENT RELATED TAGS" + error);
			});
		}
		/*
		 * DELETE TAG 
		 */
		
		$scope.deleteTag = function(index){
			var config = {
					params:{
						eventId : $scope.activeEvent['id'],
						tagId : $scope.tagsList[index]['id']
					}
			}		
			$http.delete("deleteTagFromEvent",config)
			.then(function(response){
				$scope.getTagsForEventId($scope.activeEvent['id']);
			},function(error){
				console.log("ERROR IN DELETING TAG")
			});
		}
		
		$scope.openCreateEventModal = function(ev){
			$mdDialog.show({
				  controller: 'createEventModalController',
			      templateUrl: 'views/modals/createEventModal.html',
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: false
			})
			.then(function(response){
				$scope.loadEvents();
			},function(){
				console.log("CREATION CANCELLED");
			});
		}
		
		$scope.openCreateTagModal = function(ev){
			$mdDialog.show({
				  controller: 'createTagModalController',
			      templateUrl: 'views/modals/createTagModal.html',
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      locals:{eventData:{eventId : $scope.activeEvent['id']}},
			      fullscreen: false
			})
			.then(function(response){
				$scope.getTagsForEventId($scope.activeEvent['id']);
			},function(){
				console.log("CREATION CANCELLED");
			});
		}
	}
	
});

////////////////////////////////////////////////////////////////////////////////////
//////////////          CONTROLLER FOR ADMIN LOGIN     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
app.controller("adminLoginCtrl",function($scope,$state,UserAuthenticationService){	
	if(UserAuthenticationService.isLoggedInAdmin()){
		$state.go("adminDashboard");
	}
	else{
		$scope.authenticateAndGo= function(){
			if($scope.username && $scope.password){
				UserAuthenticationService.loginAdmin($scope.username,$scope.password)
				.then(response => {
					if(response){
						$state.go("adminDashboard")
					}
					else{
						$scope.errorMessages = {'accessError' : true}
					}
				})
			}
			else{
				$scope.errorMessages = {'lengthError' : true}
			}
			
		}
	}
	
});


////////////////////////////////////////////////////////////////////////////////////
//////////////CONTROLLER FOR USER LOGIN        /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("userLoginCtrl",function($scope,$http,$mdDialog,$state,pageLoader,UserAuthenticationService){
	pageLoader.setLoading(true);
	$scope.loadEvents = function(){
		$http.get("getActiveEvents")
		.then(function(response){
			$scope.eventList = response.data;
		},function(error){
			console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
		});
	}	
	$scope.loadEvents();
	pageLoader.setLoading(false);
	$scope.askAccess = function(ev,index) {
		var event = $scope.eventList[index]		
		UserAuthenticationService.isLoggedInUser(event['name'].trim()+event.id)
		.then(loggedIn => {
			if(loggedIn){
				$state.go('userDashboard',{eventName:event.name,eventId:event.id});
			}
			else{
				$mdDialog.show({
					controller: 'eventLoginModalController',
					templateUrl: 'views/modals/eventLoginModal.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					locals:{eventData:event},
					fullscreen: false
				})
				.then(function(match) {
					if(match){
						$state.go('userDashboard',{eventName:event.name,eventId:event.id});
					}
				}, function() {
					console.log('You cancelled the dialog.');
				});
			}
			
		})
		.catch(err=>console.log(err));
		
	};


});
////////////////////////////////////////////////////////////////////////////////////
//////////////        CONTROLLER FOR USER DASHBOARD    /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
app.controller("userDashboardCtrl",function($scope,$http,$state,$q,$stateParams,$mdDialog,pageLoader,UserAuthenticationService){
	pageLoader.setLoading(true);
	$scope.eventId = $stateParams.eventId;	
	$scope.eventName = $stateParams.eventName;
	var config ={
			params:{
				eventId : $scope.eventId
			}
	}
	$scope.isAdmin = false
	$scope.logout = function(){
		if(UserAuthenticationService.logout($scope.isAdmin)){
			$state.go("userLogin",{},{location:false})
		}
		else{
			console.log("UNABLE TO LOGOUT")
		}
	}
	var checkEventID = function(){
		return $q((resolve,reject) => {
			if($scope.eventName == null){
    			$http.get("getEventNameFromId",config)
    			.then(response => {
    				$scope.eventName = response.data[0].trim()
    				return resolve($scope.eventName);
    			});
    		}
    		else{
    			return resolve($scope.eventName);
    		}
		})
		
	}
	
	
	var showPage = function(){
		$scope.emoList=[
			{name:'upset',icon:'images/icons/upset.svg'},
			{name:'sad',icon:'images/icons/sad.svg'},
			{name:'neutral',icon:'images/icons/neutral.svg'},
			{name:'happy',icon:'images/icons/happy.svg'},
			{name:'glad',icon:'images/icons/glad.svg'}
		]
			
		$http.get('allTagPercents',config)
			.then(function(response){
				$scope.hashtagList =response.data;
				pageLoader.setLoading(false);
			},function(error){
				console.log("ERROR IN GETTING RESPONSE")
			});
		
		$scope.goToPostScreen = function(index){
			pageLoader.setLoading(true);
			var selTagData = $scope.hashtagList[index];
			$state.go('userPostScreen', {tagId : selTagData.id,tagName:selTagData.name ,tagDesc:selTagData.desc,eventId:$scope.eventId,eventName:$scope.eventName });
		}
	}
	
	
	checkEventID()
	.then(result => {
		UserAuthenticationService.isLoggedInUser($scope.eventName.trim()+$scope.eventId)
		.then(loggedIn => {
			if(!loggedIn){
				$mdDialog.show({
					controller: 'eventLoginModalController',
					templateUrl: 'views/modals/eventLoginModal.html',
					parent: angular.element(document.body),
					clickOutsideToClose:true,
					locals:{eventData:{name:$scope.eventName,id:$scope.eventId}},
					fullscreen: false
				})
				.then(function(match) {
					if(match){
						showPage();
					}
				}, function() {
					$state.go("userLogin",{},{location:false});
				});
				
				
			}
			else{
				showPage();
			}
		})
		.catch(err => console.log(err))
	})
	.catch(error => console.log(error))
	
	
	

});


////////////////////////////////////////////////////////////////////////////////////
//////////////        CONTROLLER FOR USER POSTSCREEN     ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("userPostScreenCtrl",function($scope, $q,$state,$stateParams,$http,$timeout,$mdDialog,pageLoader,UserAuthenticationService) {
		/*
		 * INIT ALL STATEPARAMS
		 * 
		 */
		pageLoader.setLoading(true);
        $scope.tagId = $stateParams.tagId;
        if($stateParams.tagName !==null){
        	$scope.tagName = $stateParams.tagName.trim();
        }
        if($stateParams.tagDesc !== null){
        	$scope.tagDesc = $stateParams.tagDesc;
        }
        $scope.eventId = $stateParams.eventId;	
    	$scope.eventName = $stateParams.eventName;
    	// fetch eventName if not present 
    	var config ={
    			params:{
    				eventId : $scope.eventId
    			}
    	}
    	/*
    	 * END INIT STATEPARAMS
    	 * 
    	 */
    	
    	
    	$scope.isAdmin = false
    	$scope.logout = function(){
    		if(UserAuthenticationService.logout($scope.isAdmin)){
    			$state.go("userLogin",{},{location:false})
    		}
    		else{
    			console.log("UNABLE TO LOGOUT")
    		}
    	}
    	var checkEventID = function(){
    		return $q((resolve,reject) => {
    			if($scope.eventName == null){
        			$http.get("getEventNameFromId",config)
        			.then(response => {
        				$scope.eventName = response.data[0].trim()
        				return resolve($scope.eventName);
        			});
        		}
        		else{
        			return resolve($scope.eventName);
        		}
    		})
    		
    	}
    	
    	var showPage = function(){
    		
    		$scope.curListTweets=[];
	    	$scope.prevListTweets=[];
	    	$scope.curTime=new Date();            	    	
	    	$scope.emoList=[            	    		
	    		{name:'upset',icon:'images/icons/upset.svg'},
	    		{name:'sad',icon:'images/icons/sad.svg'},
	    		{name:'neutral',icon:'images/icons/neutral.svg'},
	    		{name:'happy',icon:'images/icons/happy.svg'},
	    		{name:'glad',icon:'images/icons/glad.svg'}
	    	]
	    	
	    	$scope.preload=function(){	
	    		$scope.loadPercentgraph();
	    		$scope.getTweets();    		
	    		setInterval($scope.getTweets, 2000);    		
	    	}
	    	pageLoader.setLoading(false);
	    	
	    	$scope.postTweet = function(){
	    		$scope.copyTweet = $scope.selTweet;
	    		$scope.selTweet='';
	    		
	    		if($scope.copyTweet.length>0){
	    			var config={
	    					params:{
	    						selTag:$scope.tagId,
	    						selTweet:$scope.copyTweet
	    					}
	    				}
	    			$http.get("postTweet",config)
	    			.then(function(response){
	    				console.log("POSTED SUCCESSFULLY!!",response);
	    			});
	    			
	    		}
	    		else{
	    			console.log("CANNOT POST EMPTY STRING");
	    		}
	    	}
	    	
	    	$scope.resetTweets=function(){
	    		$scope.copyTweet=$scope.selTweet;
	    		$scope.selTweet='';
	    	}    	
	    	
		    $scope.getTweets=function(){ 
	    		var config={
	    				params:{
	    					curTimeMS:$scope.curTime.getTime(),
	    					hashTag:$scope.tagId
	    				}
	    		}    			
				$http.get("getTweets",config)
				.then(function(response){
					if(response.data.length>0){
						$scope.curTime=new Date();
						$scope.prevListTweets=$scope.curListTweets;
						$scope.curListTweets=$scope.prevListTweets.concat(response.data);
						$timeout(function () {    						
							var objDiv = document.getElementById("tweetContainer");						
							objDiv.scrollTop = objDiv.scrollHeight+1000;    						
					    }, 0,false);
						
						$scope.loadPercentgraph();
					}			
				},function(error){
					console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
				});
		    }
		    
		    $scope.loadPercentgraph =function(){ 
		    	var config={
						params:{
							selTag:$scope.tagId
						}
				}
		    	$http.get("perTagPercents",config)
				.then(function(response){
					$scope.emoPercents = response.data[0];
					if($scope.tagName == null){
						$scope.tagName = $scope.emoPercents['name'];
					}
					if($scope.tagDesc == null){
						$scope.tagDesc = $scope.emoPercents['desc'];
					}
				},function(error){
					console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
				});
		    }
		    
		    $scope.preload();
    	}
    	
    	
    	checkEventID()
    	.then(result => {
    		UserAuthenticationService.isLoggedInUser($scope.eventName.trim()+$scope.eventId)
        	.then(loggedIn => {
        		if(!loggedIn){
        			$mdDialog.show({
    					controller: 'eventLoginModalController',
    					templateUrl: 'views/modals/eventLoginModal.html',
    					parent: angular.element(document.body),
    					clickOutsideToClose:true,
    					locals:{eventData:{name:$scope.eventName.trim(),id:$scope.eventId}},
    					fullscreen: false
    				})
    				.then(function(match) {
    					if(match){
    						showPage();
    					}
    				}, function() {
    					$state.go("userLogin",{},{location:false});
    				});
            	}
            	else{
            		 showPage();
            		
            	}
        	})
        	.catch(err => console.log(err)) 
    	})
    	.catch(error => console.log(error))
    	
    	
       

});


////////////////////////////////////////////////////////////////////////////////////
//////////////        CONTROLLER FOR TOP HEADER Component     ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("iexpressHeaderCtrl",function($scope){
	
	
});

////////////////////////////////////////////////////////////////////////////////////
//////////////        CONTROLLER FOR LOADING PROGRESS Component     ////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("iexpressLoaderCtrl",function($scope,pageLoader,$timeout){
	$scope.activeLoading = function(){
		return pageLoader.getLoading();
	}
	
});


////////////////////////////////////////////////////////////////////////////////////
//////////////        CONTROLLER FOR USER EVENT LOGIN Modal     ////////////////////
////////////////////////////////////////////////////////////////////////////////////

app.controller("eventLoginModalController",function($scope,$mdDialog,UserAuthenticationService,eventData){	
	$scope.codeLength = 25;
	$scope.accessCode = "";
	$scope.eventData = eventData;
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
    	if(answer.length == $scope.codeLength){
    		$scope.errorMessages = {'lengthError' : false};
    		UserAuthenticationService.loginUser(eventData.id,eventData.name,answer)
    		.then(access_granted => {
    			if(access_granted){
        			$mdDialog.hide(true);
        		}
        		else{
        			$scope.errorMessages = {'accessCodeError' : true};
        		}
    		})    		
    	}
    	else{
    		$scope.errorMessages = {'lengthError' : true};
    	}
    };
});


app.controller("createEventModalController",function($scope,$http,$mdDialog){
	$scope.description ="";
	$scope.createEvent = function(){
		var config ={
				params:{
					name:$scope.name,
					description: $scope.description
				}
		}
		$http.get("postNewEvent",config)	
		.then(function(response){
			$scope.hide("DONE");
		},function(error){
			$scope.hide("UNABLE TO POST");
		});
	}
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});



app.controller("createTagModalController",function($scope,$http,$mdDialog,eventData){
	
	$scope.description ="";
	$scope.createTag = function(){
		var config ={
				params:{
					name:$scope.name,
					description: $scope.description,
					eventId : eventData.eventId
				}
		}
		$http.get("postNewTag",config)	
		.then(function(response){
			$scope.hide("DONE");
		},function(error){
			$scope.hide("UNABLE TO POST");
		})
		
	}
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});


app.controller("editEventModalController",function($scope,$http,$mdDialog,eventData){
	$scope.eventData = eventData
	$scope.updateEvent = function(){
		var config ={
				params:{
					name:$scope.eventData.name,
					description: $scope.eventData.description,
					eventId : $scope.eventData.eventId,
					is_active : $scope.eventData.is_active
				}
		}
		$http.get("updateEvent",config)	
		.then(function(response){
			$scope.hide("DONE");
		},function(error){
			$scope.hide("UNABLE TO POST");
		})
		
	}
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});



app.controller("editTagModalController",function($scope,$http,$mdDialog,tagData){
	
	$scope.tagData = tagData;
	$scope.updateTag = function(){
		var config ={
				params:{
					name:$scope.tagData.name,
					description: $scope.tagData.description,
					eventId : $scope.tagData.eventId,
					tagId : $scope.tagData.tagId
				}
		}
		$http.get("updateTag",config)	
		.then(function(response){
			$scope.hide("DONE");
		},function(error){
			$scope.hide("UNABLE TO POST");
		})
		
	}
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});
/*
 * 
 * END CONTROLLERS
 * 
 * 
 */
