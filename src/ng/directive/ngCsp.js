'use strict';

/**
 * @ngdoc directive
 * @name ngCsp
 *
 * @element html
 * @description
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.
 *
 * This is necessary when developing things like Google Chrome Extensions.
 *
 * CSP forbids apps to use `eval` or `Function(string)` generated functions (among other things).
 * For Angular to be CSP compatible there are only two things that we need to do differently:
 *
 * - don't use `Function` constructor to generate optimized value getters
 * - don't inject custom stylesheet into the document
 *
 * AngularJS uses `Function(string)` generated functions as a speed optimization. Applying the `ngCsp`
 * directive will cause Angular to use CSP compatibility mode. When this mode is on AngularJS will
 * evaluate all expressions up to 30% slower than in non-CSP mode, but no security violations will
 * be raised.
 *
 * CSP forbids JavaScript to inline stylesheet rules. In non CSP mode Angular automatically
 * includes some CSS rules (e.g. {@link ng.directive:ngCloak ngCloak}).
 * To make those directives work in CSP mode, include the `angular-csp.css` manually.
 *
 * Angular tries to autodetect if CSP is active and automatically turn on the CSP-safe mode. This
 * autodetection however triggers a CSP error to be logged in the console:
 *
 * ```
 * Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
 * script in the following Content Security Policy directive: "default-src 'self'". Note that
 * 'script-src' was not explicitly set, so 'default-src' is used as a fallback.
 * ```
 *
 * This error is harmless but annoying. To prevent the error from showing up, put the `ngCsp`
 * directive on the root element of the application or on the `angular.js` script tag, whichever
 * appears first in the html document.
 *
 * *Note: This directive is only available in the `ng-csp` and `data-ng-csp` attribute form.*
 *
 * @example
 * This example shows how to apply the `ngCsp` directive to the `html` tag.
   ```html
     <!doctype html>
     <html ng-app ng-csp>
     ...
     ...
     </html>
   ```
 */

// ngCsp is not implemented as a proper directive any more, because we need it be processed while we
// bootstrap the system (before $parse is instantiated), for this reason we just have
// the csp.isActive() fn that looks for ng-csp attribute anywhere in the current doc
