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
      executeStep(lastStep, '<input type="radio" name="0@gender" value="male"/>' +
        '<input type="radio" name="0@gender" value="female"/>');
      expect(lastDocument.find(':radio:checked').val()).toEqual('female');
    });
  });
});