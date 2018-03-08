'use strict';

describe('ngResource', function() {

  describe('$composeResourceUrl', function() {
    beforeEach(module('ngResource'));

    it('should ignore slashes of undefined parameters', inject(function($composeResourceUrl) {
      var template = '/Path/:a/:b/:c';
      expect($composeResourceUrl(template, {})).toEqual('/Path');
      expect($composeResourceUrl(template, {a: 0})).toEqual('/Path/0');
      expect($composeResourceUrl(template, {a: false})).toEqual('/Path/false');
      expect($composeResourceUrl(template, {a: null})).toEqual('/Path');
      expect($composeResourceUrl(template, {a: undefined})).toEqual('/Path');
      expect($composeResourceUrl(template, {a: ''})).toEqual('/Path');
      expect($composeResourceUrl(template, {a: 1})).toEqual('/Path/1');
      expect($composeResourceUrl(template, {a: 2, b: 3})).toEqual('/Path/2/3');
      expect($composeResourceUrl(template, {a: 4, c: 5})).toEqual('/Path/4/5');
      expect($composeResourceUrl(template, {a: 6, b: 7, c: 8})).toEqual('/Path/6/7/8');
    }));

    it('should not ignore leading slashes of undefined parameters that have non-slash trailing sequence', inject(function($composeResourceUrl) {
      var template = '/Path/:a.foo/:b.bar/:c.baz';
      expect($composeResourceUrl(template, {a: 0})).toEqual('/Path/0.foo/.bar.baz');
      expect($composeResourceUrl(template, {})).toEqual('/Path/.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: false})).toEqual('/Path/false.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: null})).toEqual('/Path/.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: undefined})).toEqual('/Path/.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: ''})).toEqual('/Path/.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: 1})).toEqual('/Path/1.foo/.bar.baz');
      expect($composeResourceUrl(template, {a: 2, b: 3})).toEqual('/Path/2.foo/3.bar.baz');
      expect($composeResourceUrl(template, {a: 4, c: 5})).toEqual('/Path/4.foo/.bar/5.baz');
      expect($composeResourceUrl(template, {a: 6, b: 7, c: 8})).toEqual('/Path/6.foo/7.bar/8.baz');
    }));

    it('should not collapse the url into an empty string', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('/:foo/:bar/', {})).toEqual('/');
      expect($composeResourceUrl('/:foo/:bar', {})).toEqual('/');
      expect($composeResourceUrl(':foo/:bar/', {})).toEqual('/');
    }));

    it('should support escaping colons in url template', inject(function($composeResourceUrl) {
      var template = 'http://localhost\\:8080/Path/:a/\\:stillPath/:b';
      var params = {a: 'foo', b: 'bar'};
      expect($composeResourceUrl(template, params)).toEqual('http://localhost:8080/Path/foo/:stillPath/bar');
    }));

    it('should support an unescaped url', inject(function($composeResourceUrl) {
      var template = 'http://localhost:8080/Path/:a';
      var params = {a: 'foo'};
      expect($composeResourceUrl(template, params)).toEqual('http://localhost:8080/Path/foo');
    }));


    it('should correctly encode url params', inject(function($composeResourceUrl) {
      var template = '/Path/:a';
      expect($composeResourceUrl(template, {a: 'foo#1'})).toEqual('/Path/foo%231');
      expect($composeResourceUrl(template, {a: 'herp$'})).toEqual('/Path/herp$');
      expect($composeResourceUrl(template, {a: 'foo;bar'})).toEqual('/Path/foo;bar');
    }));

    it('should extract extra params as query params', inject(function($composeResourceUrl) {
      var template = '/Path/:a';
      expect($composeResourceUrl(template, {a: 'doh!@foo', bar: 'baz#1'})).toEqual('/Path/doh!@foo?bar=baz%231');
      expect($composeResourceUrl(template, {a: 'foo', bar: 'baz;qux'})).toEqual('/Path/foo?bar=baz;qux');
    }));

    it('should not encode @ in url params', inject(function($composeResourceUrl) {
      //encodeURIComponent is too aggressive and doesn't follow http://www.ietf.org/rfc/rfc3986.txt
      //with regards to the character set (pchar) allowed in path segments
      //so we need this test to make sure that we don't over-encode the params
      var template = '/Path/:a';
      var params = {a: 'doh@fo o', ':bar': '$baz@1', '!do&h': 'g=a h'};
      expect($composeResourceUrl(template, params)).toEqual('/Path/doh@fo%20o?!do%26h=g%3Da+h&:bar=$baz@1');
    }));

    it('should serialize query params that are arrays', inject(function($composeResourceUrl) {
      var template = '/Path/:a';
      var params = {a: 'doh&foo', bar: ['baz1', 'baz2']};
      expect($composeResourceUrl(template, params)).toEqual('/Path/doh&foo?bar=baz1&bar=baz2');
    }));

    it('should not encode string "null" to "+" in url params', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('/Path/:a', {a: 'null'})).toEqual('/Path/null');
    }));


    describe('stripTrailingSlashes', function() {
      it('should implicitly strip trailing slashes from URLs by default', inject(function($composeResourceUrl) {
        expect($composeResourceUrl('http://localhost:8080/Path/:a/', {a: 'foo'})).toEqual('http://localhost:8080/Path/foo');
      }));

      it('should support explicitly stripping trailing slashes from URLs', inject(function($composeResourceUrl) {
        expect($composeResourceUrl('http://localhost:8080/Path/:a/', {a: 'foo'}, true)).toEqual('http://localhost:8080/Path/foo');
      }));

      it('should support explicitly keeping trailing slashes in URLs', inject(function($composeResourceUrl) {
        expect($composeResourceUrl('http://localhost:8080/Path/:a/', {a: 'foo'}, false)).toEqual('http://localhost:8080/Path/foo/');
      }));
    });

    describe('paramSerializer', function() {
      it('should apply the $http paramSerializer by default', function() {
        module(function($httpProvider) {
          // Modify the default serializer to prove we are using it
          $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
        });
        inject(function($composeResourceUrl) {
          var template = 'foo/bar';
          var params = { a: ['1', '2']};
          // Jquery uses a different array strategy.
          // Note this is different from the result in "should serialize query params that are arrays".
          expect($composeResourceUrl(template, params)).toEqual('foo/bar?a%5B%5D=1&a%5B%5D=2');
        });
      });

      it('should use the paramSerializer passed as an option', inject(function($composeResourceUrl, $httpParamSerializerJQLike) {
        var template = 'foo/bar';
        var params = { a: ['1', '2']};
        // Jquery uses a different array strategy.
        // Note this is different from the result in "should serialize query params that are arrays".
        expect($composeResourceUrl(template, params, {paramSerializer: $httpParamSerializerJQLike})).toEqual('foo/bar?a%5B%5D=1&a%5B%5D=2');
      }));
    });

    it('should support IPv6 URLs', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]',        {ed1a: 'foo'}, false)).toEqual('http://[2620:0:861:ed1a::1]');
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]/',       {ed1a: 'foo'}, false)).toEqual('http://[2620:0:861:ed1a::1]/');
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]/:ed1a',  {ed1a: 'foo'}, false)).toEqual('http://[2620:0:861:ed1a::1]/foo');
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]/:ed1a',  {},            false)).toEqual('http://[2620:0:861:ed1a::1]/');
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]/:ed1a/', {ed1a: 'foo'}, false)).toEqual('http://[2620:0:861:ed1a::1]/foo/');
      expect($composeResourceUrl('http://[2620:0:861:ed1a::1]/:ed1a/', {},            false)).toEqual('http://[2620:0:861:ed1a::1]/');
    }));

    it('should support params in the `hostname` part of the URL', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('http://:hostname',            {hostname: 'foo.com'},              false)).toEqual('http://foo.com');
      expect($composeResourceUrl('http://:hostname/',           {hostname: 'foo.com'},              false)).toEqual('http://foo.com/');
      expect($composeResourceUrl('http://:l2Domain.:l1Domain',  {l1Domain: 'com', l2Domain: 'bar'}, false)).toEqual('http://bar.com');
      expect($composeResourceUrl('http://:l2Domain.:l1Domain/', {l1Domain: 'com', l2Domain: 'bar'}, false)).toEqual('http://bar.com/');
      expect($composeResourceUrl('http://127.0.0.:octet',       {octet: 42},                        false)).toEqual('http://127.0.0.42');
      expect($composeResourceUrl('http://127.0.0.:octet/',      {octet: 42},                        false)).toEqual('http://127.0.0.42/');
    }));

    it('should support relative paths', inject(function($composeResourceUrl) {
      expect($composeResourceUrl(':relativePath', { relativePath: 'data.json' })).toEqual('data.json');
    }));

    it('should handle + in param value', inject(function($composeResourceUrl) {
      var template = '/api/myapp/:myresource';
      var params = {myresource: 'pear+apple'};
      expect($composeResourceUrl(template, params)).toEqual('/api/myapp/pear+apple');
    }));

    it('should encode & in query params unless passed through `params` property', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('/Path/:a', {a: 'doh&foo', bar: 'baz&1'})).toEqual('/Path/doh&foo?bar=baz%261');
      expect($composeResourceUrl('/api/myapp/resource?:query', {query: 'foo&bar'})).toEqual('/api/myapp/resource?foo&bar');
      expect($composeResourceUrl('/api/myapp/resource?from=:from', {from: 'bar & blanks'})).toEqual('/api/myapp/resource?from=bar%20%26%20blanks');
    }));

    it('should handle multiple params with same name', inject(function($composeResourceUrl) {
      expect($composeResourceUrl('/:id/:id', {id: 1})).toEqual('/1/1');
    }));

    it('should throw an exception if a param is called "hasOwnProperty"', inject(function($composeResourceUrl) {
      expect(function() {
        $composeResourceUrl('/:hasOwnProperty');
      }).toThrowMinErr('$resource', 'badname', 'hasOwnProperty is not a valid parameter name');
    }));
  });
});
