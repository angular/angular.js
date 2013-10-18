/**
 * DOM generation class
 */

exports.DOM = DOM;
exports.htmlEscape = htmlEscape;

//////////////////////////////////////////////////////////

function htmlEscape(text){
  return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\{\{/g, '<span>{{</span>')
          .replace(/\}\}/g, '<span>}}</span>');
}


function DOM() {
  this.out = [];
  this.headingDepth = 0;
}

var INLINE_TAGS = {
    i: true,
    b: true,
    a: true
};

DOM.prototype = {
  toString: function() {
    return this.out.join('');
  },

  text: function(content) {
    if (typeof content == "string") {
      this.out.push(htmlEscape(content));
    } else if (typeof content == 'function') {
      content.call(this, this);
    } else if (content instanceof Array) {
      this.ul(content);
    }
  },

  html: function(html) {
    if (html) {
      var headingDepth = this.headingDepth;
      for ( var i = 10; i > 0; --i) {
        html = html
          .replace(new RegExp('<h' + i + '(.*?)>([\\s\\S]+)<\/h' + i +'>', 'gm'), function(_, attrs, content){
            var tag = 'h' + (i + headingDepth);
            return '<' + tag + attrs + '>' + content + '</' + tag + '>';
          });
      }
      this.out.push(html);
    }
  },

  tag: function(name, attr, text) {
    if (!text) {
      text = attr;
      attr = {};
      if (name == 'code')
        attr['ng:non-bindable'] = '';
    }
    this.out.push('<' + name);
    for(var key in attr) {
      this.out.push(" " + key + '="' + attr[key] + '"');
    }
    this.out.push('>');
    this.text(text);
    this.out.push('</' + name + '>');
    if (!INLINE_TAGS[name])
      this.out.push('\n');
  },

  code: function(text) {
    this.tag('pre', {'class':"prettyprint linenums"}, text);
  },

  div: function(attr, text) {
    this.tag('div', attr, text);
  },

  h: function(heading, content, fn){
    if (content==undefined || (content instanceof Array && content.length == 0)) return;
    this.headingDepth++;
    var className = null,
        anchor = null;
    if (typeof heading == 'string') {
      var id = heading.
          replace(/\(.*\)/mg, '').
          replace(/[^\d\w\$]/mg, '.').
          replace(/-+/gm, '-').
          replace(/-*$/gm, '');
      anchor = {'id': id};
      var classNameValue = id.toLowerCase().replace(/[._]/mg, '-');
      if(classNameValue == 'hide') classNameValue = '';
      className = {'class': classNameValue};
    }
    this.tag('h' + this.headingDepth, anchor, heading);
    if (content instanceof Array) {
      this.ul(content, className, fn);
    } else if (fn) {
      this.tag('div', className, function() {
        fn.call(this, content);
      });
    } else {
      this.tag('div', className, content);
    }
    this.headingDepth--;
  },

  h1: function(attr, text) {
    this.tag('h1', attr, text);
  },

  h2: function(attr, text) {
    this.tag('h2', attr, text);
  },

  h3: function(attr, text) {
    this.tag('h3', attr, text);
  },

  p: function(attr, text) {
    this.tag('p', attr, text);
  },

  ul: function(list, attr, fn) {
    if (typeof attr == 'function') {
      fn = attr;
      attr = {};
    }
    this.tag('ul', attr, function(dom){
      list.forEach(function(item){
        dom.out.push('<li>');
        dom.text(fn ? fn(item) : item);
        dom.out.push('</li>\n');
      });
    });
  }

};
