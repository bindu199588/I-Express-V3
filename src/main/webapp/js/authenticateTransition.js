var app= angular.module("iexpress");
app.run(function($rootScope,UserAuthenticationService,$state,$stateParams,$mdDialog,$urlRouter) {
	
	  $rootScope.$on("$stateChangeStart", function(evt, toState, toParams, fromState, fromParams){
		  evt.preventDefault();
		  console.log('PARMAS ARE');
		  console.log(toParams);
		  if(toState.authenticate){
				if(toState.isAdmin){
					console.log("HERE IN AUTHENTICATE.JS toState.authenticate:true toState.isAdmin:true")
					 UserAuthenticationService.isLoggedInAdmin()
				        .then(response => {
				    		if(!response){				    							    			
				    			return $state.transitionTo("adminLogin");
				    		}
				    		else{
				    			$urlRouter.sync();
				    		}
				        })
				        .catch(err => console.log(err))
				}
				else{
					console.log("HERE IN AUTHENTICATE.JS toState.authenticate:true  toState.isAdmin:false")
					UserAuthenticationService.checkEventLogin()
				      .then(eventData => {
						if(eventData != null && eventData!=""){						
//							var paramsCopy = Object.assign({}, toParams);
//							paramsCopy.eventData = eventData;
//							$stateParams = Object.assign({}, paramsCopy);
//							$state.go(toState.name, paramsCopy);
							toParams.eventData = eventData;
							$urlRouter.sync();
						}
						else{							
							$mdDialog.show({
								controller: 'eventLoginModalController',
								templateUrl: 'views/modals/eventLoginModal.html',
								parent: angular.element(document.body),
								clickOutsideToClose:true,
								fullscreen: false
							})
							.then(function(match) {
								if(!match){									
									$state.transitionTo("userLogin");
								}
								else{
									$urlRouter.sync();
								}
							}, function(err) {								
								$state.transitionTo("userLogin");
							});
						}
				      })
				      .catch(err => console.log(err))
				}
			}
			else{
				console.log("HERE IN AUTHENTICATE.JS toState.authenticate:false")
				if(toState.isAdmin){
					console.err("HERE IN AUTHENTICATE.JS toState.authenticate:false  toState.isAdmin:true")
					UserAuthenticationService.isLoggedInAdmin()
			        .then(response => {
			    		if(response){
			    			 return $state.transitionTo("adminDashboard");
			    		}
			    		else{
			    			$urlRouter.sync();
			    		}
			        })
				}
				else{					
					UserAuthenticationService.checkEventLogin()
				      .then(eventData => {
				    	  if(eventData != null && eventData != ""){				    		  
				    		  $state.transitionTo("userDashboard",{eventData:eventData});
				    	  }	
				    	  else{
				    		  console.log('here')
				    		  $urlRouter.sync();
				    	  }
				      });
				}
			}
	  });
});

