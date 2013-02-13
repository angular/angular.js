'use strict';

var ngAnimateDirective = function($animation) {
  return {
    priority : 9000, //this needs to always be higher than ngRepeat
    controller: Animator,
    require: 'ngAnimate',
    link: function(scope, element, attrs, animationCntl) {
      var ngAnimateAttr = attrs.ngAnimate;

      //SAVED: http://rubular.com/r/0DCBzCtVml
      var matches = ngAnimateAttr.split(/(?:([-\w]+)\ *:\ *([-\w]+)(?:;|$))+/g);
      if(!matches || matches.length == 0) {
        throw Error("Expected ngAnimate in form of 'animation: definition; ...;' but got '" + ngAnimateAttr + "'.");
      }
      for(var i=1; i < matches.length; i++) {
        var name  = matches[i++];
        var value = matches[i++];
        if(name && value) {
          var animator = $animation(value);
          if(!animator || typeof(animator) != 'function') {
            throw new Error("Expected '" + value + "' to be defined for the '" + name + "' animation in ngAnimate");  
          }
          animationCntl.set(name, animator);
        }
      }
    }
  };
};

var Animator = function($animation) {
  var animators = {
    'enter': $animation('noopEnter'),
    'leave': $animation('noopLeave'),
    'move':  $animation('noopMove')
  };

  this.set = function(name, animator) {
    if(typeof(animator) != 'function') {
      throw Error("'" + name + "' does not have a properly defined animation function");
    }
    animators[name] = animator;
  },

  this.animate = function(name, node, parent, after) {
    var animator = animators[name];
    if(typeof(animator) != 'function') {
      throw Error("'" + name + "' animator method was not found");
    }
    animator(node, parent, after);
  };
};
Animator.$inject = ['$animation'];

var $noopAnimatorFactory = ['$animation', function($animation) {
  var ctl = new Animator($animation);

  ctl.set = undefined; // prevent anyone from changing it.
  return ctl;
}];
