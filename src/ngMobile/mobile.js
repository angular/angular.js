'use strict';

/**
 * @ngdoc overview
 * @name ngMobile
 * @description
 */

/*
 * Touch events and other mobile helpers
 * Based on jQuery Mobile touch event handling (jquerymobile.com)
 * and Microsoft PointerDraw http://ie.microsoft.com/testdrive/ieblog/2011/oct/PointerDraw.js.source.html
 */

// define ngMobile module and register $mobile factory
var ngMobile = angular.module('ngMobile', []);

ngMobile.factory('$mobile', ['$timeout', '$rootElement', '$window', function($timeout, $rootElement, $window) {

  // Detects the screen resolution of devices for providing consistent clickbusting regions
  var ptSize,
  getPointSize = function() {
    if (ptSize) return ptSize;

    // create an empty element
    var div = $window.document.createElement("div"),
      body = $window.document.getElementsByTagName("body")[0],
      ppi;

    // give it an absolute size of one inch
    div.style.width="1in";
    // append it to the body
    body.appendChild(div);
    // read the computed width
    ppi = $window.document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
    // remove it again
    body.removeChild(div);

    ptSize = parseFloat(ppi) / 72.0;
    return ptSize;
  },


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


  CLICKBUSTER_THRESHOLD = Math.ceil(getPointSize() * 18),  // 18 points in any dimension is the limit for busting clicks. (apple status bar is 20pts in width)
  PREVENT_DURATION = 2500,  // 2.5 seconds maximum from preventGhostClick call to click
  lastPreventedTime = 0,
  touchCoordinates,

  // Checks if the coordinates are close enough to be within the region.
  hit = function(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  },

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  checkAllowableRegions = function(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i+1], x, y)) {
        touchCoordinates.splice(i, i + 2);
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

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0) or negative coordinates.
    if (x < 1 && y < 1) {
      return; // offscreen
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();
  },

  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  onTouchStart = function(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] == x && touchCoordinates[i+1] == y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  },

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  preventGhostClick = function(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      $rootElement[0].addEventListener('MSPointerDown', onTouchStart, true);
      $rootElement[0].addEventListener('pointerdown', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  },



  // These functions effectively emulate pointer events for mice in desktop browsers
  // that don't support pointer events
  emulatedCapture,    // Stores the element and event handler
  $document = angular.element($window.document),  // We attach the global events here

  // Passes global events to the elements event handler
  captureListener = function(event) {
    emulatedCapture[1](event);
  },

  // Captures mouse events globally to emulate pointer capture
  // Some IE's support this natively however this is standards compliant
  setEmulatedCapture = function(element, eventHandler) {
    try {
      if(emulatedCapture) {
        var event = $window.document.createEvent('MouseEvents');
        event.initMouseEvent('lostpointercapture', true, true, window, 0, 0, 0, 0, 0, false, false,
          false, false, 0, emulatedCapture[0][0]);
        emulatedCapture[1](event);
      } else {
        $document.bind('mousemove mouseup', captureListener);
      }
    } finally {
      emulatedCapture = [element, eventHandler];
    }
  },

  // Stops tracking mouse events for the selected element
  releaseEmulatedCapture = function(element) {
    if (emulatedCapture && emulatedCapture[0] === element) {
      emulatedCapture = undefined;
      $document.unbind('mousemove', captureListener);
      $document.unbind('mouseup', captureListener);
    }
  },

  //
  // A function for ensuring comminality across input types
  //
  pointerEvents = function(scope, element, callbacks) {
    var tracker = {},
      events,
  
      // common event handler for the mouse/pointer/touch models and their down/start, move, up/end, and cancel events
      doEvent = function(event) {
        
        event = event.originalEvent || event;
        var pointerList = (event.changedTouches && event.changedTouches.length) ? event.changedTouches :
                  ((event.touches && event.touches.length) ? event.touches : [event]),
          i;

        for (i = 0; i < pointerList.length; ++i) {  // window.navigator.msPointerEnabled
          var pointerObj = pointerList[i],
            pointerId = (typeof pointerObj.identifier != 'undefined') ? pointerObj.identifier : (typeof pointerObj.pointerId != 'undefined') ? pointerObj.pointerId : 1;
          
          if (event.type.match(/(start|down)$/i)) {
            // clause for processing MSPointerDown, touchstart, and mousedown

            // protect against failing to get an up or end on this pointerId
            if (tracker[pointerId]) {
              try {
                if (callbacks['cancel']) {
                  callbacks['cancel'](pointerId, event);
                } else if (callbacks['up']) {
                  callbacks['up'](pointerId, pointerObj, event);
                }
              } catch(e) {
              } finally {
                delete tracker[pointerId];
                if (this.releasePointerCapture) {
                  this.releasePointerCapture(pointerId);
                } else if (event.type == 'mousedown') {
                  releaseEmulatedCapture(element);
                }
              }
            }
            
            // Track the element the event started on and if we should execute the attached action
            tracker[pointerId] = this;
            
            // in the Microsoft pointer model, set the capture for this pointer
            // nothing is required for the iOS touch model because capture is implied on touchstart
            if (this.pointerEnabled) {
              this.setPointerCapture(pointerId);
              event.preventDefault();  // This prevents mouse emulation events
            } else if (event.type == 'mousedown') {
              setEmulatedCapture(element, doEvent);
            }

            if(callbacks['down']) {
              callbacks['down'](pointerId, pointerObj, event);
            }
            
          } else if (event.type.match(/move$/i)) {
            // clause handles MSPointerMove and touchmove

            if(tracker[pointerId] && callbacks['move']) {
              callbacks['move'](pointerId, pointerObj, event);
            }
            
          
          } else if (tracker[pointerId] && event.type.match(/(up|end|cancel|capture)$/i)) {
            // clause handles up/end/cancel/capture lost

            var target = tracker[pointerId];
            delete tracker[pointerId];      // Delete here so we ignore the lost capture event we trigger

            // in the Microsoft pointer model, release the capture for this pointer
            // in the mouse model, release the capture or remove document-level event handlers if there are no down points
            // nothing is required for the iOS touch model because capture is implied on touchstart
            if (target.releasePointerCapture) {
              target.releasePointerCapture(pointerId);
            } else if (event.type == 'mouseup') {
              releaseEmulatedCapture(element);
            }
            
            
            if (event.type.match(/(cancel|capture)$/i) && callbacks['cancel']) {
              callbacks['cancel'](pointerId, event);        // Cancel the gesture
            } else if (callbacks['up']) {
              callbacks['up'](pointerId, pointerObj, event);    // Apply the click, touch, point event
            }
          }
        }
      };

    if ($window.navigator.pointerEnabled) {
      // Standards based pointer model http://www.w3.org/TR/pointerevents/
      element[0].pointerEnabled = true;
      events = 'pointerdown pointermove pointerup pointercancel lostpointercapture';
      element.bind(events, doEvent);
    } else if ($window.navigator.msPointerEnabled) {
      // Microsoft IE10 pointer model
      var el = element[0];
      el.pointerEnabled = true;
      el.setPointerCapture = el.msSetPointerCapture;
      el.releasePointerCapture = el.msReleasePointerCapture;
      events = 'MSPointerDown MSPointerMove MSPointerUp MSPointerCancel MSLostPointerCapture';
      element.bind(events, doEvent);
    } else {
      // iOS touch model & mouse model
      events = 'touchstart touchmove touchend touchcancel mousedown';
      element.bind(events, doEvent);
    }
    
    
    // Clean up any event handlers on the element
    // and ensure that any emulated captures are removed
    scope.$on('$destroy', function() {
      var evts = events.split(' '), 
        i;

      for (i = 0; i < evts.length; i += 1) {
        element.unbind(evts[i], doEvent);
      }
      
      releaseEmulatedCapture(element);
    });
  };

  
  return {
    getPointerEvents: pointerEvents,
    getPointSize: getPointSize,
    preventGhostClick: preventGhostClick
  };
}]);
