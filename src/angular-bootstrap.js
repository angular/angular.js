/**
 * The MIT License
 *
 * Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window) {

  var filename = /^(.*\/)angular-bootstrap.js(#.*)?$/,
      scripts = document.getElementsByTagName("SCRIPT"),
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

  function addScripts(){
    var prop, i;

    // initialize the window property cache
    for (prop in window) {
      try {
        globalVars[key(prop)] = window[prop];
      } catch(e) {} //ignore properties that throw exception when accessed (common in FF)
    }

    // load the js scripts
    for (i in Array.prototype.slice.call(arguments, 0)) {
      file = arguments[i];
      document.write('<script type="text/javascript" src="' + serverPath + file + '" ' +
                             'onload="angularClobberTest(\'' + file + '\')"></script>');
    }
  }

  function addCss(file) {
    document.write('<link rel="stylesheet" type="text/css" href="' +
                      serverPath + '../css/' + file  + '"/>');
  }

  addCss('angular.css');

  addScripts('Angular.js',
             'JSON.js',
             'Compiler.js',
             'Scope.js',
             'Injector.js',
             'jqLite.js',
             'parser.js',
             'Resource.js',
             'Browser.js',
             'sanitizer.js',
             'AngularPublic.js',

             // Extension points

             'service/cookieStore.js',
             'service/cookies.js',
             'service/defer.js',
             'service/document.js',
             'service/exceptionHandler.js',
             'service/hover.js',
             'service/invalidWidgets.js',
             'service/location.js',
             'service/log.js',
             'service/resource.js',
             'service/route.js',
             'service/updateView.js',
             'service/window.js',
             'service/xhr.bulk.js',
             'service/xhr.cache.js',
             'service/xhr.error.js',
             'service/xhr.js',

             'apis.js',
             'filters.js',
             'formatters.js',
             'validators.js',
             'directives.js',
             'markups.js',
             'widgets.js');


  function onLoadListener(){
    // empty the cache to prevent mem leaks
    globalVars = {};

    var config = angularJsConfig(document);

    // angular-ie-compat.js needs to be pregenerated for development with IE<8
    config.ie_compat = serverPath + '../build/angular-ie-compat.js';

    angularInit(config, document);
  }

  if (window.addEventListener){
    window.addEventListener('load', onLoadListener, false);
  } else if (window.attachEvent){
    window.attachEvent('onload', onLoadListener);
  }

})(window);

