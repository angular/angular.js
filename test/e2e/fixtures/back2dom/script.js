'use strict';

angular
  .module('test', [])
  .run(function($rootScope) {
    $rootScope.internalFnCalled = false;

    $rootScope.internalFn = function() {
        $rootScope.internalFnCalled = true;
    };
  });
