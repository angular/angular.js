@ngdoc overview
@name Developer Guide: Angular Services: Injecting Services Into Controllers
@description

Using services as dependencies for controllers is very similar to using services as dependencies
for another service.

Since JavaScript is a dynamic language, DI can't figure out which services to inject by static
types (like in static typed languages). Therefore, you can specify the service name by using the
`$inject` property, which is an array containing strings with names of services to be injected.
The name must match the corresponding service ID registered with angular. The order of the service
IDs matters: the order of the services in the array will be used when calling the factory function
with injected parameters. The names of parameters in factory function don't matter, but by
convention they match the service IDs, which has added benefits discussed below.

<pre>
function myController($loc, $log) {
this.firstMethod = function() {
 // use $location service
 $loc.setHash();
};
this.secondMethod = function() {
 // use $log service
 $log.info('...');
};
}
// which services to inject ?
myController.$inject = ['$location', '$log'];
</pre>

<doc:example module="MyServiceModule">
<doc:source>
<script>
angular.
 module('MyServiceModule', []).
 factory('notify', ['$window', function(win) {
    var msgs = [];
    return function(msg) {
      msgs.push(msg);
      if (msgs.length == 3) {
        win.alert(msgs.join("\n"));
        msgs = [];
      }
    };
  }]);

function myController(scope, notifyService) {
  scope.callNotify = function(msg) {
    notifyService(msg);
  };
}

myController.$inject = ['$scope','notify'];
</script>

<div ng-controller="myController">
  <p>Let's try this simple notify service, injected into the controller...</p>
  <input ng-init="message='test'" ng-model="message" >
  <button ng-click="callNotify(message);">NOTIFY</button>
</div>
</doc:source>
<doc:scenario>
  it('should test service', function() {
    expect(element(':input[ng\\:model="message"]').val()).toEqual('test');
  });
</doc:scenario>
</doc:example>

## Implicit Dependency Injection

A new feature of Angular DI allows it to determine the dependency from the name of the parameter.
Let's rewrite the above example to show the use of this implicit dependency injection of
`$window`, `$scope`, and our `notify` service:

<doc:example module="MyServiceModuleDI">
<doc:source>
<script>
angular.
 module('MyServiceModuleDI', []).
 factory('notify', function($window) {
    var msgs = [];
    return function(msg) {
      msgs.push(msg);
      if (msgs.length == 3) {
        $window.alert(msgs.join("\n"));
        msgs = [];
      }
    };
  });

function myController($scope, notify) {
  $scope.callNotify = function(msg) {
    notify(msg);
  };
}
</script>
<div ng-controller="myController">
  <p>Let's try the notify service, that is implicitly injected into the controller...</p>
  <input ng-init="message='test'" ng-model="message">
  <button ng-click="callNotify(message);">NOTIFY</button>
</div>
</doc:source>
</doc:example>

However, if you plan to {@link http://en.wikipedia.org/wiki/Minification_(programming) minify} your
code, your variable names will get renamed in which case you will still need to explicitly specify
dependencies with the `$inject` property.

## Related Topics

{@link dev_guide.services.understanding_services Understanding Angular Services}
{@link dev_guide.services.creating_services Creating Angular Services}
{@link dev_guide.services.managing_dependencies Managing Service Dependencies}
{@link dev_guide.services.testing_services Testing Angular Services}

## Related API

{@link api/ng Angular Service API}
