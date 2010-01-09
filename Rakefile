include FileUtils

desc 'Compile JavaScript'
task :compile do
  concat = %x(cat \
      lib/underscore/underscore.js \
      src/angular.prefix \
      lib/webtoolkit/webtoolkit.base64.js \
      lib/swfobject.js/swfobject.js \
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
      src/angular.suffix \
    )
  f = File.new("angular.js", 'w')
  f.write(concat)
  f.close

  %x(java -jar lib/compiler-closure/compiler.jar \
        --compilation_level ADVANCED_OPTIMIZATIONS \
        --js angular.js \
        --js_output_file angular-minified.js)
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
