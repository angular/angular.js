/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 */

(function() {

// Suite/TestCase before and after function stacks.
var before = [];
var after = [];

jasmine.Env.prototype.describe = (function(describe){

	// TODO(ibolmo): Support nested describes.
	return function(description, specDefinitions){
		this.currentTestCase = TestCase(description);
		return describe.call(this, description, specDefinitions);
	};

})(jasmine.Env.prototype.describe);


jasmine.Env.prototype.it = (function(it){

	return function(desc, func){
		var spec = it.call(this, desc, func);
		this.currentTestCase.prototype['test that it ' + desc] = func;
		return spec;
	};

})(jasmine.Env.prototype.it);


jasmine.Env.prototype.beforeEach = (function(beforeEach){

	// TODO(ibolmo): Support beforeEach TestCase.
	return function(beforeEachFunction) {
		beforeEach.call(this, beforeEachFunction);
		if (this.currentTestCase) {
			this.currentTestCase.prototype.setUp = beforeEachFunction;
		} else {
			before.push(beforeEachFunction);
		}
	};

})(jasmine.Env.prototype.beforeEach);


jasmine.Env.prototype.afterEach = (function(afterEach){

	// TODO(ibolmo): Support afterEach TestCase.
	return function(afterEachFunction) {
		afterEach.call(this, afterEachFunction);
		if (this.currentTestCase) {
			this.currentTestCase.prototype.tearDown = afterEachFunction;
		} else {
			after.push(afterEachFunction);
		}
	};

})(jasmine.Env.prototype.afterEach);


jasmine.NestedResults.prototype.addResult = (function(addResult){

	return function(result) {
		addResult.call(this, result);
		if (result.type != 'MessageResult' && !result.passed()) fail(result.message);
	};

})(jasmine.NestedResults.prototype.addResult);


jstestdriver.plugins.TestRunnerPlugin.prototype.runTestConfiguration = (function(runTestConfiguration){

	return function(testRunConfiguration, onTestDone, onTestRunConfigurationComplete){
		for (var i = 0, l = before.length; i < l; i++) before[i]();
		onTestRunConfigurationComplete = (function(configurationComplete){

			return function() {
				for (var i = 0, l = after.length; i < l; i++) after[i]();
				configurationComplete();
			};

		})(onTestRunConfigurationComplete);
		runTestConfiguration.call(this, testRunConfiguration, onTestDone, onTestRunConfigurationComplete);
	};

})(jstestdriver.plugins.TestRunnerPlugin.prototype.runTestConfiguration);


// Reset environment with overriden methods.
jasmine.currentEnv_ = null;
jasmine.getEnv();

})();
