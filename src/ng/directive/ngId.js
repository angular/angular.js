'use strict';

function idDirective() {
  return function() {
    return {
      link: function(scope, element, attr) {
        var oldVal = attr['id'] ? attr['id'] : null ;

        scope.$watch(attr['ngId'], ngIdWatchAction, true);

        attr.$observe('id', function(value) {
          ngIdWatchAction(scope.$eval(attr['ngId']));
        });


        function ngIdWatchAction(newVal) {
          var newId = typeofId(newVal || []);
          if (!newId && !oldVal) {
              // Remove id
              element.removeAttr('id');
          } else if (!newId && oldVal) {
              // Set id attribute to old value
              element.attr('id', oldVal);
          } else {
            // Set id attribute to new value
            element.attr('id', newId);
          }
        }
      }
    };

    function typeofId (idVal) {
      if (isString(idVal)) {
        if (idVal.split(' ').length > 0) {
          return idVal.split(' ')[0];
        }
        return idVal;
      } else if (isObject(idVal)) {
        var ids = [], i = 0;
        forEach(idVal, function(v, k) {
          if (v) {
            ids.push(k);
          }
        });
        return ids[0];
      }
      return idVal;
    }
  };
}

/**
 * @ngdoc directive
 * @name ngId
 * @restrict A
 *
 * @description
 * The `ngId` directive allows you to dynamically set Id attributes on an HTML element by databinding
 * an expression that represents the id to be added.
 *
 * The directive operates in two different ways, depending on which of two types the expression
 * evaluates to:
 *
 * 1. If the expression evaluates to a string, the string should be one id. If the string has multiple
 * space-delimited ids, the first id is returned.
 *
 * 2. If the expression evaluates to an object, then the key for the first key-value pair in the object
 * to evaluate with a truthy value is used as an id.
 *
 * If there is already an existing id on that element, it will overwrite that id (if the specified key
 * value pair is truthy, or if a valid string is used). When the expression changes, the previous id is
 * set as the element attribute again. If there was no original id, and the expression does not evaluate
 * as truthy, the id attribute is removed.
 *
 * If there is already an id or name set elsewhere with the same value, it will apply the id attribute,
 * which may result in invalid HTML.
 *
 * @element ANY
 * @param {expression} ngId {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string with a single id name, or a map of id names
 *   to boolean values. In the case of a map, the name of the first property whose value
 *   to evaluate as truthy will be added as css id to the element.
 *
 * @example Example that demonstrates basic bindings via ngClass directive.
   <example>
     <file name="index.html">
       <p ng-id="{strike: deleted, bold: important, red: error}">Map Syntax Example</p>
       <input type="checkbox" ng-model="deleted"> deleted (apply "strike" id)<br>
       <input type="checkbox" ng-model="important"> important (apply "bold" id)<br>
       <input type="checkbox" ng-model="error"> error (apply "red" id)
       <hr>
       <p ng-id="style">Using String Syntax</p>
       <input type="text" ng-model="style" placeholder="Type: bold strike red">
     </file>
     <file name="style.css">
       #strike {
         text-decoration: line-through;
       }
       #bold {
         font-weight: bold;
       }
       #red {
         color: red;
       }
     </file>
     <file name="protractor.js" type="protractor">
       var ps = element.all(by.css('p'));

       it('should let you toggle the id', function() {

         expect(ps.first().getAttribute('id')).not.toMatch(/bold/);
         expect(ps.first().getAttribute('id')).not.toMatch(/red/);

         element(by.model('important')).click();
         expect(ps.first().getAttribute('id')).toMatch(/bold/);

         element(by.model('error')).click();
         expect(ps.first().getAttribute('id')).toMatch(/bold/);

         element(by.model('important')).click();
         expect(ps.first().getAttribute('id')).toMatch(/red/);
       });

       it('should let you toggle string example', function() {
         expect(ps.get(1).getAttribute('id')).toBe('');
         element(by.model('style')).clear();
         element(by.model('style')).sendKeys('red');
         expect(ps.get(1).getAttribute('id')).toBe('red');
       });

     </file>
   </example>
 */
var ngIdDirective = idDirective();

