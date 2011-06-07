/**
 * All reading related code here. This is so that we can separate the async code from sync code
 * for testability
 */
require.paths.push(__dirname);
var fs       = require('fs'),
    callback = require('callback');

var NEW_LINE = /\n\r?/;

function collect(callback){
   findJsFiles('src', callback.waitMany(function(file) {
     console.log('reading', file, '...');
     findNgDocInJsFile(file, callback.waitMany(function(doc, line) {
       callback('@section api\n' + doc, file, line);
    }));
  }));
  findNgDocInDir('docs/content', callback.waitMany(callback));
  callback.done();
}

function findJsFiles(dir, callback){
  fs.readdir(dir, callback.waitFor(function(err, files){
    if (err) return this.error(err);
    files.forEach(function(file){
      var path = dir + '/' + file;
      fs.lstat(path, callback.waitFor(function(err, stat){
        if (err) return this.error(err);
        if (stat.isDirectory())
          findJsFiles(path, callback.waitMany(callback));
        else if (/\.js$/.test(path))
          callback(path);
      }));
    });
    callback.done();
  }));
}

function findNgDocInDir(directory, docNotify) {
  fs.readdir(directory, docNotify.waitFor(function(err, files){
    if (err) return this.error(err);
    files.forEach(function(file){
      fs.stat(directory + '/' + file, docNotify.waitFor(function(err, stats){
        if (err) return this.error(err);
        if (stats.isFile()) {
          console.log('reading', directory + '/' + file, '...');
          fs.readFile(directory + '/' + file, docNotify.waitFor(function(err, content){
            if (err) return this.error(err);
            var section = '@section ' + directory.split('/').pop() + '\n';
            docNotify(section + content.toString(), directory + '/' +file, 1);
          }));
        } else if(stats.isDirectory()) {
          findNgDocInDir(directory + '/' + file, docNotify.waitFor(docNotify));
        }
      }));
    });
    docNotify.done();
  }));
}

function findNgDocInJsFile(file, callback) {
  fs.readFile(file, callback.waitFor(function(err, content){
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
          callback(text, startingLine);
        }
        doc = null;
        inDoc = false;
      }
      // is the comment add text
      if (inDoc){
        text.push(line.replace(/^\s*\*\s?/, ''));
      }
    });
    callback.done();
  }));
}



exports.collect = collect;
