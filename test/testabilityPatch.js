'use strict';

/**
 * Here is the problem: http://bugs.jquery.com/ticket/7292
 * basically jQuery treats change event on some browsers (IE) as a
 * special event and changes it form 'change' to 'click/keydown' and
 * few others. This horrible hack removes the special treatment
 */
_jQuery.event.special.change = undefined;


if (window.jstestdriver) {
  window.jstd = jstestdriver;
  window.dump = function dump() {
    var args = [];
    forEach(arguments, function(arg){
      if (isElement(arg)) {
        arg = sortedHtml(arg);
      } else if (isObject(arg)) {
        if (isFunction(arg.$eval) && isFunction(arg.$apply)) {
          arg = dumpScope(arg);
        } else {
          arg = toJson(arg, true);
        }
      }
      args.push(arg);
    });
    jstd.console.log.apply(jstd.console, args);
  };
}

function dumpScope(scope, offset) {
  offset = offset ||  '  ';
  var log = [offset + 'Scope(' + scope.$id + '): {'];
  for ( var key in scope ) {
    if (scope.hasOwnProperty(key) && !key.match(/^(\$|this)/)) {
      log.push('  ' + key + ': ' + toJson(scope[key]));
    }
  }
  var child = scope.$$childHead;
  while(child) {
    log.push(dumpScope(child, offset + '  '));
    child = child.$$nextSibling;
  }
  log.push('}');
  return log.join('\n' + offset);
}

beforeEach(function() {
  // This is to reset parsers global cache of expressions.
  compileCache = {};

  // workaround for IE bug https://plus.google.com/104744871076396904202/posts/Kqjuj6RSbbT
  // IE overwrite window.jQuery with undefined because of empty jQuery var statement, so we have to
  // correct this, but only if we are not running in jqLite mode
  if (!_jqLiteMode && _jQuery !== jQuery) {
    jQuery = _jQuery;
  }

  // This resets global id counter;
  uid = ['0', '0', '0'];

  // reset to jQuery or default to us.
  bindJQuery();
  jqLite(document.body).html('');

  this.addMatchers({
    toHaveClass: function(clazz) {
      this.message = function() {
        return "Expected '" + sortedHtml(this.actual) + "' to have class '" + clazz + "'.";
      };
      return this.actual.hasClass ?
              this.actual.hasClass(clazz) :
              jqLite(this.actual).hasClass(clazz);
    }
  });

  $logMock.log.logs = [];
  $logMock.warn.logs = [];
  $logMock.info.logs = [];
  $logMock.error.logs = [];

  resetAngularPublic()
});

function inject(){
  var blockFns = sliceArgs(arguments);
  return function(){
    var spec = this;
    angular.forEach(blockFns, function(fn){
      fn.$inject = inferInjectionArgs(fn);
      if (equals(fn.$inject, [])) {
        fn.apply(spec);
      } else if (equals(fn.$inject, ['service'])) {
        if (spec.$injector) {
          throw Error('$injector already created for this test');
        }
        if (!spec.$service) {
          spec.$service = function(name, fn) {
            if (fn) { spec.$service[name] = fn; }
            return spec.$service[name];
          }
          spec.$service.alias = function (name, alias) {
            spec.$service(alias, extend(function(x){ return x; }, {$inject:[name]}));
          };
          forEach(angularService, function(value, key){
            spec.$service(key, value);
          });
        }
        fn.call(spec, spec.$service);
      } else {
        if (!spec.$injector) {
          spec.$injector = angular.injector(spec.$service);
        }
        spec.$injector.invoke(spec, fn);
      }
    });
  };
}

/**
 * This method republishes the public angular API. It should probably be cleaned up somehow.
 * //TODO: remove this method and merge it with the angularPublic.js class
 */
function resetAngularPublic() {
  extend(angular, {
    'element': jqLite,
    'compile': compile,
    'copy': copy,
    'extend': extend,
    'equals': equals,
    'forEach': forEach,
    'noop': noop,
    'bind': bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity':identity,
    'injector': createInjector,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isArray': isArray
  });
}

resetAngularPublic();

afterEach(inject(function($rootScope) {
  // release the injector
  dealoc($rootScope);

  // check $log mock
  forEach(['error', 'warn', 'info', 'log'], function(logLevel) {
    if ($logMock[logLevel].logs.length) {
      forEach($logMock[logLevel].logs, function(log) {
        forEach(log, function deleteStack(logItem) {
          if (logItem instanceof Error) {
            dump(logItem.stack);
            delete logItem.stack;
            delete logItem.arguments;
          } else {
            dump(logItem);
          }
        });
      });

      throw new Error("Exprected $log." + logLevel + ".logs array to be empty. " +
        "Either a message was logged unexpectedly, or an expected log message was not checked " +
        "and removed. Array contents: " + toJson($logMock[logLevel].logs));
    }
  });

  clearJqCache();
}));

function clearJqCache() {
  var count = 0;
  forEachSorted(jqCache, function(value, key){
    count ++;
    delete jqCache[key];
    forEach(value, function(value, key){
      if (value.$element) {
        dump('LEAK', key, value.$id, sortedHtml(value.$element));
      } else {
        dump('LEAK', key, toJson(value));
      }
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
        if (i>0 && attributes[i] == attributes[i-1])
          continue; //IE9 creates dupes. Ignore them!

        var attr = attributes[i];
        if(attr.name.match(/^ng:/) ||
            attr.value &&
            attr.value !='null' &&
            attr.value !='auto' &&
            attr.value !='false' &&
            attr.value !='inherit' &&
            (attr.value !='0' || attr.name =='value') &&
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
          if (!/ng-\d+/.exec(attr.name) &&
              attr.name != 'getElementById' &&
              // IE7 has `selected` in attributes
              attr.name !='selected' &&
              // IE7 adds `value` attribute to all LI tags
              (node.nodeName != 'LI' || attr.name != 'value'))
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


// TODO(vojta): migrate these helpers into jasmine matchers
/**
 * This method is a cheap way of testing if css for a given node is not set to 'none'. It doesn't
 * actually test if an element is displayed by the browser. Be aware!!!
 */
function isCssVisible(node) {
  var display = node.css('display');
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

window.log = noop;
window.error = noop;

function rethrow(e) {
  if(e) {
    throw e;
  }
}
