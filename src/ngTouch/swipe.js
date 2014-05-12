'use strict';

/* global ngTouch: false */

    /**
     * @ngdoc service
     * @name $swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`, and by
     * `ngCarousel` in a separate component.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var DEFAULT_THRESHOLD = 10;

  function getCoordinates(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @param {DOMElement} element Element to listen for swipes on.
     * @param {object} eventHandlers An object of handlers to handle each of the
     *   `start`, `move`, `end`, and `cancel` events
     * @param {object} config An optional config object that supports two properties:
     * 
     *   - **swipeThreshold** - `{number}` - Number of pixels to wait before the event is
     *     determined to be a swipe. Default is 10 (see function description above for more).
     *   - **scrollThreshold** - `{number}` - Number of pixels to wait before the event is
     *     determined to be a scroll. Default is 10 (see function description above for more).
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }`.
     *
     * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
     * watching for `touchmove` or `mousemove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * The threshold is `10` (pixels) by default, but is configurable by passing in a `config`
     * object with properties for the `x` and `y` thresholds respectively `swipeThreshold` and 
     * `scrollThreshold`.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * 
     * - If the horizontal distance is greater and you haven't moved vertically the 
     *   `scrollThreshold`, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater (or you've met the vertical `scrollThreshold`), 
     *   this is a scroll, and we let the browser take over. A `cancel` event is sent.
     *
     * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
     *
     * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, config) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether an swipe is still being determined to be a scroll.
      var active = false;
      // Whether a swipe is active.
      var swipeActive = false;
      // Set up config for threshold radii with fallback.
      config = angular.extend({
        swipeThreshold: DEFAULT_THRESHOLD,
        scrollThreshold: DEFAULT_THRESHOLD
      }, config);

      element.on('touchstart mousedown', function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });

      element.on('touchcancel', function(event) {
        active = false;
        eventHandlers['cancel'] && eventHandlers['cancel'](event);
      });

      element.on('touchmove mousemove', function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += coords.x - lastPos.x;
        totalY += coords.y - lastPos.y;

        // we want totalX/Y to be the amount move +/- from the original spot,
        // but we need to compare against their absolute values in the 
        // comparisons below
        var absTotalX = Math.abs(totalX);
        var absTotalY = Math.abs(totalY);

        lastPos = coords;

        // don't do anything if neither threshold has been met
        if (absTotalX < config.swipeThreshold && absTotalY < config.scrollThreshold) {
          return;
        }

        // One of absTotalX or absTotalY has exceeded the threshold, so decide on swipe vs. scroll.
        if (!swipeActive && absTotalY > absTotalX && absTotalY > config.scrollThreshold) {
          // Allow native scrolling to take over.
          active = false;
          swipeActive = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          swipeActive = true;
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on('touchend mouseup', function(event) {
        if (!active) return;
        active = false;
        swipeActive = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}]);


