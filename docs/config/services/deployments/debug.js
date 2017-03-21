'use strict';

module.exports = function debugDeployment(getVersion) {
  return {
    name: 'debug',
    examples: {
      commonFiles: {
        scripts: ['../../../angular.js']
      },
      dependencyPath: '../../../'
    },
    scripts: [
      '../angular.js',
      '../angular-resource.js',
      '../angular-route.js',
      '../angular-cookies.js',
      '../angular-sanitize.js',
      '../angular-touch.js',
      '../angular-animate.js',
      'components/marked-' + getVersion('marked') + '/lib/marked.js',
      'js/angular-bootstrap/dropdown-toggle.js',
      'components/lunr-' + getVersion('lunr') + '/lunr.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
      'js/current-version-data.js',
      'js/all-versions-data.js',
      'js/pages-data.js',
      'js/nav-data.js',
      'js/docs.js'
    ],
    stylesheets: [
      'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.css',
      'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
      'css/prettify-theme.css',
      'css/angular-topnav.css',
      'css/docs.css',
      'css/animations.css'
    ]
  };
};
