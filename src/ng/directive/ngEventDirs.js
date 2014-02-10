'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngClick
 *
 * @description
 * The ngClick directive allows you to specify custom behavior when
 * an element is clicked.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon
 * click. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-click="count = count + 1" ng-init="count=0">
        Increment
      </button>
      count: {{count}}
     </doc:source>
     <doc:protractor>
       it('should check ng-click', function() {
         expect(element(by.binding('count')).getText()).toMatch('0');
         element(by.css('.doc-example-live button')).click();
         expect(element(by.binding('count')).getText()).toMatch('1');
       });
     </doc:protractor>
   </doc:example>
 */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 */
var ngEventDirectives = {};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
  function(name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = ['$parse', function($parse) {
      return {
        compile: function($element, attr) {
          var fn = $parse(attr[directiveName]);
          return function(scope, element, attr) {
            element.on(lowercase(name), function(event) {
              scope.$apply(function() {
                fn(scope, {$event:event});
              });
            });
          };
        }
      };
    }];
  }
);

/**
 * @ngdoc directive
 * @name ng.directive:ngDblclick
 *
 * @description
 * The `ngDblclick` directive allows you to specify custom behavior on a dblclick event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngDblclick {@link guide/expression Expression} to evaluate upon
 * a dblclick. (The Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-dblclick="count = count + 1" ng-init="count=0">
        Increment (on double click)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousedown
 *
 * @description
 * The ngMousedown directive allows you to specify custom behavior on mousedown event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon
 * mousedown. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mousedown="count = count + 1" ng-init="count=0">
        Increment (on mouse down)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseup
 *
 * @description
 * Specify custom behavior on mouseup event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon
 * mouseup. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mouseup="count = count + 1" ng-init="count=0">
        Increment (on mouse up)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngMouseover
 *
 * @description
 * Specify custom behavior on mouseover event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon
 * mouseover. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mouseover="count = count + 1" ng-init="count=0">
        Increment (when mouse is over)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseenter
 *
 * @description
 * Specify custom behavior on mouseenter event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon
 * mouseenter. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mouseenter="count = count + 1" ng-init="count=0">
        Increment (when mouse enters)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseleave
 *
 * @description
 * Specify custom behavior on mouseleave event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon
 * mouseleave. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mouseleave="count = count + 1" ng-init="count=0">
        Increment (when mouse leaves)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousemove
 *
 * @description
 * Specify custom behavior on mousemove event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon
 * mousemove. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-mousemove="count = count + 1" ng-init="count=0">
        Increment (when mouse moves)
      </button>
      count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeydown
 *
 * @description
 * Specify custom behavior on keydown event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngKeydown {@link guide/expression Expression} to evaluate upon
 * keydown. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-keydown="count = count + 1" ng-init="count=0">
      key down count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeyup
 *
 * @description
 * Specify custom behavior on keyup event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngKeyup {@link guide/expression Expression} to evaluate upon
 * keyup. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-keyup="count = count + 1" ng-init="count=0">
      key up count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeypress
 *
 * @description
 * Specify custom behavior on keypress event.
 *
 * @element ANY
 * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon
 * keypress. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-keypress="count = count + 1" ng-init="count=0">
      key press count: {{count}}
     </doc:source>
   </doc:example>
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngSubmit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page), but only if the form does not contain `action`,
 * `data-action`, or `x-action` attributes.
 *
 * @element form
 * @priority 0
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.list = [];
          $scope.text = 'hello';
          $scope.submit = function() {
            if (this.text) {
              this.list.push(this.text);
              this.text = '';
            }
          };
        }
      </script>
      <form ng-submit="submit()" ng-controller="Ctrl">
        Enter text and hit enter:
        <input type="text" ng-model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </doc:source>
     <doc:protractor>
       it('should check ng-submit', function() {
         expect(element(by.binding('list')).getText()).toBe('list=[]');
         element(by.css('.doc-example-live #submit')).click();
         expect(element(by.binding('list')).getText()).toContain('hello');
         expect(element(by.input('text')).getAttribute('value')).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(element(by.binding('list')).getText()).toBe('list=[]');
         element(by.css('.doc-example-live #submit')).click();
         element(by.css('.doc-example-live #submit')).click();
         expect(element(by.binding('list')).getText()).toContain('hello');
        });
     </doc:protractor>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngFocus
 *
 * @description
 * Specify custom behavior on focus event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngFocus {@link guide/expression Expression} to evaluate upon
 * focus. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngBlur
 *
 * @description
 * Specify custom behavior on blur event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngBlur {@link guide/expression Expression} to evaluate upon
 * blur. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCopy
 *
 * @description
 * Specify custom behavior on copy event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngCopy {@link guide/expression Expression} to evaluate upon
 * copy. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-copy="copied=true" ng-init="copied=false; value='copy me'" ng-model="value">
      copied: {{copied}}
     </doc:source>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCut
 *
 * @description
 * Specify custom behavior on cut event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngCut {@link guide/expression Expression} to evaluate upon
 * cut. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-cut="cut=true" ng-init="cut=false; value='cut me'" ng-model="value">
      cut: {{cut}}
     </doc:source>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngPaste
 *
 * @description
 * Specify custom behavior on paste event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngPaste {@link guide/expression Expression} to evaluate upon
 * paste. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <input ng-paste="paste=true" ng-init="paste=false" placeholder='paste here'>
      pasted: {{paste}}
     </doc:source>
   </doc:example>
 */
