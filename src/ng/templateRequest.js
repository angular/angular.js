'use strict';

var $templateRequestMinErr = minErr('$compile');

/**
 * @ngdoc provider
 * @name $templateRequestProvider
 * @this
 *
 * @description
 * Used to configure the options passed to the {@link $http} service when making a template request.
 *
 * For example, it can be used for specifying the "Accept" header that is sent to the server, when
 * requesting a template.
 */
function $TemplateRequestProvider() {

  var httpOptions;

  /**
   * @ngdoc method
   * @name $templateRequestProvider#httpOptions
   * @description
   * The options to be passed to the {@link $http} service when making the request.
   * You can use this to override options such as the "Accept" header for template requests.
   *
   * The {@link $templateRequest} will set the `cache` and the `transformResponse` properties of the
   * options if not overridden here.
   *
   * @param {string=} value new value for the {@link $http} options.
   * @returns {string|self} Returns the {@link $http} options when used as getter and self if used as setter.
   */
  this.httpOptions = function(val) {
    if (val) {
      httpOptions = val;
      return this;
    }
    return httpOptions;
  };

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
   * If you want to pass custom options to the `$http` service, such as setting the Accept header you
   * can configure this via {@link $templateRequestProvider#httpOptions}.
   *
   * @param {string|TrustedResourceUrl} tpl The HTTP request template URL
   * @param {boolean=} ignoreRequestError Whether or not to ignore the exception when the request fails or the template is empty
   *
   * @return {Promise} a promise for the HTTP response data of the given URL.
   *
   * @property {number} totalPendingRequests total amount of pending template requests being downloaded.
   */
  this.$get = ['$exceptionHandler', '$templateCache', '$http', '$q', '$sce',
    function($exceptionHandler, $templateCache, $http, $q, $sce) {

      function handleRequestFn(tpl, ignoreRequestError) {
        handleRequestFn.totalPendingRequests++;

        // We consider the template cache holds only trusted templates, so
        // there's no need to go through whitelisting again for keys that already
        // are included in there. This also makes Angular accept any script
        // directive, no matter its name. However, we still need to unwrap trusted
        // types.
        if (!isString(tpl) || isUndefined($templateCache.get(tpl))) {
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

        return $http.get(tpl, extend({
            cache: $templateCache,
            transformResponse: transformResponse
          }, httpOptions))
          .finally(function() {
            handleRequestFn.totalPendingRequests--;
          })
          .then(function(response) {
            $templateCache.put(tpl, response.data);
            return response.data;
          }, handleError);

        function handleError(resp) {
          if (!ignoreRequestError) {
            resp = $templateRequestMinErr('tpload',
                'Failed to load template: {0} (HTTP status: {1} {2})',
                tpl, resp.status, resp.statusText);

            $exceptionHandler(resp);
          }

          return $q.reject(resp);
        }
      }

      handleRequestFn.totalPendingRequests = 0;

      return handleRequestFn;
    }
  ];
}
