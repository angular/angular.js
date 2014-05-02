var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/ngdoc');
var examplesPackage = require('dgeni-packages/examples');

module.exports = function(config) {

  config = basePackage(config);
  config = examplesPackage(config);
  
  config.append('processing.processors', [
    require('./processors/git-data'),
    require('./processors/error-docs'),
    require('./processors/keywords'),
    require('./processors/versions-data'),
    require('./processors/pages-data'),
    require('./processors/protractor-generate'),
    require('./processors/index-page'),
    require('./processors/debug-dump')
  ]);

  config.append('processing.tagDefinitions', [
    require('./tag-defs/tutorial-step')
  ]);

  config.append('processing.defaultTagTransforms', [
    require('dgeni-packages/jsdoc/tag-defs/transforms/trim-whitespace')
  ]);

  config.append('processing.inlineTagDefinitions', [
    require('./inline-tag-defs/type')
  ]);

  config.set('processing.search.ignoreWordsFile', path.resolve(packagePath, 'ignore.words'));

  config.prepend('rendering.templateFolders', [
    path.resolve(packagePath, 'templates')
  ]);

  return config;
};
