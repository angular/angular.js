# ng-closure-runner [![Build Status](https://travis-ci.org/angular/ng-closure-runner.png)](https://travis-ci.org/angular/ng-closure-runner)

Wraps Google Closure Compiler for AngularJS-specific compile passes

## Hacking

ng-closure-runner is a lightweight runner around the 
[Google Closure Compiler](https://developers.google.com/closure/compiler/). For
a complete description of how Closure Compiler works, refer to the
[source code](https://code.google.com/p/closure-compiler/source/browse/) and
[javadoc](http://javadoc.closure-compiler.googlecode.com/git/index.html). Refer
to `src/org/angularjs/closurerunner/MinerrPass.java` as an example of how to
write a custom compiler pass.

We use [Gradle](http://www.gradle.org) to build. You'll need a current JDK 
(version 1.6 or higher). To compile and run the tests:

```
$ gradle check
```

Submissions should include corresponding tests.

## Releases

Releases should be handled by the core Angular team.

To create a new release: 

1. Run `gradle distZip`. 
2. Commit the updated file in `assets/ng-closure-runner.zip`
3. Create a tag pointing to the commit. 
4. In Angular, update the reference in `bower.json` to use the new tag.
5. That's it! You're done.
