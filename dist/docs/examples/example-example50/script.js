(function(angular) {
  'use strict';
angular.module('cacheExampleApp', []).
  controller('CacheController', ['$scope', '$cacheFactory', function($scope, $cacheFactory) {
    $scope.keys = [];
    $scope.cache = $cacheFactory('cacheId');
    $scope.put = function(key, value) {
      if ($scope.cache.get(key) === undefined) {
        $scope.keys.push(key);
      }
      $scope.cache.put(key, value === undefined ? null : value);
    };
  }]);
})(window.angular);