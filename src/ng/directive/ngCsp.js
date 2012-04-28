'use strict';

/**
 * TODO(i): this directive is not publicly documented until we know for sure that CSP can't be
 *   safely feature-detected.
 *
 * @name angular.module.ng.$compileProvider.directive.ngCsp
 * @priority 1000
 *
 * @description
 * Enables CSP (Content Security Protection) support. This directive should be used on the `<html>`
 * element before any kind of interpolation or expression is processed.
 *
 * If enabled the performance of $parse will suffer.
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
