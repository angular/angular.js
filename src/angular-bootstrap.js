'use strict';

/**
 * @license AngularJS
 * (c) 2010-2011 AngularJS http://angularjs.org
 * License: MIT
 */
(function(window, document) {

  var filename = /^(.*\/)angular-bootstrap.js(#.*)?$/,
      scripts = document.getElementsByTagName("SCRIPT"),
      config,
      serverPath,
      match,
      globalVars = {};

  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(filename);
    if (match) {
      serverPath = match[1];
    }
  }

  function key(prop) {
    return "ng-clobber_" + prop;
  }

  window.angularClobberTest = function(file) {
    var varKey, prop,
        clobbered = [];

    for (prop in window) {
      varKey = key(prop);

      if (prop === 'event') { //skip special variables which keep on changing
        continue;
      }
      else if (!globalVars.hasOwnProperty(varKey)) {
        //console.log('new global variable found: ', prop);
        try {
          globalVars[varKey] = window[prop];
        } catch(e) {} //ignore properties that throw exception when accessed (common in FF)
      } else if (globalVars[varKey] !== window[prop] && !isActuallyNaN(window[prop]) && prop != 'jqLite') {
        clobbered.push(prop);
        console.error("Global variable clobbered by script " + file + "! Variable name: " + prop);
        globalVars[varKey] = window[prop];
      }
    }
    for (varKey in globalVars) {
      prop = varKey.substr(11);
      if (clobbered.indexOf(prop) == -1 &&
          prop != 'event' &&
          prop != 'jqLite' &&
          !isActuallyNaN(globalVars[varKey]) &&
          globalVars[varKey] !== window[prop]) {

        delete globalVars[varKey];
        console.warn("Global variable unexpectedly deleted in script " + file + "! " +
                     "Variable name: " + prop);
      }
    }

    function isActuallyNaN(val) {
      return isNaN(val) && (typeof val === 'number');
    }
  };

  window.addScripts = function(scripts) {
    delete window.addScripts;
    delete window.angularFiles;

    var prop, i;

    // initialize the window property cache
    for (prop in window) {
      try {
        globalVars[key(prop)] = window[prop];
      } catch(e) {} //ignore properties that throw exception when accessed (common in FF)
    }

    // load the js scripts
    for (i in scripts) {
      var file = scripts[i].replace(/src\//, '');
      document.write('<script type="text/javascript" src="' + serverPath + file + '" ' +
                             'onload="angularClobberTest(\'' + file + '\')"></script>');
    }
  }

  function addCss(file) {
    document.write('<link rel="stylesheet" type="text/css" href="' +
                      serverPath + '../css/' + file  + '"/>');
  }

  addCss('angular.css');

  document.write('<script type="text/javascript" src="' + serverPath + '../angularFiles.js' + '" ' +
                 'onload="addScripts(angularFiles.angularSrc)"></script>');

  function onLoadListener() {
    // empty the cache to prevent mem leaks
    globalVars = {};

    bindJQuery();

    angularInit(document, angular.bootstrap);
  }

  if (window.addEventListener) {
    window.addEventListener('load', onLoadListener, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', onLoadListener);
  }

})(window, document);

