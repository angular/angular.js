'use strict';

function $InterpolateProvider(){
  this.$get = ['$parse', function($parse){
    return function(text, templateOnly) {
      var bindings = parseBindings(text);
      if (hasBindings(bindings) || !templateOnly) {
        return compileBindTemplate(text);
      }
    };
  }];
}

var bindTemplateCache = {};
function compileBindTemplate(template){
  var fn = bindTemplateCache[template];
  if (!fn) {
    var bindings = [];
    forEach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp
        ? function(scope, element) { return scope.$eval(exp); }
        : function() { return text; });
    });
    bindTemplateCache[template] = fn = function(scope, element, prettyPrintJson) {
      var parts = [],
          hadOwnElement = scope.hasOwnProperty('$element'),
          oldElement = scope.$element;

      // TODO(misko): get rid of $element
      scope.$element = element;
      try {
        for (var i = 0; i < bindings.length; i++) {
          var value = bindings[i](scope, element);
          if (isElement(value))
            value = '';
          else if (isObject(value))
            value = toJson(value, prettyPrintJson);
          parts.push(value);
        }
        return parts.join('');
      } finally {
        if (hadOwnElement) {
          scope.$element = oldElement;
        } else {
          delete scope.$element;
        }
      }
    };
  }
  return fn;
}


function parseBindings(string) {
  var results = [];
  var lastIndex = 0;
  var index;
  while((index = string.indexOf('{{', lastIndex)) > -1) {
    if (lastIndex < index)
      results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;

    index = string.indexOf('}}', index);
    index = index < 0 ? string.length : index + 2;

    results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;
  }
  if (lastIndex != string.length)
    results.push(string.substr(lastIndex, string.length - lastIndex));
  return results.length === 0 ? [ string ] : results;
}

function binding(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
}

function hasBindings(bindings) {
  return bindings.length > 1 || binding(bindings[0]) !== null;
}
