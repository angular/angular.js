/**
 * All parsing/transformation code goes here. All code here should be sync to ease testing.
 */

var Showdown = require('../../lib/showdown').Showdown;
var DOM = require('./dom.js').DOM;
var htmlEscape = require('./dom.js').htmlEscape;
var Example = require('./example.js').Example;
var NEW_LINE = /\n\r?/;
var globalID = 0;
var fs = require('fs');
var fspath = require('path');

exports.trim = trim;
exports.metadata = metadata;
exports.scenarios = scenarios;
exports.merge = merge;
exports.Doc = Doc;

var BOOLEAN_ATTR = {};
['multiple', 'selected', 'checked', 'disabled', 'readOnly', 'required'].forEach(function(value) {
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
      var tokens = text.toLowerCase().split(/[\.\s,`'"#]+/mg);
      tokens.forEach(function(key){
        var match = key.match(/^((ng:|[\$_a-z])[\w\-_]+)/);
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
      IS_ANGULAR = /^(api\/)?(angular|ng|AUTO)\./,
      IS_HASH = /^#/,
      parts = trim(text).split(/(<pre>[\s\S]*?<\/pre>|<doc:example(\S*).*?>[\s\S]*?<\/doc:example>|<example[^>]*>[\s\S]*?<\/example>)/),
      seq = 0,
      placeholderMap = {};

    function placeholder(text) {
      var id = 'REPLACEME' + (seq++);
      placeholderMap[id] = text;
      return id;
    }

    function extractInlineDocCode(text, tag) {
      if(tag == 'all') {
        //use a greedy operator to match the last </docs> tag
        regex = /\/\/<docs.*?>([.\s\S]+)\/\/<\/docs>/im;
      }
      else {
        //use a non-greedy operator to match the next </docs> tag
        regex = new RegExp("\/\/<docs\\s*tag=\"" + tag + "\".*?>([.\\s\\S]+?)\/\/<\/docs>","im");
      }
      var matches = regex.exec(text.toString());
      return matches && matches.length > 1 ? matches[1] : "";
    }

    parts.forEach(function(text, i) {
      parts[i] = (text || '').
        replace(/<example(?:\s+module="([^"]*)")?(?:\s+deps="([^"]*)")?(\s+animations="true")?>([\s\S]*?)<\/example>/gmi,
          function(_, module, deps, animations, content) {

          var example = new Example(self.scenarios);
          if(animations) {
            example.enableAnimations();
          }

          example.setModule(module);
          example.addDeps(deps);
          content.replace(/<file\s+name="([^"]*)"\s*>([\s\S]*?)<\/file>/gmi, function(_, name, content) {
            example.addSource(name, content);
          });
          content.replace(/<file\s+src="([^"]+)"(?:\s+tag="([^"]+)")?(?:\s+name="([^"]+)")?\s*\/?>/gmi, function(_, file, tag, name) {
            if(fspath.existsSync(file)) {
              var content = fs.readFileSync(file, 'utf8');
              if(content && content.length > 0) {
                if(tag && tag.length > 0) {
                  content = extractInlineDocCode(content, tag);
                }
                name = name && name.length > 0 ? name : fspath.basename(file);
                example.addSource(name, content);
              }
            }
            return '';
          })
          return placeholder(example.toHtml());
        }).
        replace(/(?:\*\s+)?<file.+?src="([^"]+)"(?:\s+tag="([^"]+)")?\s*\/?>/i, function(_, file, tag) {
          if(fspath.existsSync(file)) {
            var content = fs.readFileSync(file, 'utf8');
            if(tag && tag.length > 0) {
              content = extractInlineDocCode(content, tag);
            }
            return content;
          }
        }).
        replace(/^<doc:example(\s+[^>]*)?>([\s\S]*)<\/doc:example>/mi, function(_, attrs, content) {
          var html, script, scenario,
            example = new Example(self.scenarios);

          example.setModule((attrs||'module=""').match(/^\s*module=["'](.*)["']\s*$/)[1]);
          content.
            replace(/<doc:source(\s+[^>]*)?>([\s\S]*)<\/doc:source>/mi, function(_, attrs, content) {
              example.addSource('index.html', content.
                replace(/<script>([\s\S]*)<\/script>/mi, function(_, script) {
                  example.addSource('script.js', script);
                  return '';
                }).
                replace(/<style>([\s\S]*)<\/style>/mi, function(_, style) {
                  example.addSource('style.css', style);
                  return '';
                })
              );
            }).
            replace(/(<doc:scenario>)([\s\S]*)(<\/doc:scenario>)/mi, function(_, before, content){
              example.addSource('scenario.js', content);
            });

          return placeholder(example.toHtml());
        }).
        replace(/^<pre>([\s\S]*?)<\/pre>/mi, function(_, content){
          return placeholder(
            '<pre class="prettyprint linenums">' +
              content.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
              '</pre>');
        }).
        replace(/<div([^>]*)><\/div>/, '<div$1>\n<\/div>').
        replace(/{@link\s+([^\s}]+)\s*([^}]*?)\s*}/g, function(_all, url, title){
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
    });
    text = parts.join('');
    text = new Showdown.converter().makeHtml(text);
    text = text.replace(/(?:<p>)?(REPLACEME\d+)(?:<\/p>)?/g, function(_, id) {
      return placeholderMap[id];
    });
    return text;
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
    this.shortName = this.name.split(/[\.:#]/).pop().trim();
    this.id = this.id || // if we have an id just use it
      (((this.file||'').match(/.*(\/|\\)([^(\/|\\)]*)\.ngdoc/)||{})[2]) || // try to extract it from file name
      this.name; // default to name
    this.description = this.markdown(this.description);
    this.example = this.markdown(this.example);
    this['this'] = this.markdown(this['this']);
    return this;

    function flush() {
      if (atName) {
        var text = trim(atText.join('\n')), match;
        if (atName == 'param') {
          match = text.match(/^\{([^}]+)\}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
                             //  1      1    23       3   4   4 5      5  2   6  6
          if (!match) {
            throw new Error("Not a valid 'param' format: " + text + ' (found in: ' + self.file + ':' + self.line + ')');
          }

          var optional = (match[1].slice(-1) === '=');
          var param = {
            name: match[4] || match[3],
            description:self.markdown(text.replace(match[0], match[6])),
            type: optional ? match[1].substring(0, match[1].length-1) : match[1],
            optional: optional,
            'default':match[5]
          };
          self.param.push(param);
        } else if (atName == 'returns' || atName == 'return') {
          match = text.match(/^\{([^}]+)\}\s+(.*)/);
          if (!match) {
            throw new Error("Not a valid 'returns' format: " + text + ' (found in: ' + self.file + ':' + self.line + ')');
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
            throw new Error("Not a valid 'property' format: " + text + ' (found in: ' + self.file + ':' + self.line + ')');
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

    dom.h(title(this.name), function() {

      notice('deprecated', 'Deprecated API', self.deprecated);
      dom.tag('a', {href: 'http://github.com/angular/angular.js/edit/master/' + self.file, class: 'improve-docs btn btn-primary'}, 'Improve this doc');
      if (self.ngdoc != 'overview') {
        dom.h('Description', self.description, dom.html);
      }
      dom.h('Dependencies', self.requires, function(require){
        dom.tag('code', function() {
          dom.tag('a', {href: 'api/ng.' + require.name}, require.name);
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
    if(this.animations) {
      dom.h('Animations', this.animations, function(animations){
        dom.html('<ul>');
        var animations = animations.split("\n");
        animations.forEach(function(ani) {
          dom.html('<li>');
          dom.text(ani);
          dom.html('</li>');
        });
        dom.html('</ul>');
      });
    }
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
    var name = self.name.match(/^angular(\.mock)?\.(\w+)$/) ? self.name : self.name.split(/\./).pop()

    dom.h('Usage', function() {
      dom.code(function() {
        dom.text(name);
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
      var restrict = self.restrict || 'AC';

      if (restrict.match(/E/)) {
        dom.html('<p>');
        dom.text('This directive can be used as custom element, but we aware of ');
        dom.tag('a', {href:'guide/ie'}, 'IE restrictions');
        dom.text('.');
        dom.html('</p>');
      }

      if (self.usage) {
        dom.tag('pre', function() {
          dom.tag('code', function() {
            dom.text(self.usage);
          });
        });
      } else {
        if (restrict.match(/E/)) {
          dom.text('as element:');
          dom.code(function() {
            dom.text('<');
            dom.text(dashCase(self.shortName));
            renderParams('\n       ', '="', '"');
            dom.text('>\n</');
            dom.text(dashCase(self.shortName));
            dom.text('>');
          });
        }
        if (restrict.match(/A/)) {
          var element = self.element || 'ANY';
          dom.text('as attribute');
          dom.code(function() {
            dom.text('<' + element + ' ');
            dom.text(dashCase(self.shortName));
            renderParams('\n     ', '="', '"', true);
            dom.text('>\n   ...\n');
            dom.text('</' + element + '>');
          });
        }
        if (restrict.match(/C/)) {
          dom.text('as class');
          var element = self.element || 'ANY';
          dom.code(function() {
            dom.text('<' + element + ' class="');
            dom.text(dashCase(self.shortName));
            renderParams(' ', ': ', ';', true);
            dom.text('">\n   ...\n');
            dom.text('</' + element + '>');
          });
        }
        if(self.animations) {
          var animations = [], matches = self.animations.split("\n");
          matches.forEach(function(ani) {
            var name = ani.match(/^\s*(.+?)\s*-/)[1];
            animations.push(name);
          });

          dom.html('with <span id="animations">animations</span>');
          var comment;
          if(animations.length == 1) {
            comment = 'The ' + animations[0] + ' animation is supported';
          }
          else {
            var rhs = animations[animations.length-1];
            var lhs = '';
            for(var i=0;i<animations.length-1;i++) {
              if(i>0) {
                lhs += ', ';
              }
              lhs += animations[i];
            }
            comment = 'The ' + lhs + ' and ' + rhs + ' animations are supported';
          }
          var element = self.element || 'ANY';
          dom.code(function() {
            dom.text('//' + comment + "\n");
            dom.text('<' + element + ' ');
            dom.text(dashCase(self.shortName));
            renderParams('\n     ', '="', '"', true);
            dom.text(' ng-animate="{');
            animations.forEach(function(ani, index) {
              if (index) {
                dom.text(', ');
              }
              dom.text(ani + ': \'' + ani + '-animation\'');
            });
            dom.text('}">\n   ...\n');
            dom.text('</' + element + '>');
          });

          dom.html('<a href="api/ng.$animator#Methods">Click here</a> to learn more about the steps involved in the animation.');
        }
      }
      self.html_usage_directiveInfo(dom);
      self.html_usage_parameters(dom);
    });

    self.method_properties_events(dom);

    function renderParams(prefix, infix, suffix, skipSelf) {
      (self.param||[]).forEach(function(param) {
        var skip = skipSelf && (param.name == self.shortName || param.name.indexOf(self.shortName + '|') == 0);
        if (!skip) {
          dom.text(prefix);
          dom.text(param.optional ? '[' : '');
          var parts = param.name.split('|');
          dom.text(parts[skipSelf ? 0 : 1] || parts[0]);
        }
        if (BOOLEAN_ATTR[param.name]) {
          dom.text(param.optional ? ']' : '');
        } else {
          dom.text(BOOLEAN_ATTR[param.name] ? '' : infix );
          dom.text(('{' + param.type + '}').replace(/^\{\'(.*)\'\}$/, '$1'));
          dom.text(suffix);
          dom.text(param.optional && !skip ? ']' : '');
        }
      });
    }

  },

  html_usage_filter: function(dom){
    var self = this;
    dom.h('Usage', function() {
      dom.h('In HTML Template Binding', function() {
        dom.tag('code', function() {
          if (self.usage) {
            dom.text(self.usage);
          } else {
            dom.text('{{ ');
            dom.text(self.shortName);
            dom.text('_expression | ');
            dom.text(self.shortName);
            self.parameters(dom, ':', true);
            dom.text(' }}');
          }
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
          dom.text(dashCase(param.name));
          dom.text(BOOLEAN_ATTR[param.name] ? '' : '="{' + param.type + '}"');
          dom.text(param.optional ? ']' : '');
        });
        dom.text('>');
      });
      self.html_usage_parameters(dom);
    });
  },

  html_usage_directiveInfo: function(dom) {
    var self = this;
    var list = [];


    if (self.scope !== undefined) {
      list.push('This directive creates new scope.');
    }
    if (self.priority !== undefined) {
      list.push('This directive executes at priority level ' + self.priority + '.');
    }

    if (list.length) {
      dom.h('Directive info', function() {
        dom.ul(list);
      });
    }
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
var GLOBALS = /^angular\.([^\.]+)$/,
    MODULE = /^((?:(?!^angular\.)[^\.])+)$/,
    MODULE_MOCK = /^angular\.mock\.([^\.]+)$/,
    MODULE_DIRECTIVE = /^((?:(?!^angular\.)[^\.])+)\.directive:([^\.]+)$/,
    MODULE_DIRECTIVE_INPUT = /^((?:(?!^angular\.)[^\.])+)\.directive:input\.([^\.]+)$/,
    MODULE_FILTER = /^((?:(?!^angular\.)[^\.])+)\.filter:([^\.]+)$/,
    MODULE_SERVICE = /^((?:(?!^angular\.)[^\.])+)\.([^\.]+?)(Provider)?$/,
    MODULE_TYPE = /^((?:(?!^angular\.)[^\.])+)\..+\.([A-Z][^\.]+)$/;


function title(text) {
  if (!text) return text;
  var match,
    module,
    type,
    name;

  if (text == 'angular.Module') {
    module = 'ng';
    name = 'Module';
    type = 'Type';
  } else if (match = text.match(GLOBALS)) {
    module = 'ng';
    name = 'angular.' + match[1];
    type = 'API';
  } else if (match = text.match(MODULE)) {
    module = match[1];
  } else if (match = text.match(MODULE_MOCK)) {
    module = 'ng';
    name = 'angular.mock.' + match[1];
    type = 'API';
  } else if (match = text.match(MODULE_DIRECTIVE)) {
    module = match[1];
    name = match[2];
    type = 'directive';
  } else if (match = text.match(MODULE_DIRECTIVE_INPUT)) {
    module = match[1];
    name = 'input [' + match[2] + ']';
    type = 'directive';
  } else if (match = text.match(MODULE_FILTER)) {
    module = match[1];
    name = match[2];
    type = 'filter';
  } else if (match = text.match(MODULE_SERVICE)) {
    module = match[1];
    name = match[2] + (match[3] || '');
    type = 'service';
  } else if (match = text.match(MODULE_TYPE)) {
    module = match[1];
    name = match[2];
    type = 'type';
  } else {
    return text;
  }
  return function() {
    this.tag('code', name);
    this.tag('span', { class: 'hint'}, function() {
      if (type) {
        this.text('(');
        this.text(type);
        this.text(' in module ');
        this.tag('code', module);
        this.text(')');
      }
    });
  };
}


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
        specs.push(indentCode(trim(scenario), 4));
        specs.push('');
      });
      specs.push('});');
      specs.push('');
    });
  }
}


//////////////////////////////////////////////////////////
function metadata(docs){
  var pages = [];
  docs.forEach(function(doc){
    var path = (doc.name || '').split(/(\.|\:\s*)/);
    for ( var i = 1; i < path.length; i++) {
      path.splice(i, 1);
    }
    var shortName = path.pop().trim();

    if (path.pop() == 'input') {
      shortName = 'input [' + shortName + ']';
    }

    pages.push({
      section: doc.section,
      id: doc.id,
      name: title(doc.name),
      shortName: shortName,
      type: doc.ngdoc,
      keywords:doc.keywords()
    });
  });
  pages.sort(keywordSort);
  return pages;
}

var KEYWORD_PRIORITY = {
  '.index': 1,
  '.overview': 1,
  '.bootstrap': 2,
  '.mvc': 3,
  '.scopes': 4,
  '.compiler': 5,
  '.templates': 6,
  '.services': 7,
  '.di': 8,
  '.unit-testing': 9,
  '.dev_guide': 9,
  '.dev_guide.overview': 1,
  '.dev_guide.bootstrap': 2,
  '.dev_guide.bootstrap.auto_bootstrap': 1,
  '.dev_guide.bootstrap.manual_bootstrap': 2,
  '.dev_guide.mvc': 3,
  '.dev_guide.mvc.understanding_model': 1,
  '.dev_guide.mvc.understanding_controller': 2,
  '.dev_guide.mvc.understanding_view': 3,
  '.dev_guide.scopes': 4,
  '.dev_guide.scopes.understanding_scopes': 1,
  '.dev_guide.scopes.internals': 2,
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

function indentCode(text, spaceCount) {
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
      link = link.split('#').shift();
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


var DASH_CASE_REGEXP = /[A-Z]/g;
function dashCase(name){
  return name.replace(DASH_CASE_REGEXP, function(letter, pos) {
    return (pos ? '-' : '') + letter.toLowerCase();
  });
}
