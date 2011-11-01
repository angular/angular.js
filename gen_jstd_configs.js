#!/usr/bin/env node
/* This file reads in list of files from angularFiles.js and generate various jstd config files */

var fs = require('fs'),
    angularSrc,
    angularScenario;

fs.readFile('angularFiles.js', function(err, data) {
  eval(data.toString());
  var prefix = 'server: http://localhost:9876\n\n',
      prefixScenario = 'server: http://localhost:9877\n\n';

  angularSrc = angularFiles.angularSrc.join('\n- ');
  angularScenario = angularFiles.angularScenario.join('\n- ');

  fs.writeFile('./jsTestDriver.conf', prefix + combine(angularFiles.jstd,
      angularFiles.jstdExclude));

  fs.writeFile('./jsTestDriver-mocks.conf', prefix + combine(angularFiles.jstdMocks));

  fs.writeFile('./jsTestDriver-scenario.conf', prefixScenario +
      combine(angularFiles.jstdScenario) +
      '\n\nproxy:\n- {matcher: "*", server: "http://localhost:8000"}');

  fs.writeFile('./jsTestDriver-perf.conf', prefix + combine(angularFiles.jstdPerf,
      angularFiles.jstdPerfExclude));

  fs.writeFile('./jsTestDriver-jquery.conf', prefix + combine(angularFiles.jstdJquery,
      angularFiles.jstdJqueryExclude));

  fs.writeFile('./jsTestDriver-coverage.conf', prefix +
      combine(angularFiles.jstd, angularFiles.jstdExclude) +
      '\n\nplugin:\n- name: "coverage"\n' +
      'jar: "lib/jstestdriver/coverage.jar"\n' +
      'module: "com.google.jstestdriver.coverage.CoverageModule"');
});

function combine(load, exclude) {
  var fileList = 'load:\n- ' + load.join('\n- ');
  if (exclude) fileList += ('\n\nexclude:\n- ' + exclude.join('\n- '));

  //Replace placeholders for src list before returning
  return fileList.replace(/@angularSrc/g, angularSrc);
}

