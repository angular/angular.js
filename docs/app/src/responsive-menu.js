angular.
    module('responsiveMenu', ['ngMaterial', 'ViewUtils']).
    directive('responsiveMenu', responsiveMenuDirective);

responsiveMenuDirective.$inject = ['$mdBottomSheet', 'ViewUtils'];
function responsiveMenuDirective($mdBottomSheet, ViewUtils) {
  // TODO: Create showFns for various sizes (not necessarily all)
  var showFns = {
    // 'gt-lg': '',
    // 'lg': '',
    // 'md': '',
    'sm': function showSmFn(items) {
      $mdBottomSheet.show({
        template: _getResponsiveMenuSmTemplate(),
        controller: ['$mdBottomSheet', '$scope',
          function ResponsiveMenuSmController($mdBottomSheet, $scope) {
            $scope.items = items;
            $scope.onItemClick = $mdBottomSheet.hide.bind($mdBottomSheet);
          }
        ]
      });
    }
  };

  var defaultShowFn = showFns.sm;

  return {
    restrict: 'A',
    scope: {
      items: '=rmItems'
    },
    controller: ['$element', '$scope', function ResponsiveMenuController($element, $scope) {
      $element.on('click', onClick.bind(this));

      function onClick(evt) {
        var showFn = ViewUtils.getValueForSize(showFns, defaultShowFn);
        showFn($scope.items);
      }
    }]
  };
}

function _getResponsiveMenuSmTemplate() {
  return [
    '<md-bottom-sheet>',
    '  <md-list>',
    '    <md-item ng-repeat="item in items">',
    '      <md-button aria-label="{{item.label}}" ng-click="onItemClick(item)">',
    '        <a ng-href="{{item.url}}">{{item.label}}</a>',
    '      </md-button>',
    '    </md-item>',
    '  </md-list>',
    '</md-bottom-sheet>',
    ''].join('\n');
}
