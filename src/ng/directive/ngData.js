'use strict';

/**
 * @ngdoc directive
 * @name ngData
 * @restrict E
 *
 * @description
 * Parse the content of a `<script>` element as JSON and inject it into the current scope, a service
 * or a particular key underneath any of those.
 * The type of the `<script>` element must be specified as `text/ng-data`.
 *
 * @param {string} type Must be set to `'text/ng-data'`.
 * @param {string} service The service to inject the data into, otherwise the current scope.
 * @param {string} key The key to inject the data into, otherwise the scope or service directly.
 *
 * @example
 <example name="script-tag">
   <file name="index.html">
     <script type="text/ng-data">
       {"content": "Content of the content key"}
     </script>

     <div id="content">{{ content }}</div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should inject the data into the current scope', function() {
       expect(element(by.css('#content')).getText()).toMatch(/Content of the content key/);
     });
   </file>
 </example>
 */
var ngDataDirective = ['$injector', '$parse', function($injector, $parse) {
    return {
        restrict: 'E',
        terminal: true,
        compile: function(element, attr) {
            if (attr.type !== 'text/ng-data') {
                return angular.noop;
            }

            return {
                pre: function(scope, $element, $attr) {
                    var target = scope,
                        key = $attr.key,
                        service = $attr.service,
                        value = angular.fromJson($element[0].text),
                        expression,
                        keyTarget;

                    if (service && $injector.has(service)) {
                        target = $injector.get(service);
                    }

                    if (key) {
                        expression = $parse(key);
                        keyTarget = expression(target);

                        if (isFunction(keyTarget)) {
                            return keyTarget(value);
                        }

                        if (undefined === keyTarget) {
                            expression.assign(target, value);
                            return;
                        }
                    }

                    angular.extend(target, value);
                }
            };
        }
    };
}];
