var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');

module.exports = {
  name: 'error-docs',
  description: 'Compute the various fields for docs in the Error area',
  runAfter: ['tags-extracted', 'compute-path'],
  runBefore: ['extra-docs-added'],
  exports: {
    errorNamespaces: ['factory', function() { return {}; }],
    minerrInfo: ['factory', function(config) {
      var minerrInfoPath = config.get('processing.errors.minerrInfoPath');
      if ( !minerrInfoPath ) {
        throw new Error('Error in configuration: Please provide a path to the minerr info file (errors.json) ' +
          'in the `config.processing.errors.minerrInfoPath` property');
      }
      return require(minerrInfoPath);
    }]
  },
  process: function(docs, partialNames, errorNamespaces, minerrInfo) {

    // Create error namespace docs and attach error docs to each
    _.forEach(docs, function(doc) {
      if ( doc.docType === 'error' ) {

        // Parse out the error info from the id
        parts = doc.name.split(':');
        doc.namespace = parts[0];
        doc.name = parts[1];


        var namespaceDoc = errorNamespaces[doc.namespace];
        if ( !namespaceDoc ) {
          // First time we came across this namespace, so create a new one
          namespaceDoc = errorNamespaces[doc.namespace] = {
            area: doc.area,
            name: doc.namespace,
            errors: [],
            path: path.dirname(doc.path),
            outputPath: path.dirname(doc.outputPath) + '.html',
            docType: 'errorNamespace'
          };
        }

        // Add this error to the namespace
        namespaceDoc.errors.push(doc);
        doc.namespace = namespaceDoc;

        doc.formattedErrorMessage = minerrInfo.errors[doc.namespace.name][doc.name];

      }

    });


    return docs.concat(_.values(errorNamespaces));
  }
};