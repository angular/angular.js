describe('angular.scenario.Application', function() {
  var app, frames;

  beforeEach(function() {
    frames = _jQuery("<div></div>");
    app = new angular.scenario.Application(frames);
  });

  it('should return new $window and $document after navigate', function() {
    var testWindow, testDocument, counter = 0;
    app.navigateTo = noop;
    app.getWindow = function() { 
      return {x:counter++, document:{x:counter++}}; 
    };
    app.navigateTo('http://www.google.com/');
    app.executeAction(function($document, $window) {
      testWindow = $window;
      testDocument = $document;
    });
    app.navigateTo('http://www.google.com/');
    app.executeAction(function($document, $window) {
      expect($window).not.toEqual(testWindow);
      expect($document).not.toEqual(testDocument);
    });
  });

  it('should execute callback on $window of frame', function() {
    var testWindow = {document: {}};
    app.getWindow = function() { 
      return testWindow; 
    };
    app.executeAction(function($document, $window) {
      expect(this).toEqual($window);
      expect(this).toEqual(testWindow);
    });
  });
  
  it('should create a new iframe each time', function() {
    app.navigateTo('about:blank');
    var frame = app.getFrame();
    frame.attr('test', true);
    app.navigateTo('about:blank');
    expect(app.getFrame().attr('test')).toBeFalsy();
  });
  
  it('should URL description bar', function() {
    app.navigateTo('about:blank');
    var anchor = frames.find('> h2 a');
    expect(anchor.attr('href')).toEqual('about:blank');
    expect(anchor.text()).toEqual('about:blank');
  });
  
  it('should call onload handler when frame loads', function() {
    var called;
    app.getFrame = function() { 
      // Mock a little jQuery
      var result = {
        remove: function() { 
          return result; 
        },
        attr: function(key, value) { 
          return (!value) ? 'attribute value' : result;
        },
        load: function() { 
          called = true; 
        }
      };
      return result;
    };
    app.navigateTo('about:blank', function() {
      called = true;
    });
    expect(called).toBeTruthy();
  });
});
