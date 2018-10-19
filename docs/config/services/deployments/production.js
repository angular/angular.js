'use strict';

var versionInfo = require('../../../../lib/versions/version-info');

var googleCdnUrl = '//ajax.googleapis.com/ajax/libs/angularjs/';
var angularCodeUrl = '//code.angularjs.org/';

var cdnUrl = googleCdnUrl + versionInfo.cdnVersion;

// The "examplesDependencyPath" here applies to the examples when they are opened in plnkr.co.
// The embedded examples instead always include the files from the *default* deployment,
// to ensure that the source files are always available.
// The plnkr examples must always use the code.angularjs.org source files.
// We cannot rely on the CDN files here, because they are not deployed by the time
// docs.angularjs.org and code.angularjs.org need them.
var versionPath = versionInfo.currentVersion.isSnapshot ?
  'snapshot' :
  versionInfo.currentVersion.version;
var examplesDependencyPath = angularCodeUrl + versionPath + '/';

module.exports = function productionDeployment(getVersion) {
  return {
    name: 'production',
    examples: {
      commonFiles: {
        scripts: [examplesDependencyPath + 'angular.min.js']
      },
      dependencyPath: examplesDependencyPath
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
