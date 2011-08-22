var writer = require('writer.js');
describe('writer', function(){
  describe('toString', function(){
    var toString = writer.toString;

    it('should merge string', function(){
      expect(toString('abc')).toEqual('abc');
    });

    it('should merge obj', function(){
      expect(toString({a:1})).toEqual('{"a":1}');
    });

    it('should merge array', function(){
      expect(toString(['abc',{}])).toEqual('abc{}');
    });
  });

  describe('replace method', function() {
    var content,
        replacementKeys,
        replacements;

    beforeEach(function() {
      spyOn(console, 'log');
      content = 'angular super jQuery manifest';
      replacementKeys = ['angular', 'jQuery', 'notHere'];
    });

    it('should replace placeholders', function() {
      replacements = ['ng', 'jqlite', 'here'];

      content = writer.replace(content, replacementKeys, replacements);
      expect(content).toBe('ng super jqlite manifest');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should show warning when replacementKeys, replacements has different lengths', function () {
      replacements = ['ng', 'jqlite'];

      content = writer.replace(content, replacementKeys, replacements);
      expect(content).toBe('ng super jqlite manifest');
      expect(console.log).toHaveBeenCalled();
    });
  });
});
