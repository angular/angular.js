describe("{$ doc.description $}", function() {
  beforeEach(function() {
    browser.get("{$ doc.pathPrefix $}/{$ doc.examplePath $}");
  });

{$ doc.innerTest $}
});