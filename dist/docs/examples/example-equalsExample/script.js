(function(angular) {
  'use strict';
angular.module('equalsExample', []).controller('ExampleController', ['$scope', function($scope) {
  $scope.user1 = {};
  $scope.user2 = {};
  $scope.result;
  $scope.compare = function() {
    $scope.result = angular.equals($scope.user1, $scope.user2);
  };
}]);
})(window.angular);