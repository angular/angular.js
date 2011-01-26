/**
 * All parsing/transformation code goes here. All code here should be sync to ease testing.
 */

var Showdown = require('showdown').Showdown;
var DOM = require('dom.js').DOM;
var NEW_LINE = /\n\r?/;

exports.markdown = markdown;
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
    this.description = markdown(this.description);
    this['this'] = markdown(this['this']);
    this.exampleDescription = markdown(this.exampleDescription || this.exampleDesc);
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
            description:markdown(text.replace(match[0], match[7])),
            type: match[1],
            optional: !!match[2],
            'default':match[6]
          };
          self.param = self.param || [];
          self.param.push(param);
        } else if (atName == 'returns') {
          var match = text.match(/^{([^}=]+)}\s+(.*)/);
          if (!match) {
            throw new Error("Not a valid 'returns' format: " + text);
          }
          self.returns = {
            type: match[1],
            description: markdown(text.replace(match[0], match[2]))
          };
        } else if(atName == 'requires') {
          self.requires = self.requires || [];
          self.requires.push(text);
        } else if(atName == 'property') {
          var match = text.match(/^({(\S+)}\s*)?(\S+)(\s+(.*))?/);
          if (!match) {
            throw new Error("Not a valid 'property' format: " + text);
          }
          var property = {
              type: match[2],
              name: match[3],
              description: match[5] || ''
            };
          self.properties = self.properties || [];
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
      dom.h('Description', self.description, html);
      dom.h('Dependencies', self.requires);

      usage();

      dom.h('Methods', self.methods, function(method){
        var signature = (method.param || []).map(property('name'));
        dom.h(method.shortName + '(' + signature.join(', ') + ')', method, function(){
          dom.html(method.description);
          method.html_usage_parameters(dom);
          dom.example(method.exampleDescription, method.example, false);
        });
      });
      dom.h('Properties', self.properties, function(property){
        dom.h(property.name, function(){
         dom.text(property.description);
         dom.example(property.exampleDescription, property.example, false);
        });
      });

      dom.example(self.exampleDescription, self.example, self.scenario);
    });

    return dom.toString();

    //////////////////////////

    function html(text){
      this.html(text);
    }

    function usage(){
      (self['html_usage_' + self.ngdoc] || function(){
        throw new Error("Don't know how to format @ngdoc: " + self.ngdoc);
      }).call(self, dom);
    }

    function section(name, property, fn) {
      var value = self[property];
      if (value) {
        dom.h2(name);
        if (typeof value == 'string') {
          value = markdown(value) + '\n';
          fn ? fn(value) : dom.html(value);
        } else if (value instanceof Array) {
          dom.ul(value, fn);
        }
      }
    }

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
        if (self.param) {
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
            if (self.param) {
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
  },

  html_usage_service: function(dom){
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
function markdown (text) {
  if (!text) return text;
  var parts = text.split(/(<pre>[\s\S]*?<\/pre>)/),
      match;

  parts.forEach(function(text, i){
    if (text.match(/^<pre>/)) {
      text = text.replace(/^<pre>([\s\S]*)<\/pre>/mi, function(_, content){
        return '<div ng:non-bindable><pre class="brush: js; html-script: true;">' +
                content.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
               '</pre></div>';
      });
    } else {
      text = text.replace(/<angular\/>/gm, '<tt>&lt;angular/&gt;</tt>');
      text = new Showdown.converter().makeHtml(text.replace(/^#/gm, '###'));

      while (match = text.match(R_LINK)) {
        text = text.replace(match[0], '<a href="#!' + match[1] + '"><code>' +
                                        (match[4] || match[1]) +
                                      '</code></a>');
      }
    }
    parts[i] = text;
  });
  return parts.join('');
};
var R_LINK = /{@link ([^\s}]+)((\s|\n)+(.+?))?\s*}/m;
            //       1       123     3 4     42

//////////////////////////////////////////////////////////
function scenarios(docs){
  var specs = [];
  docs.forEach(function(doc){
    if (doc.scenario) {
      specs.push('describe("');
      specs.push(doc.name);
      specs.push('", function(){\n');
      specs.push('  beforeEach(function(){\n');
      specs.push('    browser().navigateTo("index.html#!' + doc.name + '");');
      specs.push('  });\n\n');
      specs.push(doc.scenario);
      specs.push('\n});\n\n');
    }
  });
  return specs;
}


//////////////////////////////////////////////////////////
function metadata(docs){
  var words = [];
  docs.forEach(function(doc){
    words.push({
      name:doc.name,
      type: doc.ngdoc,
      keywords:doc.keywords()
    });
  });
  words.sort(keywordSort);
  return words;
}

function keywordSort(a,b){
  // supper ugly comparator that orders all utility methods and objects before all the other stuff
  // like widgets, directives, services, etc.
  // Mother of all beautiful code please forgive me for the sin that this code certainly is.

  if (a.name === b.name) return 0;
  if (a.name === 'angular') return -1;
  if (b.name === 'angular') return 1;

  function namespacedName(page) {
    return (page.name.match(/\./g).length === 1 && page.type !== 'overview' ? '0' : '1') + page.name;
  }

  var namespacedA = namespacedName(a),
      namespacedB = namespacedName(b);

  return namespacedA < namespacedB ? -1 : 1;
}


//////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////
function merge(docs){
  var byName = {};
  docs.forEach(function(doc){
    byName[doc.name] = doc;
  });
  for(var i=0; i<docs.length;) {
    if (findParent(docs[i], 'method') ||
          findParent(docs[i], 'property')) {
      docs.splice(i, 1);
    } else {
      i++;
    }
  }

  function findParent(doc, name){
    var parentName = doc[name+'Of'];
    if (!parentName) return false;

    var parent = byName[parentName];
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
