var app= angular.module("iexpress",["ngRoute","ngMaterial","ui.router"]);

app.run(function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
app.config(function($mdThemingProvider,$mdIconProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});


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


app.controller("indexController",function($rootScope,$scope){
	$scope.testVariable="THIS IS THE INDEX CONTROLLER WHICH IS USED FOR LOADING THE VIEWS";

});

app.controller("adminDashboardCtrl",function($scope){
	$scope.testVariable ="adminDashboardCtrl";
});

app.controller("adminLoginCtrl",function($scope){});

app.controller("userDashboardCtrl",function($scope,$http,$state){
	
	$scope.eventName = "tech Day";
	$scope.emoList=[
		{name:'upset',icon:'images/icons/upset.svg'},
		{name:'sad',icon:'images/icons/sad.svg'},
		{name:'neutral',icon:'images/icons/neutral.svg'},
		{name:'happy',icon:'images/icons/happy.svg'},
		{name:'glad',icon:'images/icons/glad.svg'}
	]
	
	$http.get('allTagPercents')
		.then(function(response){
			$scope.hashtagList =response.data;
			//console.log(JSON.stringify($scope.hashtagList));
		},function(error){
			console.log("ERROR IN GETTING RESPONSE")
		});
	
	$scope.goToPostScreen = function(index){
		var selTagData = $scope.hashtagList[index];
		$state.go('userPostScreen', {tagId : selTagData.id,tagName:selTagData.name ,tagDesc:selTagData.desc  });
	}


});
app.controller("userLoginCtrl",function($scope){});
app.controller("userPostScreenCtrl",function($scope, $stateParams,$http,$timeout) {
        $scope.tagId = $stateParams.tagId;
        //$scope.tagName = $stateParams.tagName;
        $scope.hashtag = $stateParams.tagName.trim();
        $scope.tagDesc = $stateParams.tagDesc;
        
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
    					hashTag:$scope.hashtag.trim()
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
				console.log(JSON.stringify($scope.emoPercents));
			},function(error){
				console.log("THERE HAS BEEN AN ERROR IN QUERYING THE DATABASE"+error);
			});
	    }
	    
	    $scope.preload();

});



app.controller("iexpressHeaderCtrl",function($scope){});
app.controller("iexpressLoaderCtrl",function($scope){
	$scope.isLoading = false;
});
