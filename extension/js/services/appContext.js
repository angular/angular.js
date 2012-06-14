// Service for doing stuff in the context of the application being debugged
panelApp.factory('appContext', function(chromeExtension) {
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
    getDebugInfo: function (callback) {
      chromeExtension.eval(function (window) {

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

        // Detect whether or not this is an AngularJS app
        if (!window.angular) {
          return false;
        }

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
              if (!(i[0] === '$' /* && i[1] === '$' */) && scope.hasOwnProperty(i) && i !== 'this') {
                //node.locals[i] = scope[i];
                if (typeof scope[i] === 'number' || typeof scope[i] === 'boolean') {
                  node.locals[i] = scope[i];
                } else if (typeof scope[i] === 'string') {
                  node.locals[i] = '"' + scope[i] + '"';
                } else {
                  //node.locals[i] = ': ' + typeof scope[i];
                  node.locals[i] = JSON.stringify(decycle(scope[i]));
                }
              }
            }

            node.id = scope.$id;

            //console.log(window.__ngDebug);
            
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

        return {
          roots: rootIds,
          trees: trees
        };
      },
      callback);
    },

    getTimelineInfo: function (cb) {
      chromeExtension.eval(function (window) {
        return window.__ngDebug.timeline;
      }, cb);
    },

    getHistogramInfo: function (cb) {
      chromeExtension.eval(function (window) {
        return window.__ngDebug.watchExp;
      }, function (info) {
        var out = [];
        for (exp in info) {
          if (info.hasOwnProperty(exp)) {
            out.push({
              name: exp,
              time: info[exp].time,
              calls: info[exp].calls
            });
          }
        }
        cb(out);
      });
    },

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

    // takes a bool
    debug: function (setting) {
      chromeExtension.sendRequest('debug-' + setting, function () {
        chromeExtension.eval(function (window) {
          window.document.location.reload();
        });
      });
    },

    inspect: function (scopeId) {
      appContext.executeOnScope(scopeId, function (scope, elt) {
        inspect(elt);
      });
    },

    // takes a bool
    setLog: function (setting) {
      chromeExtension.eval('function (window) {' +
        'window.__ngDebug.log = ' + setting.toString() + ';' +
      '}');
    },

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
    }
  };
});
