'use strict';

describe('$cookies', function() {
  var mockedCookies;

  beforeEach(function() {
    var lastCookies = {};
    mockedCookies = {preexisting:'oldCookie'};
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


  it('should provide access to existing cookies via object properties and keep them in sync',
      inject(function($cookies, $browser, $rootScope) {
    expect($cookies).toEqual({'preexisting': 'oldCookie'});

    // access internal cookie storage of the browser mock directly to simulate behavior of
    // document.cookie
    mockedCookies['brandNew'] = 'cookie';
    $browser.poll();

    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie'});

    mockedCookies['brandNew'] = 'cookie2';
    $browser.poll();
    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie2'});

    delete mockedCookies['brandNew'];
    $browser.poll();
    expect($cookies).toEqual({'preexisting': 'oldCookie'});
  }));


  it('should create or update a cookie when a value is assigned to a property',
      inject(function($cookies, $$cookieReader, $rootScope) {
    $cookies.oatmealCookie = 'nom nom';
    $rootScope.$digest();

    expect($$cookieReader()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    $cookies.oatmealCookie = 'gone';
    $rootScope.$digest();

    expect($$cookieReader()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie': 'gone'});
  }));


  it('should convert non-string values to string',
      inject(function($cookies, $$cookieReader, $rootScope) {
    $cookies.nonString = [1, 2, 3];
    $cookies.nullVal = null;
    $cookies.undefVal = undefined;
    var preexisting = $cookies.preexisting = function() {};
    $rootScope.$digest();
    expect($$cookieReader()).toEqual({
      'preexisting': '' + preexisting,
      'nonString': '1,2,3',
      'nullVal': 'null',
      'undefVal': 'undefined'
    });
    expect($cookies).toEqual({
      'preexisting': '' + preexisting,
      'nonString': '1,2,3',
      'nullVal': 'null',
      'undefVal': 'undefined'
    });
  }));


  it('should remove a cookie when a $cookies property is deleted',
      inject(function($cookies, $browser, $rootScope, $$cookieReader) {
    $cookies.oatmealCookie = 'nom nom';
    $rootScope.$digest();
    $browser.poll();
    expect($$cookieReader()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    delete $cookies.oatmealCookie;
    $rootScope.$digest();

    expect($$cookieReader()).toEqual({'preexisting': 'oldCookie'});
  }));
});


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
