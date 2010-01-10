// Copyright (C) 2009 BRAT Tech LLC


WidgetFactory = function(serverUrl, database) {
  this.nextUploadId = 0;
  this.serverUrl = serverUrl;
  this.database = database;
  if (window.swfobject) {
    this.createSWF = swfobject.createSWF;
  } else {
    this.createSWF = function(){
      alert("ERROR: swfobject not loaded!");
    };
  }
  this.onChangeListener = function(){};
};

WidgetFactory.prototype.createController = function(input, scope) {
  var controller;
  var type = input.attr('type').toLowerCase();
  var exp = input.attr('name');
  if (exp) exp = exp.split(':').pop();
  var event = "change";
  var bubbleEvent = true;
  if (type == 'button' || type == 'submit' || type == 'reset' || type == 'image') {
    controller = new ButtonController(input[0], exp);
    event = "click";
    bubbleEvent = false;
  } else if (type == 'text' || type == 'textarea' || type == 'hidden' || type == 'password') {
    controller = new TextController(input[0], exp);
    event = "keyup change";
  } else if (type == 'checkbox') {
    controller = new CheckboxController(input[0], exp);
    event = "click";
  } else if (type == 'radio') {
    controller = new RadioController(input[0], exp);
    event="click";
  } else if (type == 'select-one') {
    controller = new SelectController(input[0], exp);
  } else if (type == 'select-multiple') {
    controller = new MultiSelectController(input[0], exp);
  } else if (type == 'file') {
    controller = this.createFileController(input, exp);
  } else {
    throw 'Unknown type: ' + type;
  }
  input.data('controller', controller);
  var binder = scope.get('$binder');
  var action = function() {
    if (controller.updateModel(scope)) {
      var action = jQuery(controller.view).attr('ng-action') || "";
      if (scope.evalWidget(controller, action)) {
        binder.updateView(scope);
      }
    }
    return bubbleEvent;
  };
  jQuery(controller.view, ":input").
    bind(event, action);
  return controller;
};

WidgetFactory.prototype.createFileController = function(fileInput) {
  var uploadId = '__uploadWidget_' + (this.nextUploadId++);
  var view = FileController.template(uploadId);
  fileInput.after(view);
  var att = {
      data:this.serverUrl + "/admin/ServerAPI.swf",
      width:"95", height:"20", align:"top",
      wmode:"transparent"};
  var par = {
      flashvars:"uploadWidgetId=" + uploadId,
      allowScriptAccess:"always"};
  var swfNode = this.createSWF(att, par, uploadId);
  fileInput.remove();
  var cntl = new FileController(view, fileInput[0].name, swfNode, this.serverUrl + "/data/" + this.database);
  jQuery(swfNode).data('controller', cntl);
  return cntl;
};

WidgetFactory.prototype.createTextWidget = function(textInput) {
  var controller = new TextController(textInput);
  controller.onChange(this.onChangeListener);
  return controller;
};

/////////////////////
// FileController
///////////////////////

FileController = function(view, scopeName, uploader, databaseUrl) {
  this.view = view;
  this.uploader = uploader;
  this.scopeName = scopeName;
  this.attachmentsPath = databaseUrl + '/_attachments';
  this.value = null;
  this.lastValue = undefined;
};

FileController.dispatchEvent = function(id, event, args) {
  var object = document.getElementById(id);
  var controller = jQuery(object).data("controller");
  FileController.prototype['_on_' + event].apply(controller, args);
};

FileController.template = function(id) {
  return jQuery('<span class="ng-upload-widget">' +
      '<input type="checkbox" ng-non-bindable="true"/>' +
      '<object id="' + id + '" />' +
      '<a></a>' +
      '<span/>' +
    '</span>');
};

FileController.prototype._on_cancel = function() {
};

FileController.prototype._on_complete = function() {
};

FileController.prototype._on_httpStatus = function(status) {
  alert("httpStatus:" + this.scopeName + " status:" + status);
};

