(function(angular) {
  'use strict';
angular.module('myStatefulFilterApp', [])
  .filter('decorate', ['decoration', function(decoration) {

    function decorateFilter(input) {
      return decoration.symbol + input + decoration.symbol;
    }
    decorateFilter.$stateful = true;

    return decorateFilter;
  }])
  .controller('MyController', ['$scope', 'decoration', function($scope, decoration) {
    $scope.greeting = 'hello';
    $scope.decoration = decoration;
  }])
  .value('decoration', {symbol: '*'});
})(window.angular);