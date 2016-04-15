(function(angular) {
  'use strict';
angular.module('locationExample', [])
  .controller('LocationController', ['$scope', '$location', function($scope, $location) {
    $scope.locationPath = function (newLocation) {
      return $location.path(newLocation);
    };
  }]);
})(window.angular);