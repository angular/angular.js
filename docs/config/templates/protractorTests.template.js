describe("{$ doc.description $}", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;{% if doc['ng-app-included'] %}
    browser.rootEl = '[ng-app]';{% endif %}
    browser.get("{$ doc.pathPrefix $}/{$ doc.examplePath $}");
  });
  {% if doc['ng-app-included'] %}afterEach(function() { browser.rootEl = rootEl; });{% endif %}
{$ doc.innerTest $}
});
