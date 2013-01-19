'use strict';

describe('ngRepeat', function() {
  var element, $compile, scope;


  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));


  afterEach(function(){
    dealoc(element);
  });


  it('should iterate over an array of objects', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item.name}};</li>' +
      '</ul>')(scope);

    Array.prototype.extraProperty = "should be ignored";
    // INIT
    scope.items = [{name: 'misko'}, {name:'shyam'}];
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('misko;shyam;');
    delete Array.prototype.extraProperty;

    // GROW
    scope.items.push({name: 'adam'});
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('misko;shyam;adam;');

    // SHRINK
    scope.items.pop();
    scope.items.shift();
    scope.$digest();
    expect(element.find('li').length).toEqual(1);
    expect(element.text()).toEqual('shyam;');
  });


  it('should iterate over an array of primitives', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item}};</li>' +
      '</ul>')(scope);

    Array.prototype.extraProperty = "should be ignored";
    // INIT
    scope.items = [true, true, true];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('true;true;true;');
    delete Array.prototype.extraProperty;

    scope.items = [false, true, true];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('false;true;true;');

    scope.items = [false, true, false];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('false;true;false;');

    scope.items = [true];
    scope.$digest();
    expect(element.find('li').length).toEqual(1);
    expect(element.text()).toEqual('true;');

    scope.items = [true, true, false];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('true;true;false;');

    scope.items = [true, false, false];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('true;false;false;');

    // string
    scope.items = ['a', 'a', 'a'];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('a;a;a;');

    scope.items = ['ab', 'a', 'a'];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('ab;a;a;');

    scope.items = ['test'];
    scope.$digest();
    expect(element.find('li').length).toEqual(1);
    expect(element.text()).toEqual('test;');

    scope.items = ['same', 'value'];
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('same;value;');

    // number
    scope.items = [12, 12, 12];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('12;12;12;');

    scope.items = [53, 12, 27];
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('53;12;27;');

    scope.items = [89];
    scope.$digest();
    expect(element.find('li').length).toEqual(1);
    expect(element.text()).toEqual('89;');

    scope.items = [89, 23];
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('89;23;');
  });


  it('should iterate over on object/map', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items">{{key}}:{{value}}|</li>' +
      '</ul>')(scope);
    scope.items = {misko:'swe', shyam:'set'};
    scope.$digest();
    expect(element.text()).toEqual('misko:swe|shyam:set|');
  });


  it('should iterate over object with changing primitive property values', function() {
    // test for issue #933

    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items">' +
          '{{key}}:{{value}};' +
          '<input type="checkbox" ng-model="items[key]">' +
        '</li>' +
      '</ul>')(scope);

    scope.items = {misko: true, shyam: true, zhenbo:true};
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('misko:true;shyam:true;zhenbo:true;');

    browserTrigger(element.find('input').eq(0), 'click');

    expect(element.text()).toEqual('misko:false;shyam:true;zhenbo:true;');
    expect(element.find('input')[0].checked).toBe(false);
    expect(element.find('input')[1].checked).toBe(true);
    expect(element.find('input')[2].checked).toBe(true);

    browserTrigger(element.find('input').eq(0), 'click');
    expect(element.text()).toEqual('misko:true;shyam:true;zhenbo:true;');
    expect(element.find('input')[0].checked).toBe(true);
    expect(element.find('input')[1].checked).toBe(true);
    expect(element.find('input')[2].checked).toBe(true);

    browserTrigger(element.find('input').eq(1), 'click');
    expect(element.text()).toEqual('misko:true;shyam:false;zhenbo:true;');
    expect(element.find('input')[0].checked).toBe(true);
    expect(element.find('input')[1].checked).toBe(false);
    expect(element.find('input')[2].checked).toBe(true);

    scope.items = {misko: false, shyam: true, zhenbo: true};
    scope.$digest();
    expect(element.text()).toEqual('misko:false;shyam:true;zhenbo:true;');
    expect(element.find('input')[0].checked).toBe(false);
    expect(element.find('input')[1].checked).toBe(true);
    expect(element.find('input')[2].checked).toBe(true);
  });


  it('should not ngRepeat over parent properties', function() {
    var Class = function() {};
    Class.prototype.abc = function() {};
    Class.prototype.value = 'abc';

    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items">{{key}}:{{value}};</li>' +
      '</ul>')(scope);
    scope.items = new Class();
    scope.items.name = 'value';
    scope.$digest();
    expect(element.text()).toEqual('name:value;');
  });


  it('should error on wrong parsing of ngRepeat', function() {
    expect(function() {
      element = jqLite('<ul><li ng-repeat="i dont parse"></li></ul>');
      $compile(element)(scope);
    }).toThrow("Expected ngRepeat in form of '_item_ in _collection_' but got 'i dont parse'.");
  });


  it("should throw error when left-hand-side of ngRepeat can't be parsed", function() {
    expect(function() {
      element = jqLite('<ul><li ng-repeat="i dont parse in foo"></li></ul>');
      $compile(element)(scope);
    }).toThrow("'item' in 'item in collection' should be identifier or (key, value) but got " +
               "'i dont parse'.");
  });


  it('should expose iterator offset as $index when iterating over arrays',
      function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item}}:{{$index}}|</li>' +
      '</ul>')(scope);
    scope.items = ['misko', 'shyam', 'frodo'];
    scope.$digest();
    expect(element.text()).toEqual('misko:0|shyam:1|frodo:2|');
  });


  it('should expose iterator offset as $index when iterating over objects', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$index}}|</li>' +
      '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
    scope.$digest();
    expect(element.text()).toEqual('frodo:f:0|misko:m:1|shyam:s:2|');
  });


  it('should expose iterator position as $first, $middle and $last when iterating over arrays',
      function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
      '</ul>')(scope);
    scope.items = ['misko', 'shyam', 'doug'];
    scope.$digest();
    expect(element.text()).
        toEqual('misko:true-false-false|shyam:false-true-false|doug:false-false-true|');

    scope.items.push('frodo');
    scope.$digest();
    expect(element.text()).
        toEqual('misko:true-false-false|' +
                'shyam:false-true-false|' +
                'doug:false-true-false|' +
                'frodo:false-false-true|');

    scope.items.pop();
    scope.items.pop();
    scope.$digest();
    expect(element.text()).toEqual('misko:true-false-false|shyam:false-false-true|');

    scope.items.pop();
    scope.$digest();
    expect(element.text()).toEqual('misko:true-false-true|');
  });


  it('should expose iterator position as $first, $middle and $last when iterating over objects',
      function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
      '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
    scope.$digest();
    expect(element.text()).
        toEqual('doug:d:true-false-false|' +
                'frodo:f:false-true-false|' +
                'misko:m:false-true-false|' +
                'shyam:s:false-false-true|');

    delete scope.items.doug;
    delete scope.items.frodo;
    scope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-false|shyam:s:false-false-true|');

    delete scope.items.shyam;
    scope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-true|');
  });


  it('should calculate $first, $middle and $last when we filter out properties from an obj', function() {
    element = $compile(
        '<ul>' +
            '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
            '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f', '$toBeFilteredOut': 'xxxx'};
    scope.$digest();
    expect(element.text()).
        toEqual('doug:d:true-false-false|' +
        'frodo:f:false-true-false|' +
        'misko:m:false-true-false|' +
        'shyam:s:false-false-true|');
  });


  it('should ignore $ and $$ properties', function() {
    element = $compile('<ul><li ng-repeat="i in items">{{i}}|</li></ul>')(scope);
    scope.items = ['a', 'b', 'c'];
    scope.items.$$hashkey = 'xxx';
    scope.items.$root = 'yyy';
    scope.$digest();

    expect(element.text()).toEqual('a|b|c|');
  });


  it('should repeat over nested arrays', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="subgroup in groups">' +
          '<div ng-repeat="group in subgroup">{{group}}|</div>X' +
        '</li>' +
      '</ul>')(scope);
    scope.groups = [['a', 'b'], ['c','d']];
    scope.$digest();

    expect(element.text()).toEqual('a|b|Xc|d|X');
  });


  it('should ignore non-array element properties when iterating over an array', function() {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')(scope);
    scope.array = ['a', 'b', 'c'];
    scope.array.foo = '23';
    scope.array.bar = function() {};
    scope.$digest();

    expect(element.text()).toBe('a|b|c|');
  });


  it('should iterate over non-existent elements of a sparse array', function() {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')(scope);
    scope.array = ['a', 'b'];
    scope.array[4] = 'c';
    scope.array[6] = 'd';
    scope.$digest();

    expect(element.text()).toBe('a|b|||c||d|');
  });


  it('should iterate over all kinds of types', function() {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')(scope);
    scope.array = ['a', 1, null, undefined, {}];
    scope.$digest();

    expect(element.text()).toMatch(/a\|1\|\|\|\{\s*\}\|/);
  });


  describe('stability', function() {
    var a, b, c, d, lis;

    beforeEach(function() {
      element = $compile(
        '<ul>' +
          '<li ng-repeat="item in items">{{key}}:{{val}}|></li>' +
        '</ul>')(scope);
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


    it('should reuse elements even when model is composed of primitives', function() {
      // rebuilding repeater from scratch can be expensive, we should try to avoid it even for
      // model that is composed of primitives.

      scope.items = ['hello', 'cau', 'ahoj'];
      scope.$digest();
      lis = element.find('li');

      scope.items = ['ahoj', 'hello', 'cau'];
      scope.$digest();
      var newLis = element.find('li');
      expect(newLis.length).toEqual(3);
      expect(newLis[0]).toEqual(lis[2]);
      expect(newLis[1]).toEqual(lis[0]);
      expect(newLis[2]).toEqual(lis[1]);
    });
  });
});
