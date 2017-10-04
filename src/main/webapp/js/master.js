var app= angular.module("iexpress",["ngRoute","ngMaterial","ui.router"]);


app.run(function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});


/*
 * START CONFIG
 */
app.config(function($mdThemingProvider,$mdIconProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});

/*
 * END CONFIG
 */




/*
 * START FACTORIES 
 */


app.factory('hashtagData', function () {
    var tagData = {};
    return {
        saveTagData:function (data) {
        	tagData = data;
            //console.log(data);
        },
        getTagData:function () {
            return tagData;
        }
    };
});

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

/*
 * END FACTORIES
 */



/*
 * 
 * START CONTROLLERS
 * 
 * 
 * 
 */


app.controller("indexController",function($rootScope,$scope){});

app.controller("adminDashboardCtrl",function($scope,pageLoader){
	$scope.testVariable ="adminDashboardCtrl";
});

app.controller("adminLoginCtrl",function($scope){});

app.controller("userDashboardCtrl",function($scope,$http,$state,pageLoader){
	
	$scope.eventName = "tech Day";
	$scope.emoList=[
		{name:'upset',icon:'images/icons/upset.svg'},
		{name:'sad',icon:'images/icons/sad.svg'},
		{name:'neutral',icon:'images/icons/neutral.svg'},
		{name:'happy',icon:'images/icons/happy.svg'},
		{name:'glad',icon:'images/icons/glad.svg'}
	]
	pageLoader.setLoading(true);
	$http.get('allTagPercents')
		.then(function(response){
			$scope.hashtagList =response.data;
			pageLoader.setLoading(false);
			//console.log(JSON.stringify($scope.hashtagList));
		},function(error){
			console.log("ERROR IN GETTING RESPONSE")
		});
	
	$scope.goToPostScreen = function(index){
		pageLoader.setLoading(true);
		var selTagData = $scope.hashtagList[index];
		$state.go('userPostScreen', {tagId : selTagData.id,tagName:selTagData.name ,tagDesc:selTagData.desc  });
	}
});


app.controller("userLoginCtrl",function($scope,$http){
	//$scope.eventList = [{name:'event1'},{name:'event2'},{name:'event3'}];
	$scope.loadEvents = function(){
		$http.get("getEvents")
		.then(function(response){
			$scope.eventList = response.data;
			console.log(response.data);
		},function(error){
			console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
		});
	}
	
	$scope.loadEvents();
	
	
});

app.controller("userPostScreenCtrl",function($scope, $stateParams,$http,$timeout,pageLoader) {
		
        $scope.tagId = $stateParams.tagId;
        if($stateParams.tagName !==null){
        	$scope.tagName = $stateParams.tagName.trim();
        }
        if($stateParams.tagDesc !== null){
        	$scope.tagDesc = $stateParams.tagDesc;
        }
        
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
    	pageLoader.setLoading(true);
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
				console.log(JSON.stringify($scope.emoPercents));
			},function(error){
				console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
			});
	    }
	    
	    $scope.preload();

});



app.controller("iexpressHeaderCtrl",function($scope){});
app.controller("iexpressLoaderCtrl",function($scope,pageLoader,$timeout){
	$scope.activeLoading = function(){
		return pageLoader.getLoading();
	}
	
});


/*
 * 
 * END CONTROLLERS
 * 
 * 
 */
