var shell = require('shelljs');
var util = require('./utils.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('min', 'minify JS files', function(){
    var file = this.data;
    var minFile = file.replace(/\.js$/, '.min.js');
    shell.exec('java -client -d32 -jar lib/closure-compiler/compiler.jar' + 
      ' --compilation_level SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT ' + 
      '--js '+file+' --js_output_file ' + minFile);
    grunt.file.write(minFile, util.singleStrict(grunt.file.read(minFile), '\n'));
    grunt.log.ok(file + ' minified into ' + minFile);
  });

  grunt.registerMultiTask('build', 'build JS files', function(){
    var files = grunt.file.expand(this.data.src);
    var styles = this.data.styles;
    //concat
    var src = files.map(function(filepath){
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf('\n'));
    //process
    var processed = util.process(src, grunt.config('NG_VERSION'), this.data.strict);
    if (styles) processed = util.addStyle(processed, styles.css, styles.minify);
    //write
    grunt.file.write(this.data.dest, processed);
    grunt.log.ok('File ' + this.data.dest + ' created.');
  });

  grunt.registerTask('zip', 'zip up build directory', function(){
    var zipname = 'angular-' + grunt.config('NG_VERSION').full + '.zip';
    shell.exec('zip -r ' + zipname + ' build', {silent: true});
    shell.mv(zipname, 'build/' + zipname);
    grunt.log.ok('zipped up angular build');
  });

  grunt.registerMultiTask('write', 'write content to a file', function(){
    grunt.file.write(this.data.file, this.data.val);
    grunt.log.ok('wrote to ' + this.data.file);
  });

  grunt.registerMultiTask('docs', 'create angular docs', function(){
    shell.exec('node docs/src/gen-docs.js');
    grunt.file.expand(this.data).forEach(function(file){
      grunt.file.write(file, util.process(grunt.file.read(file), grunt.config('NG_VERSION'), false));
    });
    grunt.log.ok('docs created');
  });

  grunt.registerMultiTask('test', 'Run the unit tests with testacular', function(){
    util.startTestacular(this.data, {
      singleRun: true, 
      browsers: grunt.option('in'),
      reporters: grunt.option('reporters')
      }, this.async());
  });

  grunt.registerMultiTask('autotest', 'Run and watch the unit tests with testacular', function(){
    util.startTestacular(this.data, {
    singleRun: false,
    browsers: grunt.option('in'),
    reporters: grunt.option('reporters')
    }, this.async());
  });
};