'use strict';

/**
 * @ngdoc directive
 * @name ngCsp
 *
 * @element html
 * @description
 *
 * Angular has some features that can break certain
 * [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) rules.
 *
 * If you intend to implement these rules then you must tell Angular not to use these features.
 *
 * This is necessary when developing things like Google Chrome Extensions or Universal Windows Apps.
 *
 *
 * The following rules affect Angular:
 *
 * * `unsafe-eval`: this rule forbids apps to use `eval` or `Function(string)` generated functions
 * (among other things). Angular makes use of this in the {@link $parse} service to provide a 30%
 * increase in the speed of evaluating Angular expressions.
 *
 * * `unsafe-inline`: this rule forbids apps from inject custom styles into the document. Angular
 * makes use of this to include some CSS rules (e.g. {@link ngCloak} and {@link ngHide}).
 * To make these directives work when a CSP rule is blocking inline styles, you must link to the
 * `angular-csp.css` in your HTML manually.
 *
 * If you do not provide `ngCsp` then Angular tries to autodetect if CSP is blocking unsafe-eval
 * and automatically deactivates this feature in the {@link $parse} service. This autodetection,
 * however, triggers a CSP error to be logged in the console:
 *
 * ```
 * Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
 * script in the following Content Security Policy directive: "default-src 'self'". Note that
 * 'script-src' was not explicitly set, so 'default-src' is used as a fallback.
 * ```
 *
 * This error is harmless but annoying. To prevent the error from showing up, put the `ngCsp`
 * directive on an element of the HTML document that appears before the `<script>` tag that loads
 * the `angular.js` file.
 *
 * *Note: This directive is only available in the `ng-csp` and `data-ng-csp` attribute form.*
 *
 * You can specify which of the CSP related Angular features should be deactivated by providing
 * a value for the `ng-csp` attribute. The options are as follows:
 *
 * * no-inline-style: this stops Angular from injecting CSS styles into the DOM
 *
 * * no-unsafe-eval: this stops Angular from optimising $parse with unsafe eval of strings
 *
 * You can use these values in the following combinations:
 *
 *
 * * No declaration means that Angular will assume that you can do inline styles, but it will do
 * a runtime check for unsafe-eval. E.g. `<body>`. This is backwardly compatible with previous versions
 * of Angular.
 *
 * * A simple `ng-csp` (or `data-ng-csp`) attribute will tell Angular to deactivate both inline
 * styles and unsafe eval. E.g. `<body ng-csp>`. This is backwardly compatible with previous versions
 * of Angular.
 *
 * * Specifying only `no-unsafe-eval` tells Angular that we must not use eval, but that we can inject
 * inline styles. E.g. `<body ng-csp="no-unsafe-eval">`.
 *
 * * Specifying only `no-inline-style` tells Angular that we must not inject styles, but that we can
 * run eval - no automcatic check for unsafe eval will occur. E.g. `<body ng-csp="no-inline-style">`
 *
 * * Specifying both `no-unsafe-eval` and `no-inline-style` tells Angular that we must not inject
 * styles nor use eval, which is the same as an empty: ng-csp.
 * E.g.`<body ng-csp="no-inline-style;no-unsafe-eval">`
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
  * @example
      // Note: the suffix `.csp` in the example name triggers
      // csp mode in our http server!
      <example name="example.csp" module="cspExample" ng-csp="true">
        <file name="index.html">
          <div ng-controller="MainController as ctrl">
            <div>
              <button ng-click="ctrl.inc()" id="inc">Increment</button>
              <span id="counter">
                {{ctrl.counter}}
              </span>
            </div>

            <div>
              <button ng-click="ctrl.evil()" id="evil">Evil</button>
              <span id="evilError">
                {{ctrl.evilError}}
              </span>
            </div>
          </div>
        </file>
        <file name="script.js">
           angular.module('cspExample', [])
             .controller('MainController', function() {
                this.counter = 0;
                this.inc = function() {
                  this.counter++;
                };
                this.evil = function() {
                  // jshint evil:true
                  try {
                    eval('1+2');
                  } catch (e) {
                    this.evilError = e.message;
                  }
                };
              });
        </file>
        <file name="protractor.js" type="protractor">
          var util, webdriver;

          var incBtn = element(by.id('inc'));
          var counter = element(by.id('counter'));
          var evilBtn = element(by.id('evil'));
          var evilError = element(by.id('evilError'));

          function getAndClearSevereErrors() {
            return browser.manage().logs().get('browser').then(function(browserLog) {
              return browserLog.filter(function(logEntry) {
                return logEntry.level.value > webdriver.logging.Level.WARNING.value;
              });
            });
          }

          function clearErrors() {
            getAndClearSevereErrors();
          }

          function expectNoErrors() {
            getAndClearSevereErrors().then(function(filteredLog) {
              expect(filteredLog.length).toEqual(0);
              if (filteredLog.length) {
                console.log('browser console errors: ' + util.inspect(filteredLog));
              }
            });
          }

          function expectError(regex) {
            getAndClearSevereErrors().then(function(filteredLog) {
              var found = false;
              filteredLog.forEach(function(log) {
                if (log.message.match(regex)) {
                  found = true;
                }
              });
              if (!found) {
                throw new Error('expected an error that matches ' + regex);
              }
            });
          }

          beforeEach(function() {
            util = require('util');
            webdriver = require('protractor/node_modules/selenium-webdriver');
          });

          // For now, we only test on Chrome,
          // as Safari does not load the page with Protractor's injected scripts,
          // and Firefox webdriver always disables content security policy (#6358)
          if (browser.params.browser !== 'chrome') {
            return;
          }

          it('should not report errors when the page is loaded', function() {
            // clear errors so we are not dependent on previous tests
            clearErrors();
            // Need to reload the page as the page is already loaded when
            // we come here
            browser.driver.getCurrentUrl().then(function(url) {
              browser.get(url);
            });
            expectNoErrors();
          });

          it('should evaluate expressions', function() {
            expect(counter.getText()).toEqual('0');
            incBtn.click();
            expect(counter.getText()).toEqual('1');
            expectNoErrors();
          });

          it('should throw and report an error when using "eval"', function() {
            evilBtn.click();
            expect(evilError.getText()).toMatch(/Content Security Policy/);
            expectError(/Content Security Policy/);
          });
        </file>
      </example>
  */

// ngCsp is not implemented as a proper directive any more, because we need it be processed while we
// bootstrap the system (before $parse is instantiated), for this reason we just have
// the csp() fn that looks for the `ng-csp` attribute anywhere in the current doc
