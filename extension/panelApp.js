var currTabId;

chrome.extension.sendRequest('getTab', function (tab) {
  currTabId = tab;
});

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
  $scope.tree = ['a','b',['c1','c2',['a2','a3']]];
}

