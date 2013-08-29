'use strict';

var directive = {};
var service = { value: {} };

var DEPENDENCIES = {
  'angular.js': 'http://code.angularjs.org/' + angular.version.full + '/angular.min.js',
  'angular-resource.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-resource.min.js',
  'angular-route.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-route.min.js',
  'angular-animate.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-animate.min.js',
  'angular-sanitize.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-sanitize.min.js',
  'angular-cookies.js': 'http://code.angularjs.org/' + angular.version.full + '/angular-cookies.min.js'
};


function escape(text) {
  return text.
    replace(/\&/g, '&amp;').
    replace(/\</g, '&lt;').
    replace(/\>/g, '&gt;').
    replace(/"/g, '&quot;');
}

/**
 * http://stackoverflow.com/questions/451486/pre-tag-loses-line-breaks-when-setting-innerhtml-in-ie
 * http://stackoverflow.com/questions/195363/inserting-a-newline-into-a-pre-tag-ie-javascript
 */
function setHtmlIe8SafeWay(element, html) {
  var newElement = angular.element('<pre>' + html + '</pre>');

  element.html('');
  element.append(newElement.contents());
  return element;
}


directive.jsFiddle = function(getEmbeddedTemplate, escape, script) {
  return {
    terminal: true,
    link: function(scope, element, attr) {
      var name = '',
        stylesheet = '<link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css">\n',
        fields = {
          html: '',
          css: '',
          js: ''
        };

      angular.forEach(attr.jsFiddle.split(' '), function(file, index) {
        var fileType = file.split('.')[1];

        if (fileType == 'html') {
          if (index == 0) {
            fields[fileType] +=
              '<div ng-app' + (attr.module ? '="' + attr.module + '"' : '') + '>\n' +
                getEmbeddedTemplate(file, 2);
          } else {
            fields[fileType] += '\n\n\n  <!-- CACHE FILE: ' + file + ' -->\n' +
              '  <script type="text/ng-template" id="' + file + '">\n' +
              getEmbeddedTemplate(file, 4) +
              '  </script>\n';
          }
        } else {
          fields[fileType] += getEmbeddedTemplate(file) + '\n';
        }
      });

      fields.html += '</div>\n';

      setHtmlIe8SafeWay(element,
        '<form class="jsfiddle" method="post" action="http://jsfiddle.net/api/post/library/pure/" target="_blank">' +
          hiddenField('title', 'AngularJS Example: ' + name) +
          hiddenField('css', '</style> <!-- Ugly Hack due to jsFiddle issue: http://goo.gl/BUfGZ --> \n' +
            stylesheet +
            script.angular +
            (attr.resource ? script.resource : '') +
            '<style>\n' +
            fields.css) +
          hiddenField('html', fields.html) +
          hiddenField('js', fields.js) +
          '<button class="btn btn-primary"><i class="icon-white icon-pencil"></i> Edit Me</button>' +
          '</form>');

      function hiddenField(name, value) {
        return '<input type="hidden" name="' +  name + '" value="' + escape(value) + '">';
      }
    }
  }
};


directive.code = function() {
  return {restrict: 'E', terminal: true};
};


directive.prettyprint = ['reindentCode', function(reindentCode) {
  return {
    restrict: 'C',
    compile: function(element) {
      var html = element.html();
      //ensure that angular won't compile {{ curly }} values
      html = html.replace(/\{\{/g, '<span>{{</span>')
                 .replace(/\}\}/g, '<span>}}</span>');
      if (window.RUNNING_IN_NG_TEST_RUNNER) {
        element.html(html);
      }
      else {
        element.html(window.prettyPrintOne(reindentCode(html), undefined, true));
      }
    }
  };
}];


directive.ngSetText = ['getEmbeddedTemplate', function(getEmbeddedTemplate) {
  return {
    restrict: 'CA',
    priority: 10,
    compile: function(element, attr) {
      setHtmlIe8SafeWay(element, escape(getEmbeddedTemplate(attr.ngSetText)));
    }
  }
}]


directive.ngHtmlWrap = ['reindentCode', 'templateMerge', function(reindentCode, templateMerge) {
  return {
    compile: function(element, attr) {
      var properties = {
            head: '',
            module: '',
            body: element.text()
          },
        html = "<!doctype html>\n<html ng-app{{module}}>\n  <head>\n{{head:4}}  </head>\n  <body>\n{{body:4}}  </body>\n</html>";

      angular.forEach((attr.ngHtmlWrap || '').split(' '), function(dep) {
        if (!dep) return;
        dep = DEPENDENCIES[dep] || dep;

        var ext = dep.split(/\./).pop();

        if (ext == 'css') {
          properties.head += '<link rel="stylesheet" href="' + dep + '" type="text/css">\n';
        } else if(ext == 'js') {
          properties.head += '<script src="' + dep + '"></script>\n';
        } else {
          properties.module = '="' + dep + '"';
        }
      });

      setHtmlIe8SafeWay(element, escape(templateMerge(html, properties)));
    }
  }
}];


directive.ngSetHtml = ['getEmbeddedTemplate', function(getEmbeddedTemplate) {
  return {
    restrict: 'CA',
    priority: 10,
    compile: function(element, attr) {
      setHtmlIe8SafeWay(element, getEmbeddedTemplate(attr.ngSetHtml));
    }
  }
}];


directive.ngEvalJavascript = ['getEmbeddedTemplate', function(getEmbeddedTemplate) {
  return {
    compile: function (element, attr) {
      var script = getEmbeddedTemplate(attr.ngEvalJavascript);

      try {
        if (window.execScript) { // IE
          window.execScript(script || '""'); // IE complains when evaling empty string
        } else {
          window.eval(script);
        }
      } catch (e) {
        if (window.console) {
          window.console.log(script, '\n', e);
        } else {
          window.alert(e);
        }
      }
    }
  };
}];


directive.ngEmbedApp = ['$templateCache', '$browser', '$rootScope', '$location', '$sniffer', '$animate',
                function($templateCache,   $browser,  docsRootScope, $location,   $sniffer, $animate) {
  return {
    terminal: true,
    link: function(scope, element, attrs) {
      var modules = ['ngAnimate'],
          embedRootScope,
          deregisterEmbedRootScope;

      modules.push(['$provide', function($provide) {
        $provide.value('$templateCache', $templateCache);
        $provide.value('$anchorScroll', angular.noop);
        $provide.value('$browser', $browser);
        $provide.value('$sniffer', $sniffer);
        $provide.provider('$location', function() {
          this.$get = ['$rootScope', function($rootScope) {
            docsRootScope.$on('$locationChangeSuccess', function(event, oldUrl, newUrl) {
              $rootScope.$broadcast('$locationChangeSuccess', oldUrl, newUrl);
            });
            return $location;
          }];
          this.html5Mode = angular.noop;
        });
        $provide.decorator('$timeout', ['$rootScope', '$delegate', function($rootScope, $delegate) {
          return angular.extend(function(fn, delay) {
            if (delay && delay > 50) {
              return setTimeout(function() {
                $rootScope.$apply(fn);
              }, delay);
            } else {
              return $delegate.apply(this, arguments);
            }
          }, $delegate);
        }]);
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {
          embedRootScope = $delegate;
          deregisterEmbedRootScope = docsRootScope.$watch(function embedRootScopeDigestWatch() {
            embedRootScope.$digest();
          });

          return embedRootScope;
        }]);
      }]);
      if (attrs.ngEmbedApp)  modules.push(attrs.ngEmbedApp);

      element.on('click', function(event) {
        if (event.target.attributes.getNamedItem('ng-click')) {
          event.preventDefault();
        }
      });

      element.bind('$destroy', function() {
        deregisterEmbedRootScope();
        embedRootScope.$destroy();
      });

      element.data('$injector', null);
      angular.bootstrap(element, modules);
    }
  };
}];

