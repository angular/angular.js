var typeClassFilter = require('dgeni-packages/ngdoc/rendering/filters/type-class');
var encoder = new require('node-html-encoder').Encoder();

module.exports = {
  name: 'type',
  description: 'Replace with markup that displays a nice type',
  handlerFactory: function() {
    return function(doc, tagName, tagDescription) {
      return '<a href="" class="' + typeClassFilter.process(tagDescription) + '">'+encoder.htmlEncode(tagDescription) + '</a>';
    };
  }
};
