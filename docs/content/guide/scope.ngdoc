@ngdoc overview
@name Developer Guide: Scopes
@description

# What are Scopes?

{@link api/ng.$rootScope.Scope scope} is an object that refers to the application
model. It is an execution context for {@link expression expressions}. Scopes are
arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can
watch {@link guide/expression expressions} and propagate events.

## Scope characteristics

  - Scopes provide APIs ({@link api/ng.$rootScope.Scope#$watch $watch}) to observe
    model mutations.

  - Scopes provide APIs ({@link api/ng.$rootScope.Scope#$apply $apply}) to
    propagate any model changes through the system into the view from outside of the "Angular
    realm" (controllers, services, Angular event handlers).

  - Scopes can be nested to isolate application components while providing access to shared model
    properties. A scope (prototypically) inherits properties from its parent scope.

  - Scopes provide context against which {@link guide/expression expressions} are evaluated. For
    example `{{username}}` expression is meaningless, unless it is evaluated against a specific
    scope which defines the `username` property.

## Scope as Data-Model

Scope is the glue between application controller and the view. During the template {@link compiler
linking} phase the {@link api/ng.$compileProvider#directive directives} set up
{@link api/ng.$rootScope.Scope#$watch `$watch`} expressions on the scope. The
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

<pre>
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
</pre>


## Scope Hierarchies

Each Angular application has exactly one {@link api/ng.$rootScope root scope}, but
may have several child scopes.

The application can have multiple scopes, because some {@link guide/directive directives} create
new child scopes (refer to directive documentation to see which directives create new scopes).
When new scopes are created, they are added as children of their parent scope. This creates a tree
structure which parallels the DOM where they're attached

When Angular evaluates `{{username}}`, it first looks at the scope associated with the given
element for the `username` property. If no such property is found, it searches the parent scope
and so on until the root scope is reached. In JavaScript this behavior is known as prototypical
inheritance, and child scopes prototypically inherit from their parents.

This example illustrates scopes in application, and prototypical inheritance of properties.

<example>
  <file name="style.css">
    /* remove .doc-example-live in jsfiddle */
    .doc-example-live .ng-scope {
      border: 1px dashed red;
    }
  </file>
  <file name="script.js">
    function EmployeeController($scope) {
      $scope.department = 'Engineering';
      $scope.employee = {
        name: 'Joe the Manager',
        reports: [
          {name: 'John Smith'},
          {name: 'Mary Run'}
        ]
      };
    }
  </file>
  <file name="index.html">
    <div ng-controller="EmployeeController">
      Manager: {{employee.name}} [ {{department}} ]<br>
      Reports:
        <ul>
          <li ng-repeat="employee in employee.reports">
            {{employee.name}} [ {{department}} ]
          </li>
        </ul>
      <hr>
      {{greeting}}
    </div>
  </file>
</example>

Notice that Angular automatically places `ng-scope` class on elements where scopes are
attached. The `<style>` definition in this example highlights in red the new scope locations. The
child scopes are necessary because the repeater evaluates `{{employee.name}}` expression, but
depending on which scope the expression is evaluated it produces different result. Similarly the
evaluation of `{{department}}` prototypically inherits from root scope, as it is the only place
where the `department` property is defined.


## Retrieving Scopes from the DOM.

Scopes are attached to the DOM as `$scope` data property, and can be retrieved for debugging
purposes. (It is unlikely that one would need to retrieve scopes in this way inside the
application.) The location where the root scope is attached to the DOM is defined by the location
of {@link api/ng.directive:ngApp `ng-app`} directive. Typically
`ng-app` is placed an the `<html>` element, but it can be placed on other elements as well, if,
for example, only a portion of the view needs to be controlled by Angular.

To examine the scope in the debugger:

  1. right click on the element of interest in your browser and select 'inspect element'. You
  should see the browser debugger with the element you clicked on highlighted.

  2. The debugger allows you to access the currently selected element in the console as `$0`
    variable.

  3. To retrieve the associated scope in console execute: `angular.element($0).scope()`


## Scope Events Propagation

Scopes can propagate events in similar fashion to DOM events. The event can be {@link
api/ng.$rootScope.Scope#$broadcast broadcasted} to the scope children or {@link
api/ng.$rootScope.Scope#$emit emitted} to scope parents.

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
api/ng.$rootScope.Scope#$apply `$apply`} method. Only model modifications which
execute inside the `$apply` method will be properly accounted for by Angular. For example if a
directive listens on DOM events, such as {@link
api/ng.directive:ngClick `ng-click`} it must evaluate the
expression inside the `$apply` method.

After evaluating the expression, the `$apply` method performs a {@link
api/ng.$rootScope.Scope#$digest `$digest`}. In the $digest phase the scope examines all
of the `$watch` expressions and compares them with the previous value. This dirty checking is done
asynchronously. This means that assignment such as `$scope.username="angular"` will not
immediately cause a `$watch` to be notified, instead the `$watch` notification is delayed until
the `$digest` phase. This delay is desirable, since it coalesces multiple model updates into one
`$watch` notification as well as it guarantees that during the `$watch` notification no other
`$watch`es are running. If a `$watch` changes the value of the model, it will force additional
`$digest` cycle.

  1. **Creation**

     The {@link api/ng.$rootScope root scope} is created during the application
     bootstrap by the {@link api/AUTO.$injector $injector}. During template
     linking, some directives create new child scopes.

  2. **Watcher registration**

     During template linking directives register {@link
     api/ng.$rootScope.Scope#$watch watches} on the scope. These watches will be
     used to propagate model values to the DOM.

  3. **Model mutation**

     For mutations to be properly observed, you should make them only within the {@link
     api/ng.$rootScope.Scope#$apply scope.$apply()}. (Angular APIs do this
     implicitly, so no extra `$apply` call is needed when doing synchronous work in controllers,
     or asynchronous work with {@link api/ng.$http $http} or {@link
     api/ng.$timeout $timeout} services.

  4. **Mutation observation**

     At the end `$apply`, Angular performs a {@link api/ng.$rootScope.Scope#$digest
     $digest} cycle on the root scope, which then propagates throughout all child scopes. During
     the `$digest` cycle, all `$watch`ed expressions or functions are checked for model mutation
     and if a mutation is detected, the `$watch` listener is called.

  5. **Scope destruction**

     When child scopes are no longer needed, it is the responsibility of the child scope creator
     to destroy them via {@link api/ng.$rootScope.Scope#$destroy scope.$destroy()}
     API. This will stop propagation of `$digest` calls into the child scope and allow for memory
     used by the child scope models to be reclaimed by the garbage collector.


### Scopes and Directives

During the compilation phase, the {@link compiler compiler} matches {@link
api/ng.$compileProvider#directive directives} against the DOM template. The directives
usually fall into one of two categories:

  - Observing {@link api/ng.$compileProvider#directive directives}, such as
    double-curly expressions `{{expression}}`, register listeners using the {@link
    api/ng.$rootScope.Scope#$watch $watch()} method. This type of directive needs
    to be notified whenever the expression changes so that it can update the view.

  - Listener directives, such as {@link api/ng.directive:ngClick
    ng-click}, register a listener with the DOM. When the DOM listener fires, the directive
    executes the associated expression and updates the view using the {@link
    api/ng.$rootScope.Scope#$apply $apply()} method.

When an external event (such as a user action, timer or XHR) is received, the associated {@link
expression expression} must be applied to the scope through the {@link
api/ng.$rootScope.Scope#$apply $apply()} method so that all listeners are updated
correctly.

### Directives that Create Scopes

In most cases, {@link api/ng.$compileProvider#directive directives} and scopes interact
but do not create new instances of scope. However, some directives, such as {@link
api/ng.directive:ngController ng-controller} and {@link
api/ng.directive:ngRepeat ng-repeat}, create new child scopes
and attach the child scope to the corresponding DOM element. You can retrieve a scope for any DOM
element by using an `angular.element(aDomElement).scope()` method call.

### Controllers and Scopes

Scopes and controllers interact with each other in the following situations:

   - Controllers use scopes to expose controller methods to templates (see {@link
     api/ng.directive:ngController ng-controller}).

   - Controllers define methods (behavior) that can mutate the model (properties on the scope).

   - Controllers may register {@link api/ng.$rootScope.Scope#$watch watches} on
     the model. These watches execute immediately after the controller behavior executes.

See the {@link api/ng.directive:ngController ng-controller} for more
information.


### Scope `$watch` Performance Considerations

Dirty checking the scope for property changes is a common operation in Angular and for this reason
the dirty checking function must be efficient. Care should be taken that the dirty checking
function does not do any DOM access, as DOM access is orders of magnitude slower then property
access on JavaScript object.

