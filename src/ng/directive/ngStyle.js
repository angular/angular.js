'use strict';

/**
 * @ngdoc directive
 * @name ngStyle
 * @restrict AC
 *
 * @description
 * The `ngStyle` directive allows you to set CSS style on an HTML element conditionally.
 *
 * @element ANY
 * @param {expression} ngStyle
 *
 * {@link guide/expression Expression} which evals to an
 * object whose keys are CSS style names and values are corresponding values for those CSS
 * keys.
 *
 * Since some CSS style names are not valid keys for an object, they must be quoted.
 * See the 'background-color' style in the example below.
 *
 * @example
   <example>
     <file name="index.html">
        <input type="button" value="set color" ng-click="myStyle={color:'red'}">
        <input type="button" value="set background" ng-click="myStyle={'background-color':'blue'}">
        <input type="button" value="clear" ng-click="myStyle={}">
        <br/>
        <span ng-style="myStyle">Sample Text</span>
        <pre>myStyle={{myStyle}}</pre>
     </file>
     <file name="style.css">
       span {
         color: black;
       }
     </file>
     <file name="protractor.js" type="protractor">
       var colorSpan = element(by.css('span'));

       it('should check ng-style', function() {
         expect(colorSpan.getCssValue('color')).toBe('rgba(0, 0, 0, 1)');
         element(by.css('input[value=\'set color\']')).click();
         expect(colorSpan.getCssValue('color')).toBe('rgba(255, 0, 0, 1)');
         element(by.css('input[value=clear]')).click();
         expect(colorSpan.getCssValue('color')).toBe('rgba(0, 0, 0, 1)');
       });
     </file>
   </example>
 */
var ngStyleDirective = ngDirective(function(scope, element, attr) {
  scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, '');});
    }
    if (newStyles) element.css(newStyles);
  }, true);
});
