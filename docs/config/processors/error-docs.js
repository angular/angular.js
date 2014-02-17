var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');

module.exports = {
  name: 'error-docs',
  description: 'Compute the various fields for docs in the Error area',
  runAfter: ['tags-extracted'],
  init: function(config, injectables) {
    injectables.value('errorNamespaces', {});
  },
  process: function(docs, partialNames, errorNamespaces) {

    // Create error namespace docs and attach error docs to each
    _.forEach(docs, function(doc) {
      if ( doc.docType === 'error' ) {

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

      }

    });


    return docs.concat(_.values(errorNamespaces));
  }
};