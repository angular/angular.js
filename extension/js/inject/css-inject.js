// CSS injection that doesn't violate CSP

var addCssRule = function (selector, rule) {
    var styleSheet = document.styleSheets[document.styleSheets.length - 1];
    styleSheet.insertRule(selector + '{' + rule + '}', styleSheet.cssRules.length);
  },
  removeCssRule = function (selector, rule) {
    var styleSheet = document.styleSheets[document.styleSheets.length - 1];

    var i;
    for (i = styleSheet.cssRules.length - 1; i >= 0; i -= 1) {
      if (styleSheet.cssRules[i].cssText === selector + ' { ' + rule + '; }') {
        styleSheet.deleteRule(i);
      }
    }
  };
