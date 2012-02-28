'use strict';

describe('widget', function() {
  var element;

  afterEach(function(){
    dealoc(element);
  });

  describe('ng:switch', function() {
    it('should switch on value change', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="select">' +
          '<div ng:switch-when="1">first:{{name}}</div>' +
          '<div ng:switch-when="2">second:{{name}}</div>' +
          '<div ng:switch-when="true">true:{{name}}</div>' +
        '</div>')($rootScope);
      expect(element.html()).toEqual(
          '<!-- ngSwitchWhen: 1 --><!-- ngSwitchWhen: 2 --><!-- ngSwitchWhen: true -->');
      $rootScope.select = 1;
      $rootScope.$apply();
      expect(element.text()).toEqual('first:');
      $rootScope.name="shyam";
      $rootScope.$apply();
      expect(element.text()).toEqual('first:shyam');
      $rootScope.select = 2;
      $rootScope.$apply();
      expect(element.text()).toEqual('second:shyam');
      $rootScope.name = 'misko';
      $rootScope.$apply();
      expect(element.text()).toEqual('second:misko');
      $rootScope.select = true;
      $rootScope.$apply();
      expect(element.text()).toEqual('true:misko');
    }));


    it('should switch on switch-when-default', inject(function($rootScope, $compile) {
      element = $compile(
        '<ng:switch on="select">' +
          '<div ng:switch-when="1">one</div>' +
          '<div ng:switch-default>other</div>' +
        '</ng:switch>')($rootScope);
      $rootScope.$apply();
      expect(element.text()).toEqual('other');
      $rootScope.select = 1;
      $rootScope.$apply();
      expect(element.text()).toEqual('one');
    }));


    it('should call change on switch', inject(function($rootScope, $compile) {
      element = $compile(
        '<ng:switch on="url" change="name=\'works\'">' +
          '<div ng:switch-when="a">{{name}}</div>' +
        '</ng:switch>')($rootScope);
      $rootScope.url = 'a';
      $rootScope.$apply();
      expect($rootScope.name).toEqual('works');
      expect(element.text()).toEqual('works');
    }));
  });


  describe('ng:include', function() {

    function putIntoCache(url, content) {
      return function($templateCache) {
        $templateCache.put(url, [200, content, {}]);
      };
    }


    it('should include on external file', inject(putIntoCache('myUrl', '{{name}}'),
        function($rootScope, $compile, $browser) {
      element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      element = $compile(element)($rootScope);
      $rootScope.childScope = $rootScope.$new();
      $rootScope.childScope.name = 'misko';
      $rootScope.url = 'myUrl';
      $rootScope.$digest();
      expect(element.text()).toEqual('misko');
    }));


    it('should remove previously included text if a falsy value is bound to src', inject(
          putIntoCache('myUrl', '{{name}}'),
          function($rootScope, $compile, $browser) {
      element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      element = $compile(element)($rootScope);
      $rootScope.childScope = $rootScope.$new();
      $rootScope.childScope.name = 'igor';
      $rootScope.url = 'myUrl';
      $rootScope.$digest();

      expect(element.text()).toEqual('igor');

      $rootScope.url = undefined;
      $rootScope.$digest();

      expect(element.text()).toEqual('');
    }));


    it('should allow this for scope', inject(putIntoCache('myUrl', '{{"abc"}}'),
          function($rootScope, $compile, $browser) {
      element = jqLite('<ng:include src="url" scope="this"></ng:include>');
      element = $compile(element)($rootScope);
      $rootScope.url = 'myUrl';
      $rootScope.$digest();

      // TODO(misko): because we are using scope==this, the eval gets registered
      // during the flush phase and hence does not get called.
      // I don't think passing 'this' makes sense. Does having scope on ng:include makes sense?
      // should we make scope="this" illegal?
      $rootScope.$digest();

      expect(element.text()).toEqual('abc');
    }));


    it('should evaluate onload expression when a partial is loaded', inject(
        putIntoCache('myUrl', 'my partial'),
        function($rootScope, $compile, $browser) {
      element = jqLite('<ng:include src="url" onload="loaded = true"></ng:include>');
      element = $compile(element)($rootScope);

      expect($rootScope.loaded).not.toBeDefined();

      $rootScope.url = 'myUrl';
      $rootScope.$digest();

      expect(element.text()).toEqual('my partial');
      expect($rootScope.loaded).toBe(true);
    }));


    it('should destroy old scope', inject(putIntoCache('myUrl', 'my partial'),
          function($rootScope, $compile, $browser) {
      element = jqLite('<ng:include src="url"></ng:include>');
      element = $compile(element)($rootScope);

      expect($rootScope.$$childHead).toBeFalsy();

      $rootScope.url = 'myUrl';
      $rootScope.$digest();
      expect($rootScope.$$childHead).toBeTruthy();

      $rootScope.url = null;
      $rootScope.$digest();
      expect($rootScope.$$childHead).toBeFalsy();
    }));


    it('should do xhr request and cache it',
        inject(function($rootScope, $httpBackend, $compile, $browser) {
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
          function($rootScope, $compile, $browser) {
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
      var log = [];

      $rootScope.templateUrl = 'myUrl1';
      $rootScope.logger = function(msg) {
        log.push(msg);
      }
      $compile(element)($rootScope);
      expect(log.join('; ')).toEqual('');

      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{logger("url1")}}</div>');
      $rootScope.$digest();
      expect(log.join('; ')).toEqual('');
      $rootScope.templateUrl = 'myUrl2';
      $httpBackend.expect('GET', 'myUrl2').respond('<div>{{logger("url2")}}</div>');
      $rootScope.$digest();
      $httpBackend.flush(); // now that we have two requests pending, flush!

      expect(log.join('; ')).toEqual('url2; url2'); // it's here twice because we go through at
                                                    // least two digest cycles
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

  describe('a', function() {
    it('should prevent default action to be executed when href is empty',
        inject(function($rootScope, $compile) {
      var orgLocation = document.location.href,
          preventDefaultCalled = false,
          event;

      element = $compile('<a href="">empty link</a>')($rootScope);

      if (msie < 9) {

        event = document.createEventObject();
        expect(event.returnValue).not.toBeDefined();
        element[0].fireEvent('onclick', event);
        expect(event.returnValue).toEqual(false);

      } else {

        event = document.createEvent('MouseEvent');
        event.initMouseEvent(
          'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        event.preventDefaultOrg = event.preventDefault;
        event.preventDefault = function() {
          preventDefaultCalled = true;
          if (this.preventDefaultOrg) this.preventDefaultOrg();
        };

        element[0].dispatchEvent(event);

        expect(preventDefaultCalled).toEqual(true);
      }

      expect(document.location.href).toEqual(orgLocation);
    }));
  });


  describe('ng:repeat', function() {
    it('should ng:repeat over array', inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="item in items" ng:init="suffix = \';\'" ng:bind="item + suffix"></li>' +
        '</ul>')($rootScope);

      Array.prototype.extraProperty = "should be ignored";
      // INIT
      $rootScope.items = ['misko', 'shyam'];
      $rootScope.$digest();
      expect(element.find('li').length).toEqual(2);
      expect(element.text()).toEqual('misko;shyam;');
      delete Array.prototype.extraProperty;

      // GROW
      $rootScope.items = ['adam', 'kai', 'brad'];
      $rootScope.$digest();
      expect(element.find('li').length).toEqual(3);
      expect(element.text()).toEqual('adam;kai;brad;');

      // SHRINK
      $rootScope.items = ['brad'];
      $rootScope.$digest();
      expect(element.find('li').length).toEqual(1);
      expect(element.text()).toEqual('brad;');
    }));


    it('should ng:repeat over object', inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li>' +
        '</ul>')($rootScope);
      $rootScope.items = {misko:'swe', shyam:'set'};
      $rootScope.$digest();
      expect(element.text()).toEqual('misko:swe;shyam:set;');
    }));


    it('should not ng:repeat over parent properties', inject(function($rootScope, $compile) {
      var Class = function() {};
      Class.prototype.abc = function() {};
      Class.prototype.value = 'abc';

      element = $compile(
        '<ul>' +
          '<li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li>' +
        '</ul>')($rootScope);
      $rootScope.items = new Class();
      $rootScope.items.name = 'value';
      $rootScope.$digest();
      expect(element.text()).toEqual('name:value;');
    }));


    it('should error on wrong parsing of ng:repeat', inject(function($rootScope, $compile, $log) {
      expect(function() {
        element = $compile('<ul><li ng:repeat="i dont parse"></li></ul>')($rootScope);
      }).toThrow("Expected ng:repeat in form of '_item_ in _collection_' but got 'i dont parse'.");

      $log.error.logs.shift();
    }));


    it('should expose iterator offset as $index when iterating over arrays',
        inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="item in items" ng:bind="item + $index + \'|\'"></li>' +
        '</ul>')($rootScope);
      $rootScope.items = ['misko', 'shyam', 'frodo'];
      $rootScope.$digest();
      expect(element.text()).toEqual('misko0|shyam1|frodo2|');
    }));


    it('should expose iterator offset as $index when iterating over objects',
        inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="(key, val) in items" ng:bind="key + \':\' + val + $index + \'|\'"></li>' +
        '</ul>')($rootScope);
      $rootScope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
      $rootScope.$digest();
      expect(element.text()).toEqual('frodo:f0|misko:m1|shyam:s2|');
    }));


    it('should expose iterator position as $position when iterating over arrays',
        inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="item in items" ng:bind="item + \':\' + $position + \'|\'"></li>' +
        '</ul>')($rootScope);
      $rootScope.items = ['misko', 'shyam', 'doug'];
      $rootScope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:last|');

      $rootScope.items.push('frodo');
      $rootScope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:middle|frodo:last|');

      $rootScope.items.pop();
      $rootScope.items.pop();
      $rootScope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:last|');
    }));


    it('should expose iterator position as $position when iterating over objects',
        inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="(key, val) in items" ng:bind="key + \':\' + val + \':\' + $position + \'|\'">' +
          '</li>' +
        '</ul>')($rootScope);
      $rootScope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
      $rootScope.$digest();
      expect(element.text()).toEqual('doug:d:first|frodo:f:middle|misko:m:middle|shyam:s:last|');

      delete $rootScope.items.doug;
      delete $rootScope.items.frodo;
      $rootScope.$digest();
      expect(element.text()).toEqual('misko:m:first|shyam:s:last|');
    }));


    it('should ignore $ and $$ properties', inject(function($rootScope, $compile) {
      element = $compile('<ul><li ng:repeat="i in items">{{i}}|</li></ul>')($rootScope);
      $rootScope.items = ['a', 'b', 'c'];
      $rootScope.items.$$hashkey = 'xxx';
      $rootScope.items.$root = 'yyy';
      $rootScope.$digest();

      expect(element.text()).toEqual('a|b|c|');
    }));


    it('should repeat over nested arrays', inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng:repeat="subgroup in groups">' +
            '<div ng:repeat="group in subgroup">{{group}}|</div>X' +
          '</li>' +
        '</ul>')($rootScope);
      $rootScope.groups = [['a', 'b'], ['c','d']];
      $rootScope.$digest();

      expect(element.text()).toEqual('a|b|Xc|d|X');
    }));


    it('should ignore non-array element properties when iterating over an array',
        inject(function($rootScope, $compile) {
      element = $compile('<ul><li ng:repeat="item in array">{{item}}|</li></ul>')($rootScope);
      $rootScope.array = ['a', 'b', 'c'];
      $rootScope.array.foo = '23';
      $rootScope.array.bar = function() {};
      $rootScope.$digest();

      expect(element.text()).toBe('a|b|c|');
    }));


    it('should iterate over non-existent elements of a sparse array',
        inject(function($rootScope, $compile) {
      element = $compile('<ul><li ng:repeat="item in array">{{item}}|</li></ul>')($rootScope);
      $rootScope.array = ['a', 'b'];
      $rootScope.array[4] = 'c';
      $rootScope.array[6] = 'd';
      $rootScope.$digest();

      expect(element.text()).toBe('a|b|||c||d|');
    }));


    it('should iterate over all kinds of types', inject(function($rootScope, $compile) {
      element = $compile('<ul><li ng:repeat="item in array">{{item}}|</li></ul>')($rootScope);
      $rootScope.array = ['a', 1, null, undefined, {}];
      $rootScope.$digest();

      expect(element.text()).toMatch(/a\|1\|\|\|\{\s*\}\|/);
    }));


    describe('stability', function() {
      var a, b, c, d, lis;

      beforeEach(inject(function($rootScope, $compile) {
        element = $compile(
          '<ul>' +
            '<li ng:repeat="item in items" ng:bind="key + \':\' + val + \':\' + $position + \'|\'"></li>' +
          '</ul>')($rootScope);
        a = {};
        b = {};
        c = {};
        d = {};

        $rootScope.items = [a, b, c];
        $rootScope.$digest();
        lis = element.find('li');
      }));


      it('should preserve the order of elements', inject(function($rootScope) {
        $rootScope.items = [a, c, d];
        $rootScope.$digest();
        var newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[2]);
        expect(newElements[2]).not.toEqual(lis[1]);
      }));


      it('should support duplicates', inject(function($rootScope) {
        $rootScope.items = [a, a, b, c];
        $rootScope.$digest();
        var newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).not.toEqual(lis[0]);
        expect(newElements[2]).toEqual(lis[1]);
        expect(newElements[3]).toEqual(lis[2]);

        lis = newElements;
        $rootScope.$digest();
        newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[2]);
        expect(newElements[3]).toEqual(lis[3]);

        $rootScope.$digest();
        newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[2]);
        expect(newElements[3]).toEqual(lis[3]);
      }));


      it('should remove last item when one duplicate instance is removed',
          inject(function($rootScope) {
        $rootScope.items = [a, a, a];
        $rootScope.$digest();
        lis = element.find('li');

        $rootScope.items = [a, a];
        $rootScope.$digest();
        var newElements = element.find('li');
        expect(newElements.length).toEqual(2);
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
      }));


      it('should reverse items when the collection is reversed',
          inject(function($rootScope) {
        $rootScope.items = [a, b, c];
        $rootScope.$digest();
        lis = element.find('li');

        $rootScope.items = [c, b, a];
        $rootScope.$digest();
        var newElements = element.find('li');
        expect(newElements.length).toEqual(3);
        expect(newElements[0]).toEqual(lis[2]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[0]);
      }));
    });
  });


  describe('@ng:non-bindable', function() {
    it('should prevent compilation of the owning element and its children',
        inject(function($rootScope, $compile) {
      element = $compile('<div ng:non-bindable><span ng:bind="name"></span></div>')($rootScope);
      $rootScope.name =  'misko';
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    }));
  });


  describe('ng:view', function() {
    beforeEach(inject(function($rootScope, $compile) {
      element = $compile('<ng:view></ng:view>')($rootScope);
    }));


    it('should do nothing when no routes are defined',
        inject(function($rootScope, $compile, $location) {
      $location.path('/unknown');
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    }));


    it('should load content via xhr when route changes',
        inject(function($rootScope, $compile, $httpBackend, $location, $route) {
      $route.when('/foo', {template: 'myUrl1'});
      $route.when('/bar', {template: 'myUrl2'});

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
    }));


    it('should remove all content when location changes to an unknown route',
        inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      $route.when('/foo', {template: 'myUrl1'});

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('4');

      $location.path('/unknown');
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    }));


    it('should chain scopes and propagate evals to the child scope',
        inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      $route.when('/foo', {template: 'myUrl1'});
      $rootScope.parentVar = 'parent';

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{parentVar}}</div>');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toEqual('parent');

      $rootScope.parentVar = 'new parent';
      $rootScope.$digest();
      expect(element.text()).toEqual('new parent');
    }));


    it('should be possible to nest ng:view in ng:include', inject(function() {
      // TODO(vojta): refactor this test
      dealoc(element);
      var injector = angular.injector(['ng', 'ngMock']);
      var myApp = injector.get('$rootScope');
      var $httpBackend = injector.get('$httpBackend');
      $httpBackend.expect('GET', 'includePartial.html').respond('view: <ng:view></ng:view>');
      injector.get('$location').path('/foo');

      var $route = injector.get('$route');
      $route.when('/foo', {controller: angular.noop, template: 'viewPartial.html'});

      element = injector.get('$compile')(
          '<div>' +
            'include: <ng:include src="\'includePartial.html\'"> </ng:include>' +
          '</div>')(myApp);
      myApp.$apply();

      $httpBackend.expect('GET', 'viewPartial.html').respond('content');
      $httpBackend.flush();

      expect(element.text()).toEqual('include: view: content');
      expect($route.current.template).toEqual('viewPartial.html');
      dealoc(myApp);
      dealoc(element);
    }));


    it('should initialize view template after the view controller was initialized even when ' +
       'templates were cached',
       inject(function($rootScope, $compile, $location, $httpBackend, $route) {
      //this is a test for a regression that was introduced by making the ng:view cache sync

      $route.when('/foo', {controller: ParentCtrl, template: 'viewPartial.html'});
      $rootScope.log = [];

      function ParentCtrl($scope) {
        $scope.log.push('parent');
      }

      $rootScope.ChildCtrl = function($scope) {
        $scope.log.push('child');
      };

      $location.path('/foo');
      $httpBackend.expect('GET', 'viewPartial.html').
          respond('<div ng:init="log.push(\'init\')">' +
                    '<div ng:controller="ChildCtrl"></div>' +
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
    }));


    it('should discard pending xhr callbacks if a new route is requested before the current ' +
        'finished loading', inject(function($route, $rootScope, $location, $httpBackend) {
      // this is a test for a bad race condition that affected feedback

      $route.when('/foo', {template: 'myUrl1'});
      $route.when('/bar', {template: 'myUrl2'});

      expect(element.text()).toEqual('');

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond('<div>{{1+3}}</div>');
      $rootScope.$digest();
      $location.path('/bar');
      $httpBackend.expect('GET', 'myUrl2').respond('<div>{{1+1}}</div>');
      $rootScope.$digest();
      $httpBackend.flush(); // now that we have two requests pending, flush!

      expect(element.text()).toEqual('2');
    }));


    it('should clear the content when error during xhr request',
        inject(function($route, $location, $rootScope, $httpBackend) {
      $route.when('/foo', {controller: noop, template: 'myUrl1'});

      $location.path('/foo');
      $httpBackend.expect('GET', 'myUrl1').respond(404, '');
      element.text('content');

      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.text()).toBe('');
    }));


    it('should be async even if served from cache',
        inject(function($route, $rootScope, $location, $templateCache, $browser) {
      $templateCache.put('myUrl1', [200, 'my partial', {}]);
      $route.when('/foo', {controller: noop, template: 'myUrl1'});
      $location.path('/foo');

      var called = 0;
      // we want to assert only during first watch
      $rootScope.$watch(function() {
        if (!called++) expect(element.text()).toBe('');
      });

      $rootScope.$digest();
      expect(element.text()).toBe('my partial');
    }));
  });


  describe('ng:pluralize', function() {

    describe('deal with pluralized strings without offset', function() {
       beforeEach(inject(function($rootScope, $compile) {
          element = $compile(
            '<ng:pluralize count="email"' +
                           "when=\"{'0': 'You have no new email'," +
                                   "'one': 'You have one new email'," +
                                   "'other': 'You have {} new emails'}\">" +
            '</ng:pluralize>')($rootScope);
        }));


        it('should show single/plural strings', inject(function($rootScope) {
          $rootScope.email = 0;
          $rootScope.$digest();
          expect(element.text()).toBe('You have no new email');

          $rootScope.email = '0';
          $rootScope.$digest();
          expect(element.text()).toBe('You have no new email');

          $rootScope.email = 1;
          $rootScope.$digest();
          expect(element.text()).toBe('You have one new email');

          $rootScope.email = 0.01;
          $rootScope.$digest();
          expect(element.text()).toBe('You have 0.01 new emails');

          $rootScope.email = '0.1';
          $rootScope.$digest();
          expect(element.text()).toBe('You have 0.1 new emails');

          $rootScope.email = 2;
          $rootScope.$digest();
          expect(element.text()).toBe('You have 2 new emails');

          $rootScope.email = -0.1;
          $rootScope.$digest();
          expect(element.text()).toBe('You have -0.1 new emails');

          $rootScope.email = '-0.01';
          $rootScope.$digest();
          expect(element.text()).toBe('You have -0.01 new emails');

          $rootScope.email = -2;
          $rootScope.$digest();
          expect(element.text()).toBe('You have -2 new emails');
        }));


        it('should show single/plural strings with mal-formed inputs', inject(function($rootScope) {
          $rootScope.email = '';
          $rootScope.$digest();
          expect(element.text()).toBe('');

          $rootScope.email = null;
          $rootScope.$digest();
          expect(element.text()).toBe('');

          $rootScope.email = undefined;
          $rootScope.$digest();
          expect(element.text()).toBe('');

          $rootScope.email = 'a3';
          $rootScope.$digest();
          expect(element.text()).toBe('');

          $rootScope.email = '011';
          $rootScope.$digest();
          expect(element.text()).toBe('You have 11 new emails');

          $rootScope.email = '-011';
          $rootScope.$digest();
          expect(element.text()).toBe('You have -11 new emails');

          $rootScope.email = '1fff';
          $rootScope.$digest();
          expect(element.text()).toBe('You have one new email');

          $rootScope.email = '0aa22';
          $rootScope.$digest();
          expect(element.text()).toBe('You have no new email');

          $rootScope.email = '000001';
          $rootScope.$digest();
          expect(element.text()).toBe('You have one new email');
        }));
    });


    describe('deal with pluralized strings with offset', function() {
      it('should show single/plural strings with offset', inject(function($rootScope, $compile) {
        element = $compile(
          "<ng:pluralize count=\"viewCount\"  offset=2 " +
              "when=\"{'0': 'Nobody is viewing.'," +
                      "'1': '{{p1}} is viewing.'," +
                      "'2': '{{p1}} and {{p2}} are viewing.'," +
                      "'one': '{{p1}}, {{p2}} and one other person are viewing.'," +
                      "'other': '{{p1}}, {{p2}} and {} other people are viewing.'}\">" +
          "</ng:pluralize>")($rootScope);
        $rootScope.p1 = 'Igor';
        $rootScope.p2 = 'Misko';

        $rootScope.viewCount = 0;
        $rootScope.$digest();
        expect(element.text()).toBe('Nobody is viewing.');

        $rootScope.viewCount = 1;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor is viewing.');

        $rootScope.viewCount = 2;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor and Misko are viewing.');

        $rootScope.viewCount = 3;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor, Misko and one other person are viewing.');

        $rootScope.viewCount = 4;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor, Misko and 2 other people are viewing.');
      }));
    });
  });


  describe('scriptTemplateLoader', function() {
    it('should populate $templateCache with contents of a ng-template script element', inject(
        function($compile, $templateCache) {
          if (msie <=8) return;
          // in ie8 it is not possible to create a script tag with the right content.
          // it always comes up as empty. I was trying to set the text of the
          // script tag, but that did not work either, so I gave up.
          $compile('<div>foo' +
                     '<script id="/ignore">ignore me</script>' +
                     '<script type="text/ng-template" id="/myTemplate.html"><x>{{y}}</x></script>' +
                   '</div>' );
          expect($templateCache.get('/myTemplate.html')).toBe('<x>{{y}}</x>');
          expect($templateCache.get('/ignore')).toBeUndefined();
        }
    ));


    it('should not compile scripts', inject(function($compile, $templateCache, $rootScope) {
      if (msie <=8) return; // see above

      var doc = jqLite('<div></div>');
      // jQuery is too smart and removes
      doc[0].innerHTML = '<script type="text/javascript">some {{binding}}</script>' +
                         '<script type="text/ng-template" id="/some">other {{binding}}</script>';

      $compile(doc)($rootScope);
      $rootScope.$digest();

      var scripts = doc.find('script');
      expect(scripts.eq(0).text()).toBe('some {{binding}}');
      expect(scripts.eq(1).text()).toBe('other {{binding}}');
      dealoc(doc);
    }));
  });
});
