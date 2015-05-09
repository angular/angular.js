"use strict";

module.exports = function jqueryDeployment(getComponentPath) {
  return {
    name: 'jquery',
    examples: {
      commonFiles: {
        scripts: [
          '../../' + getComponentPath('jquery'),
          '../../../angular.js'
        ]
      },
      dependencyPath: '../../../'
    },
    scripts: [
      getComponentPath('jquery'),
      getComponentPath('hammerjs', 'hammer.js'),
      getComponentPath('angular'),
      getComponentPath('angular-animate'),
      getComponentPath('angular-aria'),
      getComponentPath('angular-material'),
      getComponentPath('angular-sanitize'),
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
      'font-awesome/css/font-awesome.css',
      '//fonts.googleapis.com/css?family=Roboto:400,400italic,500,700'
    ]
  };
};
