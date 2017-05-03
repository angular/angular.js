function l33t(inBuf,extreme,grammatical) {
	/*
	English-to-l33t Translator (c) 2004-2006 by Lee W. Fastenau
	Feel free to use and/or modify this code as long as you don't make money from it.
	This attribution must stay.  Stay, it must.  Yes.
	*/
	if (!inBuf) {
		return '';
	}
	inBuf = inBuf.replace (/\b(hacker|coder|programmer)(s|z)?\b/gi,'haxor$2');
	inBuf = inBuf.replace (/\b(hack)(ed|s|z)?\b/gi,'haxor$2');
	inBuf = inBuf.replace (/\b(thank you)\b/gi,'TY');
	inBuf = inBuf.replace (/\b(luv|love|wuv|like)(s|z)?\b/gi,'wub$2');
	inBuf = inBuf.replace (/\b(software)(s|z)?\b/gi,'wares');
	inBuf = inBuf.replace (/\b((is|are|am) +(cool|wicked|awesome|great))\b/gi,'rocks');
	inBuf = inBuf.replace (/\b((is|are|am) +(\w+) +(cool|wicked|awesome|great))\b/gi,'$3 rocks');
	inBuf = inBuf.replace (/\b(very|extremely)\b/gi,'totally');
	inBuf = inBuf.replace (/\b(because)\b/gi,'coz');
	inBuf = inBuf.replace (/\b(due to)\b/gi,'coz of');
	inBuf = inBuf.replace (/\b(is|am)\b/gi,'be');
	inBuf = inBuf.replace (/\b(are)\b/gi,'is');
	inBuf = inBuf.replace (/\b(rock)(s|z)?\b/gi,'roxor$2');
	inBuf = inBuf.replace (/\b(porn(o(graph(y|ic))?)?)\b/gi,'pron');
	inBuf = inBuf.replace (/\b(lamer|dork|jerk|moron|idiot)\b/gi,'loser');
	inBuf = inBuf.replace (/\b(an loser)\b/gi,'a loser');
	inBuf = inBuf.replace (/\b(what('s)?)\b/gi,'wot');
	inBuf = inBuf.replace (/\b(that)\b/gi,'dat');
	inBuf = inBuf.replace (/\b(this)\b/gi,'dis');
	inBuf = inBuf.replace (/\b(hooray|yippee|yay|yeah)\b/gi,'woot');
	inBuf = inBuf.replace (/\b(win|own)(s|z)?\b/gi,'pwn$2');
	inBuf = inBuf.replace (/\b(won|owned)\b/gi,'pwnt');
	inBuf = inBuf.replace (/\b(suck)(ed|s|z)?\b/gi,'suxor$2');
	inBuf = inBuf.replace (/\b(was|were|had been)/gi,'wuz');
	inBuf = inBuf.replace (/\b(elite)/gi,'leet');
	inBuf = inBuf.replace (/\byou\b/gi,'joo');
	inBuf = inBuf.replace (/\b(man|dude|guy|boy)(s|z)?\b/gi,'dood$2');
	inBuf = inBuf.replace (/\b(men)\b/gi,'doods');
	inBuf = inBuf.replace (/\bstarbucks?\b/gi,'bizzo');
	inBuf = inBuf.replace (/\b(the)\b/gi,'teh');
	inBuf = inBuf.replace (/(ing)\b/gi,'in\'');
	inBuf = inBuf.replace (/\b(stoked|happy|excited|thrilled|stimulated)\b/gi,'geeked');
	inBuf = inBuf.replace (/\b(unhappy|depressed|miserable|sorry)\b/gi,'bummed out');
	inBuf = inBuf.replace (/\b(and|an)\b/gi,'n');
	inBuf = inBuf.replace (/\b(your|hey|hello|hi)\b/gi,'yo');
	inBuf = inBuf.replace (/\b(might)\b/gi,'gonna');
	if (!grammatical) {
		inBuf = inBuf.replace (/\blater\b/gi,'l8r');
		inBuf = inBuf.replace (/\bare\b/gi,'R');
		inBuf = inBuf.replace (/\bbe\b/gi,'b');
		inBuf = inBuf.replace (/\bto\b/gi,'2');
		inBuf = inBuf.replace (/\ba\b/gi,'@');
		inBuf = inBuf.replace (/(\S)l/g,'$1L');
		inBuf = inBuf.replace (/(\S)l/g,'$1L'); // Twice to catch "LL"
		inBuf = inBuf.replace (/a/gi,'4');
		inBuf = inBuf.replace (/\bfor\b/gi,'4');
		inBuf = inBuf.replace (/e/gi,'3');
		inBuf = inBuf.replace (/i/gi,'1');
		inBuf = inBuf.replace (/o/gi,'0');
		inBuf = inBuf.replace (/s\b/gi,'z');
		// inBuf = inBuf.replace (/s/gi,'5');
		if (extreme) {
			// If you thought "normal" l33t was bad...
			inBuf = inBuf.replace (/f/gi,'|=');
			inBuf = inBuf.replace (/g/gi,'6');
			inBuf = inBuf.replace (/h/gi,'#');
			inBuf = inBuf.replace (/k/gi,'|<');
			inBuf = inBuf.replace (/l/gi,'|_');
			inBuf = inBuf.replace (/m/gi,'|\\/|');
			inBuf = inBuf.replace (/n/gi,'|\\|');
			inBuf = inBuf.replace (/t/gi,'7');
			inBuf = inBuf.replace (/u/gi,'|_|');
			inBuf = inBuf.replace (/v/gi,'\\/');
			inBuf = inBuf.replace (/w/gi,'\\/\\/');
			inBuf = inBuf.replace (/\b3x/gi,'X');
			inBuf = inBuf.replace (/y/gi,'\'/');
			inBuf = inBuf.replace (/z/gi,'2');
		}
	}
	return inBuf;
}