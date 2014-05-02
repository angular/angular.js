'use strict';

describe('module loader', function() {
  var window;

  beforeEach(function () {
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
      ['$provide', 'constant', ['abc', 123] ],
      ['$provide', 'provider', ['sk', 'sv'] ],
      ['$provide', 'factory', ['fk', 'fv'] ],
      ['$provide', 'service', ['a', 'aa'] ],
      ['$provide', 'value', ['k', 'v'] ],
      ['$filterProvider', 'register', ['f', 'ff'] ],
      ['$compileProvider', 'directive', ['d', 'dd'] ],
      ['$controllerProvider', 'register', ['ctrl', 'ccc']],
    ]);
    expect(myModule._configBlocks).toEqual([
      ['$injector', 'invoke', ['config'] ],
      ['$injector', 'invoke', ['init2'] ]
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
