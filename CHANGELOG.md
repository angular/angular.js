# <angular/> 0.9.10 flea-whisperer  (in-progress) #



# <angular/> 0.9.9 time-shift (2011-01-13) #

### Security
- Added a just in case security check for JSON parsing. (commit 5f080193)
- Completed security review with the Google Security Team.

### Performance
- $location and $cookies services are now lazily initialized to avoid the polling overhead when
  not needed.
- $location service now listens for `onhashchange` events (if supported by browser) instead of
  constant polling. (commit 16086aa3)
- input widgets known listens on keydown events instead of keyup which improves perceived
  performance (commit 47c454a3)
- angular boots significantly sooner by listening for DOMContentLoaded event instead of
  window.load when supported by browser (commit c79aba92)
- new service $updateView which may be used in favor of $root.$eval() to run a complete eval on
  the entire document. This service bulks and throttles DOM updates to improve performance.
  (commit 47c454a3)

### Docs
- Major improvements to the doc parser (commit 4f22d686)
- Docs now offline enabled (all dependencies are bundled in the tarball) (commit 4f5d5029)
- Added support for navigating the docs app with keyboard shortcuts (tab and ctrl+alt+s)

### Bugfixes
- `angular.Object.equals` now properly handless comparing an object with a null (commit b0be87f6)
- Several issues were addressed in the `$location` service (commit 23875cb3)
- angular.filter.date now properly handles some corner-cases (issue #159 - fix contributed by Vojta)

### Breaking changes
- API for accessing registered services — `scope.$inject` — was renamed to
  [`scope.$service`](http://docs.angularjs.org/#!angular.scope.$service). (commit b2631f61)

- Support for `eager-published` services was removed. This change was done to make explicit
  dependency declaration always required in order to allow making relatively expensive services
  lazily initialized (e.g. $cookie, $location), as well as remove 'magic' and reduce unnecessary
  scope namespace pollution. (commit 3ea5941f)

  Complete list of affected services:

  - $location
  - $route
  - $cookies
  - $window
  - $document
  - $exceptionHandler
  - $invalidWidgets

  To temporarily preserve the 'eager-published' status for these services, you may use `ng:init`
  (e.g. `ng:init="$location = $service('$location'), ...`) in the view or more correctly create
  a service like this:

      angular.service('published-svc-shim', function() {
        this.$location = this.$service('$location');
        this.$route = this.$service('$route');
        this.$cookies = this.$service('$cookies');
        this.$window = this.$service('$window');
        this.$document = this.$service('$document');
        this.$exceptionHandler = this.$service('$exceptionHandler');
        this.$invalidWidgets = this.$service('$invalidWidgets');
      }, {$eager: true});

- In the light of the `eager-published` change, to complete the cleanup we renamed `$creation`
  property of services to `eager` with its value being a boolean.
  To transition, please rename all `$creation: 'eager'` declarations to `$eager: true`.
  (commit 1430c6d6)

- `angular.foreach` was renamed to `angular.forEach` to make the api consistent. (commit 0a6cf70d)

- The `toString` method of the `angular.service.$location` service was removed. (commit 23875cb3)


# <angular/> 0.9.8 astral-projection (2010-12-23) #

### Docs/Getting started
- angular-seed project to get you hacking on an angular apps quickly
  https://github.com/angular/angular-seed

### Performance
- Delegate JSON parsing to native parser (JSON.parse) if available

### Bug Fixes
- Ignore input widgets which have no name (issue #153)


# <angular/> 0.9.7 sonic-scream (2010-12-10) #

### Bug Fixes
- $defer service should always call $eval on the root scope after a callback runs (issue #189)
- fix for failed assignments of form obj[0].name=value (issue #169)
- significant parser improvements that resulted in lower memory usage
  (commit 23fc73081feb640164615930b36ef185c23a3526)

### Docs
- small docs improvements (mainly docs for the $resource service)

### Breaking changes
- Angular expressions in the view used to support regular expressions. This feature was rarely 
  used and added unnecessary complexity. It not a good idea to have regexps in the view anyway, 
  so we removed this support. If you had any regexp in your views, you will have to move them to 
  your controllers. (commit e5e69d9b90850eb653883f52c76e28dd870ee067)


# <angular/> 0.9.6 night-vision (2010-12-06) #

### Security
- several improvements in the HTML sanitizer code to prevent code execution via `href`s and other
  attributes.
  Commits:
  - 41d5938883a3d06ffe8a88a51efd8d1896f7d747
  - 2bbced212e2ee93948c45360fee00b2e3f960392

### Docs
- set up http://docs.angularjs.org domain, the docs for the latest release will from now on be
  deployed here.
- docs app UI polishing with dual scrolling and other improvements

### Bug Fixes
- `select` widget now behaves correctly when it's `option` items are created via `ng:repeat` 
  (issue #170)
- fix for async xhr cache issue #152 by adding `$browser.defer` and `$defer` service

### Breaking Changes
- Fix for issue #152 might break some tests that were relying on the incorrect behavior. The
  breakage will usually affect code that tests resources, xhr or services/widgets build on top of
  these. All that is typically needed to resolve the issue is adding a call to
  `$browser.defer.flush()` in your test just before the point where you expect all cached
  resource/xhr requests to return any results. Please see 011fa39c2a0b5da843395b538fc4e52e5ade8287
  for more info.
- The HTML sanitizer is slightly more strinct now. Please see info in the "Security" section above.


# <angular/> 0.9.5 turkey-blast (2010-11-25) #

### Docs
- 99% of the content from the angular wiki is now in the docs

### Api
- added `angular.Array.limitTo` to make it easy to select first or last few items of an array


# <angular/> 0.9.4 total-recall (2010-11-18) #

### Docs
- searchable docs
- UI improvements
- we now have ~85% of the wiki docs migrated to ng docs
- some but not all docs were updated along the way


### Api
- ng:include now supports `onload` attribute (commit cc749760)

### Misc
- Better error handling - compilation exception now contain stack trace (commit b2d63ac4)


# <angular/> 0.9.3 cold-resistance (2010-11-10) #

### Docs
- prettier docs app with syntax highlighting for examples, etc
- added documentation, examples and scenario tests for many more apis including:
  - all directives
  - all formatters
  - all validators
  - some widgets

### Api
- date filter now accepts strings that angular.String.toDate can convert to Date objects
- angular.String.toDate supports ISO8061 formated strings with all time fractions being optional
- ng:repeat now exposes $position with values set to 'first', 'middle' or 'last'
- ng:switch now supports ng:switch-default as fallback switch option

### Breaking changes
- we now support ISO 8601 extended format datetime strings (YYYY-MM-DDTHH:mm:ss.SSSZ) as defined
  in EcmaScript 5 throughout angular. This means that the following apis switched from
  YYYY-MM-DDTHH:mm:ssZ to YYYY-MM-DDTHH:mm:ss.SSSZ (note the added millis) when representing dates:
  - angular.Date.toString
  - angular.String.fromDate
  - JSON serialization and deserialization (used by json filter, $xhr and $resource)
- removed SSN validator. It's unlikely that most people will need it and if they do, it can be added
  simple RegExp validator.


# <angular/> 0.9.2 faunal-mimicry (2010-11-03) #

### Docs
- created documentation framework based on jsdoc syntax (commit 659af29a)
  - jsdoc parser
  - template generator
  - json generator
  - angular doc viewer app
  - scenario runner for all example code
- documentation for all angular filters (commits 1fe7e3a1 & 1ba8c2a33)
  - docs
  - example code
  - scenario tests for example code

### Testability
#### Scenario Runner
- binding DSL in Scenario can now match bindings without specifying filters
- dsl statements now accept a label argument to make test output more readable (issue #94)
- dsl element() statement now implements most of the jQuery API (issue #106)
- new browser() dsl statement for getting info about the emulated browser running the app
  (issue #109)
- scenario runner is now compatible with IE8 (issue #93)
- scenarior runner checks if URL would return a non-success status code (issue #100)
- binding() DSL now accepts regular expressions
- new textarea() scenario runner DSL for entering text into textareas

### Misc
- lots of small bugfixes

### Breaking changes
#### Scenario Runner
- navigating to about:blank is no longer supported. It results in a sandbox error
- navigateTo() is now browser().navigateTo(). Old code must be updated
- file:// URLs are no longer supported for running a scenario. You must use a web server that
  implements HEAD


# <angular/> 0.9.1 repulsion-field (2010-10-26) #

### Security
- added html sanitizer to fix the last few known security issues (issues #33 and #34)

### API
- new ng:submit directive for creating onSubmit handlers on forms (issue #76)
- the date filter now accepts milliseconds as well as date strings (issue #78)
- the html filter now supports 'unsafe' option to bypass html sanitization

### Testability
- lots of improvements related to the scenario runner (commit 40d7e66f)

### Demo
- added a new demo application: Personal Log (src example/personalLog)

### Chores
- lots of fixes to get all tests pass on IE
- added TzDate type to allow us to create timezone idependent tests (issue #88)

### Breaking changes
- $cookieStore service is not globally published any more, if you use it, you must request it via
  $inject as any other non-global service
- html filter now sanitizes html content for XSS attacks which may result in different behavior


# <angular/> 0.9.0 dragon-breath (2010-10-20) #

### Security
- angular.fromJson not safer (issue #57)
- readString consumes invalid escapes (issue #56)
- use new Function instead of eval (issue #52)

### Speed
- css cleanup + inline all css and images in the main js (issue #64)

### Testability
- initial version of the built-in end-to-end scenario runner (issues #50, #67, #70)

### API
- allow ng:controller nesting (issue #39)
- new built-in date format filter (issue #45)
- $location needs method you call on updates (issue #32)


### Chores
- release versioning + file renaming (issue #69)

### Breaking changes
- $location.parse was replaced with $location.update
- all css and img files were inlined into the main js file, to support IE7 and older app must host
  angular-ie-compat.js file

### Big Thanks to Our Community Contributors
- Vojta Jina
