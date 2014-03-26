var writer = require('dgeni/lib/utils/doc-writer');
var log = require('winston');
var util = require("util");

var filter, outputPath, depth;

module.exports = {
  name: 'debug-dump',
  runBefore: ['write-files'],
  description: 'This processor dumps docs that match a filter to a file',
  init: function(config, injectables) {
    filter = config.get('processing.debug-dump.filter');
    outputPath = config.get('processing.debug-dump.outputPath');
    depth = config.get('processing.debug-dump.depth', 2);
  },
  process: function(docs) {
    if ( filter && outputPath ) {
      log.info('Dumping docs:', filter, outputPath);
      var filteredDocs = filter(docs);
      var dumpedDocs = util.inspect(filteredDocs, depth);
      return writer.writeFile(outputPath, dumpedDocs).then(function() {
        return docs;
      });
    }
  }
};