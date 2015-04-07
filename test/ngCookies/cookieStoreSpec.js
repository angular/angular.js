'use strict';

describe('$cookieStore', function() {

  beforeEach(module('ngCookies', {
    $cookies: jasmine.createSpyObj('$cookies', ['getObject', 'putObject', 'remove'])
  }));


  it('should get cookie', inject(function($cookieStore, $cookies) {
    $cookies.getObject.andReturn('value');
    expect($cookieStore.get('name')).toBe('value');
    expect($cookies.getObject).toHaveBeenCalledWith('name');
  }));


  it('should put cookie', inject(function($cookieStore, $cookies) {
    $cookieStore.put('name', 'value');
    expect($cookies.putObject).toHaveBeenCalledWith('name', 'value');
  }));


  it('should remove cookie', inject(function($cookieStore, $cookies) {
    $cookieStore.remove('name');
    expect($cookies.remove).toHaveBeenCalledWith('name');
  }));
 });
