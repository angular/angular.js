(function(angular) {
  'use strict';
angular.module('customTriggerExample', [])
 .controller('ExampleController', ['$scope', function($scope) {
   $scope.user = {};
 }]);
})(window.angular);