'use strict';

describe('ngInclude', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  function putIntoCache(url, content) {
    return function($templateCache) {
      $templateCache.put(url, [200, content, {}]);
    };
  }


  it('should trust and use literal urls', inject(function(
      $rootScope, $httpBackend, $compile) {
    element = $compile('<div><div ng-include="\'url\'"></div></div>')($rootScope);
    $httpBackend.expect('GET', 'url').respond('template text');
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toEqual('template text');
    dealoc($rootScope);
  }));


  it('should trust and use trusted urls', inject(function($rootScope, $httpBackend, $compile, $sce) {
    element = $compile('<div><div ng-include="fooUrl"></div></div>')($rootScope);
    $httpBackend.expect('GET', 'http://foo.bar/url').respond('template text');
    $rootScope.fooUrl = $sce.trustAsResourceUrl('http://foo.bar/url');
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toEqual('template text');
    dealoc($rootScope);
  }));


  it('should include an external file', inject(putIntoCache('myUrl', '{{name}}'),
      function($rootScope, $compile) {
    element = jqLite('<div><ng:include src="url"></ng:include></div>');
    var body = jqLite(document.body);
    body.append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'misko';
    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    expect(body.text()).toEqual('misko');
    body.empty();
  }));


  it('should support ng-include="src" syntax', inject(putIntoCache('myUrl', '{{name}}'),
      function($rootScope, $compile) {
    element = jqLite('<div><div ng-include="url"></div></div>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'Alibaba';
    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    expect(element.text()).toEqual('Alibaba');
    jqLite(document.body).empty();
  }));


  it('should NOT use untrusted URL expressions ', inject(putIntoCache('myUrl', '{{name}} text'),
      function($rootScope, $compile, $sce) {
    element = jqLite('<ng:include src="url"></ng:include>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'chirayu';
    $rootScope.url = 'http://example.com/myUrl';
    expect(function() { $rootScope.$digest(); }).toThrowMinErr(
        '$sce', 'insecurl',
        /Blocked loading resource from url not allowed by \$sceDelegate policy.  URL: http:\/\/example.com\/myUrl.*/);
    jqLite(document.body).empty();
  }));


  it('should NOT use mistyped expressions ', inject(putIntoCache('myUrl', '{{name}} text'),
      function($rootScope, $compile, $sce) {
    element = jqLite('<ng:include src="url"></ng:include>');
    jqLite(document.body).append(element);
    element = $compile(element)($rootScope);
    $rootScope.name = 'chirayu';
    $rootScope.url = $sce.trustAsUrl('http://example.com/myUrl');
    expect(function() { $rootScope.$digest(); }).toThrowMinErr(
        '$sce', 'insecurl',
        /Blocked loading resource from url not allowed by \$sceDelegate policy.  URL: http:\/\/example.com\/myUrl.*/);
    jqLite(document.body).empty();
  }));


  it('should remove previously included text if a falsy value is bound to src', inject(
        putIntoCache('myUrl', '{{name}}'),
        function($rootScope, $compile) {
    element = jqLite('<div><ng:include src="url"></ng:include></div>');
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
      function($rootScope, $compile, $httpBackend) {
    var contentRequestedSpy = jasmine.createSpy('content requested').andCallFake(function(event) {
      expect(event.targetScope).toBe($rootScope);
    });

    $httpBackend.whenGET('url').respond('my partial');
    $rootScope.$on('$includeContentRequested', contentRequestedSpy);

    element = $compile('<div><div><ng:include src="\'url\'"></ng:include></div></div>')($rootScope);
    $rootScope.$digest();

    expect(contentRequestedSpy).toHaveBeenCalledOnceWith(jasmine.any(Object), 'url');

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

    element = $compile('<div><div><ng:include src="\'url\'"></ng:include></div></div>')($rootScope);
    $rootScope.$digest();

    expect(contentLoadedSpy).toHaveBeenCalledOnceWith(jasmine.any(Object), 'url');
  }));


  it('should fire $includeContentError event when content request fails', inject(
      function($rootScope, $compile, $httpBackend, $templateCache) {
    var contentLoadedSpy = jasmine.createSpy('content loaded'),
        contentErrorSpy = jasmine.createSpy('content error');

    $rootScope.$on('$includeContentLoaded', contentLoadedSpy);
    $rootScope.$on('$includeContentError', contentErrorSpy);

    $httpBackend.expect('GET', 'tpl.html').respond(400, 'nope');

    element = $compile('<div><div ng-include="template"></div></div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.template = 'tpl.html';
    });
    $httpBackend.flush();

    expect(contentLoadedSpy).not.toHaveBeenCalled();
    expect(contentErrorSpy).toHaveBeenCalledOnceWith(jasmine.any(Object), 'tpl.html');
    expect(element.children('div').contents().length).toBe(0);
  }));


  it('should evaluate onload expression when a partial is loaded', inject(
      putIntoCache('myUrl', 'my partial'),
      function($rootScope, $compile) {
    element = jqLite('<div><div><ng:include src="url" onload="loaded = true"></ng:include></div></div>');
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

    element = $compile('<div><ng:include src="url"></ng:include></div>')($rootScope);
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
    element = $compile('<div><ng:include src="url"></ng:include></div>')($rootScope);
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
    element = $compile('<div><ng:include src="url">content</ng:include></div>')($rootScope);
    $httpBackend.expect('GET', 'myUrl').respond(404, '');

    $rootScope.url = 'myUrl';
    $rootScope.$digest();
    $httpBackend.flush();

    expect(element.text()).toBe('');
  }));


  it('should be async even if served from cache', inject(
        putIntoCache('myUrl', 'my partial'),
        function($rootScope, $compile) {
    element = $compile('<div><ng:include src="url"></ng:include></div>')($rootScope);

    $rootScope.url = 'myUrl';

    var called = 0;
    // we want to assert only during first watch
    $rootScope.$watch(function() {
      if (!called) expect(element.text()).toBe('');
      called++;
    });

    $rootScope.$digest();
    expect(element.text()).toBe('my partial');
  }));


  it('should discard pending xhr callbacks if a new template is requested before the current ' +
      'finished loading', inject(function($rootScope, $compile, $httpBackend) {
    element = jqLite("<div><ng:include src='templateUrl'></ng:include></div>");
    var log = {};

    $rootScope.templateUrl = 'myUrl1';
    $rootScope.logger = function(msg) {
      log[msg] = true;
    };
    $compile(element)($rootScope);
    expect(log).toEqual({});

    $httpBackend.expect('GET', 'myUrl1').respond('<div>{{logger("url1")}}</div>');
    $rootScope.$digest();
    expect(log).toEqual({});
    $rootScope.templateUrl = 'myUrl2';
    $httpBackend.expect('GET', 'myUrl2').respond('<div>{{logger("url2")}}</div>');
    $httpBackend.flush(); // now that we have two requests pending, flush!

    expect(log).toEqual({ url2: true });
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

    $rootScope.tpl = '';
    $rootScope.$digest();
    dealoc(element);
  }));


  it('should not break attribute bindings on the same element', inject(function($compile, $rootScope, $httpBackend) {
    // regression #3793

    element = $compile('<div><span foo="#/{{hrefUrl}}" ng:include="includeUrl"></span></div>')($rootScope);
    $httpBackend.expect('GET', 'url1').respond('template text 1');
    $rootScope.hrefUrl = 'fooUrl1';
    $rootScope.includeUrl = 'url1';
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toBe('template text 1');
    expect(element.find('span').attr('foo')).toBe('#/fooUrl1');

    $httpBackend.expect('GET', 'url2').respond('template text 2');
    $rootScope.includeUrl = 'url2';
    $rootScope.$digest();
    $httpBackend.flush();
    expect(element.text()).toBe('template text 2');
    expect(element.find('span').attr('foo')).toBe('#/fooUrl1');

    $rootScope.hrefUrl = 'fooUrl2';
    $rootScope.$digest();
    expect(element.text()).toBe('template text 2');
    expect(element.find('span').attr('foo')).toBe('#/fooUrl2');
  }));


  it('should exec scripts when jQuery is included', inject(function($compile, $rootScope, $httpBackend) {
    if (!jQuery) {
      return;
    }

    element = $compile('<div><span ng-include="includeUrl"></span></div>')($rootScope);

    // the element needs to be appended for the script to run
    element.appendTo(document.body);
    window._ngIncludeCausesScriptToRun = false;
    $httpBackend.expect('GET', 'url1').respond('<script>window._ngIncludeCausesScriptToRun = true;</script>');
    $rootScope.includeUrl = 'url1';
    $rootScope.$digest();
    $httpBackend.flush();

    expect(window._ngIncludeCausesScriptToRun).toBe(true);

    delete window._ngIncludeCausesScriptToRun;
  }));


  it('should construct SVG template elements with correct namespace', function() {
    if (!window.SVGRectElement) return;
    module(function($compileProvider) {
      $compileProvider.directive('test', valueFn({
        templateNamespace: 'svg',
        templateUrl: 'my-rect.html',
        replace: true
      }));
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('my-rect.html').respond('<g ng-include="\'include.svg\'"></g>');
      $httpBackend.expectGET('include.svg').respond('<rect></rect><rect></rect>');
      element = $compile('<svg><test></test></svg>')($rootScope);
      $httpBackend.flush();
      var child = element.find('rect');
      expect(child.length).toBe(2);
      expect(child[0] instanceof SVGRectElement).toBe(true);
    });
  });


  it('should compile only the template content of an SVG template', function() {
    if (!window.SVGRectElement) return;
    module(function($compileProvider) {
      $compileProvider.directive('test', valueFn({
        templateNamespace: 'svg',
        templateUrl: 'my-rect.html',
        replace: true
      }));
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('my-rect.html').respond('<g ng-include="\'include.svg\'"><a></a></g>');
      $httpBackend.expectGET('include.svg').respond('<rect></rect><rect></rect>');
      element = $compile('<svg><test></test></svg>')($rootScope);
      $httpBackend.flush();
      expect(element.find('a').length).toBe(0);
    });
  });


  describe('autoscroll', function() {
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

    beforeEach(module(spyOnAnchorScroll(), 'ngAnimateMock'));
    beforeEach(inject(
        putIntoCache('template.html', 'CONTENT'),
        putIntoCache('another.html', 'CONTENT')));

    it('should call $anchorScroll if autoscroll attribute is present', inject(
        compileAndLink('<div><ng:include src="tpl" autoscroll></ng:include></div>'),
        function($rootScope, $animate, $timeout) {

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
      });

      expect(autoScrollSpy).not.toHaveBeenCalled();
      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();

      expect(autoScrollSpy).toHaveBeenCalledOnce();
    }));


    it('should call $anchorScroll if autoscroll evaluates to true',
      inject(function($rootScope, $compile, $animate, $timeout) {

      element = $compile('<div><ng:include src="tpl" autoscroll="value"></ng:include></div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
        $rootScope.value = true;
      });

      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();

      $rootScope.$apply(function() {
        $rootScope.tpl = 'another.html';
        $rootScope.value = 'some-string';
      });

      expect($animate.queue.shift().event).toBe('leave');
      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
        $rootScope.value = 100;
      });

      expect($animate.queue.shift().event).toBe('leave');
      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();

      expect(autoScrollSpy).toHaveBeenCalled();
      expect(autoScrollSpy.callCount).toBe(3);
    }));


    it('should not call $anchorScroll if autoscroll attribute is not present', inject(
        compileAndLink('<div><ng:include src="tpl"></ng:include></div>'),
        function($rootScope, $animate, $timeout) {

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
      });

      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();
      expect(autoScrollSpy).not.toHaveBeenCalled();
    }));


    it('should not call $anchorScroll if autoscroll evaluates to false',
      inject(function($rootScope, $compile, $animate, $timeout) {

      element = $compile('<div><ng:include src="tpl" autoscroll="value"></ng:include></div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
        $rootScope.value = false;
      });

      expect($animate.queue.shift().event).toBe('enter');
      $animate.triggerCallbacks();

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
        $rootScope.value = undefined;
      });

      $rootScope.$apply(function() {
        $rootScope.tpl = 'template.html';
        $rootScope.value = null;
      });

      expect(autoScrollSpy).not.toHaveBeenCalled();
    }));

    it('should only call $anchorScroll after the "enter" animation completes', inject(
        compileAndLink('<div><ng:include src="tpl" autoscroll></ng:include></div>'),
        function($rootScope, $animate, $timeout) {
          expect(autoScrollSpy).not.toHaveBeenCalled();

          $rootScope.$apply("tpl = 'template.html'");
          expect($animate.queue.shift().event).toBe('enter');
          $animate.triggerCallbacks();

          expect(autoScrollSpy).toHaveBeenCalledOnce();
        }
    ));
  });
});

