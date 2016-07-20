'use strict';

/**
 * @dgProcessor errorDocsProcessor
 * @description
 * Process "error" docType docs and generate errorNamespace docs
 */
module.exports = function errorDocsProcessor(errorNamespaceMap, getMinerrInfo) {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {

      // Create error namespace docs and attach error docs to each
      docs.forEach(function(doc) {
        var parts, namespaceDoc;

        if (doc.docType === 'error') {

          // Parse out the error info from the id
          parts = doc.name.split(':');
          doc.namespace = parts[0];
          doc.name = parts[1];

          // Get or create the relevant errorNamespace doc
          namespaceDoc = errorNamespaceMap.get(doc.namespace);
          if (!namespaceDoc) {
            namespaceDoc = {
              area: 'error',
              name: doc.namespace,
              errors: [],
              docType: 'errorNamespace'
            };
            errorNamespaceMap.set(doc.namespace, namespaceDoc);
          }

          // Link this error doc to its namespace doc
          namespaceDoc.errors.push(doc);
          doc.namespaceDoc = namespaceDoc;
          doc.formattedErrorMessage = getMinerrInfo().errors[doc.namespace][doc.name];
        }
      });

      errorNamespaceMap.forEach(function(errorNamespace) {
        docs.push(errorNamespace);
      });
    }
  };
};
