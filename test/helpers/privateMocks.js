'use strict';

function they(msg, vals, spec, specialState) {
  var keyIsValue = isArray(vals);
  forEach(vals, function(val, key) {
    if (keyIsValue) {
      key = val;
    }
    var m = msg.replace('$prop', key);
    var method;
    switch(specialState) {
      case 'focus':
        method = iit;
        break;
      case 'skip':
        method = xit;
        break;
      default:
        method = it;
    }
    method(m, function() {
      spec(val);
    });
  });
}

function tthey(msg, vals, spec) {
  they(msg, vals, spec, 'focus');
}

function xthey(msg, vals, spec) {
  they(msg, vals, spec, 'skip');
}

function createMockStyleSheet(doc, wind) {
  doc = doc ? doc[0] : document;
  wind = wind || window;

  var node = doc.createElement('style');
  var head = doc.getElementsByTagName('head')[0];
  head.appendChild(node);

  var ss = doc.styleSheets[doc.styleSheets.length - 1];

  return {
    addRule: function(selector, styles) {
      try {
        ss.insertRule(selector + '{ ' + styles + '}', 0);
      }
      catch (e) {
        try {
          ss.addRule(selector, styles);
        }
        catch (e2) {}
      }
    },

    destroy: function() {
      head.removeChild(node);
    }
  };
}