FileController.prototype._on_ioError = function() {
  alert("ioError:" + this.scopeName);
};

FileController.prototype._on_open = function() {
  alert("open:" + this.scopeName);
};

FileController.prototype._on_progress = function(bytesLoaded, bytesTotal) {
};

FileController.prototype._on_securityError = function() {
  alert("securityError:" + this.scopeName);
};

FileController.prototype._on_uploadCompleteData = function(data) {
  var value = fromJson(data);
  value.url = this.attachmentsPath + '/' + value.id + '/' + value.text;
  this.view.find("input").attr('checked', true);
  var scope = this.view.scope();
  this.value = value;
  this.updateModel(scope);
  this.value = null;
  scope.get('$binder').updateView();
};

FileController.prototype._on_select = function(name, size, type) {
  this.name = name;
  this.view.find("a").text(name).attr('href', name);
  this.view.find("span").text(angular['filter']['bytes'](size));
  this.upload();
};

FileController.prototype.updateModel = function(scope) {
  var isChecked = this.view.find("input").attr('checked');
  var value = isChecked ? this.value : null;
  if (this.lastValue === value) {
    return false;
  } else {
    scope.set(this.scopeName, value);
    return true;
  }
};

FileController.prototype.updateView = function(scope) {
  var modelValue = scope.get(this.scopeName);
  if (modelValue && this.value !== modelValue) {
    this.value = modelValue;
    this.view.find("a").
      attr("href", this.value.url).
      text(this.value.text);
    this.view.find("span").text(angular['filter']['bytes'](this.value.size));
  }
  this.view.find("input").attr('checked', !!modelValue);
};

FileController.prototype.upload = function() {
  if (this.name) {
    this.uploader.uploadFile(this.attachmentsPath);
  }
};


///////////////////////
// NullController
///////////////////////
NullController = function(view) {this.view = view;};
NullController.prototype.updateModel = function() { return true; };
NullController.prototype.updateView = function() { };
NullController.instance = new NullController();


///////////////////////
// ButtonController
///////////////////////
ButtonController = function(view) {this.view = view;};
ButtonController.prototype.updateModel = function(scope) { return true; };
ButtonController.prototype.updateView = function(scope) {};

///////////////////////
// TextController
///////////////////////
TextController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.validator = view.getAttribute('ng-validate');
  this.required = typeof view.attributes['ng-required'] != "undefined";
  this.lastErrorText = null;
  this.lastValue = undefined;
  this.initialValue = view.value;
  var widget = view.getAttribute('ng-widget');
  if (widget === 'datepicker') {
    jQuery(view).datepicker();
  }
};

TextController.prototype.updateModel = function(scope) {
  var value = this.view.value;
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

TextController.prototype.updateView = function(scope) {
  var view = this.view;
  var value = scope.get(this.exp);
  if (typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  value = value ? value : '';
  if (this.lastValue != value) {
    view.value = value;
    this.lastValue = value;
  }
  var isValidationError = false;
  view.removeAttribute('ng-error');
  if (this.required) {
    isValidationError = !(value && value.length > 0);
  }
  var errorText = isValidationError ? "Required Value" : null;
  if (!isValidationError && this.validator && value) {
    errorText = scope.validate(this.validator, value);
    isValidationError = !!errorText;
  }
  if (this.lastErrorText !== errorText) {
    this.lastErrorText = isValidationError;
    if (errorText !== null) {
      view.setAttribute('ng-error', errorText);
      scope.markInvalid(this);
    }
    jQuery(view).toggleClass('ng-validation-error', isValidationError);
  }
};

///////////////////////
// CheckboxController
///////////////////////
CheckboxController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.checked ? view.value : "";
};

CheckboxController.prototype.updateModel = function(scope) {
  var input = this.view;
  var value = input.checked ? input.value : '';
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

CheckboxController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.eval(this.exp);
  if (typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  input.checked = input.value == (''+value);
};

///////////////////////
// SelectController
///////////////////////
SelectController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.value;
};

SelectController.prototype.updateModel = function(scope) {
  var input = this.view;
  if (input.selectedIndex < 0) {
    scope.setEval(this.exp, null);
  } else {
    var value = this.view.value;
    if (this.lastValue === value) {
      return false;
    } else {
      scope.setEval(this.exp, value);
      this.lastValue = value;
      return true;
    }
  }
};

SelectController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.get(this.exp);
  if (typeof value === 'undefined') {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  if (value !== this.lastValue) {
    input.value = value ? value : "";
    this.lastValue = value;
  }
};

///////////////////////
// MultiSelectController
///////////////////////
MultiSelectController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = this.selected();
};

