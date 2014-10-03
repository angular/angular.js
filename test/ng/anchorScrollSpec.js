'use strict';

describe('$anchorScroll', function() {

  var elmSpy;
  var docSpies;
  var windowSpies;

  function addElements() {
    var elements = sliceArgs(arguments);

    return function($window) {
      forEach(elements, function(identifier) {
        var match = identifier.match(/(?:(\w*) )?(\w*)=(\w*)/),
            nodeName = match[1] || 'a',
            tmpl = '<' + nodeName + ' ' + match[2] + '="' + match[3] + '">' +
                      match[3] +   // add some content or else Firefox and IE place the element
                                   // in weird ways that break yOffset-testing.
                   '</' + nodeName + '>',
            jqElm = jqLite(tmpl),
            elm = jqElm[0];
            // Inline elements cause Firefox to report an unexpected value for
            // `getBoundingClientRect().top` on some platforms (depending on the default font and
            // line-height). Using inline-block elements prevents this.
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1014738
            elm.style.display = 'inline-block';

        elmSpy[identifier] = spyOn(elm, 'scrollIntoView');
        jqLite($window.document.body).append(jqElm);
      });
    };
  }

  function callAnchorScroll() {
    return function($anchorScroll) {
      $anchorScroll();
    };
  }

  function changeHashAndScroll(hash) {
    return function($location, $anchorScroll) {
      $location.hash(hash);
      $anchorScroll();
    };
  }

  function changeHashTo(hash) {
    return function($anchorScroll, $location, $rootScope) {
      $rootScope.$apply(function() {
        $location.hash(hash);
      });
    };
  }

  function createMockDocument(initialReadyState) {
    var mockedDoc = {};
    docSpies = {};

    initialReadyState = initialReadyState || 'complete';
    var propsToPassThrough = ['body', 'documentElement'];
    var methodsToPassThrough = [
      'getElementById',
      'getElementsByName',
      'addEventListener',
      'removeEventListener'
    ];

    var document_ = document;

    propsToPassThrough.forEach(function(prop) {
      mockedDoc[prop] = document_[prop];
    });
    methodsToPassThrough.forEach(function(method) {
      mockedDoc[method] = document_[method].bind(document_);
      docSpies[method] = spyOn(mockedDoc, method).andCallThrough();
    });

    mockedDoc.readyState = initialReadyState || 'complete';
    mockedDoc.dispatchFakeReadyStateChangeEvent = function() {
      var evt = document_.createEvent('Event');
      evt.initEvent('readystatechange', false, false);
      document_.dispatchEvent(evt);
    };
    mockedDoc.updateReadyState = function(newState) {
      this.readyState = newState;
      this.dispatchFakeReadyStateChangeEvent();
    };

    return mockedDoc;
  }

  function createMockWindow(initialReadyState) {
    return function() {
      module(function($provide) {
        elmSpy = {};
        windowSpies = {};

        $provide.value('$window', {
          scrollTo: (windowSpies.scrollTo = jasmine.createSpy('$window.scrollTo')),
          scrollBy: (windowSpies.scrollBy = jasmine.createSpy('$window.scrollBy')),
          document: createMockDocument(initialReadyState),
          navigator: {},
          pageYOffset: 0,
          getComputedStyle: function(elem) {
            return getComputedStyle(elem);
          }
        });
      });
    };
  }

  function expectNoScrolling() {
    return expectScrollingTo(NaN);
  }

  function expectScrollingTo(identifierCountMap) {
    var map = {};
    if (isString(identifierCountMap)) {
      map[identifierCountMap] = 1;
    } else if (isArray(identifierCountMap)) {
      forEach(identifierCountMap, function(identifier) {
        map[identifier] = 1;
      });
    } else {
      map = identifierCountMap;
    }

    return function($window) {
      forEach(elmSpy, function(spy, id) {
        var count = map[id] || 0;
        expect(spy.callCount).toBe(count);
      });
      expect($window.scrollTo).not.toHaveBeenCalled();
    };
  }

  function expectScrollingToTop($window) {
    forEach(elmSpy, function(spy, id) {
      expect(spy).not.toHaveBeenCalled();
    });

    expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
  }

  function resetAllSpies() {
    function resetSpy(spy) {
      spy.reset();
    }

    return function($window) {
      forEach(elmSpy, resetSpy);
      forEach(docSpies, resetSpy);
      forEach(windowSpies, resetSpy);
    };
  }

  function updateMockReadyState(newState) {
    return function($browser, $window) {
      // It is possible that this operation adds tasks to the asyncQueue (needs flushing)
      $window.document.updateReadyState(newState);
      if ($browser.deferredFns.length) {
        $browser.defer.flush();
      }
    };
  }


  afterEach(inject(function($browser, $document) {
    expect($browser.deferredFns.length).toBe(0);
    dealoc($document);
  }));


  describe('when explicitly called', function() {

    beforeEach(createMockWindow());


    it('should scroll to top of the window if empty hash', inject(
      changeHashAndScroll(''),
      expectScrollingToTop));


    it('should not scroll if hash does not match any element', inject(
      addElements('id=one', 'id=two'),
      changeHashAndScroll('non-existing'),
      expectNoScrolling()));


    it('should scroll to anchor element with name', inject(
      addElements('a name=abc'),
      changeHashAndScroll('abc'),
      expectScrollingTo('a name=abc')));


    it('should not scroll to other than anchor element with name', inject(
      addElements('input name=xxl', 'select name=xxl', 'form name=xxl'),
      changeHashAndScroll('xxl'),
      expectNoScrolling()));


    it('should scroll to anchor even if other element with given name exist', inject(
      addElements('input name=some', 'a name=some'),
      changeHashAndScroll('some'),
      expectScrollingTo('a name=some')));


    it('should scroll to element with id with precedence over name', inject(
      addElements('name=abc', 'id=abc'),
      changeHashAndScroll('abc'),
      expectScrollingTo('id=abc')));


    it('should scroll to top if hash == "top" and no matching element', inject(
      changeHashAndScroll('top'),
      expectScrollingToTop));


    it('should scroll to element with id "top" if present', inject(
      addElements('id=top'),
      changeHashAndScroll('top'),
      expectScrollingTo('id=top')));
  });


  describe('in respect to `document.readyState`', function() {

    beforeEach(createMockWindow('mocked'));


    it('should wait for `document.readyState === "complete"', inject(
      addElements('id=some1'),

      changeHashTo('some1'),
      expectNoScrolling(),

      updateMockReadyState('some-arbitrary-state'),
      expectNoScrolling(),

      updateMockReadyState('complete'),
      expectScrollingTo('id=some1')));


    it('should only register once for execution when `document.readyState === "complete"', inject(
      addElements('id=some1', 'id=some2'),

      changeHashTo('some1'),
      changeHashTo('some2'),
      updateMockReadyState('some-other-arbitrary-state'),
      changeHashTo('some1'),
      changeHashTo('some2'),
      expectNoScrolling(),

      updateMockReadyState('complete'),
      expectScrollingTo('id=some2')));


    it('should properly register and unregister listeners for `readystatechange` event', inject(
      addElements('id=some1', 'id=some2'),

      changeHashTo('some1'),
      changeHashTo('some2'),
      updateMockReadyState('some-other-arbitrary-state'),
      changeHashTo('some1'),
      changeHashTo('some2'),
      updateMockReadyState('complete'),

      function() {
        expect(docSpies.addEventListener.callCount).toBe(1);
        expect(docSpies.addEventListener).
            toHaveBeenCalledWith('readystatechange', jasmine.any(Function));

        expect(docSpies.removeEventListener.callCount).toBe(1);
        expect(docSpies.removeEventListener).
            toHaveBeenCalledWith('readystatechange', jasmine.any(Function));

        var registeredListener = docSpies.addEventListener.calls[0].args[1];
        var unregisteredListener = docSpies.removeEventListener.calls[0].args[1];
        expect(unregisteredListener).toBe(registeredListener);
      }));


    it('should scroll immediately if already `readyState === "complete"`', inject(
      addElements('id=some1'),

      updateMockReadyState('complete'),
      changeHashTo('some1'),

      expectScrollingTo('id=some1'),
      function() {
        expect(docSpies.addEventListener.callCount).toBe(0);
        expect(docSpies.removeEventListener.callCount).toBe(0);
      }));
  });


  describe('watcher', function() {

    function initAnchorScroll() {
      return function($rootScope, $anchorScroll) {
        $rootScope.$digest();
      };
    }

    function initLocation(config) {
      return function($provide, $locationProvider) {
        $provide.value('$sniffer', {history: config.historyApi});
        $locationProvider.html5Mode(config.html5Mode);
      };
    }

    function disableAutoScrolling() {
      return function($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();
      };
    }

    beforeEach(createMockWindow());


    it('should scroll to element when hash change in hashbang mode', function() {
      module(initLocation({html5Mode: false, historyApi: true}));
      inject(
        initAnchorScroll(),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingTo('id=some')
      );
    });


    it('should scroll to element when hash change in html5 mode with no history api', function() {
      module(initLocation({html5Mode: true, historyApi: false}));
      inject(
        initAnchorScroll(),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingTo('id=some')
      );
    });


    it('should not scroll to the top if $anchorScroll is initializing and location hash is empty',
      inject(
        initAnchorScroll(),
        expectNoScrolling())
    );


    it('should not scroll when element does not exist', function() {
      module(initLocation({html5Mode: false, historyApi: false}));
      inject(
        initAnchorScroll(),
        addElements('id=some'),
        changeHashTo('other'),
        expectNoScrolling()
      );
    });


    it('should scroll when html5 mode with history api', function() {
      module(initLocation({html5Mode: true, historyApi: true}));
      inject(
        initAnchorScroll(),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingTo('id=some')
      );
    });


    it('should not scroll when auto-scrolling is disabled', function() {
      module(
          disableAutoScrolling(),
          initLocation({html5Mode: false, historyApi: false})
      );
      inject(
        addElements('id=fake'),
        changeHashTo('fake'),
        expectNoScrolling()
      );
    });


    it('should scroll when called explicitly (even if auto-scrolling is disabled)', function() {
      module(
          disableAutoScrolling(),
          initLocation({html5Mode: false, historyApi: false})
      );
      inject(
        addElements('id=fake'),
        changeHashTo('fake'),
        expectNoScrolling(),
        callAnchorScroll(),
        expectScrollingTo('id=fake')
      );
    });
  });


  // TODO: Add tests for <body> with:
  //       1. border/margin/padding !== 0
  //       2. box-sizing === border-box
  describe('yOffset', function() {

    function expectScrollingWithOffset(identifierCountMap, offsetList) {
      var list = isArray(offsetList) ? offsetList : [offsetList];

      return function($rootScope, $window) {
        inject(expectScrollingTo(identifierCountMap));
        expect($window.scrollBy.callCount).toBe(list.length);
        forEach(list, function(offset, idx) {
          // Due to sub-pixel rendering, there is a +/-1 error margin in the actual offset
          var args = $window.scrollBy.calls[idx].args;
          expect(args[0]).toBe(0);
          expect(Math.abs(offset + args[1])).toBeLessThan(1);
        });
      };
    }

    function expectScrollingWithoutOffset(identifierCountMap) {
      return expectScrollingWithOffset(identifierCountMap, []);
    }

    function setupBodyForOffsetTesting() {
      return function($window) {
        var style = $window.document.body.style;
        style.border = 'none';
        style.margin = '0';
        style.padding = '0';
      };
    }

    function setYOffset(yOffset) {
      return function($anchorScroll) {
        $anchorScroll.yOffset = yOffset;
      };
    }

    function updateMockPageYOffset() {
      return function($window) {
        $window.pageYOffset = window.pageYOffset;
      };
    }

    beforeEach(createMockWindow());
    beforeEach(inject(setupBodyForOffsetTesting()));


    describe('when set as a fixed number', function() {

      var yOffsetNumber = 50;

      beforeEach(inject(setYOffset(yOffsetNumber)));


      it('should scroll with vertical offset', inject(
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithOffset('id=some', yOffsetNumber)));


      it('should use the correct vertical offset when changing `yOffset` at runtime', inject(
        addElements('id=some'),
        changeHashTo('some'),
        setYOffset(yOffsetNumber - 10),
        callAnchorScroll(),
        expectScrollingWithOffset({'id=some': 2}, [yOffsetNumber, yOffsetNumber - 10])));


      it('should adjust the vertical offset for elements near the end of the page', function() {

        var targetAdjustedOffset = 25;

        inject(
          addElements('id=some1', 'id=some2'),
          function($window) {
            // Make sure the elements are just a little shorter than the viewport height
            var viewportHeight = $window.document.documentElement.clientHeight;
            var elemHeight = viewportHeight - (yOffsetNumber - targetAdjustedOffset);
            var cssText = [
              'border:none',
              'display:block',
              'height:' + elemHeight + 'px',
              'margin:0',
              'padding:0',
              ''].join(';');

            forEach($window.document.body.children, function(elem) {
              elem.style.cssText = cssText;
            });

            // Make sure scrolling does actually take place
            // (this is necessary for the current test)
            forEach(elmSpy, function(spy, identifier) {
              elmSpy[identifier] = spy.andCallThrough();
            });
          },
          changeHashTo('some2'),
          updateMockPageYOffset(),
          resetAllSpies(),
          callAnchorScroll(),
          expectScrollingWithOffset('id=some2', targetAdjustedOffset));
      });
    });


    describe('when set as a function', function() {

      it('should scroll with vertical offset', function() {

        var val = 0;
        var increment = 10;

        function yOffsetFunction() {
          val += increment;
          return val;
        }

        inject(
          addElements('id=id1', 'name=name2'),
          setYOffset(yOffsetFunction),
          changeHashTo('id1'),
          changeHashTo('name2'),
          changeHashTo('id1'),
          callAnchorScroll(),
          expectScrollingWithOffset({
            'id=id1': 3,
            'name=name2': 1
          }, [
            1 * increment,
            2 * increment,
            3 * increment,
            4 * increment
          ]));
      });
    });


    describe('when set as a jqLite element', function() {

      function createAndSetYOffsetElement(styleSpecs) {
        var cssText = '';
        forEach(styleSpecs, function(value, key) {
          cssText += key + ':' + value + ';';
        });

        var jqElem = jqLite('<div style="' + cssText + '"></div>');

        return function($anchorScroll, $window) {
          jqLite($window.document.body).append(jqElem);
          $anchorScroll.yOffset = jqElem;
        };
      }


      it('should scroll with vertical offset when `top === 0`', inject(
        createAndSetYOffsetElement({
          background: 'DarkOrchid',
          height: '50px',
          position: 'fixed',
          top: '0',
        }),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithOffset('id=some', 50)));


      it('should scroll with vertical offset when `top > 0`', inject(
        createAndSetYOffsetElement({
          height: '50px',
          position: 'fixed',
          top: '50px',
        }),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithOffset('id=some', 100)));


      it('should scroll without vertical offset when `position !== fixed`', inject(
        createAndSetYOffsetElement({
          height: '50px',
          position: 'absolute',
          top: '0',
        }),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithoutOffset('id=some')));
    });
  });
});
