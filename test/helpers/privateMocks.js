'use strict';

/* globals xit */

function baseThey(msg, vals, spec, itFn) {
  var valsIsArray = angular.isArray(vals);

  angular.forEach(vals, function(val, key) {
    var m = msg.replace(/\$prop/g, angular.toJson(valsIsArray ? val : key));
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
