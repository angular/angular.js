'use strict';

describe('ngRepeat', function() {
  var element, $compile, scope, $exceptionHandler, $compileProvider;

  beforeEach(module(function(_$compileProvider_) {
    $compileProvider = _$compileProvider_;
  }));


  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(inject(function(_$compile_, $rootScope, _$exceptionHandler_) {
    $compile = _$compile_;
    $exceptionHandler = _$exceptionHandler_;
    scope = $rootScope.$new();
  }));


  afterEach(function() {
    if ($exceptionHandler.errors.length) {
      dump(jasmine.getEnv().currentSpec.getFullName());
      dump('$exceptionHandler has errors');
      dump($exceptionHandler.errors);
      expect($exceptionHandler.errors).toBe([]);
    }
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

  it('should be possible to use one-time bindings on the collection', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in ::items">{{item.name}};</li>' +
      '</ul>')(scope);

    scope.$digest();

    scope.items = [{name: 'misko'}, {name:'shyam'}];
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('misko;shyam;');
    scope.items.push({name: 'adam'});
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('misko;shyam;');
  });

  it('should be possible to use one-time bindings on the content', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{::item.name}};</li>' +
      '</ul>')(scope);

    scope.$digest();

    scope.items = [{name: 'misko'}, {name:'shyam'}];
    scope.$digest();
    expect(element.find('li').length).toEqual(2);
    expect(element.text()).toEqual('misko;shyam;');
    scope.items.push({name: 'adam'});
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('misko;shyam;adam;');
  });


  it('should iterate over an array-like object', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item.name}};</li>' +
      '</ul>')(scope);

    document.body.innerHTML = "<p>" +
                                      "<a name='x'>a</a>" +
                                      "<a name='y'>b</a>" +
                                      "<a name='x'>c</a>" +
                                    "</p>";

    var htmlCollection = document.getElementsByTagName('a');
    scope.items = htmlCollection;
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('x;y;x;');
  });

  it('should iterate over an array-like class', function() {
    /* jshint -W009 */
    function Collection() {}
    Collection.prototype = new Array();
    Collection.prototype.length = 0;

    var collection = new Collection();
    collection.push({ name: "x" });
    collection.push({ name: "y" });
    collection.push({ name: "z" });

    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item.name}};</li>' +
      '</ul>')(scope);

    scope.items = collection;
    scope.$digest();
    expect(element.find('li').length).toEqual(3);
    expect(element.text()).toEqual('x;y;z;');
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

  it('should iterate over on object/map where (key,value) contains whitespaces', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(  key ,  value  ) in items">{{key}}:{{value}}|</li>' +
      '</ul>')(scope);
    scope.items = {me:'swe', you:'set'};
    scope.$digest();
    expect(element.text()).toEqual('me:swe|you:set|');
  });

  it('should iterate over an object/map with identical values', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, value) in items">{{key}}:{{value}}|</li>' +
      '</ul>')(scope);
    scope.items = {age:20, wealth:20, prodname: "Bingo", dogname: "Bingo", codename: "20"};
    scope.$digest();
    expect(element.text()).toEqual('age:20|wealth:20|prodname:Bingo|dogname:Bingo|codename:20|');
  });

  describe('track by', function() {
    it('should track using expression function', function() {
      element = $compile(
          '<ul>' +
              '<li ng-repeat="item in items track by item.id">{{item.name}};</li>' +
              '</ul>')(scope);
      scope.items = [{id: 'misko'}, {id: 'igor'}];
      scope.$digest();
      var li0 = element.find('li')[0];
      var li1 = element.find('li')[1];

      scope.items.push(scope.items.shift());
      scope.$digest();
      expect(element.find('li')[0]).toBe(li1);
      expect(element.find('li')[1]).toBe(li0);
    });


    it('should track using build in $id function', function() {
      element = $compile(
          '<ul>' +
              '<li ng-repeat="item in items track by $id(item)">{{item.name}};</li>' +
              '</ul>')(scope);
      scope.items = [{name: 'misko'}, {name: 'igor'}];
      scope.$digest();
      var li0 = element.find('li')[0];
      var li1 = element.find('li')[1];

      scope.items.push(scope.items.shift());
      scope.$digest();
      expect(element.find('li')[0]).toBe(li1);
      expect(element.find('li')[1]).toBe(li0);
    });


    it('should still filter when track is present', function() {
      scope.isIgor = function(item) {
        return item.name === 'igor';
      };
      element = $compile(
          '<ul>' +
            '<li ng-repeat="item in items | filter:isIgor track by $id(item)">{{item.name}};</li>' +
          '</ul>')(scope);
      scope.items = [{name: 'igor'}, {name: 'misko'}];
      scope.$digest();

      expect(element.find('li').text()).toBe('igor;');
    });


    it('should track using provided function when a filter is present', function() {
      scope.newArray = function(items) {
        var newArray = [];
        angular.forEach(items, function(item) {
          newArray.push({
            id: item.id,
            name: item.name
          });
        });
        return newArray;
      };
      element = $compile(
          '<ul>' +
            '<li ng-repeat="item in items | filter:newArray track by item.id">{{item.name}};</li>' +
          '</ul>')(scope);
      scope.items = [
        {id: 1, name: 'igor'},
        {id: 2, name: 'misko'}
      ];
      scope.$digest();

      expect(element.text()).toBe('igor;misko;');

      var li0 = element.find('li')[0];
      var li1 = element.find('li')[1];

      scope.items.push(scope.items.shift());
      scope.$digest();
      expect(element.find('li')[0]).toBe(li1);
      expect(element.find('li')[1]).toBe(li0);
    });


    it('should iterate over an array of primitives', function() {
      element = $compile(
          '<ul>' +
              '<li ng-repeat="item in items track by $index">{{item}};</li>' +
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


    it('should iterate over object with changing primitive property values', function() {
      // test for issue #933

      element = $compile(
          '<ul>' +
            '<li ng-repeat="(key, value) in items track by $index">' +
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
  });

  describe('alias as', function() {
    it('should assigned the filtered to the target scope property if an alias is provided', function() {
      element = $compile(
        '<div ng-repeat="item in items | filter:x as results track by $index">{{item.name}}/</div>')(scope);

      scope.items = [
        { name: 'red' },
        { name: 'blue' },
        { name: 'green' },
        { name: 'black' },
        { name: 'orange' },
        { name: 'blonde' }
      ];

      expect(scope.results).toBeUndefined();
      scope.$digest();

      scope.x = 'bl';
      scope.$digest();

      expect(scope.results).toEqual([
        { name: 'blue' },
        { name: 'black' },
        { name: 'blonde' }
      ]);

      scope.items = [];
      scope.$digest();

      expect(scope.results).toEqual([]);
    });

    it('should render a message when the repeat list is empty', function() {
      element = $compile(
        '<div>' +
        '  <div ng-repeat="item in items | filter:x as results">{{item}}</div>' +
        '  <div ng-if="results.length == 0">' +
        '    No results found...' +
        '  </div>' +
        '</div>')(scope);

      scope.items = [1,2,3,4,5,6];
      scope.$digest();
      expect(trim(element.text())).toEqual('123456');

      scope.x = '0';
      scope.$digest();

      expect(trim(element.text())).toEqual('No results found...');
    });


    it('should support alias identifiers containing reserved words', inject(function($exceptionHandler) {
      scope.x = 'bl';
      scope.items = [
        { name: 'red' },
        { name: 'blue' },
        { name: 'green' },
        { name: 'black' },
        { name: 'orange' },
        { name: 'blonde' }
      ];
      forEach([
        'null2',
        'qthis',
        'qthisq',
        'fundefined',
        '$$parent'
      ], function(name) {
        var expr = 'item in items | filter:x as ' + name + ' track by $index';
        element = $compile('<div><div ng-repeat="' + expr + '"></div></div>')(scope);
        scope.$digest();
        expect(scope[name]).toEqual([
          { name: 'blue' },
          { name: 'black' },
          { name: 'blonde' }
        ]);
        dealoc(element);
      });
    }));


    it('should throw if alias identifier is not a simple identifier', inject(function($exceptionHandler) {
      scope.x = 'bl';
      scope.items = [
        { name: 'red' },
        { name: 'blue' },
        { name: 'green' },
        { name: 'black' },
        { name: 'orange' },
        { name: 'blonde' }
      ];

      forEach([
        'null',
        'this',
        'undefined',
        '$parent',
        '$root',
        '$id',
        '$index',
        '$first',
        '$middle',
        '$last',
        '$even',
        '$odd',
        'obj[key]',
        'obj["key"]',
        'obj[\'key\']',
        'obj.property',
        'foo=6'
      ], function(expr) {
        var expression = ('item in items | filter:x as ' + expr + ' track by $index').replace(/"/g, '&quot;');
        element = $compile(
          '<div>' +
          '  <div ng-repeat="' + expression + '">{{item}}</div>' +
          '</div>')(scope);

        var expected = new RegExp('^\\[ngRepeat:badident\\] alias \'' + escape(expr) + '\' is invalid --- must be a valid JS identifier which is not a reserved name');
        expect($exceptionHandler.errors.shift()[0].message).
          toMatch(expected);
        dealoc(element);
      });

      function escape(text) {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }
    }));
  });


  it('should allow expressions over multiple lines', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items\n' +
        '| filter:isTrue">{{item.name}}/</li>' +
      '</ul>')(scope);

    scope.isTrue = function() {return true;};
    scope.items = [{name: 'igor'}, {name: 'misko'}];

    scope.$digest();

    expect(element.text()).toEqual('igor/misko/');
  });


  it('should strip white space characters correctly', function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item   \t\n  \t  in  \n \t\n\n \nitems \t\t\n | filter:\n\n{' +
        '\n\t name:\n\n \'ko\'\n\n}\n\n | orderBy: \t \n \'name\' \n\n' +
        'track \t\n  by \n\n\t $index \t\n ">{{item.name}}/</li>' +
      '</ul>')(scope);

    scope.items = [{name: 'igor'}, {name: 'misko'}];

    scope.$digest();

    expect(element.text()).toEqual('misko/');
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
    element = jqLite('<ul><li ng-repeat="i dont parse"></li></ul>');
    $compile(element)(scope);
    expect($exceptionHandler.errors.shift()[0].message).
        toMatch(/^\[ngRepeat:iexp\] Expected expression in form of '_item_ in _collection_\[ track by _id_\]' but got 'i dont parse'\./);
  });


  it("should throw error when left-hand-side of ngRepeat can't be parsed", function() {
    element = jqLite('<ul><li ng-repeat="i dont parse in foo"></li></ul>');
    $compile(element)(scope);
    expect($exceptionHandler.errors.shift()[0].message).
      toMatch(/^\[ngRepeat:iidexp\] '_item_' in '_item_ in _collection_' should be an identifier or '\(_key_, _value_\)' expression, but got 'i dont parse'\./);
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
    expect(element.text()).toEqual('misko:m:0|shyam:s:1|frodo:f:2|');
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


  it('should expose iterator position as $even and $odd when iterating over arrays',
      function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="item in items">{{item}}:{{$even}}-{{$odd}}|</li>' +
      '</ul>')(scope);
    scope.items = ['misko', 'shyam', 'doug'];
    scope.$digest();
    expect(element.text()).
        toEqual('misko:true-false|shyam:false-true|doug:true-false|');

    scope.items.push('frodo');
    scope.$digest();
    expect(element.text()).
        toBe('misko:true-false|' +
                'shyam:false-true|' +
                'doug:true-false|' +
                'frodo:false-true|');

    scope.items.shift();
    scope.items.pop();
    scope.$digest();
    expect(element.text()).toBe('shyam:true-false|doug:false-true|');
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
        toEqual('misko:m:true-false-false|' +
                'shyam:s:false-true-false|' +
                'doug:d:false-true-false|' +
                'frodo:f:false-false-true|');

    delete scope.items.doug;
    delete scope.items.frodo;
    scope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-false|shyam:s:false-false-true|');

    delete scope.items.shyam;
    scope.$digest();
    expect(element.text()).toEqual('misko:m:true-false-true|');
  });


  it('should expose iterator position as $even and $odd when iterating over objects',
      function() {
    element = $compile(
      '<ul>' +
        '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$even}}-{{$odd}}|</li>' +
      '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
    scope.$digest();
    expect(element.text()).
        toBe('misko:m:true-false|' +
                'shyam:s:false-true|' +
                'doug:d:true-false|' +
                'frodo:f:false-true|');

    delete scope.items.frodo;
    delete scope.items.shyam;
    scope.$digest();
    expect(element.text()).toBe('misko:m:true-false|doug:d:false-true|');
  });


  it('should calculate $first, $middle and $last when we filter out properties from an obj', function() {
    element = $compile(
        '<ul>' +
            '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$first}}-{{$middle}}-{{$last}}|</li>' +
            '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f', '$toBeFilteredOut': 'xxxx'};
    scope.$digest();

    expect(element.text()).
        toEqual('misko:m:true-false-false|' +
        'shyam:s:false-true-false|' +
        'doug:d:false-true-false|' +
        'frodo:f:false-false-true|');
  });


  it('should calculate $even and $odd when we filter out properties from an obj', function() {
    element = $compile(
        '<ul>' +
            '<li ng-repeat="(key, val) in items">{{key}}:{{val}}:{{$even}}-{{$odd}}|</li>' +
            '</ul>')(scope);
    scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f', '$toBeFilteredOut': 'xxxx'};
    scope.$digest();
    expect(element.text()).
        toEqual('misko:m:true-false|' +
        'shyam:s:false-true|' +
        'doug:d:true-false|' +
        'frodo:f:false-true|');
  });


  it('should ignore $ and $$ properties', function() {
    element = $compile('<ul><li ng-repeat="i in items">{{i}}|</li></ul>')(scope);
    scope.items = ['a', 'b', 'c'];
    scope.items.$$hashKey = 'xxx';
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
    element = $compile('<ul><li ng-repeat="item in array track by $index">{{item}}|</li></ul>')(scope);
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


  it('should preserve data on move of elements', function() {
    element = $compile('<ul><li ng-repeat="item in array">{{item}}|</li></ul>')(scope);
    scope.array = ['a', 'b'];
    scope.$digest();

    var lis = element.find('li');
    lis.eq(0).data('mark', 'a');
    lis.eq(1).data('mark', 'b');

    scope.array = ['b', 'a'];
    scope.$digest();

    lis = element.find('li');
    expect(lis.eq(0).data('mark')).toEqual('b');
    expect(lis.eq(1).data('mark')).toEqual('a');
  });


  describe('nesting in replaced directive templates', function() {

    it('should work when placed on a non-root element of attr directive with SYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('rr', function() {
        return {
          restrict: 'A',
          replace: true,
          template: '<div ng-repeat="i in items">{{i}}|</div>'
        };
      });
      element = jqLite('<div><span rr>{{i}}|</span></div>');
      $compile(element)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('');

      $rootScope.items = [1, 2];
      $rootScope.$apply();
      expect(element.text()).toBe('1|2|');
      expect(sortedHtml(element)).toBe(
          '<div>' +
            '<!-- ngRepeat: i in items -->' +
            '<div ng-repeat="i in items" rr="">1|</div>' +
            '<!-- end ngRepeat: i in items -->' +
            '<div ng-repeat="i in items" rr="">2|</div>' +
            '<!-- end ngRepeat: i in items -->' +
          '</div>'
      );
    }));


    it('should work when placed on a non-root element of attr directive with ASYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('rr', function() {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'rr.html'
        };
      });

      $templateCache.put('rr.html', '<div ng-repeat="i in items">{{i}}|</div>');

      element = jqLite('<div><span rr>{{i}}|</span></div>');
      $compile(element)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('');

      $rootScope.items = [1, 2];
      $rootScope.$apply();
      expect(element.text()).toBe('1|2|');
      expect(sortedHtml(element)).toBe(
          '<div>' +
              '<!-- ngRepeat: i in items -->' +
              '<div ng-repeat="i in items" rr="">1|</div>' +
              '<!-- end ngRepeat: i in items -->' +
              '<div ng-repeat="i in items" rr="">2|</div>' +
              '<!-- end ngRepeat: i in items -->' +
              '</div>'
      );
    }));


    it('should work when placed on a root element of attr directive with SYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('replaceMeWithRepeater', function() {
        return {
          replace: true,
          template: '<span ng-repeat="i in items">{{log(i)}}</span>'
        };
      });
      element = jqLite('<span replace-me-with-repeater></span>');
      $compile(element)($rootScope);
      expect(element.text()).toBe('');
      var logs = [];
      $rootScope.log = function(t) { logs.push(t); };

      // This creates one item, but it has no parent so we can't get to it
      $rootScope.items = [1, 2];
      $rootScope.$apply();
      expect(logs).toContain(1);
      expect(logs).toContain(2);
      logs.length = 0;

      // This cleans up to prevent memory leak
      $rootScope.items = [];
      $rootScope.$apply();
      expect(angular.mock.dump(element)).toBe('<!-- ngRepeat: i in items -->');
      expect(logs.length).toBe(0);
    }));


    it('should work when placed on a root element of attr directive with ASYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('replaceMeWithRepeater', function() {
        return {
          replace: true,
          templateUrl: 'replace-me-with-repeater.html'
        };
      });
      $templateCache.put('replace-me-with-repeater.html', '<div ng-repeat="i in items">{{log(i)}}</div>');
      element = jqLite('<span>-</span><span replace-me-with-repeater></span><span>-</span>');
      $compile(element)($rootScope);
      expect(element.text()).toBe('--');
      var logs = [];
      $rootScope.log = function(t) { logs.push(t); };

      // This creates one item, but it has no parent so we can't get to it
      $rootScope.items = [1, 2];
      $rootScope.$apply();
      expect(logs).toContain(1);
      expect(logs).toContain(2);
      logs.length = 0;

      // This cleans up to prevent memory leak
      $rootScope.items = [];
      $rootScope.$apply();
      expect(sortedHtml(element)).toBe('<span>-</span><!-- ngRepeat: i in items --><span>-</span>');
      expect(logs.length).toBe(0);
    }));


    it('should work when placed on a root element of element directive with SYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('replaceMeWithRepeater', function() {
        return {
          restrict: 'E',
          replace: true,
          template: '<div ng-repeat="i in [1,2,3]">{{i}}</div>'
        };
      });
      element = $compile('<div><replace-me-with-repeater></replace-me-with-repeater></div>')($rootScope);
      expect(element.text()).toBe('');
      $rootScope.$apply();
      expect(element.text()).toBe('123');
    }));


    it('should work when placed on a root element of element directive with ASYNC replaced template',
        inject(function($templateCache, $compile, $rootScope) {
      $compileProvider.directive('replaceMeWithRepeater', function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'replace-me-with-repeater.html'
        };
      });
      $templateCache.put('replace-me-with-repeater.html', '<div ng-repeat="i in [1,2,3]">{{i}}</div>');
      element = $compile('<div><replace-me-with-repeater></replace-me-with-repeater></div>')($rootScope);
      expect(element.text()).toBe('');
      $rootScope.$apply();
      expect(element.text()).toBe('123');
    }));

    it('should work when combined with an ASYNC template that loads after the first digest', inject(function($httpBackend, $compile, $rootScope) {
      $compileProvider.directive('test', function() {
        return {
          templateUrl: 'test.html'
        };
      });
      $httpBackend.whenGET('test.html').respond('hello');
      element = jqLite('<div><div ng-repeat="i in items" test></div></div>');
      $compile(element)($rootScope);
      $rootScope.items = [1];
      $rootScope.$apply();
      expect(element.text()).toBe('');

      $httpBackend.flush();
      expect(element.text()).toBe('hello');

      $rootScope.items = [];
      $rootScope.$apply();
      // Note: there are still comments in element!
      expect(element.children().length).toBe(0);
      expect(element.text()).toBe('');
    }));
  });

  it('should add separator comments after each item', inject(function($compile, $rootScope) {
    var check = function() {
      var children = element.find('div');
      expect(children.length).toBe(3);

      // Note: COMMENT_NODE === 8
      expect(children[0].nextSibling.nodeType).toBe(8);
      expect(children[0].nextSibling.nodeValue).toBe(' end ngRepeat: val in values ');
      expect(children[1].nextSibling.nodeType).toBe(8);
      expect(children[1].nextSibling.nodeValue).toBe(' end ngRepeat: val in values ');
      expect(children[2].nextSibling.nodeType).toBe(8);
      expect(children[2].nextSibling.nodeValue).toBe(' end ngRepeat: val in values ');
    };

    $rootScope.values = [1, 2, 3];

    element = $compile(
      '<div>' +
        '<div ng-repeat="val in values">val:{{val}};</div>' +
      '</div>'
    )($rootScope);

    $rootScope.$digest();
    check();

    $rootScope.values.shift();
    $rootScope.values.push(4);
    $rootScope.$digest();
    check();
  }));


  it('should remove whole block even if the number of elements inside it changes', inject(
      function($compile, $rootScope) {

    $rootScope.values = [1, 2, 3];

    element = $compile(
      '<div>' +
        '<div ng-repeat-start="val in values"></div>' +
        '<span>{{val}}</span>' +
        '<p ng-repeat-end></p>' +
      '</div>'
    )($rootScope);

    $rootScope.$digest();

    var ends = element.find('p');
    expect(ends.length).toBe(3);

    // insert an extra element inside the second block
    var extra = angular.element('<strong></strong>')[0];
    element[0].insertBefore(extra, ends[1]);

    $rootScope.values.splice(1, 1);
    $rootScope.$digest();

    // expect the strong tag to be removed too
    expect(childrenTagsOf(element)).toEqual([
      'div', 'span', 'p',
      'div', 'span', 'p'
    ]);
  }));


  it('should move whole block even if the number of elements inside it changes', inject(
      function($compile, $rootScope) {

    $rootScope.values = [1, 2, 3];

    element = $compile(
      '<div>' +
        '<div ng-repeat-start="val in values"></div>' +
        '<span>{{val}}</span>' +
        '<p ng-repeat-end></p>' +
      '</div>'
    )($rootScope);

    $rootScope.$digest();

    var ends = element.find('p');
    expect(ends.length).toBe(3);

    // insert an extra element inside the third block
    var extra = angular.element('<strong></strong>')[0];
    element[0].insertBefore(extra, ends[2]);

    // move the third block to the beginning
    $rootScope.values.unshift($rootScope.values.pop());
    $rootScope.$digest();

    // expect the strong tag to be moved too
    expect(childrenTagsOf(element)).toEqual([
      'div', 'span', 'strong', 'p',
      'div', 'span', 'p',
      'div', 'span', 'p'
    ]);
  }));


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


    it('should throw error on adding existing duplicates and recover', function() {
      scope.items = [a, a, a];
      scope.$digest();
      expect($exceptionHandler.errors.shift().message).
          toMatch(
            /^\[ngRepeat:dupes\] Duplicates in a repeater are not allowed\. Use 'track by' expression to specify unique keys\. Repeater: item in items, Duplicate key: object:3, Duplicate value: {}/);

      // recover
      scope.items = [a];
      scope.$digest();
      var newElements = element.find('li');
      expect(newElements.length).toEqual(1);
      expect(newElements[0]).toEqual(lis[0]);

      scope.items = [];
      scope.$digest();
      newElements = element.find('li');
      expect(newElements.length).toEqual(0);
    });


    it('should throw error on new duplicates and recover', function() {
      scope.items = [d, d, d];
      scope.$digest();
      expect($exceptionHandler.errors.shift().message).
          toMatch(
            /^\[ngRepeat:dupes\] Duplicates in a repeater are not allowed\. Use 'track by' expression to specify unique keys\. Repeater: item in items, Duplicate key: object:9, Duplicate value: {}/);

      // recover
      scope.items = [a];
      scope.$digest();
      var newElements = element.find('li');
      expect(newElements.length).toEqual(1);
      expect(newElements[0]).toEqual(lis[0]);

      scope.items = [];
      scope.$digest();
      newElements = element.find('li');
      expect(newElements.length).toEqual(0);
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
      lis[2].id = 'yes';

      scope.items = ['ahoj', 'hello', 'cau'];
      scope.$digest();
      var newLis = element.find('li');
      expect(newLis.length).toEqual(3);
      expect(newLis[0]).toEqual(lis[2]);
      expect(newLis[1]).toEqual(lis[0]);
      expect(newLis[2]).toEqual(lis[1]);
    });

    it('should be stable even if the collection is initially undefined', function() {
      scope.items = undefined;
      scope.$digest();

      scope.items = [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' }
      ];
      scope.$digest();

      lis = element.find('li');
      scope.items.shift();
      scope.$digest();

      var newLis = element.find('li');
      expect(newLis.length).toBe(2);
      expect(newLis[0]).toBe(lis[1]);
    });
  });


  describe('compatibility', function() {

    it('should allow mixing ngRepeat and another element transclusion directive', function() {
      $compileProvider.directive('elmTrans', valueFn({
        transclude: 'element',
        controller: function($transclude, $scope, $element) {
          $transclude(function(transcludedNodes) {
            $element.after(']]').after(transcludedNodes).after('[[');
          });
        }
      }));

      inject(function($compile, $rootScope) {
        element = $compile('<div><div ng-repeat="i in [1,2]" elm-trans>{{i}}</div></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('[[1]][[2]]');
      });
    });


    it('should allow mixing ngRepeat with ngInclude', inject(function($compile, $rootScope, $httpBackend) {
      $httpBackend.whenGET('someTemplate.html').respond('<p>some template; </p>');
      element = $compile('<div><div ng-repeat="i in [1,2]" ng-include="\'someTemplate.html\'"></div></div>')($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();
      expect(element.text()).toBe('some template; some template; ');
    }));


    it('should allow mixing ngRepeat with ngIf', inject(function($compile, $rootScope) {
      element = $compile('<div><div ng-repeat="i in [1,2,3,4]" ng-if="i % 2 == 0">{{i}};</div></div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toBe('2;4;');
    }));
  });


  describe('ngRepeatStart', function() {
    it('should grow multi-node repeater', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      $rootScope.books = [
        {title:'T1', description: 'D1'},
        {title:'T2', description: 'D2'}
      ];
      element = $compile(
          '<div>' +
              '<dt ng-repeat-start="book in books">{{book.title}}:</dt>' +
              '<dd ng-repeat-end>{{book.description}};</dd>' +
          '</div>')($rootScope);

      $rootScope.$digest();
      expect(element.text()).toEqual('T1:D1;T2:D2;');
      $rootScope.books.push({title:'T3', description: 'D3'});
      $rootScope.$digest();
      expect(element.text()).toEqual('T1:D1;T2:D2;T3:D3;');
    }));


    it('should not clobber ng-if when updating collection', inject(function($compile, $rootScope) {
      $rootScope.values = [1, 2, 3];
      $rootScope.showMe = true;

      element = $compile(
        '<div>' +
          '<div ng-repeat-start="val in values">val:{{val}};</div>' +
          '<div ng-if="showMe" ng-repeat-end>if:{{val}};</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$digest();
      expect(element.find('div').length).toBe(6);

      $rootScope.values.shift();
      $rootScope.values.push(4);

      $rootScope.$digest();
      expect(element.find('div').length).toBe(6);
      expect(element.text()).not.toContain('if:1;');
    }));
  });
});

