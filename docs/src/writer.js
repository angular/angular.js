/**
 * All writing related code here. This is so that we can separate the async code from sync code
 * for testability
 */
require.paths.push(__dirname);
var fs         = require('fs');
var OUTPUT_DIR = "build/docs/";

function output(docs, content, callback){
  callback();
}

function parent(file) {
  var parts = file.split('/');
  parts.pop();
  return parts.join('/');
}

exports.output = function(file, content, callback){
  console.log('write', file);
  exports.makeDir(parent(OUTPUT_DIR + file), callback.waitFor(function(){
    fs.writeFile(
        OUTPUT_DIR + file,
        exports.toString(content),
        callback);
  }));
};


exports.toString = function toString(obj){
  switch (typeof obj) {
  case 'string':
    return obj;
  case 'object':
    if (obj instanceof Array) {
      obj.forEach(function (value, key){
        obj[key] = toString(value);
      });
      return obj.join('');
    } else {
      return JSON.stringify(obj);
    }
  }
  return obj;
};

exports.makeDir = function (path, callback) {
  var parts = path.split(/\//);
  path = '.';
  (function next(error){
    if (error && error.code != 'EEXIST') return callback.error(error);
    if (parts.length) {
      path += '/' + parts.shift();
      fs.mkdir(path, 0777, next);
    } else {
      callback();
    }
  })();
};

exports.copyTpl = function(filename, callback) {
  exports.copy('docs/src/templates/' + filename, OUTPUT_DIR + filename, callback);
};

exports.copy = function(from, to, callback, replacementKey, replacement) {
  //console.log('writing', to, '...');
  fs.readFile(from, function(err, content){
    if (err) return callback.error(err);
    if(replacementKey && replacement) {
      content = content.toString().replace(replacementKey, replacement);
    }
    fs.writeFile(to, content, callback);
  });
};

exports.copyDir = function copyDir(dir, callback) {
  exports.makeDir(OUTPUT_DIR + '/' + dir, callback.waitFor(function(){
    fs.readdir('docs/' + dir, callback.waitFor(function(err, files){
      if (err) return this.error(err);
      files.forEach(function(file){
        var path = 'docs/' + dir + '/' + file;
        fs.stat(path, callback.waitFor(function(err, stat) {
          if (err) return this.error(err);
          if (stat.isDirectory()) {
            copyDir(dir + '/' + file, callback.waitFor());
          } else {
            exports.copy(path, OUTPUT_DIR  + '/' + dir + '/' + file, callback.waitFor());
          }
        }));
      });
      callback();
    }));
  }));
};


exports.merge = function(srcs, to, callback){
  merge(srcs.map(function(src) { return 'docs/src/templates/' + src; }), OUTPUT_DIR + to, callback);
};

function merge(srcs, to, callback) {
  var content = [];
  srcs.forEach(function (src) {
    content.push(fs.readFileSync(src));
  });
  fs.writeFile(to, content.join('\n'), callback.waitFor());
}
