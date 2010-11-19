require.paths.push("./lib");
require.paths.push(__dirname);
var fs       = require('fs'),
    spawn    = require('child_process').spawn,
    mustache = require('mustache'),
    callback = require('callback'),
    Showdown = require('showdown').Showdown;

var documentation = {
    pages:[],
    byName: {}
};
var keywordPages = [];


var SRC_DIR = "docs/";
var OUTPUT_DIR = "build/docs/";
var NEW_LINE = /\n\r?/;

var work = callback.chain(function () {
  console.log('Parsing Angular Reference Documentation');
  mkdirPath(OUTPUT_DIR, work.waitFor(function(){
    findJsFiles('src', work.waitMany(function(file) {
      //console.log('reading', file, '...');
      findNgDoc(file, work.waitMany(function(doc) {
        parseNgDoc(doc);
        processNgDoc(documentation, doc);
      }));
    }));
  }));
}).onError(function(err){
  console.log('ERROR:', err.stack || err);
}).onDone(function(){
  keywordPages.sort(function(a,b){
    // supper ugly comparator that orders all utility methods and objects before all the other stuff
    // like widgets, directives, services, etc.
    // Mother of all beatiful code please forgive me for the sin that this code certainly is.

    if (a.name === b.name) return 0;
    if (a.name === 'angular') return -1;
    if (b.name === 'angular') return 1;

    function namespacedName(page) {
      return (page.name.match(/\./g).length === 1 && page.type !== 'overview' ? '0' : '1') + page.name;
    }

    var namespacedA = namespacedName(a),
        namespacedB = namespacedName(b);

    return namespacedA < namespacedB ? -1 : 1;
  });
  writeDoc(documentation.pages);
  mergeTemplate('docs-data.js', 'docs-data.js', {JSON:JSON.stringify(keywordPages)}, callback.chain());
  mergeTemplate('docs-scenario.js', 'docs-scenario.js', documentation, callback.chain());
  copy('docs-scenario.html', callback.chain());
  copy('index.html', callback.chain());
  copy('docs.css', callback.chain());
  mergeTemplate('docs.js', 'docs.js', documentation, callback.chain());
  mergeTemplate('doc_widgets.css', 'doc_widgets.css', documentation, callback.chain());
  mergeTemplate('doc_widgets.js', 'doc_widgets.js', documentation, callback.chain());
  console.log('DONE');
});
if (!this.testmode) work();
////////////////////

