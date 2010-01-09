// Copyright (C) 2008,2009 BRAT Tech LLC

(function(previousOnLoad){
  var filename = /(.*)\/angular-(.*).js(#(.*))?/;
  var scripts = document.getElementsByTagName("script");
  var scriptConfig = {
      autoSubmit:true,
      autoBind:true,
      autoLoadDependencies:false
  };
  for(var j = 0; j < scripts.length; j++) {
    var src = scripts[j].src;
    if (src && src.match(filename)) {
      var parts = src.match(filename);
      if (parts[2] == 'bootstrap') {
        scriptConfig.autoLoadDependencies = true;
      }
      scriptConfig.server = parts[1] || '';
      if (!scriptConfig.server) {
        scriptConfig.server = window.location.toString().split(window.location.pathname)[0];
      }
      if (parts[4]) {
        var directive = parts[4].split('&');
        for ( var i = 0; i < directive.length; i++) {
          var keyValue = directive[i].split('=');
          var key = keyValue[0];
          var value = keyValue.length == 1 ? true : keyValue[1];
          if (value == 'false') value = false;
          if (value == 'true') value = true;
          scriptConfig[key] = value;
        }
      }
    }
  }

  var addScript = function(path, server){
    server = server || scriptConfig.server;
    document.write('<script type="text/javascript" src="' + server + path +'"></script>');
  };

  if (scriptConfig.autoLoadDependencies) {
    addScript("/../lib/webtoolkit/webtoolkit.base64.js");
    addScript("/../lib/swfobject/swfobject.js");
    addScript("/../lib/jquery/jquery-1.3.2.js");
    addScript("/../lib/jquery/jquery-ui-1.7.1.custom.min.js");
    addScript("/../lib/underscore/underscore.js");
    addScript("/Loader.js");
    addScript("/API.js");
    addScript("/Binder.js");
    addScript("/ControlBar.js");
    addScript("/DataStore.js");
    addScript("/Filters.js");
    addScript("/JSON.js");
    addScript("/Model.js");
    addScript("/Parser.js");
    addScript("/Scope.js");
    addScript("/Server.js");
    addScript("/Users.js");
    addScript("/Validators.js");
    addScript("/Widgets.js");
  } else {
    addScript("/ajax/libs/swfobject/2.2/swfobject.js", "http://ajax.googleapis.com");
    addScript("/ajax/libs/jquery/1.3.2/jquery.min.js", "http://ajax.googleapis.com");
    addScript("/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js", "http://ajax.googleapis.com");
  }

  window.onload = function() {
    var doc = window.document;
    if (scriptConfig.bindRootId) {
      doc = null;
      var ids = scriptConfig.bindRootId.split('|');
      for ( var i = 0; i < ids.length && !doc; i++) {
        var idCond = ids[i].split('?');
        var id = idCond[0];
        if (idCond.length > 1) {
          if (!window.document.getElementById(idCond[1])) {
            continue;
          }
        }
        doc = window.document.getElementById(id);
      }
    }
    if (scriptConfig.autoBind && doc) {
      window.angularScope = angular.compile(doc, scriptConfig);
    }
    if (typeof previousOnLoad === 'function') {
      try {
        previousOnLoad.apply(this, arguments);
      } catch (e) {}
    }
  };
})(window.onload);


