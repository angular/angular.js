'use strict';
/* global console */

angular.module('versions', [])

.factory('getVersions', ['$http', '$q', function($http, $q) {

  var VERSION_REGEXP = /^(\d+)\.(\d+)\.(\d+)(?:-(?:(\w+)\.)?(\d+))?/;

  return function() {
    return $q.all([
      // is it bad to use crossorigin??
      $http.get('http://crossorigin.me/https://registry.npmjs.org/angular').then(processAllVersionsResponse),
      $http.get('version.json').then(processCurrentVersionResponse)
    ])
    .then(function(data) {
      return {
        all: data[0],
        current: find(data[0], function(version) { return version.version.full === data[1]; })
      };
    })
    .catch(function(e) {
      console.log('Failed to get the version information...');
      console.log(e.stack);
    });
  };

  function processCurrentVersionResponse(response) {
    return response.data.isSnapshot ? 'snapshot' : response.data.full;
  }

  function processAllVersionsResponse(response) {

    var latestMap = {};

    var versions = Object.keys(response.data.versions)
      .map(function(versionStr) {
          var version = parseVersion(versionStr);
          var key = version.major + '.' + version.minor;
          if (compareVersions(version, latestMap[key]) > 0) {
            latestMap[key] = version;
          }
          return version;
      })
      .filter(function(version) {
        return version && version.major > 0;
      })
      .map(function(version) {
        return makeOption(version);
      })
      .reverse();

    var latest = sortObject(latestMap, reverse(compareVersions)).map(function(version) { return makeOption(version, 'Latest'); });

    return [{version: {full: 'snapshot'}, label: 'master', group: 'Latest'}]
              .concat(latest)
              .concat(versions);
  }

  function parseVersion(versionStr) {
    var match = VERSION_REGEXP.exec(versionStr);
    if (match) {
      return {
        major: parseInt(match[1],10),
        minor: parseInt(match[2],10),
        patch: parseInt(match[3],10),
        prerelease: [match[4], parseInt(match[5], 10)],
        full: versionStr
      };
    }
  }

  function compareVersions(left, right) {
    if (!left) { return -1; }
    if (!right) { return 1; }
    if (left.major !== right.major) { return left.major - right.major; }
    if (left.minor !== right.minor) { return left.minor - right.minor; }
    if (left.patch !== right.patch) { return left.patch - right.patch; }

    // non-prelease trumps prerelease
    if (left.prerelease[0] === undefined && left.prerelease[1] === undefined) { return 1; }
    if (right.prerelease[0] === undefined && right.prerelease[1] === undefined) { return -1; }

    if (left.prerelease[0] !== right.prerelease[0]) { return left.prerelease[0] - right.prerelease[0]; }
    return left.prerelease[1] - right.prerelease[1];
  }

  function makeOption(version, group) {
    return {version: version, label: 'v' + version.full, group: group || 'v' + version.major + '.' + version.minor};
  }

  function reverse(fn) {
    return function(left, right) { return -fn(left, right); };
  }

  function sortObject(obj, cmp) {
    return Object.keys(obj).map(function(key) { return obj[key]; }).sort(cmp);
  }

  function find(collection, matcherFn) {
    for (var i = 0, ii = collection.length; i < ii; ++i) {
      if (matcherFn(collection[i])) {
        return collection[i];
      }
    }
  }
}])


.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'getVersions', function($scope, $location, $window, getVersions) {

  getVersions().then(function(NG_VERSIONS) {
    $scope.version  = NG_VERSIONS;
  });

  $scope.jumpToDocsVersion = function(value) {
    var currentPagePath = $location.path().replace(/\/$/, '');
    var version = value.version;

    var url = 'http://code.angularjs.org/' + version.full + '/docs';

    // Versions before 1.0.2 had a different docs folder name
    if (version.major === 0 || (version.major === 1 && version.minor === 0 && version.patch < 2)) {
      url += '-' + version.version;
    } else {
      url += currentPagePath;
    }

    $window.location = url;
  };
}]);
