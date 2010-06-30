describe("DSL", function() {

  var lastFuture, executeFuture, lastDocument;

  beforeEach(function() {
    lastFuture = null;
    $scenario = {
      addFuture: function(name, behavior) {
        lastFuture = { name:name, behavior: behavior};
      }
    };
    executeFuture = function(future, html, callback) {
      lastDocument =_jQuery('<div>' + html + '</div>');
      _jQuery(document.body).append(lastDocument);
      var specThis = {
        testWindow: window,
        testDocument: lastDocument
      };
      future.behavior.call(specThis, callback || noop);
    };
  });

  describe("input", function() {

    var input = angular.scenario.dsl.input;
    it('should enter', function() {
      input('name').enter('John');
      expect(lastFuture.name).toEqual("Set input text of 'name' to 'John'");
      executeFuture(lastFuture, '<input type="text" name="name" />');
      expect(lastDocument.find('input').val()).toEqual('John');
    });

    it('should select', function() {
      input('gender').select('female');
      expect(lastFuture.name).toEqual("Select radio 'gender' to 'female'");
      executeFuture(lastFuture,
        '<input type="radio" name="0@gender" value="male" checked/>' +
        '<input type="radio" name="0@gender" value="female"/>');
      expect(lastDocument.find(':radio:checked').length).toEqual(1);
      expect(lastDocument.find(':radio:checked').val()).toEqual('female');
    });
  });

  describe('expect', function() {
    var dslExpect = angular.scenario.dsl.expect;
    describe('repeater', function() {
      it('should check the count of repeated elements', function() {
        dslExpect.repeater('.repeater-row').count.toEqual(2);
        expect(lastFuture.name).toEqual("Expect that there are 2 items in Repeater with selector '.repeater-row'");
        var html = "<div class='repeater-row'>a</div><div class='repeater-row'>b</div>";
        executeFuture(lastFuture, html);
      });
    });
  });
});
