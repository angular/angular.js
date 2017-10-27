# Contributing to AngularJS

We'd love for you to contribute to our source code and to make AngularJS even better than it is
today! Here are the guidelines we'd like you to follow:

- [Code of Conduct](#coc)
- [Questions, Bugs, Features](#requests)
  - [Questions and Problems](#question)
  - [Issues and Bugs](#issue)
  - [Feature Requests](#feature)
  - [Improving Documentation](#docs)
  - [Issue Submission Guidelines](#submit)
- [Code & Documentation Contributions](#contributions)
  - [Development Setup](#development-setup)
  - [Coding Rules](#rules)
  - [Writing Documentation](#writing-docs)
  - [Commit Message Guidelines](#commit)
  - [Pull Request Submission Guidelines](#submit-pr)
  - [Signing the CLA](#cla)

## <a name="coc"></a> Code of Conduct

Help us keep AngularJS open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="requests"></a> Questions, Bugs, Features

### <a name="question"></a> Got a Question or Problem?

Do not open issues for general support questions as we want to keep GitHub issues for bug reports
and feature requests. You've got much better chances of getting your question answered on dedicated
support platforms, the best being [Stack Overflow][stackoverflow].

Stack Overflow is a much better place to ask questions since:

- there are thousands of people willing to help on Stack Overflow
- questions and answers stay available for public viewing so your question / answer might help
  someone else
- Stack Overflow's voting system assures that the best answers are prominently visible.

To save your and our time, we will systematically close all issues that are requests for general
support and redirect people to the section you are reading right now.

Other channels for support are:
- the [Google Group][groups] discussion list
- the [AngularJS IRC][irc]
- the [AngularJS Gitter][gitter]

### <a name="issue"></a> Found an Issue or Bug?

If you find a bug in the source code, you can help us by submitting an issue to our
[GitHub Repository][github]. Even better, you can submit a Pull Request with a fix.

**Please see the [Submission Guidelines](#submit) below.**

**Special Note for Localization Issues:** AngularJS uses the [Google Closure I18N library] to
generate its own I18N files (the ngLocale module). This means that any changes to these files
would be lost the next time that we import the library.
Since the Closure library i18n data is itself auto-generated from the data of the
[Common Locale Data Repository (CLDR)] project, errors in the data should
be reported there. See also the [Closure guide to i18n changes].

### <a name="feature"></a> Missing a Feature?

You can request a new feature by submitting an issue to our [GitHub Repository][github-issues].

If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first in an
  [GitHub issue][github-issues] that clearly outlines the changes and benefits of the feature.
* **Small Changes** can directly be crafted and submitted to the [GitHub Repository][github]
  as a Pull Request. See the main section about [Documentation & Code Contributions](#code-contrib)
  and specifically the [Pull Request Submission Guidelines](#submit-pr).

### <a name="docs"></a> Want a Doc Fix?

Should you have a suggestion for the documentation, you can open an issue and outline the problem
or improvement you have - however, creating the doc fix yourself is much better!

If you want to help improve the docs, it's a good idea to let others know what you're working on to
minimize duplication of effort. Create a new issue (or comment on a related existing one) to let
others know what you're working on.

If you're making a small change (typo, phrasing) don't worry about filing an issue first. Use the
friendly blue "Improve this doc" button at the top right of the doc page to fork the repository
in-place and make a quick change on the fly. The commit message is preformatted to the right type
and scope, so you only have to add the description.

For large fixes, please build and test the documentation before submitting the PR to be sure you
haven't accidentally introduced any layout or formatting issues. You should also make sure that your
commit message follows the **[Commit Message Guidelines](#commit)**.

## <a name="submit"></a> Issue Submission Guidelines
Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.

The "[new issue][github-new-issue]" form contains a number of prompts that you should fill out to
make it easier to understand and categorize the issue.

In general, providing the following information will increase the chances of your issue being dealt
with quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **AngularJS Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only specific ones?
* **Reproduce the Error** - provide a live example (using [Plunker][plunker] or
  [JSFiddle][jsfiddle]) or an unambiguous set of steps.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

Here is a great example of a well defined issue: https://github.com/angular/angular.js/issues/5069

**If you get help, help others. Good karma rulez!**


## <a name="contributions"></a> Code and Documentation Contributions

### Development Setup

This document describes how to set up your development environment to build and test AngularJS, and
explains the basic mechanics of using `git`, `node`, `yarn`, `grunt`, and `bower`.

#### Installing Dependencies

Before you can build AngularJS, you must install and configure the following dependencies on your
machine:

* [Git](http://git-scm.com/): The [Github Guide to
  Installing Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Node.js v6.x (LTS)](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.

  We recommend using [nvm](https://github.com/creationix/nvm) (or
  [nvm-windows](https://github.com/coreybutler/nvm-windows))
  to manage and install Node.js, which makes it easy to change the version of Node.js per project.

* [Yarn](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm).
  There are detailed installation instructions available at https://yarnpkg.com/en/docs/install.

* [Java](http://www.java.com): We minify JavaScript using
  [Closure Tools](https://developers.google.com/closure/), which require Java (version 7 or higher)
  to be installed and included in your
  [PATH](http://docs.oracle.com/javase/tutorial/essential/environment/paths.html) variable.

* [Grunt](http://gruntjs.com): We use Grunt as our build system. Install the grunt command-line tool
  globally with:

  ```shell
  yarn global add grunt-cli
  ```

#### Forking AngularJS on Github

To contribute code to AngularJS, you must have a GitHub account so you can push code to your own
fork of AngularJS and open Pull Requests in the [GitHub Repository][github].

To create a Github account, follow the instructions [here](https://github.com/signup/free).
Afterwards, go ahead and [fork](http://help.github.com/forking) the
[main AngularJS repository][github].


#### Building AngularJS

To build AngularJS, you clone the source code repository and use Grunt to generate the non-minified
and minified AngularJS files:

```shell
# Clone your Github repository:
git clone https://github.com/<github username>/angular.js.git

# Go to the AngularJS directory:
cd angular.js

# Add the main AngularJS repository as an upstream remote to your repository:
git remote add upstream "https://github.com/angular/angular.js.git"

# Install node.js dependencies:
yarn install

# Build AngularJS (which will install `bower` dependencies automatically):
grunt package
```

**Note:** If you're using Windows, you must use an elevated command prompt (right click, run as
Administrator). This is because `grunt package` creates some symbolic links.

**Note:** If you're using Linux, and `yarn install` fails with the message
'Please try running this command again as root/Administrator.', you may need to globally install
`grunt` and `bower`:

```shell
sudo yarn global add grunt-cli
sudo yarn global add bower
```

The build output is in the `build` directory. It consists of the following files and
directories:

* `angular-<version>.zip` — The complete zip file, containing all of the release build
artifacts.

* `angular.js` — The non-minified AngularJS script.

* `angular.min.js` —  The minified AngularJS script.

* `angular-scenario.js` — The (deprecated) AngularJS End2End test runner.

* `docs/` — A directory that contains a standalone version of the docs
  (same as served in `docs.angularjs.org`).

#### <a name="local-server"></a> Running a Local Development Web Server

To debug code, run end-to-end tests, and serve the docs, it is often useful to have a local
HTTP server. For this purpose, we have made available a local web server based on Node.js.

1. To start the web server, run:
   ```shell
   grunt webserver
   ```

2. To access the local server, enter the following URL into your web browser:
   ```text
   http://localhost:8000/
   ```
   By default, it serves the contents of the AngularJS project directory.

3. To access the locally served docs, visit this URL:
   ```text
   http://localhost:8000/build/docs/
   ```

#### <a name="unit-tests"></a> Running the Unit Test Suite

We write unit and integration tests with Jasmine and execute them with Karma. To run all of the
tests once on Chrome run:

```shell
grunt test:unit
```

To run the tests on other browsers (Chrome, ChromeCanary, Firefox and Safari are pre-configured) use:

```shell
grunt test:unit --browsers=Chrome,Firefox
```

**Note:** there should be _no spaces between browsers_. `Chrome, Firefox` is INVALID.

If you have a Saucelabs or Browserstack account, you can also run the unit tests on these services
via our pre-defined customLaunchers.

For example, to run the whole unit test suite:

```shell
# Browserstack
grunt test:unit --browsers=BS_Chrome,BS_Firefox,BS_Safari,BS_IE_9,BS_IE_10,BS_IE_11,BS_EDGE,BS_iOS_8,BS_iOS_9,BS_iOS_10
# Saucelabs
grunt test:unit --browsers=BS_Chrome,BS_Firefox,BS_Safari,BS_IE_9,BS_IE_10,BS_IE_11,BS_EDGE,BS_iOS_8,BS_iOS_9,BS_iOS_10
```

Running these commands requires you to set up the [Karma Browserstack][karma-browserstack] or
[Karma-Saucelabs][karma-saucelabs], respectively.

During development, however, it's more productive to continuously run unit tests every time the
source or test files change. To execute tests in this mode run:

1. To start the Karma server, capture Chrome browser and run unit tests, run:

   ```shell
   grunt autotest
   ```

2. To capture more browsers, open this URL in the desired browser (URL might be different if you
   have multiple instance of Karma running, read Karma's console output for the correct URL):

   ```text
   http://localhost:9876/
   ```

3. To re-run tests just change any source or test file.


To learn more about all of the preconfigured Grunt tasks run:

```shell
grunt --help
```


#### <a name="e2e-tests"></a> Running the End-to-end Test Suite

AngularJS's end to end tests are run with Protractor. Simply run:

```shell
grunt test:e2e
```

This will start the webserver and run the tests on Chrome.


## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more [specs][unit-testing].
* All public API methods **must be documented** with ngdoc, an extended version of jsdoc (we added
  support for markdown and templating via @ngdoc tag). To see how we document our APIs, please check
  out the existing source code and see the section about[writing
  documentation](#writing-documentation)
* With the exceptions listed below, we follow the rules contained in
  [Google's JavaScript Style Guide][js-style-guide]:
    * **Do not use namespaces**: Instead,  wrap the entire AngularJS code base in an anonymous
      closure and export our API explicitly rather than implicitly.
    * Wrap all code at **100 characters**.
    * Instead of complex inheritance hierarchies, we **prefer simple objects**. We use prototypal
      inheritance only when absolutely necessary.
    * We **love functions and closures** and, whenever possible, prefer them over objects.
    * To write concise code that can be better minified, we **use aliases internally** that map to
      the external API. See our existing code to see what we mean.
    * We **don't go crazy with type annotations** for private internal APIs unless it's an internal
      API that is used throughout AngularJS. The best guidance is to do what makes the most sense.

### Specific topics

#### Provider configuration

When adding configuration (options) to [providers][providers], we follow a special pattern.

- for each option, add a `method` that ...
  - works as a getter and returns the current value when called without argument
  - works as a setter and returns itself for chaining when called with argument
  - for boolean options, uses the naming scheme `<option>Enabled([enabled])`
- non-primitive options (e.g. objects) should be copied or the properties assigned explicitly to a
  new object so that the configuration cannot be changed during runtime.

For a boolean config example, see [`$compileProvider#debugInfoEnabled`][code.debugInfoEnabled]

For an object config example, see [`$location.html5Mode`][code.html5Mode]

#### Throwing errors

User-facing errors should be thrown with [`minErr`][minErr], a special error function that provides
errors ids, templated error messages, and adds a link to a detailed error description.

The `$compile:badrestrict` error is a good example for a well-defined `minErr`:
[code][code.badrestrict] and [description][docs.badrestrict].


## <a name="writing-docs"></a> Writing Documentation

The AngularJS project uses a form of [jsdoc](http://usejsdoc.org/) called ngdoc for all of its code
documentation.

This means that all the docs are stored inline in the source code and so are kept in sync as it
changes.

There is also extra content (the developer guide, error pages, the tutorial,
and misceallenous pages) that live inside the AngularJS repository as markdown files.

This means that since we generate the documentation from the source code, we can easily provide
version-specific documentation by simply checking out a version of AngularJS and running the build.

Extracting the source code documentation, processing and building the docs is handled by the
documentation generation tool [Dgeni][dgeni].

### Building and viewing the docs locally
The docs can be built from scratch using grunt:

```shell
grunt docs
```

This defers the doc-building task to `gulp`.

Note that the docs app is using the local build files to run. This means you might first have to run
the build:

```shell
grunt build
```

(This is also necessary if you are making changes to minErrors).

To view the docs, see [Running a Local Development Web Server](#local-server).

### Writing jsdoc
The ngdoc utility has basic support for many of the standard jsdoc directives.  But in particular it
is interested in the following block tags:

* `@name name` - the name of the ngdoc document
* `@param {type} name description` - describes a parameter of a function
* `@returns {type} description` - describes what a function returns
* `@requires` - normally indicates that a JavaScript module is required; in an Angular service it is
  used to describe what other services this service relies on
* `@property` - describes a property of an object
* `@description` - used to provide a description of a component in markdown
* `@link` - specifies a link to a URL or a type in the API reference.
  Links to the API have the following structure:

  * the module namespace, followed by `.` (optional, default `ng`)
  * the `@ngdoc` type (see below), followed by `:` (optional, automatically inferred)
  * the name
  * the method, property, or anchor (optional)
  * the display name

  For example: `{@link ng.type:$rootScope.Scope#$new Scope.$new()}`.

* `@example` - specifies an example. This can be a simple code block, or a
  [runnable example](#the-example-tag).
* `@deprecated` - specifies that the following code is deprecated and should not be used.
  In The AngularJS docs, there are two specific patterns which can be used to further describe
  the deprecation: `sinceVersion="<version>"` and `removeVersion="<version>"`

The `type` in `@param` and `@returns` must be wrapped in `{}` curly braces, e.g. `{Object|Array}`.
Parameters can be made optional by *either* appending a `=` to the type, e.g. `{Object=}`, *or* by
putting the `[name]` in square brackets.
Default values are only possible with the second syntax by appending `=<value>` to the parameter
name, e.g. `@param {boolean} [ownPropsOnly=false]`.

Descriptions can contain markdown formatting.

#### AngularJS-specific jsdoc directives

In addition to the standard jsdoc tags, there are a number that are specific to the Angular
code-base:

* `@ngdoc` - specifies the type of thing being documented. See below for more detail.
* `@eventType emit|broadcast` - specifies whether the event is emitted or broadcast
* `@usage` - shows how to use a `function` or `directive`. Is usually automatically generated.
* `@knownIssue` - adds info about known quirks, problems, or limitations with the API, and possibly,
  workarounds. This section is not for bugs.

The following are specific to directives:

* `@animations` - specifies the animations a directive supports
* `@multiElement` - specifies if a directive can span over multiple elements
* `@priority` - specifies a directive's priority
* `@restrict` - is extracted to show the usage of a directive. For example, for [E]lement,
  [A]ttribute, and [C]lass, use `@restrict ECA`
* `@scope` - specifies that a directive will create a new scope

### The `@ngdoc` Directive
This directive helps to specify the template used to render the item being documented.  For instance,
a directive would have different properties to a filter and so would be documented differently.  The
commonly used types are:

* `overview` - a general page (guide, api index)
* `provider` - AngularJS provider, such as `$compileProvider` or `$httpProvider`.
* `service` - injectable AngularJS service, such as `$compile` or `$http`.
* `object` - well defined object (often exposed as a service)
* `function` - function that will be available to other methods (such as a helper function within
  the ng module)
* `method` - method on an object/service/controller
* `property` - property on an object/service/controller
* `event` -  AngularJS event that will propagate through the `$scope` tree.
* `directive` - AngularJS  directive
* `filter` - AngularJS filter
* `error` - minErr error description

### General documentation with Markdown

Any text in tags can contain markdown syntax for formatting. Generally, you can use any markdown
feature.

#### Headings

Only use *h2* headings and lower, as the page title is set in *h1*. Also make sure you follow the
heading hierarchy. This ensures correct table of contents are created.

#### Code blocks
In line code can be specified by enclosing the code in back-ticks (\`).
A block of multi-line code can be enclosed in triple back-ticks (\`\`\`) but it is formatted better
if it is enclosed in &lt;pre&gt;...&lt;/pre&gt; tags and the code lines themselves are indented.

### Writing runnable (live) examples and e2e tests
It is possible to embed examples in the documentation along with appropriate e2e tests. These
examples and scenarios will be converted to runnable code within the documentation.  So it is
important that they work correctly.  To ensure this, all these e2e scenarios are run as part of the
automated Travis tests.

If you are adding an example with an e2e test, you should [run the test locally](#e2e-tests). You
can use `fit` to run only your test.

#### The `<example>` tag
This tag identifies a block of HTML that will define a runnable example. It can take the following attributes:

* `module` - the name of the app module as defined in the example's JavaScript
* `name` - every example should have a name. It should start with the component, e.g directive name,
  and not contain whitespace
* `deps` - Semicolon-separated list of additional angular module files to be loaded,
  e.g. `angular-animate.js`
* `animations` - if set to `true` then this example uses ngAnimate.

Within this tag we provide `<file>` tags that specify what files contain the example code.

```
<example
  module="angularAppModule"
  name="exampleName"
  deps="angular-animate.js;angular-route.js"
  animations="true">
  ...
  <file name="index.html">...</file>
  <file name="script.js">...</file>
  <file name="animations.css">...</file>
  <file name="protractor.js">...</file>
  ...
</example>
```

You can see an example of a well-defined example [in the `ngRepeat` documentation][code.ngRepeat-example].

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the AngularJS change log**.

The commit message formatting can be added using a typical git workflow or through the use of a CLI
wizard ([Commitizen](https://github.com/commitizen/cz-cli)). To use the wizard, run `yarn run commit`
in your terminal after staging your changes in git.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header
of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit
being reverted.
A commit with this format is automatically created by the [`git revert`][git-revert] command.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

You can use `*` when the change affects more than a single scope.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes][closing-issues].

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

### <a name="submit-pr"></a> Pull Request Submission Guidelines
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/angular/angular.js/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

* Create your patch commit, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Run the AngularJS [unit](#unit-tests) and [E2E test](#e2e-tests) suites, and ensure that all tests
  pass. It is generally sufficient to run the tests only on Chrome, as our Travis integration will
  run the tests on all supported browsers.
* Run `grunt eslint` to check that you have followed the automatically enforced coding rules
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit). Adherence to the [commit message conventions](#commit)
  is required, because release notes are automatically generated from these messages.

    ```shell
    git commit -a
    ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Before creating the Pull Request, package and run all tests a last time:

    ```shell
    grunt test
    ```

* Push your branch to GitHub:

    ```shell
    git push <remote> my-fix-branch
    ```

* In GitHub, send a pull request to `angular.js:master`. This will trigger the check of the
[Contributor License Agreement](#cla) and the Travis integration.

* If you find that the Travis integration has failed, look into the logs on Travis to find out
if your changes caused test failures, the commit message was malformed etc. If you find that the
tests failed or times out for unrelated reasons, you can ping a team member so that the build can be
restarted.

* If we suggest changes, then:

  * Make the required updates.
  * Re-run the AngularJS test suite to ensure tests are still passing.
  * Commit your changes to your branch (e.g. `my-fix-branch`).
  * Push the changes to your GitHub repository (this will update your Pull Request).

    You can also amend the initial commits and force push them to the branch.

    ```shell
    git rebase master -i
    git push origin my-fix-branch -f
    ```

    This is generally easier to follow, but seperate commits are useful if the Pull Request contains
    iterations that might be interesting to see side-by-side.

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="cla"></a> Signing the Contributor License Agreement (CLA)

Upon submmitting a Pull Request, a friendly bot will ask you to sign our CLA if you haven't done
so before. Unfortunately, this is necessary for documentation changes, too.
It's a quick process, we promise!

* For individuals we have a [simple click-through form][individual-cla].
* For corporations we'll need you to
  [print, sign and one of scan+email, fax or mail the form][corporate-cla].



[angular-dev]: https://groups.google.com/forum/?fromgroups#!forum/angular-dev
[browserstack]: https://www.browserstack.com/
[closing-issues]: https://help.github.com/articles/closing-issues-via-commit-messages/
[Closure guide to i18n changes]: https://github.com/google/closure-library/wiki/Internationalization-%28i18n%29-changes-in-Closure-Library
[coc]: https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md
[code.badrestrict]: https://github.com/angular/angular.js/blob/202f1809ad14827a6ac6a125157c605d65e0b551/src/ng/compile.js#L1107-L1110
[code.debugInfoEnabled]: https://github.com/angular/angular.js/blob/32fbb2e78f53d765fbb170f7cf99e42e072d363b/src/ng/compile.js#L1378-L1413
[code.html5Mode]: https://github.com/angular/angular.js/blob/202f1809ad14827a6ac6a125157c605d65e0b551/src/ng/location.js#L752-L797
[code.minErr]: https://github.com/angular/angular.js/blob/202f1809ad14827a6ac6a125157c605d65e0b551/src/minErr.js#L53-L113
[code.ngRepeat-example]: https://github.com/angular/angular.js/blob/0822d34b10ea0371c260c80a1486a4d508ea5a91/src/ng/directive/ngRepeat.js#L249-L340
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[Common Locale Data Repository (CLDR)]: http://cldr.unicode.org
[corporate-cla]: http://code.google.com/legal/corporate-cla-v1.0.html
[dgeni]: https://github.com/angular/dgeni
[docs.badrestrict]: https://github.com/angular/angular.js/blob/master/docs/content/error/$compile/badrestrict.ngdoc
[docs.provider]: https://code.angularjs.org/snapshot/docs/api/auto/service/$provide#provider
[git-revert]: https://git-scm.com/docs/git-revert
[github-issues]: https://github.com/angular/angular.js/issues
[github-new-issue]: https://github.com/angular/angular.js/issues/new
[github]: https://github.com/angular/angular.js
[gitter]: https://gitter.im/angular/angular.js
[Google Closure I18N library]: https://github.com/google/closure-library/tree/master/closure/goog/i18n
[groups]: https://groups.google.com/forum/?fromgroups#!forum/angular
[individual-cla]: http://code.google.com/legal/individual-cla-v1.0.html
[irc]: http://webchat.freenode.net/?channels=angularjs&uio=d4
[js-style-guide]: https://google.github.io/styleguide/javascriptguide.xml
[jsfiddle]: http://jsfiddle.net/
[karma-browserstack]: https://github.com/karma-runner/karma-browserstack-launcher
[karma-saucelabs]: https://github.com/karma-runner/karma-sauce-launcher
[list]: https://groups.google.com/forum/?fromgroups#!forum/angular
[plunker]: http://plnkr.co/edit
[saucelabs]: http://saucelabs.com
[stackoverflow]: http://stackoverflow.com/questions/tagged/angularjs
[unit-testing]: https://docs.angularjs.org/guide/unit-testing

[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/CONTRIBUTING.md?pixel)](https://github.com/igrigorik/ga-beacon)
