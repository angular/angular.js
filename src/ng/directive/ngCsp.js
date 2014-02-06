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
 * For us to be compatible, we just need to implement the "getterFn" in $parse without violating
 * any of these restrictions.
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
 * In order to use this feature put the `ngCsp` directive on the root element of the application.
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

// ngCsp is not implemented as a proper directive any more, because we need it be processed while we bootstrap
// the system (before $parse is instantiated), for this reason we just have a csp() fn that looks for ng-csp attribute
// anywhere in the current doc
