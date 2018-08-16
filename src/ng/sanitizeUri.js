'use strict';

/**
 * @this
 * @description
 * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
 */
function $$SanitizeUriProvider() {

  var aHrefSanitizationWhitelist = /^\s*(https?|s?ftp|mailto|tel|file):/,
    imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;

  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via HTML anchor links.
   *
   * Any url due to be assigned to an `a[href]` attribute via interpolation is marked as requiring
   * the $sce.URL security context. When interpolation occurs a call is made to `$sce.trustAsUrl(url)`
   * which in turn may call `$$sanitizeUri(url, isMedia)` to sanitize the potentially malicious URL.
   *
   * If the URL matches the `aHrefSanitizationWhitelist` regular expression, it is returned unchanged.
   *
   * If there is no match the URL is returned prefixed with `'unsafe:'` to ensure that when it is written
   * to the DOM it is inactive and potentially malicious code will not be executed.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationWhitelist = regexp;
      return this;
    }
    return aHrefSanitizationWhitelist;
  };


  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via HTML image src links.
   *
   * Any URL due to be assigned to an `img[src]` attribute via interpolation is marked as requiring
   * the $sce.MEDIA_URL security context. When interpolation occurs a call is made to
   * `$sce.trustAsMediaUrl(url)` which in turn may call `$$sanitizeUri(url, isMedia)` to sanitize
   * the potentially malicious URL.
   *
   * If the URL matches the `aImgSanitizationWhitelist` regular expression, it is returned unchanged.
   *
   * If there is no match the URL is returned prefixed with `'unsafe:'` to ensure that when it is written
   * to the DOM it is inactive and potentially malicious code will not be executed.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationWhitelist = regexp;
      return this;
    }
    return imgSrcSanitizationWhitelist;
  };

  this.$get = function() {
    return function sanitizeUri(uri, isMediaUrl) {
      // if (!uri) return uri;
      var regex = isMediaUrl ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
      var normalizedVal = urlResolve(uri && uri.trim()).href;
      if (normalizedVal !== '' && !normalizedVal.match(regex)) {
        return 'unsafe:' + normalizedVal;
      }
      return uri;
    };
  };
}
