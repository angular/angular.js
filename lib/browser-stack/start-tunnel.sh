export BROWSER_STACK_ACCESS_KEY=`echo $BROWSER_STACK_ACCESS_KEY | rev`

node ./lib/browser-stack/start-tunnel.js &
