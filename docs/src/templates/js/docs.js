var docsApp = {
  controller: {},
  directive: {},
  serviceFactory: {}
};


docsApp.directive.focused = function($timeout) {
  return function(scope, element, attrs) {
    element[0].focus();
    element.bind('focus', function() {
      scope.$apply(attrs.focused + '=true');
    });
    element.bind('blur', function() {
      // have to use $timeout, so that we close the drop-down after the user clicks,
      // otherwise when the user clicks we process the closing before we process the click.
      $timeout(function() {
        scope.$eval(attrs.focused + '=false');
      });
    });
    scope.$eval(attrs.focused + '=true');
  };
};


docsApp.directive.code = function() {
  return { restrict:'E', terminal: true };
};


docsApp.directive.sourceEdit = function(getEmbeddedTemplate) {
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
};


docsApp.directive.docTutorialNav = function(templateMerge) {
  var pages = [
    '',
    'step_00', 'step_01', 'step_02', 'step_03', 'step_04',
    'step_05', 'step_06', 'step_07', 'step_08', 'step_09',
    'step_10', 'step_11', 'the_end'
  ];
  return {
    compile: function(element, attrs) {
      var seq = 1 * attrs.docTutorialNav,
          props = {
            seq: seq,
            prev: pages[seq],
            next: pages[2 + seq],
            diffLo: seq ? (seq - 1): '0~1',
            diffHi: seq
          };

      element.addClass('btn-group');
      element.addClass('tutorial-nav');
      element.append(templateMerge(
        '<li class="btn btn-primary"><a href="tutorial/{{prev}}"><i class="icon-step-backward"></i> Previous</a></li>\n' +
        '<li class="btn btn-primary"><a href="http://angular.github.com/angular-phonecat/step-{{seq}}/app"><i class="icon-play"></i> Live Demo</a></li>\n' +
        '<li class="btn btn-primary"><a href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><i class="icon-search"></i> Code Diff</a></li>\n' +
        '<li class="btn btn-primary"><a href="tutorial/{{next}}">Next <i class="icon-step-forward"></i></a></li>', props));
    }
  };
};


docsApp.directive.docTutorialReset = function() {
  function tab(name, command, id, step) {
    return '' +
      '  <div class=\'tab-pane well\' title="' + name + '" value="' + id + '">\n' +
      '    <ol>\n' +
      '      <li><p>Reset the workspace to step ' + step + '.</p>' +
      '        <pre>' + command + '</pre></li>\n' +
      '      <li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-' + step + '/app">Angular\'s server</a>.</p></li>\n' +
      '    </ol>\n' +
      '  </div>\n';
  }

  return {
    compile: function(element, attrs) {
      var step = attrs.docTutorialReset;
      element.html(
        '<div ng-hide="show">' +
          '<p><a href="" ng-click="show=true;$event.stopPropagation()">Workspace Reset Instructions  ➤</a></p>' +
        '</div>\n' +
        '<div class="tabbable" ng-show="show" ng-model="$cookies.platformPreference">\n' +
          tab('Git on Mac/Linux', 'git checkout -f step-' + step, 'gitUnix', step) +
          tab('Git on Windows', 'git checkout -f step-' + step, 'gitWin', step) +
        '</div>\n');
    }
  };
};


docsApp.serviceFactory.angularUrls = function($document) {
  var urls = {};

  angular.forEach($document.find('script'), function(script) {
    var match = script.src.match(/^.*\/(angular[^\/]*\.js)$/);
    if (match) {
      urls[match[1].replace(/(\-\d.*)?(\.min)?\.js$/, '.js')] = match[0];
    }
  });

  return urls;
};


docsApp.serviceFactory.formPostData = function($document) {
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
};

