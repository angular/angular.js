'use strict';

describe('$anchorScroll', function() {

  var elmSpy;

  function addElements() {
    var elements = sliceArgs(arguments);

    return function($window) {
      forEach(elements, function(identifier) {
        var match = identifier.match(/(\w* )?(\w*)=(\w*)/),
            jqElm = jqLite('<' + (match[1] || 'a ') + match[2] + '="' + match[3] + '"/>'),
            elm = jqElm[0];

        elmSpy[identifier] = spyOn(elm, 'scrollIntoView');
        jqLite($window.document.body).append(jqElm);
      });
    };
  }

  function callAnchorScroll() {
    return function ($anchorScroll) {
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
    return function ($anchorScroll, $location, $rootScope) {
      $rootScope.$apply(function() {
        $location.hash(hash);
      });
    };
  }

  function expectScrollingToTop($window) {
    forEach(elmSpy, function(spy, id) {
      expect(spy).not.toHaveBeenCalled();
    });

    expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
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
        expect(spy.calls.length).toBe(count);
      });
      expect($window.scrollTo).not.toHaveBeenCalled();
    };
  }

  function expectNoScrolling() {
    return expectScrollingTo(NaN);
  }


  beforeEach(module(function($provide) {
    elmSpy = {};
    $provide.value('$window', {
      scrollTo: jasmine.createSpy('$window.scrollTo'),
      scrollBy: jasmine.createSpy('$window.scrollBy'),
      document: document,
      navigator: {},
      getComputedStyle: function(elem) {
        return getComputedStyle(elem);
      }
    });
  }));


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


  describe('watcher', function() {

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

    afterEach(inject(function($document) {
      dealoc($document);
    }));


    it('should scroll to element when hash change in hashbang mode', function() {
      module(initLocation({html5Mode: false, historyApi: true}));
      inject(
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingTo('id=some')
      );
    });


    it('should scroll to element when hash change in html5 mode with no history api', function() {
      module(initLocation({html5Mode: true, historyApi: false}));
      inject(
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingTo('id=some')
      );
    });


    it('should not scroll when element does not exist', function() {
      module(initLocation({html5Mode: false, historyApi: false}));
      inject(
        addElements('id=some'),
        changeHashTo('other'),
        expectNoScrolling()
      );
    });


    it('should scroll when html5 mode with history api', function() {
      module(initLocation({html5Mode: true, historyApi: true}));
      inject(
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

      return function($window) {
        expectScrollingTo(identifierCountMap)($window);
        expect($window.scrollBy.calls.length).toBe(list.length);
        forEach(list, function(offset, idx) {
          expect($window.scrollBy.calls[idx].args).toEqual([0, -1 * offset]);
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
      return function ($anchorScroll) {
        $anchorScroll.yOffset = yOffset;
      };
    }

    afterEach(inject(function($document) {
      dealoc($document);
    }));


    describe('when set as a fixed number', function() {

      var yOffsetNumber = 50;

      it('should scroll with vertical offset', inject(
        setupBodyForOffsetTesting(),
        setYOffset(yOffsetNumber),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithOffset('id=some', yOffsetNumber)));


      it('should use the correct vertical offset when changing `yOffset` at runtime', inject(
        setupBodyForOffsetTesting(),
        setYOffset(yOffsetNumber),
        addElements('id=some'),
        changeHashTo('some'),
        setYOffset(yOffsetNumber - 10),
        callAnchorScroll(),
        expectScrollingWithOffset({'id=some': 2}, [yOffsetNumber, yOffsetNumber - 10])));


      it('should adjust the vertical offset for elements near the end of the page', function() {

        var targetAdjustedOffset = 25;

        inject(
          setupBodyForOffsetTesting(),
          setYOffset(yOffsetNumber),
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

            forEach($window.document.body.children, function (elem) {
              elem.style.cssText = cssText;
            });

            // Make sure scrolling does actually take place (it is necessary for this test)
            forEach(elmSpy, function (spy, identifier) {
              elmSpy[identifier] = spy.andCallThrough();
            });
          },
          changeHashTo('some2'),
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
          setupBodyForOffsetTesting(),
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

        return function ($anchorScroll, $window) {
          jqLite($window.document.body).append(jqElem);
          $anchorScroll.yOffset = jqElem;
        };
      }


      it('should scroll with vertical offset when `top === 0`', inject(
        setupBodyForOffsetTesting(),
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
        setupBodyForOffsetTesting(),
        createAndSetYOffsetElement({
          height: '50px',
          position: 'fixed',
          top: '50px',
        }),
        addElements('id=some'),
        changeHashTo('some'),
        expectScrollingWithOffset('id=some', 100)));


      it('should scroll without vertical offset when `position !== fixed`', inject(
        setupBodyForOffsetTesting(),
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

