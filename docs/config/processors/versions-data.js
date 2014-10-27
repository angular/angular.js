"use strict";

var _ = require('lodash');

/**
 * @dgProcessor generateVersionDocProcessor
 * @description
 * This processor will create a new doc that will be rendered as a JavaScript file
 * containing meta information about the current versions of AngularJS
 */
module.exports = function generateVersionDocProcessor(gitData) {
  return {
    $runAfter: ['generatePagesDataProcessor'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      var versionDoc = {
        docType: 'versions-data',
        id: 'versions-data',
        template: 'versions-data.template.js',
        outputPath: 'js/versions-data.js',
        currentVersion: gitData.version
      };

      versionDoc.versions = _(gitData.versions)
        .filter(function(version) { return version.major > 0; })
        .push(gitData.version)
        .reverse()
        .value();

      docs.push(versionDoc);
    }
  };
};