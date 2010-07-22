describe('browser', function(){

  var browser, location, head;

  beforeEach(function(){
    location = {href:"http://server", hash:""};
    document = jqLite(window.document);
    head = {
        scripts: [],
        append: function(node){head.scripts.push(node);}
    };
    browser = new Browser(location, jqLite(window.document), head);
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

  describe('xhr', function(){
    describe('JSON', function(){
      it('should add script tag for request', function() {
        var log = "";
        browser.xhr('JSON', 'http://example.org/path?cb=JSON_CALLBACK', function(code, data){
          log += code + ':' + data + ';';
        });
        expect(head.scripts.length).toEqual(1);
        var url = head.scripts[0].src.split('?cb=');
        expect(url[0]).toEqual('http://example.org/path');
        expect(typeof window[url[1]]).toEqual('function');
        window[url[1]]('data');
        expect(log).toEqual('200:data;');
        expect(typeof window[url[1]]).toEqual('undefined');

      });
    });
  });

});
