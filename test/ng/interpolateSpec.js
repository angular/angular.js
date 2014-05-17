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
    expect($interpolate('{{undefined+undefined}}')()).toEqual('');
    expect($interpolate('{{null}}')()).toEqual('');
    expect($interpolate('{{a.b}}')()).toEqual('');
  }));

  it('should jsonify objects', inject(function($interpolate) {
    expect($interpolate('{{ {} }}')()).toEqual('{}');
    expect($interpolate('{{ true }}')()).toEqual('true');
    expect($interpolate('{{ false }}')()).toEqual('false');
  }));

  it('should rethrow exceptions', inject(function($interpolate, $rootScope) {
    $rootScope.err = function () {
      throw new Error('oops');
    };
    expect(function () {
      $interpolate('{{err()}}')($rootScope);
    }).toThrowMinErr("$interpolate", "interr", "Can't interpolate: {{err()}}\nError: oops");
  }));

  it('should stop interpolation when encountering an exception', inject(function($interpolate, $compile, $rootScope) {
    $rootScope.err = function () {
      throw new Error('oops');
    };
    var dom = jqLite('<div>{{1 + 1}}</div><div>{{err()}}</div><div>{{1 + 2}}</div>');
    $compile(dom)($rootScope);
    expect(function () {
      $rootScope.$apply();
    }).toThrowMinErr("$interpolate", "interr", "Can't interpolate: {{err()}}\nError: oops");
    expect(dom[0].innerHTML).toEqual('2');
    expect(dom[1].innerHTML).toEqual('{{err()}}');
    expect(dom[2].innerHTML).toEqual('{{1 + 2}}');
  }));


  it('should return interpolation function', inject(function($interpolate, $rootScope) {
    $rootScope.name = 'Misko';
    expect($interpolate('Hello {{name}}!')($rootScope)).toEqual('Hello Misko!');
  }));


  it('should ignore undefined model', inject(function($interpolate) {
    expect($interpolate("Hello {{'World' + foo}}")()).toEqual('Hello World');
  }));


  it('should ignore undefined return value', inject(function($interpolate, $rootScope) {
    $rootScope.foo = function() {return undefined};
    expect($interpolate("Hello {{'World' + foo()}}")($rootScope)).toEqual('Hello World');
  }));


  describe('interpolating in a trusted context', function() {
    var sce;
    beforeEach(function() {
      function log() {};
      var fakeLog = {log: log, warn: log, info: log, error: log};
      module(function($provide, $sceProvider) {
        $provide.value('$log', fakeLog);
        $sceProvider.enabled(true);
      });
      inject(['$sce', function($sce) { sce = $sce; }]);
    });

    it('should NOT interpolate non-trusted expressions', inject(function($interpolate) {
      var foo = "foo";
      expect($interpolate('{{foo}}', true, sce.CSS)({}, {foo: foo})).toEqual('');
    }));

    it('should NOT interpolate mistyped expressions', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      expect($interpolate('{{foo}}', true, sce.HTML)({}, {foo: foo})).toEqual('');
    }));

    it('should interpolate trusted expressions in a regular context', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      expect($interpolate('{{foo}}', true)({foo: foo})).toEqual('foo');
    }));

    it('should interpolate trusted expressions in a specific trustedContext', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      expect($interpolate('{{foo}}', true, sce.CSS)({foo: foo})).toEqual('foo');
    }));

    // The concatenation of trusted values does not necessarily result in a trusted value.  (For
    // instance, you can construct evil JS code by putting together pieces of JS strings that are by
    // themselves safe to execute in isolation.)
    it('should NOT interpolate trusted expressions with multiple parts', inject(function($interpolate) {
      var foo = sce.trustAsCss("foo");
      var bar = sce.trustAsCss("bar");
      expect(function() {
        return $interpolate('{{foo}}{{bar}}', true, sce.CSS)(
             {foo: foo, bar: bar}); }).toThrowMinErr(
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
          $interpolate('{{foo}}{{bar}}', true, isTrustedContext);
        }).toThrowMinErr(
            "$interpolate", "noconcat", "Error while interpolating: {{foo}}{{bar}}\nStrict " +
            "Contextual Escaping disallows interpolations that concatenate multiple expressions " +
            "when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce");
    }));

    it('should interpolate a multi-part expression when isTrustedContext is false', inject(function($interpolate) {
      expect($interpolate('some/{{id}}')()).toEqual('some/');
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
        expect($interpolate('---').parts).toEqual(['---']);
        expect($interpolate('----')()).toEqual('');
        expect($interpolate('--1--')()).toEqual('1');
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


  describe('bind-once', function() {
    var callbacks = [];
    beforeEach(function() {
      callbacks.length = 0;
    });
    beforeEach(module(function($provide) {
      $provide.decorator('$parse', function($delegate) {
        var $parse = $delegate;
        return function(expr) {
          if (isString(expr)) {
            var result = $parse(expr);
            var spy = jasmine.createSpy('$parse'+callbacks.length);
            var key;
            for (key in result) {
              if (result.hasOwnProperty(key)) {
                spy[key] = result[key];
              }
            }
            spy.andCallFake(function(a1, a2, a3, a4) {
              var ret = result(a1, a2, a3, a4);
              for (key in result) {
                if (result.hasOwnProperty(key)) {
                  spy[key] = result[key];
                }
              } 
              return ret;
            });
            callbacks.push(spy);
            return spy;
          } else {
            return $parse(expr);
          }
        };
      });
    }));

    it('should evaluate listener once', inject(function($interpolate, $rootScope) {
      var spy = jasmine.createSpy('listener');
      $rootScope.$watch($interpolate("{{:foo}}"), spy);

      $rootScope.foo = 'test!';
      $rootScope.$digest();
      expect($rootScope.foo).toBe("test!");

      $rootScope.foo = 'TESTIER!';
      $rootScope.$digest();

      // The listener should only be evaluated once, because values should only be joined once
      expect(spy.mostRecentCall.args[0]).toBe("test!");
      expect(spy).toHaveBeenCalledOnce();
    }));


    it('should evaluate non-finalized parseFns', inject(function($interpolate, $rootScope) {
      $rootScope.foo = "test!";
      $rootScope.bar = "";
      var listener = jasmine.createSpy('listener');
      $rootScope.$watch($interpolate("{{:foo}}{{bar}}"), listener);

      $rootScope.$digest();
      expect(callbacks[0].callCount).toBe(2);
      expect(callbacks[0].finalized).toBe(true);

      $rootScope.bar = "TESTIER!";
      $rootScope.$digest();

      // finalized getter should not be called again
      expect(callbacks[0].callCount).toBe(2);
      expect(callbacks[1].callCount).toBe(4);
    }));


    it('should re-evaluate finalized parseFns when group re-enabled', inject(function($interpolate, $rootScope) {
      $rootScope.foo = "test!";
      $rootScope.bar = "";
      var listener = jasmine.createSpy('listener');
      $rootScope.$watch($interpolate("{{:u:foo}}{{bar}}"), listener);

      $rootScope.$digest();
      expect(callbacks[0].callCount).toBe(2);
      expect(callbacks[0].finalized).toBe(true);
      expect(listener.mostRecentCall.args[0]).toBe("test!");

      $rootScope.$enableWatchgroup('u');

      $rootScope.foo = "TESTIEST!";
      $rootScope.bar = "TESTIER!";
      $rootScope.$digest();

      expect(callbacks[0].callCount).toBe(4);
      expect(callbacks[1].callCount).toBe(4);
      expect(listener.mostRecentCall.args[0]).toBe("TESTIEST!TESTIER!");
      expect(listener.callCount).toBe(2);
    }));


    describe('lazy', function() {
      it('should evaluate until value is truthy', inject(function($interpolate, $rootScope) {
        var listener = jasmine.createSpy('listener');
        $rootScope.$watch($interpolate("{{::foo}}"), listener);
        $rootScope.$digest();
        expect(listener.mostRecentCall.args[0]).toBe("");
        expect(callbacks[0].finalized).toBe(false);

        $rootScope.foo = "OK";
        $rootScope.$digest();
        expect(listener.mostRecentCall.args[0]).toBe("OK");
        expect(callbacks[0].callCount).toBe(4);
        expect(callbacks[0].finalized).toBe(true);

        $rootScope.$digest();
        expect(listener.mostRecentCall.args[0]).toBe("OK");
        expect(callbacks[0].callCount).toBe(4);
      }));


      it('should keep `finalized` false until all expressions are evaluated', inject(function($interpolate, $rootScope) {
        var listener = jasmine.createSpy('listener');
        $rootScope.$watch($interpolate("{{::foo}}{{::bar}}"), listener);

        $rootScope.foo = "OK";
        $rootScope.$digest();
        expect(listener.callCount).toBe(1);
        expect(listener.mostRecentCall.args[0]).toBe("OK");
        expect(callbacks[0].callCount).toBe(2);

        $rootScope.foo = "NOT";
        $rootScope.$digest();
        expect(listener.callCount).toBe(1);
        expect(listener.mostRecentCall.args[0]).toBe("OK");
        expect(callbacks[0].callCount).toBe(2);

        $rootScope.bar = "!";
        $rootScope.$digest();
        expect(listener.callCount).toBe(2);
        expect(listener.mostRecentCall.args[0]).toBe("OK!");
        expect(callbacks[1].callCount).toBe(5);
      }));
    });
  });
});
