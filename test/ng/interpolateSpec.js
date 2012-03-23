'use strict';

describe('$interpolate', function() {

  it('should return a function when there are no bindings and textOnly is undefined',
      inject(function($interpolate) {
    expect(typeof $interpolate('some text')).toBe('function');
  }));


  it('should return undefined when there are no bindings and textOnly is set to true',
      inject(function($interpolate) {
    expect($interpolate('some text', true)).toBeUndefined();
  }));

  it('should suppress falsy objects', inject(function($interpolate) {
    expect($interpolate('{{undefined}}')()).toEqual('');
    expect($interpolate('{{null}}')()).toEqual('');
    expect($interpolate('{{a.b}}')()).toEqual('');
  }));

  it('should jsonify objects', inject(function($interpolate) {
    expect($interpolate('{{ {} }}')()).toEqual('{}');
    expect($interpolate('{{ true }}')()).toEqual('true');
    expect($interpolate('{{ false }}')()).toEqual('false');
  }));


  it('should return interpolation function', inject(function($interpolate, $rootScope) {
    $rootScope.name = 'Misko';
    expect($interpolate('Hello {{name}}!')($rootScope)).toEqual('Hello Misko!');
  }));

  describe('provider', function() {
    beforeEach(module(function($interpolateProvider) {
      $interpolateProvider.startSymbol('--');
      $interpolateProvider.endSymbol('--');
    }));

    it('should not get confused with same markers', inject(function($interpolate) {
      expect($interpolate('---').parts).toEqual(['---']);
      expect($interpolate('----')()).toEqual('');
      expect($interpolate('--1--')()).toEqual('1');
    }));
  });

  describe('parseBindings', function() {
    it('should Parse Text With No Bindings', inject(function($interpolate) {
      var parts = $interpolate("a").parts;
      expect(parts.length).toEqual(1);
      expect(parts[0]).toEqual("a");
    }));

    it('should Parse Empty Text', inject(function($interpolate) {
      var parts = $interpolate("").parts;
      expect(parts.length).toEqual(1);
      expect(parts[0]).toEqual("");
    }));

    it('should Parse Inner Binding', inject(function($interpolate) {
      var parts = $interpolate("a{{b}}C").parts;
      expect(parts.length).toEqual(3);
      expect(parts[0]).toEqual("a");
      expect(parts[1].exp).toEqual("b");
      expect(parts[1]({b:123})).toEqual(123);
      expect(parts[2]).toEqual("C");
    }));

    it('should Parse Ending Binding', inject(function($interpolate) {
      var parts = $interpolate("a{{b}}").parts;
      expect(parts.length).toEqual(2);
      expect(parts[0]).toEqual("a");
      expect(parts[1].exp).toEqual("b");
      expect(parts[1]({b:123})).toEqual(123);
    }));

    it('should Parse Begging Binding', inject(function($interpolate) {
      var parts = $interpolate("{{b}}c").parts;
      expect(parts.length).toEqual(2);
      expect(parts[0].exp).toEqual("b");
      expect(parts[1]).toEqual("c");
    }));

    it('should Parse Loan Binding', inject(function($interpolate) {
      var parts = $interpolate("{{b}}").parts;
      expect(parts.length).toEqual(1);
      expect(parts[0].exp).toEqual("b");
    }));

    it('should Parse Two Bindings', inject(function($interpolate) {
      var parts = $interpolate("{{b}}{{c}}").parts;
      expect(parts.length).toEqual(2);
      expect(parts[0].exp).toEqual("b");
      expect(parts[1].exp).toEqual("c");
    }));

    it('should Parse Two Bindings With Text In Middle', inject(function($interpolate) {
      var parts = $interpolate("{{b}}x{{c}}").parts;
      expect(parts.length).toEqual(3);
      expect(parts[0].exp).toEqual("b");
      expect(parts[1]).toEqual("x");
      expect(parts[2].exp).toEqual("c");
    }));

    it('should Parse Multiline', inject(function($interpolate) {
      var parts = $interpolate('"X\nY{{A\n+B}}C\nD"').parts;
      expect(parts.length).toEqual(3);
      expect(parts[0]).toEqual('"X\nY');
      expect(parts[1].exp).toEqual('A\n+B');
      expect(parts[2]).toEqual('C\nD"');
    }));
  });
});
