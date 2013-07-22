'use strict';

function $UrlUtilsProvider() {
  this.$get = ['$window', '$document', function($window, $document) {
    var urlParsingNode = $document[0].createElement("a"),
        originUrl = resolve($window.location.href, true);

    /**
     * @description
     * Normalizes and optionally parses a URL.
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE >= 8 and <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assining to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * IE7 does not normalize the URL when assigned to an anchor node.  (Apparently, it does, if one
     * uses the inner HTML approach to assign the URL as part of an HTML snippet -
     * http://stackoverflow.com/a/472729)  However, setting img[src] does normalize the URL.
     * Unfortunately, setting img[src] to something like "javascript:foo" on IE throws an exception.
     * Since the primary usage for normalizing URLs is to sanitize such URLs, we can't use that
     * method and IE < 8 is unsupported.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @param {string} url The URL to be parsed.
     * @param {boolean|function} parse When true, returns an object for the parsed URL.
     *   When a function, calls that function with a modifiable object for the parsed URL, the
     *   function may modify the object and its normalized URL will be recomputed, then the
     *   modified object for the URL is returned.
     *   Otherwise, returns a single string that is the normalized URL.
     * @returns {object|string} When parse is true, returns the normalized URL as a string.
     * Otherwise, returns an object with the following members.
     *
     *   | member name   | Description    |
     *   |===============|================|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *   | hostname      | The host without the port of the normalizedUrl                         |
     *   | pathname      | The path following the host in the normalizedUrl                       |
     *   | port          | The port (if the port is non-default)                                  |
     *   | hash          | The URL hash if present                                                |
     *   | search        | The query string                                                       |
     *
     */
    function resolve(url, parse) {
      var href = url;
      if (msie) {
        // Normalize before parse.  Refer Implementation Notes on why this is
        // done in two steps on IE.
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);

      if (!parse) {
        return urlParsingNode.href;
      }

      if (isFunction(parse)) {
        parse(urlParsingNode);
      }

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol,
        host: urlParsingNode.host,
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname,
        hash: urlParsingNode.hash,
        search: urlParsingNode.search
      };
    }

    return {
      resolve: resolve,
      /**
       * Parse a request URL and determine whether this is a same-origin request as the application document.
       *
       * @param {string} requestUrl The url of the request.
       * @returns {boolean} Whether the request is for the same origin as the application document.
       */
      isSameOrigin: function isSameOrigin(requestUrl) {
        var parsed = resolve(requestUrl, true);
        return (parsed.protocol === originUrl.protocol &&
                parsed.host === originUrl.host);
      }
    };
  }];
}
