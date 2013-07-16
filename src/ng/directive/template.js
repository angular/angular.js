/**
 * @ngdoc directive
 * @name ng.directive:template
 *
 * @description
 * Load content of a template tag into `$templateCache`, so that the
 * template can be used by `ngInclude`, `ngView` or directive templates.
 * @notice 
 * if U use this, U should use the html5.js <!--[if lt IE 9]> <script src="dist/html5shiv.js"></script> <![endif]-->
 * for support the template tag, well U R build for the modern browser , this work well
 * @restrict E
 * 
 * @example
  <doc:example>
    <doc:source>
      <template id="/tpl.html">
        Content of the template.
      </template>

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
var templateDirective = ['$templateCache', function ($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
        var templateUrl = attr.id,
            // Using the innerHTML as safe.
            text = element.html();
        $templateCache.put(templateUrl, text);
    }
  };
}];
