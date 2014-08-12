#!/usr/local/bin/node

var fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    buildPath = path.resolve('build'),
    benchmarksPath = path.resolve('benchmarks'),
    webPath = path.resolve('web');

//Start fresh
rimraf(buildPath, buildIt);

function buildIt (err) {
  var template, benchmarks;
  if (err) throw err;
  fs.mkdirSync(buildPath);

  //Get benchmark html template
  template = fs.readFileSync(path.resolve(webPath, 'template.html'));
  benchmarks = fs.readdirSync(benchmarksPath);
  benchmarks.forEach(function(benchmark) {
    var benchmarkPath, dependencies, main, scriptTags = '';

    benchmarkPath = path.resolve(benchmarksPath, benchmark);
    fs.mkdirSync(path.resolve(buildPath, benchmark));

    var config = new Config();
    require(path.resolve(benchmarkPath, 'bp.conf.js'))(config);

    dependencies = fs.readdirSync(benchmarkPath);
    dependencies.forEach(function(dependency) {
      var dependencyPath = path.resolve('benchmarks', benchmark, dependency);
      if (dependency === 'main.html') {
        //This is the main benchmark template
        main = fs.readFileSync(dependencyPath).toString();
        main = template.toString().replace('%%PLACEHOLDER%%', main);
      }
      else {
        fs.createReadStream(dependencyPath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, dependency)));
      }
    });
    main = main.replace('%%SCRIPTS%%', parseScripts(config.scripts));

    fs.writeFileSync(path.resolve(buildPath, benchmark, 'index.html'), main);
  });
}

function parseScripts (scriptList) {
  var scriptsString = '';
  return JSON.stringify(scriptList);

  if (scriptList) {
    scriptList.forEach(function(scriptConfig) {

      /*scriptsString += ['<script ',
                          (scriptConfig.id ? 'id="' + scriptConfig.id + '"' : ''),
                          'src="' + scriptConfig.src + '"></script>'].join('');*/
    });
  }


  return scriptsString;
}

function Config() {
}

Config.prototype.set = function (obj) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      this[k] = obj[k];
    }
  }
}