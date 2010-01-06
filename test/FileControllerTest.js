FileControllerTest = TestCase('FileControllerTest');

FileControllerTest.prototype.testOnSelectUpdateView = function(){
  var view = jQuery('<span><a/><span/></span>');
  var swf = {};
  var controller = new nglr.FileController(view, null, swf);
  swf.uploadFile = function(path){};
  controller._on_select('A', 9, '9 bytes');
  assertEquals(view.find('a').text(), "A");
  assertEquals(view.find('span').text(), "9 bytes");
};

FileControllerTest.prototype.testUpdateModelView = function(){
  var view = nglr.FileController.template('');
  var input = $('<input name="value.input">');
  var controller;
  var scope = new nglr.Scope({value:{}, $binder:{updateView:function(){
      controller.updateView(scope);
    }}});
  view.data('scope', scope);
  controller = new nglr.FileController(view, 'value.input', null, "http://server_base");
  var value = '{"text":"A", "size":123, "id":"890"}';
  controller._on_uploadCompleteData(value);
  controller.updateView(scope);
  assertEquals(scope.get('value.input.text'), 'A');
  assertEquals(scope.get('value.input.size'), 123);
  assertEquals(scope.get('value.input.id'), '890');
  assertEquals(scope.get('value.input.url'), 'http://server_base/_attachments/890/A');
  assertEquals(view.find('a').text(), "A");
  assertEquals(view.find('a').attr('href'), "http://server_base/_attachments/890/A");
  assertEquals(view.find('span').text(), "123 bytes");
};

FileControllerTest.prototype.testFileUpload = function(){
  expectAsserts(1);
  var swf = {};
  var controller = new nglr.FileController(null, null, swf, "http://server_base");
  swf.uploadFile = function(path){
    assertEquals("http://server_base/_attachments", path);
  };
  controller.name = "Name";
  controller.upload();
};

FileControllerTest.prototype.testFileUploadNoFileIsNoop = function(){
  expectAsserts(0);
  var swf = {uploadFile:function(path){
    fail();
  }};
  var controller = new nglr.FileController(null, swf);
  controller.upload("basePath", null);
};

FileControllerTest.prototype.testRemoveAttachment = function(){
  var doc = nglr.FileController.template();
  var input = $('<input name="file">');
  var scope = new nglr.Scope();
  input.data('scope', scope);
  var controller = new nglr.FileController(doc, 'file', null, null);
  controller.updateView(scope);
  assertEquals(false, doc.find('input').attr('checked'));

  scope.set('file', {url:'url', size:123});
  controller.updateView(scope);
  assertEquals(true, doc.find('input').attr('checked'));

  doc.find('input').attr('checked', false);
  controller.updateModel(scope);
  assertNull(scope.get('file'));

  doc.find('input').attr('checked', true);
  controller.updateModel(scope);
  assertEquals('url', scope.get('file.url'));
  assertEquals(123, scope.get('file.size'));
};

FileControllerTest.prototype.testShouldEmptyOutOnUndefined = function () {
  var view = nglr.FileController.template('hello');
  var controller = new nglr.FileController(view, 'abc', null, null);

  var scope = new nglr.Scope();
  scope.set('abc', {text: 'myname', url: 'myurl', size: 1234});

  controller.updateView(scope);
  assertEquals("myurl", view.find('a').attr('href'));
  assertEquals("myname", view.find('a').text());
  assertEquals(true, view.find('input').is(':checked'));
  assertEquals("1.2 KB", view.find('span').text());

  scope.set('abc', undefined);
  controller.updateView(scope);
  assertEquals("myurl", view.find('a').attr('href'));
  assertEquals("myname", view.find('a').text());
  assertEquals(false, view.find('input').is(':checked'));
  assertEquals("1.2 KB", view.find('span').text());
};


