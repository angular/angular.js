'use strict';

/**
 * Here is the problem: http://bugs.jquery.com/ticket/7292
 * basically jQuery treats change event on some browsers (IE) as a
 * special event and changes it form 'change' to 'click/keydown' and
 * few others. This horrible hack removes the special treatment
 */
_jQuery.event.special.change = undefined;


publishExternalAPI(angular);
bindJQuery();
beforeEach(function() {
  publishExternalAPI(angular);

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
});

afterEach(function() {
  if (this.$injector) {
    var $rootScope = this.$injector.get('$rootScope');
    var $log = this.$injector.get('$log');
    // release the injector
    dealoc($rootScope);

    // check $log mock
    $log.assertEmpty && $log.assertEmpty();
  }

  // complain about uncleared jqCache references
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
});


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
/**a
 * This method is a cheap way of testing if css for a given node is not set to 'none'. It doesn't
 * actually test if an element is displayed by the browser. Be aware!!!
 */
function isCssVisible(node) {
  var display = node.css('display');
  return display != 'none';
}

function assertHidden(node) {
  if (isCssVisible(node)) {
    throw new Error('Node should be hidden but was visible: ' + angular.module.ngMock.dump(node));
  }
}

function assertVisible(node) {
  if (!isCssVisible(node)) {
    throw new Error('Node should be visible but was hidden: ' + angular.module.ngMock.dump(node));
  }
}

