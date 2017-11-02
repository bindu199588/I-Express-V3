var app= angular.module("iexpress");

app.component("iexpressHeader", {
  templateUrl: 'views/components/iexpressHeaderComponent.html',
  controller: 'iexpressHeaderCtrl'
});

app.component("iexpressLoader", {
  templateUrl: 'views/components/iexpressLoaderComponent.html',
  controller:	'iexpressLoaderCtrl'
});
