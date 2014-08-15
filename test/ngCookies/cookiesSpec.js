'use strict';

describe('$cookies', function() {
  beforeEach(module('ngCookies', function($provide) {
    $provide.factory('$browser', function(){
      return angular.extend(new angular.mock.$Browser(), {cookieHash: {preexisting:'oldCookie'}});
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


  it('should convert non-string values to string',
      inject(function($cookies, $browser, $rootScope) {
    $cookies.nonString = [1, 2, 3];
    $cookies.nullVal = null;
    $cookies.undefVal = undefined;
    var preexisting = $cookies.preexisting = function() {};
    $rootScope.$digest();
    expect($browser.cookies()).toEqual({
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


describe('$cookieStore', function() {

  beforeEach(module('ngCookies'));

  it('should serialize objects to json', inject(function($cookieStore, $browser, $rootScope) {
    $cookieStore.put('objectCookie', {id: 123, name: 'blah'});
    $rootScope.$digest();
    expect($browser.cookies()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
  }));


  it('should deserialize json to object', inject(function($cookieStore, $browser) {
    $browser.cookies('objectCookie', '{"id":123,"name":"blah"}');
    $browser.poll();
    expect($cookieStore.get('objectCookie')).toEqual({id: 123, name: 'blah'});
  }));


  it('should delete objects from the store when remove is called', inject(function($cookieStore, $browser, $rootScope) {
    $cookieStore.put('gonner', { "I'll":"Be Back"});
    $rootScope.$digest(); //force eval in test
    $browser.poll();
    expect($browser.cookies()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});

    $cookieStore.remove('gonner');
    $rootScope.$digest();
    expect($browser.cookies()).toEqual({});
  }));
  it('should handle empty string value cookies', inject(function ($cookieStore, $browser, $rootScope) {
    $cookieStore.put("emptyCookie",'');
    $rootScope.$digest();
    expect($browser.cookies()).
        toEqual({ 'emptyCookie': '""' });
    expect($cookieStore.get("emptyCookie")).toEqual('');

    $browser.cookieHash['blankCookie'] = '';
    $browser.poll();
    expect($cookieStore.get("blankCookie")).toEqual('');
  }));
});
