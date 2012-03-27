'use strict';

describe('json', function() {

  describe('fromJson', function() {

    it('should delegate to JSON.parse', function() {
      var spy = spyOn(JSON, 'parse').andCallThrough();

      expect(fromJson('{}')).toEqual({});
      expect(spy).toHaveBeenCalled();
    });
  });


  describe('toJson', function() {

    it('should delegate to JSON.stringify', function() {
      var spy = spyOn(JSON, 'stringify').andCallThrough();

      expect(toJson({})).toEqual('{}');
      expect(spy).toHaveBeenCalled();
    });


    it('should format objects pretty', function() {
      expect(toJson({a: 1, b: 2}, true)).
          toBeOneOf('{\n  "a": 1,\n  "b": 2\n}', '{\n  "a":1,\n  "b":2\n}');
      expect(toJson({a: {b: 2}}, true)).
          toBeOneOf('{\n  "a": {\n    "b": 2\n  }\n}', '{\n  "a":{\n    "b":2\n  }\n}');
    });


    it('should not serialize properties starting with $', function() {
      expect(toJson({$few: 'v', $$some:'value'}, false)).toEqual('{}');
    });


    it('should not serialize undefined values', function() {
      expect(angular.toJson({A:undefined})).toEqual('{}');
    });


    it('should not serialize $window object', function() {
      expect(toJson(window)).toEqual('"$WINDOW"');
    });


    it('should not serialize $document object', function() {
      expect(toJson(document)).toEqual('"$DOCUMENT"');
    });


    it('should not serialize scope instances', inject(function($rootScope) {
      expect(toJson({key: $rootScope})).toEqual('{"key":"$SCOPE"}');
    }));
  });
});
