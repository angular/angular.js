var app = angular.module('panelApp',[]);

angular.module('components', [])
  .filter('ifarray', function() {
    return function(input) {
      return $.isArray(input)?input:[];
    }
  })
  .directive('tree', function($compile) {
    return {
      restrict: 'E',
      terminal: true,
      scope: {val:'evaluate'},
      link: function(scope, element, attrs) {
        if (angular.isArray(scope.val)) {
          // this is more complicated then it should be
          // see: https://github.com/angular/angular.js/issues/898
          element.append('<div>+ <div ng-repeat="item in val"><tree val="item"></tree></div></div>');
        } else {
          element.append('  - {{val}}');
        }
        $compile(element.contents())(scope.$new());
      }
    }
  });

angular.module('panelApp', ['components']);

function OptionsCtrl($scope) {
  var $sendRequest = function (requestName) {
    chrome.extension.sendRequest(requestName, function () {});
  };

  var scopesShown = false;
  $scope.toggleScope = function () {
    if (scopesShown) {
      $sendRequest('hideScopes');
    } else {
      $sendRequest('showScopes');
    }
    scopesShown = !scopesShown;
  };

  var bindingsShown = false;
  $scope.toggleBinding = function () {
    if (bindingsShown) {
      $sendRequest('hideBindings');
    } else {
      $sendRequest('showBindings');
    }
    bindingsShown = !bindingsShown;
  };
}

function TreeCtrl($scope) {
  $scope.tree = ['a','b',['c1','c2',['a2','a3']]];
}