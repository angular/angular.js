var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var bower = require('bower');
var docGenerator = require('dgeni');
var merge = require('event-stream').merge;


// We indicate to gulp that tasks are async by returning the stream.
// Gulp can then wait for the stream to close before starting dependent tasks.
// See clean and bower for async tasks, and see assets and doc-gen for dependent tasks below

var outputFolder = '../build/docs';
var bowerFolder = '../bower_components';

gulp.task('bower', function() {
  return bower.commands.install();
});

gulp.task('build-app', function() {
  gulp.src('app/src/**/*.js')
    .pipe(concat('docs.js'))
    .pipe(gulp.dest(outputFolder + '/js/'));
});

gulp.task('assets', ['bower'], function() {
  return merge(
    gulp.src(['app/assets/**/*']).pipe(gulp.dest(outputFolder)),
    gulp.src(bowerFolder + '/bootstrap/**/*').pipe(gulp.dest(outputFolder + '/components/bootstrap')),
    gulp.src(bowerFolder + '/open-sans-fontface/**/*').pipe(gulp.dest(outputFolder + '/components/open-sans-fontface')),
    gulp.src(bowerFolder + '/lunr.js/*.js').pipe(gulp.dest(outputFolder + '/components/lunr.js')),
    gulp.src(bowerFolder + '/google-code-prettify/**/*').pipe(gulp.dest(outputFolder + '/components/google-code-prettify/')),
    gulp.src(bowerFolder + '/jquery/*.js').pipe(gulp.dest(outputFolder + '/components/jquery')),
    gulp.src('../node_modules/marked/**/*.js').pipe(gulp.dest(outputFolder + '/components/marked'))
  );
});


gulp.task('doc-gen', function() {
  return docGenerator('docs.config.js').generateDocs();
});

// JSHint the example and protractor test files
gulp.task('jshint', ['doc-gen'], function() {
  gulp.src([outputFolder + '/ptore2e/**/*.js', outputFolder + '/examples/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


// The default task that will be run if no task is supplied
gulp.task('default', ['assets', 'doc-gen', 'build-app', 'jshint']);

