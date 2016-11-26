'use strict';
var path = require('canonical-path');

/**
 * dgService getVersion
 * @description
 * Find the current version of the bower component (or node module)
 */
module.exports = function getVersion(readFilesProcessor) {
  var basePath = readFilesProcessor.basePath;

  return function(component, sourceFolder, packageFile) {
    sourceFolder = path.resolve(basePath, sourceFolder || 'docs/bower_components');
    packageFile = packageFile || 'bower.json';
    return require(path.join(sourceFolder,component,packageFile)).version;
  };
};
