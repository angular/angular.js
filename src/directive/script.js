'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.script
 *
 * @description
 * Load content of a script tag, with type `text/ng-template`, into `$templateCache`, so that the
 * template can be used by `ng-include`, `ng-view` or directive templates.
 *
 * @restrict E
 *
 * @example
  <doc:example>
    <doc:source>
      <script type="text/ng-template" id="/tpl.html">
        Content of the template.
      </script>

      <a ng-click="currentTpl='/tpl.html'" id="tpl-link">Load inlined template</a>
      <div id="tpl-content" ng-include src="currentTpl"></div>
    </doc:source>
    <doc:scenario>
      it('should load template defined inside script tag', function() {
        element('#tpl-link').click();
        expect(element('#tpl-content').text()).toMatch(/Content of the template/);
      });
    </doc:scenario>
  </doc:example>
 */
var scriptDirective = ['$templateCache', function($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
      if (attr.type == 'text/ng-template') {
        var templateUrl = attr.id;
        $templateCache.put(templateUrl, element.text());
      }
    }
  };
}];
