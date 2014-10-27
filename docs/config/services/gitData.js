"use strict";

var versionInfo = require('../../../lib/versions/version-info');

/**
 * @dgService gitData
 * @description
 * Information from the local git repository
 */
module.exports = function gitData() {
  return {
    version: versionInfo.currentVersion,
    versions: versionInfo.previousVersions,
    info: versionInfo.gitRepoInfo
  };
};
