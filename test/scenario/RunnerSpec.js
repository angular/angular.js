describe('Runner', function(){
  var scenario, runner, log, Describe, It, $scenario, body;

  function logger(text) {
    return function(done){
      log += text;
      (done||noop)();
    };
  }

  beforeEach(function(){
    log = '';
    scenario = {};
    body = _jQuery('<div></div>');
    runner = new angular.scenario.Runner(scenario, _jQuery);
    Describe = scenario.describe;
    BeforeEach = scenario.beforeEach;
    AfterEach = scenario.afterEach;
    It = scenario.it;
    $scenario = scenario.$scenario;
  });

  describe('describe', function(){
    it('should consume the describe functions', function(){
      Describe('describe name',  logger('body'));

      expect(log).toEqual('body');
    });

    describe('it', function(){
      it('should consume it', function(){
        Describe('describe name', function(){
          It('should text', logger('body'));
        });
        expect(log).toEqual('body');
        var spec = $scenario.specs['describe name: it should text'];
        expect(spec.steps).toEqual([]);
        expect(spec.name).toEqual('describe name: it should text');
      });

      it('should complain on duplicate it', function() {
        // WRITE ME!!!!
      });

      it('should create a failing step if there is a javascript error', function(){
        var spec;
        Describe('D1', function(){
          It('I1', function(){
            spec = $scenario.currentSpec;
            throw {message: 'blah'};
          });
        });
        var step = spec.steps[0];
        expect(step.name).toEqual('blah');
        try {
          step.fn();
          fail();
        } catch (e) {
          expect(e.message).toEqual('blah');
        };
      });
    });

    describe('beforeEach', function() {
      it('should execute beforeEach before every it', function() {
        Describe('describe name', function(){
          BeforeEach(logger('before;'));
          It('should text', logger('body;'));
          It('should text2', logger('body2;'));
        });
        expect(log).toEqual('before;body;before;body2;');
      });
    });
    describe('afterEach', function() {
      it('should execute afterEach after every it', function() {
        Describe('describe name', function(){
          AfterEach(logger('after;'));
          It('should text1', logger('body1;'));
          It('should text2', logger('body2;'));
        });
        expect(log).toEqual('body1;after;body2;after;');
      });

      it('should always execute afterEach after every it', function() {
        Describe('describe name', function(){
          AfterEach(logger('after;'));
          It('should text', function() {
            logger('body1;')();
            throw "MyError";
          });
          It('should text2', logger('body2;'));
        });
        expect(log).toEqual('body1;after;body2;after;');
      });

      it('should report an error if afterEach fails', function() {
        var next;
        Describe('describe name', function(){
          AfterEach(function() {
            $scenario.addStep('afterEachLog', logger('after;'));
            $scenario.addStep('afterEachThrow', function() {
              throw "AfterError";
            });
          });
          It('should text1', function() {
            $scenario.addStep('step1', logger('step1;'));
          });
          It('should text2', function() {
            $scenario.addStep('step2', logger('step2;'));
          });
        });
        $scenario.run(body);
        expect(log).toEqual('step1;after;step2;after;');
        expect(scenario.$testrun.results).toEqual([
          { name : 'describe name: it should text1',
            passed : false,
            error : 'AfterError',
            steps : [ 'step1', 'afterEachLog', 'afterEachThrow' ] },
          { name : 'describe name: it should text2',
            passed : false,
            error : 'AfterError',
            steps : [ 'step2', 'afterEachLog', 'afterEachThrow' ] }]);
      });
    });
  });

  describe('steps building', function(){
    it('should queue steps', function(){
      function step(){};
      Describe('name', function(){
        It('should', function(){
          $scenario.addStep('stepname', step);
        });
      });
      expect($scenario.specs['name: it should'].steps).toEqual([{name:'stepname', fn:step}]);
    });
  });

  describe('execution', function(){
    it('should execute the queued steps', function(){
      var next, firstThis, secondThis, doneThis, spec;
      $scenario.specs['spec'] = {
        steps: [
          {name:'step1', fn: function(done) {
            next = done;
            log += 'first;';
            firstThis = this;
          }},
          {name:'step2', fn:function(done){
            next = done;
            log += 'second;';
            secondThis = this;
          }}
        ]
      };

      spec = $scenario.execute('spec', function(done){
        log += 'done;';
        doneThis = this;
      });
      expect(log).toEqual('first;');
      next();
      expect(log).toEqual('first;second;');
      next();
      expect(log).toEqual('first;second;done;');
      expect(spec).not.toEqual(window);
      expect(spec).toEqual(firstThis);
      expect(spec).toEqual(secondThis);
      expect(spec).toEqual(doneThis);

      expect(spec.result.failed).toEqual(false);
      expect(spec.result.finished).toEqual(true);
      expect(spec.result.error).toBeUndefined();
      expect(spec.result.passed).toEqual(true);
    });

    it('should handle exceptions in a step', function(){
      $scenario.specs['spec'] = {
          steps: [
            {name: 'first step', fn: function(done) {
              done();
            }},
            {name:'error', fn:function(done) {
              throw "MyError";
            }},
            {name: 'should not execute', fn: function(done) {
              done();
            }}
          ]
        };

        var spec = $scenario.execute('spec');

        expect(spec.result.passed).toEqual(false);
        expect(spec.result.failed).toEqual(true);
        expect(spec.result.finished).toEqual(true);
        expect(spec.result.error).toEqual("MyError");
        expect(scenario.$testrun.results).toEqual([{
          name: 'spec',
          passed: false,
          error: 'MyError',
          steps: ['first step', 'error']}]);
    });
  });

  describe('run', function(){
    var next;
    beforeEach(function() {
      Describe('d1', function(){
        It('it1', function(){ $scenario.addStep('s1', logger('s1,')); });
        It('it2', function(){
          $scenario.addStep('s2', logger('s2,'));
          $scenario.addStep('s2.2', function(done){ next = done; });
        });
      });
      Describe('d2', function(){
        It('it3', function(){ $scenario.addStep('s3', logger('s3,')); });
        It('it4', function(){ $scenario.addStep('s4', logger('s4,')); });
      });
    });
    it('should execute all specs', function(){
      $scenario.run(body);

      expect(log).toEqual('s1,s2,');
      next();
      expect(log).toEqual('s1,s2,s3,s4,');
    });
    it('should publish done state and results as tests are run', function() {
      expect(scenario.$testrun.done).toBeFalsy();
      expect(scenario.$testrun.results).toEqual([]);
      $scenario.run(body);
      expect(scenario.$testrun.done).toBeFalsy();
      expect(scenario.$testrun.results).toEqual([
        {name: 'd1: it it1', passed: true, steps: ['s1']}
      ]);
      next();
      expect(scenario.$testrun.done).toBeTruthy();
      expect(scenario.$testrun.results).toEqual([
        {name: 'd1: it it1', passed: true, steps: ['s1']},
        {name: 'd1: it it2', passed: true, steps: ['s2', 's2.2']},
        {name: 'd2: it it3', passed: true, steps: ['s3']},
        {name: 'd2: it it4', passed: true, steps: ['s4']}
      ]);
    });
  });

});