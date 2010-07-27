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
        expect(spec.futures).toEqual([]);
        expect(spec.name).toEqual('describe name: it should text');
      });

      it('should complain on duplicate it', function() {
        // WRITE ME!!!!
      });

      it('should create a failing future if there is a javascript error', function(){
        var spec;
        Describe('D1', function(){
          It('I1', function(){
            spec = $scenario.currentSpec;
            throw {message: 'blah'};
          });
        });
        var future = spec.futures[0];
        expect(future.name).toEqual('blah');
        try {
          future.behavior();
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
            $scenario.addFuture('afterEachLog', logger('after;'));
            $scenario.addFuture('afterEachThrow', function() {
              throw "AfterError";
            });
          });
          It('should text1', function() {
            $scenario.addFuture('future1', logger('future1;'));
          });
          It('should text2', function() {
            $scenario.addFuture('future2', logger('future2;'));
          });
        });
        $scenario.run(body);
        expect(log).toEqual('future1;after;future2;after;');
        expect(scenario.$testrun.results).toEqual([
          { name : 'describe name: it should text1',
            passed : false,
            error : 'AfterError',
            steps : [ 'future1', 'afterEachLog', 'afterEachThrow' ] },
          { name : 'describe name: it should text2',
            passed : false,
            error : 'AfterError',
            steps : [ 'future2', 'afterEachLog', 'afterEachThrow' ] }]);
      });
    });
  });

  describe('future building', function(){
    it('should queue futures', function(){
      function behavior(){};
      Describe('name', function(){
        It('should', function(){
          $scenario.addFuture('futureName', behavior);
        });
      });
      expect($scenario.specs['name: it should'].futures[0].name).
        toEqual('futureName');
    });
  });

  describe('execution', function(){
    it('should execute the queued futures', function(){
      var next, firstThis, secondThis, doneThis, spec;
      $scenario.specs['spec'] = {
        futures: [
            new Future('future1', function(done) {
              next = done;
              log += 'first;';
              firstThis = this;
            }),
            new Future('future2', function(done) {
              next = done;
              log += 'second;';
              secondThis = this;
            })
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
      expect(spec === window).toEqual(false);
      expect(spec).toEqual(firstThis);
      expect(spec).toEqual(secondThis);
      expect(spec).toEqual(doneThis);

      expect(spec.result.failed).toEqual(false);
      expect(spec.result.finished).toEqual(true);
      expect(spec.result.error).toBeUndefined();
      expect(spec.result.passed).toEqual(true);
    });

    it('should handle exceptions in a future', function(){
      $scenario.specs['spec'] = {
          futures: [
            new Future('first future', function(done) {
              done();
            }),
            new Future('error', function(done) {
              throw "MyError";
            }),
            new Future('should not execute', function(done) {
              done();
            })
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
          steps: ['first future', 'error']}]);
    });
  });

  describe('run', function(){
    var next;
    beforeEach(function() {
      Describe('d1', function(){
        It('it1', function(){ $scenario.addFuture('s1', logger('s1,')); });
        It('it2', function(){
          $scenario.addFuture('s2', logger('s2,'));
          $scenario.addFuture('s2.2', function(done){ next = done; });
        });
      });
      Describe('d2', function(){
        It('it3', function(){ $scenario.addFuture('s3', logger('s3,')); });
        It('it4', function(){ $scenario.addFuture('s4', logger('s4,')); });
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
        {name: 'd1: it it1', passed: true, error: undefined, steps: ['s1']}
      ]);
      next();
      expect(scenario.$testrun.done).toBeTruthy();
      expect(scenario.$testrun.results).toEqual([
        {name: 'd1: it it1', passed: true, error: undefined, steps: ['s1']},
        {name: 'd1: it it2', passed: true, error: undefined, steps: ['s2', 's2.2']},
        {name: 'd2: it it3', passed: true, error: undefined, steps: ['s3']},
        {name: 'd2: it it4', passed: true, error: undefined, steps: ['s4']}
      ]);
    });
  });

});