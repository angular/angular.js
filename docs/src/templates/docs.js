DocsController.$inject = ['$location', '$browser', '$window', '$cookies'];
function DocsController($location, $browser, $window, $cookies) {
  window.$root = this.$root;

  var scope = this,
      OFFLINE_COOKIE_NAME = 'ng-offline',
      DOCS_PATH = /^\/(api)|(guide)|(cookbook)|(misc)|(tutorial)/,
      INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;

  scope.$location = $location;
  scope.versionNumber = angular.version.full;
  scope.version = angular.version.full + "  " + angular.version.codeName;
  scope.subpage = false;
  scope.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);
  scope.futurePartialTitle = null;

  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

  scope.$watch('$location.path()', function(scope, path) {
    // ignore non-doc links which are used in examples
    if (DOCS_PATH.test(path)) {
      var parts = path.split('/');
      scope.sectionId = parts[1];
      scope.partialId = parts[2] || 'index';
      scope.pages = angular.Array.filter(NG_PAGES, {section: scope.sectionId});

      var i = scope.pages.length;
      while (i--) {
        if (scope.pages[i].id == scope.partialId) {
          // TODO(i): this is not ideal but better than updating the title before a partial arrives,
          //   which results in the old partial being displayed with the new title
          scope.futurePartialTitle = scope.pages[i].name;
          break;
        }
      }
      if (i<0) {
        scope.partialTitle = 'Error: Page Not Found!';
        delete scope.partialId;
      }
    }
  });

  scope.getUrl = function(page) {
    return page.section + '/' + page.id;
  };

  scope.getCurrentPartial = function() {
    return this.partialId ? ('./partials/' + this.sectionId + '/' + this.partialId + '.html') : '';
  };

  scope.getClass = function(page) {
    var depth = page.depth,
        cssClass = 'level-' + depth + (page.name == this.partialId ? ' selected' : '');

    if (page.section == 'api')
      cssClass += ' monospace';

    return cssClass;
  };

  scope.selectedSection = function(section) {
    return section == scope.sectionId ? 'current' : '';
  };

  scope.selectedPartial = function(partial) {
    return partial.id == scope.partialId ? 'current' : '';
  };

  scope.afterPartialLoaded = function() {
    scope.partialTitle = scope.futurePartialTitle;
    SyntaxHighlighter.highlight();
    $window.scrollTo(0,0);
    $window._gaq.push(['_trackPageview', $location.path()]);
  };

  scope.getFeedbackUrl = function() {
    return "mailto:angular@googlegroups.com?" +
           "subject=" + escape("Feedback on " + $location.absUrl()) + "&" +
           "body=" + escape("Hi there,\n\nI read " + $location.absUrl() + " and wanted to ask ....");
  };

  /** stores a cookie that is used by apache to decide which manifest ot send */
  scope.enableOffline = function() {
    //The cookie will be good for one year!
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    var value = angular.version.full;
    document.cookie = OFFLINE_COOKIE_NAME + "="+value+expires+"; path=" + $location.path;

    //force the page to reload so server can serve new manifest file
    window.location.reload(true);
  };

  // bind escape to hash reset callback
  angular.element(window).bind('keydown', function(e) {
    if (e.keyCode === 27) {
      scope.subpage = false;
      scope.$eval();
    }
  });
}

// prevent compilation of code
angular.widget('code', function(element) {
  element.attr('ng:non-bindable', 'true');
});

SyntaxHighlighter['defaults'].toolbar = false;
SyntaxHighlighter['defaults'].gutter = true;

/**
 * Controller for tutorial instructions
 * @param $cookieStore
 * @constructor
 */
function TutorialInstructionsCtrl($cookieStore) {
  this.selected = $cookieStore.get('selEnv') || 'git-mac';

  this.currentCls = function(id, cls) {
    return this.selected == id  ? cls || 'current' : '';
  };

  this.select = function(id) {
    this.selected = id;
    $cookieStore.put('selEnv', id);
  };
}

angular.service('$locationConfig', function() {
  return {
    html5Mode: true,
    hashPrefix: '!'
  };
});
