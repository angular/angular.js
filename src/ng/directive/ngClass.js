'use strict';

/* exported
  ngClassDirective,
  ngClassEvenDirective,
  ngClassOddDirective
*/

function classDirective(name, selector) {
  name = 'ngClass' + name;
  var indexWatchExpression;

  return ['$parse', function($parse) {
    return {
      restrict: 'AC',
      link: function(scope, element, attr) {
        var classCounts = element.data('$classCounts');
        var oldModulo = true;
        var oldClassString;

        if (!classCounts) {
          // Use createMap() to prevent class assumptions involving property
          // names in Object.prototype
          classCounts = createMap();
          element.data('$classCounts', classCounts);
        }

        if (name !== 'ngClass') {
          if (!indexWatchExpression) {
            indexWatchExpression = $parse('$index', function moduloTwo($index) {
              // eslint-disable-next-line no-bitwise
              return $index & 1;
            });
          }

          scope.$watch(indexWatchExpression, ngClassIndexWatchAction);
        }

        scope.$watch($parse(attr[name], toClassString), ngClassWatchAction);

        function addClasses(classString) {
          classString = digestClassCounts(split(classString), 1);
          attr.$addClass(classString);
        }

        function removeClasses(classString) {
          classString = digestClassCounts(split(classString), -1);
          attr.$removeClass(classString);
        }

        function updateClasses(oldClassString, newClassString) {
          var oldClassArray = split(oldClassString);
          var newClassArray = split(newClassString);

          var toRemoveArray = arrayDifference(oldClassArray, newClassArray);
          var toAddArray = arrayDifference(newClassArray, oldClassArray);

          var toRemoveString = digestClassCounts(toRemoveArray, -1);
          var toAddString = digestClassCounts(toAddArray, 1);

          attr.$addClass(toAddString);
          attr.$removeClass(toRemoveString);
        }

        function digestClassCounts(classArray, count) {
          var classesToUpdate = [];

          forEach(classArray, function(className) {
            if (count > 0 || classCounts[className]) {
              classCounts[className] = (classCounts[className] || 0) + count;
              if (classCounts[className] === +(count > 0)) {
                classesToUpdate.push(className);
              }
            }
          });

          return classesToUpdate.join(' ');
        }

        function ngClassIndexWatchAction(newModulo) {
          // This watch-action should run before the `ngClassWatchAction()`, thus it
          // adds/removes `oldClassString`. If the `ngClass` expression has changed as well, the
          // `ngClassWatchAction()` will update the classes.
          if (newModulo === selector) {
            addClasses(oldClassString);
          } else {
            removeClasses(oldClassString);
          }

          oldModulo = newModulo;
        }

        function ngClassWatchAction(newClassString) {
          if (oldModulo === selector) {
            updateClasses(oldClassString, newClassString);
          }

          oldClassString = newClassString;
        }
      }
    };
  }];

  // Helpers
  function arrayDifference(tokens1, tokens2) {
    if (!tokens1 || !tokens1.length) return [];
    if (!tokens2 || !tokens2.length) return tokens1;

    var values = [];

    outer:
    for (var i = 0; i < tokens1.length; i++) {
      var token = tokens1[i];
      for (var j = 0; j < tokens2.length; j++) {
        if (token === tokens2[j]) continue outer;
      }
      values.push(token);
    }

    return values;
  }

  function split(classString) {
    return classString && classString.split(' ');
  }

  function toClassString(classValue) {
    var classString = classValue;

    if (isArray(classValue)) {
      classString = classValue.map(toClassString).join(' ');
    } else if (isObject(classValue)) {
      classString = Object.keys(classValue).
        filter(function(key) { return classValue[key]; }).
        join(' ');
    }

    return classString;
  }
}

