'use strict';

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    };
  }
  directive.replace = directive.replace || true;
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}
