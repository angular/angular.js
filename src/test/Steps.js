angular.test.GIVEN = {
  browser:function(){
    var self = this;
    if (jQuery.browser.safari && this.frame.attr('src') == this.at) {
      this.window.location.reload();
    } else {
      this.frame.attr('src', this.at);
    }
    return function(done){
      self.frame.load(function(){
        self.frame.unbind();
        done();
      });
    };
  },
  dataset:function(){
    this.frame.name="$DATASET:" + nglr.toJson({dataset:this.dataset});
  }
};
angular.test.WHEN = {
  enter:function(){
    var element = this.element(this.at);
    element.attr('value', this.text);
    element.change();
  },
  click:function(){
    var element = this.element(this.at);
    var input = element[0];
    // emulate the browser behavior which causes it
    // to be overridden at the end.
    var checked = input.checked = !input.checked;
    element.click();
    input.checked = checked;
  },
  select:function(){
    var element = this.element(this.at);
    var path = "option[value=" + this.option + "]";
    var option = this.assert(element.find(path));
    option[0].selected = !option[0].selected; 
    element.change();
  }
};
angular.test.THEN = {
  text:function(){
    var element = this.element(this.at);
    if (typeof this.should_be != undefined ) {
      var should_be = this.should_be;
      if (_.isArray(this.should_be))
        should_be = JSON.stringify(should_be);
      if (element.text() != should_be)
        throw "Expected " + should_be + 
              " but was " + element.text() + ".";
    }
  },
  drainRequestQueue:function(){
  }
};
