(function(){

  var angularJsUrl;
  var scripts = document.getElementsByTagName("script");
  var angularJsRegex = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/;
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

    var example = element.find('pre.doc-source').eq(0),
        exampleSrc = example.text(),
        scenario = element.find('pre.doc-scenario').eq(0);

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
    var lines = text.split(/\r?\n/);
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

  var HTML_TPL =
      '<a ng:init="showInstructions = {show}" ng:show="!showInstructions" ng:click="showInstructions = true" href>Show Instructions</a>' +
      '<div ng:controller="TutorialInstructionsCtrl" ng:show="showInstructions">' +
        '<div class="tabs-nav">' +
          '<ul>' +
          '</ul>' +
        '</div>' +
        '<div class="tabs-content"><div class="tabs-content-inner">' +

        '</div></div>' +
      '</div>';

  var HTML_NAV = '<li ng:class="currentCls(\'{id}\')"><a ng:click="select(\'{id}\')" href>{title}</a></li>';
  var HTML_CONTENT = '<div ng:show="selected==\'{id}\'">{content}</div>';

  var DEFAULT_NAV =
    '<li ng:class="currentCls(\'git-mac\')"><a ng:click="select(\'git-mac\')" href>Git on Mac/Linux</a></li>' +
    '<li ng:class="currentCls(\'git-win\')"><a ng:click="select(\'git-win\')" href>Git on Windows</a></li>' +
    '<li ng:class="currentCls(\'ss-mac\')"><a ng:click="select(\'ss-mac\')" href>Snapshots on Mac/Linux</a></li>' +
    '<li ng:class="currentCls(\'ss-win\')"><a ng:click="select(\'ss-win\')" href>Snapshots on Windows</a></li>';

  var DEFAULT_CONTENT =
    '<div ng:show="selected==\'git-mac\'">' +
      '<ol>' +
      '<li><p>Reset the workspace to step {step}.</p>' +
      '<pre><code> git checkout -f step-{step}</code></pre></li>' +
      '<li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-{step}/app">anglar\'s server</a>.</p></li>' +
      '</ol>' +
    '</div>' +

    '<div ng:show="selected==\'git-win\'">' +
      '<ol>' +
      '<li><p>Reset the workspace to step {step}.</p>' +
      '<pre><code> git checkout -f step-{step}</code></pre></li>' +
      '<li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-{step}/app">anglar\'s server</a>.</p></li>' +
      '</ol>' +
    '</div>' +

    '<div ng:show="selected==\'ss-mac\'">' +
      '<ol>' +
      '<li><p>Reset the workspace to step {step}.</p>' +
      '<pre><code> ./goto_step.sh {step}</code></pre></li>' +
      '<li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-{step}/app">anglar\'s server</a>.</p></li>' +
      '</ol>' +
    '</div>' +

    '<div ng:show="selected==\'ss-win\'">' +
      '<ol>' +
      '<li><p>Reset the workspace to step {step}.</p>' +
      '<pre><code> ./goto_step.bat {step}</code></pre></li>' +
      '<li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-{step}/app">anglar\'s server</a>.</p></li>' +
      '</ol>' +
    '</div>';

  angular.widget('doc:tutorial-instructions', function(element) {
    element.hide();
    this.descend(true);

    var tabs = angular.element(HTML_TPL.replace('{show}', element.attr('show') || 'false')),
        nav = tabs.find('.tabs-nav ul'),
        content = tabs.find('.tabs-content-inner'),
        children = element.children();

    if (children.length) {
      // load custom content
      angular.forEach(element.children(), function(elm) {
        var elm = angular.element(elm),
            id = elm.attr('id');

        nav.append(HTML_NAV.replace('{title}', elm.attr('title')).replace(/\{id\}/g, id));
        content.append(HTML_CONTENT.replace('{id}', id).replace('{content}', elm.html()));
      });
    } else {
      // default
      nav.append(DEFAULT_NAV);
      content.append(DEFAULT_CONTENT.replace(/\{step\}/g, element.attr('step')));
    }

    element.html('');
    element.append(tabs);
    element.show();
  });
})();
