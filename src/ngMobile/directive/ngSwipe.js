'use strict';


// This defines the swipe gesture
ngMobile.config(['$mobileProvider', function($mobile) {
  $mobile.register({
    name: 'swipe',
    index: 40,
    defaults: {
      swipe_max_pointers     : 1,
      swipe_min_velocity     : 0.7,
      // The maximum vertical or horizontal delta for a swipe should be less than 75px.
      swipe_max_orthogonality: 75,
      // Vertical distance should not be more than a fraction of the horizontal distance
      //  and vice versa.
      swipe_xy_ratio         : 0.3,
      // At least a 30px motion is necessary for a swipe.
      swipe_min_distance     : 30,
      // The total distance in any direction before we make the call on swipe vs scroll.
      swipe_move_buffer      : 10
    },
    handler: function swipeGesture(ev, inst) {
      switch (ev.eventType) {
      case $mobile.utils.EVENT_START:
        this.valid = true;
        break;
      case $mobile.utils.EVENT_MOVE:
        if (!this.valid) { return };

        var totalX = Math.abs(ev.deltaX), totalY = Math.abs(ev.deltaY); 

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - send preventDefault() and treat this as a swipe.
        // - or let the browser handle it as a scroll.

        // Check we haven't exceeded our maximum orthogonality
        //  Do this before the buffer check as it prevents default
        //  and we don't want to prevent scrolling for no reason
        if(totalX > totalY) {
          if (totalY > inst.options.swipe_max_orthogonality) {
            this.valid = false;
            return;
          }
        } else {
          if (totalX > inst.options.swipe_max_orthogonality) {
            this.valid = false;
            return;
          }
        }

        // Don't prevent default until we clear the buffer
        if (totalX < inst.options.swipe_move_buffer && totalY < inst.options.swipe_move_buffer) {
          return;
        } else if (inst.handlers[this.name] || inst.handlers[this.name + ev.direction]) {
          // If a handler exists for this direction of swipe then prevent default
          event.preventDefault();
        } else {
          // The swipe is invalid
          this.valid = false;
          return;
        }
        break;
      case $mobile.utils.EVENT_END:
        if (!this.valid) { return };
        this.valid = false;

        var totalX = Math.abs(ev.deltaX), totalY = Math.abs(ev.deltaY);

        // Check the swipe meets the requirements
        if(totalX > totalY) {
          if (!(
            totalY <= inst.options.swipe_max_orthogonality &&
            totalX >  inst.options.swipe_min_distance &&
            totalY / totalX < inst.options.swipe_xy_ratio &&
            ev.velocityX >= inst.options.swipe_min_velocity
          )) { return; }
        } else {
          if (!(
            totalX <= inst.options.swipe_max_orthogonality &&
            totalY >  inst.options.swipe_min_distance &&
            totalX / totalY < inst.options.swipe_xy_ratio &&
            ev.velocityY >= inst.options.swipe_min_velocity
          )) { return; }
        }

        // trigger swipe events
        if(inst.handlers[this.name] || inst.handlers[this.name + ev.direction]) {
          event.stopPropagation();
          inst.trigger(this.name, ev);
          inst.trigger(this.name + ev.direction, ev);
        }
        break;
      }
    }
  });
}]);


/**
 * @ngdoc directive
 * @name ngMobile.directive:ngSwipe
 *
 * @description
 * Specify custom behavior when an element is swiped on a touchscreen device.
 * A swipe is a quick slide of the finger across the screen, either up, down, left or right.
 * Though ngSwipe is designed for touch-based devices, it will work with a mouse click and drag too.
 *
 * @element ANY
 * @param {expression} ngSwipe {@link guide/expression Expression} to evaluate
 * upon swipe. (Event object is available as `$event`)
 *
 * @example
  <doc:example>
    <doc:source>
    <div ng-swipe="showAction = $event.direction">
      Swipe me: {{showAction}}
    </div>
    </doc:source>
  </doc:example>
 */
