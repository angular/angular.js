'use strict';

describe('$sniffer', function() {
  function sniffer($window, $document) {
    /* global $SnifferProvider: false */
    $window.navigator = $window.navigator || {};
    $document = jqLite($document || {});
    if (!$document[0].body) {
      $document[0].body = window.document.body;
    }
    return new $SnifferProvider().$get[2]($window, $document);
  }


  describe('history', function() {
    it('should be true if history.pushState defined', function() {
      var mockWindow = {
        history: {
          pushState: noop,
          replaceState: noop
        }
      };

      expect(sniffer(mockWindow).history).toBe(true);
    });


    it('should be false if history or pushState not defined', function() {
      expect(sniffer({}).history).toBe(false);
      expect(sniffer({history: {}}).history).toBe(false);
    });


    it('should be false on Boxee box with an older version of Webkit', function() {
      var mockWindow = {
        history: {
          pushState: noop
        },
        navigator: {
          userAgent: 'boxee (alpha/Darwin 8.7.1 i386 - 0.9.11.5591)'
        }
      };

      expect(sniffer(mockWindow).history).toBe(false);
    });


    it('should be false on Chrome Packaged Apps', function() {
      // Chrome Packaged Apps are not allowed to access `window.history.pushState`.
      // In Chrome, `window.app` might be available in "normal" webpages, but `window.app.runtime`
      // only exists in the context of a packaged app.

      expect(sniffer(createMockWindow()).history).toBe(true);
      expect(sniffer(createMockWindow(true)).history).toBe(true);
      expect(sniffer(createMockWindow(true, true)).history).toBe(false);

      function createMockWindow(isChrome, isPackagedApp) {
        var mockWindow = {
          history: {
            pushState: noop
          }
        };

        if (isChrome) {
          var chromeAppObj = isPackagedApp ? {runtime: {}} : {};
          mockWindow.chrome = {app: chromeAppObj};
        }

        return mockWindow;
      }
    });


    it('should not try to access `history.pushState` in Chrome Packaged Apps', function() {
      var pushStateAccessCount = 0;

      var mockHistory = Object.create(Object.prototype, {
        pushState: {get: function() { pushStateAccessCount++; return noop; }}
      });
      var mockWindow = {
        chrome: {
          app: {
            runtime: {}
          }
        },
        history: mockHistory
      };

      sniffer(mockWindow);

      expect(pushStateAccessCount).toBe(0);
    });
  });


  describe('hasEvent', function() {
    var mockDocument, mockDivElement, $sniffer;

    beforeEach(function() {
      var mockCreateElementFn = function(elm) { if (elm === 'div') return mockDivElement; };
      var createElementSpy = jasmine.createSpy('createElement').and.callFake(mockCreateElementFn);

      mockDocument = {createElement: createElementSpy};
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
      // IE10+ implementation is fubared when mixed with placeholders
      mockDivElement = {oninput: noop};

      expect($sniffer.hasEvent('input')).toBe(!(msie && msie <= 11));
    });
  });


  describe('csp', function() {
    it('should have all rules set to false by default', function() {
      var csp = sniffer({}).csp;
      forEach(Object.keys(csp), function(key) {
        expect(csp[key]).toEqual(false);
      });
    });
  });


  describe('vendorPrefix', function() {
    it('should return the correct vendor prefix based on the browser', function() {
      inject(function($sniffer, $window) {
        var expectedPrefix;
        var ua = $window.navigator.userAgent.toLowerCase();
        if (/edge/i.test(ua)) {
          expectedPrefix = 'Ms';
        } else if (/chrome/i.test(ua) || /safari/i.test(ua) || /webkit/i.test(ua)) {
          expectedPrefix = 'Webkit';
        } else if (/firefox/i.test(ua)) {
          expectedPrefix = 'Moz';
        } else if (/ie/i.test(ua) || /trident/i.test(ua)) {
          expectedPrefix = 'Ms';
        }
        expect($sniffer.vendorPrefix).toBe(expectedPrefix);
      });
    });


    it('should still work for an older version of Webkit', function() {
      var mockDocument = {
        body: {
          style: {
            WebkitOpacity: '0'
          }
        }
      };

      expect(sniffer({}, mockDocument).vendorPrefix).toBe('webkit');
    });
  });


  describe('animations', function() {
    it('should be either true or false', inject(function($sniffer) {
      expect($sniffer.animations).toBeDefined();
    }));


    it('should be false when there is no animation style', function() {
      var mockDocument = {
        body: {
          style: {}
        }
      };

      expect(sniffer({}, mockDocument).animations).toBe(false);
    });


    it('should be true with vendor-specific animations', function() {
      var animationStyle = 'some_animation 2s linear';
      var mockDocument = {
        body: {
          style: {
            WebkitAnimation: animationStyle,
            MozAnimation: animationStyle
          }
        }
      };

      expect(sniffer({}, mockDocument).animations).toBe(true);
    });


    it('should be true with w3c-style animations', function() {
      var mockDocument = {
        body: {
          style: {
            animation: 'some_animation 2s linear'
          }
        }
      };

      expect(sniffer({}, mockDocument).animations).toBe(true);
    });


    it('should be true on android with older body style properties', function() {
      var mockWindow = {
        navigator: {
          userAgent: 'android 2'
        }
      };
      var mockDocument = {
        body: {
          style: {
            webkitAnimation: ''
          }
        }
      };

      expect(sniffer(mockWindow, mockDocument).animations).toBe(true);
    });


    it('should be true when an older version of Webkit is used', function() {
      var mockDocument = {
        body: {
          style: {
            WebkitOpacity: '0'
          }
        }
      };

      expect(sniffer({}, mockDocument).animations).toBe(false);
    });
  });


  describe('transitions', function() {
    it('should be either true or false', inject(function($sniffer) {
      expect($sniffer.transitions).toBeOneOf(true, false);
    }));


    it('should be false when there is no transition style', function() {
      var mockDocument = {
        body: {
          style: {}
        }
      };

      expect(sniffer({}, mockDocument).transitions).toBe(false);
    });


    it('should be true with vendor-specific transitions', function() {
      var transitionStyle = '1s linear all';
      var mockDocument = {
        body: {
          style: {
            WebkitTransition: transitionStyle,
            MozTransition: transitionStyle
          }
        }
      };

      expect(sniffer({}, mockDocument).transitions).toBe(true);
    });


    it('should be true with w3c-style transitions', function() {
      var mockDocument = {
        body: {
          style: {
            transition: '1s linear all'
          }
        }
      };

      expect(sniffer({}, mockDocument).transitions).toBe(true);
    });


    it('should be true on android with older body style properties', function() {
      var mockWindow = {
        navigator: {
          userAgent: 'android 2'
        }
      };
      var mockDocument = {
        body: {
          style: {
            webkitTransition: ''
          }
        }
      };

      expect(sniffer(mockWindow, mockDocument).transitions).toBe(true);
    });
  });


  describe('android', function() {
    it('should provide the android version', function() {
      var mockWindow = {
        navigator: {
          userAgent: 'android 2'
        }
      };

      expect(sniffer(mockWindow).android).toBe(2);
    });
  });
});
