'use strict';
// Special deployment that is only used for the examples on plnkr.
// While the embedded examples use the Angular files relative the docs folder,
// plnkr uses the CDN urls, and needs to switch between Google CDN for tagged versions
// and the code.angularjs.org server for the snapshot (master) version.

var versionInfo = require('../../../../lib/versions/version-info');
var isSnapshot = versionInfo.currentVersion.isSnapshot;

var cdnUrl = isSnapshot ?
  '//code.angularjs.org/snapshot' :
  '//ajax.googleapis.com/ajax/libs/angularjs/' + versionInfo.cdnVersion;

module.exports = function plnkrDeployment(getVersion) {
  return {
    name: 'plnkr',
    examples: {
      commonFiles: {
        scripts: [cdnUrl + '/angular.min.js']
      },
      dependencyPath: cdnUrl + '/'
    },
    scripts: [
      cdnUrl + '/angular.min.js',
      cdnUrl + '/angular-resource.min.js',
      cdnUrl + '/angular-route.min.js',
      cdnUrl + '/angular-cookies.min.js',
      cdnUrl + '/angular-sanitize.min.js',
      cdnUrl + '/angular-touch.min.js',
      cdnUrl + '/angular-animate.min.js',
      'components/marked-' + getVersion('marked', 'node_modules', 'package.json') + '/lib/marked.js',
      'js/angular-bootstrap/dropdown-toggle.min.js',
      'components/lunr.js-' + getVersion('lunr.js') + '/lunr.min.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
      'js/versions-data.js',
      'js/pages-data.js',
      'js/nav-data.js',
      'js/docs.min.js'
    ],
    stylesheets: [
      'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.min.css',
      'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
      'css/prettify-theme.css',
      'css/docs.css',
      'css/animations.css'
    ]
  };
};
