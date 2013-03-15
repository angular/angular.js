var reader = require('./reader.js'),
    ngdoc = require('./ngdoc.js'),
    writer = require('./writer.js'),
    SiteMap = require('./SiteMap.js').SiteMap,
    appCache = require('./appCache.js').appCache,
    Q = require('qq');

var start = now();
var docs;

writer.makeDir('build/docs/', true).then(function() {
  return writer.makeDir('build/docs/partials/');
}).then(function() {
  console.log('Generating AngularJS Reference Documentation...');
  return reader.collect();
}).then(function generateHtmlDocPartials(docs_) {
  docs = docs_;
  ngdoc.merge(docs);
  var fileFutures = [];
  docs.forEach(function(doc){
    // this hack is here because on OSX angular.module and angular.Module map to the same file.
    var id = doc.id.replace('angular.Module', 'angular.IModule');
    fileFutures.push(writer.output('partials/' + doc.section + '/' + id + '.html', doc.html()));
  });

  writeTheRest(fileFutures);

  return Q.deep(fileFutures);
}).then(function generateManifestFile() {
  return appCache('build/docs/').then(function(list) {
    writer.output('appcache-offline.manifest', list);
  });
}).then(function printStats() {
  console.log('DONE. Generated ' + docs.length + ' pages in ' + (now()-start) + 'ms.' );
});


function writeTheRest(writesFuture) {
  var metadata = ngdoc.metadata(docs);

  writesFuture.push(writer.symlinkTemplate('css', 'dir'));
  writesFuture.push(writer.symlinkTemplate('font', 'dir'));
  writesFuture.push(writer.symlink('../../docs/img', 'build/docs/img', 'dir'));
  writesFuture.push(writer.symlinkTemplate('js', 'dir'));

  var manifest = 'manifest="/build/docs/appcache.manifest"';

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index.html',
                                writer.replace, {'doc:manifest': ''})); //manifest //TODO(i): enable

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index-nocache.html',
                                writer.replace, {'doc:manifest': ''}));


  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index-jq.html',
                                writer.replace, {'doc:manifest': ''}));

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index-jq-nocache.html',
                                writer.replace, {'doc:manifest': ''}));


  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index-debug.html',
                                writer.replace, {'doc:manifest': ''}));

  writesFuture.push(writer.copy('docs/src/templates/index.html', 'index-jq-debug.html',
                                writer.replace, {'doc:manifest': ''}));

  writesFuture.push(writer.symlinkTemplate('offline.html'));

  writesFuture.push(writer.copyTemplate('docs-scenario.html')); // will be rewritten, don't symlink
  writesFuture.push(writer.output('docs-scenario.js', ngdoc.scenarios(docs)));

  writesFuture.push(writer.output('docs-keywords.js',
                                ['NG_PAGES=', JSON.stringify(metadata).replace(/{/g, '\n{'), ';']));
  writesFuture.push(writer.output('sitemap.xml', new SiteMap(docs).render()));

  writesFuture.push(writer.output('robots.txt', 'Sitemap: http://docs.angularjs.org/sitemap.xml\n'));
  writesFuture.push(writer.output('appcache.manifest',appCache()));
  writesFuture.push(writer.copyTemplate('.htaccess')); // will be rewritten, don't symlink

  writesFuture.push(writer.symlinkTemplate('favicon.ico'));
}


function now() { return new Date().getTime(); }

function noop() {};

