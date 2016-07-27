(function(angular) {
  'use strict';
angular.module('optionsExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = { name: 'say' };
  }]);
})(window.angular);