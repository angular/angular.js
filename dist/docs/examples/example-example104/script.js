(function(angular) {
  'use strict';
angular.module('orderByExample', [])
  .controller('ExampleController', ['$scope', '$filter', function($scope, $filter) {
    var orderBy = $filter('orderBy');
    $scope.friends = [
      { name: 'John',    phone: '555-1212',    age: 10 },
      { name: 'Mary',    phone: '555-9876',    age: 19 },
      { name: 'Mike',    phone: '555-4321',    age: 21 },
      { name: 'Adam',    phone: '555-5678',    age: 35 },
      { name: 'Julie',   phone: '555-8765',    age: 29 }
    ];
    $scope.order = function(predicate, reverse) {
      $scope.friends = orderBy($scope.friends, predicate, reverse);
    };
    $scope.order('-age',false);
  }]);
})(window.angular);