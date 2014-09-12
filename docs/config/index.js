"use strict";

var path = require('canonical-path');
var packagePath = __dirname;

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('angularjs', [
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/examples')
])


.factory(require('./services/errorNamespaceMap'))
.factory(require('./services/getMinerrInfo'))
.factory(require('./services/getVersion'))
.factory(require('./services/gitData'))

.factory(require('./services/deployments/debug'))
.factory(require('./services/deployments/default'))
.factory(require('./services/deployments/jquery'))
.factory(require('./services/deployments/production'))

.factory(require('./inline-tag-defs/type'))


.processor(require('./processors/error-docs'))
.processor(require('./processors/index-page'))
.processor(require('./processors/keywords'))
.processor(require('./processors/pages-data'))
.processor(require('./processors/versions-data'))


.config(function(dgeni, log, readFilesProcessor, writeFilesProcessor) {

  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';

  readFilesProcessor.basePath = path.resolve(__dirname,'../..');
  readFilesProcessor.sourceFiles = [
    { include: 'src/**/*.js', basePath: 'src' },
    { include: 'docs/content/**/*.ngdoc', basePath: 'docs/content' }
  ];

  writeFilesProcessor.outputFolder = 'build/docs';

})


.config(function(parseTagsProcessor) {
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/tutorial-step'));
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/sortOrder'));
})


.config(function(inlineTagProcessor, typeInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(typeInlineTagDef);
})


.config(function(templateFinder, renderDocsProcessor, gitData) {
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));
  renderDocsProcessor.extraData.git = gitData;
})


.config(function(computePathsProcessor, computeIdsProcessor) {

  computePathsProcessor.pathTemplates.push({
    docTypes: ['error'],
    pathTemplate: 'error/${namespace}/${name}',
    outputPathTemplate: 'partials/error/${namespace}/${name}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['errorNamespace'],
    pathTemplate: 'error/${name}',
    outputPathTemplate: 'partials/error/${name}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['overview', 'tutorial'],
    getPath: function(doc) {
      var docPath = path.dirname(doc.fileInfo.relativePath);
      if ( doc.fileInfo.baseName !== 'index' ) {
        docPath = path.join(docPath, doc.fileInfo.baseName);
      }
      return docPath;
    },
    getOutputPath: function(doc) {
      return 'partials/' + doc.path +
          ( doc.fileInfo.baseName === 'index' ? '/index.html' : '.html');
    }
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['e2e-test'],
    getPath: function() {},
    outputPathTemplate: 'ptore2e/${example.id}/${deployment.name}_test.js'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    getPath: function() {},
    outputPathTemplate: '${id}.html'
  });


  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview', 'tutorial', 'e2e-test', 'indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['error', 'errorNamespace'],
    getId: function(doc) { return 'error:' + doc.name; },
    getAliases: function(doc) { return [doc.id]; }
  });
})


.config(function(
  generateIndexPagesProcessor,
  generateProtractorTestsProcessor,
  generateExamplesProcessor,
  debugDeployment, defaultDeployment,
  jqueryDeployment, productionDeployment) {

  generateIndexPagesProcessor.deployments = [
    debugDeployment,
    defaultDeployment,
    jqueryDeployment,
    productionDeployment
  ];

  generateProtractorTestsProcessor.deployments = [
    defaultDeployment,
    jqueryDeployment
  ];

  generateExamplesProcessor.deployments = [
    debugDeployment,
    defaultDeployment,
    jqueryDeployment,
    productionDeployment
  ];
});
