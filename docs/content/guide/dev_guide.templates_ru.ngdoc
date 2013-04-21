@ngdoc overview
@name Developer Guide: Understanding Angular Templates
@description

An Angular template is the declarative specification that, along with information from the model
and controller, becomes the rendered view that a user sees in the browser. It is the static DOM,
containing HTML, CSS, and angular-specific elements and angular-specific element attributes.  The
Angular elements and attributes direct angular to add behavior and transform the template DOM into
the dynamic view DOM.

These are the types of Angular elements and element attributes you can use in a template:

* {@link guide/directive Directive} — An attribute or element that
  augments an existing DOM element or represents a reusable DOM component - a widget.
* {@link api/ng.$interpolate Markup} — The double
curly brace notation `{{ }}` to bind expressions to elements is built-in angular markup.
* {@link dev_guide.templates.filters Filter} — Formats your data for display to the user.
* {@link forms Form controls} — Lets you validate user input.

Note:  In addition to declaring the elements above in templates, you can also access these elements
in JavaScript code.

The following code snippet shows a simple Angular template made up of standard HTML tags along with
Angular {@link guide/directive directives} and curly-brace bindings
with {@link expression expressions}:

<pre>
<html ng-app>
 <!-- Body tag augmented with ngController directive  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- Button tag with ng-click directive, and
          string expression 'buttonText'
          wrapped in "{{ }}" markup -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js">
 </body>
</html>
</pre>

In a simple single-page app, the template consists of HTML, CSS, and angular directives contained
in just one HTML file (usually `index.html`). In a more complex app, you can display multiple views
within one main page using "partials", which are segments of template located in separate HTML
files.  You "include" the partials in the main page using the {@link api/ng.$route
$route} service in conjunction with the {@link api/ng.directive:ngView ngView} directive. An
example of this technique is shown in the {@link tutorial/ angular tutorial}, in steps seven and
eight.


## Related Topics

* {@link dev_guide.templates.filters Angular Filters}
* {@link forms Angular Forms}

## Related API

* {@link api/index API Reference}
