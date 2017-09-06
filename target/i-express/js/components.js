var app= angular.module("iexpress");

app.component("iexpressHeader", {
  templateUrl: 'views/iexpressHeaderComponent.html',
  controller: 'iexpressHeaderCtrl'
});

app.component("iexpressLoader", {
  templateUrl: 'views/iexpressLoaderComponent.html',
  controller:	'iexpressLoaderCtrl'
});
