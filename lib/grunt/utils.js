var fs = require('fs');
var shell = require('shelljs');
var yaml = require('yaml-js');
var grunt = require('grunt');
var spawn = require('child_process').spawn;

module.exports = {
  getVersion: function(){
    var version = yaml.load(fs.readFileSync('version.yaml', 'UTF-8'));
    var match = version.version.match(/^([^\-]*)(-snapshot)?$/);
    var semver = match[1].split('.');
    version.major = semver[0];
    version.minor = semver[1];
    version.dot = semver[2];
    var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');
    version.full = (match[1] + (match[2] ? '-' + hash : ''));
    return version;
  },

  startTestacular: function(config, singleRun, done){
    var browsers = grunt.option('in');
    var reporters = grunt.option('reporters');
    if(browsers) browsers = browsers.substr(1, browsers.length - 2);
    var p = spawn('node', ['node_modules/testacular/bin/testacular', 'start', config,
      singleRun ? '--single-run=true' : '',
      reporters ? '--reporters=' + reporters : '',
      browsers ? '--browsers=' + browsers : ''
    ]);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on('exit', function(code){
      if(code !== 0) grunt.fail.warn("Test(s) failed");
      done();
    });
  },

  wrap: function(src, name){
    src.unshift('src/' + name + '.prefix');
    src.push('src/' + name + '.suffix');
    return src;
  },

  addStyle: function(src, styles, minify){
    styles = styles.map(processCSS.bind(this)).join('\n');
    src += styles;
    return src;
    
    function processCSS(file){
      var css = fs.readFileSync(file).toString();
      if(minify){
        css = css
          .replace(/\n/g, '')
          .replace(/\/\*.*?\*\//g, '')
          .replace(/:\s+/g, ':')
          .replace(/\s*\{\s*/g, '{')
          .replace(/\s*\}\s*/g, '}')
          .replace(/\s*\,\s*/g, ',')
          .replace(/\s*\;\s*/g, ';');
      }
      //espace for js
      css = css
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n');
      return "angular.element(document).find('head').append('<style type=\"text/css\">" + css + "</style>');";
    }
  },

  process: function(src, NG_VERSION, strict){
    var processed = src
      .replace(/"NG_VERSION_FULL"/g, NG_VERSION.full)
      .replace(/"NG_VERSION_MAJOR"/, NG_VERSION.major)
      .replace(/"NG_VERSION_MINOR"/, NG_VERSION.minor)
      .replace(/"NG_VERSION_DOT"/, NG_VERSION.dot)
      .replace(/"NG_VERSION_STABLE"/, NG_VERSION.stable)
      .replace(/"NG_VERSION_CODENAME"/, NG_VERSION.codename);
    if (strict !== false) processed = this.singleStrict(processed, '\n\n', true);
    return processed;
  },

  singleStrict: function(src, insert, newline){
    var useStrict = newline ? "$1\n'use strict';" : "$1'use strict';";
    return src
      .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
      .replace(/(\(function\([^)]*\)\s*\{)/, useStrict); // add single strict mode flag
  },

  min: function(file, fn) {
    var minFile = file.replace(/\.js$/, '.min.js');
    var d32 = (process.platform === "win32") ? '' : ' -d32';
    shell.exec('java -client -jar' + d32 + ' lib/closure-compiler/compiler.jar' +
      ' --compilation_level SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT ' +
      '--js ' + file + ' --js_output_file ' + minFile, 
      function(code) {
        if (code !== 0) grunt.fail.warn('Error minifying ' + file);
        grunt.file.write(minFile, this.singleStrict(grunt.file.read(minFile), '\n'));
        grunt.log.ok(file + ' minified into ' + minFile);
        fn();
    }.bind(this));
  }
};