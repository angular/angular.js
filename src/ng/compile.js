'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables like document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* ! VARIABLE/FUNCTION NAMING CONVENTIONS THAT APPLY TO THIS FILE!
 *
 * DOM-related variables:
 *
 * - "node" - DOM Node
 * - "element" - DOM Element or Node
 * - "$node" or "$element" - jqLite-wrapped node or element
 *
 *
 * Compiler related stuff:
 *
 * - "linkFn" - linking fn of a single directive
 * - "nodeLinkFn" - function that aggregates all linking fns for a particular node
 * - "childLinkFn" -  function that aggregates all linking fns for child nodes of a particular node
 * - "compositeLinkFn" - function that aggregates all linking fns for a compilation root (nodeList)
 */


/**
 * @ngdoc service
 * @name $compile
 * @kind function
 *
 * @description
 * Compiles an HTML string or DOM into a template and produces a template function, which
 * can then be used to link {@link ng.$rootScope.Scope `scope`} and the template together.
 *
 * The compilation is a process of walking the DOM tree and matching DOM elements to
 * {@link ng.$compileProvider#directive directives}.
 *
 * <div class="alert alert-warning">
 * **Note:** This document is an in-depth reference of all directive options.
 * For a gentle introduction to directives with examples of common use cases,
 * see the {@link guide/directive directive guide}.
 * </div>
 *
 * ## Comprehensive Directive API
 *
 * There are many different options for a directive.
 *
 * The difference resides in the return value of the factory function.
 * You can either return a {@link $compile#directive-definition-object Directive Definition Object (see below)}
 * that defines the directive properties, or just the `postLink` function (all other properties will have
 * the default values).
 *
 * <div class="alert alert-success">
 * **Best Practice:** It's recommended to use the "directive definition object" form.
 * </div>
 *
 * Here's an example directive declared with a Directive Definition Object:
 *
 * ```js
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       {@link $compile#-priority- priority}: 0,
 *       {@link $compile#-template- template}: '<div></div>', // or // function(tElement, tAttrs) { ... },
 *       // or
 *       // {@link $compile#-templateurl- templateUrl}: 'directive.html', // or // function(tElement, tAttrs) { ... },
 *       {@link $compile#-transclude- transclude}: false,
 *       {@link $compile#-restrict- restrict}: 'A',
 *       {@link $compile#-templatenamespace- templateNamespace}: 'html',
 *       {@link $compile#-scope- scope}: false,
 *       {@link $compile#-controller- controller}: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
 *       {@link $compile#-controlleras- controllerAs}: 'stringIdentifier',
 *       {@link $compile#-bindtocontroller- bindToController}: false,
 *       {@link $compile#-require- require}: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
 *       {@link $compile#-multielement- multiElement}: false,
 *       {@link $compile#-compile- compile}: function compile(tElement, tAttrs, transclude) {
 *         return {
 *            {@link $compile#pre-linking-function pre}: function preLink(scope, iElement, iAttrs, controller) { ... },
 *            {@link $compile#post-linking-function post}: function postLink(scope, iElement, iAttrs, controller) { ... }
 *         }
 *         // or
 *         // return function postLink( ... ) { ... }
 *       },
 *       // or
 *       // {@link $compile#-link- link}: {
 *       //  {@link $compile#pre-linking-function pre}: function preLink(scope, iElement, iAttrs, controller) { ... },
 *       //  {@link $compile#post-linking-function post}: function postLink(scope, iElement, iAttrs, controller) { ... }
 *       // }
 *       // or
 *       // {@link $compile#-link- link}: function postLink( ... ) { ... }
 *     };
 *     return directiveDefinitionObject;
 *   });
 * ```
 *
 * <div class="alert alert-warning">
 * **Note:** Any unspecified options will use the default value. You can see the default values below.
 * </div>
 *
 * Therefore the above can be simplified as:
 *
 * ```js
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       link: function postLink(scope, iElement, iAttrs) { ... }
 *     };
 *     return directiveDefinitionObject;
 *     // or
 *     // return function postLink(scope, iElement, iAttrs) { ... }
 *   });
 * ```
 *
 * ### Life-cycle hooks
 * Directive controllers can provide the following methods that are called by AngularJS at points in the life-cycle of the
 * directive:
 * * `$onInit()` - Called on each controller after all the controllers on an element have been constructed and
 *   had their bindings initialized (and before the pre &amp; post linking functions for the directives on
 *   this element). This is a good place to put initialization code for your controller.
 * * `$onChanges(changesObj)` - Called whenever one-way (`<`) or interpolation (`@`) bindings are updated. The
 *   `changesObj` is a hash whose keys are the names of the bound properties that have changed, and the values are an
 *   object of the form `{ currentValue, previousValue, isFirstChange() }`. Use this hook to trigger updates within a
 *   component such as cloning the bound value to prevent accidental mutation of the outer value. Note that this will
 *   also be called when your bindings are initialized.
 * * `$doCheck()` - Called on each turn of the digest cycle. Provides an opportunity to detect and act on
 *   changes. Any actions that you wish to take in response to the changes that you detect must be
 *   invoked from this hook; implementing this has no effect on when `$onChanges` is called. For example, this hook
 *   could be useful if you wish to perform a deep equality check, or to check a Date object, changes to which would not
 *   be detected by AngularJS's change detector and thus not trigger `$onChanges`. This hook is invoked with no arguments;
 *   if detecting changes, you must store the previous value(s) for comparison to the current values.
 * * `$onDestroy()` - Called on a controller when its containing scope is destroyed. Use this hook for releasing
 *   external resources, watches and event handlers. Note that components have their `$onDestroy()` hooks called in
 *   the same order as the `$scope.$broadcast` events are triggered, which is top down. This means that parent
 *   components will have their `$onDestroy()` hook called before child components.
 * * `$postLink()` - Called after this controller's element and its children have been linked. Similar to the post-link
 *   function this hook can be used to set up DOM event handlers and do direct DOM manipulation.
 *   Note that child elements that contain `templateUrl` directives will not have been compiled and linked since
 *   they are waiting for their template to load asynchronously and their own compilation and linking has been
 *   suspended until that occurs.
 *
 * #### Comparison with life-cycle hooks in the new Angular
 * The new Angular also uses life-cycle hooks for its components. While the AngularJS life-cycle hooks are similar there are
 * some differences that you should be aware of, especially when it comes to moving your code from AngularJS to Angular:
 *
 * * AngularJS hooks are prefixed with `$`, such as `$onInit`. Angular hooks are prefixed with `ng`, such as `ngOnInit`.
 * * AngularJS hooks can be defined on the controller prototype or added to the controller inside its constructor.
 *   In Angular you can only define hooks on the prototype of the Component class.
 * * Due to the differences in change-detection, you may get many more calls to `$doCheck` in AngularJS than you would to
 *   `ngDoCheck` in Angular.
 * * Changes to the model inside `$doCheck` will trigger new turns of the digest loop, which will cause the changes to be
 *   propagated throughout the application.
 *   Angular does not allow the `ngDoCheck` hook to trigger a change outside of the component. It will either throw an
 *   error or do nothing depending upon the state of `enableProdMode()`.
 *
 * #### Life-cycle hook examples
 *
 * This example shows how you can check for mutations to a Date object even though the identity of the object
 * has not changed.
 *
 * <example name="doCheckDateExample" module="do-check-module">
 *   <file name="app.js">
 *     angular.module('do-check-module', [])
 *       .component('app', {
 *         template:
 *           'Month: <input ng-model="$ctrl.month" ng-change="$ctrl.updateDate()">' +
 *           'Date: {{ $ctrl.date }}' +
 *           '<test date="$ctrl.date"></test>',
 *         controller: function() {
 *           this.date = new Date();
 *           this.month = this.date.getMonth();
 *           this.updateDate = function() {
 *             this.date.setMonth(this.month);
 *           };
 *         }
 *       })
 *       .component('test', {
 *         bindings: { date: '<' },
 *         template:
 *           '<pre>{{ $ctrl.log | json }}</pre>',
 *         controller: function() {
 *           var previousValue;
 *           this.log = [];
 *           this.$doCheck = function() {
 *             var currentValue = this.date && this.date.valueOf();
 *             if (previousValue !== currentValue) {
 *               this.log.push('doCheck: date mutated: ' + this.date);
 *               previousValue = currentValue;
 *             }
 *           };
 *         }
 *       });
 *   </file>
 *   <file name="index.html">
 *     <app></app>
 *   </file>
 * </example>
 *
 * This example show how you might use `$doCheck` to trigger changes in your component's inputs even if the
 * actual identity of the component doesn't change. (Be aware that cloning and deep equality checks on large
 * arrays or objects can have a negative impact on your application performance)
 *
 * <example name="doCheckArrayExample" module="do-check-module">
 *   <file name="index.html">
 *     <div ng-init="items = []">
 *       <button ng-click="items.push(items.length)">Add Item</button>
 *       <button ng-click="items = []">Reset Items</button>
 *       <pre>{{ items }}</pre>
 *       <test items="items"></test>
 *     </div>
 *   </file>
 *   <file name="app.js">
 *      angular.module('do-check-module', [])
 *        .component('test', {
 *          bindings: { items: '<' },
 *          template:
 *            '<pre>{{ $ctrl.log | json }}</pre>',
 *          controller: function() {
 *            this.log = [];
 *
 *            this.$doCheck = function() {
 *              if (this.items_ref !== this.items) {
 *                this.log.push('doCheck: items changed');
 *                this.items_ref = this.items;
 *              }
 *              if (!angular.equals(this.items_clone, this.items)) {
 *                this.log.push('doCheck: items mutated');
 *                this.items_clone = angular.copy(this.items);
 *              }
 *            };
 *          }
 *        });
 *   </file>
 * </example>
 *
 *
 * ### Directive Definition Object
 *
 * The directive definition object provides instructions to the {@link ng.$compile
 * compiler}. The attributes are:
 *
 * #### `multiElement`
 * When this property is set to true (default is `false`), the HTML compiler will collect DOM nodes between
 * nodes with the attributes `directive-name-start` and `directive-name-end`, and group them
 * together as the directive elements. It is recommended that this feature be used on directives
 * which are not strictly behavioral (such as {@link ngClick}), and which
 * do not manipulate or replace child nodes (such as {@link ngInclude}).
 *
 * #### `priority`
 * When there are multiple directives defined on a single DOM element, sometimes it
 * is necessary to specify the order in which the directives are applied. The `priority` is used
 * to sort the directives before their `compile` functions get called. Priority is defined as a
 * number. Directives with greater numerical `priority` are compiled first. Pre-link functions
 * are also run in priority order, but post-link functions are run in reverse order. The order
 * of directives with the same priority is undefined. The default priority is `0`.
 *
 * #### `terminal`
 * If set to true then the current `priority` will be the last set of directives
 * which will execute (any directives at the current priority will still execute
 * as the order of execution on same `priority` is undefined). Note that expressions
 * and other directives used in the directive's template will also be excluded from execution.
 *
 * #### `scope`
 * The scope property can be `false`, `true`, or an object:
 *
 * * **`false` (default):** No scope will be created for the directive. The directive will use its
 * parent's scope.
 *
 * * **`true`:** A new child scope that prototypically inherits from its parent will be created for
 * the directive's element. If multiple directives on the same element request a new scope,
 * only one new scope is created.
 *
 * * **`{...}` (an object hash):** A new "isolate" scope is created for the directive's template.
 * The 'isolate' scope differs from normal scope in that it does not prototypically
 * inherit from its parent scope. This is useful when creating reusable components, which should not
 * accidentally read or modify data in the parent scope. Note that an isolate scope
 * directive without a `template` or `templateUrl` will not apply the isolate scope
 * to its children elements.
 *
 * The 'isolate' scope object hash defines a set of local scope properties derived from attributes on the
 * directive's element. These local properties are useful for aliasing values for templates. The keys in
 * the object hash map to the name of the property on the isolate scope; the values define how the property
 * is bound to the parent scope, via matching attributes on the directive's element:
 *
 * * `@` or `@attr` - bind a local scope property to the value of DOM attribute. The result is
 *   always a string since DOM attributes are strings. If no `attr` name is specified then the
 *   attribute name is assumed to be the same as the local name. Given `<my-component
 *   my-attr="hello {{name}}">` and the isolate scope definition `scope: { localName:'@myAttr' }`,
 *   the directive's scope property `localName` will reflect the interpolated value of `hello
 *   {{name}}`. As the `name` attribute changes so will the `localName` property on the directive's
 *   scope. The `name` is read from the parent scope (not the directive's scope).
 *
 * * `=` or `=attr` - set up a bidirectional binding between a local scope property and an expression
 *   passed via the attribute `attr`. The expression is evaluated in the context of the parent scope.
 *   If no `attr` name is specified then the attribute name is assumed to be the same as the local
 *   name. Given `<my-component my-attr="parentModel">` and the isolate scope definition `scope: {
 *   localModel: '=myAttr' }`, the property `localModel` on the directive's scope will reflect the
 *   value of `parentModel` on the parent scope. Changes to `parentModel` will be reflected in
 *   `localModel` and vice versa. If the binding expression is non-assignable, or if the attribute
 *   isn't  optional and doesn't exist, an exception
 *   ({@link error/$compile/nonassign `$compile:nonassign`}) will be thrown upon discovering changes
 *   to the local value, since it will be impossible to sync them back to the parent scope.
 *
 *   By default, the {@link ng.$rootScope.Scope#$watch `$watch`}
 *   method is used for tracking changes, and the equality check is based on object identity.
 *   However, if an object literal or an array literal is passed as the binding expression, the
 *   equality check is done by value (using the {@link angular.equals} function). It's also possible
 *   to watch the evaluated value shallowly with {@link ng.$rootScope.Scope#$watchCollection
 *   `$watchCollection`}: use `=*` or `=*attr`
 *
  * * `<` or `<attr` - set up a one-way (one-directional) binding between a local scope property and an
 *   expression passed via the attribute `attr`. The expression is evaluated in the context of the
 *   parent scope. If no `attr` name is specified then the attribute name is assumed to be the same as the
 *   local name.
 *
 *   For example, given `<my-component my-attr="parentModel">` and directive definition of
 *   `scope: { localModel:'<myAttr' }`, then the isolated scope property `localModel` will reflect the
 *   value of `parentModel` on the parent scope. Any changes to `parentModel` will be reflected
 *   in `localModel`, but changes in `localModel` will not reflect in `parentModel`. There are however
 *   two caveats:
 *     1. one-way binding does not copy the value from the parent to the isolate scope, it simply
 *     sets the same value. That means if your bound value is an object, changes to its properties
 *     in the isolated scope will be reflected in the parent scope (because both reference the same object).
 *     2. one-way binding watches changes to the **identity** of the parent value. That means the
 *     {@link ng.$rootScope.Scope#$watch `$watch`} on the parent value only fires if the reference
 *     to the value has changed. In most cases, this should not be of concern, but can be important
 *     to know if you one-way bind to an object, and then replace that object in the isolated scope.
 *     If you now change a property of the object in your parent scope, the change will not be
 *     propagated to the isolated scope, because the identity of the object on the parent scope
 *     has not changed. Instead you must assign a new object.
 *
 *   One-way binding is useful if you do not plan to propagate changes to your isolated scope bindings
 *   back to the parent. However, it does not make this completely impossible.
 *
 * * `&` or `&attr` - provides a way to execute an expression in the context of the parent scope. If
 *   no `attr` name is specified then the attribute name is assumed to be the same as the local name.
 *   Given `<my-component my-attr="count = count + value">` and the isolate scope definition `scope: {
 *   localFn:'&myAttr' }`, the isolate scope property `localFn` will point to a function wrapper for
 *   the `count = count + value` expression. Often it's desirable to pass data from the isolated scope
 *   via an expression to the parent scope. This can be done by passing a map of local variable names
 *   and values into the expression wrapper fn. For example, if the expression is `increment(amount)`
 *   then we can specify the amount value by calling the `localFn` as `localFn({amount: 22})`.
 *
 * All 4 kinds of bindings (`@`, `=`, `<`, and `&`) can be made optional by adding `?` to the expression.
 * The marker must come after the mode and before the attribute name.
 * See the {@link error/$compile/iscp Invalid Isolate Scope Definition error} for definition examples.
 * This is useful to refine the interface directives provide.
 * One subtle difference between optional and non-optional happens **when the binding attribute is not
 * set**:
 * - the binding is optional: the property will not be defined
 * - the binding is not optional: the property is defined
 *
 * ```js
 *app.directive('testDir', function() {
    return {
      scope: {
        notoptional: '=',
        optional: '=?',
      },
      bindToController: true,
      controller: function() {
        this.$onInit = function() {
          console.log(this.hasOwnProperty('notoptional')) // true
          console.log(this.hasOwnProperty('optional')) // false
        }
      }
    }
  })
 *```
 *
 *
 * ##### Combining directives with different scope defintions
 *
 * In general it's possible to apply more than one directive to one element, but there might be limitations
 * depending on the type of scope required by the directives. The following points will help explain these limitations.
 * For simplicity only two directives are taken into account, but it is also applicable for several directives:
 *
 * * **no scope** + **no scope** => Two directives which don't require their own scope will use their parent's scope
 * * **child scope** + **no scope** =>  Both directives will share one single child scope
 * * **child scope** + **child scope** =>  Both directives will share one single child scope
 * * **isolated scope** + **no scope** =>  The isolated directive will use it's own created isolated scope. The other directive will use
 * its parent's scope
 * * **isolated scope** + **child scope** =>  **Won't work!** Only one scope can be related to one element. Therefore these directives cannot
 * be applied to the same element.
 * * **isolated scope** + **isolated scope**  =>  **Won't work!** Only one scope can be related to one element. Therefore these directives
 * cannot be applied to the same element.
 *
 *
 * #### `bindToController`
 * This property is used to bind scope properties directly to the controller. It can be either
 * `true` or an object hash with the same format as the `scope` property.
 *
 * When an isolate scope is used for a directive (see above), `bindToController: true` will
 * allow a component to have its properties bound to the controller, rather than to scope.
 *
 * After the controller is instantiated, the initial values of the isolate scope bindings will be bound to the controller
 * properties. You can access these bindings once they have been initialized by providing a controller method called
 * `$onInit`, which is called after all the controllers on an element have been constructed and had their bindings
 * initialized.
 *
 * It is also possible to set `bindToController` to an object hash with the same format as the `scope` property.
 * This will set up the scope bindings to the controller directly. Note that `scope` can still be used
 * to define which kind of scope is created. By default, no scope is created. Use `scope: {}` to create an isolate
 * scope (useful for component directives).
 *
 * If both `bindToController` and `scope` are defined and have object hashes, `bindToController` overrides `scope`.
 *
 *
 * #### `controller`
 * Controller constructor function. The controller is instantiated before the
 * pre-linking phase and can be accessed by other directives (see
 * `require` attribute). This allows the directives to communicate with each other and augment
 * each other's behavior. The controller is injectable (and supports bracket notation) with the following locals:
 *
 * * `$scope` - Current scope associated with the element
 * * `$element` - Current element
 * * `$attrs` - Current attributes object for the element
 * * `$transclude` - A transclude linking function pre-bound to the correct transclusion scope:
 *   `function([scope], cloneLinkingFn, futureParentElement, slotName)`:
 *    * `scope`: (optional) override the scope.
 *    * `cloneLinkingFn`: (optional) argument to create clones of the original transcluded content.
 *    * `futureParentElement` (optional):
 *        * defines the parent to which the `cloneLinkingFn` will add the cloned elements.
 *        * default: `$element.parent()` resp. `$element` for `transclude:'element'` resp. `transclude:true`.
 *        * only needed for transcludes that are allowed to contain non html elements (e.g. SVG elements)
 *          and when the `cloneLinkingFn` is passed,
 *          as those elements need to created and cloned in a special way when they are defined outside their
 *          usual containers (e.g. like `<svg>`).
 *        * See also the `directive.templateNamespace` property.
 *    * `slotName`: (optional) the name of the slot to transclude. If falsy (e.g. `null`, `undefined` or `''`)
 *      then the default transclusion is provided.
 *    The `$transclude` function also has a method on it, `$transclude.isSlotFilled(slotName)`, which returns
 *    `true` if the specified slot contains content (i.e. one or more DOM nodes).
 *
 * #### `require`
 * Require another directive and inject its controller as the fourth argument to the linking function. The
 * `require` property can be a string, an array or an object:
 * * a **string** containing the name of the directive to pass to the linking function
 * * an **array** containing the names of directives to pass to the linking function. The argument passed to the
 * linking function will be an array of controllers in the same order as the names in the `require` property
 * * an **object** whose property values are the names of the directives to pass to the linking function. The argument
 * passed to the linking function will also be an object with matching keys, whose values will hold the corresponding
 * controllers.
 *
 * If the `require` property is an object and `bindToController` is truthy, then the required controllers are
 * bound to the controller using the keys of the `require` property. This binding occurs after all the controllers
 * have been constructed but before `$onInit` is called.
 * If the name of the required controller is the same as the local name (the key), the name can be
 * omitted. For example, `{parentDir: '^^'}` is equivalent to `{parentDir: '^^parentDir'}`.
 * See the {@link $compileProvider#component} helper for an example of how this can be used.
 * If no such required directive(s) can be found, or if the directive does not have a controller, then an error is
 * raised (unless no link function is specified and the required controllers are not being bound to the directive
 * controller, in which case error checking is skipped). The name can be prefixed with:
 *
 * * (no prefix) - Locate the required controller on the current element. Throw an error if not found.
 * * `?` - Attempt to locate the required controller or pass `null` to the `link` fn if not found.
 * * `^` - Locate the required controller by searching the element and its parents. Throw an error if not found.
 * * `^^` - Locate the required controller by searching the element's parents. Throw an error if not found.
 * * `?^` - Attempt to locate the required controller by searching the element and its parents or pass
 *   `null` to the `link` fn if not found.
 * * `?^^` - Attempt to locate the required controller by searching the element's parents, or pass
 *   `null` to the `link` fn if not found.
 *
 *
 * #### `controllerAs`
 * Identifier name for a reference to the controller in the directive's scope.
 * This allows the controller to be referenced from the directive template. This is especially
 * useful when a directive is used as component, i.e. with an `isolate` scope. It's also possible
 * to use it in a directive without an `isolate` / `new` scope, but you need to be aware that the
 * `controllerAs` reference might overwrite a property that already exists on the parent scope.
 *
 *
 * #### `restrict`
 * String of subset of `EACM` which restricts the directive to a specific directive
 * declaration style. If omitted, the defaults (elements and attributes) are used.
 *
 * * `E` - Element name (default): `<my-directive></my-directive>`
 * * `A` - Attribute (default): `<div my-directive="exp"></div>`
 * * `C` - Class: `<div class="my-directive: exp;"></div>`
 * * `M` - Comment: `<!-- directive: my-directive exp -->`
 *
 *
 * #### `templateNamespace`
 * String representing the document type used by the markup in the template.
 * AngularJS needs this information as those elements need to be created and cloned
 * in a special way when they are defined outside their usual containers like `<svg>` and `<math>`.
 *
 * * `html` - All root nodes in the template are HTML. Root nodes may also be
 *   top-level elements such as `<svg>` or `<math>`.
 * * `svg` - The root nodes in the template are SVG elements (excluding `<math>`).
 * * `math` - The root nodes in the template are MathML elements (excluding `<svg>`).
 *
 * If no `templateNamespace` is specified, then the namespace is considered to be `html`.
 *
 * #### `template`
 * HTML markup that may:
 * * Replace the contents of the directive's element (default).
 * * Replace the directive's element itself (if `replace` is true - DEPRECATED).
 * * Wrap the contents of the directive's element (if `transclude` is true).
 *
 * Value may be:
 *
 * * A string. For example `<div red-on-hover>{{delete_str}}</div>`.
 * * A function which takes two arguments `tElement` and `tAttrs` (described in the `compile`
 *   function api below) and returns a string value.
 *
 *
 * #### `templateUrl`
 * This is similar to `template` but the template is loaded from the specified URL, asynchronously.
 *
 * Because template loading is asynchronous the compiler will suspend compilation of directives on that element
 * for later when the template has been resolved.  In the meantime it will continue to compile and link
 * sibling and parent elements as though this element had not contained any directives.
 *
 * The compiler does not suspend the entire compilation to wait for templates to be loaded because this
 * would result in the whole app "stalling" until all templates are loaded asynchronously - even in the
 * case when only one deeply nested directive has `templateUrl`.
 *
 * Template loading is asynchronous even if the template has been preloaded into the {@link $templateCache}
 *
 * You can specify `templateUrl` as a string representing the URL or as a function which takes two
 * arguments `tElement` and `tAttrs` (described in the `compile` function api below) and returns
 * a string value representing the url.  In either case, the template URL is passed through {@link
 * $sce#getTrustedResourceUrl $sce.getTrustedResourceUrl}.
 *
 *
 * #### `replace` ([*DEPRECATED*!], will be removed in next major release - i.e. v2.0)
 * specify what the template should replace. Defaults to `false`.
 *
 * * `true` - the template will replace the directive's element.
 * * `false` - the template will replace the contents of the directive's element.
 *
 * The replacement process migrates all of the attributes / classes from the old element to the new
 * one. See the {@link guide/directive#template-expanding-directive
 * Directives Guide} for an example.
 *
 * There are very few scenarios where element replacement is required for the application function,
 * the main one being reusable custom components that are used within SVG contexts
 * (because SVG doesn't work with custom elements in the DOM tree).
 *
 * #### `transclude`
 * Extract the contents of the element where the directive appears and make it available to the directive.
 * The contents are compiled and provided to the directive as a **transclusion function**. See the
 * {@link $compile#transclusion Transclusion} section below.
 *
 *
 * #### `compile`
 *
 * ```js
 *   function compile(tElement, tAttrs, transclude) { ... }
 * ```
 *
 * The compile function deals with transforming the template DOM. Since most directives do not do
 * template transformation, it is not used often. The compile function takes the following arguments:
 *
 *   * `tElement` - template element - The element where the directive has been declared. It is
 *     safe to do template transformation on the element and child elements only.
 *
 *   * `tAttrs` - template attributes - Normalized list of attributes declared on this element shared
 *     between all directive compile functions.
 *
 *   * `transclude` -  [*DEPRECATED*!] A transclude linking function: `function(scope, cloneLinkingFn)`
 *
 * <div class="alert alert-warning">
 * **Note:** The template instance and the link instance may be different objects if the template has
 * been cloned. For this reason it is **not** safe to do anything other than DOM transformations that
 * apply to all cloned DOM nodes within the compile function. Specifically, DOM listener registration
 * should be done in a linking function rather than in a compile function.
 * </div>

 * <div class="alert alert-warning">
 * **Note:** The compile function cannot handle directives that recursively use themselves in their
 * own templates or compile functions. Compiling these directives results in an infinite loop and
 * stack overflow errors.
 *
 * This can be avoided by manually using $compile in the postLink function to imperatively compile
 * a directive's template instead of relying on automatic template compilation via `template` or
 * `templateUrl` declaration or manual compilation inside the compile function.
 * </div>
 *
 * <div class="alert alert-danger">
 * **Note:** The `transclude` function that is passed to the compile function is deprecated, as it
 *   e.g. does not know about the right outer scope. Please use the transclude function that is passed
 *   to the link function instead.
 * </div>

 * A compile function can have a return value which can be either a function or an object.
 *
 * * returning a (post-link) function - is equivalent to registering the linking function via the
 *   `link` property of the config object when the compile function is empty.
 *
 * * returning an object with function(s) registered via `pre` and `post` properties - allows you to
 *   control when a linking function should be called during the linking phase. See info about
 *   pre-linking and post-linking functions below.
 *
 *
 * #### `link`
 * This property is used only if the `compile` property is not defined.
 *
 * ```js
 *   function link(scope, iElement, iAttrs, controller, transcludeFn) { ... }
 * ```
 *
 * The link function is responsible for registering DOM listeners as well as updating the DOM. It is
 * executed after the template has been cloned. This is where most of the directive logic will be
 * put.
 *
 *   * `scope` - {@link ng.$rootScope.Scope Scope} - The scope to be used by the
 *     directive for registering {@link ng.$rootScope.Scope#$watch watches}.
 *
 *   * `iElement` - instance element - The element where the directive is to be used. It is safe to
 *     manipulate the children of the element only in `postLink` function since the children have
 *     already been linked.
 *
 *   * `iAttrs` - instance attributes - Normalized list of attributes declared on this element shared
 *     between all directive linking functions.
 *
 *   * `controller` - the directive's required controller instance(s) - Instances are shared
 *     among all directives, which allows the directives to use the controllers as a communication
 *     channel. The exact value depends on the directive's `require` property:
 *       * no controller(s) required: the directive's own controller, or `undefined` if it doesn't have one
 *       * `string`: the controller instance
 *       * `array`: array of controller instances
 *
 *     If a required controller cannot be found, and it is optional, the instance is `null`,
 *     otherwise the {@link error:$compile:ctreq Missing Required Controller} error is thrown.
 *
 *     Note that you can also require the directive's own controller - it will be made available like
 *     any other controller.
 *
 *   * `transcludeFn` - A transclude linking function pre-bound to the correct transclusion scope.
 *     This is the same as the `$transclude` parameter of directive controllers,
 *     see {@link ng.$compile#-controller- the controller section for details}.
 *     `function([scope], cloneLinkingFn, futureParentElement)`.
 *
 * #### Pre-linking function
 *
 * Executed before the child elements are linked. Not safe to do DOM transformation since the
 * compiler linking function will fail to locate the correct elements for linking.
 *
 * #### Post-linking function
 *
 * Executed after the child elements are linked.
 *
 * Note that child elements that contain `templateUrl` directives will not have been compiled
 * and linked since they are waiting for their template to load asynchronously and their own
 * compilation and linking has been suspended until that occurs.
 *
 * It is safe to do DOM transformation in the post-linking function on elements that are not waiting
 * for their async templates to be resolved.
 *
 *
 * ### Transclusion
 *
 * Transclusion is the process of extracting a collection of DOM elements from one part of the DOM and
 * copying them to another part of the DOM, while maintaining their connection to the original AngularJS
 * scope from where they were taken.
 *
 * Transclusion is used (often with {@link ngTransclude}) to insert the
 * original contents of a directive's element into a specified place in the template of the directive.
 * The benefit of transclusion, over simply moving the DOM elements manually, is that the transcluded
 * content has access to the properties on the scope from which it was taken, even if the directive
 * has isolated scope.
 * See the {@link guide/directive#creating-a-directive-that-wraps-other-elements Directives Guide}.
 *
 * This makes it possible for the widget to have private state for its template, while the transcluded
 * content has access to its originating scope.
 *
 * <div class="alert alert-warning">
 * **Note:** When testing an element transclude directive you must not place the directive at the root of the
 * DOM fragment that is being compiled. See {@link guide/unit-testing#testing-transclusion-directives
 * Testing Transclusion Directives}.
 * </div>
 *
 * There are three kinds of transclusion depending upon whether you want to transclude just the contents of the
 * directive's element, the entire element or multiple parts of the element contents:
 *
 * * `true` - transclude the content (i.e. the child nodes) of the directive's element.
 * * `'element'` - transclude the whole of the directive's element including any directives on this
 *   element that defined at a lower priority than this directive. When used, the `template`
 *   property is ignored.
 * * **`{...}` (an object hash):** - map elements of the content onto transclusion "slots" in the template.
 *
 * **Mult-slot transclusion** is declared by providing an object for the `transclude` property.
 *
 * This object is a map where the keys are the name of the slot to fill and the value is an element selector
 * used to match the HTML to the slot. The element selector should be in normalized form (e.g. `myElement`)
 * and will match the standard element variants (e.g. `my-element`, `my:element`, `data-my-element`, etc).
 *
 * For further information check out the guide on {@link guide/directive#matching-directives Matching Directives}
 *
 * If the element selector is prefixed with a `?` then that slot is optional.
 *
 * For example, the transclude object `{ slotA: '?myCustomElement' }` maps `<my-custom-element>` elements to
 * the `slotA` slot, which can be accessed via the `$transclude` function or via the {@link ngTransclude} directive.
 *
 * Slots that are not marked as optional (`?`) will trigger a compile time error if there are no matching elements
 * in the transclude content. If you wish to know if an optional slot was filled with content, then you can call
 * `$transclude.isSlotFilled(slotName)` on the transclude function passed to the directive's link function and
 * injectable into the directive's controller.
 *
 *
 * #### Transclusion Functions
 *
 * When a directive requests transclusion, the compiler extracts its contents and provides a **transclusion
 * function** to the directive's `link` function and `controller`. This transclusion function is a special
 * **linking function** that will return the compiled contents linked to a new transclusion scope.
 *
 * <div class="alert alert-info">
 * If you are just using {@link ngTransclude} then you don't need to worry about this function, since
 * ngTransclude will deal with it for us.
 * </div>
 *
 * If you want to manually control the insertion and removal of the transcluded content in your directive
 * then you must use this transclude function. When you call a transclude function it returns a a jqLite/JQuery
 * object that contains the compiled DOM, which is linked to the correct transclusion scope.
 *
 * When you call a transclusion function you can pass in a **clone attach function**. This function accepts
 * two parameters, `function(clone, scope) { ... }`, where the `clone` is a fresh compiled copy of your transcluded
 * content and the `scope` is the newly created transclusion scope, which the clone will be linked to.
 *
 * <div class="alert alert-info">
 * **Best Practice**: Always provide a `cloneFn` (clone attach function) when you call a transclude function
 * since you then get a fresh clone of the original DOM and also have access to the new transclusion scope.
 * </div>
 *
 * It is normal practice to attach your transcluded content (`clone`) to the DOM inside your **clone
 * attach function**:
 *
 * ```js
 * var transcludedContent, transclusionScope;
 *
 * $transclude(function(clone, scope) {
 *   element.append(clone);
 *   transcludedContent = clone;
 *   transclusionScope = scope;
 * });
 * ```
 *
 * Later, if you want to remove the transcluded content from your DOM then you should also destroy the
 * associated transclusion scope:
 *
 * ```js
 * transcludedContent.remove();
 * transclusionScope.$destroy();
 * ```
 *
 * <div class="alert alert-info">
 * **Best Practice**: if you intend to add and remove transcluded content manually in your directive
 * (by calling the transclude function to get the DOM and calling `element.remove()` to remove it),
 * then you are also responsible for calling `$destroy` on the transclusion scope.
 * </div>
 *
 * The built-in DOM manipulation directives, such as {@link ngIf}, {@link ngSwitch} and {@link ngRepeat}
 * automatically destroy their transcluded clones as necessary so you do not need to worry about this if
 * you are simply using {@link ngTransclude} to inject the transclusion into your directive.
 *
 *
 * #### Transclusion Scopes
 *
 * When you call a transclude function it returns a DOM fragment that is pre-bound to a **transclusion
 * scope**. This scope is special, in that it is a child of the directive's scope (and so gets destroyed
 * when the directive's scope gets destroyed) but it inherits the properties of the scope from which it
 * was taken.
 *
 * For example consider a directive that uses transclusion and isolated scope. The DOM hierarchy might look
 * like this:
 *
 * ```html
 * <div ng-app>
 *   <div isolate>
 *     <div transclusion>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * The `$parent` scope hierarchy will look like this:
 *
   ```
   - $rootScope
     - isolate
       - transclusion
   ```
 *
 * but the scopes will inherit prototypically from different scopes to their `$parent`.
 *
   ```
   - $rootScope
     - transclusion
   - isolate
   ```
 *
 *
 * ### Attributes
 *
 * The {@link ng.$compile.directive.Attributes Attributes} object - passed as a parameter in the
 * `link()` or `compile()` functions. It has a variety of uses.
 *
 * * *Accessing normalized attribute names:* Directives like 'ngBind' can be expressed in many ways:
 *   'ng:bind', `data-ng-bind`, or 'x-ng-bind'. The attributes object allows for normalized access
 *   to the attributes.
 *
 * * *Directive inter-communication:* All directives share the same instance of the attributes
 *   object which allows the directives to use the attributes object as inter directive
 *   communication.
 *
 * * *Supports interpolation:* Interpolation attributes are assigned to the attribute object
 *   allowing other directives to read the interpolated value.
 *
 * * *Observing interpolated attributes:* Use `$observe` to observe the value changes of attributes
 *   that contain interpolation (e.g. `src="{{bar}}"`). Not only is this very efficient but it's also
 *   the only way to easily get the actual value because during the linking phase the interpolation
 *   hasn't been evaluated yet and so the value is at this time set to `undefined`.
 *
 * ```js
 * function linkingFn(scope, elm, attrs, ctrl) {
 *   // get the attribute value
 *   console.log(attrs.ngModel);
 *
 *   // change the attribute
 *   attrs.$set('ngModel', 'new value');
 *
 *   // observe changes to interpolated attribute
 *   attrs.$observe('ngModel', function(value) {
 *     console.log('ngModel has changed value to ' + value);
 *   });
 * }
 * ```
 *
 * ## Example
 *
 * <div class="alert alert-warning">
 * **Note**: Typically directives are registered with `module.directive`. The example below is
 * to illustrate how `$compile` works.
 * </div>
 *
 <example module="compileExample" name="compile">
   <file name="index.html">
    <script>
      angular.module('compileExample', [], function($compileProvider) {
        // configure new 'compile' directive by passing a directive
        // factory function. The factory function injects the '$compile'
        $compileProvider.directive('compile', function($compile) {
          // directive factory creates a link function
          return function(scope, element, attrs) {
            scope.$watch(
              function(scope) {
                 // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
            );
          };
        });
      })
      .controller('GreeterController', ['$scope', function($scope) {
        $scope.name = 'AngularJS';
        $scope.html = 'Hello {{name}}';
      }]);
    </script>
    <div ng-controller="GreeterController">
      <input ng-model="name"> <br/>
      <textarea ng-model="html"></textarea> <br/>
      <div compile="html"></div>
    </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should auto compile', function() {
       var textarea = $('textarea');
       var output = $('div[compile]');
       // The initial state reads 'Hello AngularJS'.
       expect(output.getText()).toBe('Hello AngularJS');
       textarea.clear();
       textarea.sendKeys('{{name}}!');
       expect(output.getText()).toBe('AngularJS!');
     });
   </file>
 </example>

 *
 *
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.
 * @param {function(angular.Scope, cloneAttachFn=)} transclude function available to directives - DEPRECATED.
 *
 * <div class="alert alert-danger">
 * **Note:** Passing a `transclude` function to the $compile function is deprecated, as it
 *   e.g. will not use the right outer scope. Please pass the transclude function as a
 *   `parentBoundTranscludeFn` to the link function instead.
 * </div>
 *
 * @param {number} maxPriority only apply directives lower than given priority (Only effects the
 *                 root element(s), not their children)
 * @returns {function(scope, cloneAttachFn=, options=)} a link function which is used to bind template
 * (a DOM element/tree) to a scope. Where:
 *
 *  * `scope` - A {@link ng.$rootScope.Scope Scope} to bind to.
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the
 *  `template` and call the `cloneAttachFn` function allowing the caller to attach the
 *  cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is
 *  called as: <br/> `cloneAttachFn(clonedElement, scope)` where:
 *
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.
 *      * `scope` - is the current scope with which the linking function is working with.
 *
 *  * `options` - An optional object hash with linking options. If `options` is provided, then the following
 *  keys may be used to control linking behavior:
 *
 *      * `parentBoundTranscludeFn` - the transclude function made available to
 *        directives; if given, it will be passed through to the link functions of
 *        directives found in `element` during compilation.
 *      * `transcludeControllers` - an object hash with keys that map controller names
 *        to a hash with the key `instance`, which maps to the controller instance;
 *        if given, it will make the controllers available to directives on the compileNode:
 *        ```
 *        {
 *          parent: {
 *            instance: parentControllerInstance
 *          }
 *        }
 *        ```
 *      * `futureParentElement` - defines the parent to which the `cloneAttachFn` will add
 *        the cloned elements; only needed for transcludes that are allowed to contain non html
 *        elements (e.g. SVG elements). See also the directive.controller property.
 *
 * Calling the linking function returns the element of the template. It is either the original
 * element passed in, or the clone of the element if the `cloneAttachFn` is provided.
 *
 * After linking the view is not updated until after a call to $digest which typically is done by
 * AngularJS automatically.
 *
 * If you need access to the bound view, there are two ways to do it:
 *
 * - If you are not asking the linking function to clone the template, create the DOM element(s)
 *   before you send them to the compiler and keep this reference around.
 *   ```js
 *     var element = $compile('<p>{{total}}</p>')(scope);
 *   ```
 *
 * - if on the other hand, you need the element to be cloned, the view reference from the original
 *   example would not point to the clone, but rather to the original template that was cloned. In
 *   this case, you can access the clone via the cloneAttachFn:
 *   ```js
 *     var templateElement = angular.element('<p>{{total}}</p>'),
 *         scope = ....;
 *
 *     var clonedElement = $compile(templateElement)(scope, function(clonedElement, scope) {
 *       //attach the clone to DOM document at the right place
 *     });
 *
 *     //now we have reference to the cloned DOM via `clonedElement`
 *   ```
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/compiler AngularJS HTML Compiler} section of the Developer Guide.
 *
 * @knownIssue
 *
 * ### Double Compilation
 *
   Double compilation occurs when an already compiled part of the DOM gets
   compiled again. This is an undesired effect and can lead to misbehaving directives, performance issues,
   and memory leaks. Refer to the Compiler Guide {@link guide/compiler#double-compilation-and-how-to-avoid-it
   section on double compilation} for an in-depth explanation and ways to avoid it.
 *
 */

