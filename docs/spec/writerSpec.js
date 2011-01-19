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
});
