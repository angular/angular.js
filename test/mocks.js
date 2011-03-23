/**
 * Mock implementation of {@link angular.service.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as
 * `$logMock.error.logs`
 *
 * Please note that this is not a factory function, but rather the actual mock instance. This is
 * important because it allows `beforeEach` and `afterEach` test hooks to clean up or check the
 * state of `logs` arrays in between tests.
 *
 * Exposing the instance in this way makes this mock a singleton, which means that the instance
 * becomes global state for tests. To mitigate the issue, each time the `$log` mock is registered
 * with the injector, a check is performed to ensure that there are no pending logs in `logs`
 * arrays. This means that if a message is logged via $log during a test, the `logs` array must be
 * emptied before the test is finished. `Array#shift` method can be used for this purpose as
 * follows:
 *
 * <pre>
 *   it('should do some good', function() {
 *     var scope = angular.scope(),
 *         $log = scope.$service('$log');
 *
 *     //do something that triggers a message to be logged
 *     expect($log.error.logs.shift()).toEqual(['message', 'arg1', 'arg2']);
 *   });
 * </pre>
 *
 * See {@link angular.mock} for more info on angular mocks.
 */
var $logMock = {
  log: function(){ $logMock.log.logs.push(arguments); },
  warn: function(){ $logMock.warn.logs.push(arguments); },
  info: function(){ $logMock.info.logs.push(arguments); },
  error: function(){ $logMock.error.logs.push(arguments); }
};
$logMock.log.logs = [];
$logMock.warn.logs = [];
$logMock.info.logs = [];
$logMock.error.logs = [];

angular.service('$log', function() {
  return $logMock;
});


/**
 * Factory that returns mock implementation of {@link angular.service.$exceptionHandler} that
 * gathers all errors in an array. This array is exposed as `errors` property of the mock and can be
 * accessed as `$exceptionHandler.errors`.
 *
 * Note that this factory is not registered with angular's injector by default (as opposed to
 * `$logMock`). It is your responsibility to register this factory when you need it. Typically like
 * this:
 *
 * <pre>
 *   var scope = angular.scope(null, {'$exceptionHandler': $exceptionHandlerMockFactory});
 * </pre>
 *
 */
function $exceptionHandlerMockFactory() {
  var mockHandler = function(e) {
    mockHandler.errors.push(e);
  };
  mockHandler.errors = [];

  return mockHandler;
}
