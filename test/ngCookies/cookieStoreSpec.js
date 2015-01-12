'use strict';

describe('$cookieStore', function() {

  beforeEach(module('ngCookies', function($provide) {
    $provide.provider('$$cookieWriter', angular.mock.$$CookieWriterProvider);
    $provide.decorator('$$cookieWriter', function($delegate) {
      return jasmine.createSpy('$$cookieWriter').andCallFake($delegate);
    });
  }));

  it('should serialize objects to json', inject(function($cookieStore, $$cookieReader) {
    $cookieStore.put('objectCookie', {id: 123, name: 'blah'});
    expect($$cookieReader()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
  }));


  it('should deserialize json to object', inject(function($cookieStore, $$cookieWriter) {
    $$cookieWriter('objectCookie', '{"id":123,"name":"blah"}');
    expect($cookieStore.get('objectCookie')).toEqual({id: 123, name: 'blah'});
  }));


  it('should delete objects from the store when remove is called', inject(function($cookieStore, $$cookieReader) {
    $cookieStore.put('gonner', { "I'll":"Be Back"});
    expect($$cookieReader()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});

    $cookieStore.remove('gonner');
    expect($$cookieReader()).toEqual({});
  }));
  it('should handle empty string value cookies', inject(function($cookieStore, $$cookieReader) {
    $cookieStore.put("emptyCookie",'');
    expect($$cookieReader()).
        toEqual({ 'emptyCookie': '""' });
    expect($cookieStore.get("emptyCookie")).toEqual('');

    $$cookieReader.cookieHash['blankCookie'] = '';
    expect($cookieStore.get("blankCookie")).toEqual('');
  }));

  it('should pass options on put', inject(function($cookieStore, $$cookieWriter) {
    $cookieStore.put('name', 'value', {path: '/a/b'});
    expect($$cookieWriter).toHaveBeenCalledWith('name', '"value"', {path: '/a/b'});
  }));

  it('should put cookie value without serializing', inject(function($cookieStore, $$cookieReader) {
    $cookieStore.putRaw('name', 'value');
    expect($$cookieReader()).toEqual({'name': 'value'});
  }));

  it('should get cookie value without deserializing', inject(function($cookieStore, $$cookieWriter) {
    $$cookieWriter('name', 'value');
    expect($cookieStore.getRaw('name')).toEqual('value');
  }));

  it('should get all the cookies', inject(function($cookieStore, $$cookieWriter) {
    $$cookieWriter('name', 'value');
    expect($cookieStore.getAll()).toEqual({name: 'value'});
  }));
});
