'use strict';

angular.module('repeatAnimateBenchmark', ['ngAnimate'])
  .config(function($animateProvider) {
    $animateProvider.classNameFilter(/animate-/);
  })
  .run(function($rootScope) {
    $rootScope.fileType = 'classfilter';
  });