MultiSelectController.prototype.selected = function () {
  var value = [];
  var options = this.view.options;
  for ( var i = 0; i < options.length; i++) {
    var option = options[i];
    if (option.selected) {
      value.push(option.value);
    }
  }
  return value;
};

MultiSelectController.prototype.updateModel = function(scope) {
  var value = this.selected();
  // TODO: This is wrong! no caching going on here as we are always comparing arrays
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

MultiSelectController.prototype.updateView = function(scope) {
  var input = this.view;
  var selected = scope.get(this.exp);
  if (typeof selected === "undefined") {
    selected = this.initialValue;
    scope.setEval(this.exp, selected);
  }
  if (selected !== this.lastValue) {
    var options = input.options;
    for ( var i = 0; i < options.length; i++) {
      var option = options[i];
      option.selected = _.include(selected, option.value);
    }
    this.lastValue = selected;
  }
};

///////////////////////
// RadioController
///////////////////////
RadioController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastChecked = undefined;
  this.lastValue = undefined;
  this.inputValue = view.value;
  this.initialValue = view.checked ? view.value : null;
};

RadioController.prototype.updateModel = function(scope) {
  var input = this.view;
  if (this.lastChecked) {
    return false;
  } else {
    input.checked = true;
    this.lastValue = scope.setEval(this.exp, this.inputValue);
    this.lastChecked = true;
    return true;
  }
};

RadioController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.get(this.exp);
  if (this.initialValue && typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  if (this.lastValue != value) {
    this.lastChecked = input.checked = this.inputValue == (''+value);
    this.lastValue = value;
  }
};

///////////////////////
//ElementController
///////////////////////
BindUpdater = function(view, exp) {
  this.view = view;
  this.exp = Binder.parseBindings(exp);
  this.hasError = false;
  this.scopeSelf = {element:view};
};

BindUpdater.toText = function(obj) {
  var e = escapeHtml;
  switch(typeof obj) {
    case "string":
    case "boolean":
    case "number":
      return e(obj);
    case "function":
      return BindUpdater.toText(obj());
    case "object":
      if (isNode(obj)) {
        return outerHTML(obj);
      } else if (obj instanceof angular.filter.Meta) {
        switch(typeof obj.html) {
          case "string":
          case "number":
            return obj.html;
          case "function":
            return obj.html();
          case "object":
            if (isNode(obj.html))
              return outerHTML(obj.html);
          default:
            break;
        }
        switch(typeof obj.text) {
          case "string":
          case "number":
            return e(obj.text);
          case "function":
            return e(obj.text());
          default:
            break;
        }
      }
      if (obj === null)
        return "";
      return e(toJson(obj, true));
    default:
      return "";
  }
};

BindUpdater.prototype.updateModel = function(scope) {};
BindUpdater.prototype.updateView = function(scope) {
  var html = [];
  var parts = this.exp;
  var length = parts.length;
  for(var i=0; i<length; i++) {
    var part = parts[i];
    var binding = Binder.binding(part);
    if (binding) {
      scope.evalWidget(this, binding, this.scopeSelf, function(value){
        html.push(BindUpdater.toText(value));
      }, function(e, text){
        setHtml(this.view, text);
      });
      if (this.hasError) {
        return;
      }
    } else {
      html.push(escapeHtml(part));
    }
  }
  setHtml(this.view, html.join(''));
};

