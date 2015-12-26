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
 * If the transcluded content is not empty (i.e. contains one or more DOM nodes, including whitespace text nodes), any existing
 * content of this element will be removed before the transcluded content is inserted.
 * If the transcluded content is empty, the existing content is left intact. This lets you provide fallback content in the case
 * that no transcluded content is provided.
 *
 * @element ANY
 *
 * @param {string} ngTransclude|ngTranscludeSlot the name of the slot to insert at this point. If this is not provided, is empty
 *                                               or its value is the same as the name of the attribute then the default slot is used.
 *
 * @example
 * ### Basic transclusion
 * This example demonstrates basic transclusion of content into a component directive.
 * <example name="simpleTranscludeExample" module="transcludeExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('transcludeExample', [])
 *        .directive('pane', function(){
 *           return {
 *             restrict: 'E',
 *             transclude: true,
 *             scope: { title:'@' },
 *             template: '<div style="border: 1px solid black;">' +
 *                         '<div style="background-color: gray">{{title}}</div>' +
 *                         '<ng-transclude></ng-transclude>' +
 *                       '</div>'
 *           };
 *       })
 *       .controller('ExampleController', ['$scope', function($scope) {
 *         $scope.title = 'Lorem Ipsum';
 *         $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
 *       }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <input ng-model="title" aria-label="title"> <br/>
 *       <textarea ng-model="text" aria-label="text"></textarea> <br/>
 *       <pane title="{{title}}">{{text}}</pane>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      it('should have transcluded', function() {
 *        var titleElement = element(by.model('title'));
 *        titleElement.clear();
 *        titleElement.sendKeys('TITLE');
 *        var textElement = element(by.model('text'));
 *        textElement.clear();
 *        textElement.sendKeys('TEXT');
 *        expect(element(by.binding('title')).getText()).toEqual('TITLE');
 *        expect(element(by.binding('text')).getText()).toEqual('TEXT');
 *      });
 *   </file>
 * </example>
 *
 * @example
 * ### Transclude fallback content
 * This example shows how to use `NgTransclude` with fallback content, that
 * is displayed if no transcluded content is provided.
 *
 * <example module="transcludeFallbackContentExample">
 * <file name="index.html">
 * <script>
 * angular.module('transcludeFallbackContentExample', [])
 * .directive('myButton', function(){
 *             return {
 *               restrict: 'E',
 *               transclude: true,
 *               scope: true,
 *               template: '<button style="cursor: pointer;">' +
 *                           '<ng-transclude>' +
 *                             '<b style="color: red;">Button1</b>' +
 *                           '</ng-transclude>' +
 *                         '</button>'
 *             };
 *         });
 * </script>
 * <!-- fallback button content -->
 * <my-button id="fallback"></my-button>
 * <!-- modified button content -->
 * <my-button id="modified">
 *   <i style="color: green;">Button2</i>
 * </my-button>
 * </file>
 * <file name="protractor.js" type="protractor">
 * it('should have different transclude element content', function() {
 *          expect(element(by.id('fallback')).getText()).toBe('Button1');
 *          expect(element(by.id('modified')).getText()).toBe('Button2');
 *        });
 * </file>
 * </example>
 *
 * @example
 * ### Multi-slot transclusion
 * This example demonstrates using multi-slot transclusion in a component directive.
 * <example name="multiSlotTranscludeExample" module="multiSlotTranscludeExample">
 *   <file name="index.html">
 *    <style>
 *      .title, .footer {
 *        background-color: gray
 *      }
 *    </style>
 *    <div ng-controller="ExampleController">
 *      <input ng-model="title" aria-label="title"> <br/>
 *      <textarea ng-model="text" aria-label="text"></textarea> <br/>
 *      <pane>
 *        <pane-title><a ng-href="{{link}}">{{title}}</a></pane-title>
 *        <pane-body><p>{{text}}</p></pane-body>
 *      </pane>
 *    </div>
 *   </file>
 *   <file name="app.js">
 *    angular.module('multiSlotTranscludeExample', [])
 *     .directive('pane', function(){
 *        return {
 *          restrict: 'E',
 *          transclude: {
 *            'title': '?paneTitle',
 *            'body': 'paneBody',
 *            'footer': '?paneFooter'
 *          },
 *          template: '<div style="border: 1px solid black;">' +
 *                      '<div class="title" ng-transclude="title">Fallback Title</div>' +
 *                      '<div ng-transclude="body"></div>' +
 *                      '<div class="footer" ng-transclude="footer">Fallback Footer</div>' +
 *                    '</div>'
 *        };
 *    })
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.title = 'Lorem Ipsum';
 *      $scope.link = "https://google.com";
 *      $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
 *    }]);
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      it('should have transcluded the title and the body', function() {
 *        var titleElement = element(by.model('title'));
 *        titleElement.clear();
 *        titleElement.sendKeys('TITLE');
 *        var textElement = element(by.model('text'));
 *        textElement.clear();
 *        textElement.sendKeys('TEXT');
 *        expect(element(by.css('.title')).getText()).toEqual('TITLE');
 *        expect(element(by.binding('text')).getText()).toEqual('TEXT');
 *        expect(element(by.css('.footer')).getText()).toEqual('Fallback Footer');
 *      });
 *   </file>
 * </example>
 */
var ngTranscludeMinErr = minErr('ngTransclude');
var ngTranscludeDirective = ngDirective({
  restrict: 'EAC',
  link: function($scope, $element, $attrs, controller, $transclude) {

    if ($attrs.ngTransclude === $attrs.$attr.ngTransclude) {
      // If the attribute is of the form: `ng-transclude="ng-transclude"`
      // then treat it like the default
      $attrs.ngTransclude = '';
    }

    function ngTranscludeCloneAttachFn(clone) {
      if (clone.length) {
        $element.empty();
        $element.append(clone);
      }
    }

    if (!$transclude) {
      throw ngTranscludeMinErr('orphan',
       'Illegal use of ngTransclude directive in the template! ' +
       'No parent directive that requires a transclusion found. ' +
       'Element: {0}',
       startingTag($element));
    }

    // If there is no slot name defined or the slot name is not optional
    // then transclude the slot
    var slotName = $attrs.ngTransclude || $attrs.ngTranscludeSlot;
    $transclude(ngTranscludeCloneAttachFn, null, slotName);
  }
});

