describe('scope', function() {
  var iscope;

  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    directive('log', function(log) {
      return {
        restrict: 'CAM',
        priority:0,
        compile: valueFn(function(scope, element, attrs) {
          log(attrs.log || 'LOG');
        })
      };
    });

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

  beforeEach(module(function() {
    forEach(['', 'a', 'b'], function(name) {
      directive('scope' + uppercase(name), function(log) {
        return {
          scope: true,
          restrict: 'CA',
          compile: function() {
            return {pre: function (scope, element) {
              log(scope.$id);
              expect(element.data('$scope')).toBe(scope);
            }};
          }
        };
      });
      directive('iscope' + uppercase(name), function(log) {
        return {
          scope: {},
          restrict: 'CA',
          compile: function() {
            return function (scope, element) {
              iscope = scope;
              log(scope.$id);
              expect(element.data('$isolateScopeNoTemplate')).toBe(scope);
            };
          }
        };
      });
      directive('tscope' + uppercase(name), function(log) {
        return {
          scope: true,
          restrict: 'CA',
          templateUrl: 'tscope.html',
          compile: function() {
            return function (scope, element) {
              log(scope.$id);
              expect(element.data('$scope')).toBe(scope);
            };
          }
        };
      });
      directive('trscope' + uppercase(name), function(log) {
        return {
          scope: true,
          replace: true,
          restrict: 'CA',
          templateUrl: 'trscope.html',
          compile: function() {
            return function (scope, element) {
              log(scope.$id);
              expect(element.data('$scope')).toBe(scope);
            };
          }
        };
      });
      directive('tiscope' + uppercase(name), function(log) {
        return {
          scope: {},
          restrict: 'CA',
          templateUrl: 'tiscope.html',
          compile: function() {
            return function (scope, element) {
              iscope = scope;
              log(scope.$id);
              expect(element.data('$isolateScope')).toBe(scope);
            };
          }
        };
      });
    });
    directive('log', function(log) {
      return {
        restrict: 'CA',
        link: {pre: function(scope) {
          log('log-' + scope.$id + '-' + (scope.$parent && scope.$parent.$id || 'no-parent'));
        }}
      };
    });
  }));


  it('should allow creation of new scopes', inject(function($rootScope, $compile, log) {
    element = $compile('<div><span scope><a log></a></span></div>')($rootScope);
    expect(log).toEqual('002; log-002-001; LOG');
    expect(element.find('span').hasClass('ng-scope')).toBe(true);
  }));


  it('should allow creation of new isolated scopes for directives', inject(
      function($rootScope, $compile, log) {
    element = $compile('<div><span iscope><a log></a></span></div>')($rootScope);
    expect(log).toEqual('log-001-no-parent; LOG; 002');
    $rootScope.name = 'abc';
    expect(iscope.$parent).toBe($rootScope);
    expect(iscope.name).toBeUndefined();
  }));


  it('should allow creation of new scopes for directives with templates', inject(
      function($rootScope, $compile, log, $httpBackend) {
    $httpBackend.expect('GET', 'tscope.html').respond('<a log>{{name}}; scopeId: {{$id}}</a>');
    element = $compile('<div><span tscope></span></div>')($rootScope);
    $httpBackend.flush();
    expect(log).toEqual('log-002-001; LOG; 002');
    $rootScope.name = 'Jozo';
    $rootScope.$apply();
    expect(element.text()).toBe('Jozo; scopeId: 002');
    expect(element.find('span').scope().$id).toBe('002');
  }));


  it('should allow creation of new scopes for replace directives with templates', inject(
      function($rootScope, $compile, log, $httpBackend) {
    $httpBackend.expect('GET', 'trscope.html').
        respond('<p><a log>{{name}}; scopeId: {{$id}}</a></p>');
    element = $compile('<div><span trscope></span></div>')($rootScope);
    $httpBackend.flush();
    expect(log).toEqual('log-002-001; LOG; 002');
    $rootScope.name = 'Jozo';
    $rootScope.$apply();
    expect(element.text()).toBe('Jozo; scopeId: 002');
    expect(element.find('a').scope().$id).toBe('002');
  }));


  it('should allow creation of new scopes for replace directives with templates in a repeater',
      inject(function($rootScope, $compile, log, $httpBackend) {
    $httpBackend.expect('GET', 'trscope.html').
        respond('<p><a log>{{name}}; scopeId: {{$id}} |</a></p>');
    element = $compile('<div><span ng-repeat="i in [1,2,3]" trscope></span></div>')($rootScope);
    $httpBackend.flush();
    expect(log).toEqual('log-003-002; LOG; 003; log-005-004; LOG; 005; log-007-006; LOG; 007');
    $rootScope.name = 'Jozo';
    $rootScope.$apply();
    expect(element.text()).toBe('Jozo; scopeId: 003 |Jozo; scopeId: 005 |Jozo; scopeId: 007 |');
    expect(element.find('p').scope().$id).toBe('003');
    expect(element.find('a').scope().$id).toBe('003');
  }));


  it('should allow creation of new isolated scopes for directives with templates', inject(
      function($rootScope, $compile, log, $httpBackend) {
    $httpBackend.expect('GET', 'tiscope.html').respond('<a log></a>');
    element = $compile('<div><span tiscope></span></div>')($rootScope);
    $httpBackend.flush();
    expect(log).toEqual('log-002-001; LOG; 002');
    $rootScope.name = 'abc';
    expect(iscope.$parent).toBe($rootScope);
    expect(iscope.name).toBeUndefined();
  }));


  it('should correctly create the scope hierachy', inject(
    function($rootScope, $compile, log) {
      element = $compile(
          '<div>' + //1
            '<b class=scope>' + //2
              '<b class=scope><b class=log></b></b>' + //3
              '<b class=log></b>' +
            '</b>' +
            '<b class=scope>' + //4
              '<b class=log></b>' +
            '</b>' +
          '</div>'
        )($rootScope);
      expect(log).toEqual('002; 003; log-003-002; LOG; log-002-001; LOG; 004; log-004-001; LOG');
    })
  );


  it('should allow more than one new scope directives per element, but directives should share' +
      'the scope', inject(
    function($rootScope, $compile, log) {
      element = $compile('<div class="scope-a; scope-b"></div>')($rootScope);
      expect(log).toEqual('002; 002');
    })
  );

  it('should not allow more then one isolate scope creation per element', inject(
    function($rootScope, $compile) {
      expect(function(){
        $compile('<div class="iscope-a; scope-b"></div>');
      }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [iscopeA, scopeB] asking for new/isolated scope on: ' +
          '<div class="iscope-a; scope-b">');
    })
  );


  it('should create new scope even at the root of the template', inject(
    function($rootScope, $compile, log) {
      element = $compile('<div scope-a></div>')($rootScope);
      expect(log).toEqual('002');
    })
  );


  it('should create isolate scope even at the root of the template', inject(
    function($rootScope, $compile, log) {
      element = $compile('<div iscope></div>')($rootScope);
      expect(log).toEqual('002');
    })
  );


  describe('scope()/isolate() scope getters', function() {

    describe('with no directives', function() {

      it('should return the scope of the parent node', inject(
        function($rootScope, $compile) {
          element = $compile('<div></div>')($rootScope);
          expect(element.scope()).toBe($rootScope);
        })
      );
    });


    describe('with new scope directives', function() {

      it('should return the new scope at the directive element', inject(
        function($rootScope, $compile) {
          element = $compile('<div scope></div>')($rootScope);
          expect(element.scope().$parent).toBe($rootScope);
        })
      );


      it('should return the new scope for children in the original template', inject(
        function($rootScope, $compile) {
          element = $compile('<div scope><a></a></div>')($rootScope);
          expect(element.find('a').scope().$parent).toBe($rootScope);
        })
      );


      it('should return the new scope for children in the directive template', inject(
        function($rootScope, $compile, $httpBackend) {
          $httpBackend.expect('GET', 'tscope.html').respond('<a></a>');
          element = $compile('<div tscope></div>')($rootScope);
          $httpBackend.flush();
          expect(element.find('a').scope().$parent).toBe($rootScope);
        })
      );
    });


    describe('with isolate scope directives', function() {

      it('should return the root scope for directives at the root element', inject(
        function($rootScope, $compile) {
          element = $compile('<div iscope></div>')($rootScope);
          expect(element.scope()).toBe($rootScope);
        })
      );


      it('should return the non-isolate scope at the directive element', inject(
        function($rootScope, $compile) {
          var directiveElement;
          element = $compile('<div><div iscope></div></div>')($rootScope);
          directiveElement = element.children();
          expect(directiveElement.scope()).toBe($rootScope);
          expect(directiveElement.isolateScope().$parent).toBe($rootScope);
        })
      );


      it('should return the isolate scope for children in the original template', inject(
        function($rootScope, $compile) {
          element = $compile('<div iscope><a></a></div>')($rootScope);
          expect(element.find('a').scope()).toBe($rootScope); //xx
        })
      );


      it('should return the isolate scope for children in directive template', inject(
        function($rootScope, $compile, $httpBackend) {
          $httpBackend.expect('GET', 'tiscope.html').respond('<a></a>');
          element = $compile('<div tiscope></div>')($rootScope);
          expect(element.isolateScope()).toBeUndefined(); // this is the current behavior, not desired feature
          $httpBackend.flush();
          expect(element.find('a').scope()).toBe(element.isolateScope());
          expect(element.isolateScope()).not.toBe($rootScope);
        })
      );
    });


    describe('with isolate scope directives and directives that manually create a new scope', function() {

      it('should return the new scope at the directive element', inject(
        function($rootScope, $compile) {
          var directiveElement;
          element = $compile('<div><a ng-if="true" iscope></a></div>')($rootScope);
          $rootScope.$apply();
          directiveElement = element.find('a');
          expect(directiveElement.scope().$parent).toBe($rootScope);
          expect(directiveElement.scope()).not.toBe(directiveElement.isolateScope());
        })
      );


      it('should return the isolate scope for child elements', inject(
        function($rootScope, $compile, $httpBackend) {
          var directiveElement, child;
          $httpBackend.expect('GET', 'tiscope.html').respond('<span></span>');
          element = $compile('<div><a ng-if="true" tiscope></a></div>')($rootScope);
          $rootScope.$apply();
          $httpBackend.flush();
          directiveElement = element.find('a');
          child = directiveElement.find('span');
          expect(child.scope()).toBe(directiveElement.isolateScope());
        })
      );
    });
  });
});
