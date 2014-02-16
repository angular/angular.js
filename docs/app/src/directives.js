angular.module('directives', [])

.directive('code', function() {
  return { restrict:'E', terminal: true };
})

/**
 * backToTop Directive
 * @param  {Function} $anchorScroll
 *
 * @description Ensure that the browser scrolls when the anchor is clicked
 */
.directive('backToTop', ['$anchorScroll', function($anchorScroll) {
  return function link(scope, element) {
    element.on('click', function(event) {
      scope.$apply($anchorScroll);
    });
  };
}])


.directive('code', function() {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element) {
      var linenums = element.hasClass('linenum') || element.parent()[0].nodeName === 'PRE';
      var match = /lang-(\S)+/.exec(element.className);
      var lang = match && match[1];
      var html = element.html();
      element.html(window.prettyPrintOne(html, lang, linenums));
    }
  };
});

