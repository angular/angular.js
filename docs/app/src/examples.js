angular.module('examples', [])

.directive('sourceEdit', function(getEmbeddedTemplate) {
  return {
    template: '<div class="btn-group pull-right">' +
        '<a class="btn dropdown-toggle btn-primary" data-toggle="dropdown" href>' +
        '  <i class="icon-pencil icon-white"></i> Edit<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
        '  <li><a ng-click="plunkr($event)" href="">In Plunkr</a></li>' +
        '  <li><a ng-click="fiddle($event)" href="">In JsFiddle</a></li>' +
        '</ul>' +
        '</div>',
    scope: true,
    controller: function($scope, $attrs, openJsFiddle, openPlunkr) {
      var sources = {
        module: $attrs.sourceEdit,
        deps: read($attrs.sourceEditDeps),
        html: read($attrs.sourceEditHtml),
        css: read($attrs.sourceEditCss),
        js: read($attrs.sourceEditJs),
        json: read($attrs.sourceEditJson),
        unit: read($attrs.sourceEditUnit),
        scenario: read($attrs.sourceEditScenario)
      };
      $scope.fiddle = function(e) {
        e.stopPropagation();
        openJsFiddle(sources);
      };
      $scope.plunkr = function(e) {
        e.stopPropagation();
        openPlunkr(sources);
      };
    }
  };

  function read(text) {
    var files = [];
    angular.forEach(text ? text.split(' ') : [], function(refId) {
      // refId is index.html-343, so we need to strip the unique ID when exporting the name
      files.push({name: refId.replace(/-\d+$/, ''), content: getEmbeddedTemplate(refId)});
    });
    return files;
  }
})


.factory('angularUrls', function($document) {
  var urls = {};

  angular.forEach($document.find('script'), function(script) {
    var match = script.src.match(/^.*\/(angular[^\/]*\.js)$/);
    if (match) {
      urls[match[1].replace(/(\-\d.*)?(\.min)?\.js$/, '.js')] = match[0];
    }
  });

  return urls;
})


