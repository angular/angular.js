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


function createScope(providers, instanceCache) {
  var scope = new Scope();
  (scope.$service = createInjector(scope, providers, instanceCache)).eager();
  return scope;
}


/**
 * @ngdoc function
 * @name angular.scope
 *
 * @description
 * A root scope can be created by calling {@link angular.scope angular.scope()}. Child scopes
 * are created using the {@link angular.scope.$new $new()} method.
 * (Most scopes are created automatically when compiled HTML template is executed.)
 *
 * Here is a simple scope snippet to show how you can interact with the scope.
 * <pre>
       var scope = angular.scope();
       scope.salutation = 'Hello';
       scope.name = 'World';

       expect(scope.greeting).toEqual(undefined);

       scope.$watch('name', function(){
         this.greeting = this.salutation + ' ' + this.name + '!';
       }); // initialize the watch

       expect(scope.greeting).toEqual(undefined);
       scope.name = 'Misko';
       // still old value, since watches have not been called yet
       expect(scope.greeting).toEqual(undefined);

       scope.$digest(); // fire all  the watches
       expect(scope.greeting).toEqual('Hello Misko!');
 * </pre>
 *
 * # Inheritance
 * A scope can inherit from a parent scope, as in this example:
 * <pre>
     var parent = angular.scope();
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
 *     for the current scope. Defaults to {@link angular.service}.
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
 * @name angular.scope.$id
 * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
 *   debugging.
 */

/**
 * @ngdoc property
 * @name angular.scope.$service
 * @function
 *
 * @description
 * Provides reference to an instance of {@link angular.injector injector} which can be used to
 * retrieve {@link angular.service services}. In general the use of this api is discouraged,
 * in favor of proper {@link guide/dev_guide.di dependency injection}.
 *
 * @returns {function} {@link angular.injector injector}
 */

/**
 * @ngdoc property
 * @name angular.scope.$root
 * @returns {Scope} The root scope of the current scope hierarchy.
 */

/**
 * @ngdoc property
 * @name angular.scope.$parent
 * @returns {Scope} The parent scope of the current scope.
 */


