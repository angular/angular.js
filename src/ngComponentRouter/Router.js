/**
 * @ngdoc module
 * @name ngComponentRouter
 * @description
 * The new Angular Router
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
 * ({@link $routerRootComponent}). It acts as the connection betweent he **Routers** and the **Location**.
 */

/**
 * @ngdoc type
 * @name ComponentInstruction
 * @description
 * A `ComponentInstruction` represents the route state for a single component. An `Instruction` is
 * composed of a tree of these `ComponentInstruction`s.
 *
 * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
 * to route lifecycle hooks, like `$routerCanActivate`.
 *
 * You should not modify this object. It should be treated as immutable.
 */

/**
 * @ngdoc type
 * @name  RouteDefinition
 * @description
 *
 * Each item in a the **RouteConfig** for a **Routing Component** is an instance of
 * this type. It can have the following properties:
 *
 * * `path` or (`regex` and `serializer) - defines how to recognize and generate this route
 * * `component`, `loader`, `redirectTo` (requires exactly one of these)
 * * `name` - the name used to identify the **Route Definition** when generating links
 * * `data` (optional)
 */

/**
 * @ngdoc type
 * @name  RouteParams
 * @description
 * A map of parameters for a given route, passed as part of the {@link ComponentInstruction} to
 * the Lifecycle Hooks, such as `$routerOnActivate` and `$routerOnDeactivate`.
 */

/**
 * @ngdoc directive
 * @name  ngOutlet
 * @priority 400
 * restrict: AE
 * @description
 *
 * The directive that identifies where the {@link Router} should render its **Components**.
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
 */


/**
 * @ngdoc service
 * @name  $rootRouter
 * @description
 * The singleton instance of the {@link RootRouter} type, which is associated
 * with the top level {@link $routerRootComponent}.
 */


/**
 * @ngdoc service
 * @name  $routerRootComponent
 * @description
 *
 * The top level **Routing Component** associated with the {@link $rootRouter}.
 */