var $compileMinErr = minErr('$compile');

function UNINITIALIZED_VALUE() {}
var _UNINITIALIZED_VALUE = new UNINITIALIZED_VALUE();

/**
 * @ngdoc provider
 * @name $compileProvider
 *
 * @description
 */
$CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];
/** @this */
function $CompileProvider($provide, $$sanitizeUriProvider) {
  var hasDirectives = {},
      Suffix = 'Directive',
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive:\s*([\w-]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\w-]+)(?::([^;]+))?;?)/,
      ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'),
      REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;

  // Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
  // The assumption is that future DOM event attribute names will begin with
  // 'on' and be composed of only English letters.
  var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
  var bindingCache = createMap();

  function parseIsolateBindings(scope, directiveName, isController) {
    var LOCAL_REGEXP = /^\s*([@&<]|=(\*?))(\??)\s*([\w$]*)\s*$/;

    var bindings = createMap();

    forEach(scope, function(definition, scopeName) {
      if (definition in bindingCache) {
        bindings[scopeName] = bindingCache[definition];
        return;
      }
      var match = definition.match(LOCAL_REGEXP);

      if (!match) {
        throw $compileMinErr('iscp',
            'Invalid {3} for directive \'{0}\'.' +
            ' Definition: {... {1}: \'{2}\' ...}',
            directiveName, scopeName, definition,
            (isController ? 'controller bindings definition' :
            'isolate scope definition'));
      }

      bindings[scopeName] = {
        mode: match[1][0],
        collection: match[2] === '*',
        optional: match[3] === '?',
        attrName: match[4] || scopeName
      };
      if (match[4]) {
        bindingCache[definition] = bindings[scopeName];
      }
    });

    return bindings;
  }

  function parseDirectiveBindings(directive, directiveName) {
    var bindings = {
      isolateScope: null,
      bindToController: null
    };
    if (isObject(directive.scope)) {
      if (directive.bindToController === true) {
        bindings.bindToController = parseIsolateBindings(directive.scope,
                                                         directiveName, true);
        bindings.isolateScope = {};
      } else {
        bindings.isolateScope = parseIsolateBindings(directive.scope,
                                                     directiveName, false);
      }
    }
    if (isObject(directive.bindToController)) {
      bindings.bindToController =
          parseIsolateBindings(directive.bindToController, directiveName, true);
    }
    if (bindings.bindToController && !directive.controller) {
      // There is no controller
      throw $compileMinErr('noctrl',
            'Cannot bind to controller without directive \'{0}\'s controller.',
            directiveName);
    }
    return bindings;
  }

  function assertValidDirectiveName(name) {
    var letter = name.charAt(0);
    if (!letter || letter !== lowercase(letter)) {
      throw $compileMinErr('baddir', 'Directive/Component name \'{0}\' is invalid. The first character must be a lowercase letter', name);
    }
    if (name !== name.trim()) {
      throw $compileMinErr('baddir',
            'Directive/Component name \'{0}\' is invalid. The name should not contain leading or trailing whitespaces',
            name);
    }
  }

  function getDirectiveRequire(directive) {
    var require = directive.require || (directive.controller && directive.name);

    if (!isArray(require) && isObject(require)) {
      forEach(require, function(value, key) {
        var match = value.match(REQUIRE_PREFIX_REGEXP);
        var name = value.substring(match[0].length);
        if (!name) require[key] = match[0] + key;
      });
    }

    return require;
  }

  function getDirectiveRestrict(restrict, name) {
    if (restrict && !(isString(restrict) && /[EACM]/.test(restrict))) {
      throw $compileMinErr('badrestrict',
          'Restrict property \'{0}\' of directive \'{1}\' is invalid',
          restrict,
          name);
    }

    return restrict || 'EA';
  }

  /**
   * @ngdoc method
   * @name $compileProvider#directive
   * @kind function
   *
   * @description
   * Register a new directive with the compiler.
   *
   * @param {string|Object} name Name of the directive in camel-case (i.e. <code>ngBind</code> which
   *    will match as <code>ng-bind</code>), or an object map of directives where the keys are the
   *    names and the values are the factories.
   * @param {Function|Array} directiveFactory An injectable directive factory function. See the
   *    {@link guide/directive directive guide} and the {@link $compile compile API} for more info.
   * @returns {ng.$compileProvider} Self for chaining.
   */
  this.directive = function registerDirective(name, directiveFactory) {
    assertArg(name, 'name');
    assertNotHasOwnProperty(name, 'directive');
    if (isString(name)) {
      assertValidDirectiveName(name);
      assertArg(directiveFactory, 'directiveFactory');
      if (!hasDirectives.hasOwnProperty(name)) {
        hasDirectives[name] = [];
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
          function($injector, $exceptionHandler) {
            var directives = [];
            forEach(hasDirectives[name], function(directiveFactory, index) {
              try {
                var directive = $injector.invoke(directiveFactory);
                if (isFunction(directive)) {
                  directive = { compile: valueFn(directive) };
                } else if (!directive.compile && directive.link) {
                  directive.compile = valueFn(directive.link);
                }
                directive.priority = directive.priority || 0;
                directive.index = index;
                directive.name = directive.name || name;
                directive.require = getDirectiveRequire(directive);
                directive.restrict = getDirectiveRestrict(directive.restrict, name);
                directive.$$moduleName = directiveFactory.$$moduleName;
                directives.push(directive);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
            return directives;
          }]);
      }
      hasDirectives[name].push(directiveFactory);
    } else {
      forEach(name, reverseParams(registerDirective));
    }
    return this;
  };

  /**
   * @ngdoc method
   * @name $compileProvider#component
   * @module ng
   * @param {string|Object} name Name of the component in camelCase (i.e. `myComp` which will match `<my-comp>`),
   *    or an object map of components where the keys are the names and the values are the component definition objects.
   * @param {Object} options Component definition object (a simplified
   *    {@link ng.$compile#directive-definition-object directive definition object}),
   *    with the following properties (all optional):
   *
   *    - `controller` – `{(string|function()=}` – controller constructor function that should be
   *      associated with newly created scope or the name of a {@link ng.$compile#-controller-
   *      registered controller} if passed as a string. An empty `noop` function by default.
   *    - `controllerAs` – `{string=}` – identifier name for to reference the controller in the component's scope.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *      If not present, this will default to be `$ctrl`.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used as the contents of this component.
   *      Empty string by default.
   *
   *      If `template` is a function, then it is {@link auto.$injector#invoke injected} with
   *      the following locals:
   *
   *      - `$element` - Current element
   *      - `$attrs` - Current attributes object for the element
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used  as the contents of this component.
   *
   *      If `templateUrl` is a function, then it is {@link auto.$injector#invoke injected} with
   *      the following locals:
   *
   *      - `$element` - Current element
   *      - `$attrs` - Current attributes object for the element
   *
   *    - `bindings` – `{object=}` – defines bindings between DOM attributes and component properties.
   *      Component properties are always bound to the component controller and not to the scope.
   *      See {@link ng.$compile#-bindtocontroller- `bindToController`}.
   *    - `transclude` – `{boolean=}` – whether {@link $compile#transclusion content transclusion} is enabled.
   *      Disabled by default.
   *    - `require` - `{Object<string, string>=}` - requires the controllers of other directives and binds them to
   *      this component's controller. The object keys specify the property names under which the required
   *      controllers (object values) will be bound. See {@link ng.$compile#-require- `require`}.
   *    - `$...` – additional properties to attach to the directive factory function and the controller
   *      constructor function. (This is used by the component router to annotate)
   *
   * @returns {ng.$compileProvider} the compile provider itself, for chaining of function calls.
   * @description
   * Register a **component definition** with the compiler. This is a shorthand for registering a special
   * type of directive, which represents a self-contained UI component in your application. Such components
   * are always isolated (i.e. `scope: {}`) and are always restricted to elements (i.e. `restrict: 'E'`).
   *
   * Component definitions are very simple and do not require as much configuration as defining general
   * directives. Component definitions usually consist only of a template and a controller backing it.
   *
   * In order to make the definition easier, components enforce best practices like use of `controllerAs`,
   * `bindToController`. They always have **isolate scope** and are restricted to elements.
   *
   * Here are a few examples of how you would usually define components:
   *
   * ```js
   *   var myMod = angular.module(...);
   *   myMod.component('myComp', {
   *     template: '<div>My name is {{$ctrl.name}}</div>',
   *     controller: function() {
   *       this.name = 'shahar';
   *     }
   *   });
   *
   *   myMod.component('myComp', {
   *     template: '<div>My name is {{$ctrl.name}}</div>',
   *     bindings: {name: '@'}
   *   });
   *
   *   myMod.component('myComp', {
   *     templateUrl: 'views/my-comp.html',
   *     controller: 'MyCtrl',
   *     controllerAs: 'ctrl',
   *     bindings: {name: '@'}
   *   });
   *
   * ```
   * For more examples, and an in-depth guide, see the {@link guide/component component guide}.
   *
   * <br />
   * See also {@link ng.$compileProvider#directive $compileProvider.directive()}.
   */
  this.component = function registerComponent(name, options) {
    if (!isString(name)) {
      forEach(name, reverseParams(bind(this, registerComponent)));
      return this;
    }

    var controller = options.controller || function() {};

    function factory($injector) {
      function makeInjectable(fn) {
        if (isFunction(fn) || isArray(fn)) {
          return /** @this */ function(tElement, tAttrs) {
            return $injector.invoke(fn, this, {$element: tElement, $attrs: tAttrs});
          };
        } else {
          return fn;
        }
      }

      var template = (!options.template && !options.templateUrl ? '' : options.template);
      var ddo = {
        controller: controller,
        controllerAs: identifierForController(options.controller) || options.controllerAs || '$ctrl',
        template: makeInjectable(template),
        templateUrl: makeInjectable(options.templateUrl),
        transclude: options.transclude,
        scope: {},
        bindToController: options.bindings || {},
        restrict: 'E',
        require: options.require
      };

      // Copy annotations (starting with $) over to the DDO
      forEach(options, function(val, key) {
        if (key.charAt(0) === '$') ddo[key] = val;
      });

      return ddo;
    }

    // TODO(pete) remove the following `forEach` before we release 1.6.0
    // The component-router@0.2.0 looks for the annotations on the controller constructor
    // Nothing in AngularJS looks for annotations on the factory function but we can't remove
    // it from 1.5.x yet.

    // Copy any annotation properties (starting with $) over to the factory and controller constructor functions
    // These could be used by libraries such as the new component router
    forEach(options, function(val, key) {
      if (key.charAt(0) === '$') {
        factory[key] = val;
        // Don't try to copy over annotations to named controller
        if (isFunction(controller)) controller[key] = val;
      }
    });

    factory.$inject = ['$injector'];

    return this.directive(name, factory);
  };


  /**
   * @ngdoc method
   * @name $compileProvider#aHrefSanitizationWhitelist
   * @kind function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at preventing XSS attacks via html links.
   *
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
      return this;
    } else {
      return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
    }
  };


  /**
   * @ngdoc method
   * @name $compileProvider#imgSrcSanitizationWhitelist
   * @kind function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
      return this;
    } else {
      return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
    }
  };

  /**
   * @ngdoc method
   * @name  $compileProvider#debugInfoEnabled
   *
   * @param {boolean=} enabled update the debugInfoEnabled state if provided, otherwise just return the
   * current debugInfoEnabled state
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   *
   * @kind function
   *
   * @description
   * Call this method to enable/disable various debug runtime information in the compiler such as adding
   * binding information and a reference to the current scope on to DOM elements.
   * If enabled, the compiler will add the following to DOM elements that have been bound to the scope
   * * `ng-binding` CSS class
   * * `$binding` data property containing an array of the binding expressions
   *
   * You may want to disable this in production for a significant performance boost. See
   * {@link guide/production#disabling-debug-data Disabling Debug Data} for more.
   *
   * The default value is true.
   */
  var debugInfoEnabled = true;
  this.debugInfoEnabled = function(enabled) {
    if (isDefined(enabled)) {
      debugInfoEnabled = enabled;
      return this;
    }
    return debugInfoEnabled;
  };

  /**
   * @ngdoc method
   * @name  $compileProvider#strictComponentBindingsEnabled
   *
   * @param {boolean=} enabled update the strictComponentBindingsEnabled state if provided, otherwise just return the
   * current strictComponentBindingsEnabled state
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   *
   * @kind function
   *
   * @description
   * Call this method to enable/disable strict component bindings check. If enabled, the compiler will enforce that
   * for all bindings of a component that are not set as optional with `?`, an attribute needs to be provided
   * on the component's HTML tag.
   *
   * The default value is false.
   */
  var strictComponentBindingsEnabled = false;
  this.strictComponentBindingsEnabled = function(enabled) {
    if (isDefined(enabled)) {
      strictComponentBindingsEnabled = enabled;
      return this;
    }
    return strictComponentBindingsEnabled;
  };

  var TTL = 10;
  /**
   * @ngdoc method
   * @name $compileProvider#onChangesTtl
   * @description
   *
   * Sets the number of times `$onChanges` hooks can trigger new changes before giving up and
   * assuming that the model is unstable.
   *
   * The current default is 10 iterations.
   *
   * In complex applications it's possible that dependencies between `$onChanges` hooks and bindings will result
   * in several iterations of calls to these hooks. However if an application needs more than the default 10
   * iterations to stabilize then you should investigate what is causing the model to continuously change during
   * the `$onChanges` hook execution.
   *
   * Increasing the TTL could have performance implications, so you should not change it without proper justification.
   *
   * @param {number} limit The number of `$onChanges` hook iterations.
   * @returns {number|object} the current limit (or `this` if called as a setter for chaining)
   */
  this.onChangesTtl = function(value) {
    if (arguments.length) {
      TTL = value;
      return this;
    }
    return TTL;
  };

  var commentDirectivesEnabledConfig = true;
  /**
   * @ngdoc method
   * @name $compileProvider#commentDirectivesEnabled
   * @description
   *
   * It indicates to the compiler
   * whether or not directives on comments should be compiled.
   * Defaults to `true`.
   *
   * Calling this function with false disables the compilation of directives
   * on comments for the whole application.
   * This results in a compilation performance gain,
   * as the compiler doesn't have to check comments when looking for directives.
   * This should however only be used if you are sure that no comment directives are used in
   * the application (including any 3rd party directives).
   *
   * @param {boolean} enabled `false` if the compiler may ignore directives on comments
   * @returns {boolean|object} the current value (or `this` if called as a setter for chaining)
   */
  this.commentDirectivesEnabled = function(value) {
    if (arguments.length) {
      commentDirectivesEnabledConfig = value;
      return this;
    }
    return commentDirectivesEnabledConfig;
  };


  var cssClassDirectivesEnabledConfig = true;
  /**
   * @ngdoc method
   * @name $compileProvider#cssClassDirectivesEnabled
   * @description
   *
   * It indicates to the compiler
   * whether or not directives on element classes should be compiled.
   * Defaults to `true`.
   *
   * Calling this function with false disables the compilation of directives
   * on element classes for the whole application.
   * This results in a compilation performance gain,
   * as the compiler doesn't have to check element classes when looking for directives.
   * This should however only be used if you are sure that no class directives are used in
   * the application (including any 3rd party directives).
   *
   * @param {boolean} enabled `false` if the compiler may ignore directives on element classes
   * @returns {boolean|object} the current value (or `this` if called as a setter for chaining)
   */
  this.cssClassDirectivesEnabled = function(value) {
    if (arguments.length) {
      cssClassDirectivesEnabledConfig = value;
      return this;
    }
    return cssClassDirectivesEnabledConfig;
  };

  this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$templateRequest', '$parse',
            '$controller', '$rootScope', '$sce', '$animate', '$$sanitizeUri',
    function($injector,   $interpolate,   $exceptionHandler,   $templateRequest,   $parse,
             $controller,   $rootScope,   $sce,   $animate,   $$sanitizeUri) {

    var SIMPLE_ATTR_NAME = /^\w/;
    var specialAttrHolder = window.document.createElement('div');


    var commentDirectivesEnabled = commentDirectivesEnabledConfig;
    var cssClassDirectivesEnabled = cssClassDirectivesEnabledConfig;


    var onChangesTtl = TTL;
    // The onChanges hooks should all be run together in a single digest
    // When changes occur, the call to trigger their hooks will be added to this queue
    var onChangesQueue;

    // This function is called in a $$postDigest to trigger all the onChanges hooks in a single digest
    function flushOnChangesQueue() {
      try {
        if (!(--onChangesTtl)) {
          // We have hit the TTL limit so reset everything
          onChangesQueue = undefined;
          throw $compileMinErr('infchng', '{0} $onChanges() iterations reached. Aborting!\n', TTL);
        }
        // We must run this hook in an apply since the $$postDigest runs outside apply
        $rootScope.$apply(function() {
          var errors = [];
          for (var i = 0, ii = onChangesQueue.length; i < ii; ++i) {
            try {
              onChangesQueue[i]();
            } catch (e) {
              errors.push(e);
            }
          }
          // Reset the queue to trigger a new schedule next time there is a change
          onChangesQueue = undefined;
          if (errors.length) {
            throw errors;
          }
        });
      } finally {
        onChangesTtl++;
      }
    }


    function Attributes(element, attributesToCopy) {
      if (attributesToCopy) {
        var keys = Object.keys(attributesToCopy);
        var i, l, key;

        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          this[key] = attributesToCopy[key];
        }
      } else {
        this.$attr = {};
      }

      this.$$element = element;
    }

    Attributes.prototype = {
      /**
       * @ngdoc method
       * @name $compile.directive.Attributes#$normalize
       * @kind function
       *
       * @description
       * Converts an attribute name (e.g. dash/colon/underscore-delimited string, optionally prefixed with `x-` or
       * `data-`) to its normalized, camelCase form.
       *
       * Also there is special case for Moz prefix starting with upper case letter.
       *
       * For further information check out the guide on {@link guide/directive#matching-directives Matching Directives}
       *
       * @param {string} name Name to normalize
       */
      $normalize: directiveNormalize,


      /**
       * @ngdoc method
       * @name $compile.directive.Attributes#$addClass
       * @kind function
       *
       * @description
       * Adds the CSS class value specified by the classVal parameter to the element. If animations
       * are enabled then an animation will be triggered for the class addition.
       *
       * @param {string} classVal The className value that will be added to the element
       */
      $addClass: function(classVal) {
        if (classVal && classVal.length > 0) {
          $animate.addClass(this.$$element, classVal);
        }
      },

      /**
       * @ngdoc method
       * @name $compile.directive.Attributes#$removeClass
       * @kind function
       *
       * @description
       * Removes the CSS class value specified by the classVal parameter from the element. If
       * animations are enabled then an animation will be triggered for the class removal.
       *
       * @param {string} classVal The className value that will be removed from the element
       */
      $removeClass: function(classVal) {
        if (classVal && classVal.length > 0) {
          $animate.removeClass(this.$$element, classVal);
        }
      },

      /**
       * @ngdoc method
       * @name $compile.directive.Attributes#$updateClass
       * @kind function
       *
       * @description
       * Adds and removes the appropriate CSS class values to the element based on the difference
       * between the new and old CSS class values (specified as newClasses and oldClasses).
       *
       * @param {string} newClasses The current CSS className value
       * @param {string} oldClasses The former CSS className value
       */
      $updateClass: function(newClasses, oldClasses) {
        var toAdd = tokenDifference(newClasses, oldClasses);
        if (toAdd && toAdd.length) {
          $animate.addClass(this.$$element, toAdd);
        }

        var toRemove = tokenDifference(oldClasses, newClasses);
        if (toRemove && toRemove.length) {
          $animate.removeClass(this.$$element, toRemove);
        }
      },

      /**
       * Set a normalized attribute on the element in a way such that all directives
       * can share the attribute. This function properly handles boolean attributes.
       * @param {string} key Normalized key. (ie ngAttribute)
       * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
       * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
       *     Defaults to true.
       * @param {string=} attrName Optional none normalized name. Defaults to key.
       */
      $set: function(key, value, writeAttr, attrName) {
        // TODO: decide whether or not to throw an error if "class"
        //is set through this function since it may cause $updateClass to
        //become unstable.

        var node = this.$$element[0],
            booleanKey = getBooleanAttrName(node, key),
            aliasedKey = getAliasedAttrName(key),
            observer = key,
            nodeName;

        if (booleanKey) {
          this.$$element.prop(key, value);
          attrName = booleanKey;
        } else if (aliasedKey) {
          this[aliasedKey] = value;
          observer = aliasedKey;
        }

        this[key] = value;

        // translate normalized key to actual key
        if (attrName) {
          this.$attr[key] = attrName;
        } else {
          attrName = this.$attr[key];
          if (!attrName) {
            this.$attr[key] = attrName = snake_case(key, '-');
          }
        }

        nodeName = nodeName_(this.$$element);

        if ((nodeName === 'a' && (key === 'href' || key === 'xlinkHref')) ||
            (nodeName === 'img' && key === 'src') ||
            (nodeName === 'image' && key === 'xlinkHref')) {
          // sanitize a[href] and img[src] values
          this[key] = value = $$sanitizeUri(value, nodeName === 'img' || nodeName === 'image');
        } else if (nodeName === 'img' && key === 'srcset' && isDefined(value)) {
          // sanitize img[srcset] values
          var result = '';

          // first check if there are spaces because it's not the same pattern
          var trimmedSrcset = trim(value);
          //                (   999x   ,|   999w   ,|   ,|,   )
          var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
          var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;

          // split srcset into tuple of uri and descriptor except for the last item
          var rawUris = trimmedSrcset.split(pattern);

          // for each tuples
          var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
          for (var i = 0; i < nbrUrisWith2parts; i++) {
            var innerIdx = i * 2;
            // sanitize the uri
            result += $$sanitizeUri(trim(rawUris[innerIdx]), true);
            // add the descriptor
            result += (' ' + trim(rawUris[innerIdx + 1]));
          }

          // split the last item into uri and descriptor
          var lastTuple = trim(rawUris[i * 2]).split(/\s/);

          // sanitize the last uri
          result += $$sanitizeUri(trim(lastTuple[0]), true);

          // and add the last descriptor if any
          if (lastTuple.length === 2) {
            result += (' ' + trim(lastTuple[1]));
          }
          this[key] = value = result;
        }

        if (writeAttr !== false) {
          if (value === null || isUndefined(value)) {
            this.$$element.removeAttr(attrName);
          } else {
            if (SIMPLE_ATTR_NAME.test(attrName)) {
              this.$$element.attr(attrName, value);
            } else {
              setSpecialAttr(this.$$element[0], attrName, value);
            }
          }
        }

        // fire observers
        var $$observers = this.$$observers;
        if ($$observers) {
          forEach($$observers[observer], function(fn) {
            try {
              fn(value);
            } catch (e) {
              $exceptionHandler(e);
            }
          });
        }
      },


      /**
       * @ngdoc method
       * @name $compile.directive.Attributes#$observe
       * @kind function
       *
       * @description
       * Observes an interpolated attribute.
       *
       * The observer function will be invoked once during the next `$digest` following
       * compilation. The observer is then invoked whenever the interpolated value
       * changes.
       *
       * @param {string} key Normalized key. (ie ngAttribute) .
       * @param {function(interpolatedValue)} fn Function that will be called whenever
                the interpolated value of the attribute changes.
       *        See the {@link guide/interpolation#how-text-and-attribute-bindings-work Interpolation
       *        guide} for more info.
       * @returns {function()} Returns a deregistration function for this observer.
       */
      $observe: function(key, fn) {
        var attrs = this,
            $$observers = (attrs.$$observers || (attrs.$$observers = createMap())),
            listeners = ($$observers[key] || ($$observers[key] = []));

        listeners.push(fn);
        $rootScope.$evalAsync(function() {
          if (!listeners.$$inter && attrs.hasOwnProperty(key) && !isUndefined(attrs[key])) {
            // no one registered attribute interpolation function, so lets call it manually
            fn(attrs[key]);
          }
        });

        return function() {
          arrayRemove(listeners, fn);
        };
      }
    };

    function setSpecialAttr(element, attrName, value) {
      // Attributes names that do not start with letters (such as `(click)`) cannot be set using `setAttribute`
      // so we have to jump through some hoops to get such an attribute
      // https://github.com/angular/angular.js/pull/13318
      specialAttrHolder.innerHTML = '<span ' + attrName + '>';
      var attributes = specialAttrHolder.firstChild.attributes;
      var attribute = attributes[0];
      // We have to remove the attribute from its container element before we can add it to the destination element
      attributes.removeNamedItem(attribute.name);
      attribute.value = value;
      element.attributes.setNamedItem(attribute);
    }

    function safeAddClass($element, className) {
      try {
        $element.addClass(className);
      } catch (e) {
        // ignore, since it means that we are trying to set class on
        // SVG element, where class name is read-only.
      }
    }


    var startSymbol = $interpolate.startSymbol(),
        endSymbol = $interpolate.endSymbol(),
        denormalizeTemplate = (startSymbol === '{{' && endSymbol  === '}}')
            ? identity
            : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
        },
        NG_ATTR_BINDING = /^ngAttr[A-Z]/;
    var MULTI_ELEMENT_DIR_RE = /^(.+)Start$/;

    compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
      var bindings = $element.data('$binding') || [];

      if (isArray(binding)) {
        bindings = bindings.concat(binding);
      } else {
        bindings.push(binding);
      }

      $element.data('$binding', bindings);
    } : noop;

    compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
      safeAddClass($element, 'ng-binding');
    } : noop;

    compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
      var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
      $element.data(dataName, scope);
    } : noop;

    compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
      safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
    } : noop;

    compile.$$createComment = function(directiveName, comment) {
      var content = '';
      if (debugInfoEnabled) {
        content = ' ' + (directiveName || '') + ': ';
        if (comment) content += comment + ' ';
      }
      return window.document.createComment(content);
    };

    return compile;

    //================================

    function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
                        previousCompileContext) {
      if (!($compileNodes instanceof jqLite)) {
        // jquery always rewraps, whereas we need to preserve the original selector so that we can
        // modify it.
        $compileNodes = jqLite($compileNodes);
      }
      var compositeLinkFn =
              compileNodes($compileNodes, transcludeFn, $compileNodes,
                           maxPriority, ignoreDirective, previousCompileContext);
      compile.$$addScopeClass($compileNodes);
      var namespace = null;
      return function publicLinkFn(scope, cloneConnectFn, options) {
        if (!$compileNodes) {
          throw $compileMinErr('multilink', 'This element has already been linked.');
        }
        assertArg(scope, 'scope');

        if (previousCompileContext && previousCompileContext.needsNewScope) {
          // A parent directive did a replace and a directive on this element asked
          // for transclusion, which caused us to lose a layer of element on which
          // we could hold the new transclusion scope, so we will create it manually
          // here.
          scope = scope.$parent.$new();
        }

        options = options || {};
        var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
          transcludeControllers = options.transcludeControllers,
          futureParentElement = options.futureParentElement;

        // When `parentBoundTranscludeFn` is passed, it is a
        // `controllersBoundTransclude` function (it was previously passed
        // as `transclude` to directive.link) so we must unwrap it to get
        // its `boundTranscludeFn`
        if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
          parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
        }

        if (!namespace) {
          namespace = detectNamespaceForChildElements(futureParentElement);
        }
        var $linkNode;
        if (namespace !== 'html') {
          // When using a directive with replace:true and templateUrl the $compileNodes
          // (or a child element inside of them)
          // might change, so we need to recreate the namespace adapted compileNodes
          // for call to the link function.
          // Note: This will already clone the nodes...
          $linkNode = jqLite(
            wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html())
          );
        } else if (cloneConnectFn) {
          // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
          // and sometimes changes the structure of the DOM.
          $linkNode = JQLitePrototype.clone.call($compileNodes);
        } else {
          $linkNode = $compileNodes;
        }

        if (transcludeControllers) {
          for (var controllerName in transcludeControllers) {
            $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
          }
        }

        compile.$$addScopeInfo($linkNode, scope);

        if (cloneConnectFn) cloneConnectFn($linkNode, scope);
        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);

        if (!cloneConnectFn) {
          $compileNodes = compositeLinkFn = null;
        }
        return $linkNode;
      };
    }

    function detectNamespaceForChildElements(parentElement) {
      // TODO: Make this detect MathML as well...
      var node = parentElement && parentElement[0];
      if (!node) {
        return 'html';
      } else {
        return nodeName_(node) !== 'foreignobject' && toString.call(node).match(/SVG/) ? 'svg' : 'html';
      }
    }

    /**
     * Compile function matches each node in nodeList against the directives. Once all directives
     * for a particular node are collected their compile functions are executed. The compile
     * functions return values - the linking functions - are combined into a composite linking
     * function, which is the a linking function for the node.
     *
     * @param {NodeList} nodeList an array of nodes or NodeList to compile
     * @param {function(angular.Scope, cloneAttachFn=)} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then
     *        the rootElement must be set the jqLite collection of the compile root. This is
     *        needed so that the jqLite collection items can be replaced with widgets.
     * @param {number=} maxPriority Max directive priority.
     * @returns {Function} A composite linking function of all of the matched directives or null.
     */
    function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
                            previousCompileContext) {
      var linkFns = [],
          // `nodeList` can be either an element's `.childNodes` (live NodeList)
          // or a jqLite/jQuery collection or an array
          notLiveList = isArray(nodeList) || (nodeList instanceof jqLite),
          attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;


      for (var i = 0; i < nodeList.length; i++) {
        attrs = new Attributes();

        // Support: IE 11 only
        // Workaround for #11781 and #14924
        if (msie === 11) {
          mergeConsecutiveTextNodes(nodeList, i, notLiveList);
        }

        // We must always refer to `nodeList[i]` hereafter,
        // since the nodes can be replaced underneath us.
        directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
                                        ignoreDirective);

        nodeLinkFn = (directives.length)
            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
                                      null, [], [], previousCompileContext)
            : null;

        if (nodeLinkFn && nodeLinkFn.scope) {
          compile.$$addScopeClass(attrs.$$element);
        }

        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal ||
                      !(childNodes = nodeList[i].childNodes) ||
                      !childNodes.length)
            ? null
            : compileNodes(childNodes,
                 nodeLinkFn ? (
                  (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement)
                     && nodeLinkFn.transclude) : transcludeFn);

        if (nodeLinkFn || childLinkFn) {
          linkFns.push(i, nodeLinkFn, childLinkFn);
          linkFnFound = true;
          nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
        }

        //use the previous context only for the first element in the virtual group
        previousCompileContext = null;
      }

      // return a linking function if we have found anything, null otherwise
      return linkFnFound ? compositeLinkFn : null;

      function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
        var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn;
        var stableNodeList;


        if (nodeLinkFnFound) {
          // copy nodeList so that if a nodeLinkFn removes or adds an element at this DOM level our
          // offsets don't get screwed up
          var nodeListLength = nodeList.length;
          stableNodeList = new Array(nodeListLength);

          // create a sparse array by only copying the elements which have a linkFn
          for (i = 0; i < linkFns.length; i += 3) {
            idx = linkFns[i];
            stableNodeList[idx] = nodeList[idx];
          }
        } else {
          stableNodeList = nodeList;
        }

        for (i = 0, ii = linkFns.length; i < ii;) {
          node = stableNodeList[linkFns[i++]];
          nodeLinkFn = linkFns[i++];
          childLinkFn = linkFns[i++];

          if (nodeLinkFn) {
            if (nodeLinkFn.scope) {
              childScope = scope.$new();
              compile.$$addScopeInfo(jqLite(node), childScope);
            } else {
              childScope = scope;
            }

            if (nodeLinkFn.transcludeOnThisElement) {
              childBoundTranscludeFn = createBoundTranscludeFn(
                  scope, nodeLinkFn.transclude, parentBoundTranscludeFn);

            } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
              childBoundTranscludeFn = parentBoundTranscludeFn;

            } else if (!parentBoundTranscludeFn && transcludeFn) {
              childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);

            } else {
              childBoundTranscludeFn = null;
            }

            nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn);

          } else if (childLinkFn) {
            childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
          }
        }
      }
    }

    function mergeConsecutiveTextNodes(nodeList, idx, notLiveList) {
      var node = nodeList[idx];
      var parent = node.parentNode;
      var sibling;

      if (node.nodeType !== NODE_TYPE_TEXT) {
        return;
      }

      while (true) {
        sibling = parent ? node.nextSibling : nodeList[idx + 1];
        if (!sibling || sibling.nodeType !== NODE_TYPE_TEXT) {
          break;
        }

        node.nodeValue = node.nodeValue + sibling.nodeValue;

        if (sibling.parentNode) {
          sibling.parentNode.removeChild(sibling);
        }
        if (notLiveList && sibling === nodeList[idx + 1]) {
          nodeList.splice(idx + 1, 1);
        }
      }
    }

    function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
      function boundTranscludeFn(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {

        if (!transcludedScope) {
          transcludedScope = scope.$new(false, containingScope);
          transcludedScope.$$transcluded = true;
        }

        return transcludeFn(transcludedScope, cloneFn, {
          parentBoundTranscludeFn: previousBoundTranscludeFn,
          transcludeControllers: controllers,
          futureParentElement: futureParentElement
        });
      }

      // We need  to attach the transclusion slots onto the `boundTranscludeFn`
      // so that they are available inside the `controllersBoundTransclude` function
      var boundSlots = boundTranscludeFn.$$slots = createMap();
      for (var slotName in transcludeFn.$$slots) {
        if (transcludeFn.$$slots[slotName]) {
          boundSlots[slotName] = createBoundTranscludeFn(scope, transcludeFn.$$slots[slotName], previousBoundTranscludeFn);
        } else {
          boundSlots[slotName] = null;
        }
      }

      return boundTranscludeFn;
    }

    /**
     * Looks for directives on the given node and adds them to the directive collection which is
     * sorted.
     *
     * @param node Node to search.
     * @param directives An array to which the directives are added to. This array is sorted before
     *        the function returns.
     * @param attrs The shared attrs object which is used to populate the normalized attributes.
     * @param {number=} maxPriority Max directive priority.
     */
    function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
      var nodeType = node.nodeType,
          attrsMap = attrs.$attr,
          match,
          nodeName,
          className;

      switch (nodeType) {
        case NODE_TYPE_ELEMENT: /* Element */

          nodeName = nodeName_(node);

          // use the node name: <directive>
          addDirective(directives,
              directiveNormalize(nodeName), 'E', maxPriority, ignoreDirective);

          // iterate over the attributes
          for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            var attrStartName = false;
            var attrEndName = false;

            attr = nAttrs[j];
            name = attr.name;
            value = attr.value;

            // support ngAttr attribute binding
            ngAttrName = directiveNormalize(name);
            isNgAttr = NG_ATTR_BINDING.test(ngAttrName);
            if (isNgAttr) {
              name = name.replace(PREFIX_REGEXP, '')
                .substr(8).replace(/_(.)/g, function(match, letter) {
                  return letter.toUpperCase();
                });
            }

            var multiElementMatch = ngAttrName.match(MULTI_ELEMENT_DIR_RE);
            if (multiElementMatch && directiveIsMultiElement(multiElementMatch[1])) {
              attrStartName = name;
              attrEndName = name.substr(0, name.length - 5) + 'end';
              name = name.substr(0, name.length - 6);
            }

            nName = directiveNormalize(name.toLowerCase());
            attrsMap[nName] = name;
            if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                attrs[nName] = value;
                if (getBooleanAttrName(node, nName)) {
                  attrs[nName] = true; // presence means true
                }
            }
            addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
            addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName,
                          attrEndName);
          }

          if (nodeName === 'input' && node.getAttribute('type') === 'hidden') {
            // Hidden input elements can have strange behaviour when navigating back to the page
            // This tells the browser not to try to cache and reinstate previous values
            node.setAttribute('autocomplete', 'off');
          }

          // use class as directive
          if (!cssClassDirectivesEnabled) break;
          className = node.className;
          if (isObject(className)) {
              // Maybe SVGAnimatedString
              className = className.animVal;
          }
          if (isString(className) && className !== '') {
            while ((match = CLASS_DIRECTIVE_REGEXP.exec(className))) {
              nName = directiveNormalize(match[2]);
              if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[3]);
              }
              className = className.substr(match.index + match[0].length);
            }
          }
          break;
        case NODE_TYPE_TEXT: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case NODE_TYPE_COMMENT: /* Comment */
          if (!commentDirectivesEnabled) break;
          collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective);
          break;
      }

      directives.sort(byPriority);
      return directives;
    }

    function collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
      // function created because of performance, try/catch disables
      // the optimization of the whole function #14848
      try {
        var match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
        if (match) {
          var nName = directiveNormalize(match[1]);
          if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
            attrs[nName] = trim(match[2]);
          }
        }
      } catch (e) {
        // turns out that under some circumstances IE9 throws errors when one attempts to read
        // comment's node value.
        // Just ignore it and continue. (Can't seem to reproduce in test case.)
      }
    }

    /**
     * Given a node with a directive-start it collects all of the siblings until it finds
     * directive-end.
     * @param node
     * @param attrStart
     * @param attrEnd
     * @returns {*}
     */
    function groupScan(node, attrStart, attrEnd) {
      var nodes = [];
      var depth = 0;
      if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
        do {
          if (!node) {
            throw $compileMinErr('uterdir',
                      'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.',
                      attrStart, attrEnd);
          }
          if (node.nodeType === NODE_TYPE_ELEMENT) {
            if (node.hasAttribute(attrStart)) depth++;
            if (node.hasAttribute(attrEnd)) depth--;
          }
          nodes.push(node);
          node = node.nextSibling;
        } while (depth > 0);
      } else {
        nodes.push(node);
      }

      return jqLite(nodes);
    }

    /**
     * Wrapper for linking function which converts normal linking function into a grouped
     * linking function.
     * @param linkFn
     * @param attrStart
     * @param attrEnd
     * @returns {Function}
     */
    function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
      return function groupedElementsLink(scope, element, attrs, controllers, transcludeFn) {
        element = groupScan(element[0], attrStart, attrEnd);
        return linkFn(scope, element, attrs, controllers, transcludeFn);
      };
    }

    /**
     * A function generator that is used to support both eager and lazy compilation
     * linking function.
     * @param eager
     * @param $compileNodes
     * @param transcludeFn
     * @param maxPriority
     * @param ignoreDirective
     * @param previousCompileContext
     * @returns {Function}
     */
    function compilationGenerator(eager, $compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
      var compiled;

      if (eager) {
        return compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
      }
      return /** @this */ function lazyCompilation() {
        if (!compiled) {
          compiled = compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);

          // Null out all of these references in order to make them eligible for garbage collection
          // since this is a potentially long lived closure
          $compileNodes = transcludeFn = previousCompileContext = null;
        }
        return compiled.apply(this, arguments);
      };
    }

    /**
     * Once the directives have been collected, their compile functions are executed. This method
     * is responsible for inlining directive templates as well as terminating the application
     * of the directives if the terminal directive has been reached.
     *
     * @param {Array} directives Array of collected directives to execute their compile function.
     *        this needs to be pre-sorted by priority order.
     * @param {Node} compileNode The raw DOM node to apply the compile functions to
     * @param {Object} templateAttrs The shared attribute function
     * @param {function(angular.Scope, cloneAttachFn=)} transcludeFn A linking function, where the
     *                                                  scope argument is auto-generated to the new
     *                                                  child of the transcluded parent scope.
     * @param {JQLite} jqCollection If we are working on the root of the compile tree then this
     *                              argument has the root jqLite array so that we can replace nodes
     *                              on it.
     * @param {Object=} originalReplaceDirective An optional directive that will be ignored when
     *                                           compiling the transclusion.
     * @param {Array.<Function>} preLinkFns
     * @param {Array.<Function>} postLinkFns
     * @param {Object} previousCompileContext Context used for previous compilation of the current
     *                                        node
     * @returns {Function} linkFn
     */
    function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn,
                                   jqCollection, originalReplaceDirective, preLinkFns, postLinkFns,
                                   previousCompileContext) {
      previousCompileContext = previousCompileContext || {};

      var terminalPriority = -Number.MAX_VALUE,
          newScopeDirective = previousCompileContext.newScopeDirective,
          controllerDirectives = previousCompileContext.controllerDirectives,
          newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
          templateDirective = previousCompileContext.templateDirective,
          nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
          hasTranscludeDirective = false,
          hasTemplate = false,
          hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
          $compileNode = templateAttrs.$$element = jqLite(compileNode),
          directive,
          directiveName,
          $template,
          replaceDirective = originalReplaceDirective,
          childTranscludeFn = transcludeFn,
          linkFn,
          didScanForMultipleTransclusion = false,
          mightHaveMultipleTransclusionError = false,
          directiveValue;

      // executes all directives on the current element
      for (var i = 0, ii = directives.length; i < ii; i++) {
        directive = directives[i];
        var attrStart = directive.$$start;
        var attrEnd = directive.$$end;

        // collect multiblock sections
        if (attrStart) {
          $compileNode = groupScan(compileNode, attrStart, attrEnd);
        }
        $template = undefined;

        if (terminalPriority > directive.priority) {
          break; // prevent further processing of directives
        }

        directiveValue = directive.scope;

        if (directiveValue) {

          // skip the check for directives with async templates, we'll check the derived sync
          // directive when the template arrives
          if (!directive.templateUrl) {
            if (isObject(directiveValue)) {
              // This directive is trying to add an isolated scope.
              // Check that there is no scope of any kind already
              assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective,
                                directive, $compileNode);
              newIsolateScopeDirective = directive;
            } else {
              // This directive is trying to add a child scope.
              // Check that there is no isolated scope already
              assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive,
                                $compileNode);
            }
          }

          newScopeDirective = newScopeDirective || directive;
        }

        directiveName = directive.name;

        // If we encounter a condition that can result in transclusion on the directive,
        // then scan ahead in the remaining directives for others that may cause a multiple
        // transclusion error to be thrown during the compilation process.  If a matching directive
        // is found, then we know that when we encounter a transcluded directive, we need to eagerly
        // compile the `transclude` function rather than doing it lazily in order to throw
        // exceptions at the correct time
        if (!didScanForMultipleTransclusion && ((directive.replace && (directive.templateUrl || directive.template))
            || (directive.transclude && !directive.$$tlb))) {
                var candidateDirective;

                for (var scanningIndex = i + 1; (candidateDirective = directives[scanningIndex++]);) {
                    if ((candidateDirective.transclude && !candidateDirective.$$tlb)
                        || (candidateDirective.replace && (candidateDirective.templateUrl || candidateDirective.template))) {
                        mightHaveMultipleTransclusionError = true;
                        break;
                    }
                }

                didScanForMultipleTransclusion = true;
        }

        if (!directive.templateUrl && directive.controller) {
          controllerDirectives = controllerDirectives || createMap();
          assertNoDuplicate('\'' + directiveName + '\' controller',
              controllerDirectives[directiveName], directive, $compileNode);
          controllerDirectives[directiveName] = directive;
        }

        directiveValue = directive.transclude;

        if (directiveValue) {
          hasTranscludeDirective = true;

          // Special case ngIf and ngRepeat so that we don't complain about duplicate transclusion.
          // This option should only be used by directives that know how to safely handle element transclusion,
          // where the transcluded nodes are added or replaced after linking.
          if (!directive.$$tlb) {
            assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
            nonTlbTranscludeDirective = directive;
          }

          if (directiveValue === 'element') {
            hasElementTranscludeDirective = true;
            terminalPriority = directive.priority;
            $template = $compileNode;
            $compileNode = templateAttrs.$$element =
                jqLite(compile.$$createComment(directiveName, templateAttrs[directiveName]));
            compileNode = $compileNode[0];
            replaceWith(jqCollection, sliceArgs($template), compileNode);

            // Support: Chrome < 50
            // https://github.com/angular/angular.js/issues/14041

            // In the versions of V8 prior to Chrome 50, the document fragment that is created
            // in the `replaceWith` function is improperly garbage collected despite still
            // being referenced by the `parentNode` property of all of the child nodes.  By adding
            // a reference to the fragment via a different property, we can avoid that incorrect
            // behavior.
            // TODO: remove this line after Chrome 50 has been released
            $template[0].$$parentNode = $template[0].parentNode;

            childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, terminalPriority,
                                        replaceDirective && replaceDirective.name, {
                                          // Don't pass in:
                                          // - controllerDirectives - otherwise we'll create duplicates controllers
                                          // - newIsolateScopeDirective or templateDirective - combining templates with
                                          //   element transclusion doesn't make sense.
                                          //
                                          // We need only nonTlbTranscludeDirective so that we prevent putting transclusion
                                          // on the same element more than once.
                                          nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                        });
          } else {

            var slots = createMap();

            if (!isObject(directiveValue)) {
              $template = jqLite(jqLiteClone(compileNode)).contents();
            } else {

              // We have transclusion slots,
              // collect them up, compile them and store their transclusion functions
              $template = [];

              var slotMap = createMap();
              var filledSlots = createMap();

              // Parse the element selectors
              forEach(directiveValue, function(elementSelector, slotName) {
                // If an element selector starts with a ? then it is optional
                var optional = (elementSelector.charAt(0) === '?');
                elementSelector = optional ? elementSelector.substring(1) : elementSelector;

                slotMap[elementSelector] = slotName;

                // We explicitly assign `null` since this implies that a slot was defined but not filled.
                // Later when calling boundTransclusion functions with a slot name we only error if the
                // slot is `undefined`
                slots[slotName] = null;

                // filledSlots contains `true` for all slots that are either optional or have been
                // filled. This is used to check that we have not missed any required slots
                filledSlots[slotName] = optional;
              });

              // Add the matching elements into their slot
              forEach($compileNode.contents(), function(node) {
                var slotName = slotMap[directiveNormalize(nodeName_(node))];
                if (slotName) {
                  filledSlots[slotName] = true;
                  slots[slotName] = slots[slotName] || [];
                  slots[slotName].push(node);
                } else {
                  $template.push(node);
                }
              });

              // Check for required slots that were not filled
              forEach(filledSlots, function(filled, slotName) {
                if (!filled) {
                  throw $compileMinErr('reqslot', 'Required transclusion slot `{0}` was not filled.', slotName);
                }
              });

              for (var slotName in slots) {
                if (slots[slotName]) {
                  // Only define a transclusion function if the slot was filled
                  slots[slotName] = compilationGenerator(mightHaveMultipleTransclusionError, slots[slotName], transcludeFn);
                }
              }
            }

            $compileNode.empty(); // clear contents
            childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, undefined,
                undefined, { needsNewScope: directive.$$isolateScope || directive.$$newScope});
            childTranscludeFn.$$slots = slots;
          }
        }

        if (directive.template) {
          hasTemplate = true;
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          directiveValue = (isFunction(directive.template))
              ? directive.template($compileNode, templateAttrs)
              : directive.template;

          directiveValue = denormalizeTemplate(directiveValue);

          if (directive.replace) {
            replaceDirective = directive;
            if (jqLiteIsTextNode(directiveValue)) {
              $template = [];
            } else {
              $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
            }
            compileNode = $template[0];

            if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
              throw $compileMinErr('tplrt',
                  'Template for directive \'{0}\' must have exactly one root element. {1}',
                  directiveName, '');
            }

            replaceWith(jqCollection, $compileNode, compileNode);

            var newTemplateAttrs = {$attr: {}};

            // combine directives from the original node and from the template:
            // - take the array of directives for this element
            // - split it into two parts, those that already applied (processed) and those that weren't (unprocessed)
            // - collect directives from the template and sort them by priority
            // - combine directives as: processed + template + unprocessed
            var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
            var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));

            if (newIsolateScopeDirective || newScopeDirective) {
              // The original directive caused the current element to be replaced but this element
              // also needs to have a new scope, so we need to tell the template directives
              // that they would need to get their scope from further up, if they require transclusion
              markDirectiveScope(templateDirectives, newIsolateScopeDirective, newScopeDirective);
            }
            directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            ii = directives.length;
          } else {
            $compileNode.html(directiveValue);
          }
        }

        if (directive.templateUrl) {
          hasTemplate = true;
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          if (directive.replace) {
            replaceDirective = directive;
          }

          // eslint-disable-next-line no-func-assign
          nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode,
              templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newScopeDirective: (newScopeDirective !== directive) && newScopeDirective,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
          ii = directives.length;
        } else if (directive.compile) {
          try {
            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
            var context = directive.$$originalDirective || directive;
            if (isFunction(linkFn)) {
              addLinkFns(null, bind(context, linkFn), attrStart, attrEnd);
            } else if (linkFn) {
              addLinkFns(bind(context, linkFn.pre), bind(context, linkFn.post), attrStart, attrEnd);
            }
          } catch (e) {
            $exceptionHandler(e, startingTag($compileNode));
          }
        }

        if (directive.terminal) {
          nodeLinkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }

      }

      nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
      nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
      nodeLinkFn.templateOnThisElement = hasTemplate;
      nodeLinkFn.transclude = childTranscludeFn;

      previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;

      // might be normal or delayed nodeLinkFn depending on if templateUrl is present
      return nodeLinkFn;

      ////////////////////

      function addLinkFns(pre, post, attrStart, attrEnd) {
        if (pre) {
          if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
          pre.require = directive.require;
          pre.directiveName = directiveName;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            pre = cloneAndAnnotateFn(pre, {isolateScope: true});
          }
          preLinkFns.push(pre);
        }
        if (post) {
          if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
          post.require = directive.require;
          post.directiveName = directiveName;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            post = cloneAndAnnotateFn(post, {isolateScope: true});
          }
          postLinkFns.push(post);
        }
      }

      function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
        var i, ii, linkFn, isolateScope, controllerScope, elementControllers, transcludeFn, $element,
            attrs, scopeBindingInfo;

        if (compileNode === linkNode) {
          attrs = templateAttrs;
          $element = templateAttrs.$$element;
        } else {
          $element = jqLite(linkNode);
          attrs = new Attributes($element, templateAttrs);
        }

        controllerScope = scope;
        if (newIsolateScopeDirective) {
          isolateScope = scope.$new(true);
        } else if (newScopeDirective) {
          controllerScope = scope.$parent;
        }

        if (boundTranscludeFn) {
          // track `boundTranscludeFn` so it can be unwrapped if `transcludeFn`
          // is later passed as `parentBoundTranscludeFn` to `publicLinkFn`
          transcludeFn = controllersBoundTransclude;
          transcludeFn.$$boundTransclude = boundTranscludeFn;
          // expose the slots on the `$transclude` function
          transcludeFn.isSlotFilled = function(slotName) {
            return !!boundTranscludeFn.$$slots[slotName];
          };
        }

        if (controllerDirectives) {
          elementControllers = setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope, newIsolateScopeDirective);
        }

        if (newIsolateScopeDirective) {
          // Initialize isolate scope bindings for new isolate scope directive.
          compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective ||
              templateDirective === newIsolateScopeDirective.$$originalDirective)));
          compile.$$addScopeClass($element, true);
          isolateScope.$$isolateBindings =
              newIsolateScopeDirective.$$isolateBindings;
          scopeBindingInfo = initializeDirectiveBindings(scope, attrs, isolateScope,
                                        isolateScope.$$isolateBindings,
                                        newIsolateScopeDirective);
          if (scopeBindingInfo.removeWatches) {
            isolateScope.$on('$destroy', scopeBindingInfo.removeWatches);
          }
        }

        // Initialize bindToController bindings
        for (var name in elementControllers) {
          var controllerDirective = controllerDirectives[name];
          var controller = elementControllers[name];
          var bindings = controllerDirective.$$bindings.bindToController;

          controller.instance = controller();
          $element.data('$' + controllerDirective.name + 'Controller', controller.instance);
          controller.bindingInfo =
            initializeDirectiveBindings(controllerScope, attrs, controller.instance, bindings, controllerDirective);
          }

        // Bind the required controllers to the controller, if `require` is an object and `bindToController` is truthy
        forEach(controllerDirectives, function(controllerDirective, name) {
          var require = controllerDirective.require;
          if (controllerDirective.bindToController && !isArray(require) && isObject(require)) {
            extend(elementControllers[name].instance, getControllers(name, require, $element, elementControllers));
          }
        });

        // Handle the init and destroy lifecycle hooks on all controllers that have them
        forEach(elementControllers, function(controller) {
          var controllerInstance = controller.instance;
          if (isFunction(controllerInstance.$onChanges)) {
            try {
              controllerInstance.$onChanges(controller.bindingInfo.initialChanges);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          if (isFunction(controllerInstance.$onInit)) {
            try {
              controllerInstance.$onInit();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          if (isFunction(controllerInstance.$doCheck)) {
            controllerScope.$watch(function() { controllerInstance.$doCheck(); });
            controllerInstance.$doCheck();
          }
          if (isFunction(controllerInstance.$onDestroy)) {
            controllerScope.$on('$destroy', function callOnDestroyHook() {
              controllerInstance.$onDestroy();
            });
          }
        });

        // PRELINKING
        for (i = 0, ii = preLinkFns.length; i < ii; i++) {
          linkFn = preLinkFns[i];
          invokeLinkFn(linkFn,
              linkFn.isolateScope ? isolateScope : scope,
              $element,
              attrs,
              linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
              transcludeFn
          );
        }

        // RECURSION
        // We only pass the isolate scope, if the isolate directive has a template,
        // otherwise the child elements do not belong to the isolate directive.
        var scopeToChild = scope;
        if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
          scopeToChild = isolateScope;
        }
        if (childLinkFn) {
          childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
        }

        // POSTLINKING
        for (i = postLinkFns.length - 1; i >= 0; i--) {
          linkFn = postLinkFns[i];
          invokeLinkFn(linkFn,
              linkFn.isolateScope ? isolateScope : scope,
              $element,
              attrs,
              linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
              transcludeFn
          );
        }

        // Trigger $postLink lifecycle hooks
        forEach(elementControllers, function(controller) {
          var controllerInstance = controller.instance;
          if (isFunction(controllerInstance.$postLink)) {
            controllerInstance.$postLink();
          }
        });

        // This is the function that is injected as `$transclude`.
        // Note: all arguments are optional!
        function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement, slotName) {
          var transcludeControllers;
          // No scope passed in:
          if (!isScope(scope)) {
            slotName = futureParentElement;
            futureParentElement = cloneAttachFn;
            cloneAttachFn = scope;
            scope = undefined;
          }

          if (hasElementTranscludeDirective) {
            transcludeControllers = elementControllers;
          }
          if (!futureParentElement) {
            futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
          }
          if (slotName) {
            // slotTranscludeFn can be one of three things:
            //  * a transclude function - a filled slot
            //  * `null` - an optional slot that was not filled
            //  * `undefined` - a slot that was not declared (i.e. invalid)
            var slotTranscludeFn = boundTranscludeFn.$$slots[slotName];
            if (slotTranscludeFn) {
              return slotTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
            } else if (isUndefined(slotTranscludeFn)) {
              throw $compileMinErr('noslot',
               'No parent directive that requires a transclusion with slot name "{0}". ' +
               'Element: {1}',
               slotName, startingTag($element));
            }
          } else {
            return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
          }
        }
      }
    }

    function getControllers(directiveName, require, $element, elementControllers) {
      var value;

      if (isString(require)) {
        var match = require.match(REQUIRE_PREFIX_REGEXP);
        var name = require.substring(match[0].length);
        var inheritType = match[1] || match[3];
        var optional = match[2] === '?';

        //If only parents then start at the parent element
        if (inheritType === '^^') {
          $element = $element.parent();
        //Otherwise attempt getting the controller from elementControllers in case
        //the element is transcluded (and has no data) and to avoid .data if possible
        } else {
          value = elementControllers && elementControllers[name];
          value = value && value.instance;
        }

        if (!value) {
          var dataName = '$' + name + 'Controller';
          value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName);
        }

        if (!value && !optional) {
          throw $compileMinErr('ctreq',
              'Controller \'{0}\', required by directive \'{1}\', can\'t be found!',
              name, directiveName);
        }
      } else if (isArray(require)) {
        value = [];
        for (var i = 0, ii = require.length; i < ii; i++) {
          value[i] = getControllers(directiveName, require[i], $element, elementControllers);
        }
      } else if (isObject(require)) {
        value = {};
        forEach(require, function(controller, property) {
          value[property] = getControllers(directiveName, controller, $element, elementControllers);
        });
      }

      return value || null;
    }

    function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope, newIsolateScopeDirective) {
      var elementControllers = createMap();
      for (var controllerKey in controllerDirectives) {
        var directive = controllerDirectives[controllerKey];
        var locals = {
          $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
          $element: $element,
          $attrs: attrs,
          $transclude: transcludeFn
        };

        var controller = directive.controller;
        if (controller === '@') {
          controller = attrs[directive.name];
        }

        var controllerInstance = $controller(controller, locals, true, directive.controllerAs);

        // For directives with element transclusion the element is a comment.
        // In this case .data will not attach any data.
        // Instead, we save the controllers for the element in a local hash and attach to .data
        // later, once we have the actual element.
        elementControllers[directive.name] = controllerInstance;
        $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
      }
      return elementControllers;
    }

    // Depending upon the context in which a directive finds itself it might need to have a new isolated
    // or child scope created. For instance:
    // * if the directive has been pulled into a template because another directive with a higher priority
    // asked for element transclusion
    // * if the directive itself asks for transclusion but it is at the root of a template and the original
    // element was replaced. See https://github.com/angular/angular.js/issues/12936
    function markDirectiveScope(directives, isolateScope, newScope) {
      for (var j = 0, jj = directives.length; j < jj; j++) {
        directives[j] = inherit(directives[j], {$$isolateScope: isolateScope, $$newScope: newScope});
      }
    }

    /**
     * looks up the directive and decorates it with exception handling and proper parameters. We
     * call this the boundDirective.
     *
     * @param {string} name name of the directive to look up.
     * @param {string} location The directive must be found in specific format.
     *   String containing any of theses characters:
     *
     *   * `E`: element name
     *   * `A': attribute
     *   * `C`: class
     *   * `M`: comment
     * @returns {boolean} true if directive was added.
     */
    function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName,
                          endAttrName) {
      if (name === ignoreDirective) return null;
      var match = null;
      if (hasDirectives.hasOwnProperty(name)) {
        for (var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i < ii; i++) {
          directive = directives[i];
          if ((isUndefined(maxPriority) || maxPriority > directive.priority) &&
               directive.restrict.indexOf(location) !== -1) {
            if (startAttrName) {
              directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
            }
            if (!directive.$$bindings) {
              var bindings = directive.$$bindings =
                  parseDirectiveBindings(directive, directive.name);
              if (isObject(bindings.isolateScope)) {
                directive.$$isolateBindings = bindings.isolateScope;
              }
            }
            tDirectives.push(directive);
            match = directive;
          }
        }
      }
      return match;
    }


    /**
     * looks up the directive and returns true if it is a multi-element directive,
     * and therefore requires DOM nodes between -start and -end markers to be grouped
     * together.
     *
     * @param {string} name name of the directive to look up.
     * @returns true if directive was registered as multi-element.
     */
    function directiveIsMultiElement(name) {
      if (hasDirectives.hasOwnProperty(name)) {
        for (var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i < ii; i++) {
          directive = directives[i];
          if (directive.multiElement) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * When the element is replaced with HTML template then the new attributes
     * on the template need to be merged with the existing attributes in the DOM.
     * The desired effect is to have both of the attributes present.
     *
     * @param {object} dst destination attributes (original DOM)
     * @param {object} src source attributes (from the directive template)
     */
    function mergeTemplateAttributes(dst, src) {
      var srcAttr = src.$attr,
          dstAttr = dst.$attr;

      // reapply the old attributes to the new element
      forEach(dst, function(value, key) {
        if (key.charAt(0) !== '$') {
          if (src[key] && src[key] !== value) {
            if (value.length) {
              value += (key === 'style' ? ';' : ' ') + src[key];
            } else {
              value = src[key];
            }
          }
          dst.$set(key, value, true, srcAttr[key]);
        }
      });

      // copy the new attributes on the old attrs object
      forEach(src, function(value, key) {
        // Check if we already set this attribute in the loop above.
        // `dst` will never contain hasOwnProperty as DOM parser won't let it.
        // You will get an "InvalidCharacterError: DOM Exception 5" error if you
        // have an attribute like "has-own-property" or "data-has-own-property", etc.
        if (!dst.hasOwnProperty(key) && key.charAt(0) !== '$') {
          dst[key] = value;

          if (key !== 'class' && key !== 'style') {
            dstAttr[key] = srcAttr[key];
          }
        }
      });
    }


    function compileTemplateUrl(directives, $compileNode, tAttrs,
        $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
      var linkQueue = [],
          afterTemplateNodeLinkFn,
          afterTemplateChildLinkFn,
          beforeTemplateCompileNode = $compileNode[0],
          origAsyncDirective = directives.shift(),
          derivedSyncDirective = inherit(origAsyncDirective, {
            templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective
          }),
          templateUrl = (isFunction(origAsyncDirective.templateUrl))
              ? origAsyncDirective.templateUrl($compileNode, tAttrs)
              : origAsyncDirective.templateUrl,
          templateNamespace = origAsyncDirective.templateNamespace;

      $compileNode.empty();

      $templateRequest(templateUrl)
        .then(function(content) {
          var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;

          content = denormalizeTemplate(content);

          if (origAsyncDirective.replace) {
            if (jqLiteIsTextNode(content)) {
              $template = [];
            } else {
              $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
            }
            compileNode = $template[0];

            if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
              throw $compileMinErr('tplrt',
                  'Template for directive \'{0}\' must have exactly one root element. {1}',
                  origAsyncDirective.name, templateUrl);
            }

            tempTemplateAttrs = {$attr: {}};
            replaceWith($rootElement, $compileNode, compileNode);
            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);

            if (isObject(origAsyncDirective.scope)) {
              // the original directive that caused the template to be loaded async required
              // an isolate scope
              markDirectiveScope(templateDirectives, true);
            }
            directives = templateDirectives.concat(directives);
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
          } else {
            compileNode = beforeTemplateCompileNode;
            $compileNode.html(content);
          }

          directives.unshift(derivedSyncDirective);

          afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs,
              childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns,
              previousCompileContext);
          forEach($rootElement, function(node, i) {
            if (node === compileNode) {
              $rootElement[i] = $compileNode[0];
            }
          });
          afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);

          while (linkQueue.length) {
            var scope = linkQueue.shift(),
                beforeTemplateLinkNode = linkQueue.shift(),
                linkRootElement = linkQueue.shift(),
                boundTranscludeFn = linkQueue.shift(),
                linkNode = $compileNode[0];

            if (scope.$$destroyed) continue;

            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
              var oldClasses = beforeTemplateLinkNode.className;

              if (!(previousCompileContext.hasElementTranscludeDirective &&
                  origAsyncDirective.replace)) {
                // it was cloned therefore we have to clone as well.
                linkNode = jqLiteClone(compileNode);
              }
              replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);

              // Copy in CSS classes from original node
              safeAddClass(jqLite(linkNode), oldClasses);
            }
            if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
              childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
            } else {
              childBoundTranscludeFn = boundTranscludeFn;
            }
            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement,
              childBoundTranscludeFn);
          }
          linkQueue = null;
        }).catch(function(error) {
          if (isError(error)) {
            $exceptionHandler(error);
          }
        });

      return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
        var childBoundTranscludeFn = boundTranscludeFn;
        if (scope.$$destroyed) return;
        if (linkQueue) {
          linkQueue.push(scope,
                         node,
                         rootElement,
                         childBoundTranscludeFn);
        } else {
          if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
            childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
          }
          afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn);
        }
      };
    }


    /**
     * Sorting function for bound directives.
     */
    function byPriority(a, b) {
      var diff = b.priority - a.priority;
      if (diff !== 0) return diff;
      if (a.name !== b.name) return (a.name < b.name) ? -1 : 1;
      return a.index - b.index;
    }

    function assertNoDuplicate(what, previousDirective, directive, element) {

      function wrapModuleNameIfDefined(moduleName) {
        return moduleName ?
          (' (module: ' + moduleName + ')') :
          '';
      }

      if (previousDirective) {
        throw $compileMinErr('multidir', 'Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}',
            previousDirective.name, wrapModuleNameIfDefined(previousDirective.$$moduleName),
            directive.name, wrapModuleNameIfDefined(directive.$$moduleName), what, startingTag(element));
      }
    }


    function addTextInterpolateDirective(directives, text) {
      var interpolateFn = $interpolate(text, true);
      if (interpolateFn) {
        directives.push({
          priority: 0,
          compile: function textInterpolateCompileFn(templateNode) {
            var templateNodeParent = templateNode.parent(),
                hasCompileParent = !!templateNodeParent.length;

            // When transcluding a template that has bindings in the root
            // we don't have a parent and thus need to add the class during linking fn.
            if (hasCompileParent) compile.$$addBindingClass(templateNodeParent);

            return function textInterpolateLinkFn(scope, node) {
              var parent = node.parent();
              if (!hasCompileParent) compile.$$addBindingClass(parent);
              compile.$$addBindingInfo(parent, interpolateFn.expressions);
              scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                node[0].nodeValue = value;
              });
            };
          }
        });
      }
    }


    function wrapTemplate(type, template) {
      type = lowercase(type || 'html');
      switch (type) {
      case 'svg':
      case 'math':
        var wrapper = window.document.createElement('div');
        wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
        return wrapper.childNodes[0].childNodes;
      default:
        return template;
      }
    }


    function getTrustedContext(node, attrNormalizedName) {
      if (attrNormalizedName === 'srcdoc') {
        return $sce.HTML;
      }
      var tag = nodeName_(node);
      // All tags with src attributes require a RESOURCE_URL value, except for
      // img and various html5 media tags.
      if (attrNormalizedName === 'src' || attrNormalizedName === 'ngSrc') {
        if (['img', 'video', 'audio', 'source', 'track'].indexOf(tag) === -1) {
          return $sce.RESOURCE_URL;
        }
      } else if (
          // Some xlink:href are okay, most aren't
          (attrNormalizedName === 'xlinkHref' && (tag !== 'image' && tag !== 'a')) ||
          // Formaction
          (tag === 'form' && attrNormalizedName === 'action') ||
          // If relative URLs can go where they are not expected to, then
          // all sorts of trust issues can arise.
          (tag === 'base' && attrNormalizedName === 'href') ||
          // links can be stylesheets or imports, which can run script in the current origin
          (tag === 'link' && attrNormalizedName === 'href')
      ) {
        return $sce.RESOURCE_URL;
      }
    }


    function addAttrInterpolateDirective(node, directives, value, name, isNgAttr) {
      var trustedContext = getTrustedContext(node, name);
      var mustHaveExpression = !isNgAttr;
      var allOrNothing = ALL_OR_NOTHING_ATTRS[name] || isNgAttr;

      var interpolateFn = $interpolate(value, mustHaveExpression, trustedContext, allOrNothing);

      // no interpolation found -> ignore
      if (!interpolateFn) return;

      if (name === 'multiple' && nodeName_(node) === 'select') {
        throw $compileMinErr('selmulti',
            'Binding to the \'multiple\' attribute is not supported. Element: {0}',
            startingTag(node));
      }

      if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
        throw $compileMinErr('nodomevents',
            'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' +
                'ng- versions (such as ng-click instead of onclick) instead.');
      }

      directives.push({
        priority: 100,
        compile: function() {
            return {
              pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                var $$observers = (attr.$$observers || (attr.$$observers = createMap()));

                // If the attribute has changed since last $interpolate()ed
                var newValue = attr[name];
                if (newValue !== value) {
                  // we need to interpolate again since the attribute value has been updated
                  // (e.g. by another directive's compile function)
                  // ensure unset/empty values make interpolateFn falsy
                  interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                  value = newValue;
                }

                // if attribute was updated so that there is no interpolation going on we don't want to
                // register any observers
                if (!interpolateFn) return;

                // initialize attr object so that it's ready in case we need the value for isolate
                // scope initialization, otherwise the value would not be available from isolate
                // directive's linking fn during linking phase
                attr[name] = interpolateFn(scope);

                ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                (attr.$$observers && attr.$$observers[name].$$scope || scope).
                  $watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    //special case for class attribute addition + removal
                    //so that class changes can tap into the animation
                    //hooks provided by the $animate service. Be sure to
                    //skip animations when the first digest occurs (when
                    //both the new and the old values are the same) since
                    //the CSS classes are the non-interpolated values
                    if (name === 'class' && newValue !== oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
              }
            };
          }
      });
    }


    /**
     * This is a special jqLite.replaceWith, which can replace items which
     * have no parents, provided that the containing jqLite collection is provided.
     *
     * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes
     *                               in the root of the tree.
     * @param {JqLite} elementsToRemove The jqLite element which we are going to replace. We keep
     *                                  the shell, but replace its DOM node reference.
     * @param {Node} newNode The new DOM node.
     */
    function replaceWith($rootElement, elementsToRemove, newNode) {
      var firstElementToRemove = elementsToRemove[0],
          removeCount = elementsToRemove.length,
          parent = firstElementToRemove.parentNode,
          i, ii;

      if ($rootElement) {
        for (i = 0, ii = $rootElement.length; i < ii; i++) {
          if ($rootElement[i] === firstElementToRemove) {
            $rootElement[i++] = newNode;
            for (var j = i, j2 = j + removeCount - 1,
                     jj = $rootElement.length;
                 j < jj; j++, j2++) {
              if (j2 < jj) {
                $rootElement[j] = $rootElement[j2];
              } else {
                delete $rootElement[j];
              }
            }
            $rootElement.length -= removeCount - 1;

            // If the replaced element is also the jQuery .context then replace it
            // .context is a deprecated jQuery api, so we should set it only when jQuery set it
            // http://api.jquery.com/context/
            if ($rootElement.context === firstElementToRemove) {
              $rootElement.context = newNode;
            }
            break;
          }
        }
      }

      if (parent) {
        parent.replaceChild(newNode, firstElementToRemove);
      }

      // Append all the `elementsToRemove` to a fragment. This will...
      // - remove them from the DOM
      // - allow them to still be traversed with .nextSibling
      // - allow a single fragment.qSA to fetch all elements being removed
      var fragment = window.document.createDocumentFragment();
      for (i = 0; i < removeCount; i++) {
        fragment.appendChild(elementsToRemove[i]);
      }

      if (jqLite.hasData(firstElementToRemove)) {
        // Copy over user data (that includes AngularJS's $scope etc.). Don't copy private
        // data here because there's no public interface in jQuery to do that and copying over
        // event listeners (which is the main use of private data) wouldn't work anyway.
        jqLite.data(newNode, jqLite.data(firstElementToRemove));

        // Remove $destroy event listeners from `firstElementToRemove`
        jqLite(firstElementToRemove).off('$destroy');
      }

      // Cleanup any data/listeners on the elements and children.
      // This includes invoking the $destroy event on any elements with listeners.
      jqLite.cleanData(fragment.querySelectorAll('*'));

      // Update the jqLite collection to only contain the `newNode`
      for (i = 1; i < removeCount; i++) {
        delete elementsToRemove[i];
      }
      elementsToRemove[0] = newNode;
      elementsToRemove.length = 1;
    }


    function cloneAndAnnotateFn(fn, annotation) {
      return extend(function() { return fn.apply(null, arguments); }, fn, annotation);
    }


    function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
      try {
        linkFn(scope, $element, attrs, controllers, transcludeFn);
      } catch (e) {
        $exceptionHandler(e, startingTag($element));
      }
    }

    function strictBindingsCheck(attrName, directiveName) {
      if (strictComponentBindingsEnabled) {
        throw $compileMinErr('missingattr',
          'Attribute \'{0}\' of \'{1}\' is non-optional and must be set!',
          attrName, directiveName);
      }
    }

    // Set up $watches for isolate scope and controller bindings.
    function initializeDirectiveBindings(scope, attrs, destination, bindings, directive) {
      var removeWatchCollection = [];
      var initialChanges = {};
      var changes;

      forEach(bindings, function initializeBinding(definition, scopeName) {
        var attrName = definition.attrName,
        optional = definition.optional,
        mode = definition.mode, // @, =, <, or &
        lastValue,
        parentGet, parentSet, compare, removeWatch;

        switch (mode) {

          case '@':
            if (!optional && !hasOwnProperty.call(attrs, attrName)) {
              strictBindingsCheck(attrName, directive.name);
              destination[scopeName] = attrs[attrName] = undefined;

            }
            removeWatch = attrs.$observe(attrName, function(value) {
              if (isString(value) || isBoolean(value)) {
                var oldValue = destination[scopeName];
                recordChanges(scopeName, value, oldValue);
                destination[scopeName] = value;
              }
            });
            attrs.$$observers[attrName].$$scope = scope;
            lastValue = attrs[attrName];
            if (isString(lastValue)) {
              // If the attribute has been provided then we trigger an interpolation to ensure
              // the value is there for use in the link fn
              destination[scopeName] = $interpolate(lastValue)(scope);
            } else if (isBoolean(lastValue)) {
              // If the attributes is one of the BOOLEAN_ATTR then AngularJS will have converted
              // the value to boolean rather than a string, so we special case this situation
              destination[scopeName] = lastValue;
            }
            initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);
            removeWatchCollection.push(removeWatch);
            break;

          case '=':
            if (!hasOwnProperty.call(attrs, attrName)) {
              if (optional) break;
              strictBindingsCheck(attrName, directive.name);
              attrs[attrName] = undefined;
            }
            if (optional && !attrs[attrName]) break;

            parentGet = $parse(attrs[attrName]);
            if (parentGet.literal) {
              compare = equals;
            } else {
              compare = simpleCompare;
            }
            parentSet = parentGet.assign || function() {
              // reset the change, or we will throw this exception on every $digest
              lastValue = destination[scopeName] = parentGet(scope);
              throw $compileMinErr('nonassign',
                  'Expression \'{0}\' in attribute \'{1}\' used with directive \'{2}\' is non-assignable!',
                  attrs[attrName], attrName, directive.name);
            };
            lastValue = destination[scopeName] = parentGet(scope);
            var parentValueWatch = function parentValueWatch(parentValue) {
              if (!compare(parentValue, destination[scopeName])) {
                // we are out of sync and need to copy
                if (!compare(parentValue, lastValue)) {
                  // parent changed and it has precedence
                  destination[scopeName] = parentValue;
                } else {
                  // if the parent can be assigned then do so
                  parentSet(scope, parentValue = destination[scopeName]);
                }
              }
              lastValue = parentValue;
              return lastValue;
            };
            parentValueWatch.$stateful = true;
            if (definition.collection) {
              removeWatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
            } else {
              removeWatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
            }
            removeWatchCollection.push(removeWatch);
            break;

          case '<':
            if (!hasOwnProperty.call(attrs, attrName)) {
              if (optional) break;
              strictBindingsCheck(attrName, directive.name);
              attrs[attrName] = undefined;
            }
            if (optional && !attrs[attrName]) break;

            parentGet = $parse(attrs[attrName]);
            var isLiteral = parentGet.literal;

            var initialValue = destination[scopeName] = parentGet(scope);
            initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);

            removeWatch = scope.$watch(parentGet, function parentValueWatchAction(newValue, oldValue) {
              if (oldValue === newValue) {
                if (oldValue === initialValue || (isLiteral && equals(oldValue, initialValue))) {
                  return;
                }
                oldValue = initialValue;
              }
              recordChanges(scopeName, newValue, oldValue);
              destination[scopeName] = newValue;
            });

            removeWatchCollection.push(removeWatch);
            break;

          case '&':
            if (!optional && !hasOwnProperty.call(attrs, attrName)) {
              strictBindingsCheck(attrName, directive.name);
            }
            // Don't assign Object.prototype method to scope
            parentGet = attrs.hasOwnProperty(attrName) ? $parse(attrs[attrName]) : noop;

            // Don't assign noop to destination if expression is not valid
            if (parentGet === noop && optional) break;

            destination[scopeName] = function(locals) {
              return parentGet(scope, locals);
            };
            break;
        }
      });

      function recordChanges(key, currentValue, previousValue) {
        if (isFunction(destination.$onChanges) && !simpleCompare(currentValue, previousValue)) {
          // If we have not already scheduled the top level onChangesQueue handler then do so now
          if (!onChangesQueue) {
            scope.$$postDigest(flushOnChangesQueue);
            onChangesQueue = [];
          }
          // If we have not already queued a trigger of onChanges for this controller then do so now
          if (!changes) {
            changes = {};
            onChangesQueue.push(triggerOnChangesHook);
          }
          // If the has been a change on this property already then we need to reuse the previous value
          if (changes[key]) {
            previousValue = changes[key].previousValue;
          }
          // Store this change
          changes[key] = new SimpleChange(previousValue, currentValue);
        }
      }

      function triggerOnChangesHook() {
        destination.$onChanges(changes);
        // Now clear the changes so that we schedule onChanges when more changes arrive
        changes = undefined;
      }

      return {
        initialChanges: initialChanges,
        removeWatches: removeWatchCollection.length && function removeWatches() {
          for (var i = 0, ii = removeWatchCollection.length; i < ii; ++i) {
            removeWatchCollection[i]();
          }
        }
      };
    }
  }];
}

