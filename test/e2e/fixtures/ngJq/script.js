angular.module('test', [])
  .run(function($rootScope) {
    $rootScope.jqueryVersion = window.angular.element().jquery || 'jqLite';
  });
