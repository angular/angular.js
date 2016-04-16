angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngAnimate',
  'DocsController',
  'versionsData',
  'pagesData',
  'navData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'ui.bootstrap.dropdown'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);

angular.module('directives', [])

/**
 * backToTop Directive
 * @param  {Function} $anchorScroll
 *
 * @description Ensure that the browser scrolls when the anchor is clicked
 */
.directive('backToTop', ['$anchorScroll', '$location', function($anchorScroll, $location) {
  return function link(scope, element) {
    element.on('click', function(event) {
      $location.hash('');
      scope.$apply($anchorScroll);
    });
  };
}])


.directive('code', function() {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element) {
      var linenums = element.hasClass('linenum');// || element.parent()[0].nodeName === 'PRE';
      var match = /lang-(\S+)/.exec(element[0].className);
      var lang = match && match[1];
      var html = element.html();
      element.html(window.prettyPrintOne(html, lang, linenums));
    }
  };
})

.directive('scrollYOffsetElement', ['$anchorScroll', function($anchorScroll) {
  return function(scope, element) {
    $anchorScroll.yOffset = element;
  };
}])

.directive('table', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      if (!attrs['class']) {
        element.addClass('table table-bordered table-striped code-table');
      }
    }
  };
});

angular.module('DocsController', [])

.controller('DocsController', [
          '$scope', '$rootScope', '$location', '$window', '$cookies',
              'NG_PAGES', 'NG_NAVIGATION', 'NG_VERSION',
  function($scope, $rootScope, $location, $window, $cookies,
              NG_PAGES, NG_NAVIGATION, NG_VERSION) {

  $scope.docsVersion = NG_VERSION.isSnapshot ? 'snapshot' : NG_VERSION.version;

  $scope.navClass = function(navItem) {
    return {
      active: navItem.href && this.currentPage && this.currentPage.path,
      current: this.currentPage && this.currentPage.path === navItem.href,
      'nav-index-section': navItem.type === 'section'
    };
  };



  $scope.$on('$includeContentLoaded', function() {
    var pagePath = $scope.currentPage ? $scope.currentPage.path : $location.path();
    $window._gaq.push(['_trackPageview', pagePath]);
  });

  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

    path = path.replace(/^\/?(.+?)(\/index)?\/?$/, '$1');

    currentPage = $scope.currentPage = NG_PAGES[path];

    if ( currentPage ) {
      $scope.partialPath = 'partials/' + path + '.html';
      $scope.currentArea = NG_NAVIGATION[currentPage.area];
      var pathParts = currentPage.path.split('/');
      var breadcrumb = $scope.breadcrumb = [];
      var breadcrumbPath = '';
      angular.forEach(pathParts, function(part) {
        breadcrumbPath += part;
        breadcrumb.push({ name: (NG_PAGES[breadcrumbPath]&&NG_PAGES[breadcrumbPath].name) || part, url: breadcrumbPath });
        breadcrumbPath += '/';
      });
    } else {
      $scope.currentArea = NG_NAVIGATION['api'];
      $scope.breadcrumb = [];
      $scope.partialPath = 'Error404.html';
    }
  });

  /**********************************
   Initialize
   ***********************************/

  $scope.versionNumber = angular.version.full;
  $scope.version = angular.version.full + "  " + angular.version.codeName;
  $scope.loading = 0;


  var INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;
  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

}]);

angular.module('errors', ['ngSanitize'])

.filter('errorLink', ['$sanitize', function ($sanitize) {
  var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}<>]/g,
      MAILTO_REGEXP = /^mailto:/,
      STACK_TRACE_REGEXP = /:\d+:\d+$/;

  var truncate = function (text, nchars) {
    if (text.length > nchars) {
      return text.substr(0, nchars - 3) + '...';
    }
    return text;
  };

  return function (text, target) {
    if (!text) return text;

    var targetHtml = target ? ' target="' + target + '"' : '';

    return $sanitize(text.replace(LINKY_URL_REGEXP, function (url) {
      if (STACK_TRACE_REGEXP.test(url)) {
        return url;
      }

      // if we did not match ftp/http/mailto then assume mailto
      if (!/^((ftp|https?):\/\/|mailto:)/.test(url)) url = 'mailto:' + url;

      return '<a' + targetHtml + ' href="' + url +'">' +
                truncate(url.replace(MAILTO_REGEXP, ''), 60) +
              '</a>';
    }));
  };
}])


