'use strict';

describe('$sniffer', function() {

  function sniffer($window, $document) {
    /* global $SnifferProvider: false */
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
    it('should be false by default', function() {
      expect(sniffer({}).csp).toBe(false);
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
        else if(/ie/i.test(ua) || /trident/i.test(ua)) {
          expectedPrefix = 'Ms';
        }
        else if(/opera/i.test(ua)) {
          expectedPrefix = 'O';
        }
        expect($sniffer.vendorPrefix).toBe(expectedPrefix);
      });
    });

    it('should still work for an older version of Webkit', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              WebkitOpacity: '0'
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.vendorPrefix).toBe('webkit');
      });
    });

  });

  describe('animations', function() {
    it('should be either true or false', function() {
      inject(function($sniffer) {
        expect($sniffer.animations).not.toBe(undefined);
      });
    });

    it('should be false when there is no animation style', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {}
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.animations).toBe(false);
      });
    });

    it('should be true with vendor-specific animations', function() {
      module(function($provide) {
        var animationStyle = 'some_animation 2s linear';
        var doc = {
          body : {
            style : {
              WebkitAnimation : animationStyle,
              MozAnimation : animationStyle,
              OAnimation : animationStyle
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.animations).toBe(true);
      });
    });

    it('should be true with w3c-style animations', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              animation : 'some_animation 2s linear'
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.animations).toBe(true);
      });
    });

    it('should be true on android with older body style properties', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              webkitAnimation: ''
            }
          }
        };
        var win = {
          navigator: {
            userAgent: 'android 2'
          }
        };
        $provide.value('$document', jqLite(doc));
        $provide.value('$window', win);
      });
      inject(function($sniffer) {
        expect($sniffer.animations).toBe(true);
      });
    });

    it('should be true when an older version of Webkit is used', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              WebkitOpacity: '0'
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.animations).toBe(false);
      });
    });

  });

  describe('transitions', function() {

    it('should be either true or false', function() {
      inject(function($sniffer) {
        expect($sniffer.transitions).not.toBe(undefined);
      });
    });

    it('should be false when there is no transition style', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {}
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.transitions).toBe(false);
      });
    });

    it('should be true with vendor-specific transitions', function() {
      module(function($provide) {
        var transitionStyle = '1s linear all';
        var doc = {
          body : {
            style : {
              WebkitTransition : transitionStyle,
              MozTransition : transitionStyle,
              OTransition : transitionStyle
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.transitions).toBe(true);
      });
    });

    it('should be true with w3c-style transitions', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              transition : '1s linear all'
            }
          }
        };
        $provide.value('$document', jqLite(doc));
      });
      inject(function($sniffer) {
        expect($sniffer.transitions).toBe(true);
      });
    });

    it('should be true on android with older body style properties', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {
              webkitTransition: ''
            }
          }
        };
        var win = {
          navigator: {
            userAgent: 'android 2'
          }
        };
        $provide.value('$document', jqLite(doc));
        $provide.value('$window', win);
      });
      inject(function($sniffer) {
        expect($sniffer.transitions).toBe(true);
      });
    });

  });


  describe('history', function() {
    it('should be true on Boxee box with an older version of Webkit', function() {
      module(function($provide) {
        var doc = {
          body : {
            style : {}
          }
        };
        var win = {
          history: {
            pushState: noop
          },
          navigator: {
            userAgent: 'boxee (alpha/Darwin 8.7.1 i386 - 0.9.11.5591)'
          }
        };
        $provide.value('$document', jqLite(doc));
        $provide.value('$window', win);
      });
      inject(function($sniffer) {
        expect($sniffer.history).toBe(false);
      });
    });
  });

  it('should provide the android version', function() {
    module(function($provide) {
      var win = {
        navigator: {
          userAgent: 'android 2'
        }
      };
      $provide.value('$document', jqLite({}));
      $provide.value('$window', win);
    });
    inject(function($sniffer) {
      expect($sniffer.android).toBe(2);
    });
  });

  it('should return the internal msie flag', inject(function($sniffer) {
    expect(isNaN($sniffer.msie)).toBe(isNaN(msie));
    if (msie) {
      expect($sniffer.msie).toBe(msie);
    }
  }));

  it('should return document.documentMode as msieDocumentMode', function() {
    var someDocumentMode = 123;
    expect(sniffer({}, {documentMode: someDocumentMode}).msieDocumentMode).toBe(someDocumentMode);
  });
});
