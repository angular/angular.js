describe('injector', function(){
  var providers;
  var cache;
  var inject;
  var scope;

  beforeEach(function(){
    providers = extensionMap({}, 'providers');
    cache = {};
    scope = {};
    inject = createInjector(scope, providers, cache);
  });

  it("should return same instance from calling provider", function(){
    providers('text', function(){ return scope.name; });
    scope.name = 'abc';
    expect(inject('text')).toEqual('abc');
    expect(cache.text).toEqual('abc');
    scope.name = 'deleted';
    expect(inject('text')).toEqual('abc');
  });

  it("should return an array of instances", function(){
    cache.a = 0;
    providers('b', function(){return 2;});
    expect(inject(['a', 'b'])).toEqual([0,2]);
  });

  it("should call function", function(){
    providers('a', function(){return 1;});
    providers('b', function(){return 2;});
    var args;
    function fn(a, b, c, d) {
      args = [this, a, b, c, d];
    }
    fn.$inject = ['a', 'b'];
    inject(fn, {name:"this"}, 3, 4);
    expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
  });

  it('should inject providers', function(){
    providers('a', function(){return this.mi = 'Mi';});
    providers('b', function(mi){return this.name = mi+'sko';}, {$inject:['a']});
    expect(inject('b')).toEqual('Misko');
    expect(scope).toEqual({mi:'Mi', name:'Misko'});
  });

  it('should provide usefull message if no provider', function(){
    assertThrows("Unknown provider for 'idontexist'.", function(){
      inject('idontexist');
    });
  });

  it('should autostart eager services', function(){
    var log = '';
    providers('eager', function(){log += 'eager;'; return 'foo';}, {$eager: true});
    inject();
    expect(log).toEqual('eager;');
    expect(inject('eager')).toBe('foo');
  });

  describe('annotation', function(){
    it('should return $inject', function(){
      function fn(){};
      fn.$inject = ['a'];
      expect(injectionArgs(fn)).toBe(fn.$inject);
      expect(injectionArgs(function(){})).toEqual([]);
    });

    it('should create $inject', function(){
      // keep the multi-line to make sure we can handle it
      function $f_n0(
          $a, // x, <-- looks like an arg but it is a comment
          b_, /* z, <-- looks like an arg but it is a
                 multi-line comment
                 function (a, b){}
                 */
          /* {some type} */ c){ extraParans();};
      expect(injectionArgs($f_n0)).toEqual(['$a', 'b']);
      expect($f_n0.$inject).toEqual(['$a', 'b']);
    });

    it('should handle no arg functions', function(){
      function $f_n0(){};
      expect(injectionArgs($f_n0)).toEqual([]);
      expect($f_n0.$inject).toEqual([]);
    });

    it('should handle args with both $ and _', function(){
      function $f_n0($a_){};
      expect(injectionArgs($f_n0)).toEqual(['$a']);
      expect($f_n0.$inject).toEqual(['$a']);
    });

    it('should throw on non function arg', function(){
      expect(function(){
        injectionArgs({});
      }).toThrow();
    });

    it('should throw on injectable after non-injectable arg', function(){
      expect(function(){
        injectionArgs(function($a, b_, nonInject, d_){});
      }).toThrow();
    });

  });
});
