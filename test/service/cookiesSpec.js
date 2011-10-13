'use strict';

describe('$cookies', function() {
  var scope, $browser;

  beforeEach(function() {
    $browser = new MockBrowser();
    $browser.cookieHash['preexisting'] = 'oldCookie';
    scope = angular.scope(angular.service, {$browser: $browser});
    scope.$cookies = scope.$service('$cookies');
  });

  afterEach(function() {
    dealoc(scope);
  });


  it('should provide access to existing cookies via object properties and keep them in sync',
      function() {
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});

    // access internal cookie storage of the browser mock directly to simulate behavior of
    // document.cookie
    $browser.cookieHash['brandNew'] = 'cookie';
    $browser.poll();

    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie'});

    $browser.cookieHash['brandNew'] = 'cookie2';
    $browser.poll();
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie2'});

    delete $browser.cookieHash['brandNew'];
    $browser.poll();
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});
  });


  it('should create or update a cookie when a value is assigned to a property', function() {
    scope.$cookies.oatmealCookie = 'nom nom';
    scope.$digest();

    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    scope.$cookies.oatmealCookie = 'gone';
    scope.$digest();

    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie': 'gone'});
  });


  it('should drop or reset any cookie that was set to a non-string value', function() {
    scope.$cookies.nonString = [1, 2, 3];
    scope.$cookies.nullVal = null;
    scope.$cookies.undefVal = undefined;
    scope.$cookies.preexisting = function() {};
    scope.$digest();
    expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});
  });


  it('should remove a cookie when a $cookies property is deleted', function() {
    scope.$cookies.oatmealCookie = 'nom nom';
    scope.$digest();
    $browser.poll();
    expect($browser.cookies()).
      toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

    delete scope.$cookies.oatmealCookie;
    scope.$digest();

    expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
  });


  it('should drop or reset cookies that browser refused to store', function() {
    var i, longVal;

    for (i=0; i<5000; i++) {
      longVal += '*';
    }

    //drop if no previous value
    scope.$cookies.longCookie = longVal;
    scope.$digest();
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});


    //reset if previous value existed
    scope.$cookies.longCookie = 'shortVal';
    scope.$digest();
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
    scope.$cookies.longCookie = longVal;
    scope.$digest();
    expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
  });
});
