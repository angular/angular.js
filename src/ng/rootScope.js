'use strict';

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope are heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive in terms of speed as well as memory:
 *   - No closures, instead use prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - This means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the beginning (unshift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using an array would be slow since inserts in the middle are expensive; so we use linked lists
 *
 * There are fewer watches than observers. This is why you don't want the observer to be implemented
 * in the same way as watch. Watch requires return of the initialization function which is expensive
 * to construct.
 */


/**
 * @ngdoc provider
 * @name $rootScopeProvider
 * @description
 *
 * Provider for the $rootScope service.
 */

/**
 * @ngdoc method
 * @name $rootScopeProvider#digestTtl
 * @description
 *
 * Sets the number of `$digest` iterations the scope should attempt to execute before giving up and
 * assuming that the model is unstable.
 *
 * The current default is 10 iterations.
 *
 * In complex applications it's possible that the dependencies between `$watch`s will result in
 * several digest iterations. However if an application needs more than the default 10 digest
 * iterations for its model to stabilize then you should investigate what is causing the model to
 * continuously change during the digest.
 *
 * Increasing the TTL could have performance implications, so you should not change it without
 * proper justification.
 *
 * @param {number} limit The number of digest iterations.
 */


/**
 * @ngdoc service
 * @name $rootScope
 * @description
 *
 * Every application has a single root {@link ng.$rootScope.Scope scope}.
 * All other scopes are descendant scopes of the root scope. Scopes provide separation
 * between the model and the view, via a mechanism for watching the model for changes.
 * They also provide event emission/broadcast and subscription facility. See the
 * {@link guide/scope developer guide on scopes}.
 */
function $RootScopeProvider() {
  var TTL = 10;
  var $rootScopeMinErr = minErr('$rootScope');
  var lastDirtyWatch = null;
  var applyAsyncId = null;

  this.digestTtl = function(value) {
    if (arguments.length) {
      TTL = value;
    }
    return TTL;
  };

  function createChildScopeClass(parent) {
    function ChildScope() {
      this.$$watchers = this.$$nextSibling =
          this.$$childHead = this.$$childTail = null;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$id = nextUid();
      this.$$ChildScope = null;
    }
    ChildScope.prototype = parent;
    return ChildScope;
  }

  this.$get = ['$exceptionHandler', '$parse', '$browser',
      function($exceptionHandler, $parse, $browser) {

    function destroyChildScope($event) {
        $event.currentScope.$$destroyed = true;
    }

    function cleanUpScope($scope) {

      if (msie === 9) {
        // There is a memory leak in IE9 if all child scopes are not disconnected
        // completely when a scope is destroyed. So this code will recurse up through
        // all this scopes children
        //
        // See issue https://github.com/angular/angular.js/issues/10706
        $scope.$$childHead && cleanUpScope($scope.$$childHead);
        $scope.$$nextSibling && cleanUpScope($scope.$$nextSibling);
      }

      // The code below works around IE9 and V8's memory leaks
      //
      // See:
      // - https://code.google.com/p/v8/issues/detail?id=2073#c26
      // - https://github.com/angular/angular.js/issues/6794#issuecomment-38648909
      // - https://github.com/angular/angular.js/issues/1313#issuecomment-10378451

      $scope.$parent = $scope.$$nextSibling = $scope.$$prevSibling = $scope.$$childHead =
          $scope.$$childTail = $scope.$root = $scope.$$watchers = null;
    }

    /**
     * @ngdoc type
     * @name $rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link auto.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.) See also the {@link guide/scope Scopes guide} for
     * an in-depth introduction and usage examples.
     *
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * ```js
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * ```
     *
     * When interacting with `Scope` in tests, additional helper methods are available on the
     * instances of `Scope` type. See {@link ngMock.$rootScope.Scope ngMock Scope} for additional
     * details.
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be
     *                                       provided for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *                              append/override services provided by `providers`. This is handy
     *                              when unit-testing and having the need to override a default
     *                              service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$root = this;
      this.$$destroyed = false;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$$isolateBindings = null;
    }

    /**
     * @ngdoc property
     * @name $rootScope.Scope#$id
     *
     * @description
     * Unique scope ID (monotonically increasing) useful for debugging.
     */

     /**
      * @ngdoc property
      * @name $rootScope.Scope#$parent
      *
      * @description
      * Reference to the parent scope.
      */

      /**
       * @ngdoc property
       * @name $rootScope.Scope#$root
       *
       * @description
       * Reference to the root scope.
       */

    Scope.prototype = {
      constructor: Scope,
      /**
       * @ngdoc method
       * @name $rootScope.Scope#$new
       * @kind function
       *
       * @description
       * Creates a new child {@link ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} event.
       * The scope can be removed from the scope hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is
       * desired for the scope and its child scopes to be permanently detached from the parent and
       * thus stop participating in model change detection and listener notification by invoking.
       *
       * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
       *         parent scope. The scope is isolated, as it can not see parent scope properties.
       *         When creating widgets, it is useful for the widget to not accidentally read parent
       *         state.
       *
       * @param {Scope} [parent=this] The {@link ng.$rootScope.Scope `Scope`} that will be the `$parent`
       *                              of the newly created scope. Defaults to `this` scope if not provided.
       *                              This is used when creating a transclude scope to correctly place it
       *                              in the scope hierarchy while maintaining the correct prototypical
       *                              inheritance.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function(isolate, parent) {
        var child;

        parent = parent || this;

        if (isolate) {
          child = new Scope();
          child.$root = this.$root;
        } else {
          // Only create a child scope class if somebody asks for one,
          // but cache it to allow the VM to optimize lookups.
          if (!this.$$ChildScope) {
            this.$$ChildScope = createChildScopeClass(this);
          }
          child = new this.$$ChildScope();
        }
        child.$parent = parent;
        child.$$prevSibling = parent.$$childTail;
        if (parent.$$childHead) {
          parent.$$childTail.$$nextSibling = child;
          parent.$$childTail = child;
        } else {
          parent.$$childHead = parent.$$childTail = child;
        }

        // When the new scope is not isolated or we inherit from `this`, and
        // the parent scope is destroyed, the property `$$destroyed` is inherited
        // prototypically. In all other cases, this property needs to be set
        // when the parent scope is destroyed.
        // The listener needs to be added after the parent is set
        if (isolate || parent != this) child.$on('$destroy', destroyChildScope);

        return child;
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watch
       * @kind function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest
       *   $digest()} and should return the value that will be watched. (`watchExpression` should not change
       *   its value when executed multiple times with the same input because it may be executed multiple
       *   times by {@link ng.$rootScope.Scope#$digest $digest()}. That is, `watchExpression` should be
       *   [idempotent](http://en.wikipedia.org/wiki/Idempotence).
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). Inequality is determined according to reference inequality,
       *   [strict comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)
       *    via the `!==` Javascript operator, unless `objectEquality == true`
       *   (see next point)
       * - When `objectEquality == true`, inequality of the `watchExpression` is determined
       *   according to the {@link angular.equals} function. To save the value of the object for
       *   later comparison, the {@link angular.copy} function is used. This therefore means that
       *   watching complex objects will have adverse memory and performance implications.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire.
       *   This is achieved by rerunning the watchers until no changes are detected. The rerun
       *   iteration limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Be prepared for
       * multiple calls to your `watchExpression` because it will execute multiple times in a
       * single {@link ng.$rootScope.Scope#$digest $digest} cycle if a change is detected.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       *
       *
       * # Example
       * ```js
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);



           // Using a function as a watchExpression
           var food;
           scope.foodCounter = 0;
           expect(scope.foodCounter).toEqual(0);
           scope.$watch(
             // This function returns the value being watched. It is called for each turn of the $digest loop
             function() { return food; },
             // This is the change listener, called when the value returned from the above function changes
             function(newValue, oldValue) {
               if ( newValue !== oldValue ) {
                 // Only increment the counter if the value changed
                 scope.foodCounter = scope.foodCounter + 1;
               }
             }
           );
           // No digest has been run so the counter will be zero
           expect(scope.foodCounter).toEqual(0);

           // Run the digest but since food has not changed count will still be zero
           scope.$digest();
           expect(scope.foodCounter).toEqual(0);

           // Update food and run digest.  Now the counter will increment
           food = 'cheeseburger';
           scope.$digest();
           expect(scope.foodCounter).toEqual(1);

       * ```
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers
       *    a call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {function(newVal, oldVal, scope)} listener Callback called whenever the value
       *    of `watchExpression` changes.
       *
       *    - `newVal` contains the current value of the `watchExpression`
       *    - `oldVal` contains the previous value of the `watchExpression`
       *    - `scope` refers to the current scope
       * @param {boolean=} [objectEquality=false] Compare for object equality using {@link angular.equals} instead of
       *     comparing for reference equality.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
        var get = $parse(watchExp);

        if (get.$$watchDelegate) {
          return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
        }
        var scope = this,
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: prettyPrintExpression || watchExp,
              eq: !!objectEquality
            };

        lastDirtyWatch = null;

        if (!isFunction(listener)) {
          watcher.fn = noop;
        }

        if (!array) {
          array = scope.$$watchers = [];
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);
        incrementWatchersCount(this, 1);

        return function deregisterWatch() {
          if (arrayRemove(array, watcher) >= 0) {
            incrementWatchersCount(scope, -1);
          }
          lastDirtyWatch = null;
        };
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchGroup
       * @kind function
       *
       * @description
       * A variant of {@link ng.$rootScope.Scope#$watch $watch()} where it watches an array of `watchExpressions`.
       * If any one expression in the collection changes the `listener` is executed.
       *
       * - The items in the `watchExpressions` array are observed via standard $watch operation and are examined on every
       *   call to $digest() to see if any items changes.
       * - The `listener` is called whenever any expression in the `watchExpressions` array changes.
       *
       * @param {Array.<string|Function(scope)>} watchExpressions Array of expressions that will be individually
       * watched using {@link ng.$rootScope.Scope#$watch $watch()}
       *
       * @param {function(newValues, oldValues, scope)} listener Callback called whenever the return value of any
       *    expression in `watchExpressions` changes
       *    The `newValues` array contains the current values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    and the `oldValues` array contains the previous values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    The `scope` refers to the current scope.
       * @returns {function()} Returns a de-registration function for all listeners.
       */
      $watchGroup: function(watchExpressions, listener) {
        var oldValues = new Array(watchExpressions.length);
        var newValues = new Array(watchExpressions.length);
        var deregisterFns = [];
        var self = this;
        var changeReactionScheduled = false;
        var firstRun = true;

        if (!watchExpressions.length) {
          // No expressions means we call the listener ASAP
          var shouldCall = true;
          self.$evalAsync(function() {
            if (shouldCall) listener(newValues, newValues, self);
          });
          return function deregisterWatchGroup() {
            shouldCall = false;
          };
        }

        if (watchExpressions.length === 1) {
          // Special case size of one
          return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
            newValues[0] = value;
            oldValues[0] = oldValue;
            listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
          });
        }

        forEach(watchExpressions, function(expr, i) {
          var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
            newValues[i] = value;
            oldValues[i] = oldValue;
            if (!changeReactionScheduled) {
              changeReactionScheduled = true;
              self.$evalAsync(watchGroupAction);
            }
          });
          deregisterFns.push(unwatchFn);
        });

        function watchGroupAction() {
          changeReactionScheduled = false;

          if (firstRun) {
            firstRun = false;
            listener(newValues, newValues, self);
          } else {
            listener(newValues, oldValues, self);
          }
        }

        return function deregisterWatchGroup() {
          while (deregisterFns.length) {
            deregisterFns.shift()();
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchCollection
       * @kind function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching
       * the properties). If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every
       *   call to $digest() to see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include
       *   adding, removing, and moving items belonging to an object or array.
       *
       *
       * # Example
       * ```js
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * ```
       *
       *
       * @param {string|function(scope)} obj Evaluated as {@link guide/expression expression}. The
       *    expression value should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the
       *    collection will trigger a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function called
       *    when a change is detected.
       *    - The `newCollection` object is the newly modified data obtained from the `obj` expression
       *    - The `oldCollection` object is a copy of the former collection data.
       *      Due to performance considerations, the`oldCollection` value is computed only if the
       *      `listener` function declares two or more arguments.
       *    - The `scope` argument refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the
       *    de-registration function is executed, the internal watch operation is terminated.
       */
      $watchCollection: function(obj, listener) {
        $watchCollectionInterceptor.$stateful = true;

        var self = this;
        // the current value, updated on each dirty-check run
        var newValue;
        // a shallow copy of the newValue from the last dirty-check run,
        // updated to match newValue during dirty-check run
        var oldValue;
        // a shallow copy of the newValue from when the last change happened
        var veryOldValue;
        // only track veryOldValue if the listener is asking for it
        var trackVeryOldValue = (listener.length > 1);
        var changeDetected = 0;
        var changeDetector = $parse(obj, $watchCollectionInterceptor);
        var internalArray = [];
        var internalObject = {};
        var initRun = true;
        var oldLength = 0;

        function $watchCollectionInterceptor(_value) {
          newValue = _value;
          var newLength, key, bothNaN, newItem, oldItem;

          // If the new value is undefined, then return undefined as the watch may be a one-time watch
          if (isUndefined(newValue)) return;

          if (!isObject(newValue)) { // if primitive
            if (oldValue !== newValue) {
              oldValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            if (oldValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              oldValue = internalArray;
              oldLength = oldValue.length = 0;
              changeDetected++;
            }

            newLength = newValue.length;

            if (oldLength !== newLength) {
              // if lengths do not match we need to trigger change notification
              changeDetected++;
              oldValue.length = oldLength = newLength;
            }
            // copy the items to oldValue and look for changes.
            for (var i = 0; i < newLength; i++) {
              oldItem = oldValue[i];
              newItem = newValue[i];

              bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
              if (!bothNaN && (oldItem !== newItem)) {
                changeDetected++;
                oldValue[i] = newItem;
              }
            }
          } else {
            if (oldValue !== internalObject) {
              // we are transitioning from something which was not an object into object.
              oldValue = internalObject = {};
              oldLength = 0;
              changeDetected++;
            }
            // copy the items to oldValue and look for changes.
            newLength = 0;
            for (key in newValue) {
              if (hasOwnProperty.call(newValue, key)) {
                newLength++;
                newItem = newValue[key];
                oldItem = oldValue[key];

                if (key in oldValue) {
                  bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                  if (!bothNaN && (oldItem !== newItem)) {
                    changeDetected++;
                    oldValue[key] = newItem;
                  }
                } else {
                  oldLength++;
                  oldValue[key] = newItem;
                  changeDetected++;
                }
              }
            }
            if (oldLength > newLength) {
              // we used to have more keys, need to find them and destroy them.
              changeDetected++;
              for (key in oldValue) {
                if (!hasOwnProperty.call(newValue, key)) {
                  oldLength--;
                  delete oldValue[key];
                }
              }
            }
          }
          return changeDetected;
        }

        function $watchCollectionAction() {
          if (initRun) {
            initRun = false;
            listener(newValue, newValue, self);
          } else {
            listener(newValue, veryOldValue, self);
          }

          // make a copy for the next time a collection is changed
          if (trackVeryOldValue) {
            if (!isObject(newValue)) {
              //primitive
              veryOldValue = newValue;
            } else if (isArrayLike(newValue)) {
              veryOldValue = new Array(newValue.length);
              for (var i = 0; i < newValue.length; i++) {
                veryOldValue[i] = newValue[i];
              }
            } else { // if object
              veryOldValue = {};
              for (var key in newValue) {
                if (hasOwnProperty.call(newValue, key)) {
                  veryOldValue[key] = newValue[key];
                }
              }
            }
          }
        }

        return this.$watch(changeDetector, $watchCollectionAction);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$digest
       * @kind function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and
       * its children. Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change
       * the model, the `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers}
       * until no more listeners are firing. This means that it is possible to get into an infinite
       * loop. This function will throw `'Maximum iteration limit exceeded.'` if the number of
       * iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#$apply $apply()} (typically from within
       * a {@link ng.$compileProvider#directive directive}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with
       * {@link ng.$rootScope.Scope#$watch $watch()} with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * # Example
       * ```js
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);
       * ```
       *
       */
      $digest: function() {
        var watch, value, last,
            watchers,
            length,
            dirty, ttl = TTL,
            next, current, target = this,
            watchLog = [],
            logIdx, logMsg, asyncTask;

        beginPhase('$digest');
        // Check for changes to browser url that happened in sync before the call to $digest
        $browser.$$checkUrlChange();

        if (this === $rootScope && applyAsyncId !== null) {
          // If this is the root scope, and $applyAsync has scheduled a deferred $apply(), then
          // cancel the scheduled $apply and flush the queue of expressions to be evaluated.
          $browser.defer.cancel(applyAsyncId);
          flushApplyAsync();
        }

        lastDirtyWatch = null;

        do { // "while dirty" loop
          dirty = false;
          current = target;

          while (asyncQueue.length) {
            try {
              asyncTask = asyncQueue.shift();
              asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
            } catch (e) {
              $exceptionHandler(e);
            }
            lastDirtyWatch = null;
          }

          traverseScopesLoop:
          do { // "traverse the scopes" loop
            if ((watchers = current.$$watchers)) {
              // process our watches
              length = watchers.length;
              while (length--) {
                try {
                  watch = watchers[length];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if (watch) {
                    if ((value = watch.get(current)) !== (last = watch.last) &&
                        !(watch.eq
                            ? equals(value, last)
                            : (typeof value === 'number' && typeof last === 'number'
                               && isNaN(value) && isNaN(last)))) {
                      dirty = true;
                      lastDirtyWatch = watch;
                      watch.last = watch.eq ? copy(value, null) : value;
                      watch.fn(value, ((last === initWatchVal) ? value : last), current);
                      if (ttl < 5) {
                        logIdx = 4 - ttl;
                        if (!watchLog[logIdx]) watchLog[logIdx] = [];
                        watchLog[logIdx].push({
                          msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                          newVal: value,
                          oldVal: last
                        });
                      }
                    } else if (watch === lastDirtyWatch) {
                      // If the most recently dirty watcher is now clean, short circuit since the remaining watchers
                      // have already been tested.
                      dirty = false;
                      break traverseScopesLoop;
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
            if (!(next = ((current.$$watchersCount && current.$$childHead) ||
                (current !== target && current.$$nextSibling)))) {
              while (current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          // `break traverseScopesLoop;` takes us to here

          if ((dirty || asyncQueue.length) && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: {1}',
                TTL, watchLog);
          }

        } while (dirty || asyncQueue.length);

        clearPhase();

        while (postDigestQueue.length) {
          try {
            postDigestQueue.shift()();
          } catch (e) {
            $exceptionHandler(e);
          }
        }
      },


      /**
       * @ngdoc event
       * @name $rootScope.Scope#$destroy
       * @eventType broadcast on scope being destroyed
       *
       * @description
       * Broadcasted when a scope and its children are being destroyed.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$destroy
       * @kind function
       *
       * @description
       * Removes the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer
       * propagate to the current scope and its children. Removal also implies that the current
       * scope is eligible for garbage collection.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link ng.directive:ngRepeat ngRepeat} for managing the
       * unrolling of the loop.
       *
       * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
       * Application code can register a `$destroy` event handler that will give it a chance to
       * perform any necessary cleanup.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */
      $destroy: function() {
        // We can't destroy a scope that has been already destroyed.
        if (this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (this === $rootScope) {
          //Remove handlers attached to window when $rootScope is removed
          $browser.$$applicationDestroyed();
        }

        incrementWatchersCount(this, -this.$$watchersCount);
        for (var eventName in this.$$listenerCount) {
          decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
        }

        // sever all the references to parent scopes (after this cleanup, the current scope should
        // not be retained by any of our references and should be eligible for garbage collection)
        if (parent && parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
        if (parent && parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // Disable listeners, watchers and apply/digest methods
        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
        this.$on = this.$watch = this.$watchGroup = function() { return noop; };
        this.$$listeners = {};

        // Disconnect the next sibling to prevent `cleanUpScope` destroying those too
        this.$$nextSibling = null;
        cleanUpScope(this);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$eval
       * @kind function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in
       * the expression are propagated (uncaught). This is useful when evaluating Angular
       * expressions.
       *
       * # Example
       * ```js
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * ```
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr, locals) {
        return $parse(expr)(this, locals);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$evalAsync
       * @kind function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only
       * that:
       *
       *   - it will execute after the function that scheduled the evaluation (preferably before DOM
       *     rendering).
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after
       *     `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle
       * will be scheduled. However, it is encouraged to always call code that changes the model
       * from within an `$apply` call. That includes code evaluated via `$evalAsync`.
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       */
      $evalAsync: function(expr, locals) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async
        // task also schedule async auto-flush
        if (!$rootScope.$$phase && !asyncQueue.length) {
          $browser.defer(function() {
            if (asyncQueue.length) {
              $rootScope.$digest();
            }
          });
        }

        asyncQueue.push({scope: this, expression: expr, locals: locals});
      },

      $$postDigest: function(fn) {
        postDigestQueue.push(fn);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$apply
       * @kind function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular
       * framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life
       * cycle of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
       * ```js
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * ```
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the
       *    expression was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          beginPhase('$apply');
          try {
            return this.$eval(expr);
          } finally {
            clearPhase();
          }
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            throw e;
          }
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$applyAsync
       * @kind function
       *
       * @description
       * Schedule the invocation of $apply to occur at a later time. The actual time difference
       * varies across browsers, but is typically around ~10 milliseconds.
       *
       * This can be used to queue up multiple expressions which need to be evaluated in the same
       * digest.
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       */
      $applyAsync: function(expr) {
        var scope = this;
        expr && applyAsyncQueue.push($applyAsyncExpression);
        scheduleApplyAsync();

        function $applyAsyncExpression() {
          scope.$eval(expr);
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$on
       * @kind function
       *
       * @description
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for
       * discussion of event life cycle.
       *
       * The event listener function format is: `function(event, args...)`. The `event` object
       * passed into the listener has the following attributes:
       *
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or
       *     `$broadcast`-ed.
       *   - `currentScope` - `{Scope}`: the scope that is currently handling the event. Once the
       *     event propagates through the scope hierarchy, this property is set to null.
       *   - `name` - `{string}`: name of the event.
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel
       *     further event propagation (available only for events that were `$emit`-ed).
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag
       *     to true.
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event, ...args)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        var current = this;
        do {
          if (!current.$$listenerCount[name]) {
            current.$$listenerCount[name] = 0;
          }
          current.$$listenerCount[name]++;
        } while ((current = current.$parent));

        var self = this;
        return function() {
          var indexOfListener = namedListeners.indexOf(listener);
          if (indexOfListener !== -1) {
            namedListeners[indexOfListener] = null;
            decrementListenerCount(self, 1, name);
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$emit
       * @kind function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event traverses upwards toward the root scope and calls all
       * registered listeners along the way. The event will stop propagating if one of the listeners
       * cancels it.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object (see {@link ng.$rootScope.Scope#$on}).
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i = 0, length = namedListeners.length; i < length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
              namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //if any listener on the current scope stops propagation, prevent bubbling
          if (stopPropagation) {
            event.currentScope = null;
            return event;
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        event.currentScope = null;

        return event;
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$broadcast
       * @kind function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event propagates to all direct and indirect scopes of the current
       * scope and calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to broadcast.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            };

        if (!target.$$listenerCount[name]) return event;

        var listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        while ((current = next)) {
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i = 0, length = listeners.length; i < length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          // (though it differs due to having the extra check for $$listenerCount)
          if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
              (current !== target && current.$$nextSibling)))) {
            while (current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        }

        event.currentScope = null;
        return event;
      }
    };

    var $rootScope = new Scope();

    //The internal queues. Expose them on the $rootScope for debugging/testing purposes.
    var asyncQueue = $rootScope.$$asyncQueue = [];
    var postDigestQueue = $rootScope.$$postDigestQueue = [];
    var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];

    return $rootScope;


    function beginPhase(phase) {
      if ($rootScope.$$phase) {
        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
      }

      $rootScope.$$phase = phase;
    }

    function clearPhase() {
      $rootScope.$$phase = null;
    }

    function incrementWatchersCount(current, count) {
      do {
        current.$$watchersCount += count;
      } while ((current = current.$parent));
    }

    function decrementListenerCount(current, count, name) {
      do {
        current.$$listenerCount[name] -= count;

        if (current.$$listenerCount[name] === 0) {
          delete current.$$listenerCount[name];
        }
      } while ((current = current.$parent));
    }

    /**
     * function used as an initial value for watchers.
     * because it's unique we can easily tell it apart from other values
     */
    function initWatchVal() {}

    function flushApplyAsync() {
      while (applyAsyncQueue.length) {
        try {
          applyAsyncQueue.shift()();
        } catch (e) {
          $exceptionHandler(e);
        }
      }
      applyAsyncId = null;
    }

    function scheduleApplyAsync() {
      if (applyAsyncId === null) {
        applyAsyncId = $browser.defer(function() {
          $rootScope.$apply(flushApplyAsync);
        });
      }
    }
  }];
}
