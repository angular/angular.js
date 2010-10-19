/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */

// Regular Expressions for parsing tags and attributes
var startTag = /^<\s*([\w:]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag = /^<\s*\/\s*([\w:]+)[^>]*>/,
  attr = /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
  beginTag = /^</,
  beginEndTag = /^<\s*\//;

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


var HTMLParser = function( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function(){ return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") == 0 ) {
        index = html.indexOf("-->");

        if ( index >= 0 ) {
          if ( handler.comment )
            handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }

      // end tag
      } else if ( beginEndTag.test(html) ) {
        match = html.match( endTag );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( endTag, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( beginTag.test(html) ) {
        match = html.match( startTag );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( startTag, parseStartTag );
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
          replace(/<!--(.*?)-->/g, "$1").
          replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

        if ( handler.chars )
          handler.chars( text );

        return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      dump('PARSE ERROR', html);
      throw {error: "Parse Error: " + html};
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

      rest.replace(attr, function(match, name) {
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
    tagName = lowercase(tagName);
    // If no tag name is provided, clean shop
    if ( !tagName )
      var pos = 0;

    // Find the closest opened tag of the same type
    else
      for ( var pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( var i = stack.length - 1; i >= pos; i-- )
        if ( handler.end )
          handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
};

function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}

/*
 * For attack vectors see: http://ha.ckers.org/xss.html
 */
var JAVASCRIPT_URL = /^javascript:/i;
function isJavaScriptUrl(value) {
  var chars = [];
  value = value.replace(/&nbsp;/gim, '');
  value = value.replace(/&#x([\da-f]*);?/igm, function(match, code){return fromCharCode(parseInt(code,16));});
  value = value.replace(/&#(\d*);?/igm, function(match, code){return fromCharCode(code);});
  value = value.replace(/&#(\d+);?/igm, function(match, code){return fromCharCode(parseInt(code,8));});
  // Remove all non \w: characters, unfurtunetly value.replace(/[\w:]/,'') can be defeated using \u0000
  value.replace(/[\w:]/gm, function(ch){chars.push(ch);});
  return JAVASCRIPT_URL.test(lowercase(chars.join('')));
}

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
