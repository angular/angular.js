include FileUtils

ANGULAR = [
  'src/Angular.js',
  'src/JSON.js',
  'src/Compiler.js',
  'src/Scope.js',
  'src/Injector.js',
  'src/Parser.js',
  'src/Resource.js',
  'src/Browser.js',
  'src/jqLite.js',
  'src/apis.js',
  'src/filters.js',
  'src/formatters.js',
  'src/validators.js',
  'src/services.js',
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
  'src/scenario/HtmlUI.js',
  'src/scenario/Describe.js',
  'src/scenario/Runner.js',
  'src/scenario/SpecRunner.js',
  'src/scenario/dsl.js',
  'src/scenario/matchers.js',
]

BUILD_DIR = 'build'

task :default => [:compile, :test]


desc 'Clean Generated Files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.mkdir(BUILD_DIR)
end


desc 'Compile Scenario'
task :compile_scenario do

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





desc 'Generate IE css js patch'
task :generate_ie_compat do
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
               "  var jsUri = document.location.href.replace(/\\/[^\/]+(#.*)?$/, '/') + " +
               "              document.getElementById('ng-ie-compat').src; \r\n" +
               "  var css = '#{cssString}' \r\n" +
               "  var s = document.createElement('style'); \r\n" +
               "  s.setAttribute('type', 'text/css'); \r\n" +
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
task :compile => [:compile_scenario, :generate_ie_compat] do

  deps = [
      'src/angular.prefix',
      ANGULAR,
      'src/angular.suffix',
  ]

  File.open(path_to('angular.js'), 'w') do |f|
    concat = 'cat ' + deps.flatten.join(' ')
    f.write(%x{#{concat}})
    f.write(gen_css('css/angular.css', true))
  end

  %x(java -jar lib/compiler-closure/compiler.jar \
        --compilation_level SIMPLE_OPTIMIZATIONS \
        --js #{path_to('angular.js')} \
        --js_output_file #{path_to('angular.min.js')})
end


desc 'Create angular distribution'
task :package => :compile do
  v = YAML::load( File.open( 'version.yaml' ) )['version']
  match = v.match(/^([^-]*)(-snapshot)?$/)
  version = match[1] + (match[2] ? ('-' + %x(git rev-parse HEAD)[0..7]) : '')

  tarball = "angular-#{version}.tgz"

  pkg_dir = path_to("pkg/angular-#{version}")
  FileUtils.rm_r(path_to('pkg'), :force => true)
  FileUtils.mkdir_p(pkg_dir)

  ['test/angular-mocks.js',
    path_to('angular.js'),
    path_to('angular.min.js'),
    path_to('angular-ie-compat.js'),
    path_to('angular-scenario.js')
  ].each do |src|
    dest = src.gsub(/^[^\/]+\//, '').gsub(/((\.min)?\.js)$/, "-#{version}\\1")
    FileUtils.cp(src, pkg_dir + '/' + dest)
  end

  %x(tar -czf #{path_to(tarball)} -C #{path_to('pkg')} .)

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

  return %Q{document.write('<style type="text/css">#{css}</style>');}
end


##
# returns path to the file in the build directory
#
def path_to(filename)
  return File.join(BUILD_DIR, filename)
end
