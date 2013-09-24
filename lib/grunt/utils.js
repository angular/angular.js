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
    var match = package.version.match(/^([^\-]*)(?:\-(.+))?$/);
    var semver = match[1].split('.');
    var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');

    var fullVersion = match[1];

    if (match[2]) {
      fullVersion += '-';
      fullVersion += (match[2] == 'snapshot') ? hash : match[2];
    }

    version = {
      full: fullVersion,
      major: semver[0],
      minor: semver[1],
      dot: semver[2].replace(/rc\d+/, ''),
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
      if(code !== 0) grunt.fail.warn("Karma test(s) failed. Exit code: " + code);
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
      return "angular.element(document).find('head').prepend('<style type=\"text/css\">" + css + "</style>');";
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


  singleStrict: function(src, insert){
    return src
      .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
      .replace(/(\(function\([^)]*\)\s*\{)/, "$1'use strict';"); // add single strict mode flag
  },


  sourceMap: function(mapFile, fileContents) {
    var sourceMapLine = '//# sourceMappingURL=' + mapFile + '\n';
    return fileContents + sourceMapLine;
  },


  min: function(file, done) {
    var classPathSep = (process.platform === "win32") ? ';' : ':';
    var minFile = file.replace(/\.js$/, '.min.js');
    var mapFile = minFile + '.map';
    var mapFileName = mapFile.match(/[^\/]+$/)[0];
    var errorFileName = file.replace(/\.js$/, '-errors.json');
    var versionNumber = this.getVersion().number;
    shell.exec(
        'java ' +
            this.java32flags() + ' ' +
            '-Xmx2g ' +
            '-cp bower_components/closure-compiler/compiler.jar' + classPathSep +
            'bower_components/ng-closure-runner/ngcompiler.jar ' +
            'org.angularjs.closurerunner.NgClosureRunner ' +
            '--compilation_level SIMPLE_OPTIMIZATIONS ' +
            '--language_in ECMASCRIPT5_STRICT ' +
            '--minerr_pass ' +
            '--minerr_errors ' + errorFileName + ' ' +
            '--minerr_url http://errors.angularjs.org/' + versionNumber + '/ ' +
            '--source_map_format=V3 ' +
            '--create_source_map ' + mapFile + ' ' +
            '--js ' + file + ' ' +
            '--js_output_file ' + minFile,
      function(code) {
        if (code !== 0) grunt.fail.warn('Error minifying ' + file);

        // closure creates the source map relative to build/ folder, we need to strip those references
        grunt.file.write(mapFile, grunt.file.read(mapFile).replace('"file":"build/', '"file":"').
                                                           replace('"sources":["build/','"sources":["'));

        // move add use strict into the closure + add source map pragma
        grunt.file.write(minFile, this.sourceMap(mapFileName, this.singleStrict(grunt.file.read(minFile), '\n')));
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


  //collects and combines error messages stripped out in minify step
  collectErrors: function () {
    var combined = {
      id: 'ng',
      generated: new Date().toString(),
      errors: {}
    };
    grunt.file.expand('build/*-errors.json').forEach(function (file) {
      var errors = grunt.file.readJSON(file),
        namespace;
      Object.keys(errors).forEach(function (prop) {
        if (typeof errors[prop] === 'object') {
          namespace = errors[prop];
          if (combined.errors[prop]) {
            Object.keys(namespace).forEach(function (code) {
              if (combined.errors[prop][code] && combined.errors[prop][code] !== namespace[code]) {
                grunt.warn('[collect-errors] Duplicate minErr codes don\'t match!');
              } else {
                combined.errors[prop][code] = namespace[code];
              }
            });
          } else {
            combined.errors[prop] = namespace;
          }
        } else {
          if (combined.errors[prop] && combined.errors[prop] !== errors[prop]) {
            grunt.warn('[collect-errors] Duplicate minErr codes don\'t match!');
          } else {
            combined.errors[prop] = errors[prop];
          }
        }
      });
    });
    grunt.file.write('build/errors.json', JSON.stringify(combined));
    grunt.file.expand('build/*-errors.json').forEach(grunt.file.delete);
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
      var REWRITE = /\/(guide|api|cookbook|misc|tutorial|error).*$/,
          IGNORED = /(\.(css|js|png|jpg)$|partials\/.*\.html$)/,
          match;

      if (!IGNORED.test(req.url) && (match = req.url.match(REWRITE))) {
        console.log('rewriting', req.url);
        req.url = req.url.replace(match[0], '/index.html');
      }
      next();
    };
  },

  parallelTask: function(args, options) {
    var task = {
      grunt: true,
      args: args,
      stream: options && options.stream
    };

    args.push('--port=' + this.sauceLabsAvailablePorts.pop());

    if (args.indexOf('test:e2e') !== -1 && grunt.option('e2e-browsers')) {
      args.push('--browsers=' + grunt.option('e2e-browsers'));
    } else if (grunt.option('browsers')) {
      args.push('--browsers=' + grunt.option('browsers'));
    }

    if (grunt.option('reporters')) {
      args.push('--reporters=' + grunt.option('reporters'));
    }

    return task;
  },

  // see http://saucelabs.com/docs/connect#localhost
  sauceLabsAvailablePorts: [9000, 9001, 9080, 9090, 9876]
};
