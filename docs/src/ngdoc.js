/**
 * All parsing/transformation code goes here. All code here should be sync to ease testing.
 */

var Showdown = require('../../lib/showdown').Showdown;
var DOM = require('./dom.js').DOM;
var htmlEscape = require('./dom.js').htmlEscape;
var NEW_LINE = /\n\r?/;

exports.trim = trim;
exports.metadata = metadata;
exports.scenarios = scenarios;
exports.merge = merge;
exports.Doc = Doc;

var BOOLEAN_ATTR = {};
['multiple', 'selected', 'checked', 'disabled', 'readOnly', 'required'].forEach(function(value, key) {
  BOOLEAN_ATTR[value] = true;
});

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
  this.events = this.events || [];
  this.links = this.links || [];
}
Doc.METADATA_IGNORE = (function() {
  var words = require('fs').readFileSync(__dirname + '/ignore.words', 'utf8');
  return words.toString().split(/[,\s\n\r]+/gm);
})();


Doc.prototype = {
  keywords: function keywords() {
    var keywords = {};
    var words = [];
    Doc.METADATA_IGNORE.forEach(function(ignore){ keywords[ignore] = true; });

    function extractWords(text) {
      var tokens = text.toLowerCase().split(/[,\.\`\'\"\s]+/mg);
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
    }

    extractWords(this.text);
    this.properties.forEach(function(prop) {
      extractWords(prop.text || prop.description || '');
    });
    this.methods.forEach(function(method) {
      extractWords(method.text || method.description || '');
    });
    words.sort();
    return words.join(' ');
  },

  /**
   * Converts relative urls (without section) into absolute
   * Absolute url means url with section
   *
   * @example
   * - if the link is inside any api doc:
   * angular.widget -> api/angular.widget
   *
   * - if the link is inside any guid doc:
   * intro -> guide/intro
   *
   * @param {string} url Absolute or relative url
   * @returns {string} Absolute url
   */
  convertUrlToAbsolute: function(url) {
    if (url.substr(-1) == '/') return url + 'index';
    if (url.match(/\//)) return url;
    return this.section + '/' + url;
  },

  markdown: function(text) {
    if (!text) return text;

    var self = this,
        IS_URL = /^(https?:\/\/|ftps?:\/\/|mailto:|\.|\/)/,
        IS_ANGULAR = /^(api\/)?angular\./,
        IS_HASH = /^#/,
        parts = trim(text).split(/(<pre>[\s\S]*?<\/pre>|<doc:(\S*).*?>[\s\S]*?<\/doc:\2>)/);

    parts.forEach(function(text, i) {

      function isDocWidget(name) {
        if ((i + 1) % 3 != 2) return false;
        if (name) return parts[i+1] == name;
        return !!parts[i+1];
      }

      // ignore each third item which is doc widget tag
      if (!((i + 1) % 3)) {
        parts[i] = '';
        return;
      }

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
      } else if (isDocWidget('example')) {
        text = text.replace(/<doc:source(\s+[^>]*)?>([\s\S]*)<\/doc:source>/mi,
          function(_, attrs, content){
            return '<pre class="doc-source"' + (attrs || '') +'>' +
                      htmlEscape(content) +
                   '</pre>';
          });
        text = text.replace(/(<doc:scenario>)([\s\S]*)(<\/doc:scenario>)/mi,
          function(_, before, content, after){
            self.scenarios.push(content);
            return '<pre class="doc-scenario">' + htmlEscape(content) + '</pre>';
          });
      } else if (!isDocWidget()) {
        text = text.replace(/<angular\/>/gm, '<tt>&lt;angular/&gt;</tt>');
        text = text.replace(/{@link\s+([^\s}]+)\s*([^}]*?)\s*}/g,
          function(_all, url, title){
            var isFullUrl = url.match(IS_URL),
                isAngular = url.match(IS_ANGULAR),
                isHash = url.match(IS_HASH),
                absUrl = isHash
                  ? url
                  : (isFullUrl ? url : self.convertUrlToAbsolute(url));

            if (!isFullUrl) self.links.push(absUrl);

            return '<a href="' + absUrl + '">' +
              (isAngular ? '<code>' : '') +
              (title || url).replace(/^#/g, '').replace(/\n/g, ' ') +
              (isAngular ? '</code>' : '') +
              '</a>';
          });
        text = new Showdown.converter().makeHtml(text);
      }
      parts[i] = text;
    });
    return parts.join('');
  },

  parse: function() {
    var atName;
    var atText;
    var match;
    var self = this;
    self.text.split(NEW_LINE).forEach(function(line){
      if ((match = line.match(/^\s*@(\w+)(\s+(.*))?/))) {
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
    this.shortName = this.name.split(this.name.match(/#/) ? /#/ : /\./ ).pop();
    this.id = this.id || // if we have an id just use it
      (((this.file||'').match(/.*\/([^\/]*)\.ngdoc/)||{})[1]) || // try to extract it from file name
      this.name; // default to name
    this.description = this.markdown(this.description);
    this.example = this.markdown(this.example);
    this['this'] = this.markdown(this['this']);
    return this;

    function flush() {
      if (atName) {
        var text = trim(atText.join('\n')), match;
        if (atName == 'param') {
          match = text.match(/^\{([^}=]+)(=)?\}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
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
          match = text.match(/^\{([^}=]+)\}\s+(.*)/);
          if (!match) {
            throw new Error("Not a valid 'returns' format: " + text);
          }
          self.returns = {
            type: match[1],
            description: self.markdown(text.replace(match[0], match[2]))
          };
        } else if(atName == 'requires') {
          match = text.match(/^([^\s]*)\s*([\S\s]*)/);
          self.requires.push({
            name: match[1],
            text: self.markdown(match[2])
          });
        } else if(atName == 'property') {
          match = text.match(/^\{(\S+)\}\s+(\S+)(\s+(.*))?/);
          if (!match) {
            throw new Error("Not a valid 'property' format: " + text);
          }
          var property = new Doc({
              type: match[1],
              name: match[2],
              shortName: match[2],
              description: self.markdown(text.replace(match[0], match[4]))
            });
          self.properties.push(property);
        } else if(atName == 'eventType') {
          match = text.match(/^([^\s]*)\s+on\s+([\S\s]*)/);
          self.type = match[1];
          self.target = match[2];
        } else {
          self[atName] = text;
        }
      }
    }
  },

  html: function() {
    var dom = new DOM(),
        self = this;

    dom.h(this.name, function() {
      notice('deprecated', 'Deprecated API', self.deprecated);

      if (self.ngdoc != 'overview') {
        dom.h('Description', self.description, dom.html);
      }
      dom.h('Dependencies', self.requires, function(require){
        dom.tag('code', function() {
          dom.tag('a', {href: 'api/angular.module.ng.' + require.name}, require.name);
        });
        dom.html(require.text);
      });

      (self['html_usage_' + self.ngdoc] || function() {
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
      dom.tag('code', function() {
        dom.text(param.name);
        if (param.optional) {
          dom.tag('i', function() {
            dom.text('(optional');
            if(param['default']) {
              dom.text('=' + param['default']);
            }
            dom.text(')');
          });
        }
        dom.text(' – {');
        dom.text(param.type);
        if (param.optional) {
          dom.text('=');
        }
        dom.text('} – ');
      });
      dom.html(param.description);
    });
  },

  html_usage_returns: function(dom) {
    var self = this;
    if (self.returns) {
      dom.h('Returns', function() {
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
    dom.h('Usage', function() {
      dom.code(function() {
        dom.text(self.name.split(/\./).pop());
        dom.text('(');
        self.parameters(dom, ', ');
        dom.text(');');
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
    this.method_properties_events(dom);
  },

  html_usage_property: function(dom){
    var self = this;
    dom.h('Usage', function() {
      dom.code(function() {
        dom.text(self.name);
      });

      self.html_usage_returns(dom);
    });
  },

  html_usage_directive: function(dom){
    var self = this;
    dom.h('Usage', function() {
      dom.tag('pre', {'class':"brush: js; html-script: true;"}, function() {
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
    dom.h('Usage', function() {
      dom.h('In HTML Template Binding', function() {
        dom.tag('code', function() {
          dom.text('{{ ');
          dom.text(self.shortName);
          dom.text('_expression | ');
          dom.text(self.shortName);
          self.parameters(dom, ':', true);
          dom.text(' }}');
        });
      });

      dom.h('In JavaScript', function() {
        dom.tag('code', function() {
          dom.text('$filter(\'');
          dom.text(self.shortName);
          dom.text('\')(');
          self.parameters(dom, ', ');
          dom.text(')');
        });
      });

      self.html_usage_parameters(dom);
      self.html_usage_this(dom);
      self.html_usage_returns(dom);
    });
  },

  html_usage_inputType: function(dom){
    var self = this;
    dom.h('Usage', function() {
      dom.code(function() {
        dom.text('<input type="' + self.shortName + '"');
        (self.param||[]).forEach(function(param){
          dom.text('\n      ');
          dom.text(param.optional ? ' [' : ' ');
          dom.text(param.name);
          dom.text(BOOLEAN_ATTR[param.name] ? '' : '="..."');
          dom.text(param.optional ? ']' : '');
        });
        dom.text('>');
      });
      self.html_usage_parameters(dom);
    });
  },

  html_usage_widget: function(dom){
    var self = this;
    dom.h('Usage', function() {
      dom.h('In HTML Template Binding', function() {
        dom.code(function() {
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
              dom.text('\n      ');
              dom.text(param.optional ? ' [' : ' ');
              dom.text(param.name);
              dom.text(BOOLEAN_ATTR[param.name] ? '' : '="..."');
              dom.text(param.optional ? ']' : '');
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

  html_usage_interface: function(dom){
    var self = this;

    if (this.param.length) {
      dom.h('Usage', function() {
        dom.code(function() {
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
    this.method_properties_events(dom);
  },

  html_usage_service: function(dom) {
    this.html_usage_interface(dom)
  },

  html_usage_object: function(dom) {
    this.html_usage_interface(dom)
  },

  method_properties_events: function(dom) {
    var self = this;
    if (self.methods.length) {
      dom.div({class:'member method'}, function(){
        dom.h('Methods', self.methods, function(method){
          var signature = (method.param || []).map(property('name'));
          dom.h(method.shortName + '(' + signature.join(', ') + ')', method, function() {
            dom.html(method.description);
            method.html_usage_parameters(dom);
            self.html_usage_this(dom);
            method.html_usage_returns(dom);

            dom.h('Example', method.example, dom.html);
          });
        });
      });
    }
    if (self.properties.length) {
      dom.div({class:'member property'}, function(){
        dom.h('Properties', self.properties, function(property){
          dom.h(property.shortName, function() {
           dom.html(property.description);
           if (!property.html_usage_returns) {
             console.log(property);
           }
           property.html_usage_returns(dom);
           dom.h('Example', property.example, dom.html);
          });
        });
      });
    }
    if (self.events.length) {
      dom.div({class:'member event'}, function(){
        dom.h('Events', self.events, function(event){
          dom.h(event.shortName, event, function() {
            dom.html(event.description);
            if (event.type == 'listen') {
              dom.tag('div', {class:'inline'}, function() {
                dom.h('Listen on:', event.target);
              });
            } else {
              dom.tag('div', {class:'inline'}, function() {
                dom.h('Type:', event.type);
              });
              dom.tag('div', {class:'inline'}, function() {
                dom.h('Target:', event.target);
              });
            }
            event.html_usage_parameters(dom);
            self.html_usage_this(dom);

            dom.h('Example', event.example, dom.html);
          });
        });
      });
    }
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

  specs.push('describe("angular+jqlite", function() {');
  appendSpecs('index-nocache.html#!/');
  specs.push('});');

  specs.push('');
  specs.push('');

  specs.push('describe("angular+jquery", function() {');
  appendSpecs('index-jq-nocache.html#!/');
  specs.push('});');

  return specs.join('\n');

  function appendSpecs(urlPrefix) {
    docs.forEach(function(doc){
      specs.push('  describe("' + doc.section + '/' + doc.id + '", function() {');
      specs.push('    beforeEach(function() {');
      specs.push('      browser().navigateTo("' + urlPrefix + doc.section + '/' + doc.id + '");');
      specs.push('    });');
      specs.push('  ');
      doc.scenarios.forEach(function(scenario){
        specs.push(indent(trim(scenario), 4));
        specs.push('');
      });
      specs.push('});');
      specs.push('');
    });
  }
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
  '.angular': 7,
  '.angular.Module': 7,
  '.angular.module': 8,
  '.angular.mock': 9,
  '.angular.module.ng.$filter': 7,
  '.angular.module.ng.$rootScope.Scope': 7,
  '.angular.module.ng': 7,
  '.angular.mock': 8,
  '.angular.directive': 6,
  '.angular.inputType': 6,
  '.angular.widget': 6,
  '.angular.module.ngMock': 8,
  '.dev_guide.overview': 1,
  '.dev_guide.bootstrap': 2,
  '.dev_guide.mvc': 3,
  '.dev_guide.scopes': 4,
  '.dev_guide.compiler': 5,
  '.dev_guide.templates': 6,
  '.dev_guide.services': 7,
  '.dev_guide.di': 8,
  '.dev_guide.unit-testing': 9
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
    return (doc.section + '/' + mangled.join('.')).toLowerCase();
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

  docs.forEach(function(doc) {
    byFullId[doc.section + '/' + doc.id] = doc;
  });

  for(var i = 0; i < docs.length;) {
    var doc = docs[i];

    // check links - do they exist ?
    doc.links.forEach(function(link) {
      // convert #id to path#id
      if (link[0] == '#') {
        link = doc.section + '/' + doc.id.split('#').shift() + link;
      }
      if (!byFullId[link]) {
        console.log('WARNING: In ' + doc.section + '/' + doc.id + ', non existing link: "' + link + '"');
      }
    });

    // merge into parents
    if (findParent(doc, 'method') || findParent(doc, 'property') || findParent(doc, 'event')) {
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
