require.paths.push(__dirname);
require.paths.push('lib');
var reader = require('reader.js'),
    ngdoc = require('ngdoc.js'),
    writer = require('writer.js'),
    callback = require('callback.js');

var docs = [];
var start;
var work = callback.chain(function(){
  start = now();
  console.log('Generating Angular Reference Documentation...');
  reader.collect(work.waitMany(function(text, file, line){
    var doc = new ngdoc.Doc(text, file, line);
    docs.push(doc);
    doc.parse();
  }));
});
var writes = callback.chain(function(){
  ngdoc.merge(docs);
  docs.forEach(function(doc){
    writer.output(doc.name + '.html', doc.html(), writes.waitFor());
  });
  var metadata = ngdoc.metadata(docs);
  writer.output('docs-keywords.js', ['NG_PAGES=', JSON.stringify(metadata), ';'], writes.waitFor());
  writer.copy('index.html', writes.waitFor());
  writer.copy('docs.js', writes.waitFor());
  writer.copy('docs.css', writes.waitFor());
  writer.copy('doc_widgets.js', writes.waitFor());
  writer.copy('doc_widgets.css', writes.waitFor());
  writer.copy('docs-scenario.html', writes.waitFor());
  writer.output('docs-scenario.js', ngdoc.scenarios(docs), writes.waitFor());
});
writes.onDone(function(){
  console.log('DONE. Generated ' + docs.length + ' pages in ' + 
      (now()-start) + 'ms.' );
});
work.onDone(writes);
writer.makeDir('build/docs', work);

///////////////////////////////////
function now(){ return new Date().getTime(); }
