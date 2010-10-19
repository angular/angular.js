(function(previousOnLoad){
  var prefix = (function(){
    var filename = /(.*\/)bootstrap.js(#(.*))?/;
    var scripts = document.getElementsByTagName("script");
    for(var j = 0; j < scripts.length; j++) {
      var src = scripts[j].src;
      if (src && src.match(filename)) {
        var parts = src.match(filename);
        return parts[1];
      }
    }
  })();

  function addScript(path) {
    document.write('<script type="text/javascript" src="' + prefix + path + '"></script>');
  }

  function addCSS(path) {
    document.write('<link rel="stylesheet" type="text/css" href="' + prefix + path + '"/>');
  }

  window.onload = function(){
    try {
      if (previousOnLoad) previousOnLoad();
    } catch(e) {}
    _jQuery(document.body).append(
      '<div id="runner"></div>' +
      '<div id="frame"></div>'
    );
    var frame = _jQuery('#frame');
    var runner = _jQuery('#runner');
    var application = new angular.scenario.Application(frame);
    var ui = new angular.scenario.ui.Html(runner);
    $scenario.run(ui, application, angular.scenario.SpecRunner, function(error) {
      frame.remove();
      if (error) {
        if (window.console) {
          console.log(error.stack || error);
        } else {
          // Do something for IE
          alert(error);
        }
      }
    });
  };

  addCSS("../../css/angular-scenario.css");
  addScript("../../lib/jquery/jquery-1.4.2.js");
  document.write(
      '<script type="text/javascript">' +
      'var _jQuery = jQuery.noConflict(true);' +
      '</script>'
    );
  addScript("../angular-bootstrap.js");

  addScript("Scenario.js");
  addScript("Application.js");
  addScript("Describe.js");
  addScript("Future.js");
  addScript("HtmlUI.js");
  addScript("Runner.js");
  addScript("SpecRunner.js");
  addScript("dsl.js");
  addScript("matchers.js");

  // Create the runner (which also sets up the global API)
  document.write(
    '<script type="text/javascript">' +
    'var $scenario = new angular.scenario.Runner(window);' +
    '</script>'
  );

})(window.onload);
