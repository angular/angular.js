(function(angular) {
  'use strict';
angular.module('orderByExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.friends =
        [{name:'John', phone:'555-1212', age:10},
         {name:'Mary', phone:'555-9876', age:19},
         {name:'Mike', phone:'555-4321', age:21},
         {name:'Adam', phone:'555-5678', age:35},
         {name:'Julie', phone:'555-8765', age:29}];
    $scope.predicate = 'age';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  }]);
})(window.angular);