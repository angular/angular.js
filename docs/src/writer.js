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

exports.output = function(file, content, callback){
  //console.log('writing', OUTPUT_DIR + file, '...');
  fs.writeFile(
      OUTPUT_DIR + file,
      exports.toString(content),
      callback);
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
  (function next(){
    if (parts.length) {
      path += '/' + parts.shift();
      fs.mkdir(path, 0777, next);
    } else {
      callback();
    }
  })();
};

exports.copy = function(filename, callback){
  //console.log('writing', OUTPUT_DIR + filename, '...');
  fs.readFile('docs/src/templates/' + filename, function(err, content){
    if (err) return callback.error(err);
    fs.writeFile(
        OUTPUT_DIR + filename,
        content,
        callback);
  });
};
