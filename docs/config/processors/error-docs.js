'use strict';

/**
 * @dgProcessor errorDocsProcessor
 * @description
 * Process "error" docType docs and generate errorNamespace docs
 */
module.exports = function errorDocsProcessor(log, errorNamespaceMap, getMinerrInfo) {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {

      // Get the extracted min errors to compare with the error docs, and report any mismatch
      var collectedErrors = require('../../../build/errors.json').errors;
      var flatErrors = [];

      for (var namespace in collectedErrors) {
        for (var error in collectedErrors[namespace]) {
          flatErrors.push(namespace + ':' + error);
        }
      }

      // Create error namespace docs and attach error docs to each
      docs.forEach(function(doc) {
        var parts, namespaceDoc;

        if (doc.docType === 'error') {

          var matchingMinErr = flatErrors.indexOf(doc.name);

          if (matchingMinErr === -1) {
            log.warn('Error doc: ' + doc.name + ' has no matching min error');
          } else {
            flatErrors.splice(matchingMinErr, 1);
          }

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

      flatErrors.forEach(function(value) {
        log.warn('No error doc exists for min error: ' + value);
      });

      errorNamespaceMap.forEach(function(errorNamespace) {
        docs.push(errorNamespace);
      });
    }
  };
};
