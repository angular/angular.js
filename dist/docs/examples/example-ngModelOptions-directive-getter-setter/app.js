(function(angular) {
  'use strict';
angular.module('getterSetterExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    var _name = 'Brian';
    $scope.user = {
      name: function(newName) {
        return angular.isDefined(newName) ? (_name = newName) : _name;
      }
    };
  }]);
})(window.angular);