angular.module('components', [])
  .directive('tree', function($compile) {
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
        '<div style="margin-left: 30px; background-color:rgba(0,0,0,0.06);">' +
          '<a href="#" ng-click="inspect()()">Scope ({{val().id}})</a> | ' +
          '<a href="#" ng-click="showState = !showState">toggle</a>' +
          '<div ng-class="{hidden: showState}">' +
            '<ul>' +
              '<li ng-repeat="(key, item) in val().locals">' +
                '{{key}}' +
                '<input ng-model="item" ng-change="edit()()">' +
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

angular.module('panelApp', ['components']).
  value('chromeExtension', {
    sendRequest: function (requestName) {
      chrome.extension.sendRequest({
        script: requestName,
        tab: chrome.devtools.inspectedWindow.tabId
      });
    },

    // evaluates in the context of a window
    //written because I don't like the API for chrome.devtools.inspectedWindow.eval;
    // passing strings instead of functions are gross.
    eval: function (fn, args, cb) {
      // with two args
      if (!cb && typeof args === 'function') {
        cb = args;
      }
      chrome.devtools.inspectedWindow.eval('(' +
        fn.toString() +
        '(window, ' +
        JSON.stringify(args) +
        '));', cb);
    }
  }).
  factory('appContext', function(chromeExtension) {
    return {
      executeOnScope: function(scopeId, fn, args, cb) {
        if (typeof args === 'function') {
          cb = args;
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
              "($scope, elt));" +
            "}" +
          "});" +
        "}", args, cb);
      }
    };
  });



function OptionsCtrl($scope, chromeExtension) {

  $scope.debugger = {
    scopes: false,
    bindings: false
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
}

function TreeCtrl($scope, chromeExtension, appContext) {

  $scope.inspect = function () {
    var scopeId = this.val().id;

    appContext.executeOnScope(scopeId, function (scope, elt) {
      inspect(elt);
    });
  };

  $scope.edit = function () {
    appContext.executeOnScope(this.val().id, function (scope, elt) {
      scope[args.name] = args.value;
      scope.$apply();
    }, {
      name: this.key,
      value: JSON.parse(this.item)
    });
  };

  var getRoots = function (callback) {
    chromeExtension.eval(function (window) {
      var res = [];
      window.$('.ng-scope').each(function (i, elt) {
        var $scope = angular.element(elt).scope();
        if ($scope === $scope.$root) {
          res.push({
            val: $scope.$id,
            label: $scope.$id
          });
        }
      });
      return res;
    }, callback);
  };

  var getScopeTrees = function (callback) {
    chromeExtension.eval(function (window) {
      var roots = (function () {
        var res = [];
        window.$('.ng-scope').each(function (i, elt) {
          var $scope = angular.element(elt).scope();
          if ($scope === $scope.$root) {
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

      var trees = [];
      roots.forEach(function (root) {
        trees.push(getScopeTree(root));
      });

      return trees;
    },
    callback);
  };

  getScopeTrees(function (result) {
    $scope.$apply(function () {
      $scope.trees = result;
    });
  });

}