BindAttrUpdater = function(view, attrs) {
  this.view = view;
  this.attrs = attrs;
};

BindAttrUpdater.prototype.updateModel = function(scope) {};
BindAttrUpdater.prototype.updateView = function(scope) {
  var jNode = jQuery(this.view);
  var attributeTemplates = this.attrs;
  if (this.hasError) {
    this.hasError = false;
    jNode.
      removeClass('ng-exception').
      removeAttr('ng-error');
  }
  var isImage = jNode.is('img');
  for (var attrName in attributeTemplates) {
    var attributeTemplate = Binder.parseBindings(attributeTemplates[attrName]);
    var attrValues = [];
    for ( var i = 0; i < attributeTemplate.length; i++) {
      var binding = Binder.binding(attributeTemplate[i]);
      if (binding) {
        try {
          var value = scope.eval(binding, {element:jNode[0], attrName:attrName});
          if (value && (value.constructor !== array || value.length !== 0))
            attrValues.push(value);
        } catch (e) {
          this.hasError = true;
          console.error('BindAttrUpdater', e);
          var jsonError = toJson(e, true);
          attrValues.push('[' + jsonError + ']');
          jNode.
            addClass('ng-exception').
            attr('ng-error', jsonError);
        }
      } else {
        attrValues.push(attributeTemplate[i]);
      }
    }
    var attrValue = attrValues.length ? attrValues.join('') : null;
    if(isImage && attrName == 'src' && !attrValue)
      attrValue = scope.get('config.server') + '/images/blank.gif';
    jNode.attr(attrName, attrValue);
  }
};

EvalUpdater = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.hasError = false;
};
EvalUpdater.prototype.updateModel = function(scope) {};
EvalUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp);
};

HideUpdater = function(view, exp) { this.view = view; this.exp = exp; };
HideUpdater.prototype.updateModel = function(scope) {};
HideUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(hideValue){
    var view = jQuery(this.view);
    if (toBoolean(hideValue)) {
      view.hide();
    } else {
      view.show();
    }
  });
};

ShowUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ShowUpdater.prototype.updateModel = function(scope) {};
ShowUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(hideValue){
    var view = jQuery(this.view);
    if (toBoolean(hideValue)) {
      view.show();
    } else {
      view.hide();
    }
  });
};

ClassUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassUpdater.prototype.updateModel = function(scope) {};
ClassUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    if (classValue !== null && classValue !== undefined) {
      this.view.className = classValue;
    }
  });
};

ClassEvenUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassEvenUpdater.prototype.updateModel = function(scope) {};
ClassEvenUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    var index = scope.get('$index');
    jQuery(this.view).toggleClass(classValue, index % 2 === 1);
  });
};

ClassOddUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassOddUpdater.prototype.updateModel = function(scope) {};
ClassOddUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    var index = scope.get('$index');
    jQuery(this.view).toggleClass(classValue, index % 2 === 0);
  });
};

StyleUpdater = function(view, exp) { this.view = view; this.exp = exp; };
StyleUpdater.prototype.updateModel = function(scope) {};
StyleUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(styleValue){
    jQuery(this.view).attr('style', "").css(styleValue);
  });
};

///////////////////////
// RepeaterUpdater
///////////////////////
RepeaterUpdater = function(view, repeaterExpression, template, prefix) {
  this.view = view;
  this.template = template;
  this.prefix = prefix;
  this.children = [];
  var match = repeaterExpression.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
  if (! match) {
    throw "Expected ng-repeat in form of 'item in collection' but got '" +
      repeaterExpression + "'.";
  }
  var keyValue = match[1];
  this.iteratorExp = match[2];
  match = keyValue.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
  if (!match) {
    throw "'item' in 'item in collection' should be identifier or (key, value) but get '" +
      keyValue + "'.";
  }
  this.valueExp = match[3] || match[1];
  this.keyExp = match[2];
};

