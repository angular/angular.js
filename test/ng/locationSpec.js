/* global LocationHashbangUrl: false, LocationHtml5Url: false */
'use strict';

describe('$location', function() {
  var url;

  beforeEach(module(provideLog));

  afterEach(function() {
    // link rewriting used in html5 mode on legacy browsers binds to document.onClick, so we need
    // to clean this up after each test.
    jqLite(document).off('click');
  });


  describe('File Protocol', function () {
    /* global urlParsingNode: true */
    var urlParsingNodePlaceholder;

    beforeEach(inject(function ($sniffer) {
      if ($sniffer.msie) return;

      urlParsingNodePlaceholder = urlParsingNode;

      //temporarily overriding the DOM element
      //with output from IE, if not in IE
      urlParsingNode = {
        hash : "#/C:/",
        host : "",
        hostname : "",
        href : "file:///C:/base#!/C:/foo",
        pathname : "/C:/foo",
        port : "",
        protocol : "file:",
        search : "",
        setAttribute: angular.noop
      };
    }));

    afterEach(inject(function ($sniffer) {
      if ($sniffer.msie) return;
      //reset urlParsingNode
      urlParsingNode = urlParsingNodePlaceholder;
    }));


    it('should not include the drive name in path() on WIN', function (){
      //See issue #4680 for details
      url = new LocationHashbangUrl('file:///base', '#!');
      url.$$parse('file:///base#!/foo?a=b&c#hash');

      expect(url.path()).toBe('/foo');
    });


    it('should include the drive name if it was provided in the input url', function () {
      url = new LocationHashbangUrl('file:///base', '#!');
      url.$$parse('file:///base#!/C:/foo?a=b&c#hash');

      expect(url.path()).toBe('/C:/foo');
    });
  });


  describe('NewUrl', function() {
    beforeEach(function() {
      url = new LocationHtml5Url('http://www.domain.com:9877/');
      url.$$parse('http://www.domain.com:9877/path/b?search=a&b=c&d#hash');
    });


    it('should provide common getters', function() {
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?search=a&b=c&d#hash');
      expect(url.protocol()).toBe('http');
      expect(url.host()).toBe('www.domain.com');
      expect(url.port()).toBe(9877);
      expect(url.path()).toBe('/path/b');
      expect(url.search()).toEqual({search: 'a', b: 'c', d: true});
      expect(url.hash()).toBe('hash');
      expect(url.url()).toBe('/path/b?search=a&b=c&d#hash');
    });


    it('path() should change path', function() {
      url.path('/new/path');
      expect(url.path()).toBe('/new/path');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/new/path?search=a&b=c&d#hash');
    });

    it('path() should not break on numeric values', function() {
      url.path(1);
      expect(url.path()).toBe('/1');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/1?search=a&b=c&d#hash');
    });


    it('path() should set to empty path on null value', function () {
      url.path('/foo');
      expect(url.path()).toBe('/foo');
      url.path(null);
      expect(url.path()).toBe('/');
    });

    it('search() should accept string', function() {
      url.search('x=y&c');
      expect(url.search()).toEqual({x: 'y', c: true});
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?x=y&c#hash');
    });


    it('search() should accept object', function() {
      url.search({one: 1, two: true});
      expect(url.search()).toEqual({one: 1, two: true});
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?one=1&two#hash');
    });


    it('search() should change single parameter', function() {
      url.search({id: 'old', preserved: true});
      url.search('id', 'new');

      expect(url.search()).toEqual({id: 'new', preserved: true});
    });


    it('search() should remove single parameter', function() {
      url.search({id: 'old', preserved: true});
      url.search('id', null);

      expect(url.search()).toEqual({preserved: true});
    });


    it('search() should remove multiple parameters', function() {
      url.search({one: 1, two: true});
      expect(url.search()).toEqual({one: 1, two: true});
      url.search({one: null, two: null});
      expect(url.search()).toEqual({});
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b#hash');
    });


    it('search() should accept numeric keys', function() {
      url.search({1: 'one', 2: 'two'});
      expect(url.search()).toEqual({'1': 'one', '2': 'two'});
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?1=one&2=two#hash');
    });


    it('search() should handle multiple value', function() {
      url.search('a&b');
      expect(url.search()).toEqual({a: true, b: true});

      url.search('a', null);

      expect(url.search()).toEqual({b: true});

      url.search('b', undefined);
      expect(url.search()).toEqual({});
    });


    it('search() should handle single value', function() {
      url.search('ignore');
      expect(url.search()).toEqual({ignore: true});
      url.search(1);
      expect(url.search()).toEqual({1: true});
    });


    it('search() should throw error an incorrect argument', function() {
      expect(function() {
        url.search(null);
      }).toThrowMinErr('$location', 'isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
      expect(function() {
        url.search(undefined);
      }).toThrowMinErr('$location', 'isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
    });


    it('hash() should change hash fragment', function() {
      url.hash('new-hash');
      expect(url.hash()).toBe('new-hash');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?search=a&b=c&d#new-hash');
    });


    it('hash() should accept numeric parameter', function() {
      url.hash(5);
      expect(url.hash()).toBe('5');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?search=a&b=c&d#5');
    });


    it('hash() should accept null parameter', function() {
      url.hash(null);
      expect(url.hash()).toBe('');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?search=a&b=c&d');
    });


    it('url() should change the path, search and hash', function() {
      url.url('/some/path?a=b&c=d#hhh');
      expect(url.url()).toBe('/some/path?a=b&c=d#hhh');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/some/path?a=b&c=d#hhh');
      expect(url.path()).toBe('/some/path');
      expect(url.search()).toEqual({a: 'b', c: 'd'});
      expect(url.hash()).toBe('hhh');
    });


    it('url() should change only hash when no search and path specified', function() {
      url.url('#some-hash');

      expect(url.hash()).toBe('some-hash');
      expect(url.url()).toBe('/path/b?search=a&b=c&d#some-hash');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/path/b?search=a&b=c&d#some-hash');
    });


    it('url() should change only search and hash when no path specified', function() {
      url.url('?a=b');

      expect(url.search()).toEqual({a: 'b'});
      expect(url.hash()).toBe('');
      expect(url.path()).toBe('/path/b');
    });


    it('url() should reset search and hash when only path specified', function() {
      url.url('/new/path');

      expect(url.path()).toBe('/new/path');
      expect(url.search()).toEqual({});
      expect(url.hash()).toBe('');
    });


    it('replace should set $$replace flag and return itself', function() {
      expect(url.$$replace).toBe(false);

      url.replace();
      expect(url.$$replace).toBe(true);
      expect(url.replace()).toBe(url);
    });


    it('should parse new url', function() {
      url = new LocationHtml5Url('http://host.com/');
      url.$$parse('http://host.com/base');
      expect(url.path()).toBe('/base');

      url = new LocationHtml5Url('http://host.com/');
      url.$$parse('http://host.com/base#');
      expect(url.path()).toBe('/base');
    });


    it('should prefix path with forward-slash', function() {
      url = new LocationHtml5Url('http://server/');
      url.path('b');

      expect(url.path()).toBe('/b');
      expect(url.absUrl()).toBe('http://server/b');
    });


    it('should set path to forward-slash when empty', function() {
      url = new LocationHtml5Url('http://server/');
      url.$$parse('http://server/');
      expect(url.path()).toBe('/');
      expect(url.absUrl()).toBe('http://server/');
    });


    it('setters should return Url object to allow chaining', function() {
      expect(url.path('/any')).toBe(url);
      expect(url.search('')).toBe(url);
      expect(url.hash('aaa')).toBe(url);
      expect(url.url('/some')).toBe(url);
    });


    it('should not preserve old properties when parsing new url', function() {
      url.$$parse('http://www.domain.com:9877/a');

      expect(url.path()).toBe('/a');
      expect(url.search()).toEqual({});
      expect(url.hash()).toBe('');
      expect(url.absUrl()).toBe('http://www.domain.com:9877/a');
    });

    it('should not rewrite when hashbang url is not given', function() {
      initService(true, '!', true);
      inject(
        initBrowser('http://domain.com/base/a/b', '/base'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/a/b');
        }
      );
    });

    it('should prepend path with basePath', function() {
      url = new LocationHtml5Url('http://server/base/');
      url.$$parse('http://server/base/abc?a');
      expect(url.path()).toBe('/abc');
      expect(url.search()).toEqual({a: true});

      url.path('/new/path');
      expect(url.absUrl()).toBe('http://server/base/new/path?a');
    });


    it('should throw error when invalid server url given', function() {
      url = new LocationHtml5Url('http://server.org/base/abc', '/base');

      expect(function() {
        url.$$parse('http://other.server.org/path#/path');
      }).toThrowMinErr('$location', 'ipthprfx', 'Invalid url "http://other.server.org/path#/path", missing path prefix "http://server.org/base/".');
    });


    it('should throw error when invalid base url given', function() {
      url = new LocationHtml5Url('http://server.org/base/abc', '/base');

      expect(function() {
        url.$$parse('http://server.org/path#/path');
      }).toThrowMinErr('$location', 'ipthprfx', 'Invalid url "http://server.org/path#/path", missing path prefix "http://server.org/base/".');
    });


    describe('encoding', function() {

      it('should encode special characters', function() {
        url.path('/a <>#');
        url.search({'i j': '<>#'});
        url.hash('<>#');

        expect(url.path()).toBe('/a <>#');
        expect(url.search()).toEqual({'i j': '<>#'});
        expect(url.hash()).toBe('<>#');
        expect(url.absUrl()).toBe('http://www.domain.com:9877/a%20%3C%3E%23?i%20j=%3C%3E%23#%3C%3E%23');
      });


      it('should not encode !$:@', function() {
        url.path('/!$:@');
        url.search('');
        url.hash('!$:@');

        expect(url.absUrl()).toBe('http://www.domain.com:9877/!$:@#!$:@');
      });


      it('should decode special characters', function() {
        url = new LocationHtml5Url('http://host.com/');
        url.$$parse('http://host.com/a%20%3C%3E%23?i%20j=%3C%3E%23#x%20%3C%3E%23');
        expect(url.path()).toBe('/a <>#');
        expect(url.search()).toEqual({'i j': '<>#'});
        expect(url.hash()).toBe('x <>#');
      });

      it('should decode pluses as spaces in urls', function() {
        url = new LocationHtml5Url('http://host.com/');
        url.$$parse('http://host.com/?a+b=c+d');
        expect(url.search()).toEqual({'a b':'c d'});
      });

      it('should retain pluses when setting search queries', function() {
        url.search({'a+b':'c+d'});
        expect(url.search()).toEqual({'a+b':'c+d'});
      });

    });
  });


  describe('HashbangUrl', function() {

    beforeEach(function() {
      url = new LocationHashbangUrl('http://www.server.org:1234/base', '#!');
      url.$$parse('http://www.server.org:1234/base#!/path?a=b&c#hash');
    });


    it('should parse hashbang url into path and search', function() {
      expect(url.protocol()).toBe('http');
      expect(url.host()).toBe('www.server.org');
      expect(url.port()).toBe(1234);
      expect(url.path()).toBe('/path');
      expect(url.search()).toEqual({a: 'b', c: true});
      expect(url.hash()).toBe('hash');
    });


    it('absUrl() should return hashbang url', function() {
      expect(url.absUrl()).toBe('http://www.server.org:1234/base#!/path?a=b&c#hash');

      url.path('/new/path');
      url.search({one: 1});
      url.hash('hhh');
      expect(url.absUrl()).toBe('http://www.server.org:1234/base#!/new/path?one=1#hhh');
    });


    it('should preserve query params in base', function() {
      url = new LocationHashbangUrl('http://www.server.org:1234/base?base=param', '#');
      url.$$parse('http://www.server.org:1234/base?base=param#/path?a=b&c#hash');
      expect(url.absUrl()).toBe('http://www.server.org:1234/base?base=param#/path?a=b&c#hash');

      url.path('/new/path');
      url.search({one: 1});
      url.hash('hhh');
      expect(url.absUrl()).toBe('http://www.server.org:1234/base?base=param#/new/path?one=1#hhh');
    });


    it('should prefix path with forward-slash', function() {
      url = new LocationHashbangUrl('http://host.com/base', '#');
      url.$$parse('http://host.com/base#path');
      expect(url.path()).toBe('/path');
      expect(url.absUrl()).toBe('http://host.com/base#/path');

      url.path('wrong');
      expect(url.path()).toBe('/wrong');
      expect(url.absUrl()).toBe('http://host.com/base#/wrong');
    });


    it('should set path to forward-slash when empty', function() {
      url = new LocationHashbangUrl('http://server/base', '#!');
      url.$$parse('http://server/base');
      url.path('aaa');

      expect(url.path()).toBe('/aaa');
      expect(url.absUrl()).toBe('http://server/base#!/aaa');
    });


    it('should not preserve old properties when parsing new url', function() {
      url.$$parse('http://www.server.org:1234/base#!/');

      expect(url.path()).toBe('/');
      expect(url.search()).toEqual({});
      expect(url.hash()).toBe('');
      expect(url.absUrl()).toBe('http://www.server.org:1234/base#!/');
    });


    it('should throw error when invalid hashbang prefix given', function() {
      expect(function() {
        url.$$parse('http://www.server.org:1234/base#/path');
      }).toThrowMinErr('$location', 'ihshprfx', 'Invalid url "http://www.server.org:1234/base#/path", missing hash prefix "#!".');
    });


    describe('encoding', function() {

      it('should encode special characters', function() {
        url.path('/a <>#');
        url.search({'i j': '<>#'});
        url.hash('<>#');

        expect(url.path()).toBe('/a <>#');
        expect(url.search()).toEqual({'i j': '<>#'});
        expect(url.hash()).toBe('<>#');
        expect(url.absUrl()).toBe('http://www.server.org:1234/base#!/a%20%3C%3E%23?i%20j=%3C%3E%23#%3C%3E%23');
      });


      it('should not encode !$:@', function() {
        url.path('/!$:@');
        url.search('');
        url.hash('!$:@');

        expect(url.absUrl()).toBe('http://www.server.org:1234/base#!/!$:@#!$:@');
      });


      it('should decode special characters', function() {
        url = new LocationHashbangUrl('http://host.com/a', '#');
        url.$$parse('http://host.com/a#/%20%3C%3E%23?i%20j=%3C%3E%23#x%20%3C%3E%23');
        expect(url.path()).toBe('/ <>#');
        expect(url.search()).toEqual({'i j': '<>#'});
        expect(url.hash()).toBe('x <>#');
      });


      it('should return decoded characters for search specified in URL', function() {
        var locationUrl = new LocationHtml5Url('http://host.com/');
        locationUrl.$$parse('http://host.com/?q=1%2F2%203');
        expect(locationUrl.search()).toEqual({'q': '1/2 3'});
      });


      it('should return decoded characters for search specified with setter', function() {
        var locationUrl = new LocationHtml5Url('http://host.com/');
        locationUrl.$$parse('http://host.com/');
        locationUrl.search('q', '1/2 3');
        expect(locationUrl.search()).toEqual({'q': '1/2 3'});
      });

      it('should return an array for duplicate params', function() {
        var locationUrl = new LocationHtml5Url('http://host.com');
        locationUrl.$$parse('http://host.com');
        locationUrl.search('q', ['1/2 3','4/5 6']);
        expect(locationUrl.search()).toEqual({'q': ['1/2 3','4/5 6']});
      });

      it('should encode an array correctly from search and add to url', function() {
        var locationUrl = new LocationHtml5Url('http://host.com');
        locationUrl.$$parse('http://host.com');
        locationUrl.search({'q': ['1/2 3','4/5 6']});
        expect(locationUrl.absUrl()).toEqual('http://host.com?q=1%2F2%203&q=4%2F5%206');
      });

      it('should rewrite params when specifing a single param in search', function() {
        var locationUrl = new LocationHtml5Url('http://host.com');
        locationUrl.$$parse('http://host.com');
        locationUrl.search({'q': '1/2 3'});
        expect(locationUrl.absUrl()).toEqual('http://host.com?q=1%2F2%203');
        locationUrl.search({'q': '4/5 6'});
        expect(locationUrl.absUrl()).toEqual('http://host.com?q=4%2F5%206');
      });
    });
  });


  function initService(html5Mode, hashPrefix, supportHistory) {
    return module(function($provide, $locationProvider){
      $locationProvider.html5Mode(html5Mode);
      $locationProvider.hashPrefix(hashPrefix);
      $provide.value('$sniffer', {history: supportHistory});
    });
  }
  function initBrowser(url, basePath) {
    return function($browser){
      $browser.url(url);
      $browser.$$baseHref = basePath;
    };
  }

  describe('wiring', function() {

    beforeEach(initService(false, '!', true));
    beforeEach(inject(initBrowser('http://new.com/a/b#!', 'http://new.com/a/b')));


    it('should update $location when browser url changes', inject(function($browser, $location) {
      spyOn($location, '$$parse').andCallThrough();
      $browser.url('http://new.com/a/b#!/aaa');
      $browser.poll();
      expect($location.absUrl()).toBe('http://new.com/a/b#!/aaa');
      expect($location.path()).toBe('/aaa');
      expect($location.$$parse).toHaveBeenCalledOnce();
    }));


    // location.href = '...' fires hashchange event synchronously, so it might happen inside $apply
    it('should not $apply when browser url changed inside $apply', inject(
        function($rootScope, $browser, $location) {
      var OLD_URL = $browser.url(),
          NEW_URL = 'http://new.com/a/b#!/new';


      $rootScope.$apply(function() {
        $browser.url(NEW_URL);
        $browser.poll(); // simulate firing event from browser
        expect($location.absUrl()).toBe(OLD_URL); // should be async
      });

      expect($location.absUrl()).toBe(NEW_URL);
    }));

    // location.href = '...' fires hashchange event synchronously, so it might happen inside $digest
    it('should not $apply when browser url changed inside $digest', inject(
        function($rootScope, $browser, $location) {
      var OLD_URL = $browser.url(),
          NEW_URL = 'http://new.com/a/b#!/new',
          notRunYet = true;

      $rootScope.$watch(function() {
        if (notRunYet) {
          notRunYet = false;
          $browser.url(NEW_URL);
          $browser.poll(); // simulate firing event from browser
          expect($location.absUrl()).toBe(OLD_URL); // should be async
        }
      });

      $rootScope.$digest();
      expect($location.absUrl()).toBe(NEW_URL);
    }));


    it('should update browser when $location changes', inject(function($rootScope, $browser, $location) {
      var $browserUrl = spyOnlyCallsWithArgs($browser, 'url').andCallThrough();
      $location.path('/new/path');
      expect($browserUrl).not.toHaveBeenCalled();
      $rootScope.$apply();

      expect($browserUrl).toHaveBeenCalledOnce();
      expect($browser.url()).toBe('http://new.com/a/b#!/new/path');
    }));


    it('should update browser only once per $apply cycle', inject(function($rootScope, $browser, $location) {
      var $browserUrl = spyOnlyCallsWithArgs($browser, 'url').andCallThrough();
      $location.path('/new/path');

      $rootScope.$watch(function() {
        $location.search('a=b');
      });

      $rootScope.$apply();
      expect($browserUrl).toHaveBeenCalledOnce();
      expect($browser.url()).toBe('http://new.com/a/b#!/new/path?a=b');
    }));


    it('should replace browser url when url was replaced at least once',
        inject(function($rootScope, $location, $browser) {
      var $browserUrl = spyOnlyCallsWithArgs($browser, 'url').andCallThrough();
      $location.path('/n/url').replace();
      $rootScope.$apply();

      expect($browserUrl).toHaveBeenCalledOnce();
      expect($browserUrl.mostRecentCall.args).toEqual(['http://new.com/a/b#!/n/url', true]);
      expect($location.$$replace).toBe(false);
    }));


    it('should always reset replace flag after running watch', inject(function($rootScope, $location) {
      // init watches
      $location.url('/initUrl');
      $rootScope.$apply();

      // changes url but resets it before digest
      $location.url('/newUrl').replace().url('/initUrl');
      $rootScope.$apply();
      expect($location.$$replace).toBe(false);

      // set the url to the old value
      $location.url('/newUrl').replace();
      $rootScope.$apply();
      expect($location.$$replace).toBe(false);

      // doesn't even change url only calls replace()
      $location.replace();
      $rootScope.$apply();
      expect($location.$$replace).toBe(false);
    }));


    it('should update the browser if changed from within a watcher', inject(function($rootScope, $location, $browser) {
      $rootScope.$watch(function() { return true; }, function() {
        $location.path('/changed');
      });

      $rootScope.$digest();
      expect($browser.url()).toBe('http://new.com/a/b#!/changed');
    }));
  });


  // html5 history is disabled
  describe('disabled history', function() {

    it('should use hashbang url with hash prefix', function() {
      initService(false, '!');
      inject(
        initBrowser('http://domain.com/base/index.html#!/a/b', '/base/index.html'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/index.html#!/a/b');
          $location.path('/new');
          $location.search({a: true});
          $rootScope.$apply();
          expect($browser.url()).toBe('http://domain.com/base/index.html#!/new?a');
        }
      );
    });


    it('should use hashbang url without hash prefix', function() {
      initService(false, '');
      inject(
        initBrowser('http://domain.com/base/index.html#/a/b', '/base/index.html'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/index.html#/a/b');
          $location.path('/new');
          $location.search({a: true});
          $rootScope.$apply();
          expect($browser.url()).toBe('http://domain.com/base/index.html#/new?a');
        }
      );
    });
  });


  // html5 history enabled, but not supported by browser
  describe('history on old browser', function() {

    afterEach(inject(function($rootElement){
      dealoc($rootElement);
    }));

    it('should use hashbang url with hash prefix', function() {
      initService(true, '!!', false);
      inject(
        initBrowser('http://domain.com/base/index.html#!!/a/b', '/base/index.html'),
        function($rootScope, $location,  $browser) {
          expect($browser.url()).toBe('http://domain.com/base/index.html#!!/a/b');
          $location.path('/new');
          $location.search({a: true});
          $rootScope.$apply();
          expect($browser.url()).toBe('http://domain.com/base/index.html#!!/new?a');
        }
      );
    });


    it('should redirect to hashbang url when new url given', function() {
      initService(true, '!');
      inject(
        initBrowser('http://domain.com/base/new-path/index.html', '/base/index.html'),
        function($browser, $location) {
          expect($browser.url()).toBe('http://domain.com/base/index.html#!/new-path/index.html');
        }
      );
    });

    it('should correctly convert html5 url with path matching basepath to hashbang url', function () {
      initService(true, '!', false);
      inject(
        initBrowser('http://domain.com/base/index.html', '/base/index.html'),
        function($browser, $location) {
          expect($browser.url()).toBe('http://domain.com/base/index.html#!/index.html');
        }
      );
    });
  });


  // html5 history enabled and supported by browser
  describe('history on new browser', function() {

    afterEach(inject(function($rootElement){
      dealoc($rootElement);
    }));

    it('should use new url', function() {
      initService(true, '', true);
      inject(
        initBrowser('http://domain.com/base/old/index.html#a', '/base/index.html'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/old/index.html#a');
          $location.path('/new');
          $location.search({a: true});
          $rootScope.$apply();
          expect($browser.url()).toBe('http://domain.com/base/new?a#a');
        }
      );
    });


    it('should rewrite when hashbang url given', function() {
      initService(true, '!', true);
      inject(
        initBrowser('http://domain.com/base/index.html#!/a/b', '/base/index.html'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/a/b');
          $location.path('/new');
          $location.hash('abc');
          $rootScope.$apply();
          expect($browser.url()).toBe('http://domain.com/base/new#abc');
          expect($location.path()).toBe('/new');
        }
      );
    });


    it('should rewrite when hashbang url given (without hash prefix)', function() {
      initService(true, '', true);
      inject(
        initBrowser('http://domain.com/base/index.html#/a/b', '/base/index.html'),
        function($rootScope, $location, $browser) {
          expect($browser.url()).toBe('http://domain.com/base/a/b');
          expect($location.path()).toBe('/a/b');
        }
      );
    });


    it('should set appBase to serverBase if base[href] is missing', function() {
      initService(true, '!', true);
      inject(
          initBrowser('http://domain.com/my/view1#anchor1', ''),
          function($rootScope, $location, $browser) {
            expect($browser.url()).toBe('http://domain.com/my/view1#anchor1');
            expect($location.path()).toBe('/my/view1');
            expect($location.hash()).toBe('anchor1');
          }
      );
    });
  });

  describe('PATH_MATCH', function() {
    /* global PATH_MATCH: false */
    it('should parse just path', function() {
      var match = PATH_MATCH.exec('/path');
      expect(match[1]).toBe('/path');
    });


    it('should parse path with search', function() {
      var match = PATH_MATCH.exec('/ppp/a?a=b&c');
      expect(match[1]).toBe('/ppp/a');
      expect(match[3]).toBe('a=b&c');
    });


    it('should parse path with hash', function() {
      var match = PATH_MATCH.exec('/ppp/a#abc?');
      expect(match[1]).toBe('/ppp/a');
      expect(match[5]).toBe('abc?');
    });


    it('should parse path with both search and hash', function() {
      var match = PATH_MATCH.exec('/ppp/a?a=b&c#abc/d?');
      expect(match[3]).toBe('a=b&c');
    });
  });


  describe('link rewriting', function() {

    var root, link, originalBrowser, lastEventPreventDefault;

    function configureService(linkHref, html5Mode, supportHist, relLink, attrs, content) {
      if (typeof relLink !== "boolean") {
        content = attrs;
        attrs = relLink;
        relLink = false;
      }
      module(function($provide, $locationProvider) {
        attrs = attrs ? ' ' + attrs + ' ' : '';

        // fake the base behavior
        if (typeof linkHref === 'string') {
          if (!relLink) {
            if (linkHref[0] == '/') {
              linkHref = 'http://host.com' + linkHref;
            } else if(!linkHref.match(/:\/\//)) {
              linkHref = 'http://host.com/base/' + linkHref;
            }
          }
        }

        if (linkHref) {
          link = jqLite('<a href="' + linkHref + '"' + attrs + '>' + content + '</a>')[0];
        } else {
          link = jqLite('<a ' + attrs + '>' + content + '</a>')[0];
        }

        $provide.value('$sniffer', {history: supportHist});
        $locationProvider.html5Mode(html5Mode);
        $locationProvider.hashPrefix('!');
        return function($rootElement, $document) {
          $rootElement.append(link);
          root = $rootElement[0];
          // we need to do this otherwise we can't simulate events
          $document.find('body').append($rootElement);
        };
      });
    }

    function initBrowser() {
      return function($browser){
        $browser.url('http://host.com/base');
        $browser.$$baseHref = '/base/index.html';
      };
    }

    function initLocation() {
      return function($browser, $location, $rootElement) {
        originalBrowser = $browser.url();
        // we have to prevent the default operation, as we need to test absolute links (http://...)
        // and navigating to these links would kill jstd
        $rootElement.on('click', function(e) {
          lastEventPreventDefault = e.isDefaultPrevented();
          e.preventDefault();
        });
      };
    }

    function expectRewriteTo($browser, url) {
      expect(lastEventPreventDefault).toBe(true);
      expect($browser.url()).toBe(url);
    }

    function expectNoRewrite($browser) {
      expect(lastEventPreventDefault).toBe(false);
      expect($browser.url()).toBe(originalBrowser);
    }

    afterEach(function() {
      dealoc(root);
      dealoc(document.body);
    });


    it('should rewrite rel link to new url when history enabled on new browser', function() {
      configureService('link?a#b', true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/link?a#b');
        }
      );
    });


    it('should do nothing if already on the same URL', function() {
      configureService('/base/', true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/');

          jqLite(link).attr('href', 'http://host.com/base/foo');
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/foo');

          jqLite(link).attr('href', 'http://host.com/base/');
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/');

          jqLite(link).
              attr('href', 'http://host.com/base/foo').
              on('click', function(e) { e.preventDefault(); });
          browserTrigger(link, 'click');
          expect($browser.url()).toBe('http://host.com/base/');
        }
      );
    });


    it('should rewrite abs link to new url when history enabled on new browser', function() {
      configureService('/base/link?a#b', true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/link?a#b');
        }
      );
    });


    it('should rewrite rel link to hashbang url when history enabled on old browser', function() {
      configureService('link?a#b', true, false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/link?a#b');
        }
      );
    });


    // Regression (gh-7721)
    it('should not throw when clicking anchor with no href attribute when history enabled on old browser', function() {
      configureService(null, true, false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should produce relative paths correctly when $location.path() is "/" when history enabled on old browser', function() {
      configureService('partial1', true, false, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser, $location) {
          $location.path('/');
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/partial1');
        }
      );
    });


    it('should rewrite abs link to hashbang url when history enabled on old browser', function() {
      configureService('/base/link?a#b', true, false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/link?a#b');
        }
      );
    });


    it('should not rewrite full url links do different domain', function() {
      configureService('http://www.dot.abc/a?b=c', true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite links with target="_blank"', function() {
      configureService('/a?b=c', true, true, 'target="_blank"');
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite links with target specified', function() {
      configureService('/a?b=c', true, true, 'target="some-frame"');
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite links with `javascript:` URI', function() {
      configureService(' jAvAsCrIpT:throw new Error("Boom!")', true, true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite links with `mailto:` URI', function() {
      configureService(' mAiLtO:foo@bar.com', true, true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should rewrite full url links to same domain and base path', function() {
      configureService('http://host.com/base/new', true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/new');
        }
      );
    });


    it('should rewrite when clicked span inside link', function() {
      configureService('some/link', true, true, '', '<span>link</span>');
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          var span = jqLite(link).find('span');

          browserTrigger(span, 'click');
          expectRewriteTo($browser, 'http://host.com/base/some/link');
        }
      );
    });


    it('should not rewrite when link to different base path when history enabled on new browser',
        function() {
      configureService('/other_base/link', true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite when link to different base path when history enabled on old browser',
        function() {
      configureService('/other_base/link', true, false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite when link to different base path when history disabled', function() {
      configureService('/other_base/link', false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite when full link to different base path when history enabled on new browser',
        function() {
      configureService('http://host.com/other_base/link', true, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite when full link to different base path when history enabled on old browser',
        function() {
      configureService('http://host.com/other_base/link', true, false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should not rewrite when full link to different base path when history disabled', function() {
      configureService('http://host.com/other_base/link', false);
      inject(
        initBrowser(),
        initLocation(),
        function($browser) {
          browserTrigger(link, 'click');
          expectNoRewrite($browser);
        }
      );
    });


    it('should rewrite relative links relative to current path when history disabled', function() {
      configureService('link', true, false, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser, $location) {
          $location.path('/some');
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/some/link');
        }
      );
    });


    it('should replace current path when link begins with "/" and history disabled', function() {
      configureService('/link', true, false, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser, $location) {
          $location.path('/some');
          browserTrigger(link, 'click');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/link');
        }
      );
    });


    it('should replace current hash fragment when link begins with "#" history disabled', function() {
      configureService('#link', true, false, true);
      inject(
        initBrowser(),
        initLocation(),
        function($browser, $location) {
          // Initialize browser URL
          $location.path('/some');
          $location.hash('foo');
          browserTrigger(link, 'click');
          expect($location.hash()).toBe('link');
          expectRewriteTo($browser, 'http://host.com/base/index.html#!/some#link');
        }
      );
    });


    // don't run next tests on IE<9, as browserTrigger does not simulate pressed keys
    if (!msie || msie >= 9) {

      it('should not rewrite when clicked with ctrl pressed', function() {
        configureService('/a?b=c', true, true);
        inject(
          initBrowser(),
          initLocation(),
          function($browser) {
            browserTrigger(link, 'click', ['ctrl']);
            expectNoRewrite($browser);
          }
        );
      });


      it('should not rewrite when clicked with meta pressed', function() {
        configureService('/a?b=c', true, true);
        inject(
          initBrowser(),
          initLocation(),
          function($browser) {
            browserTrigger(link, 'click', ['meta']);
            expectNoRewrite($browser);
          }
        );
      });
    }


    it('should not mess up hash urls when clicking on links in hashbang mode', function() {
      var base;
      module(function() {
        return function($browser) {
          window.location.hash = 'someHash';
          base = window.location.href;
          $browser.url(base);
          base = base.split('#')[0];
        };
      });
      inject(function($rootScope, $compile, $browser, $rootElement, $document, $location) {
        // we need to do this otherwise we can't simulate events
        $document.find('body').append($rootElement);

        var element = $compile('<a href="#/view1">v1</a><a href="#/view2">v2</a>')($rootScope);
        $rootElement.append(element);
        var av1 = $rootElement.find('a').eq(0);
        var av2 = $rootElement.find('a').eq(1);


        browserTrigger(av1, 'click');
        expect($browser.url()).toEqual(base + '#/view1');

        browserTrigger(av2, 'click');
        expect($browser.url()).toEqual(base + '#/view2');

        $rootElement.remove();
      });
    });


    it('should not mess up hash urls when clicking on links in hashbang mode with a prefix',
        function() {
      var base;
      module(function($locationProvider) {
        return function($browser) {
          window.location.hash = '!someHash';
          $browser.url(base = window.location.href);
          base = base.split('#')[0];
          $locationProvider.hashPrefix('!');
        };
      });
      inject(function($rootScope, $compile, $browser, $rootElement, $document, $location) {
        // we need to do this otherwise we can't simulate events
        $document.find('body').append($rootElement);

        var element = $compile('<a href="#!/view1">v1</a><a href="#!/view2">v2</a>')($rootScope);
        $rootElement.append(element);
        var av1 = $rootElement.find('a').eq(0);
        var av2 = $rootElement.find('a').eq(1);


        browserTrigger(av1, 'click');
        expect($browser.url()).toEqual(base + '#!/view1');

        browserTrigger(av2, 'click');
        expect($browser.url()).toEqual(base + '#!/view2');
      });
    });


    it('should not intercept clicks outside the current hash prefix', function() {
      var base, clickHandler;
      module(function($provide) {
        $provide.value('$rootElement', {
          on: function(event, handler) {
            expect(event).toEqual('click');
            clickHandler = handler;
          },
          off: noop
        });
        return function($browser) {
          $browser.url(base = 'http://server/');
        };
      });
      inject(function($location) {
        // make IE happy
        jqLite(window.document.body).html('<a href="http://server/test.html">link</a>');

        var event = {
          target: jqLite(window.document.body).find('a')[0],
          preventDefault: jasmine.createSpy('preventDefault')
        };


        clickHandler(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });


    it('should not intercept hash link clicks outside the app base url space', function() {
      var base, clickHandler;
      module(function($provide) {
        $provide.value('$rootElement', {
          on: function(event, handler) {
            expect(event).toEqual('click');
            clickHandler = handler;
          },
          off: angular.noop
        });
        return function($browser) {
          $browser.url(base = 'http://server/');
        };
      });
      inject(function($rootScope, $compile, $browser, $rootElement, $document, $location) {
        // make IE happy
        jqLite(window.document.body).html('<a href="http://server/index.html#test">link</a>');

        var event = {
          target: jqLite(window.document.body).find('a')[0],
          preventDefault: jasmine.createSpy('preventDefault')
        };


        clickHandler(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });


    // regression https://github.com/angular/angular.js/issues/1058
    it('should not throw if element was removed', inject(function($document, $rootElement, $location) {
      // we need to do this otherwise we can't simulate events
      $document.find('body').append($rootElement);

      $rootElement.html('<button></button>');
      var button = $rootElement.find('button');

      button.on('click', function() {
        button.remove();
      });
      browserTrigger(button, 'click');
    }));


    it('should not throw when clicking an SVGAElement link', function() {
      var base;
      module(function($locationProvider) {
        return function($browser) {
          window.location.hash = '!someHash';
          $browser.url(base = window.location.href);
          base = base.split('#')[0];
          $locationProvider.hashPrefix('!');
        };
      });
      inject(function($rootScope, $compile, $browser, $rootElement, $document, $location) {
        // we need to do this otherwise we can't simulate events
        $document.find('body').append($rootElement);
        var template = '<svg><g><a xlink:href="#!/view1"><circle r="50"></circle></a></g></svg>';
        var element = $compile(template)($rootScope);

        $rootElement.append(element);
        var av1 = $rootElement.find('a').eq(0);
        expect(function() {
          browserTrigger(av1, 'click');
        }).not.toThrow();
      });
    });
  });


  describe('location cancellation', function() {
    it('should fire $before/afterLocationChange event', inject(function($location, $browser, $rootScope, $log) {
      expect($browser.url()).toEqual('http://server/');

      $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        $log.info('before', newUrl, oldUrl, $browser.url());
      });
      $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
        $log.info('after', newUrl, oldUrl, $browser.url());
      });

      expect($location.url()).toEqual('');
      $location.url('/somePath');
      expect($location.url()).toEqual('/somePath');
      expect($browser.url()).toEqual('http://server/');
      expect($log.info.logs).toEqual([]);

      $rootScope.$apply();

      expect($log.info.logs.shift()).
          toEqual(['before', 'http://server/#/somePath', 'http://server/', 'http://server/']);
      expect($log.info.logs.shift()).
          toEqual(['after', 'http://server/#/somePath', 'http://server/', 'http://server/#/somePath']);
      expect($location.url()).toEqual('/somePath');
      expect($browser.url()).toEqual('http://server/#/somePath');
    }));


    it('should allow $locationChangeStart event cancellation', inject(function($location, $browser, $rootScope, $log) {
      expect($browser.url()).toEqual('http://server/');
      expect($location.url()).toEqual('');

      $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        $log.info('before', newUrl, oldUrl, $browser.url());
        event.preventDefault();
      });
      $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
        throw new Error('location should have been canceled');
      });

      expect($location.url()).toEqual('');
      $location.url('/somePath');
      expect($location.url()).toEqual('/somePath');
      expect($browser.url()).toEqual('http://server/');
      expect($log.info.logs).toEqual([]);

      $rootScope.$apply();

      expect($log.info.logs.shift()).
          toEqual(['before', 'http://server/#/somePath', 'http://server/', 'http://server/']);
      expect($log.info.logs[1]).toBeUndefined();
      expect($location.url()).toEqual('');
      expect($browser.url()).toEqual('http://server/');
    }));

    it ('should fire $locationChangeSuccess event when change from browser location bar',
      inject(function($log, $location, $browser, $rootScope) {
        $rootScope.$apply(); // clear initial $locationChangeStart

        expect($browser.url()).toEqual('http://server/');
        expect($location.url()).toEqual('');

        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
          $log.info('start', newUrl, oldUrl);
        });
        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
          $log.info('after', newUrl, oldUrl);
        });


        $browser.url('http://server/#/somePath');
        $browser.poll();

        expect($log.info.logs.shift()).
          toEqual(['start', 'http://server/#/somePath', 'http://server/']);
        expect($log.info.logs.shift()).
          toEqual(['after', 'http://server/#/somePath', 'http://server/']);
      })
    );


    it('should listen on click events on href and prevent browser default in hashbang mode', function() {
      module(function() {
        return function($rootElement, $compile, $rootScope) {
          $rootElement.html('<a href="http://server/#/somePath">link</a>');
          $compile($rootElement)($rootScope);
          jqLite(document.body).append($rootElement);
        };
      });

      inject(function($location, $rootScope, $browser, $rootElement) {
        var log = '',
            link = $rootElement.find('a');


        $rootScope.$on('$locationChangeStart', function(event) {
          event.preventDefault();
          log += '$locationChangeStart';
        });
        $rootScope.$on('$locationChangeSuccess', function() {
          throw new Error('after cancellation in hashbang mode');
        });

        browserTrigger(link, 'click');

        expect(log).toEqual('$locationChangeStart');
        expect($browser.url()).toEqual('http://server/');

        dealoc($rootElement);
      });
    });


    it('should listen on click events on href and prevent browser default in html5 mode', function() {
      module(function($locationProvider) {
        $locationProvider.html5Mode(true);
        return function($rootElement, $compile, $rootScope) {
          $rootElement.html('<a href="http://server/somePath">link</a>');
          $compile($rootElement)($rootScope);
          jqLite(document.body).append($rootElement);
        };
      });

      inject(function($location, $rootScope, $browser, $rootElement) {
        var log = '',
            link = $rootElement.find('a'),
            browserUrlBefore = $browser.url();

        $rootScope.$on('$locationChangeStart', function(event) {
          event.preventDefault();
          log += '$locationChangeStart';
        });
        $rootScope.$on('$locationChangeSuccess', function() {
          throw new Error('after cancellation in html5 mode');
        });

        browserTrigger(link, 'click');

        expect(log).toEqual('$locationChangeStart');
        expect($browser.url()).toBe(browserUrlBefore);

        dealoc($rootElement);
      });
    });

    it('should always return the new url value via path() when $locationChangeStart event occurs regardless of cause',
      inject(function($location, $rootScope, $browser, log) {
        var base = $browser.url();

        $rootScope.$on('$locationChangeStart', function() {
          log($location.path());
        });

        // change through $location service
        $rootScope.$apply(function() {
          $location.path('/myNewPath');
        });

        // reset location
        $rootScope.$apply(function() {
          $location.path('');
        });

        // change through $browser
        $browser.url(base + '#/myNewPath');
        $browser.poll();

        expect(log).toEqual(['/myNewPath', '/', '/myNewPath']);
      })
    );
  });

  describe('LocationHtml5Url', function() {
    var location, locationIndex;

    beforeEach(function() {
      location = new LocationHtml5Url('http://server/pre/', 'http://server/pre/path');
      locationIndex = new LocationHtml5Url('http://server/pre/index.html', 'http://server/pre/path');
    });

    it('should rewrite URL', function() {
      expect(location.$$rewrite('http://other')).toEqual(undefined);
      expect(location.$$rewrite('http://server/pre')).toEqual('http://server/pre/');
      expect(location.$$rewrite('http://server/pre/')).toEqual('http://server/pre/');
      expect(location.$$rewrite('http://server/pre/otherPath')).toEqual('http://server/pre/otherPath');
      expect(locationIndex.$$rewrite('http://server/pre')).toEqual('http://server/pre/');
      expect(locationIndex.$$rewrite('http://server/pre/')).toEqual('http://server/pre/');
      expect(locationIndex.$$rewrite('http://server/pre/otherPath')).toEqual('http://server/pre/otherPath');
    });
  });


  describe('LocationHashbangUrl', function() {
    var location;

    it('should rewrite URL', function() {
      /* jshint scripturl: true */
      location = new LocationHashbangUrl('http://server/pre/', '#');

      expect(location.$$rewrite('http://other')).toEqual(undefined);
      expect(location.$$rewrite('http://server/pre/')).toEqual('http://server/pre/');
      expect(location.$$rewrite('http://server/pre/#otherPath')).toEqual('http://server/pre/#otherPath');
      expect(location.$$rewrite('javascript:void(0)')).toEqual(undefined);
    });

    it("should not set hash if one was not originally specified", function() {
      location = new LocationHashbangUrl('http://server/pre/index.html', '#');

      location.$$parse('http://server/pre/index.html');
      expect(location.url()).toBe('');
      expect(location.absUrl()).toBe('http://server/pre/index.html');
    });

    it("should parse hash if one was specified", function() {
      location = new LocationHashbangUrl('http://server/pre/index.html', '#');

      location.$$parse('http://server/pre/index.html#/foo/bar');
      expect(location.url()).toBe('/foo/bar');
      expect(location.absUrl()).toBe('http://server/pre/index.html#/foo/bar');
    });


    it("should prefix hash url with / if one was originally missing", function() {
      location = new LocationHashbangUrl('http://server/pre/index.html', '#');

      location.$$parse('http://server/pre/index.html#not-starting-with-slash');
      expect(location.url()).toBe('/not-starting-with-slash');
      expect(location.absUrl()).toBe('http://server/pre/index.html#/not-starting-with-slash');
    });


    it('should not strip stuff from path just because it looks like Windows drive when it\'s not',
        function() {
      location = new LocationHashbangUrl('http://server/pre/index.html', '#');

      location.$$parse('http://server/pre/index.html#http%3A%2F%2Fexample.com%2F');
      expect(location.url()).toBe('/http://example.com/');
      expect(location.absUrl()).toBe('http://server/pre/index.html#/http://example.com/');
    });
  });


  describe('LocationHashbangInHtml5Url', function() {
    /* global LocationHashbangInHtml5Url: false */
    var location, locationIndex;

    beforeEach(function() {
      location = new LocationHashbangInHtml5Url('http://server/pre/', '#!');
      locationIndex = new LocationHashbangInHtml5Url('http://server/pre/index.html', '#!');
    });

    it('should rewrite URL', function() {
      expect(location.$$rewrite('http://other')).toEqual(undefined);
      expect(location.$$rewrite('http://server/pre')).toEqual('http://server/pre/');
      expect(location.$$rewrite('http://server/pre/')).toEqual('http://server/pre/');
      expect(location.$$rewrite('http://server/pre/otherPath')).toEqual('http://server/pre/#!otherPath');
      expect(locationIndex.$$rewrite('http://server/pre')).toEqual('http://server/pre/');
      expect(locationIndex.$$rewrite('http://server/pre/')).toEqual(undefined);
      expect(locationIndex.$$rewrite('http://server/pre/otherPath')).toEqual('http://server/pre/index.html#!otherPath');
    });
  });
});