Scope.prototype = {
  /**
   * @ngdoc function
   * @name angular.scope.$new
   * @function
   *
   * @description
   * Creates a new child {@link angular.scope scope}. The new scope can optionally behave as a
   * controller. The parent scope will propagate the {@link angular.scope.$digest $digest()} and
   * {@link angular.scope.$digest $digest()} events. The scope can be removed from the scope
   * hierarchy using {@link angular.scope.$destroy $destroy()}.
   *
   * {@link angular.scope.$destroy $destroy()} must be called on a scope when it is desired for
   * the scope and its child scopes to be permanently detached from the parent and thus stop
   * participating in model change detection and listener notification by invoking.
   *
   * @param {function()=} Class Constructor function which the scope should be applied to the scope.
   * @param {...*} curryArguments Any additional arguments which are curried into the constructor.
   *        See {@link guide/dev_guide.di dependency injection}.
   * @returns {Object} The newly created child scope.
   *
   */
  $new: function(Class, curryArguments) {
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
    child.$$phase = child.$$watchers =
      child.$$nextSibling = child.$$childHead = child.$$childTail = null;
    child.$$prevSibling = this.$$childTail;
    if (this.$$childHead) {
      this.$$childTail.$$nextSibling = child;
      this.$$childTail = child;
    } else {
      this.$$childHead = this.$$childTail = child;
    }
    // short circuit if we have no class
    if (Class) {
      // can't use forEach, we need speed!
      var ClassPrototype = Class.prototype;
      for(var key in ClassPrototype) {
        child[key] = bind(child, ClassPrototype[key]);
      }
      this.$service.invoke(child, Class, curryArguments);
    }
    return child;
  },

  /**
   * @ngdoc function
   * @name angular.scope.$watch
   * @function
   *
   * @description
   * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
   *
   * - The `watchExpression` is called on every call to {@link angular.scope.$digest $digest()} and
   *   should return the value which will be watched. (Since {@link angular.scope.$digest $digest()}
   *   reruns when it detects changes the `watchExpression` can execute multiple times per
   *   {@link angular.scope.$digest $digest()} and should be idempotent.)
   * - The `listener` is called only when the value from the current `watchExpression` and the
   *   previous call to `watchExpression' are not equal. The inequality is determined according to
   *   {@link angular.equals} function. To save the value of the object for later comparison
   *   {@link angular.copy} function is used. It also means that watching complex options will
   *   have adverse memory and performance implications.
   * - The watch `listener` may change the model, which may trigger other `listener`s to fire. This
   *   is achieved by rerunning the watchers until no changes are detected. The rerun iteration
   *   limit is 100 to prevent infinity loop deadlock.
   *
   *
   * If you want to be notified whenever {@link angular.scope.$digest $digest} is called,
   * you can register an `watchExpression` function with no `listener`. (Since `watchExpression`,
   * can execute multiple times per {@link angular.scope.$digest $digest} cycle when a change is
   * detected, be prepared for multiple calls to your listener.)
   *
   *
   * # Example
     <pre>
       var scope = angular.scope();
       scope.name = 'misko';
       scope.counter = 0;

       expect(scope.counter).toEqual(0);
       scope.$watch('name', function(scope, newValue, oldValue) { counter = counter + 1; });
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
   *    {@link angular.scope.$digest $digest} cycle. A change in the return value triggers a
   *    call to the `listener`.
   *
   *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
   *    - `function(scope)`: called with current `scope` as a parameter.
   * @param {(function()|string)=} listener Callback called whenever the return value of
   *   the `watchExpression` changes.
   *
   *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
   *    - `function(scope, newValue, oldValue)`: called with current `scope` an previous and
   *       current values as parameters.
   * @returns {function()} Returns a deregistration function for this listener.
   */
  $watch: function(watchExp, listener) {
    var scope = this,
        get = compileToFn(watchExp, 'watch'),
        listenFn = compileToFn(listener || noop, 'listener'),
        array = scope.$$watchers,
        watcher = {
          fn: listenFn,
          last: Number.NaN, // NaN !== NaN. We used this to force $watch to fire on first run.
          get: get
        };

    if (!array) {
      array = scope.$$watchers = [];
    }
    // we use unshift since we use a while loop in $digest for speed.
    // the while loop reads in reverse order.
    array.unshift(watcher);

    return function() {
      angularArray.remove(array, watcher);
    };
  },

  /**
   * @ngdoc function
   * @name angular.scope.$digest
   * @function
   *
   * @description
   * Process all of the {@link angular.scope.$watch watchers} of the current scope and its children.
   * Because a {@link angular.scope.$watch watcher}'s listener can change the model, the
   * `$digest()` keeps calling the {@link angular.scope.$watch watchers} until no more listeners are
   * firing. This means that it is possible to get into an infinite loop. This function will throw
   * `'Maximum iteration limit exceeded.'` if the number of iterations exceeds 100.
   *
   * Usually you don't call `$digest()` directly in
   * {@link angular.directive.ng:controller controllers} or in {@link angular.directive directives}.
   * Instead a call to {@link angular.scope.$apply $apply()} (typically from within a
   * {@link angular.directive directive}) will force a `$digest()`.
   *
   * If you want to be notified whenever `$digest()` is called,
   * you can register a `watchExpression` function  with {@link angular.scope.$watch $watch()}
   * with no `listener`.
   *
   * You may have a need to call `$digest()` from within unit-tests, to simulate the scope
   * life-cycle.
   *
   * # Example
     <pre>
       var scope = angular.scope();
       scope.name = 'misko';
       scope.counter = 0;

       expect(scope.counter).toEqual(0);
       scope.$digest('name', function(scope, newValue, oldValue) { counter = counter + 1; });
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
        next, current, target = this;

    if (target.$$phase) {
      throw Error(target.$$phase + ' already in progress');
    }
    do {

      dirty = false;
      current = target;
      do {
        current.$$phase = '$digest';
        asyncQueue = current.$$asyncQueue;
        while(asyncQueue.length) {
          try {
            current.$eval(asyncQueue.shift());
          } catch (e) {
            current.$service('$exceptionHandler')(e);
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
                watch.fn(current, value, last);
              }
            } catch (e) {
              current.$service('$exceptionHandler')(e);
            }
          }
        }

        current.$$phase = null;

        // Insanity Warning: scope depth-first traversal
        // yes, this code is a bit crazy, but it works and we have tests to prove it!
        // this piece should be kept in sync with the traversal in $broadcast
        if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
          while(current !== target && !(next = current.$$nextSibling)) {
            current = current.$parent;
          }
        }
      } while ((current = next));

      if(!(ttl--)) {
        throw Error('100 $digest() iterations reached. Aborting!');
      }
    } while (dirty);
  },

  /**
   * @ngdoc function
   * @name angular.scope.$destroy
   * @function
   *
   * @description
   * Remove the current scope (and all of its children) from the parent scope. Removal implies
   * that calls to {@link angular.scope.$digest $digest()} will no longer propagate to the current
   * scope and its children. Removal also implies that the current scope is eligible for garbage
   * collection.
   *
   * The destructing scope emits an `$destroy` {@link angular.scope.$emit event}.
   *
   * The `$destroy()` is usually used by directives such as
   * {@link angular.widget.@ng:repeat ng:repeat} for managing the unrolling of the loop.
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
   * @name angular.scope.$eval
   * @function
   *
   * @description
   * Executes the `expression` on the current scope returning the result. Any exceptions in the
   * expression are propagated (uncaught). This is useful when evaluating engular expressions.
   *
   * # Example
     <pre>
       var scope = angular.scope();
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
    var fn = isString(expr)
      ? expressionCompile(expr)
      : expr || noop;
    return fn(this);
  },

  /**
   * @ngdoc function
   * @name angular.scope.$evalAsync
   * @function
   *
   * @description
   * Executes the expression on the current scope at a later point in time.
   *
   * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only that:
   *
   *   - it will execute in the current script execution context (before any DOM rendering).
   *   - at least one {@link angular.scope.$digest $digest cycle} will be performed after
   *     `expression` execution.
   *
   * Any exceptions from the execution of the expression are forwarded to the
   * {@link angular.service.$exceptionHandler $exceptionHandler} service.
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
   * @name angular.scope.$apply
   * @function
   *
   * @description
   * `$apply()` is used to execute an expression in angular from outside of the angular framework.
   * (For example from browser DOM events, setTimeout, XHR or third party libraries).
   * Because we are calling into the angular framework we need to perform proper scope life-cycle
   * of {@link angular.service.$exceptionHandler exception handling},
   * {@link angular.scope.$digest executing watches}.
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
   *    {@link angular.scope.$eval $eval()} method.
   * 2. Any exceptions from the execution of the expression are forwarded to the
   *    {@link angular.service.$exceptionHandler $exceptionHandler} service.
   * 3. The {@link angular.scope.$watch watch} listeners are fired immediately after the expression
   *    was executed using the {@link angular.scope.$digest $digest()} method.
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
      return this.$eval(expr);
    } catch (e) {
      this.$service('$exceptionHandler')(e);
    } finally {
      this.$root.$digest();
    }
  },

  /**
   * @ngdoc function
   * @name angular.scope.$on
   * @function
   *
   * @description
   * Listen on events of a given type. See {@link angular.scope.$emit $emit} for discussion of
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
      angularArray.remove(namedListeners, listener);
    };
  },


  /**
   * @ngdoc function
   * @name angular.scope.$emit
   * @function
   *
   * @description
   * Dispatches an event `name` upwards through the scope hierarchy notifying the
   * registered {@link angular.scope.$on} listeners.
   *
   * The event life cycle starts at the scope on which `$emit` was called. All
   * {@link angular.scope.$on listeners} listening for `name` event on this scope get notified.
   * Afterwards, the event traverses upwards toward the root scope and calls all registered
   * listeners along the way. The event will stop propagating if one of the listeners cancels it.
   *
   * Any exception emmited from the {@link angular.scope.$on listeners} will be passed
   * onto the {@link angular.service.$exceptionHandler $exceptionHandler} service.
   *
   * @param {string} name Event name to emit.
   * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
   */
  $emit: function(name, args) {
    var empty = [],
        namedListeners,
        canceled = false,
        scope = this,
        event = {
          name: name,
          targetScope: scope,
          cancel: function(){canceled = true;}
        },
        listenerArgs = concat([event], arguments, 1),
        i, length;

    do {
      namedListeners = scope.$$listeners[name] || empty;
      event.currentScope = scope;
      for (i=0, length=namedListeners.length; i<length; i++) {
        try {
          namedListeners[i].apply(null, listenerArgs);
          if (canceled) return;
        } catch (e) {
          scope.$service('$exceptionHandler')(e);
        }
      }
      //traverse upwards
      scope = scope.$parent;
    } while (scope);
  },


  /**
   * @ngdoc function
   * @name angular.scope.$broadcast
   * @function
   *
   * @description
   * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
   * registered {@link angular.scope.$on} listeners.
   *
   * The event life cycle starts at the scope on which `$broadcast` was called. All
   * {@link angular.scope.$on listeners} listening for `name` event on this scope get notified.
   * Afterwards, the event propagates to all direct and indirect scopes of the current scope and
   * calls all registered listeners along the way. The event cannot be canceled.
   *
   * Any exception emmited from the {@link angular.scope.$on listeners} will be passed
   * onto the {@link angular.service.$exceptionHandler $exceptionHandler} service.
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
          current.$service('$exceptionHandler')(e);
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
  }
};


function compileToFn(exp, name) {
  var fn = isString(exp)
    ? expressionCompile(exp)
    : exp;
  assertArgFn(fn, name);
  return fn;
}
