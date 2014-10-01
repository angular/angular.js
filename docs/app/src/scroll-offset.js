angular.module('scrollOffset', [])

/**
 * scrollOffsetElement Directive
 *
 * @description Store the element whose height should be used to determine the scroll offset and its
 *              computed style.
 */
.directive('scrollOffsetElement', ['$window', 'SCROLL_OFFSET_ELEMENT',
  function scrollOffsetElementDirective($window, SCROLL_OFFSET_ELEMENT) {
    return {
      restrict: 'A',
      link: function scrollOffsetElementPostLink(scope, elem) {
        elem = elem[0];
        SCROLL_OFFSET_ELEMENT.element = elem;
        SCROLL_OFFSET_ELEMENT.computedStyle = $window.getComputedStyle(elem);
        // README: Using `getComputedStyle()` renders this approach incompatible with IE8.
      }
    };
  }
])

.constant('SCROLL_OFFSET_ELEMENT', {
  element: null,   // README: This is not used, but keeping it here just in case...
  computedStyle: null
})

.config(['$anchorScrollProvider', 'SCROLL_OFFSET_ELEMENT',
  function($anchorScrollProvider, SCROLL_OFFSET_ELEMENT) {
    var extraTopSpace = 15;
    $anchorScrollProvider.setScrollOffset(function () {
      var computedStyle = SCROLL_OFFSET_ELEMENT.computedStyle;

      if (!computedStyle || (computedStyle.position !== 'fixed')) return 0;

      return parseInt(computedStyle.height, 10) + extraTopSpace;
    });
  }
]);