describe('ngRepeat and transcludes', function() {
  it('should allow access to directive controller from children when used in a replace template', function() {
    var controller;
    module(function($compileProvider) {
      var directive = $compileProvider.directive;
      directive('template', valueFn({
        template: '<div ng-repeat="l in [1]"><span test></span></div>',
        replace: true,
        controller: function() {
          this.flag = true;
        }
      }));
      directive('test', valueFn({
        require: '^template',
        link: function(scope, el, attr, ctrl) {
          controller = ctrl;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      var element = $compile('<div><div template></div></div>')($rootScope);
      $rootScope.$apply();
      expect(controller.flag).toBe(true);
      dealoc(element);
    });
  });


  it('should use the correct transcluded scope', function() {
    module(function($compileProvider) {
      $compileProvider.directive('iso', valueFn({
        restrict: 'E',
        transclude: true,
        template: '<div ng-repeat="a in [1]"><div ng-transclude></div></div>',
        scope: {}
      }));
    });
    inject(function($compile, $rootScope) {
      $rootScope.val = 'transcluded content';
      var element = $compile('<iso><span ng-bind="val"></span></iso>')($rootScope);
      $rootScope.$digest();
      expect(trim(element.text())).toEqual('transcluded content');
      dealoc(element);
    });
  });


  it('should set the state before linking', function() {
    module(function($compileProvider) {
      $compileProvider.directive('assertA', valueFn(function(scope) {
        // This linking function asserts that a is set.
        // If we only test this by asserting binding, it will work even if the value is set later.
        expect(scope.a).toBeDefined();
      }));
    });
    inject(function($compile, $rootScope) {
      var element = $compile('<div><span ng-repeat="a in [1]"><span assert-a></span></span></div>')($rootScope);
      $rootScope.$digest();
      dealoc(element);
    });
  });


  it('should work with svg elements when the svg container is transcluded', function() {
    module(function($compileProvider) {
      $compileProvider.directive('svgContainer', function() {
        return {
          template: '<svg ng-transclude></svg>',
          replace: true,
          transclude: true
        };
      });
    });
    inject(function($compile, $rootScope) {
      var element = $compile('<svg-container><circle ng-repeat="r in rows"></circle></svg-container>')($rootScope);
      $rootScope.rows = [1];
      $rootScope.$apply();

      var circle = element.find('circle');
      expect(circle[0].toString()).toMatch(/SVG/);
      dealoc(element);
    });
  });
});

describe('ngRepeat animations', function() {
  var body, element, $rootElement;

  function html(content) {
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function() {
    body.empty();
  });

  it('should fire off the enter animation',
    inject(function($compile, $rootScope, $animate) {

    var item;

    element = $compile(html(
      '<div><div ' +
        'ng-repeat="item in items">' +
        '{{ item }}' +
      '</div></div>'
    ))($rootScope);

    $rootScope.$digest(); // re-enable the animations;

    $rootScope.items = ['1','2','3'];
    $rootScope.$digest();

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('1');

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('2');

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('3');
  }));

  it('should fire off the leave animation',
    inject(function($compile, $rootScope, $animate) {

    var item;

    element = $compile(html(
      '<div><div ' +
        'ng-repeat="item in items">' +
        '{{ item }}' +
      '</div></div>'
    ))($rootScope);

    $rootScope.items = ['1','2','3'];
    $rootScope.$digest();

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('1');

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('2');

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');
    expect(item.element.text()).toBe('3');

    $rootScope.items = ['1','3'];
    $rootScope.$digest();

    item = $animate.queue.shift();
    expect(item.event).toBe('leave');
    expect(item.element.text()).toBe('2');
  }));

  it('should not change the position of the block that is being animated away via a leave animation',
    inject(function($compile, $rootScope, $animate, $document, $window, $sniffer, $timeout) {
      if (!$sniffer.transitions) return;

      var item;
      var ss = createMockStyleSheet($document, $window);

      try {

        $animate.enabled(true);

        ss.addRule('.animate-me div',
                      '-webkit-transition:1s linear all; transition:1s linear all;');

        element = $compile(html('<div class="animate-me">' +
                                  '<div ng-repeat="item in items">{{ item }}</div>' +
                                '</div>'))($rootScope);

        $rootScope.items = ['1','2','3'];
        $rootScope.$digest();
        expect(element.text()).toBe('123');

        $rootScope.items = ['1','3'];
        $rootScope.$digest();

        expect(element.text()).toBe('123'); // the original order should be preserved
        $animate.triggerReflow();
        $timeout.flush(1500); // 1s * 1.5 closing buffer
        expect(element.text()).toBe('13');

      } finally {
        ss.destroy();
      }
    })
  );

  it('should fire off the move animation',
    inject(function($compile, $rootScope, $animate) {

      var item;

      element = $compile(html(
        '<div>' +
          '<div ng-repeat="item in items">' +
            '{{ item }}' +
          '</div>' +
        '</div>'
      ))($rootScope);

      $rootScope.items = ['1','2','3'];
      $rootScope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('1');

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('2');

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('3');

      $rootScope.items = ['2','3','1'];
      $rootScope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('move');
      expect(item.element.text()).toBe('2');

      item = $animate.queue.shift();
      expect(item.event).toBe('move');
      expect(item.element.text()).toBe('3');
    })
  );
});
