describe('$cookieStore', function() {
  var scope, $browser, $cookieStore;

  beforeEach(function() {
    scope = angular.scope();
    $cookieStore = scope.$service('$cookieStore');
    $browser = scope.$service('$browser');
  });

  afterEach(function(){
    dealoc(scope);
  });


  it('should serialize objects to json', function() {
    $cookieStore.put('objectCookie', {id: 123, name: 'blah'});
    scope.$eval(); //force eval in test
    expect($browser.cookies()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
  });


  it('should deserialize json to object', function() {
    $browser.cookies('objectCookie', '{"id":123,"name":"blah"}');
    $browser.poll();
    expect($cookieStore.get('objectCookie')).toEqual({id: 123, name: 'blah'});
  });


  it('should delete objects from the store when remove is called', function() {
    $cookieStore.put('gonner', { "I'll":"Be Back"});
    scope.$eval(); //force eval in test
    $browser.poll();
    expect($browser.cookies()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});

    $cookieStore.remove('gonner');
    scope.$eval();
    expect($browser.cookies()).toEqual({});
  });
});
