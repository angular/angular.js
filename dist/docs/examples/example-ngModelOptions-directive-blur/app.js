(function(angular) {
  'use strict';
angular.module('optionsExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = { name: 'John', data: '' };

    $scope.cancel = function(e) {
      if (e.keyCode == 27) {
        $scope.userForm.userName.$rollbackViewValue();
      }
    };
  }]);
})(window.angular);