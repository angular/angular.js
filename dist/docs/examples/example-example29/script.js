(function(angular) {
  'use strict';
angular.module('myReverseFilterApp', [])
  .filter('reverse', function() {
    return function(input, uppercase) {
      input = input || '';
      var out = "";
      for (var i = 0; i < input.length; i++) {
        out = input.charAt(i) + out;
      }
      // conditional based on optional argument
      if (uppercase) {
        out = out.toUpperCase();
      }
      return out;
    };
  })
  .controller('MyController', ['$scope', function($scope) {
    $scope.greeting = 'hello';
  }]);
})(window.angular);