'use strict';

describe('$cookieStore', function() {


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
});
