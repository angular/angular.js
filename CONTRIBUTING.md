# Contributing to AngularJS

We'd love for you to contribute to our source code and to make AngularJS even better than it is
today! Here are the guidelines we'd like you to follow:

* [Code of Conduct](#coc)
* [Questions and Problems](#question)
* [Issues and Bugs](#issue)
* [Feature Requests](#feature)
* [Improving Documentation](#docs)
* [Issue Submission Guidelines](#submit)
* [Pull Request Submission Guidelines](#submit-pr)
* [Signing the CLA](#cla)

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
  as a Pull Request. See the section about [Pull Request Submission Guidelines](#submit-pr), and
  for detailed information the [core development documentation][developers].

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
commit message follows the **[Commit Message Guidelines][developers.commits]**.

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

Here is a great example of a well defined issue: https://github.com/angular/angular.js/issues/5069.

**If you get help, help others. Good karma rulez!**

## <a name="submit-pr"></a> Pull Request Submission Guidelines
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/angular/angular.js/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Create the [development environment][developers.setup]
* Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

* Create your patch commit, **including appropriate test cases**.
* Follow our [Coding Rules][developers.rules].
* If the changes affect public APIs, change or add relevant [documentation][developers.documentation].
* Run the AngularJS [unit][developers.tests-unit] and [E2E test][developers.tests-e2e] suites, and ensure that all tests
  pass. It is generally sufficient to run the tests only on Chrome, as our continuous integration test will
  run the tests on additional browsers.
* Run `yarn grunt eslint` to check that you have followed the automatically enforced coding rules
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions][developers.commits]. Adherence to the
  [commit message conventions][developers.commits] is required, because release notes are
  automatically generated from these messages.

    ```shell
    git commit -a
    ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Before creating the Pull Request, package and run all tests a last time:

    ```shell
    yarn grunt test
    ```

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `angular.js:master`. This will trigger the check of the
[Contributor License Agreement](#cla) and the continuous integration tests.

* If you find that the continuous integration tests have failed, look into the logs to find out
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

    This is generally easier to follow, but separate commits are useful if the Pull Request contains
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



[Closure guide to i18n changes]: https://github.com/google/closure-library/wiki/Internationalization-%28i18n%29-changes-in-Closure-Library
[coc]: https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md
[Common Locale Data Repository (CLDR)]: http://cldr.unicode.org
[corporate-cla]: http://code.google.com/legal/corporate-cla-v1.0.html
[developers]: DEVELOPERS.md
[developers.commits]: DEVELOPERS.md#commits
[developers.documentation]: DEVELOPERS.md#documentation
[developers.rules]: DEVELOPERS.md#rules
[developers.setup]: DEVELOPERS.md#setup
[developers.tests-e2e]: DEVELOPERS.md#e2e-tests
[developers.tests-unit]: DEVELOPERS.md#unit-tests
[github-issues]: https://github.com/angular/angular.js/issues
[github-new-issue]: https://github.com/angular/angular.js/issues/new
[github]: https://github.com/angular/angular.js
[gitter]: https://gitter.im/angular/angular.js
[Google Closure I18N library]: https://github.com/google/closure-library/tree/master/closure/goog/i18n
[groups]: https://groups.google.com/forum/?fromgroups#!forum/angular
[individual-cla]: http://code.google.com/legal/individual-cla-v1.0.html
[irc]: http://webchat.freenode.net/?channels=angularjs&uio=d4
[jsfiddle]: http://jsfiddle.net/
[karma-browserstack]: https://github.com/karma-runner/karma-browserstack-launcher
[karma-saucelabs]: https://github.com/karma-runner/karma-sauce-launcher
[plunker]: http://plnkr.co/edit
[stackoverflow]: http://stackoverflow.com/questions/tagged/angularjs

[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/CONTRIBUTING.md?pixel)](https://github.com/igrigorik/ga-beacon)
