'use strict';

describe('injector', function() {
  var providers;
  var cache;
  var injector;
  var scope;

  beforeEach(function() {
    providers = extensionMap({}, 'providers');
    cache = {};
    scope = {};
    injector = createInjector(scope, providers, cache);
  });

  it("should return same instance from calling provider", function() {
    providers('text', function() { return scope.name; });
    scope.name = 'abc';
    expect(injector('text')).toEqual('abc');
    expect(cache.text).toEqual('abc');
    scope.name = 'deleted';
    expect(injector('text')).toEqual('abc');
  });

  it("should call function", function() {
    providers('a', function() {return 1;});
    providers('b', function() {return 2;});
    var args;
    function fn(a, b, c, d) {
      args = [this, a, b, c, d];
    }
    fn.$inject = ['a', 'b'];
    injector.invoke({name:"this"}, fn, [3, 4]);
    expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
  });

  it('should inject providers', function() {
    providers('a', function() {return this.mi = 'Mi';});
    providers('b', function(mi){return this.name = mi+'sko';}, {$inject:['a']});
    expect(injector('b')).toEqual('Misko');
    expect(scope).toEqual({mi:'Mi', name:'Misko'});
  });


  it('should resolve dependency graph and instantiate all services just once', function() {
    var log = [];

//            s1
//        /   |\
//       /    s2\
//      /  /  | \\
//     /s3 < s4 > s5
//    //
//   s6


    providers('s1', function() { log.push('s1'); }, {$inject: ['s2', 's5', 's6']});
    providers('s2', function() { log.push('s2'); }, {$inject: ['s3', 's4', 's5']});
    providers('s3', function() { log.push('s3'); }, {$inject: ['s6']});
    providers('s4', function() { log.push('s4'); }, {$inject: ['s3', 's5']});
    providers('s5', function() { log.push('s5'); });
    providers('s6', function() { log.push('s6'); });

    injector('s1');

    expect(log).toEqual(['s6', 's5', 's3', 's4', 's2', 's1']);
  });


  it('should provide usefull message if no provider', function() {
    expect(function() {
      injector('idontexist');
    }).toThrow("Unknown provider for 'idontexist'.");
  });

  it('should autostart eager services', function() {
    var log = '';
    providers('eager', function() {log += 'eager;'; return 'foo';}, {$eager: true});
    injector.eager();
    expect(log).toEqual('eager;');
    expect(injector('eager')).toBe('foo');
  });

  describe('annotation', function() {
    it('should return $inject', function() {
      function fn() {}
      fn.$inject = ['a'];
      expect(inferInjectionArgs(fn)).toBe(fn.$inject);
      expect(inferInjectionArgs(function() {})).toEqual([]);
      expect(inferInjectionArgs(function () {})).toEqual([]);
      expect(inferInjectionArgs(function  () {})).toEqual([]);
      expect(inferInjectionArgs(function /* */ () {})).toEqual([]);
    });

    it('should create $inject', function() {
      // keep the multi-line to make sure we can handle it
      function $f_n0 /*
          */(
          $a, // x, <-- looks like an arg but it is a comment
          b_, /* z, <-- looks like an arg but it is a
                 multi-line comment
                 function (a, b){}
                 */
          _c,
          /* {some type} */ d){ extraParans();}
      expect(inferInjectionArgs($f_n0)).toEqual(['$a', 'b_', '_c',  'd']);
      expect($f_n0.$inject).toEqual(['$a', 'b_', '_c',  'd']);
    });

    it('should handle no arg functions', function() {
      function $f_n0() {}
      expect(inferInjectionArgs($f_n0)).toEqual([]);
      expect($f_n0.$inject).toEqual([]);
    });

    it('should handle args with both $ and _', function() {
      function $f_n0($a_){}
      expect(inferInjectionArgs($f_n0)).toEqual(['$a_']);
      expect($f_n0.$inject).toEqual(['$a_']);
    });

    it('should throw on non function arg', function() {
      expect(function() {
        inferInjectionArgs({});
      }).toThrow();
    });

    it('should infer injection on services', function() {
      var scope = angular.scope({
        a: function() { return 'a';},
        b: function(a){ return a + 'b';}
      });
      expect(scope.$service('b')).toEqual('ab');
    });
  });

  describe('inject', function() {
    it('should inject names', function() {
      expect(annotate('a', {}).$inject).toEqual(['a']);
      expect(annotate('a', 'b', {}).$inject).toEqual(['a', 'b']);
    });

    it('should inject array', function() {
      expect(annotate(['a'], {}).$inject).toEqual(['a']);
      expect(annotate(['a', 'b'], {}).$inject).toEqual(['a', 'b']);
    });
  });
});
