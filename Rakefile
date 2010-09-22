  include FileUtils

task :default => [:compile, :test]

desc 'Generate Externs'
task :compile_externs do
  out = File.new("externs.js", "w")

  out.write("function _(){};\n")
  file = File.new("lib/underscore/underscore.js", "r")
  while (line = file.gets)
    if line =~ /^\s*_\.(\w+)\s*=.*$/
      out.write("_.#{$1}=function(){};\n")
    end
  end
  file.close

  out.write("function jQuery(){};\n")
  file = File.new("lib/jquery/jquery-1.4.2.js", "r")
  while (line = file.gets)
    if line =~ /^\s*(\w+)\s*:\s*function.*$/
      out.write("jQuery.#{$1}=function(){};\n")
    end
  end
  file.close
  out.write("jQuery.scope=function(){};\n")
  out.write("jQuery.controller=function(){};\n")

  out.close
end

desc 'Compile Scenario'
task :compile_scenario do
  concat = %x(cat \
      lib/underscore/underscore.js \
      lib/jquery/jquery-1.4.2.js \
      src/scenario/angular.prefix \
      src/Angular.js \
      src/jqLite.js \
      src/JSON.js \
      src/Scope.js \
      src/Parser.js \
      src/Resource.js \
      src/Browser.js \
      src/apis.js \
      src/services.js \
      src/AngularPublic.js \
      src/scenario/DSL.js \
      src/scenario/Future.js \
      src/scenario/Matcher.js \
      src/scenario/Runner.js \
      src/scenario/angular.suffix \
    )
  css = %x(cat css/angular-scenario.css)
  f = File.new("angular-scenario.js", 'w')
  f.write(concat)
  f.write('document.write(\'<style type="text/css">\n')
  f.write(css.gsub(/'/, "\\'").gsub(/\n/, "\\n"));
  f.write('\n</style>\');')
  f.close
end

desc 'Compile JavaScript'
task :compile do
  Rake::Task['compile_externs'].execute 0
  Rake::Task['compile_scenario'].execute 0

  concat = %x(cat \
      src/angular.prefix \
      src/Angular.js \
      src/JSON.js \
      src/Compiler.js \
      src/Scope.js \
      src/Parser.js \
      src/Resource.js \
      src/Browser.js \
      src/jqLite.js \
      src/apis.js \
      src/filters.js \
      src/formatters.js \
      src/validators.js \
      src/services.js \
      src/directives.js \
      src/markups.js \
      src/widgets.js \
      src/AngularPublic.js \
      src/angular.suffix \
    )
  f = File.new("angular-debug.js", 'w')
  f.write(concat)
  f.close

  %x(java -jar lib/compiler-closure/compiler.jar \
        --compilation_level SIMPLE_OPTIMIZATIONS \
        --js angular-debug.js \
        --externs externs.js \
        --create_source_map ./angular-minified.map \
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

desc 'push_angularjs'
task :push_angularjs do
  Rake::Task['compile'].execute 0
  sh %(cat angularjs.ftp | ftp -N angularjs.netrc angularjs.org)
end
