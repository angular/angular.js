'use strict';

/**
 * @ngdoc directive
 * @name ngInclude
 * @restrict ECA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * By default, the template URL is restricted to the same domain and protocol as the
 * application document. This is done by calling {@link $sce#getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on it. To load templates from other domains or protocols
 * you may either {@link ng.$sceDelegateProvider#resourceUrlWhitelist whitelist them} or
 * {@link $sce#trustAsResourceUrl wrap them} as trusted values. Refer to Angular's {@link
 * ng.$sce Strict Contextual Escaping}.
 *
 * In addition, the browser's
 * [Same Origin Policy](https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest)
 * and [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/)
 * policy may further restrict whether the template is successfully loaded.
 * For example, `ngInclude` won't work for cross-domain requests on all browsers and for `file://`
 * access on some browsers.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 *
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in **single** quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ngInclude` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the content is loaded.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.
 *
 * @example
  <example module="includeExample" deps="angular-animate.js" animations="true">
    <file name="index.html">
     <div ng-controller="ExampleController">
       <select ng-model="template" ng-options="t.name for t in templates">
        <option value="">(blank)</option>
       </select>
       url of the template: <code>{{template.url}}</code>
       <hr/>
       <div class="slide-animate-container">
         <div class="slide-animate" ng-include="template.url"></div>
       </div>
     </div>
    </file>
    <file name="script.js">
      angular.module('includeExample', ['ngAnimate'])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.templates =
            [ { name: 'template1.html', url: 'template1.html'},
              { name: 'template2.html', url: 'template2.html'} ];
          $scope.template = $scope.templates[0];
        }]);
     </file>
    <file name="template1.html">
      Content of template1.html
    </file>
    <file name="template2.html">
      Content of template2.html
    </file>
    <file name="animations.css">
      .slide-animate-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .slide-animate {
        padding:10px;
      }

      .slide-animate.ng-enter, .slide-animate.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        display:block;
        padding:10px;
      }

      .slide-animate.ng-enter {
        top:-50px;
      }
      .slide-animate.ng-enter.ng-enter-active {
        top:0;
      }

      .slide-animate.ng-leave {
        top:0;
      }
      .slide-animate.ng-leave.ng-leave-active {
        top:50px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var templateSelect = element(by.model('template'));
      var includeElem = element(by.css('[ng-include]'));

      it('should load template1.html', function() {
        expect(includeElem.getText()).toMatch(/Content of template1.html/);
      });

      it('should load template2.html', function() {
        if (browser.params.browser == 'firefox') {
          // Firefox can't handle using selects
          // See https://github.com/angular/protractor/issues/480
          return;
        }
        templateSelect.click();
        templateSelect.all(by.css('option')).get(2).click();
        expect(includeElem.getText()).toMatch(/Content of template2.html/);
      });

      it('should change to blank', function() {
        if (browser.params.browser == 'firefox') {
          // Firefox can't handle using selects
          return;
        }
        templateSelect.click();
        templateSelect.all(by.css('option')).get(0).click();
        expect(includeElem.isPresent()).toBe(false);
      });
    </file>
  </example>
 */


/**
 * @ngdoc event
 * @name ngInclude#$includeContentRequested
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted every time the ngInclude content is requested.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {String} src URL of content to load.
 */


/**
 * @ngdoc event
 * @name ngInclude#$includeContentLoaded
 * @eventType emit on the current ngInclude scope
 * @description
 * Emitted every time the ngInclude content is reloaded.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {String} src URL of content to load.
 */


/**
 * @ngdoc event
 * @name ngInclude#$includeContentError
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted when a template HTTP request yields an erroneous response (status < 200 || status > 299)
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {String} src URL of content to load.
 */
var ngIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate', '$sce',
                  function($templateRequest,   $anchorScroll,   $animate,   $sce) {
  return {
    restrict: 'ECA',
    priority: 400,
    terminal: true,
    transclude: 'element',
    controller: angular.noop,
    compile: function(element, attr) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, $element, $attr, ctrl, $transclude) {
        var changeCounter = 0,
            currentScope,
            previousElement,
            currentElement;

        var cleanupLastIncludeContent = function() {
          if (previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            $animate.leave(currentElement).then(function() {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        };

        scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
          var afterAnimation = function() {
            if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
              $anchorScroll();
            }
          };
          var thisChangeId = ++changeCounter;

          if (src) {
            //set the 2nd param to true to ignore the template request error so that the inner
            //contents and scope can be cleaned up.
            $templateRequest(src, true).then(function(response) {
              if (thisChangeId !== changeCounter) return;
              var newScope = scope.$new();
              ctrl.template = response;

              // Note: This will also link all children of ng-include that were contained in the original
              // html. If that content contains controllers, ... they could pollute/change the scope.
              // However, using ng-include on an element with additional content does not make sense...
              // Note: We can't remove them in the cloneAttchFn of $transclude as that
              // function is called before linking the content, which would apply child
              // directives to non existing elements.
              var clone = $transclude(newScope, function(clone) {
                cleanupLastIncludeContent();
                $animate.enter(clone, null, $element).then(afterAnimation);
              });

              currentScope = newScope;
              currentElement = clone;

              currentScope.$emit('$includeContentLoaded', src);
              scope.$eval(onloadExp);
            }, function() {
              if (thisChangeId === changeCounter) {
                cleanupLastIncludeContent();
                scope.$emit('$includeContentError', src);
              }
            });
            scope.$emit('$includeContentRequested', src);
          } else {
            cleanupLastIncludeContent();
            ctrl.template = null;
          }
        });
      };
    }
  };
}];

// This directive is called during the $transclude call of the first `ngInclude` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngInclude
// is called.
var ngIncludeFillContentDirective = ['$compile',
  function($compile) {
    return {
      restrict: 'ECA',
      priority: -400,
      require: 'ngInclude',
      link: function(scope, $element, $attr, ctrl) {
        if (/SVG/.test($element[0].toString())) {
          // WebKit: https://bugs.webkit.org/show_bug.cgi?id=135698 --- SVG elements do not
          // support innerHTML, so detect this here and try to generate the contents
          // specially.
          $element.empty();
          $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope,
              function namespaceAdaptedClone(clone) {
            $element.append(clone);
          }, {futureParentElement: $element});
          return;
        }

        $element.html(ctrl.template);
        $compile($element.contents())(scope);
      }
    };
  }];
