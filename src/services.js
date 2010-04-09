angularService("$window", bind(window, identity, window));
angularService("$document", function(window){
  return jqLite(window.document);
}, {inject:['$window']});

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.]*)(:([0-9]+))?([^\?#]+)(\?([^#]*))?((#([^\?]*))?(\?([^\?]*))?)$/;
var DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};
angularService("$location", function(browser){
  var scope = this, location = {parse:parse, toString:toString};
  var lastHash;
  function parse(url){
    if (isDefined(url)) {
      var match = URL_MATCH.exec(url);
      if (match) {
        location.href = url;
        location.protocol = match[1];
        location.host = match[3] || '';
        location.port = match[5] || DEFAULT_PORTS[location.href] || null;
        location.path = match[6];
        location.search = parseKeyValue(match[8]);
        location.hash = match[9];
        if (location.hash)
          location.hash = location.hash.substr(1);
        lastHash = location.hash;
        location.hashPath = match[11] || '';
        location.hashSearch = parseKeyValue(match[13]);
      }
    }
  }
  function toString() {
    if (lastHash === location.hash) {
      var hashKeyValue = toKeyValue(location.hashSearch),
          hash = (location.hashPath ? location.hashPath : '') + (hashKeyValue ? '?' + hashKeyValue : ''),
          url = location.href.split('#')[0] + '#' + (hash ? hash : '');
      if (url !== location.href) parse(url);
      return url;
    } else {
      parse(location.href.split('#')[0] + '#' + location.hash);
      return toString();
    }
  }
  browser.watchUrl(function(url){
    parse(url);
    scope.$root.$eval();
  });
  parse(browser.getUrl());
  this.$onEval(PRIORITY_LAST, function(){
    browser.setUrl(toString());
  });
  return location;
}, {inject: ['$browser']});

angularService("$hover", function(browser) {
  var tooltip, self = this, error, width = 300, arrowWidth = 10;
  browser.hover(function(element, show){
    if (show && (error = element.attr(NG_EXCEPTION) || element.attr(NG_VALIDATION_ERROR))) {
      if (!tooltip) {
        tooltip = {
            callout: jqLite('<div id="ng-callout"></div>'),
            arrow: jqLite('<div></div>'),
            title: jqLite('<div class="ng-title"></div>'),
            content: jqLite('<div class="ng-content"></div>')
        };
        tooltip.callout.append(tooltip.arrow);
        tooltip.callout.append(tooltip.title);
        tooltip.callout.append(tooltip.content);
        self.$browser.body.append(tooltip.callout);
      }
      var docRect = self.$browser.body[0].getBoundingClientRect(),
          elementRect = element[0].getBoundingClientRect(),
          leftSpace = docRect.right - elementRect.right - arrowWidth;
      tooltip.title.text(element.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...");
      tooltip.content.text(error);
      if (leftSpace < width) {
        tooltip.arrow.addClass('ng-arrow-right');
        tooltip.arrow.css({left: (width + 1)+'px'});
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.left - arrowWidth - width - 4) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      } else {
        tooltip.arrow.addClass('ng-arrow-left');
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.right + arrowWidth) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      }
    } else if (tooltip) {
      tooltip.callout.remove();
      tooltip = null;
    }
  });
}, {inject:['$browser']});

angularService("$invalidWidgets", function(){
  var invalidWidgets = [];
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };
  invalidWidgets.visible = function() {
    var count = 0;
    foreach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };
  return invalidWidgets;
});
