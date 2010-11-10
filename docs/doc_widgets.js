(function(){
  var HTML_TEMPLATE =
  '<!DOCTYPE HTML>\n' +
  '<html xmlns:ng="http://angularjs.org">\n' +
  '  <head>\n' +
  '    <title>Angular Example</title>\n' +
  '    <script type="text/javascript"\n' +
  '         src="../angular.js" ng:autobind></script>\n' +
  '  </head>\n' +
  '  <body>\n' +
  '_HTML_SOURCE_\n' +
  '  </body>\n' +
  '</html>';

  angular.widget('doc:example', function(element){
    this.descend(true); //compile the example code
    element.hide();

    var example = element.find('doc\\:source').eq(0),
        exampleSrc = example.text(),
        scenario = element.find('doc\\:scenario').eq(0);

    var tabs = angular.element(
        '<ul class="doc-example">' +
          '<li class="doc-example-heading"><h3>Source</h3></li>' +
          '<li class="doc-example-source" ng:non-bindable><pre class="brush: js; brush: xml;"></pre></li>' +
          '<li class="doc-example-heading"><h3>Live Preview</h3></li>' +
          '<li class="doc-example-live">' + exampleSrc +'</li>' +
          '<li class="doc-example-heading"><h3>Scenario Test</h3></li>' +
          '<li class="doc-example-scenario"><pre class="brush: js">' + scenario.text() + '</pre></li>' +
        '</ul>');
    tabs.find('li.doc-example-source > pre').text(exampleSrc);

    element.html('');
    element.append(tabs);
    element.show();

    var script = (exampleSrc.match(/<script[^\>]*>([\s\S]*)<\/script>/) || [])[1] || '';
    try {
      eval(script);
    } catch (e) {
      alert(e);
    }

    return function() {
      SyntaxHighlighter.highlight();
    };
  });
})();