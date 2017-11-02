var app= angular.module("iexpress");

app.run(function ($rootScope, $state, UserAuthenticationService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !UserAuthenticationService.isLoggedIn()){
      // User isn’t authenticated
      $state.transitionTo("userLogin");
      event.preventDefault(); 
    }
  });
});