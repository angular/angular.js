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
      spec.call(this, val);
    });
  });
}

function they(msg, vals, spec) {
  baseThey(msg, vals, spec, it);
}

function fthey(msg, vals, spec) {
  baseThey(msg, vals, spec, fit);
}

function xthey(msg, vals, spec) {
  baseThey(msg, vals, spec, xit);
}

function browserSupportsCssAnimations() {
  // Support: IE < 10
  // Only IE10+ support keyframes / transitions
  return !(window.document.documentMode < 10);
}

function createMockStyleSheet(doc) {
  doc = doc ? doc[0] : window.document;

  var node = doc.createElement('style');
  var head = doc.getElementsByTagName('head')[0];
  head.appendChild(node);

  var ss = doc.styleSheets[doc.styleSheets.length - 1];

  return {
    addRule: function(selector, styles) {
      try {
        ss.insertRule(selector + '{ ' + styles + '}', 0);
      } catch (e) {
        try {
          ss.addRule(selector, styles);
        } catch (e2) { /* empty */ }
      }
    },

    addPossiblyPrefixedRule: function(selector, styles) {
      // Support: Android <5, Blackberry Browser 10, default Chrome in Android 4.4.x
      // Mentioned browsers need a -webkit- prefix for transitions & animations.
      var prefixedStyles = styles.split(/\s*;\s*/g)
        .filter(function(style) {
          return style && /^(?:transition|animation)\b/.test(style);
        })
        .map(function(style) {
          return '-webkit-' + style;
        }).join('; ');

      this.addRule(selector, prefixedStyles);

      this.addRule(selector, styles);
    },

    destroy: function() {
      head.removeChild(node);
    }
  };
}
