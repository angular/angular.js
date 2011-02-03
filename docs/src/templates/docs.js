var HAS_HASH = /#/;
DocsController.$inject = ['$location', '$browser', '$window'];
function DocsController($location, $browser, $window) {
  this.pages = NG_PAGES;
  window.$root = this.$root;
  this.$location = $location;

  if (!HAS_HASH.test($location.href)) {
    $location.hashPath = '!angular';
  }

  this.$watch('$location.hashPath', function(hashPath) {
    if (hashPath.match(/^!/)) {
      this.partialId = hashPath.substring(1);
      this.partialTitle = (angular.Array.filter(NG_PAGES, {id:this.partialId})[0]||{}).name;
    }
  });

  this.getUrl = function(page){
    return '#!' + page.id;
  };

  this.getCurrentPartial = function(){
    return './' + this.partialId + '.html';
  };

  this.getClass = function(page) {
    var depth = page.depth,
        cssClass = 'level-' + depth + (page.name == this.partialId ? ' selected' : '');

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
  };

}

// prevent compilation of code
angular.widget('code', function(element){
  element.attr('ng:non-bindable', 'true');
});

SyntaxHighlighter['defaults'].toolbar = false;
