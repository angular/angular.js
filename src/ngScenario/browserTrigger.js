'use strict';

(function() {
  var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);

  function indexOf(array, obj) {
    if (array.indexOf) return array.indexOf(obj);

    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) return i;
    }
    return -1;
  }



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
      return indexOf(keys, key) !== -1;
    }

    if (msie < 9) {
      if (inputType == 'radio' || inputType == 'checkbox') {
          element.checked = !element.checked;
      }

      // WTF!!! Error: Unspecified error.
      // Don't know why, but some elements when detached seem to be in inconsistent state and
      // calling .fireEvent() on them will result in very unhelpful error (Error: Unspecified error)
      // forcing the browser to compute the element position (by reading its CSS)
      // puts the element in consistent state.
      element.style.posLeft;

      // TODO(vojta): create event objects with pressed keys to get it working on IE<9
      var ret = element.fireEvent('on' + eventType);
      if (inputType == 'submit') {
        while(element) {
          if (element.nodeName.toLowerCase() == 'form') {
            element.fireEvent('onsubmit');
            break;
          }
          element = element.parentNode;
        }
      }
      return ret;
    } else {
      var evnt;
      if(/transitionend/.test(eventType)) {
        if(window.WebKitTransitionEvent) {
          evnt = new WebKitTransitionEvent(eventType, eventData);
          evnt.initEvent(eventType, false, true);
        }
        else {
          try {
            evnt = new TransitionEvent(eventType, eventData);
          }
          catch(e) {
            evnt = document.createEvent('TransitionEvent');
            evnt.initTransitionEvent(eventType, null, null, null, eventData.elapsedTime || 0);
          }
        }
      }
      else if(/animationend/.test(eventType)) {
        if(window.WebKitAnimationEvent) {
          evnt = new WebKitAnimationEvent(eventType, eventData);
          evnt.initEvent(eventType, false, true);
        }
        else {
          try {
            evnt = new AnimationEvent(eventType, eventData);
          }
          catch(e) {
            evnt = document.createEvent('AnimationEvent');
            evnt.initAnimationEvent(eventType, null, null, null, eventData.elapsedTime || 0);
          }
        }
      }
      else {
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

      if(!evnt) return;

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
    }
  };
}());
