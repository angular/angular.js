@ngdoc overview
@name Developer Guide: Angular Services: Understanding Angular Services
@description

Angular services are singletons that carry out specific tasks common to web apps, such as the
{@link api/ng.$http $http service} that provides low level access to the browser's
`XMLHttpRequest` object.

To use an Angular service, you identify it as a dependency for the dependent (a controller, or
another service) that depends on the service.  Angular's dependency injection subsystem takes care
of the rest. The Angular injector subsystem is in charge of service instantiation, resolution of
dependencies, and provision of dependencies to factory functions as requested.

Angular injects dependencies using "constructor" injection (the service is passed in via a factory
function). Because JavaScript is a dynamically typed language, Angular's dependency injection
subsystem cannot use static types to identify service dependencies. For this reason a dependent
must explicitly define its dependencies by using the `$inject` property.  For example:

        myController.$inject = ['$location'];

The Angular web framework provides a set of services for common operations. Like other core Angular
variables and identifiers, the built-in services always start with `$` (such as `$http` mentioned
above). You can also create your own custom services.


## Related Topics

* {@link di About Angular Dependency Injection}
* {@link dev_guide.services.creating_services Creating Angular Services}
* {@link dev_guide.services.managing_dependencies Managing Service Dependencies}
* {@link dev_guide.services.testing_services Testing Angular Services}

## Related API

* {@link api/ng Angular Service API}
* {@link api/angular.injector Injector API}
