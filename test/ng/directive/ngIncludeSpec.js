'use strict';

describe('ngInclude', function() {
  var element;

  afterEach(function(){
    dealoc(element);
  });


  function putIntoCache(url, content) {
    return function($templateCache) {
      $templateCache.put(url, [200, content, {}]);
    };
  }


  it('should trust and use literal urls', inject(function(
      $rootScope, $httpBackend, $compile) {
    element = $compile('<div ng-include="\'url\'"></div>')($rootScope);
    $httpBackend.expect('GET', 'url').respond('template text');
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toEqual('template text');
    dealoc($rootScope);
  }));


  it('should trust and use trusted urls', inject(function($rootScope, $httpBackend, $compile, $sce) {
    element = $compile('<div ng-include="fooUrl"></div>')($rootScope);
    $httpBackend.expect('GET', 'http://foo.bar/url').respond('template text');
    $rootScope.fooUrl = $sce.trustAsResourceUrl('http://foo.bar/url');
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toEqual('template text');
    dealoc($rootScope);
  }));


  it('should include an external file', inject(putIntoCache('myUrl', '{{name}}'),
      function($rootScope, $compile) {
    element = jqLite('<ng:include src="url"></ng:include>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'misko';
    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    expect(element.text()).toEqual('misko');
    jqLite(document.body).html('');
  }));


  it('should support ng-include="src" syntax', inject(putIntoCache('myUrl', '{{name}}'),
      function($rootScope, $compile) {
    element = jqLite('<div ng-include="url"></div>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'Alibaba';
    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    expect(element.text()).toEqual('Alibaba');
    jqLite(document.body).html('');
  }));


  it('should NOT use untrusted expressions ', inject(putIntoCache('myUrl', '{{name}} text'),
      function($rootScope, $compile, $sce) {
    element = jqLite('<ng:include src="url"></ng:include>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'chirayu';
    $rootScope.url = 'myUrl';
    expect($rootScope.$digest).toThrow();
    jqLite(document.body).html('');
  }));


  it('should NOT use mistyped expressions ', inject(putIntoCache('myUrl', '{{name}} text'),
      function($rootScope, $compile, $sce) {
    element = jqLite('<ng:include src="url"></ng:include>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'chirayu';
    $rootScope.url = $sce.trustAsUrl('myUrl');
    expect($rootScope.$digest).toThrow();
    jqLite(document.body).html('');
  }));

  it('should remove previously included text if a falsy value is bound to src', inject(
        putIntoCache('myUrl', '{{name}}'),
        function($rootScope, $compile) {
    element = jqLite('<ng:include src="url"></ng:include>');
    element = $compile(element)($rootScope);
    $rootScope.name = 'igor';
    $rootScope.url = 'myUrl';
    $rootScope.$digest();

    expect(element.text()).toEqual('igor');

    $rootScope.url = undefined;
    $rootScope.$digest();

    expect(element.text()).toEqual('');
  }));

  it('should fire $includeContentRequested event on scope after making the xhr call', inject(
      function ($rootScope, $compile, $httpBackend) {
    var contentRequestedSpy = jasmine.createSpy('content requested').andCallFake(function (event) {
        expect(event.targetScope).toBe($rootScope);
    });

    $httpBackend.whenGET('url').respond('my partial');
    $rootScope.$on('$includeContentRequested', contentRequestedSpy);

    element = $compile('<ng:include src="\'url\'"></ng:include>')($rootScope);
    $rootScope.$digest();

    expect(contentRequestedSpy).toHaveBeenCalledOnce();

    $httpBackend.flush();
  }));

  it('should fire $includeContentLoaded event on child scope after linking the content', inject(
      function($rootScope, $compile, $templateCache) {
    var contentLoadedSpy = jasmine.createSpy('content loaded').andCallFake(function(event) {
      expect(event.targetScope.$parent).toBe($rootScope);
      expect(element.text()).toBe('partial content');
    });

    $templateCache.put('url', [200, 'partial content', {}]);
    $rootScope.$on('$includeContentLoaded', contentLoadedSpy);

    element = $compile('<ng:include src="\'url\'"></ng:include>')($rootScope);
    $rootScope.$digest();

    expect(contentLoadedSpy).toHaveBeenCalledOnce();
  }));


  it('should evaluate onload expression when a partial is loaded', inject(
      putIntoCache('myUrl', 'my partial'),
      function($rootScope, $compile) {
    element = jqLite('<ng:include src="url" onload="loaded = true"></ng:include>');
    element = $compile(element)($rootScope);

    expect($rootScope.loaded).not.toBeDefined();

    $rootScope.url = 'myUrl';
    $rootScope.$digest();

    expect(element.text()).toEqual('my partial');
    expect($rootScope.loaded).toBe(true);
  }));


  it('should create child scope and destroy old one', inject(
        function($rootScope, $compile, $httpBackend) {
    $httpBackend.whenGET('url1').respond('partial {{$parent.url}}');
    $httpBackend.whenGET('url2').respond(404);

    element = $compile('<ng:include src="url"></ng:include>')($rootScope);
    expect(element.children().scope()).toBeFalsy();

    $rootScope.url = 'url1';
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.children().scope().$parent).toBe($rootScope);
    expect(element.text()).toBe('partial url1');

    $rootScope.url = 'url2';
    $rootScope.$digest();
    $httpBackend.flush();
    expect($rootScope.$$childHead).toBeFalsy();
    expect(element.text()).toBe('');

    $rootScope.url = 'url1';
    $rootScope.$digest();
    expect(element.children().scope().$parent).toBe($rootScope);

    $rootScope.url = null;
    $rootScope.$digest();
    expect($rootScope.$$childHead).toBeFalsy();
  }));


  it('should do xhr request and cache it',
      inject(function($rootScope, $httpBackend, $compile) {
    element = $compile('<ng:include src="url"></ng:include>')($rootScope);
    $httpBackend.expect('GET', 'myUrl').respond('my partial');

    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toEqual('my partial');

    $rootScope.url = null;
    $rootScope.$digest();
    expect(element.text()).toEqual('');

    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    expect(element.text()).toEqual('my partial');
    dealoc($rootScope);
  }));


  it('should clear content when error during xhr request',
      inject(function($httpBackend, $compile, $rootScope) {
    element = $compile('<ng:include src="url">content</ng:include>')($rootScope);
    $httpBackend.expect('GET', 'myUrl').respond(404, '');

    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    $httpBackend.flush();

    expect(element.text()).toBe('');
  }));


  it('should be async even if served from cache', inject(
        putIntoCache('myUrl', 'my partial'),
        function($rootScope, $compile) {
    element = $compile('<ng:include src="url"></ng:include>')($rootScope);

    $rootScope.url = 'myUrl';

    var called = 0;
    // we want to assert only during first watch
    $rootScope.$watch(function() {
      if (!called++) expect(element.text()).toBe('');
    });

    $rootScope.$digest();
    expect(element.text()).toBe('my partial');
  }));


  it('should discard pending xhr callbacks if a new template is requested before the current ' +
      'finished loading', inject(function($rootScope, $compile, $httpBackend) {
    element = jqLite("<ng:include src='templateUrl'></ng:include>");
    var log = {};

    $rootScope.templateUrl = 'myUrl1';
    $rootScope.logger = function(msg) {
      log[msg] = true;
    }
    $compile(element)($rootScope);
    expect(log).toEqual({});

    $httpBackend.expect('GET', 'myUrl1').respond('<div>{{logger("url1")}}</div>');
    $rootScope.$digest();
    expect(log).toEqual({});
    $rootScope.templateUrl = 'myUrl2';
    $httpBackend.expect('GET', 'myUrl2').respond('<div>{{logger("url2")}}</div>');
    $httpBackend.flush(); // now that we have two requests pending, flush!

    expect(log).toEqual({ url2 : true });
  }));


  it('should compile only the content', inject(function($compile, $rootScope, $templateCache) {
    // regression

    var onload = jasmine.createSpy('$includeContentLoaded');
    $rootScope.$on('$includeContentLoaded', onload);
    $templateCache.put('tpl.html', [200, 'partial {{tpl}}', {}]);

    element = $compile('<div><div ng-repeat="i in [1]">' +
        '<ng:include src="tpl"></ng:include></div></div>')($rootScope);
    expect(onload).not.toHaveBeenCalled();

    $rootScope.$apply(function() {
      $rootScope.tpl = 'tpl.html';
    });
    expect(onload).toHaveBeenCalledOnce();
  }));


  describe('autoscoll', function() {
    var autoScrollSpy;

    function spyOnAnchorScroll() {
      return function($provide) {
        autoScrollSpy = jasmine.createSpy('$anchorScroll');
        $provide.value('$anchorScroll', autoScrollSpy);
      };
    }

    function compileAndLink(tpl) {
      return function($compile, $rootScope) {
        element = $compile(tpl)($rootScope);
      };
    }

    function changeTplAndValueTo(template, value) {
      return function($rootScope, $browser) {
        $rootScope.$apply(function() {
          $rootScope.tpl = template;
          $rootScope.value = value;
        });
      };
    }

    beforeEach(module(spyOnAnchorScroll()));
    beforeEach(inject(
        putIntoCache('template.html', 'CONTENT'),
        putIntoCache('another.html', 'CONTENT')));


    it('should call $anchorScroll if autoscroll attribute is present', inject(
        compileAndLink('<ng:include src="tpl" autoscroll></ng:include>'),
        changeTplAndValueTo('template.html'), function() {
      expect(autoScrollSpy).toHaveBeenCalledOnce();
    }));


    it('should call $anchorScroll if autoscroll evaluates to true', inject(
        compileAndLink('<ng:include src="tpl" autoscroll="value"></ng:include>'),
        changeTplAndValueTo('template.html', true),
        changeTplAndValueTo('another.html', 'some-string'),
        changeTplAndValueTo('template.html', 100), function() {
      expect(autoScrollSpy).toHaveBeenCalled();
      expect(autoScrollSpy.callCount).toBe(3);
    }));


    it('should not call $anchorScroll if autoscroll attribute is not present', inject(
        compileAndLink('<ng:include src="tpl"></ng:include>'),
        changeTplAndValueTo('template.html'), function() {
      expect(autoScrollSpy).not.toHaveBeenCalled();
    }));


    it('should not call $anchorScroll if autoscroll evaluates to false', inject(
        compileAndLink('<ng:include src="tpl" autoscroll="value"></ng:include>'),
        changeTplAndValueTo('template.html', false),
        changeTplAndValueTo('template.html', undefined),
        changeTplAndValueTo('template.html', null), function() {
      expect(autoScrollSpy).not.toHaveBeenCalled();
    }));
  });
});

describe('ngInclude ngAnimate', function() {
  var vendorPrefix, window;
  var body, element, $rootElement;

  function html(html) {
    $rootElement.html(html);
    element = $rootElement.children().eq(0);
    return element;
  }

  function applyCSS(element, cssProp, cssValue) {
    element.css(cssProp, cssValue);
    element.css(vendorPrefix + cssProp, cssValue);
  }

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });

  beforeEach(module(function($animationProvider, $provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());
    return function($sniffer, $animator) {
      vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
      $animator.enabled(true);
    };
  }));

  afterEach(function(){
    dealoc(element);
  });

  it('should fire off the enter animation + add and remove the css classes',
    inject(function($compile, $rootScope, $templateCache, $sniffer) {

      $templateCache.put('enter', [200, '<div>data</div>', {}]);
      $rootScope.tpl = 'enter';
      element = $compile(html(
        '<div ' +
          'ng-include="tpl" ' +
          'ng-animate="{enter: \'custom-enter\'}">' +
        '</div>'
      ))($rootScope);
      $rootScope.$digest();

      //if we add the custom css stuff here then it will get picked up before the animation takes place
      var child = jqLite(element.children()[0]);
      applyCSS(child, 'transition', '1s linear all');

      if ($sniffer.transitions) {
        expect(child.attr('class')).toContain('custom-enter');
        window.setTimeout.expect(1).process();

        expect(child.attr('class')).toContain('custom-enter-active');
        window.setTimeout.expect(1000).process();
      } else {
       expect(window.setTimeout.queue).toEqual([]);
      }

      expect(child.attr('class')).not.toContain('custom-enter');
      expect(child.attr('class')).not.toContain('custom-enter-active');
  }));

  it('should fire off the leave animation + add and remove the css classes',
    inject(function($compile, $rootScope, $templateCache, $sniffer) {
      $templateCache.put('enter', [200, '<div>data</div>', {}]);
      $rootScope.tpl = 'enter';
      element = $compile(html(
        '<div ' +
          'ng-include="tpl" ' +
          'ng-animate="{leave: \'custom-leave\'}">' +
        '</div>'
      ))($rootScope);
      $rootScope.$digest();

      //if we add the custom css stuff here then it will get picked up before the animation takes place
      var child = jqLite(element.children()[0]);
      applyCSS(child, 'transition', '1s linear all');

      $rootScope.tpl = '';
      $rootScope.$digest();

      if ($sniffer.transitions) {
        expect(child.attr('class')).toContain('custom-leave');
        window.setTimeout.expect(1).process();

        expect(child.attr('class')).toContain('custom-leave-active');
        window.setTimeout.expect(1000).process();
      } else {
       expect(window.setTimeout.queue).toEqual([]);
      }

      expect(child.attr('class')).not.toContain('custom-leave');
      expect(child.attr('class')).not.toContain('custom-leave-active');
  }));

  it('should catch and use the correct duration for animation',
    inject(function($compile, $rootScope, $templateCache, $sniffer) {
      $templateCache.put('enter', [200, '<div>data</div>', {}]);
      $rootScope.tpl = 'enter';
      element = $compile(html(
        '<div ' +
          'ng-include="tpl" ' +
          'ng-animate="{enter: \'custom-enter\'}">' +
        '</div>'
      ))($rootScope);
      $rootScope.$digest();

      //if we add the custom css stuff here then it will get picked up before the animation takes place
      var child = jqLite(element.children()[0]);
      applyCSS(child, 'transition', '0.5s linear all');

      $rootScope.tpl = 'enter';
      $rootScope.$digest();

      if ($sniffer.transitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(500).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }
  }));

});
