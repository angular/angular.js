include FileUtils

desc 'Compile JavaScript'
task :compile do
  compiled = %x(java -jar lib/shrinksafe/shrinksafe.jar \
      lib/webtoolkit/webtoolkit.base64.js \
      lib/underscore/underscore.js \
      src/Loader.js \
      src/API.js \
      src/Binder.js \
      src/ControlBar.js \
      src/DataStore.js \
      src/Filters.js \
      src/JSON.js \
      src/Model.js \
      src/Parser.js \
      src/Scope.js \
      src/Server.js \
      src/Users.js \
      src/Validators.js \
      src/Widgets.js \
      src/angular-bootstrap.js \
    )
  f = File.new("angular.js", 'w')
  f.write(compiled)
  f.close
end

desc 'Compile JavaScript with Google Closure Compiler'
task :compileclosure do
  %x(java -jar lib/compiler-closure/compiler.jar \
        --compilation_level ADVANCED_OPTIMIZATIONS \
        --js lib/webtoolkit/webtoolkit.base64.js \
        --js lib/underscore/underscore.js \
        --js src/Loader.js \
        --js src/API.js \
        --js src/Binder.js \
        --js src/ControlBar.js \
        --js src/DataStore.js \
        --js src/Filters.js \
        --js src/JSON.js \
        --js src/Model.js \
        --js src/Parser.js \
        --js src/Scope.js \
        --js src/Server.js \
        --js src/Users.js \
        --js src/Validators.js \
        --js src/Widgets.js \
        --js src/angular-bootstrap.js \
        --js_output_file angular.js)
end

namespace :server do
  desc 'Run JsTestDriver Server'
  task :start do
    sh %x(java -jar lib/jstestdriver/JsTestDriver.jar --browser open --port 9876)
  end

  desc "Run JavaScript tests against the server"
  task :test do
    sh %(java -jar lib/jstestdriver/JsTestDriver.jar --tests all)
  end
end

desc "Run JavaScript tests"
task :test do
  sh %(java -jar lib/jstestdriver/JsTestDriver.jar --tests all --browser open --port 9876)
end

desc 'Lint'
task :lint do
  out = %x(lib/jsl/jsl -conf lib/jsl/jsl.default.conf)
  print out
end
