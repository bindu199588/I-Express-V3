var app= angular.module("iexpress");
app.run(function($transitions,UserAuthenticationService,$mdDialog) {
		$transitions.onBefore({}, function(transition) {
//			return new Promise((resolve,reject) => {
//				return resolve(true);
//			})
			return new Promise((resolve,reject) => {
//				console.log('came to authenticate')
				toState = transition.to();
				var toParams = Object.assign({}, transition.params());
				
				var stateService = transition.router.stateService;
				if(toState.authenticate){
					if(toState.isAdmin){
//						console.log("HERE IN ADMIN DASHBOARD");
						UserAuthenticationService.isLoggedInAdmin()
				        .then(response => {
				    		if(!response){
				    			return resolve(stateService.target("adminLogin"));
				    		}
				    		else{						    			
				    			return resolve(true);
				    		}
				        })
				        .catch(err => console.log(err))
					}
					else{
//						console.log(toParams)
						if(toParams.eventData!=null && toParams.eventData != ""){
							return resolve(true);
						}
						else{
//							console.log("PARAMS NOT PRESENT")
							UserAuthenticationService.checkEventLogin()
						      .then(eventData => {
								if(eventData != null && eventData!=""){		 
									toParams.eventData = eventData;
//									console.log(toParams)
									return resolve(stateService.target(transition.to().name, toParams));
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
											return resolve(stateService.target("userLogin"));
										}
										else{
											return resolve(stateService.target(transition.to().name));
										}
									}, function() {
										return resolve(stateService.target("userLogin"));
									});
								}
						      })
						      .catch(err => console.log(err))
						}
					}
				}
				else{
					if(toState.isAdmin){
//						console.log("HERE IN ADMIN LOGIN");
						UserAuthenticationService.isLoggedInAdmin()
				        .then(response => {
				    		if(response){
				    			 return resolve(stateService.target("adminDashboard"));
				    		}
				    		else{
				    			return resolve(true);
				    		}
				        })
					}
					else{
//						console.log("HERE IN USER LOGIN");
						UserAuthenticationService.checkEventLogin()
					      .then(eventData => {
//					    	  console.log(eventData);
					    	  if(eventData != null && eventData != ""){	
//					    		  console.log("HERE")
					    		  return resolve(stateService.target("userDashboard",{eventData:eventData}));
					    	  }
					    	  else{
					    		  return resolve(true);
					    	  }
					      });
					}
				}
				
			})

		})
})
