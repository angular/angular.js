/**
* Generate appCache Manifest file here
*/

exports.appCache = appCache;
var fs = require('q-fs');
var Q = require('qq');
function identity($) {return $;}

function appCache(path) {
    if(!path) {
      return appCacheTemplate();
    }
    var blackList = ["build/docs/offline.html",
                     "build/docs/sitemap.xml",
                     "build/docs/robots.txt",
                     "build/docs/docs-scenario.html",
                     "build/docs/docs-scenario.js",
                     "build/docs/appcache.manifest",
                     "build/docs/.htaccess"
                    ];

    var result = ["CACHE MANIFEST",
                  "# " + new Date().toISOString(),
                  "",
                  "# cache all of these",
                  "CACHE:",
                  "../angular.min.js"];

    var resultPostfix = ["",
                         "FALLBACK:",
                         "/ /build/docs/index.html",
                         "",
                         "# allow access to google analytics and twitter when we are online",
                         "NETWORK:",
                         "*"];

    var promise = fs.listTree(path).then(function(files){
      var fileFutures = [];
      files.forEach(function(file){
        fileFutures.push(fs.isFile(file).then(function(isFile){
          if (isFile && blackList.indexOf(file) == -1) {
            return file.replace('build/docs/','');
          }
        }));
      });
      return Q.deep(fileFutures);
    }).then(function(files){
     return result.concat(files.filter(identity)).concat(resultPostfix).join('\n');
    });

    return promise;
}

function appCacheTemplate() {
  return ["CACHE MANIFEST",
          "# " + new Date().toISOString(),
          "",
          "# cache all of these",
          "CACHE:",
          "syntaxhighlighter/syntaxhighlighter-combined.js",
          "../angular.min.js",
          "docs-combined.js",
          "docs-data.js",
          "docs-combined.css",
          "syntaxhighlighter/syntaxhighlighter-combined.css",
          "img/texture_1.png",
          "img/yellow_bkgnd.jpg",
          "",
          "FALLBACK:",
          "/ /build/docs/offline.html",
          "",
          "# allow access to google analytics and twitter when we are online",
          "NETWORK:",
          "*"].join('\n');
}
