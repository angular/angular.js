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


function trigger(element, type) {
  var evnt = document.createEvent('MouseEvent');
  evnt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  (element[0] || element).dispatchEvent(evnt);
}

function sortedHtml(element) {
  var html = "";
  foreach(element, function toString(node) {
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
            attr.name !='style' &&
            attr.name.substr(0, 6) != 'jQuery') {
          // in IE we need to check for all of these.
          attrs.push(' ' + attr.name + '="' + attr.value + '"');
        }
      }
      attrs.sort();
      html += attrs.join('');
      if (node.style) {
        var style = [];
        if (node.style.cssText) {
          foreach(node.style.cssText.split(';'), function(value){
            value = trim(value);
            if (value) {
              style.push(value);
            }
          });
        }
        for(var css in node.style){
          var value = node.style[css];
          if (isString(value) && isString(css) && css != 'cssText' && value && (1*css != css)) {
            var text = css + ': ' + node.style[css];
            if (indexOf(style, text) == -1) {
              style.push(text);
            }
          }
        };
        style.sort();
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
