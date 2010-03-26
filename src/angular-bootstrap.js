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
(function(previousOnLoad){
  var filename = /(.*)\/angular-(.*).js(#(.*))?/;
  var scripts = document.getElementsByTagName("SCRIPT");
  var serverPath;
  var config = {};
  for(var j = 0; j < scripts.length; j++) {
    var match = (scripts[j].src || "").match(filename);
    if (match) {
      serverPath = match[1];
      parseConfig(match[4]);
    }
  }

  function parseConfig(args) {
    var keyValues = args.split('&'), keyValue, i = 0;
    for (; i < keyValues.length; i++) {
      keyValue = keyValues[i].split('=');
      config[keyValue[0]] = keyValue[1] || true;
    }
  }

  function addScript(file){
    document.write('<script type="text/javascript" src="' + serverPath + file +'"></script>');
  }

  addScript("/Angular.js");
  addScript("/JSON.js");
  addScript("/Compiler.js");
  addScript("/Scope.js");
  addScript("/jqlite.js");
  addScript("/Parser.js");
  addScript("/Resource.js");
  addScript("/URLWatcher.js");

  // Extension points
  addScript("/apis.js");
  addScript("/filters.js");
  addScript("/formatters.js");
  addScript("/validators.js");
  addScript("/directives.js");
  addScript("/markups.js");
  addScript("/widgets.js");

  if (config.autobind) {
    window.onload = function(){
      try {
        if (previousOnLoad) previousOnLoad();
      } catch(e) {}
      var scope = angular.compile(window.document, config);
      if (config.rootScope) window[config.rootScope] = scope;
      scope.$init();
    };
  }

})(window.onload);

