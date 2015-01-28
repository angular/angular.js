'use strict';

describe('angular.scenario.Application', function() {
  var $window;
  var app, frames;

  function callLoadHandlers(app) {
    var handler = app.getFrame_().triggerHandler('load');
  }

  beforeEach(function() {
    document.body.innerHTML = '';
    frames = _jQuery("<div></div>");
    _jQuery(document.body).append(frames);
    app = new angular.scenario.Application(frames);
  });


  afterEach(function() {
    _jQuery('iframe').off(); // cleanup any leftover onload handlers
    document.body.innerHTML = '';
  });


  it('should return new $window and $document after navigateTo', function() {
    var called;
    var testWindow, testDocument, counter = 0;
    app.getWindow_ = function() {
      return {x:counter++, document:{x:counter++}};
    };
    app.navigateTo('http://www.google.com/');
    app.executeAction(function($window, $document) {
      testWindow = $window;
      testDocument = $document;
    });
    app.navigateTo('http://www.google.com/');
    app.executeAction(function($window, $document) {
      expect($window).not.toEqual(testWindow);
      expect($document).not.toEqual(testDocument);
      called = true;
    });
    expect(called).toBeTruthy();
  });

  it('should execute callback with correct arguments', function() {
    var called;
    var testWindow = {document: {}};
    app.getWindow_ = function() {
      return testWindow;
    };
    app.executeAction(function($window, $document) {
      expect(this).toEqual(app);
      expect($document).toEqual(_jQuery($window.document));
      expect($window).toEqual(testWindow);
      called = true;
    });
    expect(called).toBeTruthy();
  });

  it('should use a new iframe each time', function() {
    app.navigateTo('http://localhost/');
    var frame = app.getFrame_();
    frame.attr('test', true);
    app.navigateTo('http://localhost/');
    expect(app.getFrame_().attr('test')).toBeFalsy();
  });

  it('should call error handler if document not accessible', function() {
    var called;
    app.getWindow_ = function() {
      return {};
    };
    app.navigateTo('http://localhost/', angular.noop, function(error) {
      expect(error).toMatch(/Sandbox Error/);
      called = true;
    });
    callLoadHandlers(app);
    expect(called).toBeTruthy();
  });

  it('should call error handler if navigating to about:blank', function() {
    var called;
    app.navigateTo('about:blank', angular.noop, function(error) {
      expect(error).toMatch(/Sandbox Error/);
      called = true;
    });
    expect(called).toBeTruthy();
  });

  it('should remove old iframes', function() {
    app.navigateTo('http://localhost/#foo');
    frames.find('iframe')[0].id = 'test';

    app.navigateTo('http://localhost/#bar');
    var iframes = frames.find('iframe');

    expect(iframes.length).toEqual(1);
    expect(iframes[0].src).toEqual('http://localhost/#bar');
    expect(iframes[0].id).toBeFalsy();
  });

  it('should URL update description bar', function() {
    app.navigateTo('http://localhost/');
    var anchor = frames.find('> h2 a');
    expect(anchor.attr('href')).toEqual('http://localhost/');
    expect(anchor.text()).toEqual('http://localhost/');
  });

  it('should call onload handler when frame loads', function() {
    var called;
    app.getWindow_ = function() {
      return {document: {}};
    };
    app.navigateTo('http://localhost/', function($window, $document) {
      called = true;
    });
    callLoadHandlers(app);
    expect(called).toBeTruthy();
  });

  it('should set rootElement when navigateTo instigates bootstrap', inject(function($injector, $browser) {
    var called;
    var testWindow = {
      document: jqLite('<div class="test-foo"></div>')[0],
      angular: {
        element: jqLite,
        service: {},
        resumeBootstrap: noop
      }
    };
    jqLite(testWindow.document).data('$injector', $injector);
    var resumeBootstrapSpy = spyOn(testWindow.angular, 'resumeBootstrap').andReturn($injector);

    var injectorGet = $injector.get;
    spyOn($injector, 'get').andCallFake(function(name) {
      switch (name) {
        case "$rootElement": return jqLite(testWindow.document);
        default: return injectorGet(name);
      }
    });

    app.getWindow_ = function() {
      return testWindow;
    };
    app.navigateTo('http://localhost/', noop);
    callLoadHandlers(app);
    expect(app.rootElement).toBe(testWindow.document);
    expect(resumeBootstrapSpy).toHaveBeenCalled();
    dealoc(testWindow.document);
  }));

  it('should set setup resumeDeferredBootstrap if resumeBootstrap is not yet defined', inject(function($injector, $browser) {
    var called;
    var testWindow = {
      document: jqLite('<div class="test-foo"></div>')[0],
      angular: {
        element: jqLite,
        service: {},
        resumeBootstrap: null
      }
    };
    jqLite(testWindow.document).data('$injector', $injector);

    var injectorGet = $injector.get;
    var injectorSpy = spyOn($injector, 'get').andCallFake(function(name) {
      switch (name) {
        case "$rootElement": return jqLite(testWindow.document);
        default: return injectorGet(name);
      }
    });

    app.getWindow_ = function() {
      return testWindow;
    };
    app.navigateTo('http://localhost/', noop);
    expect(testWindow.angular.resumeDeferredBootstrap).toBeUndefined();
    callLoadHandlers(app);
    expect(testWindow.angular.resumeDeferredBootstrap).toBeDefined();
    expect(app.rootElement).toBeUndefined;
    expect(injectorSpy).not.toHaveBeenCalled();

    var resumeBootstrapSpy = spyOn(testWindow.angular, 'resumeBootstrap').andReturn($injector);
    testWindow.angular.resumeDeferredBootstrap();
    expect(app.rootElement).toBe(testWindow.document);
    expect(resumeBootstrapSpy).toHaveBeenCalled();
    expect(injectorSpy).toHaveBeenCalledWith("$rootElement");
    dealoc(testWindow.document);
  }));

  it('should wait for pending requests in executeAction', inject(function($injector, $browser) {
    var called, polled;
    var handlers = [];
    var testWindow = {
      document: jqLite('<div class="test-foo" ng-app></div>')[0],
      angular: {
        element: jqLite,
        service: {}
      }
    };
    $browser.notifyWhenNoOutstandingRequests = function(fn) {
      handlers.push(fn);
    };
    jqLite(testWindow.document).data('$injector', $injector);
    app.getWindow_ = function() {
      return testWindow;
    };
    app.executeAction(function($window, $document) {
      expect($window).toEqual(testWindow);
      expect($document).toBeDefined();
      expect($document[0].className).toEqual('test-foo');
    });
    expect(handlers.length).toEqual(1);
    handlers[0]();
    dealoc(testWindow.document);
  }));

  it('should allow explicit rootElement', inject(function($injector, $browser) {
    var called, polled;
    var handlers = [];
    var testWindow = {
      document: jqLite('<div class="test-foo"></div>')[0],
      angular: {
        element: jqLite,
        service: {}
      }
    };
    $browser.notifyWhenNoOutstandingRequests = function(fn) {
      handlers.push(fn);
    };
    app.rootElement = testWindow.document;
    jqLite(testWindow.document).data('$injector', $injector);
    app.getWindow_ = function() {
      return testWindow;
    };
    app.executeAction(function($window, $document) {
      expect($window).toEqual(testWindow);
      expect($document).toBeDefined();
      expect($document[0].className).toEqual('test-foo');
    });
    expect(handlers.length).toEqual(1);
    handlers[0]();
    dealoc(testWindow.document);
  }));
});
