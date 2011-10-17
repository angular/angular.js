var writer = require('../src/writer.js');
describe('writer', function() {
  describe('toString', function() {
    var toString = writer.toString;

    it('should merge string', function() {
      expect(toString('abc')).toEqual('abc');
    });

    it('should merge obj', function() {
      expect(toString({a:1})).toEqual('{"a":1}');
    });

    it('should merge array', function() {
      expect(toString(['abc',{}])).toEqual('abc{}');
    });
  });

  describe('replace method', function() {
    var content,
        replacements;

    beforeEach(function() {
      content = 'angular super jQuery manifest';
    });

    it('should replace placeholders', function() {
      replacements = {'angular': 'ng', 'jQuery': 'jqlite','notHere': 'here'};

      content = writer.replace(content, replacements);
      expect(content).toBe('ng super jqlite manifest');
    });
  });
});
