var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;
var semver = require('semver');
var _ = require('lodash');
var version, pkg;
var CSP_CSS_HEADER = '/* Include this file in your html if you are using the CSP mode. */\n\n';

var PORT_MIN = 8000;
var PORT_MAX = 9999;
var TRAVIS_BUILD_NUMBER = parseInt(process.env.TRAVIS_BUILD_NUMBER, 10);
var getRandomPorts = function() {
  if (!process.env.TRAVIS) {
    return [9876, 9877];
  }

  // Generate two numbers between PORT_MIN and PORT_MAX, based on TRAVIS_BUILD_NUMBER.
  return [
    PORT_MIN + (TRAVIS_BUILD_NUMBER % (PORT_MAX - PORT_MIN)),
    PORT_MIN + ((TRAVIS_BUILD_NUMBER + 100) % (PORT_MAX - PORT_MIN))
  ];
};

var getPackage = function() {
  if ( !pkg ) {

    // Search up the folder hierarchy for the first package.json    
    var packageFolder = path.resolve('.');
    while ( !fs.existsSync(path.join(packageFolder, 'package.json')) ) {
      var parent = path.dirname(packageFolder);
      if ( parent === packageFolder) { break; }
      packageFolder = parent;
    }
    pkg = JSON.parse(fs.readFileSync(path.join(packageFolder,'package.json'), 'UTF-8'));
  
  }

  return pkg;
};


module.exports = {

  init: function() {
    if (!process.env.TRAVIS) {
      shell.exec('npm install');
    }
  },


  getGitRepoInfo: function() {
    var GITURL_REGEX = /^https:\/\/github.com\/([^\/]+)\/(.+).git$/;
    var match = GITURL_REGEX.exec(getPackage().repository.url);
    var git = {
      owner: match[1],
      repo: match[2]
    };
    return git;
  },


  getVersion: function(){
    if (version) return version;

    try {

      var gitTag = getTagOfCurrentCommit();
      var semVerVersion, codeName, fullVersion;
      if (gitTag) {
        // tagged release
        fullVersion = semVerVersion = semver.valid(gitTag);
        codeName = getTaggedReleaseCodeName(gitTag);
      } else {
        // snapshot release
        semVerVersion = getSnapshotVersion();
        fullVersion = semVerVersion + '-' + getSnapshotSuffix();
        codeName = 'snapshot';
      }

      var versionParts = semVerVersion.match(/(\d+)\.(\d+)\.(\d+)/);

      version = {
        full: fullVersion,
        major: versionParts[1],
        minor: versionParts[2],
        dot: versionParts[3],
        codename: codeName,
        cdn: getPackage().cdnVersion
      };

      // Stable versions have an even minor version
      version.isStable = version.minor%2 === 0;

      return version;

    } catch (e) {
      grunt.fail.warn(e);
    }

    function getTagOfCurrentCommit() {
      var gitTagResult = shell.exec('git describe --exact-match', {silent:true});
      var gitTagOutput = gitTagResult.output.trim();
      var branchVersionPattern = new RegExp(getPackage().branchVersion.replace('.', '\\.').replace('*', '\\d+'));
      if (gitTagResult.code === 0 && gitTagOutput.match(branchVersionPattern)) {
        return gitTagOutput;
      } else {
        return null;
      }
    }

    function getTaggedReleaseCodeName(tagName) {
      var tagMessage = shell.exec('git cat-file -p '+ tagName +' | grep "codename"', {silent:true}).output;
      var codeName = tagMessage && tagMessage.match(/codename\((.*)\)/)[1];
      if (!codeName) {
        throw new Error("Could not extract release code name. The message of tag "+tagName+
          " must match '*codename(some release name)*'");
      }
      return codeName;
    }

    function getSnapshotVersion() {
      var oldTags = shell.exec('git tag -l v'+getPackage().branchVersion, {silent:true}).output.trim().split('\n');
      // ignore non semver versions.
      oldTags = oldTags.filter(function(version) {
        return version && semver.valid(version);
      });
      if (oldTags.length) {
        oldTags.sort(semver.compare);
        semVerVersion = oldTags[oldTags.length-1];
        if (semVerVersion.indexOf('-') !== -1) {
          semVerVersion = semver.inc(semVerVersion, 'prerelease');
        } else {
          semVerVersion = semver.inc(semVerVersion, 'patch');
        }
      } else {
        semVerVersion = semver.valid(getPackage().branchVersion.replace(/\*/g, '0'));
      }
      return semVerVersion;
    }

    function getSnapshotSuffix() {
      var jenkinsBuild = process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER || 'local';
      var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');
      return 'build.'+jenkinsBuild+'+sha.'+hash;
    }
  },

  getPreviousVersions: function() {
    var VERSION_REGEX = /([1-9]\d*)\.(\d+)\.(\d+)(?:-?rc\.?(\d+)|-(snapshot))?/;

    // Pad out a number with zeros at the front to make it `digits` characters long
    function pad(num, digits) {
      var zeros = Array(digits+1).join('0');
      return (zeros+num).slice(-digits);
    }

    function padVersion(version) {
      // We pad out the version numbers with 0s so they sort nicely
      // - Non-Release Candidates get 9999 for their release candidate section to make them appear earlier
      // - Snapshots get 9 added to the front to move them to the top of the list
      var maxLength = 4;
      var padded = (version.snapshot ? '9' : '0') + pad(version.major, maxLength) +
                    pad(version.minor, maxLength) + pad(version.dot, maxLength) +
                    pad(version.rc || 9999, maxLength);
      return padded;
    }

    function getVersionFromTag(tag) {
      var match = VERSION_REGEX.exec(tag);
      if ( match ) {
        var version = {
          tag: tag,
          major: match[1], minor: match[2], dot: match[3], rc: match[4],
          snapshot: !!match[5] && getSnapshotSuffix()
        };

        if(version.snapshot) {
          version.full = version.major + '.' + version.minor + '.x (edge)';
        } else {
          version.full = version.major + '.' + version.minor + '.' + version.dot +
                        (version.rc ? '-rc.' + version.rc : '');
        }

        // Stable versions have an even minor version and are not a release candidate
        version.isStable = !(version.minor%2 || version.rc);

        // Versions before 1.0.2 had a different docs folder name
        version.docsUrl = 'http://code.angularjs.org/' + version.full + '/docs';
        if ( version.major < 1 || (version.major === 1 && version.minor === 0 && version.dot < 2 ) ) {
          version.docsUrl += '-' + version.full;
        }

        return version;
      }
    }

    var tags = shell.exec('git tag', {silent: true}).output.split(/\s*\n\s*/);
    return _(tags)
      .map(getVersionFromTag)
      .filter()  // getVersion can map to undefined - this clears those out
      .sortBy(padVersion)
      .value();
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
      js = "!angular.$$csp() && angular.element(document).find('head').prepend('<style type=\"text/css\">" + css + "</style>');";
      state.js.push(js);

      return state;
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
    var versionNumber = this.getVersion().full;
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
      res.setHeader("Content-Security-Policy", "default-src 'self'");
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
  sauceLabsAvailablePorts: [9000, 9001, 9080, 9090, 9876],
  // pseudo-random port numbers for BrowserStack
  availablePorts: getRandomPorts()
};
