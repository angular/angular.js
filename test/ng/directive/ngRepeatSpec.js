'use strict';

describe('ngRepeat', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  it('should ngRepeat over array', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items" ng-init="suffix = \';\'" ng-bind="item + suffix"></li>' +
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


  it('should ngRepeat over object', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items" ng-bind="key + \':\' + value + \';\' "></li>' +
      '</ul>')($rootScope);
    $rootScope.items = {misko:'swe', shyam:'set'};
    $rootScope.$digest();
    expect(element.text()).toEqual('misko:swe;shyam:set;');
  }));


  it('should not ngRepeat over parent properties', inject(function($rootScope, $compile) {
    var Class = function() {};
    Class.prototype.abc = function() {};
    Class.prototype.value = 'abc';

    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items" ng-bind="key + \':\' + value + \';\' "></li>' +
      '</ul>')($rootScope);
    $rootScope.items = new Class();
    $rootScope.items.name = 'value';
    $rootScope.$digest();
    expect(element.text()).toEqual('name:value;');
  }));


  it('should error on wrong parsing of ngRepeat', inject(function($rootScope, $compile) {
    expect(function() {
      element = $compile('<ul><li ng-repeat="i dont parse"></li></ul>')($rootScope);
    }).toThrow("Expected ngRepeat in form of '_item_ in _collection_' but got 'i dont parse'.");
  }));


  it("should throw error when left-hand-side of ngRepeat can't be parsed", inject(
      function($rootScope, $compile) {
    expect(function() {
      element = $compile('<ul><li ng-repeat="i dont parse in foo"></li></ul>')($rootScope);
    }).toThrow("'item' in 'item in collection' should be identifier or (key, value) but got " +
               "'i dont parse'.");
  }));


  it('should expose iterator offset as $index when iterating over arrays',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items" ng-bind="item + $index + \'|\'"></li>' +
      '</ul>')($rootScope);
    $rootScope.items = ['misko', 'shyam', 'frodo'];
    $rootScope.$digest();
    expect(element.text()).toEqual('misko0|shyam1|frodo2|');
  }));


  it('should expose iterator offset as $index when iterating over objects',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, val) in items" ng-bind="key + \':\' + val + $index + \'|\'"></li>' +
      '</ul>')($rootScope);
    $rootScope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
    $rootScope.$digest();
    expect(element.text()).toEqual('frodo:f0|misko:m1|shyam:s2|');
  }));


  it('should expose iterator position as $first, $middle and $last when iterating over arrays',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
      '</ul>')($rootScope);
    $rootScope.items = ['misko', 'shyam', 'doug'];
    $rootScope.$digest();
    expect(element.text()).
        toEqual('misko:true-false-false|shyam:false-true-false|doug:false-false-true|');

    $rootScope.items.push('frodo');
    $rootScope.$digest();
    expect(element.text()).
        toEqual('misko:true-false-false|' +
                'shyam:false-true-false|' +
                'doug:false-true-false|' +
                'frodo:false-false-true|');

    $rootScope.items.pop();
    $rootScope.items.pop();
    $rootScope.$digest();
    expect(element.text()).toEqual('misko:true-false-false|shyam:false-false-true|');

    $rootScope.items.pop();
    $rootScope.$digest();
    expect(element.text()).toEqual('misko:true-false-true|');
  }));


  it('should expose iterator position as $first, $middle and $last when iterating over objects',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
      '</ul>')($rootScope);
    $rootScope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
    $rootScope.$digest();
    expect(element.text()).
        toEqual('doug:d:true-false-false|' +
                'frodo:f:false-true-false|' +
                'misko:m:false-true-false|' +
                'shyam:s:false-false-true|');

    delete $rootScope.items.doug;
    delete $rootScope.items.frodo;
    $rootScope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-false|shyam:s:false-false-true|');

    delete $rootScope.items.shyam;
    $rootScope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-true|');
  }));


  it('should ignore $ and $$ properties', inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="i in items">{{i}}|</li></ul>')($rootScope);
    $rootScope.items = ['a', 'b', 'c'];
    $rootScope.items.$$hashkey = 'xxx';
    $rootScope.items.$root = 'yyy';
    $rootScope.$digest();

    expect(element.text()).toEqual('a|b|c|');
  }));


  it('should repeat over nested arrays', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="subgroup in groups">' +
          '<div ng-repeat="group in subgroup">{{group}}|</div>X' +
        '</li>' +
      '</ul>')($rootScope);
    $rootScope.groups = [['a', 'b'], ['c','d']];
    $rootScope.$digest();

    expect(element.text()).toEqual('a|b|Xc|d|X');
  }));


  it('should ignore non-array element properties when iterating over an array',
      inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')($rootScope);
    $rootScope.array = ['a', 'b', 'c'];
    $rootScope.array.foo = '23';
    $rootScope.array.bar = function() {};
    $rootScope.$digest();

    expect(element.text()).toBe('a|b|c|');
  }));


  it('should iterate over non-existent elements of a sparse array',
      inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')($rootScope);
    $rootScope.array = ['a', 'b'];
    $rootScope.array[4] = 'c';
    $rootScope.array[6] = 'd';
    $rootScope.$digest();

    expect(element.text()).toBe('a|b|||c||d|');
  }));


  it('should iterate over all kinds of types', inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')($rootScope);
    $rootScope.array = ['a', 1, null, undefined, {}];
    $rootScope.$digest();

    expect(element.text()).toMatch(/a\|1\|\|\|\{\s*\}\|/);
  }));


  describe('stability', function() {
    var a, b, c, d, lis;

    beforeEach(inject(function($rootScope, $compile) {
      element = $compile(
        '<ul>' +
          '<li ng-repeat="item in items">{{key}}:{{val}}|></li>' +
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
