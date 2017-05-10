
var v0 = "{_viewstate:'viewstate',_contestFilter:'{\"100\":\"1\",\"120\":\"1\",\"280\":\"1\",\"300\":\"1\",\"320\":\"1\",\"340\":\"1\",\"360\":\"1\",\"380\":\"1\",\"400\":\"1\",\"460\":\"1\",\"480\":\"1\",\"580\":\"1\",\"600\":\"1\",\"1605\":\"1\",\"1630\":\"1\",\"1635\":\"1\",\"1640\":\"1\",\"1645\":\"1\",\"1650\":\"1\",\"1660\":\"1\",\"1665\":\"1\",\"1670\":\"1\",\"1675\":\"1\",\"1680\":\"1\",\"1685\":\"1\",\"1690\":\"1\",\"1695\":\"1\"}'}";

var v1 = v0;
v1 = lzw_encode(v1);

var high = v0.replace('\\','').length;
var low = v1.length;                   
var diff = (low/high * 100) - 100;                   
alert(high  + " characters (original) : " +v0);
alert(low  + " characters (conpressed) : " +v1);
alert('Difference of ' + diff + '% \ncompression ratio of ' + Math.round((high/low)*100)/100 + ':1');
//console.log();

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}