function SimpleChange(previous, current) {
  this.previousValue = previous;
  this.currentValue = current;
}
SimpleChange.prototype.isFirstChange = function() { return this.previousValue === _UNINITIALIZED_VALUE; };


var PREFIX_REGEXP = /^((?:x|data)[:\-_])/i;
var SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;

/**
 * Converts all accepted directives format into proper directive name.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return name
    .replace(PREFIX_REGEXP, '')
    .replace(SPECIAL_CHARS_REGEXP, fnCamelCaseReplace);
}

/**
 * @ngdoc type
 * @name $compile.directive.Attributes
 *
 * @description
 * A shared object between directive compile / linking functions which contains normalized DOM
 * element attributes. The values reflect current binding state `{{ }}`. The normalization is
 * needed since all of these are treated as equivalent in AngularJS:
 *
 * ```
 *    <span ng:bind="a" ng-bind="a" data-ng-bind="a" x-ng-bind="a">
 * ```
 */

/**
 * @ngdoc property
 * @name $compile.directive.Attributes#$attr
 *
 * @description
 * A map of DOM element attribute names to the normalized name. This is
 * needed to do reverse lookup from normalized name back to actual name.
 */


/**
 * @ngdoc method
 * @name $compile.directive.Attributes#$set
 * @kind function
 *
 * @description
 * Set DOM element attribute value.
 *
 *
 * @param {string} name Normalized element attribute name of the property to modify. The name is
 *          reverse-translated using the {@link ng.$compile.directive.Attributes#$attr $attr}
 *          property to the original name.
 * @param {string} value Value to set the attribute to. The value can be an interpolated string.
 */



/**
 * Closure compiler type information
 */

function nodesetLinkingFn(
  /* angular.Scope */ scope,
  /* NodeList */ nodeList,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
) {}

function directiveLinkingFn(
  /* nodesetLinkingFn */ nodesetLinkingFn,
  /* angular.Scope */ scope,
  /* Node */ node,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
) {}

function tokenDifference(str1, str2) {
  var values = '',
      tokens1 = str1.split(/\s+/),
      tokens2 = str2.split(/\s+/);

  outer:
  for (var i = 0; i < tokens1.length; i++) {
    var token = tokens1[i];
    for (var j = 0; j < tokens2.length; j++) {
      if (token === tokens2[j]) continue outer;
    }
    values += (values.length > 0 ? ' ' : '') + token;
  }
  return values;
}

function removeComments(jqNodes) {
  jqNodes = jqLite(jqNodes);
  var i = jqNodes.length;

  if (i <= 1) {
    return jqNodes;
  }

  while (i--) {
    var node = jqNodes[i];
    if (node.nodeType === NODE_TYPE_COMMENT ||
       (node.nodeType === NODE_TYPE_TEXT && node.nodeValue.trim() === '')) {
         splice.call(jqNodes, i, 1);
    }
  }
  return jqNodes;
}
