'use strict';

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope ware heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive from speed as well as memory:
 *   - no closures, instead ups prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - this means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the begging (shift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using array would be slow since inserts in meddle are expensive so we use linked list
 *
 * There are few watches then a lot of observers. This is why you don't want the observer to be
 * implemented in the same way as watch. Watch requires return of initialization function which
 * are expensive to construct.
 */

/**
 * @ngdoc object
 * @name angular.module.ng.$rootScope
 * @description
 *
 * Every application has a single root {@link angular.module.ng.$rootScope.Scope scope}.
 * All other scopes are child scopes of the root scope. Scopes provide mechanism for watching the model and provide
 * event processing life-cycle. See {@link guide/dev_guide.scopes developer guide on scopes}.
 */
function $RootScopeProvider(){
  this.$get = ['$injector', '$exceptionHandler', '$parse',
      function( $injector,   $exceptionHandler,   $parse) {

    /**
     * @ngdoc function
     * @name angular.module.ng.$rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link angular.module.ng.$rootScope $rootScope} key from the
     * {@link angular.module.AUTO.$injector $injector}. Child scopes are created using the
     * {@link angular.module.ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.)
     *
     * Here is a simple scope snippet to show how you can interact with the scope.
     * <pre>
        angular.injector(['ng']).invoke(function($rootScope) {
           var scope = $rootScope.$new();
           scope.salutation = 'Hello';
           scope.name = 'World';

           expect(scope.greeting).toEqual(undefined);

           scope.$watch('name', function() {
             this.greeting = this.salutation + ' ' + this.name + '!';
           }); // initialize the watch

           expect(scope.greeting).toEqual(undefined);
           scope.name = 'Misko';
           // still old value, since watches have not been called yet
           expect(scope.greeting).toEqual(undefined);

           scope.$digest(); // fire all  the watches
           expect(scope.greeting).toEqual('Hello Misko!');
        });
     * </pre>
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * <pre>
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         child.name = "World";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * </pre>
     *
     * # Dependency Injection
     * See {@link guide/dev_guide.di dependency injection}.
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be provided
     *     for the current scope. Defaults to {@link angular.module.ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *     append/override services provided by `providers`. This is handy when unit-testing and having
     *     the need to override a default service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$destructor = noop;
      this['this'] = this.$root =  this;
      this.$$asyncQueue = [];
      this.$$listeners = {};
    }

    /**
     * @ngdoc property
     * @name angular.module.ng.$rootScope.Scope#$id
     * @propertyOf angular.module.ng.$rootScope.Scope
     * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
     *   debugging.
     */


    Scope.prototype = {
      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$new
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Creates a new child {@link angular.module.ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link angular.module.ng.$rootScope.Scope#$digest $digest()} and
       * {@link angular.module.ng.$rootScope.Scope#$digest $digest()} events. The scope can be removed from the scope
       * hierarchy using {@link angular.module.ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link angular.module.ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is desired for
       * the scope and its child scopes to be permanently detached from the parent and thus stop
       * participating in model change detection and listener notification by invoking.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function() {
        var Child = function() {}; // should be anonymous; This is so that when the minifier munges
          // the name it does not become random set of chars. These will then show up as class
          // name in the debugger.
        var child;
        Child.prototype = this;
        child = new Child();
        child['this'] = child;
        child.$$listeners = {};
        child.$parent = this;
        child.$id = nextUid();
        child.$$asyncQueue = [];
        child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
        child.$$prevSibling = this.$$childTail;
        if (this.$$childHead) {
          this.$$childTail.$$nextSibling = child;
          this.$$childTail = child;
        } else {
          this.$$childHead = this.$$childTail = child;
        }
        return child;
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$watch
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link angular.module.ng.$rootScope.Scope#$digest $digest()} and
       *   should return the value which will be watched. (Since {@link angular.module.ng.$rootScope.Scope#$digest $digest()}
       *   reruns when it detects changes the `watchExpression` can execute multiple times per
       *   {@link angular.module.ng.$rootScope.Scope#$digest $digest()} and should be idempotent.)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression' are not equal (with the exception of the initial run
       *   see below). The inequality is determined according to
       *   {@link angular.equals} function. To save the value of the object for later comparison
       *   {@link angular.copy} function is used. It also means that watching complex options will
       *   have adverse memory and performance implications.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire. This
       *   is achieved by rerunning the watchers until no changes are detected. The rerun iteration
       *   limit is 100 to prevent infinity loop deadlock.
       *
       *
       * If you want to be notified whenever {@link angular.module.ng.$rootScope.Scope#$digest $digest} is called,
       * you can register an `watchExpression` function with no `listener`. (Since `watchExpression`,
       * can execute multiple times per {@link angular.module.ng.$rootScope.Scope#$digest $digest} cycle when a change is
       * detected, be prepared for multiple calls to your listener.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link angular.module.ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       *
       * # Example
         <pre>
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) { counter = counter + 1; });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
         </pre>
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link angular.module.ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers a
       *    call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {(function()|string)=} listener Callback called whenever the return value of
       *   the `watchExpression` changes.
       *
       *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
       *    - `function(newValue, oldValue, scope)`: called with current and previous values as parameters.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener) {
        var scope = this,
            get = compileToFn(watchExp, 'watch'),
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: watchExp
            };

        // in the case user pass string, we need to compile it, do we really need this ?
        if (!isFunction(listener)) {
          var listenFn = compileToFn(listener || noop, 'listener');
          watcher.fn = function(newVal, oldVal, scope) {listenFn(scope);};
        }

        if (!array) {
          array = scope.$$watchers = [];
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);

        return function() {
          arrayRemove(array, watcher);
        };
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$digest
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Process all of the {@link angular.module.ng.$rootScope.Scope#$watch watchers} of the current scope and its children.
       * Because a {@link angular.module.ng.$rootScope.Scope#$watch watcher}'s listener can change the model, the
       * `$digest()` keeps calling the {@link angular.module.ng.$rootScope.Scope#$watch watchers} until no more listeners are
       * firing. This means that it is possible to get into an infinite loop. This function will throw
       * `'Maximum iteration limit exceeded.'` if the number of iterations exceeds 100.
       *
       * Usually you don't call `$digest()` directly in
       * {@link angular.module.ng.$compileProvider.directive.ng:controller controllers} or in 
       * {@link angular.module.ng.$compileProvider.directive directives}.
       * Instead a call to {@link angular.module.ng.$rootScope.Scope#$apply $apply()} (typically from within a
       * {@link angular.module.ng.$compileProvider.directive directives}) will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function  with {@link angular.module.ng.$rootScope.Scope#$watch $watch()}
       * with no `listener`.
       *
       * You may have a need to call `$digest()` from within unit-tests, to simulate the scope
       * life-cycle.
       *
       * # Example
         <pre>
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(scope, newValue, oldValue) {
             counter = counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
         </pre>
       *
       */
      $digest: function() {
        var watch, value, last,
            watchers,
            asyncQueue,
            length,
            dirty, ttl = 100,
            next, current, target = this,
            watchLog = [],
            logIdx, logMsg;

        flagPhase(target, '$digest');

        do {
          dirty = false;
          current = target;
          do {
            asyncQueue = current.$$asyncQueue;
            while(asyncQueue.length) {
              try {
                current.$eval(asyncQueue.shift());
              } catch (e) {
                $exceptionHandler(e);
              }
            }
            if ((watchers = current.$$watchers)) {
              // process our watches
              length = watchers.length;
              while (length--) {
                try {
                  watch = watchers[length];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if ((value = watch.get(current)) !== (last = watch.last) && !equals(value, last)) {
                    dirty = true;
                    watch.last = copy(value);
                    watch.fn(value, ((last === initWatchVal) ? value : last), current);
                    if (ttl < 5) {
                      logIdx = 4 - ttl;
                      if (!watchLog[logIdx]) watchLog[logIdx] = [];
                      logMsg = (isFunction(watch.exp))
                          ? 'fn: ' + (watch.exp.name || watch.exp.toString())
                          : watch.exp;
                      logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                      watchLog[logIdx].push(logMsg);
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
              while(current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          if(dirty && !(ttl--)) {
            throw Error('100 $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: ' + toJson(watchLog));
          }
        } while (dirty || asyncQueue.length);

        this.$root.$$phase = null;
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$destroy
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Remove the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link angular.module.ng.$rootScope.Scope#$digest $digest()} will no longer propagate to the current
       * scope and its children. Removal also implies that the current scope is eligible for garbage
       * collection.
       *
       * The destructing scope emits an `$destroy` {@link angular.module.ng.$rootScope.Scope#$emit event}.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link angular.module.ng.$compileProvider.directive.ng:repeat ng:repeat} for managing the unrolling of the loop.
       *
       */
      $destroy: function() {
        if (this.$root == this) return; // we can't remove the root node;
        this.$emit('$destroy');
        var parent = this.$parent;

        if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
        if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$eval
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the `expression` on the current scope returning the result. Any exceptions in the
       * expression are propagated (uncaught). This is useful when evaluating engular expressions.
       *
       * # Example
         <pre>
           var scope = angular.module.ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
         </pre>
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/dev_guide.expressions expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr) {
        return $parse(expr)(this);
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$evalAsync
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only that:
       *
       *   - it will execute in the current script execution context (before any DOM rendering).
       *   - at least one {@link angular.module.ng.$rootScope.Scope#$digest $digest cycle} will be performed after
       *     `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link angular.module.ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/dev_guide.expressions expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       */
      $evalAsync: function(expr) {
        this.$$asyncQueue.push(expr);
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$apply
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular framework.
       * (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life-cycle
       * of {@link angular.module.ng.$exceptionHandler exception handling},
       * {@link angular.module.ng.$rootScope.Scope#$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
          function $apply(expr) {
            try {
              return $eval(expr);
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              $root.$digest();
            }
          }
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/dev_guide.expressions expression} is executed using the
       *    {@link angular.module.ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link angular.module.ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link angular.module.ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the expression
       *    was executed using the {@link angular.module.ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/dev_guide.expressions expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          flagPhase(this, '$apply');
          return this.$eval(expr);
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          this.$root.$$phase = null;
          this.$root.$digest();
        }
      },

      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$on
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Listen on events of a given type. See {@link angular.module.ng.$rootScope.Scope#$emit $emit} for discussion of
       * event life cycle.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       *
       * The event listener function format is: `function(event)`. The `event` object passed into the
       * listener has the following attributes
       *   - `targetScope` - {Scope}: the scope on which the event was `$emit`-ed or `$broadcast`-ed.
       *   - `currentScope` - {Scope}: the current scope which is handling the event.
       *   - `name` - {string}: Name of the event.
       *   - `cancel` - {function=}: calling `cancel` function will cancel further event propagation
       *     (available only for events that were `$emit`-ed).
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        return function() {
          arrayRemove(namedListeners, listener);
        };
      },


      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$emit
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link angular.module.ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link angular.module.ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.
       * Afterwards, the event traverses upwards toward the root scope and calls all registered
       * listeners along the way. The event will stop propagating if one of the listeners cancels it.
       *
       * Any exception emmited from the {@link angular.module.ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link angular.module.ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            event = {
              name: name,
              targetScope: scope,
              cancel: function() {this.cancelled = true;},
              cancelled: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i=0, length=namedListeners.length; i<length; i++) {
            try {
              namedListeners[i].apply(null, listenerArgs);
              if (event.cancelled) return event;
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        return event;
      },


      /**
       * @ngdoc function
       * @name angular.module.ng.$rootScope.Scope#$broadcast
       * @methodOf angular.module.ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link angular.module.ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link angular.module.ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.
       * Afterwards, the event propagates to all direct and indirect scopes of the current scope and
       * calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emmited from the {@link angular.module.ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link angular.module.ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = { name: name,
                      targetScope: target },
            listenerArgs = concat([event], arguments, 1);

        //down while you can, then up and next sibling or up and next sibling until back at root
        do {
          current = next;
          event.currentScope = current;
          forEach(current.$$listeners[name], function(listener) {
            try {
              listener.apply(null, listenerArgs);
            } catch(e) {
              $exceptionHandler(e);
            }
          });

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return event;
      }
    };


    function flagPhase(scope, phase) {
      var root = scope.$root;

      if (root.$$phase) {
        throw Error(root.$$phase + ' already in progress');
      }

      root.$$phase = phase;
    }

    return new Scope();

    function compileToFn(exp, name) {
      var fn = $parse(exp);
      assertArgFn(fn, name);
      return fn;
    }

    /**
     * function used as an initial value for watchers.
     * because it's uniqueue we can easily tell it apart from other values
     */
    function initWatchVal() {}
  }];
}
