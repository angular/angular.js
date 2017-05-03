// Service for doing stuff in the context of the application being debugged
panelApp.factory('appContext', function(chromeExtension) {

  // Private vars
  // ============

  var _debugCache = {},
    _pollListeners = [],
    _pollInterval = 500;

  // TODO: make this private and have it automatically poll?
  var getDebugData = function (callback) {
    chromeExtension.eval(function (window) {
      // Detect whether or not this is an AngularJS app
      if (!window.angular) {
        return false;
      }

      // cycle.js
      // 2011-08-24
      // https://github.com/douglascrockford/JSON-js/blob/master/cycle.js

      // Make a deep copy of an object or array, assuring that there is at most
      // one instance of each object or array in the resulting structure. The
      // duplicate references (which might be forming cycles) are replaced with
      // an object of the form
      //      {$ref: PATH}
      // where the PATH is a JSONPath string that locates the first occurance.
      var decycle = function decycle(object) {
        var objects = [],   // Keep a reference to each unique object or array
            paths = [];     // Keep the path to each unique object or array

        return (function derez(value, path) {
          var i,          // The loop counter
              name,       // Property name
              nu;         // The new object or array
          switch (typeof value) {
          case 'object':
            if (!value) {
              return null;
            }
            for (i = 0; i < objects.length; i += 1) {
              if (objects[i] === value) {
                return {$ref: paths[i]};
              }
            }
            objects.push(value);
            paths.push(path);
            if (Object.prototype.toString.apply(value) === '[object Array]') {
              nu = [];
              for (i = 0; i < value.length; i += 1) {
                nu[i] = derez(value[i], path + '[' + i + ']');
              }
            } else {
              nu = {};
              for (name in value) {
                if (Object.prototype.hasOwnProperty.call(value, name)) {
                  nu[name] = derez(value[name],
                    path + '[' + JSON.stringify(name) + ']');
                }
              }
            }
            return nu;
          case 'number':
          case 'string':
          case 'boolean':
            return value;
          }
        }(object, '$'));
      };

      var rootIds = [];
      var rootScopes = [];

      var elts = window.document.getElementsByClassName('ng-scope');
      var i;
      for (i = 0; i < elts.length; i++) {
        (function (elt) {
          var $scope = window.angular.element(elt).scope();

          while ($scope.$parent) {
            $scope = $scope.$parent;
          }
          if ($scope === $scope.$root && rootScopes.indexOf($scope) === -1) {
            rootScopes.push($scope);
            rootIds.push($scope.$id);
          }
        }(elts[i]));
      }

      var getScopeTree = function (scope) {
        var tree = {};
        var getScopeNode = function (scope, node) {

          // copy scope's locals
          node.locals = {};

          for (var i in scope) {
            if (i[0] !== '$' && scope.hasOwnProperty(i) && i !== 'this') {
              if (typeof scope[i] === 'number' || typeof scope[i] === 'boolean') {
                node.locals[i] = scope[i];
              } else if (typeof scope[i] === 'string') {
                node.locals[i] = '"' + scope[i] + '"';
              } else {
                node.locals[i] = JSON.stringify(decycle(scope[i]));
              }
            }
          }

          node.id = scope.$id;
          
          if (window.__ngDebug) {
            node.watchers = __ngDebug.watchers[scope.$id];
          }

          // recursively get children scopes
          node.children = [];
          var child;
          if (scope.$$childHead) {
            child = scope.$$childHead;

            do {
              getScopeNode(child, node.children[node.children.length] = {});
            } while (child = child.$$nextSibling);
          }
        };

        getScopeNode(scope, tree);
        return tree;
      };

      var trees = {};
      rootScopes.forEach(function (root) {
        trees[root.$id] = getScopeTree(root);
      });

      // get histogram data
      var histogram = [],
        timeline;

      // performance
      if (window.__ngDebug) {
        (function (info) {
          for (exp in info) {
            if (info.hasOwnProperty(exp)) {
              histogram.push({
                name: exp,
                time: info[exp].time,
                calls: info[exp].calls
              });
            }
          }
        }(window.__ngDebug.watchExp));

        timeline = __ngDebug.timeline;
      }

      return {
        roots: rootIds,
        trees: trees,
        histogram: histogram,
        timeline: timeline
      };
    },
    function (data) {
      _debugCache = data;
      _pollListeners.forEach(function (fn) {
        fn();
      });

      // poll every 500 ms
      setTimeout(getDebugData, _pollInterval);
    });
  };
  getDebugData();


  // Public API
  // ==========
  return {
    executeOnScope: function(scopeId, fn, args, cb) {
      if (typeof args === 'function') {
        cb = args;
        args = {};
      } else if (!args) {
        args = {};
      }
      args.scopeId = scopeId;
      args.fn = fn.toString();

      chromeExtension.eval("function (window, args) {" +
        "var elts = window.document.getElementsByClassName('ng-scope'), i;" +
        "for (i = 0; i < elts.length; i++) {" +
          "(function (elt) {" +
            "var $scope = window.angular.element(elt).scope();" +
            "if ($scope.$id === args.scopeId) {" +
              "(" + args.fn + "($scope, elt, args));" +
            "}" +
          "}(elts[i]));" +
        "}" +
      "}", args, cb);
    },

    // Getters
    // -------

    getTimeline: function () {
      return _debugCache.timeline;
    },

    getHistogram: function () {
      return _debugCache.histogram;
    },

    getListOfRoots: function () {
      return _debugCache.roots;
    },

    getModelTrees: function () {
      return _debugCache.trees;
    },

    // Actions
    // -------

    clearTimeline: function (cb) {
      chromeExtension.eval(function (window) {
        window.__ngDebug.timeline = [];
      }, cb);
    },
    
    clearHistogram: function (cb) {
      chromeExtension.eval(function (window) {
        window.__ngDebug.watchExp = {};
      }, cb);
    },
    
    refresh: function (cb) {
      chromeExtension.eval(function (window) {
        window.document.location.reload();
      }, cb);
    },

    inspect: function (scopeId) {
      this.executeOnScope(scopeId, function (scope, elt) {
        inspect(elt);
      });
    },

    // Settings
    // --------

    // takes a bool
    setDebug: function (setting) {
      if (setting) {
        chromeExtension.eval(function (window) {
          window.document.cookie = '__ngDebug=true;'
          window.document.location.reload();
        });
      } else {
        chromeExtension.eval(function (window) {
          window.document.cookie = '__ngDebug=false;'
          window.document.location.reload();
        });
      }
    },

    // takes a bool
    setLog: function (setting) {
      chromeExtension.eval('function (window) {' +
        'window.__ngDebug.log = ' + setting.toString() + ';' +
      '}');
    },

    // takes # of miliseconds
    setPollInterval: function (setting) {
      _pollInterval = setting;
    },

    // Registering events
    // ------------------

    // TODO: depreciate this; only poll from now on?
    // TODO: move to chromeExtension?
    watchRefresh: function (cb) {
      var port = chrome.extension.connect();
      port.postMessage({
        action: 'register',
        inspectedTabId: chrome.devtools.inspectedWindow.tabId
      });
      port.onMessage.addListener(function(msg) {
        if (msg === 'refresh') {
          cb();
        }
      });
      port.onDisconnect.addListener(function (a) {
        console.log(a);
      });
    },

    watchPoll: function (fn) {
      _pollListeners.push(fn);
    }

  };
});
