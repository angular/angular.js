'use strict';

/**
 * @ngdoc directive
 * @name ngMobile.directive:ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag too.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </doc:source>
    </doc:example>
 */

/**
 * @ngdoc directive
 * @name ngMobile.directive:ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag too.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </doc:source>
    </doc:example>
 */

function makeSwipeDirective(directiveName, direction) {
  ngMobile.directive(directiveName, ['$parse', '$mobile', function($parse, $mobile) {
    // The maximum vertical delta for a swipe should be less than 58pts.
    var MAX_VERTICAL_DISTANCE = $mobile.getPointSize() * 58,
    // Vertical distance should not be more than a fraction of the horizontal distance.
      MAX_VERTICAL_RATIO = 0.3,
    // At least a 24pt lateral motion is necessary for a swipe.
      MIN_HORIZONTAL_DISTANCE = $mobile.getPointSize() * 24,
    // The total distance in any direction before we make the call on swipe vs. scroll.
      MOVE_BUFFER_RADIUS = 10;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]),
        startCoords, valid,
        totalX, totalY,
        lastX, lastY;

      function validSwipe(event) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var coords = getCoordinates(event),
          deltaY = Math.abs(coords.y - startCoords.y),
          deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      $mobile.getPointerEvents(scope, element, {
        down: function(id, pointer, event) {
          if(!firstId) {
            firstId = id;
            startCoords = {
              x: pointer.clientX,
              y: pointer.clientY
            };
            valid = true;
            totalX = 0;
            totalY = 0;
            lastX = startCoords.x;
            lastY = startCoords.y;
          }
        },
        move: function(id, pointer, event) {  // Resets the state
          if(firstId === id && valid) {

            // Android will send a touchcancel if it thinks we're starting to scroll.
            // So when the total distance (+ or - or both) exceeds 10px in either direction,
            // we either:
            // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
            // - On totalY > totalX, we let the browser handle it as a scroll.

            // Invalidate a touch while it's in progress if it strays too far away vertically.
            // We don't want a scroll down and back up while drifting sideways to be a swipe just
            // because you happened to end up vertically close in the end.
            var coords = {
              x: pointer.clientX,
              y: pointer.clientY
            };

            if (Math.abs(coords.y - startCoords.y) > MAX_VERTICAL_DISTANCE) {
              valid = false;
              firstId = undefined;      // Resets the state
              return;
            }

            totalX += Math.abs(coords.x - lastX);
            totalY += Math.abs(coords.y - lastY);

            lastX = coords.x;
            lastY = coords.y;

            if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
              return;
            }

            // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
            if (totalY > totalX) {
              valid = false;
              firstId = undefined;      // Resets the state
            } else {
              event.preventDefault();
            }
          }
        },
        up: function(id, pointer, event) {
          if(firstId === id) {
            firstId = undefined;      // Resets the state

            if (validSwipe(event)) {
              // Prevent this swipe from bubbling up to any other elements with ngSwipes.
              event.stopPropagation();
              scope.$apply(function() {
                swipeHandler(scope, {$event:pointer});
              });
            }
          }
        },
        cancel: function(id, event) {
          if(firstId === id) {
            firstId = undefined;      // Resets the state
            valid = false;
          }
        }
      });
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1);
makeSwipeDirective('ngSwipeRight', 1);

