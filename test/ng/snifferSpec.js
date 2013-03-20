'use strict';

describe('$sniffer', function() {

  function sniffer($window, $document) {
    $window.navigator = {};
    $document = jqLite($document || {});
    if (!$document[0].body) {
      $document[0].body = window.document.body;
    }
    return new $SnifferProvider().$get[2]($window, $document);
  }

  describe('history', function() {
    it('should be true if history.pushState defined', function() {
      expect(sniffer({history: {pushState: noop, replaceState: noop}}).history).toBe(true);
    });

    it('should be false if history or pushState not defined', function() {
      expect(sniffer({history: {}}).history).toBe(false);
      expect(sniffer({}).history).toBe(false);
    });
  });

  describe('hashchange', function() {
    it('should be true if onhashchange property defined', function() {
      expect(sniffer({onhashchange: true}).hashchange).toBe(true);
    });

    it('should be false if onhashchange property not defined', function() {
      expect(sniffer({}).hashchange).toBe(false);
    });

    it('should be false if documentMode is 7 (IE8 comp mode)', function() {
      expect(sniffer({onhashchange: true}, {documentMode: 7}).hashchange).toBe(false);
    });
  });


  describe('hasEvent', function() {
    var mockDocument, mockDivElement, $sniffer;

    beforeEach(function() {
      mockDocument = {createElement: jasmine.createSpy('createElement')};
      mockDocument.createElement.andCallFake(function(elm) {
        if (elm === 'div') return mockDivElement;
      });

      $sniffer = sniffer({}, mockDocument);
    });


    it('should return true if "onchange" is present in a div element', function() {
      mockDivElement = {onchange: noop};

      expect($sniffer.hasEvent('change')).toBe(true);
    });


    it('should return false if "oninput" is not present in a div element', function() {
      mockDivElement = {};

      expect($sniffer.hasEvent('input')).toBe(false);
    });


    it('should only create the element once', function() {
      mockDivElement = {};

      $sniffer.hasEvent('change');
      $sniffer.hasEvent('change');
      $sniffer.hasEvent('change');

      expect(mockDocument.createElement).toHaveBeenCalledOnce();
    });


    it('should claim that IE9 doesn\'t have support for "oninput"', function() {
      // IE9 implementation is fubared, so it's better to pretend that it doesn't have the support
      mockDivElement = {oninput: noop};

      expect($sniffer.hasEvent('input')).toBe((msie == 9) ? false : true);
    });
  });


  describe('csp', function() {
    it('should be false if document.securityPolicy.isActive not available', function() {
      expect(sniffer({}).csp).toBe(false);
    });


    it('should use document.securityPolicy.isActive if available', function() {
      var createDocumentWithCSP = function(csp) {
        return {securityPolicy: {isActive: csp}};
      };

      expect(sniffer({}, createDocumentWithCSP(false)).csp).toBe(false);
      expect(sniffer({}, createDocumentWithCSP(true)).csp).toBe(true);
    });
  });

  describe('vendorPrefix', function() {

    it('should return the correct vendor prefix based on the browser', function() {
      inject(function($sniffer, $window) {
        var expectedPrefix;
        var ua = $window.navigator.userAgent.toLowerCase();
        if(/chrome/i.test(ua) || /safari/i.test(ua) || /webkit/i.test(ua)) {
          expectedPrefix = 'Webkit';
        }
        else if(/firefox/i.test(ua)) {
          expectedPrefix = 'Moz';
        }
        else if(/ie/i.test(ua)) {
          expectedPrefix = 'Ms';
        }
        else if(/opera/i.test(ua)) {
          expectedPrefix = 'O';
        }
        expect($sniffer.vendorPrefix).toBe(expectedPrefix);
      });
    });

  });

  describe('supportsTransitions', function() {

    it('should be either true or false', function() {
      inject(function($sniffer) {
        expect($sniffer.supportsTransitions).not.toBe(undefined);
      });
    });

  });
});
