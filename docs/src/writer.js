/**
 * All writing related code here. This is so that we can separate the async code from sync code
 * for testability
 */
var pathUtils = require('path');
var qfs = require('q-fs');
var Q = require('qq');
var OUTPUT_DIR = pathUtils.join('build','docs');
var TEMPLATES_DIR = pathUtils.join('docs','src','templates');
var fs = require('fs');

exports.output = output;
function output(file, content) {
  var fullPath = pathUtils.join(OUTPUT_DIR,file);
  var dir = pathUtils.dirname(fullPath);
  return Q.when(exports.makeDir(dir), function () {
    return qfs.write(fullPath, exports.toString(content));
  });
}

//recursively create directory
exports.makeDir = function(p) {
 p = pathUtils.normalize(p);
 var parts = p.split(pathUtils.sep);

 var makePartialDir = function makePartialDir(path) {
   return qfs.makeDirectory(path).then(function() {
     if (parts.length) {
       return makePartialDir(pathUtils.join(path, parts.shift()));
     }
   }, function(error) {
     if (error.code !== 'EEXIST') {
       throw error;
     }
     if (parts.length) {
       return makePartialDir(pathUtils.join(path, parts.shift()));
     }
   });
 };

 return makePartialDir(pathUtils.join('.', parts.shift()));
};

exports.copyTemplate = function(filename) {
  // Don't need to normalize here as `exports.copy` will do it for us
  return exports.copy(pathUtils.join(TEMPLATES_DIR,filename), filename);
};

/* Copy files from one place to another.
 * @param from{string} path of the source file to be copied
 * @param to{string} path of where the copied file should be stored
 * @param  transform{function=} transfromation function to be applied before return
 */
exports.copy = function(from, to, transform) {
  var transformArgs = Array.prototype.slice.call(arguments, 3);

  from = pathUtils.normalize(from);
  to = pathUtils.normalize(to);

  // We have to use binary reading, Since some characters are unicode.
  return qfs.read(from, 'b').then(function(content) {
    if (transform) {
      // Pass any extra arguments, e.g.
      // `copy(from, to, transform, extra1, extra2, ...)`
      // to the transform function
      transformArgs.unshift(content.toString());
      content = transform.apply(null, transformArgs);
    }
    return output(to, content);
  });
};


exports.symlink = symlink;
function symlink(from, to, type) {
  // qfs will normalize the path arguments for us here
  return qfs.exists(to).then(function(exists) {
    if (!exists) {
      return qfs.symbolicLink(to, from, type);
    }
  });
}


exports.symlinkTemplate = symlinkTemplate;
function symlinkTemplate(filename, type) {
  // pathUtils.join will normalize the filename for us
  var dest = pathUtils.join(OUTPUT_DIR, filename),
      dirDepth = dest.split(pathUtils.sep).length,
      src = pathUtils.join(Array(dirDepth).join('..' + pathUtils.sep), TEMPLATES_DIR, filename);
  return symlink(src, dest, type);
}


/* Replace placeholders in content accordingly
 * @param content{string} content to be modified
 * @param replacements{obj} key and value pairs in which key will be replaced with value in content
 */
exports.replace = function(content, replacements) {
  for(var key in replacements) {
    content = content.replace(key, replacements[key]);
  }
  return content;
};

exports.copyDir = function copyDir(from, to) {
  from = pathUtils.normalize(from);
  to = pathUtils.normalize(to);
  return qfs.listTree(from).then(function(files) {
    files.forEach(function(file) {
      var path = to ? file.replace(from, to) : from;
      // Not sure why this next line is here...
      path = path.replace('/docs/build', '');
      exports.copy(file, path);
    });
  });
};

exports.merge = function(srcs, to) {
  // pathUtils.join will normalize each of the srcs inside the mapping
  to = pathUtils.normalize(to);
  return merge(srcs.map(function(src) { return pathUtils.join(TEMPLATES_DIR, src); }), to);
};

function merge(srcs, to) {
  var contents = [];
  //Sequentially read file
  var done;
  srcs.forEach(function(src) {
    done = Q.when(done, function(content) {
      if(content) contents.push(content);
      return qfs.read(src, 'b');
    });
  });

  // write to file
  return Q.when(done, function(content) {
    contents.push(content);
    return output(to, contents.join('\n'));
  });
}

//----------------------- Synchronous Methods ----------------------------------

exports.toString = function toString(obj) {
  switch (typeof obj) {
  case 'string':
    return obj;
  case 'object':
    if (obj instanceof Array) {
      obj.forEach(function(value, key) {
        obj[key] = toString(value);
      });
      return obj.join('');
    } else if (obj.constructor.name == 'Buffer'){
      // do nothing it is Buffer Object
    } else {
      return JSON.stringify(obj);
    }
  }
  return obj;
};


function noop() {}

