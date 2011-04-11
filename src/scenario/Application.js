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
  var contentWindow = this.getFrame_().attr('contentWindow');
  if (!contentWindow)
    throw 'Frame window is not accessible.';
  return contentWindow;
};

/**
 * Checks that a URL would return a 2xx success status code. Callback is called
 * with no arguments on success, or with an error on failure.
 *
 * Warning: This requires the server to be able to respond to HEAD requests
 * and not modify the state of your application.
 *
 * @param {string} url Url to check
 * @param {Function} callback function(error) that is called with result.
 */
angular.scenario.Application.prototype.checkUrlStatus_ = function(url, callback) {
  var self = this;
  _jQuery.ajax({
    url: url.replace(/#.*/, ''), //IE encodes and sends the url fragment, so we must strip it
    type: 'HEAD',
    complete: function(request) {
      if (request.status < 200 || request.status >= 300) {
        if (!request.status) {
          callback.call(self, 'Sandbox Error: Cannot access ' + url);
        } else {
          callback.call(self, request.status + ' ' + request.statusText);
        }
      } else {
        callback.call(self);
      }
    }
  });
};

/**
 * Changes the location of the frame.
 *
 * @param {string} url The URL. If it begins with a # then only the
 *   hash of the page is changed.
 * @param {Function} loadFn function($window, $document) Called when frame loads.
 * @param {Function} errorFn function(error) Called if any error when loading.
 */
angular.scenario.Application.prototype.navigateTo = function(url, loadFn, errorFn) {
  var self = this;
  var frame = this.getFrame_();
  //TODO(esprehn): Refactor to use rethrow()
  errorFn = errorFn || function(e) { throw e; };
  if (url === 'about:blank') {
    errorFn('Sandbox Error: Navigating to about:blank is not allowed.');
  } else if (url.charAt(0) === '#') {
    url = frame.attr('src').split('#')[0] + url;
    frame.attr('src', url);
    this.executeAction(loadFn);
  } else {
    frame.css('display', 'none').attr('src', 'about:blank');
    this.checkUrlStatus_(url, function(error) {
      if (error) {
        return errorFn(error);
      }
      self.context.find('#test-frames').append('<iframe>');
      frame = this.getFrame_();
      frame.load(function() {
        frame.unbind();
        try {
          self.executeAction(loadFn);
        } catch (e) {
          errorFn(e);
        }
      }).attr('src', url);
    });
  }
  this.context.find('> h2 a').attr('href', url).text(url);
};

/**
 * Executes a function in the context of the tested application. Will wait
 * for all pending angular xhr requests before executing.
 *
 * @param {Function} action The callback to execute. function($window, $document)
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
  var $browser = $window.angular.service.$browser();
  $browser.poll();
  $browser.notifyWhenNoOutstandingRequests(function() {
    action.call(self, $window, _jQuery($window.document));
  });
};
