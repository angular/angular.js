'use strict';

describe("widget", function() {
  var compile = null, element = null, scope = null;

  beforeEach(function() {
    scope = null;
    element = null;
    compile = function(html, parent) {
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      scope = angular.compile(element)();
      scope.$apply();
      return scope;
    };
  });

  afterEach(function() {
    dealoc(element);
  });


  describe('ng:switch', function() {
    it('should switch on value change', function() {
      compile('<ng:switch on="select">' +
          '<div ng:switch-when="1">first:{{name}}</div>' +
          '<div ng:switch-when="2">second:{{name}}</div>' +
          '<div ng:switch-when="true">true:{{name}}</div>' +
        '</ng:switch>');
      expect(element.html()).toEqual('');
      scope.select = 1;
      scope.$apply();
      expect(element.text()).toEqual('first:');
      scope.name="shyam";
      scope.$apply();
      expect(element.text()).toEqual('first:shyam');
      scope.select = 2;
      scope.$apply();
      expect(element.text()).toEqual('second:shyam');
      scope.name = 'misko';
      scope.$apply();
      expect(element.text()).toEqual('second:misko');
      scope.select = true;
      scope.$apply();
      expect(element.text()).toEqual('true:misko');
    });

    it('should switch on switch-when-default', function() {
      compile('<ng:switch on="select">' +
                '<div ng:switch-when="1">one</div>' +
                '<div ng:switch-default>other</div>' +
              '</ng:switch>');
      scope.$apply();
      expect(element.text()).toEqual('other');
      scope.select = 1;
      scope.$apply();
      expect(element.text()).toEqual('one');
    });

    it('should call change on switch', function() {
      var scope = angular.compile('<ng:switch on="url" change="name=\'works\'"><div ng:switch-when="a">{{name}}</div></ng:switch>')();
      scope.url = 'a';
      scope.$apply();
      expect(scope.name).toEqual(undefined);
      expect(scope.$element.text()).toEqual('works');
      dealoc(scope);
    });

  });


  describe('ng:include', function() {
    it('should include on external file', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element)();
      scope.childScope = scope.$new();
      scope.childScope.name = 'misko';
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$digest();
      expect(element.text()).toEqual('misko');
      dealoc(scope);
    });

    it('should remove previously included text if a falsy value is bound to src', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element)();
      scope.childScope = scope.$new();
      scope.childScope.name = 'igor';
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$digest();

      expect(element.text()).toEqual('igor');

      scope.url = undefined;
      scope.$digest();

      expect(element.text()).toEqual('');
      dealoc(scope);
    });

    it('should allow this for scope', function() {
      var element = jqLite('<ng:include src="url" scope="this"></ng:include>');
      var scope = angular.compile(element)();
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{"abc"}}'};
      scope.$digest();
      // TODO(misko): because we are using scope==this, the eval gets registered
      // during the flush phase and hence does not get called.
      // I don't think passing 'this' makes sense. Does having scope on ng:include makes sense?
      // should we make scope="this" ilegal?
      scope.$digest();

      expect(element.text()).toEqual('abc');
      dealoc(element);
    });

    it('should evaluate onload expression when a partial is loaded', function() {
      var element = jqLite('<ng:include src="url" onload="loaded = true"></ng:include>');
      var scope = angular.compile(element)();

      expect(scope.loaded).not.toBeDefined();

      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'my partial'};
      scope.$digest();
      expect(element.text()).toEqual('my partial');
      expect(scope.loaded).toBe(true);
      dealoc(element);
    });

    it('should destroy old scope', function() {
      var element = jqLite('<ng:include src="url"></ng:include>');
      var scope = angular.compile(element)();

      expect(scope.$$childHead).toBeFalsy();

      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'my partial'};
      scope.$digest();
      expect(scope.$$childHead).toBeTruthy();

      scope.url = null;
      scope.$digest();
      expect(scope.$$childHead).toBeFalsy();
      dealoc(element);
    });
  });


  describe('a', function() {
    it('should prevent default action to be executed when href is empty', function() {
      var orgLocation = document.location.href,
          preventDefaultCalled = false,
          event;

      compile('<a href="">empty link</a>');

      if (msie < 9) {

        event = document.createEventObject();
        expect(event.returnValue).not.toBeDefined();
        element[0].fireEvent('onclick', event);
        expect(event.returnValue).toEqual(false);

      } else {

        event = document.createEvent('MouseEvent');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        event.preventDefaultOrg = event.preventDefault;
        event.preventDefault = function() {
          preventDefaultCalled = true;
          if (this.preventDefaultOrg) this.preventDefaultOrg();
        };

        element[0].dispatchEvent(event);

        expect(preventDefaultCalled).toEqual(true);
      }

      expect(document.location.href).toEqual(orgLocation);
    });
  });


  describe('@ng:repeat', function() {
    it('should ng:repeat over array', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ng:init="suffix = \';\'" ng:bind="item + suffix"></li></ul>');

      Array.prototype.extraProperty = "should be ignored";
      // INIT
      scope.items = ['misko', 'shyam'];
      scope.$digest();
      expect(element.find('li').length).toEqual(2);
      expect(element.text()).toEqual('misko;shyam;');
      delete Array.prototype.extraProperty;

      // GROW
      scope.items = ['adam', 'kai', 'brad'];
      scope.$digest();
      expect(element.find('li').length).toEqual(3);
      expect(element.text()).toEqual('adam;kai;brad;');

      // SHRINK
      scope.items = ['brad'];
      scope.$digest();
      expect(element.find('li').length).toEqual(1);
      expect(element.text()).toEqual('brad;');
    });

    it('should ng:repeat over object', function() {
      var scope = compile('<ul><li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li></ul>');
      scope.items = {misko:'swe', shyam:'set'};
      scope.$digest();
      expect(element.text()).toEqual('misko:swe;shyam:set;');
    });

    it('should not ng:repeat over parent properties', function() {
      var Class = function() {};
      Class.prototype.abc = function() {};
      Class.prototype.value = 'abc';

      var scope = compile('<ul><li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li></ul>');
      scope.items = new Class();
      scope.items.name = 'value';
      scope.$digest();
      expect(element.text()).toEqual('name:value;');
    });

    it('should error on wrong parsing of ng:repeat', function() {
      expect(function() {
        compile('<ul><li ng:repeat="i dont parse"></li></ul>');
      }).toThrow("Expected ng:repeat in form of '_item_ in _collection_' but got 'i dont parse'.");

      $logMock.error.logs.shift();
    });

    it('should expose iterator offset as $index when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + $index + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'frodo'];
      scope.$digest();
      expect(element.text()).toEqual('misko0|shyam1|frodo2|');
    });

    it('should expose iterator offset as $index when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + $index + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
      scope.$digest();
      expect(element.text()).toEqual('misko:m0|shyam:s1|frodo:f2|');
    });

    it('should expose iterator position as $position when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + \':\' + $position + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'doug'];
      scope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:last|');

      scope.items.push('frodo');
      scope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:middle|frodo:last|');

      scope.items.pop();
      scope.items.pop();
      scope.$digest();
      expect(element.text()).toEqual('misko:first|shyam:last|');
    });

    it('should expose iterator position as $position when iterating over objects', function() {
      var scope = compile(
        '<ul>' +
          '<li ng:repeat="(key, val) in items" ng:bind="key + \':\' + val + \':\' + $position + \'|\'">' +
          '</li>' +
        '</ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
      scope.$digest();
      expect(element.text()).toEqual('misko:m:first|shyam:s:middle|doug:d:middle|frodo:f:last|');

      delete scope.items.doug;
      delete scope.items.frodo;
      scope.$digest();
      expect(element.text()).toEqual('misko:m:first|shyam:s:last|');
    });


    describe('stability', function() {
      var a, b, c, d, scope, lis;

      beforeEach(function() {
        scope = compile(
          '<ul>' +
            '<li ng:repeat="item in items" ng:bind="key + \':\' + val + \':\' + $position + \'|\'">' +
            '</li>' +
          '</ul>');
        a = {};
        b = {};
        c = {};
        d = {};

        scope.items = [a, b, c];
        scope.$digest();
        lis = element.find('li');
      });

      it('should preserve the order of elements', function() {
        scope.items = [a, c, d];
        scope.$digest();
        var newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[2]);
        expect(newElements[2]).not.toEqual(lis[1]);
      });

      it('should support duplicates', function() {
        scope.items = [a, a, b, c];
        scope.$digest();
        var newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).not.toEqual(lis[0]);
        expect(newElements[2]).toEqual(lis[1]);
        expect(newElements[3]).toEqual(lis[2]);

        lis = newElements;
        scope.$digest();
        newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[2]);
        expect(newElements[3]).toEqual(lis[3]);

        scope.$digest();
        newElements = element.find('li');
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[2]);
        expect(newElements[3]).toEqual(lis[3]);
      });

      it('should remove last item when one duplicate instance is removed', function() {
        scope.items = [a, a, a];
        scope.$digest();
        lis = element.find('li');

        scope.items = [a, a];
        scope.$digest();
        var newElements = element.find('li');
        expect(newElements.length).toEqual(2);
        expect(newElements[0]).toEqual(lis[0]);
        expect(newElements[1]).toEqual(lis[1]);
      });

      it('should reverse items when the collection is reversed', function() {
        scope.items = [a, b, c];
        scope.$digest();
        lis = element.find('li');

        scope.items = [c, b, a];
        scope.$digest();
        var newElements = element.find('li');
        expect(newElements.length).toEqual(3);
        expect(newElements[0]).toEqual(lis[2]);
        expect(newElements[1]).toEqual(lis[1]);
        expect(newElements[2]).toEqual(lis[0]);
      });
    });
  });


  describe('@ng:non-bindable', function() {
    it('should prevent compilation of the owning element and its children', function() {
      var scope = compile('<div ng:non-bindable><span ng:bind="name"></span></div>');
      scope.name =  'misko';
      scope.$digest();
      expect(element.text()).toEqual('');
    });
  });


  describe('ng:view', function() {
    var rootScope, $route, $location, $browser;

    beforeEach(function() {
      rootScope = angular.compile('<ng:view></ng:view>')();
      $route = rootScope.$service('$route');
      $location = rootScope.$service('$location');
      $browser = rootScope.$service('$browser');
    });

    afterEach(function() {
      dealoc(rootScope);
    });


    it('should do nothing when no routes are defined', function() {
      $location.path('/unknown');
      rootScope.$digest();
      expect(rootScope.$element.text()).toEqual('');
    });


    it('should load content via xhr when route changes', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});
      $route.when('/bar', {controller: angular.noop, template: 'myUrl2'});

      expect(rootScope.$element.text()).toEqual('');

      $location.path('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{1+3}}</div>');
      rootScope.$digest();
      rootScope.$digest();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('4');

      $location.path('/bar');
      $browser.xhr.expectGET('myUrl2').respond('angular is da best');
      rootScope.$digest();
      rootScope.$digest();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('angular is da best');
    });

    it('should remove all content when location changes to an unknown route', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});

      $location.path('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{1+3}}</div>');
      rootScope.$digest();
      rootScope.$digest();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('4');

      $location.path('/unknown');
      rootScope.$digest();
      rootScope.$digest();
      expect(rootScope.$element.text()).toEqual('');
    });

    it('should chain scopes and propagate evals to the child scope', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});
      rootScope.parentVar = 'parent';

      $location.path('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{parentVar}}</div>');
      rootScope.$digest();
      rootScope.$digest();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('parent');

      rootScope.parentVar = 'new parent';
      rootScope.$digest();
      rootScope.$digest();
      expect(rootScope.$element.text()).toEqual('new parent');
    });

    it('should be possible to nest ng:view in ng:include', function() {
      dealoc(rootScope); // we are about to override it.

      var myApp = angular.scope();
      var $browser = myApp.$service('$browser');
      $browser.xhr.expectGET('includePartial.html').respond('view: <ng:view></ng:view>');
      myApp.$service('$location').path('/foo');

      var $route = myApp.$service('$route');
      $route.when('/foo', {controller: angular.noop, template: 'viewPartial.html'});

      rootScope = angular.compile(
          '<div>' +
            'include: <ng:include src="\'includePartial.html\'">' +
          '</ng:include></div>')(myApp);
      rootScope.$apply();

      $browser.xhr.expectGET('viewPartial.html').respond('content');
      rootScope.$digest();
      $browser.xhr.flush();

      expect(rootScope.$element.text()).toEqual('include: view: content');
      expect($route.current.template).toEqual('viewPartial.html');
      dealoc($route.current.scope);
    });

    it('should initialize view template after the view controller was initialized even when ' +
       'templates were cached', function() {
      //this is a test for a regression that was introduced by making the ng:view cache sync

      $route.when('/foo', {controller: ParentCtrl, template: 'viewPartial.html'});

      rootScope.log = [];

      function ParentCtrl() {
        this.log.push('parent');
      }

      rootScope.ChildCtrl = function() {
        this.log.push('child');
      };

      $location.path('/foo');
      $browser.xhr.expectGET('viewPartial.html').
          respond('<div ng:init="log.push(\'init\')">' +
                    '<div ng:controller="ChildCtrl"></div>' +
                  '</div>');
      rootScope.$apply();
      $browser.xhr.flush();

      expect(rootScope.log).toEqual(['parent', 'init', 'child']);

      $location.path('/');
      rootScope.$apply();
      expect(rootScope.log).toEqual(['parent', 'init', 'child']);

      rootScope.log = [];
      $location.path('/foo');
      rootScope.$apply();
      $browser.defer.flush();

      expect(rootScope.log).toEqual(['parent', 'init', 'child']);
    });
  });


  describe('ng:pluralize', function() {


    describe('deal with pluralized strings without offset', function() {
       beforeEach(function() {
          compile('<ng:pluralize count="email"' +
                                 "when=\"{'0': 'You have no new email'," +
                                         "'one': 'You have one new email'," +
                                         "'other': 'You have {} new emails'}\">" +
                  '</ng:pluralize>');
        });

        it('should show single/plural strings', function() {
          scope.email = 0;
          scope.$digest();
          expect(element.text()).toBe('You have no new email');

          scope.email = '0';
          scope.$digest();
          expect(element.text()).toBe('You have no new email');

          scope.email = 1;
          scope.$digest();
          expect(element.text()).toBe('You have one new email');

          scope.email = 0.01;
          scope.$digest();
          expect(element.text()).toBe('You have 0.01 new emails');

          scope.email = '0.1';
          scope.$digest();
          expect(element.text()).toBe('You have 0.1 new emails');

          scope.email = 2;
          scope.$digest();
          expect(element.text()).toBe('You have 2 new emails');

          scope.email = -0.1;
          scope.$digest();
          expect(element.text()).toBe('You have -0.1 new emails');

          scope.email = '-0.01';
          scope.$digest();
          expect(element.text()).toBe('You have -0.01 new emails');

          scope.email = -2;
          scope.$digest();
          expect(element.text()).toBe('You have -2 new emails');
        });


        it('should show single/plural strings with mal-formed inputs', function() {
          scope.email = '';
          scope.$digest();
          expect(element.text()).toBe('');

          scope.email = null;
          scope.$digest();
          expect(element.text()).toBe('');

          scope.email = undefined;
          scope.$digest();
          expect(element.text()).toBe('');

          scope.email = 'a3';
          scope.$digest();
          expect(element.text()).toBe('');

          scope.email = '011';
          scope.$digest();
          expect(element.text()).toBe('You have 11 new emails');

          scope.email = '-011';
          scope.$digest();
          expect(element.text()).toBe('You have -11 new emails');

          scope.email = '1fff';
          scope.$digest();
          expect(element.text()).toBe('You have one new email');

          scope.email = '0aa22';
          scope.$digest();
          expect(element.text()).toBe('You have no new email');

          scope.email = '000001';
          scope.$digest();
          expect(element.text()).toBe('You have one new email');
        });
    });


    describe('deal with pluralized strings with offset', function() {
      it('should show single/plural strings with offset', function() {
        compile("<ng:pluralize count=\"viewCount\"  offset=2 " +
                    "when=\"{'0': 'Nobody is viewing.'," +
                            "'1': '{{p1}} is viewing.'," +
                            "'2': '{{p1}} and {{p2}} are viewing.'," +
                            "'one': '{{p1}}, {{p2}} and one other person are viewing.'," +
                            "'other': '{{p1}}, {{p2}} and {} other people are viewing.'}\">" +
                "</ng:pluralize>");
        scope.p1 = 'Igor';
        scope.p2 = 'Misko';

        scope.viewCount = 0;
        scope.$digest();
        expect(element.text()).toBe('Nobody is viewing.');

        scope.viewCount = 1;
        scope.$digest();
        expect(element.text()).toBe('Igor is viewing.');

        scope.viewCount = 2;
        scope.$digest();
        expect(element.text()).toBe('Igor and Misko are viewing.');

        scope.viewCount = 3;
        scope.$digest();
        expect(element.text()).toBe('Igor, Misko and one other person are viewing.');

        scope.viewCount = 4;
        scope.$digest();
        expect(element.text()).toBe('Igor, Misko and 2 other people are viewing.');
      });
    });
  });
});

