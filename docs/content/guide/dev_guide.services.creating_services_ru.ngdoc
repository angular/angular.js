@ngdoc overview
@name Developer Guide: Angular Services: Creating Services
@description

While Angular offers several useful services, for any nontrivial application you'll find it useful
to write your own custom services. To do this you begin by registering a service factory function
with a module either via the {@link api/angular.module Module#factory api} or directly
via the {@link api/AUTO.$provide $provide} api inside of module config function.

All Angular services participate in {@link di dependency injection (DI)} by registering
themselves with Angular's DI system (injector) under a `name` (id) as well as by declaring
dependencies which need to be provided for the factory function of the registered service. The
ability to swap dependencies for mocks/stubs/dummies in tests allows for services to be highly
testable.


# Registering Services

To register a service, you must have a module that this service will be part of. Afterwards, you
can register the service with the module either via the {@link api/angular.Module Module api} or
by using the {@link api/AUTO.$provide $provide} service in the module configuration
function.The following pseudo-code shows both approaches:

Using the angular.Module api:
<pre>
var myModule = angular.module('myModule', []);
myModule.factory('serviceId', function() {
  var shinyNewServiceInstance;
  //factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});
</pre>

Using the $provide service:
<pre>
angular.module('myModule', [], function($provide) {
  $provide.factory('serviceId', function() {
    var shinyNewServiceInstance;
    //factory function body that constructs shinyNewServiceInstance
    return shinyNewServiceInstance;
  });
});
</pre>

Note that you are not registering a service instance, but rather a factory function that will
create this instance when called.


# Dependencies

Services can not only be depended upon, but can also have their own dependencies. These can be specified
as arguments of the factory function. {@link di Read more} about dependency injection (DI)
in Angular and the use of array notation and the $inject property to make DI annotation
minification-proof.

Following is an example of a very simple service. This service depends on the `$window` service
(which is passed as a parameter to the factory function) and is just a function. The service simply
stores all notifications; after the third one, the service displays all of the notifications by
window alert.

<pre>
angular.module('myModule', [], function($provide) {
  $provide.factory('notify', ['$window', function(win) {
    var msgs = [];
    return function(msg) {
      msgs.push(msg);
      if (msgs.length == 3) {
        win.alert(msgs.join("\n"));
        msgs = [];
      }
    };
  }]);
});
</pre>


# Instantiating Angular Services

All services in Angular are instantiated lazily. This means that a service will be created
only when it is needed for instantiation of a service or an application component that depends on it.
In other words, Angular won't instantiate services unless they are requested directly or
indirectly by the application.


# Services as singletons

Lastly, it is important to realize that all Angular services are application singletons. This means
that there is only one instance of a given service per injector. Since Angular is lethally allergic
to global state, it is possible to create multiple injectors, each with its own instance of a
given service, but that is rarely needed, except in tests where this property is crucially
important.



## Related Topics

* {@link dev_guide.services.understanding_services Understanding Angular Services}
* {@link dev_guide.services.managing_dependencies Managing Service Dependencies}
* {@link dev_guide.services.injecting_controllers Injecting Services Into Controllers }
* {@link dev_guide.services.testing_services Testing Angular Services}

## Related API

* {@link api/ng Angular Service API}
