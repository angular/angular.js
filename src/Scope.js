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
};


/**
 * @workInProgress
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
  this.$$phase = this.$parent = this.$$watchers = this.$$observers =
    this.$$nextSibling = this.$$childHead = this.$$childTail = null;
  this['this'] = this.$root =  this;
}

/**
 * @workInProgress
 * @ngdoc property
 * @name angular.scope.$id
 * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
 *   debugging.
 */

/**
 * @workInProgress
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
 * @workInProgress
 * @ngdoc property
 * @name angular.scope.$root
 * @returns {Scope} The root scope of the current scope hierarchy.
 */

/**
 * @workInProgress
 * @ngdoc property
 * @name angular.scope.$parent
 * @returns {Scope} The parent scope of the current scope.
 */


Scope.prototype = {
  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$new
   * @function
   *
   * @description
   * Creates a new child {@link angular.scope scope}. The new scope can optionally behave as a
   * controller. The parent scope will propagate the {@link angular.scope.$digest $digest()} and
   * {@link angular.scope.$flush $flush()} events. The scope can be removed from the scope
   * hierarchy using {@link angular.scope.$destroy $destroy()}.
   *
   * {@link angular.scope.$destroy $destroy()} must be called on a scope when it is desired for
   * the scope and its child scopes to be permanently detached from the parent and thus stop
   * participating in model change detection and listener notification by invoking.
   *
   * @param {function()=} constructor Constructor function which the scope should behave as.
   * @param {curryArguments=} ... Any additional arguments which are curried into the constructor.
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
    child.$parent = this;
    child.$id = nextUid();
    child.$$phase = child.$$watchers = child.$$observers =
      child.$$nextSibling = child.$$childHead = child.$$childTail = null;
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
   * @workInProgress
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
   *   is achieving my rerunning the watchers until no changes are detected. The rerun iteration
   *   limit is 100 to prevent infinity loop deadlock.
   *
   * # When to use `$watch`?
   *
   * The `$watch` should be used from within controllers to listen on properties *immediately* after
   * a stimulus is applied to the system (see {@link angular.scope.$apply $apply()}). This is in
   * contrast to {@link angular.scope.$observe $observe()} which is used from within the directives
   * and which gets applied at some later point in time. In addition
   * {@link angular.scope.$observe $observe()} must not modify the model.
   *
   * If you want to be notified whenever {@link angular.scope.$digest $digest} is called,
   * you can register an `watchExpression` function with no `listener`. (Since `watchExpression`,
   * can execute multiple times per {@link angular.scope.$digest $digest} cycle when a change is
   * detected, be prepared for multiple calls to your listener.)
   *
   * # `$watch` vs `$observe`
   *
   * <table class="table">
   *   <tr>
   *     <th></td>
   *     <th>{@link angular.scope.$watch $watch()}</th>
   *     <th>{@link angular.scope.$observe $observe()}</th>
   *   </tr>
   *   <tr><th colspan="3" class="section">When to use it?</th></tr>
   *   <tr>
   *     <th>Purpose</th>
   *     <td>Application behavior (including further model mutation) in response to a model
   *         mutation.</td>
   *     <td>Update the DOM in response to a model mutation.</td>
   *   </tr>
   *   <tr>
   *     <th>Used from</th>
   *     <td>{@link angular.directive.ng:controller controller}</td>
   *     <td>{@link angular.directive directives}</td>
   *   </tr>
   *   <tr><th colspan="3" class="section">What fires listeners?</th></tr>
   *   <tr>
   *     <th>Directly</th>
   *     <td>{@link angular.scope.$digest $digest()}</td>
   *     <td>{@link angular.scope.$flush $flush()}</td>
   *   </tr>
   *   <tr>
   *     <th>Indirectly via {@link angular.scope.$apply $apply()}</th>
   *     <td>{@link angular.scope.$apply $apply} calls
   *         {@link angular.scope.$digest $digest()} after apply argument executes.</td>
   *     <td>{@link angular.scope.$apply $apply} schedules
   *         {@link angular.scope.$flush $flush()} at some future time via
   *         {@link angular.service.$updateView $updateView}</td>
   *   </tr>
   *   <tr><th colspan="3" class="section">API contract</th></tr>
   *   <tr>
   *     <th>Model mutation</th>
   *     <td>allowed: detecting mutations requires one or mare calls to `watchExpression' per
   *         {@link angular.scope.$digest $digest()} cycle</td>
   *     <td>not allowed: called once per {@link angular.scope.$flush $flush()} must be
   *         {@link http://en.wikipedia.org/wiki/Idempotence idempotent}
   *         (function without side-effects which can be called multiple times.)</td>
   *   </tr>
   *   <tr>
   *     <th>Initial Value</th>
   *     <td>uses the current value of `watchExpression` as the initial value. Does not fire on
   *         initial call to {@link angular.scope.$digest $digest()}, unless `watchExpression` has
   *         changed form the initial value.</td>
   *     <td>fires on first run of {@link angular.scope.$flush $flush()} regardless of value of
   *         `observeExpression`</td>
   *   </tr>
   * </table>
   *
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
   * @returns {function()} a function which will call the `listener` with apprariate arguments.
   *    Useful for forcing initialization of listener.
   */
  $watch: function(watchExp, listener) {
    var scope = this;
    var get = compileToFn(watchExp, 'watch');
    var listenFn = compileToFn(listener || noop, 'listener');
    var array = scope.$$watchers;
    if (!array) {
      array = scope.$$watchers = [];
    }
    // we use unshift since we use a while loop in $digest for speed.
    // the while loop reads in reverse order.
    array.unshift({
      fn: listenFn,
      last: copy(get(scope)),
      get: get
    });
    // we only return the initialization function for $watch (not for $observe), since creating
    // function cost time and memory, and $observe functions do not need it.
    return function() {
      var value = get(scope);
      listenFn(scope, value, value);
    };
  },

  /**
   * @workInProgress
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
       scope.$flush('name', function(scope, newValue, oldValue) { counter = counter + 1; });
       expect(scope.counter).toEqual(0);

       scope.$flush();
       // no variable change
       expect(scope.counter).toEqual(0);

       scope.name = 'adam';
       scope.$flush();
       expect(scope.counter).toEqual(1);
     </pre>
   *
   * @returns {number} number of {@link angular.scope.$watch listeners} which fired.
   *
   */
  $digest: function() {
    var child,
        watch, value, last,
        watchers = this.$$watchers,
        length, count = 0,
        iterationCount, ttl = 100;

    if (this.$$phase) {
      throw Error(this.$$phase + ' already in progress');
    }
    this.$$phase = '$digest';
    do {
      iterationCount = 0;
      if (watchers) {
        // process our watches
        length = watchers.length;
        while (length--) {
          try {
            watch = watchers[length];
            // Most common watches are on primitives, in which case we can short
            // circuit it with === operator, only when === fails do we use .equals
            if ((value = watch.get(this)) !== (last = watch.last) && !equals(value, last)) {
              iterationCount++;
              watch.fn(this, watch.last = copy(value), last);
            }
          } catch (e) {
            this.$service('$exceptionHandler')(e);
          }
        }
      }
      child = this.$$childHead;
      while(child) {
        iterationCount += child.$digest();
        child = child.$$nextSibling;
      }
      count += iterationCount;
      if(!(ttl--)) {
        throw Error('100 $digest() iterations reached. Aborting!');
      }
    } while (iterationCount);
    this.$$phase = null;
    return count;
  },

  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$observe
   * @function
   *
   * @description
   * Registers a `listener` callback to be executed during the {@link angular.scope.$flush $flush()}
   * phase when the `observeExpression` changes..
   *
   * - The `observeExpression` is called on every call to {@link angular.scope.$flush $flush()} and
   *   should return the value which will be observed.
   * - The `listener` is called only when the value from the current `observeExpression` and the
   *   previous call to `observeExpression' are not equal. The inequality is determined according to
   *   {@link angular.equals} function. To save the value of the object for later comparison
   *   {@link angular.copy} function is used. It also means that watching complex options will
   *   have adverse memory and performance implications.
   *
   * # When to use `$observe`?
   *
   * {@link angular.scope.$observe $observe()} is used from within directives and gets applied at
   * some later point in time. Addition {@link angular.scope.$observe $observe()} must not
   * modify the model. This is in contrast to {@link angular.scope.$watch $watch()} which should be
   * used from within controllers to trigger a callback *immediately* after a stimulus is applied
   * to the system (see {@link angular.scope.$apply $apply()}).
   *
   * If you want to be notified whenever {@link angular.scope.$flush $flush} is called,
   * you can register an `observeExpression` function with no `listener`.
   *
   *
   * # `$watch` vs `$observe`
   *
   * <table class="table">
   *   <tr>
   *     <th></td>
   *     <th>{@link angular.scope.$watch $watch()}</th>
   *     <th>{@link angular.scope.$observe $observe()}</th>
   *   </tr>
   *   <tr><th colspan="3" class="section">When to use it?</th></tr>
   *   <tr>
   *     <th>Purpose</th>
   *     <td>Application behavior (including further model mutation) in response to a model
   *         mutation.</td>
   *     <td>Update the DOM in response to a model mutation.</td>
   *   </tr>
   *   <tr>
   *     <th>Used from</th>
   *     <td>{@link angular.directive.ng:controller controller}</td>
   *     <td>{@link angular.directive directives}</td>
   *   </tr>
   *   <tr><th colspan="3" class="section">What fires listeners?</th></tr>
   *   <tr>
   *     <th>Directly</th>
   *     <td>{@link angular.scope.$digest $digest()}</td>
   *     <td>{@link angular.scope.$flush $flush()}</td>
   *   </tr>
   *   <tr>
   *     <th>Indirectly via {@link angular.scope.$apply $apply()}</th>
   *     <td>{@link angular.scope.$apply $apply} calls
   *         {@link angular.scope.$digest $digest()} after apply argument executes.</td>
   *     <td>{@link angular.scope.$apply $apply} schedules
   *         {@link angular.scope.$flush $flush()} at some future time via
   *         {@link angular.service.$updateView $updateView}</td>
   *   </tr>
   *   <tr><th colspan="3" class="section">API contract</th></tr>
   *   <tr>
   *     <th>Model mutation</th>
   *     <td>allowed: detecting mutations requires one or mare calls to `watchExpression' per
   *         {@link angular.scope.$digest $digest()} cycle</td>
   *     <td>not allowed: called once per {@link angular.scope.$flush $flush()} must be
   *         {@link http://en.wikipedia.org/wiki/Idempotence idempotent}
   *         (function without side-effects which can be called multiple times.)</td>
   *   </tr>
   *   <tr>
   *     <th>Initial Value</th>
   *     <td>uses the current value of `watchExpression` as the initial value. Does not fire on
   *         initial call to {@link angular.scope.$digest $digest()}, unless `watchExpression` has
   *         changed form the initial value.</td>
   *     <td>fires on first run of {@link angular.scope.$flush $flush()} regardless of value of
   *         `observeExpression`</td>
   *   </tr>
   * </table>
   *
   * # Example
     <pre>
       var scope = angular.scope();
       scope.name = 'misko';
       scope.counter = 0;

       expect(scope.counter).toEqual(0);
       scope.$flush('name', function(scope, newValue, oldValue) { counter = counter + 1; });
       expect(scope.counter).toEqual(0);

       scope.$flush();
       // no variable change
       expect(scope.counter).toEqual(0);

       scope.name = 'adam';
       scope.$flush();
       expect(scope.counter).toEqual(1);
     </pre>
   *
   * @param {(function()|string)} observeExpression Expression that is evaluated on each
   *    {@link angular.scope.$flush $flush} cycle. A change in the return value triggers a
   *    call to the `listener`.
   *
   *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
   *    - `function(scope)`: called with current `scope` as a parameter.
   * @param {(function()|string)=} listener Callback called whenever the return value of
   *   the `observeExpression` changes.
   *
   *    - `string`: Evaluated as {@link guide/dev_guide.expressions expression}
   *    - `function(scope, newValue, oldValue)`: called with current `scope` an previous and
   *       current values as parameters.
   */
  $observe: function(watchExp, listener) {
    var array = this.$$observers;

    if (!array) {
      array = this.$$observers = [];
    }
    // we use unshift since we use a while loop in $flush for speed.
    // the while loop reads in reverse order.
    array.unshift({
      fn: compileToFn(listener || noop, 'listener'),
      last: NaN,
      get:  compileToFn(watchExp, 'watch')
    });
  },

  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$flush
   * @function
   *
   * @description
   * Process all of the {@link angular.scope.$observe observers} of the current scope
   * and its children.
   *
   * Usually you don't call `$flush()` directly in
   * {@link angular.directive.ng:controller controllers} or in {@link angular.directive directives}.
   * Instead a call to {@link angular.scope.$apply $apply()} (typically from within a
   * {@link angular.directive directive}) will scheduled a call to `$flush()` (with the
   * help of the {@link angular.service.$updateView $updateView} service).
   *
   * If you want to be notified whenever `$flush()` is called,
   * you can register a `observeExpression` function  with {@link angular.scope.$observe $observe()}
   * with no `listener`.
   *
   * You may have a need to call `$flush()` from within unit-tests, to simulate the scope
   * life-cycle.
   *
   * # Example
     <pre>
       var scope = angular.scope();
       scope.name = 'misko';
       scope.counter = 0;

       expect(scope.counter).toEqual(0);
       scope.$flush('name', function(scope, newValue, oldValue) { counter = counter + 1; });
       expect(scope.counter).toEqual(0);

       scope.$flush();
       // no variable change
       expect(scope.counter).toEqual(0);

       scope.name = 'adam';
       scope.$flush();
       expect(scope.counter).toEqual(1);
     </pre>
   *
   */
  $flush: function() {
    var observers = this.$$observers,
        child,
        length,
        observer, value, last;

    if (this.$$phase) {
      throw Error(this.$$phase + ' already in progress');
    }
    this.$$phase = '$flush';
    if (observers) {
      // process our watches
      length = observers.length;
      while (length--) {
        try {
          observer = observers[length];
          // Most common watches are on primitives, in which case we can short
          // circuit it with === operator, only when === fails do we use .equals
          if ((value = observer.get(this)) !== (last = observer.last) && !equals(value, last)) {
            observer.fn(this, observer.last = copy(value), last);
          }
        } catch (e){
          this.$service('$exceptionHandler')(e);
        }
      }
    }
    // observers can create new children
    child = this.$$childHead;
    while(child) {
      child.$flush();
      child = child.$$nextSibling;
    }
    this.$$phase = null;
  },

  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$destroy
   * @function
   *
   * @description
   * Remove the current scope (and all of its children) from the parent scope. Removal implies
   * that calls to {@link angular.scope.$digest $digest()} and
   * {@link angular.scope.$flush $flush()} will no longer propagate to the current scope and its
   * children. Removal also implies that the current scope is eligible for garbage collection.
   *
   * The `$destroy()` is usually used by directives such as
   * {@link angular.widget.@ng:repeat ng:repeat} for managing the unrolling of the loop.
   *
   */
  $destroy: function() {
    if (this.$root == this) return; // we can't remove the root node;
    var parent = this.$parent;
    var child = parent.$$childHead;
    var lastChild = null;
    var nextChild = null;
    // We have to do a linear search, since we don't have doubly link list.
    // But this is intentional since removals are rare, and doubly link list is not free.
    while(child) {
      if (child == this) {
        nextChild = child.$$nextSibling;
        if (parent.$$childHead == child) {
          parent.$$childHead = nextChild;
        }
        if (lastChild) {
          lastChild.$$nextSibling = nextChild;
        }
        if (parent.$$childTail == child) {
          parent.$$childTail = lastChild;
        }
        return; // stop iterating we found it
      } else {
        lastChild = child;
        child = child.$$nextSibling;
      }
    }
  },

  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$eval
   * @function
   *
   * @description
   * Executes the expression on the current scope returning the result. Any exceptions in the
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
      ? parser(expr).statements()
      : expr || noop;
    return fn(this);
  },

  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.scope.$apply
   * @function
   *
   * @description
   * `$apply()` is used to execute an expression in angular from outside of the angular framework.
   * (For example from browser DOM events, setTimeout, XHR or third party libraries).
   * Because we are calling into the angular framework we need to perform proper scope life-cycle
   * of {@link angular.service.$exceptionHandler exception handling},
   * {@link angular.scope.$digest executing watches} and scheduling
   * {@link angular.service.$updateView updating of the view} which in turn
   * {@link angular.scope.$digest executes observers} to update the DOM.
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
          $updateView();
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
   * 4. A DOM update is scheduled using the {@link angular.service.$updateView $updateView} service.
   *    The `$updateView` may merge multiple update requests into a single update, if the requests
   *    are issued in close time proximity.
   * 6. The {@link angular.service.$updateView $updateView} service then fires DOM
   *    {@link angular.scope.$observe observers} using the {@link angular.scope.$flush $flush()}
   *    method.
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
      this.$service('$updateView')();
    }
  }
};

function compileToFn(exp, name) {
  var fn = isString(exp)
    ? parser(exp).statements()
    : exp;
  assertArgFn(fn, name);
  return fn;
}
