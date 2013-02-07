AngularJS
=========

AngularJS lets you write client-side web applications as if you had a smarter browser.  It lets you
use good old HTML (or HAML, Jade and friends!) as your template language and lets you extend HTML’s
syntax to express your application’s components clearly and succinctly.  It automatically
synchronizes data from your UI (view) with your JavaScript objects (model) through 2-way data
binding. To help you structure your application better and make it easy to test, AngularJS teaches
the browser how to do dependency injection and inversion of control. Oh yeah and it also helps with
server-side communication, taming async callbacks with promises and deferreds; and make client-side
navigation and deeplinking with hashbang urls or HTML5 pushState a piece of cake. The best of all:
it makes development fun!

* Web site: http://angularjs.org
* Tutorial: http://docs.angularjs.org/tutorial
* API Docs: http://docs.angularjs.org/api
* Developer Guide: http://docs.angularjs.org/guide
* Contribution guidelines: http://docs.angularjs.org/misc/contribute

Building AngularJS
---------
[Once you have your environment setup](http://docs.angularjs.org/misc/contribute) just run:

    rake package


Running Tests
-------------
Running tests requires installation of [Testacular](http://vojtajina.github.com/testacular):

    sudo npm install -g testacular

To execute all unit tests, use:

    rake test:unit

To execute end-to-end (e2e) tests, use:

    rake package
    rake webserver &
    rake test:e2e

To learn more about the rake tasks, run `rake -T` and also read our
[contribution guidelines](http://docs.angularjs.org/misc/contribute) and instructions in this
[commit message](https://github.com/angular/angular.js/commit/9d168f058f9c6d7eeae0daa7cb72ea4e02a0003a).
