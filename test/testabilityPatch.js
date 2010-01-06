TestCase = function(name) { return jstestdriver.testCaseManager.TestCase(name); };

HIDDEN = jQuery.browser.msie ?
    '' :
    jQuery.browser.safari ?
         ' style="display: none; "' :
         ' style="display: none;"';

nglr.msie = jQuery.browser.msie;
nglr.alert = function(msg) {jstestdriver.console.log("ALERT: " + msg);};

function noop(){}

jstd = jstestdriver;

function html(content) {
  return jQuery("<div></div>").html(content);
}

function report(reportTest){
  $("#tests").children().each(function(i){
    var success = this.className == "pass";
    var strong = this.firstChild;
    var msg = strong.firstChild.nodeValue;
    var parts = msg.split(" module: ");
    var module = parts[0];
    var name = parts[1].replace(/ *$/, "");
    reportTest(success, module, name, this.nodeValue);
  });
}

MockUrlWatcher = function() {
  this.url = "http://server";
};
MockUrlWatcher.prototype.getUrl = function(){
  return this.url;
};
MockUrlWatcher.prototype.setUrl = function(url){
  this.url = url;
};

jQuery.fn.sortedHtml = function() {
  var html = "";
  var toString = function(index, node) {
    node = node || this;
    if (node.nodeName == "#text") {
      html += nglr.escapeHtml(node.nodeValue);
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
        toString(j, children[j]);
      }
      html += '</' + node.nodeName.toLowerCase() + '>';
    }
  };
  this.children().each(toString);
  return html;
};

function encode64(obj){
  return Base64.encode(nglr.toJson(obj));
}

function decode64(base64){
  return nglr.fromJson(Base64.decode(base64));
}

nglr.Loader.prototype.configureJQueryPlugins();

function assertHidden(node) {
  var display = node.css('display');
  assertEquals("Node should be hidden but vas visible: " + node.sortedHtml(), 'none', display);
}

function assertVisible(node) {
  var display = node.css('display');
  if (display == 'block') display = "";
  assertEquals("Node should be visible but vas hidden: " + node.sortedHtml(), '', display);
}

function assertJsonEquals(expected, actual) {
  assertEquals(nglr.toJson(expected), nglr.toJson(actual));
}

function assertUndefined(value) {
  assertEquals('undefined', typeof value);
}

function assertDefined(value) {
  assertTrue(nglr.toJson(value), !!value);
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