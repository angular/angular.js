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

  it('should serialize objects to json', inject(function($cookies, $$cookieReader) {
    $cookies.putObject('objectCookie', {id: 123, name: 'blah'});
    expect($$cookieReader()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
  }));


  it('should deserialize json to object', inject(function($cookies, $$cookieWriter) {
    $$cookieWriter('objectCookie', '{"id":123,"name":"blah"}');
    expect($cookies.getObject('objectCookie')).toEqual({id: 123, name: 'blah'});
  }));


  it('should delete objects from the store when remove is called', inject(function($cookies, $$cookieReader) {
    $cookies.putObject('gonner', { "I'll":"Be Back"});
    expect($$cookieReader()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});

    $cookies.remove('gonner');
    expect($$cookieReader()).toEqual({});
  }));
  it('should handle empty string value cookies', inject(function($cookies, $$cookieReader) {
    $cookies.putObject("emptyCookie",'');
    expect($$cookieReader()).
        toEqual({ 'emptyCookie': '""' });
    expect($cookies.getObject("emptyCookie")).toEqual('');

    mockedCookies['blankCookie'] = '';
    expect($cookies.getObject("blankCookie")).toEqual('');
  }));

  it('should pass options on put', inject(function($cookies, $$cookieWriter) {
    $cookies.putObject('name', 'value', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', '"value"', {path: '/a/b'});
  }));

  it('should pass options on remove', inject(function($cookies, $$cookieWriter) {
    $cookies.remove('name', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', undefined, {path: '/a/b'});
  }));

  it('should put cookie value without serializing', inject(function($cookies, $$cookieReader) {
    $cookies.put('name', 'value');
    expect($$cookieReader()).toEqual({'name': 'value'});
  }));

  it('should get cookie value without deserializing', inject(function($cookies, $$cookieWriter) {
    $$cookieWriter('name', 'value');
    expect($cookies.get('name')).toEqual('value');
  }));

  it('should get all the cookies', inject(function($cookies, $$cookieWriter) {
    $$cookieWriter('name', 'value');
    expect($cookies.getAll()).toEqual({name: 'value'});
  }));
});
