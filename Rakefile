require 'yaml'
include FileUtils


## High level flow of the build:
##
## clean -> init -> concat -> minify -> package
##


content = File.open('angularFiles.js', 'r') {|f| f.read }
files = eval(content.gsub(/\};(\s|\S)*/, '}').
            gsub(/angularFiles = /, '').
            gsub(/:/, '=>').
            gsub(/\/\//, '#'));

BUILD_DIR = 'build'

task :default => [:package]


desc 'Init the build workspace'
task :init do
  FileUtils.mkdir(BUILD_DIR) unless File.directory?(BUILD_DIR)

  v = YAML::load( File.open( 'version.yaml' ) )
  match = v['version'].match(/^([^-]*)(-snapshot)?$/)

  NG_VERSION = Struct.new(:full, :major, :minor, :dot, :codename, :stable).
                      new(match[1] + (match[2] ? ('-' + %x(git rev-parse HEAD)[0..7]) : ''),
                          match[1].split('.')[0],
                          match[1].split('.')[1],
                          match[1].split('.')[2].sub(/\D+.*$/, ''),
                          v['codename'],
                          v['stable'])
end


desc 'Clean Generated Files'
task :clean do
  FileUtils.rm_r(BUILD_DIR, :force => true)
  FileUtils.mkdir(BUILD_DIR)
  FileUtils.rm_r('test_out', :force => true)
end


desc 'Concat Scenario'
task :concat_scenario => :init do

  concat_file('angular-scenario.js', [
      'lib/jquery/jquery.js',
      'src/ngScenario/angular.prefix',
      files['angularSrc'],
      files['angularScenario'],
      'src/ngScenario/angular.suffix',
  ], gen_css('css/angular.css') + "\n" + gen_css('css/angular-scenario.css'))
end


desc 'Concat JSTD Scenario Adapter'
task :concat_jstd_scenario_adapter => :init do

  concat_file('jstd-scenario-adapter.js', [
      'src/ngScenario/jstd-scenario-adapter/angular.prefix',
      'src/ngScenario/jstd-scenario-adapter/Adapter.js',
      'src/ngScenario/jstd-scenario-adapter/angular.suffix',
  ])

  # TODO(vojta) use jstd configuration when implemented
  # (instead of including jstd-adapter-config.js)
  File.open(path_to('jstd-scenario-adapter-config.js'), 'w') do |f|
    f.write("/**\r\n" +
            " * Configuration for jstd scenario adapter \n */\n" +
            "var jstdScenarioAdapter = {\n  relativeUrlPrefix: '/build/docs/'\n};\n")
  end
end



desc 'Concat AngularJS files'
task :concat => :init do
  concat_file('angular.js', [
        'src/angular.prefix',
        files['angularSrc'],
        'src/angular.suffix',
      ], gen_css('css/angular.css', true))

  FileUtils.cp_r 'src/ngLocale', path_to('i18n')

  concat_file('angular-loader.js', [
      'src/loader.prefix',
      'src/loader.js',
      'src/loader.suffix'])


  concat_module('sanitize', [
      'src/ngSanitize/sanitize.js',
      'src/ngSanitize/directive/ngBindHtml.js',
      'src/ngSanitize/filter/linky.js'])

  concat_module('resource', ['src/ngResource/resource.js'])
  concat_module('cookies', ['src/ngCookies/cookies.js'])
  concat_module('bootstrap', ['src/bootstrap/bootstrap.js'])
  concat_module('bootstrap-prettify', ['src/bootstrap/bootstrap-prettify.js',
                                       'src/bootstrap/google-prettify/prettify.js'],
                               gen_css('src/bootstrap/google-prettify/prettify.css', true))


  FileUtils.cp 'src/ngMock/angular-mocks.js', path_to('angular-mocks.js')

  rewrite_file(path_to('angular-mocks.js')) do |content|
    content.sub!('"NG_VERSION_FULL"', NG_VERSION.full)
  end
end


desc 'Minify JavaScript'
task :minify => [:init, :concat, :concat_scenario, :concat_jstd_scenario_adapter] do
  [ 'angular.js',
    'angular-cookies.js',
    'angular-loader.js',
    'angular-resource.js',
    'angular-sanitize.js',
    'angular-bootstrap.js',
    'angular-bootstrap-prettify.js'
  ].each do |file|
    fork { closure_compile(file) }
  end

  Process.waitall
end


desc 'Generate version.txt and version.json files'
task :version => [:init] do
  `echo #{NG_VERSION.full} > #{path_to('version.txt')}`
  `echo '{
  "full": "#{NG_VERSION.full}",
  "major": "#{NG_VERSION.major}",
  "minor": "#{NG_VERSION.minor}",
  "dot": "#{NG_VERSION.dot}",
  "codename": "#{NG_VERSION.codename}"\n}' > #{path_to('version.json')}`
end


desc 'Generate docs'
task :docs => [:init] do
  `node docs/src/gen-docs.js`

  [ path_to('docs/.htaccess'),
    path_to('docs/index.html'),
    path_to('docs/index-debug.html'),
    path_to('docs/index-nocache.html'),
    path_to('docs/index-jq.html'),
    path_to('docs/index-jq-debug.html'),
    path_to('docs/index-jq-nocache.html'),
    path_to('docs/docs-scenario.html')
  ].each do |src|
    rewrite_file(src) do |content|
      content.sub!('"NG_VERSION_FULL"', NG_VERSION.full).
              sub('"NG_VERSION_STABLE"', NG_VERSION.stable)
    end
  end
end


desc 'Create angular distribution'
task :package => [:clean, :minify, :version, :docs] do
  zip_dir = "angular-#{NG_VERSION.full}"
  zip_file = "#{zip_dir}.zip"

  FileUtils.ln_s BUILD_DIR, zip_dir
  %x(zip -r #{zip_file} #{zip_dir})
  FileUtils.rm zip_dir

  FileUtils.mv zip_file, path_to(zip_file)

  puts "Package created: #{path_to(zip_file)}"
end


desc 'Start development webserver'
task :webserver, :port do |t, args|
  exec "node lib/nodeserver/server.js #{args[:port]}"
end


desc 'Run all AngularJS tests'
task :test, :browsers, :misc_options do |t, args|
  [ 'test:jqlite',
    'test:jquery',
    'test:modules',
    'test:e2e'
  ].each do |task|
    Rake::Task[task].invoke(args[:browsers], args[:misc_options])
  end
end


namespace :test do

  desc 'Run all unit tests (single run)'
  task :unit, :browsers, :misc_options do |t, args|
    [ 'test:jqlite',
      'test:jquery',
      'test:modules'
    ].each do |task|
      Rake::Task[task].invoke(args[:browsers], args[:misc_options])
    end
  end


  desc 'Run jqLite-based unit test suite (single run)'
  task :jqlite, :browsers, :misc_options do |t, args|
    start_testacular('testacular-jqlite.conf.js', true, args[:browsers], args[:misc_options])
  end


  desc 'Run jQuery-based unit test suite (single run)'
  task :jquery, :browsers, :misc_options do |t, args|
    start_testacular('testacular-jquery.conf.js', true, args[:browsers], args[:misc_options])
  end


  desc 'Run bundled modules unit test suite (single run)'
  task :modules, :browsers, :misc_options do |t, args|
    start_testacular('testacular-modules.conf.js', true, args[:browsers], args[:misc_options])
  end


  desc 'Run e2e test suite (single run)'
  task :e2e, :browsers, :misc_options do |t, args|
    start_testacular('testacular-e2e.conf.js', true, args[:browsers], args[:misc_options])
  end
end


namespace :autotest do

  desc 'Run jqLite-based unit test suite (autowatch)'
  task :jqlite, :browsers, :misc_options do |t, args|
    start_testacular('testacular-jqlite.conf.js', false, args[:browsers], args[:misc_options])
  end


  desc 'Run jQuery-based unit test suite (autowatch)'
  task :jquery, :browsers, :misc_options do |t, args|
    start_testacular('testacular-jquery.conf.js', false, args[:browsers], args[:misc_options])
  end
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


##
# returns the 32-bit mode force flags for java compiler if supported, this makes the build much
# faster
#
def java32flags
  return '-d32 -client' unless Rake::Win32.windows? || `java -version -d32 2>&1`.match(/Error/i)
end


def closure_compile(filename)
  puts "Minifying #{filename} ..."

  min_path = path_to(filename.gsub(/\.js$/, '.min.js'))

  %x(java \
        #{java32flags()} \
        -jar lib/closure-compiler/compiler.jar \
        --compilation_level SIMPLE_OPTIMIZATIONS \
        --language_in ECMASCRIPT5_STRICT \
        --js #{path_to(filename)} \
        --js_output_file #{min_path})

  rewrite_file(min_path) do |content|
    content.sub!("'use strict';", "").
            sub!(/\(function\([^)]*\)\{/, "\\0'use strict';")
  end
end


def concat_file(filename, deps, footer='')
  puts "Creating #{filename} ..."
  File.open(path_to(filename), 'w') do |f|
    concat = 'cat ' + deps.flatten.join(' ')

    content = %x{#{concat}}.
              gsub('"NG_VERSION_FULL"', NG_VERSION.full).
              gsub('"NG_VERSION_MAJOR"', NG_VERSION.major).
              gsub('"NG_VERSION_MINOR"', NG_VERSION.minor).
              gsub('"NG_VERSION_DOT"', NG_VERSION.dot).
              gsub('"NG_VERSION_CODENAME"', NG_VERSION.codename).
              gsub(/^\s*['"]use strict['"];?\s*$/, ''). # remove all file-specific strict mode flags
              sub(/\(function\([^)]*\)\s*\{/, "\\0\n'use strict';") # add single strict mode flag

    f.write(content)
    f.write(footer)
  end
end


def concat_module(name, files, footer='')
  concat_file('angular-' + name + '.js', ['src/module.prefix'] + files + ['src/module.suffix'], footer)
end


def rewrite_file(filename)
  File.open(filename, File::RDWR) do |f|
    content = f.read

    content = yield content

    raise "File rewrite failed - No content!" unless content

    f.truncate 0
    f.rewind
    f.write content
  end
end


def start_testacular(config, singleRun, browsers, misc_options)
  sh "./node_modules/testacular/bin/testacular start " +
                "#{config} " +
                "#{'--single-run=true' if singleRun} " +
                "#{'--browsers=' + browsers.gsub('+', ',') if browsers} " +
                "#{(misc_options || '').gsub('+', ',')}"
end
