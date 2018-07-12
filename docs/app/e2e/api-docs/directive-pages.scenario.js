'use strict';

describe('directives', function() {

  describe('parameter section', function() {

    it('should show the directive name only if it is a param (attribute) with a value', function() {
      browser.get('build/docs/index.html#!/api/ng/directive/ngInclude');
      expect(getParamNames().getText()).toContain('ngInclude | src');

      browser.get('build/docs/index.html#!/api/ngRoute/directive/ngView');
      expect(getParamNames().getText()).not.toContain('ngView');
    });
  });

  describe('usage section', function() {

    it('should show the directive name if it is a param (attribute) with a value', function() {
      browser.get('build/docs/index.html#!/api/ng/directive/ngInclude');

      expect(getUsageAs('element', 'ng-include').isPresent()).toBe(true);
      expect(getUsageAs('attribute', 'ng-include').isPresent()).toBe(true);
      expect(getUsageAs('CSS class', 'ng-include').isPresent()).toBe(true);
    });

    it('should show the directive name if it is a void param (attribute)', function() {
      browser.get('build/docs/index.html#!/api/ngRoute/directive/ngView');

      expect(getUsageAs('element', 'ng-view').isPresent()).toBe(true);
      expect(getUsageAs('attribute', 'ng-view').isPresent()).toBe(true);
      expect(getUsageAs('CSS class', 'ng-view').isPresent()).toBe(true);
    });
  });
});

function getParamNames() {
  var argsSection = element(by.className('input-arguments'));

  var paramNames = argsSection.all(by.css('tr td:nth-child(1)'));

  return paramNames;
}

// Based on the type of directive usage, the directive name will show up in the code block
// with a specific class
var typeClassMap = {
  element: 'tag',
  attribute: 'atn',
  'CSS class': 'atv'
};

function getUsageAs(type, directiveName) {
  var usage = element(by.className('usage'));

  var as = usage.element(by.cssContainingText('li', 'as ' + type));

  return as.element(by.cssContainingText('span.' + typeClassMap[type], directiveName));
}
