'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngInclude
 * @restrict ECA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ngInclude won't work for cross-domain requests on all browsers and for
 *  file:// access on some browsers).
 *
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **enter**
 * and **leave** effects.
 *
 * @animations
 * enter - happens just after the ngInclude contents change and a new DOM element is created and injected into the ngInclude container
 * leave - happens just after the ngInclude contents change and just before the former contents are removed from the DOM
 *
 * @scope
 *
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} ngOnloadDeep Expression to evaluate when all nested partials have been loaded.
 *
 * @param {string=} ngAnimateOnDeepload Whether `ngAnimate` should wait for nested partials to be loaded before
 *                  inserting the element in the DOM
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
       <div class="example-animate-container"
            ng-include="template.url"
            ng-animate="{enter: 'example-enter', leave: 'example-leave'}"></div>
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
      <div>Content of template1.html</div>
    </file>
    <file name="template2.html">
      <div>Content of template2.html</div>
    </file>
    <file name="animations.css">
      .example-leave,
      .example-enter {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .example-animate-container > * {
        display:block;
        padding:10px;
      }

      .example-enter {
        top:-50px;
      }
      .example-enter.example-enter-active {
        top:0;
      }

      .example-leave {
        top:0;
      }
      .example-leave.example-leave-active {
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
       expect(element('.doc-example-live [ng-include]').text()).toEqual('');
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


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentDeeploaded
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the current ngInclude scope
 * @description
 * Emitted every time the ngInclude content and all nested partials have been loaded.
 */

var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile', '$animator', '$timeout',
                  function($http,   $templateCache,   $anchorScroll,   $compile,   $animator,   $timeout) {
  return {
    restrict: 'ECA',
    terminal: true,
    scope: true,
    compile: function(element, attr) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          ngOnloadDeepExp = attr.ngOnloadDeep || '',
          autoScrollExp = attr.autoscroll,
          ngAnimateOnDeeploadExp = attr.ngAnimateOnDeepload;

      return function(scope, element, attr) {
        var animate = $animator(scope, attr);
        var changeCounter = 0,
            childScope;

        var clearContent = function() {
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          animate.leave(element.contents(), element);
        };

        scope.$watch(srcExp, function ngIncludeWatchAction(src) {
          var thisChangeId = ++changeCounter;

          if (src) {

            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;

              if (childScope) childScope.$destroy();
              childScope = scope.$new();
              animate.leave(element.contents(), element);

              var contents = jqLite('<div/>').html(response).contents();

              if (!attr.hasOwnProperty('ngAnimateOnDeepload') ||
                  (ngAnimateOnDeeploadExp && !scope.$parent.$eval(ngAnimateOnDeeploadExp))) {
                animate.enter(contents, element);
              }

              $compile(contents)(childScope);

              if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$parent.$eval(autoScrollExp))) {
                $anchorScroll();
              }

              childScope.$emit('$includeContentLoaded');
              scope.$parent.$eval(onloadExp);


              // init counter
              scope.childIncludesLeft = 0;

              // increase counter for each direct child include request
              var includeChildRequestedListener = scope.$on('$$includeChildRequested', function (e) {
                e.stopPropagation();
                scope.childIncludesLeft++;
              });

              // decrease counter when a direct child is ready
              var includeChildDeeploadedListener = scope.$on('$$includeChildDeeploaded', function (e) {
                e.stopPropagation();
                scope.childIncludesLeft--;
              });

              // let the contained ngInclude(s) increase the counter
              $timeout(function() {

                // monitor the counter
                var childIncludesLeftWatcher = scope.$watch('childIncludesLeft', function (newVal) {

                  if (newVal === 0) {

                    // enter the animation if it was delayed to deepload
                    if (attr.hasOwnProperty('ngAnimateOnDeepload') &&
                        (!ngAnimateOnDeeploadExp || scope.$parent.$eval(ngAnimateOnDeeploadExp))) {
                      animate.enter(contents, element);
                    }

                    // notify everyone that this item and its nested partials are all loaded
                    childScope.$emit('$includeContentDeeploaded');

                    // eval the onload-deep expression
                    scope.$parent.$eval(ngOnloadDeepExp);

                    // notify the parent include that this item and its nested partials are all loaded
                    // (this event is for internal use, as we'll need to stop its propagation)
                    scope.$parent.$emit('$$includeChildDeeploaded');

                    // cleanup
                    includeChildRequestedListener();
                    includeChildDeeploadedListener();
                    childIncludesLeftWatcher();
                  }
                });
              });


            }).error(function() {
              if (thisChangeId === changeCounter) clearContent();
            });
            scope.$parent.$emit('$includeContentRequested');

            // notify the parent include that this element contains other partials
            // (this event is for internal use, as we'll need to stop its propagation)
            scope.$parent.$emit('$$includeChildRequested');




          } else {
            clearContent();
          }
        });
      };
    }
  };
}];
