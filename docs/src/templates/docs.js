var HAS_HASH = /#/;
DocsController.$inject = ['$location', '$browser', '$window'];
function DocsController($location, $browser, $window) {
  window.$root = this.$root;
  var self = this;
  this.$location = $location;

  if (!HAS_HASH.test($location.href)) {
    $location.hashPath = '!api/angular';
  }

  this.$watch('$location.hashPath', function(hashPath) {
    if (hashPath.match(/^!/)) {
      var parts = hashPath.substring(1).split('/');
      self.sectionId = parts[0];
      self.partialId = parts[1] || 'index';
      self.pages = angular.Array.filter(NG_PAGES, {section:self.sectionId});
      self.partialTitle = (angular.Array.filter(self.pages, function(doc){return doc.id == self.partialId;})[0]||{}).name;
    }
  });

  this.getUrl = function(page){
    return '#!' + page.section + '/' + page.id;
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
    return section == self.sectionId ? 'selected' : null;
  };

  this.afterPartialLoaded = function() {
    SyntaxHighlighter.highlight();
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