docsApp.serviceFactory.openPlunkr = function(templateMerge, formPostData, angularUrls) {
  return function(content) {
    var allFiles = [].concat(content.js, content.css, content.html);
    var indexHtmlContent = '<!doctype html>\n' +
        '<html ng-app>\n' +
        '  <head>\n' +
        '    <script src="{{angularJSUrl}}"></script>\n' +
        '{{scriptDeps}}\n' +
        '  </head>\n' +
        '  <body>\n\n' +
        '{{indexContents}}' +
        '\n\n  </body>\n' +
        '</html>\n';
    var scriptDeps = '';
    angular.forEach(content.deps, function(file) {
      if (file.name !== 'angular.js') {
        scriptDeps += '    <script src="' + file.name + '"></script>\n';
      }
    });
    indexProp = {
      angularJSUrl: angularUrls['angular.js'],
      scriptDeps: scriptDeps,
      indexContents: content.html[0].content
    };
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
};

docsApp.serviceFactory.openJsFiddle = function(templateMerge, formPostData, angularUrls) {

  var HTML = '<div ng-app=\"{{module}}\">\n{{html:2}}</div>',
      CSS = '</style> <!-- Ugly Hack due to jsFiddle issue: http://goo.gl/BUfGZ --> \n' +
        '{{head:0}}<style>\n​.ng-invalid { border: 1px solid red; }​\n{{css}}',
      SCRIPT = '{{script}}',
      SCRIPT_CACHE = '\n\n<!-- {{name}} -->\n<script type="text/ng-template" id="{{name}}">\n{{content:2}}</script>';

  return function(content) {
    var prop = {
          module: content.module,
          html: '',
          css: '',
          script: ''
        };

    prop.head = templateMerge('<script src="{{url}}"></script>', {url: angularUrls['angular.js']});

    angular.forEach(content.html, function(file, index) {
      if (index) {
        prop.html += templateMerge(SCRIPT_CACHE, file);
      } else {
        prop.html += file.content;
      }
    });

    angular.forEach(content.js, function(file, index) {
      prop.script += file.content;
    });

    angular.forEach(content.css, function(file, index) {
      prop.css += file.content;
    });

    formPostData("http://jsfiddle.net/api/post/library/pure/", {
      title: 'AngularJS Example',
      html: templateMerge(HTML, prop),
      js: templateMerge(SCRIPT, prop),
      css: templateMerge(CSS, prop)
    });
  };
};


docsApp.serviceFactory.sections = function sections() {
  var sections = {
    guide: [],
    api: [],
    tutorial: [],
    misc: [],
    cookbook: [],
    getPage: function(sectionId, partialId) {
      var pages = sections[sectionId];

      partialId = partialId || 'index';

      for (var i = 0, ii = pages.length; i < ii; i++) {
        if (pages[i].id == partialId) {
          return pages[i];
        }
      }
      return null;
    }
  };

  angular.forEach(NG_PAGES, function(page) {
    page.url = page.section + '/' +  page.id;
    if (page.id == 'angular.Module') {
      page.partialUrl = 'partials/api/angular.IModule.html';
    } else {
      page.partialUrl = 'partials/' + page.url + '.html';
    }

    sections[page.section].push(page);
  });

  return sections;
};


docsApp.controller.DocsController = function($scope, $location, $window, $cookies, sections) {
  var OFFLINE_COOKIE_NAME = 'ng-offline',
      DOCS_PATH = /^\/(api)|(guide)|(cookbook)|(misc)|(tutorial)/,
      INDEX_PATH = /^(\/|\/index[^\.]*.html)$/,
      GLOBALS = /^angular\.([^\.]+)$/,
      MODULE = /^((?:(?!^angular\.)[^\.])+)$/,
      MODULE_MOCK = /^angular\.mock\.([^\.]+)$/,
      MODULE_DIRECTIVE = /^((?:(?!^angular\.)[^\.])+)\.directive:([^\.]+)$/,
      MODULE_DIRECTIVE_INPUT = /^((?:(?!^angular\.)[^\.])+)\.directive:input\.([^\.]+)$/,
      MODULE_FILTER = /^((?:(?!^angular\.)[^\.])+)\.filter:([^\.]+)$/,
      MODULE_SERVICE = /^((?:(?!^angular\.)[^\.])+)\.([^\.]+?)(Provider)?$/,
      MODULE_TYPE = /^((?:(?!^angular\.)[^\.])+)\..+\.([A-Z][^\.]+)$/,
      URL = {
        module: 'guide/module',
        directive: 'guide/directive',
        input: 'api/ng.directive:input',
        filter: 'guide/dev_guide.templates.filters',
        service: 'guide/dev_guide.services',
        type: 'guide/types'
      };


  /**********************************
   Publish methods
   ***********************************/

  $scope.navClass = function(page1, page2) {
    return {
      last: this.$last,
      active: page1 && this.currentPage == page1 || page2 && this.currentPage == page2
    };
  };

  $scope.submitForm = function() {
    $scope.bestMatch && $location.path($scope.bestMatch.page.url);
  };

  $scope.afterPartialLoaded = function() {
    var currentPageId = $location.path();
    $scope.partialTitle = $scope.currentPage.shortName;
    $window._gaq.push(['_trackPageview', currentPageId]);
    loadDisqus(currentPageId);
  };

  /** stores a cookie that is used by apache to decide which manifest ot send */
  $scope.enableOffline = function() {
    //The cookie will be good for one year!
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    var value = angular.version.full;
    document.cookie = OFFLINE_COOKIE_NAME + "="+value+expires+"; path=" + $location.path;

    //force the page to reload so server can serve new manifest file
    window.location.reload(true);
  };



  /**********************************
   Watches
   ***********************************/

  var SECTION_NAME = {
    api: 'API Reference',
    guide: 'Developer Guide',
    misc: 'Miscellaneous',
    tutorial: 'Tutorial',
    cookbook: 'Examples'
  };
  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {
    // ignore non-doc links which are used in examples
    if (DOCS_PATH.test(path)) {
      var parts = path.split('/'),
        sectionId = parts[1],
        partialId = parts[2],
        sectionName = SECTION_NAME[sectionId] || sectionId,
        page = sections.getPage(sectionId, partialId);

      $scope.currentPage = sections.getPage(sectionId, partialId);

      if (!$scope.currentPage) {
        $scope.partialTitle = 'Error: Page Not Found!';
      }

      updateSearch();


      // Update breadcrumbs
      var breadcrumb = $scope.breadcrumb = [],
        match;

      if (partialId) {
        breadcrumb.push({ name: sectionName, url: sectionId });
        if (partialId == 'angular.Module') {
          breadcrumb.push({ name: 'angular.Module' });
        } else if (match = partialId.match(GLOBALS)) {
          breadcrumb.push({ name: partialId });
        } else if (match = partialId.match(MODULE)) {
          breadcrumb.push({ name: match[1] });
        } else if (match = partialId.match(MODULE_FILTER)) {
          breadcrumb.push({ name: match[1], url: sectionId + '/' + match[1] });
          breadcrumb.push({ name: match[2] });
        } else if (match = partialId.match(MODULE_DIRECTIVE)) {
          breadcrumb.push({ name: match[1], url: sectionId + '/' + match[1] });
          breadcrumb.push({ name: match[2] });
        } else if (match = partialId.match(MODULE_DIRECTIVE_INPUT)) {
          breadcrumb.push({ name: match[1], url: sectionId + '/' + match[1] });
          breadcrumb.push({ name: 'input', url: URL.input });
          breadcrumb.push({ name: match[2] });
        } else if (match = partialId.match(MODULE_TYPE)) {
          breadcrumb.push({ name: match[1], url: sectionId + '/' + match[1] });
          breadcrumb.push({ name: match[2] });
        }  else if (match = partialId.match(MODULE_SERVICE)) {
          breadcrumb.push({ name: match[1], url: sectionId + '/' + match[1] });
          breadcrumb.push({ name: match[2] + (match[3] || '') });
        } else if (match = partialId.match(MODULE_MOCK)) {
          breadcrumb.push({ name: 'angular.mock.' + match[1] });
        } else {
          breadcrumb.push({ name: page.shortName });
        }
      } else {
        breadcrumb.push({ name: sectionName });
      }
    }
  });

  $scope.$watch('search', updateSearch);



  /**********************************
   Initialize
   ***********************************/

  $scope.versionNumber = angular.version.full;
  $scope.version = angular.version.full + "  " + angular.version.codeName;
  $scope.subpage = false;
  $scope.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);
  $scope.futurePartialTitle = null;
  $scope.loading = 0;
  $scope.URL = URL;
  $scope.$cookies = $cookies;

  $cookies.platformPreference = $cookies.platformPreference || 'gitUnix';

  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }
  // bind escape to hash reset callback
  angular.element(window).bind('keydown', function(e) {
    if (e.keyCode === 27) {
      $scope.$apply(function() {
        $scope.subpage = false;
      });
    }
  });

  /**********************************
   Private methods
   ***********************************/

  function updateSearch() {
    var cache = {},
        pages = sections[$location.path().split('/')[1]],
        modules = $scope.modules = [],
        otherPages = $scope.pages = [],
        search = $scope.search,
        bestMatch = {page: null, rank:0};

    angular.forEach(pages, function(page) {
      var match,
        id = page.id;

      if (!(match = rank(page, search))) return;

      if (match.rank > bestMatch.rank) {
        bestMatch = match;
      }

      if (page.id == 'index') {
        //skip
      } else if (page.section != 'api') {
        otherPages.push(page);
      } else if (id == 'angular.Module') {
        module('ng').types.push(page);
      } else if (match = id.match(GLOBALS)) {
        module('ng').globals.push(page);
      } else if (match = id.match(MODULE)) {
        module(match[1]);
      } else if (match = id.match(MODULE_FILTER)) {
        module(match[1]).filters.push(page);
      } else if (match = id.match(MODULE_DIRECTIVE)) {
        module(match[1]).directives.push(page);
      } else if (match = id.match(MODULE_DIRECTIVE_INPUT)) {
        module(match[1]).directives.push(page);
      } else if (match = id.match(MODULE_SERVICE)) {
        module(match[1]).service(match[2])[match[3] ? 'provider' : 'instance'] = page;
      } else if (match = id.match(MODULE_TYPE)) {
        module(match[1]).types.push(page);
      } else if (match = id.match(MODULE_MOCK)) {
        module('ngMock').globals.push(page);
      }

    });

    $scope.bestMatch = bestMatch;

    /*************/

    function module(name) {
      var module = cache[name];
      if (!module) {
        module = cache[name] = {
          name: name,
          url: 'api/' + name,
          globals: [],
          directives: [],
          services: [],
          service: function(name) {
            var service =  cache[this.name + ':' + name];
            if (!service) {
              service = {name: name};
              cache[this.name + ':' + name] = service;
              this.services.push(service);
            }
            return service;
          },
          types: [],
          filters: []
        };
        modules.push(module);
      }
      return module;
    }

    function rank(page, terms) {
      var ranking = {page: page, rank:0},
        keywords = page.keywords,
        title = page.shortName.toLowerCase();

      terms && angular.forEach(terms.toLowerCase().split(' '), function(term) {
        var index;

        if (ranking) {
          if (keywords.indexOf(term) == -1) {
            ranking = null;
          } else {
            ranking.rank ++; // one point for each term found
            if ((index = title.indexOf(term)) != -1) {
              ranking.rank += 20 - index; // ten points if you match title
            }
          }
        }
      });
      return ranking;
    }
  }


  function loadDisqus(currentPageId) {
    // http://docs.disqus.com/help/2/
    window.disqus_shortname = 'angularjs-next';
    window.disqus_identifier = currentPageId;
    window.disqus_url = 'http://docs.angularjs.org' + currentPageId;

    if ($location.host() == 'localhost') {
      return; // don't display disqus on localhost, comment this out if needed
      //window.disqus_developer = 1;
    }

    // http://docs.disqus.com/developers/universal/
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://angularjs.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] ||
        document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

    angular.element(document.getElementById('disqus_thread')).html('');
  }
};


angular.module('docsApp', ['ngResource', 'ngCookies', 'ngSanitize', 'bootstrap', 'bootstrapPrettify']).
  config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }).
  factory(docsApp.serviceFactory).
  directive(docsApp.directive).
  controller(docsApp.controller);
