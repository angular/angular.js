'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngCsp
 * @priority 1000
 *
 * @description
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.
 * CSP forbids apps to use eval or
 * Function(string) generated functions (among other things). For us to be
 * compatible, we just need to implement the "getterFn" in $parse without
 * violating any of these restrictions.

 * We currently use Function(string) generated functions as a speed
 * optimization. With this change, it will be possible to opt into the CSP
 * compatible mode using the ngCsp directive. When this mode is on Angular
 * will evaluate all expressions up to 30% slower than in non-CSP mode, but
 * no security violations will be raised.
 * 
 * This is necessary when developing things like Google Chrome Extensions

 * In order to use this feature put ngCsp directive on the root element of
 * the application. For example:

 * @example
 * <!doctype html>
 * <html ng-app ng-csp>
 *  ...
 *  ...
 * </html>
 *
 * @element html
 */

var ngCspDirective = ['$sniffer', function($sniffer) {
  return {
    priority: 1000,
    compile: function() {
      $sniffer.csp = true;
    }
  };
}];
