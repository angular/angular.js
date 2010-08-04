describe("DSL", function() {

  var lastDocument, executeFuture, Expect;

  beforeEach(function() {
    setUpContext();
    executeFuture = function(future, html, callback) {
      lastDocument =_jQuery('<div>' + html + '</div>');
      _jQuery(document.body).append(lastDocument);
      var specThis = {
        testWindow: window,
        testDocument: lastDocument
      };
      future.behavior.call(specThis, callback || noop);
    };
    Expect = scenario.expect;
  });

  describe("input", function() {

    var input = angular.scenario.dsl.input;

    it('should enter', function() {
      var future = input('name').enter('John');
      expect(future.name).toEqual("input 'name' enter 'John'");
      executeFuture(future, '<input type="text" name="name" />');
      expect(lastDocument.find('input').val()).toEqual('John');
    });

    it('should select', function() {
      var future = input('gender').select('female');
      expect(future.name).toEqual("input 'gender' select 'female'");
      executeFuture(future,
        '<input type="radio" name="0@gender" value="male" checked/>' +
        '<input type="radio" name="0@gender" value="female"/>');
      expect(lastDocument.find(':radio:checked').length).toEqual(1);
      expect(lastDocument.find(':radio:checked').val()).toEqual('female');
    });
  });

  describe('repeater', function() {

    var repeater = angular.scenario.dsl.repeater;

    it('should fetch the count of repeated elements', function() {
      var future = repeater('.repeater-row').count();
      expect(future.name).toEqual("repeater '.repeater-row' count");
      executeFuture(future, "<div class='repeater-row'>a</div>" +
                            "<div class='repeater-row'>b</div>",
                            function(value) {
        future.fulfill(value);
      });
      expect(future.fulfilled).toBeTruthy();
      expect(future.value).toEqual(2);
    });
  });
});
