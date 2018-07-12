export BROWSER_STACK_ACCESS_KEY=`echo $BROWSER_STACK_ACCESS_KEY | rev`

node ./lib/browserstack/start_tunnel.js &
