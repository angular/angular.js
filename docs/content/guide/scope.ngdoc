@ngdoc overview
@name  Scopes
@description

# What are Scopes?

{@link ng.$rootScope.Scope scope} is an object that refers to the application
model. It is an execution context for {@link expression expressions}. Scopes are
arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can
watch {@link guide/expression expressions} and propagate events.

## Scope characteristics

  - Scopes provide APIs ({@link ng.$rootScope.Scope#$watch $watch}) to observe
    model mutations.

  - Scopes provide APIs ({@link ng.$rootScope.Scope#$apply $apply}) to
    propagate any model changes through the system into the view from outside of the "Angular
    realm" (controllers, services, Angular event handlers).

  - Scopes can be nested to limit access to the properties of application components while providing
    access to shared model properties. Nested scopes are either "child scopes" or "isolate scopes".
    A "child scope" (prototypically) inherits properties from its parent scope. An "isolate scope"
    does not. See {@link
    guide/directive#creating-custom-directives_demo_isolating-the-scope-of-a-directive isolated
    scopes} for more information.

  - Scopes provide context against which {@link guide/expression expressions} are evaluated. For
    example `{{username}}` expression is meaningless, unless it is evaluated against a specific
    scope which defines the `username` property.

## Scope as Data-Model

Scope is the glue between application controller and the view. During the template {@link compiler
linking} phase the {@link ng.$compileProvider#directive directives} set up
{@link ng.$rootScope.Scope#$watch `$watch`} expressions on the scope. The
`$watch` allows the directives to be notified of property changes, which allows the directive to
render the updated value to the DOM.

Both controllers and directives have reference to the scope, but not to each other. This
arrangement isolates the controller from the directive as well as from DOM. This is an important
point since it makes the controllers view agnostic, which greatly improves the testing story of
the applications.

<example>
  <file name="script.js">
    function MyController($scope) {
      $scope.username = 'World';

      $scope.sayHello = function() {
        $scope.greeting = 'Hello ' + $scope.username + '!';
      };
    }
  </file>
  <file name="index.html">
    <div ng-controller="MyController">
      Your name:
        <input type="text" ng-model="username">
        <button ng-click='sayHello()'>greet</button>
      <hr>
      {{greeting}}
    </div>
  </file>
</example>

In the above example notice that the `MyController` assigns `World` to the `username` property of
the scope. The scope then notifies the `input` of the assignment, which then renders the input
with username pre-filled. This demonstrates how a controller can write data into the scope.

Similarly the controller can assign behavior to scope as seen by the `sayHello` method, which is
invoked when the user clicks on the 'greet' button. The `sayHello` method can read the `username`
property and create a `greeting` property. This demonstrates that the properties on scope update
automatically when they are bound to HTML input widgets.

Logically the rendering of `{{greeting}}` involves:

  * retrieval of the scope associated with DOM node where `{{greeting}}` is defined in template.
    In this example this is the same scope as the scope which was passed into `MyController`. (We
    will discuss scope hierarchies later.)

  * Evaluate the `greeting` {@link guide/expression expression} against the scope retrieved above,
    and assign the result to the text of the enclosing DOM element.


You can think of the scope and its properties as the data which is used to render the view. The
scope is the single source-of-truth for all things view related.

From a testability point of view, the separation of the controller and the view is desirable, because it allows us
to test the behavior without being distracted by the rendering details.

```js
  it('should say hello', function() {
    var scopeMock = {};
    var cntl = new MyController(scopeMock);

    // Assert that username is pre-filled
    expect(scopeMock.username).toEqual('World');

    // Assert that we read new username and greet
    scopeMock.username = 'angular';
    scopeMock.sayHello();
    expect(scopeMock.greeting).toEqual('Hello angular!');
  });
```


## Scope Hierarchies

Each Angular application has exactly one {@link ng.$rootScope root scope}, but
may have several child scopes.

The application can have multiple scopes, because some {@link guide/directive directives} create
new child scopes (refer to directive documentation to see which directives create new scopes).
When new scopes are created, they are added as children of their parent scope. This creates a tree
structure which parallels the DOM where they're attached

When Angular evaluates `{{name}}`, it first looks at the scope associated with the given
element for the `name` property. If no such property is found, it searches the parent scope
and so on until the root scope is reached. In JavaScript this behavior is known as prototypical
inheritance, and child scopes prototypically inherit from their parents.

This example illustrates scopes in application, and prototypical inheritance of properties. The example is followed by
a diagram depicting the scope boundaries.

<example>
  <file name="index.html">
  <div class="show-scope-demo">
    <div ng-controller="GreetCtrl">
      Hello {{name}}!
    </div>
    <div ng-controller="ListCtrl">
      <ol>
        <li ng-repeat="name in names">{{name}} from {{department}}</li>
      </ol>
    </div>
  </div>
  </file>
  <file name="script.js">
    function GreetCtrl($scope, $rootScope) {
      $scope.name = 'World';
      $rootScope.department = 'Angular';
    }

    function ListCtrl($scope) {
      $scope.names = ['Igor', 'Misko', 'Vojta'];
    }
  </file>
  <file name="style.css">
    .show-scope-demo.ng-scope,
    .show-scope-demo .ng-scope  {
      border: 1px solid red;
      margin: 3px;
    }
  </file>
</example>

<img class="center" src="img/guide/concepts-scope.png">

Notice that Angular automatically places `ng-scope` class on elements where scopes are
attached. The `<style>` definition in this example highlights in red the new scope locations. The
child scopes are necessary because the repeater evaluates `{{name}}` expression, but
depending on which scope the expression is evaluated it produces different result. Similarly the
evaluation of `{{department}}` prototypically inherits from root scope, as it is the only place
where the `department` property is defined.


## Retrieving Scopes from the DOM.

Scopes are attached to the DOM as `$scope` data property, and can be retrieved for debugging
purposes. (It is unlikely that one would need to retrieve scopes in this way inside the
application.) The location where the root scope is attached to the DOM is defined by the location
of {@link ng.directive:ngApp `ng-app`} directive. Typically
`ng-app` is placed on the `<html>` element, but it can be placed on other elements as well, if,
for example, only a portion of the view needs to be controlled by Angular.

To examine the scope in the debugger:

  1. right click on the element of interest in your browser and select 'inspect element'. You
  should see the browser debugger with the element you clicked on highlighted.

  2. The debugger allows you to access the currently selected element in the console as `$0`
    variable.

  3. To retrieve the associated scope in console execute: `angular.element($0).scope()` or just type $scope


## Scope Events Propagation

Scopes can propagate events in similar fashion to DOM events. The event can be {@link
ng.$rootScope.Scope#$broadcast broadcasted} to the scope children or {@link
ng.$rootScope.Scope#$emit emitted} to scope parents.

<example>
  <file name="script.js">
    function EventController($scope) {
      $scope.count = 0;
      $scope.$on('MyEvent', function() {
        $scope.count++;
      });
    }
  </file>
  <file name="index.html">
    <div ng-controller="EventController">
      Root scope <tt>MyEvent</tt> count: {{count}}
      <ul>
        <li ng-repeat="i in [1]" ng-controller="EventController">
          <button ng-click="$emit('MyEvent')">$emit('MyEvent')</button>
          <button ng-click="$broadcast('MyEvent')">$broadcast('MyEvent')</button>
          <br>
          Middle scope <tt>MyEvent</tt> count: {{count}}
          <ul>
            <li ng-repeat="item in [1, 2]" ng-controller="EventController">
              Leaf scope <tt>MyEvent</tt> count: {{count}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </file>
</example>



## Scope Life Cycle

The normal flow of a browser receiving an event is that it executes a corresponding JavaScript
callback. Once the callback completes the browser re-renders the DOM and returns to waiting for
more events.

When the browser calls into JavaScript the code executes outside the Angular execution context,
which means that Angular is unaware of model modifications. To properly process model
modifications the execution has to enter the Angular execution context using the {@link
ng.$rootScope.Scope#$apply `$apply`} method. Only model modifications which
execute inside the `$apply` method will be properly accounted for by Angular. For example if a
directive listens on DOM events, such as {@link
ng.directive:ngClick `ng-click`} it must evaluate the
expression inside the `$apply` method.

After evaluating the expression, the `$apply` method performs a {@link
ng.$rootScope.Scope#$digest `$digest`}. In the $digest phase the scope examines all
of the `$watch` expressions and compares them with the previous value. This dirty checking is done
asynchronously. This means that assignment such as `$scope.username="angular"` will not
immediately cause a `$watch` to be notified, instead the `$watch` notification is delayed until
the `$digest` phase. This delay is desirable, since it coalesces multiple model updates into one
`$watch` notification as well as it guarantees that during the `$watch` notification no other
`$watch`es are running. If a `$watch` changes the value of the model, it will force additional
`$digest` cycle.

  1. **Creation**

     The {@link ng.$rootScope root scope} is created during the application
     bootstrap by the {@link auto.$injector $injector}. During template
     linking, some directives create new child scopes.

  2. **Watcher registration**

     During template linking directives register {@link
     ng.$rootScope.Scope#$watch watches} on the scope. These watches will be
     used to propagate model values to the DOM.

  3. **Model mutation**

     For mutations to be properly observed, you should make them only within the {@link
     ng.$rootScope.Scope#$apply scope.$apply()}. (Angular APIs do this
     implicitly, so no extra `$apply` call is needed when doing synchronous work in controllers,
     or asynchronous work with {@link ng.$http $http}, {@link ng.$timeout $timeout}
     or {@link ng.$interval $interval} services.

  4. **Mutation observation**

     At the end of `$apply`, Angular performs a {@link ng.$rootScope.Scope#$digest
     $digest} cycle on the root scope, which then propagates throughout all child scopes. During
     the `$digest` cycle, all `$watch`ed expressions or functions are checked for model mutation
     and if a mutation is detected, the `$watch` listener is called.

  5. **Scope destruction**

     When child scopes are no longer needed, it is the responsibility of the child scope creator
     to destroy them via {@link ng.$rootScope.Scope#$destroy scope.$destroy()}
     API. This will stop propagation of `$digest` calls into the child scope and allow for memory
     used by the child scope models to be reclaimed by the garbage collector.


### Scopes and Directives

During the compilation phase, the {@link compiler compiler} matches {@link
ng.$compileProvider#directive directives} against the DOM template. The directives
usually fall into one of two categories:

  - Observing {@link ng.$compileProvider#directive directives}, such as
    double-curly expressions `{{expression}}`, register listeners using the {@link
    ng.$rootScope.Scope#$watch $watch()} method. This type of directive needs
    to be notified whenever the expression changes so that it can update the view.

  - Listener directives, such as {@link ng.directive:ngClick
    ng-click}, register a listener with the DOM. When the DOM listener fires, the directive
    executes the associated expression and updates the view using the {@link
    ng.$rootScope.Scope#$apply $apply()} method.

When an external event (such as a user action, timer or XHR) is received, the associated {@link
expression expression} must be applied to the scope through the {@link
ng.$rootScope.Scope#$apply $apply()} method so that all listeners are updated
correctly.

### Directives that Create Scopes

In most cases, {@link ng.$compileProvider#directive directives} and scopes interact
but do not create new instances of scope. However, some directives, such as {@link
ng.directive:ngController ng-controller} and {@link
ng.directive:ngRepeat ng-repeat}, create new child scopes
and attach the child scope to the corresponding DOM element. You can retrieve a scope for any DOM
element by using an `angular.element(aDomElement).scope()` method call.
See the {@link guide/directive#creating-custom-directives_demo_isolating-the-scope-of-a-directive
directives guide} for more information about isolate scopes.

### Controllers and Scopes

Scopes and controllers interact with each other in the following situations:

   - Controllers use scopes to expose controller methods to templates (see {@link
     ng.directive:ngController ng-controller}).

   - Controllers define methods (behavior) that can mutate the model (properties on the scope).

   - Controllers may register {@link ng.$rootScope.Scope#$watch watches} on
     the model. These watches execute immediately after the controller behavior executes.

See the {@link ng.directive:ngController ng-controller} for more
information.


### Scope `$watch` Performance Considerations

Dirty checking the scope for property changes is a common operation in Angular and for this reason
the dirty checking function must be efficient. Care should be taken that the dirty checking
function does not do any DOM access, as DOM access is orders of magnitude slower than property
access on JavaScript object.

## Integration with the browser event loop
<img class="pull-right" style="padding-left: 3em; padding-bottom: 1em;" src="img/guide/concepts-runtime.png">

The diagram and the example below describe how Angular interacts with the browser's event loop.

  1. The browser's event-loop waits for an event to arrive. An event is a user interaction, timer event,
     or network event (response from a server).
  2. The event's callback gets executed. This enters the JavaScript context. The callback can
      modify the DOM structure.
  3. Once the callback executes, the browser leaves the JavaScript context and
     re-renders the view based on DOM changes.

Angular modifies the normal JavaScript flow by providing its own event processing loop. This
splits the JavaScript into classical and Angular execution context. Only operations which are
applied in the Angular execution context will benefit from Angular data-binding, exception handling,
property watching, etc... You can also use $apply() to enter the Angular execution context from JavaScript. Keep in
mind that in most places (controllers, services) $apply has already been called for you by the
directive which is handling the event. An explicit call to $apply is needed only when
implementing custom event callbacks, or when working with third-party library callbacks.

  1. Enter the Angular execution context by calling {@link guide/scope scope}`.`{@link
     ng.$rootScope.Scope#$apply $apply}`(stimulusFn)`, where `stimulusFn` is
     the work you wish to do in the Angular execution context.
  2. Angular executes the `stimulusFn()`, which typically modifies application state.
  3. Angular enters the {@link ng.$rootScope.Scope#$digest $digest} loop. The
     loop is made up of two smaller loops which process {@link
     ng.$rootScope.Scope#$evalAsync $evalAsync} queue and the {@link
     ng.$rootScope.Scope#$watch $watch} list. The {@link
     ng.$rootScope.Scope#$digest $digest} loop keeps iterating until the model
     stabilizes, which means that the {@link ng.$rootScope.Scope#$evalAsync
     $evalAsync} queue is empty and the {@link ng.$rootScope.Scope#$watch
     $watch} list does not detect any changes.
  4. The {@link ng.$rootScope.Scope#$evalAsync $evalAsync} queue is used to
     schedule work which needs to occur outside of current stack frame, but before the browser's
     view render. This is usually done with `setTimeout(0)`, but the `setTimeout(0)` approach
     suffers from slowness and may cause view flickering since the browser renders the view after
     each event.
  5. The {@link ng.$rootScope.Scope#$watch $watch} list is a set of expressions
     which may have changed since last iteration. If a change is detected then the `$watch`
     function is called which typically updates the DOM with the new value.
  6. Once the Angular {@link ng.$rootScope.Scope#$digest $digest} loop finishes
     the execution leaves the Angular and JavaScript context. This is followed by the browser
     re-rendering the DOM to reflect any changes.


Here is the explanation of how the `Hello world` example achieves the data-binding effect when the
user enters text into the text field.

  1. During the compilation phase:
     1. the {@link ng.directive:ngModel ng-model} and {@link
        ng.directive:input input} {@link guide/directive
        directive} set up a `keydown` listener on the `<input>` control.
     2. the {@link ng.$interpolate interpolation}
        sets up a {@link ng.$rootScope.Scope#$watch $watch} to be notified of
        `name` changes.
  2. During the runtime phase:
     1. Pressing an '`X`' key causes the browser to emit a `keydown` event on the input control.
     2. The {@link ng.directive:input input} directive
        captures the change to the input's value and calls {@link
        ng.$rootScope.Scope#$apply $apply}`("name = 'X';")` to update the
        application model inside the Angular execution context.
     3. Angular applies the `name = 'X';` to the model.
     4. The {@link ng.$rootScope.Scope#$digest $digest} loop begins
     5. The {@link ng.$rootScope.Scope#$watch $watch} list detects a change
        on the `name` property and notifies the {@link ng.$interpolate interpolation},
        which in turn updates the DOM.
     6. Angular exits the execution context, which in turn exits the `keydown` event and with it
        the JavaScript execution context.
     7. The browser re-renders the view with update text.
