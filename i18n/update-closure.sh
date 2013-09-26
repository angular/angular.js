#!/bin/bash

set -e  # Exit on error.

BASE_DIR=`dirname $0`
cd $BASE_DIR

set -x  # Trace commands as they're executed.

curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/currency.js > closure/currencySymbols.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/datetimesymbols.js > closure/datetimeSymbols.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/datetimesymbolsext.js > closure/datetimeSymbolsExt.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/numberformatsymbols.js > closure/numberSymbols.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/pluralrules.js > closure/pluralRules.js
