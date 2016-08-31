'use strict';

/**
 * @this
 * @description
 * Private service to sanitize uris for $sce.URL context. Used by $compile, $sce and $sanitize.
 */
function $$SanitizeUriProvider() {
  var uriSanitizationWhitelist = /^\s*((https?|ftp|file|blob|tel|mailto):|data:image\/)/i;


  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks.
   *
   * Any url about to be assigned to URL context via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `urlSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM,
   * making it inactive.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.uriSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      uriSanitizationWhitelist = regexp;
      return this;
    }
    return uriSanitizationWhitelist;
  };

  this.$get = function() {
    return function sanitizeUri(uri) {
      var normalizedVal = urlResolve(uri).href;
      if (normalizedVal !== '' && !normalizedVal.match(uriSanitizationWhitelist)) {
        return 'unsafe:' + normalizedVal;
      }
      return uri;
    };
  };
}