describe('ngInclude and transcludes', function() {
  var element, directive;

  beforeEach(module(function($compileProvider) {
    element = null;
    directive = $compileProvider.directive;
  }));

  afterEach(function() {
    if (element) {
      dealoc(element);
    }
  });

  it('should allow access to directive controller from children when used in a replace template', function() {
    var controller;
    module(function() {
      directive('template', valueFn({
        template: '<div ng-include="\'include.html\'"></div>',
        replace: true,
        controller: function() {
          this.flag = true;
        }
      }));
      directive('test', valueFn({
        require: '^template',
        link: function(scope, el, attr, ctrl) {
          controller = ctrl;
        }
      }));
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('include.html').respond('<div><div test></div></div>');
      element = $compile('<div><div template></div></div>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();
      expect(controller.flag).toBe(true);
    });
  });

  it("should compile its content correctly (although we remove it later)", function() {
    var testElement;
    module(function() {
      directive('test', function() {
        return {
          link: function(scope, element) {
            testElement = element;
          }
        };
      });
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('include.html').respond(' ');
      element = $compile('<div><div ng-include="\'include.html\'"><div test></div></div></div>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();
      expect(testElement[0].nodeName).toBe('DIV');
    });

  });

  it('should link directives on the same element after the content has been loaded', function() {
    var contentOnLink;
    module(function() {
      directive('test', function() {
        return {
          link: function(scope, element) {
            contentOnLink = element.text();
          }
        };
      });
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('include.html').respond('someContent');
      element = $compile('<div><div ng-include="\'include.html\'" test></div>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();
      expect(contentOnLink).toBe('someContent');
    });
  });

  it('should add the content to the element before compiling it', function() {
    var root;
    module(function() {
      directive('test', function() {
        return {
          link: function(scope, element) {
            root = element.parent().parent();
          }
        };
      });
    });
    inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.expectGET('include.html').respond('<span test></span>');
      element = $compile('<div><div ng-include="\'include.html\'"></div>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();
      expect(root[0]).toBe(element[0]);
    });
  });
});

describe('ngInclude animations', function() {
  var body, element, $rootElement;

  function html(content) {
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function() {
    dealoc(body);
    dealoc(element);
  });

  beforeEach(module('ngAnimateMock'));

  afterEach(function() {
    dealoc(element);
  });

  it('should fire off the enter animation',
    inject(function($compile, $rootScope, $templateCache, $animate) {
      var item;

      $templateCache.put('enter', [200, '<div>data</div>', {}]);
      $rootScope.tpl = 'enter';
      element = $compile(html(
        '<div><div ' +
          'ng-include="tpl">' +
        '</div></div>'
      ))($rootScope);
      $rootScope.$digest();

      var animation = $animate.queue.pop();
      expect(animation.event).toBe('enter');
      expect(animation.element.text()).toBe('data');
    })
  );

  it('should fire off the leave animation',
    inject(function($compile, $rootScope, $templateCache, $animate) {
      var item;
      $templateCache.put('enter', [200, '<div>data</div>', {}]);
      $rootScope.tpl = 'enter';
      element = $compile(html(
        '<div><div ' +
          'ng-include="tpl">' +
        '</div></div>'
      ))($rootScope);
      $rootScope.$digest();

      var animation = $animate.queue.shift();
      expect(animation.event).toBe('enter');
      expect(animation.element.text()).toBe('data');

      $rootScope.tpl = '';
      $rootScope.$digest();

      animation = $animate.queue.shift();
      expect(animation.event).toBe('leave');
      expect(animation.element.text()).toBe('data');
    })
  );

  it('should animate two separate ngInclude elements',
    inject(function($compile, $rootScope, $templateCache, $animate) {
      var item;
      $templateCache.put('one', [200, 'one', {}]);
      $templateCache.put('two', [200, 'two', {}]);
      $rootScope.tpl = 'one';
      element = $compile(html(
        '<div><div ' +
          'ng-include="tpl">' +
        '</div></div>'
      ))($rootScope);
      $rootScope.$digest();

      var item1 = $animate.queue.shift().element;
      expect(item1.text()).toBe('one');

      $rootScope.tpl = 'two';
      $rootScope.$digest();

      var itemA = $animate.queue.shift().element;
      var itemB = $animate.queue.shift().element;
      expect(itemA.attr('ng-include')).toBe('tpl');
      expect(itemB.attr('ng-include')).toBe('tpl');
      expect(itemA).not.toEqual(itemB);
    })
  );

  it('should destroy the previous leave animation if a new one takes place', function() {
    module(function($provide) {
      $provide.decorator('$animate', function($delegate, $$q) {
        var emptyPromise = $$q.defer().promise;
        $delegate.leave = function() {
          return emptyPromise;
        };
        return $delegate;
      });
    });
    inject(function($compile, $rootScope, $animate, $templateCache) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-include="inc">Yo</div>' +
        '</div>'
      ))($scope);

      $templateCache.put('one', [200, '<div>one</div>', {}]);
      $templateCache.put('two', [200, '<div>two</div>', {}]);

      $scope.$apply('inc = "one"');

      var destroyed, inner = element.children(0);
      inner.on('$destroy', function() {
        destroyed = true;
      });

      $scope.$apply('inc = "two"');

      $scope.$apply('inc = "one"');

      $scope.$apply('inc = "two"');

      expect(destroyed).toBe(true);
    });
  });
});
