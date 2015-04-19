'use strict';
var app = angular.module("futureproofs", ['LocalStorageModule']);
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('futureproofs')
    .setStorageType('localStorage');
});


