'use strict';

describe('doc.angularjs.org', function() {

  describe('API pages', function() {

    it('should display links to code on GitHub', function() {
      browser.get('build/docs/index.html#!/api/ng/service/$http');
      expect(element(by.css('.improve-docs')).getAttribute('href')).toMatch(/https?:\/\/github\.com\/angular\/angular\.js\/edit\/.+\/src\/ng\/http\.js/);

      browser.get('build/docs/index.html#!/api/ng/service/$http');
      expect(element(by.css('.view-source')).getAttribute('href')).toMatch(/https?:\/\/github\.com\/angular\/angular\.js\/tree\/.+\/src\/ng\/http\.js#L\d+/);
    });

    it('should change the page content when clicking a link to a service', function() {
      browser.get('build/docs/index.html');

      var ngBindLink = element(by.css('.definition-table td a[href="api/ng/directive/ngClick"]'));
      ngBindLink.click();

      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('ngClick');
    });


    it('should show the functioning input directive example', function() {
      browser.get('build/docs/index.html#!/api/ng/directive/input');

      // Ensure that the page is loaded before trying to switch frames.
      browser.waitForAngular();

      browser.switchTo().frame('example-input-directive');

      var nameInput = element(by.model('user.name'));
      nameInput.sendKeys('!!!');

      var code = element.all(by.css('tt')).first();
      expect(code.getText()).toContain('guest!!!');
    });

    it('should trim indentation from code blocks', function() {
      browser.get('build/docs/index.html#!/api/ng/type/$rootScope.Scope');

      var codeBlocks = element.all(by.css('pre > code.lang-js'));
      codeBlocks.each(function(codeBlock) {
        var firstSpan = codeBlock.all(by.css('span')).first();
        expect(firstSpan.getText()).not.toMatch(/^\W+$/);
      });
    });
  });
});
