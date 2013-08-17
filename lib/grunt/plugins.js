var bower = require('bower');
var util = require('./utils.js');
var spawn = require('child_process').spawn;

module.exports = function(grunt) {

  grunt.registerMultiTask('min', 'minify JS files', function(){
    util.min.call(util, this.data, this.async());
  });


  grunt.registerTask('minall', 'minify all the JS files in parallel', function(){
    var files = grunt.config('min');
    files = Object.keys(files).map(function(key){ return files[key]; });
    grunt.util.async.forEach(files, util.min.bind(util), this.async());
  });


  grunt.registerMultiTask('build', 'build JS files', function(){
    util.build.call(util, this.data, this.async());
  });


  grunt.registerTask('buildall', 'build all the JS files in parallel', function(){
    var builds = grunt.config('build');
    builds = Object.keys(builds).map(function(key){ return builds[key]; });
    grunt.util.async.forEach(builds, util.build.bind(util), this.async());
  });


  grunt.registerMultiTask('write', 'write content to a file', function(){
    grunt.file.write(this.data.file, this.data.val);
    grunt.log.ok('wrote to ' + this.data.file);
  });


  grunt.registerMultiTask('docs', 'create angular docs', function(){
    var done = this.async();
    var files = this.data;
    var docs  = spawn('node', ['docs/src/gen-docs.js']);
    docs.stdout.pipe(process.stdout);
    docs.stderr.pipe(process.stderr);
    docs.on('exit', function(code){
      if(code !== 0) grunt.fail.warn('Error creating docs');
      grunt.file.expand(files).forEach(function(file){
        var content = util.process(grunt.file.read(file), grunt.config('NG_VERSION'), false);
        grunt.file.write(file, content);
      });
      grunt.log.ok('docs created');
      done();
    });
  });


  grunt.registerMultiTask('tests', '**Use `grunt test` instead**', function(){
    util.startKarma.call(util, this.data, true, this.async());
  });


  grunt.registerMultiTask('autotest', 'Run and watch the unit tests with Karma', function(){
    util.startKarma.call(util, this.data, false, this.async());
  });

  grunt.registerTask('collect-errors', 'Combine stripped error files', function () {
    util.collectErrors();
  });

  grunt.registerTask('bower', 'Install Bower packages.', function () {
    var done = this.async();

    bower.commands.install()
      .on('log', function (result) {
        grunt.log.ok('bower: ' + result.id + ' ' + result.data.endpoint.name);
      })
      .on('error', grunt.fail.warn.bind(grunt.fail))
      .on('end', done);
  });
};
