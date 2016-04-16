(function(angular) {
  'use strict';
angular.module('includeExample', ['ngAnimate'])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.templates =
      [ { name: 'template1.html', url: 'template1.html'},
        { name: 'template2.html', url: 'template2.html'} ];
    $scope.template = $scope.templates[0];
  }]);
})(window.angular);