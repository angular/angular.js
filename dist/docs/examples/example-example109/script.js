(function(angular) {
  'use strict';
angular.module('logExample', [])
  .controller('LogController', ['$scope', '$log', function($scope, $log) {
    $scope.$log = $log;
    $scope.message = 'Hello World!';
  }]);
})(window.angular);