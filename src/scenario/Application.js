/**
 * Represents the application currently being tested and abstracts usage
 * of iframes or separate windows.
 */
angular.scenario.Application = function(context) {
  this.context = context;
  context.append('<h2>Current URL: <a href="about:blank">None</a></h2>');
};

/**
 * Gets the jQuery collection of frames. Don't use this directly because
 * frames may go stale.
 *
 * @return {Object} jQuery collection
 */
angular.scenario.Application.prototype.getFrame = function() {
  return this.context.find('> iframe');
};

/**
 * Gets the window of the test runner frame. Always favor executeAction() 
 * instead of this method since it prevents you from getting a stale window.
 *
 * @return {Object} the window of the frame
 */
angular.scenario.Application.prototype.getWindow = function() {
  var contentWindow = this.getFrame().attr('contentWindow');
  if (!contentWindow)
    throw 'No window available because frame not loaded.';
  return contentWindow;
};

/**
 * Changes the location of the frame.
 */
angular.scenario.Application.prototype.navigateTo = function(url, onloadFn) {
  this.getFrame().remove();
  this.context.append('<iframe src=""></iframe>');
  this.context.find('> h2 a').attr('href', url).text(url);
  this.getFrame().attr('src', url).load(onloadFn);
};

/**
 * Executes a function in the context of the tested application.
 *
 * @param {Function} The callback to execute. function($window, $document)
 */
angular.scenario.Application.prototype.executeAction = function(action) {
  var $window = this.getWindow();
  return action.call($window, _jQuery($window.document), $window);
};
