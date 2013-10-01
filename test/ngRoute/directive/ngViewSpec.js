'use strict';

describe('ngView', function() {
  var element;

  beforeEach(module('ngRoute'));

  beforeEach(module(function($provide) {
    return function($rootScope, $compile, $animate) {
      element = $compile('<div><ng:view onload="load()"></ng:view></div>')($rootScope);
    };
  }));


  afterEach(function(){
    dealoc(element);
  });


  it('should do nothing when no routes are defined',
      inject(function($rootScope, $compile, $location) {
    $location.path('/unknown');
    $rootScope.$digest();
    expect(element.text()).toEqual('');
  }));


  it('should instantiate controller after compiling the content', function() {
    var log = [], controllerScope,
        Ctrl = function($scope) {
          controllerScope = $scope;
          log.push('ctrl-init');
        };

    module(function($compileProvider, $routeProvider) {
      $compileProvider.directive('compileLog', function() {
        return {
          compile: function() {
            log.push('compile');
          }
        };
      });

      $routeProvider.when('/some', {templateUrl: '/tpl.html', controller: Ctrl});
    });

    inject(function($route, $rootScope, $templateCache, $location) {
      $templateCache.put('/tpl.html', [200, '<div compile-log>partial</div>', {}]);
      $location.path('/some');
      $rootScope.$digest();

      expect(controllerScope.$parent).toBe($rootScope);
      expect(controllerScope).toBe($route.current.scope);
      expect(log).toEqual(['compile', 'ctrl-init']);
    });
  });


  it('should instantiate controller with an alias', function() {
    var log = [], controllerScope,
        Ctrl = function($scope) {
          this.name = 'alias';
          controllerScope = $scope;
        };

    module(function($compileProvider, $routeProvider) {
      $routeProvider.when('/some', {templateUrl: '/tpl.html', controller: Ctrl, controllerAs: 'ctrl'});
    });

    inject(function($route, $rootScope, $templateCache, $location) {
      $templateCache.put('/tpl.html', [200, '<div></div>', {}]);
      $location.path('/some');
      $rootScope.$digest();

      expect(controllerScope.ctrl.name).toBe('alias');
    });
  });


  it('should support string controller declaration', function() {
    var MyCtrl = jasmine.createSpy('MyCtrl');

    module(function($controllerProvider, $routeProvider) {
      $controllerProvider.register('MyCtrl', ['$scope', MyCtrl]);
      $routeProvider.when('/foo', {controller: 'MyCtrl', templateUrl: '/tpl.html'});
    });

    inject(function($route, $location, $rootScope, $templateCache) {
      $templateCache.put('/tpl.html', [200, '<div></div>', {}]);
      $location.path('/foo');
      $rootScope.$digest();

      expect($route.current.controller).toBe('MyCtrl');
      expect(MyCtrl).toHaveBeenCalledWith(element.children().scope());
    });
  });


  it('should load content via xhr when route changes', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
      $routeProvider.when('/bar', {templateUrl: 'myUrl2'});
    });

    inject(function($rootScope, $compile, $httpBackend, $location, $route) {
      expect(element.text()).toEqual('');

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('4');

      $location.path('/bar');
      $httpBackend.expect('GET', 'myUrl2').respond('angular is da best');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('angular is da best');
    });
  });


  it('should use inline content route changes', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {template: '<div>{{1+3}}</div>'});
      $routeProvider.when('/bar', {template: 'angular is da best'});
      $routeProvider.when('/blank', {template: ''});
    });

    inject(function($rootScope, $compile, $location, $route) {
      expect(element.text()).toEqual('');

      $location.path('/foo');
      $rootScope.$digest();
      expect(element.text()).toEqual('4');

      $location.path('/bar');
      $rootScope.$digest();
      expect(element.text()).toEqual('angular is da best');

      $location.path('/blank');
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    });
  });


  it('should remove all content when location changes to an unknown route', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
    });

    inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('4');

      $location.path('/unknown');
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    });
  });


  it('should chain scopes and propagate evals to the child scope', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
    });

    inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      $rootScope.parentVar = 'parent';

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{parentVar}}</div>');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('parent');

      $rootScope.parentVar = 'new parent';
      $rootScope.$digest();
      expect(element.text()).toEqual('new parent');
    });
  });


  it('should be possible to nest ngView in ngInclude', function() {

    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'viewPartial.html'});
    });

    inject(function($httpBackend, $location, $route, $compile, $rootScope) {
      $httpBackend.whenGET('includePartial.html').respond('view: <ng:view></ng:view>');
      $httpBackend.whenGET('viewPartial.html').respond('content');
      $location.path('/foo');

      var elm = $compile(
        '<div>' +
          'include: <ng:include src="\'includePartial.html\'"> </ng:include>' +
        '</div>')($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();

      expect(elm.text()).toEqual('include: view: content');
      expect($route.current.templateUrl).toEqual('viewPartial.html');
      dealoc(elm)
    });
  });


  it('should initialize view template after the view controller was initialized even when ' +
     'templates were cached', function() {
     //this is a test for a regression that was introduced by making the ng-view cache sync
    function ParentCtrl($scope) {
       $scope.log.push('parent');
    }

    module(function($routeProvider) {
      $routeProvider.when('/foo', {controller: ParentCtrl, templateUrl: 'viewPartial.html'});
    });


    inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      $rootScope.log = [];

      $rootScope.ChildCtrl = function($scope) {
        $scope.log.push('child');
      };

      $location.path('/foo');
      $httpBackend.expect('GET', 'viewPartial.html').
          respond('<div ng-init="log.push(\'init\')">' +
                    '<div ng-controller="ChildCtrl"></div>' +
                  '</div>');
      $rootScope.$apply();
      $httpBackend.flush();

      expect($rootScope.log).toEqual(['parent', 'init', 'child']);

      $location.path('/');
      $rootScope.$apply();
      expect($rootScope.log).toEqual(['parent', 'init', 'child']);

      $rootScope.log = [];
      $location.path('/foo');
      $rootScope.$apply();

      expect($rootScope.log).toEqual(['parent', 'init', 'child']);
    });
  });


  it('should discard pending xhr callbacks if a new route is requested before the current ' +
      'finished loading',  function() {
    // this is a test for a bad race condition that affected feedback

    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'myUrl1'});
      $routeProvider.when('/bar', {templateUrl: 'myUrl2'});
    });

    inject(function($route, $rootScope, $location, $httpBackend) {
      expect(element.text()).toEqual('');

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
      $rootScope.$digest();
      $location.path('/bar');
      $httpBackend.expect('GET', 'myUrl2').respond('<div>{{1+1}}</div>');
      $rootScope.$digest();
      $httpBackend.flush(); // now that we have two requests pending, flush!

      expect(element.text()).toEqual('2');
    });
  });


  it('should be async even if served from cache', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {controller: noop, templateUrl: 'myUrl1'});
    });

    inject(function($route, $rootScope, $location, $templateCache) {
      $templateCache.put('myUrl1', [200, 'my partial', {}]);
      $location.path('/foo');

      var called = 0;
      // we want to assert only during first watch
      $rootScope.$watch(function() {
        if (!called++) expect(element.text()).toBe('');
      });

      $rootScope.$digest();
      expect(element.text()).toBe('my partial');
    });
  });

  it('should fire $contentLoaded event when content compiled and linked', function() {
    var log = [];
    var logger = function(name) {
      return function() {
        log.push(name);
      };
    };
    var Ctrl = function($scope) {
      $scope.value = 'bound-value';
      log.push('init-ctrl');
    };

    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: Ctrl});
    });

    inject(function($templateCache, $rootScope, $location) {
      $rootScope.$on('$routeChangeStart', logger('$routeChangeStart'));
      $rootScope.$on('$routeChangeSuccess', logger('$routeChangeSuccess'));
      $rootScope.$on('$viewContentLoaded', logger('$viewContentLoaded'));

      $templateCache.put('tpl.html', [200, '{{value}}', {}]);
      $location.path('/foo');
      $rootScope.$digest();

      expect(element.text()).toBe('bound-value');
      expect(log).toEqual([
        '$routeChangeStart', 'init-ctrl', '$viewContentLoaded', '$routeChangeSuccess' ]);
    });
  });

  it('should destroy previous scope', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'tpl.html'});
    });

    inject(function($templateCache, $rootScope, $location) {
      $templateCache.put('tpl.html', [200, 'partial', {}]);

      expect($rootScope.$$childHead).toBeNull();
      expect($rootScope.$$childTail).toBeNull();

      $location.path('/foo');
      $rootScope.$digest();

      expect(element.text()).toBe('partial');
      expect($rootScope.$$childHead).not.toBeNull();
      expect($rootScope.$$childTail).not.toBeNull();

      $location.path('/non/existing/route');
      $rootScope.$digest();

      expect(element.text()).toBe('');
      expect($rootScope.$$childHead).toBeNull();
      expect($rootScope.$$childTail).toBeNull();
    });
  });


  it('should destroy previous scope if multiple route changes occur before server responds',
      function() {
    var log = [];
    var createCtrl = function(name) {
      return function($scope) {
        log.push('init-' + name);
        $scope.$on('$destroy', function() {log.push('destroy-' + name);});
      };
    };

    module(function($routeProvider) {
      $routeProvider.when('/one', {templateUrl: 'one.html', controller: createCtrl('ctrl1')});
      $routeProvider.when('/two', {templateUrl: 'two.html', controller: createCtrl('ctrl2')});
    });

    inject(function($httpBackend, $rootScope, $location) {
      $httpBackend.whenGET('one.html').respond('content 1');
      $httpBackend.whenGET('two.html').respond('content 2');

      $location.path('/one');
      $rootScope.$digest();
      $location.path('/two');
      $rootScope.$digest();

      $httpBackend.flush();
      expect(element.text()).toBe('content 2');
      expect(log).toEqual(['init-ctrl2']);

      $location.path('/non-existing');
      $rootScope.$digest();

      expect(element.text()).toBe('');
      expect(log).toEqual(['init-ctrl2', 'destroy-ctrl2']);

      expect($rootScope.$$childHead).toBeNull();
      expect($rootScope.$$childTail).toBeNull();
    });
  });


  it('should $destroy scope after update and reload',  function() {
    // this is a regression of bug, where $route doesn't copy scope when only updating

    var log = [];

    function logger(msg) {
      return function() {
        log.push(msg);
      };
    }

    function createController(name) {
      return function($scope) {
        log.push('init-' + name);
        $scope.$on('$destroy', logger('destroy-' + name));
        $scope.$on('$routeUpdate', logger('route-update'));
      };
    }

    module(function($routeProvider) {
      $routeProvider.when('/bar', {templateUrl: 'tpl.html', controller: createController('bar')});
      $routeProvider.when('/foo', {
          templateUrl: 'tpl.html', controller: createController('foo'), reloadOnSearch: false});
    });

    inject(function($templateCache, $location, $rootScope) {
      $templateCache.put('tpl.html', [200, 'partial', {}]);

      $location.url('/foo');
      $rootScope.$digest();
      expect(log).toEqual(['init-foo']);

      $location.search({q: 'some'});
      $rootScope.$digest();
      expect(log).toEqual(['init-foo', 'route-update']);

      $location.url('/bar');
      $rootScope.$digest();
      expect(log).toEqual(['init-foo', 'route-update', 'destroy-foo', 'init-bar']);
    });
  });


  it('should evaluate onload expression after linking the content', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'tpl.html'});
    });

    inject(function($templateCache, $location, $rootScope) {
      $templateCache.put('tpl.html', [200, '{{1+1}}', {}]);
      $rootScope.load = jasmine.createSpy('onload');

      $location.url('/foo');
      $rootScope.$digest();
      expect($rootScope.load).toHaveBeenCalledOnce();
    });
  });


  it('should set $scope and $controllerController on the view elements (except for non-element nodes)', function() {
    function MyCtrl($scope) {
      $scope.state = 'WORKS';
      $scope.ctrl = this;
    }

    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: MyCtrl});
    });

    inject(function($templateCache, $location, $rootScope, $route) {
      // in the template the white-space before the div is an intentional non-element node,
      // a text might get wrapped into span so it's safer to just use white space
      $templateCache.put('tpl.html', [200, '   \n   <div>{{state}}</div>', {}]);

      $location.url('/foo');
      $rootScope.$digest();
      // using toMatch because in IE8+jquery the space doesn't get preserved. jquery bug?
      expect(element.text()).toMatch(/\s*WORKS/);

      var div = element.find('div');
      expect(div.parent()[0].nodeName.toUpperCase()).toBeOneOf('NG:VIEW', 'VIEW');

      expect(div.scope()).toBe($route.current.scope);
      expect(div.scope().hasOwnProperty('state')).toBe(true);
      expect(div.scope().state).toEqual('WORKS');

      expect(div.controller()).toBe($route.current.scope.ctrl);
    });
  });

  it('should not set $scope or $controllerController on top level text elements in the view', function() {
    function MyCtrl($scope) {}

    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'tpl.html', controller: MyCtrl});
    });

    inject(function($templateCache, $location, $rootScope, $route) {
      $templateCache.put('tpl.html', '<div></div>  ');
      $location.url('/foo');
      $rootScope.$digest();

      forEach(element.contents(), function(node) {
        if(node.nodeType == 3 /* text node */) {
          expect(jqLite(node).scope()).not.toBe($route.current.scope);
          expect(jqLite(node).controller()).not.toBeDefined();
        } else if(node.nodeType == 8 /* comment node */) {
          expect(jqLite(node).scope()).toBe(element.scope());
          expect(jqLite(node).controller()).toBe(element.controller());
        } else {
          expect(jqLite(node).scope()).toBe($route.current.scope);
          expect(jqLite(node).controller()).toBeDefined();
        }
      });
    });
  });
});

