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

/**
 * code Directive
 *
 * @description The code blocks are prettified using google-code-pretify's prettyPrintOne.
 * The prettyPrintOne function is invoked with `prettyPrintOne(html, lang, linenums)`, where `html` is
 * the innerHTML of the element, `lang` allows language declaration by adding `class="lang-javascript"`
 * and `linenums` is boolean which adds line numbers  by adding a class name `linenum`.
 */
.directive('code', ['$window', function($window) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element) {
      var linenums = element.hasClass('linenum');// || element.parent()[0].nodeName === 'PRE';
      var match = /lang-(\S+)/.exec(element[0].className);
      var lang = match && match[1];
      var html = element.html();
      element.html($window.prettyPrintOne(html, lang, linenums));
    }
  };
}]);

