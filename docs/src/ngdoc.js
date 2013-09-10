/**
 * All parsing/transformation code goes here. All code here should be sync to ease testing.
 */
var DOM = require('./dom.js').DOM;
var htmlEscape = require('./dom.js').htmlEscape;
var Example = require('./example.js').Example;
var NEW_LINE = /\n\r?/;
var globalID = 0;
var fs = require('fs');
var fspath = require('path');
var shell = require('shelljs');
var gruntUtil = require('../../lib/grunt/utils.js');
var errorsJson;
var marked = require('marked');
marked.setOptions({
  gfm: true,
  tables: true
});

var lookupMinerrMsg = function (doc) {
  var code, namespace;

  if (errorsJson === undefined) {
    errorsJson = require('../../build/errors.json').errors;
  }

  namespace = doc.getMinerrNamespace();
  code = doc.getMinerrCode();
  if (namespace === undefined) {
    return errorsJson[code];
  }
  return errorsJson[namespace][code];
};

exports.trim = trim;
exports.metadata = metadata;
exports.scenarios = scenarios;
exports.merge = merge;
exports.Doc = Doc;

exports.ngVersions = function() {
  var versions = [], regex = /^v([1-9]\d*(?:\.\d+\S+)+)$/; //only fetch >= 1.0.0 versions
  shell.exec('git tag', {silent: true}).output.split(/\s*\n\s*/)
    .forEach(function(line) {
      var matches = regex.exec(line);
      if(matches && matches.length > 0) {
        versions.push(matches[1]);
      }
    });

  //match the future version of AngularJS that is set in the package.json file
  return expandVersions(sortVersionsNatrually(versions), exports.ngCurrentVersion().full);

  function expandVersions(versions, latestVersion) {
    //copy the array to avoid changing the versions param data
    //the latest version is not on the git tags list, but
    //docs.angularjs.org will always point to master as of 1.2
    versions = versions.concat([latestVersion]);

    var firstUnstable, expanded = [];
    for(var i=versions.length-1;i>=0;i--) {
      var version = versions[i],
          split = version.split('.'),
          isMaster = version == latestVersion,
          isStable = split[1] % 2 == 0;

      var title = 'AngularJS - v' + version;

      //anything that is stable before being unstable is a rc1 version
      //just like with AngularJS 1.2.0rc1 (even though it's apart of the
      //1.1.5 API
      if(isMaster || (isStable && !firstUnstable)) {
        isStable = false;
      }
      else {
        firstUnstable = firstUnstable || version;
      }

      var docsPath = version < '1.0.2' ?  'docs-' + version : 'docs';

      var url = isMaster ?
        'http://docs.angularjs.org' :
        'http://code.angularjs.org/' + version + '/' + docsPath;

      expanded.push({
        version : version,
        stable : isStable,
        title : title,
        group : (isStable ? 'Stable' : 'Unstable'),
        url : url
      });
    };

    return expanded;
  };

  function sortVersionsNatrually(versions) {
    var versionMap = {},
        NON_RC_RELEASE_NUMBER = 999;
    for(var i = versions.length - 1; i >= 0; i--) {
      var version = versions[i];
      var split = version.split(/\.|rc/);
       var baseVersion = split[0] + '.' + split[1] + '.' + split[2];

      //create a map of RC versions for each version
      //this way each RC version can be sorted in "natural" order
      versionMap[baseVersion] = versionMap[baseVersion] || [];

      //NON_RC_RELEASE_NUMBER is used to signal the non-RC version for the release and
      //it will always appear at the top of the list since the number is so high!
      versionMap[baseVersion].push(
        version == baseVersion ? NON_RC_RELEASE_NUMBER : parseInt(version.match(/rc\.?(\d+)/)[1]));
    };

    //flatten the map so that the RC versions occur in a natural sorted order
    //and the official non-RC version shows up at the top of the list of sorted
    //RC versions!
    var angularVersions = [];
    sortedKeys(versionMap).forEach(function(key) {
      var versions = versionMap[key];

      //basic numerical sort
      versions.sort(function(a,b) {
        return a - b;
      });

      versions.forEach(function(v) {
        angularVersions.push(v == NON_RC_RELEASE_NUMBER ? key : key + 'rc' + v);
      });
    });

    return angularVersions;
  };

  function sortedKeys(obj) {
    var keys = [];
    for(var key in obj) {
      keys.push(key);
    };
    keys.sort(true);
    return keys;
  };
};

