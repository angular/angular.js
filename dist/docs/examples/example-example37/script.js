(function(angular) {
  'use strict';
angular.module('debounceExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = {};
  }]);
})(window.angular);