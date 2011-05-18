/**
 * All parsing/transformation code goes here. All code here should be sync to ease testing.
 */

var Showdown = require('showdown').Showdown;
var DOM = require('dom.js').DOM;
var htmlEscape = require('dom.js').htmlEscape;
var NEW_LINE = /\n\r?/;

exports.trim = trim;
exports.metadata = metadata;
exports.scenarios = scenarios;
exports.merge = merge;
exports.Doc = Doc;

//////////////////////////////////////////////////////////
function Doc(text, file, line) {
  if (typeof text == 'object') {
    for ( var key in text) {
      this[key] = text[key];
    }
  } else {
    this.text = text;
    this.file = file;
    this.line = line;
  }
  this.scenarios = this.scenarios || [];
  this.requires = this.requires || [];
  this.param = this.param || [];
  this.properties = this.properties || [];
  this.methods = this.methods || [];
  this.links = this.links || [];
}
Doc.METADATA_IGNORE = (function(){
  var words = require('fs').readFileSync(__dirname + '/ignore.words', 'utf8');
  return words.toString().split(/[,\s\n\r]+/gm);
})();


Doc.prototype = {
  keywords: function keywords(){
    var keywords = {};
    Doc.METADATA_IGNORE.forEach(function(ignore){ keywords[ignore] = true; });
    var words = [];
    var tokens = this.text.toLowerCase().split(/[,\.\`\'\"\s]+/mg);
    tokens.forEach(function(key){
      var match = key.match(/^(([\$\_a-z]|ng\:)[\w\_\-]{2,})/);
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
  },


  /*
   * This function is here to act as a huristic based translator from the old style urls to
   * the new style which use sections.
   */
  sectionHuristic: function (url){
    // if we are new styl URL with section/id then just return;
    if (url.match(/\//)) return url;
    var match = url.match(/(\w+)(\.(.*))?/);
    var section = match[1];
    var id = match[3] || 'index';
    switch(section) {
      case 'angular':
        section = 'api';
        id = 'angular.' + id;
        break;
      case 'api':
      case 'cookbook':
      case 'guide':
      case 'intro':
      case 'tutorial':
        break;
      default:
        id = section + '.' + id;
        section = 'intro';
    }
    var newUrl = section + '/' + (id || 'index');
    console.log('WARNING:', 'found old style url', url, 'at', this.file, this.line,
        'converting to', newUrl);
    return newUrl;
  },

  markdown: function (text) {
    var self = this;
    var IS_URL = /^(https?:\/\/|ftps?:\/\/|mailto:|\.|\/)/;
    var IS_ANGULAR = /^angular\./;
    if (!text) return text;

    text = trim(text);

    var parts = text.split(/(<pre>[\s\S]*?<\/pre>|<doc:example>[\s\S]*?<\/doc:example>)/);

    parts.forEach(function(text, i){
      if (text.match(/^<pre>/)) {
        text = text.replace(/^<pre>([\s\S]*)<\/pre>/mi, function(_, content){
          var clazz = 'brush: js;';
          if (content.match(/\<\w/)) {
            // we are HTML
            clazz += ' html-script: true;';
          }
          return '<div ng:non-bindable><pre class="' + clazz +'">' +
                  content.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                 '</pre></div>';
        });
      } else if (text.match(/^<doc:example>/)) {
        text = text.replace(/(<doc:source>)([\s\S]*)(<\/doc:source>)/mi,
          function(_, before, content, after){
            return '<pre class="doc-source">' + htmlEscape(content) + '</pre>';
          });
        text = text.replace(/(<doc:scenario>)([\s\S]*)(<\/doc:scenario>)/mi,
          function(_, before, content, after){
            self.scenarios.push(content);
            return '<pre class="doc-scenario">' + htmlEscape(content) + '</pre>';
          });
      } else {
        text = text.replace(/<angular\/>/gm, '<tt>&lt;angular/&gt;</tt>');
        text = text.replace(/{@link\s+([^\s}]+)\s*([^}]*?)\s*}/g,
          function(_all, url, title){
            var isFullUrl = url.match(IS_URL),
                // FIXME(vojta) angular link could be api.angular now with sections
                isAngular = url.match(IS_ANGULAR);

            if (!isFullUrl) {
              // TODO(vojta) there could be relative link, but not angular
              // do we want to store all links (and check even the full links like http://github.com ?
              self.links.push(self.sectionHuristic(url));
            }

            return '<a href="' + (isFullUrl ? '' + url : '#!' + self.sectionHuristic(url)) + '">'
              + (isAngular ? '<code>' : '')
              + (title || url).replace(/\n/g, ' ')
              + (isAngular ? '</code>' : '')
              + '</a>';
          });
        text = new Showdown.converter().makeHtml(text);
      }
      parts[i] = text;
    });
    return parts.join('');
  },

  parse: function(){
    var atName;
    var atText;
    var match;
    var self = this;
    self.text.split(NEW_LINE).forEach(function(line){
      if (match = line.match(/^\s*@(\w+)(\s+(.*))?/)) {
        // we found @name ...
        // if we have existing name
        flush();
        atName = match[1];
        atText = [];
        if(match[3]) atText.push(match[3]);
      } else {
        if (atName) {
          atText.push(line);
        }
      }
    });
    flush();
    this.shortName = (this.name || '').split(/[\.#]/).pop();
    this.id = this.id // if we have an id just use it
      || (((this.file||'').match(/.*\/([^\/]*)\.ngdoc/)||{})[1]) // try to extract it from file name
      || this.name; // default to name
    this.description = this.markdown(this.description);
    this.example = this.markdown(this.example);
    this['this'] = this.markdown(this['this']);
    return this;

    function flush(){
      if (atName) {
        var text = trim(atText.join('\n'));
        if (atName == 'param') {
          var match = text.match(/^{([^}=]+)(=)?}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
                                //  1      12 2     34       4   5   5 6      6  3   7  7
          if (!match) {
            throw new Error("Not a valid 'param' format: " + text);
          }
          var param = {
            name: match[5] || match[4],
            description:self.markdown(text.replace(match[0], match[7])),
            type: match[1],
            optional: !!match[2],
            'default':match[6]
          };
          self.param.push(param);
        } else if (atName == 'returns') {
          var match = text.match(/^{([^}=]+)}\s+(.*)/);
          if (!match) {
            throw new Error("Not a valid 'returns' format: " + text);
          }
          self.returns = {
            type: match[1],
            description: self.markdown(text.replace(match[0], match[2]))
          };
        } else if(atName == 'requires') {
          var match = text.match(/^([^\s]*)\s*([\S\s]*)/);
          self.requires.push({
            name: match[1],
            text: self.markdown(match[2])
          });
        } else if(atName == 'property') {
          var match = text.match(/^{(\S+)}\s+(\S+)(\s+(.*))?/);
          if (!match) {
            throw new Error("Not a valid 'property' format: " + text);
          }
          var property = {
              type: match[1],
              name: match[2],
              description: self.markdown(text.replace(match[0], match[4]))
            };
          self.properties.push(property);
        } else {
          self[atName] = text;
        }
      }
    }
  },

  html: function(){
    var dom = new DOM(),
        self = this;

    dom.h(this.name, function(){
      notice('workInProgress', 'Work in Progress',
          'This page is currently being revised. It might be incomplete or contain inaccuracies.');
      notice('deprecated', 'Deprecated API', self.deprecated);

      if (self.ngdoc != 'overview') {
        dom.h('Description', self.description, dom.html);
      }
      dom.h('Dependencies', self.requires, function(require){
        dom.tag('code', function(){
          dom.tag('a', {href:"#!angular.service." + require.name}, require.name);
        });
        dom.html(require.text);
      });

      (self['html_usage_' + self.ngdoc] || function(){
        throw new Error("Don't know how to format @ngdoc: " + self.ngdoc);
      }).call(self, dom);

      dom.h('Example', self.example, dom.html);
    });

    return dom.toString();

    //////////////////////////

    function notice(name, legend, msg){
      if (self[name] == undefined) return;
      dom.tag('fieldset', {'class':name}, function(dom){
        dom.tag('legend', legend);
        dom.text(msg);
      });
    }

  },

  html_usage_parameters: function(dom) {
    dom.h('Parameters', this.param, function(param){
      dom.tag('code', function(){
        dom.text(param.name);
        if (param.optional) {
          dom.tag('i', function(){
            dom.text('(optional');
            if(param['default']) {
              dom.text('=' + param['default']);
            }
            dom.text(')');
          });
        }
        dom.text(' – {');
        dom.text(param.type);
        dom.text('} – ');
      });
      dom.html(param.description);
    });
  },

  html_usage_returns: function(dom) {
    var self = this;
    if (self.returns) {
      dom.h('Returns', function(){
        dom.tag('code', '{' + self.returns.type + '}');
        dom.text('– ');
        dom.html(self.returns.description);
      });
    }
  },

  html_usage_this: function(dom) {
    var self = this;
    if (self['this']) {
      dom.h(function(dom){
        dom.html("Method's <code>this</code>");
      }, function(dom){
        dom.html(self['this']);
      });
    }
  },

  html_usage_function: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.code(function(){
        dom.text(self.name);
        dom.text('(');
        self.parameters(dom, ', ');
        dom.text(');');
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_directive: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.tag('pre', {'class':"brush: js; html-script: true;"}, function(){
        dom.text('<' + self.element + ' ');
        dom.text(self.shortName);
        if (self.param.length) {
          dom.text('="' + self.param[0].name + '"');
        }
        dom.text('>\n   ...\n');
        dom.text('</' + self.element + '>');
      });
      self.html_usage_parameters(dom);
    });
  },

  html_usage_filter: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.h('In HTML Template Binding', function(){
        dom.tag('code', function(){
          dom.text('{{ ');
          dom.text(self.shortName);
          dom.text('_expression | ');
          dom.text(self.shortName);
          self.parameters(dom, ':', true);
          dom.text(' }}');
        });
      });

      dom.h('In JavaScript', function(){
        dom.tag('code', function(){
          dom.text('angular.filter.');
          dom.text(self.shortName);
          dom.text('(');
          self.parameters(dom, ', ');
          dom.text(')');
        });
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_formatter: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.h('In HTML Template Binding', function(){
        dom.code(function(){
          if (self.inputType=='select')
            dom.text('<select name="bindExpression"');
          else
            dom.text('<input type="text" name="bindExpression"');
          dom.text(' ng:format="');
          dom.text(self.shortName);
          self.parameters(dom, ':', false, true);
          dom.text('">');
        });
      });

      dom.h('In JavaScript', function(){
        dom.code(function(){
          dom.text('var userInputString = angular.formatter.');
          dom.text(self.shortName);
          dom.text('.format(modelValue');
          self.parameters(dom, ', ', false, true);
          dom.text(');');
          dom.text('\n');
          dom.text('var modelValue = angular.formatter.');
          dom.text(self.shortName);
          dom.text('.parse(userInputString');
          self.parameters(dom, ', ', false, true);
          dom.text(');');
        });
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_validator: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.h('In HTML Template Binding', function(){
        dom.code(function(){
          dom.text('<input type="text" ng:validate="');
          dom.text(self.shortName);
          self.parameters(dom, ':', true);
          dom.text('"/>');
        });
      });

      dom.h('In JavaScript', function(){
        dom.code(function(){
          dom.text('angular.validator.');
          dom.text(self.shortName);
          dom.text('(');
          self.parameters(dom, ', ');
          dom.text(')');
        });
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_widget: function(dom){
    var self = this;
    dom.h('Usage', function(){
      dom.h('In HTML Template Binding', function(){
        dom.code(function(){
          if (self.shortName.match(/^@/)) {
            dom.text('<');
            dom.text(self.element);
            dom.text(' ');
            dom.text(self.shortName.substring(1));
            if (self.param.length) {
              dom.text('="');
              dom.text(self.param[0].name);
              dom.text('"');
            }
            dom.text('>\n   ...\n</');
            dom.text(self.element);
            dom.text('>');
          } else {
            dom.text('<');
            dom.text(self.shortName);
            (self.param||[]).forEach(function(param){
              if (param.optional) {
                dom.text(' [' + param.name + '="..."]');
              } else {
                dom.text(' ' + param.name + '="..."');
              }
            });
            dom.text('></');
            dom.text(self.shortName);
            dom.text('>');
          }
        });
      });

      self.html_usage_parameters(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_overview: function(dom){
    dom.html(this.description);
  },

  html_usage_service: function(dom){
    var self = this;

    if (this.param.length) {
      dom.h('Usage', function(){
        dom.code(function(){
          dom.text(self.name.split('.').pop());
          dom.text('(');
          self.parameters(dom, ', ');
          dom.text(');');
        });

        self.html_usage_parameters(dom);
        self.html_usage_this(dom);
        self.html_usage_returns(dom);
      });
    }

    dom.h('Methods', this.methods, function(method){
      var signature = (method.param || []).map(property('name'));
      dom.h(method.shortName + '(' + signature.join(', ') + ')', method, function(){
        dom.html(method.description);
        method.html_usage_parameters(dom);
        dom.h('Example', method.example, dom.html);
      });
    });
    dom.h('Properties', this.properties, function(property){
      dom.h(property.name, function(){
       dom.html(property.description);
       dom.h('Example', property.example, dom.html);
      });
    });
  },

  parameters: function(dom, separator, skipFirst, prefix) {
    var sep = prefix ? separator : '';
    (this.param||[]).forEach(function(param, i){
      if (!(skipFirst && i==0)) {
        if (param.optional) {
          dom.text('[' + sep + param.name + ']');
        } else {
          dom.text(sep + param.name);
        }
      }
      sep = separator;
    });
  }

};
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
function scenarios(docs){
  var specs = [];
  docs.forEach(function(doc){
    specs.push('describe("' + doc.id + '", function(){');
    specs.push('  beforeEach(function(){');
    specs.push('    browser().navigateTo("index.html#!' + doc.id + '");');
    specs.push('  });');
    specs.push('');
    doc.scenarios.forEach(function(scenario){
      specs.push(indent(trim(scenario), 2));
      specs.push('');
    });
    specs.push('});');
    specs.push('');
    if (doc.scenario) {
    }
  });
  return specs.join('\n');
}


//////////////////////////////////////////////////////////
function metadata(docs){
  var words = [];
  docs.forEach(function(doc){
    var path = (doc.name || '').split(/(\.|\:\s+)/);
    for ( var i = 1; i < path.length; i++) {
      path.splice(i, 1);
    }
    var depth = path.length - 1;
    var shortName = path.pop();
    words.push({
      section: doc.section,
      id: doc.id,
      name: doc.name,
      depth: depth,
      shortName: shortName,
      type: doc.ngdoc,
      keywords:doc.keywords()
    });
  });
  words.sort(keywordSort);
  return words;
}

var KEYWORD_PRIORITY = {
  '.index': 1,
  '.guide': 2,
  '.guide.overview': 1,
  '.angular': 7,
  '.angular.Array': 7,
  '.angular.Object': 7,
  '.angular.directive': 7,
  '.angular.filter': 7,
  '.angular.formatter': 7,
  '.angular.scope': 7,
  '.angular.service': 7,
  '.angular.validator': 7,
  '.angular.widget': 7
};
function keywordSort(a, b){
  function mangleName(doc) {
    var path = doc.id.split(/\./);
    var mangled = [];
    var partialName = '';
    path.forEach(function(name){
      partialName += '.' + name;
      mangled.push(KEYWORD_PRIORITY[partialName] || 5);
      mangled.push(name);
    });
    return doc.section + '/' + mangled.join('.');
  }
  var nameA = mangleName(a);
  var nameB = mangleName(b);
  return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}


//////////////////////////////////////////////////////////
function trim(text) {
  var MAX_INDENT = 9999;
  var empty = RegExp.prototype.test.bind(/^\s*$/);
  var lines = text.split('\n');
  var minIndent = MAX_INDENT;
  var indentRegExp;
  var ignoreLine = (lines[0][0] != ' '  && lines.length > 1);
                  // ignore first line if it has no indentation and there is more than one line

  lines.forEach(function(line){
    if (ignoreLine) {
      ignoreLine = false;
      return;
    }

    var indent = line.match(/^\s*/)[0].length;
    if (indent > 0 || minIndent == MAX_INDENT) {
      minIndent = Math.min(minIndent, indent);
    }
  });

  indentRegExp = new RegExp('^\\s{0,' + minIndent + '}');

  for ( var i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(indentRegExp, '');
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
}

function indent(text, spaceCount) {
  var lines = text.split('\n'),
      indent = '',
      fixedLines = [];

  while(spaceCount--) indent += ' ';

  lines.forEach(function(line) {
    fixedLines.push(indent + line);
  });

  return fixedLines.join('\n');
}

//////////////////////////////////////////////////////////
function merge(docs){
  var byFullId = {};

  docs.forEach(function (doc) {
    byFullId[doc.section + '/' + doc.id] = doc;
  });

  for(var i = 0; i < docs.length;) {
    var doc = docs[i];

    // check links - do they exist ?
    doc.links.forEach(function(link) {
      if (!byFullId[link]) console.log('WARNING: Non existing link "' + link + '" in ' + doc.section + '/' + doc.id);
    });

    // merge into parents
    if (findParent(doc, 'method') || findParent(doc, 'property')) {
      docs.splice(i, 1);
    } else {
      i++;
    }
  }

  function findParent(doc, name) {
    var parentName = doc[name + 'Of'];
    if (!parentName) return false;

    var parent = byFullId['api/' + parentName];
    if (!parent)
      throw new Error("No parent named '" + parentName + "' for '" +
          doc.name + "' in @" + name + "Of.");

    var listName = (name + 's').replace(/ys$/, 'ies');
    var list = parent[listName] = (parent[listName] || []);
    list.push(doc);
    list.sort(orderByName);
    return true;
  }

  function orderByName(a, b){
    return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
  }
}
//////////////////////////////////////////////////////////

function property(name) {
  return function(value){
    return value[name];
  };
}
