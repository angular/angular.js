
/*!
 * $script.js Async loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz, Jacob Thornton 2011
 * License: MIT
 */
(function (name, definition, context) {
  if (typeof context['module'] != 'undefined' && context['module']['exports']) context['module']['exports'] = definition()
  else if (typeof context['define'] != 'undefined' && context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , validBase = /^https?:\/\//
    , list = {}, ids = {}, delay = {}, scriptpath
    , scripts = {}, s = 'string', f = false
    , push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState'
    , addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange'

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function(el) {
      return !fn(el)
    })
  }

  if (!doc[readyState] && doc[addEventListener]) {
    doc[addEventListener](domContentLoaded, function fn() {
      doc.removeEventListener(domContentLoaded, fn, f)
      doc[readyState] = 'complete'
    }, f)
    doc[readyState] = 'loading'
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function (path) {
        if (scripts[path]) {
          id && (ids[id] = 1)
          return scripts[path] == 2 && callback()
        }
        scripts[path] = 1
        id && (ids[id] = 1)
        create(!validBase.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script')
      , loaded = f
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = path
    head.insertBefore(el, head.firstChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      if (!scripts.length) $script(s, id, done)
      else $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }
  return $script
}, this);


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
        innerHeight: true, innerWidth: true,
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
        var file = scripts[index++],
            last = index == scripts.length,
            name = last ? 'angular' : file;

        $script(file.replace(/\.js$/, ''), name, function() {
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

