(function(angular) {
  'use strict';
angular.module('multiSlotTranscludeExample', [])
 .directive('pane', function(){
    return {
      restrict: 'E',
      transclude: {
        'title': '?paneTitle',
        'body': 'paneBody',
        'footer': '?paneFooter'
      },
      template: '<div style="border: 1px solid black;">' +
                  '<div class="title" ng-transclude="title">Fallback Title</div>' +
                  '<div ng-transclude="body"></div>' +
                  '<div class="footer" ng-transclude="footer">Fallback Footer</div>' +
                '</div>'
    };
})
.controller('ExampleController', ['$scope', function($scope) {
  $scope.title = 'Lorem Ipsum';
  $scope.link = "https://google.com";
  $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
}]);
})(window.angular);