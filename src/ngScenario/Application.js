'use strict';

/**
 * Represents the application currently being tested and abstracts usage
 * of iframes or separate windows.
 *
 * @param {Object} context jQuery wrapper around HTML context.
 */
angular.scenario.Application = function(context) {
  this.context = context;
  context.append(
    '<h2>Current URL: <a href="about:blank">None</a></h2>' +
    '<div id="test-frames"></div>'
  );
};

/**
 * Gets the jQuery collection of frames. Don't use this directly because
 * frames may go stale.
 *
 * @private
 * @return {Object} jQuery collection
 */
angular.scenario.Application.prototype.getFrame_ = function() {
  return this.context.find('#test-frames iframe:last');
};

/**
 * Gets the window of the test runner frame. Always favor executeAction()
 * instead of this method since it prevents you from getting a stale window.
 *
 * @private
 * @return {Object} the window of the frame
 */
angular.scenario.Application.prototype.getWindow_ = function() {
  var contentWindow = this.getFrame_().prop('contentWindow');
  if (!contentWindow)
    throw 'Frame window is not accessible.';
  return contentWindow;
};

/**
 * Changes the location of the frame.
 *
 * @param {string} url The URL. If it begins with a # then only the
 *   hash of the page is changed.
 * @param {function()} loadFn function($window, $document) Called when frame loads.
 * @param {function()} errorFn function(error) Called if any error when loading.
 */
angular.scenario.Application.prototype.navigateTo = function(url, loadFn, errorFn) {
  var self = this;
  var frame = self.getFrame_();
  //TODO(esprehn): Refactor to use rethrow()
  errorFn = errorFn || function(e) { throw e; };
  if (url === 'about:blank') {
    errorFn('Sandbox Error: Navigating to about:blank is not allowed.');
  } else if (url.charAt(0) === '#') {
    url = frame.attr('src').split('#')[0] + url;
    frame.attr('src', url);
    self.executeAction(loadFn);
  } else {
    frame.remove();
    self.context.find('#test-frames').append('<iframe>');
    frame = self.getFrame_();

    frame.load(function() {
      frame.off();
      try {
        var $window = self.getWindow_();

        if ($window.angular) {
          // Disable animations
          $window.angular.resumeBootstrap([['$provide', function($provide) {
            return ['$animate', function($animate) {
              $animate.enabled(false);
            }];
          }]]);
        }

        self.executeAction(loadFn);
      } catch (e) {
        errorFn(e);
      }
    }).attr('src', url);

    // for IE compatibility set the name *after* setting the frame url
    frame[0].contentWindow.name = "NG_DEFER_BOOTSTRAP!";
  }
  self.context.find('> h2 a').attr('href', url).text(url);
};

/**
 * Executes a function in the context of the tested application. Will wait
 * for all pending angular xhr requests before executing.
 *
 * @param {function()} action The callback to execute. function($window, $document)
 *  $document is a jQuery wrapped document.
 */
angular.scenario.Application.prototype.executeAction = function(action) {
  var self = this;
  var $window = this.getWindow_();
  if (!$window.document) {
    throw 'Sandbox Error: Application document not accessible.';
  }
  if (!$window.angular) {
    return action.call(this, $window, _jQuery($window.document));
  }
  angularInit($window.document, function(element) {
    var $injector = $window.angular.element(element).injector();
    var $element = _jQuery(element);

    $element.injector = function() {
      return $injector;
    };

    $injector.invoke(function($browser){
      $browser.notifyWhenNoOutstandingRequests(function() {
        action.call(self, $window, $element);
      });
    });
  });
};
