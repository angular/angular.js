'use strict';


/**
 * @ngdoc service
 * @name ngMobile.service:$mobileHold
 *
 * @description
 * An alias for $mobile that ensures hold detection functionality is available.
 *  Adds bindings for `hold` to $mobile
 */
ngMobile.factory('$mobileHold', ['$window', '$timeout', '$mobile', function($window, $timeout, $mobile) {
  $mobile.register({
    name: 'hold',
    index: 10,
    defaults: {
      hold_max_pointers    : 1,
      hold_duration        : 751,    // 750ms, or less, is a tap
      hold_move_tolerance  : 10,     // Doesn't overlap with drags move tolerance and is equal to click
      hold_or_right_click  : true    // Allow users with mice to right click instead of holding
    },
    setup: function(el, inst) {
      // Use the setup function to bind to clicks
      // right clicks are ignored by $mobile
      if(inst.options.hold_or_right_click) {
        if($window.document.addEventListener) {
          el.bind('click contextmenu', function(event){
            event = event.originalEvent || event;
            // mouse events use which, pointer events use button
            if(event.which == 3 || event.button == 2) {
              inst.trigger('hold', event);
              event.preventDefault(); // Prevent the context menu
            }
          });
        } else {  // IE 8 or lower
          var button, allow_event = false;
          el.bind('mouseup', function(event) {  // IE doesn't have button values on mouse up
            event = event.originalEvent || event;
            button = event.button;
            allow_event = $window.setTimeout(function() {
              allow_event = false;
            }, 0);
          });
          el.bind('click contextmenu', function(event) {    // Check the last button value
            event = event.originalEvent || event;
            if(button == 2 && allow_event != false) {
              $window.clearTimeout(allow_event);   // make sure only one right click is approved
              allow_event = false;
              
              inst.trigger('hold', event);
              event.returnValue = false;      // Prevent the context menu
            }
          });
        }
      }
    },
    handler: function(ev, inst) {
      var self = this;

      switch(ev.eventType) {
      case $mobile.utils.EVENT_START:
        if (ev.touches.length <= inst.options.hold_max_pointers) {
          self.valid = $timeout(function() {
            inst.current.name = self.name;    // Set the event and trigger if
            inst.trigger(self.name, ev);      // we have been holding long
            self.valid = false;               // enough
          }, inst.options.hold_duration, true);
        }
        break;
      case $mobile.utils.EVENT_MOVE:
        if (self.valid && (ev.distance > inst.options.hold_move_tolerance ||
            ev.touches.length <= inst.options.hold_max_pointers)) {
          $timeout.cancel(self.valid);
          self.valid = false;           // Invalidate if we exceed tolerances
        }
        break;
      case $mobile.utils.EVENT_END:
        if (self.valid) {
          $timeout.cancel(self.valid);  // If the event ends before the hold is
          self.valid = false;           // triggered then we cancel
        }
        break;
      }
    }
  });

  return $mobile;
}]);


/**
 * @ngdoc directive
 * @name ngMobile.directive:ngHold
 *
 * @description
 * Specify custom behavior when element is held for a period of time or right clicked.
 * A hold is an extended touch without much motion.
 *
 * @element ANY
 * @param {expression} ngHold {@link guide/expression Expression} to evaluate upon
 * extended touch. (Event object is available as `$event`, Angular Element as '$element')
 *
 * @example
    <doc:example>
      <doc:source>
        <button ng-hold="held = held + 1" ng-init="held=0">
          Hold or right click to increment
        </button>
        Was Held: {{ held }}
      </doc:source>
    </doc:example>
 */
ngMobile.directive('ngHold', ['$parse', '$mobileHold', function($parse, $mobile) {
  return function(scope, element, attr) {
    var holdHandler = $parse(attr['ngHold']),
        options = {};

    // Do we want right clicking to count as a hold?
    //  Useful if hold triggers a context menu.
    //  Not useful if hold enables dragging which can occur on the same touch.
    //    (Think organising iOS icons)
    if (attr['acceptRightClick'] == 'false') {
      options.hold_or_right_click = false;
    }

    $mobile.gestureOn(element, 'hold', options).bind('hold', function(eventdata) {
      scope.$apply(function() {
        holdHandler(scope, {$event: eventdata, $element: element});
      });
    });
  };
}]);

