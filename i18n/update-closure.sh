#!/bin/bash

set -e  # Exit on error.

BASE_DIR=`dirname $0`
cd $BASE_DIR

set -x  # Trace commands as they're executed.

I18N_BASE="https://raw.githubusercontent.com/google/closure-library/master/closure/goog/i18n"

# use the github repo as it is more up to date than the svn repo
curl "$I18N_BASE/currency.js" > closure/currencySymbols.js
curl "$I18N_BASE/datetimesymbols.js" > closure/datetimeSymbols.js
curl "$I18N_BASE/datetimesymbolsext.js" > closure/datetimeSymbolsExt.js
curl "$I18N_BASE/numberformatsymbols.js" > closure/numberSymbols.js
curl "$I18N_BASE/pluralrules.js" > closure/pluralRules.js
