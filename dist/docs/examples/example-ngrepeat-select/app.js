(function(angular) {
  'use strict';
angular.module('ngrepeatSelect', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.data = {
     repeatSelect: null,
     availableOptions: [
       {id: '1', name: 'Option A'},
       {id: '2', name: 'Option B'},
       {id: '3', name: 'Option C'}
     ],
    };
 }]);
})(window.angular);