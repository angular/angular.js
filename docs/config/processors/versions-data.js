var _ = require('lodash');

module.exports = {
  name: 'versions-data',
  description: 'This plugin will create a new doc that will be rendered as an angularjs module ' +
               'which will contain meta information about the versions of angular',
  runAfter: ['adding-extra-docs', 'pages-data'],
  runBefore: ['extra-docs-added'],
  process: function(docs, gitData) {

    var version = gitData.version;
    var versions = gitData.versions;

    if ( !version ) {
      throw new Error('Invalid configuration.  Please provide a valid `source.currentVersion` property');
    }
    if ( !versions ) {
      throw new Error('Invalid configuration.  Please provide a valid `source.previousVersions` property');
    }

    var versionDoc = {
      docType: 'versions-data',
      id: 'versions-data',
      template: 'versions-data.template.js',
      outputPath: 'js/versions-data.js',
    };

    versionDoc.currentVersion = version;

    versionDoc.versions = _(versions)
      .filter(function(version) { return version.major > 0; })
      .push(version)
      .reverse()
      .value();

    docs.push(versionDoc);
  }
};