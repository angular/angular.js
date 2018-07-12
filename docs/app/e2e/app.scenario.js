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

    browser.ignoreSynchronization = false;
    browser.clearMockModules();
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

      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('ngClick');
    });


    it('should include the files for the embedded examples from the same domain', function() {
      browser.get('build/docs/index-production.html#!api/ng/directive/ngClick');

      var origin = browser.executeScript('return document.location.origin;');

      var exampleIFrame = element(by.name('example-ng-click'));

      // This is technically an implementation detail, but if this changes, then there's a good
      // chance the deployment process changed
      expect(exampleIFrame.getAttribute('src')).toContain('examples/example-ng-click/index.html');

      browser.switchTo().frame('example-ng-click');

      var scriptEl = element(by.tagName('script'));

      // Ensure the included file is from the same domain
      expect(scriptEl.getAttribute('src')).toContain(origin);
    });


    it('should be resilient to trailing slashes', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/');

      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index"', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/index');
      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('angular.noop');
    });


    it('should be resilient to trailing "index/"', function() {
      browser.get('build/docs/index-production.html#!/api/ng/function/angular.noop/index/');
      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('angular.noop');
    });


    it('should display formatted error messages on error doc pages', function() {
      browser.get('build/docs/index-production.html#!error/ng/areq?p0=Missing&p1=not%20a%20function,%20got%20undefined');
      expect(element(by.css('.minerr-errmsg')).getText()).toEqual('Argument \'Missing\' is not a function, got undefined');
    });

    it('should display an error if the page does not exist', function() {
      browser.get('build/docs/index-production.html#!/api/does/not/exist');
      var mainHeader = element(by.css('.main-body h1 '));
      expect(mainHeader.getText()).toEqual('Oops!');
    });

    it('should set "noindex" if the page does not exist', function() {
      browser.get('build/docs/index-production.html#!/api/does/not/exist');
      var robots = element(by.css('meta[name="robots"][content="noindex"]'));
      var googleBot = element(by.css('meta[name="googlebot"][content="noindex"]'));
      expect(robots.isPresent()).toBe(true);
      expect(googleBot.isPresent()).toBe(true);
    });

    it('should remove "noindex" if the page exists', function() {
      browser.get('build/docs/index-production.html#!/api');
      var robots = element(by.css('meta[name="robots"][content="noindex"]'));
      var googleBot = element(by.css('meta[name="googlebot"][content="noindex"]'));
      expect(robots.isPresent()).toBe(false);
      expect(googleBot.isPresent()).toBe(false);
    });

    describe('template request error', function() {
      beforeEach(function() {
        browser.addMockModule('httpMocker', function() {
          angular.module('httpMocker', ['ngMock'])
            .run(['$httpBackend', function($httpBackend) {
              $httpBackend.whenGET('localhost:8000/build/docs/partials/api.html').respond(500, '');
            }]);
          });
      });

      it('should set "noindex" for robots if the request fails', function() {
        // index-test includes ngMock
        browser.get('build/docs/index-test.html#!/api');
        var robots = element(by.css('meta[name="robots"][content="noindex"]'));
        var googleBot = element(by.css('meta[name="googlebot"][content="noindex"]'));
        expect(robots.isPresent()).toBe(true);
        expect(googleBot.isPresent()).toBe(true);
      });
    });


    describe('page bootstrap error', function() {
      beforeEach(function() {
        browser.addMockModule('httpMocker', function() {
          // Require a module that does not exist to break the bootstrapping
          angular.module('httpMocker', ['doesNotExist']);
        });
    });

      it('should have "noindex" for robots if bootstrapping fails', function() {
        browser.get('build/docs/index.html#!/api').catch(function() {
          // get() will fail on AngularJS bootstrap, but if we continue here, protractor
          // will assume the app is ready
          browser.ignoreSynchronization = true;
          var robots = element(by.css('meta[name="robots"][content="noindex"]'));
          var googleBot = element(by.css('meta[name="googlebot"][content="noindex"]'));
          expect(robots.isPresent()).toBe(true);
          expect(googleBot.isPresent()).toBe(true);
        });
      });


    });

  });

});
