'use strict';
/* global stripHash: true */

/**
 * ! This is a private undocumented service !
 *
 * @name $browser
 * @requires $log
 * @description
 * This object has two goals:
 *
 * - hide all the global state in the browser caused by the window object
 * - abstract away all the browser specific features and inconsistencies
 *
 * For tests we provide {@link ngMock.$browser mock implementation} of the `$browser`
 * service, which can be used for convenient testing of the application without the interaction with
 * the real browser apis.
 */
/**
 * @param {object} window The global window object.
 * @param {object} document jQuery wrapped document.
 * @param {object} $log window.console or an object with the same interface.
 * @param {object} $sniffer $sniffer service
 */
function Browser(window, document, $log, $sniffer) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      history = window.history,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {};

  self.isMock = false;

  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = completeOutstandingRequest;
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };

  /**
   * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while (outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  function getHash(url) {
    var index = url.indexOf('#');
    return index === -1 ? '' : url.substr(index);
  }

  /**
   * @private
   * Note: this method is used only by scenario runner
   * TODO(vojta): prefix this method with $$ ?
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////

  var cachedState, lastHistoryState,
      lastBrowserUrl = location.href,
      baseElement = document.find('base'),
      pendingLocation = null;

  cacheState();
  lastHistoryState = cachedState;

  /**
   * @name $browser#url
   *
   * @description
   * GETTER:
   * Without any argument, this method just returns current value of location.href.
   *
   * SETTER:
   * With at least one argument, this method sets url to new value.
   * If html5 history api supported, pushState/replaceState is used, otherwise
   * location.href/location.replace is used.
   * Returns its own instance to allow chaining
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to change url.
   *
   * @param {string} url New url (when used as setter)
   * @param {boolean=} replace Should new url replace current history record?
   * @param {object=} state object to use with pushState/replaceState
   */
  self.url = function(url, replace, state) {
    // In modern browsers `history.state` is `null` by default; treating it separately
    // from `undefined` would cause `$browser.url('/foo')` to change `history.state`
    // to undefined via `pushState`. Instead, let's change `undefined` to `null` here.
    if (isUndefined(state)) {
      state = null;
    }

    // Android Browser BFCache causes location, history reference to become stale.
    if (location !== window.location) location = window.location;
    if (history !== window.history) history = window.history;

    // setter
    if (url) {
      var sameState = lastHistoryState === state;

      // Don't change anything if previous and current URLs and states match. This also prevents
      // IE<10 from getting into redirect loop when in LocationHashbangInHtml5Url mode.
      // See https://github.com/angular/angular.js/commit/ffb2701
      if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
        return self;
      }
      var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
      lastBrowserUrl = url;
      lastHistoryState = state;
      // Don't use history API if only the hash changed
      // due to a bug in IE10/IE11 which leads
      // to not firing a `hashchange` nor `popstate` event
      // in some cases (see #9143).
      if ($sniffer.history && (!sameBase || !sameState)) {
        history[replace ? 'replaceState' : 'pushState'](state, '', url);
        cacheState();
        // Do the assignment again so that those two variables are referentially identical.
        lastHistoryState = cachedState;
      } else {
        if (!sameBase || pendingLocation) {
          pendingLocation = url;
        }
        if (replace) {
          location.replace(url);
        } else if (!sameBase) {
          location.href = url;
        } else {
          location.hash = getHash(url);
        }
        if (location.href !== url) {
          pendingLocation = url;
        }
      }
      return self;
    // getter
    } else {
      // - pendingLocation is needed as browsers don't allow to read out
      //   the new location.href if a reload happened or if there is a bug like in iOS 9 (see
      //   https://openradar.appspot.com/22186109).
      // - the replacement is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=407172
      return pendingLocation || location.href.replace(/%27/g,"'");
    }
  };

  /**
   * @name $browser#state
   *
   * @description
   * This method is a getter.
   *
   * Return history.state or null if history.state is undefined.
   *
   * @returns {object} state
   */
  self.state = function() {
    return cachedState;
  };

  var urlChangeListeners = [],
      urlChangeInit = false;

  function cacheStateAndFireUrlChange() {
    pendingLocation = null;
    cacheState();
    fireUrlChange();
  }

  function getCurrentState() {
    try {
      return history.state;
    } catch (e) {
      // MSIE can reportedly throw when there is no state (UNCONFIRMED).
    }
  }

  // This variable should be used *only* inside the cacheState function.
  var lastCachedState = null;
  function cacheState() {
    // This should be the only place in $browser where `history.state` is read.
    cachedState = getCurrentState();
    cachedState = isUndefined(cachedState) ? null : cachedState;

    // Prevent callbacks fo fire twice if both hashchange & popstate were fired.
    if (equals(cachedState, lastCachedState)) {
      cachedState = lastCachedState;
    }
    lastCachedState = cachedState;
  }

  function fireUrlChange() {
    if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
      return;
    }

    lastBrowserUrl = self.url();
    lastHistoryState = cachedState;
    forEach(urlChangeListeners, function(listener) {
      listener(self.url(), cachedState);
    });
  }

  /**
   * @name $browser#onUrlChange
   *
   * @description
   * Register callback function that will be called, when url changes.
   *
   * It's only called when the url is changed from outside of angular:
   * - user types different url into address bar
   * - user clicks on history (forward/back) button
   * - user clicks on a link
   *
   * It's not called when url is changed by $browser.url() method
   *
   * The listener gets called with new url as parameter.
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to monitor url changes in angular apps.
   *
   * @param {function(string)} listener Listener function to be called when url changes.
   * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.
   */
  self.onUrlChange = function(callback) {
    // TODO(vojta): refactor to use node's syntax for events
    if (!urlChangeInit) {
      // We listen on both (hashchange/popstate) when available, as some browsers (e.g. Opera)
      // don't fire popstate when user change the address bar and don't fire hashchange when url
      // changed by push/replaceState

      // html5 history api - popstate event
      if ($sniffer.history) jqLite(window).on('popstate', cacheStateAndFireUrlChange);
      // hashchange event
      jqLite(window).on('hashchange', cacheStateAndFireUrlChange);

      urlChangeInit = true;
    }

    urlChangeListeners.push(callback);
    return callback;
  };

  /**
   * @private
   * Remove popstate and hashchange handler from window.
   *
   * NOTE: this api is intended for use only by $rootScope.
   */
  self.$$applicationDestroyed = function() {
    jqLite(window).off('hashchange popstate', cacheStateAndFireUrlChange);
  };

  /**
   * Checks whether the url has changed outside of Angular.
   * Needs to be exported to be able to check for changes that have been done in sync,
   * as hashchange/popstate events fire in async.
   */
  self.$$checkUrlChange = fireUrlChange;

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////

  /**
   * @name $browser#baseHref
   *
   * @description
   * Returns current <base href>
   * (always relative - without domain)
   *
   * @returns {string} The current base href
   */
  self.baseHref = function() {
    var href = baseElement.attr('href');
    return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
  };

  /**
   * @name $browser#defer
   * @param {function()} fn A function, who's execution should be deferred.
   * @param {number=} [delay=0] of milliseconds to defer the function execution.
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
   *
   * @description
   * Executes a fn asynchronously via `setTimeout(fn, delay)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
   * via `$browser.defer.flush()`.
   *
   */
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  /**
   * @name $browser#defer.cancel
   *
   * @description
   * Cancels a deferred task identified with `deferId`.
   *
   * @param {*} deferId Token returned by the `$browser.defer` function.
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
   *                    canceled.
   */
  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
    return false;
  };

}

function $BrowserProvider() {
  this.$get = ['$window', '$log', '$sniffer', '$document',
      function($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }];
}
