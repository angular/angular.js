(function(){

  var angularJsUrl;
  var scripts = document.getElementsByTagName("script");
  var angularJsRegex = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/
  for(var j = 0; j < scripts.length; j++) {
    var src = scripts[j].src;
    if (src && src.match(angularJsRegex)) {
      angularJsUrl = src.replace('docs.angularjs.org', 'code.angularjs.org');
      continue;
    }
  }


  var HTML_TEMPLATE =
  '<!doctype html>\n' +
  '<html xmlns:ng="http://angularjs.org">\n' +
  ' <script src="' + angularJsUrl + '" ng:autobind></script>\n' +
  ' <body>\n' +
  '_HTML_SOURCE_\n' +
  ' </body>\n' +
  '</html>';

  angular.widget('doc:example', function(element){
    this.descend(true); //compile the example code
    element.hide();

    var example = element.find('doc\\:source').eq(0),
        exampleSrc = example.text(),
        scenario = element.find('doc\\:scenario').eq(0);

    var code = indent(exampleSrc);
    var tabHtml =
      '<ul class="doc-example">' +
        '<li class="doc-example-heading"><h3>Source</h3></li>' +
        '<li class="doc-example-source" ng:non-bindable>' +
          '<pre class="brush: js; html-script: true; highlight: [' +
          code.hilite + ']; toolbar: false;"></pre></li>' +
        '<li class="doc-example-heading"><h3>Live Preview</h3></li>' +
        '<li class="doc-example-live">' + exampleSrc +'</li>';
    if (scenario.text()) {
      tabHtml +=
        '<li class="doc-example-heading"><h3>Scenario Test</h3></li>' +
        '<li class="doc-example-scenario"><pre class="brush: js">' + scenario.text() + '</pre></li>';
    }
    tabHtml +=
      '</ul>';
    var tabs = angular.element(tabHtml);

    tabs.find('li.doc-example-source > pre').text(HTML_TEMPLATE.replace('_HTML_SOURCE_', code.html));

    element.html('');
    element.append(tabs);
    element.show();

    var script = (exampleSrc.match(/<script[^\>]*>([\s\S]*)<\/script>/) || [])[1] || '';
    try {
      eval(script);
    } catch (e) {
      alert(e);
    }
  });

  function indent(text) {
    if (!text) return text;
    var lines = text.split(/\n/);
    var lineNo = [];
    // remove any leading blank lines
    while (lines[0].match(/^\s*$/)) lines.shift();
    // remove any trailing blank lines
    while (lines[lines.length - 1].match(/^\s*$/)) lines.pop();
    var minIndent = 999;
    for ( var i = 0; i < lines.length; i++) {
      var line = lines[0];
      var indent = line.match(/^\s*/)[0];
      if (indent !== line && indent.length < minIndent) {
        minIndent = indent.length;
      }
    }

    for ( var i = 0; i < lines.length; i++) {
      lines[i] = '  ' + lines[i].substring(minIndent);
      lineNo.push(5 + i);
    }
    return {html: lines.join('\n'), hilite: lineNo.join(',') };
  };

})();
