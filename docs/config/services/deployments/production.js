"use strict";

var versionInfo = require('../../../../lib/versions/version-info');
var cdnUrl = "//ajax.googleapis.com/ajax/libs/angularjs/" + versionInfo.cdnVersion;

module.exports = function productionDeployment(getComponentPath) {
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
      cdnUrl + '/angular-animate.min.js',
      cdnUrl + '/angular-aria.min.js',
      cdnUrl + '/angular-sanitize.min.js',
      getComponentPath('angular-material'),
      getComponentPath('hammerjs', 'hammer.js'),
      getComponentPath('marked', 'lib/marked.js', 'node_modules', 'package.json'),
      getComponentPath('lunr.js', 'lunr.min.js'),
      getComponentPath('google-code-prettify', 'src/prettify.js'),
      getComponentPath('google-code-prettify', 'src/lang-css.js'),
      'js/versions-data.js',
      'js/pages-data.js',
      'js/nav-data.js',
      'js/docs.min.js'
    ],
    stylesheets: [
      getComponentPath('angular-material', 'angular-material.css'),
      getComponentPath('angular-material', 'themes/grey-theme.css'),
      getComponentPath('angular-material', 'themes/red-theme.css'),
      'css/prettify-theme.css',
      'css/docs.css',
      'css/animations.css',
      'font-awesome/css/font-awesome.css'
    ]
  };
};
