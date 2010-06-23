BinderTest.prototype.testExpandEntityTagWithName = function(){
  var c = this.compile('<div ng-entity="friend=Person"/>');
  assertEquals(
      '<div ng-entity="friend=Person" ng-watch="$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};"></div>',
      sortedHtml(c.node));
  assertEquals("Person", c.scope.$get("friend.$entity"));
  assertEquals("friend", c.scope.$get("friend.$$anchor"));
};

BinderTest.prototype.testExpandSubmitButtonToAction = function(){
  var html = this.compileToHtml('<input type="submit" value="Save">');
  assertTrue(html, html.indexOf('ng-action="$save()"') > 0 );
  assertTrue(html, html.indexOf('ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}"') > 0 );
};

BinderTest.prototype.testReplaceFileUploadWithSwf = function(){
  expectAsserts(1);
  var form = jQuery("body").append('<div id="testTag"><input type="file"></div>');
  form.data('scope', new Scope());
  var factory = {};
  var binder = new Binder(form.get(0), factory, new MockLocation());
  factory.createController = function(node){
    assertEquals(node.attr('type'), 'file');
    return {updateModel:function(){}};
  };
  binder.compile();
  jQuery("#testTag").remove();
};

BinderTest.prototype.testExpandEntityTagWithDefaults = function(){
  assertEquals(
      '<div ng-entity="Person:{a:\"a\"}" ng-watch=""></div>',
      this.compileToHtml('<div ng-entity=\'Person:{a:"a"}\'/>'));
};

