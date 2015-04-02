'use strict';

(function() {
  /**
   * Triggers a browser event. Attempts to choose the right event if one is
   * not specified.
   *
   * @param {Object} element Either a wrapped jQuery/jqLite node or a DOMElement
   * @param {string} eventType Optional event type
   * @param {Object=} eventData An optional object which contains additional event data (such as x,y
   * coordinates, keys, etc...) that are passed into the event when triggered
   */
  window.browserTrigger = function browserTrigger(element, eventType, eventData) {
    if (element && !element.nodeName) element = element[0];
    if (!element) return;

    eventData = eventData || {};
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

    if (nodeName == 'option') {
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
        evnt = new WebKitTransitionEvent(eventType, eventData);
        evnt.initEvent(eventType, false, true);
      } else {
        try {
          evnt = new TransitionEvent(eventType, eventData);
        }
        catch (e) {
          evnt = document.createEvent('TransitionEvent');
          evnt.initTransitionEvent(eventType, null, null, null, eventData.elapsedTime || 0);
        }
      }
    } else if (/animationend/.test(eventType)) {
      if (window.WebKitAnimationEvent) {
        evnt = new WebKitAnimationEvent(eventType, eventData);
        evnt.initEvent(eventType, false, true);
      } else {
        try {
          evnt = new AnimationEvent(eventType, eventData);
        }
        catch (e) {
          evnt = document.createEvent('AnimationEvent');
          evnt.initAnimationEvent(eventType, null, null, null, eventData.elapsedTime || 0);
        }
      }
    } else if (/touch/.test(eventType) && supportsTouchEvents()) {
      evnt = createTouchEvent(element, eventType, x, y);
    } else {
      evnt = document.createEvent('MouseEvents');
      x = x || 0;
      y = y || 0;
      evnt.initMouseEvent(eventType, true, true, window, 0, x, y, x, y, pressed('ctrl'),
          pressed('alt'), pressed('shift'), pressed('meta'), 0, element);
    }

    /* we're unable to change the timeStamp value directly so this
     * is only here to allow for testing where the timeStamp value is
     * read */
    evnt.$manualTimeStamp = eventData.timeStamp;

    if (!evnt) return;

    var originalPreventDefault = evnt.preventDefault,
        appWindow = element.ownerDocument.defaultView,
        fakeProcessDefault = true,
        finalProcessDefault,
        angular = appWindow.angular || {};

    // igor: temporary fix for https://bugzilla.mozilla.org/show_bug.cgi?id=684208
    angular['ff-684208-preventDefault'] = false;
    evnt.preventDefault = function() {
      fakeProcessDefault = false;
      return originalPreventDefault.apply(evnt, arguments);
    };

    element.dispatchEvent(evnt);
    finalProcessDefault = !(angular['ff-684208-preventDefault'] || !fakeProcessDefault);

    delete angular['ff-684208-preventDefault'];

    return finalProcessDefault;
  };

  function supportsTouchEvents() {
    if ('_cached' in supportsTouchEvents) {
      return supportsTouchEvents._cached;
    }
    if (!document.createTouch || !document.createTouchList) {
      supportsTouchEvents._cached = false;
      return false;
    }
    try {
      document.createEvent('TouchEvent');
    } catch (e) {
      supportsTouchEvents._cached = false;
      return false;
    }
    supportsTouchEvents._cached = true;
    return true;
  }

  function createTouchEvent(element, eventType, x, y) {
    var evnt = new Event(eventType);
    x = x || 0;
    y = y || 0;

    var touch = document.createTouch(window, element, Date.now(), x, y, x, y);
    var touches = document.createTouchList(touch);

    evnt.touches = touches;

    return evnt;
  }
}());
