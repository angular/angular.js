// watchers tree
panelApp.directive('wtree', function($compile) {
  return {
    restrict: 'E',
    terminal: true,
    scope: {
      val: '=val',
      inspect: '=inspect'
    },
    link: function (scope, element, attrs) {
      // this is more complicated then it should be
      // see: https://github.com/angular/angular.js/issues/898
      element.append(
        '<div class="scope-branch">' +
          '<a href ng-click="inspect()">Scope ({{val.id}})</a> | ' +
          '<a href ng-click="showState = !showState">toggle</a>' +
          '<div ng-class="{hidden: showState}">' +
            '<ul>' +
              '<li ng-repeat="item in val.watchers">' +
                '<a href ng-class="{hidden: item.split(\'\n\').length < 2}" ng-click="showState = !showState">toggle</a> ' +
                '<span ng-class="{hidden: showState || item.split(\'\n\').length < 2}">{{item | first}} ...</span>' +
                '<pre ng-class="{hidden: !showState && item.split(\'\n\').length > 1}">' +
                  '{{item}}' +
                '</pre>' +
              '</li>' +
            '</ul>' +
            '<div ng-repeat="child in val.children">' +
              '<wtree val="child" inspect="inspect"></wtree>' +
            '</div>' +
          '</div>' +
        '</div>');

      $compile(element.contents())(scope.$new());
    }
  };
});
