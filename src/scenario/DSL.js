angular.scenario.dsl.browser = {
  navigateTo: function(url){
    $scenario.addStep('Navigate to: ' + url, function(done){
      var self = this;
      self.testFrame.load(function(){
        self.testFrame.unbind();
        self.testDocument = jQuery(self.testWindow.document);
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

angular.scenario.dsl.input = function(selector) {
  return {
    enter: function(value){
      $scenario.addStep("Set input text of '" + selector + "' to '" +
        value + "'", function(done){
          var input = this.testDocument.find('input[name=' + selector + ']');
          input.val(value);
          this.testWindow.angular.element(input[0]).trigger('change');
          done();
      });
    },
    select: function(value){
      $scenario.addStep("Select radio '" + selector + "' to '" +
              value + "'", function(done){
        var input = this.testDocument.
          find(':radio[name$=@' + selector + '][value=' + value + ']');
        var event = this.testWindow.document.createEvent('MouseEvent');
        event.initMouseEvent('click', true, true, this.testWindow, 0,0,0,0,0, false, false, false, false, 0, null);
        input[0].dispatchEvent(event);
        done();
      });
    }
  };
};

angular.scenario.dsl.expect = function(selector) {
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
};
