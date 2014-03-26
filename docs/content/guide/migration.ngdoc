@ngdoc overview
@name Migrating from 1.0 to 1.2
@description

# Migrating from 1.0 to 1.2

AngularJS version 1.2 introduces several breaking changes that may require changes to your
application's source code.

Although we try to avoid breaking changes, there are some cases where it is unavoidable.
AngularJS 1.2 has undergone a thorough security review to make applications safer by default,
which has driven many of these changes. Several new features, especially animations, would not
be possible without a few changes. Finally, some outstanding bugs were best fixed by changing
an existing API.

<div class="alert alert-warning">
<p>**Note:** AngularJS versions 1.1.x are considered "experimental" with breaking changes between minor releases.
Version 1.2 is the result of several versions on the 1.1 branch, and has a stable API.</p>

<p>If you have an application on 1.1 and want to migrate it to 1.2, everything in the guide
below should still apply, but you may want to consult the
[changelog](https://github.com/angular/angular.js/blob/master/CHANGELOG.md) as well.</p>
</div>

<ul class="nav nav-list">
  <li class="nav-header">Summary of Breaking Changes</li>
  <li>{@link guide/migration#ngroute-has-been-moved-into-its-own-module ngRoute has been moved into its own module}</li>
  <li>{@link guide/migration#templates-no-longer-automatically-unwrap-promises Templates no longer automatically unwrap promises}</li>
  <li>{@link guide/migration#syntax-for-named-wildcard-parameters-changed-in Syntax for named wildcard parameters changed in <code>$route</code>}</li>
  <li>{@link guide/migration#you-can-only-bind-one-expression-to You can only bind one expression to <code>*[src]</code>, <code>*[ng-src]</code> or <code>action</code>}</li>
  <li>{@link guide/migration#interpolations-inside-dom-event-handlers-are-now-disallowed Interpolations inside DOM event handlers are now disallowed}</li>
  <li>{@link guide/migration#directives-cannot-end-with--start-or--end Directives cannot end with -start or -end}</li>
  <li>{@link guide/migration#in-$q,-promisealways-has-been-renamed-promisefinally In $q, promise.always has been renamed promise.finally}</li>
  <li>{@link guide/migration#ngmobile-is-now-ngtouch ngMobile is now ngTouch}</li>
  <li>{@link guide/migration#resource$then-has-been-removed resource.$then has been removed}</li>
  <li>{@link guide/migration#resource-methods-return-the-promise Resource methods return the promise}</li>
  <li>{@link guide/migration#resource-promises-are-resolved-with-the-resource-instance Resource promises are resolved with the resource instance}</li>
  <li>{@link guide/migration#$locationsearch-supports-multiple-keys $location.search supports multiple keys}</li>
  <li>{@link guide/migration#ngbindhtmlunsafe-has-been-removed-and-replaced-by-ngbindhtml ngBindHtmlUnsafe has been removed and replaced by ngBindHtml}</li>
  <li>{@link guide/migration#form-names-that-are-expressions-are-evaluated Form names that are expressions are evaluated}</li>
  <li>{@link guide/migration#hasownproperty-disallowed-as-an-input-name hasOwnProperty disallowed as an input name}</li>
  <li>{@link guide/migration#directives-order-of-postlink-functions-reversed Directives: Order of postLink functions reversed}</li>
  <li>{@link guide/migration#directive-priority Directive priority}</li>
  <li>{@link guide/migration#ngscenario ngScenario}</li>
  <li>{@link guide/migration#nginclude-and-ngview-replace-its-entire-element-on-update ngInclude and ngView replace its entire element on update}</li>
  <li>{@link guide/migration#urls-are-now-sanitized-against-a-whitelist URLs are now sanitized against a whitelist}</li>
  <li>{@link guide/migration#isolate-scope-only-exposed-to-directives-with-scope-property Isolate scope only exposed to directives with <code>scope</code> property}</li>
  <li>{@link guide/migration#change-to-interpolation-priority Change to interpolation priority}</li>
  <li>{@link guide/migration#underscore-prefixed/suffixed-properties-are-non-bindable Underscore-prefixed/suffixed properties are non-bindable}</li>
  <li>{@link guide/migration#you-cannot-bind-to-select[multiple] You cannot bind to select[multiple]}</li>
  <li>{@link guide/migration#uncommon-region-specific-local-files-were-removed-from-i18n Uncommon region-specific local files were removed from i18n}</li>
  <li>{@link guide/migration#services-can-now-return-functions Services can now return functions}</li>
  <li>{@link guide/migration#modifying-the-dom-outside-digest-cycle Modifying the DOM outside digest cycle}</li>
</ul>


## ngRoute has been moved into its own module

Just like `ngResource`, `ngRoute` is now its own module.

Applications that use `$route`, `ngView`, and/or `$routeParams` will now need to load an
`angular-route.js` file and have their application's module dependency on the `ngRoute` module.

Before:

```html
<script src="angular.js"></script>
```

```javascript
var myApp = angular.module('myApp', ['someOtherModule']);
```

After:

```html
<script src="angular.js"></script>
<script src="angular-route.js"></script>
```

```javascript
var myApp = angular.module('myApp', ['ngRoute', 'someOtherModule']);
```

See [5599b55b](https://github.com/angular/angular.js/commit/5599b55b04788c2e327d7551a4a699d75516dd21).


## Templates no longer automatically unwrap promises

`$parse` and templates in general will no longer automatically unwrap promises.

Before:

```javascript
$scope.foo = $http({method: 'GET', url: '/someUrl'});
```

```html
<p>{{foo}}</p>
```

After:

```javascript
$http({method: 'GET', url: '/someUrl'})
  .success(function(data) {
    $scope.foo = data;
  });
```

```html
<p>{{foo}}</p>
```

This feature has been deprecated. If absolutely needed, it can be reenabled for now via the
`$parseProvider.unwrapPromises(true)` API.

See [5dc35b52](https://github.com/angular/angular.js/commit/5dc35b527b3c99f6544b8cb52e93c6510d3ac577),
[b6a37d11](https://github.com/angular/angular.js/commit/b6a37d112b3e1478f4d14a5f82faabf700443748).


## Syntax for named wildcard parameters changed in `$route`

To migrate the code, follow the example below. Here, `*highlight` becomes `:highlight*`

Before:

```javascript
$routeProvider.when('/Book1/:book/Chapter/:chapter/*highlight/edit',
          {controller: noop, templateUrl: 'Chapter.html'});
```

After:

```javascript
$routeProvider.when('/Book1/:book/Chapter/:chapter/:highlight*/edit',
        {controller: noop, templateUrl: 'Chapter.html'});
```

See [04cebcc1](https://github.com/angular/angular.js/commit/04cebcc133c8b433a3ac5f72ed19f3631778142b).


## You can only bind one expression to `*[src]`, `*[ng-src]` or `action`

With the exception of `<a>` and `<img>` elements, you cannot bind more than one expression to the
`src` or `action` attribute of elements.

This is one of several improvements to security introduces by Angular 1.2.

Concatenating expressions makes it hard to understand whether some combination of concatenated
values are unsafe to use and potentially subject to XSS vulnerabilities. To simplify the task of
auditing for XSS issues, we now require that a single expression be used for `*[src/ng-src]`
bindings such as bindings for `iframe[src]`, `object[src]`, etc. In addition, this requirement is
enforced for `form` tags with `action` attributes.

<table class="table table-bordered code-table">
<thead>
<tr>
  <th>Examples</th>
</tr>
</thead>
<tbody>
<tr>
  <td><code>&lt;img src="{{a}}/{{b}}"&gt;</code></td>
  <td class="success">ok</td>
</tr>
<tr>
  <td><code>&lt;iframe src="{{a}}/{{b}}"&gt;&lt;/iframe&gt;</code></td>
  <td class="error">bad</td>
</tr>
<tr>
  <td><code>&lt;iframe src="{{a}}"&gt;&lt;/iframe&gt;</code></td>
  <td class="success">ok</td>
</tr>
</tbody>
</table>


To migrate your code, you can combine multiple expressions using a method attached to your scope.

Before:

```javascript
scope.baseUrl = 'page';
scope.a = 1;
scope.b = 2;
```

```html
<!-- Are a and b properly escaped here? Is baseUrl controlled by user? -->
<iframe src="{{baseUrl}}?a={{a}&b={{b}}">
```

After:

```javascript
var baseUrl = "page";
scope.getIframeSrc = function() {

  // One should think about their particular case and sanitize accordingly
  var qs = ["a", "b"].map(function(value, name) {
      return encodeURIComponent(name) + "=" +
             encodeURIComponent(value);
    }).join("&");

  // `baseUrl` isn't exposed to a user's control, so we don't have to worry about escaping it.
  return baseUrl + "?" + qs;
};
```

```html
<iframe src="{{getIframeSrc()}}">
```

See [38deedd6](https://github.com/angular/angular.js/commit/38deedd6e3d806eb8262bb43f26d47245f6c2739).


## Interpolations inside DOM event handlers are now disallowed

DOM event handlers execute arbitrary Javascript code. Using an interpolation for such handlers
means that the interpolated value is a JS string that is evaluated. Storing or generating such
strings is error prone and leads to XSS vulnerabilities. On the other hand, `ngClick` and other
Angular specific event handlers evaluate Angular expressions in non-window (Scope) context which
makes them much safer.

To migrate the code follow the example below:

Before:

```
JS:   scope.foo = 'alert(1)';
HTML: <div onclick="{{foo}}">
```

After:

```
JS:   scope.foo = function() { alert(1); }
HTML: <div ng-click="foo()">
```

See [39841f2e](https://github.com/angular/angular.js/commit/39841f2ec9b17b3b2920fd1eb548d444251f4f56).


## Directives cannot end with -start or -end

This change was necessary to enable multi-element directives. The best fix is to rename existing
directives so that they don't end with these suffixes.

See [e46100f7](https://github.com/angular/angular.js/commit/e46100f7097d9a8f174bdb9e15d4c6098395c3f2).


## In $q, promise.always has been renamed promise.finally

The reason for this change is to align `$q` with the [Q promise
library](https://github.com/kriskowal/q), despite the fact that this makes it a bit more difficult
to use with non-ES5 browsers, like IE8.

`finally` also goes well together with the `catch` API that was added to `$q` recently and is part
of the [DOM promises standard](http://dom.spec.whatwg.org/).

To migrate the code follow the example below.

Before:

```javascript
$http.get('/foo').always(doSomething);
```

After:

```javascript
$http.get('/foo').finally(doSomething);
```

Or for IE8-compatible code:

```javascript
$http.get('/foo')['finally'](doSomething);
```

See [f078762d](https://github.com/angular/angular.js/commit/f078762d48d0d5d9796dcdf2cb0241198677582c).


## ngMobile is now ngTouch

Many touch-enabled devices are not mobile devices, so we decided to rename this module to better
reflect its concerns.

To migrate, replace all references to `ngMobile` with `ngTouch` and `angular-mobile.js` with
`angular-touch.js`.

See [94ec84e7](https://github.com/angular/angular.js/commit/94ec84e7b9c89358dc00e4039009af9e287bbd05).


## resource.$then has been removed

Resource instances do not have a `$then` function anymore. Use the `$promise.then` instead.

Before:

```javascript
Resource.query().$then(callback);
```

After:

```javascript
Resource.query().$promise.then(callback);
```

See [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d).


## Resource methods return the promise

Methods of a resource instance return the promise rather than the instance itself.

Before:

```javascript
resource.$save().chaining = true;
```

After:

```javascript
resource.$save();
resource.chaining = true;
```

See [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d).


## Resource promises are resolved with the resource instance

On success, the resource promise is resolved with the resource instance rather than HTTP response object.

Use interceptor API to access the HTTP response object.

Before:

```javascript
Resource.query().$then(function(response) {...});
```

After:

```javascript
var Resource = $resource('/url', {}, {
  get: {
    method: 'get',
    interceptor: {
      response: function(response) {
        // expose response
        return response;
      }
    }
  }
});
```

See [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d).


## $location.search supports multiple keys

{@link ng.$location#search `$location.search`} now supports multiple keys with the
same value provided that the values are stored in an array.

Before this change:

* `parseKeyValue` only took the last key overwriting all the previous keys.
* `toKeyValue` joined the keys together in a comma delimited string.

This was deemed buggy behavior. If your server relied on this behavior then either the server
should be fixed, or a simple serialization of the array should be done on the client before
passing it to `$location`.

See [80739409](https://github.com/angular/angular.js/commit/807394095b991357225a03d5fed81fea5c9a1abe).


## ngBindHtmlUnsafe has been removed and replaced by ngBindHtml

`ngBindHtml` which has been moved from `ngSanitize` module to the core `ng` module.

`ngBindHtml` provides `ngBindHtmlUnsafe` like
behavior (evaluate an expression and innerHTML the result into the DOM) when bound to the result
of `$sce.trustAsHtml(string)`. When bound to a plain string, the string is sanitized via
`$sanitize` before being innerHTML'd. If the `$sanitize` service isn't available (`ngSanitize`
module is not loaded) and the bound expression evaluates to a value that is not trusted an
exception is thrown.

See [dae69473](https://github.com/angular/angular.js/commit/dae694739b9581bea5dbc53522ec00d87b26ae55).


## Form names that are expressions are evaluated

If you have form names that will evaluate as an expression:

```
<form name="ctrl.form">
```

And if you are accessing the form from your controller:

Before:

```javascript
function($scope) {
  $scope['ctrl.form'] // form controller instance
}
```

After:

```javascript
function($scope) {
  $scope.ctrl.form // form controller instance
}
```

This makes it possible to access a form from a controller using the new "controller as" syntax.
Supporting the previous behavior offers no benefit.

See [8ea802a1](https://github.com/angular/angular.js/commit/8ea802a1d23ad8ecacab892a3a451a308d9c39d7).


## hasOwnProperty disallowed as an input name

Inputs with name equal to `hasOwnProperty` are not allowed inside form or ngForm directives.

Before, inputs whose name was "hasOwnProperty" were quietly ignored and not added to the scope.
Now a badname exception is thrown. Using "hasOwnProperty" for an input name would be very unusual
and bad practice. To migrate, change your input name.

See [7a586e5c](https://github.com/angular/angular.js/commit/7a586e5c19f3d1ecc3fefef084ce992072ee7f60).


## Directives: Order of postLink functions reversed

The order of postLink fn is now mirror opposite of the order in which corresponding preLinking and compile functions execute.

Previously the compile/link fns executed in order, sorted by priority:

<table class="table table-bordered table-striped code-table">
<thead>
<tr>
  <th>#</th>
  <th>Step</th>
  <th align="center">Old Sort Order</th>
  <th align="center">New Sort Order</th>
</tr>
</thead>
<tbody>
<tr>
  <td>1</td>
  <td>Compile Fns</td>
  <td align="center" colspan="2">High → Low</td>
</tr>
<tr>
  <td>2</td>
  <td colspan="3">Compile child nodes</td>
</tr>
<tr>
  <td>3</td>
  <td>PreLink Fns</td>
  <td align="center" colspan="2">High → Low</td>
</tr>
<tr>
  <td>4</td>
  <td colspan="3">Link child nodes</td>
</tr>
<tr>
  <td>5</td>
  <td>PostLink Fns</td>
  <td align="center">High → Low</td>
  <td align="center">**Low → High**</td>
</tr>
</tbody>
</table>

<small>"High → Low" here refers to the `priority` option of a directive.</small>

Very few directives in practice rely on the order of postLinking functions (unlike on the order
of compile functions), so in the rare case of this change affecting an existing directive, it might
be necessary to convert it to a preLinking function or give it negative priority.

You can look at [the diff of this
commit](https://github.com/angular/angular.js/commit/31f190d4d53921d32253ba80d9ebe57d6c1de82b) to see how an internal
attribute interpolation directive was adjusted.

See [31f190d4](https://github.com/angular/angular.js/commit/31f190d4d53921d32253ba80d9ebe57d6c1de82b).


## Directive priority

the priority of ngRepeat, ngSwitchWhen, ngIf, ngInclude and ngView has changed. This could affect directives that explicitly specify their priority.

In order to make ngRepeat, ngSwitchWhen, ngIf, ngInclude and ngView work together in all common scenarios their directives are being adjusted to achieve the following precedence:


Directive        | Old Priority | New Priority
-----------------|--------------|-------------
ngRepeat         | 1000         | 1000
ngSwitchWhen     | 500          | 800
ngIf             | 1000         | 600
ngInclude        | 1000         | 400
ngView           | 1000         | 400

See [b7af76b4](https://github.com/angular/angular.js/commit/b7af76b4c5aa77648cc1bfd49935b48583419023).


## ngScenario

browserTrigger now uses an eventData object instead of direct parameters for mouse events.
To migrate, place the `keys`,`x` and `y` parameters inside of an object and place that as the
third parameter for the browserTrigger function.

See [28f56a38](https://github.com/angular/angular.js/commit/28f56a383e9d1ff378e3568a3039e941c7ffb1d8).


## ngInclude and ngView replace its entire element on update

Previously `ngInclude` and `ngView` only updated its element's content. Now these directives will
recreate the element every time a new content is included.

This ensures that a single rootElement for all the included contents always exists, which makes
definition of css styles for animations much easier.

See [7d69d52a](https://github.com/angular/angular.js/commit/7d69d52acff8578e0f7d6fe57a6c45561a05b182),
[aa2133ad](https://github.com/angular/angular.js/commit/aa2133ad818d2e5c27cbd3933061797096356c8a).


## URLs are now sanitized against a whitelist

A whitelist configured via `$compileProvider` can be used to configure what URLs are considered safe.
By default all common protocol prefixes are whitelisted including `data:` URIs with mime types `image/*`.
This change shouldn't impact apps that don't contain malicious image links.

See [1adf29af](https://github.com/angular/angular.js/commit/1adf29af13890d61286840177607edd552a9df97),
[3e39ac7e](https://github.com/angular/angular.js/commit/3e39ac7e1b10d4812a44dad2f959a93361cd823b).


## Isolate scope only exposed to directives with `scope` property

If you declare a scope option on a directive, that directive will have an
[isolate scope](https://github.com/angular/angular.js/wiki/Understanding-Scopes). In Angular 1.0, if a
directive with an isolate scope is used on an element, all directives on that same element have access
to the same isolate scope. For example, say we have the following directives:

```
// This directive declares an isolate scope.
.directive('isolateScope', function() {
  return {
    scope: {},
    link: function($scope) {
      console.log('one = ' + $scope.$id);
    }
  };
})

// This directive does not.
.directive('nonIsolateScope', function() {
  return {
    link: function($scope) {
      console.log('two = ' + $scope.$id);
    }
  };
});
```

Now what happens if we use both directives on the same element?

```
<div isolate-scope non-isolate-scope></div>
```

In Angular 1.0, the nonIsolateScope directive will have access to the isolateScope directive’s scope. The
log statements will print the same id, because the scope is the same. But in Angular 1.2, the nonIsolateScope
will not use the same scope as isolateScope. Instead, it will inherit the parent scope. The log statements
will print different id’s.

If your code depends on the Angular 1.0 behavior (non-isolate directive needs to access state
from within the isolate scope), change the isolate directive to use scope locals to pass these explicitly:

**Before**

```
<input ng-model="$parent.value" ng-isolate>

.directive('ngIsolate', function() {
  return {
    scope: {},
    template: '{{value}}'
  };
});
```

**After**

```
<input ng-model="value" ng-isolate>

.directive('ngIsolate', function() {
  return {
    scope: {value: '=ngModel'},
    template: '{{value}}
  };
});
```

See [909cabd3](https://github.com/angular/angular.js/commit/909cabd36d779598763cc358979ecd85bb40d4d7),
[#1924](https://github.com/angular/angular.js/issues/1924) and
[#2500](https://github.com/angular/angular.js/issues/2500).


## Change to interpolation priority

Previously, the interpolation priority was `-100` in 1.2.0-rc.2, and `100` before 1.2.0-rc.2.
Before this change the binding was setup in the post-linking phase.

Now the attribute interpolation (binding) executes as a directive with priority 100 and the
binding is set up in the pre-linking phase.

See [79223eae](https://github.com/angular/angular.js/commit/79223eae5022838893342c42dacad5eca83fabe8),
[#4525](https://github.com/angular/angular.js/issues/4525),
[#4528](https://github.com/angular/angular.js/issues/4528), and
[#4649](https://github.com/angular/angular.js/issues/4649)

## Underscore-prefixed/suffixed properties are non-bindable

<div class="alert alert-info">
<p>**Reverted**: This breaking change has been reverted in 1.2.1, and so can be ignored if you're using **version 1.2.1 or higher**</p>
</div>

This change introduces the notion of "private" properties (properties
whose names begin and/or end with an underscore) on the scope chain.
These properties will not be available to Angular expressions (i.e. {{
}} interpolation in templates and strings passed to `$parse`)  They are
freely available to JavaScript code (as before).

**Motivation**

Angular expressions execute in a limited context. They do not have
direct access to the global scope, `window`, `document` or the Function
constructor. However, they have direct access to names/properties on
the scope chain. It has been a long standing best practice to keep
sensitive APIs outside of the scope chain (in a closure or your
controller.) That's easier said that done for two reasons:

1. JavaScript does not have a notion of private properties so if you need
someone on the scope chain for JavaScript use, you also expose it to
Angular expressions
2. The new `controller as` syntax that's now in increased usage exposes the
entire controller on the scope chain greatly increasing the exposed surface.

Though Angular expressions are written and controlled by the developer, they:

1. Typically deal with user input
2. Don't get the kind of test coverage that JavaScript code would

This commit provides a way, via a naming convention, to allow restricting properties from
controllers/scopes. This means Angular expressions can access only those properties that
are actually needed by the expressions.

See [3d6a89e8](https://github.com/angular/angular.js/commit/3d6a89e8888b14ae5cb5640464e12b7811853c7e).


## You cannot bind to select[multiple]

Switching between `select[single]` and `select[multiple]` has always been odd due to browser quirks.
This feature never worked with two-way data-binding so it's not expected that anyone is using it.

If you are interested in properly adding this feature, please submit a pull request on Github.

See [d87fa004](https://github.com/angular/angular.js/commit/d87fa0042375b025b98c40bff05e5f42c00af114).


## Uncommon region-specific local files were removed from i18n

AngularJS uses the Google Closure library's locale files. The following locales were removed from
Closure, so Angular is not able to continue to support them:

`chr`, `cy`, `el-polyton`, `en-zz`, `fr-rw`, `fr-sn`, `fr-td`, `fr-tg`, `haw`, `it-ch`, `ln-cg`,
`mo`, `ms-bn`, `nl-aw`, `nl-be`, `pt-ao`, `pt-gw`, `pt-mz`, `pt-st`, `ro-md`, `ru-md`, `ru-ua`,
`sr-cyrl-ba`, `sr-cyrl-me`, `sr-cyrl`, `sr-latn-ba`, `sr-latn-me`, `sr-latn`, `sr-rs`, `sv-fi`,
`sw-ke`, `ta-lk`, `tl-ph`, `ur-in`, `zh-hans-hk`, `zh-hans-mo`, `zh-hans-sg`, `zh-hans`,
`zh-hant-hk`, `zh-hant-mo`, `zh-hant-tw`, `zh-hant`

Although these locales were removed from the official AngularJS repository, you can continue to
load and use your copy of the locale file provided that you maintain it yourself.

See [6382e21f](https://github.com/angular/angular.js/commit/6382e21fb28541a2484ac1a241d41cf9fbbe9d2c).

## Services can now return functions

Previously, the service constructor only returned objects regardless of whether a function was returned.

Now, `$injector.instantiate` (and thus `$provide.service`) behaves the same as the native
`new` operator and allows functions to be returned as a service.

If using a JavaScript preprocessor it's quite possible when upgrading that services could start behaving incorrectly.
Make sure your services return the correct type wanted.

**Coffeescript example**

```
myApp.service 'applicationSrvc', ->
  @something = "value"
  @someFunct = ->
    "something else"
```

pre 1.2 this service would return the whole object as the service.

post 1.2 this service returns `someFunct` as the value of the service

you would need to change this services to

```
myApp.service 'applicationSrvc', ->
  @something = "value"
  @someFunct = ->
    "something else"
  return
```

to continue to return the complete instance.

See [c22adbf1](https://github.com/angular/angular.js/commit/c22adbf160f32c1839fbb35382b7a8c6bcec2927).
