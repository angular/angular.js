'use strict';

var webdriver = require('selenium-webdriver');

describe('docs.angularjs.org', function() {

  beforeEach(function() {
    // read and clear logs from previous tests
    browser.manage().logs().get('browser');
  });


  afterEach(function() {
    // verify that there were no console errors in the browser
    browser.manage().logs().get('browser').then(function(browserLog) {
      var filteredLog = browserLog.filter(function(logEntry) {
        return logEntry.level.value > webdriver.logging.Level.WARNING.value;
      });
      expect(filteredLog.length).toEqual(0);
      if (filteredLog.length) {
        console.log('browser console errors: ' + require('util').inspect(filteredLog));
      }
    });
  });


  describe('App', function() {
    // it('should filter the module list when searching', function () {
    //   browser.get();
    //   browser.waitForAngular();

    //   var search = element(by.model('q'));
    //   search.clear();
    //   search.sendKeys('ngBind');

    //   var firstModule = element(by.css('.search-results a'));
    //   expect(firstModule.getText()).toEqual('ngBind');
    // });


    it('should change the page content when clicking a link to a service', function() {
      browser.get('build/docs/index-production.html');

      var ngBindLink = element(by.css('.definition-table td a[href="api/ng/directive/ngClick"]'));
      ngBindLink.click();

      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('ngClick');
    });



    it('should be resilient to trailing slashes', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index"', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/index');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index/"', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/index/');
      var pageBody = element(by.css('h1'));
      expect(pageBody.getText()).toEqual('angular.noop');
    });


    it('should display formatted error messages on error doc pages', function() {
      browser.get('build/docs/index-production.html#!error/ng/areq?p0=Missing&p1=not%20a%20function,%20got%20undefined');
      expect(element(by.css('.minerr-errmsg')).getText()).toEqual('Argument \'Missing\' is not a function, got undefined');
    });

    it('should display an error if the page does not exist', function() {
      browser.get('build/docs/index-production.html#!/api/does/not/exist');
      expect(element(by.css('h1')).getText()).toBe('Oops!');
    });

  });

});
