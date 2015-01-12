'use strict';

describe('$cookies', function() {
  beforeEach(module('ngCookies', function($provide) {
    $provide.decorator('$$cookieReader', function($delegate) {
      $delegate.cookieHash = {preexisting:'oldCookie'};
      return $delegate;
    });
    $provide.provider('$$cookieWriter', angular.mock.$$CookieWriterProvider);
  }));


  it('should provide access to existing cookies via object properties and keep them in sync',
      inject(function($cookies, $browser, $rootScope, $$cookieReader) {
    expect($cookies).toEqual({'preexisting': 'oldCookie'});

    // access internal cookie storage of the browser mock directly to simulate behavior of
    // document.cookie
    $$cookieReader.cookieHash['brandNew'] = 'cookie';
    $browser.poll();

    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie'});

    $$cookieReader.cookieHash['brandNew'] = 'cookie2';
    $browser.poll();
    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie2'});

    delete $$cookieReader.cookieHash['brandNew'];
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


  it('should drop or reset cookies that browser refused to store',
      inject(function($cookies, $browser, $rootScope) {
    var i, longVal;

    for (i = 0; i < 5000; i++) {
      longVal += '*';
    }

    //drop if no previous value
    $cookies.longCookie = longVal;
    $rootScope.$digest();
    expect($cookies).toEqual({'preexisting': 'oldCookie'});


    //reset if previous value existed
    $cookies.longCookie = 'shortVal';
    $rootScope.$digest();
    expect($cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
    $cookies.longCookie = longVal;
    $rootScope.$digest();
    expect($cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
  }));
});
