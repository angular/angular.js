'use strict';

var $$AnimateChildrenDirective = [function() {
  return function(scope, element, attrs) {
    var val = attrs.ngAnimateChildren;
    if (angular.isString(val) && val.length === 0) { //empty attribute
      element.data(NG_ANIMATE_CHILDREN_DATA, true);
    } else {
      attrs.$observe('ngAnimateChildren', function(value) {
        value = value === 'on' || value === 'true';
        element.data(NG_ANIMATE_CHILDREN_DATA, value);
      });
    }
  };
}];
