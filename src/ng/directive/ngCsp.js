'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngCsp
 * @priority 1000
 *
 * @description
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.
 * This directive should be used on the root element of the application (typically the `<html>`
 * element or other element with the {@link ng.directive:ngApp ngApp}
 * directive).
 *
 * If enabled the performance of template expression evaluator will suffer slightly, so don't enable
 * this mode unless you need it.
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
