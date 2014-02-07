#!/bin/bash

set -e  # Exit on error.

BASE_DIR=`dirname $0`
cd $BASE_DIR

set -x  # Trace commands as they're executed.

# use the github repo as it is more up to date than the svn repo
curl https://closure-library.googlecode.com/git/closure/goog/i18n/currency.js > closure/currencySymbols.js
curl https://closure-library.googlecode.com/git/closure/goog/i18n/datetimesymbols.js > closure/datetimeSymbols.js
curl https://closure-library.googlecode.com/git/closure/goog/i18n/datetimesymbolsext.js > closure/datetimeSymbolsExt.js
curl https://closure-library.googlecode.com/git/closure/goog/i18n/numberformatsymbols.js > closure/numberSymbols.js
curl https://closure-library.googlecode.com/git/closure/goog/i18n/pluralrules.js > closure/pluralRules.js
