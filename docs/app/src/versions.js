angular.module('versions', [])

.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'NG_VERSIONS', function($scope, $location, $window, NG_VERSIONS) {
  $scope.docs_versions = NG_VERSIONS;
  $scope.docs_version  = NG_VERSIONS[0];

  $scope.jumpToDocsVersion = function(version) {
    var currentPagePath = $location.path();

    // TODO: We need to do some munging of the path for different versions of the API...
    

    $window.location = version.docsUrl + currentPagePath;
  };
}]);