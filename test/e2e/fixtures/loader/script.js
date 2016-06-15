angular.
  module('test', [
    'ngTouch',
    'ngSanitize',
    'ngRoute',
    'ngResource',
    'ngParseExt',
    'ngMessages',
    'ngMessageFormat',
    'ngCookies',
    'ngAria',
    'ngAnimate'
  ]).
  controller('TestCtrl', function TestCtrl($scope) {
    $scope.text = 'Hello, world!';
  });
