# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: watch watchr.rb
# note: make sure that you have jstd server running (server.sh) and a browser captured

watch( '^src/|^docs/' )  do
   %x{ echo "\n\ndoc run started @ `date`" > logs/docs.log; node docs/src/gen-docs.js &> logs/docs.log & }
end
