'use strict';

/**
 * Shared DSL statements that are useful to all scenarios.
 */

 /**
 * Usage:
 *    pause() pauses until you call resume() in the console
 */
angular.scenario.dsl('pause', function() {
  return function() {
    return this.addFuture('pausing for you to resume', function(done) {
      this.emit('InteractivePause', this.spec, this.step);
      this.$window.resume = function() { done(); };
    });
  };
});

/**
 * Usage:
 *    sleep(seconds) pauses the test for specified number of seconds
 */
angular.scenario.dsl('sleep', function() {
  return function(time) {
    return this.addFuture('sleep for ' + time + ' seconds', function(done) {
      this.$window.setTimeout(function() { done(null, time * 1000); }, time * 1000);
    });
  };
});

/**
 * Usage:
 *    browser().navigateTo(url) Loads the url into the frame
 *    browser().navigateTo(url, fn) where fn(url) is called and returns the URL to navigate to
 *    browser().reload() refresh the page (reload the same URL)
 *    browser().window.href() window.location.href
 *    browser().window.path() window.location.pathname
 *    browser().window.search() window.location.search
 *    browser().window.hash() window.location.hash without # prefix
 *    browser().location().url() see ng.$location#url
 *    browser().location().path() see ng.$location#path
 *    browser().location().search() see ng.$location#search
 *    browser().location().hash() see ng.$location#hash
 */
angular.scenario.dsl('browser', function() {
  var chain = {};

  chain.navigateTo = function(url, delegate) {
    var application = this.application;
    return this.addFuture("browser navigate to '" + url + "'", function(done) {
      if (delegate) {
        url = delegate.call(this, url);
      }
      application.navigateTo(url, function() {
        done(null, url);
      }, done);
    });
  };

  chain.reload = function() {
    var application = this.application;
    return this.addFutureAction('browser reload', function($window, $document, done) {
      var href = $window.location.href;
      application.navigateTo(href, function() {
        done(null, href);
      }, done);
    });
  };

  chain.window = function() {
    var api = {};

    api.href = function() {
      return this.addFutureAction('window.location.href', function($window, $document, done) {
        done(null, $window.location.href);
      });
    };

    api.path = function() {
      return this.addFutureAction('window.location.path', function($window, $document, done) {
        done(null, $window.location.pathname);
      });
    };

    api.search = function() {
      return this.addFutureAction('window.location.search', function($window, $document, done) {
        done(null, $window.location.search);
      });
    };

    api.hash = function() {
      return this.addFutureAction('window.location.hash', function($window, $document, done) {
        done(null, $window.location.hash.replace('#', ''));
      });
    };

    return api;
  };

  chain.location = function() {
    var api = {};

    api.url = function() {
      return this.addFutureAction('$location.url()', function($window, $document, done) {
        done(null, $document.injector().get('$location').url());
      });
    };

    api.path = function() {
      return this.addFutureAction('$location.path()', function($window, $document, done) {
        done(null, $document.injector().get('$location').path());
      });
    };

    api.search = function() {
      return this.addFutureAction('$location.search()', function($window, $document, done) {
        done(null, $document.injector().get('$location').search());
      });
    };

    api.hash = function() {
      return this.addFutureAction('$location.hash()', function($window, $document, done) {
        done(null, $document.injector().get('$location').hash());
      });
    };

    return api;
  };

  return function() {
    return chain;
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
 *    using(selector, label) scopes the next DSL element selection
 *
 * ex.
 *   using('#foo', "'Foo' text field").input('bar')
 */
angular.scenario.dsl('using', function() {
  return function(selector, label) {
    this.selector = _jQuery.trim((this.selector || '') + ' ' + selector);
    if (angular.isString(label) && label.length) {
      this.label = label + ' ( ' + this.selector + ' )';
    } else {
      this.label = this.selector;
    }
    return this.dsl;
  };
});

/**
 * Usage:
 *    binding(name) returns the value of the first matching binding
 */
angular.scenario.dsl('binding', function() {
  return function(name) {
    return this.addFutureAction("select binding '" + name + "'",
      function($window, $document, done) {
        var values = $document.elements().bindings($window.angular.element, name);
        if (!values.length) {
          return done("Binding selector '" + name + "' did not match.");
        }
        done(null, values[0]);
    });
  };
});

/**
 * Usage:
 *    input(name).enter(value) enters value in input with specified name
 *    input(name).check() checks checkbox
 *    input(name).select(value) selects the radio button with specified name/value
 *    input(name).val() returns the value of the input.
 */
angular.scenario.dsl('input', function() {
  var chain = {};
  var supportInputEvent = 'oninput' in document.createElement('div') && !(msie && msie <= 11);

  chain.enter = function(value, event) {
    return this.addFutureAction("input '" + this.name + "' enter '" + value + "'",
      function($window, $document, done) {
        var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':input');
        input.val(value);
        input.trigger(event || (supportInputEvent ? 'input' : 'change'));
        done();
    });
  };

  chain.check = function() {
    return this.addFutureAction("checkbox '" + this.name + "' toggle",
      function($window, $document, done) {
        var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':checkbox');
        input.trigger('click');
        done();
    });
  };

  chain.select = function(value) {
    return this.addFutureAction("radio button '" + this.name + "' toggle '" + value + "'",
      function($window, $document, done) {
        var input = $document.
          elements('[ng\\:model="$1"][value="$2"]', this.name, value).filter(':radio');
        input.trigger('click');
        done();
    });
  };

  chain.val = function() {
    return this.addFutureAction("return input val", function($window, $document, done) {
      var input = $document.elements('[ng\\:model="$1"]', this.name).filter(':input');
      done(null,input.val());
    });
  };

  return function(name) {
    this.name = name;
    return chain;
  };
});


/**
 * Usage:
 *    repeater('#products table', 'Product List').count() number of rows
 *    repeater('#products table', 'Product List').row(1) all bindings in row as an array
 *    repeater('#products table', 'Product List').column('product.name') all values across all rows
 *    in an array
 */
angular.scenario.dsl('repeater', function() {
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("repeater '" + this.label + "' count",
      function($window, $document, done) {
        try {
          done(null, $document.elements().length);
        } catch (e) {
          done(null, 0);
        }
    });
  };

  chain.column = function(binding) {
    return this.addFutureAction("repeater '" + this.label + "' column '" + binding + "'",
      function($window, $document, done) {
        done(null, $document.elements().bindings($window.angular.element, binding));
    });
  };

  chain.row = function(index) {
    return this.addFutureAction("repeater '" + this.label + "' row '" + index + "'",
      function($window, $document, done) {
        var matches = $document.elements().slice(index, index + 1);
        if (!matches.length) {
          return done('row ' + index + ' out of bounds');
        }
        done(null, matches.bindings($window.angular.element));
    });
  };

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});

