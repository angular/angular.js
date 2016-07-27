(function(angular) {
  'use strict';
angular.module('scopeExample', [])
  .controller('GreetController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.name = 'World';
    $rootScope.department = 'Angular';
  }])
  .controller('ListController', ['$scope', function($scope) {
    $scope.names = ['Igor', 'Misko', 'Vojta'];
  }]);
})(window.angular);