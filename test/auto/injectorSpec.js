'use strict';

describe('injector', function() {
  var providers;
  var injector;
  var providerInjector;
  var controllerProvider;

  beforeEach(module(function($provide, $injector, $controllerProvider) {
    providers = function(name, factory, annotations) {
      $provide.factory(name, extend(factory, annotations || {}));
    };
    providerInjector = $injector;
    controllerProvider = $controllerProvider;
  }));
  beforeEach(inject(function($injector) {
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
    providers('b', function(mi) {return mi + 'sko';}, {$inject:['a']});
    expect(injector.get('b')).toEqual('Misko');
  });


  it('should check its modulesToLoad argument', function() {
    expect(function() { angular.injector('test'); })
        .toThrowMinErr('ng', 'areq');
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


    providers('s1', function() { log.push('s1'); return {}; }, {$inject: ['s2', 's5', 's6']});
    providers('s2', function() { log.push('s2'); return {}; }, {$inject: ['s3', 's4', 's5']});
    providers('s3', function() { log.push('s3'); return {}; }, {$inject: ['s6']});
    providers('s4', function() { log.push('s4'); return {}; }, {$inject: ['s3', 's5']});
    providers('s5', function() { log.push('s5'); return {}; });
    providers('s6', function() { log.push('s6'); return {}; });

    injector.get('s1');

    expect(log).toEqual(['s6', 's3', 's5', 's4', 's2', 's1']);
  });


  it('should allow query names', function() {
    providers('abc', function() { return ''; });

    expect(injector.has('abc')).toBe(true);
    expect(injector.has('xyz')).toBe(false);
    expect(injector.has('$injector')).toBe(true);
  });


  it('should provide useful message if no provider', function() {
    expect(function() {
      injector.get('idontexist');
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist");
  });


  it('should provide the caller name if given', function(done) {
    expect(function() {
      injector.get('idontexist', 'callerName');
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist <- callerName");
  });


  it('should provide the caller name for controllers', function(done) {
    controllerProvider.register('myCtrl', function(idontexist) {});
    var $controller = injector.get('$controller');
    expect(function() {
      $controller('myCtrl', {$scope: {}});
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist <- myCtrl");
  });


  it('should not corrupt the cache when an object fails to get instantiated', function() {
    expect(function() {
      injector.get('idontexist');
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist");

    expect(function() {
      injector.get('idontexist');
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist");
  });


  it('should provide path to the missing provider', function() {
    providers('a', function(idontexist) {return 1;});
    providers('b', function(a) {return 2;});
    expect(function() {
      injector.get('b');
    }).toThrowMinErr("$injector", "unpr", "Unknown provider: idontexistProvider <- idontexist <- a <- b");
  });


  it('should create a new $injector for the run phase', inject(function($injector) {
    expect($injector).not.toBe(providerInjector);
  }));


  describe('invoke', function() {
    var args;

    beforeEach(function() {
      args = null;
      providers('a', function() {return 1;});
      providers('b', function() {return 2;});
    });


    function fn(a, b, c, d) {
      /* jshint -W040 */
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
      }).toThrowMinErr("ng", "areq", "Argument 'fn' is not a function, got Object");
      expect(function() {
        injector.invoke(['a', 123], {});
      }).toThrowMinErr("ng", "areq", "Argument 'fn' is not a function, got number");
    });
  });


  describe('annotation', function() {
    /* global annotate: false */
    it('should return $inject', function() {
      function fn() {}
      fn.$inject = ['a'];
      expect(annotate(fn)).toBe(fn.$inject);
      expect(annotate(function() {})).toEqual([]);
      expect(annotate(function() {})).toEqual([]);
      // jscs:disable disallowSpacesInAnonymousFunctionExpression
      expect(annotate(function  () {})).toEqual([]);
      expect(annotate(function /* */ () {})).toEqual([]);
      // jscs:enable disallowSpacesInAnonymousFunctionExpression
    });


    it('should create $inject', function() {
      var extraParans = angular.noop;
      // jscs:disable disallowSpacesInFunctionDeclaration
      // keep the multi-line to make sure we can handle it
      function $f_n0 /*
          */(
          $a, // x, <-- looks like an arg but it is a comment
          b_, /* z, <-- looks like an arg but it is a
                 multi-line comment
                 function(a, b) {}
                 */
          _c,
          /* {some type} */ d) { extraParans();}
      // jscs:enable disallowSpacesInFunctionDeclaration
      expect(annotate($f_n0)).toEqual(['$a', 'b_', '_c',  'd']);
      expect($f_n0.$inject).toEqual(['$a', 'b_', '_c',  'd']);
    });


    it('should strip leading and trailing underscores from arg name during inference', function() {
      function beforeEachFn(_foo_) { /* foo = _foo_ */ }
      expect(annotate(beforeEachFn)).toEqual(['foo']);
    });

    it('should not strip service names with a single underscore', function() {
      function beforeEachFn(_) { /* _ = _ */ }
      expect(annotate(beforeEachFn)).toEqual(['_']);
    });

    it('should handle no arg functions', function() {
      function $f_n0() {}
      expect(annotate($f_n0)).toEqual([]);
      expect($f_n0.$inject).toEqual([]);
    });


    it('should handle no arg functions with spaces in the arguments list', function() {
      function fn() {}
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


    // Only Chrome and Firefox support this syntax.
    if (/chrome|firefox/i.test(navigator.userAgent)) {
      it('should be possible to annotate functions that are declared using ES6 syntax', function() {
        /*jshint -W061 */
        // The function is generated using `eval` as just having the ES6 syntax can break some browsers.
        expect(annotate(eval('({ fn(x) { return; } })').fn)).toEqual(['x']);
        /*jshint +W061 */
      });
    }


    it('should publish annotate API', function() {
      expect(angular.mock.$$annotate).toBe(annotate);
      spyOn(angular.mock, '$$annotate').andCallThrough();
      function fn() {}
      injector.annotate(fn);
      expect(angular.mock.$$annotate).toHaveBeenCalledWith(fn);
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
          p.value('b', serviceA.$get() + 'B');
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
      }).toThrowMinErr('$injector', 'modulerr',
        /\[\$injector:nomod\] Module 'IDontExist' is not available! You either misspelled the module name or forgot to load it/);
    });


    it('should load dependant modules only once', function() {
      var log = '';
      angular.module('a', [], function() { log += 'a'; });
      angular.module('b', ['a'], function() { log += 'b'; });
      angular.module('c', ['a', 'b'], function() { log += 'c'; });
      createInjector(['c', 'c']);
      expect(log).toEqual('abc');
    });

    it('should load different instances of dependent functions', function() {
      function  generateValueModule(name, value) {
        return function($provide) {
          $provide.value(name, value);
        };
      }
      var injector = createInjector([generateValueModule('name1', 'value1'),
                                     generateValueModule('name2', 'value2')]);
      expect(injector.get('name2')).toBe('value2');
    });

    it('should load same instance of dependent function only once', function() {
      var count = 0;
      function valueModule($provide) {
        count++;
        $provide.value('name', 'value');
      }

      var injector = createInjector([valueModule, valueModule]);
      expect(injector.get('name')).toBe('value');
      expect(count).toBe(1);
    });

    it('should execute runBlocks after injector creation', function() {
      var log = '';
      angular.module('a', [], function() { log += 'a'; }).run(function() { log += 'A'; });
      angular.module('b', ['a'], function() { log += 'b'; }).run(function() { log += 'B'; });
      createInjector([
        'b',
        valueFn(function() { log += 'C'; }),
        [valueFn(function() { log += 'D'; })]
      ]);
      expect(log).toEqual('abABCD');
    });

    it('should execute own config blocks after all own providers are invoked', function() {
      var log = '';
      angular.module('a', ['b'])
      .config(function($aProvider) {
        log += 'aConfig;';
      })
      .provider('$a', function() {
        log += '$aProvider;';
        this.$get = function() {};
      });
      angular.module('b', [])
      .config(function($bProvider) {
        log += 'bConfig;';
      })
      .provider('$b', function() {
        log += '$bProvider;';
        this.$get = function() {};
      });

      createInjector(['a']);
      expect(log).toBe('$bProvider;bConfig;$aProvider;aConfig;');
    });

    describe('$provide', function() {

      it('should throw an exception if we try to register a service called "hasOwnProperty"', function() {
        createInjector([function($provide) {
          expect(function() {
            $provide.provider('hasOwnProperty', function() {  });
          }).toThrowMinErr('ng', 'badname');
        }]);
      });

      it('should throw an exception if we try to register a constant called "hasOwnProperty"', function() {
        createInjector([function($provide) {
          expect(function() {
            $provide.constant('hasOwnProperty', {});
          }).toThrowMinErr('ng', 'badname');
        }]);
      });


      describe('constant', function() {
        it('should create configuration injectable constants', function() {
          var log = [];
          createInjector([
            function($provide) {
              $provide.constant('abc', 123);
              $provide.constant({a: 'A', b:'B'});
              return function(a) {
                log.push(a);
              };
            },
            function(abc) {
              log.push(abc);
              return function(b) {
                log.push(b);
              };
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
          function Type() {}
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
          }
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
              };
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
              };
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
        }).toThrowMinErr('$injector', 'modulerr', /Failed to instantiate module \{\} due to:\n.*\[ng:areq\] Argument 'module' is not a function, got Object/);
      });


      it('should handle exceptions', function() {
        expect(function() {
          createInjector([function() {
            throw 'MyError';
          }], {});
        }).toThrowMinErr('$injector', 'modulerr', /Failed to instantiate module .+ due to:\n.*MyError/);
      });


      it('should decorate the missing service error with module name', function() {
        angular.module('TestModule', [], function(xyzzy) {});
        expect(function() {
          createInjector(['TestModule']);
        }).toThrowMinErr(
          '$injector', 'modulerr', /Failed to instantiate module TestModule due to:\n.*\[\$injector:unpr] Unknown provider: xyzzy/
        );
      });


      it('should decorate the missing service error with module function', function() {
        function myModule(xyzzy) {}
        expect(function() {
          createInjector([myModule]);
        }).toThrowMinErr(
          '$injector', 'modulerr', /Failed to instantiate module function myModule\(xyzzy\) due to:\n.*\[\$injector:unpr] Unknown provider: xyzzy/
        );
      });


      it('should decorate the missing service error with module array function', function() {
        function myModule(xyzzy) {}
        expect(function() {
          createInjector([['xyzzy', myModule]]);
        }).toThrowMinErr(
          '$injector', 'modulerr', /Failed to instantiate module function myModule\(xyzzy\) due to:\n.*\[\$injector:unpr] Unknown provider: xyzzy/
        );
      });


      it('should throw error when trying to inject oneself', function() {
        expect(function() {
          createInjector([function($provide) {
            $provide.factory('service', function(service) {});
            return function(service) {};
          }]);
        }).toThrowMinErr('$injector', 'cdep', 'Circular dependency found: service <- service');
      });


      it('should throw error when trying to inject circular dependency', function() {
        expect(function() {
          createInjector([function($provide) {
            $provide.factory('a', function(b) {});
            $provide.factory('b', function(a) {});
            return function(a) {};
          }]);
        }).toThrowMinErr('$injector', 'cdep', 'Circular dependency found: a <- b <- a');
      });

    });
  });


  describe('retrieval', function() {
    var instance = {name:'angular'};
    var Instance = function() { this.name = 'angular'; };

    function createInjectorWithValue(instanceName, instance) {
      return createInjector([['$provide', function(provide) {
        provide.value(instanceName, instance);
      }]]);
    }
    function createInjectorWithFactory(serviceName, serviceDef) {
      return createInjector([['$provide', function(provide) {
        provide.factory(serviceName, serviceDef);
      }]]);
    }


    it('should retrieve by name', function() {
      var $injector = createInjectorWithValue('instance', instance);
      var retrievedInstance = $injector.get('instance');
      expect(retrievedInstance).toBe(instance);
    });


    it('should cache instance', function() {
      var $injector = createInjectorWithFactory('instance', function() { return new Instance(); });
      var instance = $injector.get('instance');
      expect($injector.get('instance')).toBe(instance);
      expect($injector.get('instance')).toBe(instance);
    });


    it('should call functions and infer arguments', function() {
      var $injector = createInjectorWithValue('instance', instance);
      expect($injector.invoke(function(instance) { return instance; })).toBe(instance);
    });

  });


  describe('method invoking', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector([function($provide) {
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
        return author + ':' + book;
      }, $injector)).toEqual('melville:moby');
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
        return a + ':' + b;
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
      }).toThrowMinErr("ng", "areq", "Argument 'fn' is not a function, got Object");
    });
  });


  describe('service instantiation', function() {
    var $injector;

    beforeEach(function() {
      $injector = createInjector([function($provide) {
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


    it('should allow constructor to return a function', function() {
      var fn = function() {};
      var Class = function() {
        return fn;
      };

      expect($injector.instantiate(Class)).toBe(fn);
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
      }).toThrowMinErr("$injector", "unpr", "Unknown provider: nameProviderProvider <- nameProvider");
    });


    it('should prevent provider configuration in app', function() {
      var  $injector = createInjector([]);
      expect(function() {
        $injector.get('$provide').value('a', 'b');
      }).toThrowMinErr("$injector", "unpr", "Unknown provider: $provideProvider <- $provide");
    });


    it('should prevent instance lookup in module', function() {
      function instanceLookupInModule(name) { throw new Error('FAIL'); }
      expect(function() {
        createInjector([function($provide) {
          $provide.value('name', 'angular');
        }, instanceLookupInModule]);
      }).toThrowMatching(/\[\$injector:unpr] Unknown provider: name/);
    });
  });
});

describe('strict-di injector', function() {
  beforeEach(inject.strictDi(true));

  describe('with ngMock', function() {
    it('should not throw when calling mock.module() with "magic" annotations', function() {
      expect(function() {
        module(function($provide, $httpProvider, $compileProvider) {
          // Don't throw!
        });
      }).not.toThrow();
    });


    it('should not throw when calling mock.inject() with "magic" annotations', function() {
      expect(function() {
        inject(function($rootScope, $compile, $http) {
          // Don't throw!
        });
      }).not.toThrow();
    });
  });


  it('should throw if magic annotation is used by service', function() {
    module(function($provide) {
      $provide.service({
        '$test': function() { return this; },
        '$test2': function($test) { return this; }
      });
    });
    inject(function($injector) {
      expect(function() {
        $injector.invoke(function($test2) {});
      }).toThrowMinErr('$injector', 'strictdi');
    });
  });


  it('should throw if magic annotation is used by provider', function() {
    module(function($provide) {
      $provide.provider({
        '$test': function() { this.$get = function($rootScope) { return $rootScope; }; }
      });
    });
    inject(function($injector) {
      expect(function() {
        $injector.invoke(['$test', function($test) {}]);
      }).toThrowMinErr('$injector', 'strictdi');
    });
  });


  it('should throw if magic annotation is used by factory', function() {
    module(function($provide) {
      $provide.factory({
        '$test': function($rootScope) { return function() {}; }
      });
    });
    inject(function($injector) {
      expect(function() {
        $injector.invoke(['$test', function(test) {}]);
      }).toThrowMinErr('$injector', 'strictdi');
    });
  });


  it('should throw if factory does not return a value', function() {
    module(function($provide) {
      $provide.factory('$test', function() {});
    });
    expect(function() {
      inject(function($test) {});
    }).toThrowMinErr('$injector', 'undef');
  });


  it('should always use provider as `this` when invoking a factory', function() {
    var called = false;
    function factoryFn() {
      called = true;
      // jshint -W040
      expect(typeof this.$get).toBe('function');
      return this;
      // jshint +W040
    }
    module(function($provide) {
      $provide.factory('$test', factoryFn);
    });
    inject(function($test) {});
    expect(called).toBe(true);
  });
});
