(function(angular) {
  'use strict';
angular.module('bindHtmlExample', ['ngSanitize'])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.myHTML =
       'I am an <code>HTML</code>string with ' +
       '<a href="#">links!</a> and other <em>stuff</em>';
  }]);
})(window.angular);