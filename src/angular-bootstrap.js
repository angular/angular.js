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
    addScript("/javascripts/webtoolkit.base64.js");
    addScript("/javascripts/swfobject.js");
    addScript("/javascripts/jQuery/jquery-1.3.2.js");
    addScript("/javascripts/jQuery/jquery-ui-1.7.1.custom.min.js");
    addScript("/javascripts/underscore/underscore.js");
    addScript("/javascripts/nglr/Loader.js");
    addScript("/javascripts/nglr/API.js");
    addScript("/javascripts/nglr/Binder.js");
    addScript("/javascripts/nglr/ControlBar.js");
    addScript("/javascripts/nglr/DataStore.js");
    addScript("/javascripts/nglr/Filters.js");
    addScript("/javascripts/nglr/JSON.js");
    addScript("/javascripts/nglr/Model.js");
    addScript("/javascripts/nglr/Parser.js");
    addScript("/javascripts/nglr/Scope.js");
    addScript("/javascripts/nglr/Server.js");
    addScript("/javascripts/nglr/Users.js");
    addScript("/javascripts/nglr/Validators.js");
    addScript("/javascripts/nglr/Widgets.js");
  } else {
    addScript("/ajax/libs/swfobject/2.2/swfobject.js", "http://ajax.googleapis.com");
    addScript("/ajax/libs/jquery/1.3.2/jquery.min.js", "http://ajax.googleapis.com");
    addScript("/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js", "http://ajax.googleapis.com");
  }

  window.onload = function() {
    window.angular.init = function(root, config){
      var cnfgMerged = _.clone(scriptConfig||{});
      _.extend(cnfgMerged, config);
      new nglr.Loader(root, jQuery("head"), cnfgMerged).load();
    };

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
      window.angular.init(doc);
    }
    if (typeof previousOnLoad === 'function') {
      try {
      previousOnLoad.apply(this, arguments);
      } catch (e) {}
    }
  };
})(window.onload);


