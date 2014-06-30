'use strict';

function createMockStyleSheet(doc, wind) {
  doc = doc ? doc[0] : document;
  wind = wind || window;

  var node = doc.createElement('style');
  var head = doc.getElementsByTagName('head')[0];
  head.appendChild(node);

  var ss = doc.styleSheets[doc.styleSheets.length - 1];

  return {
    addRule : function(selector, styles) {
      try {
        ss.insertRule(selector + '{ ' + styles + '}', 0);
      }
      catch(e) {
        try {
          ss.addRule(selector, styles);
        }
        catch(e2) {}
      }
    },

    destroy : function() {
      head.removeChild(node);
    }
  };
}
