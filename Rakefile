require 'yaml'
include FileUtils

ANGULAR = [
  'src/Angular.js',
  'src/JSON.js',
  'src/Compiler.js',
  'src/Scope.js',
  'src/Injector.js',
  'src/parser.js',
  'src/Resource.js',
  'src/Browser.js',
  'src/sanitizer.js',
  'src/jqLite.js',
  'src/apis.js',
  'src/filters.js',
  'src/formatters.js',
  'src/validators.js',
  'src/service/cookieStore.js',
  'src/service/cookies.js',
  'src/service/defer.js',
  'src/service/document.js',
  'src/service/exceptionHandler.js',
  'src/service/hover.js',
  'src/service/invalidWidgets.js',
  'src/service/location.js',
  'src/service/log.js',
  'src/service/resource.js',
  'src/service/route.js',
  'src/service/updateView.js',
  'src/service/window.js',
  'src/service/xhr.bulk.js',
  'src/service/xhr.cache.js',
  'src/service/xhr.error.js',
  'src/service/xhr.js',
  'src/directives.js',
  'src/markups.js',
  'src/widgets.js',
  'src/AngularPublic.js',
]

ANGULAR_SCENARIO = [
  'src/scenario/Scenario.js',
  'src/scenario/Application.js',
  'src/scenario/Describe.js',
  'src/scenario/Future.js',
  'src/scenario/ObjectModel.js',
  'src/scenario/Describe.js',
  'src/scenario/Runner.js',
  'src/scenario/SpecRunner.js',
  'src/scenario/dsl.js',
  'src/scenario/matchers.js',
  'src/scenario/output/Html.js',
  'src/scenario/output/Json.js',
  'src/scenario/output/Xml.js',
  'src/scenario/output/Object.js'
]

BUILD_DIR = 'build'

task :default => [:compile, :test]


desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)
end


desc 'Clean Generated Files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.mkdir(BUILD_DIR)
end


