'use strict';


// Replaces the default ngClick with mobiles version
ngMobile.config(['$provide', '$mobileProvider', function($provide, $mobile) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}]);



/**
 * @ngdoc service
 * @name ngMobile.service:$mobileClick
 *
 * @description
 * An alias for $mobile that ensures click/tap detection functionality is available.
 *  Adds bindings for `tap` and `doubletap` to $mobile
 */
ngMobile.factory('$mobileClick', ['$window', '$timeout', '$mobile', function($window, $timeout, $mobile) {
  var CLICKBUSTER_THRESHOLD = 25,  // 25 pixels in any dimension is the limit for busting clicks.
    PREVENT_DURATION = 2500,     // 2.5 seconds maximum from preventGhostClick call to click
    lastPreventedTime,
    regionCount,
    touchCoordinatesMD,     // Touch coordinates for mouse down
    touchCoordinatesC,      // Touch coordinates for click


    // TAP EVENTS AND GHOST CLICKS
    //
    // Why tap events?
    // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
    // double-tapping, and then fire a click event.
    //
    // This delay sucks and makes mobile apps feel unresponsive.
    // So we detect touchstart, touchmove, touchcancel and touchend ourselves and determine when
    // the user has tapped on something.
    //
    // What happens when the browser then generates a click event?
    // The browser, of course, also detects the tap and fires a click after a delay. This results in
    // tapping/clicking twice. So we do "clickbusting" to prevent it.
    //
    // How does it work?
    // We attach global touchstart and click handlers, that run during the capture (early) phase.
    // So the sequence for a tap is:
    // - global touchstart: Sets an "allowable region" at the point touched.
    // - element's touchstart: Starts a touch
    // (- touchmove or touchcancel ends the touch, no click follows)
    // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
    //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
    // - preventGhostClick() removes the allowable region the global touchstart created.
    // - The browser generates a click event.
    // - The global click handler catches the click, and checks whether it was in an allowable region.
    //     - If preventGhostClick was called, the region will have been removed, the click is busted.
    //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
    //       other elements without ngTap on them work normally.
    //
    // This is an ugly, terrible hack!
    // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
    // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
    // encapsulates this ugly logic away from the user.
    //
    // Why not just put click handlers on the element?
    // We do that too, just to be sure. The problem is that the tap event might have caused the DOM
    // to change, so that the click fires in the same position but something else is there now. So
    // the handlers are global and care only about coordinates and not elements.


    // Checks if the coordinates are close enough to be within the region.
    hit = function(x1, y1, x2, y2) {
      return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
    },

    // Checks a list of allowable regions against a click location.
    // Returns true if the click should be allowed.
    // Splices out the allowable region from the list after it has been used.
    checkAllowableRegions = function(touchCoordinates, x, y) {
      for (var i = 0; i < touchCoordinates.length; i += 1) {
        if (hit(touchCoordinates[i][0], touchCoordinates[i][1], x, y)) {
          touchCoordinates.splice(i, i + 1);
          return true; // allowable region
        }
      }
      return false; // No allowable region; bust it.
    },

    // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
    // was called recently.
    onClick = function(event) {
      if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
        return; // Too old.
      }

      var touches = event.touches && event.touches.length ? event.touches : [event],
        x = touches[0].clientX,
        y = touches[0].clientY;
      // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
      // and on the input element). Depending on the exact browser, this second click we don't want
      // to bust has either (0,0) or negative coordinates.
      if (x < 1 && y < 1) {
        return; // offscreen
      }

      // Look for an allowable region containing this click.
      // If we find one, that means it was created by touchstart and not removed by
      // preventGhostClick, so we don't bust it.
      if (checkAllowableRegions(event.type == 'mousedown' ? touchCoordinatesMD : touchCoordinatesC, x, y)) {
        return;
      }

      // If we didn't find an allowable region, bust the click.
      event.stopPropagation();
      event.preventDefault();
    },

    // Global touchstart handler that creates an allowable region for a click event.
    // This allowable region can be removed by preventGhostClick if we want to bust it.
    onTouchStart = function(event) {
      var touches = event.touches && event.touches.length ? event.touches : [event],
        x = touches[0].clientX,
        y = touches[0].clientY,
        identifier = touches[0].identifier;

      touchCoordinatesMD.push([x, y, identifier]);
      touchCoordinatesC.push([x, y, identifier]);

      if (regionCount == 0) {
        $window.document.addEventListener('mousedown', onClick, true);
      }
      regionCount += 1;

      setTimeout(function() {
        // Remove the allowable region.
        var i;

        regionCount -= 1;
        if (regionCount == 0) {
          // Limits user to either touch events or mice on non-pointer event browsers
          // whilst allowing the user to switch input device at any time.
          // There is no delay moving from a mouse to touch, however there is a
          // PREVENT_DURATION (2.5 second) delay moving from touch to a mouse
          $window.document.removeEventListener('mousedown', onClick, true);
        }

        for (var i = 0; i < touchCoordinatesMD.length; i += 1) {
          if (touchCoordinatesMD[i][2] == identifier) {
            touchCoordinatesMD.splice(i, i + 1);
            break;
          }
        }
        for (var i = 0; i < touchCoordinatesC.length; i += 1) {
          if (touchCoordinatesC[i][2] == identifier) {
            touchCoordinatesC.splice(i, i + 1);
            break;
          }
        }
      }, PREVENT_DURATION);
    },

    // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
    // zone around the touchstart where clicks will get busted.
    preventGhostClick = function(x, y) {
      if (!touchCoordinatesC) {
        touchCoordinatesC = [];
        touchCoordinatesMD = [];
        regionCount = 1;
        $window.document.addEventListener('touchstart', onTouchStart, true);

        // Since mouse down binds the pointer to an element and iOS emulates
        // these events we block them temporarily 
        $window.document.addEventListener('mousedown', onClick, true);
        setTimeout(function() {
          regionCount -= 1;
          if (regionCount == 0) {
            $window.document.removeEventListener('mousedown', onClick, true);
          }
        }, PREVENT_DURATION);

        $window.document.addEventListener('click', onClick, true);
      }
      lastPreventedTime = Date.now();

      checkAllowableRegions(touchCoordinatesMD, x, y);
      checkAllowableRegions(touchCoordinatesC, x, y);
    };

  $mobile.register({
    name: 'tap',
    index: 100,
    defaults: {
      tap_max_pointers    : 1,
      tap_max_duration    : 750,    // Shorter than 750ms is a tap, longer is a taphold or drag.
      tap_move_tolerance  : 10,     // 10px doesn't overlap with drags move tolerance
      tap_always          : true,   // tap on double tap (w3c way for click)
      prevent_ghost_clicks: true,   // ignore virtual click events if click already handled
      doubletap_tolerance : 20,     // allow for a bit of human error
      doubletap_interval  : 400
    },
    setup: function(el, inst) {
      var self = this;

      // Use the setup function to check for IE8 or below
      // As IE doesn't have a mouse down event for double taps
      if(!$window.document.addEventListener) {
        el.bind('dblclick', function(ev) {
          if(inst.options.tap_always) {
            inst.trigger('tap', ev);
          }
          inst.trigger('doubletap', ev);
        });
      }

      // click fall-back (primarily for programmatic clicks and testing)
      // Also allows for browser defaults where a gesture hasn't prevented the click
      //  e.g. a hold will cancel a click event however if hold isn't applied to the element
      //       and we are on a desktop browser then this will trigger a click event
      self.allow_click = true;
      el.bind('click', function(ev) {
        if(self.allow_click === true) {
          inst.trigger('tap', ev);
        } else {
          $timeout.cancel(self.allow_click); // Ensures only one click is approved
          self.allow_click = true;
        }
      });
    },
    handler: function(ev, inst) {
      var self = this;

      switch(ev.eventType) {
      case $mobile.utils.EVENT_START:
        this.valid = true;
        break;
      case $mobile.utils.EVENT_MOVE:
        if (ev.distance > inst.options.tap_move_tolerance) {
          this.valid = false;
        }
        break;
      case $mobile.utils.EVENT_END:
        // previous gesture, for the double tap since these are two different gesture detections
        var prev = inst.previous;

        // when the touch time is higher then the max touch time
        // or when the moving distance is too much
        if(!this.valid || ev.deltaTime > inst.options.tap_max_duration ||
          ev.distance > inst.options.tap_move_tolerance) {
          if (inst.current.name != "") {
            // Prevent click if another gesture is occurring
            // Otherwise run with browser default behavior
            this.allow_click = $timeout(function() {
              self.allow_click = true;
            }, 0, false);
          }
          return;
        }

        inst.current.name = this.name;
        ev.preventDefault();

        // check if double tap
        if(prev && prev.name == this.name && !this.did_doubletap &&
            (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
            $mobile.utils.getDistance(prev.lastEvent.center, ev.center) < inst.options.doubletap_tolerance) {

          if(inst.options.tap_always) {
            inst.trigger(inst.current.name, ev);
          }
          inst.trigger('doubletap', ev);
          this.did_doubletap = true;
        } else {
          // do a single tap
          this.did_doubletap = false;
          inst.trigger(inst.current.name, ev);
        }

        if (ev.srcEvent.type == 'touchend' && inst.options.prevent_ghost_clicks) {
          preventGhostClick(ev.touches[0].clientX, ev.touches[0].clientY);
        }

        // Prevent click handler trigger as we have already handled this event.
        // We prevent clicks occuring after the up/end event has been handled
        //  and clear the condition before the next tick through the reactor
        //  or after a click has been prevented (which ever comes first)
        this.allow_click = $timeout(function() {
          self.allow_click = true;
        }, 0, false);

        break;
      }
    }
  });

  return $mobile;
}]);


