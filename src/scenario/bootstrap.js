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
  };
  function addCSS(path) {
    document.write('<link rel="stylesheet" type="text/css" href="' + prefix + path + '"/>');
  };
  window.onload = function(){
    if (!_.stepper) {
      _.stepper = function(collection, iterator, done){
        var keys = _.keys(collection);
        function next() {
          if (keys.length) {
            var key = keys.shift();
            iterator(next, collection[key], key);
          } else {
            (done||_.identity)();
          }
        }
        next();
      };
    }
    _.defer(function(){
      new angular.scenario.SuiteRunner(angular.scenarioDef, jQuery(document.body)).run();
    });
    (onLoadDelegate||function(){})();
  };
  addCSS("../../css/angular-scenario.css");
  addScript("../../lib/underscore/underscore.js");
  addScript("../../lib/jquery/jquery-1.4.2.js");
  addScript("../angular-bootstrap.js");
  addScript("_namespace.js");
  addScript("Steps.js");
  addScript("Runner.js");
})(window.onload);

