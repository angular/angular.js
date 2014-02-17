var path = require('canonical-path');
var basePath = __dirname;

var basePackage = require('./config');

module.exports = function(config) {

  config = basePackage(config);

  config.set('source.files', [
    { pattern: 'src/**/*.js', basePath: path.resolve(basePath,'..') },
    { pattern: '**/*.ngdoc', basePath: path.resolve(basePath, 'content') }
  ]);

  config.set('processing.examples.commonFiles', {
    scripts: [ '../../../angular.js' ],
    stylesheets: []
  });
  config.set('processing.examples.dependencyPath', '../../..');

  config.set('rendering.outputFolder', '../build/docs');

  config.set('logging.level', 'info');

  config.merge('deployment', {
    environments: [{
      name: 'debug',
      scripts: [
        '../angular.js',
        '../angular-resource.js',
        '../angular-route.js',
        '../angular-cookies.js',
        '../angular-sanitize.js',
        '../angular-touch.js',
        '../angular-animate.js',
        'components/marked/lib/marked.js',
        'js/angular-bootstrap/bootstrap.js',
        'js/angular-bootstrap/bootstrap-prettify.js',
        'js/angular-bootstrap/dropdown-toggle.js',
        'components/lunr.js/lunr.js',
        'components/google-code-prettify/src/prettify.js',
        'components/google-code-prettify/src/lang-css.js',
        'js/versions-data.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: [
        'css/bootstrap/css/bootstrap.css',
        'components/open-sans-fontface/open-sans.css',
        'css/prettify-theme.css',
        'css/docs.css',
        'css/animations.css'
      ]
    },
    {
      name: 'default',
      scripts: [
        '../angular.min.js',
        '../angular-resource.min.js',
        '../angular-route.min.js',
        '../angular-cookies.min.js',
        '../angular-sanitize.min.js',
        '../angular-touch.min.js',
        '../angular-animate.min.js',
        'components/marked/lib/marked.js',
        'js/angular-bootstrap/bootstrap.js',
        'js/angular-bootstrap/bootstrap-prettify.js',
        'js/angular-bootstrap/dropdown-toggle.js',
        'components/lunr.js/lunr.min.js',
        'components/google-code-prettify/src/prettify.js',
        'components/google-code-prettify/src/lang-css.js',
        'js/versions-data.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: [
        'components/bootstrap/dist/css/bootstrap.css',
        'components/open-sans-fontface/open-sans.css',
        'css/prettify-theme.css',
        'css/docs.css',
        'css/animations.css'
      ]
    }]
  });

  return config;
};
