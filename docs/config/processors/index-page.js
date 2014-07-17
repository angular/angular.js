var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');

module.exports = {
  name: 'index-page',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  description: 'This processor creates docs that will be rendered as the index page for the app',
  process: function(docs, config) {

    var deployment = config.deployment;
    if ( !deployment || !deployment.environments ) {
      throw new Error('No deployment environments found in the config.');
    }

    // Collect up all the areas in the docs
    var areas = {};
    _.forEach(docs, function(doc) {
      if ( doc.area ) {
        areas[doc.area] = doc.area;
      }
    });
    areas = _.keys(areas);

    _.forEach(deployment.environments, function(environment) {

      var indexDoc = _.defaults({
        docType: 'indexPage',
        areas: areas
      }, environment);

      indexDoc.id = 'index' + (environment.name === 'default' ? '' : '-' + environment.name);
      // Use .. to put it at the root of the build
      indexDoc.outputPath = indexDoc.id + '.html';

      docs.push(indexDoc);
    });
  }
};
