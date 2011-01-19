describe("formatter", function(){
  it('should noop', function(){
    assertEquals("abc", angular.formatter.noop.format("abc"));
    assertEquals("xyz", angular.formatter.noop.parse("xyz"));
    assertEquals(null, angular.formatter.noop.parse(null));
  });

  it('should List', function() {
    assertEquals('a, b', angular.formatter.list.format(['a', 'b']));
    assertEquals('', angular.formatter.list.format([]));
    assertEquals(['abc', 'c'], angular.formatter.list.parse("  , abc , c ,,"));
    assertEquals([], angular.formatter.list.parse(""));
    assertEquals([], angular.formatter.list.parse(null));
  });

  it('should Boolean', function() {
    assertEquals('true', angular.formatter['boolean'].format(true));
    assertEquals('false', angular.formatter['boolean'].format(false));
    assertEquals(true, angular.formatter['boolean'].parse("true"));
    assertEquals(false, angular.formatter['boolean'].parse(""));
    assertEquals(false, angular.formatter['boolean'].parse("false"));
    assertEquals(false, angular.formatter['boolean'].parse(null));
  });

  it('should Number', function() {
    assertEquals('1', angular.formatter.number.format(1));
    assertEquals(1, angular.formatter.number.format('1'));
  });

  it('should Trim', function() {
    assertEquals('', angular.formatter.trim.format(null));
    assertEquals('', angular.formatter.trim.format(""));
    assertEquals('a', angular.formatter.trim.format(" a "));
    assertEquals('a', angular.formatter.trim.parse(' a '));
  });

  describe('json', function(){
    it('should treat empty string as null', function(){
      expect(angular.formatter.json.parse('')).toEqual(null);
    });
  });

  describe('index', function(){
    it('should parse an object from array', function(){
      expect(angular.formatter.index.parse('1', ['A', 'B', 'C'])).toEqual('B');
    });
    it('should format an index from array', function(){
      expect(angular.formatter.index.format('B', ['A', 'B', 'C'])).toEqual('1');
    });
  });

});
