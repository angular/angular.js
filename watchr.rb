# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: watch watchr.rb
# note: make sure that you have jstd server running (server.sh) and a browser captured

watch( '(src|test|example)/' )  do
   system 'echo "\n\ntest run started @ `date`"; ./test.sh '
end
