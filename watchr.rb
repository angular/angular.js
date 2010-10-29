# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: watch watchr.rb
# note: make sure that you have jstd server running (server.sh) and a browser captured

watch( '(src|test|example)/' )  do
   %x{ echo "\n\ntest run started @ `date`" > logs/jstd.log; ./test.sh &> logs/jstd.log & }
   %x{ echo "\n\nlint started @ `date`" > logs/lint.log; rake lint &> logs/lint.log & }
end
