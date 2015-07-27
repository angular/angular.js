(function(angular) {
  'use strict';
angular.module('getterSetterExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    var _name = 'Brian';
    $scope.user = {
      name: function(newName) {
        if (angular.isDefined(newName)) {
          _name = newName;
        }
        return _name;
      }
    };
  }]);
})(window.angular);