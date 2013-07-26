'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngInclude
 * @restrict ECA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that:
 *
 * -    by default, the template URL is restricted to the same domain and protocol as the
 *      application document.  This is done by calling {@link ng.$sce#getTrustedResourceUrl
 *      $sce.getTrustedResourceUrl} on it.  To load templates from other domains and/or protocols,
 *      you may either either {@link ng.$sceDelegateProvider#resourceUrlWhitelist whitelist them} or
 *      {@link ng.$sce#trustAsResourceUrl wrap it} into a trusted value.  Refer Angular's {@link
 *      ng.$sce Strict Contextual Escaping}.
 * -    in addition, the browser's
 *      {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 *      Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing
 *      (CORS)} policy apply that may further restrict whether the template is successfully loaded.
 *      (e.g.  ngInclude won't work for cross-domain requests on all browsers and for `file://`
 *      access on some browsers)
 *
 * Additionally, you can also provide animations via the ngAnimate module to animate the **enter**
 * and **leave** effects.
 *
 * @animations
 * enter - happens just after the ngInclude expression value changes and a new element is created and injected after the previous ngInclude element
 * leave - happens just after the ngInclude expression value changes and just before the former ngInclude element is removed from the DOM
 *
 * @scope
 *
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
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
  <example animations="true">
    <file name="index.html">
     <div ng-controller="Ctrl">
       <select ng-model="template" ng-options="t.name for t in templates">
        <option value="">(blank)</option>
       </select>
       url of the template: <tt>{{template.url}}</tt>
       <hr/>
       <div class="example-animate-container">
         <div class="include-example" ng-include="template.url"></div>
       </div>
     </div>
    </file>
    <file name="script.js">
      function Ctrl($scope) {
        $scope.templates =
          [ { name: 'template1.html', url: 'template1.html'}
          , { name: 'template2.html', url: 'template2.html'} ];
        $scope.template = $scope.templates[0];
      }
     </file>
    <file name="template1.html">
      Content of template1.html
    </file>
    <file name="template2.html">
      Content of template2.html
    </file>
    <file name="animations.css">
      .include-example.ng-enter, .include-example.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        display:block;
        padding:10px;
      }

      .include-example.ng-enter {
        top:-50px;
      }
      .include-example.ng-enter.ng-enter-active {
        top:0;
      }

      .include-example.ng-leave {
        top:0;
      }
      .include-example.ng-leave.ng-leave-active {
        top:50px;
      }
    </file>
    <file name="scenario.js">
      it('should load template1.html', function() {
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template1.html/);
      });
      it('should load template2.html', function() {
       select('template').option('1');
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template2.html/);
      });
      it('should change to blank', function() {
       select('template').option('');
       expect(element('.doc-example-live [ng-include]')).toBe(undefined);
      });
    </file>
  </example>
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentRequested
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted every time the ngInclude content is requested.
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentLoaded
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the current ngInclude scope
 * @description
 * Emitted every time the ngInclude content is reloaded.
 */
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile', '$animate', '$sce',
                  function($http,   $templateCache,   $anchorScroll,   $compile,   $animate,   $sce) {
  return {
    restrict: 'ECA',
    terminal: true,
    transclude: 'element',
    compile: function(element, attr, linker) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, $element, attr) {
        var changeCounter = 0,
            childScope,
            previousNode;

        var cleanupLastIncludeContent = function() {
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          if(previousNode) {
            $animate.leave(previousNode);
            previousNode = null;
          }
        };

        scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
          var thisChangeId = ++changeCounter;

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;
              var newScope = scope.$new();

              linker(newScope, function(clone) {
                cleanupLastIncludeContent();
                childScope = newScope;

                clone.html(response);
                $animate.enter(clone, null, jqLite(previousNode || $element));
                $compile(clone.contents())(childScope);
                previousNode = clone;

                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }

                childScope.$emit('$includeContentLoaded');
                scope.$eval(onloadExp);
              });
            }).error(function() {
              if (thisChangeId === changeCounter) cleanupLastIncludeContent();
            });
            scope.$emit('$includeContentRequested');
          } else {
            cleanupLastIncludeContent();
          }
        });
      };
    }
  };
}];
