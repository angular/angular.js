describe('$anchorScroll', function() {

  var elmSpy;

  function addElements() {
    var elements = sliceArgs(arguments);

    return function() {
      forEach(elements, function(identifier) {
        var match = identifier.match(/(\w* )?(\w*)=(\w*)/),
            jqElm = jqLite('<' + (match[1] || 'a ') + match[2] + '="' + match[3] + '"/>'),
            elm = jqElm[0];

        elmSpy[identifier] = spyOn(elm, 'scrollIntoView');
        jqLite(document.body).append(jqElm);
      });
    };
  }

  function changeHashAndScroll(hash) {
    return function($location, $anchorScroll) {
      $location.hash(hash);
      $anchorScroll();
    };
  }

  function expectScrollingToTop($window) {
    forEach(elmSpy, function(spy, id) {
      expect(spy).not.toHaveBeenCalled();
    });

    expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
  }

  function expectScrollingTo(identifier) {
    return function($window) {
      forEach(elmSpy, function(spy, id) {
        if (identifier === id) expect(spy).toHaveBeenCalledOnce();
        else expect(spy).not.toHaveBeenCalled();
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
      document: document,
      navigator: {}
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

    function changeHashTo(hash) {
      return function ($location, $rootScope, $anchorScroll) {
        $rootScope.$apply(function() {
          $location.hash(hash);
        });
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


    it('should not scroll when disabled', function() {
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
  });
});

