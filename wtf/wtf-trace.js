/**
 * https://github.com/google/tracing-framework
 * Copyright 2013 Google, Inc. All Rights Reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found at https://github.com/google/tracing-framework/blob/master/LICENSE.
 */

/**
 * @fileoverview Web Tracing Framework shim.
 * This file gives compile-time control over the WTF API, allowing it to be
 * type-checked and extern-free when enabled and completely compiled out when
 * disabled.
 *
 * WTF, when used in release projects, should always be called through this
 * API. *Never* use the global 'wtf' object directly, as it may not exist or
 * may change. This file is versioned to prevent such issues.
 *
 * This file contains only the tracing-related functions that are exported in
 * compiled WTF builds. The signatures and descriptions are copied out
 * verbatim. Any types required to keep the compiler happy when looking at this
 * file are exposed as either dummy typedefs or mock objects.
 *
 * When this file is included in a compiled library all of these methods will
 * be renamed. By using 'WTF' as a namespace instead of 'wtf' there's no
 * risk of collision when running uncompiled.
 *
 * Original source: https://www.github.com/google/tracing-framework/
 *
 * @author benvanik@google.com (Ben Vanik)
 */


(function(global, exports) {

// NOTE: this file is kept structurally similar to wtf-trace-closure.js.
//       It should not deviate except where necessary. I'd really like to
//       autogenerate these files.


// Setup the 'namespaces'.
var WTF = exports;
WTF.data = {};
WTF.io = {};
WTF.trace = {};
WTF.trace.events = {};


// goog.nullFunction
function nullFunction() {};
// goog.identityFunction
function identityFunction(a) { return a; };


/**
 * The API version expected by the shim.
 * If WTF is present but its {@code wtf.trace.API_VERSION} does not match
 * this value it will be ignored. This allows code instrumented with older
 * versions of the API to keep working (without tracing) when a newer version
 * of the API is present in the page. Since we are a debugging tool no effort is
 * made to allow differing versions to work together.
 * @type {number}
 * @const
 * @private
 */
WTF.EXPECTED_API_VERSION_ = 2;


/**
 * Whether WTF is enabled and present in the current global context.
 * This will only be true if the master enabled flag is true, 'wtf' is in the
 * global scope, and the version of WTF matches this shim.
 * If code really wants to see if WTF is present and usable, use this instead of
 * just {@see #ENABLED}.
 * @type {boolean}
 * @const
 */
WTF.PRESENT = !!global['wtf'] &&
    (global['wtf']['trace']['API_VERSION'] == WTF.EXPECTED_API_VERSION_);


/**
 * Whether the runtime can provide high-resolution times.
 * If this is false times are likely in milliseconds and largely useless.
 * @type {boolean}
 */
WTF.hasHighResolutionTimes = WTF.PRESENT ?
    global['wtf']['hasHighResolutionTimes'] : false;


/**
 * Returns the wall time that {@see wtf#now} is relative to.
 * This is often the page load time.
 *
 * @return {number} A time, in ms.
 */
WTF.timebase = WTF.PRESENT ?
    global['wtf']['timebase'] : function() { return 0; };


/**
 * Returns a non-wall time timestamp in milliseconds.
 * If available this will use a high precision timer. Otherwise it will fall
 * back to the default browser time.
 *
 * The time value is relative to page navigation, not wall time. Only use it for
 * relative measurements.
 *
 * @return {number} A monotonically increasing timer with sub-millisecond
 *      resolution (if supported).
 */
WTF.now = WTF.PRESENT ?
    global['wtf']['now'] : function() { return 0; };


/**
 * @typedef {Array.<number>|Uint8Array}
 */
WTF.io.ByteArray;


/**
 * @typedef {Object}
 */
WTF.trace.Zone;


/**
 * @typedef {Object}
 */
WTF.trace.Scope;


/**
 * @typedef {Object}
 */
WTF.trace.Flow;


/**
 * @typedef {Object}
 */
WTF.trace.TimeRange;


/**
 * Event behavior flag bitmask.
 * Values can be ORed together to indicate different behaviors an event has.
 *
 * This is copied from {@code wtf/data/eventflag.js}.
 * @enum {number}
 */
WTF.data.EventFlag = {
  /**
   * Event is expected to occur at a very high frequency.
   * High frequency events will be optimized for size more than other event
   * types. Event arguments may also receive more preprocessing when being
   * recorded, such as string interning/etc.
   */
  HIGH_FREQUENCY: (1 << 1),

  /**
   * Event represents some system event that should not be counted towards user
   * code. This can include things such as runtime events (GCs/etc) and tracing
   * framework time (buffer swaps/etc).
   */
  SYSTEM_TIME: (1 << 2),

  /**
   * Event represents some internal system event such as flow control events.
   * If an event has this flag then it will never be shown in the UI and most
   * parts of the system will ignore it. For some special events they will be
   * handled at load-time and never even delivered to the database.
   */
  INTERNAL: (1 << 3),

  /**
   * Event arguments will be appended to the containing scope's arguments,
   * overwritting any with the same name.
   *
   * If this is combined with the INTERNAL flag then the event is assumed to
   * be a built-in system append event and will have special handling.
   */
  APPEND_SCOPE_DATA: (1 << 4),

  /**
   * Event is a builtin event.
   * Only events defined by the tracing framework should set this bit. User
   * events should not have this flag set and may be ignored if they do.
   */
  BUILTIN: (1 << 5),

  /**
   * Event arguments will be appended to the given flow's data, overwritting
   * any with the same name. The first argument must be a flow ID named
   * 'id' like 'flowId id'.
   *
   * If this is combined with the INTERNAL flag then the event is assumed to
   * be a built-in system append event and will have special handling.
   */
  APPEND_FLOW_DATA: (1 << 6)
};


/**
 * Default zone types.
 * Any string value is valid, however these are standard ones.
 *
 * This is copied from {@code wtf/data/zonetype.js}.
 * @enum {string}
 */
WTF.data.ZoneType = {
  /**
   * Primary script context.
   * Usually just user Javascript scopes. This is the default scope created for
   * all traces.
   */
  SCRIPT: 'script',

  /**
   * Native script context.
   * Native runtime scopes, such as the C++ calls above the Javascript.
   */
  NATIVE_SCRIPT: 'native_script',

  /**
   * Native GPU thread context.
   * This is not the GPU itself but instead the thread calling GPU driver
   * methods.
   */
  NATIVE_GPU: 'native_gpu',

  /**
   * Native browser context.
   * This is the browser thread that usually routes input events and other
   * global operations.
   */
  NATIVE_BROWSER: 'native_browser'
};


/**
 * Main entry point for the tracing API.
 * This must be called as soon as possible and preferably before any application
 * code is executed (or even included on the page).
 *
 * This method does not setup a tracing session, but prepares the environment
 * for one. It can be called many times but the options provided are not updated
 * once it's been called.
 *
 * @param {Object=} opt_options Options overrides.
 * @return {*} Ignored.
 */
WTF.trace.prepare = WTF.PRESENT ?
    global['wtf']['trace']['prepare'] : nullFunction;


/**
 * Shuts down the tracing system.
 */
WTF.trace.shutdown = WTF.PRESENT ?
    global['wtf']['trace']['shutdown'] : nullFunction;


/**
 * Starts a new tracing session.
 * The session mode is determined by the options provided, defaulting to
 * snapshotting. See {@code wtf.trace.mode} and {@code wtf.trace.target} for
 * more information.
 *
 * {@see WTF.trace#prepare} must have been called prior to calling this
 * function.
 *
 * @param {Object=} opt_options Options overrides.
 */
WTF.trace.start = WTF.PRESENT ?
    global['wtf']['trace']['start'] : nullFunction;


/**
 * Takes a snapshot of the current state.
 * A session must be actively recording. This call is ignored if the session
 * does not support snapshotting.
 * @param {*=} opt_targetValue Stream target value.
 */
WTF.trace.snapshot = WTF.PRESENT ?
    global['wtf']['trace']['snapshot'] : nullFunction;


/**
 * Asynchronously snapshots all contexts.
 * This will take a snapshot of the current context as well as any dependent
 * ones such as servers or worker threads. The results are sent to the callback
 * when they have all been returned.
 * If the call is going to be ignored (no active session) or fails the callback
 * will fire on the next javascript tick with a null value.
 *
 * @param {function(this:T, Array.<!WTF.io.ByteArray>)} callback Function called
 *     when all buffers are available. The value will be null if an error
 *     occurred.
 * @param {T=} opt_scope Callback scope.
 * @template T
 */
WTF.trace.snapshotAll = WTF.PRESENT ?
    global['wtf']['trace']['snapshotAll'] : nullFunction;


/**
 * Clears all data in the current session by resetting all buffers.
 * This is only valid in snapshotting sessions.
 */
WTF.trace.reset = WTF.PRESENT ?
    global['wtf']['trace']['reset'] : nullFunction;


/**
 * Stops the current session and disposes it.
 */
WTF.trace.stop = WTF.PRESENT ?
    global['wtf']['trace']['stop'] : nullFunction;


/**
 * Creates a new execution zone.
 * Execution zones are used to group regions of code in the trace stream.
 * For example, one zone may be 'Page' to indicate all page JS and another
 * 'Worker' to show events from a web worker.
 * @param {string} name Zone name.
 * @param {string} type Zone type. This should be one of the
 *     {@see WTF.data.ZoneType} values.
 * @param {string} location Zone location (such as URI of the script).
 * @return {WTF.trace.Zone} Zone used for future calls.
 */
WTF.trace.createZone = WTF.PRESENT ?
    global['wtf']['trace']['createZone'] : nullFunction;


/**
 * Deletes an execution zone.
 * The zone ID may be reused.
 * @param {WTF.trace.Zone} zone Zone returned from {@see #createZone}.
 */
WTF.trace.deleteZone = WTF.PRESENT ?
    global['wtf']['trace']['deleteZone'] : nullFunction;


/**
 * Pushes a zone.
 * @param {WTF.trace.Zone} zone Zone returned from {@see #createZone}.
 */
WTF.trace.pushZone = WTF.PRESENT ?
    global['wtf']['trace']['pushZone'] : nullFunction;


/**
 * Pops the active zone.
 */
WTF.trace.popZone = WTF.PRESENT ?
    global['wtf']['trace']['popZone'] : nullFunction;


/**
 * This must be matched with a {@see #leaveScope} that takes the return value.
 *
 * It is strongly recommended that a custom enter scope event should be used
 * instead of this, as the overhead required to write the scope name is
 * non-trivial. Only use this when the name changes many times at runtime or
 * you're hacking something together. See {@see WTF.trace.events.createScope}.
 *
 * Example:
 * <code>
 * function myFunction() {
 *   var scope = WTF.trace.enterScope('myFunction');
 *   var result = ...;
 *   return WTF.trace.leaveScope(scope, result);
 * }
 * </code>
 *
 * @param {string} name Scope name.
 * @param {number=} opt_time Time for the enter; omit to use the current time.
 * @return {WTF.trace.Scope} An initialized scope object.
 */
WTF.trace.enterScope = WTF.PRESENT ?
    global['wtf']['trace']['enterScope'] : nullFunction;


/**
 * Enters a tracing implementation overhead scope.
 * This should only be used by the tracing framework and extension to indicate
 * time used by non-user tasks.
 * @param {number=} opt_time Time for the enter; omit to use the current time.
 * @return {WTF.trace.Scope} An initialized scope object.
 */
WTF.trace.enterTracingScope = WTF.PRESENT ?
    global['wtf']['trace']['enterTracingScope'] : nullFunction;


/**
 * Leaves a scope.
 * @param {WTF.trace.Scope} scope Scope to leave. This is the result of a
 *     previous call to {@see #enterScope} or a custom enter scope function.
 * @param {T=} opt_result Optional result to chain.
 * @param {number=} opt_time Time for the leave; omit to use the current time.
 * @return {T|undefined} The value of the {@code opt_result} parameter.
 * @template T
 */
WTF.trace.leaveScope = WTF.PRESENT ?
    global['wtf']['trace']['leaveScope'] :
    function(scope, opt_result, opt_time) {
      return opt_result;
    };


/**
 * Appends a named argument of any type to the current scope.
 * The data added is keyed by name, and existing data with the same name will
 * be overwritten.
 *
 * Repeated calls with the same name and value type will be optimized at
 * runtime. To ensure predictable performance it's better to use a custom
 * instance event with the {@see wtf.data.EventFlag#APPEND_SCOPE_DATA} flag set.
 *
 * But, in general, you should avoid using this if you can. Appending data
 * involves additional overhead at runtime and in the file compared to just
 * passing the arguments to the function.
 *
 * No, really, this JSON stringifies whatever is passed to it and will skew
 * your results. Don't use it.
 *
 * Example:
 * <code>
 * my.Type.prototype.someMethod = function() {
 *   // This method is traced automatically by traceMethods, but more data
 *   // is needed:
 *   WTF.trace.appendScopeData('bar', 123);
 *   WTF.trace.appendScopeData('foo', {
 *     'complex': ['data']
 *   });
 * };
 * WTF.trace.instrumentType(...my.Type...);
 * </code>
 *
 * @param {string} name Argument name. Must be ASCII.
 * @param {*} value Value. Will be JSON stringified. If this is a number it
 *      will be converted to an int32.
 * @param {number=} opt_time Time for the enter; omit to use the current time.
 */
WTF.trace.appendScopeData = WTF.PRESENT ?
    global['wtf']['trace']['appendScopeData'] : nullFunction;


/**
 * Branches the flow.
 * If no parent flow is given then the current scope flow is used.
 * @param {string} name Flow name.
 * @param {*=} opt_value Optional data value.
 * @param {WTF.trace.Flow=} opt_parentFlow Parent flow, if any.
 * @param {number=} opt_time Time for the branch; omit to use the current time.
 * @return {!WTF.trace.Flow} An initialized flow object.
 */
WTF.trace.branchFlow = WTF.PRESENT ?
    global['wtf']['trace']['branchFlow'] : nullFunction;


/**
 * Extends the flow into the current scope.
 * @param {WTF.trace.Flow} flow Flow to extend.
 * @param {string} name Flow stage name.
 * @param {*=} opt_value Optional data value.
 * @param {number=} opt_time Time for the extend; omit to use the current time.
 */
WTF.trace.extendFlow = WTF.PRESENT ?
    global['wtf']['trace']['extendFlow'] : nullFunction;


/**
 * Terminates a flow.
 * @param {WTF.trace.Flow} flow Flow to terminate.
 * @param {*=} opt_value Optional data value.
 * @param {number=} opt_time Time for the terminate; omit to use the current
 *     time.
 */
WTF.trace.terminateFlow = WTF.PRESENT ?
    global['wtf']['trace']['terminateFlow'] : nullFunction;


/**
 * Appends a named argument of any type to the given flow.
 * This is slow and should only be used for very infrequent appends.
 * Prefer instead to use a custom instance event with the
 * {@see WTF.data.EventFlag#APPEND_FLOW_DATA} flag set.
 *
 * @param {WTF.trace.Flow} flow Flow to append.
 * @param {string} name Argument name. Must be ASCII.
 * @param {*} value Value. Will be JSON stringified.
 * @param {number=} opt_time Time for the event; omit to use the current time.
 */
WTF.trace.appendFlowData = WTF.PRESENT ?
    global['wtf']['trace']['appendFlowData'] : nullFunction;


/**
 * Clears the current scope flow.
 */
WTF.trace.clearFlow = WTF.PRESENT ?
    global['wtf']['trace']['clearFlow'] : nullFunction;


/**
 * Spans the flow across processes.
 * Flows must have been branched before this can be used.
 * @param {number} flowId Flow ID.
 * @return {!WTF.trace.Flow} An initialized flow object.
 */
WTF.trace.spanFlow = WTF.PRESENT ?
    global['wtf']['trace']['spanFlow'] : nullFunction;


/**
 * Marks the stream with a named bookmark.
 * This is used by the UI to construct a simple navigation structure.
 * Each mark is then turned into a navigation point in a table of contents.
 * This should only be used for modal application state changes, such as
 * initial load, entry into a modal dialog or mode, etc. There is only ever one
 * marked range active at a time and if you are calling this more frequently
 * than 1s you should use something else.
 *
 * For high-frequency time stamps instead use {@see #timeStamp} and for async
 * timers use {@see #beginTimeRange}.
 *
 * @param {string} name Marker name.
 * @param {*=} opt_value Optional data value.
 * @param {number=} opt_time Time for the mark; omit to use the current time.
 */
WTF.trace.mark = WTF.PRESENT ?
    global['wtf']['trace']['mark'] : nullFunction;


/**
 * Adds a timestamped event to the stream.
 * This is synonymous to {@code console.timeStamp}, and can be used to place
 * simple arg-less instance events in the timeline.
 * Prefer using custom events for faster, more flexible events.
 * @param {string} name Time stamp name.
 * @param {*=} opt_value Optional data value.
 * @param {number=} opt_time Time for the stamp; omit to use the current time.
 */
WTF.trace.timeStamp = WTF.PRESENT ?
    global['wtf']['trace']['timeStamp'] : nullFunction;


/**
 * Begins an async time range.
 * This tracks time outside of normal scope flow control, and should be limited
 * to only those events that span frames or Javascript ticks.
 * If you're trying to track call flow instead use {@see #traceMethods}.
 *
 * A limited number of active timers will be displayed in the UI. Do not abuse
 * this feature by adding timers for everything (like network requests). Prefer
 * to use flows to track complex async operations.
 *
 * Example:
 * <code>
 * my.Type.startJob = function(actionName) {
 *   var job = {...};
 *   job.tracingRange = WTF.trace.beginTimeRange('my.Type:job', actionName);
 * };
 * my.Type.endJob = function(job) {
 *   WTF.trace.endTimeRange(job.tracingRange);
 * };
 * </code>
 *
 * @param {string} name Time range name.
 * @param {*=} opt_value Optional data value.
 * @return {WTF.trace.TimeRange} Time range handle.
 */
WTF.trace.beginTimeRange = WTF.PRESENT ?
    global['wtf']['trace']['beginTimeRange'] : nullFunction;


/**
 * Ends an async time range previously started with {@see #beginTimeRange}.
 * @param {WTF.trace.TimeRange} timeRange Time range handle.
 * @param {number=} opt_time Time for the stamp; omit to use the current time.
 */
WTF.trace.endTimeRange = WTF.PRESENT ?
    global['wtf']['trace']['endTimeRange'] : nullFunction;


/**
 * Marks an event listener as being ignored, meaning that it will not show up
 * in traces.
 * This should only be used by debugging code as it will cause weird
 * gaps in timing data. Alternatively one could use {@see #enterTracingScope}
 * so that the time is properly shown as inside tracing code.
 *
 * Example:
 * <code>
 * myElement.onclick = WTF.trace.ignoreListener(function(e) {
 *   // This callback will not be auto-traced.
 * });
 * </code>
 *
 * @param {!T} listener Event listener.
 * @return {!T} The parameter, for chaining.
 * @template T
 */
WTF.trace.ignoreListener = WTF.PRESENT ?
    global['wtf']['trace']['ignoreListener'] : nullFunction;


/**
 * Marks an entire tree of DOM elements as being ignored, meaning that no
 * events from them will show up in traces.
 * @param {!Element} el Root DOM element.
 */
WTF.trace.ignoreDomTree = WTF.PRESENT ?
    global['wtf']['trace']['ignoreDomTree'] : nullFunction;


/**
 * Initializes on* event properties on the given DOM element and optionally
 * for all children.
 * This must be called to ensure the properties work correctly. It can be
 * called repeatedly on the same elements (but you should avoid that). Try
 * calling it after any new DOM tree is added recursively on the root of the
 * tree.
 *
 * If this method is not called not all browsers will report events registered
 * via their on* properties. Events registered with addEventListener will always
 * be traced.
 *
 * @param {!Element} target Target DOM element.
 * @param {boolean=} opt_recursive Also initialize for all children.
 */
WTF.trace.initializeDomEventProperties = WTF.PRESENT ?
    global['wtf']['trace']['initializeDomEventProperties'] :
    nullFunction;


/**
 * Creates and registers a new event type, returning a function that can be used
 * to trace the event in the WTF event stream.
 * Created events should be cached and reused - do *not* redefine events.
 *
 * Events are defined by a signature that can be a simple string such as
 * {@code 'myEvent'} or a reference string like {@code 'namespace.Type#method'}
 * and can optionally include typed parameters like
 * {@code 'myEvent(uint32 a, ascii b)'}.
 *
 * For more information on this API, see:
 * https://github.com/google/tracing-framework/blob/master/docs/api.md
 *
 * When tracing is disabled {@code nullFunction} will be returned for
 * all events.
 *
 * Example:
 * <code>
 * // Create the event once, statically.
 * my.Type.fooEvent_ = WTF.trace.events.createInstance(
 *     'my.Type#foo(uint32 a, ascii b)');
 * my.Type.prototype.someMethod = function() {
 *   // Trace the event each function call with custom args.
 *   my.Type.fooEvent_(123, 'hello');
 * };
 * </code>
 *
 * @param {string} signature Event signature.
 * @param {number=} opt_flags A bitmask of {@see WTF.data.EventFlag} values.
 * @return {Function} New event type.
 */
WTF.trace.events.createInstance = WTF.PRESENT ?
    global['wtf']['trace']['events']['createInstance'] :
    function(signature, opt_flags) {
      return nullFunction;
    };


/**
 * Creates and registers a new event type, returning a function that can be used
 * to trace the event in the WTF event stream.
 * Created events should be cached and reused - do *not* redefine events.
 *
 * Events are defined by a signature that can be a simple string such as
 * {@code 'myEvent'} or a reference string like {@code 'namespace.Type#method'}
 * and can optionally include typed parameters like
 * {@code 'myEvent(uint32 a, ascii b)'}.
 *
 * For more information on this API, see:
 * https://github.com/google/tracing-framework/blob/master/docs/api.md
 *
 * When tracing is disabled {@code nullFunction} will be returned for
 * all events.
 *
 * Example:
 * <code>
 * // Create the event once, statically.
 * my.Type.someMethodEvent_ = WTF.trace.events.createScope(
 *     'my.Type#foo(uint32 a, ascii b)');
 * my.Type.prototype.someMethod = function() {
 *   // Enter and leave each function call with custom args.
 *   var scope = my.Type.someMethodEvent_(123, 'hello');
 *   var result = 5; // ...
 *   return WTF.trace.leaveScope(scope, result);
 * };
 * </code>
 *
 * @param {string} signature Event signature.
 * @param {number=} opt_flags A bitmask of {@see WTF.data.EventFlag} values.
 * @return {Function} New event type.
 */
WTF.trace.events.createScope = WTF.PRESENT ?
    global['wtf']['trace']['events']['createScope'] :
    function(signature, opt_flags) {
      return nullFunction;
    };


/**
 * Automatically instruments a method.
 * This will likely produce code slower than manually instrumenting, but is
 * much more readable.
 *
 * <code>
 * my.Type.prototype.foo = WTF.trace.instrument(function(a, b) {
 *   return a + b;
 * }, 'my.Type.foo(uint8 b@1)');
 * </code>
 *
 * @param {Function} value Target function.
 * @param {string} signature Method signature.
 * @param {string=} opt_namePrefix String to prepend to the name.
 * @param {(function(Function, Function):Function)=} opt_generator
 *     A custom function generator that is responsible for taking the given
 *     {@code value} and returning a wrapped function that emits the given
 *     event type.
 * @param {(function())=} opt_pre Code to execute before the scope is entered.
 *     This is only called if {@code opt_generator} is not provided.
 * @return {Function} The instrumented input value.
 */
WTF.trace.instrument = WTF.PRESENT ?
    global['wtf']['trace']['instrument'] : identityFunction;


/**
 * Automatically instruments an entire type.
 *
 * <code>
 * my.Type = function(a, b) {
 *   this.value = a + b;
 * };
 * my.Type.prototype.foo = function(a) { return a; };
 * my.Type = WTF.trace.instrumentType(
 *     my.Type, 'my.Type(uint8 a, uint8 b)', {
 *       foo: 'foo(uint8 a)'
 *     ));
 * </code>
 *
 * @param {T} value Target type.
 * @param {string} constructorSignature Type name and constructor signature.
 * @param {Object|!Object.<string>} methodMap A map of translated method names
 *     to method signatures. Only the methods in this map will be
 *     auto-instrumented.
 * @return {T} The instrumented input value.
 * @template T
 */
WTF.trace.instrumentType = WTF.PRESENT ?
    global['wtf']['trace']['instrumentType'] : identityFunction;


/**
 * Automatically instruments the given prototype methods.
 * This is a simple variant of {@see WTF.trace.instrumentType} that does not
 * provide method arguments or work with overridden methods.
 *
 * @param {string} prefix A common prefix to use for all trace labels.
 * @param {!Object} classPrototype The prototype of the class.
 * @param {!Object.<!Function>} methodMap A mapping between method names
 *     and the methods themselves.
 */
WTF.trace.instrumentTypeSimple = WTF.PRESENT ?
    global['wtf']['trace']['instrumentTypeSimple'] : nullFunction;


})(
    this,
    (typeof exports === 'undefined' ? this['WTF'] = {} : exports));
