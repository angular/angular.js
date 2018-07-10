'use strict';

describe('Scope', function() {

  beforeEach(module(provideLog));


  describe('$root', function() {
    it('should point to itself', inject(function($rootScope) {
      expect($rootScope.$root).toEqual($rootScope);
      expect($rootScope.hasOwnProperty('$root')).toBeTruthy();
    }));


    it('should expose the constructor', inject(function($rootScope) {
      expect(Object.getPrototypeOf($rootScope)).toBe($rootScope.constructor.prototype);
    }));


    it('should not have $root on children, but should inherit', inject(function($rootScope) {
      var child = $rootScope.$new();
      expect(child.$root).toEqual($rootScope);
      expect(child.hasOwnProperty('$root')).toBeFalsy();
    }));

  });


  describe('$parent', function() {
    it('should point to itself in root', inject(function($rootScope) {
      expect($rootScope.$root).toEqual($rootScope);
    }));


    it('should point to parent', inject(function($rootScope) {
      var child = $rootScope.$new();
      expect($rootScope.$parent).toEqual(null);
      expect(child.$parent).toEqual($rootScope);
      expect(child.$new().$parent).toEqual(child);
    }));
  });


  describe('$id', function() {
    it('should have a unique id', inject(function($rootScope) {
      expect($rootScope.$id < $rootScope.$new().$id).toBeTruthy();
    }));
  });


  describe('this', function() {
    it('should evaluate \'this\' to be the scope', inject(function($rootScope) {
      var child = $rootScope.$new();
      expect($rootScope.$eval('this')).toEqual($rootScope);
      expect(child.$eval('this')).toEqual(child);
    }));

    it('\'this\' should not be recursive', inject(function($rootScope) {
      expect($rootScope.$eval('this.this')).toBeUndefined();
      expect($rootScope.$eval('$parent.this')).toBeUndefined();
    }));

    it('should not be able to overwrite the \'this\' keyword', inject(function($rootScope) {
      $rootScope['this'] = 123;
      expect($rootScope.$eval('this')).toEqual($rootScope);
    }));

    it('should be able to access a variable named \'this\'', inject(function($rootScope) {
      $rootScope['this'] = 42;
      expect($rootScope.$eval('this[\'this\']')).toBe(42);
    }));
  });


  describe('$new()', function() {
    it('should create a child scope', inject(function($rootScope) {
      var child = $rootScope.$new();
      $rootScope.a = 123;
      expect(child.a).toEqual(123);
    }));

    it('should create a non prototypically inherited child scope', inject(function($rootScope) {
      var child = $rootScope.$new(true);
      $rootScope.a = 123;
      expect(child.a).toBeUndefined();
      expect(child.$parent).toEqual($rootScope);
      expect(child.$new).toBe($rootScope.$new);
      expect(child.$root).toBe($rootScope);
    }));

    it('should attach the child scope to a specified parent', inject(function($rootScope) {
      var isolated = $rootScope.$new(true);
      var trans = $rootScope.$new(false, isolated);
      $rootScope.a = 123;
      expect(isolated.a).toBeUndefined();
      expect(trans.a).toEqual(123);
      expect(trans.$parent).toBe(isolated);
    }));
  });


  describe('$watch/$digest', function() {
    it('should watch and fire on simple property change', inject(function($rootScope) {
      var spy = jasmine.createSpy();
      $rootScope.$watch('name', spy);
      $rootScope.$digest();
      spy.calls.reset();

      expect(spy).not.toHaveBeenCalled();
      $rootScope.$digest();
      expect(spy).not.toHaveBeenCalled();
      $rootScope.name = 'misko';
      $rootScope.$digest();
      expect(spy).toHaveBeenCalledWith('misko', undefined, $rootScope);
    }));


    it('should not expose the `inner working of watch', inject(function($rootScope) {
      function Getter() {
        expect(this).toBeUndefined();
        return 'foo';
      }
      function Listener() {
        expect(this).toBeUndefined();
      }
      // Support: IE 9 only
      // IE 9 doesn't support strict mode so its `this` will always be defined.
      if (msie === 9) return;
      $rootScope.$watch(Getter, Listener);
      $rootScope.$digest();
    }));


    it('should watch and fire on expression change', inject(function($rootScope) {
      var spy = jasmine.createSpy();
      $rootScope.$watch('name.first', spy);
      $rootScope.$digest();
      spy.calls.reset();

      $rootScope.name = {};
      expect(spy).not.toHaveBeenCalled();
      $rootScope.$digest();
      expect(spy).not.toHaveBeenCalled();
      $rootScope.name.first = 'misko';
      $rootScope.$digest();
      expect(spy).toHaveBeenCalled();
    }));

    it('should decrement the watcherCount when destroying a child scope', inject(function($rootScope) {
      var child1 = $rootScope.$new(),
        child2 = $rootScope.$new(),
        grandChild1 = child1.$new(),
        grandChild2 = child2.$new();

      child1.$watch('a', function() {});
      child2.$watch('a', function() {});
      grandChild1.$watch('a', function() {});
      grandChild2.$watch('a', function() {});

      expect($rootScope.$$watchersCount).toBe(4);
      expect(child1.$$watchersCount).toBe(2);
      expect(child2.$$watchersCount).toBe(2);
      expect(grandChild1.$$watchersCount).toBe(1);
      expect(grandChild2.$$watchersCount).toBe(1);

      grandChild2.$destroy();
      expect(child2.$$watchersCount).toBe(1);
      expect($rootScope.$$watchersCount).toBe(3);
      child1.$destroy();
      expect($rootScope.$$watchersCount).toBe(1);
    }));

    it('should decrement the watcherCount when calling the remove function', inject(function($rootScope) {
      var child1 = $rootScope.$new(),
        child2 = $rootScope.$new(),
        grandChild1 = child1.$new(),
        grandChild2 = child2.$new(),
        remove1,
        remove2;

      remove1 = child1.$watch('a', function() {});
      child2.$watch('a', function() {});
      grandChild1.$watch('a', function() {});
      remove2 = grandChild2.$watch('a', function() {});

      remove2();
      expect(grandChild2.$$watchersCount).toBe(0);
      expect(child2.$$watchersCount).toBe(1);
      expect($rootScope.$$watchersCount).toBe(3);
      remove1();
      expect(grandChild1.$$watchersCount).toBe(1);
      expect(child1.$$watchersCount).toBe(1);
      expect($rootScope.$$watchersCount).toBe(2);

      // Execute everything a second time to be sure that calling the remove function
      // several times, it only decrements the counter once
      remove2();
      expect(child2.$$watchersCount).toBe(1);
      expect($rootScope.$$watchersCount).toBe(2);
      remove1();
      expect(child1.$$watchersCount).toBe(1);
      expect($rootScope.$$watchersCount).toBe(2);
    }));

    describe('constants cleanup', function() {
      it('should remove $watch of constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watch('[]', function() {});
        $rootScope.$watch('{}', function() {});
        $rootScope.$watch('1', function() {});
        $rootScope.$watch('"foo"', function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watchCollection of constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watchCollection('[]', function() {});
        $rootScope.$watchCollection('{}', function() {});
        $rootScope.$watchCollection('1', function() {});
        $rootScope.$watchCollection('"foo"', function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watchGroup of constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watchGroup(['[]', '{}', '1', '"foo"'], function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watch of filtered constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watch('[1] | filter:"x"', function() {});
        $rootScope.$watch('1 | number:2', function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watchCollection of filtered constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watchCollection('[1] | filter:"x"', function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watchGroup of filtered constant literals after initial digest', inject(function($rootScope) {
        $rootScope.$watchGroup(['[1] | filter:"x"', '1 | number:2'], function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should remove $watch of constant expressions after initial digest', inject(function($rootScope) {
        $rootScope.$watch('1 + 1', function() {});
        $rootScope.$watch('"a" + "b"', function() {});
        $rootScope.$watch('"ab".length', function() {});
        $rootScope.$watch('[].length', function() {});
        $rootScope.$watch('(1 + 1) | number:2', function() {});
        expect($rootScope.$$watchers.length).not.toEqual(0);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toEqual(0);
      }));
    });

    describe('onetime cleanup', function() {
      it('should clean up stable watches on the watch queue', inject(function($rootScope) {
        $rootScope.$watch('::foo', function() {});
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.foo = 'foo';
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should clean up stable watches from $watchCollection', inject(function($rootScope) {
        $rootScope.$watchCollection('::foo', function() {});
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.foo = [];
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should clean up stable watches from $watchCollection literals', inject(function($rootScope) {
        $rootScope.$watchCollection('::[foo, bar]', function() {});
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.foo = 1;
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.foo = 2;
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.bar = 3;
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(0);
      }));

      it('should clean up stable watches from $watchGroup', inject(function($rootScope) {
        $rootScope.$watchGroup(['::foo', '::bar'], function() {});
        expect($rootScope.$$watchers.length).toEqual(2);

        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(2);

        $rootScope.foo = 'foo';
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(1);

        $rootScope.bar = 'bar';
        $rootScope.$digest();
        expect($rootScope.$$watchers.length).toEqual(0);
      }));
    });

    it('should delegate exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });
      inject(function($rootScope, $exceptionHandler, $log) {
        $rootScope.$watch('a', function() {throw new Error('abc');});
        $rootScope.a = 1;
        $rootScope.$digest();
        expect($exceptionHandler.errors[0].message).toEqual('abc');
        $log.assertEmpty();
      });
    });


    it('should fire watches in order of addition', inject(function($rootScope) {
      // this is not an external guarantee, just our own sanity
      var log = '';
      $rootScope.$watch('a', function() { log += 'a'; });
      $rootScope.$watch('b', function() { log += 'b'; });
      // constant expressions have slightly different handling,
      // let's ensure they are kept in the same list as others
      $rootScope.$watch('1', function() { log += '1'; });
      $rootScope.$watch('c', function() { log += 'c'; });
      $rootScope.$watch('2', function() { log += '2'; });
      $rootScope.a = $rootScope.b = $rootScope.c = 1;
      $rootScope.$digest();
      expect(log).toEqual('ab1c2');
    }));


    it('should call child $watchers in addition order', inject(function($rootScope) {
      // this is not an external guarantee, just our own sanity
      var log = '';
      var childA = $rootScope.$new();
      var childB = $rootScope.$new();
      var childC = $rootScope.$new();
      childA.$watch('a', function() { log += 'a'; });
      childB.$watch('b', function() { log += 'b'; });
      childC.$watch('c', function() { log += 'c'; });
      childA.a = childB.b = childC.c = 1;
      $rootScope.$digest();
      expect(log).toEqual('abc');
    }));


    it('should allow $digest on a child scope with and without a right sibling', inject(
        function($rootScope) {
      // tests a traversal edge case which we originally missed
      var log = '',
          childA = $rootScope.$new(),
          childB = $rootScope.$new();

      $rootScope.$watch(function() { log += 'r'; });
      childA.$watch(function() { log += 'a'; });
      childB.$watch(function() { log += 'b'; });

      // init
      $rootScope.$digest();
      expect(log).toBe('rabrab');

      log = '';
      childA.$digest();
      expect(log).toBe('a');

      log = '';
      childB.$digest();
      expect(log).toBe('b');
    }));


    it('should repeat watch cycle while model changes are identified', inject(function($rootScope) {
      var log = '';
      $rootScope.$watch('c', function(v) {$rootScope.d = v; log += 'c'; });
      $rootScope.$watch('b', function(v) {$rootScope.c = v; log += 'b'; });
      $rootScope.$watch('a', function(v) {$rootScope.b = v; log += 'a'; });
      $rootScope.$digest();
      log = '';
      $rootScope.a = 1;
      $rootScope.$digest();
      expect($rootScope.b).toEqual(1);
      expect($rootScope.c).toEqual(1);
      expect($rootScope.d).toEqual(1);
      expect(log).toEqual('abc');
    }));


    it('should repeat watch cycle from the root element', inject(function($rootScope) {
      var log = '';
      var child = $rootScope.$new();
      $rootScope.$watch(function() { log += 'a'; });
      child.$watch(function() { log += 'b'; });
      $rootScope.$digest();
      expect(log).toEqual('abab');
    }));


    it('should prevent infinite recursion and print watcher expression',function() {
      module(function($rootScopeProvider) {
        $rootScopeProvider.digestTtl(100);
      });
      inject(function($rootScope) {
        $rootScope.$watch('a', function() {$rootScope.b++;});
        $rootScope.$watch('b', function() {$rootScope.a++;});
        $rootScope.a = $rootScope.b = 0;

        expect(function() {
          $rootScope.$digest();
        }).toThrowMinErr('$rootScope', 'infdig', '100 $digest() iterations reached. Aborting!\n' +
            'Watchers fired in the last 5 iterations: ' +
            '[[{"msg":"a","newVal":96,"oldVal":95},{"msg":"b","newVal":97,"oldVal":96}],' +
            '[{"msg":"a","newVal":97,"oldVal":96},{"msg":"b","newVal":98,"oldVal":97}],' +
            '[{"msg":"a","newVal":98,"oldVal":97},{"msg":"b","newVal":99,"oldVal":98}],' +
            '[{"msg":"a","newVal":99,"oldVal":98},{"msg":"b","newVal":100,"oldVal":99}],' +
            '[{"msg":"a","newVal":100,"oldVal":99},{"msg":"b","newVal":101,"oldVal":100}]]');

        expect($rootScope.$$phase).toBeNull();
      });
    });


    it('should prevent infinite recursion and print watcher function name or body',
        inject(function($rootScope) {
      $rootScope.$watch(function watcherA() {return $rootScope.a;}, function() {$rootScope.b++;});
      $rootScope.$watch(function() {return $rootScope.b;}, function() {$rootScope.a++;});
      $rootScope.a = $rootScope.b = 0;

      try {
        $rootScope.$digest();
        throw new Error('Should have thrown exception');
      } catch (e) {
        expect(e.message.match(/"fn: (watcherA|function)/g).length).toBe(10);
      }
    }));


    it('should prevent infinite loop when creating and resolving a promise in a watched expression', function() {
      module(function($rootScopeProvider) {
        $rootScopeProvider.digestTtl(10);
      });
      inject(function($rootScope, $q) {
        var d = $q.defer();

        d.resolve('Hello, world.');
        $rootScope.$watch(function() {
          var $d2 = $q.defer();
          $d2.resolve('Goodbye.');
          $d2.promise.then(function() { });
          return d.promise;
        }, function() { return 0; });

        expect(function() {
          $rootScope.$digest();
        }).toThrowMinErr('$rootScope', 'infdig', '10 $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: []');

        expect($rootScope.$$phase).toBeNull();
      });
    });


    it('should not fire upon $watch registration on initial $digest', inject(function($rootScope) {
      var log = '';
      $rootScope.a = 1;
      $rootScope.$watch('a', function() { log += 'a'; });
      $rootScope.$watch('b', function() { log += 'b'; });
      $rootScope.$digest();
      log = '';
      $rootScope.$digest();
      expect(log).toEqual('');
    }));


    it('should watch objects', inject(function($rootScope) {
      var log = '';
      $rootScope.a = [];
      $rootScope.b = {};
      $rootScope.$watch('a', function(value) {
        log += '.';
        expect(value).toBe($rootScope.a);
      }, true);
      $rootScope.$watch('b', function(value) {
        log += '!';
        expect(value).toBe($rootScope.b);
      }, true);
      $rootScope.$digest();
      log = '';

      $rootScope.a.push({});
      $rootScope.b.name = '';

      $rootScope.$digest();
      expect(log).toEqual('.!');
    }));


    it('should watch functions', function() {
      module(provideLog);
      inject(function($rootScope, log) {
        $rootScope.fn = function() {return 'a';};
        $rootScope.$watch('fn', function(fn) {
          log(fn());
        });
        $rootScope.$digest();
        expect(log).toEqual('a');
        $rootScope.fn = function() {return 'b';};
        $rootScope.$digest();
        expect(log).toEqual('a; b');
      });
    });


    it('should prevent $digest recursion', inject(function($rootScope) {
      var callCount = 0;
      $rootScope.$watch('name', function() {
        expect(function() {
          $rootScope.$digest();
        }).toThrowMinErr('$rootScope', 'inprog', '$digest already in progress');
        callCount++;
      });
      $rootScope.name = 'a';
      $rootScope.$digest();
      expect(callCount).toEqual(1);
    }));


    it('should allow a watch to be added while in a digest', inject(function($rootScope) {
      var watch1 = jasmine.createSpy('watch1'),
          watch2 = jasmine.createSpy('watch2');
      $rootScope.$watch('foo', function() {
        $rootScope.$watch('foo', watch1);
        $rootScope.$watch('foo', watch2);
      });
      $rootScope.$apply('foo = true');
      expect(watch1).toHaveBeenCalled();
      expect(watch2).toHaveBeenCalled();
    }));


    it('should not skip watchers when adding new watchers during digest',
      inject(function($rootScope) {
        var log = [];

        var watchFn1 = function() { log.push(1); };
        var watchFn2 = function() { log.push(2); };
        var watchFn3 = function() { log.push(3); };
        var addWatcherOnce = function(newValue, oldValue) {
          if (newValue === oldValue) {
            $rootScope.$watch(watchFn3);
          }
        };

        $rootScope.$watch(watchFn1, addWatcherOnce);
        $rootScope.$watch(watchFn2);

        $rootScope.$digest();

        expect(log).toEqual([1, 2, 3, 1, 2, 3]);
      })
    );


    it('should not run the current watcher twice when removing a watcher during digest',
      inject(function($rootScope) {
        var log = [];
        var removeWatcher3;

        var watchFn3 = function() { log.push(3); };
        var watchFn2 = function() { log.push(2); };
        var watchFn1 = function() { log.push(1); };
        var removeWatcherOnce = function(newValue, oldValue) {
          if (newValue === oldValue) {
            removeWatcher3();
          }
        };

        $rootScope.$watch(watchFn1, removeWatcherOnce);
        $rootScope.$watch(watchFn2);
        removeWatcher3 = $rootScope.$watch(watchFn3);

        $rootScope.$digest();

        expect(log).toEqual([1, 2, 1, 2]);
      })
    );


    it('should not skip watchers when removing itself during digest',
      inject(function($rootScope) {
        var log = [];
        var removeWatcher1;

        var watchFn3 = function() { log.push(3); };
        var watchFn2 = function() { log.push(2); };
        var watchFn1 = function() { log.push(1); };
        var removeItself = function() {
          removeWatcher1();
        };

        removeWatcher1 = $rootScope.$watch(watchFn1, removeItself);
        $rootScope.$watch(watchFn2);
        $rootScope.$watch(watchFn3);

        $rootScope.$digest();

        expect(log).toEqual([1, 2, 3, 2, 3]);
      })
    );


    it('should not infinitely digest when current value is NaN', inject(function($rootScope) {
      $rootScope.$watch(function() { return NaN;});

      expect(function() {
        $rootScope.$digest();
      }).not.toThrow();
    }));


    it('should always call the watcher with newVal and oldVal equal on the first run',
        inject(function($rootScope) {
      var log = [];
      function logger(scope, newVal, oldVal) {
        var val = (newVal === oldVal || (newVal !== oldVal && oldVal !== newVal)) ? newVal : 'xxx';
        log.push(val);
      }

      $rootScope.$watch(function() { return NaN;}, logger);
      $rootScope.$watch(function() { return undefined;}, logger);
      $rootScope.$watch(function() { return '';}, logger);
      $rootScope.$watch(function() { return false;}, logger);
      $rootScope.$watch(function() { return {};}, logger, true);
      $rootScope.$watch(function() { return 23;}, logger);

      $rootScope.$digest();
      expect(isNaN(log.shift())).toBe(true); //jasmine's toBe and toEqual don't work well with NaNs
      expect(log).toEqual([undefined, '', false, {}, 23]);
      log = [];
      $rootScope.$digest();
      expect(log).toEqual([]);
    }));


    describe('$watch deregistration', function() {

      it('should return a function that allows listeners to be deregistered', inject(
          function($rootScope) {
        var listener = jasmine.createSpy('watch listener'),
            listenerRemove;

        listenerRemove = $rootScope.$watch('foo', listener);
        $rootScope.$digest(); //init
        expect(listener).toHaveBeenCalled();
        expect(listenerRemove).toBeDefined();

        listener.calls.reset();
        $rootScope.foo = 'bar';
        $rootScope.$digest(); //trigger
        expect(listener).toHaveBeenCalledOnce();

        listener.calls.reset();
        $rootScope.foo = 'baz';
        listenerRemove();
        $rootScope.$digest(); //trigger
        expect(listener).not.toHaveBeenCalled();
      }));


      it('should allow a watch to be deregistered while in a digest', inject(function($rootScope) {
        var remove1, remove2;
        $rootScope.$watch('remove', function() {
          remove1();
          remove2();
        });
        remove1 = $rootScope.$watch('thing', function() {});
        remove2 = $rootScope.$watch('thing', function() {});
        expect(function() {
          $rootScope.$apply('remove = true');
        }).not.toThrow();
      }));


      it('should not mess up the digest loop if deregistration happens during digest', inject(
          function($rootScope, log) {

        // we are testing this due to regression #5525 which is related to how the digest loops lastDirtyWatch
        // short-circuiting optimization works

        // scenario: watch1 deregistering watch1
        var scope = $rootScope.$new();
        var deregWatch1 = scope.$watch(log.fn('watch1'), function() { deregWatch1(); log('watchAction1'); });
        scope.$watch(log.fn('watch2'), log.fn('watchAction2'));
        scope.$watch(log.fn('watch3'), log.fn('watchAction3'));

        $rootScope.$digest();

        expect(log).toEqual(['watch1', 'watchAction1', 'watch2', 'watchAction2', 'watch3', 'watchAction3',
                             'watch2', 'watch3']);
        scope.$destroy();
        log.reset();


        // scenario: watch1 deregistering watch2
        scope = $rootScope.$new();
        scope.$watch(log.fn('watch1'), function() { deregWatch2(); log('watchAction1'); });
        var deregWatch2 = scope.$watch(log.fn('watch2'), log.fn('watchAction2'));
        scope.$watch(log.fn('watch3'), log.fn('watchAction3'));

        $rootScope.$digest();

        expect(log).toEqual(['watch1', 'watchAction1', 'watch3', 'watchAction3',
                             'watch1', 'watch3']);
        scope.$destroy();
        log.reset();


        // scenario: watch2 deregistering watch1
        scope = $rootScope.$new();
        deregWatch1 = scope.$watch(log.fn('watch1'), log.fn('watchAction1'));
        scope.$watch(log.fn('watch2'), function() { deregWatch1(); log('watchAction2'); });
        scope.$watch(log.fn('watch3'), log.fn('watchAction3'));

        $rootScope.$digest();

        expect(log).toEqual(['watch1', 'watchAction1', 'watch2', 'watchAction2', 'watch3', 'watchAction3',
                             'watch2', 'watch3']);
      }));
    });

    describe('$watchCollection', function() {
      describe('variable', function() {
        var log, $rootScope, deregister;

        beforeEach(inject(function(_$rootScope_, _log_) {
          $rootScope = _$rootScope_;
          log = _log_;
          deregister = $rootScope.$watchCollection('obj', function logger(newVal, oldVal) {
            var msg = {newVal: newVal, oldVal: oldVal};

            if (newVal === oldVal) {
              msg.identical = true;
            }

            log(msg);
          });
        }));


        it('should not trigger if nothing change', function() {
          $rootScope.$digest();
          expect(log).toEqual([{ newVal: undefined, oldVal: undefined, identical: true }]);
          log.reset();

          $rootScope.$digest();
          expect(log).toEqual([]);
        });


        it('should allow deregistration', function() {
          $rootScope.obj = [];
          $rootScope.$digest();
          expect(log.toArray().length).toBe(1);
          log.reset();

          $rootScope.obj.push('a');
          deregister();

          $rootScope.$digest();
          expect(log).toEqual([]);
        });


        describe('array', function() {

          it('should return oldCollection === newCollection only on the first listener call',
              inject(function($rootScope, log) {

            // first time should be identical
            $rootScope.obj = ['a', 'b'];
            $rootScope.$digest();
            expect(log).toEqual([{newVal: ['a', 'b'], oldVal: ['a', 'b'], identical: true}]);
            log.reset();

            // second time should be different
            $rootScope.obj[1] = 'c';
            $rootScope.$digest();
            expect(log).toEqual([{newVal: ['a', 'c'], oldVal: ['a', 'b']}]);
          }));


          it('should trigger when property changes into array', function() {
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: 'test', oldVal: 'test', identical: true}]);

            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [], oldVal: 'test'}]);

            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {}, oldVal: []}]);

            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [], oldVal: {}}]);

            $rootScope.obj = undefined;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: undefined, oldVal: []}]);
          });


          it('should not trigger change when object in collection changes', function() {
            $rootScope.obj = [{}];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [{}], oldVal: [{}], identical: true}]);

            $rootScope.obj[0].name = 'foo';
            $rootScope.$digest();
            expect(log).toEqual([]);
          });


          it('should watch array properties', function() {
            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [], oldVal: [], identical: true}]);

            $rootScope.obj.push('a');
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: ['a'], oldVal: []}]);

            $rootScope.obj[0] = 'b';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: ['b'], oldVal: ['a']}]);

            $rootScope.obj.push([]);
            $rootScope.obj.push({});
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: ['b', [], {}], oldVal: ['b']}]);

            var temp = $rootScope.obj[1];
            $rootScope.obj[1] = $rootScope.obj[2];
            $rootScope.obj[2] = temp;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: ['b', {}, []], oldVal: ['b', [], {}]}]);

            $rootScope.obj.shift();
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [{}, []], oldVal: ['b', {}, []]}]);
          });

          it('should not infinitely digest when current value is NaN', function() {
            $rootScope.obj = [NaN];
            expect(function() {
              $rootScope.$digest();
            }).not.toThrow();
          });

          it('should watch array-like objects like arrays', function() {
            window.document.body.innerHTML = '<p>' +
                                              '<a name=\'x\'>a</a>' +
                                              '<a name=\'y\'>b</a>' +
                                            '</p>';

            $rootScope.obj = window.document.getElementsByTagName('a');
            $rootScope.$digest();

            var arrayLikelog = [];
            forEach(log.empty()[0].newVal, function(element) {
              arrayLikelog.push(element.name);
            });
            expect(arrayLikelog).toEqual(['x', 'y']);
          });
        });


        describe('object', function() {

          it('should return oldCollection === newCollection only on the first listener call', function() {

            $rootScope.obj = {'a': 'b'};
            // first time should be identical
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': 'b'}, oldVal: {'a': 'b'}, identical: true}]);

            // second time not identical
            $rootScope.obj.a = 'c';
            $rootScope.$digest();
            expect(log).toEqual([{newVal: {'a': 'c'}, oldVal: {'a': 'b'}}]);
          });


          it('should trigger when property changes into object', function() {
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: 'test', oldVal: 'test', identical: true}]);

            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {}, oldVal: 'test'}]);
          });


          it('should not trigger change when object in collection changes', function() {
            $rootScope.obj = {name: {}};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {name: {}}, oldVal: {name: {}}, identical: true}]);

            $rootScope.obj.name.bar = 'foo';
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);
          });


          it('should watch object properties', function() {
            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {}, oldVal: {}, identical: true}]);

            $rootScope.obj.a = 'A';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: 'A'}, oldVal: {}}]);

            $rootScope.obj.a = 'B';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: 'B'}, oldVal: {a: 'A'}}]);

            $rootScope.obj.b = [];
            $rootScope.obj.c = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: 'B', b: [], c: {}}, oldVal: {a: 'B'}}]);

            var temp = $rootScope.obj.a;
            $rootScope.obj.a = $rootScope.obj.b;
            $rootScope.obj.c = temp;
            $rootScope.$digest();
            expect(log.empty()).
                toEqual([{newVal: {a: [], b: [], c: 'B'}, oldVal: {a: 'B', b: [], c: {}}}]);

            delete $rootScope.obj.a;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {b: [], c: 'B'}, oldVal: {a: [], b: [], c: 'B'}}]);
          });


          it('should not infinitely digest when current value is NaN', function() {
            $rootScope.obj = {a: NaN};
            expect(function() {
              $rootScope.$digest();
            }).not.toThrow();
          });


          it('should handle objects created using `Object.create(null)`', function() {
            $rootScope.obj = Object.create(null);
            $rootScope.obj.a = 'a';
            $rootScope.obj.b = 'b';
            $rootScope.$digest();
            expect(log.empty()[0].newVal).toEqual(extend(Object.create(null), {a: 'a', b: 'b'}));

            delete $rootScope.obj.b;
            $rootScope.$digest();
            expect(log.empty()[0].newVal).toEqual(extend(Object.create(null), {a: 'a'}));
          });
        });
      });

      describe('literal', function() {
        describe('array', function() {
          var log, $rootScope;

          beforeEach(inject(function(_$rootScope_, _log_) {
            $rootScope = _$rootScope_;
            log = _log_;
            $rootScope.$watchCollection('[obj]', function logger(newVal, oldVal) {
              var msg = {newVal: newVal, oldVal: oldVal};

              if (newVal === oldVal) {
                msg.identical = true;
              }

              log(msg);
            });
          }));


          it('should return oldCollection === newCollection only on the first listener call', function() {

            // first time should be identical
            $rootScope.obj = 'a';
            $rootScope.$digest();
            expect(log).toEqual([{newVal: ['a'], oldVal: ['a'], identical: true}]);
            log.reset();

            // second time should be different
            $rootScope.obj = 'b';
            $rootScope.$digest();
            expect(log).toEqual([{newVal: ['b'], oldVal: ['a']}]);
          });


          it('should trigger when property changes into array', function() {
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: ['test'], oldVal: ['test'], identical: true}]);

            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [[]], oldVal: ['test']}]);

            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [{}], oldVal: [[]]}]);

            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [[]], oldVal: [{}]}]);

            $rootScope.obj = undefined;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [undefined], oldVal: [[]]}]);
          });


          it('should not trigger change when object in collection changes', function() {
            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: [{}], oldVal: [{}], identical: true}]);

            $rootScope.obj.name = 'foo';
            $rootScope.$digest();
            expect(log).toEqual([]);
          });


          it('should not infinitely digest when current value is NaN', function() {
            $rootScope.obj = NaN;
            expect(function() {
              $rootScope.$digest();
            }).not.toThrow();
          });
        });


        describe('object', function() {
          var log, $rootScope;

          beforeEach(inject(function(_$rootScope_, _log_) {
            $rootScope = _$rootScope_;
            log = _log_;
            $rootScope.$watchCollection('{a: obj}', function logger(newVal, oldVal) {
              var msg = {newVal: newVal, oldVal: oldVal};

              if (newVal === oldVal) {
                msg.identical = true;
              }

              log(msg);
            });
          }));

          it('should return oldCollection === newCollection only on the first listener call', function() {

            $rootScope.obj = 'b';
            // first time should be identical
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': 'b'}, oldVal: {'a': 'b'}, identical: true}]);

            // second time not identical
            $rootScope.obj = 'c';
            $rootScope.$digest();
            expect(log).toEqual([{newVal: {'a': 'c'}, oldVal: {'a': 'b'}}]);
          });


          it('should trigger when property changes into object', function() {
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': 'test'}, oldVal: {'a': 'test'}, identical: true}]);

            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': {}}, oldVal: {'a': 'test'}}]);
          });


          it('should not trigger change when object in collection changes', function() {
            $rootScope.obj = {name: 'foo'};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': {name: 'foo'}}, oldVal: {'a': {name: 'foo'}}, identical: true}]);

            $rootScope.obj.name = 'bar';
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);
          });


          it('should watch object properties', function() {
            $rootScope.obj = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': {}}, oldVal: {'a': {}}, identical: true}]);

            $rootScope.obj = 'A';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': 'A'}, oldVal: {'a': {}}}]);

            $rootScope.obj = 'B';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: 'B'}, oldVal: {a: 'A'}}]);

            $rootScope.obj = [];
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: []}, oldVal: {a: 'B'}}]);

            delete $rootScope.obj;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {a: undefined}, oldVal: {a: []}}]);
          });


          it('should not infinitely digest when current value is NaN', function() {
            $rootScope.obj = NaN;
            expect(function() {
              $rootScope.$digest();
            }).not.toThrow();
          });
        });


        describe('object computed property', function() {
          var log, $rootScope;

          beforeEach(inject(function(_$rootScope_, _log_) {
            $rootScope = _$rootScope_;
            log = _log_;
            $rootScope.$watchCollection('{[key]: obj}', function logger(newVal, oldVal) {
              var msg = {newVal: newVal, oldVal: oldVal};

              if (newVal === oldVal) {
                msg.identical = true;
              }

              log(msg);
            });
          }));


          it('should default to "undefined" key', function() {
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'undefined': 'test'}, oldVal: {'undefined': 'test'}, identical: true}]);
          });


          it('should trigger when key changes', function() {
            $rootScope.key = 'a';
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': 'test'}, oldVal: {'a': 'test'}, identical: true}]);

            $rootScope.key = 'b';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'b': 'test'}, oldVal: {'a': 'test'}}]);

            $rootScope.key = true;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'true': 'test'}, oldVal: {'b': 'test'}}]);
          });


          it('should not trigger when key changes but stringified key does not', function() {
            $rootScope.key = 1;
            $rootScope.obj = 'test';
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'1': 'test'}, oldVal: {'1': 'test'}, identical: true}]);

            $rootScope.key = '1';
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);

            $rootScope.key = true;
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'true': 'test'}, oldVal: {'1': 'test'}}]);

            $rootScope.key = 'true';
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);

            $rootScope.key = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'[object Object]': 'test'}, oldVal: {'true': 'test'}}]);

            $rootScope.key = {};
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);
          });


          it('should not trigger change when object in collection changes', function() {
            $rootScope.key = 'a';
            $rootScope.obj = {name: 'foo'};
            $rootScope.$digest();
            expect(log.empty()).toEqual([{newVal: {'a': {name: 'foo'}}, oldVal: {'a': {name: 'foo'}}, identical: true}]);

            $rootScope.obj.name = 'bar';
            $rootScope.$digest();
            expect(log.empty()).toEqual([]);
          });


          it('should not infinitely digest when key value is NaN', function() {
            $rootScope.key = NaN;
            $rootScope.obj = NaN;
            expect(function() {
              $rootScope.$digest();
            }).not.toThrow();
          });
        });
      });
    });


    describe('$suspend/$resume/$isSuspended', function() {
      it('should suspend watchers on scope', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        $rootScope.$watch(watchSpy);
        $rootScope.$suspend();
        $rootScope.$digest();
        expect(watchSpy).not.toHaveBeenCalled();
      }));

      it('should resume watchers on scope', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        $rootScope.$watch(watchSpy);
        $rootScope.$suspend();
        $rootScope.$resume();
        $rootScope.$digest();
        expect(watchSpy).toHaveBeenCalled();
      }));

      it('should suspend watchers on child scope', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        var scope = $rootScope.$new(true);
        scope.$watch(watchSpy);
        $rootScope.$suspend();
        $rootScope.$digest();
        expect(watchSpy).not.toHaveBeenCalled();
      }));

      it('should resume watchers on child scope', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        var scope = $rootScope.$new(true);
        scope.$watch(watchSpy);
        $rootScope.$suspend();
        $rootScope.$resume();
        $rootScope.$digest();
        expect(watchSpy).toHaveBeenCalled();
      }));

      it('should resume digesting immediately if `$resume` is called from an ancestor scope watch handler', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        var scope = $rootScope.$new();

        // Setup a handler that will toggle the scope suspension
        $rootScope.$watch('a', function(a) { if (a) scope.$resume(); else scope.$suspend(); });

        // Spy on the scope watches being called
        scope.$watch(watchSpy);

        // Trigger a digest that should suspend the scope from within the watch handler
        $rootScope.$apply('a = false');
        // The scope is suspended before it gets to do a digest
        expect(watchSpy).not.toHaveBeenCalled();

        // Trigger a digest that should resume the scope from within the watch handler
        $rootScope.$apply('a = true');
        // The watch handler that resumes the scope is in the parent, so the resumed scope will digest immediately
        expect(watchSpy).toHaveBeenCalled();
      }));

      it('should resume digesting immediately if `$resume` is called from a non-ancestor scope watch handler', inject(function($rootScope) {
        var watchSpy = jasmine.createSpy('watchSpy');
        var scope = $rootScope.$new();
        var sibling = $rootScope.$new();

        // Setup a handler that will toggle the scope suspension
        sibling.$watch('a', function(a) { if (a) scope.$resume(); else scope.$suspend(); });

        // Spy on the scope watches being called
        scope.$watch(watchSpy);

        // Trigger a digest that should suspend the scope from within the watch handler
        $rootScope.$apply('a = false');
        // The scope is suspended by the sibling handler after the scope has already digested
        expect(watchSpy).toHaveBeenCalled();
        watchSpy.calls.reset();

        // Trigger a digest that should resume the scope from within the watch handler
        $rootScope.$apply('a = true');
        // The watch handler that resumes the scope marks the digest as dirty, so it will run an extra digest
        expect(watchSpy).toHaveBeenCalled();
      }));

      it('should not suspend watchers on parent or sibling scopes', inject(function($rootScope) {
        var watchSpyParent = jasmine.createSpy('watchSpyParent');
        var watchSpyChild = jasmine.createSpy('watchSpyChild');
        var watchSpySibling = jasmine.createSpy('watchSpySibling');

        var parent = $rootScope.$new();
        parent.$watch(watchSpyParent);
        var child = parent.$new();
        child.$watch(watchSpyChild);
        var sibling = parent.$new();
        sibling.$watch(watchSpySibling);

        child.$suspend();
        $rootScope.$digest();
        expect(watchSpyParent).toHaveBeenCalled();
        expect(watchSpyChild).not.toHaveBeenCalled();
        expect(watchSpySibling).toHaveBeenCalled();
      }));

      it('should return true from `$isSuspended()` when a scope is suspended', inject(function($rootScope) {
        $rootScope.$suspend();
        expect($rootScope.$isSuspended()).toBe(true);
        $rootScope.$resume();
        expect($rootScope.$isSuspended()).toBe(false);
      }));

      it('should return false from `$isSuspended()` for a non-suspended scope that has a suspended ancestor', inject(function($rootScope) {
        var childScope = $rootScope.$new();
        $rootScope.$suspend();
        expect(childScope.$isSuspended()).toBe(false);
        childScope.$suspend();
        expect(childScope.$isSuspended()).toBe(true);
        childScope.$resume();
        expect(childScope.$isSuspended()).toBe(false);
        $rootScope.$resume();
        expect(childScope.$isSuspended()).toBe(false);
      }));
    });


    describe('optimizations', function() {

      function setupWatches(scope, log) {
        scope.$watch(function() { log('w1'); return scope.w1; }, log.fn('w1action'));
        scope.$watch(function() { log('w2'); return scope.w2; }, log.fn('w2action'));
        scope.$watch(function() { log('w3'); return scope.w3; }, log.fn('w3action'));
        scope.$digest();
        log.reset();
      }


      it('should check watches only once during an empty digest', inject(function(log, $rootScope) {
        setupWatches($rootScope, log);
        $rootScope.$digest();
        expect(log).toEqual(['w1', 'w2', 'w3']);
      }));


      it('should quit digest early after we check the last watch that was previously dirty',
          inject(function(log, $rootScope) {
        setupWatches($rootScope, log);
        $rootScope.w1 = 'x';
        $rootScope.$digest();
        expect(log).toEqual(['w1', 'w1action', 'w2', 'w3', 'w1']);
      }));


      it('should not quit digest early if a new watch was added from an existing watch action',
          inject(function(log, $rootScope) {
        setupWatches($rootScope, log);
        $rootScope.$watch(log.fn('w4'), function() {
          log('w4action');
          $rootScope.$watch(log.fn('w5'), log.fn('w5action'));
        });
        $rootScope.$digest();
        expect(log).toEqual(['w1', 'w2', 'w3', 'w4', 'w4action', 'w5', 'w5action',
                             'w1', 'w2', 'w3', 'w4', 'w5']);
      }));


      it('should not quit digest early if an evalAsync task was scheduled from a watch action',
          inject(function(log, $rootScope) {
        setupWatches($rootScope, log);
        $rootScope.$watch(log.fn('w4'), function() {
          log('w4action');
          $rootScope.$evalAsync(function() {
            log('evalAsync');
          });
        });
        $rootScope.$digest();
        expect(log).toEqual(['w1', 'w2', 'w3', 'w4', 'w4action', 'evalAsync',
                             'w1', 'w2', 'w3', 'w4']);
      }));


      it('should quit digest early but not too early when various watches fire', inject(function(log, $rootScope) {
        setupWatches($rootScope, log);
        $rootScope.$watch(function() { log('w4'); return $rootScope.w4; }, function(newVal) {
          log('w4action');
          $rootScope.w2 = newVal;
        });

        $rootScope.$digest();
        log.reset();

        $rootScope.w1 = 'x';
        $rootScope.w4 = 'x';
        $rootScope.$digest();
        expect(log).toEqual(['w1', 'w1action', 'w2', 'w3', 'w4', 'w4action',
                             'w1', 'w2', 'w2action', 'w3', 'w4',
                             'w1', 'w2']);
      }));
    });
  });

  describe('$watchGroup', function() {
    var scope;
    var log;

    beforeEach(inject(function($rootScope, _log_) {
      scope = $rootScope.$new();
      log = _log_;
    }));


    it('should pass same group instance on first call (no expressions)', function() {
      var newValues;
      var oldValues;
      scope.$watchGroup([], function(n, o) {
        newValues = n;
        oldValues = o;
      });

      scope.$apply();
      expect(newValues).toBe(oldValues);
    });


    it('should pass same group instance on first call (single expression)', function() {
      var newValues;
      var oldValues;
      scope.$watchGroup(['a'], function(n, o) {
        newValues = n;
        oldValues = o;
      });

      scope.$apply();
      expect(newValues).toBe(oldValues);

      scope.$apply('a = 1');
      expect(newValues).not.toBe(oldValues);
    });

    it('should pass same group instance on first call (multiple expressions)', function() {
      var newValues;
      var oldValues;
      scope.$watchGroup(['a', 'b'], function(n, o) {
        newValues = n;
        oldValues = o;
      });

      scope.$apply();
      expect(newValues).toBe(oldValues);

      scope.$apply('a = 1');
      expect(newValues).not.toBe(oldValues);
    });

    it('should detect a change to any one expression in the group', function() {
      scope.$watchGroup(['a', 'b'], function(values, oldValues, s) {
        expect(s).toBe(scope);
        log(oldValues + ' >>> ' + values);
      });

      scope.a = 'foo';
      scope.b = 'bar';
      scope.$digest();
      expect(log).toEqual('foo,bar >>> foo,bar');

      log.reset();
      scope.$digest();
      expect(log).toEqual('');

      scope.a = 'a';
      scope.$digest();
      expect(log).toEqual('foo,bar >>> a,bar');

      log.reset();
      scope.a = 'A';
      scope.b = 'B';
      scope.$digest();
      expect(log).toEqual('a,bar >>> A,B');
    });


    it('should work for a group with just a single expression', function() {
      scope.$watchGroup(['a'], function(values, oldValues, s) {
        expect(s).toBe(scope);
        log(oldValues + ' >>> ' + values);
      });

      scope.a = 'foo';
      scope.$digest();
      expect(log).toEqual('foo >>> foo');

      log.reset();
      scope.$digest();
      expect(log).toEqual('');

      scope.a = 'bar';
      scope.$digest();
      expect(log).toEqual('foo >>> bar');
    });


    it('should call the listener once when the array of watchExpressions is empty', function() {
      scope.$watchGroup([], function(values, oldValues) {
        log(oldValues + ' >>> ' + values);
      });

      expect(log).toEqual('');
      scope.$digest();
      expect(log).toEqual(' >>> ');

      log.reset();
      scope.$digest();
      expect(log).toEqual('');
    });


    it('should not call watch action fn when watchGroup was deregistered', function() {
      var deregisterMany = scope.$watchGroup(['a', 'b'], function(values, oldValues) {
        log(oldValues + ' >>> ' + values);
      }), deregisterOne = scope.$watchGroup(['a'], function(values, oldValues) {
        log(oldValues + ' >>> ' + values);
      }), deregisterNone = scope.$watchGroup([], function(values, oldValues) {
        log(oldValues + ' >>> ' + values);
      });

      deregisterMany();
      deregisterOne();
      deregisterNone();
      scope.a = 'xxx';
      scope.b = 'yyy';
      scope.$digest();
      expect(log).toEqual('');
    });

    it('should have each individual old value equal to new values of previous watcher invocation', function() {
      var newValues;
      var oldValues;
      scope.$watchGroup(['a', 'b'], function(n, o) {
        newValues = n.slice();
        oldValues = o.slice();
      });

      scope.$apply(); //skip the initial invocation

      scope.$apply('a = 1');
      expect(newValues).toEqual([1, undefined]);
      expect(oldValues).toEqual([undefined, undefined]);

      scope.$apply('a = 2');
      expect(newValues).toEqual([2, undefined]);
      expect(oldValues).toEqual([1, undefined]);

      scope.$apply('b = 3');
      expect(newValues).toEqual([2, 3]);
      expect(oldValues).toEqual([2, undefined]);

      scope.$apply('a = b = 4');
      expect(newValues).toEqual([4, 4]);
      expect(oldValues).toEqual([2, 3]);

      scope.$apply('a = 5');
      expect(newValues).toEqual([5, 4]);
      expect(oldValues).toEqual([4, 4]);

      scope.$apply('b = 6');
      expect(newValues).toEqual([5, 6]);
      expect(oldValues).toEqual([5, 4]);
    });


    it('should have each individual old value equal to new values of previous watcher invocation, with modifications from other watchers', function() {
      scope.$watch('a', function() { scope.b++; });
      scope.$watch('b', function() { scope.c++; });

      var newValues;
      var oldValues;
      scope.$watchGroup(['a', 'b', 'c'], function(n, o) {
        newValues = n.slice();
        oldValues = o.slice();
      });

      scope.$apply(); //skip the initial invocation

      scope.$apply('a = b = c = 1');
      expect(newValues).toEqual([1, 2, 2]);
      expect(oldValues).toEqual([undefined, NaN, NaN]);

      scope.$apply('a = 3');
      expect(newValues).toEqual([3, 3, 3]);
      expect(oldValues).toEqual([1, 2, 2]);

      scope.$apply('b = 5');
      expect(newValues).toEqual([3, 5, 4]);
      expect(oldValues).toEqual([3, 3, 3]);

      scope.$apply('c = 7');
      expect(newValues).toEqual([3, 5, 7]);
      expect(oldValues).toEqual([3, 5, 4]);
    });

    it('should remove all watchers once one-time/constant bindings are stable', function() {
      //empty
      scope.$watchGroup([], noop);
      //single one-time
      scope.$watchGroup(['::a'], noop);
      //multi one-time
      scope.$watchGroup(['::a', '::b'], noop);
      //single constant
      scope.$watchGroup(['1'], noop);
      //multi constant
      scope.$watchGroup(['1', '2'], noop);
      //multi one-time/constant
      scope.$watchGroup(['::a', '1'], noop);

      expect(scope.$$watchersCount).not.toBe(0);
      scope.$apply('a = b = 1');
      expect(scope.$$watchersCount).toBe(0);
    });

    it('should maintain correct new/old values with one time bindings', function() {
      var newValues;
      var oldValues;
      scope.$watchGroup(['a', '::b', 'b', '4'], function(n, o) {
        newValues = n.slice();
        oldValues = o.slice();
      });

      scope.$apply();
      expect(newValues).toEqual(oldValues);
      expect(oldValues).toEqual([undefined, undefined, undefined, 4]);

      scope.$apply('a = 1');
      expect(newValues).toEqual([1, undefined, undefined, 4]);
      expect(oldValues).toEqual([undefined, undefined, undefined, 4]);

      scope.$apply('b = 2');
      expect(newValues).toEqual([1, 2, 2, 4]);
      expect(oldValues).toEqual([1, undefined, undefined, 4]);

      scope.$apply('b = 3');
      expect(newValues).toEqual([1, 2, 3, 4]);
      expect(oldValues).toEqual([1, 2, 2, 4]);

      scope.$apply('b = 4');
      expect(newValues).toEqual([1, 2, 4, 4]);
      expect(oldValues).toEqual([1, 2, 3, 4]);
    });
  });

  describe('$watchGroup with logging $exceptionHandler', function() {
    it('should maintain correct new/old values even when listener throws', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });

      inject(function($rootScope, $exceptionHandler) {
        var newValues;
        var oldValues;
        $rootScope.$watchGroup(['a', '::b', 'b', '4'], function(n, o) {
          newValues = n.slice();
          oldValues = o.slice();
          throw 'test';
        });

        $rootScope.$apply();
        expect(newValues).toEqual(oldValues);
        expect(oldValues).toEqual([undefined, undefined, undefined, 4]);
        expect($exceptionHandler.errors.length).toBe(1);

        $rootScope.$apply('a = 1');
        expect(newValues).toEqual([1, undefined, undefined, 4]);
        expect(oldValues).toEqual([undefined, undefined, undefined, 4]);
        expect($exceptionHandler.errors.length).toBe(2);

        $rootScope.$apply('b = 2');
        expect(newValues).toEqual([1, 2, 2, 4]);
        expect(oldValues).toEqual([1, undefined, undefined, 4]);
        expect($exceptionHandler.errors.length).toBe(3);

        $rootScope.$apply('b = 3');
        expect(newValues).toEqual([1, 2, 3, 4]);
        expect(oldValues).toEqual([1, 2, 2, 4]);
        expect($exceptionHandler.errors.length).toBe(4);

        $rootScope.$apply('b = 4');
        expect(newValues).toEqual([1, 2, 4, 4]);
        expect(oldValues).toEqual([1, 2, 3, 4]);
        expect($exceptionHandler.errors.length).toBe(5);
      });
    });
  });

  describe('$destroy', function() {
    var first = null, middle = null, last = null, log = null;

    beforeEach(inject(function($rootScope) {
      log = '';

      first = $rootScope.$new();
      middle = $rootScope.$new();
      last = $rootScope.$new();

      first.$watch(function() { log += '1';});
      middle.$watch(function() { log += '2';});
      last.$watch(function() { log += '3';});

      $rootScope.$digest();
      log = '';
    }));


    it('should broadcast $destroy on rootScope', inject(function($rootScope) {
      var spy = jasmine.createSpy('$destroy handler');
      $rootScope.$on('$destroy', spy);
      $rootScope.$destroy();
      expect(spy).toHaveBeenCalled();
      expect($rootScope.$$destroyed).toBe(true);
    }));


    it('should remove all listeners after $destroy of rootScope', inject(function($rootScope) {
      var spy = jasmine.createSpy('$destroy handler');
      $rootScope.$on('dummy', spy);
      $rootScope.$destroy();
      $rootScope.$broadcast('dummy');
      expect(spy).not.toHaveBeenCalled();
    }));


    it('should remove all watchers after $destroy of rootScope', inject(function($rootScope) {
      var spy = jasmine.createSpy('$watch spy');
      var digest = $rootScope.$digest;
      $rootScope.$watch(spy);
      $rootScope.$destroy();
      digest.call($rootScope);
      expect(spy).not.toHaveBeenCalled();
    }));


    it('should call $browser.$$applicationDestroyed when destroying rootScope', inject(function($rootScope, $browser) {
      spyOn($browser, '$$applicationDestroyed');
      $rootScope.$destroy();
      expect($browser.$$applicationDestroyed).toHaveBeenCalledOnce();
    }));


    it('should remove first', inject(function($rootScope) {
      first.$destroy();
      $rootScope.$digest();
      expect(log).toEqual('23');
    }));


    it('should remove middle', inject(function($rootScope) {
      middle.$destroy();
      $rootScope.$digest();
      expect(log).toEqual('13');
    }));


    it('should remove last', inject(function($rootScope) {
      last.$destroy();
      $rootScope.$digest();
      expect(log).toEqual('12');
    }));


    it('should broadcast the $destroy event', inject(function($rootScope, log) {
      first.$on('$destroy', log.fn('first'));
      first.$new().$on('$destroy', log.fn('first-child'));

      first.$destroy();
      expect(log).toEqual('first; first-child');
    }));


    it('should $destroy a scope only once and ignore any further destroy calls',
        inject(function($rootScope) {
      $rootScope.$digest();
      expect(log).toBe('123');

      first.$destroy();

      // once a scope is destroyed apply should not do anything any more
      first.$apply();
      expect(log).toBe('123');

      first.$destroy();
      first.$destroy();
      first.$apply();
      expect(log).toBe('123');
    }));

    it('should broadcast the $destroy only once', inject(function($rootScope, log) {
      var isolateScope = first.$new(true);
      isolateScope.$on('$destroy', log.fn('event'));
      first.$destroy();
      isolateScope.$destroy();
      expect(log).toEqual('event');
    }));

    it('should decrement ancestor $$listenerCount entries', inject(function($rootScope) {
      var EVENT = 'fooEvent',
          spy = jasmine.createSpy('listener'),
          firstSecond = first.$new();

      firstSecond.$on(EVENT, spy);
      firstSecond.$on(EVENT, spy);
      middle.$on(EVENT, spy);

      expect($rootScope.$$listenerCount[EVENT]).toBe(3);
      expect(first.$$listenerCount[EVENT]).toBe(2);

      firstSecond.$destroy();

      expect($rootScope.$$listenerCount[EVENT]).toBe(1);
      expect(first.$$listenerCount[EVENT]).toBeUndefined();

      $rootScope.$broadcast(EVENT);
      expect(spy).toHaveBeenCalledTimes(1);
    }));


    it('should do nothing when a child event listener is registered after parent\'s destruction',
        inject(function($rootScope) {
      var parent = $rootScope.$new(),
          child = parent.$new();

      parent.$destroy();
      var fn = child.$on('someEvent', function() {});
      expect(fn).toBe(noop);
    }));


    it('should do nothing when a child watch is registered after parent\'s destruction',
        inject(function($rootScope) {
      var parent = $rootScope.$new(),
          child = parent.$new();

      parent.$destroy();
      var fn = child.$watch('somePath', function() {});
      expect(fn).toBe(noop);
    }));

    it('should do nothing when $apply()ing after parent\'s destruction', inject(function($rootScope) {
      var parent = $rootScope.$new(),
          child = parent.$new();

      parent.$destroy();

      var called = false;
      function applyFunc() { called = true; }
      child.$apply(applyFunc);

      expect(called).toBe(false);
    }));

    it('should do nothing when $evalAsync()ing after parent\'s destruction', inject(function($rootScope, $timeout) {
      var parent = $rootScope.$new(),
          child = parent.$new();

      parent.$destroy();

      var called = false;
      function applyFunc() { called = true; }
      child.$evalAsync(applyFunc);

      $timeout.verifyNoPendingTasks();
      expect(called).toBe(false);
    }));


    it('should preserve all (own and inherited) model properties on a destroyed scope',
        inject(function($rootScope) {
      // This test simulates an async task (xhr response) interacting with the scope after the scope
      // was destroyed. Since we can't abort the request, we should ensure that the task doesn't
      // throw NPEs because the scope was cleaned up during destruction.

      var parent = $rootScope.$new(),
          child = parent.$new();

      parent.parentModel = 'parent';
      child.childModel = 'child';

      child.$destroy();

      expect(child.parentModel).toBe('parent');
      expect(child.childModel).toBe('child');
    }));


    // Support: IE 9 only
    if (msie === 9) {
      // See issue https://github.com/angular/angular.js/issues/10706
      it('should completely disconnect all child scopes on IE9', inject(function($rootScope) {
        var parent = $rootScope.$new(),
            child1 = parent.$new(),
            child2 = parent.$new(),
            grandChild1 = child1.$new(),
            grandChild2 = child1.$new();

        child1.$destroy();
        $rootScope.$digest();

        expect(isDisconnected(parent)).toBe(false);
        expect(isDisconnected(child1)).toBe(true);
        expect(isDisconnected(child2)).toBe(false);
        expect(isDisconnected(grandChild1)).toBe(true);
        expect(isDisconnected(grandChild2)).toBe(true);

        function isDisconnected($scope) {
          return $scope.$$nextSibling === null &&
                 $scope.$$prevSibling === null &&
                 $scope.$$childHead === null &&
                 $scope.$$childTail === null &&
                 $scope.$root === null &&
                 $scope.$$watchers === null;
        }
      }));
    }
  });


  describe('$eval', function() {
    it('should eval an expression', inject(function($rootScope) {
      expect($rootScope.$eval('a=1')).toEqual(1);
      expect($rootScope.a).toEqual(1);

      $rootScope.$eval(function(self) {self.b = 2;});
      expect($rootScope.b).toEqual(2);
    }));


    it('should allow passing locals to the expression', inject(function($rootScope) {
      expect($rootScope.$eval('a+1', {a: 2})).toBe(3);

      $rootScope.$eval(function(scope, locals) {
        scope.c = locals.b + 4;
      }, {b: 3});
      expect($rootScope.c).toBe(7);
    }));
  });


  describe('$evalAsync', function() {

    it('should run callback before $watch', inject(function($rootScope) {
      var log = '';
      var child = $rootScope.$new();
      $rootScope.$evalAsync(function(scope) { log += 'parent.async;'; });
      $rootScope.$watch('value', function() { log += 'parent.$digest;'; });
      child.$evalAsync(function(scope) { log += 'child.async;'; });
      child.$watch('value', function() { log += 'child.$digest;'; });
      $rootScope.$digest();
      expect(log).toEqual('parent.async;child.async;parent.$digest;child.$digest;');
    }));

    it('should not run another digest for an $$postDigest call', inject(function($rootScope) {
      var internalWatchCount = 0;
      var externalWatchCount = 0;

      $rootScope.internalCount = 0;
      $rootScope.externalCount = 0;

      $rootScope.$evalAsync(function(scope) {
        $rootScope.internalCount++;
      });

      $rootScope.$$postDigest(function(scope) {
        $rootScope.externalCount++;
      });

      $rootScope.$watch('internalCount', function(value) {
        internalWatchCount = value;
      });
      $rootScope.$watch('externalCount', function(value) {
        externalWatchCount = value;
      });

      $rootScope.$digest();

      expect(internalWatchCount).toEqual(1);
      expect(externalWatchCount).toEqual(0);
    }));

    it('should cause a $digest rerun', inject(function($rootScope) {
      $rootScope.log = '';
      $rootScope.value = 0;
      $rootScope.$watch('value', function() {
        $rootScope.log = $rootScope.log + '.';
      });
      $rootScope.$watch('init', function() {
        $rootScope.$evalAsync('value = 123; log = log + "=" ');
        expect($rootScope.value).toEqual(0);
      });
      $rootScope.$digest();
      expect($rootScope.log).toEqual('.=.');
    }));

    it('should run async in the same order as added', inject(function($rootScope) {
      $rootScope.log = '';
      $rootScope.$evalAsync('log = log + 1');
      $rootScope.$evalAsync('log = log + 2');
      $rootScope.$digest();
      expect($rootScope.log).toBe('12');
    }));

    it('should allow passing locals to the expression', inject(function($rootScope) {
      $rootScope.log = '';
      $rootScope.$evalAsync('log = log + a', {a: 1});
      $rootScope.$digest();
      expect($rootScope.log).toBe('1');
    }));

    it('should run async expressions in their proper context', inject(function($rootScope) {
      var child = $rootScope.$new();
      $rootScope.ctx = 'root context';
      $rootScope.log = '';
      child.ctx = 'child context';
      child.log = '';
      child.$evalAsync('log=ctx');
      $rootScope.$digest();
      expect($rootScope.log).toBe('');
      expect(child.log).toBe('child context');
    }));

    it('should operate only with a single queue across all child and isolate scopes', inject(function($rootScope, $parse) {
      var childScope = $rootScope.$new();
      var isolateScope = $rootScope.$new(true);

      $rootScope.$evalAsync('rootExpression');
      childScope.$evalAsync('childExpression');
      isolateScope.$evalAsync('isolateExpression');

      expect(childScope.$$asyncQueue).toBe($rootScope.$$asyncQueue);
      expect(isolateScope.$$asyncQueue).toBeUndefined();
      expect($rootScope.$$asyncQueue).toEqual([
        {scope: $rootScope, fn: $parse('rootExpression'), locals: undefined},
        {scope: childScope, fn: $parse('childExpression'), locals: undefined},
        {scope: isolateScope, fn: $parse('isolateExpression'), locals: undefined}
      ]);
    }));


    describe('auto-flushing when queueing outside of an $apply', function() {
      var log, $rootScope, $browser;

      beforeEach(inject(function(_log_, _$rootScope_, _$browser_) {
        log = _log_;
        $rootScope = _$rootScope_;
        $browser = _$browser_;
      }));


      it('should auto-flush the queue asynchronously and trigger digest', function() {
        $rootScope.$evalAsync(log.fn('eval-ed!'));
        $rootScope.$watch(log.fn('digesting'));
        expect(log).toEqual([]);

        $browser.defer.flush(0);

        expect(log).toEqual(['eval-ed!', 'digesting', 'digesting']);
      });


      it('should not trigger digest asynchronously if the queue is empty in the next tick', function() {
        $rootScope.$evalAsync(log.fn('eval-ed!'));
        $rootScope.$watch(log.fn('digesting'));
        expect(log).toEqual([]);

        $rootScope.$digest();

        expect(log).toEqual(['eval-ed!', 'digesting', 'digesting']);
        log.reset();

        $browser.defer.flush(0);

        expect(log).toEqual([]);
      });


      it('should not schedule more than one auto-flush task', function() {
        $rootScope.$evalAsync(log.fn('eval-ed 1!'));
        $rootScope.$evalAsync(log.fn('eval-ed 2!'));

        $browser.defer.flush(0);
        expect(log).toEqual(['eval-ed 1!', 'eval-ed 2!']);

        $browser.defer.flush(100000);
        expect(log).toEqual(['eval-ed 1!', 'eval-ed 2!']);
      });

      it('should not have execution affected by an explicit $digest call', function() {
        var scope1 = $rootScope.$new();
        var scope2 = $rootScope.$new();

        scope1.$watch('value', function(value) {
          scope1.result = value;
        });

        scope1.$evalAsync(function() {
          scope1.value = 'bar';
        });

        scope2.$digest();

        $browser.defer.flush(0);

        expect(scope1.result).toBe('bar');
      });
    });

    it('should not pass anything as `this` to scheduled functions', inject(function($rootScope) {
      var this1 = {};
      var this2 = (function() { return this; })();
      $rootScope.$evalAsync(function() { this1 = this; });
      $rootScope.$digest();
      expect(this1).toEqual(this2);
    }));
  });


  describe('$apply', function() {
    it('should apply expression with full lifecycle', inject(function($rootScope) {
      var log = '';
      var child = $rootScope.$new();
      $rootScope.$watch('a', function(a) { log += '1'; });
      child.$apply('$parent.a=0');
      expect(log).toEqual('1');
    }));


    it('should catch exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });
      inject(function($rootScope, $exceptionHandler, $log) {
        var log = '';
        var child = $rootScope.$new();
        $rootScope.$watch('a', function(a) { log += '1'; });
        $rootScope.a = 0;
        child.$apply(function() { throw new Error('MyError'); });
        expect(log).toEqual('1');
        expect($exceptionHandler.errors[0].message).toEqual('MyError');
        $log.error.logs.shift();
      });
    });


    it('should log exceptions from $digest', function() {
      module(function($rootScopeProvider, $exceptionHandlerProvider) {
        $rootScopeProvider.digestTtl(2);
        $exceptionHandlerProvider.mode('log');
      });
      inject(function($rootScope, $exceptionHandler) {
        $rootScope.$watch('a', function() {$rootScope.b++;});
        $rootScope.$watch('b', function() {$rootScope.a++;});
        $rootScope.a = $rootScope.b = 0;

        expect(function() {
          $rootScope.$apply();
        }).toThrow();

        expect($exceptionHandler.errors[0]).toBeDefined();

        expect($rootScope.$$phase).toBeNull();
      });
    });


    describe('exceptions', function() {
      var log;
      beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      }));
      beforeEach(inject(function($rootScope) {
        log = '';
        $rootScope.$watch(function() { log += '$digest;'; });
        $rootScope.$digest();
        log = '';
      }));


      it('should execute and return value and update', inject(
          function($rootScope, $exceptionHandler) {
        $rootScope.name = 'abc';
        expect($rootScope.$apply(function(scope) {
          return scope.name;
        })).toEqual('abc');
        expect(log).toEqual('$digest;');
        expect($exceptionHandler.errors).toEqual([]);
      }));


      it('should catch exception and update', inject(function($rootScope, $exceptionHandler) {
        var error = new Error('MyError');
        $rootScope.$apply(function() { throw error; });
        expect(log).toEqual('$digest;');
        expect($exceptionHandler.errors).toEqual([error]);
      }));
    });


    describe('recursive $apply protection', function() {
      it('should throw an exception if $apply is called while an $apply is in progress', inject(
          function($rootScope) {
        expect(function() {
          $rootScope.$apply(function() {
            $rootScope.$apply();
          });
        }).toThrowMinErr('$rootScope', 'inprog', '$apply already in progress');
      }));


      it('should not clear the state when calling $apply during an $apply', inject(
          function($rootScope) {
        $rootScope.$apply(function() {
          expect(function() {
            $rootScope.$apply();
          }).toThrowMinErr('$rootScope', 'inprog', '$apply already in progress');
          expect(function() {
            $rootScope.$apply();
          }).toThrowMinErr('$rootScope', 'inprog', '$apply already in progress');
        });
        expect(function() {
          $rootScope.$apply();
        }).not.toThrow();
      }));


      it('should throw an exception if $apply is called while flushing evalAsync queue', inject(
          function($rootScope) {
        expect(function() {
          $rootScope.$apply(function() {
            $rootScope.$evalAsync(function() {
              $rootScope.$apply();
            });
          });
        }).toThrowMinErr('$rootScope', 'inprog', '$digest already in progress');
      }));


      it('should throw an exception if $apply is called while a watch is being initialized', inject(
          function($rootScope) {
        var childScope1 = $rootScope.$new();
        childScope1.$watch('x', function() {
          childScope1.$apply();
        });
        expect(function() { childScope1.$apply(); }).toThrowMinErr('$rootScope', 'inprog', '$digest already in progress');
      }));


      it('should thrown an exception if $apply in called from a watch fn (after init)', inject(
          function($rootScope) {
        var childScope2 = $rootScope.$new();
        childScope2.$apply(function() {
          childScope2.$watch('x', function(newVal, oldVal) {
            if (newVal !== oldVal) {
              childScope2.$apply();
            }
          });
        });

        expect(function() {
          childScope2.$apply(function() {
            childScope2.x = 'something';
          });
        }).toThrowMinErr('$rootScope', 'inprog', '$digest already in progress');
      }));
    });
  });


  describe('$applyAsync', function() {
    beforeEach(module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    }));


    it('should evaluate in the context of specific $scope', inject(function($rootScope, $browser) {
      var scope = $rootScope.$new();
      scope.$applyAsync('x = "CODE ORANGE"');

      $browser.defer.flush();
      expect(scope.x).toBe('CODE ORANGE');
      expect($rootScope.x).toBeUndefined();
    }));


    it('should evaluate queued expressions in order', inject(function($rootScope, $browser) {
      $rootScope.x = [];
      $rootScope.$applyAsync('x.push("expr1")');
      $rootScope.$applyAsync('x.push("expr2")');

      $browser.defer.flush();
      expect($rootScope.x).toEqual(['expr1', 'expr2']);
    }));


    it('should evaluate subsequently queued items in same turn', inject(function($rootScope, $browser) {
      $rootScope.x = [];
      $rootScope.$applyAsync(function() {
        $rootScope.x.push('expr1');
        $rootScope.$applyAsync('x.push("expr2")');
        expect($browser.deferredFns.length).toBe(0);
      });

      $browser.defer.flush();
      expect($rootScope.x).toEqual(['expr1', 'expr2']);
    }));


    it('should pass thrown exceptions to $exceptionHandler', inject(function($rootScope, $browser, $exceptionHandler) {
      $rootScope.$applyAsync(function() {
        throw 'OOPS';
      });

      $browser.defer.flush();
      expect($exceptionHandler.errors).toEqual([
        'OOPS'
      ]);
    }));


    it('should evaluate subsequent expressions after an exception is thrown', inject(function($rootScope, $browser) {
      $rootScope.$applyAsync(function() {
        throw 'OOPS';
      });
      $rootScope.$applyAsync('x = "All good!"');

      $browser.defer.flush();
      expect($rootScope.x).toBe('All good!');
    }));


    it('should be cancelled if a $rootScope digest occurs before the next tick', inject(function($rootScope, $browser) {
      var cancel = spyOn($browser.defer, 'cancel').and.callThrough();
      var expression = jasmine.createSpy('expr');

      $rootScope.$applyAsync(expression);
      $rootScope.$digest();
      expect(expression).toHaveBeenCalledOnce();
      expect(cancel).toHaveBeenCalledOnce();
      expression.calls.reset();
      cancel.calls.reset();

      // assert that we no longer are waiting to execute
      expect($browser.deferredFns.length).toBe(0);

      // assert that another digest won't call the function again
      $rootScope.$digest();
      expect(expression).not.toHaveBeenCalled();
      expect(cancel).not.toHaveBeenCalled();
    }));
  });

  describe('$$postDigest', function() {
    it('should process callbacks as a queue (FIFO) when the scope is digested', inject(function($rootScope) {
      var signature = '';

      $rootScope.$$postDigest(function() {
        signature += 'A';
        $rootScope.$$postDigest(function() {
          signature += 'D';
        });
      });

      $rootScope.$$postDigest(function() {
        signature += 'B';
      });

      $rootScope.$$postDigest(function() {
        signature += 'C';
      });

      expect(signature).toBe('');
      $rootScope.$digest();
      expect(signature).toBe('ABCD');
    }));

    it('should support $apply calls nested in $$postDigest callbacks', inject(function($rootScope) {
      var signature = '';

      $rootScope.$$postDigest(function() {
        signature += 'A';
      });

      $rootScope.$$postDigest(function() {
        signature += 'B';
        $rootScope.$apply();
        signature += 'D';
      });

      $rootScope.$$postDigest(function() {
        signature += 'C';
      });

      expect(signature).toBe('');
      $rootScope.$digest();
      expect(signature).toBe('ABCD');
    }));

    it('should run a $$postDigest call on all child scopes when a parent scope is digested', inject(function($rootScope) {
      var parent = $rootScope.$new(),
          child = parent.$new(),
          count = 0;

      $rootScope.$$postDigest(function() {
        count++;
      });

      parent.$$postDigest(function() {
        count++;
      });

      child.$$postDigest(function() {
        count++;
      });

      expect(count).toBe(0);
      $rootScope.$digest();
      expect(count).toBe(3);
    }));

    it('should run a $$postDigest call even if the child scope is isolated', inject(function($rootScope) {
      var parent = $rootScope.$new(),
          child = parent.$new(true),
          signature = '';

      parent.$$postDigest(function() {
        signature += 'A';
      });

      child.$$postDigest(function() {
        signature += 'B';
      });

      expect(signature).toBe('');
      $rootScope.$digest();
      expect(signature).toBe('AB');
    }));
  });

  describe('events', function() {

    describe('$on', function() {

      it('should add listener for both $emit and $broadcast events', inject(function($rootScope) {
        var log = '',
            child = $rootScope.$new();

        function eventFn() {
          log += 'X';
        }

        child.$on('abc', eventFn);
        expect(log).toEqual('');

        child.$emit('abc');
        expect(log).toEqual('X');

        child.$broadcast('abc');
        expect(log).toEqual('XX');
      }));


      it('should increment ancestor $$listenerCount entries', inject(function($rootScope) {
        var child1 = $rootScope.$new(),
            child2 = child1.$new(),
            spy = jasmine.createSpy();

        $rootScope.$on('event1', spy);
        expect($rootScope.$$listenerCount).toEqual({event1: 1});

        child1.$on('event1', spy);
        expect($rootScope.$$listenerCount).toEqual({event1: 2});
        expect(child1.$$listenerCount).toEqual({event1: 1});

        child2.$on('event2', spy);
        expect($rootScope.$$listenerCount).toEqual({event1: 2, event2: 1});
        expect(child1.$$listenerCount).toEqual({event1: 1, event2: 1});
        expect(child2.$$listenerCount).toEqual({event2: 1});
      }));


      describe('deregistration', function() {

        it('should return a function that deregisters the listener', inject(function($rootScope) {
          var log = '',
              child = $rootScope.$new(),
              listenerRemove;

          function eventFn() {
            log += 'X';
          }

          listenerRemove = child.$on('abc', eventFn);
          expect(log).toEqual('');
          expect(listenerRemove).toBeDefined();

          child.$emit('abc');
          child.$broadcast('abc');
          expect(log).toEqual('XX');
          expect($rootScope.$$listenerCount['abc']).toBe(1);

          log = '';
          listenerRemove();
          child.$emit('abc');
          child.$broadcast('abc');
          expect(log).toEqual('');
          expect($rootScope.$$listenerCount['abc']).toBeUndefined();
        }));


        // See issue https://github.com/angular/angular.js/issues/16135
        it('should deallocate the listener array entry', inject(function($rootScope) {
          var remove1 = $rootScope.$on('abc', noop);
          $rootScope.$on('abc', noop);

          expect($rootScope.$$listeners['abc'].length).toBe(2);
          expect(0 in $rootScope.$$listeners['abc']).toBe(true);

          remove1();

          expect($rootScope.$$listeners['abc'].length).toBe(2);
          expect(0 in $rootScope.$$listeners['abc']).toBe(false);
        }));


        it('should call next listener after removing the current listener via its own handler', inject(function($rootScope) {
          var listener1 = jasmine.createSpy('listener1').and.callFake(function() { remove1(); });
          var remove1 = $rootScope.$on('abc', listener1);

          var listener2 = jasmine.createSpy('listener2');
          var remove2 = $rootScope.$on('abc', listener2);

          var listener3 = jasmine.createSpy('listener3');
          var remove3 = $rootScope.$on('abc', listener3);

          $rootScope.$broadcast('abc');
          expect(listener1).toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).toHaveBeenCalled();

          listener1.calls.reset();
          listener2.calls.reset();
          listener3.calls.reset();

          $rootScope.$broadcast('abc');
          expect(listener1).not.toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).toHaveBeenCalled();
        }));


        it('should call all subsequent listeners when a previous listener is removed via a handler', inject(function($rootScope) {
          var listener1 = jasmine.createSpy();
          var remove1 = $rootScope.$on('abc', listener1);

          var listener2 = jasmine.createSpy().and.callFake(remove1);
          var remove2 = $rootScope.$on('abc', listener2);

          var listener3 = jasmine.createSpy();
          var remove3 = $rootScope.$on('abc', listener3);

          $rootScope.$broadcast('abc');
          expect(listener1).toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).toHaveBeenCalled();

          listener1.calls.reset();
          listener2.calls.reset();
          listener3.calls.reset();

          $rootScope.$broadcast('abc');
          expect(listener1).not.toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).toHaveBeenCalled();
        }));


        it('should not call listener when removed by previous', inject(function($rootScope) {
          var listener1 = jasmine.createSpy('listener1');
          var remove1 = $rootScope.$on('abc', listener1);

          var listener2 = jasmine.createSpy('listener2').and.callFake(function() { remove3(); });
          var remove2 = $rootScope.$on('abc', listener2);

          var listener3 = jasmine.createSpy('listener3');
          var remove3 = $rootScope.$on('abc', listener3);

          var listener4 = jasmine.createSpy('listener4');
          var remove4 = $rootScope.$on('abc', listener4);

          $rootScope.$broadcast('abc');
          expect(listener1).toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).not.toHaveBeenCalled();
          expect(listener4).toHaveBeenCalled();

          listener1.calls.reset();
          listener2.calls.reset();
          listener3.calls.reset();
          listener4.calls.reset();

          $rootScope.$broadcast('abc');
          expect(listener1).toHaveBeenCalled();
          expect(listener2).toHaveBeenCalled();
          expect(listener3).not.toHaveBeenCalled();
          expect(listener4).toHaveBeenCalled();
        }));


        it('should decrement ancestor $$listenerCount entries', inject(function($rootScope) {
          var child1 = $rootScope.$new(),
              child2 = child1.$new(),
              spy = jasmine.createSpy();

          $rootScope.$on('event1', spy);
          expect($rootScope.$$listenerCount).toEqual({event1: 1});

          child1.$on('event1', spy);
          expect($rootScope.$$listenerCount).toEqual({event1: 2});
          expect(child1.$$listenerCount).toEqual({event1: 1});

          var deregisterEvent2Listener = child2.$on('event2', spy);
          expect($rootScope.$$listenerCount).toEqual({event1: 2, event2: 1});
          expect(child1.$$listenerCount).toEqual({event1: 1, event2: 1});
          expect(child2.$$listenerCount).toEqual({event2: 1});

          deregisterEvent2Listener();

          expect($rootScope.$$listenerCount).toEqual({event1: 2});
          expect(child1.$$listenerCount).toEqual({event1: 1});
          expect(child2.$$listenerCount).toEqual({});
        }));


        it('should not decrement $$listenerCount when called second time', inject(function($rootScope) {
          var child = $rootScope.$new(),
              listener1Spy = jasmine.createSpy(),
              listener2Spy = jasmine.createSpy();

          child.$on('abc', listener1Spy);
          expect($rootScope.$$listenerCount).toEqual({abc: 1});
          expect(child.$$listenerCount).toEqual({abc: 1});

          var deregisterEventListener = child.$on('abc', listener2Spy);
          expect($rootScope.$$listenerCount).toEqual({abc: 2});
          expect(child.$$listenerCount).toEqual({abc: 2});

          deregisterEventListener();

          expect($rootScope.$$listenerCount).toEqual({abc: 1});
          expect(child.$$listenerCount).toEqual({abc: 1});

          deregisterEventListener();

          expect($rootScope.$$listenerCount).toEqual({abc: 1});
          expect(child.$$listenerCount).toEqual({abc: 1});
        }));
      });
    });


    describe('$emit', function() {
      var log, child, grandChild, greatGrandChild;

      function logger(event) {
        log += event.currentScope.id + '>';
      }

      beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      }));
      beforeEach(inject(function($rootScope) {
        log = '';
        child = $rootScope.$new();
        grandChild = child.$new();
        greatGrandChild = grandChild.$new();

        $rootScope.id = 0;
        child.id = 1;
        grandChild.id = 2;
        greatGrandChild.id = 3;

        $rootScope.$on('myEvent', logger);
        child.$on('myEvent', logger);
        grandChild.$on('myEvent', logger);
        greatGrandChild.$on('myEvent', logger);
      }));

      it('should bubble event up to the root scope', function() {
        grandChild.$emit('myEvent');
        expect(log).toEqual('2>1>0>');
      });

      it('should allow all events on the same scope to run even if stopPropagation is called', function() {
        child.$on('myEvent', logger);
        grandChild.$on('myEvent', function(e) { e.stopPropagation(); });
        grandChild.$on('myEvent', logger);
        grandChild.$on('myEvent', logger);
        grandChild.$emit('myEvent');
        expect(log).toEqual('2>2>2>');
      });

      it('should dispatch exceptions to the $exceptionHandler',
          inject(function($exceptionHandler) {
        child.$on('myEvent', function() { throw 'bubbleException'; });
        grandChild.$emit('myEvent');
        expect(log).toEqual('2>1>0>');
        expect($exceptionHandler.errors).toEqual(['bubbleException']);
      }));


      it('should allow stopping event propagation', function() {
        child.$on('myEvent', function(event) { event.stopPropagation(); });
        grandChild.$emit('myEvent');
        expect(log).toEqual('2>1>');
      });


      it('should forward method arguments', function() {
        child.$on('abc', function(event, arg1, arg2) {
          expect(event.name).toBe('abc');
          expect(arg1).toBe('arg1');
          expect(arg2).toBe('arg2');
        });
        child.$emit('abc', 'arg1', 'arg2');
      });


      it('should allow removing event listener inside a listener on $emit', function() {
        var spy1 = jasmine.createSpy('1st listener');
        var spy2 = jasmine.createSpy('2nd listener');
        var spy3 = jasmine.createSpy('3rd listener');

        var remove1 = child.$on('evt', spy1);
        var remove2 = child.$on('evt', spy2);
        var remove3 = child.$on('evt', spy3);

        spy1.and.callFake(remove1);

        expect(child.$$listeners['evt'].length).toBe(3);

        // should call all listeners and remove 1st
        child.$emit('evt');
        expect(spy1).toHaveBeenCalledOnce();
        expect(spy2).toHaveBeenCalledOnce();
        expect(spy3).toHaveBeenCalledOnce();
        expect(child.$$listeners['evt'].length).toBe(3); // cleanup will happen on next $emit

        spy1.calls.reset();
        spy2.calls.reset();
        spy3.calls.reset();

        // should call only 2nd because 1st was already removed and 2nd removes 3rd
        spy2.and.callFake(remove3);
        child.$emit('evt');
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledOnce();
        expect(spy3).not.toHaveBeenCalled();
        expect(child.$$listeners['evt'].length).toBe(1);
      });


      it('should allow removing event listener inside a listener on $broadcast', function() {
        var spy1 = jasmine.createSpy('1st listener');
        var spy2 = jasmine.createSpy('2nd listener');
        var spy3 = jasmine.createSpy('3rd listener');

        var remove1 = child.$on('evt', spy1);
        var remove2 = child.$on('evt', spy2);
        var remove3 = child.$on('evt', spy3);

        spy1.and.callFake(remove1);

        expect(child.$$listeners['evt'].length).toBe(3);

        // should call all listeners and remove 1st
        child.$broadcast('evt');
        expect(spy1).toHaveBeenCalledOnce();
        expect(spy2).toHaveBeenCalledOnce();
        expect(spy3).toHaveBeenCalledOnce();
        expect(child.$$listeners['evt'].length).toBe(3); //cleanup will happen on next $broadcast

        spy1.calls.reset();
        spy2.calls.reset();
        spy3.calls.reset();

        // should call only 2nd because 1st was already removed and 2nd removes 3rd
        spy2.and.callFake(remove3);
        child.$broadcast('evt');
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledOnce();
        expect(spy3).not.toHaveBeenCalled();
        expect(child.$$listeners['evt'].length).toBe(1);
      });


      describe('event object', function() {
        it('should have methods/properties', function() {
          var eventFired = false;

          child.$on('myEvent', function(e) {
            expect(e.targetScope).toBe(grandChild);
            expect(e.currentScope).toBe(child);
            expect(e.name).toBe('myEvent');
            eventFired = true;
          });
          grandChild.$emit('myEvent');
          expect(eventFired).toBe(true);
        });


        it('should have its `currentScope` property set to null after emit', function() {
          var event;

          child.$on('myEvent', function(e) {
            event = e;
          });
          grandChild.$emit('myEvent');

          expect(event.currentScope).toBe(null);
          expect(event.targetScope).toBe(grandChild);
          expect(event.name).toBe('myEvent');
        });


        it('should have preventDefault method and defaultPrevented property', function() {
          var event = grandChild.$emit('myEvent');
          expect(event.defaultPrevented).toBe(false);

          child.$on('myEvent', function(event) {
            event.preventDefault();
          });
          event = grandChild.$emit('myEvent');
          expect(event.defaultPrevented).toBe(true);
          expect(event.currentScope).toBe(null);
        });
      });
    });


    describe('$broadcast', function() {
      describe('event propagation', function() {
        var log, child1, child2, child3, grandChild11, grandChild21, grandChild22, grandChild23,
            greatGrandChild211;

        function logger(event) {
          log += event.currentScope.id + '>';
        }

        beforeEach(inject(function($rootScope) {
          log = '';
          child1 = $rootScope.$new();
          child2 = $rootScope.$new();
          child3 = $rootScope.$new();
          grandChild11 = child1.$new();
          grandChild21 = child2.$new();
          grandChild22 = child2.$new();
          grandChild23 = child2.$new();
          greatGrandChild211 = grandChild21.$new();

          $rootScope.id = 0;
          child1.id = 1;
          child2.id = 2;
          child3.id = 3;
          grandChild11.id = 11;
          grandChild21.id = 21;
          grandChild22.id = 22;
          grandChild23.id = 23;
          greatGrandChild211.id = 211;

          $rootScope.$on('myEvent', logger);
          child1.$on('myEvent', logger);
          child2.$on('myEvent', logger);
          child3.$on('myEvent', logger);
          grandChild11.$on('myEvent', logger);
          grandChild21.$on('myEvent', logger);
          grandChild22.$on('myEvent', logger);
          grandChild23.$on('myEvent', logger);
          greatGrandChild211.$on('myEvent', logger);

          //          R
          //       /  |   \
          //     1    2    3
          //    /   / | \
          //   11  21 22 23
          //       |
          //      211
        }));


        it('should broadcast an event from the root scope', inject(function($rootScope) {
          $rootScope.$broadcast('myEvent');
          expect(log).toBe('0>1>11>2>21>211>22>23>3>');
        }));


        it('should broadcast an event from a child scope', function() {
          child2.$broadcast('myEvent');
          expect(log).toBe('2>21>211>22>23>');
        });


        it('should broadcast an event from a leaf scope with a sibling', function() {
          grandChild22.$broadcast('myEvent');
          expect(log).toBe('22>');
        });


        it('should broadcast an event from a leaf scope without a sibling', function() {
          grandChild23.$broadcast('myEvent');
          expect(log).toBe('23>');
        });


        it('should not not fire any listeners for other events', inject(function($rootScope) {
          $rootScope.$broadcast('fooEvent');
          expect(log).toBe('');
        }));


        it('should not descend past scopes with a $$listerCount of 0 or undefined',
            inject(function($rootScope) {
          var EVENT = 'fooEvent',
              spy = jasmine.createSpy('listener');

          // Precondition: There should be no listeners for fooEvent.
          expect($rootScope.$$listenerCount[EVENT]).toBeUndefined();

          // Add a spy listener to a child scope.
          $rootScope.$$childHead.$$listeners[EVENT] = [spy];

          // $rootScope's count for 'fooEvent' is undefined, so spy should not be called.
          $rootScope.$broadcast(EVENT);
          expect(spy).not.toHaveBeenCalled();
        }));


        it('should return event object', function() {
          var result = child1.$broadcast('some');

          expect(result).toBeDefined();
          expect(result.name).toBe('some');
          expect(result.targetScope).toBe(child1);
        });
      });


      describe('listener', function() {
        it('should receive event object', inject(function($rootScope) {
          var scope = $rootScope,
              child = scope.$new(),
              eventFired = false;

          child.$on('fooEvent', function(event) {
            eventFired = true;
            expect(event.name).toBe('fooEvent');
            expect(event.targetScope).toBe(scope);
            expect(event.currentScope).toBe(child);
          });
          scope.$broadcast('fooEvent');

          expect(eventFired).toBe(true);
        }));


        it('should have the event\'s `currentScope` property set to null after broadcast',
            inject(function($rootScope) {
          var scope = $rootScope,
              child = scope.$new(),
              event;

          child.$on('fooEvent', function(e) {
            event = e;
          });
          scope.$broadcast('fooEvent');

          expect(event.name).toBe('fooEvent');
          expect(event.targetScope).toBe(scope);
          expect(event.currentScope).toBe(null);
        }));


        it('should support passing messages as varargs', inject(function($rootScope) {
          var scope = $rootScope,
              child = scope.$new(),
              args;

          child.$on('fooEvent', function() {
            args = arguments;
          });
          scope.$broadcast('fooEvent', 'do', 're', 'me', 'fa');

          expect(args.length).toBe(5);
          expect(sliceArgs(args, 1)).toEqual(['do', 're', 'me', 'fa']);
        }));
      });
    });


    it('should allow recursive $emit/$broadcast', inject(function($rootScope) {
      var callCount = 0;
      $rootScope.$on('evt', function($event, arg0) {
        callCount++;
        if (arg0 !== 1234) {
          $rootScope.$emit('evt', 1234);
          $rootScope.$broadcast('evt', 1234);
        }
      });

      $rootScope.$emit('evt');
      $rootScope.$broadcast('evt');
      expect(callCount).toBe(6);
    }));


    it('should allow recursive $emit/$broadcast between parent/child', inject(function($rootScope) {
      var child = $rootScope.$new();
      var calls = '';

      $rootScope.$on('evt', function($event, arg0) {
        calls += 'r';  // For "root".
        if (arg0 === 'fromChild') {
          $rootScope.$broadcast('evt', 'fromRoot2');
        }
      });

      child.$on('evt', function($event, arg0) {
        calls += 'c';  // For "child".
        if (arg0 === 'fromRoot1') {
          child.$emit('evt', 'fromChild');
        }
      });

      $rootScope.$broadcast('evt', 'fromRoot1');
      expect(calls).toBe('rccrrc');
    }));
  });

  describe('doc examples', function() {

    it('should properly fire off watch listeners upon scope changes', inject(function($rootScope) {
//<docs tag="docs1">
      var scope = $rootScope.$new();
      scope.salutation = 'Hello';
      scope.name = 'World';

      expect(scope.greeting).toEqual(undefined);

      scope.$watch('name', function() {
        scope.greeting = scope.salutation + ' ' + scope.name + '!';
      }); // initialize the watch

      expect(scope.greeting).toEqual(undefined);
      scope.name = 'Misko';
      // still old value, since watches have not been called yet
      expect(scope.greeting).toEqual(undefined);

      scope.$digest(); // fire all  the watches
      expect(scope.greeting).toEqual('Hello Misko!');
//</docs>
    }));

  });
});
