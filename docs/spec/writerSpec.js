var writer,
    rewire = require('rewire');

function mockResolvedPromise(resolvedValue) {
  return {
    then: function(success, failure) {
      success(resolvedValue);
    }
  };
}

describe('writer', function() {

  beforeEach(function() {
     writer = rewire('../src/writer.js');
  });

  describe('toString', function() {
    var toString;

    beforeEach(function() {
      toString = writer.toString;
    });

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

  describe('copy', function() {
    it('should call the transformation function', function() {
      var readMock = jasmine.createSpy('readMock').andReturn(mockResolvedPromise('DUMMY CONTENT'));
      writer.__set__("qfs.read", readMock);
      var transformationFn = jasmine.createSpy('transformationFn');
      writer.copy('from', 'to', transformationFn, 'arg1', 'arg2');
      expect(readMock).toHaveBeenCalled();
      expect(transformationFn).toHaveBeenCalledWith('DUMMY CONTENT', 'arg1', 'arg2');
    });
  });
});
