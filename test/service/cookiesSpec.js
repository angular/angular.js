'use strict';

describe('$cookies', function() {
  beforeEach(inject(function($provide) {
    $provide.factory('$browser', function(){
      return angular.extend(new angular.module.NG_MOCK.$Browser(), {cookieHash: {preexisting:'oldCookie'}});
    });
  }));

  
  it('should provide access to existing cookies via object properties and keep them in sync',
      inject(function($cookies, $browser, $rootScope) {
    expect($cookies).toEqual({'preexisting': 'oldCookie'});

    // access internal cookie storage of the browser mock directly to simulate behavior of
    // document.cookie
    $browser.cookieHash['brandNew'] = 'cookie';
    $browser.poll();

    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie'});

    $browser.cookieHash['brandNew'] = 'cookie2';
    $browser.poll();
    expect($cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie2'});

    delete $browser.cookieHash['brandNew'];
    $browser.poll();
    expect($cookies).toEqual({'preexisting': 'oldCookie'});
  }));


  it('should create or update a cookie when a value is assigned to a property',
      inject(function($cookies, $browser, $rootScope) {
    $cookies.oatmealCookie = 'nom nom';
    $rootScope.$digest();

    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    $cookies.oatmealCookie = 'gone';
    $rootScope.$digest();

    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie': 'gone'});
  }));


  it('should drop or reset any cookie that was set to a non-string value',
      inject(function($cookies, $browser, $rootScope) {
    $cookies.nonString = [1, 2, 3];
    $cookies.nullVal = null;
    $cookies.undefVal = undefined;
    $cookies.preexisting = function() {};
    $rootScope.$digest();
    expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
    expect($cookies).toEqual({'preexisting': 'oldCookie'});
  }));


  it('should remove a cookie when a $cookies property is deleted',
      inject(function($cookies, $browser, $rootScope) {
    $cookies.oatmealCookie = 'nom nom';
    $rootScope.$digest();
    $browser.poll();
    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    delete $cookies.oatmealCookie;
    $rootScope.$digest();

    expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
  }));


  it('should drop or reset cookies that browser refused to store',
      inject(function($cookies, $browser, $rootScope) {
    var i, longVal;

    for (i=0; i<5000; i++) {
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
