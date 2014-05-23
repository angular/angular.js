describe('docs.angularjs.org', function () {
  describe('App', function () {
    // it('should filter the module list when searching', function () {
    //   browser.get();
    //   browser.waitForAngular();

    //   var search = element(by.input('q'));
    //   search.clear();
    //   search.sendKeys('ngBind');

    //   var firstModule = element(by.css('.search-results a'));
    //   expect(firstModule.getText()).toEqual('ngBind');
    // });


    it('should change the page content when clicking a link to a service', function () {
      browser.get('');

      var ngBindLink = element(by.css('.definition-table td a[href="api/ng/directive/ngClick"]'));
      ngBindLink.click();

      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('ngClick');
    });


    it('should show the functioning input directive example', function () {
      browser.get('index-debug.html#!/api/ng/directive/input');

      // Ensure that the page is loaded before trying to switch frames.
      browser.waitForAngular();

      browser.switchTo().frame('example-input-directive');

      var nameInput = element(by.input('user.name'));
      nameInput.sendKeys('!!!');

      var code = element(by.css('tt'));
      expect(code.getText()).toContain('guest!!!');
    });


    it('should be resilient to trailing slashes', function() {
      browser.get('index-debug.html#!/api/ng/function/angular.noop/');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index"', function() {
      browser.get('index-debug.html#!/api/ng/function/angular.noop/index');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index/"', function() {
      browser.get('index-debug.html#!/api/ng/function/angular.noop/index/');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should display formatted error messages on error doc pages', function() {
      browser.get('index-debug.html#!error/ng/areq?p0=Missing&p1=not%20a%20function,%20got%20undefined');
      expect(element(by.css('.minerr-errmsg')).getText()).toEqual("Argument 'Missing' is not a function, got undefined");
    });
  });
});
