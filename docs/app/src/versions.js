'use strict';

angular.module('versions', [])

.controller('DocsVersionsCtrl', [
  '$scope',
  '$location',
  '$window',
  '$http',
  '$q',
  'NG_VERSIONS', function($scope, $location, $window, $http, $q, NG_VERSIONS) {

  $scope.docs_version  = NG_VERSIONS[0];
  $scope.docs_versions = NG_VERSIONS;

  // If this is not the snapshot version, request the snapshot's versions data
  // to fill the version list with current data
  $q(function(resolve, reject) {
    if ($scope.docs_version.isSnapshot) {
      reject();
    } else {
      resolve();
    }
  }).then(function() {
    return $http.get('../snapshot/versions_data.json');
  }).then(function(response) {
    $scope.docs_versions = response.data;
  }).catch(function() {
    // Ignore error. This either means this is already the snapshot version or that
    // the requested versions-data file could not be found
  }).finally(function() {
    setLatestVersion($scope.docs_versions);
  });

  $scope.getGroupName = function(v) {
    return v.isLatest ? 'Latest' : ('v' + v.major + '.' + v.minor + '.x');
  };

  $scope.jumpToDocsVersion = function(version) {
    var currentPagePath = $location.path().replace(/\/$/, ''),
        url = version.docsUrl;

    //Workaround for an ngOptions quirk that can cause ngChange to be called
    //with the same version
    if (url === window.location + '') {
      return;
    }

    if (!version.isOldDocsUrl) {
      url += currentPagePath;
    }

    $window.location = url;
  };

  function setLatestVersion(ng_versions) {
    for (var i = 0, minor = NaN; i < ng_versions.length; i++) {
      var version = ng_versions[i];
      if (version.isSnapshot) {
        version.isLatest = true;
        continue;
      }
      // NaN will give false here
      if (minor <= version.minor) {
        continue;
      }
      version.isLatest = true;
      minor = version.minor;
    }
  }
}]);
