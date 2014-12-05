angular.module('directives', [])

/**
 * scrollTo Directive
 *
 * @description
 * Upon click, scroll to the target element (identified by the selector provided via the `scroll-to`
 * attribute).
 */
.directive('scrollTo', ['$document', '$location', function($document, $location) {
  var doc = $document[0];

  return {
    restrict: 'A',
    link: function scrollToPostLink(scope, elem, attrs) {
      elem.on('click', onClick);

      function onClick() {
        var targetSelector = attrs.scrollTo;
        var targetElem = doc.querySelector(targetSelector);

        if (targetElem) {
          targetElem.scrollIntoView();
        }
      }
    }
  };
}])


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
}])


// TODO: Probably not needed any more
.directive('scrollYOffsetElement', ['$anchorScroll', function($anchorScroll) {
  return {
    link: function(scope, element) {
      $anchorScroll.yOffset = element;
    }
  };
}]);
