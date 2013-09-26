# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: watch watchr-docs.rb

watch( '^src/|^docs/' )  do
   system 'echo "\n\ndoc run started @ `date`"; node docs/src/gen-docs.js'
end
