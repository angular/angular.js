'use strict';

/**
 * @ngdoc directive
 * @name ngDefer
 * @restrict A
 * @priority 600
 * @element ANY
 *
 * @description
 * The `ngDefer` directive pauses AngularJS compilation  at the current DOM element,
 * including directives on the element itself that have a lower priority than
 * `ngDefer`.
 * It will continue the process at the very same element for any directives with lower
 * priority once the condition provided to the `tiDefer` attribute evalutes to a trueish
 * value.
 * This is useful to defer compilation of entire sub-trees of HTML to when it is really
 * needed, e.g. when the sub-tree becomes visible. This can be very useful in progressive
 * enhancement context and generally to improve page initialization time by splitting
 * compilation into smaller chunks that get executed on an as-needed basis.
 *
 * @example
 *
 <example name="ng-defer">
   <file name="index.html">
     <div ng-init="run = false">
       <div>Normal: {{1 + 2}}</div>
       <div ng-defer="run == true">Ignored: {{1 + 2}}</div>
       <a id="run-link" ng-click="run = true">Run deferred</a>
     </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should defer ng-bind', function() {
       expect(element(by.binding('1 + 2')).getText()).toContain('3');
       expect(element.all(by.css('div')).last().getText()).toMatch(/1 \+ 2/);
       element(by.css('#run-link')).click();
       expect(element.all(by.css('div')).last().getText()).toContain('3');
     });
   </file>
 </example>
 */
var ngDeferDirective = ['$compile', function($compile) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 600,
        link: function($scope, $element, $attr) {
            var unregisterWatch = $scope.$watch($attr.ngDefer, function ngDeferWatchAction(newVal) {
                if (newVal) {
                    unregisterWatch();
                    $compile($element, undefined, 600)($scope);
                }
            });
        }
    };
}];