ngMobile.directive('ngSwipe', ['$parse', '$mobile', function($parse, $mobile) {
  return function(scope, element, attr) {
    var swipeHandler = $parse(attr['ngSwipe']);

    $mobile.gestureOn(element, 'swipe').bind('swipe', function(eventdata) {
      scope.$apply(function() {
          swipeHandler(scope, {$event:eventdata, $element:element});
      });
    });
  };
}]);


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
ngMobile.directive('ngSwipeRight', ['$parse', '$mobile', function($parse, $mobile) {
  return function(scope, element, attr) {
    var swipeHandler = $parse(attr['ngSwipeRight']);

    $mobile.gestureOn(element, 'swipe').bind('swiperight', function(eventdata) {
      scope.$apply(function() {
          swipeHandler(scope, {$event:eventdata, $element:element});
      });
    });
  };
}]);


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
ngMobile.directive('ngSwipeLeft', ['$parse', '$mobile', function($parse, $mobile) {
  return function(scope, element, attr) {
    var swipeHandler = $parse(attr['ngSwipeLeft']);

    $mobile.gestureOn(element, 'swipe').bind('swipeleft', function(eventdata) {
      scope.$apply(function() {
          swipeHandler(scope, {$event:eventdata, $element:element});
      });
    });
  };
}]);


/**
 * @ngdoc directive
 * @name ngMobile.directive:ngSwipeUp
 *
 * @description
 * Specify custom behavior when an element is swiped up on a touchscreen device.
 * An upward swipe is a quick, bottom-to-top slide of the finger.
 * Though ngSwipeUp is designed for touch-based devices, it will work with a mouse click and drag too.
 *
 * @element ANY
 * @param {expression} ngSwipeUp {@link guide/expression Expression} to evaluate
 * upon upward swipe. (Event object is available as `$event`)
 *
 * @example
  <doc:example>
    <doc:source>
    <div ng-show="!showActions" ng-swipe-down="showActions = true">
      Swipe down to see notifications
    </div>
    <div style="height:150px" ng-show="showActions" ng-swipe-up="showActions = false">
      Swipe up to hide this notification
    </div>
    </doc:source>
  </doc:example>
 */
ngMobile.directive('ngSwipeUp', ['$parse', '$mobile', function($parse, $mobile) {
  return function(scope, element, attr) {
    var swipeHandler = $parse(attr['ngSwipeUp']);

    $mobile.gestureOn(element, 'swipe').bind('swipeup', function(eventdata) {
      scope.$apply(function() {
          swipeHandler(scope, {$event:eventdata, $element:element});
      });
    });
  };
}]);


/**
 * @ngdoc directive
 * @name ngMobile.directive:ngSwipeDown
 *
 * @description
 * Specify custom behavior when an element is swiped down on a touchscreen device.
 * A downward swipe is a quick, top-to-bottom slide of the finger.
 * Though ngSwipeDown is designed for touch-based devices, it will work with a mouse click and drag too.
 *
 * @element ANY
 * @param {expression} ngSwipeDown {@link guide/expression Expression} to evaluate
 * upon downward swipe. (Event object is available as `$event`)
 *
 * @example
  <doc:example>
    <doc:source>
    <div ng-show="!showActions" ng-swipe-down="showActions = true">
      Swipe down to see notifications
    </div>
    <div style="height:150px" ng-show="showActions" ng-swipe-up="showActions = false">
      Swipe up to hide this notification
    </div>
    </doc:source>
  </doc:example>
 */
ngMobile.directive('ngSwipeDown', ['$parse', '$mobile', function($parse, $mobile) {
  return function(scope, element, attr) {
    var swipeHandler = $parse(attr['ngSwipeDown']);

    $mobile.gestureOn(element, 'swipe').bind('swipedown', function(eventdata) {
      scope.$apply(function() {
          swipeHandler(scope, {$event:eventdata, $element:element});
      });
    });
  };
}]);