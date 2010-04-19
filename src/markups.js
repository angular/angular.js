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

angularTextMarkup('{{}}', function(text, textNode, parentElement) {
  var bindings = parseBindings(text),
      self = this;
  if (hasBindings(bindings)) {
    if (isLeafNode(parentElement[0])) {
      parentElement.attr('ng-bind-template', text);
    } else {
      var cursor = textNode, newElement;
      foreach(parseBindings(text), function(text){
        var exp = binding(text);
        if (exp) {
          newElement = self.element('span');
          newElement.attr('ng-bind', exp);
        } else {
          newElement = self.text(text);
        }
        cursor.after(newElement);
        cursor = newElement;
      });
    }
    textNode.remove();
  }
});

// TODO: this should be widget not a markup
angularTextMarkup('OPTION', function(text, textNode, parentElement){
  if (nodeName(parentElement) == "OPTION") {
    var select = document.createElement('select');
    select.insertBefore(parentElement[0].cloneNode(true), null);
    if (!select.innerHTML.match(/<option(\s.*\s|\s)value\s*=\s*.*>.*<\/\s*option\s*>/gi)) {
      parentElement.attr('value', text);
    }
  }
});

var NG_BIND_ATTR = 'ng-bind-attr';
angularAttrMarkup('{{}}', function(value, name, element){
  if (name.substr(0, 3) != 'ng-') {
    var bindings = parseBindings(value),
        bindAttr;
    if (hasBindings(bindings)) {
      element.removeAttr(name);
      bindAttr = fromJson(element.attr(NG_BIND_ATTR) || "{}");
      bindAttr[name] = value;
      element.attr(NG_BIND_ATTR, toJson(bindAttr));
    }
  }
});
