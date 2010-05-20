browser = {
  navigateTo: function(url){
    $scenario.addStep('Navigate to: ' + url, function(done){
      var self = this;
      self.testFrame.load(function(){
        self.testFrame.unbind();
        self.testDocument = self.testWindow.angular.element(self.testWindow.document);
        done();
      });
      if (this.testFrame.attr('src') == url) {
        this.testWindow.location.reload();
      } else {
        this.testFrame.attr('src', url);
      }
    });
  }
};

function input(selector) {
  return {
    enter: function(value){
      $scenario.addStep("Set input text of '" + selector + "' to value '" + value + "'", function(done){
        var input = this.testDocument.find('input[name=' + selector + ']');
        input.val(value);
        input.trigger('change');
        done();
      });
    }
  };
}

function expect(selector) {
  return {
    toEqual: function(expected) {
      $scenario.addStep("Expect that " + selector + " equals '" + expected + "'", function(done){
        var attrName = selector.substring(2, selector.length - 2);
        var binding = this.testDocument.find('span[ng-bind=' + attrName + ']');
        if (binding.text() != expected) {
          this.result.fail("Expected '" + expected + "' but was '" + binding.text() + "'");
        }
        done();
      });
    }
  };
}

describe('widgets', function(){
  it('should verify that basic widgets work', function(){
    browser.navigateTo('widgets.html');
    expect('{{text.basic}}').toEqual('');
    input('text.basic').enter('John');
    expect('{{text.basic}}').toEqual('JohnXX');
  });
});
