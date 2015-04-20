'use strict';
var app = angular.module("futureproofs", ['LocalStorageModule', 'ngRoute']);
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('futureproofs')
    .setStorageType('localStorage');
}).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html',
        controller: 'ctrl'
    }).
      otherwise({
        redirectTo: '/'
      });
}]);/**/
