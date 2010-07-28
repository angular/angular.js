var scenario, runner, log, $scenario;

function logger(text) {
  return function(done){
    log += text;
    (done||noop)();
  };
}

function setUpContext() {
  scenario = {};
  runner = new angular.scenario.Runner(scenario, _jQuery);
  $scenario = scenario.$scenario;
  log = '';
}
