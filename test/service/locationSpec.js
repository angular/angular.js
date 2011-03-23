'use strict';

describe('$location', function() {
  var scope, $location, $browser;

  beforeEach(function(){
    scope = angular.scope();
    $location = scope.$service('$location');
    $browser = scope.$service('$browser');
  });


  afterEach(function(){
    dealoc(scope);
  });


  it("should update location object immediately when update is called", function() {
    var href = 'http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=';
    $location.update(href);
    expect($location.href).toEqual(href);
    expect($location.protocol).toEqual("http");
    expect($location.host).toEqual("host");
    expect($location.port).toEqual("123");
    expect($location.path).toEqual("/p/a/t/h.html");
    expect($location.search).toEqual({query:'value'});
    expect($location.hash).toEqual('path?key=value&flag&key2=');
    expect($location.hashPath).toEqual('path');
    expect($location.hashSearch).toEqual({key: 'value', flag: true, key2: ''});
  });


  it('should update location when browser url changed', function() {
    var origUrl = $location.href;
    expect(origUrl).toEqual($browser.getUrl());

    var newUrl = 'http://somenew/url#foo';
    $browser.setUrl(newUrl);
    $browser.poll();
    expect($location.href).toEqual(newUrl);
  });


  it('should update browser at the end of $eval', function() {
    var origBrowserUrl = $browser.getUrl();
    $location.update('http://www.angularjs.org/');
    $location.update({path: '/a/b'});
    expect($location.href).toEqual('http://www.angularjs.org/a/b');
    expect($browser.getUrl()).toEqual('http://www.angularjs.org/a/b');
    $location.path = '/c';
    scope.$digest();
    expect($browser.getUrl()).toEqual('http://www.angularjs.org/c');
  });


  it('should update hashPath and hashSearch on hash update', function(){
    $location.update('http://server/#path?a=b');
    expect($location.hashPath).toEqual('path');
    expect($location.hashSearch).toEqual({a:'b'});

    $location.update({hash: ''});
    expect($location.hashPath).toEqual('');
    expect($location.hashSearch).toEqual({});
  });


  it('should update hash on hashPath or hashSearch update', function() {
    $location.update('http://server/#path?a=b');
    scope.$digest();
    $location.update({hashPath: '', hashSearch: {}});

    expect($location.hash).toEqual('');
  });


  it('should update hashPath and hashSearch on $location.hash change upon eval', function(){
    $location.update('http://server/#path?a=b');
    scope.$digest();

    $location.hash = '';
    scope.$digest();

    expect($location.href).toEqual('http://server/');
    expect($location.hashPath).toEqual('');
    expect($location.hashSearch).toEqual({});
  });


  it('should update hash on $location.hashPath or $location.hashSearch change upon eval',
      function() {
    $location.update('http://server/#path?a=b');
    expect($location.href).toEqual('http://server/#path?a=b');
    expect($location.hashPath).toEqual('path');
    expect($location.hashSearch).toEqual({a:'b'});

    $location.hashPath = '';
    $location.hashSearch = {};
    scope.$digest();

    expect($location.href).toEqual('http://server/');
    expect($location.hash).toEqual('');
  });


  it('should sync $location upon eval before watches are fired', function(){
    scope.$location = scope.$service('$location'); //publish to the scope for $watch

    var log = '';
    scope.$watch('$location.hash', function(scope){
      log += scope.$location.hashPath + ';';
    })();
    expect(log).toEqual(';');

    log = '';
    scope.$location.hash = '/abc';
    scope.$digest();
    expect(scope.$location.hash).toEqual('/abc');
    expect(log).toEqual('/abc;');
  });


  describe('sync', function() {

    it('should update hash with escaped hashPath', function() {
      $location.hashPath = 'foo=bar';
      scope.$digest();
      expect($location.hash).toBe('foo%3Dbar');
    });


    it('should give $location.href the highest precedence', function() {
      $location.hashPath = 'hashPath';
      $location.hashSearch = {hash:'search'};
      $location.hash = 'hash';
      $location.port = '333';
      $location.host = 'host';
      $location.href = 'https://hrefhost:23/hrefpath';

      scope.$digest();

      expect($location).toEqualData({href: 'https://hrefhost:23/hrefpath',
                                     protocol: 'https',
                                     host: 'hrefhost',
                                     port: '23',
                                     path: '/hrefpath',
                                     search: {},
                                     hash: '',
                                     hashPath: '',
                                     hashSearch: {}
                                    });
    });


    it('should give $location.hash second highest precedence', function() {
      $location.hashPath = 'hashPath';
      $location.hashSearch = {hash:'search'};
      $location.hash = 'hash';
      $location.port = '333';
      $location.host = 'host';
      $location.path = '/path';

      scope.$digest();

      expect($location).toEqualData({href: 'http://host:333/path#hash',
                                     protocol: 'http',
                                     host: 'host',
                                     port: '333',
                                     path: '/path',
                                     search: {},
                                     hash: 'hash',
                                     hashPath: 'hash',
                                     hashSearch: {}
                                    });
    });
  });


  describe('update()', function() {

    it('should accept hash object and update only given properties', function() {
      $location.update("http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=");
      $location.update({host: 'new', port: 24});

      expect($location.host).toEqual('new');
      expect($location.port).toEqual(24);
      expect($location.protocol).toEqual('http');
      expect($location.href).toEqual("http://new:24/p/a/t/h.html?query=value#path?key=value&flag&key2=");
    });


    it('should remove # if hash is empty', function() {
      $location.update('http://www.angularjs.org/index.php#');
      expect($location.href).toEqual('http://www.angularjs.org/index.php');
    });


    it('should clear hash when updating to hash-less URL', function() {
      $location.update('http://server');
      expect($location.href).toBe('http://server');
      expect($location.hash).toBe('');
    });
  });


  describe('updateHash()', function() {

    it('should accept single string argument to update path', function() {
      $location.updateHash('path');
      expect($location.hash).toEqual('path');
      expect($location.hashPath).toEqual('path');
    });


    it('should reset hashSearch when updating with a single string', function() {
      $location.updateHash({foo:'bar'}); //set some initial state for hashSearch

      $location.updateHash('path');
      expect($location.hashPath).toEqual('path');
      expect($location.hashSearch).toEqual({});
    });


    it('should accept single object argument to update search', function() {
      $location.updateHash({a: 'b'});
      expect($location.hash).toEqual('?a=b');
      expect($location.hashSearch).toEqual({a: 'b'});
    });


    it('should accept path string and search object arguments to update both', function() {
      $location.updateHash('path', {a: 'b'});
      expect($location.hash).toEqual('path?a=b');
      expect($location.hashSearch).toEqual({a: 'b'});
      expect($location.hashPath).toEqual('path');
    });


    it('should update href and hash when updating to empty string', function() {
      $location.updateHash('');
      expect($location.href).toBe('http://server');
      expect($location.hash).toBe('');

      scope.$digest();

      expect($location.href).toBe('http://server');
      expect($location.hash).toBe('');
    });
  });


  describe('URL_MATCH', function() {

    it('should parse basic url', function() {
      var match = URL_MATCH.exec('http://www.angularjs.org/path?search#hash?x=x');

      expect(match[1]).toEqual('http');
      expect(match[3]).toEqual('www.angularjs.org');
      expect(match[6]).toEqual('/path');
      expect(match[8]).toEqual('search');
      expect(match[10]).toEqual('hash?x=x');
    });


    it('should parse file://', function(){
      var match = URL_MATCH.exec('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');

      expect(match[1]).toEqual('file');
      expect(match[3]).toEqual('');
      expect(match[5]).toBeFalsy();
      expect(match[6]).toEqual('/Users/Shared/misko/work/angular.js/scenario/widgets.html');
      expect(match[8]).toBeFalsy();
    });


    it('should parse url with "-" in host', function(){
      var match = URL_MATCH.exec('http://a-b1.c-d.09/path');

      expect(match[1]).toEqual('http');
      expect(match[3]).toEqual('a-b1.c-d.09');
      expect(match[5]).toBeFalsy();
      expect(match[6]).toEqual('/path');
      expect(match[8]).toBeFalsy();
    });


    it('should parse host without "/" at the end', function() {
      var match = URL_MATCH.exec('http://host.org');
      expect(match[3]).toEqual('host.org');

      match = URL_MATCH.exec('http://host.org#');
      expect(match[3]).toEqual('host.org');

      match = URL_MATCH.exec('http://host.org?');
      expect(match[3]).toEqual('host.org');
    });


    it('should match with just "/" path', function() {
      var match = URL_MATCH.exec('http://server/#?book=moby');

      expect(match[10]).toEqual('?book=moby');
    });
  });
});
