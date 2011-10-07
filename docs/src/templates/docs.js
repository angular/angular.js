DocsController.$inject = ['$location', '$browser', '$window', '$cookies'];
function DocsController($location, $browser, $window, $cookies) {
  window.$root = this.$root;

  var self = this,
      OFFLINE_COOKIE_NAME = 'ng-offline',
      DOCS_PATH = /^\/(api)|(guide)|(cookbook)|(misc)|(tutorial)/,
      INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;

  this.$location = $location;

  self.versionNumber = angular.version.full;
  self.version = angular.version.full + "  " + angular.version.codeName;
  self.subpage = false;
  self.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);

  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

  this.$watch('$location.path()', function(scope, path) {
    // ignore non-doc links which are used in examples
    if (DOCS_PATH.test(path)) {
      var parts = path.split('/');
      self.sectionId = parts[1];
      self.partialId = parts[2] || 'index';
      self.pages = angular.Array.filter(NG_PAGES, {section:self.sectionId});

      var i = self.pages.length;
      while (i--) {
        if (self.pages[i].id == self.partialId) {
          self.partialTitle = self.pages[i].name;
          break;
        }
      }
      if (i<0) {
        self.partialTitle = 'Error: Page Not Found!';
        delete self.partialId;
      }
    }
  });

  this.getUrl = function(page){
    return page.section + '/' + page.id;
  };

  this.getCurrentPartial = function() {
    return this.partialId ? ('./partials/' + this.sectionId + '/' + this.partialId + '.html') : '';
  };

  this.getClass = function(page) {
    var depth = page.depth,
        cssClass = 'level-' + depth + (page.name == this.partialId ? ' selected' : '');

    if (page.section == 'api')
      cssClass += ' monospace';

    return cssClass;
  };

  this.selectedSection = function(section) {
    return section == self.sectionId ? 'current' : '';
  };

  this.selectedPartial = function(partial) {
    return partial.id == self.partialId ? 'current' : '';
  };

  this.afterPartialLoaded = function() {
    SyntaxHighlighter.highlight();
    $window.scrollTo(0,0);
    $window._gaq.push(['_trackPageview', $location.path()]);
  };

  this.getFeedbackUrl = function() {
    return "mailto:angular@googlegroups.com?" +
           "subject=" + escape("Feedback on " + $location.absUrl()) + "&" +
           "body=" + escape("Hi there,\n\nI read " + $location.absUrl() + " and wanted to ask ....");
  };

  /** stores a cookie that is used by apache to decide which manifest ot send */
  this.enableOffline = function() {
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
      self.subpage = false;
      self.$eval();
    }
  });
}

// prevent compilation of code
angular.widget('code', function(element){
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
