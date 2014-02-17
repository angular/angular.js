var gruntUtils = require('../../../lib/grunt/utils');

module.exports = {
  name: 'git-data',
  runBefore: ['loading-files'],
  description: 'This processor adds information from the local git repository to the extraData injectable',
  init: function(config, injectables) {
    injectables.value('gitData', {
      version: gruntUtils.getVersion(),
      versions: gruntUtils.getPreviousVersions(),
      info: gruntUtils.getGitRepoInfo()
    });
  },
  process: function(extraData, gitData) {
    extraData.git = gitData;
  }
};