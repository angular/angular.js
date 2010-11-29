SyntaxHighlighter['defaults'].toolbar = false;

DocsController.$inject = ['$location', '$browser', '$window'];
function DocsController($location, $browser, $window) {
  this.pages = NG_PAGES;
  window.$root = this.$root;
  
  this.getUrl = function(page){
    return '#!' + page.name;
  };

  this.getCurrentPartial = function(){
    return './' + this.getTitle() + '.html';
  };
  
  this.getTitle = function(){
    var hashPath = $location.hashPath || '!angular';
    if (hashPath.match(/^!angular/)) {
      this.partialTitle = hashPath.substring(1);
    }
    return this.partialTitle;
  };
  
  this.getClass = function(page) {
    var depth = page.name.split(/\./).length - 1,
        cssClass = 'level-' + depth + (page.name == this.getTitle() ? ' selected' : '');

    if (depth == 1 && page.type !== 'overview') cssClass += ' level-angular';

    return cssClass;
  };

  this.afterPartialLoaded = function() {
    SyntaxHighlighter.highlight();
  };

  this.getFeedbackUrl = function() {
    return "mailto:angular@googlegroups.com?" +
           "subject=" + escape("Feedback on " + $location.href) + "&" +
           "body=" + escape("Hi there,\n\nI read " + $location.href + " and wanted to ask ....");
  }
  
}

angular.filter('short', function(name){
  return (name||'').split(/\./).pop();
});