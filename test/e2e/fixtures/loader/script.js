'use strict';

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
  controller('TestController', function($scope) {
    $scope.text = 'Hello, world!';
  });
