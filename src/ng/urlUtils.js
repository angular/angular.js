'use strict';
// NOTE:  The usage of window and document instead of $window and $document here is
// deliberate.  This service depends on the specific behavior of anchor nodes created by the
// browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
// cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
// doesn't know about mocked locations and resolves URLs to the real document - which is
// exactly the behavior needed here.  There is little value is mocking these out for this
// service.
var urlParsingNode = window.document.createElement('a');
var originUrl = urlResolve(window.location.href);
var baseUrlParsingNode;


/**
 *
 * Implementation Notes for non-IE browsers
 * ----------------------------------------
 * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
 * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
 * URL will be resolved into an absolute URL in the context of the application document.
 * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
 * properties are all populated to reflect the normalized URL.  This approach has wide
 * compatibility - Safari 1+, Mozilla 1+ etc.  See
 * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *
 * Implementation Notes for IE
 * ---------------------------
 * IE <= 10 normalizes the URL when assigned to the anchor node similar to the other
 * browsers.  However, the parsed components will not be set if the URL assigned did not specify
 * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
 * work around that by performing the parsing in a 2nd step by taking a previously normalized
 * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
 * properties such as protocol, hostname, port, etc.
 *
 * References:
 *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
 *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *   http://url.spec.whatwg.org/#urlutils
 *   https://github.com/angular/angular.js/pull/2902
 *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 *
 * @kind function
 * @param {string} url The URL to be parsed.
 * @description Normalizes and parses a URL.
 * @returns {object} Returns the normalized URL as a dictionary.
 *
 *   | member name   | Description                                                            |
 *   |---------------|------------------------------------------------------------------------|
 *   | href          | A normalized version of the provided URL if it was not an absolute URL |
 *   | protocol      | The protocol without the trailing colon                                |
 *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
 *   | search        | The search params, minus the question mark                             |
 *   | hash          | The hash string, minus the hash symbol                                 |
 *   | hostname      | The hostname                                                           |
 *   | port          | The port, without ":"                                                  |
 *   | pathname      | The pathname, beginning with "/"                                       |
 *
 */
function urlResolve(url) {
  var href = url;

  // Support: IE 9-11 only
  if (msie) {
    // Normalize before parse.  Refer Implementation Notes on why this is
    // done in two steps on IE.
    urlParsingNode.setAttribute('href', href);
    href = urlParsingNode.href;
  }

  urlParsingNode.setAttribute('href', href);

  return {
    href: urlParsingNode.href,
    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
    host: urlParsingNode.host,
    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
    hostname: urlParsingNode.hostname,
    port: urlParsingNode.port,
    pathname: (urlParsingNode.pathname.charAt(0) === '/')
      ? urlParsingNode.pathname
      : '/' + urlParsingNode.pathname
  };
}

/**
 * Parse a request URL and determine whether this is a same-origin request as the application document.
 *
 * @param {string|object} requestUrl The url of the request as a string that will be resolved
 * or a parsed URL object.
 * @returns {boolean} Whether the request is for the same origin as the application document.
 */
function urlIsSameOrigin(requestUrl) {
  return urlsAreSameOrigin(requestUrl, originUrl);
}

/**
 * Parse a request URL and determine whether it is same-origin as the current document base URL.
 *
 * Note: The base URL is usually the same as the document location (`location.href`) but can
 * be overriden by using the `<base>` tag.
 *
 * @param {string|object} requestUrl The url of the request as a string that will be resolved
 * or a parsed URL object.
 * @returns {boolean} Whether the URL is same-origin as the document base URL.
 */
function urlIsSameOriginAsBaseUrl(requestUrl) {
  return urlsAreSameOrigin(requestUrl, getBaseUrl());
}

/**
 * Determines if two URLs share the same origin.
 *
 * @param {string|object} url1 First URL to compare as a string or a normalized URL in the form of
 *     a dictionary object returned by `urlResolve()`.
 * @param {string|object} url2 Second URL to compare as a string or a normalized URL in the form of
 *     a dictionary object returned by `urlResolve()`.
 * @return {boolean} True if both URLs have the same origin, and false otherwise.
 */
function urlsAreSameOrigin(url1, url2) {
  url1 = (isString(url1)) ? urlResolve(url1) : url1;
  url2 = (isString(url2)) ? urlResolve(url2) : url2;

  return (url1.protocol === url2.protocol &&
          url1.host === url2.host);
}

/**
 * Returns the current document base URL.
 * @return {string}
 */
function getBaseUrl() {
  if (window.document.baseURI) {
    return window.document.baseURI;
  }

  // document.baseURI is available everywhere except IE
  if (!baseUrlParsingNode) {
    baseUrlParsingNode = window.document.createElement('a');
    baseUrlParsingNode.href = '.';

    // Work-around for IE bug described in Implementation Notes. The fix in urlResolve() is not
    // suitable here because we need to track changes to the base URL.
    baseUrlParsingNode = baseUrlParsingNode.cloneNode(false);
  }
  return baseUrlParsingNode.href;
}
