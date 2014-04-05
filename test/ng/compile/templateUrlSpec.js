describe('templateUrl', function() {

  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    return function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    };
  }));

  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function(){
    dealoc(element);
  });

  beforeEach(module(
    function() {
      directive('hello', valueFn({
        restrict: 'CAM', templateUrl: 'hello.html', transclude: true
      }));
      directive('cau', valueFn({
        restrict: 'CAM', templateUrl: 'cau.html'
      }));
      directive('crossDomainTemplate', valueFn({
        restrict: 'CAM', templateUrl: 'http://example.com/should-not-load.html'
      }));
      directive('trustedTemplate', function($sce) { return {
        restrict: 'CAM',
        templateUrl: function() {
          return $sce.trustAsResourceUrl('http://example.com/trusted-template.html');
        }};
      });
      directive('cError', valueFn({
        restrict: 'CAM',
        templateUrl:'error.html',
        compile: function() {
          throw Error('cError');
        }
      }));
      directive('lError', valueFn({
        restrict: 'CAM',
        templateUrl: 'error.html',
        compile: function() {
          throw Error('lError');
        }
      }));


      directive('iHello', valueFn({
        restrict: 'CAM',
        replace: true,
        templateUrl: 'hello.html'
      }));
      directive('iCau', valueFn({
        restrict: 'CAM',
        replace: true,
        templateUrl:'cau.html'
      }));

      directive('iCError', valueFn({
        restrict: 'CAM',
        replace: true,
        templateUrl:'error.html',
        compile: function() {
          throw Error('cError');
        }
      }));
      directive('iLError', valueFn({
        restrict: 'CAM',
        replace: true,
        templateUrl: 'error.html',
        compile: function() {
          throw Error('lError');
        }
      }));

      directive('replace', valueFn({
        replace: true,
        template: '<span>Hello, {{name}}!</span>'
      }));

      directive('replaceWithTr', valueFn({
        replace: true,
        templateUrl: 'tr.html'
      }));
      directive('replaceWithTd', valueFn({
        replace: true,
        templateUrl: 'td.html'
      }));
      directive('replaceWithTh', valueFn({
        replace: true,
        templateUrl: 'th.html'
      }));
      directive('replaceWithThead', valueFn({
        replace: true,
        templateUrl: 'thead.html'
      }));
      directive('replaceWithTbody', valueFn({
        replace: true,
        templateUrl: 'tbody.html'
      }));
      directive('replaceWithTfoot', valueFn({
        replace: true,
        templateUrl: 'tfoot.html'
      }));
    }
  ));

  it('should not load cross domain templates by default', inject(
      function($compile, $rootScope, $templateCache, $sce) {
        expect(function() {
          $templateCache.put('http://example.com/should-not-load.html', 'Should not load even if in cache.');
          $compile('<div class="crossDomainTemplate"></div>')($rootScope);
        }).toThrowMinErr('$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/should-not-load.html');
  }));

  it('should load cross domain templates when trusted', inject(
      function($compile, $httpBackend, $rootScope, $sce) {
        $httpBackend.expect('GET', 'http://example.com/trusted-template.html').respond('<span>example.com/trusted_template_contents</span>');
        element = $compile('<div class="trustedTemplate"></div>')($rootScope);
        expect(sortedHtml(element)).
            toEqual('<div class="trustedTemplate"></div>');
        $httpBackend.flush();
        expect(sortedHtml(element)).
            toEqual('<div class="trustedTemplate"><span>example.com/trusted_template_contents</span></div>');
  }));

  it('should append template via $http and cache it in $templateCache', inject(
      function($compile, $httpBackend, $templateCache, $rootScope, $browser) {
        $httpBackend.expect('GET', 'hello.html').respond('<span>Hello!</span> World!');
        $templateCache.put('cau.html', '<span>Cau!</span>');
        element = $compile('<div><b class="hello">ignore</b><b class="cau">ignore</b></div>')($rootScope);
        expect(sortedHtml(element)).
            toEqual('<div><b class="hello"></b><b class="cau"></b></div>');

        $rootScope.$digest();


        expect(sortedHtml(element)).
            toEqual('<div><b class="hello"></b><b class="cau"><span>Cau!</span></b></div>');

        $httpBackend.flush();
        expect(sortedHtml(element)).toEqual(
            '<div>' +
              '<b class="hello"><span>Hello!</span> World!</b>' +
              '<b class="cau"><span>Cau!</span></b>' +
            '</div>');
      }
  ));


  it('should inline template via $http and cache it in $templateCache', inject(
      function($compile, $httpBackend, $templateCache, $rootScope) {
        $httpBackend.expect('GET', 'hello.html').respond('<span>Hello!</span>');
        $templateCache.put('cau.html', '<span>Cau!</span>');
        element = $compile('<div><b class=i-hello>ignore</b><b class=i-cau>ignore</b></div>')($rootScope);
        expect(sortedHtml(element)).
            toEqual('<div><b class="i-hello"></b><b class="i-cau"></b></div>');

        $rootScope.$digest();


        expect(sortedHtml(element)).toBeOneOf(
            '<div><b class="i-hello"></b><span class="i-cau">Cau!</span></div>',
            '<div><b class="i-hello"></b><span class="i-cau" i-cau="">Cau!</span></div>' //ie8
        );

        $httpBackend.flush();
        expect(sortedHtml(element)).toBeOneOf(
            '<div><span class="i-hello">Hello!</span><span class="i-cau">Cau!</span></div>',
            '<div><span class="i-hello" i-hello="">Hello!</span><span class="i-cau" i-cau="">Cau!</span></div>' //ie8
        );
      }
  ));


  it('should compile, link and flush the template append', inject(
      function($compile, $templateCache, $rootScope, $browser) {
        $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
        $rootScope.name = 'Elvis';
        element = $compile('<div><b class="hello"></b></div>')($rootScope);

        $rootScope.$digest();

        expect(sortedHtml(element)).
            toEqual('<div><b class="hello"><span>Hello, Elvis!</span></b></div>');
      }
  ));


  it('should compile, link and flush the template inline', inject(
      function($compile, $templateCache, $rootScope) {
        $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
        $rootScope.name = 'Elvis';
        element = $compile('<div><b class=i-hello></b></div>')($rootScope);

        $rootScope.$digest();

        expect(sortedHtml(element)).toBeOneOf(
            '<div><span class="i-hello">Hello, Elvis!</span></div>',
            '<div><span class="i-hello" i-hello="">Hello, Elvis!</span></div>' //ie8
        );
      }
  ));


  it('should compile, flush and link the template append', inject(
      function($compile, $templateCache, $rootScope) {
        $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
        $rootScope.name = 'Elvis';
        var template = $compile('<div><b class="hello"></b></div>');

        element = template($rootScope);
        $rootScope.$digest();

        expect(sortedHtml(element)).
            toEqual('<div><b class="hello"><span>Hello, Elvis!</span></b></div>');
      }
  ));


  it('should compile, flush and link the template inline', inject(
      function($compile, $templateCache, $rootScope) {
        $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
        $rootScope.name = 'Elvis';
        var template = $compile('<div><b class=i-hello></b></div>');

        element = template($rootScope);
        $rootScope.$digest();

        expect(sortedHtml(element)).toBeOneOf(
            '<div><span class="i-hello">Hello, Elvis!</span></div>',
            '<div><span class="i-hello" i-hello="">Hello, Elvis!</span></div>' //ie8
        );
      }
  ));


  it('should compile template when replacing element in another template',
      inject(function($compile, $templateCache, $rootScope) {
    $templateCache.put('hello.html', '<div replace></div>');
    $rootScope.name = 'Elvis';
    element = $compile('<div><b class="hello"></b></div>')($rootScope);

    $rootScope.$digest();

    expect(sortedHtml(element)).
      toEqual('<div><b class="hello"><span replace="">Hello, Elvis!</span></b></div>');
  }));


  it('should compile template when replacing root element',
      inject(function($compile, $templateCache, $rootScope) {
        $rootScope.name = 'Elvis';
        element = $compile('<div replace></div>')($rootScope);

        $rootScope.$digest();

        expect(sortedHtml(element)).
            toEqual('<span replace="">Hello, Elvis!</span>');
      }));


  it('should resolve widgets after cloning in append mode', function() {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
    inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
             $exceptionHandler) {
      $httpBackend.expect('GET', 'hello.html').respond('<span>{{greeting}} </span>');
      $httpBackend.expect('GET', 'error.html').respond('<div></div>');
      $templateCache.put('cau.html', '<span>{{name}}</span>');
      $rootScope.greeting = 'Hello';
      $rootScope.name = 'Elvis';
      var template = $compile(
        '<div>' +
          '<b class="hello"></b>' +
          '<b class="cau"></b>' +
          '<b class=c-error></b>' +
          '<b class=l-error></b>' +
        '</div>');
      var e1;
      var e2;

      e1 = template($rootScope.$new(), noop); // clone
      expect(e1.text()).toEqual('');

      $httpBackend.flush();

      e2 = template($rootScope.$new(), noop); // clone
      $rootScope.$digest();
      expect(e1.text()).toEqual('Hello Elvis');
      expect(e2.text()).toEqual('Hello Elvis');

      expect($exceptionHandler.errors.length).toEqual(2);
      expect($exceptionHandler.errors[0][0].message).toEqual('cError');
      expect($exceptionHandler.errors[1][0].message).toEqual('lError');

      dealoc(e1);
      dealoc(e2);
    });
  });

  it('should resolve widgets after cloning in append mode without $templateCache', function() {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
    inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                    $exceptionHandler) {
      $httpBackend.expect('GET', 'cau.html').respond('<span>{{name}}</span>');
      $rootScope.name = 'Elvis';
      var template = $compile('<div class="cau"></div>');
      var e1;
      var e2;

      e1 = template($rootScope.$new(), noop); // clone
      expect(e1.text()).toEqual('');

      $httpBackend.flush();

      e2 = template($rootScope.$new(), noop); // clone
      $rootScope.$digest();
      expect(e1.text()).toEqual('Elvis');
      expect(e2.text()).toEqual('Elvis');

      dealoc(e1);
      dealoc(e2);
    });
  });

  it('should resolve widgets after cloning in inline mode', function() {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
    inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
             $exceptionHandler) {
      $httpBackend.expect('GET', 'hello.html').respond('<span>{{greeting}} </span>');
      $httpBackend.expect('GET', 'error.html').respond('<div></div>');
      $templateCache.put('cau.html', '<span>{{name}}</span>');
      $rootScope.greeting = 'Hello';
      $rootScope.name = 'Elvis';
      var template = $compile(
        '<div>' +
          '<b class=i-hello></b>' +
          '<b class=i-cau></b>' +
          '<b class=i-c-error></b>' +
          '<b class=i-l-error></b>' +
        '</div>');
      var e1;
      var e2;

      e1 = template($rootScope.$new(), noop); // clone
      expect(e1.text()).toEqual('');

      $httpBackend.flush();

      e2 = template($rootScope.$new(), noop); // clone
      $rootScope.$digest();
      expect(e1.text()).toEqual('Hello Elvis');
      expect(e2.text()).toEqual('Hello Elvis');

      expect($exceptionHandler.errors.length).toEqual(2);
      expect($exceptionHandler.errors[0][0].message).toEqual('cError');
      expect($exceptionHandler.errors[1][0].message).toEqual('lError');

      dealoc(e1);
      dealoc(e2);
    });
  });

  it('should resolve widgets after cloning in inline mode without $templateCache', function() {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
    inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                    $exceptionHandler) {
      $httpBackend.expect('GET', 'cau.html').respond('<span>{{name}}</span>');
      $rootScope.name = 'Elvis';
      var template = $compile('<div class="i-cau"></div>');
      var e1;
      var e2;

      e1 = template($rootScope.$new(), noop); // clone
      expect(e1.text()).toEqual('');

      $httpBackend.flush();

      e2 = template($rootScope.$new(), noop); // clone
      $rootScope.$digest();
      expect(e1.text()).toEqual('Elvis');
      expect(e2.text()).toEqual('Elvis');

      dealoc(e1);
      dealoc(e2);
    });
  });


  it('should be implicitly terminal and not compile placeholder content in append', inject(
      function($compile, $templateCache, $rootScope, log) {
        // we can't compile the contents because that would result in a memory leak

        $templateCache.put('hello.html', 'Hello!');
        element = $compile('<div><b class="hello"><div log></div></b></div>')($rootScope);

        expect(log).toEqual('');
      }
  ));


  it('should be implicitly terminal and not compile placeholder content in inline', inject(
      function($compile, $templateCache, $rootScope, log) {
        // we can't compile the contents because that would result in a memory leak

        $templateCache.put('hello.html', 'Hello!');
        element = $compile('<div><b class=i-hello><div log></div></b></div>')($rootScope);

        expect(log).toEqual('');
      }
  ));


  it('should throw an error and clear element content if the template fails to load', inject(
      function($compile, $httpBackend, $rootScope) {
        $httpBackend.expect('GET', 'hello.html').respond(404, 'Not Found!');
        element = $compile('<div><b class="hello">content</b></div>')($rootScope);

        expect(function() {
          $httpBackend.flush();
        }).toThrowMinErr('$compile', 'tpload', 'Failed to load template: hello.html');
        expect(sortedHtml(element)).toBe('<div><b class="hello"></b></div>');
      }
  ));


  it('should prevent multiple templates per element', function() {
    module(function() {
      directive('sync', valueFn({
        restrict: 'C',
        template: '<span></span>'
      }));
      directive('async', valueFn({
        restrict: 'C',
        templateUrl: 'template.html'
      }));
    });
    inject(function($compile, $httpBackend){
      $httpBackend.whenGET('template.html').respond('<p>template.html</p>');
      expect(function() {
        $compile('<div><div class="sync async"></div></div>');
        $httpBackend.flush();
      }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [async, sync] asking for template on: '+
          '<div class="sync async">');
    });
  });


  it('should copy classes from pre-template node into linked element', function() {
    module(function() {
      directive('test', valueFn({
        templateUrl: 'test.html',
        replace: true
      }));
    });
    inject(function($compile, $templateCache, $rootScope) {
      var child;
      $templateCache.put('test.html', '<p class="template-class">Hello</p>');
      element = $compile('<div test></div>')($rootScope, function(node) {
        node.addClass('clonefn-class');
      });
      $rootScope.$digest();
      expect(element).toHaveClass('template-class');
      expect(element).toHaveClass('clonefn-class');
    });
  });


  describe('delay compile / linking functions until after template is resolved', function(){
    var template;
    beforeEach(module(function() {
      function logDirective (name, priority, options) {
        directive(name, function(log) {
          return (extend({
           priority: priority,
           compile: function() {
             log(name + '-C');
             return {
               pre: function() { log(name + '-PreL'); },
               post: function() { log(name + '-PostL'); }
             }
           }
         }, options || {}));
        });
      }

      logDirective('first', 10);
      logDirective('second', 5, { templateUrl: 'second.html' });
      logDirective('third', 3);
      logDirective('last', 0);

      logDirective('iFirst', 10, {replace: true});
      logDirective('iSecond', 5, {replace: true, templateUrl: 'second.html' });
      logDirective('iThird', 3, {replace: true});
      logDirective('iLast', 0, {replace: true});
    }));

    it('should flush after link append', inject(
        function($compile, $rootScope, $httpBackend, log) {
      $httpBackend.expect('GET', 'second.html').respond('<div third>{{1+2}}</div>');
      template = $compile('<div><span first second last></span></div>');
      element = template($rootScope);
      expect(log).toEqual('first-C');

      log('FLUSH');
      $httpBackend.flush();
      $rootScope.$digest();
      expect(log).toEqual(
        'first-C; FLUSH; second-C; last-C; third-C; ' +
        'first-PreL; second-PreL; last-PreL; third-PreL; ' +
        'third-PostL; last-PostL; second-PostL; first-PostL');

      var span = element.find('span');
      expect(span.attr('first')).toEqual('');
      expect(span.attr('second')).toEqual('');
      expect(span.find('div').attr('third')).toEqual('');
      expect(span.attr('last')).toEqual('');

      expect(span.text()).toEqual('3');
    }));


    it('should flush after link inline', inject(
        function($compile, $rootScope, $httpBackend, log) {
      $httpBackend.expect('GET', 'second.html').respond('<div i-third>{{1+2}}</div>');
      template = $compile('<div><span i-first i-second i-last></span></div>');
      element = template($rootScope);
      expect(log).toEqual('iFirst-C');

      log('FLUSH');
      $httpBackend.flush();
      $rootScope.$digest();
      expect(log).toEqual(
        'iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C; ' +
        'iFirst-PreL; iSecond-PreL; iThird-PreL; iLast-PreL; ' +
        'iLast-PostL; iThird-PostL; iSecond-PostL; iFirst-PostL');

      var div = element.find('div');
      expect(div.attr('i-first')).toEqual('');
      expect(div.attr('i-second')).toEqual('');
      expect(div.attr('i-third')).toEqual('');
      expect(div.attr('i-last')).toEqual('');

      expect(div.text()).toEqual('3');
    }));


    it('should flush before link append', inject(
        function($compile, $rootScope, $httpBackend, log) {
      $httpBackend.expect('GET', 'second.html').respond('<div third>{{1+2}}</div>');
      template = $compile('<div><span first second last></span></div>');
      expect(log).toEqual('first-C');
      log('FLUSH');
      $httpBackend.flush();
      expect(log).toEqual('first-C; FLUSH; second-C; last-C; third-C');

      element = template($rootScope);
      $rootScope.$digest();
      expect(log).toEqual(
        'first-C; FLUSH; second-C; last-C; third-C; ' +
        'first-PreL; second-PreL; last-PreL; third-PreL; ' +
        'third-PostL; last-PostL; second-PostL; first-PostL');

      var span = element.find('span');
      expect(span.attr('first')).toEqual('');
      expect(span.attr('second')).toEqual('');
      expect(span.find('div').attr('third')).toEqual('');
      expect(span.attr('last')).toEqual('');

      expect(span.text()).toEqual('3');
    }));


    it('should flush before link inline', inject(
        function($compile, $rootScope, $httpBackend, log) {
      $httpBackend.expect('GET', 'second.html').respond('<div i-third>{{1+2}}</div>');
      template = $compile('<div><span i-first i-second i-last></span></div>');
      expect(log).toEqual('iFirst-C');
      log('FLUSH');
      $httpBackend.flush();
      expect(log).toEqual('iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C');

      element = template($rootScope);
      $rootScope.$digest();
      expect(log).toEqual(
        'iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C; ' +
        'iFirst-PreL; iSecond-PreL; iThird-PreL; iLast-PreL; ' +
        'iLast-PostL; iThird-PostL; iSecond-PostL; iFirst-PostL');

      var div = element.find('div');
      expect(div.attr('i-first')).toEqual('');
      expect(div.attr('i-second')).toEqual('');
      expect(div.attr('i-third')).toEqual('');
      expect(div.attr('i-last')).toEqual('');

      expect(div.text()).toEqual('3');
    }));
  });


  it('should allow multiple elements in template', inject(function($compile, $httpBackend) {
    $httpBackend.expect('GET', 'hello.html').respond('before <b>mid</b> after');
    element = jqLite('<div hello></div>');
    $compile(element);
    $httpBackend.flush();
    expect(element.text()).toEqual('before mid after');
  }));


  it('should work when directive is on the root element', inject(
    function($compile, $httpBackend, $rootScope) {
      $httpBackend.expect('GET', 'hello.html').
          respond('<span>3==<span ng-transclude></span></span>');
      element = jqLite('<b class="hello">{{1+2}}</b>');
      $compile(element)($rootScope);

      $httpBackend.flush();
      expect(element.text()).toEqual('3==3');
    }
  ));


  it('should work when directive is in a repeater', inject(
    function($compile, $httpBackend, $rootScope) {
      $httpBackend.expect('GET', 'hello.html').
          respond('<span>i=<span ng-transclude></span>;</span>');
      element = jqLite('<div><b class=hello ng-repeat="i in [1,2]">{{i}}</b></div>');
      $compile(element)($rootScope);

      $httpBackend.flush();
      expect(element.text()).toEqual('i=1;i=2;');
    }
  ));


  it("should fail if replacing and template doesn't have a single root element", function() {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');

      directive('template', function() {
        return {
          replace: true,
          templateUrl: 'template.html'
        }
      });
    });

    inject(function($compile, $templateCache, $rootScope, $exceptionHandler) {
      // no root element
      $templateCache.put('template.html', 'dada');
      $compile('<p template></p>');
      $rootScope.$digest();
      expect($exceptionHandler.errors.pop().message).
          toMatch(/\[\$compile:tplrt\] Template for directive 'template' must have exactly one root element\. template\.html/);

      // multi root
      $templateCache.put('template.html', '<div></div><div></div>');
      $compile('<p template></p>');
      $rootScope.$digest();
      expect($exceptionHandler.errors.pop().message).
          toMatch(/\[\$compile:tplrt\] Template for directive 'template' must have exactly one root element\. template\.html/);

      // ws is ok
      $templateCache.put('template.html', '  <div></div> \n');
      $compile('<p template></p>');
      $rootScope.$apply();
      expect($exceptionHandler.errors).toEqual([]);
    });
  });


  it('should resume delayed compilation without duplicates when in a repeater', function() {
    // this is a test for a regression
    // scope creation, isolate watcher setup, controller instantiation, etc should happen
    // only once even if we are dealing with delayed compilation of a node due to templateUrl
    // and the template node is in a repeater

    var controllerSpy = jasmine.createSpy('controller');

    module(function($compileProvider) {
      $compileProvider.directive('delayed', valueFn({
        controller: controllerSpy,
        templateUrl: 'delayed.html',
        scope: {
          title: '@'
        }
      }));
    });

    inject(function($templateCache, $compile, $rootScope) {
      $rootScope.coolTitle = 'boom!';
      $templateCache.put('delayed.html', '<div>{{title}}</div>');
      element = $compile(
          '<div><div ng-repeat="i in [1,2]"><div delayed title="{{coolTitle + i}}"></div>|</div></div>'
      )($rootScope);

      $rootScope.$apply();

      expect(controllerSpy.callCount).toBe(2);
      expect(element.text()).toBe('boom!1|boom!2|');
    });
  });


  it('should support templateUrl with replace', function() {
    // a regression https://github.com/angular/angular.js/issues/3792
    module(function($compileProvider) {
      $compileProvider.directive('simple', function() {
        return {
          templateUrl: '/some.html',
          replace: true
        };
      });
    });

    inject(function($templateCache, $rootScope, $compile) {
      $templateCache.put('/some.html',
        '<div ng-switch="i">' +
          '<div ng-switch-when="1">i = 1</div>' +
          '<div ng-switch-default>I dont know what `i` is.</div>' +
        '</div>');

      element = $compile('<div simple></div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.i = 1;
      });

      expect(element.html()).toContain('i = 1');
    });
  });

  it('should support templates with root <tr> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('tr.html', '<tr><td>TR</td></tr>');
    expect(function() {
      element = $compile('<div replace-with-tr></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/tr/i);
  }));

  it('should support templates with root <td> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('td.html', '<td>TD</td>');
    expect(function() {
      element = $compile('<div replace-with-td></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/td/i);
  }));

  it('should support templates with root <th> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('th.html', '<th>TH</th>');
    expect(function() {
      element = $compile('<div replace-with-th></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/th/i);
  }));

  it('should support templates with root <thead> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('thead.html', '<thead><tr><td>TD</td></tr></thead>');
    expect(function() {
      element = $compile('<div replace-with-thead></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/thead/i);
  }));

  it('should support templates with root <tbody> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('tbody.html', '<tbody><tr><td>TD</td></tr></tbody>');
    expect(function() {
      element = $compile('<div replace-with-tbody></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/tbody/i);
  }));

  it('should support templates with root <tfoot> tags', inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('tfoot.html', '<tfoot><tr><td>TD</td></tr></tfoot>');
    expect(function() {
      element = $compile('<div replace-with-tfoot></div>')($rootScope);
    }).not.toThrow();
    $rootScope.$digest();
    expect(nodeName_(element)).toMatch(/tfoot/i);
  }));
});