.factory('formPostData', function($document) {
  return function(url, fields) {
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
    angular.forEach(fields, function(value, name) {
      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
})


.factory('prepareDefaultAppModule', function() {
  return function(content) {
    var deps = [];
    angular.forEach(content.deps, function(file) {
      if(file.name == 'angular-animate.js') {
        deps.push('ngAnimate');
      }
    });

    var moduleName = 'App';
    return {
      module : moduleName,
      script : "angular.module('" + moduleName + "', [" +
          (deps.length ? "'" + deps.join("','") + "'" : "") + "]);\n\n"
    };
  };
})

.factory('prepareEditorAssetTags', function(angularUrls) {
  return function(content, options) {
    options = options || {};
    var includeLocalFiles = options.includeLocalFiles;
    var html = makeScriptTag(angularUrls['angular.js']);

    var allFiles = [].concat(content.js, content.css, content.html, content.json);
    angular.forEach(content.deps, function(file) {
      if (file.name !== 'angular.js') {
        var isLocal = false;
        for(var i=0;i<allFiles.length;i++) {
          if(allFiles[i].name == file.name) {
            isLocal = true;
            break;
          }
        }
        if(!(isLocal && !includeLocalFiles)) {
          var assetUrl = angularUrls[file.name] || file.name;
          html += makeScriptTag(assetUrl);
        }
      }
    });

    if(includeLocalFiles) {
      angular.forEach(content.css, function(file, index) {
        html += makeCssLinkTag(file.name);
      });
    }

    return html;


    function makeScriptTag(src) {
      return '<script type="text/javascript" src="' + src + '"></script>\n';
    }

    function makeCssLinkTag(src) {
      return '<link rel="stylesheet" type="text/css" href="' + src + '" />\n';
    }
  };
})


.factory('openPlunkr', function(templateMerge, formPostData, prepareEditorAssetTags, prepareDefaultAppModule) {
  return function(content) {
    var hasRouting = false;
    angular.forEach(content.deps, function(file) {
      hasRouting = hasRouting || file.name == 'angular-route.js';
    });
    var indexHtmlContent = '<!doctype html>\n' +
                           '<html ng-app="{{module}}">\n' +
                           '  <head>\n' +
                           '{{scriptDeps}}';

    if(hasRouting) {
        indexHtmlContent += '<script type="text/javascript">\n' +
                            '//this is here to make plunkr work with AngularJS routing\n' +
                            'angular.element(document.getElementsByTagName(\'head\')).append(' +
                              'angular.element(\'<base href="\' + window.location.pathname + \'" />\')' +
                            ');\n' +
                            '</script>\n';
    }

    indexHtmlContent += '</head>\n' +
                        '  <body>\n\n' +
                        '{{indexContents}}\n\n' +
                        '  </body>\n' +
                        '</html>\n';

    indexProp = {
      module: content.module,
      scriptDeps: prepareEditorAssetTags(content, { includeLocalFiles : true }),
      indexContents: content.html[0].content
    };

    var allFiles = [].concat(content.js, content.css, content.html, content.json);

    if(!content.module) {
      var moduleData = prepareDefaultAppModule(content);
      indexProp.module = moduleData.module;

      var found = false;
      angular.forEach(content.js, function(file) {
        if(file.name == 'script.js') {
          file.content = moduleData.script + file.content;
          found = true;
        }
      });
      if(!found) {
        indexProp.scriptDeps += '<script type="text/javascript" src="script.js"></script>\n';
        allFiles.push({
          name : 'script.js',
          content : moduleData.script
        });
      }
    }

    var postData = {};

    angular.forEach(allFiles, function(file, index) {
      if (file.content && file.name != 'index.html') {
        postData['files[' + file.name + ']'] = file.content;
      }
    });

    postData['files[index.html]'] = templateMerge(indexHtmlContent, indexProp);
    postData['tags[]'] = "angularjs";

    postData.private = true;
    postData.description = 'AngularJS Example Plunkr';

    formPostData('http://plnkr.co/edit/?p=preview', postData);
  };
})

.factory('openJsFiddle', function(templateMerge, formPostData, prepareEditorAssetTags, prepareDefaultAppModule) {
  var HTML = '<div ng-app=\"{{module}}\">\n{{html:2}}</div>',
      CSS = '</style> <!-- Ugly Hack to make remote files preload in jsFiddle --> \n' +
        '{{head:0}}<style>{{css}}',
      SCRIPT = '{{script}}',
      SCRIPT_CACHE = '\n\n<!-- {{name}} -->\n<script type="text/ng-template" id="{{name}}">\n{{content:2}}</script>',
      BASE_HREF_TAG = '<!--  Ugly Hack to make AngularJS routing work inside of jsFiddle -->\n' +
                      '<base href="/" />\n\n';

  return function(content) {
    var prop = {
          module: content.module,
          html: '',
          css: '',
          script: ''
        };
    if(!prop.module) {
      var moduleData = prepareDefaultAppModule(content);
      prop.script = moduleData.script;
      prop.module = moduleData.module;
    }

    angular.forEach(content.html, function(file, index) {
      if (index) {
        prop.html += templateMerge(SCRIPT_CACHE, file);
      } else {
        prop.html += file.content;
      }
    });

    prop.head = prepareEditorAssetTags(content, { includeLocalFiles : false });

    angular.forEach(content.js, function(file, index) {
      prop.script += file.content;
    });

    angular.forEach(content.css, function(file, index) {
      prop.css += file.content;
    });

    var hasRouting = false;
    angular.forEach(content.deps, function(file) {
      hasRouting = hasRouting || file.name == 'angular-route.js';
    });

    var compiledHTML = templateMerge(HTML, prop);
    if(hasRouting) {
      compiledHTML = BASE_HREF_TAG + compiledHTML;
    }
    formPostData("http://jsfiddle.net/api/post/library/pure/", {
      title: 'AngularJS Example',
      html: compiledHTML,
      js: templateMerge(SCRIPT, prop),
      css: templateMerge(CSS, prop)
    });
  };
});
