(function(angular) {
  'use strict';
angular.module('eventExampleApp', []).
  controller('EventController', ['$scope', function($scope) {
    /*
     * expose the event object to the scope
     */
    $scope.clickMe = function(clickEvent) {
      $scope.clickEvent = simpleKeys(clickEvent);
      console.log(clickEvent);
    };

    /*
     * return a copy of an object with only non-object keys
     * we need this to avoid circular references
     */
    function simpleKeys (original) {
      return Object.keys(original).reduce(function (obj, key) {
        obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
        return obj;
      }, {});
    }
  }]);
})(window.angular);