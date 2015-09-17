#!/bin/bash
# Has to be run from project root directory.


if [ "$BROWSER_PROVIDER" == "browserstack" ]; then
  echo "Using BrowserStack"
elif [ "$BROWSER_PROVIDER" == "saucelabs" ]; then
  echo "Using SauceLabs"
else
  echo "Invalid BROWSER_PROVIDER. Please set env var BROWSER_PROVIDER to 'saucelabs' or 'browserstack'."
  exit 1
fi

./lib/${BROWSER_PROVIDER}/start_tunnel.sh
