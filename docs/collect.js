require.paths.push("./lib");
require.paths.push(__dirname);
var fs       = require('fs'),
    spawn    = require('child_process').spawn,
    mustache = require('mustache'),
    callback = require('callback'),
    Showdown = require('showdown').Showdown;

var documentation = {
    section:{},
    all:[]
};

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
        if (doc.ngdoc) {
          delete doc.raw.text;
          var section = documentation.section;
          (section[doc.ngdoc] = section[doc.ngdoc] || []).push(doc);
          documentation.all.push(doc);
          console.log('Found:', doc.ngdoc + ':' + doc.shortName);
          mergeTemplate(
                    doc.ngdoc + '.template',
                    doc.name + '.html', doc, work.waitFor());
        }
      }));
    }));
  }));
}).onError(function(err){
  console.log('ERROR:', err.stack || err);
}).onDone(function(){
  mergeTemplate('docs-data.js', 'docs-data.js', {JSON:JSON.stringify(documentation)}, callback.chain());
  mergeTemplate('docs-scenario.js', 'docs-scenario.js', documentation, callback.chain());
  copy('docs-scenario.html', callback.chain());
  copy('index.html', callback.chain());
  mergeTemplate('docs.js', 'docs.js', documentation, callback.chain());
  mergeTemplate('doc_widgets.css', 'doc_widgets.css', documentation, callback.chain());
  mergeTemplate('doc_widgets.js', 'doc_widgets.js', documentation, callback.chain());
  console.log('DONE');
});
if (!this.testmode) work();
////////////////////

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
  doc[name] = markdown(value.replace(/^#/gm, '##'));
}

function markdown(text) {
  text = text.replace(/<angular\/>/gm, '<tt>&lt;angular/&gt;</tt>');
  return new Showdown.converter().makeHtml(text);
}

var TAG = {
  ngdoc: valueTag,
  example: escapedHtmlTag,
  scenario: valueTag,
  namespace: valueTag,
  css: valueTag,
  see: valueTag,
  usageContent: valueTag,
  'function': valueTag,
  description: markdownTag,
  TODO: markdownTag,
  returns: markdownTag,
  paramDescription: markdownTag,
  exampleDescription: markdownTag,
  name: function(doc, name, value) {
    doc.name = value;
    var match = value.match(/^angular[\.\#](([^\.]+)\.(.*)|(.*))/);
    doc.shortName  = match[3] || match[4];
  },
  param: function(doc, name, value){
    doc.param = doc.param || [];
    doc.paramRest = doc.paramRest || [];
    var match = value.match(/^({([^\s=]+)(=)?}\s*)?(([^\s=]+)|\[(\S+)+=([^\]]+)\])\s+(.*)/);
    if (match) {
      var param = {
          type: match[2],
          name: match[6] || match[5],
          'default':match[7],
          description:value.replace(match[0], match[8])
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
  }
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
