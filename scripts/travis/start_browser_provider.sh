#!/bin/bash
# Has to be run from project root directory.

# TODO(vojta): normalize paths to lib/$BROWSER_PROVIDER
if [ "$BROWSER_PROVIDER" == "browserstack" ]; then
  echo "Using BrowserStack"
  ./lib/browser-stack/start-tunnel.sh
else
  echo "Using SauceLabs"
  ./lib/sauce/sauce_connect_setup.sh
fi
