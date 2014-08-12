//ugly
if (typeof bp !== 'undefined') {
  window.removeEventListener('DOMContentLoaded', bp.onDOMContentLoaded);
}

describe('bp', function() {
  var bp = window.bp,
      mockStep = {
        fn: function() {},
        name: 'fakeStep'
      };

  beforeEach(function() {
    bp.Document._container = document.createElement('div');
    bp.Document.infoTemplate = function(model) {
      return JSON.stringify(model);
    }
    bp.Runner.runState = {
      iterations: 0,
      numSamples: 20,
      recentResult: {}
    };

    bp.Report.timesPerAction = {};
  });

  describe('.Statistics', function() {
    describe('.calculateConfidenceInterval()', function() {
      it('should provide the correct confidence interval', function() {
        expect(bp.Statistics.calculateConfidenceInterval(30, 1000)).toBe(1.859419264179007);
      });
    });


    describe('.calculateRelativeMarginOfError()', function() {
      expect(bp.Statistics.calculateRelativeMarginOfError(1.85, 5)).toBe(0.37);
    });


    describe('.getMean()', function() {
      it('should return the mean for a given sample', function() {
        expect(bp.Statistics.getMean([1,2,5,4])).toBe(3);
      });
    });


    describe('.calculateStandardDeviation()', function() {
      it('should provide the correct standardDeviation for the provided sample and mean', function() {
        expect(bp.Statistics.calculateStandardDeviation([
          2,4,4,4,5,5,7,9
        ], 5)).toBe(2.138089935299395);
      });


      it('should provide the correct standardDeviation for the provided sample and mean', function() {
        expect(bp.Statistics.calculateStandardDeviation([
          674.64,701.78,668.33,662.15,663.34,677.32,664.25,1233.00,1100.80,716.15,681.52,671.23,702.70,686.89,939.39,830.28,695.46,695.66,675.15,667.48], 750.38)).toBe(158.57877026559186);
      });
    });


    describe('.calculateCoefficientOfVariation()', function() {
      expect(bp.Statistics.calculateCoefficientOfVariation(0.5, 5)).toBe(0.1);
    });
  });


  describe('.Document', function() {
    describe('.container()', function() {
      it('should return bp.Document._container if set', function() {
        expect(bp.Document.container() instanceof HTMLElement).toBe(true);
      });
    });


    describe('.onSampleRangeChanged()', function() {
      beforeEach(function() {
        bp.Runner.resetIterations();
      });


      it('should change the numSamples property', function() {
        expect(bp.Runner.runState.numSamples).toBe(20);
        bp.Document.onSampleInputChanged({target: {value: '80'}});
        expect(bp.Runner.runState.numSamples).toBe(80);
      });
    });


    describe('.writeReport()', function() {
      it('should write the report to the infoDiv', function() {
        bp.Document.infoDiv = document.createElement('div');
        bp.Document.writeReport('report!');
        expect(bp.Document.infoDiv.innerHTML).toBe('report!')
      });
    });


    describe('.onDOMContentLoaded()', function() {
      it('should call methods to write to the dom', function() {
        var buttonSpy = spyOn(bp.Document, 'addButton');
        var rangeSpy = spyOn(bp.Document, 'addSampleRange');
        var infoSpy = spyOn(bp.Document, 'addInfo');

        bp.Document.onDOMContentLoaded();
        expect(buttonSpy.callCount).toBe(4);
        expect(rangeSpy).toHaveBeenCalled();
        expect(infoSpy).toHaveBeenCalled();
      });
    });


    describe('.loadNextScript()', function() {
      it('should shift the first config from window.scripts', function() {
        window.scripts = [{src: 'foo'}, {src: 'bar'}];
        bp.Document.loadNextScript();
        expect(window.scripts).toEqual([{src: 'bar'}]);
      });


      it('should override script with provided source from query params', function() {
        var headSpy = spyOn(document.head, 'appendChild');
        bp.setFakeWindow({
          location: {
            search: '?angular=foobar'
          }
        });
        bp._window.scripts = [{
          id: 'angular',
          src: 'angular.js'
        }];
        bp.Document.loadNextScript();
        expect(headSpy.calls[0].args[0].getAttribute('src')).toBe('foobar');
      });
    });


    describe('.getParams()', function() {
      it('should parse query params into an object', function() {
        bp.setFakeWindow({
          location: {
            search: '?angular=foo&bar=baz'
          }
        });

        expect(bp.Document.getParams()).toEqual({
          angular: 'foo',
          bar: 'baz'
        });
      })
    });
  });


  describe('.Runner', function() {
    describe('.setIterations()', function() {
      it('should set provided arguments to runState object', function() {
        bp.Runner.runState = {numSamples: 20};
        bp.Runner.setIterations(15);
        expect(bp.Runner.runState.numSamples).toBe(20);
        expect(bp.Runner.runState.iterations).toBe(15);
      });
    });


    describe('.resetIterations()', function() {
      it('should set runState object to defaults', function() {
        bp.Runner.runState = {
          numSamples: 99,
          iterations: 100,
          recentResult: {
            fakeStep: {
              testTime: 2
            }
          }
        }
        bp.Report.timesPerAction = {
          fakeStep: {
            testTimes: [5]
          }
        };

        bp.Runner.resetIterations();
        expect(bp.Runner.runState.numSamples).toBe(99);
        expect(bp.Runner.runState.iterations).toBe(0);
        expect(bp.Report.timesPerAction).toEqual({fakeStep: {testTimes: [5]}});
        expect(bp.Runner.runState.recentResult['fakeStep'].testTime).toEqual(2);
      });
    });


    describe('.runTimedTest()', function() {
      it('should call gc if available', function() {
        window.gc = window.gc || function() {};
        var spy = spyOn(window, 'gc');
        bp.Runner.runTimedTest(mockStep, {});
        expect(spy).toHaveBeenCalled();
      });


      it('should return the time required to run the test', function() {
        var times = {};
        expect(typeof bp.Runner.runTimedTest(mockStep, times).testTime).toBe('number');
      });
    });


    describe('.runAllTests()', function() {
      beforeEach(function() {
        bp.steps = [mockStep];
        bp.Document.infoDiv = document.createElement('div');
        bp.infoTemplate = jasmine.createSpy('infoTemplate');
      });

      it('should call resetIterations before calling done', function() {
        var spy = spyOn(bp.Runner, 'resetIterations');
        bp.Runner.runState.iterations = 0;
        bp.Runner.runAllTests();
        expect(spy).toHaveBeenCalled();
      });


      it('should call done after running for the appropriate number of iterations', function() {
        var spy = spyOn(mockStep, 'fn');
        var doneSpy = jasmine.createSpy('done');

        runs(function() {
          bp.Runner.setIterations(5, 5);
          bp.Runner.runAllTests(doneSpy);
        });

        waitsFor(function() {
          return doneSpy.callCount;
        }, 'done to be called', 200);

        runs(function() {
          expect(spy.callCount).toBe(5);
        });
      });


      it('should add as many times to timePerStep as are specified by numSamples', function() {
        var doneSpy = jasmine.createSpy('done');
        var resetSpy = spyOn(bp.Runner, 'resetIterations');
        runs(function() {
          bp.Runner.runState.numSamples = 8;
          bp.Runner.setIterations(10);
          bp.Runner.runAllTests(doneSpy);
        });

        waitsFor(function() {
          return doneSpy.callCount;
        }, 'done to be called', 200);

        runs(function() {
          expect(bp.Report.timesPerAction.fakeStep.testTime.history.length).toBe(8);
        });
      });
    });


    describe('.loopBenchmark()', function() {
      var runAllTestsSpy, btn;
      beforeEach(function() {
        runAllTestsSpy = spyOn(bp.Runner, 'runAllTests');
        bp.Document.loopBtn = document.createElement('button');
      });

      it('should call runAllTests if iterations does not start at greater than -1', function() {
        bp.Runner.runState.iterations = 0;
        bp.Runner.loopBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
        expect(runAllTestsSpy.callCount).toBe(1);
      });


      it('should not call runAllTests if iterations is already -1', function() {
        runs(function() {
          bp.Runner.runState.iterations = -1;
          bp.Runner.loopBenchmark();
        });

        waits(1);

        runs(function() {
          expect(runAllTestsSpy).not.toHaveBeenCalled();
        });
      });


      it('should not call runAllTests if iterations is less than -1', function() {
        runs(function() {
          bp.Runner.runState.iterations = -50;
          bp.Runner.loopBenchmark();
        });

        waits(1);

        runs(function() {
          expect(runAllTestsSpy).not.toHaveBeenCalled();
        });
      });


      it('should set the button text to "Pause" while iterating', function() {
        bp.Runner.runState.iterations = 0;
        bp.Runner.loopBenchmark();
        expect(bp.Document.loopBtn.innerText).toBe('Pause');
      });


      it('should set the button text to "Loop" while iterating', function() {
        bp.Runner.runState.iterations = -1;
        bp.Runner.loopBenchmark();
        expect(bp.Document.loopBtn.innerText).toBe('Loop');
      });


      it('should set the runState -1 iterations', function() {
        var spy = spyOn(bp.Runner, 'setIterations');
        bp.Runner.runState.iterations = 0;
        bp.Runner.loopBenchmark();
        expect(spy).toHaveBeenCalledWith(-1);
      });


      it('should set the iterations to 0 if iterations is already -1', function() {
        bp.Runner.runState.iterations = -1;
        bp.Runner.loopBenchmark();
        expect(bp.Runner.runState.iterations).toBe(0);
      });
    });


    describe('.onceBenchmark()', function() {
      var runAllTestsSpy;
      beforeEach(function() {
        bp.Document.onceBtn = document.createElement('button');
        runAllTestsSpy = spyOn(bp.Runner, 'runAllTests');
      });

      it('should call runAllTests', function() {
        expect(runAllTestsSpy.callCount).toBe(0);
        bp.Runner.onceBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
      });


      it('should set the button text to "..."', function() {
        expect(runAllTestsSpy.callCount).toBe(0);
        bp.Runner.onceBenchmark();
        expect(bp.Document.onceBtn.innerText).toBe('...');
      });


      it('should set the text back to Once when done running test', function() {
        expect(bp.Document.onceBtn.innerText).not.toBe('Once');
        bp.Runner.onceBenchmark();
        var done = runAllTestsSpy.calls[0].args[0];
        done();
        expect(bp.Document.onceBtn.innerText).toBe('Once');
      });
    });


    describe('.twentyFiveBenchmark()', function() {
      var runAllTestsSpy;
      beforeEach(function() {
        bp.Document.twentyFiveBtn = document.createElement('button');
        runAllTestsSpy = spyOn(bp.Runner, 'runAllTests');
      });


      it('should set the runState to25 iterations', function() {
        var spy = spyOn(bp.Runner, 'setIterations');
        bp.Runner.twentyFiveBenchmark();
        expect(spy).toHaveBeenCalledWith(25);
      });


      it('should change the button text to "Looping..."', function() {
        expect(bp.Document.twentyFiveBtn.innerText).not.toBe('Looping...');
        bp.Runner.twentyFiveBenchmark();
        expect(bp.Document.twentyFiveBtn.innerText).toBe('Looping...');
      });


      it('should call runAllTests', function() {
        bp.Runner.twentyFiveBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
      });


      it('should pass runAllTests a third argument specifying times to ignore', function() {
        bp.Runner.twentyFiveBenchmark();
        expect(runAllTestsSpy.calls[0].args[1]).toBe(5);
      });
    });
  });


  describe('.Report', function() {
    describe('.calcStats()', function() {
      beforeEach(function() {
        bp.steps = [mockStep];
        bp.Runner.runState = {
          numSamples: 5,
          iterations: 5,
          recentResult: {
            fakeStep: {
              testTime: 5,
              gcTime: 2,
              recentGarbagePerStep: 200,
              recentRetainedMemoryPerStep: 100
            }
          }
        };
        bp.Report.timesPerAction = {
          fakeStep: {
            testTime: {
              history: [3,7]
            },
            garbageCount: {
              history: [50,50]
            },
            retainedCount: {
              history: [25,25]
            },
            gcTime: {
              recent: 3,
              history: [1,3]
            },
            nextEntry: 2
          },
        };
      });


      it('should set the most recent time for each step to the next entry', function() {
        bp.Report.calcStats();
        expect(bp.Report.timesPerAction.fakeStep.testTime.history[2]).toBe(5);
        bp.Runner.runState.recentResult.fakeStep.testTime = 25;
        bp.Report.calcStats();
        expect(bp.Report.timesPerAction.fakeStep.testTime.history[3]).toBe(25);
      });


      it('should return an string report', function() {
        expect(typeof bp.Report.calcStats()).toBe('string');
      });
    });


    describe('.rightSizeTimes()', function() {
      it('should make remove the left side of the input if longer than numSamples', function() {
        bp.Runner.runState.numSamples = 3;
        expect(bp.Report.rightSizeTimes([0,1,2,3,4,5,6])).toEqual([4,5,6]);
      });


      it('should return the whole list if shorter than or equal to numSamples', function() {
        bp.Runner.runState.numSamples = 7;
        expect(bp.Report.rightSizeTimes([0,1,2,3,4,5,6])).toEqual([0,1,2,3,4,5,6]);
        expect(bp.Report.rightSizeTimes([0,1,2,3,4,5])).toEqual([0,1,2,3,4,5]);
      });
    });
  });
});