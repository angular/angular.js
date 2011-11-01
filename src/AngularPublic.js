'use strict';

var browserSingleton;

angularService('$browser', function($log, $sniffer) {
  if (!browserSingleton) {
    browserSingleton = new Browser(window, jqLite(window.document), jqLite(window.document.body),
                                   XHR, $log, $sniffer);
  }
  return browserSingleton;
}, {$inject: ['$log', '$sniffer']});


publishExternalAPI(angular);

//try to bind to jquery now so that one can write angular.element().read()
//but we will rebind on bootstrap again.
bindJQuery();


