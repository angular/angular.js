SyntaxHighlighter['defaults'].toolbar = false;

DocsController.$inject = ['$location', '$browser'];
function DocsController($location, $browser) {
  this.pages = NG_PAGES;
  window.$root = this.$root;
  
  this.getUrl = function(page){
    return '#!' + encodeURIComponent(page.name);
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
    var depth = page.name.split(/\./).length - 1;
    return 'level-' + depth + 
     (page.name == this.getTitle() ? ' selected' : '');
  };
  
}

angular.filter('short', function(name){
  return (name||'').split(/\./).pop();
});