'use strict';

/**
 * @ngdoc directive
 * @name ngTranscludeSelect
 * @restrict EAC
 *
 * @description
 *
 * @element ANY
 *
 */
var ngTranscludeSelectDirective = ngDirective({
  restrict: 'EAC',
  link: function($scope, $element, $attrs, controller, $transclude) {
    checkTranscludeOption();
    $transclude(transcludeSelection);

    function transcludeSelection(clone) {
      var selector = $attrs.ngTranscludeSelect;
      var selectedElements = getSelectedElements(clone, selector);
      if (selectedElements.length) $element.append(selectedElements);
    }

    function getSelectedElements(clone, selector) {
      var wrapper = wrapClone(clone);
      var selectedElements = wrapper[0].querySelectorAll(selector);
      wrapper.remove();
      return selectedElements;
    }

    function wrapClone(clone) {
      var wrapper = jqLite("<div>");
      wrapper.append(clone);
      return wrapper;
    }

    function checkTranscludeOption() {
      if (!$transclude) {
        throw minErr('ngTransclude')('orphan',
         'Illegal use of ngTranscludeSelect directive in the template! ' +
         'No parent directive that requires a transclusion found. ' +
         'Element: {0}',
         startingTag($element));
      }
    }
  }
});