/**
 * @ngdoc directive
 * @name ngClass
 * @restrict AC
 *
 * @description
 * The `ngClass` directive allows you to dynamically set CSS classes on an HTML element by databinding
 * an expression that represents all classes to be added.
 *
 * The directive operates in three different ways, depending on which of three types the expression
 * evaluates to:
 *
 * 1. If the expression evaluates to a string, the string should be one or more space-delimited class
 * names.
 *
 * 2. If the expression evaluates to an object, then for each key-value pair of the
 * object with a truthy value the corresponding key is used as a class name.
 *
 * 3. If the expression evaluates to an array, each element of the array should either be a string as in
 * type 1 or an object as in type 2. This means that you can mix strings and objects together in an array
 * to give you more control over what CSS classes appear. See the code below for an example of this.
 *
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then are the
 * new classes added.
 *
 * @knownIssue
 * You should not use {@link guide/interpolation interpolation} in the value of the `class`
 * attribute, when using the `ngClass` directive on the same element.
 * See {@link guide/interpolation#known-issues here} for more info.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#addClass addClass}       | just before the class is applied to the element   |
 * | {@link ng.$animate#removeClass removeClass} | just before the class is removed from the element |
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values. In the case of a map, the
 *   names of the properties whose values are truthy will be added as css classes to the
 *   element.
 *
 * @example Example that demonstrates basic bindings via ngClass directive.
   <example name="ng-class">
     <file name="index.html">
       <p ng-class="{strike: deleted, bold: important, 'has-error': error}">Map Syntax Example</p>
       <label>
          <input type="checkbox" ng-model="deleted">
          deleted (apply "strike" class)
       </label><br>
       <label>
          <input type="checkbox" ng-model="important">
          important (apply "bold" class)
       </label><br>
       <label>
          <input type="checkbox" ng-model="error">
          error (apply "has-error" class)
       </label>
       <hr>
       <p ng-class="style">Using String Syntax</p>
       <input type="text" ng-model="style"
              placeholder="Type: bold strike red" aria-label="Type: bold strike red">
       <hr>
       <p ng-class="[style1, style2, style3]">Using Array Syntax</p>
       <input ng-model="style1"
              placeholder="Type: bold, strike or red" aria-label="Type: bold, strike or red"><br>
       <input ng-model="style2"
              placeholder="Type: bold, strike or red" aria-label="Type: bold, strike or red 2"><br>
       <input ng-model="style3"
              placeholder="Type: bold, strike or red" aria-label="Type: bold, strike or red 3"><br>
       <hr>
       <p ng-class="[style4, {orange: warning}]">Using Array and Map Syntax</p>
       <input ng-model="style4" placeholder="Type: bold, strike" aria-label="Type: bold, strike"><br>
       <label><input type="checkbox" ng-model="warning"> warning (apply "orange" class)</label>
     </file>
     <file name="style.css">
       .strike {
           text-decoration: line-through;
       }
       .bold {
           font-weight: bold;
       }
       .red {
           color: red;
       }
       .has-error {
           color: red;
           background-color: yellow;
       }
       .orange {
           color: orange;
       }
     </file>
     <file name="protractor.js" type="protractor">
       var ps = element.all(by.css('p'));

       it('should let you toggle the class', function() {

         expect(ps.first().getAttribute('class')).not.toMatch(/bold/);
         expect(ps.first().getAttribute('class')).not.toMatch(/has-error/);

         element(by.model('important')).click();
         expect(ps.first().getAttribute('class')).toMatch(/bold/);

         element(by.model('error')).click();
         expect(ps.first().getAttribute('class')).toMatch(/has-error/);
       });

       it('should let you toggle string example', function() {
         expect(ps.get(1).getAttribute('class')).toBe('');
         element(by.model('style')).clear();
         element(by.model('style')).sendKeys('red');
         expect(ps.get(1).getAttribute('class')).toBe('red');
       });

       it('array example should have 3 classes', function() {
         expect(ps.get(2).getAttribute('class')).toBe('');
         element(by.model('style1')).sendKeys('bold');
         element(by.model('style2')).sendKeys('strike');
         element(by.model('style3')).sendKeys('red');
         expect(ps.get(2).getAttribute('class')).toBe('bold strike red');
       });

       it('array with map example should have 2 classes', function() {
         expect(ps.last().getAttribute('class')).toBe('');
         element(by.model('style4')).sendKeys('bold');
         element(by.model('warning')).click();
         expect(ps.last().getAttribute('class')).toBe('bold orange');
       });
     </file>
   </example>

   ## Animations

   The example below demonstrates how to perform animations using ngClass.

   <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-class">
     <file name="index.html">
      <input id="setbtn" type="button" value="set" ng-click="myVar='my-class'">
      <input id="clearbtn" type="button" value="clear" ng-click="myVar=''">
      <br>
      <span class="base-class" ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .base-class {
         transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
       }

       .base-class.my-class {
         color: red;
         font-size:3em;
       }
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-class', function() {
         expect(element(by.css('.base-class')).getAttribute('class')).not.
           toMatch(/my-class/);

         element(by.id('setbtn')).click();

         expect(element(by.css('.base-class')).getAttribute('class')).
           toMatch(/my-class/);

         element(by.id('clearbtn')).click();

         expect(element(by.css('.base-class')).getAttribute('class')).not.
           toMatch(/my-class/);
       });
     </file>
   </example>


   ## ngClass and pre-existing CSS3 Transitions/Animations
   The ngClass directive still supports CSS3 Transitions/Animations even if they do not follow the ngAnimate CSS naming structure.
   Upon animation ngAnimate will apply supplementary CSS classes to track the start and end of an animation, but this will not hinder
   any pre-existing CSS transitions already on the element. To get an idea of what happens during a class-based animation, be sure
   to view the step by step details of {@link $animate#addClass $animate.addClass} and
   {@link $animate#removeClass $animate.removeClass}.
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name ngClassOdd
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassOdd {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example name="ng-class-odd">
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}}
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element(by.repeater('name in names').row(0).column('name')).getAttribute('class')).
           toMatch(/odd/);
         expect(element(by.repeater('name in names').row(1).column('name')).getAttribute('class')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name ngClassEven
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassEven {@link guide/expression Expression} to eval. The
 *   result of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example name="ng-class-even">
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element(by.repeater('name in names').row(0).column('name')).getAttribute('class')).
           toMatch(/odd/);
         expect(element(by.repeater('name in names').row(1).column('name')).getAttribute('class')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassEvenDirective = classDirective('Even', 1);
