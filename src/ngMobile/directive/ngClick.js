'use strict';

/**
 * @ngdoc directive
 * @name ngMobile.directive:ngTap
 *
 * @description
 * Specify custom behavior when element is tapped on a touchscreen device.
 * A tap is a brief, down-and-up touch without much motion.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <button ng-tap="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </doc:source>
    </doc:example>
 */

ngMobile.config(['$provide', function($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}]);

ngMobile.directive('ngClick', ['$parse', '$mobile', function($parse, $mobile) {
  var MOVE_TOLERANCE = $mobile.getPointSize() * 8, // 8pt
    TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.

  
  // Actual linking function.
  return function(scope, element, attrs) {
    var firstId,
      tapElement, // Used to blur the element after a tap.
      startTime,  // Used to check if the tap was held too long.
      touchStartX,
      touchStartY,
      expressionFn = $parse(attrs.ngClick),
      clickHandler = function(event) {
        scope.$apply(function() {
          // TODO(braden): This is sending the touchend, click or pointerup. Is that kosher?
          expressionFn(scope, {$event: event});
        });
      };

    $mobile.getPointerEvents(scope, element, {
      down: function(id, pointer, event) {
        if(!firstId) {
          firstId = id;
          tapElement = event.target ? event.target : event.srcElement;  // IE uses srcElement.

          // Hack for Safari, which can target text nodes instead of containers.
          if(tapElement.nodeType == 3) {
            tapElement = tapElement.parentNode;
          }

          startTime = Date.now();

          touchStartX = pointer.clientX;
          touchStartY = pointer.clientY;
        }
      },
      move: function(id, pointer, event) {  // Resets the state
        if(firstId === id) {
          firstId = undefined;
        }
      },
      up: function(id, pointer, event) {
        if(firstId === id) {
          var diff = Date.now() - startTime,
            x = pointer.clientX,
            y = pointer.clientY,
            dist = Math.sqrt( Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2) );

          try {
            if (event.type == 'touchend' && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
              $mobile.preventGhostClick(x, y);

              // Blur the focused element (the button, probably) before firing the callback.
              // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
              // I couldn't get anything to work reliably on Android Chrome.
              if (tapElement) {
                tapElement.blur();
              }
              
              // Send the pointer as it has the clientX / Y set so more useful then the raw
              //  event object on touch devices. Mouse / Pointers this is the event object.
              clickHandler(pointer);
            }
          } finally {
            firstId = undefined;    // Resets the state
          }
        }
      },
      cancel: function(id, event) {
        if(firstId === id) {
          firstId = undefined;      // Resets the state
        }
      }
    });
    
    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Fallback click handler.
    // Busted clicks don't get this far, and adding this handler allows ng-tap to be used on
    // desktop as well, to allow more portable sites.
    element.bind('click', clickHandler);
  };
}]);

