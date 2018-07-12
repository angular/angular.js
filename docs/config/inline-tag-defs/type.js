'use strict';

// eslint-disable-next-line new-cap
var encoder = new require('node-html-encoder').Encoder();

/**
 * @dgService typeInlineTagDef
 * @description
 * Replace with markup that displays a nice type
 */
module.exports = function typeInlineTagDef(getTypeClass) {
  return {
    name: 'type',
    handler: function(doc, tagName, tagDescription) {
      return '<a href="" class="' + getTypeClass(tagDescription) + '">' + encoder.htmlEncode(tagDescription) + '</a>';
    }
  };
};
