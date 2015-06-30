'use strict';

var $compileMinErr = minErr('$compile');

/**
 * @ngdoc service
 * @name $templateRequest
 *
 * @description
 * The `$templateRequest` service runs security checks then downloads the provided template using
 * `$http` and, upon success, stores the contents inside of `$templateCache`. If the HTTP request
 * fails or the response data of the HTTP request is empty, a `$compile` error will be thrown (the
 * exception can be thwarted by setting the 2nd parameter of the function to true). Note that the
 * contents of `$templateCache` are trusted, so the call to `$sce.getTrustedUrl(tpl)` is omitted
 * when `tpl` is of type string and `$templateCache` has the matching entry.
 *
 * @param {string|TrustedResourceUrl} tpl The HTTP request template URL
 * @param {boolean=} ignoreRequestError Whether or not to ignore the exception when the request fails or the template is empty
 *
 * @return {Promise} a promise for the HTTP response data of the given URL.
 *
 * @property {number} totalPendingRequests total amount of pending template requests being downloaded.
 */
function $TemplateRequestProvider() {
  this.$get = ['$templateCache', '$http', '$q', '$sce', function($templateCache, $http, $q, $sce) {
    function handleRequestFn(tpl, ignoreRequestError) {
      handleRequestFn.totalPendingRequests++;

      // We consider the template cache holds only trusted templates, so
      // there's no need to go through whitelisting again for keys that already
      // are included in there. This also makes Angular accept any script
      // directive, no matter its name. However, we still need to unwrap trusted
      // types.
      if (!isString(tpl) || !$templateCache.get(tpl)) {
        tpl = $sce.getTrustedResourceUrl(tpl);
      }

      var transformResponse = $http.defaults && $http.defaults.transformResponse;

      if (isArray(transformResponse)) {
        transformResponse = transformResponse.filter(function(transformer) {
          return transformer !== defaultHttpResponseTransform;
        });
      } else if (transformResponse === defaultHttpResponseTransform) {
        transformResponse = null;
      }

      var httpOptions = {
        cache: $templateCache,
        transformResponse: transformResponse
      };

      return $http.get(tpl, httpOptions)
        ['finally'](function() {
          handleRequestFn.totalPendingRequests--;
        })
        .then(function(response) {
          $templateCache.put(tpl, response.data);
          return response.data;
        }, handleError);

      function handleError(resp) {
        if (!ignoreRequestError) {
          throw $compileMinErr('tpload', 'Failed to load template: {0} (HTTP status: {1} {2})',
            tpl, resp.status, resp.statusText);
        }
        return $q.reject(resp);
      }
    }

    handleRequestFn.totalPendingRequests = 0;

    return handleRequestFn;
  }];
}
