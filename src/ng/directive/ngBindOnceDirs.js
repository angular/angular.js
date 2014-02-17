'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngBindOnce
 * @restrict AC
 *
 * @description
 * The `ngBindOnce` attribute tells Angular to only set up an initial binding. After the specified value has been 
 * set, then the watcher is destroyed. 
 *
 * ngBindOnce works with promise values or any other asynchrounous type of values that are not not set on the initial digest.
 *
 * @element ANY
 * @param {expression} ngBindOnce {@link guide/expression Expression} to evaluate and set once.
 *
 * @example
 * Notice how the text value is not changed when the scope value is changed.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Free Bird';
         }
       </script>
       <div ng-controller="Ctrl">
         Enter name: <input type="text" ng-model="name"><br>
         Hello <span id="bindOnceTest" ng-bind-once-text="name"></span>!
       </div>
     </doc:source>
     <doc:protractor>
       it('should check ng-bind-once-text', function() {
         var exampleContainer = $('.doc-example-live');
         var nameInput = element(by.model('name'));

         expect(exampleContainer.findElement(by.id('bindOnceTest')).getText()).toBe('Free Bird);
         nameInput.clear();
         nameInput.sendKeys('world');
         expect(exampleContainer.findElement(by.id('bindOnceTest')).getText()).toBe('Free Bird');
       });
     </doc:protractor>
   </doc:example>
 */
var ngBindOnceDirectives = {};
forEach([{name: 'src', method: 'attr'}, {name: 'text', method: 'text'},
         {name: 'href', method: 'attr'}, {name: 'class', method: 'addClass'},
         {name: 'html', method: 'html'}, {name: 'alt', method: 'attr'},
         {name: 'style', method: 'css'}, {name: 'value', method: 'attr'},
         {name: 'id', method: 'attr'}, {name: 'title', method: 'attr'}],
  function(v) {
    var directiveName = directiveNormalize('ng-bind-once-' + v.name);
    ngBindOnceDirectives[directiveName] = function() {
      return {
        link: function(scope, element, attr) {
          var rmWatcher = scope.$watch(attr[directiveName], function(newV,oldV){
            if(newV){
              if(v.method === 'attr'){
                element[v.method](v.name,newV);
              } else {
                element[v.method](newV);
              }
              rmWatcher();
            }
          });
        }
      };
    };
  }
);