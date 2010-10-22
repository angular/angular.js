# <angular/> 0.9.1 repulsion-field (in-progress) #

### Breaking changes
- $cookieStore service is not globally published any more, if you use it, you must request it via
  $inject as any other non-global service



# <angular/> 0.9.0 dragon-breath (2010-10-20) #

### Security
- angular.fromJson not safei (issue #57)
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
