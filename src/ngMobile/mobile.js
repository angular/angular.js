'use strict';

/**
 * @ngdoc overview
 * @name ngMobile
 * @description
 */

/*
 * Provides a basis for gesture detection where multiple gestures can be
 * applied to an element without clashing and multiple gestures can
 * be active at the same time on different elements.
 *
 * Based on jQuery Mobile touch event handling (jquerymobile.com)
 *   Microsoft PointerDraw http://ie.microsoft.com/testdrive/ieblog/2011/oct/PointerDraw.js.source.html
 *   with substantial portions of code from Hammer.JS http://eightmedia.github.io/hammer.js/
 */

/* Hammer.JS License:
Copyright (C) 2013 by Jorik Tangelder (Eight Media)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


// define ngMobile module and register $mobile service
var ngMobile = angular.module('ngMobile', []);



/**
 * @ngdoc object
 * @name ngMobile.$mobileUtils
 * @requires $window
 *
 * @description
 *   Holds helper functions and constants useful for detecting mobile events
 */
ngMobile.factory('$mobileUtils', ['$window', function($window) {
  return {
    // direction defines
    DIRECTION_DOWN: 'down',
    DIRECTION_LEFT: 'left',
    DIRECTION_UP: 'up',
    DIRECTION_RIGHT: 'right',

    // touch event defines
    EVENT_START: 'start',
    EVENT_MOVE: 'move',
    EVENT_END: 'end',

    HAS_POINTEREVENTS: $window.navigator.pointerEnabled || $window.navigator.msPointerEnabled,
    HAS_TOUCHEVENTS: ('ontouchend' in $window),

    // eventtypes per touchevent (start, move, end)
    // are filled by this.event.determineEventTypes on setup
    EVENT_TYPES: {},


    /**
    * find if a node is in the given parent
    * used for event delegation tricks
    * @param   {HTMLElement}   node
    * @param   {HTMLElement}   parent
    * @returns {boolean}     has_parent
    */
    hasParent: function(node, parent) {
      while(node){
        if(node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },


    /**
    * get the center of all the touches
    * @param   {Array}   touches
    * @returns {Object}  center
    */
    getCenter: function getCenter(touches) {
      var valuesX = [], valuesY = [];

      for(var t= 0,len=touches.length; t<len; t++) {
        valuesX.push(touches[t].pageX);
        valuesY.push(touches[t].pageY);
      }

      return {
        pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
        pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
      };
    },


    /**
    * calculate the velocity between two points
    * @param   {Number}  delta_time
    * @param   {Number}  delta_x
    * @param   {Number}  delta_y
    * @returns {Object}  velocity
    */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
      return {
        x: Math.abs(delta_x / delta_time) || 0,
        y: Math.abs(delta_y / delta_time) || 0
      };
    },


    /**
    * calculate the angle between two coordinates
    * @param   {Touch}   touch1
    * @param   {Touch}   touch2
    * @returns {Number}  angle
    */
    getAngle: function getAngle(touch1, touch2) {
      var y = touch2.pageY - touch1.pageY,
      x = touch2.pageX - touch1.pageX;

      return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
    * angle to direction define
    * @param   {Touch}   touch1
    * @param   {Touch}   touch2
    * @returns {String}  direction constant, like this.DIRECTION_LEFT
    */
    getDirection: function getDirection(touch1, touch2) {
      var x = Math.abs(touch1.pageX - touch2.pageX),
      y = Math.abs(touch1.pageY - touch2.pageY);

      if(x >= y) {
        return touch1.pageX - touch2.pageX > 0 ? this.DIRECTION_LEFT : this.DIRECTION_RIGHT;
      } else {
        return touch1.pageY - touch2.pageY > 0 ? this.DIRECTION_UP : this.DIRECTION_DOWN;
      }
    },


    /**
    * calculate the distance between two touches
    * @param   {Touch}   touch1
    * @param   {Touch}   touch2
    * @returns {Number}  distance
    */
    getDistance: function getDistance(touch1, touch2) {
      var x = touch2.pageX - touch1.pageX,
      y = touch2.pageY - touch1.pageY;
      return Math.sqrt((x*x) + (y*y));
    },


    /**
    * calculate the scale factor between two touchLists (fingers)
    * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
    * @param   {Array}   start
    * @param   {Array}   end
    * @returns {Number}  scale
    */
    getScale: function getScale(start, end) {
      // need two fingers...
      if(start.length >= 2 && end.length >= 2) {
        return this.getDistance(end[0], end[1]) /
        this.getDistance(start[0], start[1]);
      }
      return 1;
    },


    /**
    * calculate the rotation degrees between two touchLists (fingers)
    * @param   {Array}   start
    * @param   {Array}   end
    * @returns {Number}  rotation
    */
    getRotation: function getRotation(start, end) {
      // need two fingers
      if(start.length >= 2 && end.length >= 2) {
        return this.getAngle(end[1], end[0]) -
        this.getAngle(start[1], start[0]);
      }
      return 0;
    },


    /**
    * boolean if the direction is vertical
    * @param  {String}  direction
    * @returns  {Boolean}   is_vertical
    */
    isVertical: function isVertical(direction) {
      return (direction == this.DIRECTION_UP || direction == this.DIRECTION_DOWN);
    },


    /**
    * stop browser default behavior with css props
    * @param   {HtmlElement}   element
    * @param   {Object}    css_props
    */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
      var prop,
        vendors = ['webkit','khtml','moz','ms','o',''];

      if(!css_props || !element.style) {
        return;
      }

      // with css properties for modern browsers
      for(var i = 0; i < vendors.length; i++) {
        for(var p in css_props) {
          if(css_props.hasOwnProperty(p)) {
            prop = p;

            // vender prefix at the property
            if(vendors[i]) {
              prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
            }

            // set the style
            element.style[prop] = css_props[p];
          }
        }
      }

      // also the disable onselectstart
      if(css_props.userSelect == 'none') {
        element.onselectstart = function() {
          return false;
        };

        // NOTE:: Only seems to have any effect on IE8 with jquery
        // Behaves normally for all other browsers, jquery or not.
        element.ondragstart = function() {
          return false;
        };
      }
    }
  };
}]);



/**
 * @ngdoc object
 * @name ngMobile.$mobile
 * @requires $window $document
 *
 * @description
 *   Provides an interface for configuring default gesture settings and
 *   registering for gesture detection within directives. This is achieved
 *   by normalizing browser mouse, touch and pointer events for gesture
 *   detection.
 *   Effectively mimicking touch events with element level isolation.
 */
ngMobile.provider('$mobile', function() {

  this.defaults = {
    set_browser_behaviors: true
  };

  this.default_browser_behavior = {
    // this also triggers onselectstart=false for IE
    userSelect: 'none',
    // this makes the element blocking in IE10 >, you could experiment with the value
    // see for more options this issue; https://github.com/EightMedia/this.js/issues/241
    touchAction: 'none',
    touchCallout: 'none',
    contentZooming: 'none',
    userDrag: 'none',
    tapHighlightColor: 'rgba(0,0,0,0)'
  };


  this.$get = ['$window', '$document', '$mobileUtils', function($window, $document, $mobileUtils) {
    var self = this,     // Curry to provided config
      gestureTypes = {}, // Gestures registered with $mobile
      instanceId = 0,    // id of last instance (for use in associative arrays)

      pointer_allocation = {},  // PointerId => Instances (capture mapping)
      event_pointers = {},      // Instance => Pointers (similar to touches list on iOS)

      /**
       * extend eventData for gestures
       * @param   {Object}   inst
       * @param   {Object}   ev
       * @returns {Object}   ev
       */
      extendEventData = function(inst, ev) {
        var startEv = inst.current.startEvent,
          i = 0, len;

        // if the touches change, set the new touches over the startEvent touches
        // this because touchevents don't have all the touches on touchstart, or the
        // user must place his fingers at the EXACT same time on the screen, which is not realistic
        // but, sometimes it happens that both fingers are touching at the EXACT same time
        if(startEv && (event_pointers[inst].length != startEv.touches.length || ev.touches === startEv.touches)) {
          // extend 1 level deep to get the touchlist with the touch objects
          startEv.touches = [];
          for(len = ev.touches.length; i < len; i++) {
            startEv.touches.push(ev.touches[i]);
          }
        }

        var delta_time = ev.timeStamp - startEv.timeStamp,
          delta_x = ev.center.pageX - startEv.center.pageX,
          delta_y = ev.center.pageY - startEv.center.pageY,
          velocity = $mobileUtils.getVelocity(delta_time, delta_x, delta_y);

        angular.extend(ev, {
          deltaTime   : delta_time,

          deltaX    : delta_x,
          deltaY    : delta_y,

          velocityX   : velocity.x,
          velocityY   : velocity.y,

          distance  : $mobileUtils.getDistance(startEv.center, ev.center),
          angle     : $mobileUtils.getAngle(startEv.center, ev.center),
          direction   : $mobileUtils.getDirection(startEv.center, ev.center),

          scale     : $mobileUtils.getScale(startEv.touches, ev.touches),
          rotation  : $mobileUtils.getRotation(startEv.touches, ev.touches),

          startEvent  : startEv
        });

        return ev;
      },


      /*
       * Delayed pointer release
       */
      releasePointer = function(element, pointerId) {
        $window.setTimeout(function() {
          element.releasePointerCapture(pointerId);
        }, 0);
      },


      /**
       * touch event normalisation
       * @param   {HTMLElement}   element
       * @param   {String}    eventType
       */
      onTouch = function(element, eventType) {
        element.bind($mobileUtils.EVENT_TYPES[eventType], function(event) {
          event = event.originalEvent || event;

          // NOTE:: event.button is for IE8
          if ((event.type.match(/mouse/i) && (event.which || event.button) != 1) ||
            (event.type.match(/pointerdown/i) && event.button != 0)) {
            return; // Ignore right clicks
          }

          var pointerList = (event.changedTouches && event.changedTouches.length) ? event.changedTouches :
              ((event.touches && event.touches.length) ? event.touches : [event]),
            i, pointerObj, instance, instanceList = {};

          // Normalise pointers, mice and touches with pointer lists
          // Effectively emulates touch events with element level isolation
          for (i = 0; i < pointerList.length; ++i) {
            pointerObj = pointerList[i];
            pointerObj.identifier = (typeof pointerObj.identifier != 'undefined') ? 
              pointerObj.identifier : (typeof pointerObj.pointerId != 'undefined') ? pointerObj.pointerId : 1;

            if (eventType === $mobileUtils.EVENT_START) {
              // protect against failing to get an up or end on this pointer
              if (pointer_allocation[pointerObj.identifier]) {
                pointer_allocation[pointerObj.identifier].stopDetect();
              }

              // Grab the gesture state
              instance = element.data('__$mobile.config__');

              // Check if the element can capture another pointer and assign the pointer to that element
              if(instance && instance.enabled && instance.pointers_count < instance.pointers_max) {
                pointer_allocation[pointerObj.identifier] = instance;
                if (instance.pointers_count == 0) {
                  event_pointers[instance] = {};
                }
                event_pointers[instance][pointerObj.identifier] = pointerObj;
                instance.pointers_count = instance.pointers_count + 1;

                // Capture pointer events
                if($mobileUtils.HAS_POINTEREVENTS) {
                  if (!element[0].setPointerCapture) {
                    element[0].setPointerCapture = element[0].msSetPointerCapture;
                    element[0].releasePointerCapture = element[0].msReleasePointerCapture;
                  }
                  element[0].setPointerCapture(pointerObj.identifier);
                }

                // Keep track of gesture instances that these pointers touch
                if(!instanceList[instance]) {
                  instanceList[instance] = [instance];
                }
              } else {
                continue;
              }
            } else if (pointer_allocation[pointerObj.identifier]) {
              // NOTE:: we could attach pointers to elements if a user has missed the target element for the initial touch?
              //  Might make this a configuration option in the future: gobble_pointers?
              instance = pointer_allocation[pointerObj.identifier];
              event_pointers[instance][pointerObj.identifier] = pointerObj;

              // Keep track of gesture instances that these pointers touch
              if(!instanceList[instance]) {
                instanceList[instance] = [instance];
              }

              // Keep track of pointers that are leaving the screen
              if (eventType === $mobileUtils.EVENT_END) {
                instanceList[instance].push(pointerObj.identifier);

                // Release captured pointers
                if($mobileUtils.HAS_POINTEREVENTS) {
                  releasePointer(element[0], pointerObj.identifier);
                }
              }
            } else {
              continue;
            }

            // Check for IE8 to add pageX and pageY
            if(!$window.document.addEventListener) {
              pointerObj.pageX = pointerObj.clientX + $window.document.body.scrollLeft;
              pointerObj.pageY = pointerObj.clientY + $window.document.body.scrollTop;
            }
          }

          // Detect gestures for the 
          for (instance in instanceList) {
            if (instanceList.hasOwnProperty(instance)) {
              detect(event, eventType, instanceList[instance].shift(), instanceList[instance]);
            }
          }
        });
      },


      detect = function(event, eventType, instance, pointersEnding) {
        if(instance.enabled) {
          var touches = [];

          // Get the touches related to this element
          angular.forEach(event_pointers[instance], function(value) {
            this.push(value);
          }, touches);

          // Make this a move event if there are still fingers on the screen
          if (eventType === $mobileUtils.EVENT_END && (pointersEnding.length - instance.pointers_count) > 0) {
            eventType = $mobileUtils.EVENT_MOVE;
          }

          instance.detect({
            center    : $mobileUtils.getCenter(touches),
            timeStamp   : Date.now(),
            target    : event.target,
            touches   : touches,
            eventType   : eventType,
            srcEvent  : event,

            /**
             * prevent the browser default actions
             * mostly used to disable scrolling of the browser
             */
            preventDefault: function() {
              if(this.srcEvent.preventManipulation) {
                this.srcEvent.preventManipulation();
              }

              if(this.srcEvent.preventDefault) {
                this.srcEvent.preventDefault();
              } else {
                this.srcEvent.returnValue = false;  // IE8
              }
            },

            /**
             * stop bubbling the event up to its parents
             */
            stopPropagation: function() {
              if (this.srcEvent.stopPropagation) {
                this.srcEvent.stopPropagation();
              } else {
                this.srcEvent.cancelBubble = true;  // IE8
              }
            },

            /**
             * immediately stop gesture detection
             * might be useful after a swipe was detected
             * @return {*}
             */
            stopDetect: function() {
              return instance.stopDetect();
            }
          });
        }

        // on the end we reset everything
        if(eventType === $mobileUtils.EVENT_END) {
          instance.stopDetect();
        } else {
          // We remove the pointers that are no longer on the screen
          for (var i = 0; i < pointersEnding.length; ++i) {
            delete pointer_allocation[pointersEnding[i]]
            delete event_pointers[instance][pointersEnding[i]]
            instance.pointers_count = instance.pointers_count - 1;
          }
        }
      };

    // determine the eventtype we want to set
    if($mobileUtils.HAS_POINTEREVENTS) {
      // pointerEvents
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_START]  = 'pointerdown MSPointerDown';
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_MOVE]   = 'pointermove MSPointerMove';
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_END]  = 'pointerup pointercancel lostpointercapture MSPointerUp MSPointerCancel MSLostPointerCapture';
    } else {
      // for non pointer events browsers
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_START]  = 'touchstart mousedown';
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_MOVE]   = 'touchmove mousemove';
      $mobileUtils.EVENT_TYPES[$mobileUtils.EVENT_END]  = 'touchend touchcancel mouseup';

      // Add touch events on the document (effectively emulating capture)
      onTouch($document, $mobileUtils.EVENT_MOVE);
      onTouch($document, $mobileUtils.EVENT_END);

      // Fix IE8
      if (!Date.now) {
        Date.now = function() {
          return new Date().valueOf();
        }
      }
    }

    return {
      /**
       * Shortcut to $mobileUtils
       */
      utils: $mobileUtils,

      /**
       * Gesture registration with default setting allocation
       */
      register: function(options) {
        self.defaults = angular.extend(options.defaults || {}, self.defaults || {});  // We don't want to override any user defined defaults

        delete options.defaults;

        gestureTypes[options.name] = options;
      },

      /**
       * Associates a gesure instance to the current object
       */
      gestureOn: function(element, gestures, options) {
        var i, gesture,
          instance = element.data('__$mobile.config__') || {
            id: undefined,
            handlers: {},   // Event callbacks
            registered: {}, // Gesture state data store
            gestures: [],   // Gestures applied to this element

            /**
             * Provide a handler for an event
             * I would have liked to use angulars.bind and triggered real events
             * to simlify creating complex widgets via delegation or for stats etc
             * however I couldn't do this and support IE8 at the same time so I
             * used a similar interface to JQLite for when IE8 support is dropped
             */
            bind: function(event, handler) {
              instance.handlers[event] = instance.handlers[event] || [];
              instance.handlers[event].push(handler);
            },

            /**
             * Remove a handler for an event
             */
            unbind: function(event, handler) {
              if (handler === undefined) {
                delete instance.handlers[event];
              } else {
                angular.arrayRemove(instance.handlers[event], handler);
              }
            },

            toString: function() {
              return instance.id;
            },


            /**
             * gesture detection
             * @param   {Object}  eventData
             * @param   {Object}  eventData
             */
            detect: function(eventData) {
              if(!instance.current) {
                instance.stopped = false;

                instance.current = {
                  inst    : instance,   // reference to instance we're working for
                  startEvent  : angular.extend({}, eventData), // start eventData for distances, timing etc
                  lastEvent   : false,  // last eventData
                  name    : ''          // current gesture we're in/detected, can be 'tap', 'hold' etc
                };
              } else if(instance.stopped) {
                return;
              }

              // extend event data with calculations about scale, distance etc
              eventData = extendEventData(instance, eventData);

              var g = 0, len,
                gesture;

              // call gesture handlers
              for(len = instance.gestures.length; g < len; g++) {
                gesture = instance.gestures[g];

                // only when the instance options have enabled this gesture
                if(!instance.stopped) {
                  // if a handler returns false, we stop with the detection
                  if(gesture.handler.call(instance.registered[gesture.name], eventData, instance) === false) {
                    tracker.stopDetect();
                    break;
                  }
                }
              }

              // store as previous event event
              if(instance.current) {
                instance.current.lastEvent = eventData;
              }

              return eventData;
            },


            /**
             * clear the gesture vars
             * this is called on endDetect, but can also be used when a final gesture has been detected
             * to stop other gestures from being fired
             */
            stopDetect: function() {
              var pointers = event_pointers[instance];
              if (pointers) {
                delete event_pointers[instance];
                angular.forEach(pointers, function(pointer, key) {
                  delete pointer_allocation[key];
                });

                // stopped!
                instance.stopped = true;
                instance.pointers_count = 0;

                // clone current data to the store as the previous gesture
                // used for the double tap gesture, since this is an other gesture detect session
                if (instance.current) {
                  instance.previous = angular.extend({}, instance.current);

                  // reset the current
                  instance.current = null;
                }
              }
            },


            /**
             * trigger gesture event
             * @param   {String}    gesture
             * @param   {Object}    eventData
             */
            trigger: function(gesture, eventData) {
              if(instance.handlers[gesture]) {
                var i, handlers = instance.handlers[gesture];

                for (var i = 0; i < handlers.length; ++i) {
                  handlers[i].call(element, eventData);
                }
              }
            },

            enabled: true,       // Can prevent elements triggering gestures
            previous: undefined, // The previous gesture on this element
            current: undefined,  // Are we currently gesturing

            pointers_count: 0,   // Number of active pointers
            pointers_max: 1,     // The max pointers this element could use to perform a gesture

            options: undefined   // The gesture configuration associated with this element
          };

        if (!instance.id) {
          options = angular.extend(
            angular.copy(self.defaults),  // Clone the defaults
            options || {}        // Merge in any overriding changes
          );

          instanceId = instanceId + 1;
          instance.id = instanceId.toString();

          instance.options = options;
          element.data('__$mobile.config__', instance);

          // add some css to the element to prevent the browser from doing its native behaviour
          if(options.set_browser_behaviors) {
            $mobileUtils.stopDefaultBrowserBehavior(element[0], self.default_browser_behavior);
          }

          // The events are no longer required for the current element
          element.scope().$on('$destroy', function() {
            instance.stopDetect();
            instance.enabled = false;
          });

          // start detection on touchstart
          if($mobileUtils.HAS_POINTEREVENTS) {
            onTouch(element, $mobileUtils.EVENT_START);
            onTouch(element, $mobileUtils.EVENT_MOVE);
            onTouch(element, $mobileUtils.EVENT_END);
          } else {
            onTouch(element, $mobileUtils.EVENT_START);
          }
        } else if (options) {
          // This is not the first call to gestureOn
          angular.extend(instance.options, options);
        }

        // Apply the gesture configuration for the selected gestures
        if (gestures) {
          gestures = gestures.split(' ');
          for (i = 0; i < gestures.length; i += 1) {
            gesture = gestureTypes[gestures[i]];

            // instance.events checks if the gesture has been previously registered
            if (!instance.registered[gesture.name]) {
              // This is a sandbox that the gestures can use for persisted state
              instance.registered[gesture.name] = {name: gesture.name};

              // set its index
              gesture.index = gesture.index || 1000;

              // add gesture to the list
              instance.gestures.push(gesture);

              // sort the list by index
              instance.gestures.sort(function(a, b) {
                if (a.index < b.index) {
                  return -1;
                }
                if (a.index > b.index) {
                  return 1;
                }
                return 0;
              });
            }

            // Provide a function for any additional configuration
            if(gesture.setup) {
              gesture.setup.call(instance.registered[gesture.name], element, instance);
            }

            if((instance.options[gesture.name + '_max_pointers'] || 1) > instance.pointers_max) {
              instance.pointers_max = instance.options[gesture.name + '_max_pointers'] || 1;
            }
          }
        }

        return instance;
      }
    };
  }];
});
