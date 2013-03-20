'use strict';

describe('ngClass', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should add new and remove old classes dynamically', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(true);

    $rootScope.dynClass = 'B';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(false);
    expect(element.hasClass('B')).toBe(true);

    delete $rootScope.dynClass;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(false);
    expect(element.hasClass('B')).toBe(false);
  }));


  it('should support adding multiple classes via an array', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="[\'A\', \'B\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  }));


  it('should support adding multiple classes conditionally via a map of class names to boolean' +
      'expressions', inject(function($rootScope, $compile) {
    var element = $compile(
        '<div class="existing" ' +
            'ng-class="{A: conditionA, B: conditionB(), AnotB: conditionA&&!conditionB}">' +
        '</div>')($rootScope);
    $rootScope.conditionA = true;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeFalsy();
    expect(element.hasClass('AnotB')).toBeTruthy();

    $rootScope.conditionB = function() { return true };
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
    expect(element.hasClass('AnotB')).toBeFalsy();
  }));


  it('should support adding multiple classes via a space delimited string', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="\'A B\'"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  }));


  it('should preserve class added post compilation with pre-existing classes', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);

    // add extra class, change model and eval
    element.addClass('newClass');
    $rootScope.dynClass = 'B';
    $rootScope.$digest();

    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('B')).toBe(true);
    expect(element.hasClass('newClass')).toBe(true);
  }));


  it('should preserve class added post compilation without pre-existing classes"', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('A')).toBe(true);

    // add extra class, change model and eval
    element.addClass('newClass');
    $rootScope.dynClass = 'B';
    $rootScope.$digest();

    expect(element.hasClass('B')).toBe(true);
    expect(element.hasClass('newClass')).toBe(true);
  }));


  it('should preserve other classes with similar name"', inject(function($rootScope, $compile) {
    element = $compile('<div class="ui-panel ui-selected" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    $rootScope.dynCls = 'foo';
    $rootScope.$digest();
    expect(element[0].className).toBe('ui-panel ui-selected ng-scope foo');
  }));


  it('should not add duplicate classes', inject(function($rootScope, $compile) {
    element = $compile('<div class="panel bar" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    expect(element[0].className).toBe('panel bar ng-scope');
  }));


  it('should remove classes even if it was specified via class attribute', inject(function($rootScope, $compile) {
    element = $compile('<div class="panel bar" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    $rootScope.dynCls = 'window';
    $rootScope.$digest();
    expect(element[0].className).toBe('bar ng-scope window');
  }));


  it('should remove classes even if they were added by another code', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'foo';
    $rootScope.$digest();
    element.addClass('foo');
    $rootScope.dynCls = '';
    $rootScope.$digest();
  }));


  it('should convert undefined and null values to an empty string', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = [undefined, null];
    $rootScope.$digest();
  }));


  it('should ngClass odd/even', inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="i in [0,1]" class="existing" ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li><ul>')($rootScope);
    $rootScope.$digest();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
  }));


  it('should allow both ngClass and ngClassOdd/Even on the same element', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in [0,1]" ng-class="\'plainClass\'" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('plainClass')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();
    expect(e2.hasClass('plainClass')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should allow both ngClass and ngClassOdd/Even with multiple classes', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in [0,1]" ng-class="[\'A\', \'B\']" ' +
      'ng-class-odd="[\'C\', \'D\']" ng-class-even="[\'E\', \'F\']"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('A')).toBeTruthy();
    expect(e1.hasClass('B')).toBeTruthy();
    expect(e1.hasClass('C')).toBeTruthy();
    expect(e1.hasClass('D')).toBeTruthy();
    expect(e1.hasClass('E')).toBeFalsy();
    expect(e1.hasClass('F')).toBeFalsy();

    expect(e2.hasClass('A')).toBeTruthy();
    expect(e2.hasClass('B')).toBeTruthy();
    expect(e2.hasClass('E')).toBeTruthy();
    expect(e2.hasClass('F')).toBeTruthy();
    expect(e2.hasClass('C')).toBeFalsy();
    expect(e2.hasClass('D')).toBeFalsy();
  }));


  it('should reapply ngClass when interpolated class attribute changes', inject(function($rootScope, $compile) {
    element = $compile('<div class="one {{cls}} three" ng-class="{four: four}"></div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.cls = "two";
      $rootScope.four = true;
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('two'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four');

    $rootScope.$apply(function() {
      $rootScope.cls = "too";
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('too'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four'); // should still be there
    expect(element.hasClass('two')).toBeFalsy();

    $rootScope.$apply(function() {
      $rootScope.cls = "to";
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('to'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four'); // should still be there
    expect(element.hasClass('two')).toBeFalsy();
    expect(element.hasClass('too')).toBeFalsy();
  }));


  it('should not mess up class value due to observing an interpolated class attribute', inject(function($rootScope, $compile) {
    $rootScope.foo = true;
    $rootScope.$watch("anything", function() {
      $rootScope.foo = false;
    });
    element = $compile('<div ng-class="{foo:foo}"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('foo')).toBe(false);
  }));


  it('should update ngClassOdd/Even when model is changed by filtering', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in items track by $index" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li>' +
      '<ul>')($rootScope);
    $rootScope.items = ['a','b','a'];
    $rootScope.$digest();

    $rootScope.items = ['a','a'];
    $rootScope.$digest();

    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();

    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should update ngClassOdd/Even when model is changed by sorting', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in items" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'">i</li>' +
      '<ul>')($rootScope);
    $rootScope.items = ['a','b'];
    $rootScope.$digest();

    $rootScope.items = ['b','a'];
    $rootScope.$digest();

    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();

    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));
});
