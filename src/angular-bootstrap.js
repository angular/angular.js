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
  var filename = /(.*)\/angular-(.*).js/;
  var scripts = document.getElementsByTagName("script");
  var serverPath;
  for(var j = 0; j < scripts.length; j++) {
    var match = (scripts[j].src || "").match(filename);
    if (match) {
      serverPath = match[1];
    }
  }

  function addScript(file){
    document.write('<script type="text/javascript" src="' + serverPath + file +'"></script>');
  };

  addScript("/Angular.js");
  addScript("/API.js");
  addScript("/Binder.js");
  addScript("/ControlBar.js");
  addScript("/DataStore.js");
  addScript("/Filters.js");
  addScript("/Formatters.js");
  addScript("/JSON.js");
  addScript("/Model.js");
  addScript("/Parser.js");
  addScript("/Scope.js");
  addScript("/Server.js");
  addScript("/Users.js");
  addScript("/Validators.js");
  addScript("/Widgets.js");
})(window.onload);

