'use strict';

(function(previousOnLoad) {
  var prefix = (function() {
    var filename = /(.*\/)angular-bootstrap.js(#(.*))?/;
    var scripts = window.document.getElementsByTagName('script');
    for (var j = 0; j < scripts.length; j++) {
      var src = scripts[j].src;
      if (src && src.match(filename)) {
        var parts = src.match(filename);
        return parts[1];
      }
    }
  })();

  function addScript(path) {
    window.document.write('<script type="text/javascript" src="' + prefix + path + '"></script>');
  }

  function addCSS(path) {
    window.document.write('<link rel="stylesheet" type="text/css" href="' + prefix + path + '"/>');
  }

  window.onload = function() {
    try {
      if (previousOnLoad) previousOnLoad();
    } catch (e) { /* empty */ }
    angular.scenario.setUpAndRun({});
  };

  addCSS('../../css/angular-scenario.css');
  addScript('../../lib/jquery/jquery.js');
  window.document.write(
    '<script type="text/javascript">' +
    'var _jQuery = jQuery.noConflict(true);' +
    '</script>'
  );
  addScript('../angular-bootstrap.js');

  addScript('Scenario.js');
  addScript('Application.js');
  addScript('Describe.js');
  addScript('Future.js');
  addScript('Runner.js');
  addScript('SpecRunner.js');
  addScript('dsl.js');
  addScript('matchers.js');
  addScript('ObjectModel.js');
  addScript('output/Html.js');
  addScript('output/Json.js');
  addScript('output/Object.js');
  addScript('output/Xml.js');

  // Create the runner (which also sets up the global API)
  window.document.write(
    '<script type="text/javascript">' +
    '  var $runner = new angular.scenario.Runner(window);' +
    '</script>');

})(window.onload);
