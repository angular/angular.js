'use strict';

goog.provide('angular.core.directive.directives');

goog.require('angular.core.filter.orderBy');

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    }
  }
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}
