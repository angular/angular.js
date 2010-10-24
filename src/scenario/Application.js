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
 * Changes the location of the frame.
 *
 * @param {string} url The URL. If it begins with a # then only the 
 *   hash of the page is changed.
 * @param {Function} onloadFn function($window, $document)
 */
angular.scenario.Application.prototype.navigateTo = function(url, onloadFn) {
  var self = this;
  var frame = this.getFrame_();
  if (url.charAt(0) === '#') {
    url = frame.attr('src').split('#')[0] + url;
    frame.attr('src', url);
    this.executeAction(onloadFn);
  } else {
    frame.css('display', 'none').attr('src', 'about:blank');
    this.context.find('#test-frames').append('<iframe>');
    frame = this.getFrame_();
    frame.load(function() {
      self.executeAction(onloadFn);
      frame.unbind();
    }).attr('src', url);
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
  if (!$window.angular) {
    return action.call(this, $window, _jQuery($window.document));
  }
  var $browser = $window.angular.service.$browser();
  $browser.poll();
  $browser.notifyWhenNoOutstandingRequests(function() {
    action.call(self, $window, _jQuery($window.document));
  });
};
