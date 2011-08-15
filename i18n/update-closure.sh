#!/bin/bash

BASE_DIR=`dirname $0`
cd $BASE_DIR

curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/currency.js > closure/currencySymbols.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/datetimesymbols.js > closure/datetimeSymbols.js
curl http://closure-library.googlecode.com/svn/trunk/closure/goog/i18n/numberformatsymbols.js > closure/numberSymbols.js
