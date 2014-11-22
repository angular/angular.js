"use strict";

/**
 * dgService getVersion
 * @description
 * Find the current version of the bower component (or npm module)
 */
module.exports = function getComponentPath(getVersion) {
  return function(component, item, sourceFolder, packageFile) {
    item = item || component + '.js';
    return 'components/' + component + '-' + getVersion(component, sourceFolder, packageFile) + '/' + item;
  };
};