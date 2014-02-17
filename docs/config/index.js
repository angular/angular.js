var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var angularjsPackage = require('dgeni-packages/ngdoc');

module.exports = function(config) {

  config = angularjsPackage(config);
  
  config.append('processing.processors', [
    require('./processors/git-data'),
    require('./processors/error-docs'),
    require('./processors/keywords'),
    require('./processors/versions-data'),
    require('./processors/pages-data'),
    require('./processors/protractor-generate'),
    require('./processors/index-page')
  ]);

  config.append('processing.tagDefinitions', [
    require('./tag-defs/tutorial-step')
  ]);

  config.set('processing.search.ignoreWordsFile', path.resolve(packagePath, 'ignore.words'));

  config.prepend('rendering.templateFolders', [
    path.resolve(packagePath, 'templates')
  ]);

  return config;
};