describe('ngView animations', function() {
  var body, element, $rootElement;

  beforeEach(module('ngRoute'));

  function html(html) {
    $rootElement.html(html);
    body.append($rootElement);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
    };
  }));

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });


  beforeEach(module(function($provide, $routeProvider) {
    $routeProvider.when('/foo', {controller: noop, templateUrl: '/foo.html'});
    $routeProvider.when('/bar', {controller: noop, templateUrl: '/bar.html'});
    return function($templateCache) {
      $templateCache.put('/foo.html', [200, '<div>data</div>', {}]);
      $templateCache.put('/bar.html', [200, '<div>data2</div>', {}]);
    }
  }));

  describe('hooks', function() {
    beforeEach(module('mock.animate'));

    it('should fire off the enter animation',
        inject(function($compile, $rootScope, $location, $animate) {
          element = $compile(html('<div ng-view></div>'))($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          var item = $animate.flushNext('enter').element;
          expect(item.text()).toBe('data');
        }));

    it('should fire off the leave animation',
        inject(function($compile, $rootScope, $location, $templateCache, $animate) {

      var item;
      $templateCache.put('/foo.html', [200, '<div>foo</div>', {}]);
      element = $compile(html('<div ng-view></div>'))($rootScope);

      $location.path('/foo');
      $rootScope.$digest();

      item = $animate.flushNext('enter').element;
      expect(item.text()).toBe('foo');

      $location.path('/');
      $rootScope.$digest();

      item = $animate.flushNext('leave').element;
      expect(item.text()).toBe('foo');
    }));

    it('should animate two separate ngView elements',
      inject(function($compile, $rootScope, $templateCache, $animate, $location) {
        var item;
        $rootScope.tpl = 'one';
        element = $compile(html('<div><div ng-view></div></div>'))($rootScope);
        $rootScope.$digest();

        $location.path('/foo');
        $rootScope.$digest();

        item = $animate.flushNext('enter').element;
        expect(item.text()).toBe('data');

        $location.path('/bar');
        $rootScope.$digest();

        var itemA = $animate.flushNext('leave').element;
        expect(itemA).not.toEqual(itemB);
        var itemB = $animate.flushNext('enter').element;
    }));

    it('should render ngClass on ngView',
      inject(function($compile, $rootScope, $templateCache, $animate, $location, $timeout) {

        var item;
        $rootScope.tpl = 'one';
        $rootScope.klass = 'classy';
        element = $compile(html('<div><div ng-view ng-class="klass"></div></div>'))($rootScope);
        $rootScope.$digest();

        $location.path('/foo');
        $rootScope.$digest();

        item = $animate.flushNext('enter').element;

        $animate.flushNext('addClass').element;
        $animate.flushNext('addClass').element;

        expect(item.hasClass('classy')).toBe(true);

        $rootScope.klass = 'boring';
        $rootScope.$digest();

        $animate.flushNext('removeClass').element;
        $animate.flushNext('addClass').element;

        expect(item.hasClass('classy')).toBe(false);
        expect(item.hasClass('boring')).toBe(true);

        $location.path('/bar');
        $rootScope.$digest();

        $animate.flushNext('leave').element;
        item = $animate.flushNext('enter').element;

        $animate.flushNext('addClass').element;
        $animate.flushNext('addClass').element;

        expect(item.hasClass('boring')).toBe(true);
      }));
  });

  it('should not double compile when the route changes', function() {

    module('ngAnimate');
    module('mock.animate');

    var window;
    module(function($routeProvider, $animateProvider, $provide) {
      $routeProvider.when('/foo', {template: '<div ng-repeat="i in [1,2]">{{i}}</div>'});
      $routeProvider.when('/bar', {template: '<div ng-repeat="i in [3,4]">{{i}}</div>'});
      $animateProvider.register('.my-animation', function() {
        return {
          leave: function(element, done) {
            done();
          }
        };
      });
    });

    inject(function($rootScope, $compile, $location, $route, $timeout, $rootElement, $sniffer, $animate) {
      element = $compile(html('<div><ng:view onload="load()" class="my-animation"></ng:view></div>'))($rootScope);
      $animate.enabled(true);

      $location.path('/foo');
      $rootScope.$digest();

      $animate.flushNext('enter'); //ngView
      $animate.flushNext('enter'); //repeat 1
      $animate.flushNext('enter'); //repeat 2

      expect(element.text()).toEqual('12');

      $location.path('/bar');
      $rootScope.$digest();

      $animate.flushNext('leave'); //ngView old

      $rootScope.$digest();

      $animate.flushNext('enter'); //ngView new

      expect(n(element.text())).toEqual(''); //this is midway during the animation

      $animate.flushNext('enter'); //ngRepeat 3
      $animate.flushNext('enter'); //ngRepeat 4

      $rootScope.$digest();

      expect(element.text()).toEqual('34');

      function n(text) {
        return text.replace(/\r\n/m, '').replace(/\r\n/m, '');
      }
    });
  });
});
