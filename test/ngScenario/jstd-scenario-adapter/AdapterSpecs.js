'use strict';

describe('jstd-adapter', function() {
  var fakeJSTD = { pluginRegistrar: { register: function() {} } },
      originalNavigateTo = angular.scenario.Application.prototype.navigateTo;

  /**
   * Reverts hack on angular.scenario.Application.navigateTo
   * We should revert this hack after any single call of initScenarioAdapter,
   * so that it doesn't influence other tests...
   */
  function revertNavigateToHack() {
    angular.scenario.Application.prototype.navigateTo = originalNavigateTo;
  }

  /**
   * Helper for building angular.scenario.ObjectModel.Spec
   * @returns {angular.scenario.ObjectModel.Spec}
   */
  function buildSpec(status, name, duration, definitions, error, line) {
    var spec = new angular.scenario.ObjectModel.Spec(
        'fake-id', name || 'name', definitions || ['desc1', 'desc2']);
    spec.duration = duration || 10;
    spec.status = status || 'success';
    spec.error = error || '';
    spec.line = line || '';

    return spec;
  }

  /**
   * Helper for building angular.scenario.ObjectModel.Spec with error and error line
   * @returns {angular.scenario.ObjectModel.Spec}
   */
  function buildErrorSpec(error, line, status, name) {
    return buildSpec(status || 'error', name, null, null, error, line);
  }

  /**
   * Helper for building TestConfiguration
   * @returns {jstestdriver.TestRunConfiguration}
   */
  function buildTestConf(type) {
    return new jstestdriver.TestRunConfiguration(
      new jstestdriver.TestCaseInfo('Fake test - ' + Math.random(), function() {}, type), null);
  }

  /**
   * Helper for building SCENARIO TestConfiguration
   * @returns {jstestdriver.TestRunConfiguration}
   */
  function buildScenarioTestConf() {
    return buildTestConf(SCENARIO_TYPE);
  }

  describe('initScenarioAdapter', function() {
    afterEach(revertNavigateToHack);

    it('should create and register plugin if jstestdriver defined', function() {
      spyOn(fakeJSTD.pluginRegistrar, 'register');
      initScenarioAdapter(fakeJSTD);
      expect(fakeJSTD.pluginRegistrar.register).toHaveBeenCalled();
      expect(fakeJSTD.pluginRegistrar.register.mostRecentCall.args[0] instanceof JstdPlugin);
    });

    it('should do nothing if jstestdriver not defined', function() {
      expect(function() {
        initScenarioAdapter(undefined);
      }).not.toThrow();
    });

    it('should set setUpAndRun callback to plugin', function() {
      var runFn = jasmine.createSpy('setUpAndRun');
      plugin.runScenario = null;

      initScenarioAdapter(fakeJSTD, runFn);
      expect(plugin.runScenario).toBe(runFn);
    });

    describe('navigateTo', function() {
      var fakeJSTD = { pluginRegistrar: { register: function() {} } },
          app = new angular.scenario.Application(_jQuery('<div></div>')),
          navigateSpy;

      beforeEach(function() {
        navigateSpy = spyOn(angular.scenario.Application.prototype, 'navigateTo');
      });

      it('should add url prefix when jstd defined', function() {
        initScenarioAdapter(fakeJSTD, null, {relativeUrlPrefix: '/prefix/'});

        app.navigateTo('test.html');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('/prefix/test.html');
      });

      it('should add forward-slash as default url prefix when jstd defined', function() {
        initScenarioAdapter(fakeJSTD);

        app.navigateTo('test.html');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('/test.html');
      });

      it('should not change url when jstd not defined', function() {
        initScenarioAdapter(null);

        app.navigateTo('test.html');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('test.html');
      });

      it('should not change hash url', function() {
        initScenarioAdapter(fakeJSTD);

        app.navigateTo('#/index.html/a');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('#/index.html/a');
      });

      it('should not change absolute url', function() {
        initScenarioAdapter(fakeJSTD);

        app.navigateTo('/index.html/a');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('/index.html/a');
      });

      it('should not change "about:blank" url', function() {
        initScenarioAdapter(fakeJSTD);

        app.navigateTo('about:blank');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('about:blank');
      });

      it('should not change url with domain', function() {
        initScenarioAdapter(fakeJSTD);

        app.navigateTo('http://www.google.com');
        expect(navigateSpy).toHaveBeenCalled();
        expect(navigateSpy.mostRecentCall.args[0]).toEqual('http://www.google.com');
      });
    });
  });

  describe('JstdPlugin', function() {
    var p;

    beforeEach(function() {
      p = new JstdPlugin();
    });

    describe('runTestConfiguration', function() {
      var initScenarioSpy, onTestSpy, onAllTestsSpy, spec, modelSpec;

      beforeEach(function() {
        initScenarioSpy = jasmine.createSpy('initScenarioAndRun');
        onTestSpy = jasmine.createSpy('onOneTest');
        onAllTestsSpy = jasmine.createSpy('onAllTests');

        p.runScenario = initScenarioSpy;
        spec = {id: 'fake', name: 'Spec Name'};
        modelSpec = new angular.scenario.ObjectModel.Spec(spec.id, spec.name);
      });

      it('should ignore non scenario test cases', function() {
        expect(p.runTestConfiguration(buildTestConf(), onTestSpy, onAllTestsSpy)).toBe(false);
        expect(p.runTestConfiguration(buildTestConf('async'), onTestSpy, onAllTestsSpy)).toBe(false);
        expect(initScenarioSpy).not.toHaveBeenCalled();
        expect(onTestSpy).not.toHaveBeenCalled();
        expect(onAllTestsSpy).not.toHaveBeenCalled();
      });

      it('should return true when scenario test case', function() {
        expect(p.runTestConfiguration(buildScenarioTestConf(), onTestSpy, onAllTestsSpy)).toBe(true);
      });

      it('should call initAndRunTests when scenario test case', function() {
        p.runTestConfiguration(buildScenarioTestConf(), onTestSpy, onAllTestsSpy);
        expect(initScenarioSpy).toHaveBeenCalled();
      });
    });

    describe('getTestRunsConfigurationFor', function() {
      it('should add TestRunConfiguration with SCENARIO_TYPE TestCase', function() {
        var configurations = [];
        p.getTestRunsConfigurationFor(null, null, configurations);

        expect(configurations.length).toBe(1);
        expect(configurations[0] instanceof jstestdriver.TestRunConfiguration).toBe(true);
        expect(configurations[0].getTestCaseInfo().getType()).toEqual(SCENARIO_TYPE);
      });

      it('should always return true', function() {
        expect(p.getTestRunsConfigurationFor(null, null, [])).toBe(true);
      });
    });
  });

  describe('createTestResultFromSpec', function() {
    it('should return jstestdriver.TestResult instance', function() {
      expect(createTestResultFromSpec(buildSpec()) instanceof jstestdriver.TestResult).toBe(true);
    });

    it('should set proper test name', function() {
      expect(createTestResultFromSpec(buildSpec()).testName).toEqual('name');
    });

    it('should set duration', function() {
      expect(createTestResultFromSpec(buildSpec()).time).toEqual(10);
    });

    it('should set test case - full definition name', function() {
      var spec = buildSpec();
      expect(createTestResultFromSpec(spec).testCaseName).toEqual(spec.fullDefinitionName);
    });

    it('should set passed result when success', function() {
      expect(createTestResultFromSpec(buildSpec('success')).result)
        .toEqual(jstestdriver.TestResult.RESULT.PASSED);
    });

    it('should set error result when error', function() {
      expect(createTestResultFromSpec(buildSpec('error')).result)
        .toEqual(jstestdriver.TestResult.RESULT.ERROR);
    });

    it('should set failed result when failure', function() {
      expect(createTestResultFromSpec(buildSpec('failure')).result)
        .toEqual(jstestdriver.TestResult.RESULT.FAILED);
    });

    it('should set error message when error/failure', function() {
      expect(createTestResultFromSpec(buildErrorSpec('error-message')).message)
      .toEqual('error-message');
    });

    it('should log line number when error/failure', function() {
      expect(createTestResultFromSpec(buildErrorSpec('msg', 'line-number')).log)
      .toEqual('line-number');
    });
  });

  describe('angular.scenario.output.jstd', function() {
    var model;

    beforeEach(function() {
      var runner = new angular.scenario.testing.MockRunner(),
          context = _jQuery("<div></div>");

      plugin = new JstdPlugin();
      model = new angular.scenario.ObjectModel(runner);
      angular.scenario.output.jstd(context, runner, model);

      spyOn(plugin, 'reportEnd');
      spyOn(plugin, 'reportResult');
    });

    it('should report end of all tests', function() {
      model.emit('RunnerEnd');
      expect(plugin.reportEnd).toHaveBeenCalled();
    });

    it('should report jstestdriver.TestResult', function() {
      model.emit('SpecEnd', buildSpec());
      expect(plugin.reportResult).toHaveBeenCalled();
      expect(plugin.reportResult.argsForCall[0][0] instanceof jstestdriver.TestResult).toBe(true);
    });
  });

  // couple of higher level tests (wiring objects together)
  describe('HIGHER LEVEL', function() {
    var initScenarioSpy, onTestSpy, onAllTestsSpy, model;

    beforeEach(function() {
      plugin = new JstdPlugin();
      initScenarioSpy = jasmine.createSpy('initScenarioAndRun');
      onTestSpy = jasmine.createSpy('onOneTest');
      onAllTestsSpy = jasmine.createSpy('onAllTests');

      var runner = new angular.scenario.testing.MockRunner(),
          context = _jQuery("<div></div>");

      model = new angular.scenario.ObjectModel(runner);
      angular.scenario.output.jstd(context, runner, model);

      initScenarioAdapter(fakeJSTD, initScenarioSpy);
      plugin.runTestConfiguration(buildScenarioTestConf(), onTestSpy, onAllTestsSpy);
    });

    afterEach(revertNavigateToHack);

    it('should report and of test suite', function() {
      model.emit('RunnerEnd');
      expect(onAllTestsSpy).toHaveBeenCalled();
    });

    it('should report success test result', function() {
      model.emit('SpecEnd', buildSpec('success', 'name'));
      expect(onTestSpy).toHaveBeenCalled();
      var result = onTestSpy.argsForCall[0][0];
      expect(result instanceof jstestdriver.TestResult).toBe(true);
      expect(result.testName).toEqual('name');
      expect(result.result).toEqual(jstestdriver.TestResult.RESULT.PASSED);
    });

    it('should report error test result', function() {
      model.emit('SpecEnd', buildSpec('error'));
      expect(onTestSpy).toHaveBeenCalled();
      var result = onTestSpy.argsForCall[0][0];
      expect(result.result).toEqual(jstestdriver.TestResult.RESULT.ERROR);
    });

    it('should report failed test result', function() {
      model.emit('SpecEnd', buildSpec('failure'));
      expect(onTestSpy).toHaveBeenCalled();
      var result = onTestSpy.argsForCall[0][0];
      expect(result.result).toEqual(jstestdriver.TestResult.RESULT.FAILED);
    });
  });
});
