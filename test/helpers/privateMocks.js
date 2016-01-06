'use strict';

/* globals xit */
function assertCompareNodes(a,b,not) {
  a = a[0] ? a[0] : a;
  b = b[0] ? b[0] : b;
  expect(a === b).toBe(!not);
}

function baseThey(msg, vals, spec, itFn) {
  var valsIsArray = angular.isArray(vals);

  angular.forEach(vals, function(val, key) {
    var m = msg.split('$prop').join(angular.toJson(valsIsArray ? val : key));
    itFn(m, function() {
      /* jshint -W040 : ignore possible strict violation due to use of this */
      spec.call(this, val);
    });
  });
}

function they(msg, vals, spec) {
  baseThey(msg, vals, spec, it);
}

function tthey(msg, vals, spec) {
  baseThey(msg, vals, spec, iit);
}

function xthey(msg, vals, spec) {
  baseThey(msg, vals, spec, xit);
}

function browserSupportsCssAnimations() {
  var nav = window.navigator.appVersion;
  if (nav.indexOf('MSIE') >= 0) {
    var version = parseInt(navigator.appVersion.match(/MSIE ([\d.]+)/)[1]);
    return version >= 10; //only IE10+ support keyframes / transitions
  }
  return true;
}

function createMockStyleSheet(doc, prefix) {
  doc = doc ? doc[0] : document;

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

    addPossiblyPrefixedRule: function(selector, styles) {
      if (prefix) {
        var prefixedStyles = styles.split(/\s*;\s*/g).map(function(style) {
          return !style ? '' : prefix + style;
        }).join('; ');

        this.addRule(selector, prefixedStyles);
      }

      this.addRule(selector, styles);
    },

    destroy: function() {
      head.removeChild(node);
    }
  };
}
