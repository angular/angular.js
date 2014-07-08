'use strict';

describe('ngId', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  it('should add new and remove old ids dynamically', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="dynId"></div>')($rootScope);

    expect(element.attr('id') === 'existing').toBeTruthy();

    $rootScope.dynId = 'A';
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeTruthy();

    $rootScope.dynId = 'B';
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeFalsy();
    expect(element.attr('id') === 'B').toBeTruthy();

    delete $rootScope.dynId;
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeTruthy();
    expect(element.attr('id') === 'A').toBeFalsy();
    expect(element.attr('id') === 'B').toBeFalsy();
  }));


  it('should support not support ids via an array', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="[\'A\', \'B\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeTruthy();
    expect(element.attr('id') === 'A').toBeFalsy();
    expect(element.attr('id') === 'B').toBeFalsy();
  }));


  it('should support adding multiple ids conditionally via a map of id names to boolean' +
      'expressions', inject(function($rootScope, $compile) {
    var element = $compile(
        '<div id="existing" ' +
            'ng-id="{A: conditionA, B: conditionB(), AnotB: conditionA&&!conditionB()}">' +
        '</div>')($rootScope);
    $rootScope.conditionA = true;
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeTruthy();
    expect(element.attr('id') === 'B').toBeFalsy();
    expect(element.attr('id') === 'AnotB').toBeFalsy();

    $rootScope.conditionB = function() { return true; };
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeTruthy();
    expect(element.attr('id') === 'B').toBeFalsy();
    expect(element.attr('id') === 'AnotB').toBeFalsy();

    $rootScope.conditionA = false;
    $rootScope.conditionB = function() { return true; };
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeFalsy();
    expect(element.attr('id') === 'B').toBeTruthy();
    expect(element.attr('id') === 'AnotB').toBeFalsy();
  }));


  it('should remove ids when the referenced object is the same but its property is changed',
    inject(function($rootScope, $compile) {
      var element = $compile('<div ng-id="ids"></div>')($rootScope);
      $rootScope.ids = { A: true, B: true };
      $rootScope.$digest();
      expect(element.attr('id') === 'A').toBeTruthy();
      expect(element.attr('id') === 'B').toBeFalsy();
      $rootScope.ids.A = false;
      $rootScope.$digest();
      expect(element.attr('id') === 'A').toBeFalsy();
      expect(element.attr('id') === 'B').toBeTruthy();
    }
  ));


  it('should return only the first word in a space delimited string', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="\'A B\'"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeFalsy();
    expect(element.attr('id') === 'A').toBeTruthy();
    expect(element.attr('id') === 'B').toBeFalsy();
  }));


  it('should replace id added post compilation with pre-existing ng-id value', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="dynId"></div>')($rootScope);
    $rootScope.dynId = 'A';
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBe(false);

    // add extra id, change model and eval
    element.attr('id', 'newId');
    $rootScope.dynId = 'B';
    $rootScope.$digest();

    expect(element.attr('id') === 'existing').toBe(false);
    expect(element.attr('id') === 'B').toBe(true);
    expect(element.attr('id') === 'newid').toBe(false);
  }));


  it('should replace id added post compilation without pre-existing ids"', inject(function($rootScope, $compile) {
    element = $compile('<div ng-id="dynId"></div>')($rootScope);
    $rootScope.dynId = 'A';
    $rootScope.$digest();
    expect(element.attr('id') === 'A').toBe(true);

    // add extra id, change model and eval
    element.attr('id', 'newId');
    $rootScope.dynId= 'B';
    $rootScope.$digest();

    expect(element.attr('id') === 'B').toBe(true);
    expect(element.attr('id') === 'newid').toBe(false);
  }));

  it('should remove ids even if it was specified via id attribute', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="dynId"></div>')($rootScope);
    $rootScope.dynId = 'A';
    $rootScope.$digest();
    $rootScope.dynId = 'B';
    $rootScope.$digest();
    expect(element.attr('id') === 'B').toBe(true);
  }));

  it('should convert undefined and null values to an empty string', inject(function($rootScope, $compile) {
    element = $compile('<div ng-id="dynId"></div>')($rootScope);
    $rootScope.dynId = [undefined, null];
    $rootScope.$digest();
    expect(element[0].id).toBeFalsy();
  }));

  it('should reinstate the original id if the specified id evaluates to false', inject(function($rootScope, $compile) {
    element = $compile('<div id="existing" ng-id="dynId"></div>')($rootScope);
    $rootScope.dynId = 'A';
    $rootScope.$digest();
    expect(element.attr('id') === 'A').toBeTruthy();

    $rootScope.dynId = false;
    $rootScope.$digest();
    expect(element.attr('id') === 'existing').toBeTruthy();
  }));

});
