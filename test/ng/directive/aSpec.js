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

  // don't run next tests on IE<9, as SVG isn't supported
  if (!(msie < 9)) {
    it('should prevent default action to be executed when xlink namespaced href is empty', function() {
      var orgLocation = document.location.href,
          preventDefaultCalled = false,
          event;

      var svgNs = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNs, 'svg');

      var a = document.createElementNS(svgNs, 'a');
      var xlinkNs = 'http://www.w3.org/1999/xlink';
      a.setAttributeNS(xlinkNs,
                       // Note prefix specified here. It's optional but when
                       // added breaks before this fix.
                       'xlink:href',
                       '');
      a.textContent = 'empty link';
      svg.appendChild(a);

      element = $compile(svg)($rootScope);

      event = document.createEvent('MouseEvent');
      event.initMouseEvent(
        'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

      event.preventDefaultOrg = event.preventDefault;
      event.preventDefault = function() {
        preventDefaultCalled = true;
        if (this.preventDefaultOrg) this.preventDefaultOrg();
      };

      element.find('a')[0].dispatchEvent(event);

      expect(preventDefaultCalled).toEqual(true);

      expect(document.location.href).toEqual(orgLocation);
    });

    it('should not prevent default action to be executed when xlink namespaced href is not empty', function() {
      var nonEmptyHash = '#nonempty',
          preventDefaultCalled = false,
          event;

      var svgNs = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNs, 'svg');

      var a = document.createElementNS(svgNs, 'a');
      var xlinkNs = 'http://www.w3.org/1999/xlink';
      a.setAttributeNS(xlinkNs,
                       // Note prefix specified here. It's optional but when
                       // added breaks before this fix.
                       'xlink:href',
                       nonEmptyHash);
      a.textContent = 'non-empty link';
      svg.appendChild(a);

      element = $compile(svg)($rootScope);

      browserTrigger(element.find('a'), 'click');

      // Firefox 23 needs some time to process the events
      var nextTurn = false;
      // let the browser process all events (and potentially reload the page)
      setTimeout(function() { nextTurn = true;}, 100);

      waitsFor(function() { return nextTurn; });

      runs(function () {
        expect(document.location.hash).toEqual(nonEmptyHash);
      });
    });
  }

  it('should prevent IE for changing text content when setting attribute', function() {
    // see issue #1949
    element = jqLite('<a href="">hello@you</a>');
    $compile(element);
    element.attr('href', 'bye@me');

    expect(element.text()).toBe('hello@you');
  });
});
