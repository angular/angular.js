'use strict';

describe('Filter: filter', function() {
  var filter;

  beforeEach(inject(function($filter){
    filter = $filter('filter');
  }));

  describe('on an array collection', function() {

    it('should filter by string', function() {
      var items = ['MIsKO', {name: 'shyam'}, ['adam'], 1234];
      expect(filter(items, '').length).toBe(4);
      expect(filter(items, undefined).length).toBe(4);

      expect(filter(items, 'iSk').length).toBe(1);
      expect(filter(items, 'isk')[0]).toBe('MIsKO');

      expect(filter(items, 'yam').length).toBe(1);
      expect(filter(items, 'yam')[0]).toEqual(items[1]);

      expect(filter(items, 'da').length).toBe(1);
      expect(filter(items, 'da')[0]).toEqual(items[2]);

      expect(filter(items, '34').length).toBe(1);
      expect(filter(items, '34')[0]).toBe(1234);

      expect(filter(items, "I don't exist").length).toBe(0);
    });

    it('should not read $ properties', function() {
      expect(''.charAt(0)).toBe(''); // assumption

      var items = [{$name: 'misko'}];
      expect(filter(items, 'misko').length).toBe(0);
    });

    it('should filter on specific property', function() {
      var items = [{ignore: 'a', name: 'a'}, {ignore: 'a', name: 'abc'}];
      expect(filter(items, {}).length).toBe(2);

      expect(filter(items, {name: 'a'}).length).toBe(2);

      expect(filter(items, {name: 'b'}).length).toBe(1);
      expect(filter(items, {name: 'b'})[0].name).toBe('abc');
    });

    it('should take function as predicate', function() {
      var items = [{name: 'a'}, {name: 'abc', done: true}];
      expect(filter(items, function(i) {return i.done;}).length).toBe(1);
    });

    it('should take object as predicate', function() {
      var items = [{first: 'misko', last: 'hevery'},
                   {first: 'adam', last: 'abrons'}];

      expect(filter(items, {first:'', last:''}).length).toBe(2);
      expect(filter(items, {first:'', last:'hevery'}).length).toBe(1);
      expect(filter(items, {first:'adam', last:'hevery'}).length).toBe(0);
      expect(filter(items, {first:'misko', last:'hevery'}).length).toBe(1);
      expect(filter(items, {first:'misko', last:'hevery'})[0]).toEqual(items[0]);
    });


    it('should support predicate object with dots in the name', function() {
      var items = [{'first.name': 'misko', 'last.name': 'hevery'},
                   {'first.name': 'adam', 'last.name': 'abrons'}];

      expect(filter(items, {'first.name':'', 'last.name':''}).length).toBe(2);
      expect(filter(items, {'first.name':'misko', 'last.name':''})).toEqual([items[0]]);
    });


    it('should support deep predicate objects', function() {
      var items = [{person: {name: 'John'}},
                   {person: {name: 'Rita'}},
                   {person: {name: 'Billy'}},
                   {person: {name: 'Joan'}}];
      expect(filter(items, {person: {name: 'Jo'}}).length).toBe(2);
      expect(filter(items, {person: {name: 'Jo'}})).toEqual([
        {person: {name: 'John'}}, {person: {name: 'Joan'}}]);
    });


    it('should match any properties for given "$" property', function() {
      var items = [{first: 'tom', last: 'hevery'},
                   {first: 'adam', last: 'hevery', alias: 'tom', done: false},
                   {first: 'john', last: 'clark', middle: 'tommy'}];
      expect(filter(items, {$: 'tom'}).length).toBe(3);
      expect(filter(items, {$: 'a'}).length).toBe(2);
      expect(filter(items, {$: false}).length).toBe(1);
      expect(filter(items, {$: 10}).length).toBe(0);
      expect(filter(items, {$: 'hevery'})[0]).toEqual(items[0]);
    });

    it('should support boolean properties', function() {
      var items = [{name: 'tom', current: true},
                 {name: 'demi', current: false},
                 {name: 'sofia'}];

      expect(filter(items, {current:true}).length).toBe(1);
      expect(filter(items, {current:true})[0].name).toBe('tom');
      expect(filter(items, {current:false}).length).toBe(1);
      expect(filter(items, {current:false})[0].name).toBe('demi');
    });

    it('should support negation operator', function() {
      var items = ['misko', 'adam'];

      expect(filter(items, '!isk').length).toBe(1);
      expect(filter(items, '!isk')[0]).toEqual(items[1]);
    });

    describe('should support comparator', function() {

      it('as equality when true', function() {
        var items = ['misko', 'adam', 'adamson'];
        var expr = 'adam';
        expect(filter(items, expr, true)).toEqual([items[1]]);
        expect(filter(items, expr, false)).toEqual([items[1], items[2]]);

        var items = [
          {key: 'value1', nonkey: 1},
          {key: 'value2', nonkey: 2},
          {key: 'value12', nonkey: 3},
          {key: 'value1', nonkey:4},
          {key: 'Value1', nonkey:5}
        ];
        var expr = {key: 'value1'};
        expect(filter(items, expr, true)).toEqual([items[0], items[3]]);

        var items = [
          {key: 1, nonkey: 1},
          {key: 2, nonkey: 2},
          {key: 12, nonkey: 3},
          {key: 1, nonkey:4}
        ];
        var expr = { key: 1 };
        expect(filter(items, expr, true)).toEqual([items[0], items[3]]);

        var expr = 12;
        expect(filter(items, expr, true)).toEqual([items[2]]);
      });

      it('and use the function given to compare values', function() {
        var items = [
          {key: 1, nonkey: 1},
          {key: 2, nonkey: 2},
          {key: 12, nonkey: 3},
          {key: 1, nonkey:14}
        ];
        var expr = {key: 10};
        var comparator = function (obj,value) {
          return obj > value;
        };
        expect(filter(items, expr, comparator)).toEqual([items[2]]);

        expr = 10;
        expect(filter(items, expr, comparator)).toEqual([items[2], items[3]]);

      });

    });

  });

  describe('on an object literal collection', function() {

    /*
      You can't effectively test equality on object instances, so they will be compared below
      via stringification.
    */

    // Helper to verify "lengths" of returned object literals
    var getObjKeys = Object.keys || function(obj) {
      var keys = [];
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) keys.push(prop);
      }
      return keys;
    };

    // Helper to return the specified keys of an object as a new object (for test verification)
    var stringifiedProps = function(obj, array) {
      var props = {};
      forEach(array, function(key) { if (obj[key]) props[key] = obj[key]; });
      return JSON.stringify(props);
    };

    it('should filter by string', function() {
      var items = {'0':'MIsKO', '1':{name: 'shyam'}, '2':['adam'], '3':1234};
      expect(getObjKeys(filter(items, '')).length).toBe(4);

      expect(getObjKeys(filter(items, 'iSk')).length).toBe(1);
      expect(JSON.stringify(filter(items, 'isk'))).toBe(stringifiedProps(items,['0']));

      expect(getObjKeys(filter(items, 'yam')).length).toBe(1);
      expect(JSON.stringify(filter(items, 'yam'))).toEqual(stringifiedProps(items,['1']));

      expect(getObjKeys(filter(items, 'da')).length).toBe(1);
      expect(JSON.stringify(filter(items, 'da'))).toEqual(stringifiedProps(items,['2']));

      expect(getObjKeys(filter(items, '34')).length).toBe(1);
      expect(JSON.stringify(filter(items, '34'))).toBe(stringifiedProps(items,['3']));

      expect(getObjKeys(filter(items, "I don't exist")).length).toBe(0);
    });

    it('should not read $ properties', function() {
      expect(''.charAt(0)).toBe(''); // assumption

      var items = {'0':{$name: 'misko'}};
      expect(getObjKeys(filter(items, 'misko')).length).toBe(0);
    });

    it('should filter on specific property', function() {
      var items = {'0':{ignore: 'a', name: 'a'}, '1':{ignore: 'a', name: 'abc'}};
      expect(getObjKeys(filter(items, {})).length).toBe(2);

      expect(getObjKeys(filter(items, {name: 'a'})).length).toBe(2);

      expect(getObjKeys(filter(items, {name: 'b'})).length).toBe(1);
      expect(JSON.stringify(filter(items, {name: 'b'}))).toBe(stringifiedProps(items,['1']));
    });

    it('should take function as predicate', function() {
      var items = {'0':{name: 'a'}, '1':{name: 'abc', done: true}};
      expect(getObjKeys(filter(items, function(i) {return i.done;})).length).toBe(1);
    });

    it('should take object as predicate', function() {
      var items = {'0':{first: 'misko', last: 'hevery'},'1':{first: 'adam', last: 'abrons'}};

      expect(getObjKeys(filter(items, {first:'', last:''})).length).toBe(2);
      expect(getObjKeys(filter(items, {first:'', last:'hevery'})).length).toBe(1);
      expect(getObjKeys(filter(items, {first:'adam', last:'hevery'})).length).toBe(0);
      expect(getObjKeys(filter(items, {first:'misko', last:'hevery'})).length).toBe(1);
      expect(JSON.stringify(filter(items, {first:'misko', last:'hevery'})))
        .toEqual(stringifiedProps(items,['0']));
    });

    it('should support predicate object with dots in the name', function() {
      var items = {'0':{'first.name': 'misko', 'last.name': 'hevery'},
                   '1':{'first.name': 'adam', 'last.name': 'abrons'}};

      expect(getObjKeys(filter(items, {'first.name':'', 'last.name':''})).length).toBe(2);
      expect(JSON.stringify(filter(items, {'first.name':'misko', 'last.name':''})))
        .toEqual(stringifiedProps(items,['0']));
    });

    it('should support deep predicate objects', function() {
      var items = {'0':{person: {name: 'John'}},
                   '1':{person: {name: 'Rita'}},
                   '2':{person: {name: 'Billy'}},
                   '3':{person: {name: 'Joan'}}};
      expect(getObjKeys(filter(items, {person: {name: 'Jo'}})).length).toBe(2);
      expect(JSON.stringify(filter(items, {person: {name: 'Jo'}})))
        .toEqual(stringifiedProps(items,['0','3']));
    });

    it('should match any properties for given "$" property', function() {
      var items = {'0':{first: 'tom', last: 'hevery'},
                   '1':{first: 'adam', last: 'hevery', alias: 'tom', done: false},
                   '2':{first: 'john', last: 'clark', middle: 'tommy'}};
      expect(getObjKeys(filter(items, {$: 'tom'})).length).toBe(3);
      expect(getObjKeys(filter(items, {$: 'a'})).length).toBe(2);
      expect(getObjKeys(filter(items, {$: false})).length).toBe(1);
      expect(getObjKeys(filter(items, {$: 10})).length).toBe(0);
      expect(JSON.stringify(filter(items, {$: 'hevery'})))
        .toEqual(stringifiedProps(items,['0','1']));
    });

    it('should support boolean properties', function() {
      var items = {'0':{name: 'tom', current: true},
                 '1':{name: 'demi', current: false},
                 '2':{name: 'sofia'}};

      expect(getObjKeys(filter(items, {current:true})).length).toBe(1);
      expect(JSON.stringify(filter(items, {current:true}))).toBe(stringifiedProps(items,['0']));
      expect(getObjKeys(filter(items, {current:false})).length).toBe(1);
      expect(JSON.stringify(filter(items, {current:false}))).toBe(stringifiedProps(items,['1']));
    });

    it('should support negation operator', function() {
      var items = {'0':'misko', '1':'adam'};

      expect(getObjKeys(filter(items, '!isk')).length).toBe(1);
      expect(JSON.stringify(filter(items, '!isk'))).toEqual(stringifiedProps(items,['1']));
    });

    describe('should support comparator', function() {

      it('as equality when true', function() {
        var items = {'0':'misko', '1':'adam', '2':'adamson'};
        var expr = 'adam';
        expect(JSON.stringify(filter(items, expr, true))).toEqual(stringifiedProps(items,['1']));
        expect(JSON.stringify(filter(items, expr, false)))
          .toEqual(stringifiedProps(items,['1','2']));

        var items = {
          '0':{key: 'value1', nonkey: 1},
          '1':{key: 'value2', nonkey: 2},
          '2':{key: 'value12', nonkey: 3},
          '3':{key: 'value1', nonkey: 4},
          '4':{key: 'Value1', nonkey: 5}
        };
        var expr = {key: 'value1'};
        expect(JSON.stringify(filter(items, expr, true)))
          .toEqual(stringifiedProps(items,['0','3']));

        var items = {
          '0':{key: 1, nonkey: 1},
          '1':{key: 2, nonkey: 2},
          '2':{key: 12, nonkey: 3},
          '3':{key: 1, nonkey:4}
        };
        var expr = { key: 1 };
        expect(JSON.stringify(filter(items, expr, true)))
          .toEqual(stringifiedProps(items,['0','3']));

        var expr = 12;
        expect(JSON.stringify(filter(items, expr, true))).toEqual(stringifiedProps(items,['2']));
      });

      it('and use the function given to compare values', function() {
        var items = {
          '0':{key: 1, nonkey: 1},
          '1':{key: 2, nonkey: 2},
          '2':{key: 12, nonkey: 3},
          '3':{key: 1, nonkey:14}
        };
        var expr = {key: 10};
        var comparator = function (obj,value) {
          return obj > value;
        };
        expect(JSON.stringify(filter(items, expr, comparator)))
          .toEqual(stringifiedProps(items,['2']));

        expr = 10;
        expect(JSON.stringify(filter(items, expr, comparator)))
          .toEqual(stringifiedProps(items,['2','3']));

      });

    });

  });

});
