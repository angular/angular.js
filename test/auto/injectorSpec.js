'use strict';

describe('injector', function() {
  var providers;
  var injector;

  beforeEach(module(function($provide) {
    providers = function(name, factory, annotations) {
      $provide.factory(name, extend(factory, annotations||{}));
    };
  }));
  beforeEach(inject(function($injector){
    injector = $injector;
  }));


  it("should return same instance from calling provider", function() {
    var instance = {},
        original = instance;
    providers('instance', function() { return instance; });
    expect(injector.get('instance')).toEqual(instance);
    instance = 'deleted';
    expect(injector.get('instance')).toEqual(original);
  });


  it('should inject providers', function() {
    providers('a', function() {return 'Mi';});
    providers('b', function(mi) {return mi+'sko';}, {$inject:['a']});
    expect(injector.get('b')).toEqual('Misko');
  });


  it('should resolve dependency graph and instantiate all services just once', function() {
    var log = [];

//          s1
//        /  | \
//       /  s2  \
//      /  / | \ \
//     /s3 < s4 > s5
//    //
//   s6


    providers('s1', function() { log.push('s1'); }, {$inject: ['s2', 's5', 's6']});
    providers('s2', function() { log.push('s2'); }, {$inject: ['s3', 's4', 's5']});
    providers('s3', function() { log.push('s3'); }, {$inject: ['s6']});
    providers('s4', function() { log.push('s4'); }, {$inject: ['s3', 's5']});
    providers('s5', function() { log.push('s5'); });
    providers('s6', function() { log.push('s6'); });

    injector.get('s1');

    expect(log).toEqual(['s6', 's3', 's5', 's4', 's2', 's1']);
  });


  it('should provide useful message if no provider', function() {
    expect(function() {
      injector.get('idontexist');
    }).toThrow("Unknown provider: idontexistProvider <- idontexist");
  });


  it('should proved path to the missing provider', function() {
    providers('a', function(idontexist) {return 1;});
    providers('b', function(a) {return 2;});
    expect(function() {
      injector.get('b');
    }).toThrow("Unknown provider: idontexistProvider <- idontexist <- a <- b");
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
      fn.$inject = ['a', 'b', 'c', 'd'];
      injector.invoke(fn, {name:"this"},  {c:3, d:4});
      expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
    });


    it('should treat array as annotations', function() {
      injector.invoke(['a', 'b', 'c', 'd', fn], {name:"this"}, {c:3, d:4});
      expect(args).toEqual([{name:'this'}, 1, 2, 3, 4]);
    });


    it('should invoke the passed-in fn with all of the dependencies as arguments', function() {
      providers('c', function() {return 3;});
      providers('d', function() {return 4;});
      expect(injector.invoke(['a', 'b', 'c', 'd', fn])).toEqual(10);
    });


    it('should fail with errors if not function or array', function() {
      expect(function() {
        injector.invoke({});
      }).toThrow("Argument 'fn' is not a function, got Object");
      expect(function() {
        injector.invoke(['a', 123], {});
      }).toThrow("Argument 'fn' is not a function, got number");
    });
  });


  describe('annotation', function() {
    it('should return $inject', function() {
      function fn() {}
      fn.$inject = ['a'];
      expect(annotate(fn)).toBe(fn.$inject);
      expect(annotate(function() {})).toEqual([]);
      expect(annotate(function () {})).toEqual([]);
      expect(annotate(function  () {})).toEqual([]);
      expect(annotate(function /* */ () {})).toEqual([]);
    });


    it('should create $inject', function() {
      // keep the multi-line to make sure we can handle it
      function $f_n0 /*
          */(
          $a, // x, <-- looks like an arg but it is a comment
          b_ , /* z, <-- looks like an arg but it is a
                 multi-line comment
                 function (a, b) {}
                 */
          _c,
          /* {some type} */ d) { extraParans();}
      expect(annotate($f_n0)).toEqual(['$a', 'b_', '_c',  'd']);
      expect($f_n0.$inject).toEqual(['$a', 'b_', '_c',  'd']);
    });


    it('should strip leading and trailing underscores from arg name during inference', function() {
      function beforeEachFn(_foo_) { /* foo = _foo_ */ };
      expect(annotate(beforeEachFn)).toEqual(['foo']);
    });


    it('should handle no arg functions', function() {
      function $f_n0() {}
      expect(annotate($f_n0)).toEqual([]);
      expect($f_n0.$inject).toEqual([]);
    });


    it('should handle no arg functions with spaces in the arguments list', function() {
      function fn( ) {}
      expect(annotate(fn)).toEqual([]);
      expect(fn.$inject).toEqual([]);
    });


    it('should handle args with both $ and _', function() {
      function $f_n0($a_) {}
      expect(annotate($f_n0)).toEqual(['$a_']);
      expect($f_n0.$inject).toEqual(['$a_']);
    });


    it('should throw on non function arg', function() {
      expect(function() {
        annotate({});
      }).toThrow();
    });


    it('should publish annotate API', function() {
      expect(injector.annotate).toBe(annotate);
    });
  });


  it('should have $injector', function() {
    var $injector = createInjector();
    expect($injector.get('$injector')).toBe($injector);
  });


  it('should define module', function() {
    var log = '';
    var injector = createInjector([function($provide) {
      $provide.value('value', 'value;');
      $provide.factory('fn', valueFn('function;'));
      $provide.provider('service', function() {
        this.$get = valueFn('service;');
      });
    }, function(valueProvider, fnProvider, serviceProvider) {
      log += valueProvider.$get() + fnProvider.$get() + serviceProvider.$get();
    }]).invoke(function(value, fn, service) {
      log += '->' + value + fn + service;
    });
    expect(log).toEqual('value;function;service;->value;function;service;');
  });


  describe('module', function() {
    it('should provide $injector even when no module is requested', function() {
      var $provide,
          $injector = createInjector([
            angular.extend(function(p) { $provide = p; }, {$inject: ['$provide']})
          ]);
      expect($injector.get('$injector')).toBe($injector);
    });


    it('should load multiple function modules and infer inject them', function() {
      var a = 'junk';
      var $injector = createInjector([
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
      expect($injector.get('a')).toEqual('A');
      expect($injector.get('b')).toEqual('AB');
      expect($injector.get('c')).toEqual('ABC');
    });


    it('should run symbolic modules', function() {
      angularModule('myModule', []).value('a', 'abc');
      var $injector = createInjector(['myModule']);
      expect($injector.get('a')).toEqual('abc');
    });


    it('should error on invalid module name', function() {
      expect(function() {
        createInjector(['IDontExist'], {});
      }).toThrow("No module: IDontExist");
    });


    it('should load dependant modules only once', function() {
      var log = '';
      angular.module('a', [], function(){ log += 'a'; });
      angular.module('b', ['a'], function(){ log += 'b'; });
      angular.module('c', ['a', 'b'], function(){ log += 'c'; });
      createInjector(['c', 'c']);
      expect(log).toEqual('abc');
    });

    it('should execute runBlocks after injector creation', function() {
      var log = '';
      angular.module('a', [], function(){ log += 'a'; }).run(function() { log += 'A'; });
      angular.module('b', ['a'], function(){ log += 'b'; }).run(function() { log += 'B'; });
      createInjector([
          'b',
          valueFn(function() { log += 'C'; }),
          [valueFn(function() { log += 'D'; })]
      ]);
      expect(log).toEqual('abABCD');
    });

    describe('$provide', function() {
      describe('constant', function() {
        it('should create configuration injectable constants', function() {
          var log = [];
          createInjector([
              function($provide){
                $provide.constant('abc', 123);
                $provide.constant({a: 'A', b:'B'});
                return function(a) {
                  log.push(a);
                }
              },
              function(abc) {
                log.push(abc);
                return function(b) {
                  log.push(b);
                }
              }
          ]).get('abc');
          expect(log).toEqual([123, 'A', 'B']);
        });
      });


      describe('value', function() {
        it('should configure $provide values', function() {
          expect(createInjector([function($provide) {
            $provide.value('value', 'abc');
          }]).get('value')).toEqual('abc');
        });


        it('should configure a set of values', function() {
          expect(createInjector([function($provide) {
            $provide.value({value: Array});
          }]).get('value')).toEqual(Array);
        });
      });


      describe('factory', function() {
        it('should configure $provide factory function', function() {
          expect(createInjector([function($provide) {
            $provide.factory('value', valueFn('abc'));
          }]).get('value')).toEqual('abc');
        });


        it('should configure a set of factories', function() {
          expect(createInjector([function($provide) {
            $provide.factory({value: Array});
          }]).get('value')).toEqual([]);
        });
      });


      describe('service', function() {
        it('should register a class', function() {
          var Type = function(value) {
            this.value = value;
          };

          var instance = createInjector([function($provide) {
            $provide.value('value', 123);
            $provide.service('foo', Type);
          }]).get('foo');

          expect(instance instanceof Type).toBe(true);
          expect(instance.value).toBe(123);
        });


        it('should register a set of classes', function() {
          var Type = function() {};

          var injector = createInjector([function($provide) {
            $provide.service({
              foo: Type,
              bar: Type
            });
          }]);

          expect(injector.get('foo') instanceof Type).toBe(true);
          expect(injector.get('bar') instanceof Type).toBe(true);
        });
      });


      describe('provider', function() {
        it('should configure $provide provider object', function() {
          expect(createInjector([function($provide) {
            $provide.provider('value', {
              $get: valueFn('abc')
            });
          }]).get('value')).toEqual('abc');
        });


        it('should configure $provide provider type', function() {
          function Type() {};
          Type.prototype.$get = function() {
            expect(this instanceof Type).toBe(true);
            return 'abc';
          };
          expect(createInjector([function($provide) {
            $provide.provider('value', Type);
          }]).get('value')).toEqual('abc');
        });


        it('should configure $provide using an array', function() {
          function Type(PREFIX) {
            this.prefix = PREFIX;
          };
          Type.prototype.$get = function() {
            return this.prefix + 'def';
          };
          expect(createInjector([function($provide) {
            $provide.constant('PREFIX', 'abc');
            $provide.provider('value', ['PREFIX', Type]);
          }]).get('value')).toEqual('abcdef');
        });


        it('should configure a set of providers', function() {
          expect(createInjector([function($provide) {
            $provide.provider({value: valueFn({$get:Array})});
          }]).get('value')).toEqual([]);
        });
      });


      describe('decorator', function() {
        var log, injector;

        beforeEach(function() {
          log = [];
        });


        it('should be called with the original instance', function() {
          injector = createInjector([function($provide) {
            $provide.value('myService', function(val) {
              log.push('myService:' + val);
              return 'origReturn';
            });

            $provide.decorator('myService', function($delegate) {
              return function(val) {
                log.push('myDecoratedService:' + val);
                var origVal = $delegate('decInput');
                return 'dec+' + origVal;
              };
            });
          }]);

          var out = injector.get('myService')('input');
          log.push(out);
          expect(log.join('; ')).
            toBe('myDecoratedService:input; myService:decInput; dec+origReturn');
        });


        it('should allow multiple decorators to be applied to a service', function() {
          injector = createInjector([function($provide) {
            $provide.value('myService', function(val) {
              log.push('myService:' + val);
              return 'origReturn';
            });

            $provide.decorator('myService', function($delegate) {
              return function(val) {
                log.push('myDecoratedService1:' + val);
                var origVal = $delegate('decInput1');
                return 'dec1+' + origVal;
              };
            });

            $provide.decorator('myService', function($delegate) {
              return function(val) {
                log.push('myDecoratedService2:' + val);
                var origVal = $delegate('decInput2');
                return 'dec2+' + origVal;
              };
            });
          }]);

          var out = injector.get('myService')('input');
          log.push(out);
          expect(log).toEqual(['myDecoratedService2:input',
                               'myDecoratedService1:decInput2',
                               'myService:decInput1',
                               'dec2+dec1+origReturn']);
        });


        it('should decorate services with dependencies', function() {
          injector = createInjector([function($provide) {
            $provide.value('dep1', 'dependency1');

            $provide.factory('myService', ['dep1', function(dep1) {
              return function(val) {
                log.push('myService:' + val + ',' + dep1);
                return 'origReturn';
              }
            }]);

            $provide.decorator('myService', function($delegate) {
              return function(val) {
                log.push('myDecoratedService:' + val);
                var origVal = $delegate('decInput');
                return 'dec+' + origVal;
              };
            });
          }]);

          var out = injector.get('myService')('input');
          log.push(out);
          expect(log.join('; ')).
            toBe('myDecoratedService:input; myService:decInput,dependency1; dec+origReturn');
        });


        it('should allow for decorators to be injectable', function() {
          injector = createInjector([function($provide) {
            $provide.value('dep1', 'dependency1');

            $provide.factory('myService', function() {
              return function(val) {
                log.push('myService:' + val);
                return 'origReturn';
              }
            });

            $provide.decorator('myService', function($delegate, dep1) {
              return function(val) {
                log.push('myDecoratedService:' + val + ',' + dep1);
                var origVal = $delegate('decInput');
                return 'dec+' + origVal;
              };
            });
          }]);

          var out = injector.get('myService')('input');
          log.push(out);
          expect(log.join('; ')).
            toBe('myDecoratedService:input,dependency1; myService:decInput; dec+origReturn');
        });
      });
    });


    describe('error handling', function() {
      it('should handle wrong argument type', function() {
        expect(function() {
          createInjector([
            {}
          ], {});
        }).toThrow("Argument 'module' is not a function, got Object");
      });


      it('should handle exceptions', function() {
        expect(function() {
          createInjector([function() {
            throw 'MyError';
          }], {});
        }).toThrow('MyError');
      });


      it('should decorate the missing service error with module name', function() {
        angular.module('TestModule', [], function($injector) {});
        expect(function() {
          createInjector(['TestModule']);
        }).toThrow('Unknown provider: $injector from TestModule');
      });


      it('should decorate the missing service error with module function', function() {
        function myModule($injector){}
        expect(function() {
          createInjector([myModule]);
        }).toThrow('Unknown provider: $injector from ' + myModule);
      });


      it('should decorate the missing service error with module array function', function() {
        function myModule($injector){}
        expect(function() {
          createInjector([['$injector', myModule]]);
        }).toThrow('Unknown provider: $injector from ' + myModule);
      });


      it('should throw error when trying to inject oneself', function() {
        expect(function() {
          createInjector([function($provide){
            $provide.factory('service', function(service){});
            return function(service) {}
          }])
        }).toThrow('Circular dependency: service');
      });


      it('should throw error when trying to inject circular dependency', function() {
        expect(function() {
          createInjector([function($provide){
            $provide.factory('a', function(b){});
            $provide.factory('b', function(a){});
            return function(a) {}
          }])
        }).toThrow('Circular dependency: b <- a');
      });
    });
  });


  describe('retrieval', function() {
    var instance,
        $injector,
        $provide;

    beforeEach(function() {
      $injector = createInjector([ ['$provide', function(provide) {
        ($provide = provide).value('instance', instance = {name:'angular'});
      }]]);
    });


    it('should retrieve by name and cache instance', function() {
      expect(instance).toEqual({name: 'angular'});
      expect($injector.get('instance')).toBe(instance);
      expect($injector.get('instance')).toBe(instance);
    });


    it('should call functions and infer arguments', function() {
      expect($injector.invoke(function(instance) { return instance; })).toBe(instance);
      expect($injector.invoke(function(instance) { return instance; })).toBe(instance);
    });
  });


  describe('method invoking', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector([ function($provide) {
        $provide.value('book', 'moby');
        $provide.value('author', 'melville');
      }]);
    });


    it('should invoke method', function() {
      expect($injector.invoke(function(book, author) {
        return author + ':' + book;
      })).toEqual('melville:moby');
      expect($injector.invoke(function(book, author) {
        expect(this).toEqual($injector);
        return author + ':' + book;}, $injector)).toEqual('melville:moby');
    });


    it('should invoke method with locals', function() {
      expect($injector.invoke(function(book, author) {
        return author + ':' + book;
      })).toEqual('melville:moby');
      expect($injector.invoke(
        function(book, author, chapter) {
          expect(this).toEqual($injector);
          return author + ':' + book + '-' + chapter;
        }, $injector, {author:'m', chapter:'ch1'})).toEqual('m:moby-ch1');
    });


    it('should invoke method which is annotated', function() {
      expect($injector.invoke(extend(function(b, a) {
        return a + ':' + b
      }, {$inject:['book', 'author']}))).toEqual('melville:moby');
      expect($injector.invoke(extend(function(b, a) {
        expect(this).toEqual($injector);
        return a + ':' + b;
      }, {$inject:['book', 'author']}), $injector)).toEqual('melville:moby');
    });


    it('should invoke method which is an array of annotation', function() {
      expect($injector.invoke(function(book, author) {
        return author + ':' + book;
      })).toEqual('melville:moby');
      expect($injector.invoke(function(book, author) {
        expect(this).toEqual($injector);
        return author + ':' + book;
      }, $injector)).toEqual('melville:moby');
    });


    it('should throw usefull error on wrong argument type]', function() {
      expect(function() {
        $injector.invoke({});
      }).toThrow("Argument 'fn' is not a function, got Object");
    });
  });


  describe('service instantiation', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector([ function($provide) {
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


    it('should instantiate object and preserve constructor property and be instanceof ' +
        'with the array annotated type', function() {
      var t = $injector.instantiate(['book', 'author', Type]);
      expect(t.book).toEqual('moby');
      expect(t.author).toEqual('melville');
      expect(t.title()).toEqual('melville: moby');
      expect(t instanceof Type).toBe(true);
    });


    it('should allow constructor to return different object', function() {
      var obj = {};
      var Class = function() {
        return obj;
      };

      expect($injector.instantiate(Class)).toBe(obj);
    });


    it('should handle constructor exception', function() {
      expect(function() {
        $injector.instantiate(function() { throw 'MyError'; });
      }).toThrow('MyError');
    });


    it('should return instance if constructor returns non-object value', function() {
      var A = function() {
        return 10;
      };

      var B = function() {
        return 'some-string';
      };

      var C = function() {
        return undefined;
      };

      expect($injector.instantiate(A) instanceof A).toBe(true);
      expect($injector.instantiate(B) instanceof B).toBe(true);
      expect($injector.instantiate(C) instanceof C).toBe(true);
    });
  });

  describe('protection modes', function() {
    it('should prevent provider lookup in app', function() {
      var  $injector = createInjector([function($provide) {
        $provide.value('name', 'angular');
      }]);
      expect(function() {
        $injector.get('nameProvider');
      }).toThrow("Unknown provider: nameProviderProvider <- nameProvider");
    });


    it('should prevent provider configuration in app', function() {
      var  $injector = createInjector([]);
      expect(function() {
        $injector.get('$provide').value('a', 'b');
      }).toThrow("Unknown provider: $provideProvider <- $provide");
    });


    it('should prevent instance lookup in module', function() {
      function instanceLookupInModule(name) { throw Error('FAIL'); }
      expect(function() {
        createInjector([function($provide) {
          $provide.value('name', 'angular')
        }, instanceLookupInModule]);
      }).toThrow('Unknown provider: name from ' + String(instanceLookupInModule));
    });
  });
});
