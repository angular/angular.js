#Contributing to AngularJS

We'd love for you to contribute to our source code and to make AngularJS even better than it is
today! Here are the guidelines we'd like you to follow:

## Got a Question or Problem?

If you have questions about how to use AngularJS, please direct these to the [Google Group][groups]
discussion list or [StackOverflow][stackoverflow]. We are also available on [IRC][irc].

## Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting and issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.

***Localization Issue:*** *Angular.js uses the [Google Closure I18N library], to generate its own I18N files. This means that
any changes to these files would be lost the next time that we import the library. The recommended
approach is to submit a patch to the I18N project directly, instead of submitting it here.*

**Please see the Submission Guidelines below**.

## Want a Feature?
You can request a new feature by submitting an issue to our [GitHub Repository][github].  If you
would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first on our
[dev mailing list][angular-dev] or [IRC][irc] so that we can better coordinate our efforts, prevent
duplication of work, and help you to craft the change so that it is successfully accepted into the
project.
* **Small Changes** can be crafted and submitted to [GitHub Repository][github] as a Pull Request.

## Submission Guidelines

### Submitting an Issue
Before you submit your issue, search the archive, it's maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.  Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Angular Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only IE8?
* **Reproduce the error** - provide a live example (using [Plunker][plunker] or
  [JSFiddle][jsfiddle]) or a unambiguous set of steps.
* **Related issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

Here is a great example of a well defined issue: https://github.com/angular/angular.js/issues/5069

**If you get help, help others. Good karma rulez!**

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/angular/angular.js/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Please sign our [Contributor License Agreement (CLA)](#signing-the-cla) before sending pull
  requests. We cannot accept code without this.
* Make your changes in a new git branch

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, including appropriate test cases.
* Follow our Coding Rules
* Commit your changes and create a descriptive commit message (the
  commit message is used to generate release notes, please check out our
  [commit message conventions](#commit-message-format) and our commit message presubmit hook
  `validate-commit-msg.js`):

     ```shell
     git commit -a
     ```

* Build your changes locally to ensure all the tests pass

    ```shell
    grunt test
    ```

* Push your branch to Github:

    ```shell
    git push origin my-fix-branch
    ```

* In Github, send a pull request to `angular:master`.
* If we suggest changes then you can modify your branch, rebase and force a new push to your GitHub
  repository to update the Pull Request:

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

When the patch is reviewed and merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

```shell
# Delete the remote branch on Github:
git push origin --delete my-fix-branch

# Check out the master branch:
git checkout master -f

# Delete the local branch:
git branch -D my-fix-branch

# Update your master with the latest upstream version:
git pull --ff upstream master
```
## Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more [specs][unit-testing].
* All public API methods **must be documented** with ngdoc, an extended version of jsdoc (we added
  support for markdown and templating via @ngdoc tag). To see how we document our APIs, please check
  out the existing ngdocs and see [this wiki page][ngDocs].
* With the exceptions listed below, we follow the rules contained in
  [Google's JavaScript Style Guide][js-style-guide]:
    * **Do not use namespaces**: Instead,  wrap the entire angular code base in an anonymous closure and
      export our API explicitly rather than implicitly.
    * Wrap all code at **100 characters**.
    * Instead of complex inheritance hierarchies, we **prefer simple objects**. We use prototypical
      inheritance only when absolutely necessary.
    * We **love functions and closures** and, whenever possible, prefer them over objects.
    * To write concise code that can be better minified, we **use aliases internally** that map to the
      external API. See our existing code to see what we mean.
    * We **don't go crazy with type annotations** for private internal APIs unless it's an internal API
      that is used throughout AngularJS. The best guidance is to do what makes the most sense.

## Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the AngularJS change log**.

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

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on github as well as in various git tools.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

###Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

###Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.


A detailed explanation can be found in this [document][commit-message-format].

## Signing the CLA

Please sign our Contributor License Agreement (CLA) before sending pull requests. For any code
changes to be accepted, the CLA must be signed. It's a quick process, we promise!

* For individuals we have a [simple click-through form][individual-cla].
* For corporations we'll need you to
  [print, sign and one of scan+email, fax or mail the form][corporate-cla].

## Further Information
You can find out more detailed information about contributing in the
[AngularJS documentation][contributing].



[github]: https://github.com/angular/angular.js
[Google Closure I18N library]: https://code.google.com/p/closure-library/source/browse/closure/goog/i18n/
[list]: https://groups.google.com/forum/?fromgroups#!forum/angular
[contribute]: http://docs.angularjs.org/misc/contribute
[stackoverflow]: http://stackoverflow.com/questions/tagged/angularjs
[groups]: https://groups.google.com/forum/?fromgroups#!forum/angular
[angular-dev]: https://groups.google.com/forum/?fromgroups#!forum/angular-dev
[irc]: http://webchat.freenode.net/?channels=angularjs&uio=d4
[plunker]: http://plnkr.co/edit
[jsfiddle]: http://jsfiddle.net/
[ngDocs]: https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
[unit-testing]: http://docs.angularjs.org/guide/dev_guide.unit-testing
[js-style-guide]: http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
[contributing]: http://docs.angularjs.org/misc/contribute
[individual-cla]: http://code.google.com/legal/individual-cla-v1.0.html
[corporate-cla]: http://code.google.com/legal/corporate-cla-v1.0.html
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
