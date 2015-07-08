'use strict';

describe('$cookies', function() {
  var mockedCookies;

  beforeEach(function() {
    mockedCookies = {};
    module('ngCookies', {
      $$cookieWriter: jasmine.createSpy('$$cookieWriter').andCallFake(function(name, value) {
        mockedCookies[name] = value;
      }),
      $$cookieReader: function() {
        return mockedCookies;
      }
    });
  });


  it('should serialize objects to json', inject(function($cookies) {
    $cookies.putObject('objectCookie', {id: 123, name: 'blah'});
    expect($cookies.get('objectCookie')).toEqual('{"id":123,"name":"blah"}');
  }));


  it('should deserialize json to object', inject(function($cookies) {
    $cookies.put('objectCookie', '{"id":123,"name":"blah"}');
    expect($cookies.getObject('objectCookie')).toEqual({id: 123, name: 'blah'});
  }));


  it('should delete objects from the store when remove is called', inject(function($cookies) {
    $cookies.putObject('gonner', { "I'll":"Be Back"});
    expect($cookies.get('gonner')).toEqual('{"I\'ll":"Be Back"}');
    $cookies.remove('gonner');
    expect($cookies.get('gonner')).toEqual(undefined);
  }));


  it('should handle empty string value cookies', inject(function($cookies) {
    $cookies.putObject("emptyCookie",'');
    expect($cookies.get('emptyCookie')).toEqual('""');
    expect($cookies.getObject("emptyCookie")).toEqual('');
    mockedCookies['blankCookie'] = '';
    expect($cookies.getObject("blankCookie")).toEqual('');
  }));


  it('should put cookie value without serializing', inject(function($cookies) {
    $cookies.put('name', 'value');
    $cookies.put('name2', '"value2"');
    expect($cookies.get('name')).toEqual('value');
    expect($cookies.getObject('name2')).toEqual('value2');
  }));


  it('should get cookie value without deserializing', inject(function($cookies) {
    $cookies.put('name', 'value');
    $cookies.putObject('name2', 'value2');
    expect($cookies.get('name')).toEqual('value');
    expect($cookies.get('name2')).toEqual('"value2"');
  }));

  it('should get all the cookies', inject(function($cookies) {
    $cookies.put('name', 'value');
    $cookies.putObject('name2', 'value2');
    expect($cookies.getAll()).toEqual({name: 'value', name2: '"value2"'});
  }));


  it('should pass options on put', inject(function($cookies, $$cookieWriter) {
    $cookies.put('name', 'value', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', 'value', {path: '/a/b'});
  }));


  it('should pass options on putObject', inject(function($cookies, $$cookieWriter) {
    $cookies.putObject('name', 'value', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', '"value"', {path: '/a/b'});
  }));


  it('should pass options on remove', inject(function($cookies, $$cookieWriter) {
    $cookies.remove('name', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', undefined, {path: '/a/b'});
  }));


  it('should pass default options on put', function() {
    module(function($cookiesProvider) {
      $cookiesProvider.defaults.secure = true;
    });
    inject(function($cookies, $$cookieWriter) {
      $cookies.put('name', 'value', {path: '/a/b'});
      expect($$cookieWriter).toHaveBeenCalledWith('name', 'value', {path: '/a/b', secure: true});
    });
  });


  it('should pass default options on putObject', function() {
    module(function($cookiesProvider) {
      $cookiesProvider.defaults.secure = true;
    });
    inject(function($cookies, $$cookieWriter) {
      $cookies.putObject('name', 'value', {path: '/a/b'});
      expect($$cookieWriter).toHaveBeenCalledWith('name', '"value"', {path: '/a/b', secure: true});
    });
  });


  it('should pass default options on remove', function() {
    module(function($cookiesProvider) {
      $cookiesProvider.defaults.secure = true;
    });
    inject(function($cookies, $$cookieWriter) {
      $cookies.remove('name', {path: '/a/b'});
      expect($$cookieWriter).toHaveBeenCalledWith('name', undefined, {path: '/a/b', secure: true});
    });
  });


  it('should let passed options override default options', function() {
    module(function($cookiesProvider) {
      $cookiesProvider.defaults.secure = true;
    });
    inject(function($cookies, $$cookieWriter) {
      $cookies.put('name', 'value', {secure: false});
      expect($$cookieWriter).toHaveBeenCalledWith('name', 'value', {secure: false});
    });
  });


  it('should pass default options if no options are passed', function() {
    module(function($cookiesProvider) {
      $cookiesProvider.defaults.secure = true;
    });
    inject(function($cookies, $$cookieWriter) {
      $cookies.put('name', 'value');
      expect($$cookieWriter).toHaveBeenCalledWith('name', 'value', {secure: true});
    });
  });

 });
