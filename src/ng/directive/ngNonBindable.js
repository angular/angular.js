'use strict';

/**
 * @ngdoc directive
 * @name ngNonBindable
 * @restrict AC
 * @priority 1000
 *
 * @description
 * The `ngNonBindable` directive tells AngularJS not to compile or bind the contents of the current
 * DOM element. This is useful if the element contains what appears to be AngularJS directives and
 * bindings but which should be ignored by AngularJS. This could be the case if you have a site that
 * displays snippets of code, for instance.
 *
 * @element ANY
 *
 * @example
 * In this example there are two locations where a simple interpolation binding (`{{}}`) is present,
 * but the one wrapped in `ngNonBindable` is left alone.
 *
 * @example
    <example name="ng-non-bindable">
      <file name="index.html">
        <div>Normal: {{1 + 2}}</div>
        <div ng-non-bindable>Ignored: {{1 + 2}}</div>
      </file>
      <file name="protractor.js" type="protractor">
       it('should check ng-non-bindable', function() {
         expect(element(by.binding('1 + 2')).getText()).toContain('3');
         expect(element.all(by.css('div')).last().getText()).toMatch(/1 \+ 2/);
       });
      </file>
    </example>
 */
var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });
