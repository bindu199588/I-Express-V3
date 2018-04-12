var app= angular.module("iexpress",["ngRoute", "ngMessages","ngMaterial","ui.router","ngMaterialDatePicker"]);
app.run(function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/*
 * START APP CONFIG
 */

app.config(function($mdIconProvider) {
  $mdIconProvider
     .defaultIconSet('images/icons/icons.svg');
 });

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
		var config ={
				secretString : cookieString
		}
		return $http.post("rest/encryptString",config)
		.then(response => {
			return response.data;
		})
		.catch(err => console.log("ERROR IN ENCRYPTION"+err))
	}
	thisFactory.decryptCookie = function(cookieString){
		var config ={
				secretString : cookieString
		}
		return $http.post("rest/decryptString",config)
		.then(response => {
			return response.data
			
		})
		.catch(err => console.log("ERROR IN DECRYPTION"+err))
	}
	thisFactory.getLoginCookie = function(isAdmin) {
		return $q((resolve,reject) =>{
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
		            return resolve(c.substring(name.length, c.length));
		        }
		    }
	    	return resolve("");
		})
		
	}	
	thisFactory.setLoginCookie = function(cookieName,isAdmin){
		return $q((resolve,reject) =>{
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
				return resolve(true);
			})
			
			
		});
		
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
	thisFactory.loginUser = function(access_code){
		var config ={
				secretString: access_code
		}
		return $http({
		    method: 'POST',
		    url: 'rest/loginUser',
		    data: config
		})
		.then(function(response){
			if(response.data && response.data!=""){
				//console.log(response.data)
				cookieData = {
					id:response.data.id,
					name:response.data.name.trim(),
					desc:response.data.description.trim()
				}
				
				return thisFactory.setLoginCookie(JSON.stringify(cookieData),false)
				.then(result => {
					return true
				},(err)=>{
					console.log(err)
				})
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
		return $http.post("rest/loginAdmin",config)
		.then(function(response){
			if(response.data){
				return thisFactory.setLoginCookie(username,true)
				.then(result=>{
					return true;
				},(err)=>{
					console.log(err)
				})
				
			}
			else{
				return false;
			}
		},function(error){
			console.log("ERROR IN LOGGING IN ADMIN")
		})
	}
	
	thisFactory.isLoggedInAdmin = function(){
		return $q((resolve,reject) => {				
			return thisFactory.getLoginCookie(true)
			.then(response =>{
				var existingCookie = response;
				if(existingCookie!=null && existingCookie !=""){
					return resolve(true);
				}
				else{
					return resolve(false);
				}
			});			
		})
	}
	thisFactory.checkEventLogin = function(){
		return $q((resolve,reject) => {				
			return thisFactory.getLoginCookie(false)
			.then(response =>{
				var existingCookie = response;
				if(existingCookie!=null && existingCookie !=""){
					return thisFactory.decryptCookie(existingCookie)
					.then(result=>{
						return resolve(result);
					})
				}
				else{								
					return resolve("");					
				}
			})
		})	
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

//////////////////////////////////////////////////////////////////////////////////////
////////////          CONTROLLER FOR ADMIN DASHBOARD     /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.controller("adminDashboardCtrl",function($scope,$http,$state,$mdDialog,pageLoader,UserAuthenticationService){	
	/*
	 * GET THE LIST OF ALL EXISTING EVENTS
	 */
	UserAuthenticationService.isLoggedInAdmin()
	.then(response => {
		if(!response){
			$state.go("adminLogin",{},{location:false});
		}
		else{
	    	$scope.isAdmin = true
	    	$scope.activeTagForDownload = null
	    	$scope.logout = function(){
	    		if(UserAuthenticationService.logout($scope.isAdmin)){
	    			$state.go("adminLogin",{},{location:false});
	    		}
	    		else{
	    			console.log("UNABLE TO LOGOUT")
	    		}    			
	    	}
			$scope.loadEvents = function(){
				$http.get("rest/getAllEvents")
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
				$http.get("rest/disableEvent",config)
				.then(function(response){
				},function(error){
					console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
				})
			}
			$scope.showAccessCode = function(ev,index){
				$scope.setThisEventActive(index)
				$scope.activeEvent['showAccess'] = true
			}
			
			/* 
			 * SET THE SELECTED EVENT AS ACTIVE
			 */
			$scope.setThisEventActive = function(index){
				$scope.activeEventIndex = index;
				$scope.activeEvent = $scope.eventList[index];
				$scope.getTagsForEventId($scope.activeEvent['id']);
				$scope.getTimeLineGraph($scope.activeEvent['id'],null);
				$scope.currentTagsList = [];
			}
			
			$scope.getTimeLineGraph =function(eventId,tagId){
				var config = {
						params:{
							eventId:eventId,
							tagId : tagId,
						}
				}
				$http.get("rest/getEventGraphData",config)
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
				$http.get("rest/getTagsFromEventId",config)
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
				$scope.currentTagsList.splice(index,1);
			}
			/*
			 * EDIT TAG WHICH ARE NOT IN DATABASE
			 */
			
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
				    		  name:$scope.currentTagsList[index]['name'],
				    		  description:$scope.currentTagsList[index]['description'],
				    		  eventId : $scope.currentTagsList[index]['event_id']
				    	  }
				      }	
				})
				.then(function(answer){	
					console.log(answer);
					$scope.currentTagsList[index] = response
				},function(){
					
				})
			}
			
			$scope.saveTagChanges = function(){
				if($scope.currentTagsList.length >0 ){
					$http.post('rest/postNewTag',$scope.currentTagsList)
					.then(response => {
						$scope.currentTagsList = [];
						$scope.getTagsForEventId($scope.activeEvent['id']);
					})
					.catch(err=>console.log(err))
				}
				
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
					$scope.currentTagsList.push(response)
				},function(){
					console.log("CREATION CANCELLED");
				});
			}
			
			$scope.openCreateAgendaModal = function(ev){
				$mdDialog.show({
					  controller: 'adminEventAgendaModalCtrl',
				      templateUrl: 'views/modals/adminEventAgendaModal.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      locals:{eventData:{eventId : $scope.activeEvent['id']}},
				      fullscreen: true
				})
				.then(function(response){
					$scope.currentTagsList.push(response)
				},function(){
					console.log("CREATION CANCELLED");
				});
			}
			
			var downloadDataAsFile = function(data,fileName){
			   var a = document.createElement('a');
			   a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(data);
			   a.target = '_blank';
			   a.download = fileName;
			   document.body.appendChild(a);
			   a.click();
			}
			$scope.downloadComments = function(){
				if($scope.activeTagForDownload){
					var tagId = $scope.activeTagForDownload['id']
					var tagName = $scope.activeTagForDownload['name'].trim()
				}
				var config = {
						params:{
							eventId : $scope.activeEvent['id'],
							tagId :   tagId || null
						}
				}
				$http.get("rest/exportComments",config)
				.then(response => {
					var fileName = 'CommentsList-['+ $scope.activeEvent['name'].trim() + '][' + (tagName || 'allTags') +'].txt';
					downloadDataAsFile(response.data,fileName);
				});
			}
			$scope.downloadQuestions = function(){
				var config = {
						params:{
							eventId : $scope.activeEvent['id']
						}
				}
				$http.get("rest/exportQuestions",config)
				.then(response => {
					var fileName = 'QuestionsList-['+ $scope.activeEvent['name'].trim() + '].txt';
					downloadDataAsFile(response.data,fileName);
				});
			}
		}
	})
	.catch(err=>console.log(err))
	
	
});

