/**
 * All writing related code here. This is so that we can separate the async code from sync code
 * for testability
 */
var qfs = require('q-fs');
var Q = require('qq');
var OUTPUT_DIR = 'build/docs/';
var fs = require('fs');

exports.output = output;
function output(file, content) {
  var fullPath = OUTPUT_DIR + file;
  var dir = parent(fullPath);
  return Q.when(exports.makeDir(dir), function(error) {
    qfs.write(fullPath, exports.toString(content));
  });
};

//recursively create directory
exports.makeDir = function(p) {
  var parts = p.split(/\//);
  var path = ".";

  // Recursively rebuild directory structure
  return qfs.exists(p).
      then(function createPart(exists) {
        if(!exists && parts.length) {
          path += "/" + parts.shift();
          return qfs.exists(path).then(function(exists) {
            if (!exists) {
              return qfs.makeDirectory(path).then(createPart, createPart);
            } else {
              return createPart();
            }
          });
        }
      });
};

exports.copyTemplate = function(filename) {
  return exports.copy('docs/src/templates/' + filename, filename);
};

/* Copy files from one place to another.
 * @param from{string} path of the source file to be copied
 * @param to{string} path of where the copied file should be stored
 * @param  transform{function=} transfromation function to be applied before return
 */
exports.copy = function(from, to, transform) {
  var args = Array.prototype.slice.call(arguments, 3);

  // We have to use binary reading, Since some characters are unicode.
  return qfs.read(from, 'b').then(function(content) {
    if (transform) {
      args.unshift(content.toString());
      content = transform.apply(null, args);
    }
    return output(to, content);
  });
};


exports.symlink = symlink;
function symlink(from, to, type) {
  return qfs.exists(to).then(function(exists) {
    if (!exists) {
      return qfs.symbolicLink(to, from, type);
    }
  });
}


exports.symlinkTemplate = symlinkTemplate;
function symlinkTemplate(filename, type) {
  var dest = OUTPUT_DIR + filename,
      dirDepth = dest.split('/').length,
      src = Array(dirDepth).join('../') + 'docs/src/templates/' + filename;
  return symlink(src, dest, type);
}


/* Replace placeholders in content accordingly
 * @param content{string} content to be modified
 * @param replacements{obj} key and value pairs in which key will be replaced with value in content
 */
exports.replace = function(content, replacements) {
  for(key in replacements) {
    content = content.replace(key, replacements[key]);
  }
  return content;
}

exports.copyDir = function copyDir(dir) {
  return qfs.listTree('docs/' + dir).then(function(files) {
    files.forEach(function(file) {
      exports.copy(file, file.replace(/^docs\//, ''));
    });
  });
};

exports.merge = function(srcs, to) {
  return merge(srcs.map(function(src) { return 'docs/src/templates/' + src; }), to);
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

function parent(file) {
  var parts = file.split('/');
  parts.pop();
  return parts.join('/');
}


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


function noop() {};

