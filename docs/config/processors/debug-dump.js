var fs = require('q-io/fs');
var log = require('winston');
var util = require("util");

module.exports = {
  name: 'debug-dump',
  runBefore: ['write-files'],
  description: 'This processor dumps docs that match a filter to a file',
  process: function(docs, config) {

    var filter, outputPath, depth;

    filter = config.get('processing.debug-dump.filter');
    outputPath = config.get('processing.debug-dump.outputPath');
    depth = config.get('processing.debug-dump.depth', 2);


    if ( filter && outputPath ) {
      log.info('Dumping docs:', filter, outputPath);
      var filteredDocs = filter(docs);
      var dumpedDocs = util.inspect(filteredDocs, depth);
      return writeFile(outputPath, dumpedDocs).then(function() {
        return docs;
      });
    }
  }
};

function writeFile(file, content) {
  return fs.makeTree(fs.directory(file)).then(function() {
    return fs.write(file, content, 'wb');
  });
}