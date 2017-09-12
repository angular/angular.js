'use strict';
/* global console */

angular.module('versions', ['currentVersionData', 'allVersionsData'])

.directive('versionPicker', function() {
  return {
    restrict: 'E',
    scope: true,
    controllerAs: '$ctrl',
    controller: ['$location', '$window', 'CURRENT_NG_VERSION', 'ALL_NG_VERSIONS',
            /** @this VersionPickerController */
            function VersionPickerController($location, $window, CURRENT_NG_VERSION, ALL_NG_VERSIONS) {

      var versionStr = CURRENT_NG_VERSION.isSnapshot ? 'snapshot' : CURRENT_NG_VERSION.version;

      this.versions  = ALL_NG_VERSIONS;
      this.selectedVersion = find(ALL_NG_VERSIONS, function(value) { return value.version.version === versionStr; });

      this.jumpToDocsVersion = function(value) {
        var currentPagePath = $location.path().replace(/\/$/, '');
        $window.location = value.docsUrl + currentPagePath;
      };
    }],
    template:
      '<div class="picker version-picker">' +
      '  <select ng-options="v as v.label group by v.group for v in $ctrl.versions"' +
      '          ng-model="$ctrl.selectedVersion"' +
      '          ng-change="$ctrl.jumpToDocsVersion($ctrl.selectedVersion)"' +
      '          class="docs-version-jump">' +
      '  </select>' +
      '</div>'
  };

  function find(collection, matcherFn) {
    for (var i = 0, ii = collection.length; i < ii; ++i) {
      if (matcherFn(collection[i])) {
        return collection[i];
      }
    }
  }
});