//////////////////////////////////////////////////////////////////////////////////////
////////////////          CONTROLLER FOR ADMIN LOGIN     /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
app.controller("adminLoginCtrl",function($scope,$state,UserAuthenticationService){
	UserAuthenticationService.isLoggedInAdmin()
	.then(response => {
		if(response){
			$state.go("adminDashboard",{},{location:false});
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
		
	})
	.catch(err=>console.log(err))
	
});


//////////////////////////////////////////////////////////////////////////////////////
////////////////CONTROLLER FOR USER LOGIN        /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.controller("userLoginCtrl",function($scope,$http,$mdDialog,$state,pageLoader,UserAuthenticationService){

			pageLoader.setLoading(false);
			$scope.askAccess = function(ev) {				
				$mdDialog.show({
					controller: 'eventLoginModalController',
					templateUrl: 'views/modals/eventLoginModal.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: false
				})
				.then(function(match) {
					if(match){												
						$state.go('userDashboard');						
					}
				}, function() {
					console.log('You cancelled the dialog.');
				});
			}

});
//////////////////////////////////////////////////////////////////////////////////////
////////////////        CONTROLLER FOR USER DASHBOARD    /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
app.controller("userDashboardCtrl",function($scope,$http,$state,$stateParams,$mdDialog,pageLoader,UserAuthenticationService){
	pageLoader.setLoading(true);
	$scope.isAdmin = false	
	$scope.eventData = $stateParams.eventData;
	var showPage = function(){
		$scope.emoList=[
			{name:'upset',icon:'upset'},
			{name:'sad',icon:'sad'},
			{name:'neutral',icon:'neutral'},
			{name:'happy',icon:'happy'},
			{name:'glad',icon:'glad'}
		]
		var config ={
				params:{
					eventId : $scope.eventData.id
				}
		}
		$http.get('rest/allTagPercents',config)
			.then(function(response){
				$scope.hashtagList =response.data;
				pageLoader.setLoading(false);
			},function(error){
				console.log("ERROR IN GETTING RESPONSE")
			});
		
		$scope.goToPostScreen = function(index){
			pageLoader.setLoading(true);
			var selTagData = $scope.hashtagList[index];
			$state.go('userPostScreen', {tagId : selTagData.id,tagName:selTagData.name ,tagDesc:selTagData.desc,eventData:$scope.eventData});
		}
		$scope.logout = function(){
			if(UserAuthenticationService.logout($scope.isAdmin)){
				$state.go("userLogin",{},{location:false})
			}
			else{
				console.log("UNABLE TO LOGOUT")
			}
		}
		
		$scope.showAgenda = function(ev){
			$mdDialog.show({
				controller: 'userEventAgendaModalCtrl',
				templateUrl: 'views/modals/userEventAgendaModal.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals:{eventData:$scope.eventData},
				fullscreen: true
			})
			.then(function(answer) {				
			}, function() {
				console.log('You cancelled the dialog.');
			});
		}
		
		$scope.showQuestions = function(ev){
			$mdDialog.show({
				controller: 'userQuestionsModalCtrl',
				templateUrl: 'views/modals/userQuestionsModal.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals:{eventData:$scope.eventData},
				fullscreen: true
			})
			.then(function(answer) {				
			}, function() {
				console.log('You cancelled the dialog.');
			});
		}
	}
	showPage();

});


