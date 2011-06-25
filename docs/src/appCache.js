/**
* Generate appCache Manifest file here
*/

exports.appCache = appCache;
var fs = require('fs');

function appCache(path) {
    var blackList = [ "offline.html",
                      "sitemap.xml",
                      "robots.txt",
                      "docs-scenario.html",
                      "docs-scenario.js",
                      "app-cache.manifest"
                    ];

    var result = ["CACHE MANIFEST",
                        "# %TIMESTAMP%",
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
    walk(path,result,blackList);
    return result.join('\n').replace(/%TIMESTAMP%/, (new Date()).toISOString()) + '\n' + resultPostfix.join('\n');
}

function walk(path, array, blackList) {
  var temp = fs.readdirSync(path);
  for (var i=0; i< temp.length; i++) {
    if(blackList.indexOf(temp[i]) < 0) {
      var currentPath = path + '/' + temp[i];
      var stat = fs.statSync(currentPath);
      
      if (stat.isDirectory()) {
        walk(currentPath, array, blackList);
      }
      else {
        array.push(currentPath.replace('build/docs/',''));
      }
    }
  }
}