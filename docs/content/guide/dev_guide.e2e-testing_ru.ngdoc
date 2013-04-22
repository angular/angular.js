@workInProgress
@ngdoc overview
@name Developer Guide: E2E Testing
@description

As applications grow in size and complexity, it becomes unrealistic to rely on manual testing to
verify the correctness of new features, catch bugs and notice regressions.

To solve this problem, we have built an Angular Scenario Runner which simulates user interactions
that will help you verify the health of your Angular application.

# Overview
You will write scenario tests in JavaScript, which describe how your application should behave,
given a certain interaction in a specific state. A scenario is comprised of one or more `it` blocks
(you can think of these as the requirements of your application), which in turn are made of
**commands** and **expectations**. Commands tell the Runner to do something with the application
(such as navigate to a page or click on a button), and expectations tell the Runner to assert
something about the state (such as the value of a field or the current URL). If any expectation
fails, the runner marks the `it`  as "failed" and continues on to the next one. Scenarios may also
have **beforeEach** and **afterEach** blocks, which will be run before (or after) each `it`  block,
regardless of whether they pass or fail.

<img src="img/guide/scenario_runner.png">

In addition to the above elements, scenarios may also contain helper functions to avoid duplicating
code in the `it` blocks.

Here is an example of a simple scenario:
<pre>
describe('Buzz Client', function() {
it('should filter results', function() {
  input('user').enter('jacksparrow');
  element(':button').click();
  expect(repeater('ul li').count()).toEqual(10);
  input('filterText').enter('Bees');
  expect(repeater('ul li').count()).toEqual(1);
});
});
</pre>
This scenario describes the requirements of a Buzz Client, specifically, that it should be able to
filter the stream of the user. It starts by entering a value in the 'user' input field, clicking
the only button on the page, and then it verifies that there are 10 items listed. It then enters
'Bees' in the 'filterText' input field and verifies that the list is reduced to a single item.

The API section below lists the available commands and expectations for the Runner.

# API
Source: {@link https://github.com/angular/angular.js/blob/master/src/ngScenario/dsl.js}

## pause()
Pauses the execution of the tests until you call `resume()` in the console (or click the resume
link in the Runner UI).

## sleep(seconds)
Pauses the execution of the tests for the specified number of `seconds`.

## browser().navigateTo(url)
Loads the `url` into the test frame.

## browser().navigateTo(url, fn)
Loads the URL returned by `fn` into the testing frame. The given `url` is only used for the test
output. Use this when the destination URL is dynamic (that is, the destination is unknown when you
write the test).

## browser().reload()
Refreshes the currently loaded page in the test frame.

## browser().window().href()
Returns the window.location.href of the currently loaded page in the test frame.

## browser().window().path()
Returns the window.location.pathname of the currently loaded page in the test frame.

## browser().window().search()
Returns the window.location.search of the currently loaded page in the test frame.

## browser().window().hash()
Returns the window.location.hash (without `#`) of the currently loaded page in the test frame.

## browser().location().url()
Returns the {@link api/ng.$location $location.url()} of the currently loaded page in
the test frame.

## browser().location().path()
Returns the {@link api/ng.$location $location.path()} of the currently loaded page in
the test frame.

## browser().location().search()
Returns the {@link api/ng.$location $location.search()} of the currently loaded page
in the test frame.

## browser().location().hash()
Returns the {@link api/ng.$location $location.hash()} of the currently loaded page in
the test frame.

## expect(future).{matcher}
Asserts the value of the given `future` satisfies the `matcher`. All API statements return a
`future` object, which get a `value` assigned after they are executed. Matchers are defined using
`angular.scenario.matcher`, and they use the value of futures to run the expectation. For example:
`expect(browser().location().href()).toEqual('http://www.google.com')`

## expect(future).not().{matcher}
Asserts the value of the given `future` satisfies the negation of the `matcher`.

## using(selector, label)
Scopes the next DSL element selection.

## binding(name)
Returns the value of the first binding matching the given `name`.

## input(name).enter(value)
Enters the given `value` in the text field with the given `name`.

## input(name).check()
Checks/unchecks the checkbox with the given `name`.

## input(name).select(value)
Selects the given `value` in the radio button with the given `name`.

## input(name).val()
Returns the current value of an input field with the given `name`.

## repeater(selector, label).count()
Returns the number of rows in the repeater matching the given jQuery `selector`. The `label` is
used for test output.

## repeater(selector, label).row(index)
Returns an array with the bindings in the row at the given `index` in the repeater matching the
given jQuery `selector`. The `label` is used for test output.

## repeater(selector, label).column(binding)
Returns an array with the values in the column with the given `binding` in the repeater matching
the given jQuery `selector`. The `label` is used for test output.

## select(name).option(value)
Picks the option with the given `value` on the select with the given `name`.

## select(name).option(value1, value2...)
Picks the options with the given `values` on the multi select with the given `name`.

## element(selector, label).count()
Returns the number of elements that match the given jQuery `selector`. The `label` is used for test
output.

## element(selector, label).click()
Clicks on the element matching the given jQuery `selector`. The `label` is used for test output.

## element(selector, label).query(fn)
Executes the function `fn(selectedElements, done)`, where selectedElements are the elements that
match the given jQuery `selector` and `done` is a function that is called at the end of the `fn`
function.  The `label` is used for test output.

## element(selector, label).{method}()
Returns the result of calling `method` on the element matching the given jQuery `selector`, where
`method` can be any of the following jQuery methods: `val`, `text`, `html`, `height`,
`innerHeight`, `outerHeight`, `width`, `innerWidth`, `outerWidth`, `position`, `scrollLeft`,
`scrollTop`, `offset`. The `label` is used for test output.

## element(selector, label).{method}(value)
Executes the `method` passing in `value` on the element matching the given jQuery `selector`, where
`method` can be any of the following jQuery methods: `val`, `text`, `html`, `height`,
`innerHeight`, `outerHeight`, `width`, `innerWidth`, `outerWidth`, `position`, `scrollLeft`,
`scrollTop`, `offset`.  The `label` is used for test output.

## element(selector, label).{method}(key)
Returns the result of calling `method` passing in `key` on the element matching the given jQuery
`selector`, where `method` can be any of the following jQuery methods: `attr`, `prop`, `css`. The
`label` is used for test output.

## element(selector, label).{method}(key, value)
Executes the `method` passing in `key` and `value` on the element matching the given jQuery
`selector`, where `method` can be any of the following jQuery methods: `attr`,  `prop`, `css`.  The
`label` is used for test output.

JavaScript is a dynamically typed language which comes with great power of expression, but it also
come with almost no-help from the compiler. For this reason we feel very strongly that any code
written in JavaScript needs to come with a strong set of tests. We have built many features into
angular which makes testing your angular applications easy. So there is no excuse for not testing.
