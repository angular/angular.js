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
    otherModule.init('otherInit');

    var myModule = window.angular.module('my', ['other'], 'init');

    myModule.
      service('sk', 'sv').
      factory('fk', 'fv').
      value('k', 'v').
      filter('f', 'ff').
      init('init2');

    expect(myModule.requires).toEqual(['other']);
    expect(myModule.invokeQueue).toEqual([
      ['$injector', 'invoke', ['init'] ],
      ['$provide', 'service', ['sk', 'sv'] ],
      ['$provide', 'factory', ['fk', 'fv'] ],
      ['$provide', 'value', ['k', 'v'] ],
      ['$filterProvider', 'register', ['f', 'ff'] ],
      ['$injector', 'invoke', ['init2'] ]
    ]);
  });


  it('should allow module redefinition', function() {
    expect(window.angular.module('a', [])).not.toBe(window.angular.module('a', []));
  });


  it('should complain of no module', function() {
    expect(function() {
      window.angular.module('dontExist');
    }).toThrow('No module: dontExist');
  });
});
