"use strict";

angular.module('versions', [])

.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'NG_VERSIONS', function($scope, $location, $window, NG_VERSIONS) {
  $scope.docs_version  = NG_VERSIONS[0];
  $scope.docs_versions = NG_VERSIONS;

  for (var i = 0, ii = NG_VERSIONS.length, minor = NaN; i < ii; i++) {
    var version = NG_VERSIONS[i];
    // NaN will give false here
    if (minor <= version.minor) {
      continue;
    }
    version.isLatest = true;
    minor = version.minor;
  }

  $scope.getGroupName = getGroupName;
  $scope.groupBy = groupBy;
  $scope.jumpToDocsVersion = jumpToDocsVersion;

  function getGroupName(v) {
    return v.isLatest ? 'Latest' : ('v' + v.major + '.' + v.minor + '.x');
  }

  // TODO(gkalpak): Do we really need this as a "public" function ?
  //                Would a one-time groupping (in JS) be sufficient ?
  function groupBy(items, prop) {
    var groupped = {};
    var getter = angular.isFunction(prop) ? prop : function(item) { return item[prop]; };

    items.forEach(function(item) {
      var groupName = getter(item);
      var groupList = groupped[groupName] = (groupped[groupName] || []);
      groupList.push(item);
    });

    return groupped;
  }

  function jumpToDocsVersion(version) {
    var currentPagePath = $location.path().replace(/\/$/, '');

    // TODO: We need to do some munging of the path for different versions of the API...

    $window.location = version.docsUrl + currentPagePath;
  }
}]);
