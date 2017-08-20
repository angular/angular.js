'use strict';

var path = require('canonical-path');
var packagePath = __dirname;

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called angularjs. This package depends upon
// the ngdoc, nunjucks, and examples packages defined in the dgeni-packages node module.
module.exports = new Package('angularjs', [
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/examples'),
  require('dgeni-packages/git')
])


.factory(require('./services/errorNamespaceMap'))
.factory(require('./services/getMinerrInfo'))
.factory(require('./services/getVersion'))

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
    { include: 'src/**/*.js', exclude: 'src/angular.bind.js', basePath: 'src' },
    { include: 'docs/content/**/*.ngdoc', basePath: 'docs/content' }
  ];

  writeFilesProcessor.outputFolder = 'build/docs';

})


.config(function(parseTagsProcessor) {
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/deprecated')); // this will override the jsdoc version
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/tutorial-step'));
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/sortOrder'));
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/installation'));
  parseTagsProcessor.tagDefinitions.push(require('./tag-defs/this'));

})


.config(function(inlineTagProcessor, typeInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(typeInlineTagDef);
})


.config(function(templateFinder, renderDocsProcessor, gitData) {
  // We are completely overwriting the folders
  templateFinder.templateFolders.length = 0;
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates/examples'));
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates/ngdoc'));
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates/app'));
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
      if (doc.fileInfo.baseName !== 'index') {
        docPath = path.join(docPath, doc.fileInfo.baseName);
      }
      return docPath;
    },
    outputPathTemplate: 'partials/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['e2e-test'],
    getPath: function() {},
    outputPathTemplate: 'ptore2e/${example.id}/${deployment.name}_test.js'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    pathTemplate: '${area}/${name}',
    outputPathTemplate: 'partials/${area}/${name}.html'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['componentGroup'],
    pathTemplate: '${area}/${moduleName}/${groupType}',
    outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}.html'
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview', 'tutorial', 'e2e-test', 'indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['error'],
    getId: function(doc) { return 'error:' + doc.namespace + ':' + doc.name; },
    getAliases: function(doc) { return [doc.name, doc.namespace + ':' + doc.name, doc.id]; }
  },
  {
    docTypes: ['errorNamespace'],
    getId: function(doc) { return 'error:' + doc.name; },
    getAliases: function(doc) { return [doc.id]; }
  }
  );
})

.config(function(checkAnchorLinksProcessor) {
  checkAnchorLinksProcessor.base = '/';
  // We are only interested in docs that have an area (i.e. they are pages)
  checkAnchorLinksProcessor.checkDoc = function(doc) { return doc.area; };
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

  generateProtractorTestsProcessor.basePath = 'build/docs/';

  generateExamplesProcessor.deployments = [
    debugDeployment,
    defaultDeployment,
    jqueryDeployment,
    productionDeployment
  ];
})

.config(function(generateKeywordsProcessor) {
  generateKeywordsProcessor.docTypesToIgnore = ['componentGroup'];
});
