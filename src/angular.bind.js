if (window.angular.bootstrap) {
  // AngularJS is already loaded, so we can return here...
  if (window.console) {
    console.log('WARNING: Tried to load angular more than once.');
  }
  return;
}

// try to bind to jquery now so that one can write jqLite(fn)
// but we will rebind on bootstrap again.
bindJQuery();
