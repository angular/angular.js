var fs = require('fs');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;
var version;

module.exports = {

  init: function() {
    if (!process.env.TRAVIS) {
      shell.exec('npm install');
    }
  },


  getVersion: function(){
    if (version) return version;

    var package = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));
    var match = package.version.match(/^([^\-]*)(-snapshot)?$/);
    var semver = match[1].split('.');
    var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');

    var fullVersion = (match[1] + (match[2] ? '-' + hash : ''));
    var numVersion = semver[0] + '.' + semver[1] + '.' + semver[2];
    version = {
      number: numVersion,
      full: fullVersion,
      major: semver[0],
      minor: semver[1],
      dot: semver[2],
      codename: package.codename,
      cdn: package.cdnVersion
    };

    return version;
  },


  startKarma: function(config, singleRun, done){
    var browsers = grunt.option('browsers');
    var reporters = grunt.option('reporters');
    var noColor = grunt.option('no-colors');
    var port = grunt.option('port');
    var p = spawn('node', ['node_modules/karma/bin/karma', 'start', config,
      singleRun ? '--single-run=true' : '',
      reporters ? '--reporters=' + reporters : '',
      browsers ? '--browsers=' + browsers : '',
      noColor ? '--no-colors' : '',
      port ? '--port=' + port : ''
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
          .replace(/\r?\n/g, '')
          .replace(/\/\*.*?\*\//g, '')
          .replace(/:\s+/g, ':')
          .replace(/\s*\{\s*/g, '{')
          .replace(/\s*\}\s*/g, '}')
          .replace(/\s*\,\s*/g, ',')
          .replace(/\s*\;\s*/g, ';');
      }
      //escape for js
      css = css
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r?\n/g, '\\n');
      return "angular.element(document).find('head').append('<style type=\"text/css\">" + css + "</style>');";
    }
  },


  process: function(src, NG_VERSION, strict){
    var processed = src
      .replace(/"NG_VERSION_FULL"/g, NG_VERSION.full)
      .replace(/"NG_VERSION_MAJOR"/, NG_VERSION.major)
      .replace(/"NG_VERSION_MINOR"/, NG_VERSION.minor)
      .replace(/"NG_VERSION_DOT"/, NG_VERSION.dot)
      .replace(/"NG_VERSION_CDN"/, NG_VERSION.cdn)
      .replace(/"NG_VERSION_CODENAME"/, NG_VERSION.codename);
    if (strict !== false) processed = this.singleStrict(processed, '\n\n', true);
    return processed;
  },


  build: function(config, fn){
    var files = grunt.file.expand(config.src);
    var styles = config.styles;
    //concat
    var src = files.map(function(filepath){
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf('\n'));
    //process
    var processed = this.process(src, grunt.config('NG_VERSION'), config.strict);
    if (styles) processed = this.addStyle(processed, styles.css, styles.minify);
    //write
    grunt.file.write(config.dest, processed);
    grunt.log.ok('File ' + config.dest + ' created.');
    fn();
  },


  singleStrict: function(src, insert, newline){
    var useStrict = newline ? "$1\n'use strict';" : "$1'use strict';";
    return src
      .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
      .replace(/(\(function\([^)]*\)\s*\{)/, useStrict); // add single strict mode flag
  },


  min: function(file, done) {
    var minFile = file.replace(/\.js$/, '.min.js');
    shell.exec(
        'java ' +
            this.java32flags() + ' ' +
            '-jar lib/closure-compiler/compiler.jar ' +
            '--compilation_level SIMPLE_OPTIMIZATIONS ' +
            '--language_in ECMASCRIPT5_STRICT ' +
            '--js ' + file + ' ' +
            '--js_output_file ' + minFile,
      function(code) {
        if (code !== 0) grunt.fail.warn('Error minifying ' + file);
        grunt.file.write(minFile, this.singleStrict(grunt.file.read(minFile), '\n'));
        grunt.log.ok(file + ' minified into ' + minFile);
        done();
    }.bind(this));
  },


  //returns the 32-bit mode force flags for java compiler if supported, this makes the build much faster
  java32flags: function(){
    if (process.platform === "win32") return '';
    if (shell.exec('java -version -d32 2>&1', {silent: true}).code !== 0) return '';
    return ' -d32 -client';
  },


  //csp connect middleware
  csp: function(){
    return function(req, res, next){
      res.setHeader("X-WebKit-CSP", "default-src 'self';");
      res.setHeader("X-Content-Security-Policy", "default-src 'self'");
      next();
    };
  },


  //rewrite connect middleware
  rewrite: function(){
    return function(req, res, next){
      var REWRITE = /\/(guide|api|cookbook|misc|tutorial).*$/,
          IGNORED = /(\.(css|js|png|jpg)$|partials\/.*\.html$)/,
          match;

      if (!IGNORED.test(req.url) && (match = req.url.match(REWRITE))) {
        console.log('rewriting', req.url);
        req.url = req.url.replace(match[0], '/index.html');
      }
      next();
    };
  },

  parallelTask: function(name) {
    var args = [name, '--port=' + this.lastParallelTaskPort];

    if (grunt.option('browsers')) {
      args.push('--browsers=' + grunt.option('browsers'));
    }

    if (grunt.option('reporters')) {
      args.push('--reporters=' + grunt.option('reporters'));
    }

    this.lastParallelTaskPort++;


    return {grunt: true, args: args};
  },

  lastParallelTaskPort: 9876
};
