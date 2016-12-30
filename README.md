AngularJS [![Build Status](https://travis-ci.org/angular/angular.js.svg?branch=master)](https://travis-ci.org/angular/angular.js)
=========

AngularJS lets you write client-side web applications as if you had a smarter browser.  It lets you
use good old HTML (or HAML, Jade/Pug and friends!) as your template language and lets you extend HTML’s
syntax to express your application’s components clearly and succinctly.  It automatically
synchronizes data from your UI (view) with your JavaScript objects (model) through 2-way data
binding. To help you structure your application better and make it easy to test, AngularJS teaches
the browser how to do dependency injection and inversion of control.

It also helps with server-side communication, taming async callbacks with promises and deferreds,
and it makes client-side navigation and deeplinking with hashbang urls or HTML5 pushState a
piece of cake. Best of all? It makes development fun!

* Web site: https://angularjs.org
* Tutorial: https://docs.angularjs.org/tutorial
* API Docs: https://docs.angularjs.org/api
* Developer Guide: https://docs.angularjs.org/guide
* Contribution guidelines: [CONTRIBUTING.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md)
* Dashboard: https://dashboard.angularjs.org

##### Looking for Angular 2? Go here: https://github.com/angular/angular

Building AngularJS
---------
[Once you have set up your environment](https://docs.angularjs.org/misc/contribute), just run:

    grunt package


Running tests
-------------
To execute all unit tests, use:

    grunt test:unit

To execute end-to-end (e2e) tests, use:

    grunt package
    grunt test:e2e

To learn more about the grunt tasks, run `grunt --help`

Contribute & Develop
--------------------

We've set up a separate document for our [contribution guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).


[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/README.md?pixel)](https://github.com/igrigorik/ga-beacon)

What to use AngularJS for and when to use it
---------
AngularJS is the next generation framework where each component is designed to work with every other
component in an interconnected way like a well-oiled machine. AngularJS is JavaScript MVC made easy
and done right. (Well it is not really MVC, read on, to understand what this means.)

#### MVC, no, MV* done the right way!
MVC, short for Model-View-Controller, is a design pattern, i.e. how the code should be organized and
how the different parts of an application separated for proper readability and debugging. Model is
the data and the database. View is the user interface and what the user sees. Controller is the main
link between Model and View. These are the three pillars of major programming frameworks present on
the market today. On the other hand AngularJS works on MV*, short for Model-View-_Whatever_. The
_Whatever_ is AngularJS's way of telling that you may create any kind of linking between the Model
and the View here.

Unlike other frameworks in any programming language, where MVC, the three separate components, each
one has to be written and then connected by the programmer, AngularJS helps the programmer by asking
him/her to just create these and everything else will be taken care of by AngularJS.

#### Interconnection with HTML at the root level
AngularJS uses HTML to define the user's interface. AngularJS also enables the programmer to write
new HTML tags (AngularJS Directives) and increase the readability and understandability of the HTML
code. Directives are AngularJS’s way of bringing additional functionality to HTML. Directives
achieve this by enabling us to invent our own HTML elements. This also helps in making the code DRY
(Don't Repeat Yourself), which means once created, a new directive can be used anywhere within the
application.

HTML is also used to determine the wiring of the app. Special attributes in the HTML determine where
to load the app, which components or controllers to use for each element, etc. We specify "what"
gets loaded, but not "how". This declarative approach greatly simplifies app development in a sort
of WYSIWYG way. Rather than spending time on how the program flows and orchestrating the various
moving parts, we simply define what we want and Angular will take care of the dependencies.

#### Data Handling made simple
Data and Data Models in AngularJS are plain JavaScript objects and one can add and change properties
directly on it and loop over objects and arrays at will.

#### Two-way Data Binding
One of AngularJS's strongest features. Two-way Data Binding means that if something changes in the
Model, the change gets reflected in the View instantaneously, and the same happens the other way
around. This is also referred to as Reactive Programming, i.e. suppose `a = b + c` is being
programmed and after this, if the value of `b` and/or `c` is changed then the value of `a` will be
automatically updated to reflect the change. AngularJS uses its "scopes" as a glue between the Model
and View and makes these updates in one available for the other.

#### Less Written Code and Easily Maintainable Code
Everything in AngularJS is created to enable the programmer to end up writing less code that is
easily maintainable and readable by any other new person on the team. Believe it or not, one can
write a complete working two-way data binded application in less than 10 lines of code. Try and see
for yourself!

#### Testing Ready
AngularJS has Dependency Injection, i.e. it takes care of providing all the necessary dependencies
to its controllers and services whenever required. This helps in making the AngularJS code ready for
unit testing by making use of mock dependencies created and injected. This makes AngularJS more
modular and easily testable thus in turn helping a team create more robust applications.



AngularJS中文说明 [![Build Status](https://travis-ci.org/angular/angular.js.svg?branch=master)](https://travis-ci.org/angular/angular.js)
=========

在编写客户端web应用的时候，AngularJS能让你感觉就像拥有一款更加智能的浏览器一样。它既允许你使用老式的HTML（或者HAML、Jade/Pug以及其它搭档）作为模板语言，同时也允许你扩展HTML语法，从而可以更加简洁明了地描述应用中的组件。通过双向数据绑定机制，它可以自动在UI(view)和JavaScript对象(model)之间同步数据。为了帮助你更好地组织应用的结构，同时也为了更方便地进行测试，AngularJS还会指导浏览器如何进行依赖注入并反转依赖。

它同时还对与服务端通讯提供了帮助，通过promise和deferred让异步回调变得更加顺畅，同时还利用hashbang url或者HTML5 pushState让客户端导航变得易如反掌。如果你要问它最大的优点是什么？答案是：它让开发过程变得妙趣横生！


* Web站点: https://angularjs.org
* 教程: https://docs.angularjs.org/tutorial
* API文档: https://docs.angularjs.org/api
* 开发者指南: https://docs.angularjs.org/guide
* 贡献指南: [CONTRIBUTING.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md)
* 仪表盘: https://dashboard.angularjs.org

##### 正在寻找 Angular 2？点这里：https://github.com/angular/angular

构建AngularJS
---------
[配置完开发环境之后](https://docs.angularjs.org/misc/contribute)，请执行以下命令:

    grunt package


运行测试用例
-------------
如果需要执行所有测试用例，请执行：

    grunt test:unit

如果需要执行端到端(e2e)测试，请执行：

    grunt package
    grunt test:e2e

如果想学习更多关于grunt任务方面的内容，请运行`grunt --help`

贡献和开发
--------------------

我们单独起了一个文档来放[贡献指南](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).


[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/README.md?pixel)](https://github.com/igrigorik/ga-beacon)


AngularJS能做什么，以及什么时候使用它
---------

AngularJS是下一代框架，在这里每一个组件都被设计成可以与其它组件以高度协同的方式工作，就像一台运行良好的机器一样。AngularJS让JavaScript MVC更加容易实现，并且是开箱即用的。（好吧，其实它并不是真正意义上的MVC，如果你想知道这句话的含义，请继续向下阅读。）


#### MVC？不，MV*才是正确的做法！

MVC是Model-View-Controller的缩写，这是一种设计模式，也就是代码应该如何组织，以及为了便于阅读和调试，应用中的不同部分应该如何切分。Model（模型）是数据和数据库；View（视图）是用户界面，是用户看到东西；Controller（控制器）是Model和View之间的主要连接点。在如今市面上主流的编程框架中，这是3大支柱。与此不同，AngularJS是基于MV*构建的，这是Model-View-_Whatever_的缩写。这里的_Whatever_（随便）是带有AngularJS特色的表述方式，它的意思是说，你可以在Model和View之间创建任何形式的连接。

与其它任何编程语言中的框架都不一样，在这些语言里面，MVC中的3个不同组件都必须由程序员自己编写并组织起来，而AngularJS只要求程序员把这些东西创建出来就行，其它事情都交给AngularJS去处理。

#### 在最底层与HTML互联互通

AngularJS使用HTML标签来定义用户界面。AngularJS同时也允许程序员编写新的HTML标签(AngularJS指令)从而增强HTML代码的可读性和可理解性。指令是AngularJS提供的一种方式，用来给HTML增加额外的功能。为了达到这一目的，指令允许我们发明自己的HTML标签。这种方法同时还能让代码保持DRY（Don't Repeat Yourself），这就意味着，一旦创建了一个新的指令，它就可以在应用中的任何地方使用。同时，HTML还用来决定应用的组织方式。HTML标签中的特殊属性可以决定把app加载到哪里、每个元素上应该使用哪个组件或者控制器，等等。我们指定要加载“什么”(what)，而不是“如何”(how)加载。这种声明式的方法使用一种WYSIWYG（What You See Is What You Get.---译者注）的方式高度简化了应用的开发过程。我们只要简单地定义需要什么，而不需要在程序流程和各种动态组件的组织方式上去花时间，Angular会负责处理这些依赖关系。

#### 简化数据处理

在AngularJS中，数据和数据模型都是简单的JavaScript对象，我们可以直接在上面增加或者修改属性，也可以按照需要遍历对象和数组。

#### 双向数据绑定

这是AngularJS最强大的特性之一。双向数据绑定的意思是，如果Model上发生了某种变化，这种变化会立刻反映到View上，反之亦然。这种特性也被叫做Reactive Programming（响应式编程），也就是说，假设我们编写了`a = b + c`，然后`b` and/or `c`的值发生了改变，那么`a`的值就会自动被更新以反映这种改变。AngularJS使用了"scopes"作为Model和View之间的胶水，然后用它来互相更新。

#### 代码更少，可维护性更强

AngularJS中的所有内容都可以让程序员更少地编写代码，并且对于团队中的新人来说可维护性、可读性更佳。你只要少于10行代码就可以编写一个完整可运行的双向数据绑定应用，信不信由你。你可以自己尝试一下！

#### 良好的可测试性

AngularJS内置了Dependency Injection（依赖注入）特性，也就是说，它会在需要的时候为控制器（controller）和服务（service）提供所有必要的依赖。这一点帮助AngularJS代码具备了良好的单元测试特性，只要创建并注入模拟（mock）依赖就可以了。从而让AngularJS更加模块化，并且更加易于测试，最终可以帮助团队创建更加健壮的应用。