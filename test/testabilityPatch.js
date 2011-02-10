/**
 * Here is the problem: http://bugs.jquery.com/ticket/7292
 * basically jQuery treats change event on some browsers (IE) as a
 * special event and changes it form 'change' to 'click/keydown' and
 * few others. This horrible hack removes the special treatment
 */
_jQuery.event.special.change = undefined;


if (window.jstestdriver) {
  jstd = jstestdriver;
  window.dump = function(){
    var args = [];
    forEach(arguments, function(arg){
      if (isElement(arg)) {
        arg = sortedHtml(arg);
      } else if (isObject(arg)) {
        arg = toJson(arg, true);
      }
      args.push(arg);
    });
    jstd.console.log.apply(jstd.console, args);
  };
}

beforeEach(function(){
  // This is to reset parsers global cache of expressions.
  compileCache = {};
  // reset to jQuery or default to us.
  bindJQuery();
  jqLite(document.body).html('');
  this.addMatchers({
    toBeInvalid: function(){
      var element = jqLite(this.actual);
      var hasClass = element.hasClass('ng-validation-error');
      var validationError = element.attr('ng-validation-error');
      this.message = function(){
        if (!hasClass)
          return "Expected class 'ng-validation-error' not found.";
        return "Expected an error message, but none was found.";
      };
      return hasClass && validationError;
    },

    toBeValid: function(){
      var element = jqLite(this.actual);
      var hasClass = element.hasClass('ng-validation-error');
      this.message = function(){
        return "Expected to not have class 'ng-validation-error' but found.";
      };
      return !hasClass;
    },

    toEqualData: function(expected) {
      return equals(this.actual, expected);
    },

    toHaveClass: function(clazz) {
      this.message = function(){
        return "Expected '" + sortedHtml(this.actual) + "' to have class '" + clazz + "'.";
      };
      return this.actual.hasClass ?
              this.actual.hasClass(clazz) :
              jqLite(this.actual).hasClass(clazz);
    },

    toEqualError: function(message) {
      this.message = function() {
        var expected;
        if (this.actual.message && this.actual.name == 'Error') {
          expected = toJson(this.actual.message);
        } else {
          expected = toJson(this.actual);
        }
        return "Expected " + expected + " to be an Error with message " + toJson(message);
      };
      return this.actual.name == 'Error' && this.actual.message == message;
    },

    toMatchError: function(messageRegexp) {
      this.message = function() {
        var expected;
        if (this.actual.message && this.actual.name == 'Error') {
          expected = toJson(this.actual.message);
        } else {
          expected = toJson(this.actual);
        }
        return "Expected " + expected + " to match an Error with message " + toJson(messageRegexp);
      };
      return this.actual.name == 'Error' && messageRegexp.test(this.actual.message);
    }
  });

  $logMock.log.logs = [];
  $logMock.warn.logs = [];
  $logMock.info.logs = [];
  $logMock.error.logs = [];
});

afterEach(function() {
  // check $log mock
  forEach(['error', 'warn', 'info', 'log'], function(logLevel) {
    if ($logMock[logLevel].logs.length) {
      forEach($logMock[logLevel].logs, function(log) {
        forEach(log, function deleteStack(logItem) {
          if (logItem instanceof Error) delete logItem.stack;
        });
      });

      throw new Error("Exprected $log." + logLevel + ".logs array to be empty. " +
        "Either a message was logged unexpectedly, or an expected log message was not checked " +
        "and removed. Array contents: " + toJson($logMock[logLevel].logs));
    }
  });

  clearJqCache();
});

function clearJqCache(){
  var count = 0;
  forEachSorted(jqCache, function(value, key){
    count ++;
    delete jqCache[key];
    forEach(value, function(value, key){
      if (value.$element)
        dump(key, sortedHtml(value.$element));
      else
        dump(key, toJson(value));
    });
  });
  if (count) {
    fail('Found jqCache references that were not deallocated!');
  }
}

function nakedExpect(obj) {
  return expect(angular.fromJson(angular.toJson(obj)));
}

