// model tree
panelApp.directive('mtree', function($compile) {
  return {
    restrict: 'E',
    terminal: true,
    scope: {
      val: '=val',
      edit: '=edit',
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
              '<li ng-repeat="(key, item) in val.locals">' +
                '{{key}}' +
                '<input ng-class="{hidden: !item}" ng-model="item" ng-change="edit()()">' +
              '</li>' +
            '</ul>' +
            '<div ng-repeat="child in val.children">' +
              '<mtree val="child" inspect="inspect" edit="edit"></mtree>' +
            '</div>' +
          '</div>' +
        '</div>');

      $compile(element.contents())(scope.$new());
    }
  };
});
