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
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  var POINTER_EVENTS = {
    'mouse': {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    'touch': {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel'
    },
    'pointer': {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
      cancel: 'pointercancel'
    }
  };

  function getCoordinates(event) {
    var originalEvent = event.originalEvent || event;
    var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
    var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function getEvents(pointerTypes, eventType) {
    var res = [];
    angular.forEach(pointerTypes, function(pointerType) {
      var eventName = POINTER_EVENTS[pointerType][eventType];
      if (eventName) {
        res.push(eventName);
      }
    });
    return res.join(' ');
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     * The pointer types that should be used can be specified via the optional
     * third argument, which is an array of strings `'mouse'`, `'touch'` and `'pointer'`. By default,
     * `$swipe` will listen for `mouse`, `touch` and `pointer` events.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }` and the raw
     * `event`. `cancel` receives the raw `event` as its single parameter.
     *
     * `start` is called on either `mousedown`, `touchstart` or `pointerdown`. After this event, `$swipe` is
     * watching for `touchmove`, `mousemove` or `pointermove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove`, `touchmove` and `pointermove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend`, `mouseup` or `pointerup`.
     *
     * `cancel` is called either on a `touchcancel` or `pointercancel`  from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, pointerTypes) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      pointerTypes = pointerTypes || ['mouse', 'touch', 'pointer'];
      element.on(getEvents(pointerTypes, 'start'), function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        if (eventHandlers['start']) {
          eventHandlers['start'](startCoords, event);
        }
      });
      var events = getEvents(pointerTypes, 'cancel');
      if (events) {
        element.on(events, function(event) {
          active = false;
          if (eventHandlers['cancel']) {
            eventHandlers['cancel'](event);
          }
        });
      }

      element.on(getEvents(pointerTypes, 'move'), function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          if (eventHandlers['cancel']) {
            eventHandlers['cancel'](event);
          }
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          if (eventHandlers['move']) {
            eventHandlers['move'](coords, event);
          }
        }
      });

      element.on(getEvents(pointerTypes, 'end'), function(event) {
        if (!active) return;
        active = false;
        if (eventHandlers['end']) {
          eventHandlers['end'](getCoordinates(event), event);
        }
      });
    }
  };
}]);