function childNode(element, index) {
  return jqLite(element[0].childNodes[index]);
}

function dealoc(obj) {
  if (obj) {
    var element = obj.$element || obj || {};
    if (element.nodeName) element = jqLite(element);
    if (element.dealoc) element.dealoc();
  }
}

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'equals': equals,
  'forEach': forEach,
  'noop':noop,
  'bind':bind,
  'toJson': toJson,
  'fromJson': fromJson,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isObject': isObject,
  'isNumber': isNumber,
  'isArray': isArray,
  'forEach': forEach
});


function sortedHtml(element, showNgClass) {
  var html = "";
  forEach(jqLite(element), function toString(node) {
    if (node.nodeName == "#text") {
      html += node.nodeValue.
        replace(/&(\w+[&;\W])?/g, function(match, entity){return entity?match:'&amp;';}).
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;');
    } else {
      html += '<' + (node.nodeName || '?NOT_A_NODE?').toLowerCase();
      var attributes = node.attributes || [];
      var attrs = [];
      var className = node.className || '';
      if (!showNgClass) {
        className = className.replace(/ng-[\w-]+\s*/g, '');
      }
      className = trim(className);
      if (className) {
        attrs.push(' class="' + className + '"');
      }
      for(var i=0; i<attributes.length; i++) {
        var attr = attributes[i];
        if(attr.name.match(/^ng:/) ||
            attr.value &&
            attr.value !='null' &&
            attr.value !='auto' &&
            attr.value !='false' &&
            attr.value !='inherit' &&
            attr.value !='0' &&
            attr.name !='loop' &&
            attr.name !='complete' &&
            attr.name !='maxLength' &&
            attr.name !='size' &&
            attr.name !='class' &&
            attr.name !='start' &&
            attr.name !='tabIndex' &&
            attr.name !='style' &&
            attr.name.substr(0, 6) != 'jQuery') {
          // in IE we need to check for all of these.
          if (!/ng-\d+/.exec(attr.name))
            attrs.push(' ' + attr.name + '="' + attr.value + '"');
        }
      }
      attrs.sort();
      html += attrs.join('');
      if (node.style) {
        var style = [];
        if (node.style.cssText) {
          forEach(node.style.cssText.split(';'), function(value){
            value = trim(value);
            if (value) {
              style.push(lowercase(value));
            }
          });
        }
        for(var css in node.style){
          var value = node.style[css];
          if (isString(value) && isString(css) && css != 'cssText' && value && (1*css != css)) {
            var text = lowercase(css + ': ' + value);
            if (value != 'false' && indexOf(style, text) == -1) {
              style.push(text);
            }
          }
        }
        style.sort();
        var tmp = style;
        style = [];
        forEach(tmp, function(value){
          if (!value.match(/^max[^\-]/))
            style.push(value);
        });
        if (style.length) {
          html += ' style="' + style.join('; ') + ';"';
        }
      }
      html += '>';
      var children = node.childNodes;
      for(var j=0; j<children.length; j++) {
        toString(children[j]);
      }
      html += '</' + node.nodeName.toLowerCase() + '>';
    }
  });
  return html;
}

function isCssVisible(node) {
  var display = node.css('display');
  if (display == 'block') display = "";
  return display != 'none';
}

function assertHidden(node) {
  assertFalse("Node should be hidden but vas visible: " + sortedHtml(node), isCssVisible(node));
}

function assertVisible(node) {
  assertTrue("Node should be visible but vas hidden: " + sortedHtml(node), isCssVisible(node));
}

function assertJsonEquals(expected, actual) {
  assertEquals(toJson(expected), toJson(actual));
}

function assertUndefined(value) {
  assertEquals('undefined', typeof value);
}

function assertDefined(value) {
  assertTrue(toJson(value), !!value);
}

function assertThrows(error, fn){
  var exception = null;
  try {
    fn();
  } catch(e) {
    exception = e;
  }
  if (!exception) {
    fail("Expecting exception, none thrown");
  }
  assertEquals(error, exception);
}

log = noop;
error = noop;

function rethrow(e) {
  if(e) {
    throw e;
  }
}
