var panelApp = angular.module('panelApp', []);

panelApp.directive('tree', function($compile) {
  return {
    restrict: 'E',
    terminal: true,
    scope: {
      val: 'accessor',
      edit: 'accessor',
      inspect: 'accessor'
    },
    link: function (scope, element, attrs) {
      // this is more complicated then it should be
      // see: https://github.com/angular/angular.js/issues/898
      element.append(
        '<div class="scope-branch">' +
          '<a href ng-click="inspect()()">Scope ({{val().id}})</a> | ' +
          '<a href ng-click="showState = !showState">toggle</a>' +
          '<div ng-class="{hidden: showState}">' +
            '<ul>' +
              '<li ng-repeat="(key, item) in val().locals">' +
                '{{key}}' +
                '<input ng-model="item" ng-change="edit()()">' +
              '</li>' +
            '</ul>' +
            '<h3 ng-class="{hidden: val().listeners.length < 1}">Listeners</h3>' +
            '<ul>' +
              '<li ng-repeat="item in val().watchers">' +
                '{{item}}' +
              '</li>' +
            '</ul>' +
            '<div ng-repeat="child in val().children">' +
              '<tree val="child" inspect="inspect()" edit="edit()"></tree>' +
            '</div>' +
          '</div>' +
        '</div>');

      $compile(element.contents())(scope.$new());
    }
  }
});

panelApp.value('chromeExtension', {
  sendRequest: function (requestName, cb) {
    chrome.extension.sendRequest({
      script: requestName,
      tab: chrome.devtools.inspectedWindow.tabId
    }, cb || function () {});
  },

  // evaluates in the context of a window
  //written because I don't like the API for chrome.devtools.inspectedWindow.eval;
  // passing strings instead of functions are gross.
  eval: function (fn, args, cb) {
    // with two args
    if (!cb && typeof args === 'function') {
      cb = args;
      args = {};
    } else if (!args) {
      args = {};
    }
    chrome.devtools.inspectedWindow.eval('(' +
      fn.toString() +
      '(window, ' +
      JSON.stringify(args) +
      '));', cb);
  }
});

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
        "window.$('.ng-scope').each(function (i, elt) {" +
          "var $scope = angular.element(elt).scope();" +
          "if ($scope.$id === args.scopeId) {" +
            "(" +
              args.fn +
            "($scope, elt, args));" +
          "}" +
        "});" +
      "}", args, cb);
    },
    getRoots: function (callback) {
      chromeExtension.eval(function (window) {
        var res = [],
          unique = [];

        window.$('.ng-scope').each(function (i, elt) {
          var $scope = angular.element(elt).scope(),
            id;

          while ($scope.$parent) {
            $scope = $scope.$parent;
          }
          if ($scope === $scope.$root && unique.indexOf($scope.$id) === -1) {
            id = $scope.$id;
            res.push({
              value: id,
              label: id
            });
            unique.push(id);
          }
        });
        return res;
      }, callback);
    },
    getScopeTrees: function (callback) {
      chromeExtension.eval(function (window) {
        var roots = (function () {
          var res = [];

          window.$('.ng-scope').each(function (i, elt) {
            var $scope = angular.element(elt).scope();

            while ($scope.$parent) {
              $scope = $scope.$parent;
            }
            if ($scope === $scope.$root && res.indexOf($scope.$id) === -1) {
              res.push($scope);
            }
          });

          return res;
        }());

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
                  node.locals[i] = '';
                }
              }
            }

            node.id = scope.$id;

            if (window.__ngDebug) {
              node.watch = __ngDebug.watchers[scope.$id];
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
        roots.forEach(function (root) {
          trees[root.$id] = getScopeTree(root);
        });

        return trees;
      },
      callback);
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
    }
  }
});



panelApp.controller('OptionsCtrl', function OptionsCtrl($scope, appContext, chromeExtension) {

  $scope.debugger = {
    scopes: false,
    bindings: false,
    extra: false
  };

  //$scope.$watch('debugger.scope', );

  $scope.$watch('debugger.scopes', function (newVal, oldVal) {
    if (newVal) {
      chromeExtension.sendRequest('showScopes');
    } else {
      chromeExtension.sendRequest('hideScopes');
    }
  });

  $scope.$watch('debugger.bindings', function (newVal, oldVal) {
    if (newVal) {
      chromeExtension.sendRequest('showBindings');
    } else {
      chromeExtension.sendRequest('hideBindings');
    }
  });

  var first = true;

  $scope.$watch('debugger.extra', function (newVal, oldVal) {

    // prevent refresh on initial pageload
    if (first) {
      first = false;
      return;
    }
    appContext.debug(newVal);
  });
});


panelApp.controller('TreeCtrl', function TreeCtrl($scope, chromeExtension, appContext) {

  $scope.inspect = function () {
    var scopeId = this.val().id;

    appContext.executeOnScope(scopeId, function (scope, elt) {
      inspect(elt);
    });
  };

  $scope.edit = function () {
    appContext.executeOnScope(this.val().id, function (scope, elt, args) {
      scope[args.name] = args.value;
      scope.$apply();
    }, {
      name: this.key,
      value: JSON.parse(this.item)
    });
  };

  var updateTree = function () {    
    appContext.getRoots(function (roots) {
      appContext.getScopeTrees(function (result) {
        $scope.$apply(function () {
          $scope.roots = roots;
          $scope.selectedRoot = roots[0].value;
          $scope.trees = result;
        });
      });
    });
  };

  updateTree();

  var port = chrome.extension.connect();
  port.postMessage({
    action: 'register',
    inspectedTabId: chrome.devtools.inspectedWindow.tabId
  });
  port.onMessage.addListener(function(msg) {
    if (msg === 'refresh') {
      updateTree();
    }
  });
  port.onDisconnect.addListener(function (a) {
    console.log(a);
  });
});


