require.paths.push(__dirname);
require.paths.push('lib');
var reader = require('reader.js'),
    ngdoc = require('ngdoc.js'),
    writer = require('writer.js'),
    callback = require('callback.js'),
    SiteMap = require('SiteMap.js').SiteMap,
    appCache = require('appCache.js');

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
    writer.output(doc.section + '/' + doc.id + '.html', doc.html(), writes.waitFor());
  });
  var metadata = ngdoc.metadata(docs);
  writer.output('docs-keywords.js', ['NG_PAGES=', JSON.stringify(metadata).replace(/{/g, '\n{'), ';'], writes.waitFor());
  writer.copyDir('img', writes.waitFor());
  writer.copyDir('examples', writes.waitFor());
  writer.copyTpl('index.html', writes.waitFor());
  writer.copyTpl('.htaccess', writes.waitFor());
  writer.copy('docs/src/templates/index.html', 'build/docs/index-jq.html', writes.waitFor(),
              '<-- jquery place holder -->', '<script src=\"jquery.min.js\"><\/script>');
  writer.copyTpl('offline.html', writes.waitFor());
  //writer.output('app-cache.manifest',
    //            appCacheTemplate().replace(/%TIMESTAMP%/, (new Date()).toISOString()),
      //          writes.waitFor());
  writer.merge(['docs.js',
                'doc_widgets.js'],
               'docs-combined.js',
               writes.waitFor());
  writer.merge(['docs.css',
                'doc_widgets.css'],
               'docs-combined.css',
               writes.waitFor());
  writer.copyTpl('docs-scenario.html', writes.waitFor());
  writer.output('docs-scenario.js', ngdoc.scenarios(docs), writes.waitFor());
  writer.output('sitemap.xml', new SiteMap(docs).render(), writes.waitFor());
  writer.output('robots.txt', 'Sitemap: http://docs.angularjs.org/sitemap.xml\n', writes.waitFor());
  writer.merge(['syntaxhighlighter/shCore.js',
                'syntaxhighlighter/shBrushJScript.js',
                'syntaxhighlighter/shBrushXml.js'],
               'syntaxhighlighter/syntaxhighlighter-combined.js',
               writes.waitFor());
  writer.merge(['syntaxhighlighter/shCore.css',
                'syntaxhighlighter/shThemeDefault.css'],
               'syntaxhighlighter/syntaxhighlighter-combined.css',
               writes.waitFor());
  writer.copyTpl('jquery.min.js', writes.waitFor());
  writer.output('app-cache.manifest', appCache('build/docs/'), writes.waitFor());
});
writes.onDone(function(){
  console.log('DONE. Generated ' + docs.length + ' pages in ' +
      (now()-start) + 'ms.' );
});
work.onDone(writes);
writer.makeDir('build/docs/syntaxhighlighter', work);

///////////////////////////////////
function now(){ return new Date().getTime(); }


function appCacheTemplate() {
  return ["CACHE MANIFEST",
          "# %TIMESTAMP%",
          "",
          "# cache all of these",
          "CACHE:",
          "syntaxhighlighter/syntaxhighlighter-combined.js",
          "../angular.min.js",
          "docs-combined.js",
          "docs-keywords.js",
          "docs-combined.css",
          "syntaxhighlighter/syntaxhighlighter-combined.css",
          "",
          "FALLBACK:",
          "/ offline.html",
          "",
          "# allow access to google analytics and twitter when we are online",
          "NETWORK:",
          "*"].join('\n');
}
