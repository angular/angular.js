'use strict';

module.exports = function defaultDeployment(getVersion) {
  return {
    name: 'default',
    examples: {
      commonFiles: {
        scripts: ['../../../angular.min.js']
      },
      dependencyPath: '../../../'
    },
    scripts: [
      '../angular.min.js',
      '../angular-resource.min.js',
      '../angular-route.min.js',
      '../angular-cookies.min.js',
      '../angular-sanitize.min.js',
      '../angular-touch.min.js',
      '../angular-animate.min.js',
      'components/marked-' + getVersion('marked', 'node_modules', 'package.json') + '/lib/marked.js',
      'js/angular-bootstrap/dropdown-toggle.min.js',
      'components/lunr.js-' + getVersion('lunr.js') + '/lunr.min.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
      'js/current-version-data.js',
      'js/all-versions-data.js',
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
