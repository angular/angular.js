'use strict';

describe('a', function() {
  var element, $compile, $rootScope;


  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  afterEach(function(){
    dealoc(element);
  });


  it('should prevent default action to be executed when href is empty', function() {
    var orgLocation = document.location.href,
        preventDefaultCalled = false,
        event;

    element = $compile('<a href="">empty link</a>')($rootScope);

    if (msie < 9) {

      event = document.createEventObject();
      expect(event.returnValue).not.toBeDefined();
      element[0].fireEvent('onclick', event);
      expect(event.returnValue).toEqual(false);

    } else {

      event = document.createEvent('MouseEvent');
      event.initMouseEvent(
        'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

      event.preventDefaultOrg = event.preventDefault;
      event.preventDefault = function() {
        preventDefaultCalled = true;
        if (this.preventDefaultOrg) this.preventDefaultOrg();
      };

      element[0].dispatchEvent(event);

      expect(preventDefaultCalled).toEqual(true);
    }

    expect(document.location.href).toEqual(orgLocation);
  });


  it('should prevent IE for changing text content when setting attribute', function() {
    // see issue #1949
    element = jqLite('<a href="">hello@you</a>');
    $compile(element);
    element.attr('href', 'bye@me');

    expect(element.text()).toBe('hello@you');
  });
});
