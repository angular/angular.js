'use strict';

/**
 * @ngdoc service
 * @name $anchorScroll
 * @kind function
 * @requires $window
 * @requires $location
 * @requires $rootScope
 *
 * @description
 * When called, it checks current value of `$location.hash()` and scrolls to the related element,
 * according to rules specified in
 * [Html5 spec](http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document).
 *
 * It also watches the `$location.hash()` and scrolls whenever it changes to match any anchor.
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.
 *
 * Additionally, you can specify a scroll offset (in pixels) during the configuration phase by
 * calling `$anchorScrollProvider.setScrollOffset(<valueOrGetter>)`. The offset can be either a
 * fixed value or a getter function that returns a value dynamically.
 *
 * @example
   <example module="anchorScrollExample">
     <file name="index.html">
       <div id="scrollArea" ng-controller="ScrollController">
         <a ng-click="gotoBottom()">Go to bottom</a>
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
         height: 350px;
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
 * The example below illustrates the use of scroll offset (specified as a fixed value).
 *
 * @example
   <example module="anchorScrollOffsetExample">
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
         .config(['$anchorScrollProvider', function($anchorScrollProvider) {
           $anchorScrollProvider.setScrollOffset(50);   // always scroll by 50 extra pixels
         }])
         .controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
           function ($anchorScroll, $location, $scope) {
             $scope.gotoAnchor = function(x) {
               // Set the location.hash to the id of
               // the element you wish to scroll to.
               $location.hash('anchor' + x);

               // Call $anchorScroll()
               $anchorScroll();
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
function $AnchorScrollProvider() {
// TODO(gkalpak): The $anchorScrollProvider should be documented as well
//                (under the providers section).

  var DEFAULT_OFFSET = 0;

  var autoScrollingEnabled = true;
  var scrollOffsetGetter = function() { return DEFAULT_OFFSET; };

  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  this.setScrollOffset = function(newScrollOffset) {
    if (isFunction(newScrollOffset)) {
      scrollOffsetGetter = function() { return newScrollOffset(); };
    } else if (isNumber(newScrollOffset)) {
      scrollOffsetGetter = function() { return newScrollOffset; };
    }
  };

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

    function scrollTo(elem) {
      if (elem) {
        elem.scrollIntoView();
        var offset = scrollOffsetGetter();
        var actualOffset = offset && (offset - (elem.offsetTop - document.body.scrollTop));
        if (actualOffset) {
          $window.scrollBy(0, -1 * actualOffset);
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

          $rootScope.$evalAsync(scroll);
        });
    }

    return scroll;
  }];
}
