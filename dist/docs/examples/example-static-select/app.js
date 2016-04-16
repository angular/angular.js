(function(angular) {
  'use strict';
angular.module('staticSelect', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.data = {
     singleSelect: null,
     multipleSelect: [],
     option1: 'option-1',
    };

    $scope.forceUnknownOption = function() {
      $scope.data.singleSelect = 'nonsense';
    };
 }]);
})(window.angular);