/**
 * @ngdoc directive
 * @name ngMobile.directive:ngClick
 *
 * @description
 * Specify custom behavior when element is tapped on a touchscreen device.
 * A tap is a brief, down-and-up touch without much motion.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`, Angular Element as '$element')
 *
 * @example
    <doc:example>
      <doc:source>
        <button ng-click="clicks = clicks + 1" ng-init="clicks=0">
          Click to Increment
        </button>
        clicks: {{ clicks }}
      </doc:source>
    </doc:example>
 */
ngMobile.directive('ngClick', ['$parse', '$mobileClick', function($parse, $mobile) {
  return function(scope, element, attr) {
    var clickHandler = $parse(attr['ngClick']);

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element[0].onclick = function(event) {};

    $mobile.gestureOn(element, 'tap').bind('tap', function(eventdata) {
      scope.$apply(function() {
        clickHandler(scope, {$event: eventdata, $element: element});
      });
    });
  };
}]);



 /**
 * @ngdoc directive
 * @name ngMobile.directive:ngDblClick
 *
 * @description
 * Specify custom behavior when element is tapped twice on a touchscreen device.
 * A double tap is two taps with only a brief pause without much motion.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon double tap. (Event object is available as `$event`, Angular Element as '$element')
 *
 * @example
    <doc:example>
      <doc:source>
        <button ng-dbl-click="dbl = dbl + 1" ng-init="dbl=0">
          Double Click to Increment
        </button>
        Double Clicks: {{ dbl }}
      </doc:source>
    </doc:example>
 */
ngMobile.directive('ngDblClick', ['$parse', '$mobileClick', function($parse, $mobile) {
  return function(scope, element, attr) {
    var clickHandler = $parse(attr['ngDblClick']);

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element[0].onclick = function(event) {};

    $mobile.gestureOn(element, 'tap').bind('doubletap', function(eventdata) {
      scope.$apply(function() {
        clickHandler(scope, {$event:eventdata, $element: element});
      });
    });
  };
}]);

