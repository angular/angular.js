describe('browser', function(){

  var browser, location;

  beforeEach(function(){
    location = {href:"http://server", hash:""};
    browser = new Browser(location, {});
    browser.setTimeout = noop;
  });

  it('should watch url', function(){
    browser.delay = 1;
    expectAsserts(2);
    browser.watchUrl(function(url){
      assertEquals('http://getangular.test', url);
    });
    browser.setTimeout = function(fn, delay){
      assertEquals(1, delay);
      location.href = "http://getangular.test";
      browser.setTimeout = function(fn, delay) {};
      fn();
    };
    browser.startUrlWatcher();
  });

  describe('outstading requests', function(){
    it('should process callbacks immedietly with no outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).wasCalled();
    });

    it('should queue callbacks with outstanding requests', function(){
      var callback = jasmine.createSpy('callback');
      browser.outstandingRequests.count = 1;
      browser.notifyWhenNoOutstandingRequests(callback);
      expect(callback).not.wasCalled();

      browser.processRequestCallbacks();
      expect(callback).not.wasCalled();

      browser.outstandingRequests.count = 0;
      browser.processRequestCallbacks();
      expect(callback).wasCalled();
    });
  });

});
