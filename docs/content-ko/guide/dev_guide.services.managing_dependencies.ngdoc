@ngdoc overview
@name Developer Guide: Angular Services: Managing Service Dependencies
@description

Angular allows services to declare other services as dependencies needed for construction of their
instances.

To declare dependencies, you specify them in the factory function signature and annotate the
function with the inject annotations either using by setting the `$inject` property, as an array of
string identifiers or using the array notation. Optionally the `$inject` property declaration can be
dropped (see "Inferring `$inject`" but note that that is currently an experimental feature).

Using the array notation:

<pre>
function myModuleCfgFn($provide) {
  $provide.factory('myService', ['dep1', 'dep2', function(dep1, dep2) {}]);
}
</pre>


Using the $inject property:

<pre>
function myModuleCfgFn($provide) {
  var myServiceFactory = function(dep1, dep2) {};
  myServiceFactory.$inject = ['dep1', 'dep2'];
  $provide.factory('myService', myServiceFactory);
}
</pre>


Using DI inference (incompatible with minifiers):

<pre>
function myModuleCfgFn($provide) {
  $provide.factory('myService', function(dep1, dep2) {});
}
</pre>


Here is an example of two services, one of which depends on the other and both
of which depend on other services that are provided by the Angular framework:

<pre>
/**
 * batchLog service allows for messages to be queued in memory and flushed
 * to the console.log every 50 seconds.
 *
 * @param {*} message Message to be logged.
 */
  function batchLogModule($provide){
    $provide.factory('batchLog', ['$timeout', '$log', function($timeout, $log) {
      var messageQueue = [];

      function log() {
        if (messageQueue.length) {
          $log('batchLog messages: ', messageQueue);
          messageQueue = [];
        }
        $timeout(log, 50000);
      }

      // start periodic checking
      log();

      return function(message) {
        messageQueue.push(message);
      }
    }]);

    /**
     * routeTemplateMonitor monitors each $route change and logs the current
     * template via the batchLog service.
     */
    $provide.factory('routeTemplateMonitor',
                ['$route', 'batchLog', '$rootScope',
         function($route,   batchLog,   $rootScope) {
      $rootScope.$on('$routeChangeSuccess', function() {
        batchLog($route.current ? $route.current.template : null);
      });
    }]);
  }

  // get the main service to kick of the application
  angular.injector([batchLogModule]).get('routeTemplateMonitor');
</pre>

Things to notice in this example:

* The `batchLog` service depends on the built-in {@link api/ng.$timeout $timeout} and
{@link api/ng.$log $log} services, and allows messages to be logged into the
`console.log` in batches.
* The `routeTemplateMonitor` service depends on the built-in {@link api/ng.$route
$route} service as well as our custom `batchLog` service.
* Both of our services use the factory function signature and array notation for inject annotations
to declare their dependencies. It is important that the order of the string identifiers in the array
is the same as the order of argument names in the signature of the factory function. Unless the
dependencies are inferred from the function signature, it is this array with IDs and their order
that the injector uses to determine which services and in which order to inject.


## Related Topics

* {@link dev_guide.services.understanding_services Understanding Angular Services}
* {@link dev_guide.services.creating_services Creating Angular Services}
* {@link dev_guide.services.injecting_controllers Injecting Services Into Controllers }
* {@link dev_guide.services.testing_services Testing Angular Services}


## Related API

* {@link api/ng Angular Service API}
* {@link api/angular.injector Angular Injector API}
