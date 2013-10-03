'use strict';

describe('ngAttr', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should add new and remove old attributes dynamically', inject(function($rootScope, $compile) {
    element = $compile('<div existing ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'A';
    $rootScope.$digest();
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBeUndefined();

    $rootScope.dynAttr = 'B';
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBeUndefined();
    expect(element.attr('B')).toBe('');

    delete $rootScope.dynAttr;
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBeUndefined();
    expect(element.attr('B')).toBeUndefined();
  }));


  it('should support adding multiple attributes via an array',
  inject(function($rootScope, $compile) {
    element = $compile('<div existing ng-attr="[\'A\', \'B\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBe('');
  }));


  it('should support adding multiple attributes conditionally via a map of attribute names to' +
     ' boolean expressions', inject(function($rootScope, $compile) {
    var element = $compile(
        '<div existing ' +
            'ng-attr="{A: conditionA, B: conditionB(), AnotB: conditionA&&!conditionB()}">' +
        '</div>')($rootScope);
    $rootScope.conditionA = true;
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBeUndefined();
    expect(element.attr('AnotB')).toBe('');

    $rootScope.conditionB = function() { return true; };
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBe('');
    expect (element.attr('AnotB')).toBeUndefined();
  }));


  it('should support adding multiple attributes with values conditionally via a map of attribute ' +
     'names to boolean expressions',
  inject(function($rootScope, $compile) {
    var element = $compile(
        '<div existing ' +
            'ng-attr="{\'A={{a()}}\': conditionA, \'B={{b}}\': conditionB()}">' +
        '</div>')($rootScope);

    $rootScope.conditionA = true;
    $rootScope.$digest();

    $rootScope.a = function() { return "forty-two"; };
    $rootScope.b = "snow-crash";
    
    $rootScope.$digest();

    expect(element.attr('a')).toBe('forty-two');
    expect(element.attr('b')).toBeUndefined();

    $rootScope.conditionB = function() { return true; };
    $rootScope.$digest();
    expect(element.attr('a')).toBe('forty-two');
    expect(element.attr('b')).toBe('snow-crash');
  }));


  it('should remove attributes when the referenced object is the same but its property is changed',
  inject(function($rootScope, $compile) {
    var element = $compile('<div ng-attr="attributes"></div>')($rootScope);
    $rootScope.attributes = { A: true, B: true };
    $rootScope.$digest();
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBe('');
    $rootScope.attributes.A = false;
    $rootScope.$digest();
    expect(element.attr('A')).toBeUndefined();
    expect(element.attr('B')).toBe('');
  }));


  it('should support adding attributes with values', inject(function($rootScope, $compile) {
    var element = $compile('<div ng-attr="\'value=seventy\'"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('value')).toBe('seventy');
  }));


  it('should support adding multiple attributes via a space delimited string',
  inject(function($rootScope, $compile) {
    element = $compile('<div existing ng-attr="\'A B\'"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');
    expect(element.attr('A')).toBe('');
    expect(element.attr('B')).toBe('');
  }));


  it('should support adding multiple attributes with values via array notation',
  inject(function($rootScope, $compile) {
    var element = $compile('<div ng-attr="[\'value=seventy\', \'value2=spork\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('value')).toBe('seventy');
    expect(element.attr('value2')).toBe('spork');
  }));


  it('should preserve attribute added post compilation with pre-existing attributes',
  inject(function($rootScope, $compile) {
    element = $compile('<div existing ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'A';
    $rootScope.$digest();
    expect(element.attr('existing')).toBe('');

    // add extra attribute, change model and eval
    element.attr('newAttr','');
    $rootScope.dynAttr = 'B';
    $rootScope.$digest();

    expect(element.attr('existing')).toBe('');
    expect(element.attr('B')).toBe('');
    expect(element.attr('newAttr')).toBe('');
  }));


  it('should preserve attribute added post compilation without pre-existing attributes"',
  inject(function($rootScope, $compile) {
    element = $compile('<div ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'A';
    $rootScope.$digest();
    expect(element.attr('A')).toBe('');

    // add extra attribute, change model and eval
    element.attr('newAttr','');
    $rootScope.dynAttr = 'B';
    $rootScope.$digest();

    expect(element.attr('B')).toBe('');
    expect(element.attr('newAttr')).toBe('');
  }));


  it('should preserve other attributes with similar name"', inject(function($rootScope, $compile) {
    element = $compile('<div ui-panel ui-selected ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'panel';
    $rootScope.$digest();
    $rootScope.dynAttr = 'foo';
    $rootScope.$digest();
    expect(element.attr('ui-panel')).toBe('');
    expect(element.attr('ui-selected')).toBe('');
    expect(element.attr('foo')).toBe('');
  }));


  it('should not add duplicate attributes', inject(function($rootScope, $compile) {
    element = $compile('<div panel bar ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'panel';
    $rootScope.$digest();
    expect(element.attr('panel')).toBe('');
    expect(element.attr('bar')).toBe('');
  }));


  it('should remove attributes even if it was specified outside ng-attr',
  inject(function($rootScope, $compile) {
    element = $compile('<div panel bar ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'panel';
    $rootScope.$digest();
    $rootScope.dynAttr = 'window';
    $rootScope.$digest();
    expect(element.attr('bar')).toBe('');
    expect(element.attr('window')).toBe('');
  }));


  it('should remove attributes even if they were added by another code',
  inject(function($rootScope, $compile) {
    element = $compile('<div ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = 'foo';
    $rootScope.$digest();
    element.attr('foo', '');
    $rootScope.dynAttr = '';
    $rootScope.$digest();
    expect(element.attr('foo')).toBeUndefined();
  }));


  it('should not add attributes with empty names',
  inject(function($rootScope, $compile) {
    element = $compile('<div ng-attr="dynAttr"></div>')($rootScope);
    $rootScope.dynAttr = [undefined, null];
    $rootScope.$digest();
    expect(element.attr('undefined')).toBeUndefined();
    expect(element.attr('null')).toBeUndefined();
  }));


  it('should not mess up attribute value due to observing an interpolated attribute',
  inject(function($rootScope, $compile) {
    $rootScope.foo = true;
    $rootScope.$watch("anything", function() {
      $rootScope.foo = false;
    });
    element = $compile('<div ng-attr="{foo:foo}"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('foo')).toBeUndefined();
  }));
});
