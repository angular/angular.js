describe("{$ doc.description $}", function() {
  beforeEach(function() {

    browser.addMockModule('enable-binding-info', function() {
      angular.module('enable-binding-info', [])
        .config(['$compileProvider', function($compileProvider) {
          $compileProvider.enableBindingInfo();
        }]);
    });

    browser.get("{$ doc.pathPrefix $}/{$ doc.examplePath $}");
  });

{$ doc.innerTest $}
});
