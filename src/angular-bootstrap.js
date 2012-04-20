
/*!
 * $script.js Async loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz, Jacob Thornton 2011
 * License: MIT
 */
(function(a,b){typeof module!="undefined"?module.exports=b():typeof define=="function"&&define.amd?define(a,b):this[a]=b()})("$script",function(){function q(a,b,c){for(c=0,j=a.length;c<j;++c)if(!b(a[c]))return k;return 1}function r(a,b){q(a,function(a){return!b(a)})}function s(a,b,i){function o(a){return a.call?a():d[a]}function p(){if(!--n){d[m]=1,k&&k();for(var a in f)q(a.split("|"),o)&&!r(f[a],o)&&(f[a]=[])}}a=a[l]?a:[a];var j=b&&b.call,k=j?b:i,m=j?a.join(""):b,n=a.length;return setTimeout(function(){r(a,function(a){if(h[a])return m&&(e[m]=1),h[a]==2&&p();h[a]=1,m&&(e[m]=1),t(!c.test(a)&&g?g+a+".js":a,p)})},0),s}function t(c,d){var e=a.createElement("script"),f=k;e.onload=e.onerror=e[p]=function(){if(e[n]&&!/^c|loade/.test(e[n])||f)return;e.onload=e[p]=null,f=1,h[c]=2,d()},e.async=1,e.src=c,b.insertBefore(e,b.firstChild)}var a=document,b=a.getElementsByTagName("head")[0],c=/^https?:\/\//,d={},e={},f={},g,h={},i="string",k=!1,l="push",m="DOMContentLoaded",n="readyState",o="addEventListener",p="onreadystatechange";return!a[n]&&a[o]&&(a[o](m,function u(){a.removeEventListener(m,u,k),a[n]="complete"},k),a[n]="loading"),s.get=t,s.order=function(a,b,c){(function d(e){e=a.shift(),a.length?s(e,d):s(e,b,c)})()},s.path=function(a){g=a},s.ready=function(a,b,c){a=a[l]?a:[a];var e=[];return!r(a,function(a){d[a]||e[l](a)})&&q(a,function(a){return d[a]})?b():!function(a){f[a]=f[a]||[],f[a][l](b),c&&c(e)}(a.join("|")),s},s});

/**
 * @license AngularJS
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, document) {

  var filename = /^(.*\/)angular-bootstrap.js(#.*)?$/,
      scripts = document.getElementsByTagName("SCRIPT"),
      serverPath,
      match,
      globalVars = {},
      IGNORE = {
        onkeyup: true, onkeydown: true, onresize: true,
        event: true, frames: true, external: true,
        sessionStorage: true, clipboardData: true, localStorage: true};

  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(filename);
    if (match) {
      serverPath = match[1];
    }
  }

  document.write('<link rel="stylesheet" type="text/css" href="' + serverPath + '../css/angular.css"/>');

  $script.path(serverPath+'../');
  $script('angularFiles', function() {
    var index = 0,
        scripts = angularFiles.angularSrc;

    try { delete window.angularFiles; } catch(e) { window.angularFiles = undefined; }
    // initialize the window property cache
    for (var prop in window) {
      if (IGNORE[prop] || prop.match(/^moz[A-Z]/)) { //skip special variables which keep on changing
        continue;
      }
      try {
        globalVars[key(prop)] = window[prop];
      } catch(e) {} //ignore properties that throw exception when accessed (common in FF)
    }

    (function next() {
      if (index < scripts.length) {
        var file = scripts[index++];

        $script(file.replace(/\.js$/, ''), function() {
          angularClobberTest(file);
          next();
        });
      } else {
        // empty the cache to prevent mem leaks
        globalVars = {};

        bindJQuery();
        publishExternalAPI(window.angular);

        angularInit(document, angular.bootstrap);
      }
    })();
  });

  function key(prop) {
    return "ng-clobber_" + prop;
  }

  function angularClobberTest(file) {
    var varKey, prop,
        clobbered = {};

    for (prop in window) {
      varKey = key(prop);

      if (IGNORE[prop] || prop.match(/^moz[A-Z]/)) { //skip special variables which keep on changing
        continue;
      } else if (!globalVars.hasOwnProperty(varKey)) {
        //console.log('new global variable found: ', prop);
        try {
          globalVars[varKey] = window[prop];
        } catch(e) {} //ignore properties that throw exception when accessed (common in FF)
      } else if (globalVars[varKey] !== window[prop] && !isActuallyNaN(window[prop]) && prop != 'jqLite') {
        clobbered[prop] = true;
        console.error("Global variable clobbered by script " + file + "! Variable name: " + prop);
        globalVars[varKey] = window[prop];
      }
    }
    for (varKey in globalVars) {
      prop = varKey.substr(11);
      if (prop === 'event' || prop.match(/^moz[A-Z]/)) { //skip special variables which keep on changing
        continue;
      }
      if (!clobbered[prop] &&
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
      return (typeof val === 'number') && isNaN(val);
    }
  };
})(window, document);

