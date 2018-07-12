/**
 * @ngdoc module
 * @name ngComponentRouter
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 *
 * @installation
 *
 * Currently, the **Component Router** module must be installed via `npm`/`yarn`, it is not available
 * on Bower or the Google CDN.
 *
 * ```bash
 * yarn add @angular/router@0.2.0
 * ```
 *
 * Include `angular_1_router.js` in your HTML:
 * ```html
 * <script src="/node_modules/@angular/router/angular1/angular_1_router.js"></script>
 *```
 *
 * You also need to include ES6 shims for browsers that do not support ES6 code (Internet Explorer,
 iOs < 8, Android < 5.0, Windows Mobile < 10):
 *  ```html
 *  <!-- IE required polyfills, in this exact order -->
 *  <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.33.3/es6-shim.min.js"></script>
 *  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.20/system-polyfills.js"></script>
 *  <script src="https://unpkg.com/angular2/es6/dev/src/testing/shims_for_IE.js"></script>
 *  ```
 *
 * Then load the module in your application by adding it as a dependent module:
 *
 * ```js
 * angular.module('app', ['ngComponentRouter']);
 * ```
 *
 * @description
 */

/**
 * @ngdoc type
 * @name Router
 * @description
 * A `Router` is responsible for mapping URLs to components.
 *
 * * Routers and "Routing Component" instances have a 1:1 correspondence.
 * * The Router holds reference to one or more of Outlets.
 * * There are two kinds of Router: {@link RootRouter} and {@link ChildRouter}.
 *
 * You can see the state of a router by inspecting the read-only field `router.navigating`.
 * This may be useful for showing a spinner, for instance.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc type
 * @name ChildRouter
 * @description
 *
 * This type extends the {@link Router}.
 *
 * Apart from the **Top Level Component** ({@link $routerRootComponent}) which is associated with
 * the {@link $rootRouter}, every **Routing Component** is associated with a `ChildRouter`,
 * which manages the routing for that **Routing Component**.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc type
 * @name RootRouter
 * @description
 *
 * This type extends the {@link Router}.
 *
 * There is only one instance of this type in a Component Router application injectable as the
 * {@link $rootRouter} service. This **Router** is associate with the **Top Level Component**
 * ({@link $routerRootComponent}). It acts as the connection between the **Routers** and the **Location**.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc type
 * @name ComponentInstruction
 * @description
 *
 * A `ComponentInstruction` represents the route state for a single component. An `Instruction` is
 * composed of a tree of these `ComponentInstruction`s.
 *
 * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
 * to route lifecycle hooks, like `$routerCanActivate`.
 *
 * You should not modify this object. It should be treated as immutable.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc type
 * @name  RouteDefinition
 * @description
 *
 * Each item in the **RouteConfig** for a **Routing Component** is an instance of
 * this type. It can have the following properties:
 *
 * * `path` or (`regex` and `serializer`) - defines how to recognize and generate this route
 * * `component`, `loader`, `redirectTo` (requires exactly one of these)
 * * `name` - the name used to identify the **Route Definition** when generating links
 * * `data` (optional)
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc type
 * @name  RouteParams
 * @description
 *
 * A map of parameters for a given route, passed as part of the {@link ComponentInstruction} to
 * the Lifecycle Hooks, such as `$routerOnActivate` and `$routerOnDeactivate`.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @ngdoc directive
 * @name  ngOutlet
 * @priority 400
 * restrict: AE
 * @description
 *
 * The directive that identifies where the {@link Router} should render its **Components**.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */

/**
 * @name ngLink
 * @description
 *
 * Lets you create links to different views, automatically generating the `href`.
 *
 * ## Use
 * Provide an array of {@link RouteDefinition} names and extra parameter objects:
 *
 * ```html
 * <a ng-link="['Parent', {param: 1}, 'Child']">Link to Child View</a>
 * ````
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */


/**
 * @ngdoc service
 * @name  $rootRouter
 * @description
 *
 * The singleton instance of the {@link RootRouter} type, which is associated
 * with the top level {@link $routerRootComponent}.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */


/**
 * @ngdoc service
 * @name  $routerRootComponent
 * @description
 *
 * The top level **Routing Component** associated with the {@link $rootRouter}.
 *
 * @deprecated
 * In an effort to keep synchronized with router changes in the new Angular, this implementation of the Component Router (ngComponentRouter module)
 * has been deprecated and will not receive further updates.
 * We are investigating backporting the Router for the new Angular to AngularJS, but alternatively, use the {@link ngRoute} module or community developed
 * projects (e.g. [ui-router](https://github.com/angular-ui/ui-router)).
 */
