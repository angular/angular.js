(function(angular) {
  'use strict';
angular.module('scopeExample', [])
  .controller('MyController', ['$scope', function($scope) {
    $scope.username = 'World';

    $scope.sayHello = function() {
      $scope.greeting = 'Hello ' + $scope.username + '!';
    };
  }]);
})(window.angular);