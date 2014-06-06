angular.module('versions', [])

.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'NG_VERSIONS', function($scope, $location, $window, NG_VERSIONS) {
  $scope.docs_versions = NG_VERSIONS;
  $scope.docs_version  = NG_VERSIONS[0];

  for (var i = 0; i < NG_VERSIONS.length; i++) {
    if ( NG_VERSIONS[i].isStable ) {
      $scope.docs_stable_version = NG_VERSIONS[i];
      break;
    }
  }

  $scope.getGroupName = function(v) {
    return v.isStable ? 'Stable' : 'Unstable';
  };


  $scope.jumpToDocsVersion = function(version) {
    var currentPagePath = $location.path();

    // TODO: We need to do some munging of the path for different versions of the API...


    $window.location = version.docsUrl + currentPagePath;
  };
}]);