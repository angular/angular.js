// Meta data used by the AngularJS docs app
angular.module('versionsData', [])
  .value('NG_VERSION', {$ doc.currentVersion | json $})
  .value('NG_VERSIONS', {$ doc.versions | json $});
