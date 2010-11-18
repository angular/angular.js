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
    $window.scroll(0,0);
    SyntaxHighlighter.highlight();
  };
  
}

angular.filter('short', function(name){
  return (name||'').split(/\./).pop();
});