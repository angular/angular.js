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
   * @param {string} eventType Optional event type.
   * @param {Array.<string>=} keys Optional list of pressed keys
   *        (valid values: 'alt', 'meta', 'shift', 'ctrl')
   * @param {number} x Optional x-coordinate for mouse/touch events.
   * @param {number} y Optional y-coordinate for mouse/touch events.
   */
  window.browserTrigger = function browserTrigger(element, eventType, keys, x, y) {
    if (element && !element.nodeName) element = element[0];
    if (!element) return;

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
      var evnt = document.createEvent('MouseEvents'),
          originalPreventDefault = evnt.preventDefault,
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

      x = x || 0;
      y = y || 0;
      evnt.initMouseEvent(eventType, true, true, window, 0, x, y, x, y, pressed('ctrl'), pressed('alt'),
          pressed('shift'), pressed('meta'), 0, element);

      element.dispatchEvent(evnt);
      finalProcessDefault = !(angular['ff-684208-preventDefault'] || !fakeProcessDefault);

      delete angular['ff-684208-preventDefault'];

      return finalProcessDefault;
    }
  }
}());
