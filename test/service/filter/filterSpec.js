'use strict';

describe('Filter: filter', function() {
  var filter;
  
  beforeEach(inject(function($filter){
    filter = $filter('filter');
  }));
  
  it('should filter by string', function() {
    var items = ["MIsKO", {name:"shyam"}, ["adam"], 1234];
    assertEquals(4, filter(items, "").length);
    assertEquals(4, filter(items, undefined).length);

    assertEquals(1, filter(items, 'iSk').length);
    assertEquals("MIsKO", filter(items, 'isk')[0]);

    assertEquals(1, filter(items, 'yam').length);
    assertEquals(items[1], filter(items, 'yam')[0]);

    assertEquals(1, filter(items, 'da').length);
    assertEquals(items[2], filter(items, 'da')[0]);

    assertEquals(1, filter(items, '34').length);
    assertEquals(1234, filter(items, '34')[0]);

    assertEquals(0, filter(items, "I don't exist").length);
  });

  it('should not read $ properties', function() {
    assertEquals("", "".charAt(0)); // assumption
    var items = [{$name:"misko"}];
    assertEquals(0, filter(items, "misko").length);
  });

  it('should filter on specific property', function() {
    var items = [{ignore:"a", name:"a"}, {ignore:"a", name:"abc"}];
    assertEquals(2, filter(items, {}).length);

    assertEquals(2, filter(items, {name:'a'}).length);

    assertEquals(1, filter(items, {name:'b'}).length);
    assertEquals("abc", filter(items, {name:'b'})[0].name);
  });

  it('should take function as predicate', function() {
    var items = [{name:"a"}, {name:"abc", done:true}];
    assertEquals(1, filter(items, function(i) {return i.done;}).length);
  });

  it('should take object as perdicate', function() {
    var items = [{first:"misko", last:"hevery"},
                 {first:"adam", last:"abrons"}];

    assertEquals(2, filter(items, {first:'', last:''}).length);
    assertEquals(1, filter(items, {first:'', last:'hevery'}).length);
    assertEquals(0, filter(items, {first:'adam', last:'hevery'}).length);
    assertEquals(1, filter(items, {first:'misko', last:'hevery'}).length);
    assertEquals(items[0], filter(items, {first:'misko', last:'hevery'})[0]);
  });

  it('should support negation operator', function() {
    var items = ["misko", "adam"];

    assertEquals(1, filter(items, '!isk').length);
    assertEquals(items[1], filter(items, '!isk')[0]);
  });
});
