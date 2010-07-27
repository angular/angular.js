var scenario, runner, log, $scenario, Describe, It, body;

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
  Describe = scenario.describe;
  BeforeEach = scenario.beforeEach;
  AfterEach = scenario.afterEach;
  It = scenario.it;
  log = '';
  body = _jQuery('<div></div>');
}
