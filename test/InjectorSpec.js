'use strict';

describe('injector', function() {
  var providers;
  var injector;

  beforeEach(function() {
    providers = extensionMap({}, 'providers');
    injector = createInjector(providers);
  });

  it("should return same instance from calling provider", function() {
    var instance = {},
        original = instance;
    providers('instance', function() { return instance; });
    expect(injector('instance')).toEqual(instance);
    instance = 'deleted';
    expect(injector('instance')).toEqual(original);
  });


  it('should inject providers', function() {
    providers('a', function() {return 'Mi';});
    providers('b', function(mi) {return mi+'sko';}, {$inject:['a']});
    expect(injector('b')).toEqual('Misko');
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


  it('should provide useful message if no provider', function() {
    expect(function() {
      injector('idontexist');
    }).toThrow("Unknown provider for 'idontexist'.");
  });

  it('should proved path to the missing provider', function() {
    expect(function() {
      injector('idontexist', ['a', 'b']);
    }).toThrow("Unknown provider for 'idontexist' <- 'a' <- 'b'.");
  });

  it('should autostart eager services', function() {
    var log = '';
    providers('eager', function() {log += 'eager;'; return 'foo';}, {$eager: true});
    injector = createInjector(providers);
    expect(log).toEqual('eager;');
    expect(injector('eager')).toBe('foo');
  });

  describe('invoke', function() {
    var args;

    beforeEach(function() {
      args = null;
      providers('a', function() {return 1;});
      providers('b', function() {return 2;});
    });


    function fn(a, b, c, d) {
      args = [this, a, b, c, d];
      return a + b + c + d;
    }


    it('should call function', function() {
      fn.$inject = ['a', 'b'];
      injector.invoke({name:"this"}, fn, [3, 4]);
      expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
    });


    it('should treat array as annotations', function() {
      injector.invoke({name:"this"}, ['a', 'b', fn], [3, 4]);
      expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
    });


    it('should invoke the passed in function with all of the dependencies as arguments', function(){
      expect(injector(['a', 'b', fn], [3, 4])).toEqual(10);
    });


    it('should fail with errors if not function or array', function() {
      expect(function() {
        injector.invoke({}, {});
      }).toThrow("Argument 'fn' is not a function, got Object");
      expect(function() {
        injector.invoke({}, ['a', 123]);
      }).toThrow("Argument 'fn' is not a function, got number");
    });
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
                 function (a, b) {}
                 */
          _c,
          /* {some type} */ d) { extraParans();}
      expect(inferInjectionArgs($f_n0)).toEqual(['$a', 'b_', '_c',  'd']);
      expect($f_n0.$inject).toEqual(['$a', 'b_', '_c',  'd']);
    });

    it('should handle no arg functions', function() {
      function $f_n0() {}
      expect(inferInjectionArgs($f_n0)).toEqual([]);
      expect($f_n0.$inject).toEqual([]);
    });

    it('should handle args with both $ and _', function() {
      function $f_n0($a_) {}
      expect(inferInjectionArgs($f_n0)).toEqual(['$a_']);
      expect($f_n0.$inject).toEqual(['$a_']);
    });

    it('should throw on non function arg', function() {
      expect(function() {
        inferInjectionArgs({});
      }).toThrow();
    });

    it('should infer injection on services', function() {
      var $injector = createInjector({
        a: function() { return 'a';},
        b: function(a) { return a + 'b';}
      });
      expect($injector('b')).toEqual('ab');
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

describe('injector2', function() {

  it('should have $injector', function() {
    var $injector = createInjector2();
    expect($injector('$injector')).toBe($injector);
  });

  it('should define module', function() {
    var log = '';
    var injector = createInjector2([function($provide) {
      $provide.value('value', 'value;');
      $provide.factory('fn', valueFn('function;'));
      $provide.service('service', function() {
        this.$get = valueFn('service;');
      });
    }, function(valueProvider, fnProvider, serviceProvider) {
      log += valueProvider.$get() + fnProvider.$get() + serviceProvider.$get();
    }])(function(value, fn, service) {
      log += '->' + value + fn + service;
    });
    expect(log).toEqual('value;function;service;->value;function;service;');
  });


  describe('module', function() {
    it('should provide $injector and $provide even when no module is requested', function() {
      var $provide,
          $injector = createInjector2([
            angular.extend(function(p) { $provide = p; }, {$inject: ['$provide']})
          ]);
      expect($injector('$injector')).toBe($injector);
      expect($injector('$provide')).toBe($provide);
    });


    it('should load multiple function modules and infer inject them', function() {
      var a = 'junk';
      var $injector = createInjector2([
        function() {
          a = 'A'; // reset to prove we ran
        },
        function($provide) {
          $provide.value('a', a);
        },
        angular.extend(function(p, serviceA) {
          p.value('b', serviceA.$get() + 'B' );
        }, {$inject:['$provide', 'aProvider']}),
        ['$provide', 'bProvider', function(p, serviceB) {
          p.value('c', serviceB.$get() + 'C');
        }]
      ]);
      expect($injector('a')).toEqual('A');
      expect($injector('b')).toEqual('AB');
      expect($injector('c')).toEqual('ABC');
    });


    it('should run symbolic modules', function() {
      var $injector = createInjector2(['myModule'], {
        myModule: ['$provide', function(provide) {
          provide.value('a', 'abc');
        }]
      });
      expect($injector('a')).toEqual('abc');
    });


    describe('$provide', function() {
      describe('value', function(){
        it('should configure $provide values', function() {
          expect(createInjector2([function($provide) {
            $provide.value('value', 'abc');
          }])('value')).toEqual('abc');
        });
      });


      describe('factory', function(){
        it('should configure $provide factory function', function() {
          expect(createInjector2([function($provide) {
            $provide.factory('value', valueFn('abc'));
          }])('value')).toEqual('abc');
        });
      });


      describe('service', function(){
        it('should configure $provide service object', function() {
          expect(createInjector2([function($provide) {
            $provide.service('value', {
              $get: valueFn('abc')
            });
          }])('value')).toEqual('abc');
        });


        it('should configure $provide service type', function() {
          function Type() {};
          Type.prototype.$get = function() {
            expect(this instanceof Type).toBe(true);
            return 'abc';
          };
          expect(createInjector2([function($provide) {
            $provide.service('value', Type);
          }])('value')).toEqual('abc');
        });
      });
    });


    describe('error handling', function() {
      it('should handle wrong argument type', function() {
        expect(function() {
          createInjector2([
            {}
          ], {});
        }).toThrow("Argument 'module' is not a function, got Object");
      });


      it('should handle exceptions', function() {
        expect(function() {
          createInjector2([function() {
            throw 'MyError';
          }], {});
        }).toThrow('MyError');
      });


      it('should handle no module alias', function() {
        expect(function() {
          createInjector2([function(dontExist) {
          }], {});
        }).toThrow("Unknown provider for 'dontExist'.");
      });
    });
  });


  describe('retrieval', function() {
    var instance,
        $injector,
        $provide;
    
    beforeEach(function() {
      $injector = createInjector2([ ['$provide', function(provide) {
        ($provide = provide).value('instance', instance = {name:'angular'});
      }]]);
    });


    it('should retrieve by name and cache instance', function() {
      expect(instance).toEqual({name: 'angular'});
      expect($injector('instance')).toBe(instance);
      expect($injector('instance')).toBe(instance);
    });
    
    
    it('should call functions and infer arguments', function() {
      expect($injector(function(instance) { return instance; })).toBe(instance);
      expect($injector(function(instance) { return instance; })).toBe(instance);
    });
  });


  describe('method invoking', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector2([ function($provide) {
        $provide.value('book', 'moby');
        $provide.value('author', 'melville');
      }]);
    });


    it('should invoke method', function() {
      expect($injector(function(book, author) { return author + ':' + book;})).toEqual('melville:moby');
      expect($injector.invoke($injector, function(book, author) {
        expect(this).toEqual($injector);
        return author + ':' + book;})).toEqual('melville:moby');
    });


    it('should invoke method which is annotated', function() {
      expect($injector(extend(function(b, a) { return a + ':' + b}, {$inject:['book', 'author']}))).
        toEqual('melville:moby');
      expect($injector.invoke($injector, extend(function(b, a) {
        expect(this).toEqual($injector);
        return a + ':' + b;
      }, {$inject:['book', 'author']}))).toEqual('melville:moby');
    });


    it('should invoke method which is an array of annotation', function() {
      expect($injector(function(book, author) { return author + ':' + book;})).toEqual('melville:moby');
      expect($injector.invoke($injector, function(book, author) {
        expect(this).toEqual($injector);
        return author + ':' + book;
      })).toEqual('melville:moby');
    });

    
    it('should throw usefull error on wrong argument type]', function() {
      expect(function(){
        $injector.invoke(null, {});
      }).toThrow("Argument 'fn' is not a function, got Object");
    });
  });

  describe('service instantiation', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector2([ function($provide) {
        $provide.value('book', 'moby');
        $provide.value('author', 'melville');
      }]);
    });


    function Type(book, author) {
      this.book = book;
      this.author = author;
    }
    Type.prototype.title = function() {
      return this.author + ': ' + this.book;
    };


    it('should instantiate object and preserve constructor property and be instanceof', function() {
      var t = $injector.instantiate(Type);
      expect(t.book).toEqual('moby');
      expect(t.author).toEqual('melville');
      expect(t.title()).toEqual('melville: moby');
      expect(t instanceof Type).toBe(true);
    });


    it('should allow constructor to return different object', function() {
      var t = $injector.instantiate(function() { return 'ABC'; });
      expect(t).toBe('ABC');
    });


    it('should handle constructor exception', function() {
      expect(function() {
        $injector.instantiate(function() { throw 'MyError'; });
      }).toThrow('MyError');
    });
  });

  describe('injector chaining', function() {
    
  });
});
