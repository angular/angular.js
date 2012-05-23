/**
 * @license AngularJS v"NG_VERSION_FULL"
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */

// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
  return window.angular && $0 ? window.angular.element($0).scope() : {};
  //return {};
}

// alias to api
var $panels = chrome.devtools.panels;

//
$panels.elements.createSidebarPane(
  "AngularJS Properties",
  function (sidebar) {
    var selectedElt;

    var updateElementProperties = function () {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }

    updateElementProperties();
    $panels.elements.onSelectionChanged.addListener(updateElementProperties);
  });


// Angular panel
$panels.create(
  "AngularJS",
  "angular_28.png",
  "panel.html",
  function (panel) {});

// forward request to background page
chrome.extension.onRequest.addListener(function (request, sender, callback) {
  chrome.extension.sendRequest(request, function () {});
});
