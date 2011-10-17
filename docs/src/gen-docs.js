var reader = require('./reader.js'),
    ngdoc = require('./ngdoc.js'),
    writer = require('./writer.js'),
    SiteMap = require('./SiteMap.js').SiteMap,
    appCache = require('./appCache.js').appCache,
    Q = require('qq');

process.on('uncaughtException', function(err) {
  console.error(err.stack || err);
});

var start = now();
var docs;

writer.makeDir('build/docs/syntaxhighlighter').then(function() {
  console.log('Generating Angular Reference Documentation...');
  return reader.collect();
}).then(function generateHtmlDocPartials(docs_) {
  docs = docs_;
  ngdoc.merge(docs);
  var fileFutures = [];
  docs.forEach(function(doc){
    fileFutures.push(writer.output('partials/' + doc.section + '/' + doc.id + '.html', doc.html()));
  });

  writeTheRest(fileFutures);

  return Q.deep(fileFutures);
}).then(function generateManifestFile() {
  return appCache('build/docs/').then(function(list) {
    writer.output('appcache-offline.manifest', list);
  });
}).then(function printStats() {
  console.log('DONE. Generated ' + docs.length + ' pages in ' + (now()-start) + 'ms.' );
}).end();


function writeTheRest(writesFuture) {
  var metadata = ngdoc.metadata(docs);

  writesFuture.push(writer.copyDir('img'));
  writesFuture.push(writer.copyDir('examples'));

  var manifest = 'manifest="/build/docs/appcache.manifest"';

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index.html',
                                writer.replace, {'doc:manifest': manifest}));

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index-nocache.html',
                                writer.replace, {'doc:manifest': ''}));


  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index-jq.html',
                                writer.replace, {'doc:manifest': manifest}));

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index-jq-nocache.html',
                                writer.replace, {'doc:manifest': ''}));


  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index-debug.html',
                                writer.replace, {'doc:manifest': ''}));

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'build/docs/index-jq-debug.html',
                                writer.replace, {'doc:manifest': ''}));

  writesFuture.push(writer.copyTpl('offline.html'));
  writesFuture.push(writer.copyTpl('docs-scenario.html'));
  writesFuture.push(writer.copyTpl('jquery.min.js'));

  writesFuture.push(writer.output('docs-keywords.js',
                                ['NG_PAGES=', JSON.stringify(metadata).replace(/{/g, '\n{'), ';']));
  writesFuture.push(writer.output('sitemap.xml', new SiteMap(docs).render()));
  writesFuture.push(writer.output('docs-scenario.js', ngdoc.scenarios(docs)));
  writesFuture.push(writer.output('robots.txt', 'Sitemap: http://docs.angularjs.org/sitemap.xml\n'));
  writesFuture.push(writer.output('appcache.manifest',appCache()));
  writesFuture.push(writer.copyTpl('.htaccess'));

  writesFuture.push(writer.merge(['docs.js',
                                  'doc_widgets.js'],
                                  'docs-combined.js'));
  writesFuture.push(writer.merge(['docs.css',
                                  'doc_widgets.css'],
                                  'docs-combined.css'));
  writesFuture.push(writer.merge(['syntaxhighlighter/shCore.js',
                                  'syntaxhighlighter/shBrushJScript.js',
                                  'syntaxhighlighter/shBrushXml.js'],
                                  'syntaxhighlighter/syntaxhighlighter-combined.js'));
  writesFuture.push(writer.merge(['syntaxhighlighter/shCore.css',
                                  'syntaxhighlighter/shThemeDefault.css'],
                                  'syntaxhighlighter/syntaxhighlighter-combined.css'));
}


function now() { return new Date().getTime(); }

function noop() {};
