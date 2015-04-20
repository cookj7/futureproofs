'use strict';
// controller: ctrl
app.controller('ctrl', ['$scope', '$rootScope', 'plotService', function ($scope, $rootScope, plotService){
  $scope.plotService = plotService;
  $scope.layout = {
    topBar: 'js/client/view/partial/topbar.html',
    bottomBar: 'js/client/view/partial/bottombar.html'
  };
  
  // image source (TODO: make dynamic)
  plotService.imgSource = 'img/img.jpeg'
  
}]);

