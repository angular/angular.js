
// The function below is executed in the context of the inspected page.

var page_getProperties = function () {
  if (window.angular && $0) {
    var scope = window.angular.element($0).scope();
    window.$scope = scope;
    return (function (scope) {
      var ret = {
        __private__: {}
      };

      for (prop in scope) {
        if (scope.hasOwnProperty(prop)) {
          if (prop[0] === '$' && prop[1] === '$') {
            ret.__private__[prop] = scope[prop];
          } else {
            ret[prop] = scope[prop];
          }
        }
      }
      return ret;
    }(scope));
  } else {
    return {};
  }
};

chrome.
  devtools.
  panels.
  elements.
  createSidebarPane(
    "AngularJS Properties",
    function (sidebar) {
      var selectedElt;

      var updateElementProperties = function () {
        sidebar.setExpression("(" + page_getProperties.toString() + ")()");
      }

      updateElementProperties();
      chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });

// Angular panel
var angularPanel = chrome.
  devtools.
  panels.
  create(
    "AngularJS",
    "img/angular.png",
    "panel.html");
