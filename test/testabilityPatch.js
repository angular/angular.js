jstd = jstestdriver;
dump = bind(jstd.console, jstd.console.log);

function nakedExpect(obj) {
  return expect(angular.fromJson(angular.toJson(obj)));
}

function childNode(element, index) {
  return jqLite(element[0].childNodes[index]);
}

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'foreach': foreach,
  'noop':noop,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isNumber': isNumber,
  'isArray': isArray
});


function sortedHtml(element) {
  var html = "";
  (function toString(node) {
    if (node.nodeName == "#text") {
      html += escapeHtml(node.nodeValue);
    } else {
      html += '<' + node.nodeName.toLowerCase();
      var attributes = node.attributes || [];
      var attrs = [];
      for(var i=0; i<attributes.length; i++) {
        var attr = attributes[i];
        if(attr.name.match(/^ng-/) ||
            attr.value &&
            attr.value !='null' &&
            attr.value !='auto' &&
            attr.value !='false' &&
            attr.value !='inherit' &&
            attr.value !='0' &&
            attr.name !='loop' &&
            attr.name !='maxLength' &&
            attr.name !='size' &&
            attr.name !='start' &&
            attr.name !='tabIndex' &&
            attr.name.substr(0, 6) != 'jQuery') {
          // in IE we need to check for all of these.
          attrs.push(' ' + attr.name + '="' + attr.value + '"');
        }
      }
      attrs.sort();
      html += attrs.join('');
      html += '>';
      var children = node.childNodes;
      for(var j=0; j<children.length; j++) {
        toString(children[j]);
      }
      html += '</' + node.nodeName.toLowerCase() + '>';
    }
  })(element[0]);
  return html;
}

function isVisible(node) {
  var display = node.css('display');
  if (display == 'block') display = "";
  return display != 'none';
}

function assertHidden(node) {
  var display = node.css('display');
  assertFalse("Node should be hidden but vas visible: " + sortedHtml(node), isVisible(node));
}

function assertVisible(node) {
  assertTrue("Node should be visible but vas hidden: " + sortedHtml(node), isVisible(node));
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