RepeaterUpdater.prototype.updateModel = function(scope) {};
RepeaterUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.iteratorExp, {}, function(iterator){
    var self = this;
    if (!iterator) {
      iterator = [];
      if (scope.isProperty(this.iteratorExp)) {
        scope.set(this.iteratorExp, iterator);
      }
    }
    var iteratorLength = iterator.length;
    var childrenLength = this.children.length;
    var cursor = this.view;
    var time = 0;
    var child = null;
    var keyExp = this.keyExp;
    var valueExp = this.valueExp;
    var i = 0;
    jQuery.each(iterator, function(key, value){
      if (i < childrenLength) {
        // reuse children
        child = self.children[i];
        child.scope.set(valueExp, value);
      } else {
        // grow children
        var name = self.prefix +
          valueExp + " in " + self.iteratorExp + "[" + i + "]";
        var childScope = new Scope(scope.state, name);
        childScope.set('$index', i);
        if (keyExp)
          childScope.set(keyExp, key);
        childScope.set(valueExp, value);
        child = { scope:childScope, element:self.template(childScope, self.prefix, i) };
        cursor.after(child.element);
        self.children.push(child);
      }
      cursor = child.element;
      var s = new Date().getTime();
      child.scope.updateView();
      time += new Date().getTime() - s;
      i++;
    });
    // shrink children
    for ( var r = childrenLength; r > iteratorLength; --r) {
      var unneeded = this.children.pop().element[0];
      unneeded.parentNode.removeChild(unneeded);
    }
    // Special case for option in select
    if (child && child.element[0].nodeName === "OPTION") {
      var select = jQuery(child.element[0].parentNode);
      var cntl = select.data('controller');
      if (cntl) {
        cntl.lastValue = undefined;
        cntl.updateView(scope);
      }
    }
  });
};

//////////////////////////////////
// PopUp
//////////////////////////////////

PopUp = function(doc) {
  this.doc = doc;
};

PopUp.OUT_EVENT = "mouseleave mouseout click dblclick keypress keyup";

PopUp.prototype.bind = function () {
  var self = this;
  this.doc.find('.ng-validation-error,.ng-exception').
    live("mouseover", PopUp.onOver);
};

PopUp.onOver = function(e) {
  PopUp.onOut();
  var jNode = jQuery(this);
  jNode.bind(PopUp.OUT_EVENT, PopUp.onOut);
  var position = jNode.position();
  var de = document.documentElement;
  var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  var hasArea = w - position.left;
  var width = 300;
  var title = jNode.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...";
  var msg = jNode.attr("ng-error");

  var x;
  var arrowPos = hasArea>(width+75) ? "left" : "right";
  var tip = jQuery(
    "<div id='ng-callout' style='width:"+width+"px'>" +
      "<div class='ng-arrow-"+arrowPos+"'/>" +
      "<div class='ng-title'>"+title+"</div>" +
      "<div class='ng-content'>"+msg+"</div>" +
    "</div>");
  jQuery("body").append(tip);
  if(arrowPos === 'left'){
    x = position.left + this.offsetWidth + 11;
  }else{
    x = position.left - (width + 15);
    tip.find('.ng-arrow-right').css({left:width+1});
  }

  tip.css({left: x+"px", top: (position.top - 3)+"px"});
  return true;
};

PopUp.onOut = function() {
  jQuery('#ng-callout').
    unbind(PopUp.OUT_EVENT, PopUp.onOut).
    remove();
  return true;
};

//////////////////////////////////
// Status
//////////////////////////////////


Status = function(body) {
  this.loader = body.append(Status.DOM).find("#ng-loading");
  this.requestCount = 0;
};

Status.DOM ='<div id="ng-spacer"></div><div id="ng-loading">loading....</div>';

Status.prototype.beginRequest = function () {
  if (this.requestCount === 0) {
    this.loader.show();
  }
  this.requestCount++;
};

Status.prototype.endRequest = function () {
  this.requestCount--;
  if (this.requestCount === 0) {
    this.loader.hide("fold");
  }
};