.directive('errorDisplay', ['$location', 'errorLinkFilter', function ($location, errorLinkFilter) {
  var encodeAngleBrackets = function (text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  var interpolate = function (formatString) {
    var formatArgs = arguments;
    return formatString.replace(/\{\d+\}/g, function (match) {
      // Drop the braces and use the unary plus to convert to an integer.
      // The index will be off by one because of the formatString.
      var index = +match.slice(1, -1);
      if (index + 1 >= formatArgs.length) {
        return match;
      }
      return formatArgs[index+1];
    });
  };

  return {
    link: function (scope, element, attrs) {
      var search = $location.search(),
        formatArgs = [attrs.errorDisplay],
        formattedText,
        i;

      for (i = 0; angular.isDefined(search['p'+i]); i++) {
        formatArgs.push(search['p'+i]);
      }

      formattedText = encodeAngleBrackets(interpolate.apply(null, formatArgs));
      element.html(errorLinkFilter(formattedText, '_blank'));
    }
  };
}]);

angular.module('examples', [])

.directive('runnableExample', ['$templateCache', '$document', function($templateCache, $document) {
  var exampleClassNameSelector = '.runnable-example-file';
  var doc = $document[0];
  var tpl =
    '<nav class="runnable-example-tabs" ng-if="tabs">' +
    '  <a ng-class="{active:$index==activeTabIndex}"' +
         'ng-repeat="tab in tabs track by $index" ' +
         'href="" ' +
         'class="btn"' +
         'ng-click="setTab($index)">' +
    '    {{ tab }}' +
    '  </a>' +
    '</nav>';

  return {
    restrict: 'C',
    scope : true,
    controller : ['$scope', function($scope) {
      $scope.setTab = function(index) {
        var tab = $scope.tabs[index];
        $scope.activeTabIndex = index;
        $scope.$broadcast('tabChange', index, tab);
      };
    }],
    compile : function(element) {
      element.html(tpl + element.html());
      return function(scope, element) {
        var node = element[0];
        var examples = node.querySelectorAll(exampleClassNameSelector);
        var tabs = [], now = Date.now();
        angular.forEach(examples, function(child, index) {
          tabs.push(child.getAttribute('name'));
        });

        if(tabs.length > 0) {
          scope.tabs = tabs;
          scope.$on('tabChange', function(e, index, title) {
            angular.forEach(examples, function(child) {
              child.style.display = 'none';
            });
            var selected = examples[index];
            selected.style.display = 'block';
          });
          scope.setTab(0);
        }
      };
    }
  };
}])

.factory('formPostData', ['$document', function($document) {
  return function(url, newWindow, fields) {
    /**
     * If the form posts to target="_blank", pop-up blockers can cause it not to work.
     * If a user choses to bypass pop-up blocker one time and click the link, they will arrive at
     * a new default plnkr, not a plnkr with the desired template.  Given this undesired behavior,
     * some may still want to open the plnk in a new window by opting-in via ctrl+click.  The
     * newWindow param allows for this possibility.
     */
    var target = newWindow ? '_blank' : '_self';
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="' + target + '"></form>');
    angular.forEach(fields, function(value, name) {
      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
}])

.factory('createCopyrightNotice', function() {
    var COPYRIGHT = 'Copyright ' + (new Date()).getFullYear() + ' Google Inc. All Rights Reserved.\n'
     + 'Use of this source code is governed by an MIT-style license that\n'
     + 'can be found in the LICENSE file at http://angular.io/license';
    var COPYRIGHT_JS_CSS = '\n\n/*\n' + COPYRIGHT + '\n*/';
    var COPYRIGHT_HTML = '\n\n<!-- \n' + COPYRIGHT + '\n-->';

    return function getCopyright(filename) {
      switch (filename.substr(filename.lastIndexOf('.'))) {
        case '.html':
          return COPYRIGHT_HTML;
        case '.js':
        case '.css':
          return COPYRIGHT_JS_CSS;
        case '.md':
          return COPYRIGHT;
      }
      return '';
    };
})

.directive('plnkrOpener', ['$q', 'getExampleData', 'formPostData', 'createCopyrightNotice', function($q, getExampleData, formPostData, createCopyrightNotice) {
  return {
    scope: {},
    bindToController: {
      'examplePath': '@'
    },
    controllerAs: 'plnkr',
    template: '<button ng-click="plnkr.open($event)" class="btn pull-right"> <i class="glyphicon glyphicon-edit">&nbsp;</i> Edit in Plunker</button> ',
    controller: [function() {
      var ctrl = this;

      ctrl.example = {
        path: ctrl.examplePath,
        manifest: undefined,
        files: undefined,
        name: 'AngularJS Example'
      };

      ctrl.prepareExampleData = function() {
        if (ctrl.example.manifest) {
          return $q.when(ctrl.example);
        }

        return getExampleData(ctrl.examplePath).then(function(data) {
          ctrl.example.files = data.files;
          ctrl.example.manifest = data.manifest;

          // Build a pretty title for the Plunkr
          var exampleNameParts = data.manifest.name.split('-');
          exampleNameParts.unshift('AngularJS');
          angular.forEach(exampleNameParts, function(part, index) {
            exampleNameParts[index] = part.charAt(0).toUpperCase() + part.substr(1);
          });
          ctrl.example.name = exampleNameParts.join(' - ');

          return ctrl.example;
        });
      };

      ctrl.open = function(clickEvent) {

        var newWindow = clickEvent.ctrlKey || clickEvent.metaKey;

        var postData = {
          'tags[0]': "angularjs",
          'tags[1]': "example",
          'private': true
        };

        // Make sure the example data is available.
        // If an XHR must be made, this might break some pop-up blockers when
        // new window is requested
        ctrl.prepareExampleData()
          .then(function() {
            angular.forEach(ctrl.example.files, function(file) {
              postData['files[' + file.name + ']'] = file.content + createCopyrightNotice(file.name);
            });

            postData.description = ctrl.example.name;

            formPostData('http://plnkr.co/edit/?p=preview', newWindow, postData);
          });

      };

      // Initialize the example data, so it's ready when clicking the open button.
      // Otherwise pop-up blockers will prevent a new window from opening
      ctrl.prepareExampleData(ctrl.example.path);

    }]
  };
}])

.factory('getExampleData', ['$http', '$q', function($http, $q) {
  return function(exampleFolder){
    // Load the manifest for the example
    return $http.get(exampleFolder + '/manifest.json')
      .then(function(response) {
        return response.data;
      })
      .then(function(manifest) {
        var filePromises = [];

        angular.forEach(manifest.files, function(filename) {
          filePromises.push($http.get(exampleFolder + '/' + filename, { transformResponse: [] })
            .then(function(response) {

              // The manifests provide the production index file but Plunkr wants
              // a straight index.html
              if (filename === "index-production.html") {
                filename = "index.html";
              }

              return {
                name: filename,
                content: response.data
              };
            }));
        });

        return $q.all({
          manifest: manifest,
          files: $q.all(filePromises)
        });
      });
  };
}]);
angular.module('search', [])

.controller('DocsSearchCtrl', ['$scope', '$location', 'docsSearch', function($scope, $location, docsSearch) {
  function clearResults() {
    $scope.results = [];
    $scope.colClassName = null;
    $scope.hasResults = false;
  }

  $scope.search = function(q) {
    var MIN_SEARCH_LENGTH = 2;
    if(q.length >= MIN_SEARCH_LENGTH) {
      docsSearch(q).then(function(hits) {
        // Make sure the areas are always in the same order
        var results = {
          api: [],
          guide: [],
          tutorial: [],
          error: [],
          misc: []
        };

        angular.forEach(hits, function(hit) {
          var area = hit.area;

          var limit = (area == 'api') ? 40 : 14;
          results[area] = results[area] || [];
          if(results[area].length < limit) {
            results[area].push(hit);
          }
        });

        var totalAreas = 0;
        for(var i in results) {
          ++totalAreas;
        }
        if(totalAreas > 0) {
          $scope.colClassName = 'cols-' + totalAreas;
        }
        $scope.hasResults = totalAreas > 0;
        $scope.results = results;
      });
    }
    else {
      clearResults();
    }
    if(!$scope.$$phase) $scope.$apply();
  };

  $scope.submit = function() {
    var result;
    if ($scope.results.api) {
      result = $scope.results.api[0];
    } else {
      for(var i in $scope.results) {
        result = $scope.results[i][0];
        if(result) {
          break;
        }
      }
    }
    if(result) {
      $location.path(result.path);
      $scope.hideResults();
    }
  };

  $scope.hideResults = function() {
    clearResults();
    $scope.q = '';
  };
}])


.controller('Error404SearchCtrl', ['$scope', '$location', 'docsSearch',
        function($scope, $location, docsSearch) {
  docsSearch($location.path().split(/[\/\.:]/).pop()).then(function(results) {
    $scope.results = {};
    angular.forEach(results, function(result) {
      var area = $scope.results[result.area] || [];
      area.push(result);
      $scope.results[result.area] = area;
    });
  });
}])


.provider('docsSearch', function() {

  // This version of the service builds the index in the current thread,
  // which blocks rendering and other browser activities.
  // It should only be used where the browser does not support WebWorkers
  function localSearchFactory($http, $timeout, NG_PAGES) {

    console.log('Using Local Search Index');

    // Create the lunr index
    var index = lunr(function() {
      this.ref('path');
      this.field('titleWords', {boost: 50});
      this.field('members', { boost: 40});
      this.field('keywords', { boost : 20 });
    });

    // Delay building the index by loading the data asynchronously
    var indexReadyPromise = $http.get('js/search-data.json').then(function(response) {
      var searchData = response.data;
      // Delay building the index for 500ms to allow the page to render
      return $timeout(function() {
        // load the page data into the index
        angular.forEach(searchData, function(page) {
          index.add(page);
        });
      }, 500);
    });

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    // (In this case we just resolve the promise immediately as it is not
    // inherently an async process)
    return function(q) {
      return indexReadyPromise.then(function() {
        var hits = index.search(q);
        var results = [];
        angular.forEach(hits, function(hit) {
          results.push(NG_PAGES[hit.ref]);
        });
        return results;
      });
    };
  }
  localSearchFactory.$inject = ['$http', '$timeout', 'NG_PAGES'];

  // This version of the service builds the index in a WebWorker,
  // which does not block rendering and other browser activities.
  // It should only be used where the browser does support WebWorkers
  function webWorkerSearchFactory($q, $rootScope, NG_PAGES) {

    console.log('Using WebWorker Search Index')

    var searchIndex = $q.defer();
    var results;

    var worker = new Worker('js/search-worker.js');

    // The worker will send us a message in two situations:
    // - when the index has been built, ready to run a query
    // - when it has completed a search query and the results are available
    worker.onmessage = function(oEvent) {
      $rootScope.$apply(function() {

        switch(oEvent.data.e) {
          case 'index-ready':
            searchIndex.resolve();
            break;
          case 'query-ready':
            var pages = oEvent.data.d.map(function(path) {
              return NG_PAGES[path];
            });
            results.resolve(pages);
            break;
        }
      });
    };

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    return function(q) {

      // We only run the query once the index is ready
      return searchIndex.promise.then(function() {

        results = $q.defer();
        worker.postMessage({ q: q });
        return results.promise;
      });
    };
  }
  webWorkerSearchFactory.$inject = ['$q', '$rootScope', 'NG_PAGES'];

  return {
    $get: window.Worker ? webWorkerSearchFactory : localSearchFactory
  };
})

.directive('focused', function($timeout) {
  return function(scope, element, attrs) {
    element[0].focus();
    element.on('focus', function() {
      scope.$apply(attrs.focused + '=true');
    });
    element.on('blur', function() {
      // have to use $timeout, so that we close the drop-down after the user clicks,
      // otherwise when the user clicks we process the closing before we process the click.
      $timeout(function() {
        scope.$eval(attrs.focused + '=false');
      });
    });
    scope.$eval(attrs.focused + '=true');
  };
})

.directive('docsSearchInput', ['$document',function($document) {
  return function(scope, element, attrs) {
    var ESCAPE_KEY_KEYCODE = 27,
        FORWARD_SLASH_KEYCODE = 191;
    angular.element($document[0].body).on('keydown', function(event) {
      var input = element[0];
      if(event.keyCode == FORWARD_SLASH_KEYCODE && document.activeElement != input) {
        event.stopPropagation();
        event.preventDefault();
        input.focus();
      }
    });

    element.on('keydown', function(event) {
      if(event.keyCode == ESCAPE_KEY_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        scope.$apply(function() {
          scope.hideResults();
        });
      }
    });
  };
}]);

angular.module('tutorials', [])

.directive('docTutorialNav', function() {
  var pages = [
    '',
    'step_00', 'step_01', 'step_02', 'step_03', 'step_04',
    'step_05', 'step_06', 'step_07', 'step_08', 'step_09',
    'step_10', 'step_11', 'step_12', 'the_end'
  ];
  return {
    scope: {},
    template:
      '<a ng-href="tutorial/{{prev}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>\n' +
      '<a ng-href="http://angular.github.io/angular-phonecat/step-{{seq}}/app"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>\n' +
      '<a ng-href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>\n' +
      '<a ng-href="tutorial/{{next}}"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>',
    link: function(scope, element, attrs) {
      var seq = 1 * attrs.docTutorialNav;
      scope.seq = seq;
      scope.prev = pages[seq];
      scope.next = pages[2 + seq];
      scope.diffLo = seq ? (seq - 1): '0~1';
      scope.diffHi = seq;

      element.addClass('btn-group');
      element.addClass('tutorial-nav');
    }
  };
})


.directive('docTutorialReset', function() {
  return {
    scope: {
      'step': '@docTutorialReset'
    },
    template:
      '<p><button class="btn" ng-click="show=!show">Workspace Reset Instructions  ➤</button></p>\n' +
      '<div class="alert alert-info" ng-show="show">\n' +
      '  <p>Reset the workspace to step {{step}}.</p>' +
      '  <p><pre>git checkout -f step-{{step}}</pre></p>\n' +
      '  <p>Refresh your browser or check out this step online: '+
          '<a href="http://angular.github.io/angular-phonecat/step-{{step}}/app">Step {{step}} Live Demo</a>.</p>\n' +
      '</div>\n' +
      '<p>The most important changes are listed below. You can see the full diff on ' +
        '<a ng-href="https://github.com/angular/angular-phonecat/compare/step-{{step ? (step - 1): \'0~1\'}}...step-{{step}}" title="See diff on Github">GitHub</a>\n' +
      '</p>'
  };
});
"use strict";

angular.module('versions', [])

.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'NG_VERSIONS', function($scope, $location, $window, NG_VERSIONS) {
  $scope.docs_version  = NG_VERSIONS[0];
  $scope.docs_versions = NG_VERSIONS;

  for(var i=0, minor = NaN; i < NG_VERSIONS.length; i++) {
    var version = NG_VERSIONS[i];
    // NaN will give false here
    if (minor <= version.minor) {
      continue;
    }
    version.isLatest = true;
    minor = version.minor;
  }

  $scope.getGroupName = function(v) {
    return v.isLatest ? 'Latest' : ('v' + v.major + '.' + v.minor + '.x');
  };

  $scope.jumpToDocsVersion = function(version) {
    var currentPagePath = $location.path().replace(/\/$/, ''),
        url = '';
    if (version.isOldDocsUrl) {
      url = version.docsUrl;
    }else{
      url = version.docsUrl + currentPagePath;
    }
    $window.location = url;
  };
}]);
