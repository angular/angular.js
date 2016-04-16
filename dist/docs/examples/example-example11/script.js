(function(angular) {
  'use strict';
angular.module('docsBindExample', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.name = 'Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)';
  }]);
})(window.angular);