function keywords(text){
  var keywords = {};
  var words = [];
  var tokens = text.toLowerCase().split(/[,\.\`\'\"\s]+/mg);
  tokens.forEach(function(key){
    var match = key.match(/^(([a-z]|ng\:)[\w\_\-]{2,})/);
    if (match){
      key = match[1];
      if (!keywords[key]) {
        keywords[key] = true;
        words.push(key);
      }
    }
  });
  words.sort();
  return words.join(' ');
}

function noop(){}
function mkdirPath(path, callback) {
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
}

function copy(name, callback){
  fs.readFile(SRC_DIR + name, callback.waitFor(function(err, content){
    if (err) return this.error(err);
    fs.writeFile(OUTPUT_DIR + name, content, callback);
  }));
}

function mergeTemplate(template, output, doc, callback){
  fs.readFile(SRC_DIR + template,
    callback.waitFor(function(err, template){
      if (err) return this.error(err);
      var content = mustache.to_html(template.toString(), doc);
      fs.writeFile(OUTPUT_DIR + output, content, callback);
    }));
}


function trim(text) {
  var MAX = 9999;
  var empty = RegExp.prototype.test.bind(/^\s*$/);
  var lines = text.split('\n');
  var minIndent = MAX;
  lines.forEach(function(line){
    minIndent = Math.min(minIndent, indent(line));
  });
  for ( var i = 0; i < lines.length; i++) {
    lines[i] = lines[i].substring(minIndent);
  }
  // remove leading lines
  while (empty(lines[0])) {
    lines.shift();
  }
  // remove trailing
  while (empty(lines[lines.length - 1])) {
    lines.pop();
  }
  return lines.join('\n');
  
  function indent(line) {
    for(var i = 0; i < line.length; i++) {
      if (line.charAt(i) != ' ')  {
        return i;
      }
    }
    return MAX;
  }
}

function unknownTag(doc, name) {
  var error = "[" + doc.raw.file + ":" + doc.raw.line + "]: unknown tag: " + name;
  console.log(error);
  throw new Error(error);
}

function valueTag(doc, name, value) {
  doc[name] = value;
}

function escapedHtmlTag(doc, name, value) {
  doc[name] = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function markdownTag(doc, name, value) {
  doc[name] = markdown(value.replace(/^#/gm, '##')).
    replace(/\<pre\>/gmi, '<div ng:non-bindable><pre class="brush: js; html-script: true;">').
    replace(/\<\/pre\>/gmi, '</pre></div>');
}

R_LINK = /{@link ([^\s}]+)((\s|\n)+(.+?))?\s*}/m
        //       1       123     3 4     42

function markdown(text) {
  var parts = text.split(/(<pre>[\s\S]*?<\/pre>)/),
      match;

  parts.forEach(function(text, i){
    if (!text.match(/^<pre>/)) {
      text = text.replace(/<angular\/>/gm, '<tt>&lt;angular/&gt;</tt>');
      text = new Showdown.converter().makeHtml(text);

      while (match = text.match(R_LINK)) {
        text = text.replace(match[0], '<a href="#!' + match[1] + '"><code>' +
                                        (match[4] || match[1]) +
                                      '</code></a>');
      }

      parts[i] = text;
    }
  });
  return parts.join('');
}

function markdownNoP(text) {
  var lines = markdown(text).split(NEW_LINE);
  var last = lines.length - 1;
  lines[0] = lines[0].replace(/^<p>/, '');
  lines[last] = lines[last].replace(/<\/p>$/, '');
  return lines.join('\n');
}

function requiresTag(doc, name, value) {
  doc.requires = doc.requires || [];
  doc.requires.push({name: value});
}

function propertyTag(doc, name, value) {
  doc[name] = doc[name] || [];
  var match = value.match(/^({(\S+)}\s*)?(\S+)(\s+(.*))?/);
  
  if (match) {
    var tag = {
      type: match[2],
      name: match[3],
      description: match[5] || false
    };
  } else {
    throw "[" + doc.raw.file + ":" + doc.raw.line +
          "]: @" + name + " must be in format '{type} name description' got: " + value;
  }
  return doc[name].push(tag);
}

function returnsTag(doc, name, value) {
  var match = value.match(/^{(\S+)}\s+(.*)?/);
  
  if (match) {
    var tag = {
      type: match[1],
      description: markdownNoP(match[2]) || false
    };
  } else {
    throw "[" + doc.raw.file + ":" + doc.raw.line +
          "]: @" + name + " must be in format '{type} description' got: " + value;
  }
  return doc[name] = tag;
}

var TAG = {
  ngdoc: valueTag,
  example: escapedHtmlTag,
  scenario: valueTag,
  namespace: valueTag,
  css: valueTag,
  see: valueTag,
  deprecated: valueTag,
  workInProgress: function(doc, name, value) {
    doc[name] = {description: markdown(value)};
  },
  usageContent: valueTag,
  'function': valueTag,
  description: markdownTag,
  TODO: markdownTag,
  paramDescription: markdownTag,
  exampleDescription: markdownTag,
  element: valueTag,
  methodOf: valueTag,
  name: function(doc, name, value) {
    doc.name = value;
    doc.shortName  = value.split(/\./).pop();
    doc.depth = value.split(/\./).length - 1;
  },
  param: function(doc, name, value){
    doc.param = doc.param || [];
    doc.paramRest = doc.paramRest || [];
    var match = value.match(/^{([^}=]+)(=)?}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
                           //  1      12 2     34       4   5   5 6      6  3   7  7
    if (match) {
      var param = {
          type: match[1],
          name: match[5] || match[4],
          optional: !!match[2],
          'default':match[6],
          description:markdownNoP(value.replace(match[0], match[7]))
        };
      doc.param.push(param);
      if (!doc.paramFirst) {
        doc.paramFirst = param;
      } else {
        doc.paramRest.push(param);
      }
    } else {
      throw "[" + doc.raw.file + ":" + doc.raw.line +
            "]: @param must be in format '{type} name=value description' got: " + value;
    }
  },
  property: propertyTag,
  requires: requiresTag,
  returns: returnsTag
};

function parseNgDoc(doc){
  var atName;
  var atText;
  var match;
  doc.raw.text.split(NEW_LINE).forEach(function(line, lineNumber){
    if (match = line.match(/^\s*@(\w+)(\s+(.*))?/)) {
      // we found @name ...
      // if we have existing name
      if (atName) {
        (TAG[atName] || unknownTag)(doc, atName, trim(atText.join('\n')));
      }
      atName = match[1];
      atText = [];
      if(match[3]) atText.push(match[3]);
    } else {
      if (atName) {
        atText.push(line);
      } else {
        // ignore
      }
    }
  });
  if (atName) {
    (TAG[atName] || unknownTag)(doc, atName, atText.join('\n'));
  }
}

function findNgDoc(file, callback) {
  fs.readFile(file, callback.waitFor(function(err, content){
    var lines = content.toString().split(NEW_LINE);
    var doc;
    var match;
    var inDoc = false;
    lines.forEach(function(line, lineNumber){
      lineNumber++;
      // is the comment starting?
      if (!inDoc && (match = line.match(/^\s*\/\*\*\s*(.*)$/))) {
        line = match[1];
        inDoc = true;
        doc = {raw:{file:file, line:lineNumber, text:[]}};
      }
      // are we done?
      if (inDoc && line.match(/\*\//)) {
        doc.raw.text = doc.raw.text.join('\n');
        doc.raw.text = doc.raw.text.replace(/^\n/, '');
        if (doc.raw.text.match(/@ngdoc/)){
          callback(doc);
        }
        doc = null;
        inDoc = false;
      }
      // is the comment add text
      if (inDoc){
        doc.raw.text.push(line.replace(/^\s*\*\s?/, ''));
      }
    });
    callback.done();
  }));
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

function processNgDoc(documentation, doc) {
  if (!doc.ngdoc) return;
  console.log('Found:', doc.ngdoc + ':' + doc.name);
  
  documentation.byName[doc.name] = doc;
  
  if (doc.methodOf) {
    if (parent = documentation.byName[doc.methodOf]) {
      (parent.method = parent.method || []).push(doc);
    } else {
      throw 'Owner "' + doc.methodOf + '" is not defined.';
    }
  } else {
    documentation.pages.push(doc);
    keywordPages.push({
      name:doc.name,
      type: doc.ngdoc,
      keywords:keywords(doc.raw.text)
    });
  }
}

function writeDoc(pages) {
  pages.forEach(function(doc) {
    mergeTemplate(
        doc.ngdoc + '.template',
        doc.name + '.html', doc, callback.chain());
  });
}
