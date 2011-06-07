/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$updateView
 * @requires $browser
 *
 * @description
 * Calling `$updateView` enqueues the eventual update of the view. (Update the DOM to reflect the
 * model). The update is eventual, since there are often multiple updates to the model which may
 * be deferred. The default update delayed is 25 ms. This means that the view lags the model by
 * that time. (25ms is small enough that it is perceived as instantaneous by the user). The delay
 * can be adjusted by setting the delay property of the service.
 *
 * <pre>angular.service('$updateView').delay = 10</pre>
 *
 * The delay is there so that multiple updates to the model which occur sufficiently close
 * together can be merged into a single update.
 *
 * You don't usually call '$updateView' directly since angular does it for you in most cases,
 * but there are some cases when you need to call it.
 *
 *  - `$updateView()` called automatically by angular:
 *    - Your Application Controllers: Your controller code is called by angular and hence
 *      angular is aware that you may have changed the model.
 *    - Your Services: Your service is usually called by your controller code, hence same rules
 *      apply.
 *  - May need to call `$updateView()` manually:
 *    - Widgets / Directives: If you listen to any DOM events or events on any third party
 *      libraries, then angular is not aware that you may have changed state state of the
 *      model, and hence you need to call '$updateView()' manually.
 *    - 'setTimeout'/'XHR':  If you call 'setTimeout' (instead of {@link angular.service.$defer})
 *      or 'XHR' (instead of {@link angular.service.$xhr}) then you may be changing the model
 *      without angular knowledge and you may need to call '$updateView()' directly.
 *
 * NOTE: if you wish to update the view immediately (without delay), you can do so by calling
 * {@link angular.scope.$eval} at any time from your code:
 * <pre>scope.$root.$eval()</pre>
 *
 * In unit-test mode the update is instantaneous and synchronous to simplify writing tests.
 *
 */

function serviceUpdateViewFactory($browser){
  var rootScope = this;
  var scheduled;
  function update(){
    scheduled = false;
    rootScope.$eval();
  }
  return $browser.isMock ? update : function(){
    if (!scheduled) {
      scheduled = true;
      $browser.defer(update, serviceUpdateViewFactory.delay);
    }
  };
}
serviceUpdateViewFactory.delay = 25;

angularServiceInject('$updateView', serviceUpdateViewFactory, ['$browser']);
