describe('angular.scenario.Application', function() {
  var app, frames;

  beforeEach(function() {
    frames = _jQuery("<div></div>");
    app = new angular.scenario.Application(frames);
  });

  it('should return new $window and $document after navigate', function() {
    var called;
    var testWindow, testDocument, counter = 0;
    app.navigateTo = noop;
    app.getWindow_ = function() {
      return {x:counter++, document:{x:counter++}};
    };
    app.navigateTo('http://www.google.com/');
    app.executeAction(function($document, $window) {
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
    app.navigateTo('about:blank');
    var frame = app.getFrame_();
    frame.attr('test', true);
    app.navigateTo('about:blank');
    expect(app.getFrame_().attr('test')).toBeFalsy();
  });

  it('should hide old iframes and navigate to about:blank', function() {
    app.navigateTo('about:blank#foo');
    app.navigateTo('about:blank#bar');
    var iframes = frames.find('iframe');
    expect(iframes.length).toEqual(2);
    expect(iframes[0].src).toEqual('about:blank');
    expect(iframes[1].src).toEqual('about:blank#bar');
    expect(_jQuery(iframes[0]).css('display')).toEqual('none');
  });

  it('should URL update description bar', function() {
    app.navigateTo('about:blank');
    var anchor = frames.find('> h2 a');
    expect(anchor.attr('href')).toEqual('about:blank');
    expect(anchor.text()).toEqual('about:blank');
  });

  it('should call onload handler when frame loads', function() {
    var called;
    app.getWindow_ = function() {
      return {};
    };
    app.navigateTo('about:blank', function($window, $document) {
      called = true;
    });
    var handlers = app.getFrame_().data('events').load;
    expect(handlers).toBeDefined();
    expect(handlers.length).toEqual(1);
    handlers[0].handler();
    expect(called).toBeTruthy();
  });

  it('should wait for pending requests in executeAction', function() {
    var called, polled;
    var handlers = [];
    var testWindow = {
      document: _jQuery('<div class="test-foo"></div>'),
      angular: {
        service: {},
      }
    };
    testWindow.angular.service.$browser = function() {
      return {
        poll: function() {
          polled = true;
        },
        notifyWhenNoOutstandingRequests: function(fn) {
          handlers.push(fn);
        }
      }
    };
    app.getWindow_ = function() {
      return testWindow;
    };
    app.executeAction(function($window, $document) {
      expect($window).toEqual(testWindow);
      expect($document).toBeDefined();
      expect($document[0].className).toEqual('test-foo');
    });
    expect(polled).toBeTruthy();
    expect(handlers.length).toEqual(1);
    handlers[0]();
  });
});
