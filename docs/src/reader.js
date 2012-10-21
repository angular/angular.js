/**
 * All reading related code here. This is so that we can separate the async code from sync code
 * for testability
 */

exports.collect = collect;

var ngdoc = require('./ngdoc.js'),
    Q = require('qq'),
    qfs = require('q-fs'),
    PATH = require('path');

var NEW_LINE = /\n\r?/;

function collect() {
  var allDocs = [];

  //collect docs in JS Files
  var path = 'src';
  var promiseA = Q.when(qfs.listTree(path), function(files) {
    var done;
    //read all files in parallel.
    files.forEach(function(file) {
      var work;
      if(/\.js$/.test(file)) {
        work = Q.when(qfs.read(file, 'b'), function(content) {
          processJsFile(content, file).forEach (function(doc) {
            allDocs.push(doc);
          });
        });
      }
      done = Q.when(done, function() {
        return work;
      });
    });
    return done;
  });

   //collect all ng Docs in Content Folder
   var path2 = 'docs/content';
   var promiseB = Q.when(qfs.listTree(path2), function(files){
     var done2;
     files.forEach(function(file) {
       var work2;
       if (file.match(/\.ngdoc$/)) {
         work2 = Q.when(qfs.read(file, 'b'), function(content){
            var section = '@section ' + file.split(PATH.sep)[2] + '\n';
            allDocs.push(new ngdoc.Doc(section + content.toString(),file, 1).parse());
          });
       }
       done2 = Q.when(done2, function() {
         return work2;
       });
     });
     return done2;
   });

  return Q.join(promiseA, promiseB, function() {
    return allDocs;
  });
}

function processJsFile(content, file) {
  var docs = [];
  var lines = content.toString().split(NEW_LINE);
  var text;
  var startingLine ;
  var match;
  var inDoc = false;

  lines.forEach(function(line, lineNumber){
    lineNumber++;
    // is the comment starting?
    if (!inDoc && (match = line.match(/^\s*\/\*\*\s*(.*)$/))) {
      line = match[1];
      inDoc = true;
      text = [];
      startingLine = lineNumber;
    }
    // are we done?
    if (inDoc && line.match(/\*\//)) {
      text = text.join('\n');
      text = text.replace(/^\n/, '');
      if (text.match(/@ngdoc/)){
        //console.log(file, startingLine)
        docs.push(new ngdoc.Doc('@section api\n' + text, file, startingLine).parse());
      }
      doc = null;
      inDoc = false;
    }
    // is the comment add text
    if (inDoc){
      text.push(line.replace(/^\s*\*\s?/, ''));
    }
  });
  return docs;
}
