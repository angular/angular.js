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
  var filename = /(.*)\/angular-(.*).js(#(.*))?/,
      scripts = document.getElementsByTagName("SCRIPT"),
      serverPath,
      config,
      match;
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(filename);
    if (match) {
      serverPath = match[1];
      config = match[4];
    }
  }

  function addScript(file){
    document.write('<script type="text/javascript" src="' + serverPath + file +'"></script>');
  }

  addScript("/Angular.js");
  addScript("/JSON.js");
  addScript("/Compiler.js");
  addScript("/Scope.js");
  addScript("/jqLite.js");
  addScript("/Parser.js");
  addScript("/Resource.js");
  addScript("/Browser.js");
  addScript("/AngularPublic.js");

  // Extension points
  addScript("/services.js");
  addScript("/apis.js");
  addScript("/filters.js");
  addScript("/formatters.js");
  addScript("/validators.js");
  addScript("/directives.js");
  addScript("/markups.js");
  addScript("/widgets.js");

  window.onload = function(){
    try {
      if (previousOnLoad) previousOnLoad();
    } catch(e) {}
    angularInit(parseKeyValue(config));
  };

})(window.onload);

