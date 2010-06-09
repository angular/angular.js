describe("DSL", function() {

  var lastStep, executeStep, lastDocument;

  beforeEach(function() {
    lastStep = null;
    $scenario = {
      addStep: function(name, stepFunction) {
        lastStep = { name:name, fn: stepFunction};
      }
    };
    executeStep = function(step, html, callback) {
      lastDocument =_jQuery('<div>' + html + '</div>');
      _jQuery(document.body).append(lastDocument);
      var specThis = {
        testWindow: window,
        testDocument: lastDocument
      };
      step.fn.call(specThis, callback || noop);
    };
  });

  describe("input", function() {

    var input = angular.scenario.dsl.input;
    it('should enter', function() {
      input('name').enter('John');
      expect(lastStep.name).toEqual("Set input text of 'name' to 'John'");
      executeStep(lastStep, '<input type="text" name="name" />');
      expect(lastDocument.find('input').val()).toEqual('John');
    });

    it('should select', function() {
      input('gender').select('female');
      expect(lastStep.name).toEqual("Select radio 'gender' to 'female'");
      executeStep(lastStep,
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
        expect(lastStep.name).toEqual("Expect to see 2 items repeated with selector '.repeater-row'");
        var html = "<div class='repeater-row'>a</div><div class='repeater-row'>b</div>";
        executeStep(lastStep, html);
      });
    });
  });
});
