'use strict';

describe('module loader', function() {
  var window;

  beforeEach(function() {
    window = {};
    setupModuleLoader(window);
  });


  it('should set up namespace', function() {
    expect(window.angular).toBeDefined();
    expect(window.angular.module).toBeDefined();
  });


  it('should not override existing namespace', function() {
    var angular = window.angular;
    var module = angular.module;

    setupModuleLoader(window);
    expect(window.angular).toBe(angular);
    expect(window.angular.module).toBe(module);
  });


  it('should record calls', function() {
    var otherModule = window.angular.module('other', []);
    otherModule.config('otherInit');

    var myModule = window.angular.module('my', ['other'], 'config');

    expect(myModule.
      decorator('dk', 'dv').
      provider('sk', 'sv').
      factory('fk', 'fv').
      service('a', 'aa').
      value('k', 'v').
      filter('f', 'ff').
      directive('d', 'dd').
      controller('ctrl', 'ccc').
      config('init2').
      constant('abc', 123).
      run('runBlock')).toBe(myModule);

    expect(myModule.requires).toEqual(['other']);
    expect(myModule._invokeQueue).toEqual([
      ['$provide', 'constant', ['abc', 123]],
      ['$provide', 'decorator', ['dk', 'dv']],
      ['$provide', 'provider', ['sk', 'sv']],
      ['$provide', 'factory', ['fk', 'fv']],
      ['$provide', 'service', ['a', 'aa']],
      ['$provide', 'value', ['k', 'v']],
      ['$filterProvider', 'register', ['f', 'ff']],
      ['$compileProvider', 'directive', ['d', 'dd']],
      ['$controllerProvider', 'register', ['ctrl', 'ccc']]
    ]);
    expect(myModule._configBlocks).toEqual([
      ['$injector', 'invoke', ['config']],
      ['$injector', 'invoke', ['init2']]
    ]);
    expect(myModule._runBlocks).toEqual(['runBlock']);
  });


  it('should allow module redefinition', function() {
    expect(window.angular.module('a', [])).not.toBe(window.angular.module('a', []));
  });


  it('should complain of no module', function() {
    expect(function() {
      window.angular.module('dontExist');
    }).toThrowMinErr("$injector", "nomod", "Module 'dontExist' is not available! You either misspelled the module name " +
            "or forgot to load it. If registering a module ensure that you specify the dependencies as the second " +
            "argument.");
  });

  it('should complain if a module is called "hasOwnProperty', function() {
    expect(function() {
      window.angular.module('hasOwnProperty', []);
    }).toThrowMinErr('ng','badname', "hasOwnProperty is not a valid module name");
  });

  it('should expose `$$minErr` on the `angular` object', function() {
    expect(window.angular.$$minErr).toEqual(jasmine.any(Function));
  });
});


describe('component', function() {
  it('should return the module', function() {
    var myModule = window.angular.module('my', []);
    expect(myModule.component('myComponent', {})).toBe(myModule);
  });

  it('should register a directive', function() {
    var myModule = window.angular.module('my', []).component('myComponent', {});
    expect(myModule._invokeQueue).toEqual(
      [['$compileProvider', 'directive', ['myComponent', jasmine.any(Function)]]]);
  });

  it('should add router annotations to directive factory', function() {
    var myModule = window.angular.module('my', []).component('myComponent', {
      $canActivate: 'canActivate',
      $routeConfig: 'routeConfig'
    });
    expect(myModule._invokeQueue.pop().pop()[1]).toEqual(jasmine.objectContaining({
      $canActivate: 'canActivate',
      $routeConfig: 'routeConfig'
    }));
  });

  it('should return ddo with reasonable defaults', function() {
    window.angular.module('my', []).component('myComponent', {});
    module('my');
    inject(function(myComponentDirective) {
      expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
        controller: jasmine.any(Function),
        controllerAs: 'myComponent',
        template: '',
        templateUrl: undefined,
        transclude: true,
        scope: {},
        bindToController: {},
        restrict: 'E'
      }));
    });
  });

  it('should return ddo with assigned options', function() {
    function myCtrl() {}
    window.angular.module('my', []).component('myComponent', {
      controller: myCtrl,
      controllerAs: 'ctrl',
      template: 'abc',
      templateUrl: 'def.html',
      transclude: false,
      isolate: false,
      bindings: {abc: '='},
      restrict: 'EA'
    });
    module('my');
    inject(function(myComponentDirective) {
      expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
        controller: myCtrl,
        controllerAs: 'ctrl',
        template: 'abc',
        templateUrl: 'def.html',
        transclude: false,
        scope: true,
        bindToController: {abc: '='},
        restrict: 'EA'
      }));
    });
  });

  it('should allow passing injectable functions as template/templateUrl', function() {
    var log = '';
    window.angular.module('my', []).component('myComponent', {
      template: function($element, $attrs, myValue) {
        log += 'template,' + $element + ',' + $attrs + ',' + myValue + '\n';
      },
      templateUrl: function($element, $attrs, myValue) {
        log += 'templateUrl,' + $element + ',' + $attrs + ',' + myValue + '\n';
      }
    }).value('myValue', 'blah');
    module('my');
    inject(function(myComponentDirective) {
      myComponentDirective[0].template('a', 'b');
      myComponentDirective[0].templateUrl('c', 'd');
      expect(log).toEqual('template,a,b,blah\ntemplateUrl,c,d,blah\n');
    });
  });

  it('should allow passing injectable arrays as template/templateUrl', function() {
    var log = '';
    window.angular.module('my', []).component('myComponent', {
      template: ['$element', '$attrs', 'myValue', function($element, $attrs, myValue) {
        log += 'template,' + $element + ',' + $attrs + ',' + myValue + '\n';
      }],
      templateUrl: ['$element', '$attrs', 'myValue', function($element, $attrs, myValue) {
        log += 'templateUrl,' + $element + ',' + $attrs + ',' + myValue + '\n';
      }]
    }).value('myValue', 'blah');
    module('my');
    inject(function(myComponentDirective) {
      myComponentDirective[0].template('a', 'b');
      myComponentDirective[0].templateUrl('c', 'd');
      expect(log).toEqual('template,a,b,blah\ntemplateUrl,c,d,blah\n');
    });
  });

  it('should allow passing transclude as object', function() {
    window.angular.module('my', []).component('myComponent', {
      transclude: {}
    });
    module('my');
    inject(function(myComponentDirective) {
      expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
        transclude: {}
      }));
    });
  });

  it('should give ctrl as syntax priority over controllerAs', function() {
    window.angular.module('my', []).component('myComponent', {
      controller: 'MyCtrl as vm'
    });
    module('my');
    inject(function(myComponentDirective) {
      expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
        controllerAs: 'vm'
      }));
    });
  });
});
