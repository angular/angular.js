var currTabId = chrome.devtools.inspectedWindow.tabId;

var app = angular.module('panelApp',[]);

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

angular.module('panelApp', ['components']);

function OptionsCtrl($scope) {
  var $sendRequest = function (requestName) {
    chrome.extension.sendRequest({
      script: requestName,
      tab: currTabId
    });
  };

  $scope.debugger = {
    scopes: false,
    bindings: false
  };

  //$scope.$watch('debugger.scope', );

  $scope.$watch('debugger.scopes', function (newVal, oldVal) {
    if (newVal) {
      $sendRequest('showScopes');
    } else {
      $sendRequest('hideScopes');
    }
  });

  $scope.$watch('debugger.bindings', function (newVal, oldVal) {
    if (newVal) {
      $sendRequest('showBindings');
    } else {
      $sendRequest('hideBindings');
    }
  });
}

function TreeCtrl($scope) {

  // evaluates in the context of a window
  //written because I don't like the API for chrome.devtools.inspectedWindow.eval;
  // passing strings instead of functions are gross.
  var _eval = function (fn, args, cb) {

    // with two args
    if (!cb && typeof args === 'function') {
      cb = args;
    }

    chrome.devtools.inspectedWindow.eval('(' +
      fn.toString() +
      '(window, ' +
      JSON.stringify(args) +
      '))', cb);
  };


  $scope.inspect = function () {
    var scopeId = this.val().id;
    
    _eval(function (window, scopeId) {
      $('.ng-scope').each(function (i, elt) {
        var $scope = angular.element(elt).scope();
        if ($scope.$id === scopeId) {
          inspect(elt);
        }
      });
    }, scopeId);

  };

  $scope.edit = function () {
    _eval(function (window, args) {
        $('.ng-scope').each(function (i, elt) {
          var $scope = angular.element(elt).scope();
          if ($scope.$id === args.scopeId) {
            $scope[args.name] = args.value;
            $scope.$apply();
          }
        });
      }, {
        scopeId: this.val().id,
        name: this.key,
        value: JSON.parse(this.item)
      });
  };

  var getRoots = function (callback) {
    _eval(function (window) {
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

  var getScopeTree = function (callback) {
    _eval(function (window) {
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

      // TODO: check all root scopes
      getScopeNode(roots[roots.length - 1], tree);

      // exposed to debug console
      //window.$roots = tree;
      //window.$tree = tree;

      // TODO: return a single array of all roots
      return tree;
    },
    callback);
  };

  /*
  getRoots(function (result) {
    $scope.$apply(function () {
      $scope.roots = result;
      $scope.selectedScope = result[0].val;
    });
  });
  */

  getScopeTree(function (result) {
    $scope.$apply(function () {
      $scope.tree = result;
    });
  });

  /*
  $scope.changeSelectedScope = function () {

  };
  */
}

