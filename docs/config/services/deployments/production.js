'use strict';

var versionInfo = require('../../../../lib/versions/version-info');

var googleCdnUrl = '//ajax.googleapis.com/ajax/libs/angularjs/';
var angularCodeUrl = '//code.angularjs.org/';

var cdnUrl = googleCdnUrl + versionInfo.cdnVersion;

// The plnkr examples must use the code.angularjs.org repo for the snapshot,
// and the cdn for the tagged version and, if the build is not tagged, the currentVersion.
//
// The currentVersion may not be available on the cdn (e.g. if built locally, or hasn't been pushed
// yet). This will lead to a 404, but this is preferable to loading a version with which the example
// might not work (possibly in subtle ways).
var examplesCdnUrl = versionInfo.currentVersion.isSnapshot ?
  (angularCodeUrl + 'snapshot') :
  (googleCdnUrl + (versionInfo.currentVersion.version || versionInfo.currentVersion));

module.exports = function productionDeployment(getVersion) {
  return {
    name: 'production',
    examples: {
      commonFiles: {
        scripts: [examplesCdnUrl + '/angular.min.js']
      },
      dependencyPath: examplesCdnUrl + '/'
    },
    scripts: [
      cdnUrl + '/angular.min.js',
      cdnUrl + '/angular-resource.min.js',
      cdnUrl + '/angular-route.min.js',
      cdnUrl + '/angular-cookies.min.js',
      cdnUrl + '/angular-sanitize.min.js',
      cdnUrl + '/angular-touch.min.js',
      cdnUrl + '/angular-animate.min.js',
      'components/marked-' + getVersion('marked') + '/marked.min.js',
      'js/angular-bootstrap/dropdown-toggle.min.js',
      'components/lunr-' + getVersion('lunr') + '/lunr.min.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
      'js/current-version-data.js',
      'https://code.angularjs.org/snapshot/docs/js/all-versions-data.js',
      'js/pages-data.js',
      'js/nav-data.js',
      'js/deployment-data-production.js',
      'js/docs.min.js'
    ],
    stylesheets: [
      'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.min.css',
      'css/prettify-theme.css',
      'css/angular-topnav.css',
      'css/docs.css',
      'css/animations.css'
    ]
  };
};
