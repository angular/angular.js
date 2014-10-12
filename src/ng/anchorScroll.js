'use strict';

/**
 * @ngdoc provider
 * @name $anchorScrollProvider
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
   * When called, it checks the current value of {@link ng.$location#hash $location.hash()} and
   * scrolls to the related element, according to the rules specified in the
   * [Html5 spec](http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document).
   *
   * It also watches the {@link ng.$location#hash $location.hash()} and automatically scrolls to
   * match any anchor whenever it changes. This can be disabled by calling
   * {@link ng.$anchorScrollProvider#disableAutoScrolling $anchorScrollProvider.disableAutoScrolling()}.
   *
   * Additionally, you can use its {@link ng.$anchorScroll#yOffset yOffset} property to specify a
   * vertical scroll-offset (either fixed or dynamic).
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
     <example module="anchorScrollExample">
       <file name="index.html">
         <div id="scrollArea" ng-controller="ScrollController">
           <a id="top" ng-click="gotoBottom()">Go to bottom</a>
           <a id="bottom"></a> You're at the bottom!
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollExample', [])
           .controller('ScrollController', ['$scope', '$location', '$anchorScroll',
             function ($scope, $location, $anchorScroll) {
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
       <file name="protractor.js" type="protractor">
         function _isElemVisible() {
           var elem = document.getElementById(arguments[0]);
           var rect = elem.getBoundingClientRect();
           var docElem = document.documentElement;
           return (rect.top < docElem.clientHeight) &&
                  (rect.bottom > 0) &&
                  (rect.left < docElem.clientWidth) &&
                  (rect.right > 0);
         }

         function expectVisible(id, expected) {
           browser.driver.executeScript(_isElemVisible, id).then(function(isVisible) {
             expect(isVisible).toBe(expected);
           });
         }

         function scrollToTop() {
           browser.driver.executeScript('window.scrollTo(0, 0);');
         }

         it('should scroll to #bottom upon clicking #top', function() {
           scrollToTop();
           expectVisible('top', true);
           expectVisible('bottom', false);

           element(by.id('top')).click();
           expectVisible('top', false);
           expectVisible('bottom', true);
         });
       </file>
     </example>
   *
   * <hr />
   * The example below illustrates the use of a vertical scroll-offset (specified as a fixed value).
   * See {@link ng.$anchorScroll#yOffset $anchorScroll.yOffset} for more details.
   *
   * @example
     <example module="anchorScrollOffsetExample">
       <file name="index.html">
         <div class="fixed-header" ng-controller="headerCtrl">
           <a href="" ng-click="gotoAnchor(x)" ng-repeat="x in [0,1,2,3,4]">
             Go to anchor {{$index + 1}}
           </a>
         </div>
         <div id="anchor{{y}}" class="anchor" ng-repeat="y in [0,1,2,3,4]">
           Anchor {{$index + 1}} of 5
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollOffsetExample', [])
           .run(['$anchorScroll', function($anchorScroll) {
             // scroll with a 50px offset from the top of the viewport
             $anchorScroll.yOffset = 50;
           }])
           .controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
             function ($anchorScroll, $location, $scope) {
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
           height: 100%;
           margin: 0;
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
       <file name="protractor.js" type="protractor">
         function _isElemVisible() {
           var elem = document.getElementById(arguments[0]);
           var rect = elem.getBoundingClientRect();
           var docElem = document.documentElement;
           return (rect.top < docElem.clientHeight) &&
                  (rect.bottom > 0) &&
                  (rect.left < docElem.clientWidth) &&
                  (rect.right > 0);
         }

         function _getElemTop() {
           var elem = document.getElementById(arguments[0]);
           var rect = elem.getBoundingClientRect();
           return rect.top;
         }

         function _getViewportHeight() {
           return window.document.documentElement.clientHeight;
         }

         function _scrollElemIntoView() {
           var elem = document.getElementById(arguments[0]);
           elem.scrollIntoView();
         }

         function execWithTempViewportHeight(tempHeight, fn) {
           setViewportHeight(tempHeight).then(function(oldHeight) {
             fn();
             setViewportHeight(oldHeight);
           });
         }

         function execWithTempHash(tempHash, fn) {
           browser.driver.getCurrentUrl().then(function(oldUrl) {
             var newUrl = oldUrl + '#/#' + tempHash;
             browser.get(newUrl);
             fn();
             browser.get(oldUrl);
           });
         }

         function expectVisible(id, expected) {
           browser.driver.executeScript(_isElemVisible, id).then(function(isVisible) {
             expect(isVisible).toBe(expected);
           });
         }

         function expectTop(id, expected) {
           browser.driver.executeScript(_getElemTop, id).then(function(top) {
             expect(top).toBe(expected);
           });
         }


         function scrollIntoView(id) {
           browser.driver.executeScript(_scrollElemIntoView, id);
         }

         function scrollTo(y) {
           browser.driver.executeScript('window.scrollTo(0, ' + y + ');');
         }

         function scrollToTop() {
           scrollTo(0);
         }

         function setViewportHeight(newHeight) {
           return browser.driver.executeScript(_getViewportHeight).then(function(oldHeight) {
             var heightDiff = newHeight - oldHeight;
             var win = browser.driver.manage().window();

             return win.getSize().then(function(size) {
               var newWinHeight = size.height + heightDiff;

               return win.setSize(size.width, newWinHeight).then(function() {
                 return oldHeight;
               });
             });
           });
         }

         describe('scrolling with 50px offset', function() {
           var yOffset = 50;

           beforeEach(function() {
             scrollToTop();
             expectVisible('anchor0', true);
             expectTop('anchor0', yOffset);
           });

           it('should scroll to the correct anchor when clicking each link', function() {
             var links = element.all(by.repeater('x in [0,1,2,3,4]'));
             var lastAnchor = element.all(by.repeater('y in [0,1,2,3,4]')).last();

             // Make sure there is enough room to scroll the last anchor to the top
             lastAnchor.getSize().then(function(size) {
               var tempHeight = size.height - 10;
               execWithTempViewportHeight(tempHeight, function() {
                 var idx = 0;
                 links.each(function(link) {
                   var targetAnchorId = 'anchor' + idx;
                   link.click();
                   expectVisible(targetAnchorId, true);
                   expectTop(targetAnchorId, yOffset);
                   idx++;
                 });
               });
             });
           });

           it('should automatically scroll when navigating to a URL with a hash', function() {
             var links = element.all(by.repeater('x in [0,1,2,3,4]'));
             var lastAnchor = element.all(by.repeater('y in [0,1,2,3,4]')).last();
             var targetAnchorId = 'anchor2';

             // Make sure there is enough room to scroll the last anchor to the top
             lastAnchor.getSize().then(function(size) {
               var tempHeight = size.height - 10;
               execWithTempViewportHeight(tempHeight, function() {
                 execWithTempHash(targetAnchorId, function() {
                   expectVisible(targetAnchorId, true);
                   expectTop(targetAnchorId, yOffset);
                 });
               });
             });
           });

           it('should not scroll "overzealously"', function () {
             var lastLink = element.all(by.repeater('x in [0,1,2,3,4]')).last();
             var lastAnchor = element.all(by.repeater('y in [0,1,2,3,4]')).last();
             var targetAnchorId = 'anchor4';

             // Make sure there is not enough room to scroll the last anchor to the top
             lastAnchor.getSize().then(function(size) {
               var tempHeight = size.height + (yOffset / 2);
               execWithTempViewportHeight(tempHeight, function() {
                 scrollIntoView(targetAnchorId);
                 expectTop(targetAnchorId, yOffset / 2);
                 lastLink.click();
                 expectVisible(targetAnchorId, true);
                 expectTop(targetAnchorId, yOffset);
               });
             });
           });
         });
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

    function scroll() {
      var hash = $location.hash(), elm;

      // empty hash, scroll to the top of the page
      if (!hash) scrollTo(null);

      // element with given id
      else if ((elm = document.getElementById(hash))) scrollTo(elm);

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);

      // no element and hash == 'top', scroll to the top of the page
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