/**
 * Usage:
 *    select(name).option('value') select one option
 *    select(name).options('value1', 'value2', ...) select options from a multi select
 */
angular.scenario.dsl('select', function() {
  var chain = {};

  chain.option = function(value) {
    return this.addFutureAction("select '" + this.name + "' option '" + value + "'",
      function($window, $document, done) {
        var select = $document.elements('select[ng\\:model="$1"]', this.name);
        var option = select.find('option[value="' + value + '"]');
        if (option.length) {
          select.val(value);
        } else {
          option = select.find('option').filter(function() {
            return _jQuery(this).text() === value;
          });
          if (!option.length) {
            option = select.find('option:contains("' + value + '")');
          }
          if (option.length) {
            select.val(option.val());
          } else {
              return done("option '" + value + "' not found");
          }
        }
        select.trigger('change');
        done();
    });
  };

  chain.options = function() {
    var values = arguments;
    return this.addFutureAction("select '" + this.name + "' options '" + values + "'",
      function($window, $document, done) {
        var select = $document.elements('select[multiple][ng\\:model="$1"]', this.name);
        select.val(values);
        select.trigger('change');
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
 *    element(selector, label).count() get the number of elements that match selector
 *    element(selector, label).click() clicks an element
 *    element(selector, label).mouseover() mouseover an element
 *    element(selector, label).mousedown() mousedown an element
 *    element(selector, label).mouseup() mouseup an element
 *    element(selector, label).query(fn) executes fn(selectedElements, done)
 *    element(selector, label).{method}() gets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(value) sets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(key) gets the value (as defined by jQuery, ex. attr)
 *    element(selector, label).{method}(key, value) sets the value (as defined by jQuery, ex. attr)
 */
angular.scenario.dsl('element', function() {
  var KEY_VALUE_METHODS = ['attr', 'css', 'prop'];
  var VALUE_METHODS = [
    'val', 'text', 'html', 'height', 'innerHeight', 'outerHeight', 'width',
    'innerWidth', 'outerWidth', 'position', 'scrollLeft', 'scrollTop', 'offset'
  ];
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("element '" + this.label + "' count",
      function($window, $document, done) {
        try {
          done(null, $document.elements().length);
        } catch (e) {
          done(null, 0);
        }
    });
  };

  chain.click = function() {
    return this.addFutureAction("element '" + this.label + "' click",
      function($window, $document, done) {
        var elements = $document.elements();
        var href = elements.attr('href');
        var eventProcessDefault = elements.trigger('click')[0];

        if (href && elements[0].nodeName.toLowerCase() === 'a' && eventProcessDefault) {
          this.application.navigateTo(href, function() {
            done();
          }, done);
        } else {
          done();
        }
    });
  };

  chain.dblclick = function() {
    return this.addFutureAction("element '" + this.label + "' dblclick",
      function($window, $document, done) {
        var elements = $document.elements();
        var href = elements.attr('href');
        var eventProcessDefault = elements.trigger('dblclick')[0];

        if (href && elements[0].nodeName.toLowerCase() === 'a' && eventProcessDefault) {
          this.application.navigateTo(href, function() {
            done();
          }, done);
        } else {
          done();
        }
    });
  };

  chain.mouseover = function() {
    return this.addFutureAction("element '" + this.label + "' mouseover",
      function($window, $document, done) {
        var elements = $document.elements();
        elements.trigger('mouseover');
        done();
    });
  };

  chain.mousedown = function() {
      return this.addFutureAction("element '" + this.label + "' mousedown",
        function($window, $document, done) {
          var elements = $document.elements();
          elements.trigger('mousedown');
          done();
      });
    };

  chain.mouseup = function() {
      return this.addFutureAction("element '" + this.label + "' mouseup",
        function($window, $document, done) {
          var elements = $document.elements();
          elements.trigger('mouseup');
          done();
      });
    };

  chain.query = function(fn) {
    return this.addFutureAction('element ' + this.label + ' custom query',
      function($window, $document, done) {
        fn.call(this, $document.elements(), done);
    });
  };

  angular.forEach(KEY_VALUE_METHODS, function(methodName) {
    chain[methodName] = function(name, value) {
      var args = arguments,
          futureName = (args.length == 1)
              ? "element '" + this.label + "' get " + methodName + " '" + name + "'"
              : "element '" + this.label + "' set " + methodName + " '" + name + "' to " + "'" +
                value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  angular.forEach(VALUE_METHODS, function(methodName) {
    chain[methodName] = function(value) {
      var args = arguments,
          futureName = (args.length === 0)
              ? "element '" + this.label + "' " + methodName
              : "element '" + this.label + "' set " + methodName + " to '" + value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});
