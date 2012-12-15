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


  describe('comment-based repeater', function() {

    var $compile, scope;

    beforeEach(inject(function(_$compile_, $rootScope) {
      $compile = _$compile_;
      scope = $rootScope;
    }));


    it('should work as a simple comment directive', function() {
      scope.items = [
        {text: 'sleep', done: true},
        {text: 'eat',   done: true},
        {text: 'run',   done: false}
      ];

      element = $compile(
          '<div>' +
            '<!-- directive: ng-repeat item in items-->' +
              '<span>{{item.text}}</span>' +
              '<span>{{item.done}}</span>' +
            '<!-- /ng-repeat -->' +
          '</div>')(scope);

      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>sleep</span><span>true</span>' +
          '<span>eat</span><span>true</span>' +
          '<span>run</span><span>false</span>');
    });


    it('should normalize directive name in start and end tag', function() {
      scope.items = ['a', 'b', 'c'];

      element = $compile(
          '<div>' +
              '<!-- directive: data-ng-repeat item in items-->' +
              '<span>{{item}}</span>' +
              '<!-- /ng:repeat -->' +
              '</div>')(scope);

      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>a</span>' +
          '<span>b</span>' +
          '<span>c</span>');
    });


    it('should shrink and grow', function() {
      scope.items = [
        {text: 'sleep', done: true},
        {text: 'eat',   done: true},
        {text: 'run',   done: false}
      ];

      element = $compile(
          '<div>' +
            '<!-- directive: ng-repeat item in items-->' +
              '<span>{{item.text}}</span>' +
              '<span>{{item.done}}</span>' +
            '<!-- /ng-repeat -->' +
          '</div>')(scope);


      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>sleep</span><span>true</span>' +
          '<span>eat</span><span>true</span>' +
          '<span>run</span><span>false</span>');


      scope.items.shift();
      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>eat</span><span>true</span>' +
          '<span>run</span><span>false</span>');


      scope.items = [];
      scope.$digest();

      expect(element.html()).toBe(
          '<!-- ngRepeat: item in items -->');

      scope.items.push({text: 'fly', done: true});
      scope.items.push({text: 'cook', done: false});
      scope.$digest();


      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>fly</span><span>true</span>' +
          '<span>cook</span><span>false</span>');

    });


    it('should reorder groups of nodes', function() {
      scope.items = [
        {text: 'sleep', done: true},
        {text: 'eat',   done: true},
        {text: 'run',   done: false}
      ];

      element = $compile(
          '<div>' +
            '<!-- directive: ng-repeat item in items-->' +
              '<span>{{item.text}}</span>' +
              '<span>{{item.done}}</span>' +
            '<!-- /ng-repeat -->' +
          '</div>')(scope);


      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>sleep</span><span>true</span>' +
          '<span>eat</span><span>true</span>' +
          '<span>run</span><span>false</span>');


      scope.items.push(scope.items.shift());
      scope.$digest();

      expect(sortedHtml(element.html())).toBe(
          '<!-- ngRepeat: item in items -->' +
          '<span>eat</span><span>true</span>' +
          '<span>run</span><span>false</span>' +
          '<span>sleep</span><span>true</span>');
    });


    it('should support nesting of repeaters', function() {
      scope.items = [
        {
          text: 'sleep',
          tags: [{name: 'recharge', size: 3}, {name: 'relax', size: 2}]
        },
        {
          text: 'eat',
          tags: [{name: 'refuel', size: 1}, {name: 'enjoy', size: 5}]
        },
        {
          text: 'run',
          tags: [{name: 'workout', size: 2}, {name: 'recharge', size: 4}]
        }
      ];

      element = $compile(
          '<div>' +
            '<table>' +
                '<tbody>' +
                '<!-- directive: ng-repeat item in items -->' +
                  '<tr>' +
                    '<td>{{item.text}}</td>' +
                    '<td>' +
                      '<!-- directive: ng-repeat tag in item.tags -->' +
                        '<span>{{tag.name}}</span><span>{{tag.size}}</span>' +
                      '<!-- /ng-repeat -->' +
                    '</td>' +
                  '</tr>'+
                  '<tr>' +
                    '<td>{{$index}}</td>' +
                  '</tr>' +
                '<!-- /ng-repeat -->' +
                '</tbody>' +
            '</table>' +
          '</div>')(scope);

      scope.$digest();


      expect(sortedHtml(element.html())).toBe(
          '<table>' +
            '<tbody>' +
              '<!-- ngRepeat: item in items -->' +
              '<tr>' +
                '<td>sleep</td>' +
                '<td>' +
                  '<!-- ngRepeat: tag in item.tags -->' +
                  '<span>recharge</span>' +
                  '<span>3</span>' +
                  '<span>relax</span>' +
                  '<span>2</span>' +
                '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>0</td>' +
              '</tr>' +
              '<tr>' +
                '<td>eat</td>' +
                '<td>' +
                  '<!-- ngRepeat: tag in item.tags -->' +
                  '<span>refuel</span>' +
                  '<span>1</span>' +
                  '<span>enjoy</span>' +
                  '<span>5</span>' +
                '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>1</td>' +
              '</tr>' +
              '<tr>' +
                '<td>run</td>' +
                '<td>' +
                  '<!-- ngRepeat: tag in item.tags -->' +
                  '<span>workout</span>' +
                  '<span>2</span>' +
                  '<span>recharge</span>' +
                  '<span>4</span>' +
                '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>2</td>' +
              '</tr>' +
            '</tbody>' +
          '</table>');
    });


    describe('DOM corner-cases', function() {

      it('should support repeaters for table bodies (tbody)', function() {
        scope.items = ['a', 'b', 'c'];

        element = $compile(
            '<div>' +
              '<table>' +
                '<!-- directive: ng-repeat item in items -->' +
                '<tbody><tr><td>{{item}}</td></tr></tbody>' +
                '<tbody><tr><td>{{$index}}</td></tr></tbody>' +
                '<!-- /ng-repeat -->' +
              '</table>' +
            '</div>'
        )(scope);

        scope.$digest();

        expect(sortedHtml(element.html())).toBe(
            '<table>' +
              '<!-- ngRepeat: item in items -->' +
              '<tbody><tr><td>a</td></tr></tbody>' +
              '<tbody><tr><td>0</td></tr></tbody>' +
              '<tbody><tr><td>b</td></tr></tbody>' +
              '<tbody><tr><td>1</td></tr></tbody>' +
              '<tbody><tr><td>c</td></tr></tbody>' +
              '<tbody><tr><td>2</td></tr></tbody>' +
            '</table>'
        );
      });


      it('should support repeaters for table rows in tables with tbody', function() {
        scope.items = ['a', 'b', 'c'];

        element = $compile(
            '<div>' +
              '<table>' +
                '<tbody>' +
                  '<!-- directive: ng-repeat item in items -->' +
                    '<tr><td>{{item}}</td></tr>' +
                    '<tr><td>{{$index}}</td></tr>' +
                  '<!-- /ng-repeat -->' +
                '</tbody>' +
              '</table>' +
            '</div>'
        )(scope);

        scope.$digest();

        expect(sortedHtml(element.html())).toBe(
            '<table>' +
              '<tbody>' +
                '<!-- ngRepeat: item in items -->' +
                '<tr><td>a</td></tr>' +
                '<tr><td>0</td></tr>' +
                '<tr><td>b</td></tr>' +
                '<tr><td>1</td></tr>' +
                '<tr><td>c</td></tr>' +
                '<tr><td>2</td></tr>' +
              '</tbody>' +
            '</table>'
        );
      });


      it('should support repeaters for table cells', function() {
        scope.items = ['a', 'b', 'c'];

        element = $compile(
            '<div>' +
              '<table>' +
                '<tr>' +
                  '<!-- directive: ng-repeat item in items -->' +
                    '<td>{{item}}</td>' +
                    '<td>{{$index}}</td>' +
                  '<!-- /ng-repeat -->' +
                '</tr>' +
              '</table>' +
            '</div>'
        )(scope);

        scope.$digest();

        expect(sortedHtml(element.html())).toBe(
            '<table>' +
              '<tbody>' +
                '<tr>' +
                  '<!-- ngRepeat: item in items -->' +
                  '<td>a</td>' +
                  '<td>0</td>' +
                  '<td>b</td>' +
                  '<td>1</td>' +
                  '<td>c</td>' +
                  '<td>2</td>' +
                '</tr>' +
              '</tbody>' +
            '</table>'
        );
      });


      it('should support repeaters for list items', function() {
        scope.items = ['a', 'b', 'c'];

        element = $compile(
            '<ul>' +
              '<!-- directive: ng-repeat item in items -->' +
                '<li>{{item}}</li>' +
                '<li>{{$index}}</li>' +
              '<!-- /ng-repeat -->' +
            '</ul>'
        )(scope);

        scope.$digest();

        expect(sortedHtml(element.html())).toBe(
            '<!-- ngRepeat: item in items -->' +
            '<li>a</li>' +
            '<li>0</li>' +
            '<li>b</li>' +
            '<li>1</li>' +
            '<li>c</li>' +
            '<li>2</li>'
        );
      });


      if (!msie || msie > 9) {
        // IE doesn't preserve any comments within select element

        it('should support repeaters for options', function() {
          scope.items = ['a', 'b', 'c'];

          element = $compile(
              '<select>' +
                '<!-- directive: ng-repeat item in items -->' +
                  '<option>{{item}}</option>' +
                  '<option>{{$index}}</option>' +
                '<!-- /ng-repeat -->' +
              '</select>'
          )(scope);

          scope.$digest();

          expect(sortedHtml(element.html())).toBe(
              '<!-- ngRepeat: item in items -->' +
              '<option value="a">a</option>' +
              '<option value="0">0</option>' +
              '<option value="b">b</option>' +
              '<option value="1">1</option>' +
              '<option value="c">c</option>' +
              '<option value="2">2</option>'
          );
        });
      }
    });


    describe('error handling', function() {

      it("should complain when end tag can't be found among one of the following siblings",
          function() {

        forEach([

          // no content, no end tag
          '<!-- directive: ng-repeat item in items -->',


          // content, no end tag
          '<!-- directive: ng-repeat item in items -->' +
            '<span>{{item.text}}></span>' +
            '<span>{{item.done}}</span>',


          // content, end tag too deep
          '<!-- directive: ng-repeat item in items -->' +
            '<div>' +
              '<span>{{item.text}}></span>' +
              '<span>{{item.done}}</span>' +
              '<!-- /ng-repeat -->' +
            '</div>',


          // content, end tag too high
          '<div>' +
            '<!-- directive: ng-repeat item in items -->' +
              '<span>{{item.text}}></span>' +
              '<span>{{item.done}}</span>' +
          '</div>' +
          '<!-- /ng-repeat -->',


          // end tag missing final "-->"
          '<!-- directive: ng-repeat item in items -->' +
            '<span>{{item.text}}></span>' +
            '<span>{{item.done}}</span>' +
          '<!-- /ng-repeat -->',


          // garbage in the end tag
          '<!-- directive: ng-repeat item in items -->' +
            '<span>{{item.text}}></span>' +
            '<span>{{item.done}}</span>' +
          '<!-- /ng-repeat foo bar baz -->'

        ], function(template) {
          expect(function() {
            $compile(template);
          }).toThrow("Can't find closing tag for ngRepeat: item in items");
        });
      });


      it('should NOT support repeaters for table rows in tables without tbody', function() {
        // we can try to work around this in the future, but there are many corner-cases
        // for now we require developers to use explicitly use tbody in cases when skipping it
        // would cause failure to detect the repeater boundaries

        expect(function() {
          $compile(
              '<div>' +
                '<table>' +
                  '<!-- directive: ng-repeat item in items -->' +
                  '<tr><td>{{item}}</td></tr>' +
                  '<tr><td>{{$index}}</td></tr>' +
                  '<!-- /ng-repeat -->' +
                '</table>' +
              '</div>'
          );
        }).toThrow("Can't find closing tag for ngRepeat: item in items");
      });


      it('should ignore any extra whitespace', function() {
        scope.items = [
          {text: 'sleep', done: true},
          {text: 'eat',   done: true},
          {text: 'run',   done: false}
        ];

        element = $compile(
            '<div>' +
                '<!-- directive:   ng-repeat    item in items -->' +
                  '<span>{{item.text}}</span>' +
                  '<span>{{item.done}}</span>' +
                '<!--        /ng-repeat          -->' +
              '</div>')(scope);


        scope.$digest();

        expect(sortedHtml(element.html())).toBe(
            '<!-- ngRepeat: item in items -->' +
              '<span>sleep</span>' +
              '<span>true</span>' +
              '<span>eat</span>' +
              '<span>true</span>' +
              '<span>run</span>' +
              '<span>false</span>'
        );
      });
    });
  });
});
