'use strict';

(function() {
  /**
   * @ngdoc function
   * @name browserTrigger
   * @description
   *
   * This is a global (window) function that is only available when the {@link ngMock} module is
   * included.
   *
   * It can be used to trigger a native browser event on an element, which is useful for unit testing.
   *
   *
   * @param {Object} element Either a wrapped jQuery/jqLite node or a DOMElement
   * @param {string=} eventType Optional event type. If none is specified, the function tries
   *                            to determine the right event type for the element, e.g. `change` for
   *                            `input[text]`.
   * @param {Object=} eventData An optional object which contains additional event data that is used
   *                            when creating the event:
   *
   *  - `bubbles`: [Event.bubbles](https://developer.mozilla.org/docs/Web/API/Event/bubbles).
   *    Not applicable to all events.
   *
   *  - `cancelable`: [Event.cancelable](https://developer.mozilla.org/docs/Web/API/Event/cancelable).
   *    Not applicable to all events.
   *
   *  - `charcode`: [charCode](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/charcode)
   *    for keyboard events (keydown, keypress, and keyup).
   *
   *  - `elapsedTime`: the elapsedTime for
   *    [TransitionEvent](https://developer.mozilla.org/docs/Web/API/TransitionEvent)
   *    and [AnimationEvent](https://developer.mozilla.org/docs/Web/API/AnimationEvent).
   *
   *  - `keycode`: [keyCode](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/keycode)
   *    for keyboard events (keydown, keypress, and keyup).
   *
   *  - `keys`: an array of possible modifier keys (ctrl, alt, shift, meta) for
   *    [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) and
   *    keyboard events (keydown, keypress, and keyup).
   *
   *  - `relatedTarget`: the
   *    [relatedTarget](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)
   *    for [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent).
   *
   *  - `which`: [which](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/which)
   *    for keyboard events (keydown, keypress, and keyup).
   *
   *  - `x`: x-coordinates for [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent)
   *    and [TouchEvent](https://developer.mozilla.org/docs/Web/API/TouchEvent).
   *
   *  - `y`: y-coordinates for [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent)
   *    and [TouchEvent](https://developer.mozilla.org/docs/Web/API/TouchEvent).
   *
   */
  window.browserTrigger = function browserTrigger(element, eventType, eventData) {
    if (element && !element.nodeName) element = element[0];
    if (!element) return;

    eventData = eventData || {};
    var relatedTarget = eventData.relatedTarget || element;
    var keys = eventData.keys;
    var x = eventData.x;
    var y = eventData.y;

    var inputType = (element.type) ? element.type.toLowerCase() : null,
        nodeName = element.nodeName.toLowerCase();
    if (!eventType) {
      eventType = {
        'text':            'change',
        'textarea':        'change',
        'hidden':          'change',
        'password':        'change',
        'button':          'click',
        'submit':          'click',
        'reset':           'click',
        'image':           'click',
        'checkbox':        'click',
        'radio':           'click',
        'select-one':      'change',
        'select-multiple': 'change',
        '_default_':       'click'
      }[inputType || '_default_'];
    }

    if (nodeName === 'option') {
      element.parentNode.value = element.value;
      element = element.parentNode;
      eventType = 'change';
    }

    keys = keys || [];
    function pressed(key) {
      return keys.indexOf(key) !== -1;
    }

    var evnt;
    if (/transitionend/.test(eventType)) {
      if (window.WebKitTransitionEvent) {
        evnt = new window.WebKitTransitionEvent(eventType, eventData);
        evnt.initEvent(eventType, eventData.bubbles, true);
      } else {
        try {
          evnt = new window.TransitionEvent(eventType, eventData);
        } catch (e) {
          evnt = window.document.createEvent('TransitionEvent');
          evnt.initTransitionEvent(eventType, eventData.bubbles, null, null, eventData.elapsedTime || 0);
        }
      }
    } else if (/animationend/.test(eventType)) {
      if (window.WebKitAnimationEvent) {
        evnt = new window.WebKitAnimationEvent(eventType, eventData);
        evnt.initEvent(eventType, eventData.bubbles, true);
      } else {
        try {
          evnt = new window.AnimationEvent(eventType, eventData);
        } catch (e) {
          evnt = window.document.createEvent('AnimationEvent');
          evnt.initAnimationEvent(eventType, eventData.bubbles, null, null, eventData.elapsedTime || 0);
        }
      }
    } else if (/touch/.test(eventType) && supportsTouchEvents()) {
      evnt = createTouchEvent(element, eventType, x, y);
    } else if (/key/.test(eventType)) {
      evnt = window.document.createEvent('Events');
      evnt.initEvent(eventType, eventData.bubbles, eventData.cancelable);
      evnt.view = window;
      evnt.ctrlKey = pressed('ctrl');
      evnt.altKey = pressed('alt');
      evnt.shiftKey = pressed('shift');
      evnt.metaKey = pressed('meta');
      evnt.keyCode = eventData.keyCode;
      evnt.charCode = eventData.charCode;
      evnt.which = eventData.which;
    } else if (/composition/.test(eventType)) {
      try {
        evnt = new window.CompositionEvent(eventType, {
          data: eventData.data
        });
      } catch (e) {
        // Support: IE9+
        evnt = window.document.createEvent('CompositionEvent', {});
        evnt.initCompositionEvent(
          eventType,
          eventData.bubbles,
          eventData.cancelable,
          window,
          eventData.data,
          null
        );
      }

    } else {
      evnt = window.document.createEvent('MouseEvents');
      x = x || 0;
      y = y || 0;
      evnt.initMouseEvent(eventType, true, true, window, 0, x, y, x, y, pressed('ctrl'),
          pressed('alt'), pressed('shift'), pressed('meta'), 0, relatedTarget);
    }

    /* we're unable to change the timeStamp value directly so this
     * is only here to allow for testing where the timeStamp value is
     * read */
    evnt.$manualTimeStamp = eventData.timeStamp;

    if (!evnt) return;

    if (!eventData.bubbles || supportsEventBubblingInDetachedTree() || isAttachedToDocument(element)) {
      return element.dispatchEvent(evnt);
    } else {
      triggerForPath(element, evnt);
    }
  };

  function supportsTouchEvents() {
    if ('_cached' in supportsTouchEvents) {
      return supportsTouchEvents._cached;
    }
    if (!window.document.createTouch || !window.document.createTouchList) {
      supportsTouchEvents._cached = false;
      return false;
    }
    try {
      window.document.createEvent('TouchEvent');
    } catch (e) {
      supportsTouchEvents._cached = false;
      return false;
    }
    supportsTouchEvents._cached = true;
    return true;
  }

  function createTouchEvent(element, eventType, x, y) {
    var evnt = new window.Event(eventType);
    x = x || 0;
    y = y || 0;

    var touch = window.document.createTouch(window, element, Date.now(), x, y, x, y);
    var touches = window.document.createTouchList(touch);

    evnt.touches = touches;

    return evnt;
  }

  function supportsEventBubblingInDetachedTree() {
    if ('_cached' in supportsEventBubblingInDetachedTree) {
      return supportsEventBubblingInDetachedTree._cached;
    }
    supportsEventBubblingInDetachedTree._cached = false;
    var doc = window.document;
    if (doc) {
      var parent = doc.createElement('div'),
          child = parent.cloneNode();
      parent.appendChild(child);
      parent.addEventListener('e', function() {
        supportsEventBubblingInDetachedTree._cached = true;
      });
      var evnt = window.document.createEvent('Events');
      evnt.initEvent('e', true, true);
      child.dispatchEvent(evnt);
    }
    return supportsEventBubblingInDetachedTree._cached;
  }

  function triggerForPath(element, evnt) {
    var stop = false;

    var _stopPropagation = evnt.stopPropagation;
    evnt.stopPropagation = function() {
      stop = true;
      _stopPropagation.apply(evnt, arguments);
    };
    patchEventTargetForBubbling(evnt, element);
    do {
      element.dispatchEvent(evnt);
      // eslint-disable-next-line no-unmodified-loop-condition
    } while (!stop && (element = element.parentNode));
  }

  function patchEventTargetForBubbling(event, target) {
    event._target = target;
    Object.defineProperty(event, 'target', {get: function() { return this._target;}});
  }

  function isAttachedToDocument(element) {
    while ((element = element.parentNode)) {
        if (element === window) {
            return true;
        }
    }
    return false;
  }
})();
