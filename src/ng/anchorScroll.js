'use strict';

/**
 * @ngdoc provider
 * @name $anchorScrollProvider
 * @this
 *
 * @description
 * Use `$anchorScrollProvider` to disable automatic scrolling whenever
 * {@link ng.$location#hash $location.hash()} changes.
 */
function $AnchorScrollProvider() {

  var autoScrollingEnabled = true;

  /**
   * @ngdoc method
   * @name $anchorScrollProvider#disableAutoScrolling
   *
   * @description
   * By default, {@link ng.$anchorScroll $anchorScroll()} will automatically detect changes to
   * {@link ng.$location#hash $location.hash()} and scroll to the element matching the new hash.<br />
   * Use this method to disable automatic scrolling.
   *
   * If automatic scrolling is disabled, one must explicitly call
   * {@link ng.$anchorScroll $anchorScroll()} in order to scroll to the element related to the
   * current hash.
   */
  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  /**
   * @ngdoc service
   * @name $anchorScroll
   * @kind function
   * @requires $window
   * @requires $location
   * @requires $rootScope
   *
   * @description
   * When called, it scrolls to the element related to the specified `hash` or (if omitted) to the
   * current value of {@link ng.$location#hash $location.hash()}, according to the rules specified
   * in the
   * [HTML5 spec](http://www.w3.org/html/wg/drafts/html/master/browsers.html#an-indicated-part-of-the-document).
   *
   * It also watches the {@link ng.$location#hash $location.hash()} and automatically scrolls to
   * match any anchor whenever it changes. This can be disabled by calling
   * {@link ng.$anchorScrollProvider#disableAutoScrolling $anchorScrollProvider.disableAutoScrolling()}.
   *
   * Additionally, you can use its {@link ng.$anchorScroll#yOffset yOffset} property to specify a
   * vertical scroll-offset (either fixed or dynamic).
   *
   * @param {string=} hash The hash specifying the element to scroll to. If omitted, the value of
   *                       {@link ng.$location#hash $location.hash()} will be used.
   *
   * @property {(number|function|jqLite)} yOffset
   * If set, specifies a vertical scroll-offset. This is often useful when there are fixed
   * positioned elements at the top of the page, such as navbars, headers etc.
   *
   * `yOffset` can be specified in various ways:
   * - **number**: A fixed number of pixels to be used as offset.<br /><br />
   * - **function**: A getter function called everytime `$anchorScroll()` is executed. Must return
   *   a number representing the offset (in pixels).<br /><br />
   * - **jqLite**: A jqLite/jQuery element to be used for specifying the offset. The distance from
   *   the top of the page to the element's bottom will be used as offset.<br />
   *   **Note**: The element will be taken into account only as long as its `position` is set to
   *   `fixed`. This option is useful, when dealing with responsive navbars/headers that adjust
   *   their height and/or positioning according to the viewport's size.
   *
   * <br />
   * <div class="alert alert-warning">
   * In order for `yOffset` to work properly, scrolling should take place on the document's root and
   * not some child element.
   * </div>
   *
   * @example
     <example module="anchorScrollExample" name="anchor-scroll">
       <file name="index.html">
         <div id="scrollArea" ng-controller="ScrollController">
           <a ng-click="gotoBottom()">Go to bottom</a>
           <a id="bottom"></a> You're at the bottom!
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollExample', [])
           .controller('ScrollController', ['$scope', '$location', '$anchorScroll',
             function($scope, $location, $anchorScroll) {
               $scope.gotoBottom = function() {
                 // set the location.hash to the id of
                 // the element you wish to scroll to.
                 $location.hash('bottom');

                 // call $anchorScroll()
                 $anchorScroll();
               };
             }]);
       </file>
       <file name="style.css">
         #scrollArea {
           height: 280px;
           overflow: auto;
         }

         #bottom {
           display: block;
           margin-top: 2000px;
         }
       </file>
     </example>
   *
   * <hr />
   * The example below illustrates the use of a vertical scroll-offset (specified as a fixed value).
   * See {@link ng.$anchorScroll#yOffset $anchorScroll.yOffset} for more details.
   *
   * @example
     <example module="anchorScrollOffsetExample" name="anchor-scroll-offset">
       <file name="index.html">
         <div class="fixed-header" ng-controller="headerCtrl">
           <a href="" ng-click="gotoAnchor(x)" ng-repeat="x in [1,2,3,4,5]">
             Go to anchor {{x}}
           </a>
         </div>
         <div id="anchor{{x}}" class="anchor" ng-repeat="x in [1,2,3,4,5]">
           Anchor {{x}} of 5
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollOffsetExample', [])
           .run(['$anchorScroll', function($anchorScroll) {
             $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
           }])
           .controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
             function($anchorScroll, $location, $scope) {
               $scope.gotoAnchor = function(x) {
                 var newHash = 'anchor' + x;
                 if ($location.hash() !== newHash) {
                   // set the $location.hash to `newHash` and
                   // $anchorScroll will automatically scroll to it
                   $location.hash('anchor' + x);
                 } else {
                   // call $anchorScroll() explicitly,
                   // since $location.hash hasn't changed
                   $anchorScroll();
                 }
               };
             }
           ]);
       </file>
       <file name="style.css">
         body {
           padding-top: 50px;
         }

         .anchor {
           border: 2px dashed DarkOrchid;
           padding: 10px 10px 200px 10px;
         }

         .fixed-header {
           background-color: rgba(0, 0, 0, 0.2);
           height: 50px;
           position: fixed;
           top: 0; left: 0; right: 0;
         }

         .fixed-header > a {
           display: inline-block;
           margin: 5px 15px;
         }
       </file>
     </example>
   */
  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;

    // Helper function to get first anchor from a NodeList
    // (using `Array#some()` instead of `angular#forEach()` since it's more performant
    //  and working in all supported browsers.)
    function getFirstAnchor(list) {
      var result = null;
      Array.prototype.some.call(list, function(element) {
        if (nodeName_(element) === 'a') {
          result = element;
          return true;
        }
      });
      return result;
    }

    function getYOffset() {

      var offset = scroll.yOffset;

      if (isFunction(offset)) {
        offset = offset();
      } else if (isElement(offset)) {
        var elem = offset[0];
        var style = $window.getComputedStyle(elem);
        if (style.position !== 'fixed') {
          offset = 0;
        } else {
          offset = elem.getBoundingClientRect().bottom;
        }
      } else if (!isNumber(offset)) {
        offset = 0;
      }

      return offset;
    }

    function scrollTo(elem) {
      if (elem) {
        elem.scrollIntoView();

        var offset = getYOffset();

        if (offset) {
          // `offset` is the number of pixels we should scroll UP in order to align `elem` properly.
          // This is true ONLY if the call to `elem.scrollIntoView()` initially aligns `elem` at the
          // top of the viewport.
          //
          // IF the number of pixels from the top of `elem` to the end of the page's content is less
          // than the height of the viewport, then `elem.scrollIntoView()` will align the `elem` some
          // way down the page.
          //
          // This is often the case for elements near the bottom of the page.
          //
          // In such cases we do not need to scroll the whole `offset` up, just the difference between
          // the top of the element and the offset, which is enough to align the top of `elem` at the
          // desired position.
          var elemTop = elem.getBoundingClientRect().top;
          $window.scrollBy(0, elemTop - offset);
        }
      } else {
        $window.scrollTo(0, 0);
      }
    }

    function scroll(hash) {
      // Allow numeric hashes
      hash = isString(hash) ? hash : isNumber(hash) ? hash.toString() : $location.hash();
      var elm;

      // empty hash, scroll to the top of the page
      if (!hash) scrollTo(null);

      // element with given id
      else if ((elm = document.getElementById(hash))) scrollTo(elm);

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);

      // no element and hash === 'top', scroll to the top of the page
      else if (hash === 'top') scrollTo(null);
    }

    // does not scroll when user clicks on anchor link that is currently on
    // (no url change, no $location.hash() change), browser native does scroll
    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction(newVal, oldVal) {
          // skip the initial scroll if $location.hash is empty
          if (newVal === oldVal && newVal === '') return;

          jqLiteDocumentLoaded(function() {
            $rootScope.$evalAsync(scroll);
          });
        });
    }

    return scroll;
  }];
}
