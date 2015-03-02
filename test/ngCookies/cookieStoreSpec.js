'use strict';

describe('$cookieStore', function() {
  var mockedCookies;

  beforeEach(function() {
    var lastCookies = {};
    mockedCookies = {};
    module('ngCookies', {
      $$cookieWriter: function(name, value) {
        mockedCookies[name] = value;
      },
      $$cookieReader: function() {
        if (!angular.equals(lastCookies, mockedCookies)) {
          lastCookies = angular.copy(mockedCookies);
          mockedCookies = angular.copy(mockedCookies);
        }
        return mockedCookies;
      }
    });
  });

  it('should serialize objects to json', inject(function($cookieStore, $$cookieReader, $rootScope) {
    $cookieStore.put('objectCookie', {id: 123, name: 'blah'});
    $rootScope.$digest();
    expect($$cookieReader()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
  }));


  it('should deserialize json to object', inject(function($cookieStore, $browser, $$cookieWriter) {
    $$cookieWriter('objectCookie', '{"id":123,"name":"blah"}');
    $browser.poll();
    expect($cookieStore.get('objectCookie')).toEqual({id: 123, name: 'blah'});
  }));


  it('should delete objects from the store when remove is called', inject(function($cookieStore, $browser, $rootScope, $$cookieReader) {
    $cookieStore.put('gonner', { "I'll":"Be Back"});
    $rootScope.$digest(); //force eval in test
    $browser.poll();
    expect($$cookieReader()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});

    $cookieStore.remove('gonner');
    $rootScope.$digest();
    expect($$cookieReader()).toEqual({});
  }));
  it('should handle empty string value cookies', inject(function($cookieStore, $browser, $rootScope, $$cookieReader) {
    $cookieStore.put("emptyCookie",'');
    $rootScope.$digest();
    expect($$cookieReader()).
        toEqual({ 'emptyCookie': '""' });
    expect($cookieStore.get("emptyCookie")).toEqual('');

    mockedCookies['blankCookie'] = '';
    $browser.poll();
    expect($cookieStore.get("blankCookie")).toEqual('');
  }));
});
