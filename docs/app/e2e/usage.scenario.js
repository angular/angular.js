'use strict';

/**
 * This scenario checks if the usage section for selected directives is rendered correctly
 */

describe('usage section', function() {

  describe('should list the directive name', function() {

    it('when directive name is a parameter with a value', function() {
      browser.get('build/docs/index.html#!/api/ng/directive/ngInclude');

      // Ensure that ngInclude appears as an argument
      var args = element(by.className('input-arguments'));

      var paramNames = args.all(by.css('tr td:nth-child(1)'));

      expect(paramNames.getText()).toContain('ngInclude | src');

      var usage = element(by.className('usage'));

      var asElement = usage.element(by.cssContainingText('li', 'as element'));
      var asAttribute = usage.element(by.cssContainingText('li', 'as attribute'));
      var asCssClass = usage.element(by.cssContainingText('li', 'as CSS class'));

      expect(asElement.element(by.cssContainingText('span.tag', 'ng-include')).isPresent()).toBe(true);
      expect(asAttribute.element(by.cssContainingText('span.atn', 'ng-include')).isPresent()).toBe(true);
      expect(asCssClass.element(by.cssContainingText('span.atv', 'ng-include')).isPresent()).toBe(true);
    });


    it('when directive name is a void parameter', function() {
      browser.get('build/docs/index.html#!/api/ngRoute/directive/ngView');

      // Ensure that ngView does not appear as an argument
      var args = element(by.className('input-arguments'));

      var paramNames = args.all(by.css('tr td:nth-child(1)'));

      expect(paramNames.getText()).not.toContain('ngView');

      var usage = element(by.className('usage'));

      var asElement = usage.element(by.cssContainingText('li', 'as element'));
      var asAttribute = usage.element(by.cssContainingText('li', 'as attribute'));
      var asCssClass = usage.element(by.cssContainingText('li', 'as CSS class'));

      expect(asElement.element(by.cssContainingText('span.tag', 'ng-view')).isPresent()).toBe(true);
      expect(asAttribute.element(by.cssContainingText('span.atn', 'ng-view')).isPresent()).toBe(true);
      expect(asCssClass.element(by.cssContainingText('span.atv', 'ng-view')).isPresent()).toBe(true);
    });

  });
});
