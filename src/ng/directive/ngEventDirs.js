'use strict';

/**
 * @ngdoc directive
 * @name ngClick
 *
 * @description
 * The ngClick directive allows you to specify custom behavior when
 * an element is clicked.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon
 * click. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-click="count = count + 1" ng-init="count=0">
        Increment
      </button>
      count: {{count}}
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-click', function() {
         expect(element(by.binding('count')).getText()).toMatch('0');
         element(by.css('button')).click();
         expect(element(by.binding('count')).getText()).toMatch('1');
       });
     </file>
   </example>
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
        restrict: 'A',
        compile: function($element, attr) {
          var fn = $parse(attr[directiveName]);
          return function ngEventHandler(scope, element) {
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
 * @name ngDblclick
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
   <example>
     <file name="index.html">
      <button ng-dblclick="count = count + 1" ng-init="count=0">
        Increment (on double click)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngMousedown
 *
 * @description
 * The ngMousedown directive allows you to specify custom behavior on mousedown event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon
 * mousedown. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mousedown="count = count + 1" ng-init="count=0">
        Increment (on mouse down)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngMouseup
 *
 * @description
 * Specify custom behavior on mouseup event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon
 * mouseup. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mouseup="count = count + 1" ng-init="count=0">
        Increment (on mouse up)
      </button>
      count: {{count}}
     </file>
   </example>
 */

/**
 * @ngdoc directive
 * @name ngMouseover
 *
 * @description
 * Specify custom behavior on mouseover event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon
 * mouseover. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mouseover="count = count + 1" ng-init="count=0">
        Increment (when mouse is over)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngMouseenter
 *
 * @description
 * Specify custom behavior on mouseenter event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon
 * mouseenter. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mouseenter="count = count + 1" ng-init="count=0">
        Increment (when mouse enters)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngMouseleave
 *
 * @description
 * Specify custom behavior on mouseleave event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon
 * mouseleave. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mouseleave="count = count + 1" ng-init="count=0">
        Increment (when mouse leaves)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngMousemove
 *
 * @description
 * Specify custom behavior on mousemove event.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon
 * mousemove. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-mousemove="count = count + 1" ng-init="count=0">
        Increment (when mouse moves)
      </button>
      count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngKeydown
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
   <example>
     <file name="index.html">
      <input ng-keydown="count = count + 1" ng-init="count=0">
      key down count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngKeyup
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
   <example>
     <file name="index.html">
       <p>Typing in the input box below updates the key count</p>
       <input ng-keyup="count = count + 1" ng-init="count=0"> key up count: {{count}}

       <p>Typing in the input box below updates the keycode</p>
       <input ng-keyup="event=$event">
       <p>event keyCode: {{ event.keyCode }}</p>
       <p>event altKey: {{ event.altKey }}</p>
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngKeypress
 *
 * @description
 * Specify custom behavior on keypress event.
 *
 * @element ANY
 * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon
 * keypress. ({@link guide/expression#-event- Event object is available as `$event`}
 * and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
   <example>
     <file name="index.html">
      <input ng-keypress="count = count + 1" ng-init="count=0">
      key press count: {{count}}
     </file>
   </example>
 */


/**
 * @ngdoc directive
 * @name ngSubmit
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
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval.
 * ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example module="submitExample">
     <file name="index.html">
      <script>
        angular.module('submitExample', [])
          .controller('ExampleController', ['$scope', function($scope) {
            $scope.list = [];
            $scope.text = 'hello';
            $scope.submit = function() {
              if ($scope.text) {
                $scope.list.push(this.text);
                $scope.text = '';
              }
            };
          }]);
      </script>
      <form ng-submit="submit()" ng-controller="ExampleController">
        Enter text and hit enter:
        <input type="text" ng-model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-submit', function() {
         expect(element(by.binding('list')).getText()).toBe('list=[]');
         element(by.css('#submit')).click();
         expect(element(by.binding('list')).getText()).toContain('hello');
         expect(element(by.model('text')).getAttribute('value')).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(element(by.binding('list')).getText()).toBe('list=[]');
         element(by.css('#submit')).click();
         element(by.css('#submit')).click();
         expect(element(by.binding('list')).getText()).toContain('hello');
        });
     </file>
   </example>
 */

/**
 * @ngdoc directive
 * @name ngFocus
 *
 * @description
 * Specify custom behavior on focus event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngFocus {@link guide/expression Expression} to evaluate upon
 * focus. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ngBlur
 *
 * @description
 * Specify custom behavior on blur event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngBlur {@link guide/expression Expression} to evaluate upon
 * blur. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ngCopy
 *
 * @description
 * Specify custom behavior on copy event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngCopy {@link guide/expression Expression} to evaluate upon
 * copy. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <input ng-copy="copied=true" ng-init="copied=false; value='copy me'" ng-model="value">
      copied: {{copied}}
     </file>
   </example>
 */

/**
 * @ngdoc directive
 * @name ngCut
 *
 * @description
 * Specify custom behavior on cut event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngCut {@link guide/expression Expression} to evaluate upon
 * cut. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <input ng-cut="cut=true" ng-init="cut=false; value='cut me'" ng-model="value">
      cut: {{cut}}
     </file>
   </example>
 */

/**
 * @ngdoc directive
 * @name ngPaste
 *
 * @description
 * Specify custom behavior on paste event.
 *
 * @element window, input, select, textarea, a
 * @priority 0
 * @param {expression} ngPaste {@link guide/expression Expression} to evaluate upon
 * paste. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <input ng-paste="paste=true" ng-init="paste=false" placeholder='paste here'>
      pasted: {{paste}}
     </file>
   </example>
 */
