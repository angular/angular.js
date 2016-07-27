(function(angular) {
  'use strict';
angular.module('listExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.names = ['morpheus', 'neo', 'trinity'];
  }]);
})(window.angular);