service.reindentCode = function() {
  return function (text, spaces) {
    if (!text) return text;
    var lines = text.split(/\r?\n/);
    var prefix = '      '.substr(0, spaces || 0);
    var i;

    // remove any leading blank lines
    while (lines.length && lines[0].match(/^\s*$/)) lines.shift();
    // remove any trailing blank lines
    while (lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
    var minIndent = 999;
    for (i = 0; i < lines.length; i++) {
      var line = lines[0];
      var reindentCode = line.match(/^\s*/)[0];
      if (reindentCode !== line && reindentCode.length < minIndent) {
        minIndent = reindentCode.length;
      }
    }

    for (i = 0; i < lines.length; i++) {
      lines[i] = prefix + lines[i].substring(minIndent);
    }
    lines.push('');
    return lines.join('\n');
  }
};

service.templateMerge = ['reindentCode', function(indentCode) {
  return function(template, properties) {
    return template.replace(/\{\{(\w+)(?:\:(\d+))?\}\}/g, function(_, key, indent) {
      var value = properties[key];

      if (indent) {
        value = indentCode(value, indent);
      }

      return value == undefined ? '' : value;
    });
  };
}];

service.getEmbeddedTemplate = ['reindentCode', function(reindentCode) {
  return function (id) {
    var element = document.getElementById(id);

    if (!element) {
      return null;
    }

    return reindentCode(angular.element(element).html(), 0);
  }
}];


angular.module('bootstrapPrettify', []).directive(directive).factory(service);