desc 'Compile Scenario'
task :compile_scenario => :init do

  deps = [
      'lib/jquery/jquery-1.4.2.js',
      'src/scenario/angular.prefix',
      ANGULAR,
      ANGULAR_SCENARIO,
      'src/scenario/angular.suffix',
  ]

  concat = 'cat ' + deps.flatten.join(' ')

  File.open(path_to('angular-scenario.js'), 'w') do |f|
    f.write(%x{#{concat}})
    f.write(gen_css('css/angular.css') + "\n")
    f.write(gen_css('css/angular-scenario.css'))
  end
end

desc 'Compile JSTD Scenario Adapter'
task :compile_jstd_scenario_adapter => :init do

  deps = [
      'src/jstd-scenario-adapter/angular.prefix',
      'src/jstd-scenario-adapter/Adapter.js',
      'src/jstd-scenario-adapter/angular.suffix',
  ]

  concat = 'cat ' + deps.flatten.join(' ')

  File.open(path_to('jstd-scenario-adapter.js'), 'w') do |f|
    f.write(%x{#{concat}})
  end

  # TODO(vojta) use jstd configuration when implemented
  # (instead of including jstd-adapter-config.js)
  File.open(path_to('jstd-scenario-adapter-config.js'), 'w') do |f|
    f.write("/**\r\n" +
            " * Configuration for jstd scenario adapter \n */\n" +
            "var jstdScenarioAdapter = {\n  relativeUrlPrefix: '/build/docs/'\n};\n")
  end
end


desc 'Generate IE css js patch'
task :generate_ie_compat => :init do
  css = File.open('css/angular.css', 'r') {|f| f.read }

  # finds all css rules that contain backround images and extracts the rule name(s), content type of
  # the image and base64 encoded image data
  r = /\n([^\{\n]+)\s*\{[^\}]*background-image:\s*url\("data:([^;]+);base64,([^"]+)"\);[^\}]*\}/

  images = css.scan(r)

  # create a js file with multipart header containing the extracted images. the entire file *must*
  # be CRLF (\r\n) delimited
  File.open(path_to('angular-ie-compat.js'), 'w') do |f|
    f.write("/*\r\n" +
            "Content-Type: multipart/related; boundary=\"_\"\r\n" +
            "\r\n")

    images.each_index do |idx|
      f.write("--_\r\n" +
              "Content-Location:img#{idx}\r\n" +
              "Content-Transfer-Encoding:base64\r\n" +
              "\r\n" +
              images[idx][2] + "\r\n")
    end

    f.write("--_--\r\n" +
            "*/\r\n")

    # generate a css string containing *background-image rules for IE that point to the mime type
    # images in the header
    cssString = ''
    images.each_index do |idx|
      cssString += "#{images[idx][0]}{*background-image:url(\"mhtml:' + jsUri + '!img#{idx}\")}"
    end

    # generate a javascript closure that contains a function which will append the generated css
    # string as a stylesheet to the current html document
    jsString = "(function(){ \r\n" +
               "  var jsUri = document.location.href.replace(/\\/[^\\\/]+(#.*)?$/, '/') + \r\n" +
               "              document.getElementById('ng-ie-compat').src,\r\n" +
               "      css = '#{cssString}',\r\n" +
               "      s = document.createElement('style'); \r\n" +
               "\r\n" +
               "  s.setAttribute('type', 'text/css'); \r\n" +
               "\r\n" +
               "  if (s.styleSheet) { \r\n" +
               "    s.styleSheet.cssText = css; \r\n" +
               "  } else { \r\n" +
               "    s.appendChild(document.createTextNode(css)); \r\n" +
               "  } \r\n" +
               "  document.getElementsByTagName('head')[0].appendChild(s); \r\n" +
               "})();\r\n"

    f.write(jsString)
  end
end


desc 'Compile JavaScript'
task :compile => [:init, :compile_scenario, :compile_jstd_scenario_adapter, :generate_ie_compat] do

  deps = [
      'src/angular.prefix',
      ANGULAR,
      'src/angular.suffix',
  ]

  File.open(path_to('angular.js'), 'w') do |f|
    concat = 'cat ' + deps.flatten.join(' ')
    f.write(%x{#{concat}}.
              gsub(/^\s*['"]use strict['"];?\s*$/, ''). # remove all file-specific strict mode flags
              gsub(/'USE STRICT'/, "'use strict'"))     # rename the placeholder in angular.prefix
    f.write(gen_css('css/angular.css', true))
  end

  %x(java -jar lib/closure-compiler/compiler.jar \
        --compilation_level SIMPLE_OPTIMIZATIONS \
        --language_in ECMASCRIPT5_STRICT \
        --js #{path_to('angular.js')} \
        --js_output_file #{path_to('angular.min.js')})
end


desc 'Generate docs'
task :docs do
  `node docs/src/gen-docs.js`
end


desc 'Create angular distribution'
task :package => [:clean, :compile, :docs] do
  v = YAML::load( File.open( 'version.yaml' ) )['version']
  match = v.match(/^([^-]*)(-snapshot)?$/)
  version = match[1] + (match[2] ? ('-' + %x(git rev-parse HEAD)[0..7]) : '')

  tarball = "angular-#{version}.tgz"

  pkg_dir = path_to("pkg/angular-#{version}")
  FileUtils.rm_r(path_to('pkg'), :force => true)
  FileUtils.mkdir_p(pkg_dir)

  ['src/angular-mocks.js',
    path_to('angular.js'),
    path_to('angular.min.js'),
    path_to('angular-ie-compat.js'),
    path_to('angular-scenario.js'),
    path_to('jstd-scenario-adapter.js'),
    path_to('jstd-scenario-adapter-config.js'),
  ].each do |src|
    dest = src.gsub(/^[^\/]+\//, '').gsub(/((\.min)?\.js)$/, "-#{version}\\1")
    FileUtils.cp(src, pkg_dir + '/' + dest)
  end

  FileUtils.cp_r path_to('docs'), "#{pkg_dir}/docs-#{version}"

  File.open("#{pkg_dir}/docs-#{version}/index.html", File::RDWR) do |f|
    text = f.read
    f.rewind
    f.write text.sub('angular.min.js', "angular-#{version}.min.js")
  end

  File.open("#{pkg_dir}/docs-#{version}/docs-scenario.html", File::RDWR) do |f|
    text = f.read
    f.rewind
    f.write text.sub('angular-scenario.js', "angular-scenario-#{version}.js")
  end

  File.open("#{pkg_dir}/docs-#{version}/appcache.manifest", File::RDWR) do |f|
    text = f.read
    f.rewind
    f.write text.sub('angular.min.js', "angular-#{version}.min.js")
  end


  %x(tar -czf #{path_to(tarball)} -C #{path_to('pkg')} .)

  FileUtils.cp path_to(tarball), pkg_dir
  FileUtils.mv pkg_dir, path_to(['pkg', version])

  puts "Package created: #{path_to(tarball)}"
end


namespace :server do

  desc 'Run JsTestDriver Server'
  task :start do
    sh %x(java -jar lib/jstestdriver/JsTestDriver.jar --browser open --port 9876)
  end

  desc 'Run JavaScript tests against the server'
  task :test do
    sh %(java -jar lib/jstestdriver/JsTestDriver.jar --tests all)
  end

end


desc 'Run JavaScript tests'
task :test do
  sh %(java -jar lib/jstestdriver/JsTestDriver.jar --tests all --browser open --port 9876)
end


desc 'Lint'
task :lint do
  out = %x(lib/jsl/jsl -conf lib/jsl/jsl.default.conf)
  print out
end


desc 'push_angularjs'
task :push_angularjs => :compile do
  sh %(cat angularjs.ftp | ftp -N angularjs.netrc angularjs.org)
end



###################
# utility methods #
###################


##
# generates css snippet from a given files and optionally applies simple minification rules
#
def gen_css(cssFile, minify = false)
  css = ''
  File.open(cssFile, 'r') do |f|
    css = f.read
  end

  if minify
    css.gsub! /\n/, ''
    css.gsub! /\/\*.*?\*\//, ''
    css.gsub! /:\s+/, ':'
    css.gsub! /\s*\{\s*/, '{'
    css.gsub! /\s*\}\s*/, '}'
    css.gsub! /\s*\,\s*/, ','
    css.gsub! /\s*\;\s*/, ';'
  end

  #escape for js
  css.gsub! /\\/, "\\\\\\"
  css.gsub! /'/, "\\\\'"
  css.gsub! /\n/, "\\n"

  return %Q{angular.element(document).find('head').append('<style type="text/css">#{css}</style>');}
end


##
# returns path to the file in the build directory
#
def path_to(filename)
  return File.join(BUILD_DIR, *filename)
end
