@ngdoc overview
@name Developer Guide: About MVC in Angular: Understanding the Model Component
@description

Depending on the context of the discussion in the Angular documentation, the term _model_ can refer to
either a single object representing one entity (for example, a model called "phones" with its value
being an array of phones) or the entire data model for the application (all entities).

In Angular, a model is any data that is reachable as a property of an angular {@link
scope Scope} object. The name of the property is the model identifier and the value is
any JavaScript object (including arrays and primitives).

The only requirement for a JavaScript object to be a model in Angular is that the object must be
referenced by an Angular scope as a property of that scope object. This property reference can be
created explicitly or implicitly.

You can create models by explicitly creating scope properties referencing JavaScript objects in the
following ways:

* Make a direct property assignment to the scope object in JavaScript code; this most commonly
occurs in controllers:

         function MyCtrl($scope) {
             // create property 'foo' on the MyCtrl's scope
             // and assign it an initial value 'bar'
             $scope.foo = 'bar';
         }

* Use an {@link expression angular expression} with an assignment operator in templates:

         <button ng-click="{{foos='ball'}}">Click me</button>

* Use {@link api/ng.directive:ngInit ngInit directive} in templates (for toy/example apps
only, not recommended for real applications):

         <body ng-init=" foo = 'bar' ">

Angular creates models implicitly (by creating a scope property and assigning it a suitable value)
when processing the following template constructs:

* Form input, select, textarea and other form elements:

         <input ng-model="query" value="fluffy cloud">

   The code above creates a model called "query" on the current scope with the value set to "fluffy
cloud".

* An iterator declaration in {@link api/ng.directive:ngRepeat ngRepeater}:

         <p ng-repeat="phone in phones"></p>

   The code above creates one child scope for each item in the "phones" array and creates a "phone"
object (model) on each of these scopes with its value set to the value of "phone" in the array.

In Angular, a JavaScript object stops being a model when:

* No Angular scope contains a property that references the object.

* All Angular scopes that contain a property referencing the object become stale and eligible for
garbage collection.

The following illustration shows a simple data model created implicitly from a simple template:

<img src="img/guide/about_model_final.png">


## Related Topics

* {@link dev_guide.mvc About MVC in Angular}
* {@link dev_guide.mvc.understanding_controller Understanding the Controller Component}
* {@link dev_guide.mvc.understanding_view Understanding the View Component}
