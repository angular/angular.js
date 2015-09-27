'use strict';

/**
 * @ngdoc directive
 * @name ngTransclude
 * @restrict EAC
 *
 * @description
 * Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
 *
 * You can specify that you want to insert a named transclusion slot, instead of the default slot, by providing the slot name
 * as the value of the `ng-transclude` or `ng-transclude-slot` attribute.
 *
 * Any existing content of the element that this directive is placed on will be removed before the transcluded content is inserted.
 *
 * @element ANY
 *
 * @param {string} ngTransclude|ngTranscludeSlot the name of the slot to insert at this point. If this is not provided or empty then
 *                                               the default slot is used.
 *
 * @example
 * ### Default transclusion
 * This example demonstrates simple transclusion.
   <example name="simpleTranscludeExample" module="transcludeExample">
     <file name="index.html">
       <script>
         angular.module('transcludeExample', [])
          .directive('pane', function(){
             return {
               restrict: 'E',
               transclude: true,
               scope: { title:'@' },
               template: '<div style="border: 1px solid black;">' +
                           '<div style="background-color: gray">{{title}}</div>' +
                           '<ng-transclude></ng-transclude>' +
                         '</div>'
             };
         })
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.title = 'Lorem Ipsum';
           $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
         }]);
       </script>
       <div ng-controller="ExampleController">
         <input ng-model="title" aria-label="title"> <br/>
         <textarea ng-model="text" aria-label="text"></textarea> <br/>
         <pane title="{{title}}">{{text}}</pane>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
        it('should have transcluded', function() {
          var titleElement = element(by.model('title'));
          titleElement.clear();
          titleElement.sendKeys('TITLE');
          var textElement = element(by.model('text'));
          textElement.clear();
          textElement.sendKeys('TEXT');
          expect(element(by.binding('title')).getText()).toEqual('TITLE');
          expect(element(by.binding('text')).getText()).toEqual('TEXT');
        });
     </file>
   </example>
 *
 * @example
 * ### Multi-slot transclusion
   <example name="multiSlotTranscludeExample" module="multiSlotTranscludeExample">
     <file name="index.html">
      <div ng-controller="ExampleController">
        <input ng-model="title" aria-label="title"> <br/>
        <textarea ng-model="text" aria-label="text"></textarea> <br/>
        <pane>
          <pane-title><a ng-href="{{link}}">{{title}}</a></pane-title>
          <pane-body><p>{{text}}</p></pane-body>
        </pane>
      </div>
     </file>
     <file name="app.js">
      angular.module('multiSlotTranscludeExample', [])
       .directive('pane', function(){
          return {
            restrict: 'E',
            transclude: {
              'paneTitle': '?title',
              'paneBody': 'body'
            },
            template: '<div style="border: 1px solid black;">' +
                        '<div ng-transclude="title" style="background-color: gray"></div>' +
                        '<div ng-transclude="body"></div>' +
                      '</div>'
          };
      })
      .controller('ExampleController', ['$scope', function($scope) {
        $scope.title = 'Lorem Ipsum';
        $scope.link = "https://google.com";
        $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
      }]);
     </file>
     <file name="protractor.js" type="protractor">
        it('should have transcluded the title and the body', function() {
          var titleElement = element(by.model('title'));
          titleElement.clear();
          titleElement.sendKeys('TITLE');
          var textElement = element(by.model('text'));
          textElement.clear();
          textElement.sendKeys('TEXT');
          expect(element(by.binding('title')).getText()).toEqual('TITLE');
          expect(element(by.binding('text')).getText()).toEqual('TEXT');
        });
     </file>
   </example> */
var ngTranscludeMinErr = minErr('ngTransclude');
var ngTranscludeDirective = ngDirective({
  restrict: 'EAC',
  link: function($scope, $element, $attrs, controller, $transclude) {

    function ngTranscludeCloneAttachFn(clone) {
      $element.empty();
      $element.append(clone);
    }

    if (!$transclude) {
      throw ngTranscludeMinErr('orphan',
       'Illegal use of ngTransclude directive in the template! ' +
       'No parent directive that requires a transclusion found. ' +
       'Element: {0}',
       startingTag($element));
    }

    $transclude(ngTranscludeCloneAttachFn, null, $attrs.ngTransclude || $attrs.ngTranscludeSlot);
  }
});

