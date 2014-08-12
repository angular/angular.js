'use strict';

var $compileMinErr = minErr('$compile');

/**
 * @ngdoc service
 * @name $templateRequest
 *
 * @description
 * The `$templateRequest` service downloads the provided template using `$http` and, upon success,
 * stores the contents inside of `$templateCache`. If the HTTP request fails or the response data
 * of the HTTP request is empty then a `$compile` error will be thrown (the exception can be thwarted
 * by setting the 2nd parameter of the function to true).
 *
 * @param {string} tpl The HTTP request template URL
 * @param {boolean=} ignoreRequestError Whether or not to ignore the exception when the request fails or the template is empty
 *
 * @return {Promise} the HTTP Promise for the given.
 *
 * @property {number} totalPendingRequests total amount of pending template requests being downloaded.
 */
function $TemplateRequestProvider() {
  this.$get = ['$templateCache', '$http', '$q', function($templateCache, $http, $q) {
    function handleRequestFn(tpl, ignoreRequestError) {
      var self = handleRequestFn;
      self.totalPendingRequests++;

      return $http.get(tpl, { cache : $templateCache })
        .then(function(response) {
          var html = response.data;
          if(!html || html.length === 0) {
            return handleError();
          }

          self.totalPendingRequests--;
          $templateCache.put(tpl, html);
          return html;
        }, handleError);

      function handleError() {
        self.totalPendingRequests--;
        if (!ignoreRequestError) {
          throw $compileMinErr('tpload', 'Failed to load template: {0}', tpl);
        }
        return $q.reject();
      }
    }

    handleRequestFn.totalPendingRequests = 0;

    return handleRequestFn;
  }];
}
