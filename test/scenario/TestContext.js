var _window, runner, log, $scenario;

function logger(text) {
  return function(done){
    log += text;
    (done||noop)();
  };
}

function setUpContext() {
  _window = {};
  runner = new angular.scenario.Runner(_window, _jQuery);
  $scenario = _window.$scenario;
  log = '';
}
