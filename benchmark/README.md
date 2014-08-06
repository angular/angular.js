
# Benchpress Lite

This is a detached, experimental build of
[benchpress](https://github.com/angular/benchpress), similar to what exists in
[AngularDart](https://github.com/angular/angular.dart). Its purpose is to allow creation and
sampling of macro benchmarks to compare performance of real world use cases of Angular
between different historical versions of Angular.

## Creating Benchmarks

Steps assume "angular.js/benchmark" as root directory.
See the example benchmark inside `benchmarks/table/`.

 1. Create a directory in benchmarks/<benchmark-name>
 1. Add a file called "main.html" which is the html that will be interpolated into the benchmark
   runner template. This is where the markup for the Angular app being tested should live.
 1. Create any scripts, html files, or other dependent files in the same folder.
 1. Run `./build.js` to generate the combined benchmark runner
 1. From the "benchmark" directory, run `grunt webserver`
 1. Launch Browser (Chrome Canary provides most accurate memory data, See
    [Launching Canary](#launching-canary) for instructions on testing in Chrome
    Canary)
 1. Browse to `localhost:8000/build/<benchmark-name>`

The benchpress library adds an array to the window object called "benchmarkSteps," which is where
a benchmark should push benchmark configuration objects. The object should contain a `name`, which
is what the benchmark shows up as in the report, and a `fn`, which is the function that gets
evaluated and timed.

```javascript
window.benchmarkSteps.push({
  name: 'Something Expensive',
  fn: function() {
    someExpensiveOperation();
  }
})
```

During the build process, any .js files found in the benchmark folder will be added as `<script>`
tags in alphabetical order by filename.

### Preparation and cleanup

There are no sophisticated mechanisms for preparing or cleaning up after tests. A benchmark should
add a step before or after the real test in order to do test setup or cleanup. All steps will show
up in reports.

### Testing Different AngularJS Builds

Benchpress will load angular.js that is currently in the build/ folder. So to test performance
across different builds, checkout the SHA to test against, build it, then checkout head again to run
the benchmark.

## Launching Canary

For Mac and Linux computers, a utility script is included to launch Chrome Canary with special
flags to allow manual garbage collection, as well as high resolution memory reporting. Unless
Chrome Canary is used, these features are not available, and reports will be lacking information.

```
$ ./launch_chrome.sh
```

## Running Benchmarks

After opening the benchmark in the browser as described in
[Creating Benchmarks](#creating-benchmarks), the test execution may be configured in two ways:

 1. Number of samples to collect
 1. How many test cycles to run

The number of samples tells benchpress "analyze the most recent n samples for reporting." If the
number of samples is 20, and a user runs a loop 99 times, the last 20 samples are the only
ones that are calculated in the reports. This value is controlled by a text input at the top of the
screen, which is set to 20 by default.

The number of times a test cycle executes is set by pressing the button representing how many
cycles should be performed. Options are:

 * Loop: Keep running until the loop is paused
 * Once: Run one cycle (note that the samples will still be honored, pressing once 100 times will
   still collect the number of samples specified in the text input)
 * 25x: Run 25 cycles and stop, still honoring the specified number of samples to collect
