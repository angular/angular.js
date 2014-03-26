var gruntUtils = require('../../../lib/grunt/utils');
var versionInfo = require('../../../lib/versions/version-info');

module.exports = {
  name: 'git-data',
  runBefore: ['loading-files'],
  description: 'This processor adds information from the local git repository to the extraData injectable',
  init: function(config, injectables) {
    injectables.value('gitData', {
      version: versionInfo.currentVersion,
      versions: versionInfo.previousVersions,
      info: versionInfo.gitRepoInfo
    });
  },
  process: function(extraData, gitData) {
    extraData.git = gitData;
  }
};