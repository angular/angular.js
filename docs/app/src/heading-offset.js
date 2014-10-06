(function() {


function createPostLinkFn(element, attrs, headingOffset, $compile) {

  return function postLink(scope) {

    // Create an anchor for this heading
    var anchor = $compile('<div></div>')(scope);

    // Move the id from the original heading element to the div
    anchor.attr('id', attrs.id);
    element.removeAttr('id');

    // Insert this anchor as the first child of the heading
    element.prepend(anchor);

    var updateStyle = function(offset) {
      offset = offset || headingOffset.value;
      anchor.css('margin-top', '-'+offset);
      anchor.css('height', offset);
    };

    // Work out whether we are using a specific offset or getting the global default
    if ( angular.isDefined(element.attr(attrs.$attr.ngOffset)) ) {
      attrs.$observe('ngOffset', updateStyle);
    } else {
      scope.$watch(function() { return headingOffset.value; }, updateStyle);
    }
  };

}


angular.module('heading-offset', [])

/**
 * @ngdoc service
 * @description
 * The offset to use for heading anchors if not specific offset is given using ngOffset.
 * You can set this in a `run` block or update it dynamically based on changing sizes of
 * static header.
 */
.value('headingOffset', {value: '0px' })

/**
 * @ngdoc directive
 * @name id / ngOffset
 * @description
 * A directive that matches id attributes on headings (h1, h2, etc) and anchors (a).
 * When matched this directive injects a new element that acts as a buffer to ensure that
 * when we navigate to the element by id (using a hash on the url) the element appears far
 * enough down the page
 *
 * You can specify the offset on an element by element basis using the `ng-offset` attribute.
 * The attribute can be a static value:
 *
 * ```html
 * <h3 id="some-heading" ng-offset="56px">Some Heading</h3>
 * ```
 *
 * or it can be interpolated:
 *
 * ```html
 * <h3 id="some-heading" ng-offset="{{ offset }}">Some Heading</h3>
 * ```
 *
 * If no value is given for `ng-offset` then the directive will use the value given by the
 * `headingOffset` service. You can set the value of this at runtime:
 *
 * ```html
 * <h3 id="some-heading">Some Heading</h3>
 * ```
 *
 * ```js
 * appModule.run(['headingOffset', function(headingOffset) {
 *   // Provide the initial offset for heading anchors
 *   headingOffset.value = '120px';
 * }]);
 * ```
 *
 * Be aware that this moves the id to a span below the original element which can play havoc with you
 * CSS if you are relying on ids in your styles (which you shouldn't).
 *
 */
.directive('id', ['headingOffset', '$compile', function(headingOffset, $compile) {

  var ELEMENTS_TO_MATCH = /^(h\d+|a)$/i;

  return {
    restrict: 'A',
    compile: function(element, attrs) {

      // This directive only looks for headings and anchors with id attributes
      // It doesn't handle the case where ngOffset is defined as that is handled by the other
      // directive below
      if ( ELEMENTS_TO_MATCH.test(element[0].nodeName) && angular.isUndefined(attrs.ngOffset)) {
        return createPostLinkFn(element, attrs, headingOffset, $compile);
      }
    }
  };
}])

.directive('ngOffset', ['headingOffset', '$compile', function(headingOffset, $compile) {
  return {
    restrict: 'A',
    compile: function(element, attrs) {
      // This directive handles the case where ngOffset is defined as an attribute
      return createPostLinkFn(element, attrs, headingOffset, $compile);
    }
  };
}]);

})();