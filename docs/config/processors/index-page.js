'use strict';

var _ = require('lodash');

/**
 * @dgProcessor generateIndexPagesProcessor
 * @description
 * This processor creates docs that will be rendered as the index page for the app
 */
module.exports = function generateIndexPagesProcessor() {
  return {
    deployments: [],
    $validate: {
      deployments: { presence: true }
    },
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {

      // Collect up all the areas in the docs
      var areas = {};
      docs.forEach(function(doc) {
        if (doc.area) {
          areas[doc.area] = doc.area;
        }
      });
      areas = _.keys(areas);

      this.deployments.forEach(function(deployment) {

        var indexDoc = _.defaults({
          docType: 'indexPage',
          areas: areas
        }, deployment);

        indexDoc.id = 'index' + (deployment.name === 'default' ? '' : '-' + deployment.name);

        var deploymentDoc = {
          docType: 'deploymentData',
          id: 'deployment-data-' + deployment.name,
          template: 'angular-service.template.js',
          ngModuleName: 'deployment',
          serviceName: 'DEPLOYMENT',
          serviceValue: deployment.name
        };

        docs.push(indexDoc);
        docs.push(deploymentDoc);
      });
    }
  };
};
