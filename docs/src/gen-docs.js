var reader = require('./reader.js'),
    ngdoc = require('./ngdoc.js'),
    writer = require('./writer.js'),
    SiteMap = require('./SiteMap.js').SiteMap,
    appCache = require('./appCache.js').appCache,
    Q = require('qq'),
    errorsJson = require('../../build/errors.json').errors;

var start = now();
var docs;

writer.makeDir('build/docs/', true).then(function() {
  return writer.makeDir('build/docs/partials/');
}).then(function() {
  return writer.makeDir('build/docs/components/');
}).then(function() {
  return writer.makeDir('build/docs/components/bootstrap');
}).then(function() {
  return writer.makeDir('build/docs/components/font-awesome');
}).then(function() {
  console.log('Generating AngularJS Reference Documentation...');
  return reader.collect();
}).then(function generateHtmlDocPartials(docs_) {
  docs = docs_;
  ngdoc.merge(docs);
  var fileFutures = [], namespace;

  var isErrorDocPresent = function (search) {
    return docs.some(function (doc) {
      return doc.ngdoc === 'error' && doc.name === search;
    });
  };

  // Check that each generated error code has a doc file.
  Object.keys(errorsJson).forEach(function (prop) {
    if (typeof errorsJson[prop] === 'object') {
      namespace = errorsJson[prop];
      Object.keys(namespace).forEach(function (code) {
        var search = prop + ':' + code;
        if (!isErrorDocPresent(search)) {
          throw new Error('Missing ngdoc file for error code: ' + search);
        }
      });
    } else {
      if (!isErrorDocPresent(prop)) {
        throw new Error('Missing ngdoc file for error code: ' + prop);
      }
    }
  });

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
}).done();


function writeTheRest(writesFuture) {
  var metadata = ngdoc.metadata(docs);
  var versions = ngdoc.ngVersions();
  var currentVersion = ngdoc.ngCurrentVersion();

  writesFuture.push(writer.symlink('../../docs/content/notes', 'build/docs/notes', 'dir'));
  writesFuture.push(writer.symlinkTemplate('css', 'dir'));
  writesFuture.push(writer.symlink('../../docs/img', 'build/docs/img', 'dir'));
  writesFuture.push(writer.symlinkTemplate('js', 'dir'));

  var manifest = 'manifest="/build/docs/appcache.manifest"';

  writesFuture.push(writer.copyDir('bower_components/components-font-awesome/css', 'components/font-awesome/css'));
  writesFuture.push(writer.copyDir('bower_components/components-font-awesome/font', 'components/font-awesome/font'));
  writesFuture.push(writer.copyDir('bower_components/bootstrap', 'components/bootstrap'));

  writesFuture.push(writer.copy('node_modules/marked/lib/marked.js', 'components/marked.js'));
  writesFuture.push(writer.copy('bower_components/lunr.js/lunr.js', 'components/lunr.js'));
  writesFuture.push(writer.copy('bower_components/lunr.js/lunr.min.js', 'components/lunr.min.js'));
  writesFuture.push(writer.copy('bower_components/jquery/jquery.js', 'components/jquery.js'));
  writesFuture.push(writer.copy('bower_components/jquery/jquery.min.js', 'components/jquery.min.js'));
  writesFuture.push(writer.copy('bower_components/google-code-prettify/src/prettify.js', 'components/google-code-prettify.js'));
  writesFuture.push(writer.copy('docs/components/angular-bootstrap/bootstrap.js', 'components/angular-bootstrap.js'));
  writesFuture.push(writer.copy('docs/components/angular-bootstrap/bootstrap-prettify.js', 'components/angular-bootstrap-prettify.js'));

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

  writesFuture.push(writer.output('docs-data.js',[
    "angular.module('docsData', [])",
    ".value('NG_PAGES'," + JSON.stringify(metadata).replace(/{/g, '\n{') + ")",
    ".value('NG_VERSION'," + JSON.stringify(currentVersion) + ")",
    ".value('NG_VERSIONS'," + JSON.stringify(versions) + ");"
  ]));
  writesFuture.push(writer.output('sitemap.xml', new SiteMap(docs).render()));

  writesFuture.push(writer.output('robots.txt', 'Sitemap: http://docs.angularjs.org/sitemap.xml\n'));
  writesFuture.push(writer.output('appcache.manifest',appCache()));
  writesFuture.push(writer.copyTemplate('.htaccess')); // will be rewritten, don't symlink

  writesFuture.push(writer.symlinkTemplate('favicon.ico'));
}


function now() { return new Date().getTime(); }

function noop() {};

