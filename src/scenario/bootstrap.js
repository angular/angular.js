(function(onLoadDelegate){
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
    _.defer(function(){
      $scenarioRunner.run(jQuery(window.document.body));
    });
    (onLoadDelegate||function(){})();
  };
  addCSS("../../css/angular-scenario.css");
  addScript("../../lib/underscore/underscore.js");
  addScript("../../lib/jquery/jquery-1.4.2.js");
  addScript("../angular-bootstrap.js");
  addScript("Runner.js");
  document.write('<script type="text/javascript">' +
    '$scenarioRunner = new angular.scenario.Runner(window, jQuery);' +
    '</script>');
})(window.onload);

