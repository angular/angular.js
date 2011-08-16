function $HttpBackendProvider() {
  this.$get = ['$browser', function($browser) {
    return $browser.xhr;
  }];
}

