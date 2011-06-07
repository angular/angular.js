var HAS_HASH = /#/;
DocsController.$inject = ['$location', '$browser', '$window'];
function DocsController($location, $browser, $window) {
  window.$root = this.$root;
  var self = this;
  this.$location = $location;

  if (!HAS_HASH.test($location.href)) {
    $location.hashPath = '!/api';
  }

  this.$watch('$location.hashPath', function(hashPath) {
    if (hashPath.match(/^!/)) {
      var parts = hashPath.substring(1).split('/');
      self.sectionId = parts[1];
      self.partialId = parts[2] || 'index';
      self.pages = angular.Array.filter(NG_PAGES, {section:self.sectionId});
      self.partialTitle = (angular.Array.filter(self.pages, function(doc){return doc.id == self.partialId;})[0]||{}).name || 'Error: Page Not Found!';
    }
  });

  this.getUrl = function(page){
    return '#!/' + page.section + '/' + page.id;
  };

  this.getCurrentPartial = function(){
    return './' + this.sectionId + '/' + this.partialId + '.html';
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
    $window._gaq.push(['_trackPageview', $location.hashPath.substr(1)]);
  };

  this.getFeedbackUrl = function() {
    return "mailto:angular@googlegroups.com?" +
           "subject=" + escape("Feedback on " + $location.href) + "&" +
           "body=" + escape("Hi there,\n\nI read " + $location.href + " and wanted to ask ....");
  };

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

/**
 * Display 404 page and suggest new link if possible
 */
angular.service('$xhr.error', function($location) {
  function suggestLink(wrongLink) {
    var link = wrongLink.replace(/^!\/?/, '');

    if (link.match(/^angular/)) return 'api/' + link;
    else if (link.match(/^cookbook/)) return link.replace('cookbook.', 'cookbook/');
  }

  return function(request, response) {
    var suggestion = suggestLink($location.hashPath),
        HTML_404 = '<h1>Error: Page Not Found</h1>' +
                   '<p>Sorry this page has not been found.</p>';

    if (suggestion)
      HTML_404 += '<p>Looks like you are using an old link. Please update your bookmark to: <a href="#!/' + suggestion + '">' + suggestion + '</a></p>';

    request.callback(200, HTML_404);
  };
});
