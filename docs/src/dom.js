/**
 * DOM generation class
 */

exports.DOM = DOM;
exports.htmlEscape = htmlEscape;
exports.normalizeHeaderToId = normalizeHeaderToId;

//////////////////////////////////////////////////////////

function htmlEscape(text){
  return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\{\{/g, '<span>{{</span>')
          .replace(/\}\}/g, '<span>}}</span>');
}

function nonEmpty(header) {
  return !!header;
}

function idFromCurrentHeaders(headers) {
  if (headers.length === 1) return headers[0];
  // Do not include the first level title, as that's the title of the page.
  return headers.slice(1).filter(nonEmpty).join('_');
}

function normalizeHeaderToId(header) {
  if (typeof header !== 'string') {
    return '';
  }

  return header.toLowerCase()
      .replace(/<.*>/g, '')         // html tags
      .replace(/[\!\?\:\.\']/g, '') // special characters
      .replace(/&#\d\d;/g, '')      // html entities
      .replace(/\(.*\)/mg, '')      // stuff in parenthesis
      .replace(/\s$/, '')           // trailing spaces
      .replace(/\s+/g, '-');        // replace whitespaces with dashes
}


function DOM() {
  this.out = [];
  this.headingDepth = 0;
  this.currentHeaders = [];
  this.anchors = [];
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
    if (!html) return;

    var self = this;
    // rewrite header levels, add ids and collect the ids
    html = html.replace(/<h(\d)(.*?)>([\s\S]+?)<\/h\1>/gm, function(_, level, attrs, content) {
      level = parseInt(level, 10) + self.headingDepth; // change header level based on the context

      self.currentHeaders[level - 1] = normalizeHeaderToId(content);
      self.currentHeaders.length = level;

      var id = idFromCurrentHeaders(self.currentHeaders);
      self.anchors.push(id);
      return '<h' + level + attrs + ' id="' + id + '">' + content + '</h' + level + '>';
    });

    // collect anchors
    html = html.replace(/<a name="(\w*)">/g, function(match, anchor) {
      self.anchors.push(anchor);
      return match;
    });

    this.out.push(html);
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
    this.currentHeaders[this.headingDepth - 1] = normalizeHeaderToId(heading);
    this.currentHeaders.length = this.headingDepth;

    var className = null,
        anchor = null;
    if (typeof heading == 'string') {
      var id = idFromCurrentHeaders(this.currentHeaders);
      this.anchors.push(id);
      anchor = {'id': id};
      var classNameValue = this.currentHeaders[this.headingDepth - 1]
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
