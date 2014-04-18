'use strict';

describe('$interpolate', function() {

  it('should return the interpolation object when there are no bindings and textOnly is undefined',
      inject(function($interpolate) {
    var interpolateFn = $interpolate('some text');

    expect(interpolateFn.exp).toBe('some text');
    expect(interpolateFn.separators).toEqual(['some text']);
    expect(interpolateFn.expressions).toEqual([]);

    expect(interpolateFn({})).toBe('some text');
  }));


  it('should return undefined when there are no bindings and textOnly is set to true',
      inject(function($interpolate) {
    expect($interpolate('some text', true)).toBeUndefined();
  }));

  it('should suppress falsy objects', inject(function($interpolate) {
    expect($interpolate('{{undefined}}')({})).toEqual('');
    expect($interpolate('{{null}}')({})).toEqual('');
    expect($interpolate('{{a.b}}')({})).toEqual('');
  }));

  it('should jsonify objects', inject(function($interpolate) {
    expect($interpolate('{{ {} }}')({})).toEqual('{}');
    expect($interpolate('{{ true }}')({})).toEqual('true');
    expect($interpolate('{{ false }}')({})).toEqual('false');
  }));


  it('should return interpolation function', inject(function($interpolate, $rootScope) {
    var interpolateFn = $interpolate('Hello {{name}}!');

    expect(interpolateFn.exp).toBe('Hello {{name}}!');
    expect(interpolateFn.separators).toEqual(['Hello ', '!']);
    expect(interpolateFn.expressions).toEqual(['name']);

    var scope = $rootScope.$new();
    scope.name = 'Bubu';

    expect(interpolateFn(scope)).toBe('Hello Bubu!');
  }));


  it('should ignore undefined model', inject(function($interpolate) {
    expect($interpolate("Hello {{'World'}}{{foo}}")({})).toBe('Hello World');
  }));


  describe('interpolating in a trusted context', function() {
    var sce;
    beforeEach(function() {
      function log() {}
      var fakeLog = {log: log, warn: log, info: log, error: log};
      module(function($provide, $sceProvider) {
        $provide.value('$log', fakeLog);
        $sceProvider.enabled(true);
      });
      inject(['$sce', function($sce) { sce = $sce; }]);
    });

    it('should NOT interpolate non-trusted expressions', inject(function($interpolate, $rootScope) {
      var scope = $rootScope.$new();
      scope.foo = "foo";

      expect(function() {
        $interpolate('{{foo}}', true, sce.CSS)(scope);
      }).toThrowMinErr('$interpolate', 'interr');
    }));

    it('should NOT interpolate mistyped expressions', inject(function($interpolate, $rootScope) {
      var scope = $rootScope.$new();
      scope.foo = sce.trustAsCss("foo");

      expect(function() {
        $interpolate('{{foo}}', true, sce.HTML)(scope);
      }).toThrowMinErr('$interpolate', 'interr');
    }));

    it('should interpolate trusted expressions in a regular context', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      expect($interpolate('{{foo}}', true)({foo: foo})).toBe('foo');
    }));

    it('should interpolate trusted expressions in a specific trustedContext', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      expect($interpolate('{{foo}}', true, sce.CSS)({foo: foo})).toBe('foo');
    }));

    // The concatenation of trusted values does not necessarily result in a trusted value.  (For
    // instance, you can construct evil JS code by putting together pieces of JS strings that are by
    // themselves safe to execute in isolation.)
    it('should NOT interpolate trusted expressions with multiple parts', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      var bar = sce.trustAsCss("bar");
      expect(function() {
        return $interpolate('{{foo}}{{bar}}', true, sce.CSS)({foo: foo, bar: bar});
      }).toThrowMinErr(
                "$interpolate", "noconcat", "Error while interpolating: {{foo}}{{bar}}\n" +
                "Strict Contextual Escaping disallows interpolations that concatenate multiple " +
                "expressions when a trusted value is required.  See " +
                "http://docs.angularjs.org/api/ng.$sce");
    }));
  });


  describe('provider', function() {
    beforeEach(module(function($interpolateProvider) {
      $interpolateProvider.startSymbol('--');
      $interpolateProvider.endSymbol('--');
    }));

    it('should not get confused with same markers', inject(function($interpolate) {
      expect($interpolate('---').separators).toEqual(['---']);
      expect($interpolate('---').expressions).toEqual([]);
      expect($interpolate('----')({})).toEqual('');
      expect($interpolate('--1--')({})).toEqual('1');
    }));
  });

  describe('parseBindings', function() {
    it('should Parse Text With No Bindings', inject(function($interpolate) {
      expect($interpolate("a").separators).toEqual(['a']);
      expect($interpolate("a").expressions).toEqual([]);
    }));

    it('should Parse Empty Text', inject(function($interpolate) {
      expect($interpolate("").separators).toEqual(['']);
      expect($interpolate("").expressions).toEqual([]);
    }));

    it('should Parse Inner Binding', inject(function($interpolate) {
      var interpolateFn = $interpolate("a{{b}}C"),
          separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['a', 'C']);
      expect(expressions).toEqual(['b']);
      expect(interpolateFn({b: 123})).toEqual('a123C');
    }));

    it('should Parse Ending Binding', inject(function($interpolate) {
      var interpolateFn = $interpolate("a{{b}}"),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['a', '']);
      expect(expressions).toEqual(['b']);
      expect(interpolateFn({b: 123})).toEqual('a123');
    }));

    it('should Parse Begging Binding', inject(function($interpolate) {
      var interpolateFn = $interpolate("{{b}}c"),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['', 'c']);
      expect(expressions).toEqual(['b']);
      expect(interpolateFn({b: 123})).toEqual('123c');
    }));

    it('should Parse Loan Binding', inject(function($interpolate) {
      var interpolateFn = $interpolate("{{b}}"),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['', '']);
      expect(expressions).toEqual(['b']);
      expect(interpolateFn({b: 123})).toEqual('123');
    }));

    it('should Parse Two Bindings', inject(function($interpolate) {
      var interpolateFn = $interpolate("{{b}}{{c}}"),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['', '', '']);
      expect(expressions).toEqual(['b', 'c']);
      expect(interpolateFn({b: 111, c: 222})).toEqual('111222');
    }));

    it('should Parse Two Bindings With Text In Middle', inject(function($interpolate) {
      var interpolateFn = $interpolate("{{b}}x{{c}}"),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['', 'x', '']);
      expect(expressions).toEqual(['b', 'c']);
      expect(interpolateFn({b: 111, c: 222})).toEqual('111x222');
    }));

    it('should Parse Multiline', inject(function($interpolate) {
      var interpolateFn = $interpolate('"X\nY{{A\n+B}}C\nD"'),
        separators = interpolateFn.separators, expressions = interpolateFn.expressions;
      expect(separators).toEqual(['"X\nY', 'C\nD"']);
      expect(expressions).toEqual(['A\n+B']);
      expect(interpolateFn({'A': 'aa', 'B': 'bb'})).toEqual('"X\nYaabbC\nD"');
    }));
  });


  describe('isTrustedContext', function() {
    it('should NOT interpolate a multi-part expression when isTrustedContext is true', inject(function($interpolate) {
      var isTrustedContext = true;
      expect(function() {
          $interpolate('constant/{{var}}', true, isTrustedContext);
        }).toThrowMinErr(
            "$interpolate", "noconcat", "Error while interpolating: constant/{{var}}\nStrict " +
            "Contextual Escaping disallows interpolations that concatenate multiple expressions " +
            "when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce");
      expect(function() {
        $interpolate('{{var}}/constant', true, isTrustedContext);
      }).toThrowMinErr(
          "$interpolate", "noconcat", "Error while interpolating: {{var}}/constant\nStrict " +
            "Contextual Escaping disallows interpolations that concatenate multiple expressions " +
            "when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce");
      expect(function() {
          $interpolate('{{foo}}{{bar}}', true, isTrustedContext);
        }).toThrowMinErr(
            "$interpolate", "noconcat", "Error while interpolating: {{foo}}{{bar}}\nStrict " +
            "Contextual Escaping disallows interpolations that concatenate multiple expressions " +
            "when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce");
    }));

    it('should interpolate a multi-part expression when isTrustedContext is false', inject(function($interpolate) {
      expect($interpolate('some/{{id}}')({})).toEqual('some/');
      expect($interpolate('some/{{id}}')({id: 1})).toEqual('some/1');
      expect($interpolate('{{foo}}{{bar}}')({foo: 1, bar: 2})).toEqual('12');
    }));
  });


  describe('startSymbol', function() {

    beforeEach(module(function($interpolateProvider) {
      expect($interpolateProvider.startSymbol()).toBe('{{');
      $interpolateProvider.startSymbol('((');
    }));


    it('should expose the startSymbol in config phase', module(function($interpolateProvider) {
      expect($interpolateProvider.startSymbol()).toBe('((');
    }));


    it('should expose the startSymbol in run phase', inject(function($interpolate) {
      expect($interpolate.startSymbol()).toBe('((');
    }));


    it('should not get confused by matching start and end symbols', function() {
      module(function($interpolateProvider) {
        $interpolateProvider.startSymbol('--');
        $interpolateProvider.endSymbol('--');
      });

      inject(function($interpolate) {
        expect($interpolate('---').separators).toEqual(['---']);
        expect($interpolate('---').expressions).toEqual([]);
        expect($interpolate('----')({})).toEqual('');
        expect($interpolate('--1--')({})).toEqual('1');
      });
    });
  });


  describe('endSymbol', function() {

    beforeEach(module(function($interpolateProvider) {
      expect($interpolateProvider.endSymbol()).toBe('}}');
      $interpolateProvider.endSymbol('))');
    }));


    it('should expose the endSymbol in config phase', module(function($interpolateProvider) {
      expect($interpolateProvider.endSymbol()).toBe('))');
    }));


    it('should expose the endSymbol in run phase', inject(function($interpolate) {
      expect($interpolate.endSymbol()).toBe('))');
    }));
  });

});
