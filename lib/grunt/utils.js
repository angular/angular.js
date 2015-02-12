'use strict';

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;
var semver = require('semver');

var _ = require('lodash');

var CSP_CSS_HEADER = '/* Include this file in your html if you are using the CSP mode. */\n\n';


module.exports = {

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


  updateWebdriver: function(done){
    if (process.env.TRAVIS) {
      // Skip the webdriver-manager update on Travis, since the browsers will
      // be provided remotely.
      done();
      return;
    }
    var p = spawn('node', ['node_modules/protractor/bin/webdriver-manager', 'update']);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on('exit', function(code){
      if(code !== 0) grunt.fail.warn('Webdriver failed to update');
      done();
    });
  },

  startProtractor: function(config, done){
    var sauceUser = grunt.option('sauceUser');
    var sauceKey = grunt.option('sauceKey');
    var tunnelIdentifier = grunt.option('capabilities.tunnel-identifier');
    var sauceBuild = grunt.option('capabilities.build');
    var browser = grunt.option('browser');
    var specs = grunt.option('specs');
    var args = ['node_modules/protractor/bin/protractor', config];
    if (sauceUser) args.push('--sauceUser=' + sauceUser);
    if (sauceKey) args.push('--sauceKey=' + sauceKey);
    if (tunnelIdentifier) args.push('--capabilities.tunnel-identifier=' + tunnelIdentifier);
    if (sauceBuild) args.push('--capabilities.build=' + sauceBuild);
    if (specs) args.push('--specs=' + specs);
    if (browser) {
      args.push('--browser=' + browser);
    }


    var p = spawn('node', args);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on('exit', function(code){
      if(code !== 0) grunt.fail.warn('Protractor test(s) failed. Exit code: ' + code);
      done();
    });
  },


  wrap: function(src, name){
    src.unshift('src/' + name + '.prefix');
    src.push('src/' + name + '.suffix');
    return src;
  },


  addStyle: function(src, styles, minify){
    styles = styles.reduce(processCSS.bind(this), {
      js: [src],
      css: []
    });
    return {
      js: styles.js.join('\n'),
      css: styles.css.join('\n')
    };

    function processCSS(state, file) {
      var css = fs.readFileSync(file).toString(),
        js;
      state.css.push(css);

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
      js = "!window.angular.$$csp() && window.angular.element(document).find('head').prepend('<style type=\"text/css\">" + css + "</style>');";
      state.js.push(js);

      return state;
    }
  },


  process: function(src, NG_VERSION, strict){
    var processed = src
      .replace(/"NG_VERSION_FULL"/g, NG_VERSION.full)
      .replace(/"NG_VERSION_MAJOR"/, NG_VERSION.major)
      .replace(/"NG_VERSION_MINOR"/, NG_VERSION.minor)
      .replace(/"NG_VERSION_DOT"/, NG_VERSION.patch)
      .replace(/"NG_VERSION_CDN"/, NG_VERSION.cdn)
      .replace(/"NG_VERSION_CODENAME"/, NG_VERSION.codeName);
    if (strict !== false) processed = this.singleStrict(processed, '\n\n', true);
    return processed;
  },


  build: function(config, fn){
    var files = grunt.file.expand(config.src);
    var styles = config.styles;
    var processedStyles;
    //concat
    var src = files.map(function(filepath) {
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf('\n'));
    //process
    var processed = this.process(src, grunt.config('NG_VERSION'), config.strict);
    if (styles) {
      processedStyles = this.addStyle(processed, styles.css, styles.minify);
      processed = processedStyles.js;
      if (config.styles.generateCspCssFile) {
        grunt.file.write(removeSuffix(config.dest) + '-csp.css', CSP_CSS_HEADER + processedStyles.css);
      }
    }
    //write
    grunt.file.write(config.dest, processed);
    grunt.log.ok('File ' + config.dest + ' created.');
    fn();

    function removeSuffix(fileName) {
      return fileName.replace(/\.js$/, '');
    }
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
    var versionNumber = grunt.config('NG_VERSION').full;
    var compilationLevel = (file === 'build/angular-messageFormat.js') ?
        'ADVANCED_OPTIMIZATIONS' : 'SIMPLE_OPTIMIZATIONS';
    shell.exec(
        'java ' +
            this.java32flags() + ' ' +
            '-Xmx2g ' +
            '-cp bower_components/closure-compiler/compiler.jar' + classPathSep +
            'bower_components/ng-closure-runner/ngcompiler.jar ' +
            'org.angularjs.closurerunner.NgClosureRunner ' +
            '--compilation_level ' + compilationLevel + ' ' +
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
  conditionalCsp: function(){
    return function(req, res, next){
      var CSP = /\.csp\W/;

      if (CSP.test(req.url)) {
        res.setHeader("X-WebKit-CSP", "default-src 'self';");
        res.setHeader("X-Content-Security-Policy", "default-src 'self'");
        res.setHeader("Content-Security-Policy", "default-src 'self'");
      }
      next();
    };
  },


  //rewrite connect middleware
  rewrite: function(){
    return function(req, res, next){
      var REWRITE = /\/(guide|api|cookbook|misc|tutorial|error).*$/,
          IGNORED = /(\.(css|js|png|jpg|gif)$|partials\/.*\.html$)/,
          match;

      if (!IGNORED.test(req.url) && (match = req.url.match(REWRITE))) {
        console.log('rewriting', req.url);
        req.url = req.url.replace(match[0], '/index.html');
      }
      next();
    };
  }
};
