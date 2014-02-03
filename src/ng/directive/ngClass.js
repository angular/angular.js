'use strict';

function classDirective(name, selector) {
  name = 'ngClass' + name;
  return function() {
    return {
      restrict: 'AC',
      link: function(scope, element, attr) {
        var oldVal;

        scope.$watch(attr[name], ngClassWatchAction, true);

        attr.$observe('class', function(value) {
          ngClassWatchAction(scope.$eval(attr[name]));
        });


        if (name !== 'ngClass') {
          scope.$watch('$index', function($index, old$index) {
            // jshint bitwise: false
            var mod = $index & 1;
            if (mod !== old$index & 1) {
              var classes = flattenClasses(scope.$eval(attr[name]));
              mod === selector ?
                attr.$addClass(classes) :
                attr.$removeClass(classes);
            }
          });
        }


        function ngClassWatchAction(newVal) {
          if (selector === true || scope.$index % 2 === selector) {
            var newClasses = flattenClasses(newVal || '');
            if(!oldVal) {
              attr.$addClass(newClasses);
            } else if(!equals(newVal,oldVal)) {
              attr.$updateClass(newClasses, flattenClasses(oldVal));
            }
          }
          oldVal = copy(newVal);
        }


        function flattenClasses(classVal) {
          if(isArray(classVal)) {
            return classVal.join(' ');
          } else if (isObject(classVal)) {
            var classes = [], i = 0;
            forEach(classVal, function(v, k) {
              if (v) {
                classes.push(k);
              }
            });
            return classes.join(' ');
          }

          return classVal;
        }
      }
    };
  };
}

/**
 * @ngdoc directive
 * @name ng.directive:ngClass
 * @restrict AC
 *
 * @description
 * The `ngClass` directive allows you to dynamically set CSS classes on an HTML element by databinding
 * an expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the
 * new classes are added.
 *
 * @animations
 * add - happens just before the class is applied to the element
 * remove - happens just before the class is removed from the element
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values. In the case of a map, the
 *   names of the properties whose values are truthy will be added as css classes to the
 *   element.
 *
 * @example Example that demonstrates basic bindings via ngClass directive.
   <example>
     <file name="index.html">
       <p ng-class="{strike: deleted, bold: important, red: error}">Map Syntax Example</p>
       <input type="checkbox" ng-model="deleted"> deleted (apply "strike" class)<br>
       <input type="checkbox" ng-model="important"> important (apply "bold" class)<br>
       <input type="checkbox" ng-model="error"> error (apply "red" class)
       <hr>
       <p ng-class="style">Using String Syntax</p>
       <input type="text" ng-model="style" placeholder="Type: bold strike red">
       <hr>
       <p ng-class="[style1, style2, style3]">Using Array Syntax</p>
       <input ng-model="style1" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style2" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style3" placeholder="Type: bold, strike or red"><br>
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
     </file>
     <file name="protractorTest.js">
       var ps = element.all(by.css('.doc-example-live p'));

       it('should let you toggle the class', function() {

         expect(ps.first().getAttribute('class')).not.toMatch(/bold/);
         expect(ps.first().getAttribute('class')).not.toMatch(/red/);

         element(by.model('important')).click();
         expect(ps.first().getAttribute('class')).toMatch(/bold/);

         element(by.model('error')).click();
         expect(ps.first().getAttribute('class')).toMatch(/red/);
       });

       it('should let you toggle string example', function() {
         expect(ps.get(1).getAttribute('class')).toBe('');
         element(by.model('style')).clear();
         element(by.model('style')).sendKeys('red');
         expect(ps.get(1).getAttribute('class')).toBe('red');
       });

       it('array example should have 3 classes', function() {
         expect(ps.last().getAttribute('class')).toBe('');
         element(by.model('style1')).sendKeys('bold');
         element(by.model('style2')).sendKeys('strike');
         element(by.model('style3')).sendKeys('red');
         expect(ps.last().getAttribute('class')).toBe('bold strike red');
       });
     </file>
   </example>

   ## Animations

   The example below demonstrates how to perform animations using ngClass.

   <example animations="true">
     <file name="index.html">
      <input id="setbtn" type="button" value="set" ng-click="myVar='my-class'">
      <input id="clearbtn" type="button" value="clear" ng-click="myVar=''">
      <br>
      <span class="base-class" ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .base-class {
         -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
       }

       .base-class.my-class {
         color: red;
         font-size:3em;
       }
     </file>
     <file name="protractorTest.js">
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
   to view the step by step details of {@link ngAnimate.$animate#methods_addclass $animate.addClass} and
   {@link ngAnimate.$animate#methods_removeclass $animate.removeClass}.
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name ng.directive:ngClassOdd
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
   <example>
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
     <file name="protractorTest.js">
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
 * @name ng.directive:ngClassEven
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
   <example>
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
     <file name="protractorTest.js">
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
