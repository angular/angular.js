"use strict";

var versionInfo = require('../../../../lib/versions/version-info');
var cdnUrl = "//ajax.googleapis.com/ajax/libs/angularjs/" + versionInfo.cdnVersion;

module.exports = function productionDeployment(getVersion) {
  return {
    name: 'production',
    examples: {
      commonFiles: {
        scripts: [ cdnUrl + '/angular.min.js' ]
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
      'components/lunr.js-' + getVersion('lunr.js') + '/lunr.min.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
      'js/versions-data.js',
      'js/pages-data.js',
      'js/nav-data.js',
      'js/docs.min.js'
    ],
    stylesheets: [
      'css/prettify-theme.css',
      'css/docs.css',
      'css/animations.css',
      '//fonts.googleapis.com/css?family=Roboto:400,400italic,500,700'
    ]
  };
};