//////////////////////////////////////////////////////////////////////////////////////
////////////////        CONTROLLER FOR USER POSTSCREEN     ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
app.controller("userPostScreenCtrl",function($scope,$interval, $q,$state,$stateParams,$http,$timeout,pageLoader,UserAuthenticationService) {
		/*
		 * INIT ALL STATEPARAMS
		 * 
		 */
		pageLoader.setLoading(true);
        $scope.tagId = $stateParams.tagId;
        $scope.intervalPromise;
        
        if($stateParams.tagName !==null){
        	$scope.tagName = $stateParams.tagName.trim();
        }
        if($stateParams.tagDesc !== null){
        	$scope.tagDesc = $stateParams.tagDesc;
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
    	var showPage = function(){    		
    		$scope.curListTweets=[];
	    	$scope.prevListTweets=[];
	    	$scope.curTimeMS = 0;           	    	
	    	$scope.emoList=[            	    		
	    		{name:'upset',icon:'upset'},
	    		{name:'sad',icon:'sad'},
	    		{name:'neutral',icon:'neutral'},
	    		{name:'happy',icon:'happy'},
	    		{name:'glad',icon:'glad'}
	    	]
	    	
	    	$scope.preload=function(){	
	    		$scope.loadPercentgraph();
	    		$scope.getTweets($scope.curTimeMS,$scope.tagId);
    			$scope.intervalPromise = $interval(function(){
    				$scope.getTweets();
    			}, 2000);
	    		
	    		
	    		
//	    		var refreshingPromise; 
//	    		var isRefreshing = false;  
//	    		$scope.startRefreshing(refreshingPromise,isRefreshing);	    		 		
	    	}

	    	$scope.$on('$destroy',function(){
	    	    if($scope.intervalPromise)
	    	        $interval.cancel($scope.intervalPromise);   
	    	});
//	    	$scope.startRefreshing = function(refreshingPromise,isRefreshing){
//    		   if(isRefreshing) return;
//    		   isRefreshing = true;
//    		   (function refreshEvery(){
//    			   	 $scope.getTweets()
//    		         refreshingPromise = $timeout(refreshEvery,2000);
//    		    }());
//	    	}
	    	
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
	    			$http.get("rest/postTweet",config)
	    			.then(function(response){
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
	    	
		    $scope.getTweets=function(timeLastUpdate,tagId){ 
		    	console.log(timeLastUpdate + "TAG ID IS" + tagId);
		    	console.log($scope.curTimeMS)
	    		var config={
	    				params:{
	    					curTimeMS:timeLastUpdate || $scope.curTimeMS,
	    					hashTag:tagId || $scope.tagId
	    				}
	    		}    			
				$http.get("rest/getTweets",config)
				.then(function(response){
					if(response.data.length>0){
						$scope.curTimeMS =Number(response.data[response.data.length - 1]['created_on']);						
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
		    	$http.get("rest/perTagPercents",config)
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
    	showPage();

});


app.controller('userQuestionScreenCtrl',function($scope,pageLoader,UserAuthenticationService,$state,$stateParams,$http){
	$scope.logout = function(){
		if(UserAuthenticationService.logout($scope.isAdmin)){
			$state.go("userLogin",{},{location:false})
		}
		else{
			console.log("UNABLE TO LOGOUT")
		}
	}
});

//////////////////////////////////////////////////////////////////////////////////////
////////////////        CONTROLLER FOR TOP HEADER Component     ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.controller("iexpressHeaderCtrl",function($scope){
	
	
});

//////////////////////////////////////////////////////////////////////////////////////
////////////////        CONTROLLER FOR LOADING PROGRESS Component     ////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.controller("iexpressLoaderCtrl",function($scope,pageLoader,$timeout){
	$scope.activeLoading = function(){
		return pageLoader.getLoading();
	}
	
});


//////////////////////////////////////////////////////////////////////////////////////
////////////////        CONTROLLER FOR USER EVENT LOGIN Modal     ////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.controller("eventLoginModalController",function($scope,$mdDialog,UserAuthenticationService){	
	$scope.codeLength = 5;
	$scope.accessCode = "";
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
    	if(answer.length == $scope.codeLength){
    		$scope.errorMessages = {'lengthError' : false};
    		UserAuthenticationService.loginUser(answer)
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
		$http.get("rest/postNewEvent",config)	
		.then(function(response){
			$mdDialog.hide("DONE");
		},function(error){
			$mdDialog.hide("UNABLE TO POST");
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
		$mdDialog.hide({
			name:$scope.name,
			description: $scope.description,
			event_id : eventData.eventId
		});	
	}	
	$scope.hide = function() {
	      $mdDialog.hide();
	}	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});


app.controller("editTagModalController",function($scope,$http,$mdDialog,tagData){
	
	$scope.tagData = tagData;
	$scope.updateTag = function(){
		$mdDialog.hide({
			name:$scope.tagData.name,
			description: $scope.tagData.description,
			event_id : $scope.tagData.eventId
		});
	}
	
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
});


app.controller('adminEventAgendaModalCtrl',function($scope,$mdDialog,$http,$filter,eventData,mdcDateTimeDialog){

	$scope.unsavedAgendaList = [];
	$scope.savedAgendaList = [];
	$scope.curAgenda = {};
	$scope.displayTime = {}
	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	
	$scope.addNewAgendaItem = function(){
		if($scope.curAgenda.agenda.length>0){
			$scope.showAgendaInput = false;
			$scope.curAgenda.event_id = eventData.eventId;
			$scope.unsavedAgendaList.push($scope.curAgenda);
			$scope.curAgenda = {};
			$scope.displayTime ={};
		}
		else{
			$scope.errorMessages = {
					required:true
			}
		}
	}
	$scope.displayDateDialog = function (nameOfTime) {
		var timeNow = new Date();
		if(nameOfTime == 'start_time'){
			var config = {					
			  minDate: $scope.curAgenda.start_time || new Date(timeNow.getFullYear(),timeNow.getMonth()-1,timeNow.getDate()),
	          maxDate: $scope.curAgenda.end_time,
	          time: true
			}
		}
		else if(nameOfTime == 'end_time'){			
			var config = {			          
	          minDate: $scope.curAgenda.start_time || new Date(timeNow.getFullYear(),timeNow.getMonth()-1,timeNow.getDate()),
	          time: true
			}
		}
        mdcDateTimeDialog.show(config)
       .then(function (date) {        	  
    	  $scope.curAgenda[nameOfTime] = date.getTime()
    	  $scope.displayTime[nameOfTime] = $filter('date')(date, 'dd MMM yyyy hh:mm a');
       }, function() {
        console.log('Selection canceled');
       });
   }
	
	$scope.cancelAgendaInput = function(){
			$scope.curAgenda = {};
			$scope.displayTime ={};
			$scope.showAgendaInput = false
	}
	
	$scope.saveAgenda = function(){		
		$http.post('rest/postEventAgenda',$scope.unsavedAgendaList)
		.then(response =>{
			$scope.getEventAgenda();
			$scope.unsavedAgendaList = [];
		})
		.catch(err => console.log(err))
	}
	
	$scope.getEventAgenda = function(){
		var config = {
				params:{
					event_id: eventData.eventId
				}
		}
		$http.get('rest/loadEventAgenda',config)
		.then(response =>{
			$scope.savedAgendaList = response.data;
		})
	}
	$scope.getEventAgenda();
});

app.controller('userEventAgendaModalCtrl',function($scope,$mdDialog,$http,eventData){

	$scope.hide = function() {
	      $mdDialog.hide();
	};
	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	
	$scope.getEventAgenda = function(){
		var config = {
				params:{
					event_id: eventData.id
				}
		}
		$http.get('rest/loadEventAgenda',config)
		.then(response =>{
			$scope.agendaList = response.data;
		})
	}
	$scope.getEventAgenda();
});

app.controller('userQuestionsModalCtrl',function($scope,$mdDialog,$interval,$http,$q,$timeout,eventData){
	$scope.eventData = eventData;
	$scope.hide = function() {
	      $mdDialog.hide();
	};	
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	$scope.lastUpdatedTimeMS = 0;
	$scope.curListQuests = [];
	$scope.postQuestion = function(userQuestion,eventId){
		var config={
				event_id : eventId || eventData.id,
				question : userQuestion
		}
		return $q((resolve,reject) =>{
			$http.post("rest/postQuestion",config)
			.then(response =>{
				console.log("POSTED QUESTION")
				resolve(response);
			})
			.catch(err=>{
				console.log(err);
				resolve(false);
			})		
		})
	}
	$scope.askQuestion = function(){		
		if($scope.curUserQuestion && $scope.curUserQuestion.length > 0){
			var copyUserQuestion =$scope.curUserQuestion;
			$scope.curUserQuestion ="";
			$scope.postQuestion(copyUserQuestion,eventData.id)
			.then(response => {
				if(response){
						//show a toast for 5 seconds
						console.log("POSTED SUCCESSFULLY");
				}
				else{
					console.log("ERROR OCCURED WHILE POSTING.. ")
					//show toast with error message for 5 seconds
				}
			})
		}
		else{
			//show toast with error message for 5 seconds
			console.log("QUESTION CANNOT BE EMPTY");
		}	
	}
	
	$scope.likeQuestion = function($index,questionId){
		var config={
				id : questionId
		}
		$http.post('rest/likeQuestion',config)
		.then(response => {
			console.log(response.data);
		})
		.catch(err => {
			//do something // show a toast maybe
		})
	}
	
	$scope.loadQuestions = function(lastUpdateTimeMS){
		var config = {
				created_on : lastUpdateTimeMS || $scope.lastUpdatedTimeMS,
				event_id : eventData.id
		}		
		console.log(lastUpdateTimeMS)
		$http.post('rest/loadQuestions',config)
		.then(response =>{
			if(response.data && response.data.length>0){
				$scope.lastUpdatedTimeMS =Number(response.data[response.data.length - 1]['created_on']);
				$scope.curListQuests=$scope.curListQuests.concat(response.data);						
				$timeout(function () {    						
					var objDiv = document.getElementById("questionContainer");						
					objDiv.scrollTop = objDiv.scrollHeight+1000;    						
			    }, 0,false);
			}
			
		},function(err){
			console.log(err);
		})
	}
	
	$scope.refreshQuestions =function(){
		$scope.intervalPromise = $interval(function(){
			$scope.loadQuestions();
		},2000)
	}
	
	$scope.preload = function(){
		$scope.loadQuestions($scope.lastUpdatedTimeMS);
		$scope.refreshQuestions();
	}
	$scope.preload();
	$scope.$on('$destroy',function(){
		if($scope.intervalPromise)
	        $interval.cancel($scope.intervalPromise);
	});
});

///*
// * 
// * END CONTROLLERS
// * 
// * 
// */
