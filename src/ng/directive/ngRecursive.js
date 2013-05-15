'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngRecursive
 * @restrict ECA
 *
 * @description
 * Compiles a document subtree for recursive transclusion.
 */
var ngRecursiveDirective = ['$compile',
                    function($compile) {
  return {
    restrict: 'ECA',
    terminal: true,
    compile: function(element, attr) {
      var $template = element.clone().contents();
      element.html(''); // clear contents

      var linkFn = $compile($template, function(scope, cloneAttachFn) {
        return linkFn(scope, cloneAttachFn);
      });
      return function($scope, $element, $attr) {
        linkFn($scope, function(contents) {
          $element.append(contents);
        });
      };
    }
  };
}];
