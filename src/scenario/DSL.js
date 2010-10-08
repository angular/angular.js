/**
 * Shared DSL statements that are useful to all scenarios.
 */

/**
* Usage:
*    pause(seconds) pauses the test for specified number of seconds
*/
angular.scenario.dsl('pause', function() {
 return function(time) {
   return this.addFuture('pause for ' + time + ' seconds', function(done) {
     this.setTimeout(function() { done(null, time * 1000); }, time * 1000);
   });
 };
});

/**
 * Usage:
 *    expect(future).{matcher} where matcher is one of the matchers defined
 *    with angular.scenario.matcher
 *
 * ex. expect(binding("name")).toEqual("Elliott")
 */
angular.scenario.dsl('expect', function() {
  var chain = angular.extend({}, angular.scenario.matcher);
  
  chain.not = function() {
    this.inverse = true;
    return chain;
  };
  
  return function(future) {
    this.future = future;
    return chain;
  };
});

/**
 * Usage:
 *    navigateTo(future|string) where url a string or future with a value 
 *    of a  URL to navigate to
 */
angular.scenario.dsl('navigateTo', function() {
  return function(url) {
    var application = this.application;
    var name = url;
    if (url.name) {
      name = ' value of ' + url.name;
    }
    return this.addFuture('navigate to ' + name, function(done) {
      application.navigateTo(url.value || url, function() {
        application.executeAction(function() {
          if (this.angular) {
            var $browser = this.angular.service.$browser();
            $browser.poll();
            $browser.notifyWhenNoOutstandingRequests(function() {
              done(null, url.value || url);
            });
          } else {
            done(null, url.value || url);
          }
        });
      });
    });
  };
});

/**
 * Usage:
 *    input(name).enter(value) enters value in input with specified name
 *    input(name).check() checks checkbox
 *    input(name).select(value) selects the readio button with specified name/value
 */
angular.scenario.dsl('input', function() {
  var chain = {};
  
  chain.enter = function(value) {
    var spec = this;
    return this.addFutureAction("input '" + this.name + "' enter '" + value + "'", function(done) {
      var input = _jQuery(this.document).find('input[name=' + spec.name + ']');
      if (!input.length)
        return done("Input named '" + spec.name + "' does not exist.");
      input.val(value);
      this.angular.element(input[0]).trigger('change');
      done();
    });
  };
  
  chain.check = function() {
    var spec = this;
    return this.addFutureAction("checkbox '" + this.name + "' toggle", function(done) {
      var input = _jQuery(this.document).
        find('input:checkbox[name=' + spec.name + ']');
      if (!input.length)
        return done("Input named '" + spec.name + "' does not exist.");
      this.angular.element(input[0]).trigger('click');
      input.attr('checked', !input.attr('checked'));
      done();
    });
  };
  
  chain.select = function(value) {
    var spec = this;
    return this.addFutureAction("radio button '" + this.name + "' toggle '" + value + "'", function(done) {
      var input = _jQuery(this.document).
        find('input:radio[name$="@' + spec.name + '"][value="' + value + '"]');
      if (!input.length)
        return done("Input named '" + spec.name + "' does not exist.");
      this.angular.element(input[0]).trigger('click');
      input.attr('checked', !input.attr('checked'));
      done();
    });
  };
  
  return function(name) {
    this.name = name;
    return chain;
  };
});

/**
 * Usage:
 *    binding(name) returns the value of a binding
 */
angular.scenario.dsl('binding', function() {
  return function(name) {
    return this.addFutureAction("select binding '" + name + "'", function(done) {
      var element = _jQuery(this.document).find('[ng\\:bind="' + name + '"]');
      if (!element.length)
        return done("Binding named '" + name + "' does not exist.");
      done(null, element.text());
    });
  };
});
