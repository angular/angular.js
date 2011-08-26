var $ = require('jquery');

exports.extract = function(elements) {

  var rdbObj = {};

  for(var i = 0; i < elements.length; i++) {
    var el = $(elements[i]),
        msgId = '#' + el.attr('msgid');

    if (rdbObj[msgId]) console.error(msgId + ' already exist. Please do not use duplicate msgId');
    /*
      Construct like:
      <div msgId='outer'> <div>a</div></div>
       Should not be allowed. Exception should be thrown to halt execution
       However, construct like:
       <div msgId='outer'> I <strong>am</strong> happy </div>
       should be allowed
    */
    exports.checkValid(el);

    exports.extractContent(rdbObj, el);
    exports.extractAttribute(rdbObj, el);
  }
  return rdbObj;
}


var VALID_NODE_NAMES = {};
'STRONG,EM,DFN,CODE,PRE,SAMP,KBD,VAR,CITE,ADDRESS,Q,BLOCKQUOTE,ACRONYM,ABBR,#text,#comment'.
    split(',').forEach(function(tag) { VALID_NODE_NAMES[tag] = true; });

exports.checkValid = function(el) {
  //TODO(Di) This should be recrusive, to prevent <em><div msgId='some'>llll</div></em>
  var contents = el.contents();

  for(var i = 0; i < contents.length; i++) {
    var nodeName = contents[i].nodeName;
    if (!VALID_NODE_NAMES[nodeName]) console.error('ERROR: Node with msgId="' + el.attr('msgid') +
                                                 '" has nested structure that is not supported!');
  }
}


exports.extractContent = function(rdbObj, el) {
  var contents = el.contents(),
      msgId = '#' + el.attr('msgid'),
      nodeName = el[0].nodeName.toLowerCase();


  rdbObj[msgId] = "";

  if (nodeName == 'ng:pluralize') {
    var count = el.attr('count'),
        when = el.attr('when'),
        offset = parseInt(el.attr('offset'));
    //TODO(Di) need to add test once we decide on an error reporting mechanism
    if (!count || !when) console.error(msgId + ' is an ng:pluralize widget but it does not have ' +
                                       'all the required fields!');

    /*Sample output after the processing below:
     '{count,plural,=0 {Nobody is here.}' +
                    =other {{} other people are here.}}'
    */
    rdbObj[msgId] = '{' + count + ',plural,';
    if (offset) rdbObj[msgId] += ('offset:' + offset);
    eval('whens = ' + when); //Global variable 'whens'!

    var errChecker = {};
    for(key in whens) {
      rdbObj[msgId] += ('=' + key + ' {' + whens[key] + '}');
      errChecker[key] = true;
    }

    //Make sure all ng:pluraize with offset have the right number of explicit rules
    if (offset) {
     for(var i = 0; i<= offset; i++) {
       if (!errChecker[i]) console.error('ng:pluralize ' + msgId + ' is missing' +
                                         ' explicit number rule for number ' + i);
     }
    }

    rdbObj[msgId] += '}';
  } else {
    for(var i = 0; i < contents.length; i++) {
      //remove preceding and trailing spaces.
      var textContent = contents[i].textContent.replace(/^(\n*\s*)(.*)(\n*\s*)$/g,
                            function(whole, pre, middle, end) { return middle; });

      //Phrase tag elements have innerHTML, text and comment nodes don't
      //TODO(Di) Should be a recursion to deal with nested phraseTags!!
      if (contents[i].innerHTML) {
        var tag = contents[i].nodeName.toLowerCase();

        rdbObj[msgId] += '{@<' + tag + '>}' + textContent + '{@<\/' + tag + '>}';
      } else {
         rdbObj[msgId] += textContent;
      }

      //replace Angular bindings. {{count}} -> {count}
      rdbObj[msgId] = rdbObj[msgId].replace(/{{([^}]+)}}/g, function(whole, expStr) {
        return '{' + expStr + '}';
      });
    }
  }
}


exports.extractAttribute = function(rdbObj, el) {
  var attrId = '@' + el.attr('msgid'),
      attrVal;

  rdbObj[attrId] = {};
  if ((attrVal = el.attr('msgdesc'))) rdbObj[attrId].description = attrVal;
}
