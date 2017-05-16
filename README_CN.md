AngularJS中文说明
=======================
AngularJS为开发人员开发客户端web应用提供了大量的帮助。它能够使用老式作为模板语言，并且可以通过扩展HTML语法来编写清晰简洁的应用组件。它可以通过双向数据绑定自动在界面(视图)和JavaScript对象(模型)同步数据。Angularjs会告诉浏览器如何进行依赖注入以及控制反转来帮助开发人员更好的构造应用程序并使其易于测试。

同时，AngularJs也有助于服务端通信，通过异步回调的承诺和延迟，它使得客户端导航以及使用hashbang的超链接或者HTML5的pushState都非常简单。
* 网址: https://angularjs.org
* 教程： https://docs.angularjs.org/tutorial
* API文档: https://docs.angularjs.org/API文档
* 开发指南: https://docs.angularjs.org/guide
* 贡献指南: [CONTRIBUTING.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md)
* 仪表盘： https://dashboard.angularjs.org

##### 寻找Angular 2？地址：https//github.com/angular/angular

编译AngularJS
----------------
[当设置好环境后](https://docs.angularjs.org/misc/contribute),运行:

```
grunt AngularJS
```

运行测试
--------------------
要执行所有单元测试，使用:

```
grunt test:unit
```

要执行端到端(e2e)测试，使用:
```
grunt package
grunt test:e2e
```

想了解grunt任务的更多内容，运行`grunt --help`

贡献和开发
------------------------
参见文档[贡献指南](https://https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).

AngularJS能做什么，什么时候使用它
-------------
AngularJS是一个Javascript MVC框架，它的每个组件互相关联组织成一部运转良好的机器。

#### MVC，或者说MV*更合适
MVC，模型-视图-控制器的缩写，是一种设计模式，描述如何将代码组织起来，以及如何将应用的不同部分隔离开来，才能具有更好的可读性，更便于调试。模型是数据和数据库。视图使用户界面以及用户看到的东西。控制器是正在模型和视图之间的联系。对于AngularJS来说，它更像MV*,模型-视图-随便什么。 后面的随便代表AngularJS在模型和视图之间创建关联的方式。

不同于其他MVC框架-开发者需要编写这三部分，并且要将它们关联起来。AngularJS只需要创建这三部分，其它的事情由AngularJS完成。

#### 与HTML根级别的联系

AngularJS使用HTML定义用户界面。同时也支持开发人员创建新的HTML标记（AngularJS指令），增强HTML的可读性和可理解性。
AngularJS指令通过创建自定义标记的方式为HTML提供了额外的功能，同时，只要创建了一条指令，这个指令就可以在应用的任何部分使用。

HTML也用来确定应用程序的内部结构。HTML中的特殊标签确定从哪里加载应用，每个元素要使用哪个组件或者控制器，等等。我们指出了“什么”要被加载，但不需要“如何”加载。这种声名式的方法极大的简化了应用开发。只需要定义我们需要什么，AngularJS自己回去管理这些依赖。

#### 数据处理更加简单了

数据和数据模型在AngularJS中就是普通的JavaScript对象，可以添加或者修改并可以循环多个对象或者数组。

#### 双工绑定
AngularJS最强大的特性之一。双工绑定意味着当模型中发生了某些变化时，这个变化会瞬间反映到界面上，反过来也是如此。
这也是通常说的反应式编程。比如设定`a=b+c`,之后如果`b`和/或`c`发生变化了，`a`的值会跟着变化。AngularJs使用`scopes`作为模型和视图的胶水，当一个变化时让另一个也随之变化。

#### 更少更容易维护的代码
使用AngularJS可以使开发人员编写出可读性更好，更具有维护性的代码，同时还减少了开发量。

#### 测试
AngularJS使用依赖注入。它为控制器和服务提供所有必需的依赖。这杨使得AngularJS代码可以使用mock依赖来创建和注入来进行单元测试。更加模块化，更易于测试，也能创建出更加鲁棒性的应用程序。