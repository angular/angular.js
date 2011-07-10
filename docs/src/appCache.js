/**
* Generate appCache Manifest file here
*/

exports.appCache = appCache;
var fs = require('q-fs');
var Q = require('qq');
function identity($) {return $;}

function appCache(path) {
    var blackList = [ "offline.html",
                      "sitemap.xml",
                      "robots.txt",
                      "docs-scenario.html",
                      "docs-scenario.js",
                      "app-cache.manifest"
                    ];

    var result = ["CACHE MANIFEST",
                        "# " + new Date().toISOString(),
                        "",
                        "# cache all of these",
                        "CACHE:",
                        "../angular.min.js"];

    var resultPostfix = [ "",
                        "FALLBACK:",
                        "/offline.html",
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