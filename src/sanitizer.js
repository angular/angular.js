/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */

// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP = /^<\s*([\w:]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
  END_TAG_REGEXP = /^<\s*\/\s*([\w:]+)[^>]*>/,
  ATTR_REGEXP = /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\s*\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g;

// Empty Elements - HTML 4.01
var emptyElements = makeMap("area,base,basefont,br,col,hr,img,input,isindex,link,param");

// Block Elements - HTML 4.01
var blockElements = makeMap("address,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,"+
    "form,hr,ins,isindex,li,map,menu,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

// Inline Elements - HTML 4.01
var inlineElements = makeMap("a,abbr,acronym,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,img,"+
    "input,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelfElements = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = extend({}, emptyElements, blockElements, inlineElements, closeSelfElements);
var validAttrs = extend({}, fillAttrs, makeMap(
    'abbr,align,alink,alt,archive,axis,background,bgcolor,border,cellpadding,cellspacing,cite,class,classid,clear,code,codebase,'+
    'codetype,color,cols,colspan,content,coords,data,dir,face,for,headers,height,href,hreflang,hspace,id,label,lang,language,'+
    'link,longdesc,marginheight,marginwidth,maxlength,media,method,name,nowrap,profile,prompt,rel,rev,rows,rowspan,rules,scheme,'+
    'scope,scrolling,shape,size,span,src,standby,start,summary,tabindex,target,text,title,type,usemap,valign,value,valuetype,'+
    'vlink,vspace,width'));

/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
var htmlParser = function( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function(){ return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        index = html.indexOf("-->");

        if ( index >= 0 ) {
          if ( handler.comment )
            handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }

      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( START_TAG_REGEXP, parseStartTag );
          chars = false;
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        var text = index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if ( handler.chars )
          handler.chars( text );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text){
        text = text.
          replace(COMMENT_REGEXP, "$1").
          replace(CDATA_REGEXP, "$1");

        if ( handler.chars )
          handler.chars( text );

        return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw "Parse Error: " + html;
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( closeSelfElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = emptyElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    if ( handler.start ) {
      var attrs = {};

      rest.replace(ATTR_REGEXP, function(match, name) {
        var value = arguments[2] ? arguments[2] :
          arguments[3] ? arguments[3] :
          arguments[4] ? arguments[4] :
          fillAttrs[name] ? name : "";

        attrs[name] = value; //value.replace(/(^|[^\\])"/g, '$1\\\"') //"
      });

      if ( handler.start )
        handler.start( tagName, attrs, unary );
    }
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if ( handler.end )
          handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
};

/**
 * @param str 'key1,key2,...'
 * @returns {key1:true, key2:true, ...}
 */
function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}

/*
 * For attack vectors see: http://ha.ckers.org/xss.html
 */
var JAVASCRIPT_URL = /^javascript:/i,
    NBSP_REGEXP = /&nbsp;/gim,
    HEX_ENTITY_REGEXP = /&#x([\da-f]*);?/igm,
    DEC_ENTITY_REGEXP = /&#(\d+);?/igm,
    CHAR_REGEXP = /[\w:]/gm,
    HEX_DECODE = function(match, code){return fromCharCode(parseInt(code,16));},
    DEC_DECODE = function(match, code){return fromCharCode(code);};
/**
 * @param {string} url
 * @returns true if url decodes to something which starts with 'javascript:' hence unsafe
 */
function isJavaScriptUrl(url) {
  var chars = [];
  url.replace(NBSP_REGEXP, '').
      replace(HEX_ENTITY_REGEXP, HEX_DECODE).
      replace(DEC_ENTITY_REGEXP, DEC_DECODE).
      // Remove all non \w: characters, unfurtunetly value.replace(/[\w:]/,'') can be defeated using \u0000
      replace(CHAR_REGEXP, function(ch){chars.push(ch);});
  return JAVASCRIPT_URL.test(lowercase(chars.join('')));
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf){
  var ignore = false;
  var out = bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag]) {
        out('<');
        out(tag);
        foreach(attrs, function(value, key){
          if (validAttrs[lowercase(key)] && !isJavaScriptUrl(value)) {
            out(' ');
            out(key);
            out('="');
            out(value.
                replace(/</g, '&lt;').
                replace(/>/g, '&gt;').
                replace(/\"/g,'&quot;'));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = lowercase(tag);
        if (!ignore && validElements[tag]) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(chars.
              replace(/&(\w+[&;\W])?/g, function(match, entity){return entity?match:'&amp;';}).
              replace(/</g, '&lt;').
              replace(/>/g, '&gt;'));
        }
      }
  };
}
