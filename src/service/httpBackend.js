angularServiceInject('$httpBackend', function($browser) {
  return $browser.xhr;
}, ['$browser']);
