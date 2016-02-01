'use strict';

angular.module('repeatAnimateBenchmark', ['ngAnimate'])
  .run(function($rootScope) {
    $rootScope.fileType = 'default';
  });

