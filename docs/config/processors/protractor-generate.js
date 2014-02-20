var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');
var protractorFolder;

function createProtractorDoc(example, file, env) {
  var protractorDoc = {
    docType: 'e2e-test',
    id: 'protractorTest' + '-' + example.id,
    template: 'protractorTests.template.js',
    outputPath: path.join(protractorFolder, example.id, env + '_test.js'),
    innerTest: file.fileContents,
    pathPrefix: '.', // Hold for if we test with full jQuery
    exampleId: example.id,
    description: example.doc.id
  };

  if (env === 'jquery') {
    protractorDoc.examplePath = example.outputFolder + '/index-jquery.html'
  } else {
    protractorDoc.examplePath = example.outputFolder + '/index.html'
  }
  return protractorDoc;
}

module.exports = {
  name: 'protractor-generate',
  description: 'Generate a protractor test file from the e2e tests in the examples',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  init: function(config, injectables) {
    protractorFolder = config.get('rendering.protractor.outputFolder', 'ptore2e');
  },
  process: function(docs, examples) {
    _.forEach(examples, function(example) {

      _.forEach(example.files, function(file) {

        // Check if it's a Protractor test.
        if (!(file.type == 'protractor')) {
          return;
        }

        // Create new files for the tests.
        docs.push(createProtractorDoc(example, file, 'jquery'));
        docs.push(createProtractorDoc(example, file, 'jqlite'));
      });
    });
  }
};