exports.ngCurrentVersion = function() {
  return gruntUtil.getVersion();
};

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
  var words = fs.readFileSync(__dirname + '/ignore.words', 'utf8');
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
    if (this.ngdoc === 'error') {
      words.push(this.getMinerrNamespace());
      words.push(this.getMinerrCode());
    }
    words.sort();
    return words.join(' ');
  },

  getMinerrNamespace: function () {
    if (this.ngdoc !== 'error') {
      throw new Error('Tried to get the minErr namespace, but @ngdoc ' +
        this.ngdoc + ' was supplied. It should be @ngdoc error');
    }
    return this.name.split(':')[0];
  },

  getMinerrCode: function () {
    if (this.ngdoc !== 'error') {
      throw new Error('Tried to get the minErr error code, but @ngdoc ' +
        this.ngdoc + ' was supplied. It should be @ngdoc error');
    }
    return this.name.split(':')[1];
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
      parts = trim(text).split(/(<pre.*?>[\s\S]*?<\/pre>|<doc:example(\S*).*?>[\s\S]*?<\/doc:example>|<example[^>]*>[\s\S]*?<\/example>)/),
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
            example.addDeps('angular-animate.js');
          }

          example.setModule(module);
          example.addDeps(deps);
          content.replace(/<file\s+name="([^"]*)"\s*>([\s\S]*?)<\/file>/gmi, function(_, name, content) {
            example.addSource(name, content);
          });
          content.replace(/<file\s+src="([^"]+)"(?:\s+tag="([^"]+)")?(?:\s+name="([^"]+)")?\s*\/?>/gmi, function(_, file, tag, name) {
            if(fs.existsSync(file)) {
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
          if(fs.existsSync(file)) {
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
        replace(/^<pre(.*?)>([\s\S]*?)<\/pre>/mi, function(_, attrs, content){
          return placeholder(
            '<pre'+attrs+' class="prettyprint linenums">' +
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
        }).
        replace(/{@type\s+(\S+)(?:\s+(\S+))?}/g, function(_, type, url) {
          url = url || '#';
          return '<a href="' + url + '" class="' + self.prepare_type_hint_class_name(type) + '">' + type + '</a>';
        }).
        replace(/{@installModule\s+(\S+)?}/g, function(_, module) {
          return explainModuleInstallation(module);
        });
    });
    text = parts.join('');

    function prepareClassName(text) {
      return text.toLowerCase().replace(/[_\W]+/g, '-');
    };

    var pageClassName, suffix = '-page';
    if(this.name) {
      var split = this.name.match(/^\s*(.+?)\s*:\s*(.+)/);
      if(split && split.length > 1) {
        var before = prepareClassName(split[1]);
        var after = prepareClassName(split[2]);
        pageClassName = before + suffix + ' ' + before + '-' + after + suffix;
      }
    }
    pageClassName = pageClassName || prepareClassName(this.name || 'docs') + suffix;

    text = '<div class="' + pageClassName + '">' +
             marked(text) +
           '</div>';
    text = text.replace(/(?:<p>)?(REPLACEME\d+)(?:<\/p>)?/g, function(_, id) {
      return placeholderMap[id];
    });

    //!annotate CONTENT
    //!annotate="REGEX" CONTENT
    //!annotate="REGEX" TITLE|CONTENT
    text = text.replace(/\n?\/\/!annotate\s*(?:=\s*['"](.+?)['"])?\s+(.+?)\n\s*(.+?\n)/img,
      function(_, pattern, content, line) {
        var pattern = new RegExp(pattern || '.+');
        var title, text, split = content.split(/\|/);
        if(split.length > 1) {
          text = split[1];
          title = split[0];
        }
        else {
          title = 'Info';
          text = content;
        }
        return "\n" + line.replace(pattern, function(match) {
          return '<div class="nocode nocode-content" data-popover ' +
                   'data-content="' + text + '" ' +
                   'data-title="' + title + '">' +
                      match +
                 '</div>';
        });
      }
    );

    //!details /path/to/local/docs/file.html
    //!details="REGEX" /path/to/local/docs/file.html
    text = text.replace(/\/\/!details\s*(?:=\s*['"](.+?)['"])?\s+(.+?)\n\s*(.+?\n)/img,
      function(_, pattern, url, line) {
        url = '/notes/' + url;
        var pattern = new RegExp(pattern || '.+');
        return line.replace(pattern, function(match) {
          return '<div class="nocode nocode-content" data-foldout data-url="' + url + '">' + match + '</div>';
        });
      }
    );

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
      (this.ngdoc === 'error' ? this.name : '') ||
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
            default: match[5]
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
      self = this,
      minerrMsg;

    if (this.section === 'api') {
      dom.tag('a', {
          href: 'http://github.com/angular/angular.js/tree/v' +
            gruntUtil.getVersion().cdn + '/' + self.file + '#L' + self.line,
          class: 'view-source btn btn-action' }, function(dom) {
        dom.tag('i', {class:'icon-zoom-in'}, ' ');
        dom.text(' View source');
      });
    }
    dom.tag('a', {
        href: 'http://github.com/angular/angular.js/edit/master/' + self.file,
        class: 'improve-docs btn btn-primary' }, function(dom) {
      dom.tag('i', {class:'icon-edit'}, ' ');
      dom.text(' Improve this doc');
    });
    dom.h(title(this), function() {
      notice('deprecated', 'Deprecated API', self.deprecated);
      if (self.ngdoc === 'error') {
        minerrMsg = lookupMinerrMsg(self);
        dom.tag('pre', {
          class:'minerr-errmsg',
          'error-display': minerrMsg.replace(/"/g, '&quot;')
        }, minerrMsg);
      }
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
      if (self[name] === undefined) return;
      dom.tag('fieldset', {'class':name}, function(dom){
        dom.tag('legend', legend);
        dom.text(msg);
      });
    }

  },

  prepare_type_hint_class_name : function(type) {
    var typeClass = type.toLowerCase().match(/^[-\w]+/) || [];
    typeClass = typeClass[0] ? typeClass[0] : 'object';
    return 'label type-hint type-hint-' + typeClass;
  },

  html_usage_parameters: function(dom) {
    var self = this;
    var params = this.param ? this.param : [];
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
      dom.html('<a href="api/ngAnimate.$animate">Click here</a> to learn more about the steps involved in the animation.');
    }
    if(params.length > 0) {
      dom.html('<h2 id="parameters">Parameters</h2>');
      dom.html('<table class="variables-matrix table table-bordered table-striped">');
      dom.html('<thead>');
      dom.html('<tr>');
      dom.html('<th>Param</th>');
      dom.html('<th>Type</th>');
      dom.html('<th>Details</th>');
      dom.html('</tr>');
      dom.html('</thead>');
      dom.html('<tbody>');
      for(var i=0;i<params.length;i++) {
        param = params[i];
        var name = param.name;
        var types = param.type;
        if(types[0]=='(') {
          types = types.substr(1);
        }

        var limit = types.length - 1;
        if(types.charAt(limit) == ')' && types.charAt(limit-1) != '(') {
          types = types.substr(0,limit);
        }
        types = types.split(/\|(?![\(\)\w\|\s]+>)/);
        if (param.optional) {
          name += ' <div><em>(optional)</em></div>';
        }
        dom.html('<tr>');
        dom.html('<td>' + name + '</td>');
        dom.html('<td>');
        for(var j=0;j<types.length;j++) {
          var type = types[j];
          dom.html('<a href="" class="' + self.prepare_type_hint_class_name(type) + '">');
          dom.text(type);
          dom.html('</a>');
        }

        dom.html('</td>');
        var description = '<td>';
        description += param.description;
        if (param.default) {
          description += ' <p><em>(default: ' + param.default + ')</em></p>';
        }
        description += '</td>';
        dom.html(description);
        dom.html('</tr>');
      };
      dom.html('</tbody>');
      dom.html('</table>');
    }
  },

  html_usage_returns: function(dom) {
    var self = this;
    if (self.returns) {
      dom.html('<h2 id="returns">Returns</h2>');
      dom.html('<table class="variables-matrix">');
      dom.html('<tr>');
      dom.html('<td>');
      dom.html('<a href="" class="' + self.prepare_type_hint_class_name(self.returns.type) + '">');
      dom.text(self.returns.type);
      dom.html('</a>');
      dom.html('</td>');
      dom.html('<td>');
      dom.html(self.returns.description);
      dom.html('</td>');
      dom.html('</tr>');
      dom.html('</table>');
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
      var restrict = self.restrict || 'A';

      if (restrict.match(/E/)) {
        dom.html('<p>');
        dom.text('This directive can be used as custom element, but be aware of ');
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

  html_usage_error: function (dom) {
    dom.html();
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


function title(doc) {
  if (!doc.name) return doc.name;
  var match,
    text = doc.name;

  var makeTitle = function (name, type, componentType, component) {
    // Makes title markup.
    // makeTitle('Foo', 'directive', 'module', 'ng') ->
    //    Foo is a directive in module ng
    return function () {
      this.tag('code', name);
      this.tag('div', function () {
        this.tag('span', {class: 'hint'}, function () {
          if (type && component) {
            this.text(type + ' in ' + componentType + ' ');
            this.tag('code', component);
          }
        });
      });
    };
  };

  if (doc.ngdoc === 'error') {
    return makeTitle(doc.fullName, 'error', 'component', doc.getMinerrNamespace());
  } else if (text == 'angular.Module') {
    return makeTitle('Module', 'Type', 'module', 'ng');
  } else if (match = text.match(GLOBALS)) {
    return makeTitle('angular.' + match[1], 'API', 'module', 'ng');
  } else if (match = text.match(MODULE)) {
    return makeTitle('', '', 'module', match[1]);
  } else if (match = text.match(MODULE_MOCK)) {
    return makeTitle('angular.mock.' + match[1], 'API', 'module', 'ng');
  } else if (match = text.match(MODULE_DIRECTIVE)) {
    return makeTitle(match[2], 'directive', 'module', match[1]);
  } else if (match = text.match(MODULE_DIRECTIVE_INPUT)) {
    return makeTitle('input [' + match[2] + ']', 'directive', 'module', match[1]);
  } else if (match = text.match(MODULE_FILTER)) {
    return makeTitle(match[2], 'filter', 'module', match[1]);
  } else if (match = text.match(MODULE_SERVICE)) {
    return makeTitle(match[2] + (match[3] || ''), 'service', 'module', match[1]);
  } else if (match = text.match(MODULE_TYPE)) {
    return makeTitle(match[2], 'type', 'module', match[1]);
  }
  return text;
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
      name: title(doc),
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
//////////////////////////////////////////////////////////

function explainModuleInstallation(moduleName){
  var ngMod = ngModule(moduleName),
    modulePackage = 'angular-' + moduleName,
    modulePackageFile = modulePackage + '.js';

  return '<h1>Installation</h1>' +
    '<p>First include <code>' + modulePackageFile +'</code> in your HTML:</p><pre><code>' +
    '    &lt;script src=&quot;angular.js&quot;&gt;\n' +
    '    &lt;script src=&quot;' + modulePackageFile + '&quot;&gt;</pre></code>' +

    '<p>You can also find this file on the [Google CDN](https://developers.google.com/speed/libraries/devguide#angularjs), ' +
    '<a href="http://bower.io/">Bower</a> (as <code>' + modulePackage + '</code>), ' +
    'and on <a href="http://code.angularjs.org/">code.angularjs.org</a>.</p>' +

    '<p>Then load the module in your application by adding it as a dependent module:</p><pre><code>' +
    '    angular.module(\'app\', [\'' + ngMod + '\']);</pre></code>' +

    '<p>With that you\'re ready to get started!</p>';
}

function ngModule(moduleName) {
  return 'ng' + moduleName[0].toUpperCase() + moduleName.substr(1);
}
