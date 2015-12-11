<a name="1.5.0-rc.0"></a>
# 1.5.0-rc.0 oblong-panoptikum (2015-12-09)

This is the first Release Candidate for AngularJS 1.5.0. Please try upgrading your applications and
report any regressions or other issues you find as soon as possible.

## Features

- **$parse:** provide a mechanism to access the locals object, `$locals`
  ([0ea53503](https://github.com/angular/angular.js/commit/0ea535035a3a1a992948490c3533bffb83235052))

- **$resource:** add proper support for cancelling requests, `$cancelRequest()`
  ([98528be3](https://github.com/angular/angular.js/commit/98528be311b48269ba0e15ba4e3e2ad9b89693a9),
   [#9332](https://github.com/angular/angular.js/issues/9332), [#13050](https://github.com/angular/angular.js/issues/13050), [#13058](https://github.com/angular/angular.js/issues/13058), [#13210](https://github.com/angular/angular.js/issues/13210))

- **ngAnimate:** provide ng-[event]-prepare class for structural animations
  ([6e18b50a](https://github.com/angular/angular.js/commit/6e18b50a5b168848cc526081b0a2a16075ee44bd))

- **ngLocale:** add support for standalone months
  ([96c73a06](https://github.com/angular/angular.js/commit/96c73a0672f0e46ae9285c482b057bd03ce135ba),
   [#3744](https://github.com/angular/angular.js/issues/3744), [#10247](https://github.com/angular/angular.js/issues/10247), [#12642](https://github.com/angular/angular.js/issues/12642), [#12844](https://github.com/angular/angular.js/issues/12844))

- **ngMock:** destroy $rootScope after each test
  ([b75c0d8d](https://github.com/angular/angular.js/commit/b75c0d8d0549261ece551210a11d8be48c3ab3cc),
   [#13433](https://github.com/angular/angular.js/issues/13433))

- **ngTransclude:** don't overwrite the contents with an unfilled optional slot
  ([0812af49](https://github.com/angular/angular.js/commit/0812af49bd4f4fad4067603ff64dbe720bd6e3e5),
   [#13426](https://github.com/angular/angular.js/issues/13426))

- **ngView:** reference resolved locals in scope, `resolveAs: '$resolve'`
  ([983b0598](https://github.com/angular/angular.js/commit/983b0598121a8c5a3a51a30120e114d7e3085d4d),
   [#13400](https://github.com/angular/angular.js/issues/13400))


## Bug Fixes

- **$compile:**
  - swap keys and values for transclude definition object
  ([c3a26911](https://github.com/angular/angular.js/commit/c3a2691115b92536fb3d213d0ca16ac68cf32415),
   [#13439](https://github.com/angular/angular.js/issues/13439))
  - include non-elements in default transclusion slot
  ([df6fade6](https://github.com/angular/angular.js/commit/df6fade6e67cfbfb5295bab3703ba2054d48daa7))
  - support merging special attribute names in `replace` directives
  ([a5ff651a](https://github.com/angular/angular.js/commit/a5ff651a59933c2c43b81642454ee458f98e1401),
   [#13317](https://github.com/angular/angular.js/issues/13317), [#13318](https://github.com/angular/angular.js/issues/13318))

- **$http:** throw if url passed is not a string
  ([6628b4f1](https://github.com/angular/angular.js/commit/6628b4f1e5835d997290881c6ba394547883a516),
   [#12925](https://github.com/angular/angular.js/issues/12925), [#13444](https://github.com/angular/angular.js/issues/13444))

- **$parse:**
  - prevent assignment on constructor properties
  ([5a674f3b](https://github.com/angular/angular.js/commit/5a674f3bb9d1118d11b333e3b966c01a571c09e6),
   [#13417](https://github.com/angular/angular.js/issues/13417))
  - handle interceptors with `undefined` expressions
  ([4473b81c](https://github.com/angular/angular.js/commit/4473b81cdaf16c5509ac53d80b9bdfb0a7ac5f30))

- **$sanitize:** blacklist SVG `<use>` elements
  ([7a668cdd](https://github.com/angular/angular.js/commit/7a668cdd7d08a7016883eb3c671cbcd586223ae8),
   [#13453](https://github.com/angular/angular.js/issues/13453))

- **formatNumber:** cope with large and small number corner cases
  ([6a0686d4](https://github.com/angular/angular.js/commit/6a0686d434c41445c50b2d9669073802ede77b3b),
   [#13394](https://github.com/angular/angular.js/issues/13394), [#8674](https://github.com/angular/angular.js/issues/8674), [#12709](https://github.com/angular/angular.js/issues/12709), [#8705](https://github.com/angular/angular.js/issues/8705), [#12707](https://github.com/angular/angular.js/issues/12707), [#10246](https://github.com/angular/angular.js/issues/10246), [#10252](https://github.com/angular/angular.js/issues/10252))

- **input:** add missing chars to URL validation regex
  ([e4bb8387](https://github.com/angular/angular.js/commit/e4bb8387952069cca9da06bbc5c87ae576c2bf6f),
   [#13379](https://github.com/angular/angular.js/issues/13379), [#13460](https://github.com/angular/angular.js/issues/13460))

- **ngAnimate:**
  - consider options.delay value for closing timeout
    ([7ffb2d3c](https://github.com/angular/angular.js/commit/7ffb2d3c17643303a51eb4e324c365af70fe3824),
     [#13355](https://github.com/angular/angular.js/issues/13355), [#13363](https://github.com/angular/angular.js/issues/13363))
  - ensure animate runner is the same with and without animations
    ([546a277d](https://github.com/angular/angular.js/commit/546a277d65a3e075178d9b6d7ea6abcebc4bc04b),
     [#13205](https://github.com/angular/angular.js/issues/13205), [#13347](https://github.com/angular/angular.js/issues/13347))
  - ignore children without animation data when closing them
  ([77419cf1](https://github.com/angular/angular.js/commit/77419cf19fe625b262e971d5453151c63ff52b34),
   [#11992](https://github.com/angular/angular.js/issues/11992), [#13424](https://github.com/angular/angular.js/issues/13424))
  - do not alter the provided options data
  ([193153c3](https://github.com/angular/angular.js/commit/193153c3d391338a859cb7788ef32a8af05fb920),
   [#13040](https://github.com/angular/angular.js/issues/13040), [#13175](https://github.com/angular/angular.js/issues/13175))

- **ngMock:** clear out `$providerInjector` after each test
  ([a72c12bd](https://github.com/angular/angular.js/commit/a72c12bd7052da9f60da74625409374342b50b73),
   [#13397](https://github.com/angular/angular.js/issues/13397), [#13416](https://github.com/angular/angular.js/issues/13416))

- **ngOptions:** don't $dirty multiple select after compilation
  ([c7a2028a](https://github.com/angular/angular.js/commit/c7a2028ab38cdfc4d956c50b6f41cbccef302165),
   [#13211](https://github.com/angular/angular.js/issues/13211), [#13326](https://github.com/angular/angular.js/issues/13326))

- **ngTransclude:**
  - don't replace existing content if no transcluded content exists
  ([c3ae6ed7](https://github.com/angular/angular.js/commit/c3ae6ed78e145a9b0c13de7ef95852ba3c467551),
   [#11839](https://github.com/angular/angular.js/issues/11839))
  - fix case where ngTransclude attribute value equals its key
  ([7ddbc9aa](https://github.com/angular/angular.js/commit/7ddbc9aa35119154acb649e8c5096babc1d43476),
   [#12934](https://github.com/angular/angular.js/issues/12934), [#13383](https://github.com/angular/angular.js/issues/13383))


## Breaking Changes

- **$compile:** due to [c3a26911](https://github.com/angular/angular.js/commit/c3a2691115b92536fb3d213d0ca16ac68cf32415),

**This is only a breaking change to a feature that was added in beta 2. If you have not started
using multi-slot transclusion then this will not affect you.**

The keys and values for the `transclude` map of the directive definition have been swapped around
to be more consistent with the other maps, such as `scope` and `bindToController`.

Now the `key` is the slot name and the `value` is a normalized element selector.


- **$resource:** due to [98528be3](https://github.com/angular/angular.js/commit/98528be311b48269ba0e15ba4e3e2ad9b89693a9),

Using a promise as `timeout` is no longer supported and will log a
warning. It never worked the way it was supposed to anyway.

Before:

```js
var deferred = $q.defer();
var User = $resource('/api/user/:id', {id: '@id'}, {
  get: {method: 'GET', timeout: deferred.promise}
});

var user = User.get({id: 1});   // sends a request
deferred.resolve();             // aborts the request

// Now, we need to re-define `User` passing a new promise as `timeout`
// or else all subsequent requests from `someAction` will be aborted
User = $resource(...);
user = User.get({id: 2});
```

After:

```js
var User = $resource('/api/user/:id', {id: '@id'}, {
  get: {method: 'GET', cancellable: true}
});

var user = User.get({id: 1});   // sends a request
user.$cancelRequest();      // aborts the request

user = User.get({id: 2});
```

- **$sanitize:** due to [7a668cdd](https://github.com/angular/angular.js/commit/7a668cdd7d08a7016883eb3c671cbcd586223ae8),

The $sanitize service will now remove instances of the `<use>` tag from the content passed to it.

This element is used to import external SVG resources, which is a security risk as the `$sanitize`
service does not have access to the resource in order to sanitize it.

- **ngView:** due to [983b0598](https://github.com/angular/angular.js/commit/983b0598121a8c5a3a51a30120e114d7e3085d4d),

A new property to access route resolves is now available on the scope of the route. The default name
for this property is `$resolve`. If your scope already contains a property with this name then it
will be hidden or overwritten.

In this case, you should choose a custom name for this property, that does not collide with other
properties on the scope, by specifying the `resolveAs` property on the route.


- **$parse:** due to [0ea53503](https://github.com/angular/angular.js/commit/0ea535035a3a1a992948490c3533bffb83235052),

A new property to access all the locals for an expression is now available on the scope. This property
is  `$locals`.

* If `scope.$locals` already exists, the way to reference this property is now `this.$locals`.
* If the locals themselves include a property `$locals` then the way to reference that is now `$locals.$locals`.


<a name="1.4.8"></a>
# 1.4.8 ice-manipulation (2015-11-19)


## Bug Fixes

- **$animate:** ensure leave animation calls `close` callback
  ([6bd6dbff](https://github.com/angular/angular.js/commit/6bd6dbff4961a601c03e9465442788781d329ba6),
   [#12278](https://github.com/angular/angular.js/issues/12278), [#12096](https://github.com/angular/angular.js/issues/12096), [#13054](https://github.com/angular/angular.js/issues/13054))
- **$cacheFactory:** check key exists before decreasing cache size count
  ([2a5a52a7](https://github.com/angular/angular.js/commit/2a5a52a76ccf60c6e8c5d881e90e11a2666a6d3c),
   [#12321](https://github.com/angular/angular.js/issues/12321), [#12329](https://github.com/angular/angular.js/issues/12329))
- **$compile:**
  - bind all directive controllers correctly when using `bindToController`
  ([5d8861fb](https://github.com/angular/angular.js/commit/5d8861fb2f203e8a688b6044cbd1140cd79fd049),
   [#11343](https://github.com/angular/angular.js/issues/11343), [#11345](https://github.com/angular/angular.js/issues/11345))
  - evaluate against the correct scope with bindToController on new scope
  ([b9f7c453](https://github.com/angular/angular.js/commit/b9f7c453e00d6938106f414952f74d5e5fdcb993),
   [#13021](https://github.com/angular/angular.js/issues/13021), [#13025](https://github.com/angular/angular.js/issues/13025))
  - fix scoping of transclusion directives inside replace directive
  ([74da0340](https://github.com/angular/angular.js/commit/74da03407782d679951cd8f693860cea214f2580),
   [#12975](https://github.com/angular/angular.js/issues/12975), [#12936](https://github.com/angular/angular.js/issues/12936), [#13244](https://github.com/angular/angular.js/issues/13244))
- **$http:** apply `transformResponse` even when `data` is empty
  ([c6909464](https://github.com/angular/angular.js/commit/c690946469e09cfe6b774e63dbe14ace92ce6cb7),
   [#12976](https://github.com/angular/angular.js/issues/12976), [#12979](https://github.com/angular/angular.js/issues/12979))
- **$location:** ensure `$locationChangeSuccess` fires even if URL ends with `#`
  ([6f8ddb6d](https://github.com/angular/angular.js/commit/6f8ddb6d4329441e8d4a856978413aa9b9bd918f),
   [#12175](https://github.com/angular/angular.js/issues/12175), [#13251](https://github.com/angular/angular.js/issues/13251))
- **$parse:** evaluate once simple expressions only once
  ([e4036824](https://github.com/angular/angular.js/commit/e403682444fa08af4f3491badf2f3a10d7595699),
   [#12983](https://github.com/angular/angular.js/issues/12983), [#13002](https://github.com/angular/angular.js/issues/13002))
- **$resource:** allow XHR request to be cancelled via a timeout promise
  ([7170f9d9](https://github.com/angular/angular.js/commit/7170f9d9ca765c578f8d3eb4699860a9330a0a11),
   [#12657](https://github.com/angular/angular.js/issues/12657), [#12675](https://github.com/angular/angular.js/issues/12675), [#10890](https://github.com/angular/angular.js/issues/10890), [#9332](https://github.com/angular/angular.js/issues/9332))
- **$rootScope:** prevent IE9 memory leak when destroying scopes
  ([87b0055c](https://github.com/angular/angular.js/commit/87b0055c80f40589c5bcf3765e59e872bcfae119),
   [#10706](https://github.com/angular/angular.js/issues/10706), [#11786](https://github.com/angular/angular.js/issues/11786))
- **Angular.js:** fix `isArrayLike` for unusual cases
  ([70edec94](https://github.com/angular/angular.js/commit/70edec947c7b189694ae66b129568182e3369cab),
   [#10186](https://github.com/angular/angular.js/issues/10186), [#8000](https://github.com/angular/angular.js/issues/8000), [#4855](https://github.com/angular/angular.js/issues/4855), [#4751](https://github.com/angular/angular.js/issues/4751), [#10272](https://github.com/angular/angular.js/issues/10272))
- **isArrayLike:** handle jQuery objects of length 0
  ([d3da55c4](https://github.com/angular/angular.js/commit/d3da55c40f1e1ddceced5da51e364888ff9d82ff))
- **jqLite:**
  - deregister special `mouseenter` / `mouseleave` events correctly
  ([22f66025](https://github.com/angular/angular.js/commit/22f66025db262417ebb78c1ce1f4d7058dca3fd3),
   [#12795](https://github.com/angular/angular.js/issues/12795), [#12799](https://github.com/angular/angular.js/issues/12799))
  - ensure mouseenter works with svg elements on IE
  ([c1f34e8e](https://github.com/angular/angular.js/commit/c1f34e8eeb5105767f6cbf4727b8c5664be2a261),
   [#10259](https://github.com/angular/angular.js/issues/10259), [#10276](https://github.com/angular/angular.js/issues/10276))
- **limitTo:** start at 0 if `begin` is negative and exceeds input length
  ([4fc40bc9](https://github.com/angular/angular.js/commit/4fc40bc9320a1d5902e648b70fa79c7cf7e794c7),
   [#12775](https://github.com/angular/angular.js/issues/12775), [#12781](https://github.com/angular/angular.js/issues/12781))
- **merge:**
  - ensure that jqlite->jqlite and DOM->DOM
  ([2f8db1bf](https://github.com/angular/angular.js/commit/2f8db1bf01173b546a2868fc7b8b188c2383fbff))
  - clone elements instead of treating them like simple objects
  ([838cf4be](https://github.com/angular/angular.js/commit/838cf4be3c671903796dbb69d95c0e5ac1516a06),
   [#12286](https://github.com/angular/angular.js/issues/12286))
- **ngAria:** don't add tabindex to radio and checkbox inputs
  ([59f1f4e1](https://github.com/angular/angular.js/commit/59f1f4e19a02e6e6f4c41c15b0e9f3372d85cecc),
   [#12492](https://github.com/angular/angular.js/issues/12492), [#13095](https://github.com/angular/angular.js/issues/13095))
- **ngInput:** change URL_REGEXP to better match RFC3987
  ([cb51116d](https://github.com/angular/angular.js/commit/cb51116dbd225ccfdbc9a565a66a170e65d26331),
   [#11341](https://github.com/angular/angular.js/issues/11341), [#11381](https://github.com/angular/angular.js/issues/11381))
- **ngMock:** reset cache before every test
  ([91b7cd9b](https://github.com/angular/angular.js/commit/91b7cd9b74d72a48d844c5c3e0e9dee03405e0ca),
   [#13013](https://github.com/angular/angular.js/issues/13013))
- **ngOptions:**
  - skip comments and empty options when looking for options
  ([0f58334b](https://github.com/angular/angular.js/commit/0f58334b7b9a9d3d6ff34e9754961b6f67731fae),
   [#12190](https://github.com/angular/angular.js/issues/12190), [#13029](https://github.com/angular/angular.js/issues/13029), [#13033](https://github.com/angular/angular.js/issues/13033))
  - override select option registration to allow compilation of empty option
  ([7b2ecf42](https://github.com/angular/angular.js/commit/7b2ecf42c697eb8d51a0f2d73b324bd900139e05),
   [#11685](https://github.com/angular/angular.js/issues/11685), [#12972](https://github.com/angular/angular.js/issues/12972), [#12968](https://github.com/angular/angular.js/issues/12968), [#13012](https://github.com/angular/angular.js/issues/13012))


## Performance Improvements

- **$compile:** use static jquery data method to avoid creating new instances
  ([55ad192e](https://github.com/angular/angular.js/commit/55ad192e4ab79295ab15ecaaf8f6b9e7932a0336))
- **copy:**
  - avoid regex in `isTypedArray`
  ([19fab4a1](https://github.com/angular/angular.js/commit/19fab4a1d79d2445795273f1622344353cf4d104))
  - only validate/clear if the user specifies a destination
  ([d1293540](https://github.com/angular/angular.js/commit/d1293540e13573eb9ea5f90730bb9c9710c345db),
   [#12068](https://github.com/angular/angular.js/issues/12068))
- **merge:** remove unnecessary wrapping of jqLite element
  ([ce6a96b0](https://github.com/angular/angular.js/commit/ce6a96b0d76dd2e5ab2247ca3059d284575bc6f0),
   [#13236](https://github.com/angular/angular.js/issues/13236))


## Breaking Changes


<a name="1.5.0-beta.2"></a>
# 1.5.0-beta.2 effective-delegation (2015-11-17)


## Bug Fixes

- **$animate:** ensure leave animation calls `close` callback
  ([bfad2a4f](https://github.com/angular/angular.js/commit/bfad2a4f4ae71cfead61c112b0d2ab1fcadd39ee),
   [#12278](https://github.com/angular/angular.js/issues/12278), [#12096](https://github.com/angular/angular.js/issues/12096), [#13054](https://github.com/angular/angular.js/issues/13054))
- **$cacheFactory:** check key exists before decreasing cache size count
  ([b9bed7d9](https://github.com/angular/angular.js/commit/b9bed7d9dadb4ba1a4186f2ae562f807b21bcf12),
   [#12321](https://github.com/angular/angular.js/issues/12321), [#12329](https://github.com/angular/angular.js/issues/12329))
- **$compile:**
  - bind all directive controllers correctly when using `bindToController`
  ([bd7b2177](https://github.com/angular/angular.js/commit/bd7b2177291697a665e4068501b3704200972467),
   [1c13a4f4](https://github.com/angular/angular.js/commit/1c13a4f45ddc86805a96576b75c969ad577b6274)
   [#11343](https://github.com/angular/angular.js/issues/11343), [#11345](https://github.com/angular/angular.js/issues/11345))
  - evaluate against the correct scope with bindToController on new scope
  ([50557a6c](https://github.com/angular/angular.js/commit/50557a6cd329e8438fb5694d11e8a7d018142afe),
   [#13021](https://github.com/angular/angular.js/issues/13021), [#13025](https://github.com/angular/angular.js/issues/13025))
  - fix scoping of transclusion directives inside a replace directive
  ([1a98c0ee](https://github.com/angular/angular.js/commit/1a98c0ee346b718b9462da1abf4352a4605cbc7f),
   [#12975](https://github.com/angular/angular.js/issues/12975), [#12936](https://github.com/angular/angular.js/issues/12936), [#13244](https://github.com/angular/angular.js/issues/13244))
  - use createMap() for $$observe listeners when initialized from attr interpolation
  ([76c2491a](https://github.com/angular/angular.js/commit/76c2491a316d6b296c721227529fcb09087d369a),
   [#10446](https://github.com/angular/angular.js/issues/10446))
  - properly sanitize xlink:href attribute interpolation
  ([f33ce173](https://github.com/angular/angular.js/commit/f33ce173c90736e349cf594df717ae3ee41e0f7a),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **$http:** apply `transformResponse` even when `data` is empty
  ([7c0731ed](https://github.com/angular/angular.js/commit/7c0731edb2f72bdf0efa186f641dab3b6aecc5d5),
   [#12976](https://github.com/angular/angular.js/issues/12976), [#12979](https://github.com/angular/angular.js/issues/12979))
- **$location:** ensure `$locationChangeSuccess` fires even if URL ends with `#`
  ([4412fe23](https://github.com/angular/angular.js/commit/4412fe238f37f79a2017ee7b20ba089c0acd73e9),
   [#12175](https://github.com/angular/angular.js/issues/12175), [#13251](https://github.com/angular/angular.js/issues/13251))
- **$parse:**
  - evaluate simple expressions in interpolations only once
  ([1caf0b6b](https://github.com/angular/angular.js/commit/1caf0b6bee5781589e20f7a27a8c60e8b1b784f5),
   [#12983](https://github.com/angular/angular.js/issues/12983), [#13002](https://github.com/angular/angular.js/issues/13002))
  - fix typo in error message ("assing" -> "assign")
  ([70dac5ae](https://github.com/angular/angular.js/commit/70dac5ae82ffe9c6250681274905583747523b5d),
   [#12940](https://github.com/angular/angular.js/issues/12940))
  - block assigning to fields of a constructor
  ([e1f4f23f](https://github.com/angular/angular.js/commit/e1f4f23f781a79ae8a4046b21130283cec3f2917),
   [#12860](https://github.com/angular/angular.js/issues/12860))
  - safer conversion of computed properties to strings
  ([20cf7d5e](https://github.com/angular/angular.js/commit/20cf7d5e3a0af766b1929e24794859c79439351c))
- **$resource:** allow XHR request to be cancelled via a timeout promise
  ([4fc73466](https://github.com/angular/angular.js/commit/4fc734665e5dddef26ed30a9d4f75632cd269481),
   [#12657](https://github.com/angular/angular.js/issues/12657), [#12675](https://github.com/angular/angular.js/issues/12675), [#10890](https://github.com/angular/angular.js/issues/10890), [#9332](https://github.com/angular/angular.js/issues/9332))
- **$rootScope:** prevent IE9 memory leak when destroying scopes
  ([8fe781fb](https://github.com/angular/angular.js/commit/8fe781fbe7c42c64eb895c28d9fd5479b037d020),
   [#10706](https://github.com/angular/angular.js/issues/10706), [#11786](https://github.com/angular/angular.js/issues/11786))
- **$sanitize:**
  - strip urls starting with 'unsafe:' as opposed to 'unsafe'
  ([a4dfa4d0](https://github.com/angular/angular.js/commit/a4dfa4d061fd2f6baf9821f0863dcce7888232ab),
   [#12524](https://github.com/angular/angular.js/issues/12524))
  - add mXSS protection
  ([bc0d8c4e](https://github.com/angular/angular.js/commit/bc0d8c4eea9a34bff5e29dd492dcdd668251be40),
   [#12524](https://github.com/angular/angular.js/issues/12524))
  - support void elements, fixups, remove dead code, typos
  ([94207f8f](https://github.com/angular/angular.js/commit/94207f8fb6ee8fe26fe18657f6b5aca6def99605),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **Angular.js:** fix `isArrayLike` for unusual cases
  ([2c8d87e0](https://github.com/angular/angular.js/commit/2c8d87e064dca99a49ed35d1db885b1f2e40dcf4),
   [#10186](https://github.com/angular/angular.js/issues/10186), [#8000](https://github.com/angular/angular.js/issues/8000), [#4855](https://github.com/angular/angular.js/issues/4855), [#4751](https://github.com/angular/angular.js/issues/4751), [#10272](https://github.com/angular/angular.js/issues/10272))
- **filters:** ensure `formatNumber` observes i18n decimal separators
  ([658a865c](https://github.com/angular/angular.js/commit/658a865c5b2580eed53b340e7394945cd76e2260),
   [#10342](https://github.com/angular/angular.js/issues/10342), [#12850](https://github.com/angular/angular.js/issues/12850))
- **injector:** support arrow functions with no parentheses
  ([03726f7f](https://github.com/angular/angular.js/commit/03726f7fbd5d71c0604b8dd40e97cb2fb0fb777f),
   [#12890](https://github.com/angular/angular.js/issues/12890))
- **input:** remove workaround for Firefox bug
  ([b366f035](https://github.com/angular/angular.js/commit/b366f0352abccfe4c4868b5a9e8c0b88659bd1ee))
- **isArrayLike:** handle jQuery objects of length 0
  ([773efd08](https://github.com/angular/angular.js/commit/773efd0812097a89944c889c595485a5744326f6))
- **jqLite:**
  - deregister special `mouseenter` / `mouseleave` events correctly
  ([f5aa2079](https://github.com/angular/angular.js/commit/f5aa207960e0df577284a06a4353e2b53b159589),
   [#12795](https://github.com/angular/angular.js/issues/12795), [#12799](https://github.com/angular/angular.js/issues/12799))
  - ensure mouseenter works with svg elements on IE
  ([941c1c35](https://github.com/angular/angular.js/commit/941c1c35f175c36171a8855323f086341ea55711),
   [#10259](https://github.com/angular/angular.js/issues/10259), [#10276](https://github.com/angular/angular.js/issues/10276))
- **limitTo:** start at 0 if `begin` is negative and exceeds input length
  ([ecf93048](https://github.com/angular/angular.js/commit/ecf9304811a0fd54289a35b9c3b715a1d4447806),
   [#12775](https://github.com/angular/angular.js/issues/12775), [#12781](https://github.com/angular/angular.js/issues/12781))
- **merge:**
  - ensure that jqlite->jqlite and DOM->DOM
  ([75292a6c](https://github.com/angular/angular.js/commit/75292a6cb5e17d618902f7996e80eb3118eff7b0))
  - clone elements instead of treating them like simple objects
  ([17715fa3](https://github.com/angular/angular.js/commit/17715fa3668b1fcabaedcd82e2e57b2a80e0a0c2),
   [#12286](https://github.com/angular/angular.js/issues/12286))
- **ngAnimate:**
  - ensure anchoring uses body as a container when needed
  ([240d5896](https://github.com/angular/angular.js/commit/240d5896ecdfac2351f9bd6147b52de52c0b7608),
   [#12872](https://github.com/angular/angular.js/issues/12872))
  - callback detection should only use RAF when necessary
  ([8b27c3f0](https://github.com/angular/angular.js/commit/8b27c3f064b34532ba99d709cadf09fc4c0cbeab))
- **ngAria:** don't add tabindex to radio and checkbox inputs
  ([662fb282](https://github.com/angular/angular.js/commit/662fb282c176ca00a85b6dec7af90446ea90f662),
   [#12492](https://github.com/angular/angular.js/issues/12492), [#13095](https://github.com/angular/angular.js/issues/13095))
- **ngInput:** change URL_REGEXP to better match RFC3987
  ([ffb6b2fb](https://github.com/angular/angular.js/commit/ffb6b2fb56d9ffcb051284965dd538629ea9687a),
   [#11341](https://github.com/angular/angular.js/issues/11341), [#11381](https://github.com/angular/angular.js/issues/11381))
- **ngMessage:** make ngMessage compatible with ngBind
  ([4971ef12](https://github.com/angular/angular.js/commit/4971ef12d4c2c268cb8d26f90385dc96eba19db8),
   [#8089](https://github.com/angular/angular.js/issues/8089), [#13074](https://github.com/angular/angular.js/issues/13074))
- **ngMessages:** prevent race condition with ngAnimate
  ([8366622b](https://github.com/angular/angular.js/commit/8366622bed009d2cad7d0cff28b9c1e48bfbd4e1),
   [#12856](https://github.com/angular/angular.js/issues/12856), [#12903](https://github.com/angular/angular.js/issues/12903))
- **ngMock:** reset cache before every test
  ([fd83d372](https://github.com/angular/angular.js/commit/fd83d3724ad30a93254f08cb82f981eaddb5dbff),
   [#13013](https://github.com/angular/angular.js/issues/13013))
- **ngOptions:**
  - skip comments and empty options when looking for options
  ([395f3ec6](https://github.com/angular/angular.js/commit/395f3ec638f2ee77d22889823aa80898a6ce812d),
   [#12190](https://github.com/angular/angular.js/issues/12190), [#13029](https://github.com/angular/angular.js/issues/13029), [#13033](https://github.com/angular/angular.js/issues/13033))
  - override select option registration to allow compilation of empty option
  ([2fcfd75a](https://github.com/angular/angular.js/commit/2fcfd75a142200e1a4b1b7ed4fb588e3befcbd57),
   [#11685](https://github.com/angular/angular.js/issues/11685), [#12972](https://github.com/angular/angular.js/issues/12972), [#12968](https://github.com/angular/angular.js/issues/12968), [#13012](https://github.com/angular/angular.js/issues/13012))
  - prevent frozen select ui in IE
  ([42c97c5d](https://github.com/angular/angular.js/commit/42c97c5db5921e9e5447fb32bdae1f48da42844f),
   [#11314](https://github.com/angular/angular.js/issues/11314), [#11795](https://github.com/angular/angular.js/issues/11795))
  - allow falsy values as option group identifiers
  ([b71d7c3f](https://github.com/angular/angular.js/commit/b71d7c3f3c04e65b02d88b33c22dd90ae3cdfc27),
   [#7015](https://github.com/angular/angular.js/issues/7015), [#7024](https://github.com/angular/angular.js/issues/7024), [#12888](https://github.com/angular/angular.js/issues/12888))
  - throw if ngModel is not present
  ([ded25187](https://github.com/angular/angular.js/commit/ded2518756d4409fdfda0d4af243f2125bea01b5),
   [#7047](https://github.com/angular/angular.js/issues/7047), [#12840](https://github.com/angular/angular.js/issues/12840))
- **ngResource:** encode `&` in URL query param values
  ([1c97a605](https://github.com/angular/angular.js/commit/1c97a6057bc013262be761bca5e5c22224c4bbf8),
   [#12201](https://github.com/angular/angular.js/issues/12201))
- **orderByFilter:** throw error if input is not array-like
  ([2a85a634](https://github.com/angular/angular.js/commit/2a85a634f86c84f15b411ce009a3515fca7ba580),
   [#11255](https://github.com/angular/angular.js/issues/11255), [#11719](https://github.com/angular/angular.js/issues/11719))


## Features

- **$animateCss:** add support for temporary styles via `cleanupStyles`
  ([9f67da62](https://github.com/angular/angular.js/commit/9f67da625293441e27559ebde7503cc63408a95c),
   [#12930](https://github.com/angular/angular.js/issues/12930))
- **$compile:** multiple transclusion via named slots
  ([a4ada8ba](https://github.com/angular/angular.js/commit/a4ada8ba9c4358273575e16778e76446ad080054),
   [#4357](https://github.com/angular/angular.js/issues/4357), [#12742](https://github.com/angular/angular.js/issues/12742), [#11736](https://github.com/angular/angular.js/issues/11736), [#12934](https://github.com/angular/angular.js/issues/12934))
- **$http:** add `$xhrFactory` service to enable creation of custom xhr objects
  ([106f90aa](https://github.com/angular/angular.js/commit/106f90aafa0fa5a81ad7af7ffc9d1e00ab97ffef),
   [#2318](https://github.com/angular/angular.js/issues/2318), [#9319](https://github.com/angular/angular.js/issues/9319), [#12159](https://github.com/angular/angular.js/issues/12159))
- **$injector:**
  - Allow specifying a decorator on $injector
  ([29a05984](https://github.com/angular/angular.js/commit/29a05984fe46c2c18ca51404f07c866dd92d1eec))
  - add strictDi property to $injector instance
  ([79577c5d](https://github.com/angular/angular.js/commit/79577c5d316c7bf0204d7d1747ddc5b15bfe2955),
   [#11728](https://github.com/angular/angular.js/issues/11728), [#11734](https://github.com/angular/angular.js/issues/11734))
- **$sanitize:** make svg support an opt-in
  ([181fc567](https://github.com/angular/angular.js/commit/181fc567d873df065f1e84af7225deb70a8d2eb9),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **$templateRequest:** support configuration of $http options
  ([b2fc39d2](https://github.com/angular/angular.js/commit/b2fc39d2ddac64249b4f2961ee18b878a1e98251),
   [#13188](https://github.com/angular/angular.js/issues/13188), [#11868](https://github.com/angular/angular.js/issues/11868), [#6860](https://github.com/angular/angular.js/issues/6860))
- **Module:** add helper method, `component(...)` for creating component directives
  ([54e81655](https://github.com/angular/angular.js/commit/54e816552f20e198e14f849cdb2379fed8570c1a),
   [#10007](https://github.com/angular/angular.js/issues/10007), [#12933](https://github.com/angular/angular.js/issues/12933))
- **linky:** add support for custom attributes
  ([06f002b1](https://github.com/angular/angular.js/commit/06f002b161f61079933d482668440d8649fd84fc),
   [#12558](https://github.com/angular/angular.js/issues/12558), [#13061](https://github.com/angular/angular.js/issues/13061))
- **ngAnimate:** introduce ngAnimateSwap directive
  ([78297d25](https://github.com/angular/angular.js/commit/78297d252de7c80f73ecf9e291ed71bd52578361))
- **ngMock:**
  - add expectRoute and whenRoute shortcuts with colon param matching
  ([d67e999d](https://github.com/angular/angular.js/commit/d67e999dfbdf47b79fdb3830a04f4f4010a98b98),
   [#12406](https://github.com/angular/angular.js/issues/12406))
  - invoke nested calls to `module()` immediately
  ([51a27c0f](https://github.com/angular/angular.js/commit/51a27c0f1ad6cd8d3e33ab0d71de22c1627c7ec3),
   [#12887](https://github.com/angular/angular.js/issues/12887))
- **ngModel:** provide ng-empty and ng-not-empty CSS classes
  ([630280c7](https://github.com/angular/angular.js/commit/630280c7fb04a83208d09c97c2efb81be3a3db74),
   [#10050](https://github.com/angular/angular.js/issues/10050), [#12848](https://github.com/angular/angular.js/issues/12848))


## Performance Improvements

- **$compile:**
  - use static jquery data method to avoid creating new instances
  ([9b90c32f](https://github.com/angular/angular.js/commit/9b90c32f31fd56e348539674128acec6536cd846))
  - lazily compile the `transclude` function
  ([652b83eb](https://github.com/angular/angular.js/commit/652b83eb226131d131a44453520a569202aa4aac))
- **$interpolate:** provide a simplified result for constant expressions
  ([cf83b4f4](https://github.com/angular/angular.js/commit/cf83b4f445d3a1fc18fc140e65e670754401d50b))
- **copy:**
  - avoid regex in `isTypedArray`
  ([c8768d12](https://github.com/angular/angular.js/commit/c8768d12f2f0b31f9ac971aeac6d2c17c9ff3db5))
  - only validate/clear if the user specifies a destination
  ([33c67ce7](https://github.com/angular/angular.js/commit/33c67ce785cf8be7f0c294b3942ca4a337c5759d),
   [#12068](https://github.com/angular/angular.js/issues/12068))
- **merge:** remove unnecessary wrapping of jqLite element
  ([4daafd3d](https://github.com/angular/angular.js/commit/4daafd3dbe6a80d578f5a31df1bb99c77559543e),
   [#13236](https://github.com/angular/angular.js/issues/13236))


## Breaking Changes

- **$sanitize:** due to [181fc567](https://github.com/angular/angular.js/commit/181fc567d873df065f1e84af7225deb70a8d2eb9),
  The svg support in  is now an opt-in option

Applications that depend on this option can use  to turn the option back on,
but while doing so, please read the warning provided in the  documentation for
information on preventing click-hijacking attacks when this option is turned on.

- **ngMessage:** due to [4971ef12](https://github.com/angular/angular.js/commit/4971ef12d4c2c268cb8d26f90385dc96eba19db8),

ngMessage is now compiled with a priority of 1, which means directives
on the same element as ngMessage with a priority lower than 1 will
be applied when ngMessage calls the $transclude function.
Previously, they were applied during the initial compile phase and were
passed the comment element created by the transclusion of ngMessage.
To restore this behavior, custom directives need to have
their priority increased to at least "1".

- **ngOptions:** due to [ded25187](https://github.com/angular/angular.js/commit/ded2518756d4409fdfda0d4af243f2125bea01b5),

`ngOptions` will now throw if `ngModel` is not present on the `select`
element. Previously, having no `ngModel` let `ngOptions` silently
fail, which could lead to hard to debug errors. The change should
therefore not affect any applications, as it simply makes the
requirement more strict and alerts the developer explicitly.

- **orderByFilter:** due to [2a85a634](https://github.com/angular/angular.js/commit/2a85a634f86c84f15b411ce009a3515fca7ba580),

Previously, an non array-like input would pass through the orderBy filter unchanged.
Now, an error is thrown. This can be worked around by converting an object
to an array, either manually or using a filter such as
https://github.com/petebacondarwin/angular-toArrayFilter.
(`null` and `undefined` still pass through without an error, in order to
support asynchronous loading of resources.)

Closes #11255
Closes #11719



<a name="1.5.0-beta.1"></a>
# 1.5.0-beta.1 dense-dispersion (2015-09-29)


## Bug Fixes

- **$compile:**
  - use createMap() for $$observe listeners when initialized from attr interpolation
  ([76c2491a](https://github.com/angular/angular.js/commit/76c2491a316d6b296c721227529fcb09087d369a),
   [#10446](https://github.com/angular/angular.js/issues/10446))
  - properly sanitize xlink:href attribute interpolation
  ([f33ce173](https://github.com/angular/angular.js/commit/f33ce173c90736e349cf594df717ae3ee41e0f7a),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **$parse:**
  - fix typo in error message ("assing" -> "assign")
  ([70dac5ae](https://github.com/angular/angular.js/commit/70dac5ae82ffe9c6250681274905583747523b5d),
   [#12940](https://github.com/angular/angular.js/issues/12940))
  - block assigning to fields of a constructor
  ([e1f4f23f](https://github.com/angular/angular.js/commit/e1f4f23f781a79ae8a4046b21130283cec3f2917),
   [#12860](https://github.com/angular/angular.js/issues/12860))
  - do not convert to string computed properties multiple times
  ([20cf7d5e](https://github.com/angular/angular.js/commit/20cf7d5e3a0af766b1929e24794859c79439351c))
- **$sanitize:**
  - strip urls starting with 'unsafe:' as opposed to 'unsafe'
  ([a4dfa4d0](https://github.com/angular/angular.js/commit/a4dfa4d061fd2f6baf9821f0863dcce7888232ab),
   [#12524](https://github.com/angular/angular.js/issues/12524))
  - add mXSS protection
  ([bc0d8c4e](https://github.com/angular/angular.js/commit/bc0d8c4eea9a34bff5e29dd492dcdd668251be40),
   [#12524](https://github.com/angular/angular.js/issues/12524))
  - support void elements, fixups, remove dead code, typos
  ([94207f8f](https://github.com/angular/angular.js/commit/94207f8fb6ee8fe26fe18657f6b5aca6def99605),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **filters:** ensure `formatNumber` observes i18n decimal separators
  ([658a865c](https://github.com/angular/angular.js/commit/658a865c5b2580eed53b340e7394945cd76e2260),
   [#10342](https://github.com/angular/angular.js/issues/10342), [#12850](https://github.com/angular/angular.js/issues/12850))
- **injector:** support arrow functions with no parenthesis
  ([03726f7f](https://github.com/angular/angular.js/commit/03726f7fbd5d71c0604b8dd40e97cb2fb0fb777f),
   [#12890](https://github.com/angular/angular.js/issues/12890))
- **input:** remove workaround for Firefox bug
  ([b366f035](https://github.com/angular/angular.js/commit/b366f0352abccfe4c4868b5a9e8c0b88659bd1ee))
- **ngAnimate:**
  - ensure anchoring uses body as a container when needed
  ([240d5896](https://github.com/angular/angular.js/commit/240d5896ecdfac2351f9bd6147b52de52c0b7608),
   [#12872](https://github.com/angular/angular.js/issues/12872))
  - callback detection should only use RAF when necessary
  ([8b27c3f0](https://github.com/angular/angular.js/commit/8b27c3f064b34532ba99d709cadf09fc4c0cbeab))
- **ngMessages:** prevent race condition with ngAnimate
  ([8366622b](https://github.com/angular/angular.js/commit/8366622bed009d2cad7d0cff28b9c1e48bfbd4e1),
   [#12856](https://github.com/angular/angular.js/issues/12856), [#12903](https://github.com/angular/angular.js/issues/12903))
- **ngOptions:**
  - skip comments when looking for option elements
  ([7f3f3dd3](https://github.com/angular/angular.js/commit/7f3f3dd3ebcc44711600ac292af54c411c3c705f),
   [#12190](https://github.com/angular/angular.js/issues/12190))
  - prevent frozen select ui in IE
  ([42c97c5d](https://github.com/angular/angular.js/commit/42c97c5db5921e9e5447fb32bdae1f48da42844f),
   [#11314](https://github.com/angular/angular.js/issues/11314), [#11795](https://github.com/angular/angular.js/issues/11795))
  - allow falsy values as option group identifiers
  ([b71d7c3f](https://github.com/angular/angular.js/commit/b71d7c3f3c04e65b02d88b33c22dd90ae3cdfc27),
   [#7015](https://github.com/angular/angular.js/issues/7015), [#7024](https://github.com/angular/angular.js/issues/7024), [#12888](https://github.com/angular/angular.js/issues/12888))
  - throw if ngModel is not present
  ([ded25187](https://github.com/angular/angular.js/commit/ded2518756d4409fdfda0d4af243f2125bea01b5),
   [#7047](https://github.com/angular/angular.js/issues/7047), [#12840](https://github.com/angular/angular.js/issues/12840))
- **ngResource:** encode `&` in URL query param values
  ([1c97a605](https://github.com/angular/angular.js/commit/1c97a6057bc013262be761bca5e5c22224c4bbf8),
   [#12201](https://github.com/angular/angular.js/issues/12201))


## Features

- **$animateCss:** add support for temporary styles via `cleanupStyles`
  ([9f67da62](https://github.com/angular/angular.js/commit/9f67da625293441e27559ebde7503cc63408a95c),
   [#12930](https://github.com/angular/angular.js/issues/12930))
- **$http:** add `$xhrFactory` service to enable creation of custom xhr objects
  ([106f90aa](https://github.com/angular/angular.js/commit/106f90aafa0fa5a81ad7af7ffc9d1e00ab97ffef),
   [#2318](https://github.com/angular/angular.js/issues/2318), [#9319](https://github.com/angular/angular.js/issues/9319), [#12159](https://github.com/angular/angular.js/issues/12159))
- **$injector:** add strictDi property to $injector instance
  ([79577c5d](https://github.com/angular/angular.js/commit/79577c5d316c7bf0204d7d1747ddc5b15bfe2955),
   [#11728](https://github.com/angular/angular.js/issues/11728), [#11734](https://github.com/angular/angular.js/issues/11734))
- **$sanitize:** make svg support an opt-in
  ([181fc567](https://github.com/angular/angular.js/commit/181fc567d873df065f1e84af7225deb70a8d2eb9),
   [#12524](https://github.com/angular/angular.js/issues/12524))
- **ngModel:** provide ng-empty and ng-not-empty CSS classes
  ([630280c7](https://github.com/angular/angular.js/commit/630280c7fb04a83208d09c97c2efb81be3a3db74),
   [#10050](https://github.com/angular/angular.js/issues/10050), [#12848](https://github.com/angular/angular.js/issues/12848))


## Performance Improvements

- **$compile:** Lazily compile the `transclude` function
  ([652b83eb](https://github.com/angular/angular.js/commit/652b83eb226131d131a44453520a569202aa4aac))


## Breaking Changes

- **$sanitize:** due to [181fc567](https://github.com/angular/angular.js/commit/181fc567d873df065f1e84af7225deb70a8d2eb9),
  The svg support in  is now an opt-in option

Applications that depend on this option can use  to turn the option back on,
but while doing so, please read the warning provided in the  documentation for
information on preventing click-hijacking attacks when this option is turned on.

- **ngOptions:** due to [ded25187](https://github.com/angular/angular.js/commit/ded2518756d4409fdfda0d4af243f2125bea01b5),

`ngOptions` will now throw if `ngModel` is not present on the `select`
element. Previously, having no `ngModel` let `ngOptions` silently
fail, which could lead to hard to debug errors. The change should
therefore not affect any applications, as it simply makes the
requirement more strict and alerts the developer explicitly.


<a name="1.4.7"></a>
# 1.4.7 dark-luminescence (2015-09-29)


## Bug Fixes

- **$compile:** use createMap() for $$observe listeners when initialized from attr interpolation
  ([5a98e806](https://github.com/angular/angular.js/commit/5a98e806ef3c59916bb4668268125610b11effe8),
   [#10446](https://github.com/angular/angular.js/issues/10446))
- **$parse:**
  - block assigning to fields of a constructor
  ([a7f3761e](https://github.com/angular/angular.js/commit/a7f3761eda5309f76b73c6fb1d3173a270112899),
   [#12860](https://github.com/angular/angular.js/issues/12860))
  - do not convert to string computed properties multiple times
  ([698af191](https://github.com/angular/angular.js/commit/698af191ded2465ca4e0f97959b75fede5a531ab))
- **filters:** ensure `formatNumber` observes i18n decimal separators
  ([4994acd2](https://github.com/angular/angular.js/commit/4994acd26e582eec8a92b139bfc09ca79a9b8835),
   [#10342](https://github.com/angular/angular.js/issues/10342), [#12850](https://github.com/angular/angular.js/issues/12850))
- **jqLite:** properly handle dash-delimited node names in `jqLiteBuildFragment`
  ([cdd1227a](https://github.com/angular/angular.js/commit/cdd1227a308edd34d31b67f338083b6e0c4c0db9),
   [#10617](https://github.com/angular/angular.js/issues/10617), [#12759](https://github.com/angular/angular.js/issues/12759))
- **ngAnimate:**
  - ensure anchoring uses body as a container when needed
  ([9d3704ca](https://github.com/angular/angular.js/commit/9d3704ca467081f16b71b011eb50c53d5cdb2f34),
   [#12872](https://github.com/angular/angular.js/issues/12872))
  - callback detection should only use RAF when necessary
  ([fa8c399f](https://github.com/angular/angular.js/commit/fa8c399fadc30b78710868fe59d2930fdc17c7a5))
- **ngMessages:** prevent race condition with ngAnimate
  ([7295c60f](https://github.com/angular/angular.js/commit/7295c60ffb9f2e4f32043c538ace740b187f565a),
   [#12856](https://github.com/angular/angular.js/issues/12856), [#12903](https://github.com/angular/angular.js/issues/12903))
- **ngOptions:**
  - skip comments when looking for option elements
  ([68d4dc5b](https://github.com/angular/angular.js/commit/68d4dc5b71b23e4c7c2650e6da3d7200de99f1ae),
   [#12190](https://github.com/angular/angular.js/issues/12190))
  - prevent frozen select ui in IE
  ([dbc69851](https://github.com/angular/angular.js/commit/dbc698517ff620b3a6279f65d4a9b6e3c15087b9),
   [#11314](https://github.com/angular/angular.js/issues/11314), [#11795](https://github.com/angular/angular.js/issues/11795))


## Features

- **$animateCss:** add support for temporary styles via `cleanupStyles`
  ([e52d731b](https://github.com/angular/angular.js/commit/e52d731bfd1fbb6c616125fbde2fb365722254b7),
   [#12930](https://github.com/angular/angular.js/issues/12930))
- **$http:** add `$xhrFactory` service to enable creation of custom xhr objects
  ([7a413df5](https://github.com/angular/angular.js/commit/7a413df5e47e04e20a1c93d35922050bbcbfb492),
   [#2318](https://github.com/angular/angular.js/issues/2318), [#9319](https://github.com/angular/angular.js/issues/9319), [#12159](https://github.com/angular/angular.js/issues/12159))


## Breaking Changes


<a name="1.3.20"></a>
# 1.3.20 shallow-translucence (2015-09-29)


## Bug Fixes

- **$parse:** do not convert to string computed properties multiple times
  ([d434f3db](https://github.com/angular/angular.js/commit/d434f3db53d6209eb140b904e83bbde401686c16))


## Breaking Changes


<a name="1.2.29"></a>
# 1.2.29 ultimate-deprecation (2015-09-29)


## Bug Fixes

- **$browser:** prevent infinite digests when clearing the hash of a url
  ([9845cee6](https://github.com/angular/angular.js/commit/9845cee63eda3ad5024622c792c5e745b59ec5cb),
   [#9629](https://github.com/angular/angular.js/issues/9629), [#9635](https://github.com/angular/angular.js/issues/9635), [#10228](https://github.com/angular/angular.js/issues/10228), [#10308](https://github.com/angular/angular.js/issues/10308))
- **$compile:** workaround for IE11 MutationObserver
  ([fccce96d](https://github.com/angular/angular.js/commit/fccce96d444f442ba5ecfb67201505a445d0c209),
   [#11781](https://github.com/angular/angular.js/issues/11781), [#12613](https://github.com/angular/angular.js/issues/12613))
- **$location:** strip off empty hash segments when comparing
  ([e81b2f72](https://github.com/angular/angular.js/commit/e81b2f726cacd08bcf91500183a7ea3f71961718),
   [#9635](https://github.com/angular/angular.js/issues/9635), [#10748](https://github.com/angular/angular.js/issues/10748))
- **$parse:**
  - do not convert to string computed properties multiple times
  ([afb65c11](https://github.com/angular/angular.js/commit/afb65c11e5e3425f8431ad5b82308ff6b8ecbc64))
  - throw error when accessing a restricted property indirectly
  ([e6cbd4fa](https://github.com/angular/angular.js/commit/e6cbd4faa211b2c0c8879c255e3194fb0717dcec),
   [#12833](https://github.com/angular/angular.js/issues/12833))
- **ngAnimate:** ensure that minified repaint code isn't removed
  ([b041b664](https://github.com/angular/angular.js/commit/b041b664752e34a42bbc65e02bf0009f0836c50c),
   [#9936](https://github.com/angular/angular.js/issues/9936))


## Breaking Changes


<a name="1.4.6"></a>
# 1.4.6 multiplicative-elevation (2015-09-17)


## Bug Fixes

- **$animate:** invalid CSS class names should not break subsequent elements
  ([c3a654b7](https://github.com/angular/angular.js/commit/c3a654b7c8e585b8fb9f90ece10ef54d19fd74c8),
   [#12674](https://github.com/angular/angular.js/issues/12674), [#12725](https://github.com/angular/angular.js/issues/12725))
- **$browser:** handle async updates to location
  ([8d39bd8a](https://github.com/angular/angular.js/commit/8d39bd8abf423517b5bff70137c2a29e32bff76d),
   [#12241](https://github.com/angular/angular.js/issues/12241), [#12819](https://github.com/angular/angular.js/issues/12819))
- **$http:** propagate status -1 for timed out requests
  ([38520a1a](https://github.com/angular/angular.js/commit/38520a1a73fffb6cfeffc7edfcab5be33e1619eb),
   [#4491](https://github.com/angular/angular.js/issues/4491), [#8756](https://github.com/angular/angular.js/issues/8756))
- **$httpBackend:** send `null` when post-data is undefined
  ([6f39f108](https://github.com/angular/angular.js/commit/6f39f1082773921e79b48a78aa6cd8a7d1921da7),
   [#12141](https://github.com/angular/angular.js/issues/12141), [#12739](https://github.com/angular/angular.js/issues/12739))
- **$parse:**
  - throw error when accessing a restricted property indirectly
  ([b2f8b0b8](https://github.com/angular/angular.js/commit/b2f8b0b875dbabf7bba0ba6e9bd553c7a8b910d0),
   [#12833](https://github.com/angular/angular.js/issues/12833))
  - `assign` returns the new value
  ([7d2c6eee](https://github.com/angular/angular.js/commit/7d2c6eeef8ad61690737b6298c94f066082eff58),
   [#12675](https://github.com/angular/angular.js/issues/12675), [#12708](https://github.com/angular/angular.js/issues/12708))
- **angular.copy:** support copying XML nodes
  ([122ab074](https://github.com/angular/angular.js/commit/122ab074cac6401ecded51fa031af139360f40aa),
   [#5429](https://github.com/angular/angular.js/issues/5429), [#12786](https://github.com/angular/angular.js/issues/12786))
- **form, ngModel:** correctly notify parent form when children are added
  ([c6110e8b](https://github.com/angular/angular.js/commit/c6110e8b08c7e9bb2b7da5ecc5c42d1a834ea92d))
- **input:** ignore min/max if they are empty on all input types
  ([544001f5](https://github.com/angular/angular.js/commit/544001f5a331de06961c0201d69ecc92893abd0b),
   [#12363](https://github.com/angular/angular.js/issues/12363), [#12785](https://github.com/angular/angular.js/issues/12785))
- **ngAnimateMock:** $animate.flush should work for looping animations
  ([472d076c](https://github.com/angular/angular.js/commit/472d076cca2ffb99bd87d3c026ef69afc713268d))
- **ngAria:** clean up tabindex usage
  ([f48244ce](https://github.com/angular/angular.js/commit/f48244ce5e6d11637aab97af1aff3430bda12429),
   [#11500](https://github.com/angular/angular.js/issues/11500))
- **ngJq:** properly detect when `ng-jq` is empty
  ([19ecdb54](https://github.com/angular/angular.js/commit/19ecdb54bf85fc4e7bd3cde453aa6843f869a1ab),
   [#12741](https://github.com/angular/angular.js/issues/12741))
- **ngModel:**
  - remove reference to parentForm from removed control
  ([290b5049](https://github.com/angular/angular.js/commit/290b5049c2de4aa0d6ba8eea624bc6dce027b197),
   [#12263](https://github.com/angular/angular.js/issues/12263))
  - let aliased validator directives work on any element
  ([43769fb6](https://github.com/angular/angular.js/commit/43769fb676ae904852582a2c88a5523f0b9f58fc),
   [#12158](https://github.com/angular/angular.js/issues/12158), [#12658](https://github.com/angular/angular.js/issues/12658))
- **ngRepeat:** add support to iterate an object's properties even if it does not inherit from Object
  ([7ea2c7f3](https://github.com/angular/angular.js/commit/7ea2c7f36ef854391df3f6b127ad42a2d5cbf1a3),
   [#9964](https://github.com/angular/angular.js/issues/9964))
- **rootScope:** add support for watchCollection to watch an object which does not inherit from Object
  ([20fb626b](https://github.com/angular/angular.js/commit/20fb626b78ed8fbd02f59f5b26df9387a2a6ea0e),
   [#9964](https://github.com/angular/angular.js/issues/9964))
- **select:** update option if interpolated value attribute changes
  ([82b0929e](https://github.com/angular/angular.js/commit/82b0929e4ea0ae087f766f2ee26f9570c8a3c8ac),
   [#12005](https://github.com/angular/angular.js/issues/12005), [#12582](https://github.com/angular/angular.js/issues/12582))
- **toDebugString:** change replacement string
  ([0ca8b1df](https://github.com/angular/angular.js/commit/0ca8b1df201044019596db7173d784aeebdea0a7),
   [#10103](https://github.com/angular/angular.js/issues/10103))


## Performance Improvements

- **Angular:** only create new collection in getBlockNodes if the block has changed
  ([0202663e](https://github.com/angular/angular.js/commit/0202663e938a477cd86145bb158bf7a02efd8fb5),
   [#9899](https://github.com/angular/angular.js/issues/9899))




<a name="1.3.19"></a>
# 1.3.19 glutinous-shriek (2015-09-15)

## Bug Fixes

- **$http:** propagate status -1 for timed out requests
  ([f13055a0](https://github.com/angular/angular.js/commit/f13055a0a53a39b160448713a5617edee6042801),
   [#4491](https://github.com/angular/angular.js/issues/4491), [#8756](https://github.com/angular/angular.js/issues/8756))
- **$location:** don't crash if navigating outside the app base
  ([623ce1ad](https://github.com/angular/angular.js/commit/623ce1ad2cf68024719c5cae5d682d00195df30c),
   [#11667](https://github.com/angular/angular.js/issues/11667))
- **$parse:** throw error when accessing a restricted property indirectly
  ([ec98c94c](https://github.com/angular/angular.js/commit/ec98c94ccbfc97b655447956738d5f6ff98b2f33),
   [#12833](https://github.com/angular/angular.js/issues/12833))
- **ngModel:** validate pattern against the viewValue
  ([274e9353](https://github.com/angular/angular.js/commit/274e93537ed4e95aefeacea48909eb334894f0ac),
   [#12344](https://github.com/angular/angular.js/issues/12344))


## Features

- **ngAnimate:** introduce `$animate.flush` for unit testing
  ([f98e0384](https://github.com/angular/angular.js/commit/f98e038418f7367b2373adcf4887f64a8e8bdcb0))


## Possible Breaking Changes

- **ngModel:** due to [274e9353](https://github.com/angular/angular.js/commit/274e93537ed4e95aefeacea48909eb334894f0ac),


The `ngPattern` and `pattern` directives will validate the regex
against the `viewValue` of `ngModel`, i.e. the value of the model
before the $parsers are applied. Previously, the modelValue
(the result of the $parsers) was validated.

This fixes issues where `input[date]` and `input[number]` cannot
be validated because the viewValue string is parsed into
`Date` and `Number` respectively (starting with Angular 1.3).
It also brings the directives in line with HTML5 constraint
validation, which validates against the input value.

This change is unlikely to cause applications to fail, because even
in Angular 1.2, the value that was validated by pattern could have
been manipulated by the $parsers, as all validation was done
inside this pipeline.

If you rely on the pattern being validated against the modelValue,
you must create your own validator directive that overwrites
the built-in pattern validator:

```
.directive('patternModelOverwrite', function patternModelOverwriteDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    priority: 1,
    compile: function() {
      var regexp, patternExp;

      return {
        pre: function(scope, elm, attr, ctrl) {
          if (!ctrl) return;

          attr.$observe('pattern', function(regex) {
            /**
             * The built-in directive will call our overwritten validator
             * (see below). We just need to update the regex.
             * The preLink fn guaranetees our observer is called first.
             */
            if (isString(regex) && regex.length > 0) {
              regex = new RegExp('^' + regex + '$');
            }

            if (regex && !regex.test) {
              //The built-in validator will throw at this point
              return;
            }

            regexp = regex || undefined;
          });

        },
        post: function(scope, elm, attr, ctrl) {
          if (!ctrl) return;

          regexp, patternExp = attr.ngPattern || attr.pattern;

          //The postLink fn guarantees we overwrite the built-in pattern validator
          ctrl.$validators.pattern = function(value) {
            return ctrl.$isEmpty(value) ||
              isUndefined(regexp) ||
              regexp.test(value);
          };
        }
      };
    }
  };
});
```


<a name="1.4.5"></a>
# 1.4.5 permanent-internship (2015-08-28)


## Bug Fixes

- **$animate:** `$animate.enabled(false)` should disable animations on $animateCss as well
  ([c3d5e33e](https://github.com/angular/angular.js/commit/c3d5e33e18bd9e423e2d0678e85564fad1dba99f),
   [#12696](https://github.com/angular/angular.js/issues/12696), [#12685](https://github.com/angular/angular.js/issues/12685))
- **$animateCss:**
  - do not throw errors when a closing timeout is fired on a removed element
  ([2f6b6fb7](https://github.com/angular/angular.js/commit/2f6b6fb7a1dee0ff97c5d2959b927347eeda6e8b),
   [#12650](https://github.com/angular/angular.js/issues/12650))
  - fix parse errors on older Android WebViews
  ([1cc9c9ca](https://github.com/angular/angular.js/commit/1cc9c9ca9d9698356ea541517b3d06ce6556c01d),
   [#12610](https://github.com/angular/angular.js/issues/12610))
  - properly handle cancellation timeouts for follow-up animations
  ([d8816731](https://github.com/angular/angular.js/commit/d88167318d1c69f0dbd2101c05955eb450c34fd5),
   [#12490](https://github.com/angular/angular.js/issues/12490), [#12359](https://github.com/angular/angular.js/issues/12359))
  - ensure failed animations clear the internal cache
  ([0a75a3db](https://github.com/angular/angular.js/commit/0a75a3db6ef265389c8c955981c2fe67bb4f7769),
   [#12214](https://github.com/angular/angular.js/issues/12214), [#12518](https://github.com/angular/angular.js/issues/12518), [#12381](https://github.com/angular/angular.js/issues/12381))
  - the transitions options delay value should be applied before class application
  ([0c81e9fd](https://github.com/angular/angular.js/commit/0c81e9fd25285dd757db98d458919776a1fb62fc),
   [#12584](https://github.com/angular/angular.js/issues/12584))
- **ngAnimate:**
  - use requestAnimationFrame to space out child animations
  ([ea8016c4](https://github.com/angular/angular.js/commit/ea8016c4c8f55bc021549f342618ed869998e335),
   [#12669](https://github.com/angular/angular.js/issues/12669), [#12594](https://github.com/angular/angular.js/issues/12594), [#12655](https://github.com/angular/angular.js/issues/12655), [#12631](https://github.com/angular/angular.js/issues/12631), [#12612](https://github.com/angular/angular.js/issues/12612), [#12187](https://github.com/angular/angular.js/issues/12187))
  - only buffer rAF requests within the animation runners
  ([dc48aadd](https://github.com/angular/angular.js/commit/dc48aadd26bbf1797c1c408f63ffde99d67414a9),
   [#12280](https://github.com/angular/angular.js/issues/12280))
- **ngModel:** validate pattern against the viewValue
  ([0e001084](https://github.com/angular/angular.js/commit/0e001084ffff8674efad289d37cb16cc4e46b50a),
   [#12344](https://github.com/angular/angular.js/issues/12344))
- **ngResources:** support IPv6 URLs
  ([b643f0d3](https://github.com/angular/angular.js/commit/b643f0d3223a627ef813f0777524e25d2dd95371),
   [#12512](https://github.com/angular/angular.js/issues/12512), [#12532](https://github.com/angular/angular.js/issues/12532))


## Breaking Changes

- **ngModel:** due to [0e001084](https://github.com/angular/angular.js/commit/0e001084ffff8674efad289d37cb16cc4e46b50a),


The `ngPattern` and `pattern` directives will validate the regex
against the `viewValue` of `ngModel`, i.e. the value of the model
before the $parsers are applied. Previously, the modelValue
(the result of the $parsers) was validated.

This fixes issues where `input[date]` and `input[number]` cannot
be validated because the viewValue string is parsed into
`Date` and `Number` respectively (starting with Angular 1.3).
It also brings the directives in line with HTML5 constraint
validation, which validates against the input value.

This change is unlikely to cause applications to fail, because even
in Angular 1.2, the value that was validated by pattern could have
been manipulated by the $parsers, as all validation was done
inside this pipeline.

If you rely on the pattern being validated against the modelValue,
you must create your own validator directive that overwrites
the built-in pattern validator:

```js
.directive('patternModelOverwrite', function patternModelOverwriteDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    priority: 1,
    compile: function() {
      var regexp, patternExp;

      return {
        pre: function(scope, elm, attr, ctrl) {
          if (!ctrl) return;

          attr.$observe('pattern', function(regex) {
            /**
             * The built-in directive will call our overwritten validator
             * (see below). We just need to update the regex.
             * The preLink fn guaranetees our observer is called first.
             */
            if (isString(regex) && regex.length > 0) {
              regex = new RegExp('^' + regex + '$');
            }

            if (regex && !regex.test) {
              //The built-in validator will throw at this point
              return;
            }

            regexp = regex || undefined;
          });

        },
        post: function(scope, elm, attr, ctrl) {
          if (!ctrl) return;

          regexp, patternExp = attr.ngPattern || attr.pattern;

          //The postLink fn guarantees we overwrite the built-in pattern validator
          ctrl.$validators.pattern = function(value) {
            return ctrl.$isEmpty(value) ||
              isUndefined(regexp) ||
              regexp.test(value);
          };
        }
      };
    }
  };
});
```


<a name="1.3.18"></a>
# 1.3.18 collective-penmanship (2015-08-18)


## Bug Fixes

- **$animate:**
  - clear class animations cache if animation is not started
  ([2c03a357](https://github.com/angular/angular.js/commit/2c03a3574336ed814d020cf7ba36cee5b87e65b5),
   [#12604](https://github.com/angular/angular.js/issues/12604), [#12603](https://github.com/angular/angular.js/issues/12603))
  - do not throw errors if element is removed before animation starts
  ([6b72598b](https://github.com/angular/angular.js/commit/6b72598b87022e1dd96bddc4451e007ef0601579),
   [#10205](https://github.com/angular/angular.js/issues/10205))
- **ngModel:** correct minErr usage for correct doc creation
  ([64a142b5](https://github.com/angular/angular.js/commit/64a142b58ed0a0e3896d82f3f9ce35373548d0ff),
   [#12386](https://github.com/angular/angular.js/issues/12386), [#12416](https://github.com/angular/angular.js/issues/12416))



<a name="1.4.4"></a>
# 1.4.4 pylon-requirement (2015-08-13)


## Bug Fixes

- **$animate:**
  - leave animation callback should not overridden by follow-up animation
  ([92e41ac9](https://github.com/angular/angular.js/commit/92e41ac904b7d16e96fd31a49ac2ae15d606a665),
   [#12271](https://github.com/angular/angular.js/issues/12271), [#12249](https://github.com/angular/angular.js/issues/12249), [#12161](https://github.com/angular/angular.js/issues/12161))
  - make sure to run a post-digest reflow for parentless animations
  ([861636c6](https://github.com/angular/angular.js/commit/861636c62542252a54fb2d2fa8ea9e17eefee120),
   [#12400](https://github.com/angular/angular.js/issues/12400), [#12401](https://github.com/angular/angular.js/issues/12401))
  - ensure that class-based animations are properly applied when cancelled
  ([21d6db38](https://github.com/angular/angular.js/commit/21d6db382d8f3540fb0bb7280570fba8d88d9843),
   [#12266](https://github.com/angular/angular.js/issues/12266), [#12007](https://github.com/angular/angular.js/issues/12007))
- **$animateCss:** make sure that `skipBlocking` avoids the pre-emptive transition-delay styling
  ([11695ca6](https://github.com/angular/angular.js/commit/11695ca6e2ce5b21bb944ee0de80892203155cbb))
- **$compile:**
  - don't trigger $observer if initial value is `undefined`
  ([6f3b8622](https://github.com/angular/angular.js/commit/6f3b8622adce2006df5cf7eed4bf9262539004bd),
   [#12383](https://github.com/angular/angular.js/issues/12383), [#12464](https://github.com/angular/angular.js/issues/12464))
  - ignore optional =-bound properties with empty value
  ([533d9b76](https://github.com/angular/angular.js/commit/533d9b76704368ba9700ab08589118abca9f598c),
   [#12144](https://github.com/angular/angular.js/issues/12144), [#12259](https://github.com/angular/angular.js/issues/12259), [#12290](https://github.com/angular/angular.js/issues/12290))
- **$injector:** Allows ES6 function syntax
  ([44a96a4c](https://github.com/angular/angular.js/commit/44a96a4c140873d9fd8484d870af83a0bb9acabd),
   [#12424](https://github.com/angular/angular.js/issues/12424), [#12425](https://github.com/angular/angular.js/issues/12425))
- **$location:** don't crash if navigating outside the app base
  ([9e492c35](https://github.com/angular/angular.js/commit/9e492c358c19549696577c86c2c61b93f50ab356),
   [#11667](https://github.com/angular/angular.js/issues/11667))
- **$q:** Use extend to avoid overwriting prototype
  ([3abb3fef](https://github.com/angular/angular.js/commit/3abb3fefe653df2a4cb730cface0049939c18efd),
   [#10697](https://github.com/angular/angular.js/issues/10697))
- **$rootScope:** don't clear phase if $apply is re-entered
  ([e0cf496f](https://github.com/angular/angular.js/commit/e0cf496f3cd6835db91546438def5bca1b6db4df),
   [#12174](https://github.com/angular/angular.js/issues/12174))
- **Angular:** allow unescaped `=` signs in values in `parseKeyValue`
  ([f13852c1](https://github.com/angular/angular.js/commit/f13852c179ffd9ec18b7a94df27dec39eb5f19fc),
   [#12351](https://github.com/angular/angular.js/issues/12351))
- **httpParamSerializerJQLike:** Follow jQuery for index of arrays of objects
  ([18a2e4fb](https://github.com/angular/angular.js/commit/18a2e4fbfc44216c31bbcdf7705ca87c53e6f1fa))
- **i18n:** by default put negative sign before currency symbol
  ([96f2e3be](https://github.com/angular/angular.js/commit/96f2e3bef5fc310edb2f6ed1addbcb7e1c1e71c2),
   [#10158](https://github.com/angular/angular.js/issues/10158))
- **injector:** check that modulesToLoad isArray.
  ([5abf593e](https://github.com/angular/angular.js/commit/5abf593e6b3535cc836c99db4018a4e2fc2dbc3b),
   [#12285](https://github.com/angular/angular.js/issues/12285))
- **input:** Firefox validation trigger
  ([e7423168](https://github.com/angular/angular.js/commit/e7423168fbf439a8798fdbbffb57955c272c2d74),
   [#12102](https://github.com/angular/angular.js/issues/12102))
- **merge:** regExp should not be treated as a objects when merging.
  ([a5221f32](https://github.com/angular/angular.js/commit/a5221f320a8c1644354003c0e78201add44f11e6),
   [#12419](https://github.com/angular/angular.js/issues/12419), [#12409](https://github.com/angular/angular.js/issues/12409))
- **ng/$locale:** by default put negative sign before currency symbol
  ([52986724](https://github.com/angular/angular.js/commit/5298672411cd7f5870e12185845cc2e9e3fe6949),
   [#10158](https://github.com/angular/angular.js/issues/10158))
- **ngAnimate:**
  - always apply a preparation reflow for CSS-based animations
  ([d33cedda](https://github.com/angular/angular.js/commit/d33cedda1624114d7e97a97b79705685c6cc40a2),
   [#12553](https://github.com/angular/angular.js/issues/12553), [#12554](https://github.com/angular/angular.js/issues/12554), [#12267](https://github.com/angular/angular.js/issues/12267), [#12554](https://github.com/angular/angular.js/issues/12554))
  - ensure that only string-based addClass/removeClass values are applied
  ([0d6fc2dc](https://github.com/angular/angular.js/commit/0d6fc2dce57ac60dfebba6eefb571ef9afcd2189),
   [#12458](https://github.com/angular/angular.js/issues/12458), [#12459](https://github.com/angular/angular.js/issues/12459))
  - ensure that parent class-based animations are never closed by their children
  ([32d3cbb3](https://github.com/angular/angular.js/commit/32d3cbb3aadf71492102f9318fcac570fb60bef8),
   [#11975](https://github.com/angular/angular.js/issues/11975), [#12276](https://github.com/angular/angular.js/issues/12276))
  - allow animations on body and root elements
  ([44ce9c82](https://github.com/angular/angular.js/commit/44ce9c8288fc6c12043567027271a09bd0594d74),
   [#11956](https://github.com/angular/angular.js/issues/11956), [#12245](https://github.com/angular/angular.js/issues/12245))
  - $timeout without invokeApply
  ([7db5f361](https://github.com/angular/angular.js/commit/7db5f361b0097a79255b90b26b5d700decf22f37),
   [#12281](https://github.com/angular/angular.js/issues/12281), [#12282](https://github.com/angular/angular.js/issues/12282))
- **ngCsp:** allow CSP to be configurable
  ([618356e4](https://github.com/angular/angular.js/commit/618356e481fcfeac74bfc9086332e25062fd8133),
   [#11933](https://github.com/angular/angular.js/issues/11933), [#8459](https://github.com/angular/angular.js/issues/8459), [#12346](https://github.com/angular/angular.js/issues/12346))
- **ngModel:** correct minErr usage for correct doc creation
  ([a268c29f](https://github.com/angular/angular.js/commit/a268c29fb019858155dac6692f351b64d43bb61c),
   [#12386](https://github.com/angular/angular.js/issues/12386), [#12416](https://github.com/angular/angular.js/issues/12416))
- **ngOptions:** allow empty option selection with multiple attribute
  ([c11a7d67](https://github.com/angular/angular.js/commit/c11a7d676f21c39916243b13eeaf47f44b40c8eb),
   [#12511](https://github.com/angular/angular.js/issues/12511), [#12541](https://github.com/angular/angular.js/issues/12541))
- **ngSanitize:** escape the wide char quote marks in a regex in linky.js
  ([39ff3332](https://github.com/angular/angular.js/commit/39ff3332a31b2db09e615ecea07634708cb46d7b),
   [#11609](https://github.com/angular/angular.js/issues/11609))


## Features

- **$animateCss:** expose a core version of `$animateCss`
  ([39b634e5](https://github.com/angular/angular.js/commit/39b634e50a9ed140649d4be119a291debe527d55),
   [#12509](https://github.com/angular/angular.js/issues/12509))
- **$httpProvider:** add 'useLegacyPromiseExtensions' configuration
  ([a8f7e9cf](https://github.com/angular/angular.js/commit/a8f7e9cfde82ed7eaba3a868d8acafdf57f2d76f),
   [#12112](https://github.com/angular/angular.js/issues/12112), [#10508](https://github.com/angular/angular.js/issues/10508))
- **orderBy:** Stable sort the input
  ([ed3a33a0](https://github.com/angular/angular.js/commit/ed3a33a063f09d7ca356d15c278d95ad82e680a0),
   [#12408](https://github.com/angular/angular.js/issues/12408), [#12405](https://github.com/angular/angular.js/issues/12405))


## Performance Improvements

- **$q:** small $q performance optimization
  ([6838c979](https://github.com/angular/angular.js/commit/6838c979451c109d959a15035177ccee715ccf19),
   [#12535](https://github.com/angular/angular.js/issues/12535))


## Breaking Changes

- **ngAnimate:** due to [32d3cbb3](https://github.com/angular/angular.js/commit/32d3cbb3aadf71492102f9318fcac570fb60bef8),
  CSS classes added/removed by ngAnimate are now applied synchronously once the first digest has passed.

The previous behavior involved ngAnimate having to wait for one
requestAnimationFrame before CSS classes were added/removed. The CSS classes
are now applied directly after the first digest that is triggered after
`$animate.addClass`, `$animate.removeClass` or `$animate.setClass` is
called. If any of your code relies on waiting for one frame before
checking for CSS classes on the element then please change this
behavior. If a parent class-based animation, however, is run through a
JavaScript animation which triggers an animation for `beforeAddClass`
and/or `beforeRemoveClass` then the CSS classes will not be applied
in time for the children (and the parent class-based animation will not
be cancelled by any child animations).

- **$q** due to [6838c979](https://github.com/angular/angular.js/commit/6838c979451c109d959a15035177ccee715ccf19),
  When writing tests, there is no need to call `$timeout.flush()` to resolve a call to `$q.when` with a value.

The previous behavior involved creating an extra promise that needed to be resolved. This is no longer needed when
`$q.when` is called with a value. In the case that the test is not aware if `$q.when` is called with a value or
another promise, it is possible to replace `$timeout.flush();` with `$timeout.flush(0);`.

```js
describe('$q.when', function() {
  it('should not need a call to $timeout.flush() to resolve already resolved promises',
      inject(function($q, $timeout) {
    $q.when('foo');
    // In Angular 1.4.3 a call to `$timeout.flush();` was needed
    $timeout.verifyNoPendingTasks();
  }));

  it('should accept $timeout.flush(0) when not sure if $q.when was called with a value or a promise',
      inject(function($q, $timeout) {
    $q.when('foo');
    $timeout.flush(0);
    $timeout.verifyNoPendingTasks();
  }));

  it('should need a call to $timeout.flush() to resolve $q.when when called with a promise',
        inject(function($q, $timeout) {
    $q.when($q.when('foo'));
    $timeout.flush();
    $timeout.verifyNoPendingTasks();
  }));
});
```


<a name="1.4.3"></a>
# 1.4.3 foam-acceleration (2015-07-15)


## Bug Fixes

- **$animateCss:** ensure animations execute if only a keyframeStyle is provided
  ([97d79eec](https://github.com/angular/angular.js/commit/97d79eec80092f5fae3336c23aa881a72436de55),
   [#12124](https://github.com/angular/angular.js/issues/12124), [#12340](https://github.com/angular/angular.js/issues/12340))
- **loader:** define isFunction
  ([9ea52d81](https://github.com/angular/angular.js/commit/9ea52d818bcd2fb3ea8ccc85bf47f9fd5af68843))
- **ngAnimate:** ensure that orphaned elements do not throw errors when animated
  ([e4aeae0c](https://github.com/angular/angular.js/commit/e4aeae0c7303b94135e6df20e6c5e25f2aa0f586),
   [#11975](https://github.com/angular/angular.js/issues/11975), [#12338](https://github.com/angular/angular.js/issues/12338))



<a name="1.4.2"></a>
# 1.4.2 nebular-readjustment (2015-07-06)

## Bug Fixes

- **$browser:** prevent infinite digest if changing hash when there is no hashPrefix
  ([f81ff3be](https://github.com/angular/angular.js/commit/f81ff3beb0c9d19d494c5878086fb57476442b8b),
   [#10423](https://github.com/angular/angular.js/issues/10423), [#12145](https://github.com/angular/angular.js/issues/12145))
- **$compile:**
  - throw error when requesting new and isolate scopes (async)
  ([6333d65b](https://github.com/angular/angular.js/commit/6333d65b76e0796cfbab8a2953af0c8014dba2e1),
   [#12215](https://github.com/angular/angular.js/issues/12215), [#12217](https://github.com/angular/angular.js/issues/12217))
- **$location:** allow navigating outside the original base URL
  ([6903b5ec](https://github.com/angular/angular.js/commit/6903b5ec4c04ed6b7c80ef7d638c48639ccdc4bb),
   [#11302](https://github.com/angular/angular.js/issues/11302), [#4776](https://github.com/angular/angular.js/issues/4776))
- **merge:** treat dates as atomic values instead of objects.
  ([6cbbd966](https://github.com/angular/angular.js/commit/6cbbd966479448591f819cbf904e0a3b757613dc),
   [#11720](https://github.com/angular/angular.js/issues/11720), [#11720](https://github.com/angular/angular.js/issues/11720))
- **ngOptions:** only watch numeric properties of an array
  ([14638f4a](https://github.com/angular/angular.js/commit/14638f4a60053b085565e597fc74bd31cf0d372b))
- **orderBy:** ensure correct ordering with arrays of objects and no predicate
  ([48e1f560](https://github.com/angular/angular.js/commit/48e1f5605edd32a63318fd78f5165c7d1f1a20f9),
   [#11866](https://github.com/angular/angular.js/issues/11866), [#11312](https://github.com/angular/angular.js/issues/11312), [#4282](https://github.com/angular/angular.js/issues/4282))


## Features

- **ngAria:** add option to disable role=button
  ([1f5e42e8](https://github.com/angular/angular.js/commit/1f5e42e8821217026ef36a46d36f84d7cd32830a),
   [#11580](https://github.com/angular/angular.js/issues/11580), [#12234](https://github.com/angular/angular.js/issues/12234))



<a name="1.3.17"></a>
# 1.3.17 tsktskskly-euouae (2015-07-06)


## Bug Fixes

- **$browser:** prevent infinite digest if changing hash when there is no hashPrefix
  ([61a3fb67](https://github.com/angular/angular.js/commit/61a3fb676a186e22564fb0181c17647b35ca4e5e),
   [#10423](https://github.com/angular/angular.js/issues/10423), [#12145](https://github.com/angular/angular.js/issues/12145))
- **$location:**
  - allow navigating outside the original base URL
  ([0bb57d53](https://github.com/angular/angular.js/commit/0bb57d538f25a1b6f20025d87a451c39671b59aa),
   [#11302](https://github.com/angular/angular.js/issues/11302), [#4776](https://github.com/angular/angular.js/issues/4776))
  - do not get caught in infinite digest in IE9
  ([f486ebe8](https://github.com/angular/angular.js/commit/f486ebe80b6d7854d3eb9029f14d94299cf493cb),
   [#11439](https://github.com/angular/angular.js/issues/11439), [#11675](https://github.com/angular/angular.js/issues/11675), [#11935](https://github.com/angular/angular.js/issues/11935), [#12083](https://github.com/angular/angular.js/issues/12083))
- **linky:** allow case insensitive scheme detection
  ([6b28aef1](https://github.com/angular/angular.js/commit/6b28aef1c537bfb2da21820d6ca154344efe266e),
   [#12073](https://github.com/angular/angular.js/issues/12073), [#12074](https://github.com/angular/angular.js/issues/12074))



<a name="1.4.1"></a>
# 1.4.1 hyperionic-illumination (2015-06-16)


## Bug Fixes

- **$compile:**
  - workaround for IE11 MutationObserver
  ([f3b1d0b7](https://github.com/angular/angular.js/commit/f3b1d0b723298a5f8ea21d0704405649cce1b5fc),
   [#11781](https://github.com/angular/angular.js/issues/11781))
  - prevent exception when using `watch` as isolated scope binding property in Firefox
  ([a6339d30](https://github.com/angular/angular.js/commit/a6339d30d1379689da5eec9647a953f64821f8b0),
   [#11627](https://github.com/angular/angular.js/issues/11627))
  - assign controller return values correctly for multiple directives
  ([8caf1802](https://github.com/angular/angular.js/commit/8caf1802e0e93389dec626ef35e04a302aa6c39d),
   [#12029](https://github.com/angular/angular.js/issues/12029), [#12036](https://github.com/angular/angular.js/issues/12036))
- **$location:** do not get caught in infinite digest in IE9 when redirecting in `$locationChangeSuccess`
  ([91b60226](https://github.com/angular/angular.js/commit/91b602263b96b6fce1331208462e18eb647f4d60),
   [#11439](https://github.com/angular/angular.js/issues/11439), [#11675](https://github.com/angular/angular.js/issues/11675), [#11935](https://github.com/angular/angular.js/issues/11935), [#12083](https://github.com/angular/angular.js/issues/12083))
- **$parse:** set null reference properties to `undefined`
  ([71fc3f4f](https://github.com/angular/angular.js/commit/71fc3f4fa0cd12eff335d57efed7c033554749f4),
   [#12099](https://github.com/angular/angular.js/issues/12099))
  ([d19504a1](https://github.com/angular/angular.js/commit/d19504a179355d7801d59a8db0285a1322e04601),
   [#11959](https://github.com/angular/angular.js/issues/11959))
- **$sanitize:** do not remove `tabindex` attribute
  ([799353c7](https://github.com/angular/angular.js/commit/799353c75de28e6fbf52dac6e0721e85b578575a),
   [#8371](https://github.com/angular/angular.js/issues/8371), [#5853](https://github.com/angular/angular.js/issues/5853))
- **copy:** do not copy the same object twice
  ([0e622f7b](https://github.com/angular/angular.js/commit/0e622f7b5bc3d5d0ab0fbc1a1bc69404bd7216d5))
- **forms:** parse exponential notation in `numberInputType` directive
  ([ebd0fbba](https://github.com/angular/angular.js/commit/ebd0fbba8ff90bee0cd016d574643d56a7f81ed0),
   [#12121](https://github.com/angular/angular.js/issues/12121), [#12122](https://github.com/angular/angular.js/issues/12122))
- **linky:** allow case insensitive scheme detection
  ([8dc09e6d](https://github.com/angular/angular.js/commit/8dc09e6dabb84c2c611cdc9e40adfac989648200),
   [#12073](https://github.com/angular/angular.js/issues/12073), [#12073](https://github.com/angular/angular.js/issues/12073))
- **ngAria:**
  - update `aria-valuemin/max` when `min/max` change
  ([ebaa0f59](https://github.com/angular/angular.js/commit/ebaa0f598501702ae64d59ada0ae492eaf0e2db6),
   [#11770](https://github.com/angular/angular.js/issues/11770), [#11774](https://github.com/angular/angular.js/issues/11774))
  - ensure boolean values for aria-hidden and aria-disabled
  ([59273354](https://github.com/angular/angular.js/commit/59273354b57dd8d1ad2cd2f4740ffa8923e480f9),
   [#11365](https://github.com/angular/angular.js/issues/11365))
- **ngModel:** ignore Object.prototype properties on the form validation object
  ([0934b76b](https://github.com/angular/angular.js/commit/0934b76b72cec86093414834ac4cb7f0946b651d),
   [#12066](https://github.com/angular/angular.js/issues/12066))
- **ngOptions:**
  - do not watch properties starting with $
  ([34a6da24](https://github.com/angular/angular.js/commit/34a6da24c17356d4ffc70aec3f621a140a9a61ab),
   [#11930](https://github.com/angular/angular.js/issues/11930), [#12010](https://github.com/angular/angular.js/issues/12010))
  - use reference check only when not using trackBy
  ([d7dc14dc](https://github.com/angular/angular.js/commit/d7dc14dc0cdeb9c187d227e19acc8aca7df9d740),
   [#11936](https://github.com/angular/angular.js/issues/11936), [#11996](https://github.com/angular/angular.js/issues/11996))


## Features

- **$compile:** show module name during `multidir` error
  ([351fe4b7](https://github.com/angular/angular.js/commit/351fe4b79c50a45a11af2fcd2aa7b6fd3b70058d),
   [#11775](https://github.com/angular/angular.js/issues/11775))
- **$q:** $q.resolve as an alias for $q.when
  ([3ef52980](https://github.com/angular/angular.js/commit/3ef529806fef28b41ca4af86a330f39a95699cf6),
   [#11944](https://github.com/angular/angular.js/issues/11944), [#11987](https://github.com/angular/angular.js/issues/11987))


## Performance Improvements

- **$compile:** avoid jquery data calls when there is no data
  ([9efb0d5e](https://github.com/angular/angular.js/commit/9efb0d5ee961b57c8fc144a3138a15955e4010e2))



<a name="1.3.16"></a>
# 1.3.16 cookie-oatmealification (2015-06-05)


## Bug Fixes

- **$compile:** throw error on invalid directive name
  ([634e4671](https://github.com/angular/angular.js/commit/634e467172efa696eb32ef8942ffbedeecbd030e),
   [#11281](https://github.com/angular/angular.js/issues/11281), [#11109](https://github.com/angular/angular.js/issues/11109))
- **$cookies:** update $cookies to prevent duplicate cookie writes and play nice with external code
  ([706a93ab](https://github.com/angular/angular.js/commit/706a93ab6960e3474698ccf9a8048b3c32e567c6),
   [#11490](https://github.com/angular/angular.js/issues/11490), [#11515](https://github.com/angular/angular.js/issues/11515))
- **$http:** throw error if `success` and `error` methods do not receive a function
  ([731e1f65](https://github.com/angular/angular.js/commit/731e1f6534ab7fd1e053b8d7a25c902fcd934fea),
   [#11330](https://github.com/angular/angular.js/issues/11330), [#11333](https://github.com/angular/angular.js/issues/11333))
- **core:** ensure that multiple requests to requestAnimationFrame are buffered
  ([0adc0364](https://github.com/angular/angular.js/commit/0adc0364265b06c567ccc8e90a7f09cc46f235b2),
   [#11791](https://github.com/angular/angular.js/issues/11791))
- **filterFilter:** fix matching against `null`/`undefined`
  ([9dd0fe35](https://github.com/angular/angular.js/commit/9dd0fe35d1027e59b84b2396abee00d8683f3b50),
   [#11573](https://github.com/angular/angular.js/issues/11573), [#11617](https://github.com/angular/angular.js/issues/11617))
- **jqLite:**
  - check for "length" in obj in isArrayLike to prevent iOS8 JIT bug from surfacing
  ([647f3f55](https://github.com/angular/angular.js/commit/647f3f55eb7100a255272f7277f0f962de234a32),
   [#11508](https://github.com/angular/angular.js/issues/11508))
  - attr should ignore comment, text and attribute nodes
  ([181e5ebc](https://github.com/angular/angular.js/commit/181e5ebc3fce5312feacaeace4fcad0d32f4d73c))
- **ngAnimate:**
  - ensure that minified repaint code isn't removed
  ([d5c99ea4](https://github.com/angular/angular.js/commit/d5c99ea42b834343fd0362cfc572f47e7536ccfb),
   [#9936](https://github.com/angular/angular.js/issues/9936))
- **ngAria:** handle elements with role="checkbox/menuitemcheckbox"
  ([1c282af5](https://github.com/angular/angular.js/commit/1c282af5abc205d4aac37c05c5cb725d71747134),
   [#11317](https://github.com/angular/angular.js/issues/11317), [#11321](https://github.com/angular/angular.js/issues/11321))
- **ngModel:** allow setting model to NaN when asyncValidator is present
  ([b64519fe](https://github.com/angular/angular.js/commit/b64519fea7f1a5ec75e32c4b71b012b827314153),
   [#11315](https://github.com/angular/angular.js/issues/11315), [#11411](https://github.com/angular/angular.js/issues/11411))
- **ngTouch:**
  - check undefined tagName for SVG event target
  ([7560a8d2](https://github.com/angular/angular.js/commit/7560a8d2d65955ddb60ede9d586502f4e3cbd062))
  - register touches properly when jQuery is used
  ([40441f6d](https://github.com/angular/angular.js/commit/40441f6dfc5ebd5cdc679c269c4639238f5351eb),
   [#4001](https://github.com/angular/angular.js/issues/4001), [#8584](https://github.com/angular/angular.js/issues/8584), [#10797](https://github.com/angular/angular.js/issues/10797), [#11488](https://github.com/angular/angular.js/issues/11488))
- **select:** prevent unknown option being added to select when bound to null property
  ([9e3f82bb](https://github.com/angular/angular.js/commit/9e3f82bbaf83cad7bb3121db756099b0880562e6),
   [#11872](https://github.com/angular/angular.js/issues/11872), [#11875](https://github.com/angular/angular.js/issues/11875))


## Features

- **travis:** run unit tests on iOS 8
  ([1f650871](https://github.com/angular/angular.js/commit/1f650871266b88b3dab4a894a839a82ac9a06b69),
   [#11479](https://github.com/angular/angular.js/issues/11479))



<a name="1.4.0"></a>
# 1.4.0 jaracimrman-existence (2015-05-26)


## Bug Fixes

- **$animate:**
  - ignore invalid option parameter values
  ([72edd4df](https://github.com/angular/angular.js/commit/72edd4dff931c644eecb8f0d1c878dc839c76947),
   [#11826](https://github.com/angular/angular.js/issues/11826))
  - accept unwrapped DOM elements as inputs for enter + move
  ([f26fc26f](https://github.com/angular/angular.js/commit/f26fc26f6ea283b2fc5ddb18627b13850de2663e),
   [#11848](https://github.com/angular/angular.js/issues/11848))
- **$animateCss:** ensure that custom durations do not confuse the gcs cache
  ([e0e1b520](https://github.com/angular/angular.js/commit/e0e1b5208767dd62f5586fdc607cb2e31dac9516),
   [#11723](https://github.com/angular/angular.js/issues/11723), [#11852](https://github.com/angular/angular.js/issues/11852))
- **$http:** do not modify the config object passed into $http short methods
  ([f7a4b481](https://github.com/angular/angular.js/commit/f7a4b48121ed2b04af89bd2b754f500d1872360d))
- **ngAnimate:**
  - close follow-up class-based animations when the same class is added/removed when removed/added
  ([db246eb7](https://github.com/angular/angular.js/commit/db246eb701529b41049fc118908e528920f13b24),
   [#11717](https://github.com/angular/angular.js/issues/11717))
  - ensure nested class-based animations are spaced out with a RAF
  ([213c2a70](https://github.com/angular/angular.js/commit/213c2a703293ee0af8229dde2b608687cd77ccfa),
   [#11812](https://github.com/angular/angular.js/issues/11812))
  - class-based animations must not set addClass/removeClass CSS classes on the element
  ([3a3db690](https://github.com/angular/angular.js/commit/3a3db690a16e888aa7371e3b02e2954b9ec2d558),
   [#11810](https://github.com/angular/angular.js/issues/11810))
  - ensure that repeated structural calls during pre-digest function
  ([2327f5a0](https://github.com/angular/angular.js/commit/2327f5a0a7e018a9b03aefabe1fbd0c9330e2eeb),
   [#11867](https://github.com/angular/angular.js/issues/11867))
  - ensure that cancelled class-based animations are properly cleaned up
  ([718ff844](https://github.com/angular/angular.js/commit/718ff84405558ac64402e1fca5caefd7d307ea1e),
   [#11652](https://github.com/angular/angular.js/issues/11652))
  - throw an error if a callback is passed to animate methods
  ([9bb4d6cc](https://github.com/angular/angular.js/commit/9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca),
   [#11826](https://github.com/angular/angular.js/issues/11826), [#11713](https://github.com/angular/angular.js/issues/11713))
  - ensure anchored animations remove the leave element at correct time
  ([64c66d0e](https://github.com/angular/angular.js/commit/64c66d0eea11b575d2a71d00c70cfc5be12cd450),
   [#11850](https://github.com/angular/angular.js/issues/11850))
- **select:** prevent unknown option being added to select when bound to null property
  ([4090491c](https://github.com/angular/angular.js/commit/4090491c73910c169d4fba0494a4e26b45dca7ec),
   [#11872](https://github.com/angular/angular.js/issues/11872), [#11875](https://github.com/angular/angular.js/issues/11875))


## Features

- **filterFilter:** allow array like objects to be filtered
  ([1b0d0fd8](https://github.com/angular/angular.js/commit/1b0d0fd8d00b42dffd798845fe0947d594372613),
   [#11782](https://github.com/angular/angular.js/issues/11782), [#11787](https://github.com/angular/angular.js/issues/11787))



<a name="1.4.0-rc.2"></a>
# 1.4.0-rc.2 rocket-zambonimation (2015-05-12)


## Bug Fixes

- **$compile:** ensure directive names have no leading or trailing whitespace
  ([bab474aa](https://github.com/angular/angular.js/commit/bab474aa8b146f6732857c3af1a8b3b010fda8b0),
   [#11397](https://github.com/angular/angular.js/issues/11397), [#11772](https://github.com/angular/angular.js/issues/11772))
- **$httpParamSerializerJQLike:** follow jQuery logic for nested params
  ([2420a0a7](https://github.com/angular/angular.js/commit/2420a0a77e27b530dbb8c41319b2995eccf76791),
   [#11551](https://github.com/angular/angular.js/issues/11551), [#11635](https://github.com/angular/angular.js/issues/11635))
- **jqLite:** check for "length" in obj in isArrayLike to prevent iOS8 JIT bug from surfacing
  ([426a5ac0](https://github.com/angular/angular.js/commit/426a5ac0547109648e5c5e358f668c274a111ab2),
   [#11508](https://github.com/angular/angular.js/issues/11508))
- **ngAnimate:**
  - ensure that multiple requests to requestAnimationFrame are buffered
  ([db20b830](https://github.com/angular/angular.js/commit/db20b830fc6074a00dc11d3f47d665c55e8bb515),
   [#11791](https://github.com/angular/angular.js/issues/11791))
  - ensure that an object is always returned even when no animation is set to run
  ([d5683d21](https://github.com/angular/angular.js/commit/d5683d21165e725bc5a850e795f681b0a8a008f5))
  - force use of `ng-anchor` instead of a suffixed `-anchor` CSS class when triggering anchor animations
  ([df24410c](https://github.com/angular/angular.js/commit/df24410c17d51a8d44929b9cffee2c91cedfed72))
  - rename `ng-animate-anchor` to `ng-anchor`
  ([e6d053de](https://github.com/angular/angular.js/commit/e6d053de0993c0d38de46ad8a9c6760537316430))
  - ensure that shared CSS classes between anchor nodes are retained
  ([e0014002](https://github.com/angular/angular.js/commit/e0014002370278778077d0612f9fab6beb80d07a),
   [#11681](https://github.com/angular/angular.js/issues/11681))
  - prohibit usage of the `ng-animate` class with classNameFilter
  ([1002b80a](https://github.com/angular/angular.js/commit/1002b80a6fb5d98c424a01330234276d65d93c0b),
   [#11431](https://github.com/angular/angular.js/issues/11431), [#11807](https://github.com/angular/angular.js/issues/11807))
  - ensure that the temporary CSS classes are applied before detection
  ([f7e9ff1a](https://github.com/angular/angular.js/commit/f7e9ff1aba9ed70835c084e6e154f6b0bf9c3a19),
   [#11769](https://github.com/angular/angular.js/issues/11769), [#11804](https://github.com/angular/angular.js/issues/11804))
  - ensure that all jqLite elements are deconstructed properly
  ([64d05180](https://github.com/angular/angular.js/commit/64d05180a667e586328fbdbd328889d3b003571d),
   [#11658](https://github.com/angular/angular.js/issues/11658))
  - ensure animations are not attempted on text nodes
  ([2aacc2d6](https://github.com/angular/angular.js/commit/2aacc2d622893e05eb94b3974d562e681cc3a17f),
   [#11703](https://github.com/angular/angular.js/issues/11703))
  - ensure JS animations recognize $animateCss directly
  ([0681a540](https://github.com/angular/angular.js/commit/0681a5400e4150a961f9c8651e55623ca23b0cc2))
- **ngClass:** add/remove classes which are properties of Object.prototype
  ([f7b99970](https://github.com/angular/angular.js/commit/f7b999703f4f3bdaea035ce692f1a656b0c1a933),
   [#11813](https://github.com/angular/angular.js/issues/11813), [#11814](https://github.com/angular/angular.js/issues/11814))
- **ngOptions:**
  - ensure that tracked properties are always watched
  ([b5a9053b](https://github.com/angular/angular.js/commit/b5a9053ba33d48db2482ca6736d1fcae8b33d0f8),
   [#11784](https://github.com/angular/angular.js/issues/11784))
  - ensure label is watched in all cases
  ([ae98dadf](https://github.com/angular/angular.js/commit/ae98dadf6dca3313746f42a441c7659654dd9d50),
   [#11765](https://github.com/angular/angular.js/issues/11765))
  - iterate over the options collection in the same way as `ngRepeat`
  ([dfa722a8](https://github.com/angular/angular.js/commit/dfa722a8a6864793fd9580d8ae704a06d10b5509),
   [#11733](https://github.com/angular/angular.js/issues/11733))
  - use watchCollection not deep watch of ngModel
  ([47f9fc3e](https://github.com/angular/angular.js/commit/47f9fc3e70bc361e8c11fe68dc3ec4489238efb3),
   [#11372](https://github.com/angular/angular.js/issues/11372), [#11653](https://github.com/angular/angular.js/issues/11653), [#11743](https://github.com/angular/angular.js/issues/11743))
- **ngTouch:**
  - check undefined tagName for SVG event target
  ([74eb17d7](https://github.com/angular/angular.js/commit/74eb17d7c8232f72f134bf2546f10fed7234d276))
  - don't prevent click event after a touchmove
  ([95521876](https://github.com/angular/angular.js/commit/95521876eb9eb330548b0549f0cfe22a26d88f6e),
   [#10985](https://github.com/angular/angular.js/issues/10985))


## Features

- **$resource:** include request context in error message
  ([266bc652](https://github.com/angular/angular.js/commit/266bc6520ba4d188dbc949643def102604f98905),
   [#11363](https://github.com/angular/angular.js/issues/11363))


## Breaking Changes

### ngAnimate

- **$animateCss:** due to [d5683d21](https://github.com/angular/angular.js/commit/d5683d21165e725bc5a850e795f681b0a8a008f5),
  The $animateCss service will now always return an
object even if the animation is not set to run. If your code is using
$animateCss then please consider the following code change:

```
// before
var animator = $animateCss(element, { ... });
if (!animator) {
  continueApp();
  return;
}
var runner = animator.start();
runner.done(continueApp);
runner.then(continueApp);

// now
var animator = $animateCss(element, { ... });
var runner = animator.start();
runner.done(continueApp);
runner.then(continueApp);
```

- due to [df24410c](https://github.com/angular/angular.js/commit/df24410c17d51a8d44929b9cffee2c91cedfed72),
Prior to this fix there were to ways to apply CSS
animation code to an anchor animation. With this fix, the suffixed
CSS -anchor classes are now not used anymore for CSS anchor animations.

Instead just use the `ng-anchor` CSS class like so:

```html
<div class="container-animation" ng-if="on">
   <div ng-animate-ref="1" class="my-anchor-element"></div>
</div>

<div class="container-animation" ng-if="!on">
   <div ng-animate-ref="1" class="my-anchor-element"></div>
</div>
```

**before**:
```css
/* before (notice the container-animation CSS class) */
.container-animation-anchor {
  transition:0.5s linear all;
}
```

**now**:
```css
/* now (just use `ng-anchor` on a class that both the
   elements that contain `ng-animate-ref` share) */
.my-anchor-element.ng-anchor {
  transition:0.5s linear all;
}
```

- due to [e6d053de](https://github.com/angular/angular.js/commit/e6d053de0993c0d38de46ad8a9c6760537316430),
if your CSS code made use of the `ng-animate-anchor`
CSS class for referencing the anchored animation element then your
code must now use `ng-anchor` instead.

- due to [1002b80a](https://github.com/angular/angular.js/commit/1002b80a6fb5d98c424a01330234276d65d93c0b),
partially or fully using a regex value containing
`ng-animate` as a token is not allowed anymore. Doing so will trigger a
minErr exception to be thrown.

So don't do this:

```js
// only animate elements that contain the `ng-animate` CSS class
$animateProvider.classNameFilter(/ng-animate/);

// or partially contain it
$animateProvider.classNameFilter(/some-class ng-animate another-class/);
```

but this is OK:

```js
$animateProvider.classNameFilter(/ng-animate-special/);
```


### ngOptions

- ** due to [dfa722a8](https://github.com/angular/angular.js/commit/dfa722a8a6864793fd9580d8ae704a06d10b5509),


Although it is unlikely that anyone is using it in this way, this change does change the
behavior of `ngOptions` in the following case:

  * you are iterating over an array-like object, using the array form of the `ngOptions` syntax
(`item.label for item in items`) and that object contains non-numeric property keys.

In this case these properties with non-numeric keys will be ignored.

** Here array-like is defined by the result of a call to this internal function:
https://github.com/angular/angular.js/blob/v1.4.0-rc.1/src/Angular.js#L198-L211 **

To get the desired behavior you need to iterate using the object form of the `ngOptions` syntax
(`value.label` for (key, value) in items)`).




<a name="v1.4.0-rc.1"></a>
# v1.4.0-rc.1 sartorial-chronography (2015-04-24)


## Bug Fixes

- **$animate:**
  - ensure that from styles are applied for class-based animations
  ([8f819d2c](https://github.com/angular/angular.js/commit/8f819d2cb5c8025b25534529a6e897dc8805885b))
  - make sure the JS animation lookup is an object lookup
  ([103a39ca](https://github.com/angular/angular.js/commit/103a39ca8dad0300bead15c358aad846510b2229),
   [#11619](https://github.com/angular/angular.js/issues/11619))
- **$animateCss:** ensure that rAF waiting loop doesn't ignore pending items during a flush
  ([90e424b2](https://github.com/angular/angular.js/commit/90e424b206239e261024e8ef7fcac762236cd8b7))
- **$http:** stop coercing falsy HTTP request bodies to null / empty body
  ([e04a887c](https://github.com/angular/angular.js/commit/e04a887c9b506de18516600310fe6e529d9d2ca3),
   [#11552](https://github.com/angular/angular.js/issues/11552), [#11593](https://github.com/angular/angular.js/issues/11593))
- **ngAnimate:**
  - close parent animations only when there are classes to resolve
  ([1459be17](https://github.com/angular/angular.js/commit/1459be170dabfca40501dcf219dfced5ba513169))
  - ensure ngClass-based classes are always resolved for CSS-enabled animations
  ([89f081e4](https://github.com/angular/angular.js/commit/89f081e452e9a75c2d3bf86bfef8b7f9bd1f2b0e))
  - do not abort animation if only `ng-anchor-in` is used
  ([3333a5c3](https://github.com/angular/angular.js/commit/3333a5c380f830cba8efec5825cb6648f930f206))
  - ensure that a filtered-out leave animation always runs its DOM operation
  ([6dd64ab5](https://github.com/angular/angular.js/commit/6dd64ab5f34fa19db8f90e6eabc810843089ba14),
   [#11555](https://github.com/angular/angular.js/issues/11555))
  - ensure that animations work when the app is bootstrapped on the document node
  ([bee14ed1](https://github.com/angular/angular.js/commit/bee14ed1e7b77ea7dc62326611380da36dec297e),
   [#11574](https://github.com/angular/angular.js/issues/11574))
  - ensure SVG classes are properly removed
  ([fa0bbded](https://github.com/angular/angular.js/commit/fa0bbded1ea040fbfdb1a4339e4a374fe9717a82))
- **ngAria:** change accessibility keypress event to use event.which if it is provided
  ([249f9b81](https://github.com/angular/angular.js/commit/249f9b81cbad5c57cf978a47842744aadd85cdb4),
   [#11340](https://github.com/angular/angular.js/issues/11340))
- **ngMessageFormat:**
  - ensure bindings are valid for Protractor
  ([992114f7](https://github.com/angular/angular.js/commit/992114f7a7f5f39778753e0c49458f14b6290ffc),
   [#11644](https://github.com/angular/angular.js/issues/11644), [#11649](https://github.com/angular/angular.js/issues/11649))
  - minified symbol and nested required expression
  ([8a45064f](https://github.com/angular/angular.js/commit/8a45064f2bdec13ba3de5b0a0785df76188ab172),
   [#11414](https://github.com/angular/angular.js/issues/11414), [#11592](https://github.com/angular/angular.js/issues/11592))
- **select:** allow empty option to be added dynamically by ng-repeat
  ([abf59c28](https://github.com/angular/angular.js/commit/abf59c285c3ff6af20dbf4236eba5204ae735abb),
   [#11470](https://github.com/angular/angular.js/issues/11470), [#11512](https://github.com/angular/angular.js/issues/11512))


## Features

- **$animate:** provide support for animations on elements outside of $rootElement
  ([e41faaa2](https://github.com/angular/angular.js/commit/e41faaa2a155a42bcc66952497a6f33866878508))




<a name="v1.4.0-rc.0"></a>
# v1.4.0-rc.0 smooth-unwinding (2015-04-10)


## Bug Fixes

- **$compile:**
  - throw error on invalid directive name
  ([170ff9a3](https://github.com/angular/angular.js/commit/170ff9a37dea8772dda7c89e84176ac1a8992878),
   [#11281](https://github.com/angular/angular.js/issues/11281), [#11109](https://github.com/angular/angular.js/issues/11109))
  - update data() when controller returns custom value
  ([9900610e](https://github.com/angular/angular.js/commit/9900610eea4ece87b063f2aa9d82c75c369927df),
   [#11147](https://github.com/angular/angular.js/issues/11147), [#11326](https://github.com/angular/angular.js/issues/11326))
- **$http:** throw error if `success` and `error` methods do not receive a function
  ([1af563d4](https://github.com/angular/angular.js/commit/1af563d43e74cb7be53e815b66fd91dd93986ed6),
   [#11330](https://github.com/angular/angular.js/issues/11330), [#11333](https://github.com/angular/angular.js/issues/11333))
- **$parse:** fix parse errors on older Android WebViews which choke with reserved keywords
  ([10ae33b2](https://github.com/angular/angular.js/commit/10ae33b2d88b04df76f519edc50a47fa30f83e96),
   [#11455](https://github.com/angular/angular.js/issues/11455))
- **$rootScope:** allow destroying a root scope
  ([f8c8cf69](https://github.com/angular/angular.js/commit/f8c8cf698aa23640249d79fd405605694478e4f7),
   [#11241](https://github.com/angular/angular.js/issues/11241), [#10895](https://github.com/angular/angular.js/issues/10895))
- **cookieReader:** safely access $document so it can be mocked
  ([a057e089](https://github.com/angular/angular.js/commit/a057e0896a7fe2fdaba50b2515555b86e4f4be27),
   [#11373](https://github.com/angular/angular.js/issues/11373), [#11388](https://github.com/angular/angular.js/issues/11388))
- **filterFilter:** fix matching against `null`/`undefined`
  ([b5002ab6](https://github.com/angular/angular.js/commit/b5002ab62ad6e13f4339e20106e1fdece14912a2),
   [#11432](https://github.com/angular/angular.js/issues/11432), [#11445](https://github.com/angular/angular.js/issues/11445))
- **ngAnimate:** ensure that minified repaint code isn't removed
  ([c55a4944](https://github.com/angular/angular.js/commit/c55a494433e619aad0c7ef9fddadc0b3fdf53915),
   [#9936](https://github.com/angular/angular.js/issues/9936))
- **ngAria:** handle elements with role="checkbox/menuitemcheckbox"
  ([44337f63](https://github.com/angular/angular.js/commit/44337f63fa94116795e83e3a764a6ba6782809c7),
   [#11317](https://github.com/angular/angular.js/issues/11317), [#11321](https://github.com/angular/angular.js/issues/11321))
- **ngModel:** allow setting model to NaN when asyncValidator is present
  ([948120ec](https://github.com/angular/angular.js/commit/948120ecdbc4dd07880c0107564c50c7675b8a93),
   [#11315](https://github.com/angular/angular.js/issues/11315), [#11411](https://github.com/angular/angular.js/issues/11411))
- **ngTouch:** register touches properly when jQuery is used
  ([06a9f0a9](https://github.com/angular/angular.js/commit/06a9f0a95f0e72fa2e9879fe8a49e9bf69986a5f),
   [#4001](https://github.com/angular/angular.js/issues/4001), [#8584](https://github.com/angular/angular.js/issues/8584), [#10797](https://github.com/angular/angular.js/issues/10797), [#11488](https://github.com/angular/angular.js/issues/11488))
- **select:** don't call $render twice if $viewValue ref changes
  ([7e5c447f](https://github.com/angular/angular.js/commit/7e5c447fa9ad7d81cc818d6e79392c3e4a6b23a0),
   [#11329](https://github.com/angular/angular.js/issues/11329), [#11412](https://github.com/angular/angular.js/issues/11412))


## Features

- **$anchorScroll:** allow scrolling to a specified element
  ([731c8b5e](https://github.com/angular/angular.js/commit/731c8b5e2d01a44aa91f967f1a6acbadb8005a8b),
   [#4568](https://github.com/angular/angular.js/issues/4568), [#9596](https://github.com/angular/angular.js/issues/9596))
- **$animate:** complete refactor of internal animation code
  ([c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef))
- **$http:** support custom params serializers
  ([6c8464ad](https://github.com/angular/angular.js/commit/6c8464ad14dd308349f632245c1a064c9aae242a),
   [#3740](https://github.com/angular/angular.js/issues/3740), [#7429](https://github.com/angular/angular.js/issues/7429), [#9224](https://github.com/angular/angular.js/issues/9224), [#11461](https://github.com/angular/angular.js/issues/11461))
- **$interpolate:** extend interpolation with MessageFormat like syntax
  ([1e58488a](https://github.com/angular/angular.js/commit/1e58488ad65abf7031bab5813523bb9d86dbd28c),
   [#11152](https://github.com/angular/angular.js/issues/11152))
- **angular.Module:** add `decorator` method
  ([e57138d7](https://github.com/angular/angular.js/commit/e57138d7eff1210f99238c475fff57530bf0ab19),
   [#11305](https://github.com/angular/angular.js/issues/11305), [#11300](https://github.com/angular/angular.js/issues/11300))
- **ngClass:** add support for conditional map within an array.
  ([4588e627](https://github.com/angular/angular.js/commit/4588e627bb7238b2113241919b948d0e5166c76d),
   [#4807](https://github.com/angular/angular.js/issues/4807))
- **travis:** run unit tests on iOS 8
  ([2cdb2016](https://github.com/angular/angular.js/commit/2cdb2016b9d89abfb5ab988b67d5f26f3bf21908),
   [#11479](https://github.com/angular/angular.js/issues/11479))


## Performance Improvements

- **$rootScope:** remove history event handler when app is torn down
  ([d996305b](https://github.com/angular/angular.js/commit/d996305b4470f80fbb1cbddf54b7d10ffbb6ab47),
   [#9897](https://github.com/angular/angular.js/issues/9897), [#9905](https://github.com/angular/angular.js/issues/9905))
- **benchmark:** add ngmodel benchmarks to largetable-bp
  ([b8dbdb0c](https://github.com/angular/angular.js/commit/b8dbdb0c5e2cd176c6d94d60f781cfc02e646592),
   [#11082](https://github.com/angular/angular.js/issues/11082))
- **ngOptions:** only perform deep equality check on ngModel if using track by
  ([171b9f7f](https://github.com/angular/angular.js/commit/171b9f7f2339ef9047b8526b2c3f36bb58d14feb),
   [#11448](https://github.com/angular/angular.js/issues/11448), [#11447](https://github.com/angular/angular.js/issues/11447))


## Breaking Changes

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  JavaScript and CSS animations can no longer be run in
parallel. With earlier versions of ngAnimate, both CSS and JS animations
would be run together when multiple animations were detected. This
feature has now been removed, however, the same effect, with even more
possibilities, can be achieved by injecting `$animateCss` into a
JavaScript-defined animation and creating custom CSS-based animations
from there. Read the ngAnimate docs for more info.

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  The function params for `$animate.enabled()` when an
element is used are now flipped. This fix allows the function to act as
a getter when a single element param is provided.

```js
// < 1.4
$animate.enabled(false, element);

// 1.4+
$animate.enabled(element, false);
```

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  In addition to disabling the children of the element,
`$animate.enabled(element, false)` will now also disable animations on
the element itself.

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  Animation-related callbacks are now fired on
`$animate.on` instead of directly being on the element.

```js
// < 1.4
element.on('$animate:before', function(e, data) {
  if (data.event === 'enter') { ... }
});
element.off('$animate:before', fn);

// 1.4+
$animate.on(element, 'enter', function(data) {
  //...
});
$animate.off(element, 'enter', fn);
```

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  There is no need to call `$scope.$apply` or
`$scope.$digest` inside of an animation promise callback anymore
since the promise is resolved within a digest automatically (but a
digest is not run unless the promise is chained).

```js
// < 1.4
$animate.enter(element).then(function() {
  $scope.$apply(function() {
    $scope.explode = true;
  });
});

// 1.4+
$animate.enter(element).then(function() {
  $scope.explode = true;
});
```

- **$animate:** due to [c8700f04](https://github.com/angular/angular.js/commit/c8700f04fb6fb5dc21ac24de8665c0476d6db5ef),
  When an enter, leave or move animation is triggered then it
will always end any pending or active parent class based animations
(animations triggered via ngClass) in order to ensure that any CSS
styles are resolved in time.




<a name="1.4.0-beta.6"></a>
# 1.4.0-beta.6 cookie-liberation (2015-03-17)


## Bug Fixes

- **$animate:** call `applyStyles` from options on `leave`
  ([4374f892](https://github.com/angular/angular.js/commit/4374f892c6fa4af6ba1f2ed47c5f888fdb5fadc5),
   [#10068](https://github.com/angular/angular.js/issues/10068))
- **$browser:**  don't crash if `history.state` access causes error in IE
  ([3b8163b7](https://github.com/angular/angular.js/commit/3b8163b7b664f24499e75460ab50c066eaec0f78),
   [#10367](https://github.com/angular/angular.js/issues/10367), [#10369](https://github.com/angular/angular.js/issues/10369))
- **$sanitize:** disallow unsafe svg animation tags
  ([67688d5c](https://github.com/angular/angular.js/commit/67688d5ca00f6de4c7fe6084e2fa762a00d25610),
   [#11290](https://github.com/angular/angular.js/issues/11290))
- **Angular:** properly compare RegExp with other objects for equality
  ([f22e1fc9](https://github.com/angular/angular.js/commit/f22e1fc9610ae111a3ea8746a3a57169c99ce142),
   [#11204](https://github.com/angular/angular.js/issues/11204), [#11205](https://github.com/angular/angular.js/issues/11205))
- **date filter:** display localized era for `G` format codes
  ([2b4dfa9e](https://github.com/angular/angular.js/commit/2b4dfa9e2b63d7ebb78f3b0fd3439d18f932e1cd),
   [#10503](https://github.com/angular/angular.js/issues/10503), [#11266](https://github.com/angular/angular.js/issues/11266))
- **filterFilter:**
  - fix filtering using an object expression when the filter value is undefined
  ([c62fa6bd](https://github.com/angular/angular.js/commit/c62fa6bd898e1048d4690d41034489dc60ba6ac2),
   [#10419](https://github.com/angular/angular.js/issues/10419), [#10424](https://github.com/angular/angular.js/issues/10424))
  - do not throw an error if property is null when comparing objects
  ([2c4ffd6a](https://github.com/angular/angular.js/commit/2c4ffd6af4eb012c4054fe7c096267bbc5510af0),
   [#10991](https://github.com/angular/angular.js/issues/10991), [#10992](https://github.com/angular/angular.js/issues/10992), [#11116](https://github.com/angular/angular.js/issues/11116))
- **form:** allow dynamic form names which initially evaluate to blank
  ([410f7c68](https://github.com/angular/angular.js/commit/410f7c682633c681be641cd2a321f9e51671d474))
- **jqLite:** attr should ignore comment, text and attribute nodes
  ([bb5bf7f8](https://github.com/angular/angular.js/commit/bb5bf7f8162d11610a53428e630b47030bdc38e5))
- **ng/$locale:** add ERA info in generic locale
  ([4acb0af2](https://github.com/angular/angular.js/commit/4acb0af24c7fb3705a197ca96adc532de4766a7a))
- **ngJq:** don't rely on existence of jqlite
  ([342e5f3c](https://github.com/angular/angular.js/commit/342e5f3ce38d2fd10c5d5a98ca66f864286a7922),
   [#11044](https://github.com/angular/angular.js/issues/11044))
- **ngMessages:** ensure that multi-level transclusion works with `ngMessagesInclude`
  ([d7ec5f39](https://github.com/angular/angular.js/commit/d7ec5f392e1550658ddf271a30627b1749eccb69),
   [#11196](https://github.com/angular/angular.js/issues/11196))
- **ngOptions:** fix model<->option interaction when using `track by`
  ([6a03ca27](https://github.com/angular/angular.js/commit/6a03ca274314352052c3082163367a146bb11c2d),
   [#10869](https://github.com/angular/angular.js/issues/10869), [#10893](https://github.com/angular/angular.js/issues/10893))
- **rootScope:** prevent memory leak when destroying scopes
  ([fb7db4a0](https://github.com/angular/angular.js/commit/fb7db4a07bd1b0b67824d3808fe315419b272689),
   [#11173](https://github.com/angular/angular.js/issues/11173), [#11169](https://github.com/angular/angular.js/issues/11169))


## Features

- **$cookies:**
  - allow passing cookie options
  ([92c366d2](https://github.com/angular/angular.js/commit/92c366d205da36ec26502aded23db71a6473dad7),
   [#8324](https://github.com/angular/angular.js/issues/8324), [#3988](https://github.com/angular/angular.js/issues/3988), [#1786](https://github.com/angular/angular.js/issues/1786), [#950](https://github.com/angular/angular.js/issues/950))
  - move logic into $cookies and deprecate $cookieStore
  ([38fbe3ee](https://github.com/angular/angular.js/commit/38fbe3ee8370fc449b82d80df07b5c2ed2cd5fbe),
   [#6411](https://github.com/angular/angular.js/issues/6411), [#7631](https://github.com/angular/angular.js/issues/7631))
- **$cookiesProvider:** provide path, domain, expires and secure options
  ([53c66369](https://github.com/angular/angular.js/commit/53c663699126815eabc2a3bc1e3bafc8b3874268))
- **$interval:** pass additional arguments to the callback
  ([4f1f9cfd](https://github.com/angular/angular.js/commit/4f1f9cfdb721cf308ca1162b2227836dc1d28388),
   [#10632](https://github.com/angular/angular.js/issues/10632))
- **$timeout:** pass additional arguments to the callback
  ([3a4b6b83](https://github.com/angular/angular.js/commit/3a4b6b83efdb8051e5c4803c0892c19ceb2cba50),
   [#10631](https://github.com/angular/angular.js/issues/10631))
- **angular.merge:** provide an alternative to `angular.extend` that merges 'deeply'
  ([c0498d45](https://github.com/angular/angular.js/commit/c0498d45feb913c318224ea70b5adf7112df6bac),
   [#10507](https://github.com/angular/angular.js/issues/10507), [#10519](https://github.com/angular/angular.js/issues/10519))
- **filterFilter:** compare object with custom `toString()` to primitive
  ([f8c42161](https://github.com/angular/angular.js/commit/f8c421617096a8d613f4eb6d0f5b098ee149c029),
   [#10464](https://github.com/angular/angular.js/issues/10464), [#10548](https://github.com/angular/angular.js/issues/10548))
- **ngAria:**
  - add `button` role to `ngClick`
  ([bb365070](https://github.com/angular/angular.js/commit/bb365070a3ed7c2d26056d378ab6a8ef493b23cc),
   [#9254](https://github.com/angular/angular.js/issues/9254), [#10318](https://github.com/angular/angular.js/issues/10318))
  - add roles to custom inputs
  ([29cdaee2](https://github.com/angular/angular.js/commit/29cdaee2b6e853bc3f8882a00661698d146ecd18),
   [#10012](https://github.com/angular/angular.js/issues/10012), [#10318](https://github.com/angular/angular.js/issues/10318))
- **ngLocale:** Add FIRSTDAYOFWEEK and WEEKENDRANGE from google data
  ([3d149c7f](https://github.com/angular/angular.js/commit/3d149c7f20ffabab5a635af9ddcfc7105112ab4a))
- **ngMock:**
  - allow mock $controller service to set up controller bindings
  ([d02d0585](https://github.com/angular/angular.js/commit/d02d0585a086ecd2e1de628218b5a6d85c8fc7bd),
   [#9425](https://github.com/angular/angular.js/issues/9425), [#11239](https://github.com/angular/angular.js/issues/11239))
  - add `they` helpers for testing multiple specs
  ([e650c458](https://github.com/angular/angular.js/commit/e650c45894abe6314a806e6b3e32c908df5c00fd),
   [#10864](https://github.com/angular/angular.js/issues/10864))
- **ngModel:** support conversion to timezone other than UTC
  ([0413bee8](https://github.com/angular/angular.js/commit/0413bee8cc563a6555f8d42d5f183f6fbefc7350),
   [#11005](https://github.com/angular/angular.js/issues/11005))


## Breaking Changes

- **$cookies:** due to [38fbe3ee](https://github.com/angular/angular.js/commit/38fbe3ee8370fc449b82d80df07b5c2ed2cd5fbe),


`$cookies` no longer exposes properties that represent the current browser cookie
values. Now you must explicitly the methods described above to access the cookie
values. This also means that you can no longer watch the `$cookies` properties for
changes to the browser's cookies.

This feature is generally only needed if a 3rd party library was programmatically
changing the cookies at runtime. If you rely on this then you must either write code that
can react to the 3rd party library making the changes to cookies or implement your own polling
mechanism.




<a name="1.3.15"></a>
# 1.3.15 locality-filtration (2015-03-17)

## Bug Fixes

- **$animate:** call `applyStyles` with options on `leave`
  ([ebd84e80](https://github.com/angular/angular.js/commit/ebd84e8008f45ccaa84290f6da8c2a114fcfa8cd),
   [#10068](https://github.com/angular/angular.js/issues/10068))
- **$browser:**  don't crash if history.state access causes error in IE
  ([92767c09](https://github.com/angular/angular.js/commit/92767c098feaf8c58faf2d67f882305019d8160e),
   [#10367](https://github.com/angular/angular.js/issues/10367), [#10369](https://github.com/angular/angular.js/issues/10369))
- **Angular:** properly compare RegExp with other objects for equality
  ([b8e8f9af](https://github.com/angular/angular.js/commit/b8e8f9af78f4ef3e556dd3cef6bfee35ad4cb82a),
   [#11204](https://github.com/angular/angular.js/issues/11204), [#11205](https://github.com/angular/angular.js/issues/11205))
- **date filter:** display localized era for `G` format codes
  ([f2683f95](https://github.com/angular/angular.js/commit/f2683f956fcd3216eaa263db20b31e0d46338800),
   [#10503](https://github.com/angular/angular.js/issues/10503), [#11266](https://github.com/angular/angular.js/issues/11266))
- **filterFilter:**
  - fix filtering using an object expression when the filter value is `undefined`
  ([63b9956f](https://github.com/angular/angular.js/commit/63b9956faf4c3679c88a9401b8ccbb111c0294ee),
   [#10419](https://github.com/angular/angular.js/issues/10419), [#10424](https://github.com/angular/angular.js/issues/10424))
  - do not throw an error if property is null when comparing objects
  ([01161a0e](https://github.com/angular/angular.js/commit/01161a0e9fb1af93e9f06535aed8392ed7f116a4),
   [#10991](https://github.com/angular/angular.js/issues/10991), [#10992](https://github.com/angular/angular.js/issues/10992), [#11116](https://github.com/angular/angular.js/issues/11116))
- **form:** allow dynamic form names which initially evaluate to blank
  ([190ea883](https://github.com/angular/angular.js/commit/190ea883c588d63f8b900a8de1d45c6c9ebb01ec),
   [#11096](https://github.com/angular/angular.js/issues/11096))
- **ng/$locale:** add ERA info in generic locale
  ([57842530](https://github.com/angular/angular.js/commit/578425303f2480959da80f31920d08f277d42010))
- **rootScope:** prevent memory leak when destroying scopes
  ([528cf09e](https://github.com/angular/angular.js/commit/528cf09e3f78ad4e3bb6a329ebe315c4f29b4cdb),
   [#11173](https://github.com/angular/angular.js/issues/11173), [#11169](https://github.com/angular/angular.js/issues/11169))
- **templateRequest:** avoid throwing syntax error in Android 2.3
  ([75abbd52](https://github.com/angular/angular.js/commit/75abbd525f07866fdcc6fb311802b8fe700af174),
   [#11089](https://github.com/angular/angular.js/issues/11089), [#11051](https://github.com/angular/angular.js/issues/11051), [#11088](https://github.com/angular/angular.js/issues/11088))


## Features

- **ngAria:**
  - add `button` role to `ngClick`
  ([b9ad91cf](https://github.com/angular/angular.js/commit/b9ad91cf1e86310a2d2bf13b29fa13a9b835e1ce),
   [#9254](https://github.com/angular/angular.js/issues/9254), [#10318](https://github.com/angular/angular.js/issues/10318))
  - add roles to custom inputs
  ([21369943](https://github.com/angular/angular.js/commit/21369943fafd577b36827a641b021b1c14cefb57),
   [#10012](https://github.com/angular/angular.js/issues/10012), [#10318](https://github.com/angular/angular.js/issues/10318))
- **ngMock:**
  - allow mock $controller service to set up controller bindings
  ([b3878a36](https://github.com/angular/angular.js/commit/b3878a36d9f8e56ad7be1eedb9691c9bd12568cb),
   [#9425](https://github.com/angular/angular.js/issues/9425), [#11239](https://github.com/angular/angular.js/issues/11239))
  - add `they` helpers for testing multiple specs
  ([7288be25](https://github.com/angular/angular.js/commit/7288be25a75d6ca6ac7eca05a7d6b12ccb3a22f8),
   [#10864](https://github.com/angular/angular.js/issues/10864))



<a name="1.4.0-beta.5"></a>
# 1.4.0-beta.5 karmic-stabilization (2015-02-24)


## Bug Fixes

- **$http:** properly access request headers with mixed case
  ([5da1256f](https://github.com/angular/angular.js/commit/5da1256fc2812d5b28fb0af0de81256054856369),
   [#10881](https://github.com/angular/angular.js/issues/10881), [#10883](https://github.com/angular/angular.js/issues/10883))
- **input:** create max and/or min validator regardless of initial value
  ([c211e7a5](https://github.com/angular/angular.js/commit/c211e7a5ad5f1fb8748125f14912aa8715081925),
   [#10307](https://github.com/angular/angular.js/issues/10307), [#10327](https://github.com/angular/angular.js/issues/10327))
- **ngAria:** correctly set "checked" attr for checkboxes and radios
  ([d6eba217](https://github.com/angular/angular.js/commit/d6eba21733c6e67e90e3a4763d8d41ad89a73a0c),
   [#10389](https://github.com/angular/angular.js/issues/10389), [#10212](https://github.com/angular/angular.js/issues/10212))
- **ngModel:** fix issues when parserName is same as validator key
  ([056a3170](https://github.com/angular/angular.js/commit/056a31700803c0a6014b43cfcc36c5c500cc596e),
   [#10698](https://github.com/angular/angular.js/issues/10698), [#10850](https://github.com/angular/angular.js/issues/10850), [#11046](https://github.com/angular/angular.js/issues/11046))
- **ngOptions:** ngModel is optional
  ([ef894c87](https://github.com/angular/angular.js/commit/ef894c87eaead76d90169113ab6acc9287654ea3))
- **ngSanitize:** Do not ignore white-listed svg camelCased attributes
  ([46b80654](https://github.com/angular/angular.js/commit/46b80654cae9105642909cd55f73f7c26d2fbd80),
   [#10779](https://github.com/angular/angular.js/issues/10779), [#10990](https://github.com/angular/angular.js/issues/10990), [#11124](https://github.com/angular/angular.js/issues/11124))
- **select:** remove unknown option when model is undefined and empty option is available
  ([30b48132](https://github.com/angular/angular.js/commit/30b48132e0fb92ea8dd25a9794b4c41a3a81a951),
   [#11078](https://github.com/angular/angular.js/issues/11078), [#11092](https://github.com/angular/angular.js/issues/11092))
- **templateRequest:** avoid throwing syntax error in Android 2.3
  ([f6272333](https://github.com/angular/angular.js/commit/f6272333127d908b19da23f9cd8a74052711795b),
   [#11089](https://github.com/angular/angular.js/issues/11089), [#11051](https://github.com/angular/angular.js/issues/11051), [#11088](https://github.com/angular/angular.js/issues/11088))


## Features

- **CommonJS:** - angular modules are now packaged for npm with helpful exports

- **limitTo:** extend the filter to take a beginning index argument
  ([aaae3cc4](https://github.com/angular/angular.js/commit/aaae3cc4160417e6dad802ed9d9f6d5471821a87),
   [#5355](https://github.com/angular/angular.js/issues/5355), [#10899](https://github.com/angular/angular.js/issues/10899))
- **ngMessages:** provide support for dynamic message resolution
  ([c9a4421f](https://github.com/angular/angular.js/commit/c9a4421fc3c97448527eadef1f42eb2f487ec2e0),
   [#10036](https://github.com/angular/angular.js/issues/10036), [#9338](https://github.com/angular/angular.js/issues/9338))
- **ngOptions:** add support for disabling an option
  ([da9eac86](https://github.com/angular/angular.js/commit/da9eac8660343b1cd9fdcf9d2d1bda06067142d7),
   [#638](https://github.com/angular/angular.js/issues/638), [#11017](https://github.com/angular/angular.js/issues/11017))


## Performance Improvements

- **$compile:**
  - replace forEach(controller) with plain loops
  ([5b522867](https://github.com/angular/angular.js/commit/5b5228675f67c8f5e04c7183c3ef5e71cb2bf08b),
   [#11084](https://github.com/angular/angular.js/issues/11084))
  - avoid .data when fetching required controllers
  ([fa0aa839](https://github.com/angular/angular.js/commit/fa0aa83937378cf8fc720c38bcc5c78fc923624e))
- **ngOptions:** only watch labels if a display expression is specified
  ([51faaffd](https://github.com/angular/angular.js/commit/51faaffdbcc734c55d52ff6c42b386d5c90207ea))


## Breaking Changes

- **ngMessages:** due to [c9a4421f](https://github.com/angular/angular.js/commit/c9a4421fc3c97448527eadef1f42eb2f487ec2e0),

The `ngMessagesInclude` attribute is now its own directive and that must
be placed as a **child** element within the element with the ngMessages
directive. (Keep in mind that the former behavior of the
ngMessageInclude attribute was that all **included** ngMessage template
code was placed at the **bottom** of the element containing the
ngMessages directive; therefore to make this behave in the same way,
place the element containing the ngMessagesInclude directive at the
end of the container containing the ngMessages directive).

```html
<!-- AngularJS 1.3.x -->
<div ng-messages="model.$error" ng-messages-include="remote.html">
  <div ng-message="required">Your message is required</div>
</div>

<!-- AngularJS 1.4.x -->
<div ng-messages="model.$error">
  <div ng-message="required">Your message is required</div>
  <div ng-messages-include="remote.html"></div>
</div>
```

- **ngMessages:** due to [c9a4421f](https://github.com/angular/angular.js/commit/c9a4421fc3c97448527eadef1f42eb2f487ec2e0),

it is no longer possible to use interpolation inside the `ngMessages` attribute expression. This technique
is generally not recommended, and can easily break when a directive implementation changes. In cases
where a simple expression is not possible, you can delegate accessing the object to a function:

```html
<div ng-messages="ctrl.form['field_{{$index}}'].$error">...</div>
```
would become
```html
<div ng-messages="ctrl.getMessages($index)">...</div>
```
where `ctrl.getMessages()`
```javascript
ctrl.getMessages = function($index) {
  return ctrl.form['field_' + $index].$error;
}
```

- **$http:** due to [5da1256](https://github.com/angular/angular.js/commit/5da1256fc2812d5b28fb0af0de81256054856369),

`transformRequest` functions can no longer modify request headers.

Before this commit `transformRequest` could modify request headers, ex.:

```javascript
function requestTransform(data, headers) {
    headers = angular.extend(headers(), {
      'X-MY_HEADER': 'abcd'
    });
  }
  return angular.toJson(data);
}
```

This behavior was unintended and undocumented, so the change should affect very few applications. If one
needs to dynamically add / remove headers it should be done in a header function, for example:

```javascript
$http.get(url, {
  headers: {
    'X-MY_HEADER': function(config) {
      return 'abcd'; //you've got access to a request config object to specify header value dynamically
    }
  }
})
```

<a name="1.3.14"></a>
# 1.3.14 instantaneous-browserification (2015-02-24)


## Features

- **CommonJS:** - angular modules are now packaged for npm with helpful exports

## Bug Fixes

- **input:** create max and/or min validator regardless of initial value
  ([abfce532](https://github.com/angular/angular.js/commit/abfce5327ce6fd29c33c62d2edf3600674a6b4c0),
   [#10307](https://github.com/angular/angular.js/issues/10307), [#10327](https://github.com/angular/angular.js/issues/10327))
- **ngAria:** correctly set "checked" attr for checkboxes and radios
  ([944c150e](https://github.com/angular/angular.js/commit/944c150e6c3001e51d4bf5e2d8149ae4c565d1e3),
   [#10389](https://github.com/angular/angular.js/issues/10389), [#10212](https://github.com/angular/angular.js/issues/10212))
- **ngModel:** fix issues when parserName is same as validator key
  ([6b7625a0](https://github.com/angular/angular.js/commit/6b7625a09508c4b5355121a9d4206a734b07b2e1),
   [#10698](https://github.com/angular/angular.js/issues/10698), [#10850](https://github.com/angular/angular.js/issues/10850), [#11046](https://github.com/angular/angular.js/issues/11046))



<a name="1.4.0-beta.4"></a>
# 1.4.0-beta.4 overlyexplosive-poprocks (2015-02-09)


## Bug Fixes

- **$location:** prevent page reload if initial url has empty hash at the end
  ([a509e9aa](https://github.com/angular/angular.js/commit/a509e9aa149d0f88cc39f703d539f7ffd4cd6103),
   [#10397](https://github.com/angular/angular.js/issues/10397), [#10960](https://github.com/angular/angular.js/issues/10960))
- **$parse:** Initialize elements in an array from left to right
  ([966f6d83](https://github.com/angular/angular.js/commit/966f6d831f9469a917601f9a10604612cd7bd792))
- **ngAria:** ensure native controls fire a single click
  ([9d53e5a3](https://github.com/angular/angular.js/commit/9d53e5a38dd369dec82d82e13e078df3d6054c8a),
   [#10388](https://github.com/angular/angular.js/issues/10388), [#10766](https://github.com/angular/angular.js/issues/10766))
- **ngMock:** handle cases where injector is created before tests
  ([898714df](https://github.com/angular/angular.js/commit/898714df9ea38f9ef700015ced5ddea52f096b77),
   [#10967](https://github.com/angular/angular.js/issues/10967))
- **sanitize:** handle newline characters inside special tags
  ([cc8755cd](https://github.com/angular/angular.js/commit/cc8755cda6efda0b52954388e8a8d5306e4bfbca),
  [030a42e7](https://github.com/angular/angular.js/commit/030a42e79dec8a4bb73053762f7a54d797a058f6)
   [#10943](https://github.com/angular/angular.js/issues/10943))


## Features

- **ng-jq:** adds the ability to force jqLite or a specific jQuery version
  ([09ee82d8](https://github.com/angular/angular.js/commit/09ee82d84dcbea4a6e8d85903af82dcd087a78a7))



<a name="1.3.13"></a>
# 1.3.13 meticulous-riffleshuffle (2015-02-09)


## Bug Fixes

- **$location:** prevent page reload if initial url has empty hash at the end
  ([4b3a590b](https://github.com/angular/angular.js/commit/4b3a590b009d7fdceda7f52e7ba0352a271b3256),
   [#10397](https://github.com/angular/angular.js/issues/10397), [#10960](https://github.com/angular/angular.js/issues/10960))
- **ngAria:** ensure native controls fire a single click
  ([69ee593f](https://github.com/angular/angular.js/commit/69ee593fd2cb5f1d7757efbe6b256e4458752fd7),
   [#10388](https://github.com/angular/angular.js/issues/10388), [#10766](https://github.com/angular/angular.js/issues/10766))
- **ngMock:** handle cases where injector is created before tests
  ([39ddef68](https://github.com/angular/angular.js/commit/39ddef682971d3b7282bf9d08f6eaf97b7f4bca4),
   [#10967](https://github.com/angular/angular.js/issues/10967))
- **sanitize:** handle newline characters inside special tags
  ([11aedbd7](https://github.com/angular/angular.js/commit/11aedbd741ccddba060a9805adba1779391731da),
  [ce49d4d6](https://github.com/angular/angular.js/commit/ce49d4d61bd02464b6c6376af8048f6eb09330a8)
   [#10943](https://github.com/angular/angular.js/issues/10943))





<a name="1.4.0-beta.3"></a>
# 1.4.0-beta.3 substance-mimicry (2015-02-02)


## Bug Fixes

- **$compile:**
  - do not initialize optional '&' binding if attribute not specified
  ([6a38dbfd](https://github.com/angular/angular.js/commit/6a38dbfd3c34c8f9efff503d17eb3cbeb666d422),
   [#6404](https://github.com/angular/angular.js/issues/6404), [#9216](https://github.com/angular/angular.js/issues/9216))
  - respect return value from controller constructor
  ([62d514b0](https://github.com/angular/angular.js/commit/62d514b06937cc7dd86e973ea11165c88343b42d))
- **$controller:** throw better error when controller expression is bad
  ([dda65e99](https://github.com/angular/angular.js/commit/dda65e992b72044c0fa0c8f5f33184028c0e3ad7),
   [#10875](https://github.com/angular/angular.js/issues/10875), [#10910](https://github.com/angular/angular.js/issues/10910))
- **$parse:**
  - handle null targets at assign
  ([2e5a7e52](https://github.com/angular/angular.js/commit/2e5a7e52a0385575bbb55a801471b009afafeca3))
  - remove references to last arguments to a fn call
  ([e61eae1b](https://github.com/angular/angular.js/commit/e61eae1b1f2351c51bcfe4142749a4e68a2806ff),
   [#10894](https://github.com/angular/angular.js/issues/10894))
- **a:** don't reload if there is only a name attribute
  ([d729fcf0](https://github.com/angular/angular.js/commit/d729fcf030be1d3ef37196d36ea3bf3249ee3318),
   [#6273](https://github.com/angular/angular.js/issues/6273), [#10880](https://github.com/angular/angular.js/issues/10880))
- **angular.copy:** support copying `TypedArray`s
  ([aa0f6449](https://github.com/angular/angular.js/commit/aa0f64496a66d2a5d1a4d033f2eb075a8b084a78),
   [#10745](https://github.com/angular/angular.js/issues/10745))
- **filter:** format timezone correctly in the case that UTC timezone is used
  ([8c469191](https://github.com/angular/angular.js/commit/8c46919199090a05634789774124b38983430c76),
   [#9359](https://github.com/angular/angular.js/issues/9359))
- **ngRoute:** don't duplicate optional params into query
  ([27bf2ce4](https://github.com/angular/angular.js/commit/27bf2ce40c5adfb1494d69c9d0ac9cf433834a12),
   [#10689](https://github.com/angular/angular.js/issues/10689))
- **ngScenario:** allow ngScenario to handle lazy-loaded and manually bootstrapped applications
  ([c69caa7b](https://github.com/angular/angular.js/commit/c69caa7beee4e920f8f587eb3e943be99864a14f),
   [#10723](https://github.com/angular/angular.js/issues/10723))
- **validators:** maxlength should use viewValue for $isEmpty
  ([bfcf9946](https://github.com/angular/angular.js/commit/bfcf9946e16d21b55dde50d4d21c71c898b10215),
   [#10898](https://github.com/angular/angular.js/issues/10898))


## Features

- **$compile:** allow using bindToController as object, support both new/isolate scopes
  ([35498d70](https://github.com/angular/angular.js/commit/35498d7045ba9138016464a344e2c145ce5264c1),
   [#10420](https://github.com/angular/angular.js/issues/10420), [#10467](https://github.com/angular/angular.js/issues/10467))
- **filter:** support conversion to timezone other than UTC
  ([c6d8512a](https://github.com/angular/angular.js/commit/c6d8512a1d7345516d1bd9a039d81821b9518bff),
   [#10858](https://github.com/angular/angular.js/issues/10858))
- **ngMocks:** cleanup $inject annotations after each test
  ([0baa17a3](https://github.com/angular/angular.js/commit/0baa17a3b7ad2b242df2b277b81cebdf75b04287))


## Performance Improvements

- **$scope:** Add a property $$watchersCount to scope
  ([c1500ea7](https://github.com/angular/angular.js/commit/c1500ea775c4cb130088b7d5bb5fb872bda50bae))
- **$parse** new and more performant parser
  ([0d42426](https://github.com/angular/angular.js/commit/0d424263ead16635afb582affab2b147f8e71626))


## Breaking Changes

- **$compile:** due to [6a38dbfd](https://github.com/angular/angular.js/commit/6a38dbfd3c34c8f9efff503d17eb3cbeb666d422),
Previously, '&' expressions would always set up a function in the isolate scope. Now, if the binding
is marked as optional and the attribute is not specified, no function will be added to the isolate scope.


<a name="1.3.12"></a>
# 1.3.12 outlandish-knitting (2015-02-02)


## Bug Fixes

- **$controller:** throw better error when controller expression is bad
  ([632b2ddd](https://github.com/angular/angular.js/commit/632b2ddd34c07b3b5a207bd83ca3a5e6e613e63b),
   [#10875](https://github.com/angular/angular.js/issues/10875), [#10910](https://github.com/angular/angular.js/issues/10910))
- **$parse:** remove references to last arguments to a fn call
  ([7caad220](https://github.com/angular/angular.js/commit/7caad2205a6e9927890192a3638f55532bdaaf75),
   [#10894](https://github.com/angular/angular.js/issues/10894))
- **ngRoute:** don't duplicate optional params into query
  ([f41ca4a5](https://github.com/angular/angular.js/commit/f41ca4a53ed53f172fb334911be56e42aad58794),
   [#10689](https://github.com/angular/angular.js/issues/10689))
- **ngScenario:** Allow ngScenario to handle lazy-loaded and manually bootstrapped applications
  ([0bcd0872](https://github.com/angular/angular.js/commit/0bcd0872d8d2e37e6cb7aa5bc5cb0c742b4294f9),
   [#10723](https://github.com/angular/angular.js/issues/10723))
- **validators:** maxlength should use viewValue for $isEmpty
  ([abd8e2a9](https://github.com/angular/angular.js/commit/abd8e2a9eb2d21ac67989c2f7b64c4c6547a1585),
   [#10898](https://github.com/angular/angular.js/issues/10898))


## Features

- **ngMocks:** cleanup $inject annotations after each test
  ([6ec59460](https://github.com/angular/angular.js/commit/6ec5946094ee92b820bbacc886fa2367715e60b4))




<a name="1.4.0-beta.2"></a>
# 1.4.0-beta.2 holographic-rooster (2015-01-26)


## Bug Fixes

- **$location:** don't rewrite when link is shift-clicked
  ([8b33de6f](https://github.com/angular/angular.js/commit/8b33de6fd0ec0eb785fed697f062763b5c1d8d23),
   [#9904](https://github.com/angular/angular.js/issues/9904), [#9906](https://github.com/angular/angular.js/issues/9906))
- **$templateRequest:** cache downloaded templates as strings
  ([b3a9bd3a](https://github.com/angular/angular.js/commit/b3a9bd3ae043e3042ea7ccfe08e3b36a84feb35e),
   [#10630](https://github.com/angular/angular.js/issues/10630), [#10646](https://github.com/angular/angular.js/issues/10646))
- **filterFilter:** throw error if input is not an array
  ([cea8e751](https://github.com/angular/angular.js/commit/cea8e75144e6910b806b63a6ec2a6d118316fddd),
   [#9992](https://github.com/angular/angular.js/issues/9992), [#10352](https://github.com/angular/angular.js/issues/10352))
- **htmlAnchorDirective:**
  - remove "element !== target element" check
  ([2958cd30](https://github.com/angular/angular.js/commit/2958cd308b5ebaf223a3e5df3fb5bf0f23408447),
   [#10866](https://github.com/angular/angular.js/issues/10866))
  - don't add event listener if replaced, ignore event if target is different element
  ([b146af11](https://github.com/angular/angular.js/commit/b146af11271de8fa4c51c6db87df104269f41a33),
   [#4262](https://github.com/angular/angular.js/issues/4262), [#10849](https://github.com/angular/angular.js/issues/10849))
- **ngPluralize:** fix wrong text content when count is null/undefined
  ([3228d3b4](https://github.com/angular/angular.js/commit/3228d3b4991af681e57de5ab079c1e1c11cf35cb),
   [#10836](https://github.com/angular/angular.js/issues/10836), [#10841](https://github.com/angular/angular.js/issues/10841))

## Breaking Changes

- **filterFilter:** due to [cea8e751](https://github.com/angular/angular.js/commit/cea8e75144e6910b806b63a6ec2a6d118316fddd),
  Previously, the filter was not applied if used with a non array.
Now, it throws an error. This can be worked around by converting an object to an array, using
a filter such as https://github.com/petebacondarwin/angular-toArrayFilter

Closes #9992
Closes #10352


<a name="1.3.11"></a>
# 1.3.11 spiffy-manatee (2015-01-26)


## Bug Fixes

- **$location:** don't rewrite when link is shift-clicked
  ([939ca37c](https://github.com/angular/angular.js/commit/939ca37cfe5f6fc35b09b6705caabd1fcc3cf9d3),
   [#9904](https://github.com/angular/angular.js/issues/9904), [#9906](https://github.com/angular/angular.js/issues/9906))
- **htmlAnchorDirective:**
  - remove "element !== target element" check
  ([779e3f6b](https://github.com/angular/angular.js/commit/779e3f6b5f8d2550e758cb0c5f64187ba8e00e29),
   [#10866](https://github.com/angular/angular.js/issues/10866))
  - don't add event listener if replaced, ignore event if target is different element
  ([837a0775](https://github.com/angular/angular.js/commit/837a077578081bbd07863bef85241537d19fa652),
   [#4262](https://github.com/angular/angular.js/issues/4262), [#10849](https://github.com/angular/angular.js/issues/10849))


<a name="1.4.0-beta.1"></a>
# 1.4.0-beta.1 trepidatious-salamander (2015-01-20)


## Bug Fixes

- **$animate:** ensure no transitions are applied when an empty inline style object is provided
  ([0db5b21b](https://github.com/angular/angular.js/commit/0db5b21b1d09431535e0c0bf8ac63d4b5b24d349),
   [#10613](https://github.com/angular/angular.js/issues/10613), [#10770](https://github.com/angular/angular.js/issues/10770))
- **$compile:** support class directives on SVG elements
  ([23c8a90d](https://github.com/angular/angular.js/commit/23c8a90d22f7c7b41b5a756b89498ffac828980a),
   [#10736](https://github.com/angular/angular.js/issues/10736), [#10756](https://github.com/angular/angular.js/issues/10756))
- **form:** clean up success state of controls when they are removed
  ([2408f2de](https://github.com/angular/angular.js/commit/2408f2ded5ead6e678c241e38ef474c1fadff92b),
   [#10509](https://github.com/angular/angular.js/issues/10509))
- **ngController:** allow bound constructor fns as controllers
  ([d17fbc38](https://github.com/angular/angular.js/commit/d17fbc3862e0a2e646db1222f184dbe663da4a1f),
   [#10784](https://github.com/angular/angular.js/issues/10784), [#10790](https://github.com/angular/angular.js/issues/10790))
- **ngRepeat:** do not sort object keys alphabetically
  ([c260e738](https://github.com/angular/angular.js/commit/c260e7386391877625eda086480de73e8a0ba921),
   [#6210](https://github.com/angular/angular.js/issues/6210), [#10538](https://github.com/angular/angular.js/issues/10538))


## Features

- **$http:** provide a config object as an argument to header functions
  ([d435464c](https://github.com/angular/angular.js/commit/d435464c51d3912f56cfc830d86bfc64a1578327),
   [#7235](https://github.com/angular/angular.js/issues/7235), [#10622](https://github.com/angular/angular.js/issues/10622))


## Breaking Changes

- **ngRepeat:** due to [c260e738](https://github.com/angular/angular.js/commit/c260e7386391877625eda086480de73e8a0ba921),


Previously, the order of items when using ngRepeat to iterate
over object properties was guaranteed to be consistent by sorting the
keys into alphabetic order.

Now, the order of the items is browser dependent based on the order returned
from iterating over the object using the `for key in obj` syntax.

It seems that browsers generally follow the strategy of providing
keys in the order in which they were defined, although there are exceptions
when keys are deleted and reinstated. See
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#Cross-browser_issues

The best approach is to convert Objects into Arrays by a filter such as
https://github.com/petebacondarwin/angular-toArrayFilter
or some other mechanism, and then sort them manually in the order you need.

Closes #6210
Closes #10538



<a name="1.3.10"></a>
# 1.3.10 heliotropic-sundial (2015-01-20)


## Bug Fixes

- **$animate:** ensure no transitions are applied when an empty inline style object is provided
  ([9b8df52a](https://github.com/angular/angular.js/commit/9b8df52aa960b9b6288fc150d55ea2e35f56555e),
   [#10613](https://github.com/angular/angular.js/issues/10613), [#10770](https://github.com/angular/angular.js/issues/10770))
- **$compile:** support class directives on SVG elements
  ([7a9e3360](https://github.com/angular/angular.js/commit/7a9e3360284d58197a1fe34de57f5e0f6d1f4a76),
   [#10736](https://github.com/angular/angular.js/issues/10736), [#10756](https://github.com/angular/angular.js/issues/10756))
- **form:** clean up success state of controls when they are removed
  ([cdc7280d](https://github.com/angular/angular.js/commit/cdc7280dd3d5a2ded784c06dd55fe36c2053fb6f),
   [#10509](https://github.com/angular/angular.js/issues/10509))
- **ngController:** allow bound constructor fns as controllers
  ([d015c8a8](https://github.com/angular/angular.js/commit/d015c8a80b28754633c846fc50d11c9437519486),
   [#10784](https://github.com/angular/angular.js/issues/10784), [#10790](https://github.com/angular/angular.js/issues/10790))



<a name="1.4.0-beta.0"></a>
# 1.4.0-beta.0 photonic-umbrakinesis (2015-01-13)


## Bug Fixes

- **$location:** support right button click on anchors in firefox
  ([aa798f12](https://github.com/angular/angular.js/commit/aa798f123658cb78b5581513d26577016195cafe),
   [#7984](https://github.com/angular/angular.js/issues/7984))
- **$templateRequest:** propagate HTTP status on failed requests
  ([e24f22bd](https://github.com/angular/angular.js/commit/e24f22bdb1740388938d58778aa24d307a79a796),
   [#10514](https://github.com/angular/angular.js/issues/10514), [#10628](https://github.com/angular/angular.js/issues/10628))
- **dateFilter:** ignore invalid dates
  ([1334b8c8](https://github.com/angular/angular.js/commit/1334b8c8326b93e0ca016c85516627900c7a9fd3),
   [#10640](https://github.com/angular/angular.js/issues/10640))
- **filterFilter:** use isArray() to determine array type
  ([a01ce6b8](https://github.com/angular/angular.js/commit/a01ce6b81c197b0a4a1057981e8e9c1b74f37587),
   [#10621](https://github.com/angular/angular.js/issues/10621))
- **ngChecked:** ensure that ngChecked doesn't interfere with ngModel
  ([e079111b](https://github.com/angular/angular.js/commit/e079111b33bf36be21c0941718b41cc9ca67bea0),
   [#10662](https://github.com/angular/angular.js/issues/10662), [#10664](https://github.com/angular/angular.js/issues/10664))
- **ngClass:** handle multi-class definitions as an element of an array
  ([e1132f53](https://github.com/angular/angular.js/commit/e1132f53b03a5a71aa9b6eded24d64e3bc83929b),
   [#8578](https://github.com/angular/angular.js/issues/8578), [#10651](https://github.com/angular/angular.js/issues/10651))
- **ngModelOptions:** allow sharing options between multiple inputs
  ([9c9c6b3f](https://github.com/angular/angular.js/commit/9c9c6b3fe4edfe78ae275c413ee3eefb81f1ebf6),
   [#10667](https://github.com/angular/angular.js/issues/10667))
- **ngOptions:**
  - support one-time binding on the option values
  ([ba90261b](https://github.com/angular/angular.js/commit/ba90261b7586b519483883800ea876510faf5c21),
   [#10687](https://github.com/angular/angular.js/issues/10687), [#10694](https://github.com/angular/angular.js/issues/10694))
  - prevent infinite digest if track by expression is stable
  ([fc21db8a](https://github.com/angular/angular.js/commit/fc21db8a15545fad53124fc941b3c911a8d57067),
   [#9464](https://github.com/angular/angular.js/issues/9464))
  - update model if selected option is removed
  ([933591d6](https://github.com/angular/angular.js/commit/933591d69cee2c5580da1d8522ba90a7d924da0e),
   [#7736](https://github.com/angular/angular.js/issues/7736))
  - ensure that the correct option is selected when options are loaded async
  ([7fda214c](https://github.com/angular/angular.js/commit/7fda214c4f65a6a06b25cf5d5aff013a364e9cef),
   [#8019](https://github.com/angular/angular.js/issues/8019), [#9714](https://github.com/angular/angular.js/issues/9714), [#10639](https://github.com/angular/angular.js/issues/10639))
- **ngPluralize:** generate a warning when using a not defined rule
  ([c66b4b6a](https://github.com/angular/angular.js/commit/c66b4b6a133f7215d50c23db516986cfc1f0a985))


## Features

- **$filter:** display Infinity symbol when number is Infinity
  ([51d67742](https://github.com/angular/angular.js/commit/51d6774286202b55ade402ca097e417e70fd546b),
   [#10421](https://github.com/angular/angular.js/issues/10421))
- **$timeout:** allow `fn` to be an optional parameter
  ([5a603023](https://github.com/angular/angular.js/commit/5a60302389162c6ef45f311c1aaa65a00d538c66),
   [#9176](https://github.com/angular/angular.js/issues/9176))
- **limitTo:** ignore limit when invalid
  ([a3c3bf33](https://github.com/angular/angular.js/commit/a3c3bf3332e5685dc319c46faef882cb6ac246e1),
   [#10510](https://github.com/angular/angular.js/issues/10510))
- **ngMock/$exceptionHandler:** log errors when rethrowing
  ([deb3cb4d](https://github.com/angular/angular.js/commit/deb3cb4daef0054457bd9fb8995829fff0e8f1e4),
   [#10540](https://github.com/angular/angular.js/issues/10540), [#10564](https://github.com/angular/angular.js/issues/10564))


## Performance Improvements

- **ngStyleDirective:** use $watchCollection
  ([8928d023](https://github.com/angular/angular.js/commit/8928d0234551a272992d0eccef73b3ad6cb8bfd1),
   [#10535](https://github.com/angular/angular.js/issues/10535))


## Breaking Changes

- **limitTo:** due to [a3c3bf33](https://github.com/angular/angular.js/commit/a3c3bf3332e5685dc319c46faef882cb6ac246e1),
  limitTo changed behavior when limit value is invalid.
Instead of returning empty object/array it returns unchanged input.


- **ngOptions:** due to [7fda214c](https://github.com/angular/angular.js/commit/7fda214c4f65a6a06b25cf5d5aff013a364e9cef),


When using `ngOptions`: the directive applies a surrogate key as the value of the `<option>` element.
This commit changes the actual string used as the surrogate key. We now store a string that is computed
by calling `hashKey` on the item in the options collection; previously it was the index or key of the
item in the collection.

(This is in keeping with the way that the unknown option value is represented in the select directive.)

Before you might have seen:

```
<select ng-model="x" ng-option="i in items">
  <option value="1">a</option>
  <option value="2">b</option>
  <option value="3">c</option>
  <option value="4">d</option>
</select>
```

Now it will be something like:

```
<select ng-model="x" ng-option="i in items">
  <option value="string:a">a</option>
  <option value="string:b">b</option>
  <option value="string:c">c</option>
  <option value="string:d">d</option>
</select>
```

If your application code relied on this value, which it shouldn't, then you will need to modify your
application to accommodate this. You may find that you can use the `track by` feature of `ngOptions`
as this provides the ability to specify the key that is stored.

- **ngOptions:** due to [7fda214c](https://github.com/angular/angular.js/commit/7fda214c4f65a6a06b25cf5d5aff013a364e9cef),

When iterating over an object's properties using the `(key, value) in obj` syntax
the order of the elements used to be sorted alphabetically. This was an artificial
attempt to create a deterministic ordering since browsers don't guarantee the order.
But in practice this is not what people want and so this change iterates over properties
in the order they are returned by Object.keys(obj), which is almost always the order
in which the properties were defined.

- **ngOptions:** due to [7fda214c](https://github.com/angular/angular.js/commit/7fda214c4f65a6a06b25cf5d5aff013a364e9cef),

setting the ngOptions attribute expression after the element is compiled, will no longer trigger the ngOptions behavior.
This worked previously because the ngOptions logic was part of the select directive, while
it is now implemented in the ngOptions directive itself.

- **select:** due to [7fda214c](https://github.com/angular/angular.js/commit/7fda214c4f65a6a06b25cf5d5aff013a364e9cef),

the `select` directive will now use strict comparison of the `ngModel` scope value against `option`
values to determine which option is selected. This means `Number` scope values will not be matched
against numeric option strings.
In Angular 1.3.x, setting `scope.x = 200` would select the `option` with the value 200 in the following `select`:

```
<select ng-model="x">
  <option value="100">100</option>
  <option value="200">200</option>
</select>
```

In Angular 1.4.x, the 'unknown option' will be selected.
To remedy this, you can simply initialize the model as a string: `scope.x = '200'`, or if you want to
keep the model as a `Number`, you can do the conversion via `$formatters` and `$parsers` on `ngModel`:

```js
ngModelCtrl.$parsers.push(function(value) {
  return parseInt(value, 10); // Convert option value to number
});

ngModelCtrl.$formatters.push(function(value) {
  return value.toString(); // Convert scope value to string
});
```

<a name="1.3.9"></a>
# 1.3.9 multidimensional-awareness (2015-01-13)


## Bug Fixes

- **$parse:** allow use of locals in assignments
  ([86900814](https://github.com/angular/angular.js/commit/869008140a96e0e9e0d9774cc2e5fdd66ada7ba9))
- **filterFilter:** use isArray() to determine array type
  ([d4b60ada](https://github.com/angular/angular.js/commit/d4b60ada1ecff5afdb3210caa44e149e9f3d4c1b),
   [#10621](https://github.com/angular/angular.js/issues/10621))


## Features

- **ngMock/$exceptionHandler:** log errors when rethrowing
  ([2b97854b](https://github.com/angular/angular.js/commit/2b97854bf4786fe8579974e2b9d6b4adee8a3dc3),
   [#10540](https://github.com/angular/angular.js/issues/10540), [#10564](https://github.com/angular/angular.js/issues/10564))


## Performance Improvements

- **ngStyleDirective:** use $watchCollection
  ([4c8d8ad5](https://github.com/angular/angular.js/commit/4c8d8ad5083d9dd17c0b8480339d5f95943f1b71),
   [#10535](https://github.com/angular/angular.js/issues/10535))




<a name="1.3.8"></a>
# 1.3.8 prophetic-narwhal (2014-12-19)


## Bug Fixes
- **filterFilter:**
  - make `$` match properties on deeper levels as well
  ([bd28c74c](https://github.com/angular/angular.js/commit/bd28c74c1d91c477a86f10fe36576cba0249e6ef),
   [#10401](https://github.com/angular/angular.js/issues/10401))
  - let expression object `{$: '...'}` also match primitive items
  ([fb2c5858](https://github.com/angular/angular.js/commit/fb2c58589758744c0eef8c2ead3dbcf27a5cf200),
   [#10428](https://github.com/angular/angular.js/issues/10428))
- **ngAria:** trigger digest on `ng-click` via keypress, pass `$event` to expression
  ([924e68c7](https://github.com/angular/angular.js/commit/924e68c7d522a1086969f3583d0ce87e59110bc5),
   [#10442](https://github.com/angular/angular.js/issues/10442), [#10443](https://github.com/angular/angular.js/issues/10443), [#10447](https://github.com/angular/angular.js/issues/10447))
- **orderBy:** compare timestamps when sorting date objects
  ([661f6d9e](https://github.com/angular/angular.js/commit/661f6d9ecf1459ce3b2794c3cde373e17ae83972),
   [#10512](https://github.com/angular/angular.js/issues/10512), [#10516](https://github.com/angular/angular.js/issues/10516))


## Performance Improvements

- **limitTo:** replace for loop with slice
  ([cd77c089](https://github.com/angular/angular.js/commit/cd77c089ba2f4b94ccc74f32f0ffa9fb70851c02))




<a name="1.3.7"></a>
# 1.3.7 leaky-obstruction (2014-12-15)


## Bug Fixes

- **$compile:** use `createMap()` for `$$observe` listeners when initialized from attr interpolation
  ([8e28bb4c](https://github.com/angular/angular.js/commit/8e28bb4c2f6d015dfe1cec7755f1ca9b0ecef1f8))
- **$http:**
  - only parse as JSON when opening/closing brackets match
  ([b9bdbe61](https://github.com/angular/angular.js/commit/b9bdbe615cc4070d2233ff06830a4c6fb1217cda),
   [#10349](https://github.com/angular/angular.js/issues/10349), [#10357](https://github.com/angular/angular.js/issues/10357))
  - don't convert FormData objects to JSON
  ([40258838](https://github.com/angular/angular.js/commit/40258838031604feecb862afdc6f1f503d80ce4a),
   [#10373](https://github.com/angular/angular.js/issues/10373))
- **$parse:** a chain of field accessors should use a single `getterFn`
  ([c90ad968](https://github.com/angular/angular.js/commit/c90ad96808be350526516626205c3a7d1da79024))
- **ngRepeat:** allow extra whitespaces in `(key,value)` part of micro-syntax
  ([ef640cbc](https://github.com/angular/angular.js/commit/ef640cbc2af5794c987e75472c12e63a59590044),
   [#6827](https://github.com/angular/angular.js/issues/6827), [#6833](https://github.com/angular/angular.js/issues/6833))
- **orderBy:** do not try to call `valueOf`/`toString` on `null`
  ([a097aa95](https://github.com/angular/angular.js/commit/a097aa95b7c78beab6d1b7d521c25f7d9d7843d9),
   [#10385](https://github.com/angular/angular.js/issues/10385), [#10386](https://github.com/angular/angular.js/issues/10386))


## Features

- **$compile:** add support for `ng-attr` with camelCased attributes
  ([d8e37078](https://github.com/angular/angular.js/commit/d8e37078600089839f82f0e84022f1087e1fd3f2),
   [#9845](https://github.com/angular/angular.js/issues/9845), [#10194](https://github.com/angular/angular.js/issues/10194))
- **$http:** pass response status code to data transform functions
  ([1b740974](https://github.com/angular/angular.js/commit/1b740974f5eb373bed04071d51f908ced7c5a8e5),
   [#10324](https://github.com/angular/angular.js/issues/10324), [#6734](https://github.com/angular/angular.js/issues/6734), [#10440](https://github.com/angular/angular.js/issues/10440))
- **$rootScope:** allow passing `locals` argument to `$evalAsync`
  ([9b96cea4](https://github.com/angular/angular.js/commit/9b96cea462676d123e1b2dd852aedbe3da8fa4a0),
   [#10390](https://github.com/angular/angular.js/issues/10390))


## Performance Improvements

- **$compile:** only re-`$interpolate` attribute values at link time if changed since compile
  ([9ae0c01c](https://github.com/angular/angular.js/commit/9ae0c01c2bcaff2f3906eec574f9c6ed8abde14a))


## Breaking Changes

- **orderBy:** due to [a097aa95](https://github.com/angular/angular.js/commit/a097aa95b7c78beab6d1b7d521c25f7d9d7843d9),

Previously, if either value being compared in the orderBy comparator was null or undefined, the
order would, incorrectly, not change. Now, this order behaves more like Array.prototype.sort, which
by default pushes `null` behind objects, due to `n` occurring after `[` (the first characters of their
stringified forms) in ASCII / Unicode. If `toString` is customized, or does not exist, the
behavior is undefined.



<a name="1.2.28"></a>
# 1.2.28 finnish-disembarkation (2014-12-15)


## Bug Fixes

- **$route:** fix redirection with optional/eager params
  ([1b9e408d](https://github.com/angular/angular.js/commit/1b9e408ddbe48a6d3db27f501515d6efad01f42d),
   [#9742](https://github.com/angular/angular.js/issues/9742), [#10202](https://github.com/angular/angular.js/issues/10202))
- **linky:** encode double quotes when serializing email addresses
  ([929dd15b](https://github.com/angular/angular.js/commit/929dd15b9b65034350f18abe6c56a8d956f4b978),
   [#8945](https://github.com/angular/angular.js/issues/8945), [#8964](https://github.com/angular/angular.js/issues/8964), [#5946](https://github.com/angular/angular.js/issues/5946), [#10090](https://github.com/angular/angular.js/issues/10090), [#9256](https://github.com/angular/angular.js/issues/9256))



<a name="1.3.6"></a>
# 1.3.6 robofunky-danceblaster (2014-12-08)


## Bug Fixes

- **$browser:** prevent infinite digests when clearing the hash of a url
  ([10ac5948](https://github.com/angular/angular.js/commit/10ac5948097e2c8eaead238603d29ee580dc8273),
   [#9629](https://github.com/angular/angular.js/issues/9629), [#9635](https://github.com/angular/angular.js/issues/9635), [#10228](https://github.com/angular/angular.js/issues/10228), [#10308](https://github.com/angular/angular.js/issues/10308))
- **$http:** preserve config object when resolving from cache
  ([facfec98](https://github.com/angular/angular.js/commit/facfec98412c0bb8678d578bade05ffef06a9e84),
   [#9004](https://github.com/angular/angular.js/issues/9004), [#9030](https://github.com/angular/angular.js/issues/9030))
- **$location:**
  - allow hash fragments with hashPrefix in hash-bang location urls
  ([2dc34a96](https://github.com/angular/angular.js/commit/2dc34a969956eea680be4c8d9f800556d110996a),
   [#9629](https://github.com/angular/angular.js/issues/9629), [#9635](https://github.com/angular/angular.js/issues/9635), [#10228](https://github.com/angular/angular.js/issues/10228), [#10308](https://github.com/angular/angular.js/issues/10308))
  - strip off empty hash segments when comparing
  ([e93710fe](https://github.com/angular/angular.js/commit/e93710fe0e4fb05ceee59a04f290692a5bec5d20),
   [#9635](https://github.com/angular/angular.js/issues/9635))
- **$parse:**
  - fix operators associativity
  ([ed1243ff](https://github.com/angular/angular.js/commit/ed1243ffc7c2cb4bd5b4dece597597db8eb08e34))
  - follow JavaScript context for unbound functions
  ([429938da](https://github.com/angular/angular.js/commit/429938da1f45b8a649b8c77762fb0ae59b6d0cea))
- **filterFilter:**
  - don't match primitive sub-expressions against any prop
  ([a75537d4](https://github.com/angular/angular.js/commit/a75537d461c92e3455e372ff5005bf0cad2d2e95))
  - ignore function properties and account for inherited properties
  ([5ced914c](https://github.com/angular/angular.js/commit/5ced914cc8625008e6249d5ac5942d5822287cc0),
   [#9984](https://github.com/angular/angular.js/issues/9984))
  - correctly handle deep expression objects
  ([f7cf8460](https://github.com/angular/angular.js/commit/f7cf846045b1e2fb39c62e304c61b44d5c805e31),
   [#7323](https://github.com/angular/angular.js/issues/7323), [#9698](https://github.com/angular/angular.js/issues/9698), [#9757](https://github.com/angular/angular.js/issues/9757))
- **inputs:** ignoring input events in IE caused by placeholder changes or focus/blur on inputs with placeholders
  ([55d9db56](https://github.com/angular/angular.js/commit/55d9db56a6f7d29b16f8393612648080c6d535d6),
   [#9265](https://github.com/angular/angular.js/issues/9265))
- **linky:** make urls starting with www. links, like markdown
  ([915a891a](https://github.com/angular/angular.js/commit/915a891ad4cdcaa5e47e976db8f4d402d230be77),
   [#10290](https://github.com/angular/angular.js/issues/10290))
- **ngAnimate:** do not use jQuery class API
  ([40a537c2](https://github.com/angular/angular.js/commit/40a537c25f70ad556a41bb2d00ea3e257410e9af),
   [#10024](https://github.com/angular/angular.js/issues/10024), [#10329](https://github.com/angular/angular.js/issues/10329))
- **ngMock:** allow numeric timeouts in $httpBackend mock
  ([acb066e8](https://github.com/angular/angular.js/commit/acb066e84a10483e1025eed295352b66747dbb8a),
   [#4891](https://github.com/angular/angular.js/issues/4891))
- **ngModel:**
  - always use the most recent viewValue for validation
  ([2d6a0a1d](https://github.com/angular/angular.js/commit/2d6a0a1dc1e7125cab2e30244e35e97e11802843),
   [#10126](https://github.com/angular/angular.js/issues/10126), [#10299](https://github.com/angular/angular.js/issues/10299))
  - fixing many keys incorrectly marking inputs as dirty
  ([d21dff21](https://github.com/angular/angular.js/commit/d21dff21ed8beb015ad911f11d57cceb56fc439f))
- **ngSanitize:** exclude smart quotes at the end of the link
  ([7c6be43e](https://github.com/angular/angular.js/commit/7c6be43e83590798cffef63d076fb79d5296fba2),
   [#7307](https://github.com/angular/angular.js/issues/7307))
- **numberFilter:** numbers rounding to zero shouldn't be negative
  ([96c61fe7](https://github.com/angular/angular.js/commit/96c61fe756d7d3db011818bf0925e3d86ffff8ce),
   [#10278](https://github.com/angular/angular.js/issues/10278))
- **orderBy:**
  - make object-to-primtiive behavior work for objects with null prototype
  ([3aa57528](https://github.com/angular/angular.js/commit/3aa5752894419b4638d5c934879258fa6a1c0d07))
  - maintain order in array of objects when predicate is not provided
  ([8bfeddb5](https://github.com/angular/angular.js/commit/8bfeddb5d671017f4a21b8b46334ac816710b143),
   [#9566](https://github.com/angular/angular.js/issues/9566), [#9747](https://github.com/angular/angular.js/issues/9747), [#10311](https://github.com/angular/angular.js/issues/10311))


## Features

- **$$jqLite:** export jqLite as a private service
  ([f2e7f875](https://github.com/angular/angular.js/commit/f2e7f875e2ad4b271c4e72ebd3860f905132eed9))
- **$injector:** print caller name in "unknown provider" errors (when available)
  ([013b522c](https://github.com/angular/angular.js/commit/013b522c9e690665aecb0e0f656e4557a673ec09),
   [#8135](https://github.com/angular/angular.js/issues/8135), [#9721](https://github.com/angular/angular.js/issues/9721))
- **jsonFilter:** add optional arg to define custom indentation
  ([1191edba](https://github.com/angular/angular.js/commit/1191edba4eaa15f675fa4ed047949a150843971b),
   [#9771](https://github.com/angular/angular.js/issues/9771))
- **ngAria:** bind keypress on ng-click w/ option
  ([5481e2cf](https://github.com/angular/angular.js/commit/5481e2cfcd4d136a1c7f45cd4ce0fa1a8a15074d),
   [#10288](https://github.com/angular/angular.js/issues/10288))


## Breaking Changes

- **$location:** due to [2dc34a96](https://github.com/angular/angular.js/commit/2dc34a969956eea680be4c8d9f800556d110996a),


We no longer throw an `ihshprfx` error if the URL after the base path
contains only a hash fragment.  Previously, if the base URL was `http://abc.com/base/`
and the hashPrefix is `!` then trying to parse `http://abc.com/base/#some-fragment`
would have thrown an error. Now we simply assume it is a normal fragment and
that the path is empty, resulting `$location.absUrl() === "http://abc.com/base/#!/#some-fragment"`.

This should not break any applications, but you can no longer rely on receiving the
`ihshprfx` error for paths that have the syntax above. It is actually more similar
to what currently happens for invalid extra paths anyway:  If the base URL
and hashPrfix are set up as above, then `http://abc.com/base/other/path` does not
throw an error but just ignores the extra path: `http://abc.com/base`.


- **filterFilter:** due to [a75537d4](https://github.com/angular/angular.js/commit/a75537d461c92e3455e372ff5005bf0cad2d2e95),

  Named properties in the expression object will only match against properties on the **same level**.
  Previously, named string properties would match against properties on the same level **or deeper**.

    Before:

    ```js
    arr = filterFilter([{level1: {level2: 'test'}}], {level1: 'test'});   // arr.length -> 1
    ```

    After:

    ```js
    arr = filterFilter([{level1: {level2: 'test'}}], {level1: 'test'});   // arr.length -> 0
    ```

    In order to match deeper nested properties, you have to either match the depth level of the
    property or use the special `$` key (which still matches properties on the same level
    **or deeper**). E.g.:

    ```js
    // Both examples below have `arr.length === 1`
    arr = filterFilter([{level1: {level2: 'test'}}], {level1: {level2: 'test'}});
    arr = filterFilter([{level1: {level2: 'test'}}], {$: 'test'});
    ```


<a name="1.3.5"></a>
# 1.3.5 cybernetic-mercantilism (2014-12-01)


## Bug Fixes

- **$templateRequest:** propagate rejection reason when ignoreRequestError flag is set
  ([f6458826](https://github.com/angular/angular.js/commit/f6458826ac974914597a10b0ffdeee3c5d2c62ef),
   [#10266](https://github.com/angular/angular.js/issues/10266))
- **$httpBackend:** allow canceling request with falsy timeoutId
  ([719d5c5f](https://github.com/angular/angular.js/commit/719d5c5fa59ae1617691a0dca02da861fcf5f933),
   [#10177](https://github.com/angular/angular.js/issues/10177))
- **linky:** encode all double quotes when serializing email addresses
  ([2ec8d1ff](https://github.com/angular/angular.js/commit/2ec8d1ffc04e06a39cb1b74a8d675da38e0a1c6b),
   [#10090](https://github.com/angular/angular.js/issues/10090))
- **ngMock:**
  - annotate $RootScopeDecorator
  ([9a83f9d2](https://github.com/angular/angular.js/commit/9a83f9d2fabe0a259c283b7f7cd935e4b36e2b5d),
   [#10273](https://github.com/angular/angular.js/issues/10273), [#10275](https://github.com/angular/angular.js/issues/10275), [#10277](https://github.com/angular/angular.js/issues/10277))
  - respond did not always take a statusText argument
  ([08cd5c19](https://github.com/angular/angular.js/commit/08cd5c19c7a5116e7e74691391fc5e28bfae4521),
   [#8270](https://github.com/angular/angular.js/issues/8270))
- **select:**
  - use strict compare when removing option from ctrl
  ([9fa73cb4](https://github.com/angular/angular.js/commit/9fa73cb4e7190b4d00b65f2f8f9f7d37607308ba),
   [#9714](https://github.com/angular/angular.js/issues/9714), [#10115](https://github.com/angular/angular.js/issues/10115), [#10203](https://github.com/angular/angular.js/issues/10203))
  - fix several issues when moving options between groups
  ([30694c80](https://github.com/angular/angular.js/commit/30694c802763d46d6787f7298f47dfef53ed4229),
   [#10166](https://github.com/angular/angular.js/issues/10166))


<a name="1.3.4"></a>
# 1.3.4 highfalutin-petroglyph (2014-11-24)

## Bug Fixes

- **$browser:** allow chaining url() calls in setter mode
  ([764fa869](https://github.com/angular/angular.js/commit/764fa869dd8809d494924c23f30ddaa4cac84249),
   [#10157](https://github.com/angular/angular.js/issues/10157))
- **$http:** return empty headers, ignore properties in Object prototype
  ([637c020f](https://github.com/angular/angular.js/commit/637c020f828a7ceeaacf83bb1a54ed3092e6c273),
   [#7779](https://github.com/angular/angular.js/issues/7779), [#10113](https://github.com/angular/angular.js/issues/10113), [#10091](https://github.com/angular/angular.js/issues/10091))
- **$locale:** Allow currency filter to fall back to maxFrac from locale
  ([6dbd606a](https://github.com/angular/angular.js/commit/6dbd606ad7b708d5886c0e7ffee20ae8f8719711),
   [#10179](https://github.com/angular/angular.js/issues/10179))
- **$location:** allow empty string URLs to reset path, search, and hash
  ([7812dfce](https://github.com/angular/angular.js/commit/7812dfcee8ab98cbf38261f9948d9541656bf554),
   [#10063](https://github.com/angular/angular.js/issues/10063), [#10064](https://github.com/angular/angular.js/issues/10064))
- **$route:** fix redirection with optional/eager params
  ([891acf4c](https://github.com/angular/angular.js/commit/891acf4c201823fd2c925ee321c70d06737d5944),
   [#9819](https://github.com/angular/angular.js/issues/9819), [#9827](https://github.com/angular/angular.js/issues/9827))
- **Angular:** properly get node name for svg element wrapper
  ([09a98323](https://github.com/angular/angular.js/commit/09a9832358960c98392c9df1a9fd9592f59bc844),
   [#10078](https://github.com/angular/angular.js/issues/10078), [#10172](https://github.com/angular/angular.js/issues/10172))
- **NgModelController:** typo $rawModelValue -> $$rawModelValue
  ([4f4ff5f3](https://github.com/angular/angular.js/commit/4f4ff5f31b82c6f7be409ea4edbad4c2913ac1f1))
- **input:**
  - set ngTrueValue on required checkbox
  ([8692f87a](https://github.com/angular/angular.js/commit/8692f87a4689fa0dd3640f4dcab5c6b6f960489b),
   [#5164](https://github.com/angular/angular.js/issues/5164))
  - call $setTouched in blur asynchronously if necessary
  ([eab27187](https://github.com/angular/angular.js/commit/eab271876cb87c1f5f6c6f29e814fb8fecad87ff),
   [#8762](https://github.com/angular/angular.js/issues/8762), [#9808](https://github.com/angular/angular.js/issues/9808), [#10014](https://github.com/angular/angular.js/issues/10014))
- **input[date]:** do not use `$isEmpty` to check the model validity
  ([40406e2f](https://github.com/angular/angular.js/commit/40406e2f22713efbd37ef3eff408339727cb62d9))
- **linky:** encode double quotes when serializing email addresses
  ([8ee8ffeb](https://github.com/angular/angular.js/commit/8ee8ffeba0a5a133fa792745c1019d294ecfcef3),
   [#8945](https://github.com/angular/angular.js/issues/8945), [#8964](https://github.com/angular/angular.js/issues/8964), [#5946](https://github.com/angular/angular.js/issues/5946), [#10090](https://github.com/angular/angular.js/issues/10090), [#9256](https://github.com/angular/angular.js/issues/9256))
- **ngMaxlength:** ignore maxlength when not set to a non-negative integer
  ([92f87b11](https://github.com/angular/angular.js/commit/92f87b114242b01876e1dc5c6fddd061352ecb2c),
   [#9874](https://github.com/angular/angular.js/issues/9874))
- **ngModel:** don't run parsers when executing $validate
  ([e3764e30](https://github.com/angular/angular.js/commit/e3764e30a301ec6136c8e6b5493d39feb3cd1ecc))
- **ngModelOptions:** preserve context of getter/setters
  ([bb4d3b73](https://github.com/angular/angular.js/commit/bb4d3b73a1ccf3dee55b0c25baf031bae5cbb676),
   [#9394](https://github.com/angular/angular.js/issues/9394), [#9865](https://github.com/angular/angular.js/issues/9865))


## Features

- **ngMaxlength:** add support for disabling max length limit
  ([5c1fdff6](https://github.com/angular/angular.js/commit/5c1fdff691b9367d73f72f6a0298cb6a6e259f35),
   [#9995](https://github.com/angular/angular.js/issues/9995))
- **ngModelController:** add $setDirty method
  ([e8941c0f](https://github.com/angular/angular.js/commit/e8941c0fe5217d2e705bad8253dc0162aff4c709),
   [#10038](https://github.com/angular/angular.js/issues/10038), [#10049](https://github.com/angular/angular.js/issues/10049))
- **ngPluralize:** add support for `count` to be a one-time expression
  ([2b41a586](https://github.com/angular/angular.js/commit/2b41a5868aee79e3872ad92db66e30959207d98e),
   [#10004](https://github.com/angular/angular.js/issues/10004))


## Performance Improvements

- use Object.create instead of creating temporary constructors
  ([bf6a79c3](https://github.com/angular/angular.js/commit/bf6a79c3484f474c300b5442ae73483030ef5782),
   [#10058](https://github.com/angular/angular.js/issues/10058))


## Breaking Changes

- **ngModelOptions:** due to [bb4d3b73](https://github.com/angular/angular.js/commit/bb4d3b73a1ccf3dee55b0c25baf031bae5cbb676),
  previously, ngModel invoked getter/setters in the global context.

For example:

```js
<input ng-model="model.value" ng-model-options="{ getterSetter: true }">
```

would previously invoke `model.value()` in the global context.

Now, ngModel invokes `value` with `model` as the context.

It's unlikely that real apps relied on this behavior. If they did they can use `.bind` to explicitly
bind a getter/getter to the global context, or just reference globals normally without `this`.


<a name="1.2.27"></a>
# 1.2.27 prime-factorization (2014-11-20)


## Bug Fixes

- **$animate:** clear the GCS cache even when no animation is detected
  ([f619d032](https://github.com/angular/angular.js/commit/f619d032c932752313c646b5295bad8a68ef3871),
   [#8813](https://github.com/angular/angular.js/issues/8813))
- **$browser:**
  - Cache `location.href` only during page reload phase
  ([434d7a09](https://github.com/angular/angular.js/commit/434d7a09039151c1e627ac156213905d06b7df10),
   [#9235](https://github.com/angular/angular.js/issues/9235), [#9470](https://github.com/angular/angular.js/issues/9470))
  - don’t use history api when only the hash changes
  ([a6e6438d](https://github.com/angular/angular.js/commit/a6e6438dae1ed92b29608d0b8830b0a7fbb624ef),
   [#9423](https://github.com/angular/angular.js/issues/9423), [#9424](https://github.com/angular/angular.js/issues/9424))
  - handle async href on url change in <=IE9
  ([fe7d9ded](https://github.com/angular/angular.js/commit/fe7d9dedaa5ec3b3f56d9eb9c513cf99e40121ce),
   [#9235](https://github.com/angular/angular.js/issues/9235))
- **$http:** add missing shortcut methods and missing docs
  ([ec4fe1bc](https://github.com/angular/angular.js/commit/ec4fe1bcab6f981103a10f860a3a00122aa78607),
   [#9180](https://github.com/angular/angular.js/issues/9180), [#9321](https://github.com/angular/angular.js/issues/9321))
- **$location:**
  - revert erroneous logic and backport refactorings from master
  ([1ee9b4ef](https://github.com/angular/angular.js/commit/1ee9b4ef5e4a795061d3aa19adefdeb7e0209eeb),
   [#8492](https://github.com/angular/angular.js/issues/8492))
  - allow 0 in path() and hash()
  ([f807d7ab](https://github.com/angular/angular.js/commit/f807d7ab4ebd18899154528ea9ed50d5bc25c57a))
- **$parse:** add quick check for Function constructor in fast path
  ([756640f5](https://github.com/angular/angular.js/commit/756640f5aa8f3fd0084bff50534e23976a6fff00))
- **$parse, events:** prevent accidental misuse of properties on $event
  ([4d0614fd](https://github.com/angular/angular.js/commit/4d0614fd0da12c5783dfb4956c330edac87e62fe),
   [#9969](https://github.com/angular/angular.js/issues/9969))
- **ngMock:** $httpBackend should match data containing Date objects correctly
  ([1426b029](https://github.com/angular/angular.js/commit/1426b02980badfd322eb960d71bfb1a14d657847),
   [#5127](https://github.com/angular/angular.js/issues/5127))
- **orderBy:** sort by identity if no predicate is given
  ([45b896a1](https://github.com/angular/angular.js/commit/45b896a16abbcbfcdfb9a95c2d10c76a805b57cc),
   [#5847](https://github.com/angular/angular.js/issues/5847), [#4579](https://github.com/angular/angular.js/issues/4579), [#9403](https://github.com/angular/angular.js/issues/9403))
- **select:** ensure the label attribute is updated in Internet Explorer
  ([16833d0f](https://github.com/angular/angular.js/commit/16833d0fb6585117e9978d1accc3ade83e22e797),
   [#9621](https://github.com/angular/angular.js/issues/9621), [#10042](https://github.com/angular/angular.js/issues/10042))


## Performance Improvements

- **orderBy:** copy array with slice instead of for loop
  ([409bcb38](https://github.com/angular/angular.js/commit/409bcb3810a1622178268f7ff7f4130887a1a3dc),
   [#9942](https://github.com/angular/angular.js/issues/9942))


<a name="1.3.3"></a>
# 1.3.3 undersea-arithmetic (2014-11-17)


## Bug Fixes

- **$http:** don't parse single space responses as JSON
  ([6f19a6fd](https://github.com/angular/angular.js/commit/6f19a6fd33ab72d3908e3418fba47ee8e1598fa6),
   [#9907](https://github.com/angular/angular.js/issues/9907))
- **minErr:** stringify non-JSON compatible objects in error messages
  ([cf43ccdf](https://github.com/angular/angular.js/commit/cf43ccdf9b8665a2fd5d6aa52f80cb2d7c9bb7e2),
   [#10085](https://github.com/angular/angular.js/issues/10085))
- **$rootScope:** handle cyclic references in scopes when creating error messages
  ([e80053d9](https://github.com/angular/angular.js/commit/e80053d91fd7c722e092a23d326384de2e552eb6),
   [#10085](https://github.com/angular/angular.js/issues/10085))
- **ngRepeat:** support cyclic object references in error messages
  ([fa12c3c8](https://github.com/angular/angular.js/commit/fa12c3c86af7965d1b9d9a5dd3434755e9e04635),
   [#9838](https://github.com/angular/angular.js/issues/9838), [#10065](https://github.com/angular/angular.js/issues/10065), [#10085](https://github.com/angular/angular.js/issues/10085))
- **ngMock:** call $interval callbacks even when invokeApply is false
  ([d81ff888](https://github.com/angular/angular.js/commit/d81ff8885b77f70c6417d7be3124d86d07447375),
   [#10032](https://github.com/angular/angular.js/issues/10032))
- **ngPattern:** match behavior of native HTML pattern attribute
  ([85eb9660](https://github.com/angular/angular.js/commit/85eb9660ef67c24d5104a6a1921bedad0bd1b57e),
   [#9881](https://github.com/angular/angular.js/issues/9881), [#9888](https://github.com/angular/angular.js/issues/9888))
- **select:** ensure the label attribute is updated in Internet Explorer
  ([6604c236](https://github.com/angular/angular.js/commit/6604c2361427fba8c43a39dc2e92197390dfbdbe),
   [#9621](https://github.com/angular/angular.js/issues/9621), [#10042](https://github.com/angular/angular.js/issues/10042))


## Features

- **$location:** allow to location to be changed during $locationChangeStart
  ([a9352c19](https://github.com/angular/angular.js/commit/a9352c19ce33f0393d6581547c7ea8dfc2a8b78f),
   [#9607](https://github.com/angular/angular.js/issues/9607), [#9678](https://github.com/angular/angular.js/issues/9678))
- **$routeProvider:** allow setting caseInsensitiveMatch on the provider
  ([0db573b7](https://github.com/angular/angular.js/commit/0db573b7493f76abd94ff65ce660017d617e865b),
   [#6477](https://github.com/angular/angular.js/issues/6477), [#9873](https://github.com/angular/angular.js/issues/9873))


## Performance Improvements

- **orderBy:** copy array with slice instead of for loop
  ([8eabc546](https://github.com/angular/angular.js/commit/8eabc5463c795d87f37e5a9eacbbb14435024061),
   [#9942](https://github.com/angular/angular.js/issues/9942))

## Breaking Changes

- **$parse:** due to [fbad2805](https://github.com/angular/angular.js/commit/fbad2805703569058a4a860747b0e2d8aee36bdf),
    you can't use characters that have special meaning in AngularJS expressions (ex.: `.` or `-`)
    as part of filter's name. Before this commit custom filters could contain special characters
    (like a dot) in their name but this wasn't intentional.

<a name="1.3.2"></a>
# 1.3.2 cardiovasculatory-magnification (2014-11-07)


## Bug Fixes

- **$compile:** do not rebind parent bound transclude functions
  ([841c0907](https://github.com/angular/angular.js/commit/841c0907556f525dbc4223609d808319fe0dd7e2),
   [#9413](https://github.com/angular/angular.js/issues/9413))
- **$parse:**
  - stateful interceptors override an `undefined` expression
  ([ed99821e](https://github.com/angular/angular.js/commit/ed99821e4dc621864f7e2d9a6b5305fca27fb7fa),
   [#9821](https://github.com/angular/angular.js/issues/9821), [#9825](https://github.com/angular/angular.js/issues/9825))
  - add quick check for Function constructor in fast path
  ([e676d642](https://github.com/angular/angular.js/commit/e676d642f5feb8d3ba88944634afb479ba525c36))
- **$parse, events:** prevent accidental misuse of properties on $event
  ([e057a9aa](https://github.com/angular/angular.js/commit/e057a9aa398ead209bd6bbf76e22d2d5562904fb))
- **ngRoute:** allow proto inherited properties in route params object
  ([b4770582](https://github.com/angular/angular.js/commit/b4770582f84f26c8ff7f2320a36a6b0ceff6e6cc),
   [#8181](https://github.com/angular/angular.js/issues/8181), [#9731](https://github.com/angular/angular.js/issues/9731))
- **select:** use strict comparison for isSelected with selectAs
  ([9e305948](https://github.com/angular/angular.js/commit/9e305948e4965fb86b0c79985dc6e8c59a9c66af),
   [#9639](https://github.com/angular/angular.js/issues/9639), [#9949](https://github.com/angular/angular.js/issues/9949))


## Features

- **ngAria:** announce ngMessages with aria-live
  ([187e4318](https://github.com/angular/angular.js/commit/187e43185dfb1bce6a318d95958c73cfb789d33c),
   [#9834](https://github.com/angular/angular.js/issues/9834))
- **ngMock:** decorator that adds Scope#$countChildScopes and Scope#$countWatchers
  ([74981c9f](https://github.com/angular/angular.js/commit/74981c9f208b3617cbf00beafd61138d25c5d546),
   [#9926](https://github.com/angular/angular.js/issues/9926), [#9871](https://github.com/angular/angular.js/issues/9871))


##  Security Note

This release also contains security fixes for expression sandbox bypasses.

These issues affect only applications with known server-side XSS holes that are also using [CSP](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) to secure their client-side code. If your application falls into this rare category, we recommend updating your version of Angular.

We'd like to thank security researches [Sebastian Lekies](https://twitter.com/sebastianlekies), [Jann Horn](http://thejh.net/), and [Gábor Molnár](https://twitter.com/molnar_g) for reporting these issues to us.

We also added a documentation page focused on security, which contains some of the best practices, DOs and DON'Ts. Please check out [https://docs.angularjs.org/guide/security](https://docs.angularjs.org/guide/security).



<a name="1.3.1"></a>
# 1.3.1 spectral-lobster (2014-10-31)


## Bug Fixes

- **$compile:** returning null when an optional controller is not found
  ([2cd5b4ec](https://github.com/angular/angular.js/commit/2cd5b4ec4409a818ccd33a6fbdeb99a3443a1809),
   [#9404](https://github.com/angular/angular.js/issues/9404), [#9392](https://github.com/angular/angular.js/issues/9392))
- **$observe:** check if the attribute is undefined
  ([531a8de7](https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11),
   [#9707](https://github.com/angular/angular.js/issues/9707), [#9720](https://github.com/angular/angular.js/issues/9720))
- **$parse:** support dirty-checking objects with null prototype
  ([28661d1a](https://github.com/angular/angular.js/commit/28661d1a8cc3a8454bad7ae531e027b1256476c9),
   [#9568](https://github.com/angular/angular.js/issues/9568))
- **$sce:** use msie instead of $document[0].documentMode
  ([45252c3a](https://github.com/angular/angular.js/commit/45252c3a545336a0bac93be6ee28cde6afaa3cb4),
   [#9661](https://github.com/angular/angular.js/issues/9661))
- **$templateRequest:** ignore JSON Content-Type header and content
  ([1bd473eb](https://github.com/angular/angular.js/commit/1bd473eb4587900086e0b6b308dcf1dcfe9760d9),
   [#5756](https://github.com/angular/angular.js/issues/5756), [#9619](https://github.com/angular/angular.js/issues/9619))
- **i18n:** rename datetimeSymbols to be camelCase
  ([94f5a285](https://github.com/angular/angular.js/commit/94f5a285bfcf04d800afc462a7a37a3469d77f1a))
- **loader:** fix double spaces
  ([8b2f1a47](https://github.com/angular/angular.js/commit/8b2f1a47b584ceb98689f48538a2af73cd65dfd8),
   [#9630](https://github.com/angular/angular.js/issues/9630))
- **ngMock:** $httpBackend should match data containing Date objects correctly
  ([1025f6eb](https://github.com/angular/angular.js/commit/1025f6ebf4e5933a12920889be00cd8ac8a106fa),
   [#5127](https://github.com/angular/angular.js/issues/5127))
- **ngSanitize:** attribute name: xmlns:href -> xlink:href
  ([4cccf0f2](https://github.com/angular/angular.js/commit/4cccf0f2a89b002d63cb443e1e7b15f76dcef425),
   [#9769](https://github.com/angular/angular.js/issues/9769))
- **select:** assign result of track exp to element value
  ([4b4098bf](https://github.com/angular/angular.js/commit/4b4098bfcae64f69c70a22393de1f3d9a0d3dc46),
   [#9718](https://github.com/angular/angular.js/issues/9718), [#9592](https://github.com/angular/angular.js/issues/9592))
- **templateRequest:** allow empty html template
  ([52ceec22](https://github.com/angular/angular.js/commit/52ceec2229dc132b76da4e022c91474344f2d906),
   [#9581](https://github.com/angular/angular.js/issues/9581))
- **testability:** escape regex chars in `findBindings` if using `exactMatch`
  ([02aa4f4b](https://github.com/angular/angular.js/commit/02aa4f4b85ee15922a1f2de8ba78f562c18518d0),
   [#9595](https://github.com/angular/angular.js/issues/9595), [#9600](https://github.com/angular/angular.js/issues/9600))


## Features

- **$compile:** allow $watchCollection to be used in bi-directional bindings
  ([40bbc981](https://github.com/angular/angular.js/commit/40bbc9817845bf75581daee5d0ec30980affb0f5),
   [#9725](https://github.com/angular/angular.js/issues/9725))
- **ngSanitize:** accept SVG elements and attributes
  ([a54b25d7](https://github.com/angular/angular.js/commit/a54b25d77999a85701dfc5396fef78e586a99667),
   [#9578](https://github.com/angular/angular.js/issues/9578), [#9751](https://github.com/angular/angular.js/issues/9751))


## Breaking Changes

- **$observe:** Due to [531a8de7](https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11),
observers no longer register on undefined attributes. For example, if you were using `$observe` on
an absent optional attribute to set a default value, the following would not work anymore:

```html
<my-dir></my-dir>
```

```js
// link function for directive myDir
link: function(scope, element, attr) {
  attr.$observe('myAttr', function(newVal) {
    scope.myValue = newVal ? newVal : 'myDefaultValue';
  })
}
```

Instead, check if the attribute is set before registering the observer:

```js
link: function(scope, element, attr) {
  if (attr.myAttr) {
    // register the observer
  } else {
    // set the default
  }
}
```

<a name="1.3.0"></a>
# 1.3.0 superluminal-nudge (2014-10-13)


## Bug Fixes

- **$browser:**
  - account for IE deserializing history.state on each read
  ([1efaf3dc](https://github.com/angular/angular.js/commit/1efaf3dc136f822703a9cda55afac7895a923ccb),
   [#9587](https://github.com/angular/angular.js/issues/9587), [#9545](https://github.com/angular/angular.js/issues/9545))
  - do not decode cookies that do not appear encoded
  ([9c995905](https://github.com/angular/angular.js/commit/9c9959059eb84f0f1d748b70b50ec47b7d23d065),
   [#9211](https://github.com/angular/angular.js/issues/9211), [#9225](https://github.com/angular/angular.js/issues/9225))
- **$http:**
  - allow empty json response
  ([9ba24c54](https://github.com/angular/angular.js/commit/9ba24c54d60e643b1450cc5cfa8f990bd524c130),
   [#9532](https://github.com/angular/angular.js/issues/9532), [#9562](https://github.com/angular/angular.js/issues/9562))
  - don't run transformData on HEAD methods
  ([6e4955a3](https://github.com/angular/angular.js/commit/6e4955a3086555d8ca30c29955faa213b39c6f27),
   [#9528](https://github.com/angular/angular.js/issues/9528), [#9529](https://github.com/angular/angular.js/issues/9529))
- **$injector:** ensure $get method invoked with provider context
  ([372fa699](https://github.com/angular/angular.js/commit/372fa6993b2b1b4848aa4be3c3e11f69244fca6f),
   [#9511](https://github.com/angular/angular.js/issues/9511), [#9512](https://github.com/angular/angular.js/issues/9512))
- **$location:** use clone of passed search() object
  ([c7a9009e](https://github.com/angular/angular.js/commit/c7a9009e143299f0e45a85d715ff22fc676d3f93),
   [#9445](https://github.com/angular/angular.js/issues/9445))
- **$parse:** stabilize one-time literal expressions correctly
  ([874cac82](https://github.com/angular/angular.js/commit/874cac825bf29a936cb1b35f9af239687bc5e036))
- **formController:** remove scope reference when form is destroyed
  ([01f50e1a](https://github.com/angular/angular.js/commit/01f50e1a7b2bff7070616494774ec493f8133204),
   [#9315](https://github.com/angular/angular.js/issues/9315))
- **jqLite:** remove native listener when all jqLite listeners were deregistered
  ([d71fb6f2](https://github.com/angular/angular.js/commit/d71fb6f2713f1a636f6e9c25479870ee9941ad18),
   [#9509](https://github.com/angular/angular.js/issues/9509))
- **select:**
  - add basic track by and select as support
  ([addfff3c](https://github.com/angular/angular.js/commit/addfff3c46311f59bdcd100351260006d457316f),
   [#6564](https://github.com/angular/angular.js/issues/6564))
  - manage select controller options correctly
  ([2435e2b8](https://github.com/angular/angular.js/commit/2435e2b8f84fde9495b8e9440a2b4f865b1ff541),
   [#9418](https://github.com/angular/angular.js/issues/9418))


## Features

- **$anchorScroll:** support a configurable vertical scroll offset
  ([09c39d2c](https://github.com/angular/angular.js/commit/09c39d2ce687cdf0ac35dbb34a91f0d198c9d83a),
   [#9368](https://github.com/angular/angular.js/issues/9368), [#2070](https://github.com/angular/angular.js/issues/2070), [#9360](https://github.com/angular/angular.js/issues/9360))
- **$animate:**
  - introduce the $animate.animate() method
  ([02be700b](https://github.com/angular/angular.js/commit/02be700bda191b454de393f2805916f374a1d764))
  - allow $animate to pass custom styles into animations
  ([e5f4d7b1](https://github.com/angular/angular.js/commit/e5f4d7b10ae5e6a17ab349995451c33b7d294245))
- **currencyFilter:** add fractionSize as optional parameter
  ([20685ffe](https://github.com/angular/angular.js/commit/20685ffe11036d4d604d13f0d792ca46497af4a1),
   [#3642](https://github.com/angular/angular.js/issues/3642), [#3461](https://github.com/angular/angular.js/issues/3461), [#3642](https://github.com/angular/angular.js/issues/3642), [#7922](https://github.com/angular/angular.js/issues/7922))
- **jqLite:** add private jqLiteDocumentLoaded function
  ([0dd316ef](https://github.com/angular/angular.js/commit/0dd316efea209e5e5de3e456b4e6562f011a1294))


## Breaking Changes

- **$animate:** due to [e5f4d7b1](https://github.com/angular/angular.js/commit/e5f4d7b10ae5e6a17ab349995451c33b7d294245),
  staggering animations that use transitions will now
always block the transition from starting (via `transition: 0s none`)
up until the stagger step kicks in. The former behavior was that the
block was removed as soon as the pending class was added. This fix
allows for styles to be applied in the pending class without causing
an animation to trigger prematurely.



<a name="1.3.0-rc.5"></a>
# 1.3.0-rc.5 impossible-choreography (2014-10-08)


## Bug Fixes

- **$anchorScroll:** don't scroll to top when initializing and location hash is empty
  ([d5445c60](https://github.com/angular/angular.js/commit/d5445c601fafd6ecd38befeaa4c9ec7bb044127c),
   [#8848](https://github.com/angular/angular.js/issues/8848), [#9393](https://github.com/angular/angular.js/issues/9393))
- **$animate:**
  - ensure hidden elements with ngShow/ngHide stay hidden during animations
  ([39d0b368](https://github.com/angular/angular.js/commit/39d0b36826a077f7549a70d0cf3edebe90a10aaa),
   [#9103](https://github.com/angular/angular.js/issues/9103), [#9493](https://github.com/angular/angular.js/issues/9493))
  - permit class-based animations for leave operations if ngAnimateChildren is enabled
  ([df1a00b1](https://github.com/angular/angular.js/commit/df1a00b11ac2722f4da441837795985f12682030),
   [#8092](https://github.com/angular/angular.js/issues/8092), [#9491](https://github.com/angular/angular.js/issues/9491))
  - ensure that class-based animations only consider the most recent DOM operations
  ([c93924ed](https://github.com/angular/angular.js/commit/c93924ed275a62683b85c82f1c6c2e19d5662c9a),
   [#8946](https://github.com/angular/angular.js/issues/8946), [#9458](https://github.com/angular/angular.js/issues/9458))
  - abort class-based animations if the element is removed during digest
  ([613d0a32](https://github.com/angular/angular.js/commit/613d0a3212de8dc01c817ca8526e09c57978a621),
   [#8796](https://github.com/angular/angular.js/issues/8796))
  - clear the GCS cache even when no animation is detected
  ([cb85cbce](https://github.com/angular/angular.js/commit/cb85cbcec1c876db6062a0dc0bad80f842782194),
   [#8813](https://github.com/angular/angular.js/issues/8813))
- **$browser:**
  - Cache `location.href` only during page reload phase
  ([8ee1ba4b](https://github.com/angular/angular.js/commit/8ee1ba4b94d6fccff06d8781f7ed256c6ce664ff),
   [#9235](https://github.com/angular/angular.js/issues/9235), [#9455](https://github.com/angular/angular.js/issues/9455))
  - don’t use the history API when only the hash changes
  ([7cb01a80](https://github.com/angular/angular.js/commit/7cb01a80beec669d8f6aae1dc211d2f0b7d4eac4),
   [#9423](https://github.com/angular/angular.js/issues/9423), [#9424](https://github.com/angular/angular.js/issues/9424),
   [858360b6](https://github.com/angular/angular.js/commit/858360b680a2bb5c19429c1be1c9506700cda476),
   [0656484d](https://github.com/angular/angular.js/commit/0656484d3e709c5162570b0dd6473b0b6140e5b2),
   [#9143](https://github.com/angular/angular.js/issues/9143), [#9406](https://github.com/angular/angular.js/issues/9406))
  - handle async href on url change in <=IE9
  ([404b95fe](https://github.com/angular/angular.js/commit/404b95fe30a1bcd1313adafbd0018578d5b21d3d),
   [#9235](https://github.com/angular/angular.js/issues/9235))
- **$compile:**
  - handle the removal of an interpolated attribute
  ([a75546af](https://github.com/angular/angular.js/commit/a75546afdf41adab786eda30c258190cd4c5f1ae),
   [#9236](https://github.com/angular/angular.js/issues/9236), [#9240](https://github.com/angular/angular.js/issues/9240))
  - remove comment nodes from templates before asserting single root node
  ([feba0174](https://github.com/angular/angular.js/commit/feba0174db0f8f929273beb8b90691734a9292e2),
   [#9212](https://github.com/angular/angular.js/issues/9212), [#9215](https://github.com/angular/angular.js/issues/9215))
  - use the correct namespace for transcluded svg elements
  ([f3539f3c](https://github.com/angular/angular.js/commit/f3539f3cb5d9477f50f065c6a0ac7d6ca0a31092),
   [#9344](https://github.com/angular/angular.js/issues/9344), [#9415](https://github.com/angular/angular.js/issues/9415))
- **$http:** honor application/json response header and parse json primitives
  ([7b6c1d08](https://github.com/angular/angular.js/commit/7b6c1d08aceba6704a40302f373400aed9ed0e0b),
   [#2973](https://github.com/angular/angular.js/issues/2973))
- **$injector:** throw when factory $get method does not return a value
  ([0d3b69a5](https://github.com/angular/angular.js/commit/0d3b69a5f27b41745b504c7ffd8d72653bac1f85),
   [#4575](https://github.com/angular/angular.js/issues/4575), [#9210](https://github.com/angular/angular.js/issues/9210))
- **$location:** allow `0` in `path()` and `hash()`
  ([b8c5b871](https://github.com/angular/angular.js/commit/b8c5b87119a06edb8e8d1cefad81ee8d1f64f070))
- **form:** fix submit prevention
  ([86c7d122](https://github.com/angular/angular.js/commit/86c7d1221c706993044583d51a0c61423fee5bcf),
   [#3370](https://github.com/angular/angular.js/issues/3370), [#3776](https://github.com/angular/angular.js/issues/3776))
- **ngAnimate:** defer DOM operations for changing classes to postDigest
  ([667183a8](https://github.com/angular/angular.js/commit/667183a8c79d6ffce571a2be78c05dc76503b222),
   [#8234](https://github.com/angular/angular.js/issues/8234), [#9263](https://github.com/angular/angular.js/issues/9263))
- **orderBy:** sort by identity if no predicate is given
  ([607f016a](https://github.com/angular/angular.js/commit/607f016a0ba705ce40df0164360fb96a9d7f5912),
   [#5847](https://github.com/angular/angular.js/issues/5847), [#4579](https://github.com/angular/angular.js/issues/4579), [#9403](https://github.com/angular/angular.js/issues/9403))
- **select:**
  - throw for `selectAs` and `trackBy`
  ([30996f82](https://github.com/angular/angular.js/commit/30996f82afa03cd11771b3267e9367ecf9af6e6d))
  - use `$viewValue` instead of `$modelValue`
  ([f7174169](https://github.com/angular/angular.js/commit/f7174169f4f710d605f6a67f39f90a67a07d4cab),
   [#8929](https://github.com/angular/angular.js/issues/8929))


## Features

- **$location:**
  - add support for History API state handling ([6fd36dee](https://github.com/angular/angular.js/commit/6fd36deed954b338e48390862971d465148dc1f2),
   [#9027](https://github.com/angular/angular.js/issues/9027))
  - allow automatic rewriting of links to be disabled
  ([b3e09be5](https://github.com/angular/angular.js/commit/b3e09be58960b913fee3869bf36e7de3305bbe00),
   [#5487](https://github.com/angular/angular.js/issues/5487))
- **$route:** ability to cancel $routeChangeStart event
  ([f4ff11b0](https://github.com/angular/angular.js/commit/f4ff11b01e6a5f9a9eb25a38d327dfaadbd7c80c),
   [#5581](https://github.com/angular/angular.js/issues/5581), [#5714](https://github.com/angular/angular.js/issues/5714), [#9502](https://github.com/angular/angular.js/issues/9502))

## Performance Improvements

- **$animate:**
  - access DOM less in resolveElementClasses
  ([22358cf9](https://github.com/angular/angular.js/commit/22358cf9c703d67f3cf9eb4899404b09578a5fad))
  - don't join classes before it's necessary in resolveElementClasses
  ([003c44ec](https://github.com/angular/angular.js/commit/003c44eceee54c3398b0d2971fd97a512d7f7cec))
- **ngBind:** set textContent rather than using element.text()
  ([074a146d](https://github.com/angular/angular.js/commit/074a146d8b1ee7c93bf6d5892448a5c2a0143a28),
   [#9369](https://github.com/angular/angular.js/issues/9369), [#9396](https://github.com/angular/angular.js/issues/9396))


## Breaking Changes

- **$compile:** due to [feba0174](https://github.com/angular/angular.js/commit/feba0174db0f8f929273beb8b90691734a9292e2),


If a template contains directives within comment nodes, and there is more than a single node in the
template, those comment nodes are removed. The impact of this breaking change is expected to be
quite low.

Closes #9212
Closes #9215

- **ngAnimate:** due to [667183a8](https://github.com/angular/angular.js/commit/667183a8c79d6ffce571a2be78c05dc76503b222),


The `$animate` CSS class API will always defer changes until the end of the next digest. This allows ngAnimate
to coalesce class changes which occur over a short period of time into 1 or 2 DOM writes, rather than
many. This prevents jank in browsers such as IE, and is generally a good thing.

If you find that your classes are not being immediately applied, be sure to invoke `$digest()`.

Closes #8234
Closes #9263

- **$select:** due to [30996f8](https://github.com/angular/angular.js/commit/30996f82afa03cd11771b3267e9367ecf9af6e6d)

`ngOptions` will now throw an error when the comprehension expressions contains both a `select as`
and `track by` expression.

These expressions are fundamentally incompatible because it is not possible to reliably and
consistently determine the parent object of a model, since `select as` can assign any child of a
`value` as the model value.

Prior to refactorings in this release, neither of these expressions worked correctly independently,
and did not work at all when combined.

See #6564

- **$route:** due to [f4ff11b0](https://github.com/angular/angular.js/commit/f4ff11b01e6a5f9a9eb25a38d327dfaadbd7c80c),

Order of events has changed.
Previously: `$locationChangeStart` -> `$locationChangeSuccess`
  -> `$routeChangeStart` -> `$routeChangeSuccess`

Now: `$locationChangeStart` -> `$routeChangeStart`
  -> `$locationChangeSuccess` ->  -> `$routeChangeSuccess`

Fixes #5581
Closes #5714
Closes #9502


<a name="1.3.0-rc.4"></a>
# 1.3.0-rc.4 unicorn-hydrafication (2014-10-01)


## Bug Fixes

- **$compile:**
  - get $$observe listeners array as own property
  ([a27d827c](https://github.com/angular/angular.js/commit/a27d827c22b0b6b3ba6b7495cf4fc338c6934b37),
   [#9343](https://github.com/angular/angular.js/issues/9343), [#9345](https://github.com/angular/angular.js/issues/9345))
  - Resolve leak with asynchronous compilation
  ([6303c3dc](https://github.com/angular/angular.js/commit/6303c3dcf64685458fc84aa12289f5c9d57f4e47),
   [#9199](https://github.com/angular/angular.js/issues/9199), [#9079](https://github.com/angular/angular.js/issues/9079), [#8504](https://github.com/angular/angular.js/issues/8504), [#9197](https://github.com/angular/angular.js/issues/9197))
  - connect transclude scopes to their containing scope to prevent memory leaks
  ([fb0c77f0](https://github.com/angular/angular.js/commit/fb0c77f0b66ed757a56af13f81b943419fdcbd7f),
   [#9095](https://github.com/angular/angular.js/issues/9095), [#9281](https://github.com/angular/angular.js/issues/9281))
  - sanitize srcset attribute
  ([ab80cd90](https://github.com/angular/angular.js/commit/ab80cd90661396dbb1c94c5f4dd2d11ee8f6b6af))
- **input:**
  - register builtin parsers/formatters before anyone else
  ([10644432](https://github.com/angular/angular.js/commit/10644432ca9d5da69ce790a8d9e691640f333711),
   [#9218](https://github.com/angular/angular.js/issues/9218), [#9358](https://github.com/angular/angular.js/issues/9358))
  - correctly handle invalid model values for `input[date/time/…]`
  ([a0bfdd0d](https://github.com/angular/angular.js/commit/a0bfdd0d60882125f614a91c321f12f730735e7b),
   [#8949](https://github.com/angular/angular.js/issues/8949), [#9375](https://github.com/angular/angular.js/issues/9375))
- **ngModel:** do not parse undefined viewValue when validating
  ([92f05e5a](https://github.com/angular/angular.js/commit/92f05e5a5900713301e64373d7b7daa45a88278b),
   [#9106](https://github.com/angular/angular.js/issues/9106), [#9260](https://github.com/angular/angular.js/issues/9260))
- **ngView:** use animation promises ensure that only one leave animation occurs at a time
  ([3624e380](https://github.com/angular/angular.js/commit/3624e3800fb3ccd2e9ea361a763e20131fd42c29),
   [#9355](https://github.com/angular/angular.js/issues/9355), [#7606](https://github.com/angular/angular.js/issues/7606), [#9374](https://github.com/angular/angular.js/issues/9374))
- **select:** make ctrl.hasOption method consistent
  ([2bcd02dc](https://github.com/angular/angular.js/commit/2bcd02dc1a6b28b357d47c83be3bed5c9a38417c),
   [#8761](https://github.com/angular/angular.js/issues/8761))


## Features

- **$compile:** optionally get controllers from ancestors only
  ([07e3abc7](https://github.com/angular/angular.js/commit/07e3abc7dda872adc3fb25cb3e133f86f494b35d),
   [#4518](https://github.com/angular/angular.js/issues/4518), [#4540](https://github.com/angular/angular.js/issues/4540), [#8240](https://github.com/angular/angular.js/issues/8240), [#8511](https://github.com/angular/angular.js/issues/8511))
- **Scope:** allow the parent of a new scope to be specified on creation
  ([6417a3e9](https://github.com/angular/angular.js/commit/6417a3e9eb7ab0011cefada8db855aa929a64ff8))


## Performance Improvements

- **$rootScope:** moving internal queues out of the Scope instances
  ([b1192518](https://github.com/angular/angular.js/commit/b119251827cea670051198e1b48af7ee0c9f2a1b),
   [#9071](https://github.com/angular/angular.js/issues/9071))
- **benchmark:** add ngBindOnce benchmarks to largetable-bp
  ([2c8b4648](https://github.com/angular/angular.js/commit/2c8b4648526acf5c2645de8408a6d9ace2144b5f))
- **ngForm,ngModel:** move initial addClass to the compile phase
  ([b1ee5386](https://github.com/angular/angular.js/commit/b1ee5386d584f208bce6d3b613afdb3bae9df76a),
   [#8268](https://github.com/angular/angular.js/issues/8268))


## Breaking Changes

- **$compile:** due to [fb0c77f0](https://github.com/angular/angular.js/commit/fb0c77f0b66ed757a56af13f81b943419fdcbd7f),


`$transclude` functions no longer attach `$destroy` event handlers to the
transcluded content, and so the associated transclude scope will not automatically
be destroyed if you remove a transcluded element from the DOM using direct DOM
manipulation such as the jquery `remove()` method.

If you want to explicitly remove DOM elements inside your directive that have
been compiled, and so potentially contain child (and transcluded) scopes, then
it is your responsibility to get hold of the scope and destroy it at the same time.

The suggested approach is to create a new child scope of your own around any DOM
elements that you wish to manipulate in this way and destroy those scopes if you
remove their contents - any child scopes will then be destroyed and cleaned up
automatically.

Note that all the built-in directives that manipulate the DOM (ngIf, ngRepeat,
ngSwitch, etc) already follow this best practice, so if you only use these for
manipulating the DOM then you do not have to worry about this change.

Closes #9095
Closes #9281

- **$parse:** due to [5572b40b](https://github.com/angular/angular.js/commit/5572b40b15ed06969c8e0e92866c5afd088484b4),

- $scope['this'] no longer exits on the $scope object
- $parse-ed expressions no longer allow chaining 'this' such as this['this'] or $parent['this']
- 'this' in $parse-ed expressions can no longer be overridden, if a variable named 'this' is put on the scope it must be accessed using this['this']

Closes #9105

- **input:** due to [1eda1836](https://github.com/angular/angular.js/commit/1eda18365a348c9597aafba9d195d345e4f13d1e),

(Note: this change landed in 1.3.0-rc.3, but was not considered a breaking change at the time).

For text based inputs (text, email, url), the `$viewValue` will now always be converted to a string,
regardless of what type the value is on the model.

To migrate, any code or expressions that expect the `$viewValue` to be anything other than string
should be updated to expect a string.


- **input:** due to a0bfdd0d60882125f614a91c321f12f730735e7b (see #8949),

Similar to `input[number]` Angular will now throw if the model value
for a `input[date]` is not a `Date` object. Previously, Angular only
showed an empty string instead.
Angular does not set validation errors on the `<input>` in this case
as those errors are shown to the user, but the erroneous state was
caused by incorrect application logic and not by the user.

<a name="1.2.26"></a>
# 1.2.26 captivating-disinterest (2014-10-01)

## Bug Fixes



- **select:** make ctrl.hasOption method consistent
  ([11d2242d](https://github.com/angular/angular.js/commit/11d2242df65b2ade0dabe366a0c42963b6d37df5),
   [#8761](https://github.com/angular/angular.js/issues/8761))


<a name="1.3.0-rc.3"></a>
# 1.3.0-rc.3 aggressive-pacification (2014-09-23)


## Bug Fixes

- **ngModel:** support milliseconds in time and datetime
  ([4b83f6ca](https://github.com/angular/angular.js/commit/4b83f6ca2c15bd65fe2b3894a02c04f9967fbff4),
   [#8874](https://github.com/angular/angular.js/issues/8874))


## Features

- **$location:** add ability to opt-out of `<base>` tag requirement in html5Mode
  ([dc3de7fb](https://github.com/angular/angular.js/commit/dc3de7fb7a14c38b5c3dc7decfafb0b51d422dd1),
   [#8934](https://github.com/angular/angular.js/issues/8934))
- **formController:** add $setUntouched to propagate untouched state
  ([fd899755](https://github.com/angular/angular.js/commit/fd8997551f9ed4431f5e99d61f637139485076b9),
   [#9050](https://github.com/angular/angular.js/issues/9050))
- **input:** support dynamic element validation
  ([729c238e](https://github.com/angular/angular.js/commit/729c238e19ab27deff01448d79342ea53721bfed),
   [#4791](https://github.com/angular/angular.js/issues/4791), [#1404](https://github.com/angular/angular.js/issues/1404))
- **ngAria:** add an ngAria module to make a11y easier
  ([d1434c99](https://github.com/angular/angular.js/commit/d1434c999a66c6bb915ee1a8b091e497d288d940),
   [#5486](https://github.com/angular/angular.js/issues/5486))


## Performance Improvements

- **map:** use Array.prototype.map
  ([a591e8b8](https://github.com/angular/angular.js/commit/a591e8b8d302efefd67bf0d5c4bad300a5f3aded))


## Breaking Changes

- **$location:** due to [dc3de7fb](https://github.com/angular/angular.js/commit/dc3de7fb7a14c38b5c3dc7decfafb0b51d422dd1),
  The $location.html5Mode API has changed to allow enabling html5Mode by
    passing an object (as well as still supporting passing a boolean). Symmetrically, the
    method now returns an object instead of a boolean value.

    To migrate, follow the code example below:

    Before:

    var mode = $locationProvider.html5Mode();

    After:

    var mode = $locationProvider.html5Mode().enabled;

Fixes #8934


<a name="1.2.25"></a>
# 1.2.25 hypnotic-gesticulation (2014-09-16)


## Bug Fixes

- **i18n:** fix typo at i18n generation code
  ([1b6d74cc](https://github.com/angular/angular.js/commit/1b6d74cc9f7f7b7bd529abe6ce612de3ae661601))
- **ngLocale:** Regenerate Locale Files
  ([06c76694](https://github.com/angular/angular.js/commit/06c76694ac9b2280594712e6a4b46a1d5987d098))
- **select:** update option labels when model changes
  ([d89d59f4](https://github.com/angular/angular.js/commit/d89d59f453d4e28be4f595fea7e2c4ff2338351f),
   [#9025](https://github.com/angular/angular.js/issues/9025))



<a name="1.3.0-rc.2"></a>
# 1.3.0-rc.2 tactile-perception (2014-09-16)


## Bug Fixes

- **$compile:** update `'@'`-bindings in controller when `bindToController` is `true`
  ([e7ac08a0](https://github.com/angular/angular.js/commit/e7ac08a0619d2bdc91c125d341772b4fbc0d5a78),
   [#9052](https://github.com/angular/angular.js/issues/9052), [#9077](https://github.com/angular/angular.js/issues/9077))
- **$parse:** ensure CSP assignable expressions have `assign()`
  ([d13b4bd1](https://github.com/angular/angular.js/commit/d13b4bd1f5f2abaad00f5d1bf81f79549a8d0e46),
   [#9048](https://github.com/angular/angular.js/issues/9048))
- **i18n:** fix typo at i18n generation code
  ([eb4afd45](https://github.com/angular/angular.js/commit/eb4afd45f77d7d67744e01ce63a831c13c2b22e8))
- **input:** always pass in the model value to `ctrl.$isEmpty`
  ([3e51b84b](https://github.com/angular/angular.js/commit/3e51b84bc19f7e6acc61cb536ddcdbfed307c831),
   [#5164](https://github.com/angular/angular.js/issues/5164), [#9017](https://github.com/angular/angular.js/issues/9017))
- **jqLite:** fix `event.stopImmediatePropagation()` so it works as expected
  ([30354c58](https://github.com/angular/angular.js/commit/30354c58fe2bd371df364f7a3f55b270692a4051),
   [#4833](https://github.com/angular/angular.js/issues/4833))
- **ngLocale:** Regenerate Locale Files
  ([6a96a820](https://github.com/angular/angular.js/commit/6a96a8200aff4749bc84c44a1e8018b09d9ebdb4),
   [#8931](https://github.com/angular/angular.js/issues/8931), [#8583](https://github.com/angular/angular.js/issues/8583), [#7799](https://github.com/angular/angular.js/issues/7799))
- **ngModel:**
  - do not reset bound date objects
  ([1a1ef629](https://github.com/angular/angular.js/commit/1a1ef62903c8fdf4ceb81277d966a8eff67f0a96),
   [#6666](https://github.com/angular/angular.js/issues/6666))
  - don’t clear the model when an external validator failed
  ([9314719d](https://github.com/angular/angular.js/commit/9314719d1eb5f480b877f5513f6e0e474edcb67d),
   [#8357](https://github.com/angular/angular.js/issues/8357), [#8080](https://github.com/angular/angular.js/issues/8080))
- **ngResource:** make badcfg error message more helpful
  ([a3962f0d](https://github.com/angular/angular.js/commit/a3962f0df3f9b8382b47952f9e4fcb48a4cc098b),
   [#9005](https://github.com/angular/angular.js/issues/9005), [#9010](https://github.com/angular/angular.js/issues/9010))
- **select:** update option labels when model changes
  ([46274102](https://github.com/angular/angular.js/commit/46274102454038ee7fd4543a32166e9bbbc98904),
   [#9025](https://github.com/angular/angular.js/issues/9025))


## Features

- **limitTo:** support numeric input to limitTo
  ([1c8a7459](https://github.com/angular/angular.js/commit/1c8a7459c90efc77b1a0987f976e3bddab4565fe),
   [#8926](https://github.com/angular/angular.js/issues/8926))
- **ngInclude:** add template url parameter to events
  ([fd2d6c02](https://github.com/angular/angular.js/commit/fd2d6c02f9654e753d3655a3377a9534f7a54de3),
   [#8453](https://github.com/angular/angular.js/issues/8453), [#8454](https://github.com/angular/angular.js/issues/8454))


## Performance Improvements

- **$compile:** move `$$isolateBinding` creation to directive factory instead of on each link
  ([56f09f0b](https://github.com/angular/angular.js/commit/56f09f0b44048b62f964d29db4d3d2630662f6ea))
- **$parse:**
  - execute watched expressions only when the inputs change
  ([fca6be71](https://github.com/angular/angular.js/commit/fca6be71274e537c7df86ae9e27a3bd1597e9ffa),
   [#9006](https://github.com/angular/angular.js/issues/9006), [#9082](https://github.com/angular/angular.js/issues/9082))
  - remove `binaryFn` and `valueFn` wrappers from filter expressions
  ([67919c80](https://github.com/angular/angular.js/commit/67919c808771a9b185a9d552cd32a90748d36666))


## Breaking Changes

- **$parse:** due to [fca6be71](https://github.com/angular/angular.js/commit/fca6be71274e537c7df86ae9e27a3bd1597e9ffa),
  all filters are assumed to be stateless functions

Previously it was just a good practice to make all filters stateless. Now
it's a requirement in order for the model change-observation to pick up
all changes.

If an existing filter is stateful, it can be flagged as such but keep in
mind that this will result in a significant performance-penalty (or rather
lost opportunity to benefit from a major perf improvement) that will
affect the `$digest` duration.

To flag a filter as stateful do the following:

```javascript
myApp.filter('myFilter', function() {
  function myFilter(input) { ... };
  myFilter.$stateful = true;
  return myFilter;
});
```



<a name="1.3.0-rc.1"></a>
# 1.3.0-rc.1 backyard-atomicity (2014-09-09)


## Bug Fixes

- **$location:**
  - don't call toString on null values
  ([c3a58a9f](https://github.com/angular/angular.js/commit/c3a58a9f34919f121587540e03ecbd51b25198d4))
  - remove an unused parameter of $location.url
  ([99d95f16](https://github.com/angular/angular.js/commit/99d95f1639b64c39231448d77209676b54e6f0be))
  - allow numeric location setter arguments
  ([adb5c6d6](https://github.com/angular/angular.js/commit/adb5c6d6cc76b928436743707727ab0974d6810b),
   [#7054](https://github.com/angular/angular.js/issues/7054))
  - set `baseHref` in mock browser to `/`
  ([fc706d13](https://github.com/angular/angular.js/commit/fc706d13d80bb40eb3dade58ea4b92dca33ce4e7),
   [#8866](https://github.com/angular/angular.js/issues/8866), [#8889](https://github.com/angular/angular.js/issues/8889))
- **$parse:** disallow passing Function to Array.sort
  ([bd8ad0fb](https://github.com/angular/angular.js/commit/bd8ad0fbe81f6c280baa26a596d78e58fc7842e6))
- **input:** check `scope.$$phase` only on `$rootScope`
  ([bf59d727](https://github.com/angular/angular.js/commit/bf59d7274f4a667c5b19e6d4ba5ed2730ca2fe42))
- **ngAnimate:** support removing classes from SVG elements when using jQuery
  ([b3b67213](https://github.com/angular/angular.js/commit/b3b672130d4d1c6f13bdf7e58be76b2aafea2497),
   [#8872](https://github.com/angular/angular.js/issues/8872), [#8893](https://github.com/angular/angular.js/issues/8893))
- **ngEventDirs:** check `scope.$$phase` only on `$rootScope`
  ([203ea10f](https://github.com/angular/angular.js/commit/203ea10f9ea49d7e29569a4232d3b2a666307cd8),
   [#8891](https://github.com/angular/angular.js/issues/8891))
- **ngForm:** don't clear validity of whole form when removing control
  ([953ee22f](https://github.com/angular/angular.js/commit/953ee22f76f8c1137949ed07f36fafc5bbfeb7fe),
   [#8863](https://github.com/angular/angular.js/issues/8863))
- **ngInclude:** correctly add svg-namespaced template content
  ([6639ca9d](https://github.com/angular/angular.js/commit/6639ca9d6bc00a6e3a31e54c50474361ae3561c6),
   [#7538](https://github.com/angular/angular.js/issues/7538), [#8981](https://github.com/angular/angular.js/issues/8981), [#8997](https://github.com/angular/angular.js/issues/8997))
- **ngModel:**
  - update model value with async validators correctly
  ([64c3b745](https://github.com/angular/angular.js/commit/64c3b745fba0792166f30e057f9251f263d80dac))
  - render immediately also with async validators
  ([f94d5515](https://github.com/angular/angular.js/commit/f94d551529b7c970c38b29e3073cec4e7f6b0e00))
  - properly parse min/max date values as strings for date inputs
  ([088545c1](https://github.com/angular/angular.js/commit/088545c1856ce1c3ec3416965dff65077a6e0523),
   [#6755](https://github.com/angular/angular.js/issues/6755))
  - revalidate the model when min/max expression values change for date inputs
  ([b3502835](https://github.com/angular/angular.js/commit/b3502835039178296b730b7526e5666b66ba9156),
   [#6755](https://github.com/angular/angular.js/issues/6755))
  - consider ngMin/ngMax values when validating number input types
  ([25541c1f](https://github.com/angular/angular.js/commit/25541c1f876a16c892d71faae11727bec7bba98c))
  - revalidate the model when min/max expression values change for number inputs
  ([7b273a2c](https://github.com/angular/angular.js/commit/7b273a2c978d5f5ef374f5335afab0ca7d8cfd4d),
   [#2404](https://github.com/angular/angular.js/issues/2404))
- **ngModelOptions:** do not trigger digest on `setViewValue` if debouncing
  ([e322cd9b](https://github.com/angular/angular.js/commit/e322cd9b3b8b47b95c9de3edf631bb46f919c492),
   [#8814](https://github.com/angular/angular.js/issues/8814), [#8850](https://github.com/angular/angular.js/issues/8850), [#8911](https://github.com/angular/angular.js/issues/8911))
- **ngRepeat:** preserve original position of elements that are being animated away
  ([ed637330](https://github.com/angular/angular.js/commit/ed6373300028deda9a0878b3975699d183c1f75c),
   [#8918](https://github.com/angular/angular.js/issues/8918), [#8994](https://github.com/angular/angular.js/issues/8994))
- **ngSwitch:** ensure correct iterator is passed to async function
  ([712299c2](https://github.com/angular/angular.js/commit/712299c2a24390e74cd5c20f51cb1d78f0233b6f),
   [#8833](https://github.com/angular/angular.js/issues/8833))
- **numberFilter:** format numbers that round to zero as nonnegative
  ([ae952fbf](https://github.com/angular/angular.js/commit/ae952fbf0be925a48743d1c925ffe4e31a42c280),
   [#8489](https://github.com/angular/angular.js/issues/8489))
- **orderBy:** allow arrayLike objects to be ordered
  ([cbdaabfb](https://github.com/angular/angular.js/commit/cbdaabfb59bf3348588d5b581f2754e0f9f034a4),
   [#8944](https://github.com/angular/angular.js/issues/8944))


## Features

- **angular.forEach:** add the array/object as the 3rd param like the native array forEach
  ([df9e60c8](https://github.com/angular/angular.js/commit/df9e60c8e7453cdca2cb5a4fa48f3981ecc23a7d),
   [#7902](https://github.com/angular/angular.js/issues/7902))
- **ngModelOptions:** add allowInvalid option
  ([3c538c1d](https://github.com/angular/angular.js/commit/3c538c1d21c43422c7b4cd9b69cb67981bce2b87),
   [#8290](https://github.com/angular/angular.js/issues/8290), [#8313](https://github.com/angular/angular.js/issues/8313))


## Performance Improvements

- **$parse:**
  - remove getterFn wrapper for internal use
  ([b3b476db](https://github.com/angular/angular.js/commit/b3b476db7d34bc2f8b099ab5b993b1e899b9cffd),
   [#8901](https://github.com/angular/angular.js/issues/8901))
  - removing references to Parser/Lexer from parsed expressions
  ([43c67ccd](https://github.com/angular/angular.js/commit/43c67ccd167aecc3549e1b7f7d100956204e3ed4))
  - calculate array lengths once at start of loop
  ([907b8c16](https://github.com/angular/angular.js/commit/907b8c1675865ac38dd055f3f304272e68b233d0))
- **extend:** remove use of forEach to remove calls/closures/passing arguments
  ([9bedeb33](https://github.com/angular/angular.js/commit/9bedeb3353969fba631ad9164edea3c38059fbda),
   [#8898](https://github.com/angular/angular.js/issues/8898))
- **jQuery:** only trigger $destroy if a handler exists
  ([f6aa1c55](https://github.com/angular/angular.js/commit/f6aa1c55616b34215f562e0445e436210860ef04),
   [#8859](https://github.com/angular/angular.js/issues/8859))


## Breaking Changes

- **ngModelController,formController:** due to [6046e14b](https://github.com/angular/angular.js/commit/6046e14bd22491168116e61ffdf5fd3fed5f135c),

- `ctrl.$error` no longer contains entries for validators that were
  successful.
- `ctrl.$setValidity` now differentiates between `true`, `false`,
  `undefined` and `null`, instead of previously only truthy vs falsy.

Closes #8941- **ngSwitch:** due to [0f806d96](https://github.com/angular/angular.js/commit/0f806d9659b5b89a4bd9493364bc36398677e939),


Ever since 0df93fd, tagged in v1.0.0rc1, the ngSwitch directive has had an undocumented `change`
attribute, used for evaluating a scope expression when the switch value changes.

While it's unlikely, applications which may be using this feature should work around the removal
by adding a custom directive which will perform the eval instead. Directive controllers are
re-instantiated when being transcluded, so by putting the attribute on each item that you want
to be notified of a change to, you can more or less emulate the old behavior.

Example:

```js
angular.module("switchChangeWorkaround", []).
  directive("onSwitchChanged", function() {
    return {
      link: function($scope, $element, $attrs) {
        $scope.$parent.$eval($attrs.onSwitchChanged);
      }
    };
  });
```

```html
<div ng-switch="switcher">
  <div ng-switch-when="a" on-switch-changed="doSomethingInParentScope()"></div>
  <div ng-switch-when="b" on-switch-changed="doSomethingInParentScope()"></div>
</div>
```

Closes #8858
Closes #8822


<a name="1.2.24"></a>
# 1.2.24 static-levitation (2014-09-09)


## Bug Fixes

- **$browser:** detect changes to the browser url that happened in sync
  ([2ece4d03](https://github.com/angular/angular.js/commit/2ece4d0347a8a18d4d35993bb882ed6b5b24266c),
   [#6976](https://github.com/angular/angular.js/issues/6976))
- **$compile:**
  - render nested transclusion at the root of a template
  ([9d9cdfb5](https://github.com/angular/angular.js/commit/9d9cdfb575b89e96ae957c986734a49995e2b511),
   [#8914](https://github.com/angular/angular.js/issues/8914), [#8925](https://github.com/angular/angular.js/issues/8925))
  - render nested transclusion at the root of a template
  ([466320f6](https://github.com/angular/angular.js/commit/466320f6911698048bae5406e341d25af7efafa0),
   [#8914](https://github.com/angular/angular.js/issues/8914), [#8925](https://github.com/angular/angular.js/issues/8925))
- **$location:**
  - don't call toString on null values
  ([c12e8d46](https://github.com/angular/angular.js/commit/c12e8d4665b635ba6b09d12802efb88d38b7ad5c))
  - remove an unused parameter of $location.url
  ([c65796d4](https://github.com/angular/angular.js/commit/c65796d496038554861e70da8012f9d0e2521e6d))
  - allow numeric location setter arguments
  ([68a09ba7](https://github.com/angular/angular.js/commit/68a09ba74d10a1490feca1d248f85b0023aa399b),
   [#7054](https://github.com/angular/angular.js/issues/7054))
- **$parse:** disallow passing Function to Array.sort
  ([b39e1d47](https://github.com/angular/angular.js/commit/b39e1d47b9a1b39a9fe34c847a81f589fba522f8))
- **form:** ensure concurrent animations use setClass
  ([d7548fdf](https://github.com/angular/angular.js/commit/d7548fdf1ce6f543bf55d330985a83ef09d0cb83),
   [#8166](https://github.com/angular/angular.js/issues/8166))
- **input:** check `scope.$$phase` only on `$rootScope`
  ([36e6de1d](https://github.com/angular/angular.js/commit/36e6de1d91937d73e900ac115ae366fbefcdf6da))
- **ngEventDirs:**
  - check `scope.$$phase` only on `$rootScope`
  ([2712c2f1](https://github.com/angular/angular.js/commit/2712c2f1979db23eeb53be8a519b9f79bd75e217),
   [#8891](https://github.com/angular/angular.js/issues/8891))
  - execute `blur` and `focus` expression using `scope.$evalAsync`
  ([54f0bc0f](https://github.com/angular/angular.js/commit/54f0bc0fe0c6b6d974d23f2c5ef07359dd93eb99),
   [#4979](https://github.com/angular/angular.js/issues/4979), [#5945](https://github.com/angular/angular.js/issues/5945), [#8803](https://github.com/angular/angular.js/issues/8803), [#6910](https://github.com/angular/angular.js/issues/6910), [#5402](https://github.com/angular/angular.js/issues/5402))
- **ngRepeat:** improve errors for duplicate items
  ([1812af58](https://github.com/angular/angular.js/commit/1812af58c2d470d586c2a543c9a7db3f0baca04f))
- **numberFilter:** format numbers that round to zero as nonnegative
  ([7e02fa07](https://github.com/angular/angular.js/commit/7e02fa07eb5b02e75b1db0058d638af3d1074942),
   [#8489](https://github.com/angular/angular.js/issues/8489))
- **orderBy:** allow arrayLike objects to be ordered
  ([94b0f2d3](https://github.com/angular/angular.js/commit/94b0f2d35de601ded3d93ea4fa78a4d9b139c0a0),
   [#8944](https://github.com/angular/angular.js/issues/8944))


## Breaking Changes

- **ngEventDirs:** due to [54f0bc0f](https://github.com/angular/angular.js/commit/54f0bc0fe0c6b6d974d23f2c5ef07359dd93eb99),

The `blur` and `focus` event fire synchronously, also during DOM operations
that remove elements. This lead to errors as the Angular model was not
in a consistent state. See this [fiddle](http://jsfiddle.net/fq1dq5yb/) for a demo.

This change executes the expression of those events using
`scope.$evalAsync` if an `$apply` is in progress, otherwise
keeps the old behavior.

Fixes #4979
Fixes #5945
Closes #8803
Closes #6910
Closes #5402




<a name="1.3.0-RC.0"></a>
# 1.3.0-RC.0 sonic-boltification (2014-08-29)


## Bug Fixes

- **$animate:**
  - wait two until two digests are over until enabling animations
  ([92576743](https://github.com/angular/angular.js/commit/92576743eec0cef5ffdd701b83f72a61e6489c3b),
   [#8844](https://github.com/angular/angular.js/issues/8844))
  - ensure guarded animations consider AJAX requests upon bootstrap
  ([4bca4c44](https://github.com/angular/angular.js/commit/4bca4c44b95a7435722605a750804043f2960160),
   [#8275](https://github.com/angular/angular.js/issues/8275), [#5262](https://github.com/angular/angular.js/issues/5262))
  - use $timeout to handle the delay within staggering animations
  ([23da6140](https://github.com/angular/angular.js/commit/23da614043fe5dcf0be132b86466eecb11c766a2),
   [#7228](https://github.com/angular/angular.js/issues/7228), [#7547](https://github.com/angular/angular.js/issues/7547), [#8297](https://github.com/angular/angular.js/issues/8297), [#8547](https://github.com/angular/angular.js/issues/8547))
- **$browser:** detect changes to the browser url that happened in sync
  ([3be00df4](https://github.com/angular/angular.js/commit/3be00df495f6eed3b3d9587ebab1fdd633e94e08),
   [#6976](https://github.com/angular/angular.js/issues/6976))
- **$compile:** use the correct namespace for transcluded svg elements
  ([cb73a37c](https://github.com/angular/angular.js/commit/cb73a37c7cae5cdebadf7b3ddd44c5a452495e4e),
   [#8808](https://github.com/angular/angular.js/issues/8808), [#8816](https://github.com/angular/angular.js/issues/8816))
- **$location:** always resolve relative links in html5mode to `<base>` url
  ([22948807](https://github.com/angular/angular.js/commit/22948807e324eb0b182b15b31045dc306a9f3231),
   [#8492](https://github.com/angular/angular.js/issues/8492), [#8172](https://github.com/angular/angular.js/issues/8172))
- **$parse:** properly handle dots at the end of identifiers
  ([8ac90357](https://github.com/angular/angular.js/commit/8ac90357a66ae0c62dbfe6db2c6eaf1d600ecc65),
   [#4613](https://github.com/angular/angular.js/issues/4613), [#4912](https://github.com/angular/angular.js/issues/4912), [#8559](https://github.com/angular/angular.js/issues/8559))
- **Angular:** remove duplicate nodeName_ references
  ([a4520a74](https://github.com/angular/angular.js/commit/a4520a745d917c77f1d12cdbce48272c643f7255))
- **currencyFilter:** pass through null and undefined values
  ([c2aaddbe](https://github.com/angular/angular.js/commit/c2aaddbe4b21348aab8c13a78cdd6aaee846ae4e),
   [#8605](https://github.com/angular/angular.js/issues/8605))
- **docs:** don't throw exception on the 404 page
  ([550ba01b](https://github.com/angular/angular.js/commit/550ba01b325fc29460030fc9c24fa00269dec2a9),
   [#8518](https://github.com/angular/angular.js/issues/8518))
- **input:**
  - validate minlength/maxlength for non-string values
  ([77ce5b89](https://github.com/angular/angular.js/commit/77ce5b89f97aa83c3eb1fe2e19375ef00a822015),
   [#7967](https://github.com/angular/angular.js/issues/7967), [#8811](https://github.com/angular/angular.js/issues/8811))
  - allow to use seconds in `input[time]` and `input[datetime-local]`
  ([5f90340a](https://github.com/angular/angular.js/commit/5f90340abb78aa08dde4876328bcc00e46232e46))
  - use year 1970 instead of 1900 for `input[time]`
  ([29f0b568](https://github.com/angular/angular.js/commit/29f0b568debab7810752969d363d337099e96cdc))
- **ngBindHtml:** throw error if interpolation is used in expression
  ([cd21602d](https://github.com/angular/angular.js/commit/cd21602d5b1650d8be373618cb7320d697e32c4d),
   [#8824](https://github.com/angular/angular.js/issues/8824))
- **ngEventDirs:** execute `blur` and `focus` expression using `scope.$evalAsync`
  ([719c747c](https://github.com/angular/angular.js/commit/719c747cd892ee933e7e414a7dc97e657b88317d),
   [#4979](https://github.com/angular/angular.js/issues/4979), [#5945](https://github.com/angular/angular.js/issues/5945), [#8803](https://github.com/angular/angular.js/issues/8803), [#6910](https://github.com/angular/angular.js/issues/6910), [#5402](https://github.com/angular/angular.js/issues/5402))
- **ngModel:**
  - always format the viewValue as a string for text, url and email types
  ([1eda1836](https://github.com/angular/angular.js/commit/1eda18365a348c9597aafba9d195d345e4f13d1e))
  - allow non-assignable binding when getterSetter is used
  ([ab878a6c](https://github.com/angular/angular.js/commit/ab878a6c038f47b95f3a7e85a4fdb599e0c73e63),
   [#8704](https://github.com/angular/angular.js/issues/8704))
  - treat undefined parse responses as parse errors
  ([db044c40](https://github.com/angular/angular.js/commit/db044c408a7f8082758b96ab739348810c36e15a))
- **ngRepeat:** improve errors for duplicate items
  ([0604bb7b](https://github.com/angular/angular.js/commit/0604bb7b7a6156e33679396e805e327662d9a178))
- **ngSwitch:** avoid removing DOM nodes twice within watch operation
  ([c9b0bfec](https://github.com/angular/angular.js/commit/c9b0bfecc99837af1c97792b3ca3408ba182b0bb),
   [#8662](https://github.com/angular/angular.js/issues/8662))
- **numberFilter:** pass through null and undefined values
  ([2ae10f67](https://github.com/angular/angular.js/commit/2ae10f67fcde3e172f695956301ef796b68a50c2),
   [#8605](https://github.com/angular/angular.js/issues/8605), [#8842](https://github.com/angular/angular.js/issues/8842))


## Features

- **core:**
  - add angular.reloadWithDebugInfo()
  ([41c1b88](https://github.com/angular/angular.js/commit/41c1b8858f02c7310bfabdd545ebb28e90eb4258))
- **$animate:**
  - use promises instead of callbacks for animations
  ([bf0f5502](https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9))
  - coalesce concurrent class-based animations within a digest loop
  ([2f4437b3](https://github.com/angular/angular.js/commit/2f4437b3a149eafb899f25933bd6c713b167d10e))
- **$compile:**
  - bind isolate scope properties to controller
  ([5f3f25a1](https://github.com/angular/angular.js/commit/5f3f25a1a6f9d4f2a66e2700df3b9c5606f1c255),
   [#7635](https://github.com/angular/angular.js/issues/7635), [#7645](https://github.com/angular/angular.js/issues/7645))
  - allow disabling scope info
  ([a1e5cd5f](https://github.com/angular/angular.js/commit/a1e5cd5fe3906ebee8c400247a1f793d3e2239fb))
- **$compile/ngBind:** allow disabling binding info
  ([3660fd09](https://github.com/angular/angular.js/commit/3660fd0912d3ccf6def8c9f02d8d4c0621c8d91f))
- **$http:** implement mechanism for coalescing calls to $apply in $http
  ([ea6fc6e6](https://github.com/angular/angular.js/commit/ea6fc6e69c2a2aa213c71ed4e917a0d54d064e4c),
   [#8736](https://github.com/angular/angular.js/issues/8736), [#7634](https://github.com/angular/angular.js/issues/7634), [#5297](https://github.com/angular/angular.js/issues/5297))
- **$rootScope:** implement $applyAsync to support combining calls to $apply into a single digest.
  ([e94d454b](https://github.com/angular/angular.js/commit/e94d454b840f6cc55a440741382b407836ad245b))
- **$templateRequest:** introduce the $templateRequest service
  ([a70e2833](https://github.com/angular/angular.js/commit/a70e2833ea276107b11aafea96ef4a6724ad4d83))
- **filter:** allow to define the timezone for formatting dates
  ([4739b1d9](https://github.com/angular/angular.js/commit/4739b1d9daebfd094b6181c5f2cb52ff71e31c61))
- **filterFilter:** pass index to function predicate
  ([46343c60](https://github.com/angular/angular.js/commit/46343c603db6192daf5303b92eb664749326c7e6),
   [#654](https://github.com/angular/angular.js/issues/654))
- **input:** allow to define the timezone for parsing dates
  ([cc6fc199](https://github.com/angular/angular.js/commit/cc6fc199f5abaacdf781aa03634337d776eb0fc9),
   [#8447](https://github.com/angular/angular.js/issues/8447))
- **minErr:** allow specifying ErrorConstructor in minErr constructor
  ([a6bd4bc8](https://github.com/angular/angular.js/commit/a6bd4bc866a18f860c7548fa1b3f6d4c2a953416))
- **ngModel:** provide validation API functions for sync and async validations
  ([2ae4f40b](https://github.com/angular/angular.js/commit/2ae4f40be1803d999ca2a8cc30ec17ff19ea6d86))
- **ngRoute:** alias string as redirectTo property in .otherwise()
  ([3b5d75c0](https://github.com/angular/angular.js/commit/3b5d75c021e21fa6ec4dc6c47b8eafa55680ea63),
   [#7794](https://github.com/angular/angular.js/issues/7794))
- **testability:** add $$testability service
  ([85880a64](https://github.com/angular/angular.js/commit/85880a64900fa22a61feb926bf52de0965332ca5))


## Performance Improvements

- **$compile:**
  - add debug classes in compile phase
  ([e0489abd](https://github.com/angular/angular.js/commit/e0489abd8d9e4971ae23cc38805a92d227d1f3a1))
  - only iterate over elements with link functions
  ([fdf9989f](https://github.com/angular/angular.js/commit/fdf9989f7cf1ed81982a788b75a338ac33334571),
   [#8741](https://github.com/angular/angular.js/issues/8741))
- **nodeName_:** simplify the code and reduce the number of DOM calls
  ([5a1a0c96](https://github.com/angular/angular.js/commit/5a1a0c96220101b5e040f0755e5eb401e2c73f65))
- **select:** execute render after $digest cycle
  ([6f7018d5](https://github.com/angular/angular.js/commit/6f7018d52fa4f9f9c7fa8e3035317d1239efb20f),
   [#8825](https://github.com/angular/angular.js/issues/8825))


## Breaking Changes

- **$location**: due to [22948807](https://github.com/angular/angular.js/commit/22948807e324eb0b182b15b31045dc306a9f3231)

#### since 1.2.0 and 1.3.0-beta.1

Angular now requires a `<base>` tag when html5 mode of `$location` is enabled. Reasoning:
Using html5 mode without a `<base href="...">` tag makes relative links for images, links, ...
relative to the current url if the browser supports
the history API. However, if the browser does not support the history API Angular falls back to using the `#`,
and then all those relative links would be broken.

The `<base>` tag is also needed when a deep url is loaded from the server, e.g. `http://server/some/page/url`.
In that case, Angular needs to decide which part of the url is the base of the application, and which part
is path inside of the application.

To summarize: Now all relative links are always relative to the `<base>` tag.

Exception (also a breaking change):
Link tags whose `href` attribute starts with a `#` will only change the hash of the url, but nothing else
(e.g. `<a href="#someAnchor">`). This is to make it easy to scroll to anchors inside a document.

Related to #6162
Closes #8492

#### since 1.2.17 and 1.3.0-beta.10

In html5 mode without a `<base>` tag on older browser that don't support the history API
relative paths were adding up. E.g. clicking on `<a href="page1">` and then on `<a href="page2">`
would produce `$location.path()==='/page1/page2'`. The code that introduced this behavior was removed
and Angular now also requires a `<base>` tag to be present when using html5 mode.

Closes #8172, #8233


- **ngInclude, ngMessage, ngView and directives that load templates**: due to [a70e2833](https://github.com/angular/angular.js/commit/a70e2833ea276107b11aafea96ef4a6724ad4d83)

Angular will now throw a $compile minErr each a template fails to download
for ngView, directives and ngMessage template requests. This changes the former
behavior of silently ignoring failed HTTP requests--or when the template itself
is empty. Please ensure that all directive, ngView and ngMessage code now properly
addresses this scenario. NgInclude is unaffected from this change.


- **$animate**: due to [23da6140](https://github.com/angular/angular.js/commit/23da614043fe5dcf0be132b86466eecb11c766a2)

If any stagger code consisted of having BOTH transition staggers and delay staggers
together then that will not work the same way. Angular will now instead choose
the highest stagger delay value and set the timeout to wait for that before
applying the active CSS class.


- **$animate**: due to [bf0f5502](https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9)

Both the API for the cancelation method and the done callback for
$animate animations is different. Instead of using a callback function
for each of the $animate animation methods, a promise is used instead.

```js
//before
$animate.enter(element, container, null, callbackFn);

//after
$animate.enter(element, container).then(callbackFn);
```

The animation can now be cancelled via `$animate.cancel(promise)`.

```js
//before
var cancelFn = $animate.enter(element, container);
cancelFn(); //cancels the animation

//after
var promise = $animate.enter(element, container);
$animate.cancel(promise); //cancels the animation
```

keep in mind that you will still need to run $scope.$apply inside of the `then` callback
to trigger a digest.


- **$animate**: due to [2f4437b3](https://github.com/angular/angular.js/commit/2f4437b3a149eafb899f25933bd6c713b167d10e)

$animate.addClass, $animate.removeClass and $animate.setClass will no longer start the animation
right after being called in the directive code. The animation will only commence once a digest
has passed. This means that all animation-related testing code requires an extra digest to kick
off the animation.

```js
//before this fix
$animate.addClass(element, 'super');
expect(element).toHaveClass('super');

//now
$animate.addClass(element, 'super');
$rootScope.$digest();
expect(element).toHaveClass('super');
```

$animate will also tally the amount of times classes are added and removed and only animate
the left over classes once the digest kicks in. This means that for any directive code that
adds and removes the same CSS class on the same element then this may result in no animation
being triggered at all.

```js
$animate.addClass(element, 'klass');
$animate.removeClass(element, 'klass');

$rootScope.$digest();

//nothing happens...
```


- **$compile/ngBind:** due to [3660fd09](https://github.com/angular/angular.js/commit/3660fd0912d3ccf6def8c9f02d8d4c0621c8d91f),

The value of `$binding` data property on an element is always an array now
and the expressions do not include the curly braces `{{ ... }}`.


- **currencyFilter:** due to [c2aaddbe](https://github.com/angular/angular.js/commit/c2aaddbe4b21348aab8c13a78cdd6aaee846ae4e),
  previously the currency filter would convert null and undefined values into empty string, after this change
these values will be passed through.

Only cases when the currency filter is chained with another filter that doesn't expect null/undefined will be affected. This
should be very rare.

This change will not change the visual output of the filter because the interpolation will convert the null/undefined to
an empty string.

Closes #8605


- **numberFilter:** due to [2ae10f67](https://github.com/angular/angular.js/commit/2ae10f67fcde3e172f695956301ef796b68a50c2),
  previously the number filter would convert null and undefined values into empty string, after this change
these values will be passed through.

Only cases when the number filter is chained with another filter that doesn't expect null/undefined will be affected. This
should be very rare.

This change will not change the visual output of the filter because the interpolation will convert the null/undefined to
an empty string.

Closes #8605
Closes #8842


- **input:**
  - due to [77ce5b89](https://github.com/angular/angular.js/commit/77ce5b89f97aa83c3eb1fe2e19375ef00a822015),

NgModel.viewValue will always be used when rendering validations for `minlength` and `maxlength`.

Closes #7967
Closes #8811

- **input:**
  - due to [29f0b568](https://github.com/angular/angular.js/commit/29f0b568debab7810752969d363d337099e96cdc),


According to the HTML5 spec `input[time]` should create dates
based on the year 1970 (used to be based on the year 1900).

Related to #8447.


- **ngModel**: due to [db044c40](https://github.com/angular/angular.js/commit/db044c408a7f8082758b96ab739348810c36e15a)

Any parser code from before that returned an `undefined` value
(or nothing at all) will now cause a parser failure. When this occurs
none of the validators present in `$validators` will run until the parser
error is gone. The error will be stored on `ngModel.$error`.




- **ngEventDirs:** due to [719c747c](https://github.com/angular/angular.js/commit/719c747cd892ee933e7e414a7dc97e657b88317d),

The `blur` and `focus` event fire synchronously, also during DOM operations
that remove elements. This lead to errors as the Angular model was not
in a consistent state. See this [fiddle](http://jsfiddle.net/fq1dq5yb/) for a demo.

This change executes the expression of those events using
`scope.$evalAsync` if an `$apply` is in progress, otherwise
keeps the old behavior.

Fixes #4979
Fixes #5945
Closes #8803
Closes #6910
Closes #5402

- **$compile:** due to [5f3f25a1](https://github.com/angular/angular.js/commit/5f3f25a1a6f9d4f2a66e2700df3b9c5606f1c255),

The returned value from directive controller constructors are now ignored, and only the constructed
instance itself will be attached to the node's expando. This change is necessary in order to ensure
that it's possible to bind properties to the controller's instance before the actual constructor is
invoked, as a convenience to developers.

In the past, the following would have worked:

```js
angular.module("myApp", []).
    directive("myDirective", function() {
        return {
            controller: function($scope) {
                return {
                    doAThing: function() { $scope.thingDone = true; },
                    undoAThing: function() { $scope.thingDone = false; }
                };
            },
            link: function(scope, element, attrs, ctrl) {
                ctrl.doAThing();
            }
        };
    });
```

However now, the reference to `doAThing()` will be undefined, because the return value of the controller's constructor is ignored. In order to work around this, one can opt for several strategies, including the use of `_.extend()` or `merge()` like routines, like so:

```js
angular.module("myApp", []).
    directive("myDirective", function() {
        return {
            controller: function($scope) {
                _.extend(this, {
                    doAThing: function() { $scope.thingDone = true; },
                    undoAThing: function() { $scope.thingDone = false; }
                });
            },
            link: function(scope, element, attrs, ctrl) {
                ctrl.doAThing();
            }
        };
    });
```

<a name="1.2.23"></a>
# 1.2.23 superficial-malady (2014-08-22)


## Bug Fixes

- **$location:**
  - rewrite relative URI correctly if `path==='/'` in legacy html5Mode
  ([c6e4defc](https://github.com/angular/angular.js/commit/c6e4defcb6ec1ff43e9590b8fe9601d9e9da445d),
   [#8684](https://github.com/angular/angular.js/issues/8684))
  - don't call `indexOf()` of undefined `href` attribute
  ([74a7afcb](https://github.com/angular/angular.js/commit/74a7afcb31b2e2aef2d7a4c3e3cf29f320669b0e),
   [#7721](https://github.com/angular/angular.js/issues/7721), [#8681](https://github.com/angular/angular.js/issues/8681))
- **$sanitize:** sanitize javascript urls with comments
  ([4f387050](https://github.com/angular/angular.js/commit/4f3870500da6f6f0c1b1d20c70404996b1a39585),
   [#8274](https://github.com/angular/angular.js/issues/8274))
- **Angular:** make Date comparison in equals() NaN-aware
  ([98f60372](https://github.com/angular/angular.js/commit/98f603722d81046031ad4a10e0a49b692871c2b2),
   [#8650](https://github.com/angular/angular.js/issues/8650), [#8715](https://github.com/angular/angular.js/issues/8715))
- **copy:** clear array destinations correctly for non-array sources
  ([888b0f54](https://github.com/angular/angular.js/commit/888b0f5400c2357dcc91300d1a4e66e52a8d8801),
   [#8610](https://github.com/angular/angular.js/issues/8610), [#8702](https://github.com/angular/angular.js/issues/8702))
- **input:**
  - use lowercase method to account for undefined type
  ([456026ef](https://github.com/angular/angular.js/commit/456026eff12ad70fa27dd08ec6bddc63e0f3e604))
  - by default, do not trim `input[type=password]` values
  ([ebece0bc](https://github.com/angular/angular.js/commit/ebece0bcb9d64e59beb1c9b3418bed25e50ceef4),
   [#8250](https://github.com/angular/angular.js/issues/8250), [#8230](https://github.com/angular/angular.js/issues/8230))
- **linky:** handle quotes around email addresses
  ([effc98fd](https://github.com/angular/angular.js/commit/effc98fdc91937ae0aca30bc53e34a3c29863cd6),
   [#8520](https://github.com/angular/angular.js/issues/8520))
- **minErr:** encode btstrpd error input to strip angle brackets
  ([aaf9c5e5](https://github.com/angular/angular.js/commit/aaf9c5e598996ab17bce9579c8bfe63628b6620e),
   [#8683](https://github.com/angular/angular.js/issues/8683))
- **ngHref:** remove attribute when empty value instead of ignoring
  ([ed56872b](https://github.com/angular/angular.js/commit/ed56872bb2c9c479f90a479f52e3d4ef9c80d0c7),
   [#2755](https://github.com/angular/angular.js/issues/2755))


## Breaking Changes

- **input:** due to [ebece0bc](https://github.com/angular/angular.js/commit/ebece0bcb9d64e59beb1c9b3418bed25e50ceef4),

Previously, `input[type=password]` would trim values by default, and would require an explicit ng-trim="false"
to disable the trimming behavior. After this CL, `ng-trim` no longer affects `input[type=password]`, and will
never trim the password value.

Closes #8250
Closes #8230



<a name="1.3.0-beta.19"></a>
# 1.3.0-beta.19 rafter-ascension (2014-08-22)


## Bug Fixes

- **$compile:**
  - use the correct namespace for transcluded SVG elements
  ([ffbd276d](https://github.com/angular/angular.js/commit/ffbd276d6def6ff35bfdb30553346e985f4a0de6),
   [#8716](https://github.com/angular/angular.js/issues/8716))
  - update the jQuery `.context` when an element is replaced by `replace:true` directive
  ([f02f7d9c](https://github.com/angular/angular.js/commit/f02f7d9c15deea9c5d83212301e2a5e18223bbe5),
   [#8253](https://github.com/angular/angular.js/issues/8253), [#7900](https://github.com/angular/angular.js/issues/7900))
- **$location:**
  - rewrite relative URI correctly if `path==='/'` in legacy html5Mode
  ([d18b2819](https://github.com/angular/angular.js/commit/d18b2819768e467897dee7bc223876ca23ea71b1),
   [#8684](https://github.com/angular/angular.js/issues/8684))
  - don't call `indexOf()` of undefined `href` attribute
  ([5b77e30c](https://github.com/angular/angular.js/commit/5b77e30c1ac49be7b079b82527a5631f68bac904),
   [#7721](https://github.com/angular/angular.js/issues/7721), [#8681](https://github.com/angular/angular.js/issues/8681))
- **$parse:** remove unused variable declaration in generated getters
  ([6acea115](https://github.com/angular/angular.js/commit/6acea1152f72a4026583897c67bea2839bc9e89e))
- **$sanitize:** sanitize javascript urls with comments
  ([b7e82a33](https://github.com/angular/angular.js/commit/b7e82a33eee03fc683f982c6ee13d15d88b07f67),
   [#8274](https://github.com/angular/angular.js/issues/8274))
- **$watchGroup:** call listener once when the `watchExpressions` array is empty
  ([bf0e8373](https://github.com/angular/angular.js/commit/bf0e83732aa02c7aa08d0ccdf122116235fcfa11))
- **Angular:** make Date comparison in `equals()` `NaN`-aware
  ([693e846a](https://github.com/angular/angular.js/commit/693e846add5089d0e516604ae4a109e445fd3664),
   [#8650](https://github.com/angular/angular.js/issues/8650), [#8715](https://github.com/angular/angular.js/issues/8715))
- **Scope:** don't clear the phase when an exception is thrown from asyncQueue or watch
  ([bf1a57ad](https://github.com/angular/angular.js/commit/bf1a57ad4822bb152fdd4d2fb54c0689e466481b))
- **copy:** clear array destinations correctly for non-array sources
  ([a603e202](https://github.com/angular/angular.js/commit/a603e202cc7e048c2ab6f12dee1cc8f277cf6f4f),
   [#8610](https://github.com/angular/angular.js/issues/8610), [#8702](https://github.com/angular/angular.js/issues/8702))
- **forEach:** match behavior of Array.prototype.forEach (ignore missing properties)
  ([36230194](https://github.com/angular/angular.js/commit/36230194be8aa417b0af33d618060829a75c4c5f),
   [#8510](https://github.com/angular/angular.js/issues/8510), [#8522](https://github.com/angular/angular.js/issues/8522), [#8525](https://github.com/angular/angular.js/issues/8525))
- **input:**
  - use lowercase method to account for undefined type
  ([066c0499](https://github.com/angular/angular.js/commit/066c049957a8af2fe449040eca2f1cb499655e32))
  - by default, do not trim input[type=password] values
  ([a7fb357f](https://github.com/angular/angular.js/commit/a7fb357fa122e0a056ce1de838a2dfaf1ebc2953),
   [#8250](https://github.com/angular/angular.js/issues/8250), [#8230](https://github.com/angular/angular.js/issues/8230))
- **jQuery:** cooperate with other libraries monkey-patching jQuery.cleanData
  ([b9389b26](https://github.com/angular/angular.js/commit/b9389b26ba2cf6aa70372fa32a7b28c62d174bf5),
   [#8471](https://github.com/angular/angular.js/issues/8471))
- **jqLite:**
  - clone wrapNode in jqlite/wrap
  ([77d3e754](https://github.com/angular/angular.js/commit/77d3e7544642396d868aa49b85f0c027e8057bd7),
   [#3860](https://github.com/angular/angular.js/issues/3860), [#4194](https://github.com/angular/angular.js/issues/4194))
  - revert the `ready()` optimization until jQuery does the same
  ([1bdca93d](https://github.com/angular/angular.js/commit/1bdca93d708ce9441b26d00e564210755395edf7))
- **linky:** handle quotes around email addresses
  ([a9d22712](https://github.com/angular/angular.js/commit/a9d227120dc2d433372da415a450e56b783b57a0),
   [#8520](https://github.com/angular/angular.js/issues/8520))
- **minErr:** encode btstrpd error input to strip angle brackets
  ([0872388a](https://github.com/angular/angular.js/commit/0872388a1b88b8637fdb0fb1ebbee269bead0508),
   [#8683](https://github.com/angular/angular.js/issues/8683))
- **ngRepeat:**
  - allow aliasAs identifiers which contain but do not match reserved words
  ([d713ad1b](https://github.com/angular/angular.js/commit/d713ad1b6607389649fbb8d12ac103565b02a1d4),
   [#8729](https://github.com/angular/angular.js/issues/8729))
  - make allowed aliasAs expressions more strict
  ([09b29870](https://github.com/angular/angular.js/commit/09b298705f74255aff55bb7e4ba200c4200d712d),
   [#8438](https://github.com/angular/angular.js/issues/8438), [#8440](https://github.com/angular/angular.js/issues/8440))


## Features

- **$compile:**
  - use allOrNothing interpolation for ngAttr*
  ([09de7b5d](https://github.com/angular/angular.js/commit/09de7b5db466498becb295ecf5c1d0a698b1512c),
   [#8376](https://github.com/angular/angular.js/issues/8376), [#8399](https://github.com/angular/angular.js/issues/8399))
- **benchpress:** configure benchpress grunt task
  ([6bdaa4bc](https://github.com/angular/angular.js/commit/6bdaa4bc213805a58f51e9f5285dfe03bb06ddc3))
- **jqLite:** implement the `detach` method
  ([1a05daf5](https://github.com/angular/angular.js/commit/1a05daf5dc67813528afdb88086766dc22b6c0df),
   [#5461](https://github.com/angular/angular.js/issues/5461))
- **ngRoute:** add method for changing url params
  ([77a1acc7](https://github.com/angular/angular.js/commit/77a1acc7fcad7a8a7d0376b33d38a8977372cfe2))


## Performance Improvements

- **$compile:**
  - don't register $destroy callbacks on element-transcluded nodes
  ([b5f7970b](https://github.com/angular/angular.js/commit/b5f7970be5950580bde4de0002a578daf3ae3aac))
  - refactor publicLinkFn to simplify the code and use 'for in' loop
  ([645625cf](https://github.com/angular/angular.js/commit/645625cf349a4be57691a7bf418b2386b4c1a53d))
  - clone the nodeList during linking only if necessary
  ([3e0a2e1f](https://github.com/angular/angular.js/commit/3e0a2e1f3367a5b4ae7d8de6cff559f522aacfba))
  - delay object initialization in nodeLinkFn
  ([31ed0af7](https://github.com/angular/angular.js/commit/31ed0af74b0081906415dcefe5610e1217cc0c48))
  - optimize nodeLinkFn
  ([35134a0e](https://github.com/angular/angular.js/commit/35134a0e237d193cd7d3995dacfdc6bf3e92635e))
  - optimize publicLinkFn
  ([274e9c4d](https://github.com/angular/angular.js/commit/274e9c4ddfd64138d39fcf84047aabc3ccde2f0b))
- **$interpolate:** do not keep empty separators
  ([94b5c9f0](https://github.com/angular/angular.js/commit/94b5c9f00edff7fa631d09316ceb9c7fd4c6426a))
- **$parse:**
  - don't bind filters to a context
  ([8863b9d0](https://github.com/angular/angular.js/commit/8863b9d04c722b278fa93c5d66ad1e578ad6eb1f))
  - optimize filter implementation
  ([ece6ef47](https://github.com/angular/angular.js/commit/ece6ef479c741f17fc217d743cad64c516dbed27))
  - speed up fn invocation for no args case
  ([a17578ad](https://github.com/angular/angular.js/commit/a17578ad3db5d1375aec1d601055ab718eeafd10))
  - speed up fn invocation by optimizing arg collection
  ([fecfc5b0](https://github.com/angular/angular.js/commit/fecfc5b09feb7e4079364013b0beb6bf204ade2a))
  - use no-proto maps as caches and avoid hasOwnProperty checks
  ([d302ea0c](https://github.com/angular/angular.js/commit/d302ea0cfade2787d7cc500398b7dcd3e4eff945))
  - trim expression only if string
  ([a1341223](https://github.com/angular/angular.js/commit/a1341223c084c8188671bb8d6ea1608490b66f9f))
- **$rootScope:** do not use `Function::call` when not needed
  ([7eae29e5](https://github.com/angular/angular.js/commit/7eae29e5ab478ccb7e02fee8311f8b99ea1d165d))
- **Scope:**
  - optimize `$watchCollection` when used for watching objects
  ([e822e906](https://github.com/angular/angular.js/commit/e822e9061c2a605649d91abbd641f757e2829275))
  - don't use forEach in
  ([301463a2](https://github.com/angular/angular.js/commit/301463a2e249011d7cb696c6cf34254f8317a706))
  - watchCollection optimization
  ([7d96ab0d](https://github.com/angular/angular.js/commit/7d96ab0d132d923ec3e3a212aaf9d79f1d4a02de))
  - exit $broadcast early if nobody is listening for the given event
  ([a09fa356](https://github.com/angular/angular.js/commit/a09fa356416c033a52666f3becf00524ecff3a03))
  - use remove the need for the extra watch in $watchGroup
  ([3f0e642e](https://github.com/angular/angular.js/commit/3f0e642eefcbbb315839c4456ba6ac029a7b8a20),
   [#8396](https://github.com/angular/angular.js/issues/8396))
- **benchpress:** add benchpress node module and port over large table test
  ([1229334f](https://github.com/angular/angular.js/commit/1229334fbd8c778e95785d6a5e5589099ce655f7))
- **isObject:** use strict comparison
  ([d208ba25](https://github.com/angular/angular.js/commit/d208ba254442649d35f96c76bcd9e47326ec59f3))
- **jqLite:**
  - simplify jqLiteDealoc
  ([f8f7a1df](https://github.com/angular/angular.js/commit/f8f7a1df34560222cb5d2e18d4be996f5553815a))
  - optimize event handler
  ([d05f27e2](https://github.com/angular/angular.js/commit/d05f27e274c41c33eebf4fe8035715d3f6596069))
  - only take `str.split()` path when needed
  ([187b1b8e](https://github.com/angular/angular.js/commit/187b1b8ef45babd86afa853dc9321cd23160096e),
   [#8648](https://github.com/angular/angular.js/issues/8648))
  - optimize `off()`
  ([abb17cce](https://github.com/angular/angular.js/commit/abb17cce8b459e4646d1c2a2428b691c3d95fb4c))
  - refactor jqLiteExpandoStore to minimize access to expensive element.ng339 expando property
  ([1e8698b3](https://github.com/angular/angular.js/commit/1e8698b33e61b1a196f05f42856a2da4590a10e1))
  - microoptimization in chaining fn
  ([fafbd494](https://github.com/angular/angular.js/commit/fafbd494907a8c068d79415b7ba8f42f283be521))
  - don't use String#split in on() unless we need it
  ([bda673f8](https://github.com/angular/angular.js/commit/bda673f8e785f299407c8c45887f37448a0f0192))
  - don't check isString many times in constructor
  ([443b521e](https://github.com/angular/angular.js/commit/443b521e22f9ec7009b913a2fe78caee0a515e87))
  - optimize jqLiteAcceptsData method
  ([b493c62f](https://github.com/angular/angular.js/commit/b493c62f6b3e4288f5dee7c8b5952e088c2e3329))
  - optimize `append()` and `after()`
  ([8d933bf9](https://github.com/angular/angular.js/commit/8d933bf99520fe3936e33d3ee28fd37e574b99de))
  - don't register DOM listener for $destroy event
  ([6251751a](https://github.com/angular/angular.js/commit/6251751ad7bc2f3621db538edb5a9d7313a4ce6d))
  - optimize event listener registration
  ([566f1015](https://github.com/angular/angular.js/commit/566f1015d27118d259e0886910d6b73b3cb0eb10))
  - improve createEventHandler method by switching from forEach to for loop
  ([e9cd6dc0](https://github.com/angular/angular.js/commit/e9cd6dc055cb7bd80ae9232d8985b2bc3999135e))
  - don't use `forEach` in `off()`
  ([960a8410](https://github.com/angular/angular.js/commit/960a8410515b2d7d461d7c95e8a2ca3d75129087))
  - don't recreate the Node.contains polyfill
  ([d1536e7c](https://github.com/angular/angular.js/commit/d1536e7c8bf60549096138d08953a43190c7b1a6))
  - speed up shallowCopy and special case Attributes cloning
  ([54fa16e4](https://github.com/angular/angular.js/commit/54fa16e45d8769ce6708a28388326db0eea53c7e))
- **ngBind:** bypass jquery/jqlite when setting text
  ([0a738ce1](https://github.com/angular/angular.js/commit/0a738ce1760f38efe45e79aa133442be09b56803))
- **ngRepeat:**
  - simplify code and remove duplicate array.length access
  ([08eb0558](https://github.com/angular/angular.js/commit/08eb05583bf39c63fef43b4faf29c61360699c81))
  - optimize marking of nodes that are being removed via an animation
  ([36e35b2c](https://github.com/angular/angular.js/commit/36e35b2cb17c5ff7c43746d9ac0a259f77ff494e))
  - use no-proto objects for blockMaps
  ([13d113c5](https://github.com/angular/angular.js/commit/13d113c522f124b91a1fd8606c22bbd399abf121))
  - move work to compile fn
  ([bdd853cb](https://github.com/angular/angular.js/commit/bdd853cb83839eef9901af164293611eaa23ee2c))
  - move updateScope fn to factory and reuse it for all repeaters
  ([e58d65a5](https://github.com/angular/angular.js/commit/e58d65a520cfbc630cbfbc248479416777ca16b2))
  - clone boundary comment nodes
  ([fbd48845](https://github.com/angular/angular.js/commit/fbd48845e0e88e9935f82fe4c9f686ad78b5d924))


## Breaking Changes

- **$compile:**
  - due to [09de7b5d](https://github.com/angular/angular.js/commit/09de7b5db466498becb295ecf5c1d0a698b1512c),


Now, `ng-attr-*` will never add the attribute to the DOM if any of the interpolated expressions
evaluate to `undefined`.

To work around this, initialize values which are intended to be the empty string with the
empty string:

For example, given the following markup:

```html
<div ng-attr-style="border-radius: {{value}}{{units}}"></div>
```

If `$scope.value` is `4`, and `$scope.units` is `undefined`, the resulting markup is unchanged:

```html
<div ng-attr-style="border-radius: {{value}}{{units}}"></div>
```

However, if $scope.units is `""`, then the resulting markup is updated:

```html
<div ng-attr-style="border-radius: {{value}}{{units}}" style="border-radius: 4"></div>
```

Closes #8376
Closes #8399

  - due to [0d608d04](https://github.com/angular/angular.js/commit/0d608d041f37a659d8d8ba7a9b688e132587035d),
  element-transcluded directives now have an extra comment automatically appended to their cloned DOM

This comment is usually needed to keep track the end boundary in the event child directives modify the root node(s).
If not used for this purpose it can be safely ignored.

  - due to [75c4cbf8](https://github.com/angular/angular.js/commit/75c4cbf81fcd6d49656d3cb044e59e5fd24e0479),
  `directive.type` was renamed to `directive.templateNamespace`

This change is breaking only within 1.3.0-beta releases: `directive.type` was renamed to `directive.templateNamespace`

The property name `type` was too general.

- **$parse:** due to [8863b9d0](https://github.com/angular/angular.js/commit/8863b9d04c722b278fa93c5d66ad1e578ad6eb1f),
   `this` in filters is now undefined and no longer the scope

It's a bad practice for filters to have hidden dependencies, so pulling stuff from scope directly
is not a good idea. Scope being the filter context was never documented as public API, so we don't
expect that any significant code depends on this behavior.

If an existing filter has a dependency on the scope instance, the scope reference can
be passed into the filter as a filter argument (this is highly discouraged for new code):

Before: `{{ user.name | customFilter }}`
After: `{{ user.name | customFilter:this }}`

- **Scope:** due to [0554c1aa](https://github.com/angular/angular.js/commit/0554c1aae49a81691154a77e70b602b0f24dca81),
  `deregisterNotifier` callback for `$watch` is no longer available

This API was available only in the last few 1.3 beta versions and is not
very useful for applications, so we don't expect that anyone will be affected
by this change.

- **input:** due to [a7fb357f](https://github.com/angular/angular.js/commit/a7fb357fa122e0a056ce1de838a2dfaf1ebc2953),
  by default, do not trim `input[type=password]` values.

Previously, `input[type=password]` would trim values by default, and would require an explicit `ng-trim="false"`
to disable the trimming behavior. After this change, `ng-trim` no longer affects `input[type=password]`, and will
never trim the password value.

Closes #8250
Closes #8230



<a name="1.3.0-beta.18"></a>
# 1.3.0-beta.18 spontaneous-combustion (2014-08-12)


## Bug Fixes

- **$compile:** make '='-bindings NaN-aware
  ([5038bf79](https://github.com/angular/angular.js/commit/5038bf79c6c8251d7449d887b44a4321e619c534),
   [#8553](https://github.com/angular/angular.js/issues/8553), [#8554](https://github.com/angular/angular.js/issues/8554))
- **$location:** add semicolon to whitelist of delimiters to unencode
  ([36258033](https://github.com/angular/angular.js/commit/3625803349de04f175f87a22cbb608738003811a),
   [#5019](https://github.com/angular/angular.js/issues/5019))
- **$parse:**
  - one-time binding for literal expressions works as expected
  ([c024f282](https://github.com/angular/angular.js/commit/c024f28217cf8eedd695dd4b933ecf2ba4243c15),
   [#8209](https://github.com/angular/angular.js/issues/8209))
  - correctly assign expressions who's path is undefined and that use brackets notation
  ([c03ad249](https://github.com/angular/angular.js/commit/c03ad249033e701f3ad7aa358102e1cb87f5025c),
   [#8039](https://github.com/angular/angular.js/issues/8039))
- **Scope:** add deregisterNotifier to oneTimeLiteralWatch signature
  ([a001a417](https://github.com/angular/angular.js/commit/a001a417d5c12bad0fa09c88e045622b95239e2f))
- **jqLite:**
  - allow `triggerHandler()` to accept custom event
  ([01d81cda](https://github.com/angular/angular.js/commit/01d81cdab3dbbcb8b4204769eb5272096eb0837f),
   [#8469](https://github.com/angular/angular.js/issues/8469))
  - fix regression where mutating the dom tree on a event breaks jqLite.remove
  ([a00c9bca](https://github.com/angular/angular.js/commit/a00c9bca401abe5b5b0a217be82333056422c811),
   [#8359](https://github.com/angular/angular.js/issues/8359))
- **ngSanitize:** ensure `html` is a string in htmlParser()
  ([34781f18](https://github.com/angular/angular.js/commit/34781f18cb75ded9ae29f4b78f5bacd079f76709),
   [#8417](https://github.com/angular/angular.js/issues/8417), [#8416](https://github.com/angular/angular.js/issues/8416))
- **select:**
  - ensure that at least one option has the `selected` attribute set
  ([25a476ea](https://github.com/angular/angular.js/commit/25a476ea096b200fb4f422aaa9cd7215e2596ad3),
   [#8366](https://github.com/angular/angular.js/issues/8366), [#8429](https://github.com/angular/angular.js/issues/8429))
  - do not update selected property of an option element on digest with no change event
  ([cdc7db3f](https://github.com/angular/angular.js/commit/cdc7db3f35368a9175ed96c63f4bf56593fe1876),
   [#8221](https://github.com/angular/angular.js/issues/8221), [#7715](https://github.com/angular/angular.js/issues/7715))


## Features

- **$parse:** allow for assignments in ternary operator branches
  ([2d678f1d](https://github.com/angular/angular.js/commit/2d678f1d0a3714fdd49e582b92787312af129947),
   [#8512](https://github.com/angular/angular.js/issues/8512), [#8484](https://github.com/angular/angular.js/issues/8484))
- **form:** Add new $submitted state to forms
  ([108a69be](https://github.com/angular/angular.js/commit/108a69be17df5884d026c57b2be3235c576250fe),
   [#8056](https://github.com/angular/angular.js/issues/8056))
- **http:** allow caching for JSONP requests
  ([3607c982](https://github.com/angular/angular.js/commit/3607c9822f57b4d01b3f09a6ae4efc7168bec6c5),
   [#1947](https://github.com/angular/angular.js/issues/1947), [#8356](https://github.com/angular/angular.js/issues/8356))
- **jQuery:** upgrade to jQuery to 2.1.1
  ([9e7cb3c3](https://github.com/angular/angular.js/commit/9e7cb3c37543008e6236bb5a2c4536df2e1e43a9))
- **ngMock:** allow override of when/expect definitions
  ([477626d8](https://github.com/angular/angular.js/commit/477626d846b4de65d1d5c7071e6a94361395ff42),
   [#5766](https://github.com/angular/angular.js/issues/5766), [#8352](https://github.com/angular/angular.js/issues/8352))


## Performance Improvements

- **$q:** move Deferred and Promise methods to prototypes
  ([23bc92b1](https://github.com/angular/angular.js/commit/23bc92b17df882a907fb326320f0622717fefe7b),
   [#8300](https://github.com/angular/angular.js/issues/8300))
- **input:** prevent additional $digest when input is already touched
  ([dd2a803f](https://github.com/angular/angular.js/commit/dd2a803f4f03ab629a51623c026d3e3f9dc9e91f),
   [#8450](https://github.com/angular/angular.js/issues/8450))


## Breaking Changes

- **jQuery:** due to [9e7cb3c3](https://github.com/angular/angular.js/commit/9e7cb3c37543008e6236bb5a2c4536df2e1e43a9),
  Angular no longer supports jQuery versions below 2.1.1.
- **$q:** due to [23bc92b1](https://github.com/angular/angular.js/commit/23bc92b17df882a907fb326320f0622717fefe7b),
  Promises methods are no longer enumerated when using for-loops with `hasOwnProperty` check. E.g. `angular.extends`


<a name="1.2.22"></a>
# 1.2.22 finicky-pleasure (2014-08-12)


## Bug Fixes

- **$compile:** make '='-bindings NaN-aware
  ([0b0acb03](https://github.com/angular/angular.js/commit/0b0acb03424a273965fa6e6175d584f53a90252c),
   [#8553](https://github.com/angular/angular.js/issues/8553), [#8554](https://github.com/angular/angular.js/issues/8554))
- **$parse:** correctly assign expressions who's path is undefined and that use brackets notation
  ([60366c8d](https://github.com/angular/angular.js/commit/60366c8d0bb5ffdd1bd8a8971820eb4868f3efd5),
   [#8039](https://github.com/angular/angular.js/issues/8039))
- **jqLite:** allow `triggerHandler()` to accept custom event
  ([d262378b](https://github.com/angular/angular.js/commit/d262378b7c047dcd925cf4b55b80c0697b292232),
   [#8469](https://github.com/angular/angular.js/issues/8469), [#8505](https://github.com/angular/angular.js/issues/8505))
- **ngSanitize:** ensure `html` is a string in htmlParser()
  ([9ee07551](https://github.com/angular/angular.js/commit/9ee075518f1ccec0f34aa49bd007aa2ed9a3b12e),
   [#8417](https://github.com/angular/angular.js/issues/8417), [#8416](https://github.com/angular/angular.js/issues/8416))
- **select:**
  - ensure that at least one option has the `selected` attribute set
  ([79538afd](https://github.com/angular/angular.js/commit/79538afd7bd730d49be8eb988a3a54848d8ddaec),
   [#8366](https://github.com/angular/angular.js/issues/8366), [#8429](https://github.com/angular/angular.js/issues/8429))
  - do not update selected property of an option element on digest with no change event
  ([c2860944](https://github.com/angular/angular.js/commit/c2860944c61a0b910f703fe8a9717188ed387893),
   [#8221](https://github.com/angular/angular.js/issues/8221), [#7715](https://github.com/angular/angular.js/issues/7715))


## Features

- **$parse:** allow for assignments in ternary operator branches
  ([93b0c2d8](https://github.com/angular/angular.js/commit/93b0c2d8925e354159cc421e5be1bca9582f7b70),
   [#8512](https://github.com/angular/angular.js/issues/8512), [#8484](https://github.com/angular/angular.js/issues/8484))
- **http:** allow caching for JSONP requests
  ([eab5731a](https://github.com/angular/angular.js/commit/eab5731afc788c59f3f2988db372299268df8614),
   [#1947](https://github.com/angular/angular.js/issues/1947), [#8356](https://github.com/angular/angular.js/issues/8356))


<a name="1.3.0-beta.17"></a>
# 1.3.0-beta.17 turing-autocompletion (2014-07-25)


## Bug Fixes

- **angular.copy:** clone regexp flags correctly
  ([86340a59](https://github.com/angular/angular.js/commit/86340a59bf9eb7bdfc4f99000cecf628cd10d9c8),
   [#5781](https://github.com/angular/angular.js/issues/5781), [#8337](https://github.com/angular/angular.js/issues/8337))
- **docs:** change plnkr form to open in same window
  ([925b2080](https://github.com/angular/angular.js/commit/925b2080a0341d9348feeb4f492957a2e2c80082))
- **jqLite:** triggerHandler support unbind self
  ([8a27abae](https://github.com/angular/angular.js/commit/8a27abae896de3c4d94c407e8bb381e099d2d7f7),
   [#5984](https://github.com/angular/angular.js/issues/5984))
- **ngHref:** remove attribute when empty value instead of ignoring
  ([469ea338](https://github.com/angular/angular.js/commit/469ea3384ad48ca4765af807c0f41201edb527f9),
   [#2755](https://github.com/angular/angular.js/issues/2755))


## Features

- **$compile:** change directive's restrict setting to default to EA (element/attribute)
  ([11f5aeee](https://github.com/angular/angular.js/commit/11f5aeeee952a395edaf54e3277674f211a82fc7),
   [#8321](https://github.com/angular/angular.js/issues/8321))
- **$q:** add streamlined ES6-style interface for using $q
  ([f3a763fd](https://github.com/angular/angular.js/commit/f3a763fd2edd8a37b80c79a5aaa1444460cd2df7),
   [#8311](https://github.com/angular/angular.js/issues/8311), [#6427](https://github.com/angular/angular.js/issues/6427))
- **ngRepeat:** provide support for aliasing filtered repeater results as a scope member
  ([e0adb9c4](https://github.com/angular/angular.js/commit/e0adb9c452e172295209f785b62472688225fffb),
   [#5919](https://github.com/angular/angular.js/issues/5919), [#8046](https://github.com/angular/angular.js/issues/8046), [#8282](https://github.com/angular/angular.js/issues/8282))


## Performance Improvements

- **$parse:** don't use reflective calls in generated functions
  ([c54228fb](https://github.com/angular/angular.js/commit/c54228fbe9d42d8a3a159bf84dd1d2e99b259ece))


## Breaking Changes

- **$compile:** due to [11f5aeee](https://github.com/angular/angular.js/commit/11f5aeeee952a395edaf54e3277674f211a82fc7),
  directives now match elements by default unless specific restriction rules are set via `restrict` property.

This means that if a directive 'myFoo' previously didn't specify matching restriction, it will now match both the attribute
and element form.

Before:

 `<div my-foo></div>` <---- my-foo attribute matched the directive

 `<my-foo></my-foo>`  <---- no match

After:

 `<div my-foo></div>` <---- my-foo attribute matched the directive

 `<my-foo></my-foo>`  <---- my-foo element matched the directive

It is not expected that this will be a problem in practice because of widespread use of prefixes that make `<my-foo>` like
elements unlikely.

Closes #8321


<a name="1.2.21"></a>
# 1.2.21 wizard-props (2014-07-25)


## Bug Fixes

- **$http:** fix double-quoted date issue when encoding params
  ([2f960f15](https://github.com/angular/angular.js/commit/2f960f1530ed936c57df612a352a0d996368f6a1),
   [#8150](https://github.com/angular/angular.js/issues/8150), [#6128](https://github.com/angular/angular.js/issues/6128), [#8154](https://github.com/angular/angular.js/issues/8154))
- **$location:** handle plus character in query strings
  ([60af504c](https://github.com/angular/angular.js/commit/60af504c18dbdde9dfe90e9a2badef6d9e798512),
   [#3042](https://github.com/angular/angular.js/issues/3042))
- **$rootScope:** $watchCollection should handle NaN in objects
  ([bf13d268](https://github.com/angular/angular.js/commit/bf13d2683d5880b18db00087e80ee0fd5e1f429a),
   [#7930](https://github.com/angular/angular.js/issues/7930))
- **angular.copy:** clone regexp flags correctly
  ([e25ed0d4](https://github.com/angular/angular.js/commit/e25ed0d48d9a1c577e78b1c96098841572c764ea),
   [#5781](https://github.com/angular/angular.js/issues/5781), [#8337](https://github.com/angular/angular.js/issues/8337))
- **csp:** fix autodetection of CSP + better docs
  ([0e5d3190](https://github.com/angular/angular.js/commit/0e5d31908e122f013427164f7bbeea914a9a5961),
   [#8162](https://github.com/angular/angular.js/issues/8162), [#8191](https://github.com/angular/angular.js/issues/8191))
- **docs:** change plnkr form to open in same window
  ([5d11e020](https://github.com/angular/angular.js/commit/5d11e02008731a78f302841863a83fe7ed3c37b9))
- **jqLite:** triggerHandler support unbind self
  ([209e6000](https://github.com/angular/angular.js/commit/209e60007042f7e8b34c54ec6bf7d6f703c0ba2a),
   [#5984](https://github.com/angular/angular.js/issues/5984))
- **ngHref:** remove attribute when empty value instead of ignoring
  ([948c86c6](https://github.com/angular/angular.js/commit/948c86c6025fca8e07921869d21cfac1c6333b05),
   [#2755](https://github.com/angular/angular.js/issues/2755))
- **ngRoute:** remove unnecessary call to decodeURIComponent
  ([1b779028](https://github.com/angular/angular.js/commit/1b779028fdd339febaa1fff5f3bd4cfcda46cc09),
   [#6326](https://github.com/angular/angular.js/issues/6326), [#6327](https://github.com/angular/angular.js/issues/6327))
- **ngSanitize:**
  - follow HTML parser rules for start tags / allow < in text content
  ([d175bb01](https://github.com/angular/angular.js/commit/d175bb01314efdcbad5c3cb31b02e298e26c6e19),
   [#8212](https://github.com/angular/angular.js/issues/8212), [#8193](https://github.com/angular/angular.js/issues/8193))
- **orderBy:** correctly order by date values
  ([f1b28847](https://github.com/angular/angular.js/commit/f1b28847c8123483e03ac2410de86fd33a80b5f4),
   [#6675](https://github.com/angular/angular.js/issues/6675), [#6746](https://github.com/angular/angular.js/issues/6746))
- **select:** force visual update in IE
  ([c0afbfac](https://github.com/angular/angular.js/commit/c0afbfaca57893403d8d4b0990879ad5b9ffc3e5),
   [#7692](https://github.com/angular/angular.js/issues/7692), [#8158](https://github.com/angular/angular.js/issues/8158))


## Performance Improvements

- **$compile:** only create jqLite object when necessary
  ([71eb1901](https://github.com/angular/angular.js/commit/71eb1901f6b9a3a6d4b772aa95ce0dc78ff847bc))
- **$parse:** don't use reflective calls in generated functions
  ([cbdf0c2a](https://github.com/angular/angular.js/commit/cbdf0c2afb9836ae4cca6d70cf555ff28f55a1d1))
- **forEach:** use native for loop instead of forEach for Arrays
  ([492b0cdf](https://github.com/angular/angular.js/commit/492b0cdf28d02f1d508455245b7d8e1d641d9f40))
- **jqLite:** expose the low-level jqLite.data/removeData calls
  ([3c46c943](https://github.com/angular/angular.js/commit/3c46c94342aa35131f3ba0f8f4a6b39338b87d56))
- **ngBindHtml:** move addClass to the compile phase
  ([8eede099](https://github.com/angular/angular.js/commit/8eede099cd8aa6d524d1de385d08432072fd294e),
   [#8261](https://github.com/angular/angular.js/issues/8261))


<a name="1.3.0-beta.16"></a>
# 1.3.0-beta.16 pizza-transubstantiation (2014-07-18)

## Bug Fixes

- **$cookie:** use `decodeURIComponent` instead of unescape for cookie reading
  ([1c9ab40d](https://github.com/angular/angular.js/commit/1c9ab40d286ffdb1b41d30ca8d861b53175bfc24),
   [#8125](https://github.com/angular/angular.js/issues/8125))
- **$http:** fix double-quoted date issue when encoding params
  ([9dce42b3](https://github.com/angular/angular.js/commit/9dce42b3c26eb02621723172a68725980369b849),
   [#8150](https://github.com/angular/angular.js/issues/8150), [#6128](https://github.com/angular/angular.js/issues/6128), [#8154](https://github.com/angular/angular.js/issues/8154))
- **$location:** handle plus character in query strings
  ([3f4ee151](https://github.com/angular/angular.js/commit/3f4ee1513901f55d6007e3fc3948458adf4ac656),
   [#3042](https://github.com/angular/angular.js/issues/3042))
- **$rootScope:**
  - `$watchCollection` should handle `NaN` in objects
  ([db9f2570](https://github.com/angular/angular.js/commit/db9f2570c18d77d0e51d5a7afa139d25d0bdc470),
   [#7930](https://github.com/angular/angular.js/issues/7930))
  - remove support for a watch action to be a string
  ([02c0ed27](https://github.com/angular/angular.js/commit/02c0ed27bc375d5352fefdd7e34aad9758621283),
   [#8190](https://github.com/angular/angular.js/issues/8190))
- **csp:** fix autodetection of CSP + better docs
  ([0113f225](https://github.com/angular/angular.js/commit/0113f2257415422729d5c2a9bdba76c1d0a17a13),
   [#8162](https://github.com/angular/angular.js/issues/8162), [#8191](https://github.com/angular/angular.js/issues/8191))
- **ngList:** use custom separators for re-joining list items
  ([c6c9d26e](https://github.com/angular/angular.js/commit/c6c9d26e3487ce24ece390c26994123964f805b0),
   [#4008](https://github.com/angular/angular.js/issues/4008), [#2561](https://github.com/angular/angular.js/issues/2561), [#4344](https://github.com/angular/angular.js/issues/4344))
- **ngRoute:** remove unnecessary call to `decodeURIComponent`
  ([528f56a6](https://github.com/angular/angular.js/commit/528f56a690295650f54eeb2238609446635c5db0),
   [#6326](https://github.com/angular/angular.js/issues/6326), [#6327](https://github.com/angular/angular.js/issues/6327))
- **ngSanitize:** follow HTML parser rules for start tags / allow < in text content
  ([f6681d41](https://github.com/angular/angular.js/commit/f6681d41a493efa6566f8a8a0b6ec39547e572ef),
   [#8212](https://github.com/angular/angular.js/issues/8212), [#8193](https://github.com/angular/angular.js/issues/8193))
- **ngSwitch:**
  - interoperate with multi-element transclude directives
  ([c20d438a](https://github.com/angular/angular.js/commit/c20d438ac9b9757331d096969a73c782c38e098a),
   [#8235](https://github.com/angular/angular.js/issues/8235), [#8244](https://github.com/angular/angular.js/issues/8244))
  - use the correct transclusion scope
  ([4f32e3ee](https://github.com/angular/angular.js/commit/4f32e3eef152bcaab7f7ab151fc824e71a591473),
   [#8235](https://github.com/angular/angular.js/issues/8235))
- **orderBy:** correctly order by date values
  ([92bceb5c](https://github.com/angular/angular.js/commit/92bceb5c5b6e4a5a8fee01e1e0dfcf4674858cf2),
   [#6675](https://github.com/angular/angular.js/issues/6675), [#6746](https://github.com/angular/angular.js/issues/6746))
- **select:** force visual update in IE
  ([d7f73022](https://github.com/angular/angular.js/commit/d7f730228d58d3a409846e64ba5d0120356691cc),
   [#7692](https://github.com/angular/angular.js/issues/7692), [#8158](https://github.com/angular/angular.js/issues/8158))


## Features

- **$compile:** explicitly request multi-element directive behavior
  ([e8066c4b](https://github.com/angular/angular.js/commit/e8066c4b4ce11496b0d8f39e41b4d753048bca2d),
   [#5372](https://github.com/angular/angular.js/issues/5372), [#6574](https://github.com/angular/angular.js/issues/6574), [#5370](https://github.com/angular/angular.js/issues/5370), [#8044](https://github.com/angular/angular.js/issues/8044), [#7336](https://github.com/angular/angular.js/issues/7336))
- **ngList:** use ngTrim to manage whitespace handling when splitting
  ([8d18d20e](https://github.com/angular/angular.js/commit/8d18d20e316ed9d420f09f46f90027aef2940930))
- **ngTransclude:** allow ngTransclude to be used as an element
  ([3dafcba9](https://github.com/angular/angular.js/commit/3dafcba9c1738b85f3adceaac90b747a1b595ea8),
   [#8141](https://github.com/angular/angular.js/issues/8141))


## Performance Improvements

- **$compile:** only create jqLite object when necessary
  ([a160f76f](https://github.com/angular/angular.js/commit/a160f76ffa9544cd2ed99f24ba65b5994108f9f5))
- **bindOnce** more performant interpolation and lazy one-time binding
  ([86d55c1d](https://github.com/angular/angular.js/commit/86d55c1ded21a5be6091344493d70c6dc4194e43))
- **jqLite:** expose the low-level jqLite.data/removeData calls
  ([e4ba8943](https://github.com/angular/angular.js/commit/e4ba89436aa0b96f126ce2c23d0c7f7c785573fe))
- **ngBindHtml:** move addClass to the compile phase
  ([903e7352](https://github.com/angular/angular.js/commit/903e7352c9943e4d3757dd1cff58178d4c5375d6),
   [#8261](https://github.com/angular/angular.js/issues/8261))


## Breaking Changes

- **$compile:** due to [e8066c4b](https://github.com/angular/angular.js/commit/e8066c4b4ce11496b0d8f39e41b4d753048bca2d),
  Directives which previously depended on the implicit grouping between
directive-start and directive-end attributes must be refactored in order to see this same behavior.

Before:

```html
<div data-fancy-directive-start>{{start}}</div>
  <p>Grouped content</p>
<div data-fancy-directive-end>{{end}}</div>
```
```javascript
.directive('fancyDirective', function() {
  return {
    link: angular.noop
  };
})
```

After:

```html
<div data-fancy-directive-start>{{start}}</div>
  <p>Grouped content</p>
<div data-fancy-directive-end>{{end}}</div>
```
```javascript
.directive('fancyDirective', function() {
  return {
    multiElement: true, // Explicitly mark as a multi-element directive.
    link: angular.noop
  };
})
```

Closes #5372
Closes #6574
Closes #5370
Closes #8044
Closes #7336

- **$rootScope:** due to [02c0ed27](https://github.com/angular/angular.js/commit/02c0ed27bc375d5352fefdd7e34aad9758621283),


Previously, it was possible for an action passed to $watch
to be a string, interpreted as an angular expresison. This is no longer supported.
The action now has to be a function.
Passing an action to $watch is still optional.

Before:

```javascript
$scope.$watch('state', ' name="" ');
```

After:

```javascript
$scope.$watch('state', function () {
  $scope.name = "";
});
```

Closes #8190

- **bootstrap:** due to [666a3835](https://github.com/angular/angular.js/commit/666a3835d231b3f77f907276be18b3c0086e5d12),


If using any of the mechanisms specified above, then migrate by
specifying the attribute `ng-app` to the root element. E.g.

```html
<div ng-app="module">...</div>
```

Closes #8147

- **ngList:** due to [c6c9d26e](https://github.com/angular/angular.js/commit/c6c9d26e3487ce24ece390c26994123964f805b0),


The `ngList` directive no longer supports splitting the view value
via a regular expression. We need to be able to re-join list items back
together and doing this when you can split with regular expressions can
lead to inconsistent behavior and would be much more complex to support.

If your application relies upon ngList splitting with a regular expression
then you should either try to convert the separator to a simple string or
you can implement your own version of this directive for you application.

Closes #4008
Closes #2561
Closes #4344

- **ngSwitch:** due to [4f32e3ee](https://github.com/angular/angular.js/commit/4f32e3eef152bcaab7f7ab151fc824e71a591473),

** Directive Priority Changed ** - this commit changes the priority
of `ngSwitchWhen` and `ngSwitchDefault` from `800` to `1200`. This makes their
priority higher than `ngRepeat`, which allows items to be repeated on
the switch case element reliably.

In general your directives should have a lower priority than these directives
if you want them to exist inside the case elements. If you relied on the
priority of these directives then you should check that your code still
operates correctly.

Closes #8235

<a name="1.3.0-beta.15"></a>
# 1.3.0-beta.15 unbelievable-advancement (2014-07-11)


## Bug Fixes

- **$animate:**
  - ensure that parallel class-based animations are all eventually closed
  ([f07af61f](https://github.com/angular/angular.js/commit/f07af61f050fcdcece15c13ee8c6a6d32f86d3a1),
   [#7766](https://github.com/angular/angular.js/issues/7766))
  - remove the ng-animate className after canceling animation
  ([e18db78d](https://github.com/angular/angular.js/commit/e18db78d7793b1e94d9b19ac15b89d39f21a5729),
   [#7784](https://github.com/angular/angular.js/issues/7784), [#7801](https://github.com/angular/angular.js/issues/7801), [#7894](https://github.com/angular/angular.js/issues/7894))
- **$http:**
  - don't remove content-type header if data is set by request transform
  ([c7c363cf](https://github.com/angular/angular.js/commit/c7c363cf8d4533f94c5534c83dd1c7135633ddd8),
   [#7910](https://github.com/angular/angular.js/issues/7910))
  - add ability to remove default headers
  ([172a4093](https://github.com/angular/angular.js/commit/172a40931be5fe47e7732e5ba173895a1d59c5cd),
    [#5784](https://github.com/angular/angular.js/issues/5784))
- **$location:** remove query args when passed in object
  ([2c7d0857](https://github.com/angular/angular.js/commit/2c7d0857ccbdb3a0967acc20e4346a7e1a6be792),
   [#6565](https://github.com/angular/angular.js/issues/6565))
- **input:**
  - escape forward slash in email regexp
  ([a88c215f](https://github.com/angular/angular.js/commit/a88c215f17829c1cfdec36bc1ef40bae10c41dff),
   [#8096](https://github.com/angular/angular.js/issues/8096))
  - modify email validation regexp to match rfc1035
  ([af6f943a](https://github.com/angular/angular.js/commit/af6f943a22f26cf2968f0ae3a1fab2fd09b52a2b),
   [#6026](https://github.com/angular/angular.js/issues/6026))
- **jqLite:**
  - correctly dealoc svg elements in IE
  ([012ab1f8](https://github.com/angular/angular.js/commit/012ab1f8745c8985d3f132c2dfa8fd84e7dc7041))
  - remove exposed dealoc method
  ([9c5b407f](https://github.com/angular/angular.js/commit/9c5b407fd1e296dd525c129743f2b2b47da4dc0d))
- **ngModel:** test & update correct model when running $validate
  ([f3cb2741](https://github.com/angular/angular.js/commit/f3cb2741161353f387d02725637ce4ba062a9bc0),
   [#7836](https://github.com/angular/angular.js/issues/7836), [#7837](https://github.com/angular/angular.js/issues/7837))
- **parseKeyValue:** ignore properties in prototype chain
  ([cb42766a](https://github.com/angular/angular.js/commit/cb42766a14f8123aa288b6e20f879141970fb84d),
   [#8070](https://github.com/angular/angular.js/issues/8070), [#8068](https://github.com/angular/angular.js/issues/8068))
- **select:** auto-select new option that is marked as selected
  ([b8ae73e1](https://github.com/angular/angular.js/commit/b8ae73e17c19d9aebf572a75c05a7d981dcac807),
   [#6828](https://github.com/angular/angular.js/issues/6828))


## Features

- **$animate:** allow directives to cancel animation events
  ([ca752790](https://github.com/angular/angular.js/commit/ca752790d95480b7ad1125a7ddb52b726b987a24),
   [#7722](https://github.com/angular/angular.js/issues/7722))
- **$controller:** disable using global controller constructors
  ([3f2232b5](https://github.com/angular/angular.js/commit/3f2232b5a181512fac23775b1df4a6ebda67d018))
- **FormController:** add `$rollbackViewValue` to rollback all controls
  ([85b77314](https://github.com/angular/angular.js/commit/85b77314ed8e4b45d7365a24a47349ed94672aeb),
   [#7595](https://github.com/angular/angular.js/issues/7595))
- **input:** support constant expressions for ngTrueValue/ngFalseValue
  ([c90cefe1](https://github.com/angular/angular.js/commit/c90cefe16142d973a123e945fc9058e8a874c357),
   [#8041](https://github.com/angular/angular.js/issues/8041), [#5346](https://github.com/angular/angular.js/issues/5346), [#1199](https://github.com/angular/angular.js/issues/1199))
- **ngAnimate:** conditionally allow child animations to run in parallel with parent animations
  ([8252b8be](https://github.com/angular/angular.js/commit/8252b8be946367f1759065adf528adc908da00a2),
   [#7946](https://github.com/angular/angular.js/issues/7946))
- **ngModel:** bind to getters/setters
  ([b9fcf017](https://github.com/angular/angular.js/commit/b9fcf017316d37e91959949f56692644ce09d54a),
   [#768](https://github.com/angular/angular.js/issues/768))


## Performance Improvements

- **$compile:** no longer need nodeType filter when setting $scope data
  ([b0ca5195](https://github.com/angular/angular.js/commit/b0ca5195e88a42611e933c49d7d2768b181b2d1b),
   [#7887](https://github.com/angular/angular.js/issues/7887))


## Breaking Changes

- **$controller:** due to [3f2232b5](https://github.com/angular/angular.js/commit/3f2232b5a181512fac23775b1df4a6ebda67d018),

`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);
```

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
```
- **input:** due to [c90cefe1](https://github.com/angular/angular.js/commit/c90cefe16142d973a123e945fc9058e8a874c357),


Previously, these attributes would always be treated as strings. However, they are now parsed as
expressions, and will throw if an expression is non-constant.

To convert non-constant strings into constant expressions, simply wrap them in an extra pair of quotes, like so:

    <input type="checkbox" ng-model="..." ng-true-value="'truthyValue'">

Closes #8041
Closes #5346
Closes #1199

<a name="1.2.20"></a>
# 1.2.20 accidental-beautification (2014-07-11)


## Bug Fixes

- **$http:**
  - don't remove content-type header if data is set by request transform
  ([7027844d](https://github.com/angular/angular.js/commit/7027844d42cd428cb799f38f9e9b303da013ac4f),
   [#7910](https://github.com/angular/angular.js/issues/7910))
  - add ability to remove default headers
  ([172a4093](https://github.com/angular/angular.js/commit/172a40931be5fe47e7732e5ba173895a1d59c5cd),
    [#5784](https://github.com/angular/angular.js/issues/5784))
- **$location:** remove query args when passed in object
  ([a26acb64](https://github.com/angular/angular.js/commit/a26acb64fe2ed3e05bf21ac1c058d6ac59b89870),
   [#6565](https://github.com/angular/angular.js/issues/6565))
- **input:**
  - escape forward slash in email regexp
  ([da0e3c99](https://github.com/angular/angular.js/commit/da0e3c99f51c196f58758841d4d8492a9fa09e20),
   [#8096](https://github.com/angular/angular.js/issues/8096))
  - modify email validation regexp to match rfc1035
  ([816b8423](https://github.com/angular/angular.js/commit/816b84230cdd8273ba19e8dec3b6f2e800f76612),
   [#6026](https://github.com/angular/angular.js/issues/6026))
- **parseKeyValue:** ignore properties in prototype chain
  ([873acf8f](https://github.com/angular/angular.js/commit/873acf8fab3eb41914920259e713e1916e3c4f38),
   [#8070](https://github.com/angular/angular.js/issues/8070), [#8068](https://github.com/angular/angular.js/issues/8068))


## Features

- **ngAnimate:** conditionally allow child animations to run in parallel with parent animations
  ([931789ec](https://github.com/angular/angular.js/commit/931789ec1476e1d06739e63cb423eb87172b5ebc),
   [#7946](https://github.com/angular/angular.js/issues/7946))


<a name="1.3.0-beta.14"></a>
# 1.3.0-beta.14 harmonious-cacophonies (2014-06-30)


This release contains security fixes for $parse that prevent arbitrary code execution via Angular
expressions under some very specific conditions. The only applications affected by these
vulnerabilities are those that match all of the following conditions:

- application mixes server-side and client-side templating
- the server-side templating contains XSS vulnerabilities
- the vulnerabilities in the server-side templating are being guarded by server-side XSS filters or
  on the client-side via [CSP](http://en.wikipedia.org/wiki/Content_Security_Policy)
- the server-side XSS vulnerabilities can be used to augment the client-side template processed by
  Angular

Applications not meeting all of the conditions are not vulnerable.

This fix is in both 1.3.0-beta.14 and 1.2.19 release.

The Angular team would like to thank [Jann Horn](http://thejh.net) for reporting these
vulnerabilities via [security@angularjs.org].



## Bug Fixes

- **$compile:** bind ng-attr-* even if unbound attribute follows ng-attr-*
  ([8b0258d8](https://github.com/angular/angular.js/commit/8b0258d878cac20cd25c0958fd6e136a08b97df6),
   [#7739](https://github.com/angular/angular.js/issues/7739))
- **$http:**
  - should not read statusText on IE<10 when request is aborted
  ([31ae3e71](https://github.com/angular/angular.js/commit/31ae3e71647eadbbe1df40f9dedb55e1e0715f98))
  - add the PATCH shortcut back
  ([b28b5caa](https://github.com/angular/angular.js/commit/b28b5caab1529b3970f10f0a4de43c0c975e3886),
   [#5894](https://github.com/angular/angular.js/issues/5894))
- **$injector:** check if a fn is an array explicitly
  ([b1a6baac](https://github.com/angular/angular.js/commit/b1a6baac2de84a1ecdc000085e8bbd016eb5c100),
   [#7904](https://github.com/angular/angular.js/issues/7904), [#2653](https://github.com/angular/angular.js/issues/2653))
- **$interval:** when canceling, use clearInterval from $window instead of global scope.
  ([a4904c0f](https://github.com/angular/angular.js/commit/a4904c0f83838222b98a875c56779a7f1a4a650a))
- **$parse:**
  - prevent invocation of Function's bind, call and apply
  ([77ada4c8](https://github.com/angular/angular.js/commit/77ada4c82d6b8fc6d977c26f3cdb48c2f5fbe5a5))
  - forbid __proto__ properties in angular expressions
  ([6081f207](https://github.com/angular/angular.js/commit/6081f20769e64a800ee8075c168412b21f026d99))
  - forbid __{define,lookup}{Getter,Setter}__ properties
  ([48fa3aad](https://github.com/angular/angular.js/commit/48fa3aadd546036c7e69f71046f659ab1de244c6))
  - forbid referencing Object in angular expressions
  ([528be29d](https://github.com/angular/angular.js/commit/528be29d1662122a34e204dd607e1c0bd9c16bbc))
  - handle constants as one-time binding expressions
  ([d9763f1b](https://github.com/angular/angular.js/commit/d9763f1bd355190b9d4e5723e4632cbc232f0543),
   [#7970](https://github.com/angular/angular.js/issues/7970))
- **$timeout/$interval:** if invokeApply is false, do not use evalAsync
  ([19b6b343](https://github.com/angular/angular.js/commit/19b6b3433ae9f8523cbc72ae97dbcf0c06960148),
   [#7999](https://github.com/angular/angular.js/issues/7999), [#7103](https://github.com/angular/angular.js/issues/7103))
- **Angular:** nodeName should always be lowercase
  ([dafb8a3c](https://github.com/angular/angular.js/commit/dafb8a3cd12e7c3247838f536c25eb796331658d),
   [#3987](https://github.com/angular/angular.js/issues/3987))
- **Angular.copy:** preserve prototype chain when copying objects
  ([b59b04f9](https://github.com/angular/angular.js/commit/b59b04f98a0b59eead53f6a53391ce1bbcbe9b57),
   [#5063](https://github.com/angular/angular.js/issues/5063), [#3767](https://github.com/angular/angular.js/issues/3767), [#4996](https://github.com/angular/angular.js/issues/4996))
- **core:** drop the toBoolean function
  ([bdfc9c02](https://github.com/angular/angular.js/commit/bdfc9c02d021e08babfbc966a007c71b4946d69d),
   [#3969](https://github.com/angular/angular.js/issues/3969), [#4277](https://github.com/angular/angular.js/issues/4277), [#7960](https://github.com/angular/angular.js/issues/7960))
- **injector:** allow multiple loading of function modules
  ([2f0a4488](https://github.com/angular/angular.js/commit/2f0a4488731fdb0e8217325dbb52a576defd09bd),
   [#7255](https://github.com/angular/angular.js/issues/7255))
- **input:**
  - improve html5 validation support
  ([1f6a5a1a](https://github.com/angular/angular.js/commit/1f6a5a1a9255a2db19a1ea4c04cdbcdbb2850b6c),
   [#7936](https://github.com/angular/angular.js/issues/7936), [#7937](https://github.com/angular/angular.js/issues/7937))
  - escape forward slash in email regexp
  ([b775e2bc](https://github.com/angular/angular.js/commit/b775e2bca1093e9df62a269b5bda968555ea0ded),
   [#7938](https://github.com/angular/angular.js/issues/7938))
- **jqLite:**
  - never add to the cache for non-element/document nodes
  ([91754a76](https://github.com/angular/angular.js/commit/91754a76e0ef9a7456a5b9819d1c5807c0a575bb),
   [#7966](https://github.com/angular/angular.js/issues/7966))
  - don't attach event handlers to comments or text nodes
  ([462dbb20](https://github.com/angular/angular.js/commit/462dbb2016a218d84760b6da171f1b15c9e416c3),
   [#7913](https://github.com/angular/angular.js/issues/7913), [#7942](https://github.com/angular/angular.js/issues/7942))
  - convert NodeList to an Array to make PhantomJS 1.x happy
  ([ceaea861](https://github.com/angular/angular.js/commit/ceaea861ebec957c99bbca6fd88ed33fbc15afbf),
   [#7851](https://github.com/angular/angular.js/issues/7851))
- **numberFilter:** correctly round fractions despite floating-point arithmetics issues in JS
  ([189cd064](https://github.com/angular/angular.js/commit/189cd064feeb710fe54ee2ca83449b3eaf82b403),
   [#7870](https://github.com/angular/angular.js/issues/7870), [#7878](https://github.com/angular/angular.js/issues/7878))
- **testabilityPatch:** fix invocations of angular.mock.dump
  ([e8e07502](https://github.com/angular/angular.js/commit/e8e07502776e48bf48b83a836f7422d164cbb1d7))


## Features

- **NgModel:**
  - port the email input type to use the validators pipeline
  ([67379242](https://github.com/angular/angular.js/commit/6737924210570e8369ab72415e3098c6df4d3f6b))
  - port the URL input type to use the validators pipeline
  ([3ee65730](https://github.com/angular/angular.js/commit/3ee65730639fc61d76e1055a6ca74e35eb48b838))
- **jqLite:** support isDefaultPrevented for triggerHandler dummies
  ([7e71acd1](https://github.com/angular/angular.js/commit/7e71acd1781ed44a7306d94338388c90f4420a24),
   [#8008](https://github.com/angular/angular.js/issues/8008))


## Performance Improvements

- **forEach:** use native for loop instead of forEach for Arrays
  ([36625de0](https://github.com/angular/angular.js/commit/36625de0d3ebc1fc091af474d942c6ce16b0a1c0))


## Breaking Changes

- **$parse:**
  - due to [77ada4c8](https://github.com/angular/angular.js/commit/77ada4c82d6b8fc6d977c26f3cdb48c2f5fbe5a5),

You can no longer invoke .bind, .call or .apply on a function in angular expressions.
This is to disallow changing the behavior of existing functions
in an unforeseen fashion.
  - due to [6081f207](https://github.com/angular/angular.js/commit/6081f20769e64a800ee8075c168412b21f026d99),

The (deprecated) __proto__ property does not work inside angular expressions
anymore.
  - due to [48fa3aad](https://github.com/angular/angular.js/commit/48fa3aadd546036c7e69f71046f659ab1de244c6),

This prevents the use of __{define,lookup}{Getter,Setter}__ inside angular
expressions. If you really need them for some reason, please wrap/bind them to make them
less dangerous, then make them available through the scope object.
  - due to [528be29d](https://github.com/angular/angular.js/commit/528be29d1662122a34e204dd607e1c0bd9c16bbc),

This prevents the use of `Object` inside angular expressions.
If you need Object.keys, make it accessible in the scope.
- **Angular.copy:** due to [b59b04f9](https://github.com/angular/angular.js/commit/b59b04f98a0b59eead53f6a53391ce1bbcbe9b57),


This changes `angular.copy` so that it applies the prototype of the original
object to the copied object.  Previously, `angular.copy` would copy properties
of the original object's prototype chain directly onto the copied object.

This means that if you iterate over only the copied object's `hasOwnProperty`
properties, it will no longer contain the properties from the prototype.
This is actually much more reasonable behavior and it is unlikely that
applications are actually relying on this.

If this behavior is relied upon, in an app, then one should simply iterate
over all the properties on the object (and its inherited properties) and
not filter them with `hasOwnProperty`.

**Be aware that this change also uses a feature that is not compatible with
IE8.**  If you need this to work on IE8 then you would need to provide a polyfill
for `Object.create` and `Object.getPrototypeOf`.
- **core:** due to [bdfc9c02](https://github.com/angular/angular.js/commit/bdfc9c02d021e08babfbc966a007c71b4946d69d),
  values 'f', '0', 'false', 'no', 'n', '[]' are no longer
treated as falsy. Only JavaScript falsy values are now treated as falsy by the
expression parser; there are six of them: false, null, undefined, NaN, 0 and "".

Closes #3969
Closes #4277
Closes #7960

- **$timeout/$interval:**
  - due to [19b6b343](https://github.com/angular/angular.js/commit/19b6b3433ae9f8523cbc72ae97dbcf0c06960148)


Previously, even if invokeApply was set to false, a $rootScope digest would occur during promise
resolution. This is no longer the case, as promises returned from $timeout and $interval will no
longer trigger $evalAsync (which in turn causes a $digest) if `invokeApply` is false.

Workarounds include manually triggering $scope.$apply(), or returning $q.defer().promise from a
promise callback, and resolving or rejecting it when appropriate.

    var interval = $interval(function() {
      if (someRequirementFulfilled) {
        $interval.cancel(interval);
        $scope.$apply();
      }
    }, 100, 0, false);

or:

    var interval = $interval(function (idx) {
      // make the magic happen
    }, 1000, 10, false);
    interval.then(function(idx) {
      var deferred = $q.defer();
      // do the asynchronous magic --- $evalAsync will cause a digest and cause
      // bindings to update.
      return deferred.promise;
    });

<a name="1.2.19"></a>
# 1.2.19 precognitive-flashbacks (2014-06-30)



## Bug Fixes

- **$compile:** bind ng-attr-* even if unbound attribute follows ng-attr-*
  ([ed59370d](https://github.com/angular/angular.js/commit/ed59370d805a88c9ac012a8e417faf2a9f902776))
- **$http:** should not read statusText on IE<10 when request is aborted
  ([0c80df21](https://github.com/angular/angular.js/commit/0c80df21b66f4b147b6b55c27ad794be5802b411))
- **$injector:** check if a fn is an array explicitly
  ([67c11b9a](https://github.com/angular/angular.js/commit/67c11b9a3914a24aaf72f36bbe038ba5efa7ddf3),
   [#7904](https://github.com/angular/angular.js/issues/7904), [#2653](https://github.com/angular/angular.js/issues/2653))
- **$interval:** when canceling, use clearInterval from $window instead of global scope.
  ([f780ccfa](https://github.com/angular/angular.js/commit/f780ccfa1c9a8d4c6191b0756ff77dc5749cf8c5))
- **$parse:**
  - make the window check in ensureSafeObject IE8 friendly
  ([ba62e975](https://github.com/angular/angular.js/commit/ba62e975f1a0cebf08dedbb1501f72b166af66db))
  - prevent invocation of Function's bind, call and apply
  ([07fa87a8](https://github.com/angular/angular.js/commit/07fa87a8a82b8be155d8c898bb79e5d9277adfb4))
  - forbid __proto__ properties in angular expressions
  ([cb713e60](https://github.com/angular/angular.js/commit/cb713e6045413a25b54ad3267476fa29efd70646))
  - forbid __{define,lookup}{Getter,Setter}__ properties
  ([89ca8597](https://github.com/angular/angular.js/commit/89ca8597341aa5585bcf728fa677022b7ec9c071))
  - forbid referencing Object in angular expressions
  ([bc6fb7cc](https://github.com/angular/angular.js/commit/bc6fb7cc94afddcb11b94f74d13812a6be1cdb64))
- **injector:** allow multiple loading of function modules
  ([d71f16e7](https://github.com/angular/angular.js/commit/d71f16e7459f1d3705ccf47a13227d4727be9670),
   [#7255](https://github.com/angular/angular.js/issues/7255))
- **input:**
  - improve html5 validation support
  ([ab2e83c8](https://github.com/angular/angular.js/commit/ab2e83c8c8fa60ca15b1a9539a6587dc363b20f1),
   [#7937](https://github.com/angular/angular.js/issues/7937), [#7957](https://github.com/angular/angular.js/issues/7957))
  - escape forward slash in email regexp
  ([2a45cea0](https://github.com/angular/angular.js/commit/2a45cea0baaf615b799b54897bfe40d32381e7a2),
   [#7938](https://github.com/angular/angular.js/issues/7938))
- **jqLite:** change expando property to a more unique name
  ([74e1cc68](https://github.com/angular/angular.js/commit/74e1cc683be315f6db05e22e185b3d27460d132a))
- **numberFilter:** correctly round fractions despite floating-point arithmetics issues in JS
  ([e5f454c8](https://github.com/angular/angular.js/commit/e5f454c8afc15336dc1faa52704a483cedfacd4a),
   [#7870](https://github.com/angular/angular.js/issues/7870), [#7878](https://github.com/angular/angular.js/issues/7878))
- **testabilityPatch:** fix invocations of angular.mock.dump
  ([5e944a1c](https://github.com/angular/angular.js/commit/5e944a1cf1356bd069d3616f24323a0cb3ace87c))


## Performance Improvements

- **jqLite:** don't use reflection to access expandoId
  ([a4faa5cd](https://github.com/angular/angular.js/commit/a4faa5cde722556bd41d75daf346c63a9b6962e9))


## Breaking Changes

- **$parse:**
  - due to [07fa87a8](https://github.com/angular/angular.js/commit/07fa87a8a82b8be155d8c898bb79e5d9277adfb4),

You can no longer invoke .bind, .call or .apply on a function in angular expressions.
This is to disallow changing the behavior of existing functions
in an unforeseen fashion.
  - due to [cb713e60](https://github.com/angular/angular.js/commit/cb713e6045413a25b54ad3267476fa29efd70646),

The (deprecated) __proto__ property does not work inside angular expressions
anymore.
  - due to [89ca8597](https://github.com/angular/angular.js/commit/89ca8597341aa5585bcf728fa677022b7ec9c071),

This prevents the use of __{define,lookup}{Getter,Setter}__ inside angular
expressions. If you really need them for some reason, please wrap/bind them to make them
less dangerous, then make them available through the scope object.
  - due to [bc6fb7cc](https://github.com/angular/angular.js/commit/bc6fb7cc94afddcb11b94f74d13812a6be1cdb64),

This prevents the use of `Object` inside angular expressions.
If you need Object.keys, make it accessible in the scope.

<a name="1.3.0-beta.13"></a>
# 1.3.0-beta.13 idiosyncratic-numerification (2014-06-16)


## Bug Fixes

- **jqLite:** change expando property to a more unique name
  ([20c3c9e2](https://github.com/angular/angular.js/commit/20c3c9e25f6417773333727549ed2ca2d3505b44))



<a name="1.3.0-beta.12"></a>
# 1.3.0-beta.12 ephemeral-acceleration (2014-06-13)


## Bug Fixes

- **$compile:**
  - ensure transclude works at root of templateUrl
  ([398053c5](https://github.com/angular/angular.js/commit/398053c56352487751d14ea41b3b892960397019),
   [#7183](https://github.com/angular/angular.js/issues/7183), [#7772](https://github.com/angular/angular.js/issues/7772))
  - always error if two directives add isolate-scope and new-scope
  ([2cde927e](https://github.com/angular/angular.js/commit/2cde927e58c8d1588569d94a797e43cdfbcedaf9),
   [#4402](https://github.com/angular/angular.js/issues/4402), [#4421](https://github.com/angular/angular.js/issues/4421))
- **$injector:** report circularity in circular dependency error message
  ([545d22b4](https://github.com/angular/angular.js/commit/545d22b47006c1efa420ba551d4850affdba8016),
   [#7500](https://github.com/angular/angular.js/issues/7500))
- **$parse:** Handle one-time to `null`
  ([600a41a7](https://github.com/angular/angular.js/commit/600a41a7b65f2dd139664fca6331c40451db75be),
   [#7743](https://github.com/angular/angular.js/issues/7743), [#7787](https://github.com/angular/angular.js/issues/7787))
- **NgModel:**
  - ensure pattern and ngPattern use the same validator
  ([1be9bb9d](https://github.com/angular/angular.js/commit/1be9bb9d3527e0758350c4f7417a4228d8571440))
  - make ngMinlength and ngMaxlength as standalone directives
  ([26d91b65](https://github.com/angular/angular.js/commit/26d91b653ac224d9d4166fea855346f5e4c4a7b4),
   [#6750](https://github.com/angular/angular.js/issues/6750))
  - make sure the ngMinlength and ngMaxlength validators use the $validators pipeline
  ([5b8e7ecf](https://github.com/angular/angular.js/commit/5b8e7ecfeb722cfc7a5d92f05b57950a2aa6158b),
   [#6304](https://github.com/angular/angular.js/issues/6304))
  - make sure the pattern validator uses the $validators pipeline
  ([e63d4253](https://github.com/angular/angular.js/commit/e63d4253d06ed7d344358e2c0b03311c548bc978))
  - make sure the required validator uses the $validators pipeline
  ([e53554a0](https://github.com/angular/angular.js/commit/e53554a0e238cba7a150fd7ccf61e5e4cc0c0426),
   [#5164](https://github.com/angular/angular.js/issues/5164))
- **jqLite:** data should store data only on Element and Document nodes
  ([a196c8bc](https://github.com/angular/angular.js/commit/a196c8bca82a28c08896d31f1863cf4ecd11401c))
- **ngResource:** don't convert literal values into Resource objects when isArray is true
  ([16dfcb61](https://github.com/angular/angular.js/commit/16dfcb61aed28cdef3bfbed540e2deea6d9e9632),
   [#6314](https://github.com/angular/angular.js/issues/6314), [#7741](https://github.com/angular/angular.js/issues/7741))


## Features

- **NgModel:** introduce the $validators pipeline
  ([a8c7cb81](https://github.com/angular/angular.js/commit/a8c7cb81c9e67b52d5c649bf3d8cec06c5976852))
- **attrs:** trigger observers for specific ng-attributes
  ([d9b90d7c](https://github.com/angular/angular.js/commit/d9b90d7c10a8e1bacbee0aeb7e86093cca9e8ed2),
   [#7758](https://github.com/angular/angular.js/issues/7758))
- **input:** add $touched and $untouched states
  ([adcc5a00](https://github.com/angular/angular.js/commit/adcc5a00bf582d2b291c18e99093bb0854f7217c))
- **ngInclude:** emit $includeContentError when HTTP request fails
  ([e4419daf](https://github.com/angular/angular.js/commit/e4419daf705d6d2d116ced573f72c24b5c53be1f),
   [#5803](https://github.com/angular/angular.js/issues/5803))


## Performance Improvements

- **$compile:** move ng-binding class stamping for interpolation into compile phase
  ([35358fdd](https://github.com/angular/angular.js/commit/35358fddc10652ef78c72cba7b7c2d5a810631d5))
- **$http:** move xsrf cookie check to after cache check in $http
  ([dd1d189e](https://github.com/angular/angular.js/commit/dd1d189ee785a37fe1d9bddf3818152db6aa210a),
   [#7717](https://github.com/angular/angular.js/issues/7717))
- **Scope:** change Scope#id to be a simple number
  ([8c6a8171](https://github.com/angular/angular.js/commit/8c6a8171f9bdaa5cdabc0cc3f7d3ce10af7b434d))
- **forEach:** cache array length
  ([55991e33](https://github.com/angular/angular.js/commit/55991e33af6fece07ea347a059da061b76fc95f5))
- **isArray:** use native Array.isArray
  ([751ebc17](https://github.com/angular/angular.js/commit/751ebc17f7fc7be26613db0a3cdee05fc401318b),
   [#7735](https://github.com/angular/angular.js/issues/7735))
- **isWindow** optimize internal isWindow call
  ([b68ac4cb](https://github.com/angular/angular.js/commit/b68ac4cb4c172447ba0022fe6e7ce0ca4cb9407e))
- **jqLite:**
  - cache collection length for all methods that work on a single element
  ([41d2eba5](https://github.com/angular/angular.js/commit/41d2eba5f8322903247280000bfc5e5e8a1c1a3e))
  - improve performance of jqLite#text
  ([92489886](https://github.com/angular/angular.js/commit/92489886dcce3bca00fe827aeb0817297b8a175c))
  - optimize adding nodes to a jqLite collection
  ([31faeaa7](https://github.com/angular/angular.js/commit/31faeaa7293716251ed437fa54432bb89d9d48de))
  - optimize element deallocation
  ([e35abc9d](https://github.com/angular/angular.js/commit/e35abc9d2fac0471cbe8089dc0e33a72b8029ada))
  - don't use reflection to access expandoId
  ([ea9a130a](https://github.com/angular/angular.js/commit/ea9a130a43d165f4f4389d01ac409dd3047efcb4))
- **ngBind:** set the ng-binding class during compilation instead of linking
  ([fd5f3896](https://github.com/angular/angular.js/commit/fd5f3896764107635310ae52df1d80a6e08fba31))
- **shallowCopy:** use Object.keys to improve performance
  ([04468db4](https://github.com/angular/angular.js/commit/04468db44185e3d7968abdb23d77bf623cb5021b))


## Breaking Changes

- **$compile:** due to [2cde927e](https://github.com/angular/angular.js/commit/2cde927e58c8d1588569d94a797e43cdfbcedaf9),


Requesting isolate scope and any other scope on a single element is an error.
Before this change, the compiler let two directives request a child scope
and an isolate scope if the compiler applied them in the order of non-isolate
scope directive followed by isolate scope directive.

Now the compiler will error regardless of the order.

If you find that your code is now throwing a `$compile:multidir` error,
check that you do not have directives on the same element that are trying
to request both an isolate and a non-isolate scope and fix your code.

Closes #4402
Closes #4421
- **NgModel:** due to [1be9bb9d](https://github.com/angular/angular.js/commit/1be9bb9d3527e0758350c4f7417a4228d8571440),


If an expression is used on ng-pattern (such as `ng-pattern="exp"`) or on the
pattern attribute (something like on `pattern="{{ exp }}"`) and the expression
itself evaluates to a string then the validator will not parse the string as a
literal regular expression object (a value like `/abc/i`).  Instead, the entire
string will be created as the regular expression to test against. This means
that any expression flags will not be placed on the RegExp object. To get around
this limitation, use a regular expression object as the value for the expression.

    //before
    $scope.exp = '/abc/i';

    //after
    $scope.exp = /abc/i;

- **Scope:** due to [8c6a8171](https://github.com/angular/angular.js/commit/8c6a8171f9bdaa5cdabc0cc3f7d3ce10af7b434d),
  Scope#$id is now of time number rather than string. Since the
id is primarily being used for debugging purposes this change should not affect
anyone.
- **forEach:** due to [55991e33](https://github.com/angular/angular.js/commit/55991e33af6fece07ea347a059da061b76fc95f5),
  forEach will iterate only over the initial number of items in
the array. So if items are added to the array during the iteration, these won't
be iterated over during the initial forEach call.

This change also makes our forEach behave more like Array#forEach.
- **jqLite:** due to [a196c8bc](https://github.com/angular/angular.js/commit/a196c8bca82a28c08896d31f1863cf4ecd11401c),
  previously it was possible to set jqLite data on Text/Comment
nodes, but now that is allowed only on Element and Document nodes just like in
jQuery. We don't expect that app code actually depends on this accidental feature.



<a name="1.2.18"></a>
# 1.2.18 ear-extendability (2014-06-13)


## Bug Fixes

- **$compile:**
  - ensure transclude works at root of templateUrl
  ([fd420c40](https://github.com/angular/angular.js/commit/fd420c40613d02b3a3f7b14d00a98664518c28f0),
   [#7183](https://github.com/angular/angular.js/issues/7183), [#7772](https://github.com/angular/angular.js/issues/7772))
  - bound transclusion to correct scope
  ([1382d4e8](https://github.com/angular/angular.js/commit/1382d4e88ec486b7749e45e6ccc864b3ec388cfe))
  - don't pass transcludes to non-transclude templateUrl directives
  ([b9ddef2a](https://github.com/angular/angular.js/commit/b9ddef2a495b44cb5fe678b8753de0b7a369244d))
  - don't pass transclude to template of non-transclude directive
  ([eafba9e2](https://github.com/angular/angular.js/commit/eafba9e2e5ddc668c534e930d83031d2e8dc32b9))
  - fix nested isolated transclude directives
  ([bb931097](https://github.com/angular/angular.js/commit/bb9310974b6765c2b87e74ee7b8485a6e9c24740),
   [#1809](https://github.com/angular/angular.js/issues/1809), [#7499](https://github.com/angular/angular.js/issues/7499))
  - pass transcludeFn down to nested transclude directives
  ([8df5f325](https://github.com/angular/angular.js/commit/8df5f3259aa776f28bf3d869fb1c03e10a897c84),
   [#7240](https://github.com/angular/angular.js/issues/7240), [#7387](https://github.com/angular/angular.js/issues/7387))
- **$injector:** report circularity in circular dependency error message
  ([14e797c1](https://github.com/angular/angular.js/commit/14e797c1a10eabd15bf8e845b62213398bcc0f58),
   [#7500](https://github.com/angular/angular.js/issues/7500))
- **ngResource:** don't convert literal values into Resource objects when isArray is true
  ([f0904cf1](https://github.com/angular/angular.js/commit/f0904cf12e4f01daa2d4fcbb20c762050125ca55),
   [#6314](https://github.com/angular/angular.js/issues/6314), [#7741](https://github.com/angular/angular.js/issues/7741))


## Performance Improvements

- **$compile:** move ng-binding class stamping for interpolation into compile phase
  ([81b7e5ab](https://github.com/angular/angular.js/commit/81b7e5ab0ee3fea410b16b09144359ceb99f5191))
- **$http:** move xsrf cookie check to after cache check in $http
  ([8b86d363](https://github.com/angular/angular.js/commit/8b86d363aa252c3264201b54b57c3e34f9632d45),
   [#7717](https://github.com/angular/angular.js/issues/7717))
- **isArray:** use native Array.isArray
  ([6c14fb1e](https://github.com/angular/angular.js/commit/6c14fb1eb61dc0a0552fbcb2ca3ace11c9a2f6a5))
- **jqLite:** cache collection length for all methods that work on a single element
  ([6d418ef5](https://github.com/angular/angular.js/commit/6d418ef5e3a775577996caf0709f79f447f77025))
- **ngBind:** set the ng-binding class during compilation instead of linking
  ([1b189027](https://github.com/angular/angular.js/commit/1b1890274e5a75553ddf9915bb23da48800275f9))



<a name="1.3.0-beta.11"></a>
# 1.3.0-beta.11 transclusion-deforestation (2014-06-06)


## Bug Fixes

- **$animate:** remove the need to add `display:block !important` for `ngShow`/`ngHide`
  ([7c011e79](https://github.com/angular/angular.js/commit/7c011e79d8b3d805755181ace472883800234bf4),
   [#3813](https://github.com/angular/angular.js/issues/3813))
- **$compile:**
  - bound transclusion to correct scope
  ([56c60218](https://github.com/angular/angular.js/commit/56c60218d1e70e3a47e37193a4a48714eeda7d44))
  - set the iteration state before linking
  ([0c8a2cd2](https://github.com/angular/angular.js/commit/0c8a2cd2da3a4a9f5d2ee9c25ea8ed56d74a93ab))
  - don't pass transcludes to non-transclude templateUrl directives
  ([2ee29c5d](https://github.com/angular/angular.js/commit/2ee29c5da81ffacdc1cabb438f5d125d5e116cb9))
  - don't pass transclude to template of non-transclude directive
  ([19af0397](https://github.com/angular/angular.js/commit/19af0397456eb8fc06dea47145fdee0e38e62f81))
  - fix nested isolated transclude directives
  ([d414b787](https://github.com/angular/angular.js/commit/d414b787173643362c0c513a1929d8e715ca340e),
   [#1809](https://github.com/angular/angular.js/issues/1809), [#7499](https://github.com/angular/angular.js/issues/7499))
  - pass transcludeFn down to nested transclude directives
  ([1fef5fe8](https://github.com/angular/angular.js/commit/1fef5fe8230e8dc53f2c9f3f510a35cf18eeab43),
   [#7240](https://github.com/angular/angular.js/issues/7240), [#7387](https://github.com/angular/angular.js/issues/7387))
- **$parse:** fix parsing error with leading space and one time bind
  ([24c844df](https://github.com/angular/angular.js/commit/24c844df3b6d80103b01e4847b2d55b082757feb),
   [#7640](https://github.com/angular/angular.js/issues/7640))
- **angular.copy:** support circular references in the value being copied
  ([083f496d](https://github.com/angular/angular.js/commit/083f496d46415c01fec6dfa012da63235d0996e4),
   [#7618](https://github.com/angular/angular.js/issues/7618))
- **angular.toJson:** only strip properties beginning with `$$`, not `$`
  ([c054288c](https://github.com/angular/angular.js/commit/c054288c9722875e3595e6e6162193e0fb67a251))
- **ngAnimate:**
  - `$animate` methods should accept native DOM elements
  ([222d4737](https://github.com/angular/angular.js/commit/222d47370e585d9de9fa842310734ba1dd895fab))
  - fix property name that is used to calculate cache key
  ([9f5c4370](https://github.com/angular/angular.js/commit/9f5c4370489043ed953c102340ce203a822c8b42),
   [#7566](https://github.com/angular/angular.js/issues/7566))
- **ngClass:** support multiple classes in key
  ([7eaaca8e](https://github.com/angular/angular.js/commit/7eaaca8ef2b3db76b7c87e98d264d4b16d90a392))
- **ngIf:** ensure that the correct (transcluded) scope is used
  ([d71df9f8](https://github.com/angular/angular.js/commit/d71df9f83cd3882295ca01b1bb8ad7fb024165b6))
- **ngLocale:** fix i18n code-generation to support `get_vf_`, `decimals_`, and `get_wt_`
  ([cbab51ca](https://github.com/angular/angular.js/commit/cbab51cac5d6460938e4dfe0035d624df2208d6c))
- **ngRepeat:** ensure that the correct (transcluded) scope is used
  ([b87e5fc0](https://github.com/angular/angular.js/commit/b87e5fc0920915991122ba5dac87b619847b3568))
- **ngShow:** ensure that the display property is never set to `block`
  ([1d90744f](https://github.com/angular/angular.js/commit/1d90744f4095ee202616a30f5d6f060fc8e74b20),
   [#7707](https://github.com/angular/angular.js/issues/7707))


## Features

- **$resource:** allow props beginning with `$` to be used on resources
  ([d3c50c84](https://github.com/angular/angular.js/commit/d3c50c845671f0f8bcc3f7842df9e2fb1d1b1c40))


## Breaking Changes

- **$compile:** due to [2ee29c5d](https://github.com/angular/angular.js/commit/2ee29c5da81ffacdc1cabb438f5d125d5e116cb9),

The isolated scope of a component directive no longer leaks into the template
that contains the instance of the directive.  This means that you can no longer
access the isolated scope from attributes on the element where the isolated
directive is defined.

See https://github.com/angular/angular.js/issues/10236 for an example.


- **$resource:** due to [d3c50c84](https://github.com/angular/angular.js/commit/d3c50c845671f0f8bcc3f7842df9e2fb1d1b1c40),

  If you expected `$resource` to strip these types of properties before,
  you will have to manually do this yourself now.

- **angular.toJson:** due to [c054288c](https://github.com/angular/angular.js/commit/c054288c9722875e3595e6e6162193e0fb67a251),

  `toJson()` will no longer strip properties starting with a single `$`. If you relied on
`toJson()`'s stripping these types of properties before, you will have to do it manually now.
It will still strip properties starting with `$$` though.



<a name="1.2.17"></a>
# 1.2.17 - quantum disentanglement (2014-06-06)


## Bug Fixes

- **$animate:**
  - remove the need to add `display:block!important` for `ngShow`/`ngHide`
  ([55b2f0e8](https://github.com/angular/angular.js/commit/55b2f0e8620465559016b424967d90a86af597c0),
   [#3813](https://github.com/angular/angular.js/issues/3813))
  - retain inline styles for property-specific transitions
  ([ad08638c](https://github.com/angular/angular.js/commit/ad08638c0ae61a22ce43d0b40e1220065b867672),
   [#7503](https://github.com/angular/angular.js/issues/7503))
  - ensure class-based animations always perform a DOM operation if skipped
  ([34d07403](https://github.com/angular/angular.js/commit/34d0740350a50ff2c3a076eaad1e8122283448c3),
   [#6957](https://github.com/angular/angular.js/issues/6957))
- **$compile:**
  - do not merge attrs that are the same for replace directives
  ([b635903e](https://github.com/angular/angular.js/commit/b635903ec435ea355b0f3688c7372627d01e23e2),
   [#7463](https://github.com/angular/angular.js/issues/7463))
  - pass `transcludeFn` down to nested transclude directives
  ([11385060](https://github.com/angular/angular.js/commit/113850602de2f8bc396df4ffd54bb0f1be565b17),
   [#7240](https://github.com/angular/angular.js/issues/7240), [#7387](https://github.com/angular/angular.js/issues/7387))
  - set `$isolateScope` correctly for sync template directives
  ([5319621a](https://github.com/angular/angular.js/commit/5319621afd0edf60aef177a0e98dbb7c282cc418),
   [#6942](https://github.com/angular/angular.js/issues/6942))
  - reference correct directive name in `ctreq` error
  ([6bea0591](https://github.com/angular/angular.js/commit/6bea0591095c19f747c08ef24cc60b34d28b2824),
   [#7062](https://github.com/angular/angular.js/issues/7062), [#7067](https://github.com/angular/angular.js/issues/7067))
  - fix regression which affected old jQuery releases
  ([a97a172e](https://github.com/angular/angular.js/commit/a97a172ee9f9bcff4d4d84854ded0c72fa0f7e9a))
- **$httpBackend:** don't error when JSONP callback is called with no parameter
  ([a7ccb753](https://github.com/angular/angular.js/commit/a7ccb7531c92fb976c6058aef2bb18316075efb2),
   [#7031](https://github.com/angular/angular.js/issues/7031))
- **$location:**
  - don't clobber path during parsing of path
  ([02058bfb](https://github.com/angular/angular.js/commit/02058bfbe27296c5441fc247e5a451da83c74134),
   [#7199](https://github.com/angular/angular.js/issues/7199))
  - fix and test html5Mode url-parsing algorithm for legacy browsers
  ([24f7999b](https://github.com/angular/angular.js/commit/24f7999bc16e347208aa18c418da85489286674b))
  - make legacy browsers behave like modern ones in html5Mode
  ([e0203660](https://github.com/angular/angular.js/commit/e0203660d3af56c5a94e0a9b69c10fd5dabcf577),
   [#6162](https://github.com/angular/angular.js/issues/6162), [#6421](https://github.com/angular/angular.js/issues/6421), [#6899](https://github.com/angular/angular.js/issues/6899), [#6832](https://github.com/angular/angular.js/issues/6832), [#6834](https://github.com/angular/angular.js/issues/6834))
- **angular.copy:** support circular references in the value being copied
  ([5c997209](https://github.com/angular/angular.js/commit/5c99720934edc35dd462b1ad02c4d0205683d917),
   [#7618](https://github.com/angular/angular.js/issues/7618))
- **grunt-utils:** ensure special inline CSS works when `angular` is not a global
  ([d4231171](https://github.com/angular/angular.js/commit/d4231171582eb41d37bbb908eed23f074ab12f3f),
   [#7176](https://github.com/angular/angular.js/issues/7176))
- **input:**
  - fix `ReferenceError` in event listener
  ([2d7cb14a](https://github.com/angular/angular.js/commit/2d7cb14a167560edc1356dcec6f9e100ed7ac691))
  - don't dirty model when input event is triggered due to a placeholder change
  ([109e5d1d](https://github.com/angular/angular.js/commit/109e5d1d39015af8ade1dc2aff31a2355fbab0a6),
   [#2614](https://github.com/angular/angular.js/issues/2614), [#5960](https://github.com/angular/angular.js/issues/5960))
- **jqLite:** use jQuery only if `jQuery.fn.on` is present
  ([fafcd628](https://github.com/angular/angular.js/commit/fafcd6285a6799c4e377ea33011ae3a01aac49a6))
- **limitTo:** do not convert `Infinity` to `NaN`
  ([fcdac65a](https://github.com/angular/angular.js/commit/fcdac65aedfdf48dd2e11d6e5850e03ec188f068),
   [#6771](https://github.com/angular/angular.js/issues/6771), [#7118](https://github.com/angular/angular.js/issues/7118))
- **ngAnimate:** `$animate` methods should accept native DOM elements
  ([9227a5db](https://github.com/angular/angular.js/commit/9227a5db947a78e3dbe8b91d5dac5d67444c855c))
- **ngClass:**
  - support multiple classes in key
  ([85ce5d0d](https://github.com/angular/angular.js/commit/85ce5d0db9fc4ee5636015fc042224785f9aa997))
  - handle index changes when an item is unshifted
  ([a4cc9e19](https://github.com/angular/angular.js/commit/a4cc9e194468573bae5232f63044459d0de6638f),
   [#7256](https://github.com/angular/angular.js/issues/7256))
- **ngLocale:** fix i18n code-generation to support `get_vf_`, `decimals_`, and `get_wt_`
  ([96a31476](https://github.com/angular/angular.js/commit/96a314766c41bbb18bcddeddd25c8e566ab76acd))
- **ngSanitize:** encode surrogate pair properly
  ([3d0b49c0](https://github.com/angular/angular.js/commit/3d0b49c07f10c0a723c91629c63705647b690d81),
   [#5088](https://github.com/angular/angular.js/issues/5088), [#6911](https://github.com/angular/angular.js/issues/6911))
- **ngSwitch:** properly support case labels with different numbers of transclude fns
  ([32aa4915](https://github.com/angular/angular.js/commit/32aa491588fe4982d4056e89a5d0dd19cf835e72))
- **numberFilter:** fix rounding error edge case
  ([0388eed7](https://github.com/angular/angular.js/commit/0388eed7e52fdbb832a5b4ef466420a128a43800),
   [#7453](https://github.com/angular/angular.js/issues/7453), [#7478](https://github.com/angular/angular.js/issues/7478))


## Features

- **ngMock:** add support of mocha tdd interface
  ([6d1c6772](https://github.com/angular/angular.js/commit/6d1c67727ab872c44addc783ef1406952142d89e),
   [#7489](https://github.com/angular/angular.js/issues/7489))


## Performance Improvements

- **$interpolate:** optimize value stringification
  ([9d4fa33e](https://github.com/angular/angular.js/commit/9d4fa33e35d73ab28a8a187e20dfbe1f77055825),
   [#7501](https://github.com/angular/angular.js/issues/7501))
- **scope:** 10x. Share the child scope class.
  ([9ab9bf6b](https://github.com/angular/angular.js/commit/9ab9bf6b415aa216cfbfda040286e5ec99f56ee0))




<a name="1.3.0-beta.10"></a>
# 1.3.0-beta.10 excessive-clarification (2014-05-23)


## Bug Fixes

- **$animate:** retain inline styles for property-specific transitions
  ([98b9d68e](https://github.com/angular/angular.js/commit/98b9d68ea3ecfb521e9279c9cbfe93f8ba7d626e),
   [#7503](https://github.com/angular/angular.js/issues/7503))
- **$compile:** do not merge attrs that are the same for replace directives
  ([1ab6e908](https://github.com/angular/angular.js/commit/1ab6e908b15470d59b52eb0ead20c755c66ec3b8),
   [#7463](https://github.com/angular/angular.js/issues/7463))
- **$parse:** remove deprecated promise unwrapping
  ([fa6e411d](https://github.com/angular/angular.js/commit/fa6e411da26824a5bae55f37ce7dbb859653276d))
- **Scope:** $broadcast and $emit should set event.currentScope to null
  ([82f45aee](https://github.com/angular/angular.js/commit/82f45aee5bd84d1cc53fb2e8f645d2263cdaacbc),
   [#7445](https://github.com/angular/angular.js/issues/7445), [#7523](https://github.com/angular/angular.js/issues/7523))
- **ngModel:** do not dirty the input on $commitViewValue if nothing was changed
  ([facd904a](https://github.com/angular/angular.js/commit/facd904a613e716151a13ab7460b5e6206e0442b),
   [#7457](https://github.com/angular/angular.js/issues/7457), [#7495](https://github.com/angular/angular.js/issues/7495))


## Features

- **$interpolate:** escaped interpolation expressions
  ([e3f78c17](https://github.com/angular/angular.js/commit/e3f78c17d3b5d3a714402d7314094aabe7f6512a),
   [#5601](https://github.com/angular/angular.js/issues/5601), [#7517](https://github.com/angular/angular.js/issues/7517))
- **{{ bindings }}:** lazy one-time binding support
  ([cee429f0](https://github.com/angular/angular.js/commit/cee429f0aaebf32ef1c9aedd8447a48f163dd0a4),
   [#7486](https://github.com/angular/angular.js/issues/7486), [#5408](https://github.com/angular/angular.js/issues/5408))
- **ngMock:** add support of mocha tdd interface
  ([854bf5b7](https://github.com/angular/angular.js/commit/854bf5b74d0395f4d2e30382102d3f5d1614ea11),
   [#7489](https://github.com/angular/angular.js/issues/7489))


## Performance Improvements

- **$interpolate:** optimize value stringification
  ([e927193d](https://github.com/angular/angular.js/commit/e927193de06500f01a2f893934250911cf1905e6),
   [#7501](https://github.com/angular/angular.js/issues/7501))


## Breaking Changes

- **$compile:** due to [eec6394a](https://github.com/angular/angular.js/commit/eec6394a342fb92fba5270eee11c83f1d895e9fb), The `replace` flag for defining directives that
  replace the element that they are on will be removed in the next major angular version.
  This feature has difficult semantics (e.g. how attributes are merged) and leads to more
  problems compared to what it solves. Also, with Web Components it is normal to have
  custom elements in the DOM.

- **$parse:** due to [fa6e411d](https://github.com/angular/angular.js/commit/fa6e411da26824a5bae55f37ce7dbb859653276d),
  promise unwrapping has been removed. It has been deprecated since 1.2.0-rc.3.
  It can no longer be turned on.
  Two methods have been removed:
  * `$parseProvider.unwrapPromises`
  * `$parseProvider.logPromiseWarnings`

- **Scope:** due to [82f45aee](https://github.com/angular/angular.js/commit/82f45aee5bd84d1cc53fb2e8f645d2263cdaacbc),
  [#7445](https://github.com/angular/angular.js/issues/7445),
  [#7523](https://github.com/angular/angular.js/issues/7523)
  `$broadcast` and `$emit` will now reset the `currentScope` property of the event to
  null once the event finished propagating. If any code depends on asynchronously accessing their
  `currentScope` property, it should be migrated to use `targetScope` instead. All of these cases
  should be considered programming bugs.


<a name="1.3.0-beta.9"></a>
# 1.3.0-beta.9 release-naming (2014-05-16)


## Bug Fixes

- **$compile:** pass `transcludeFn` down to nested transclude directives
  ([4f03dc5a](https://github.com/angular/angular.js/commit/4f03dc5a9650f3f22f78b438474322b4b8871dec),
   [#7240](https://github.com/angular/angular.js/issues/7240), [#7387](https://github.com/angular/angular.js/issues/7387))
- **jqLite:** use jQuery only if jQuery.fn.on present
  ([e9bc51cb](https://github.com/angular/angular.js/commit/e9bc51cb0964ea682c1654919174dacebd09fcf6))
- **ngClass:** handle index changes when an item is unshifted
  ([5fbd618c](https://github.com/angular/angular.js/commit/5fbd618c2ff0dbaa4e19d0fd0e55921ce7d89478),
   [#7256](https://github.com/angular/angular.js/issues/7256))
- **ngMessages:** annotate ngMessages controller for minification
  ([0282ca97](https://github.com/angular/angular.js/commit/0282ca971df7923c8f3dba0eb0df544e244e5b93))
- **numberFilter:** fix rounding error edge case
  ([81d427b5](https://github.com/angular/angular.js/commit/81d427b5f0d3502f65e8db5beaa5ad837c9ede17),
   [#7453](https://github.com/angular/angular.js/issues/7453), [#7478](https://github.com/angular/angular.js/issues/7478))


## Features

- **ngTouch:** add optional `ngSwipeDisableMouse` attribute to `ngSwipe` directives to ignore mouse events.
  ([5a568b4f](https://github.com/angular/angular.js/commit/5a568b4f960cc5381b3911e3a6423aff2ff7f7f9),
   [#6627](https://github.com/angular/angular.js/issues/6627), [#6626](https://github.com/angular/angular.js/issues/6626))


## Breaking Changes

- **jqLite:** due to [d71dbb1a](https://github.com/angular/angular.js/commit/d71dbb1ae50f174680533492ce4c7db3ff74df00),
  the jQuery `detach()` method does not trigger the `$destroy` event.
  If you want to destroy Angular data attached to the element, use `remove()`.


<a name="1.3.0-beta.8"></a>
# 1.3.0-beta.8 accidental-haiku (2014-05-09)


## Bug Fixes

- **$compile:** set $isolateScope correctly for sync template directives
  ([562c4e42](https://github.com/angular/angular.js/commit/562c4e424b0ed5f8d4bffba0cd18e66db2059043),
   [#6942](https://github.com/angular/angular.js/issues/6942))
- **$httpBackend:** Add missing expectHEAD() method
  ([e1d61784](https://github.com/angular/angular.js/commit/e1d6178457045e721872022f71227b277cb88726),
   [#7320](https://github.com/angular/angular.js/issues/7320))
- **$interpolate:** don't ReferenceError when context is undefined
  ([924ee6db](https://github.com/angular/angular.js/commit/924ee6db06a2518224caada86769efedd21c0710),
   [#7230](https://github.com/angular/angular.js/issues/7230), [#7237](https://github.com/angular/angular.js/issues/7237))
- **grunt-utils:** ensure special inline CSS works when `angular` is not a global
  ([af72f40a](https://github.com/angular/angular.js/commit/af72f40a5512daa97c1f175a59b547c33cff1dc0),
   [#7176](https://github.com/angular/angular.js/issues/7176))
- **injector:** invoke config blocks for module after all providers
  ([c0b4e2db](https://github.com/angular/angular.js/commit/c0b4e2db9cbc8bc3164cedc4646145d3ab72536e),
   [#7139](https://github.com/angular/angular.js/issues/7139), [#7147](https://github.com/angular/angular.js/issues/7147))
- **ngModelOptions:**
  - enable overriding the default with a debounce of zero
  ([c56e32a7](https://github.com/angular/angular.js/commit/c56e32a7fa44e2edd2c70f663906720c7c9ad898),
   [#7205](https://github.com/angular/angular.js/issues/7205))
  - initialize ngModelOptions in prelink
  ([fbf5ab8f](https://github.com/angular/angular.js/commit/fbf5ab8f17d28efeadb492c5a252f0778643f072),
   [#7281](https://github.com/angular/angular.js/issues/7281), [#7292](https://github.com/angular/angular.js/issues/7292))
- **ngSanitize:** encode surrogate pair properly
  ([627b0354](https://github.com/angular/angular.js/commit/627b0354ec35bef5c6dbfab6469168c2fadcbee5),
   [#5088](https://github.com/angular/angular.js/issues/5088), [#6911](https://github.com/angular/angular.js/issues/6911))
- **ngSrc, ngSrcset:** only interpolate if all expressions are defined
  ([8d180383](https://github.com/angular/angular.js/commit/8d180383014cbe38d58ff3eab083f51cfcfb8dde),
   [#6984](https://github.com/angular/angular.js/issues/6984))
- **ngSwitch:** properly support case labels with different numbers of transclude fns
  ([ac37915e](https://github.com/angular/angular.js/commit/ac37915ef64c60ec8f8d4e49e4d61d7baeb96ba0),
   [#7372](https://github.com/angular/angular.js/issues/7372), [#7373](https://github.com/angular/angular.js/issues/7373))


## Features

- **$compile:** allow SVG and MathML templates via special `type` property
  ([f0e12ea7](https://github.com/angular/angular.js/commit/f0e12ea7fea853192e4eead00b40d6041c5f914a),
   [#7265](https://github.com/angular/angular.js/issues/7265))
- **$interpolate:** add optional allOrNothing param
  ([c2362e3f](https://github.com/angular/angular.js/commit/c2362e3f45e732a9defdb0ea59ce4ec5236fcd3a))
- **FormController:** commit `$viewValue` of all child controls when form is submitted
  ([a0ae07bd](https://github.com/angular/angular.js/commit/a0ae07bd4ee8d98654df4eb261d16ca55884e374),
   [#7017](https://github.com/angular/angular.js/issues/7017))
- **NgMessages:** introduce the NgMessages module and directives
  ([0f4016c8](https://github.com/angular/angular.js/commit/0f4016c84a47e01a0fb993867dfd0a64828c089c))


## Breaking Changes

- **$http:** due to [ad4336f9](https://github.com/angular/angular.js/commit/ad4336f9359a073e272930f8f9bcd36587a8648f),


Previously, it was possible to register a response interceptor like so:

```js
// register the interceptor as a service
$provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
  return function(promise) {
    return promise.then(function(response) {
      // do something on success
      return response;
    }, function(response) {
      // do something on error
      if (canRecover(response)) {
        return responseOrNewPromise
      }
      return $q.reject(response);
    });
  }
});

$httpProvider.responseInterceptors.push('myHttpInterceptor');
```

Now, one must use the newer API introduced in v1.1.4 (4ae46814), like so:

```js
$provide.factory('myHttpInterceptor', function($q) {
  return {
    response: function(response) {
      // do something on success
      return response;
    },
    responseError: function(response) {
      // do something on error
      if (canRecover(response)) {
        return responseOrNewPromise
      }
      return $q.reject(response);
    }
  };
});

$httpProvider.interceptors.push('myHttpInterceptor');
```

More details on the new interceptors API (which has been around as of v1.1.4) can be found at
https://docs.angularjs.org/api/ng/service/$http#interceptors


- **injector:** due to [c0b4e2db](https://github.com/angular/angular.js/commit/c0b4e2db9cbc8bc3164cedc4646145d3ab72536e),

Previously, config blocks would be able to control behavior of provider registration, due to being
invoked prior to provider registration. Now, provider registration always occurs prior to configuration
for a given module, and therefore config blocks are not able to have any control over a providers
registration.

**Example**:

Previously, the following:

```js
angular.module('foo', [])
  .provider('$rootProvider', function() {
    this.$get = function() { ... }
  })
  .config(function($rootProvider) {
    $rootProvider.dependentMode = "B";
  })
  .provider('$dependentProvider', function($rootProvider) {
     if ($rootProvider.dependentMode === "A") {
       this.$get = function() {
        // Special mode!
       }
     } else {
       this.$get = function() {
         // something else
       }
    }
  });
```

would have "worked", meaning behavior of the config block between the registration of "$rootProvider"
and "$dependentProvider" would have actually accomplished something and changed the behavior of the
app. This is no longer possible within a single module.


- **ngModelOptions:** due to [adfc322b](https://github.com/angular/angular.js/commit/adfc322b04a58158fb9697e5b99aab9ca63c80bb),


This commit changes the API on `NgModelController`, both semantically and
in terms of adding and renaming methods.

* `$setViewValue(value)` -
This method still changes the `$viewValue` but does not immediately commit this
change through to the `$modelValue` as it did previously.
Now the value is committed only when a trigger specified in an associated
`ngModelOptions` directive occurs. If `ngModelOptions` also has a `debounce` delay
specified for the trigger then the change will also be debounced before being
committed.
In most cases this should not have a significant impact on how `NgModelController`
is used: If `updateOn` includes `default` then `$setViewValue` will trigger
a (potentially debounced) commit immediately.
* `$cancelUpdate()` - is renamed to `$rollbackViewValue()` and has the same meaning,
which is to revert the current `$viewValue` back to the `$lastCommittedViewValue`,
to cancel any pending debounced updates and to re-render the input.

To migrate code that used `$cancelUpdate()` follow the example below:

Before:

```js
$scope.resetWithCancel = function (e) {
  if (e.keyCode == 27) {
    $scope.myForm.myInput1.$cancelUpdate();
    $scope.myValue = '';
  }
};
```

After:

```js
$scope.resetWithCancel = function (e) {
  if (e.keyCode == 27) {
    $scope.myForm.myInput1.$rollbackViewValue();
    $scope.myValue = '';
  }
}
```


<a name="v1.3.0-beta.7"></a>
# v1.3.0-beta.7 proper-attribution (2014-04-25)


## Bug Fixes

- **$location:** don't clobber path during parsing of path
  ([498835a1](https://github.com/angular/angular.js/commit/498835a1c4d0dc6397df4dd667796b09565fedf4),
   [#7199](https://github.com/angular/angular.js/issues/7199))


## Performance Improvements

- **scope:** ~10x speedup from sharing the child scope class.
  ([8377e818](https://github.com/angular/angular.js/commit/8377e81827a840b9eb64f119de4bcbaba0ceb3be))


<a name="v1.3.0-beta.6"></a>
# v1.3.0-beta.6 expedient-caffeination (2014-04-21)


## Bug Fixes

- **$animate:** ensure class-based animations always perform a domOperation if skipped
  ([708f2ba9](https://github.com/angular/angular.js/commit/708f2ba9843b665e417b93c7df907194565db991),
   [#6957](https://github.com/angular/angular.js/issues/6957))
- **$compile:**
  - reference correct directive name in ctreq error
  ([1192531e](https://github.com/angular/angular.js/commit/1192531e9b48cd90cbb601b0c0fdeb12340c1885),
   [#7062](https://github.com/angular/angular.js/issues/7062), [#7067](https://github.com/angular/angular.js/issues/7067))
  - fix regression which affected old jQuery releases
  ([ef64169d](https://github.com/angular/angular.js/commit/ef64169db32ffdf5e0e3ae2154ac434c6a55378b))
- **$location:**
  - fix and test html5Mode url-parsing algorithm for legacy browsers
  ([49e7c32b](https://github.com/angular/angular.js/commit/49e7c32bb45ce3984df6768ba7b2f6a723a4ebe7))
  - make legacy browsers behave like modern ones in html5Mode
  ([3f047704](https://github.com/angular/angular.js/commit/3f047704c70a957596371fec554d3e1fb066a29d),
   [#6162](https://github.com/angular/angular.js/issues/6162), [#6421](https://github.com/angular/angular.js/issues/6421), [#6899](https://github.com/angular/angular.js/issues/6899), [#6832](https://github.com/angular/angular.js/issues/6832), [#6834](https://github.com/angular/angular.js/issues/6834))
- **input:** don't dirty model when input event triggered due to placeholder change
  ([ff428e72](https://github.com/angular/angular.js/commit/ff428e72837c85b9540ee9e5a3daa2c9477c90bb),
   [#2614](https://github.com/angular/angular.js/issues/2614), [#5960](https://github.com/angular/angular.js/issues/5960))
- **limitTo:** do not convert Infinity to NaN
  ([5dee9e4a](https://github.com/angular/angular.js/commit/5dee9e4a33ab2a0be6d8a8099297be3028771e0b),
   [#6771](https://github.com/angular/angular.js/issues/6771), [#7118](https://github.com/angular/angular.js/issues/7118))
- **ngModelController:** introduce $cancelUpdate to cancel pending updates
  ([940fcb40](https://github.com/angular/angular.js/commit/940fcb4090e96824a4abc50252aa36aaf239e937),
   [#6994](https://github.com/angular/angular.js/issues/6994), [#7014](https://github.com/angular/angular.js/issues/7014))


## Features

- **$resource:** Make stripping of trailing slashes configurable.
  ([3878be52](https://github.com/angular/angular.js/commit/3878be52f6d95fca4c386d4a5523f3c8fcb04270))
- **Scope:** add `$watchGroup` method for observing a set of expressions
  ([21f93163](https://github.com/angular/angular.js/commit/21f93163384f36fc4ae0934387339380e3dc3e9c))
- **injector:** "strict-DI" mode which disables "automatic" function annotation
  ([4b1695ec](https://github.com/angular/angular.js/commit/4b1695ec61aac8de7fcac1dfe8b4b420f9842c38),
   [#6719](https://github.com/angular/angular.js/issues/6719), [#6717](https://github.com/angular/angular.js/issues/6717), [#4504](https://github.com/angular/angular.js/issues/4504), [#6069](https://github.com/angular/angular.js/issues/6069), [#3611](https://github.com/angular/angular.js/issues/3611))
- **ngModelOptions:** custom triggers and debounce of ngModel updates
  ([dbe381f2](https://github.com/angular/angular.js/commit/dbe381f29fc72490f8e3a5328d5c487b185fe652),
   [#1285](https://github.com/angular/angular.js/issues/1285))


## Performance Improvements

- **$compile:** watch interpolated expressions individually
  ([0ebfa0d1](https://github.com/angular/angular.js/commit/0ebfa0d112c8ba42242cb8353db91e93eb42b463))
- **$interpolate:** speed up interpolation by recreating watchGroup approach
  ([546cb429](https://github.com/angular/angular.js/commit/546cb429d9cea25a9bdadbb87dfd401366b0b908))


## Breaking Changes

- **$interpolate:** due to [88c2193c](https://github.com/angular/angular.js/commit/88c2193c71954b9e7e7e4bdf636a2b168d36300d),
  the function returned by `$interpolate`
  no longer has a `.parts` array set on it.

  Instead it has two arrays:
  * `.expressions`, an array of the expressions in the
    interpolated text. The expressions are parsed with
    `$parse`, with an extra layer converting them to strings
    when computed
  * `.separators`, an array of strings representing the
    separations between interpolations in the text.
    This array is **always** 1 item longer than the
    `.expressions` array for easy merging with it


<a name="1.3.0-beta.5"></a>
# 1.3.0-beta.5 chimeric-glitterfication (2014-04-03)


## Bug Fixes

- **$animate:**
  - insert elements at the start of the parent container instead of at the end
  ([1cb8584e](https://github.com/angular/angular.js/commit/1cb8584e8490ecdb1b410a8846c4478c6c2c0e53),
   [#4934](https://github.com/angular/angular.js/issues/4934), [#6275](https://github.com/angular/angular.js/issues/6275))
  - ensure the CSS driver properly works with SVG elements
  ([c67bd69c](https://github.com/angular/angular.js/commit/c67bd69c58812da82b1a3a31d430df7aad8a50a8),
   [#6030](https://github.com/angular/angular.js/issues/6030))
- **$parse:** mark constant unary minus expressions as constant
  ([7914d346](https://github.com/angular/angular.js/commit/7914d3463b5ec560c616a0c9fd008bc0e3f7c786),
   [#6932](https://github.com/angular/angular.js/issues/6932))
- **Scope:**
  - revert the `__proto__` cleanup as that could cause regressions
  ([71c11e96](https://github.com/angular/angular.js/commit/71c11e96c64d5d4eb71f48c1eb778c2ba5c63377))
  - more scope clean up on $destroy to minimize leaks
  ([d64d41ed](https://github.com/angular/angular.js/commit/d64d41ed992430a4fc89cd415c03acf8d56022e6),
   [#6794](https://github.com/angular/angular.js/issues/6794), [#6856](https://github.com/angular/angular.js/issues/6856), [#6968](https://github.com/angular/angular.js/issues/6968))
- **ngClass:** handle ngClassOdd/Even affecting the same classes
  ([c9677920](https://github.com/angular/angular.js/commit/c9677920d462046710fc72ca422ab7400f551d2e),
   [#5271](https://github.com/angular/angular.js/issues/5271))


## Breaking Changes

- **$animate:** due to [1cb8584e](https://github.com/angular/angular.js/commit/1cb8584e8490ecdb1b410a8846c4478c6c2c0e53),
`$animate` will no longer default the after parameter to the last element of the parent
container. Instead, when after is not specified, the new element will be inserted as the
first child of the parent container.

To update existing code, change all instances of `$animate.enter()` or `$animate.move()` from:

`$animate.enter(element, parent);`

to:

`$animate.enter(element, parent, angular.element(parent[0].lastChild));`


<a name="1.2.16"></a>
# 1.2.16 badger-enumeration (2014-04-03)


## Bug Fixes

- **$animate:**
  - ensure the CSS driver properly works with SVG elements
  ([38ea5426](https://github.com/angular/angular.js/commit/38ea542662b2b74703d583e3a637d65369fc26eb),
   [#6030](https://github.com/angular/angular.js/issues/6030))
  - prevent cancellation timestamp from being too far in the future
  ([35d635cb](https://github.com/angular/angular.js/commit/35d635cbcbdc20f304781655f3563111afa6567f),
   [#6748](https://github.com/angular/angular.js/issues/6748))
  - run CSS animations before JS animations to avoid style inheritance
  ([0e5106ec](https://github.com/angular/angular.js/commit/0e5106ec2ccc8596c589b89074d3b27d27bf395a),
   [#6675](https://github.com/angular/angular.js/issues/6675))
- **$parse:** mark constant unary minus expressions as constant
  ([6e420ff2](https://github.com/angular/angular.js/commit/6e420ff28d9b3e76ac2c3598bf3797540ef8a1d3),
   [#6932](https://github.com/angular/angular.js/issues/6932))
- **Scope:**
  - revert the __proto__ cleanup as that could cause regressions
  ([2db66f5b](https://github.com/angular/angular.js/commit/2db66f5b695a06cff62a52e55e55d1a0a25eec2f))
  - more scope clean up on $destroy to minimize leaks
  ([7e4e696e](https://github.com/angular/angular.js/commit/7e4e696ec3adf9d6fc77a7aa7e0909a9675fd43a),
   [#6794](https://github.com/angular/angular.js/issues/6794), [#6856](https://github.com/angular/angular.js/issues/6856), [#6968](https://github.com/angular/angular.js/issues/6968))
  - aggressively clean up scope on $destroy to minimize leaks
  ([8d4d437e](https://github.com/angular/angular.js/commit/8d4d437e8cd8d7cebab5d9ae5c8bcfeef2118ce9),
   [#6794](https://github.com/angular/angular.js/issues/6794), [#6856](https://github.com/angular/angular.js/issues/6856))
- **filter.ngdoc:** Check if "input" variable is defined
  ([a275d539](https://github.com/angular/angular.js/commit/a275d539f9631d6ec64d03814b3b09420e6cf1ee),
   [#6819](https://github.com/angular/angular.js/issues/6819))
- **input:** don't perform HTML5 validation on updated model-value
  ([b2363e31](https://github.com/angular/angular.js/commit/b2363e31023df8240113f68b4e01d942f8009b60),
   [#6796](https://github.com/angular/angular.js/issues/6796), [#6806](https://github.com/angular/angular.js/issues/6806))
- **ngClass:** handle ngClassOdd/Even affecting the same classes
  ([55fe6d63](https://github.com/angular/angular.js/commit/55fe6d6331e501325c2658df8995dcc083fc4ffb),
   [#5271](https://github.com/angular/angular.js/issues/5271))


## Features

- **$http:** add xhr statusText to completeRequest callback
  ([32c09c1d](https://github.com/angular/angular.js/commit/32c09c1d195fcb98f6e29fc7e554a867f4762301),
   [#2335](https://github.com/angular/angular.js/issues/2335), [#2665](https://github.com/angular/angular.js/issues/2665), [#6713](https://github.com/angular/angular.js/issues/6713))


<a name="1.3.0-beta.4"></a>
# 1.3.0-beta.4 inconspicuous-deception (2014-03-28)


## Bug Fixes

- **$animate:**
  - prevent cancellation timestamp from being too far in the future
  ([ff5cf736](https://github.com/angular/angular.js/commit/ff5cf736e5b8073c8121295743873ccd04cc7d6b),
   [#6748](https://github.com/angular/angular.js/issues/6748))
  - make CSS blocking optional for class-based animations
  ([1bebe36a](https://github.com/angular/angular.js/commit/1bebe36aa938890d61188762ed618b1b5e193634),
   [#6674](https://github.com/angular/angular.js/issues/6674), [#6739](https://github.com/angular/angular.js/issues/6739))
  - run CSS animations before JS animations to avoid style inheritance
  ([2317af68](https://github.com/angular/angular.js/commit/2317af68510fe3b67526282dad697ad4dc621a19),
   [#6675](https://github.com/angular/angular.js/issues/6675))
- **Scope:** aggressively clean up scope on $destroy to minimize leaks
  ([f552f251](https://github.com/angular/angular.js/commit/f552f25171390e726ad7246ed18b994970bcf764),
   [#6794](https://github.com/angular/angular.js/issues/6794), [#6856](https://github.com/angular/angular.js/issues/6856))
- **doc-gen:** Run Gulp on Windows too
  ([47ba6014](https://github.com/angular/angular.js/commit/47ba60146032c0bfadeaa9f3816644b31fc33315),
   [#6346](https://github.com/angular/angular.js/issues/6346))
- **filter.ngdoc:** Check if "input" variable is defined
  ([4a6d4de5](https://github.com/angular/angular.js/commit/4a6d4de53ed1472c0cb2323292127495619d7ed9),
   [#6819](https://github.com/angular/angular.js/issues/6819))
- **input:** don't perform HTML5 validation on updated model-value
  ([b472d027](https://github.com/angular/angular.js/commit/b472d0275f2900beba3b1f2fcee821369f8c15c1),
   [#6796](https://github.com/angular/angular.js/issues/6796), [#6806](https://github.com/angular/angular.js/issues/6806))


## Features

- **$http:** add xhr statusText to completeRequest callback
  ([1d2414ca](https://github.com/angular/angular.js/commit/1d2414ca93a0340840ea1e80c48edb51ec55cd48),
   [#2335](https://github.com/angular/angular.js/issues/2335), [#2665](https://github.com/angular/angular.js/issues/2665), [#6713](https://github.com/angular/angular.js/issues/6713))


## Breaking Changes

- **$animate:** due to [1bebe36a](https://github.com/angular/angular.js/commit/1bebe36aa938890d61188762ed618b1b5e193634),

  Any class-based animation code that makes use of transitions
and uses the setup CSS classes (such as class-add and class-remove) must now
provide a empty transition value to ensure that its styling is applied right
away. In other words if your animation code is expecting any styling to be
applied that is defined in the setup class then it will not be applied
"instantly" unless a `transition:0s none` value is present in the styling
for that CSS class. This situation is only the case if a transition is already
present on the base CSS class once the animation kicks off.

Before:

    .animated.my-class-add {
      opacity:0;
      transition:0.5s linear all;
    }
    .animated.my-class-add.my-class-add-active {
      opacity:1;
    }

After:

    .animated.my-class-add {
      transition:0s linear all;
      opacity:0;
    }
    .animated.my-class-add.my-class-add-active {
      transition:0.5s linear all;
      opacity:1;
    }

Please view the documentation for ngAnimate for more info.


<a name="1.3.0-beta.3"></a>
# 1.3.0-beta.3 emotional-waffles (2014-03-21)


## Bug Fixes

- **ngAnimate:** support `webkitCancelRequestAnimationFrame` in addition to `webkitCancelAnimationFrame`
  ([c839f78b](https://github.com/angular/angular.js/commit/c839f78b8f2d8d910bc2bfc9e41b3e3b67090ec1),
   [#6526](https://github.com/angular/angular.js/issues/6526))
- **$http:** allow sending Blob data using `$http`
  ([b8cc71d4](https://github.com/angular/angular.js/commit/b8cc71d476f76ff51e719fb76fb2348027c858ce),
   [#5012](https://github.com/angular/angular.js/issues/5012))
- **$httpBackend:** don't error when JSONP callback is called with no parameter
  ([6680b7b9](https://github.com/angular/angular.js/commit/6680b7b97c0326a80bdccaf0a35031e4af641e0e),
   [#4987](https://github.com/angular/angular.js/issues/4987), [#6735](https://github.com/angular/angular.js/issues/6735))
- **$rootScope:** ng-repeat can't handle `NaN` values. #4605
  ([fb6062fb](https://github.com/angular/angular.js/commit/fb6062fb9d83545730b993e94ac7482ffd43a62c),
   [#4605](https://github.com/angular/angular.js/issues/4605))
- **$rootScope:** `$watchCollection` should call listener with old value
  ([78057a94](https://github.com/angular/angular.js/commit/78057a945ef84cbb05f9417fe884cb8c28e67b44),
   [#2621](https://github.com/angular/angular.js/issues/2621), [#5661](https://github.com/angular/angular.js/issues/5661), [#5688](https://github.com/angular/angular.js/issues/5688), [#6736](https://github.com/angular/angular.js/issues/6736))
- **angular.bootstrap:** allow angular to load only once
  ([748a6c8d](https://github.com/angular/angular.js/commit/748a6c8d9d8d61c3ee18eec462abe8ff245d6a98),
   [#5863](https://github.com/angular/angular.js/issues/5863), [#5587](https://github.com/angular/angular.js/issues/5587))
- **jqLite:** `inheritedData()` now traverses Shadow DOM boundaries via the `host` property of `DocumentFragment`
  ([8a96f317](https://github.com/angular/angular.js/commit/8a96f317e594a5096d4fa56ceae4c685eec8ac8b),
   [#6637](https://github.com/angular/angular.js/issues/6637))
- **ngCookie:** convert non-string values to string
  ([36528310](https://github.com/angular/angular.js/commit/3652831084c3788f786046b907a7361d2e89c520),
   [#6151](https://github.com/angular/angular.js/issues/6151), [#6220](https://github.com/angular/angular.js/issues/6220))
- **ngTouch:** update workaround for Webkit quirk
  ([bc42950b](https://github.com/angular/angular.js/commit/bc42950b514b60f319812eeb87aae2915e394237),
   [#6302](https://github.com/angular/angular.js/issues/6302))
- **orderBy:** support string predicates containing non-ident characters
  ([37bc5ef4](https://github.com/angular/angular.js/commit/37bc5ef4d87f19da47d3ab454c43d1e532c4f924),
   [#6143](https://github.com/angular/angular.js/issues/6143), [#6144](https://github.com/angular/angular.js/issues/6144))
- **select:** avoid checking option element's `selected` property in render
  ([f40f54c6](https://github.com/angular/angular.js/commit/f40f54c6da4a5399fe18a89d068634bb491e9f1a),
   [#2448](https://github.com/angular/angular.js/issues/2448), [#5994](https://github.com/angular/angular.js/issues/5994))


## Features

- **$compile:** add support for `$observer` deregistration
  ([299b220f](https://github.com/angular/angular.js/commit/299b220f5e05e1d4e26bfd58d0b2fd7329ca76b1),
   [#5609](https://github.com/angular/angular.js/issues/5609))
- **ngMock.$httpBackend:** added support for function as URL matcher
  ([d6cfcace](https://github.com/angular/angular.js/commit/d6cfcacee101f2738e0a224a3377232ff85f78a4),
   [#4580](https://github.com/angular/angular.js/issues/4580))


## Breaking Changes

- **$compile:** due to [299b220f](https://github.com/angular/angular.js/commit/299b220f5e05e1d4e26bfd58d0b2fd7329ca76b1),
  calling `attr.$observe` no longer returns the observer function, but a
    deregistration function instead. To migrate the code follow the example below:

Before:

    directive('directiveName', function() {
      return {
        link: function(scope, elm, attr) {
          var observer = attr.$observe('someAttr', function(value) {
            console.log(value);
          });
        }
      };
    });

After:

    directive('directiveName', function() {
      return {
        link: function(scope, elm, attr) {
          var observer = function(value) {
            console.log(value);
          };

          attr.$observe('someAttr', observer);
        }
      };
    });

- **$httpBackend:** due to [6680b7b9](https://github.com/angular/angular.js/commit/6680b7b97c0326a80bdccaf0a35031e4af641e0e), the JSONP behavior for erroneous and empty responses changed:
    Previously, a JSONP response was regarded as erroneous if it was empty. Now Angular is listening to the
    correct events to detect errors, i.e. even empty responses can be successful.



<a name="v1.2.15"></a>
# v1.2.15 beer-underestimating (2014-03-21)


## Bug Fixes

- **$$RAFProvider:** check for webkitCancelRequestAnimationFrame
  ([e84da228](https://github.com/angular/angular.js/commit/e84da2283c4e195be557f7b06c8783fe502acbbb),
   [#6526](https://github.com/angular/angular.js/issues/6526))
- **$$rAF:** always fallback to a $timeout incase native rAF isn't supported
  ([ee8e4a94](https://github.com/angular/angular.js/commit/ee8e4a946ed8f943e00846b88d8d51c0b2cd1fab),
   [#6654](https://github.com/angular/angular.js/issues/6654))
- **$compile:** support templates with thead and tfoot root elements
  ([ca0ac649](https://github.com/angular/angular.js/commit/ca0ac649971ae4fb50419b38f92a98d2226eb696),
   [#6289](https://github.com/angular/angular.js/issues/6289))
- **$http:**
  - allow sending Blob data using $http
  ([fbb125a3](https://github.com/angular/angular.js/commit/fbb125a3af164e52af2f8119175b04cbbed2f331),
   [#5012](https://github.com/angular/angular.js/issues/5012))
  - don't covert 0 status codes to 404 for non-file protocols
  ([f108a2a9](https://github.com/angular/angular.js/commit/f108a2a994149ecc011e29f327bcb8e11adf72d9),
   [#6074](https://github.com/angular/angular.js/issues/6074), [#6155](https://github.com/angular/angular.js/issues/6155))
- **$rootScope:**
  - ng-repeat can't handle NaN values. #4605
  ([e48c28fe](https://github.com/angular/angular.js/commit/e48c28fe9292efe7af6205b2be116d2350990c73),
   [#4605](https://github.com/angular/angular.js/issues/4605))
  - $watchCollection should call listener with oldValue
  ([3dd95727](https://github.com/angular/angular.js/commit/3dd9572754c7bafec30dd625f5c611346959c969),
   [#2621](https://github.com/angular/angular.js/issues/2621), [#5661](https://github.com/angular/angular.js/issues/5661), [#5688](https://github.com/angular/angular.js/issues/5688), [#6736](https://github.com/angular/angular.js/issues/6736))
- **angular.bootstrap:** only allow angular to load once
  ([0d60f8d3](https://github.com/angular/angular.js/commit/0d60f8d367e38224696749b0f7de04bd60649815),
   [#5863](https://github.com/angular/angular.js/issues/5863), [#5587](https://github.com/angular/angular.js/issues/5587))
- **jqLite:** traverse `host` property for DocumentFragment in inheritedData()
  ([98d825e1](https://github.com/angular/angular.js/commit/98d825e10d3bf76f47e69abba857a8933c8cb7d9),
   [#6637](https://github.com/angular/angular.js/issues/6637))
- **ngAnimate:** setting classNameFilter disables animation inside ng-if
  ([a41a2a1d](https://github.com/angular/angular.js/commit/a41a2a1d2ce20f86ac2709592e4ada527160e580),
   [#6539](https://github.com/angular/angular.js/issues/6539))
- **ngCookie:** convert non-string values to string
  ([93d1c95c](https://github.com/angular/angular.js/commit/93d1c95c61dbfa565333bb64527a103242175af7),
   [#6151](https://github.com/angular/angular.js/issues/6151), [#6220](https://github.com/angular/angular.js/issues/6220))
- **ngTouch:** update workaround for desktop Webkit quirk
  ([01a34f51](https://github.com/angular/angular.js/commit/01a34f513bb567ed6d4c81d00d7c2a777c0dae01),
   [#6302](https://github.com/angular/angular.js/issues/6302))
- **orderBy:** support string predicates containing non-ident characters
  ([10d3e1e4](https://github.com/angular/angular.js/commit/10d3e1e4472ab9f5cf4418b6438ec2e0f2b0b288),
   [#6143](https://github.com/angular/angular.js/issues/6143), [#6144](https://github.com/angular/angular.js/issues/6144))
- **select:** avoid checking option element selected properties in render
  ([dc149de9](https://github.com/angular/angular.js/commit/dc149de9364c66b988f169f67cad39577ba43434),
   [#2448](https://github.com/angular/angular.js/issues/2448), [#5994](https://github.com/angular/angular.js/issues/5994), [#6769](https://github.com/angular/angular.js/issues/6769))



<a name="1.3.0-beta.2"></a>
# 1.3.0-beta.2 silent-ventriloquism (2014-03-14)


## Bug Fixes

- **$$rAF:** always fallback to a $timeout in case native rAF isn't supported
  ([7b5e0199](https://github.com/angular/angular.js/commit/7b5e019981f352add88be2984de68e553d1bfa93),
   [#6654](https://github.com/angular/angular.js/issues/6654))
- **$http:** don't convert 0 status codes to 404 for non-file protocols
  ([56e73ea3](https://github.com/angular/angular.js/commit/56e73ea355c851fdfd574d6d2a9e2fcb75677945),
   [#6074](https://github.com/angular/angular.js/issues/6074), [#6155](https://github.com/angular/angular.js/issues/6155))
- **ngAnimate:** setting classNameFilter disables animation inside ng-if
  ([129e2e02](https://github.com/angular/angular.js/commit/129e2e021ab1d773874428cd1fb329eae72797c4),
   [#6539](https://github.com/angular/angular.js/issues/6539))


## Features

- whitelist blob urls for sanitization of data-bound image urls
  ([47ab8df4](https://github.com/angular/angular.js/commit/47ab8df455df1f1391b760e1fbcc5c21645512b8),
   [#4623](https://github.com/angular/angular.js/issues/4623))



<a name="1.3.0-beta.1"></a>
# 1.3.0-beta.1 retractable-eyebrow (2014-03-07)


## Bug Fixes

- **$compile:** support templates with thead and tfoot root elements
  ([53ec5e13](https://github.com/angular/angular.js/commit/53ec5e13e5955830b6751019eef232bd2125c0b6),
   [#6289](https://github.com/angular/angular.js/issues/6289))
- **style:** expressions in style tags
  ([0609453e](https://github.com/angular/angular.js/commit/0609453e1f9ae074f8d786df903096a6eadb6aa0),
   [#2387](https://github.com/angular/angular.js/issues/2387), [#6492](https://github.com/angular/angular.js/issues/6492))


## Features

- **input:** support types date, time, datetime-local, month, week
  ([46bd6dc8](https://github.com/angular/angular.js/commit/46bd6dc88de252886d75426efc2ce8107a5134e9),
   [#5864](https://github.com/angular/angular.js/issues/5864))


## Breaking Changes

- **build:** due to [eaa1d00b](https://github.com/angular/angular.js/commit/eaa1d00b24008f590b95ad099241b4003688cdda),
  As communicated before, IE8 is no longer supported.
- **input:** types date, time, datetime-local, month, week now always
  require a `Date` object as model ([46bd6dc8](https://github.com/angular/angular.js/commit/46bd6dc88de252886d75426efc2ce8107a5134e9),
   [#5864](https://github.com/angular/angular.js/issues/5864))

For more info: http://blog.angularjs.org/2013/12/angularjs-13-new-release-approaches.html



<a name="1.2.14"></a>
# 1.2.14 feisty-cryokinesis (2014-03-01)


## Bug Fixes

- **$animate:**
  - delegate down to addClass/removeClass if setClass is not found
  ([18c41af0](https://github.com/angular/angular.js/commit/18c41af065006a804a3d38eecca7ae184103ece9),
   [#6463](https://github.com/angular/angular.js/issues/6463))
  - ensure all comment nodes are removed during a leave animation
  ([f4f1f43d](https://github.com/angular/angular.js/commit/f4f1f43d5140385bbf070510975f72b65196e08a),
   [#6403](https://github.com/angular/angular.js/issues/6403))
  - only block keyframes if a stagger is set to occur
  ([e71e7b6c](https://github.com/angular/angular.js/commit/e71e7b6cae57f25c5837dda98551c8e0a5cb720d),
   [#4225](https://github.com/angular/angular.js/issues/4225))
  - ensure that animatable directives cancel expired leave animations
  ([e9881991](https://github.com/angular/angular.js/commit/e9881991ca0a5019d3a4215477738ed247898ba0),
   [#5886](https://github.com/angular/angular.js/issues/5886))
  - ensure all animated elements are taken care of during the closing timeout
  ([99720fb5](https://github.com/angular/angular.js/commit/99720fb5ab7259af37f708bc4eeda7cbbe790a69),
   [#6395](https://github.com/angular/angular.js/issues/6395))
  - fix for TypeError Cannot call method 'querySelectorAll' in cancelChildAnimations
  ([c914cd99](https://github.com/angular/angular.js/commit/c914cd99b3aaf932e3c0e2a585eead7b76621f1b),
   [#6205](https://github.com/angular/angular.js/issues/6205))
- **$http:**
  - do not add trailing question
  ([c8e03e34](https://github.com/angular/angular.js/commit/c8e03e34b27a8449d8e1bfe0e3801d6a67ae2c49),
   [#6342](https://github.com/angular/angular.js/issues/6342))
  - send GET requests by default
  ([267b2173](https://github.com/angular/angular.js/commit/267b217376ed466e9f260ecfdfa15a8227c103ff),
   [#5985](https://github.com/angular/angular.js/issues/5985), [#6401](https://github.com/angular/angular.js/issues/6401))
- **$parse:** reduce false-positives in isElement tests
  ([5fe1f39f](https://github.com/angular/angular.js/commit/5fe1f39f027c6f2c6a530975dd5389d788d3c0eb),
   [#4805](https://github.com/angular/angular.js/issues/4805), [#5675](https://github.com/angular/angular.js/issues/5675))
- **input:** use ValidityState to determine validity
  ([c2d447e3](https://github.com/angular/angular.js/commit/c2d447e378dd72d1b955f476bd5bf249625b4dab),
   [#4293](https://github.com/angular/angular.js/issues/4293), [#2144](https://github.com/angular/angular.js/issues/2144), [#4857](https://github.com/angular/angular.js/issues/4857), [#5120](https://github.com/angular/angular.js/issues/5120), [#4945](https://github.com/angular/angular.js/issues/4945), [#5500](https://github.com/angular/angular.js/issues/5500), [#5944](https://github.com/angular/angular.js/issues/5944))
- **isElement:** reduce false-positives in isElement tests
  ([75515852](https://github.com/angular/angular.js/commit/75515852ea9742d3d84a0f463c2a2c61ef2b7323))
- **jqLite:**
  - properly toggle multiple classes
  ([4e73c80b](https://github.com/angular/angular.js/commit/4e73c80b17bd237a8491782bcf9e19f1889e12ed),
   [#4467](https://github.com/angular/angular.js/issues/4467), [#6448](https://github.com/angular/angular.js/issues/6448))
  - make `jqLite(<iframe src="someurl">').contents()` return iframe document, as in jQuery
  ([05fbed57](https://github.com/angular/angular.js/commit/05fbed5710b702c111c1425a9e241c40d13b0a54),
   [#6320](https://github.com/angular/angular.js/issues/6320), [#6323](https://github.com/angular/angular.js/issues/6323))
- **numberFilter:** convert all non-finite/non-numbers/non-numeric strings to the empty string
  ([cceb455f](https://github.com/angular/angular.js/commit/cceb455fb167571e26341ded6b595dafd4d92bc6),
   [#6188](https://github.com/angular/angular.js/issues/6188), [#6261](https://github.com/angular/angular.js/issues/6261))
- **$parse:** support trailing commas in object & array literals
  ([6b049c74](https://github.com/angular/angular.js/commit/6b049c74ccc9ee19688bb9bbe504c300e61776dc))
- **ngHref:** bind ng-href to xlink:href for SVGAElement
  ([2bce71e9](https://github.com/angular/angular.js/commit/2bce71e9dc10c8588f9eb599a0cd2e831440fc48),
   [#5904](https://github.com/angular/angular.js/issues/5904))


## Features

- **$animate:** animate dirty, pristine, valid, invalid for form/fields
  ([33443966](https://github.com/angular/angular.js/commit/33443966c8e8cac85a863bb181d4a4aff00baab4),
   [#5378](https://github.com/angular/angular.js/issues/5378))


## Performance Improvements

- **$animate:** use rAF instead of timeouts to issue animation callbacks
  ([4c4537e6](https://github.com/angular/angular.js/commit/4c4537e65e6cf911c9659b562d89e3330ce3ffae))
- **$cacheFactory:** skip LRU bookkeeping for caches with unbound capacity
  ([a4078fca](https://github.com/angular/angular.js/commit/a4078fcae4a33295675d769a1cd067837029da2f),
   [#6193](https://github.com/angular/angular.js/issues/6193), [#6226](https://github.com/angular/angular.js/issues/6226))



<a name="1.2.13"></a>
# 1.2.13 romantic-transclusion (2014-02-14)


## Bug Fixes

- **$animate:** ensure $animate doesn't break natural CSS transitions
  ([4f84f6b3](https://github.com/angular/angular.js/commit/4f84f6b3e4210ae1eb14728a46d43dd961700a0c),
   [#6019](https://github.com/angular/angular.js/issues/6019))
- **$compile:**
  - ensure element transclusion directives are linked with comment element
  ([e7338d3f](https://github.com/angular/angular.js/commit/e7338d3f27e8824196136a18e1c3e0fcf51a0e28),
   [#6006](https://github.com/angular/angular.js/issues/6006), [#6101](https://github.com/angular/angular.js/issues/6101))
  - support templates with table content root nodes
  ([e7338d3f](https://github.com/angular/angular.js/commit/31c450bcee53d0a3827b7e0a611e9013b2496506),
   [#2848](https://github.com/angular/angular.js/issues/2848), [#1459](https://github.com/angular/angular.js/issues/1459), [#3647](https://github.com/angular/angular.js/issues/3647), [#3241](https://github.com/angular/angular.js/issues/3241))
- **input:**
  - don't apply textInput to `<input type="file">`
  ([a9fcb0d0](https://github.com/angular/angular.js/commit/a9fcb0d0fc6456f80501b8820d02b04d7c15b6d6),
   [#6247](https://github.com/angular/angular.js/issues/6247), [#6231](https://github.com/angular/angular.js/issues/6231))
  - setViewValue on compositionend
  ([2b730271](https://github.com/angular/angular.js/commit/2b7302713674506fdbcdc396c38f18dcb90dee8c),
   [#6058](https://github.com/angular/angular.js/issues/6058), [#5433](https://github.com/angular/angular.js/issues/5433))


## Features

- **filterFilter:** support deeply nested predicate objects
  ([b4eed8ad](https://github.com/angular/angular.js/commit/b4eed8ad94ce9719540462c1ee969dfd3c6b2355),
   [#6215](https://github.com/angular/angular.js/issues/6215))


## Breaking Changes

- **$animate:**
  - due to [4f84f6b3](https://github.com/angular/angular.js/commit/4f84f6b3e4210ae1eb14728a46d43dd961700a0c),
    ngClass and {{ class }} will now call the `setClass`
    animation callback instead of addClass / removeClass when both a
    addClass/removeClass operation is being executed on the element during the animation.

    Please include the setClass animation callback as well as addClass and removeClass within
    your JS animations to work with ngClass and {{ class }} directives.


  - due to [cf5e463a](https://github.com/angular/angular.js/commit/cf5e463abd2c23f62e9c2e6361e6c53048c8910e),
    Both the `$animate:before` and `$animate:after` DOM events must be now
    registered prior to the $animate operation taking place. The `$animate:close` event
    can be registered anytime afterwards.

    DOM callbacks used to fired for each and every animation operation that occurs within the
    $animate service provided in the ngAnimate module. This may end up slowing down an
    application if 100s of elements are being inserted into the page. Therefore after this
    change callbacks are only fired if registered on the element being animated.

- **input:**
  - due to [a9fcb0d0](https://github.com/angular/angular.js/commit/a9fcb0d0fc6456f80501b8820d02b04d7c15b6d6),
    input[type=file] will no longer support ngModel. Due to browser support being spotty among target browsers,
    file inputs cannot be cleanly supported, and even features which technically do work (such as ng-change)
    work in an inconsistent way depending on the attributes of the form control.

    As a workaround, one can manually listen for change events on file inputs and handle them manually.

<a name="1.2.12"></a>
# 1.2.12 cauliflower-eradication (2014-02-07)


## Bug Fixes

- **$compile:** retain CSS classes added in cloneAttachFn on asynchronous directives
  ([5ed721b9](https://github.com/angular/angular.js/commit/5ed721b9b5e95ae08450e1ae9d5202e7f3f79295),
   [#5439](https://github.com/angular/angular.js/issues/5439), [#5617](https://github.com/angular/angular.js/issues/5617))
- **$http:**
  - ignore xhr.responseType setter exception if value is "json"
  ([24699ee8](https://github.com/angular/angular.js/commit/24699ee8f04c1f1459be1d36207e654421d58ff0),
   [#6115](https://github.com/angular/angular.js/issues/6115), [#6122](https://github.com/angular/angular.js/issues/6122))
  - update httpBackend to use ActiveXObject on IE8 if necessary
  ([ef210e5e](https://github.com/angular/angular.js/commit/ef210e5e119db4f5bfc9d2428b19f9b335c4f976),
   [#5677](https://github.com/angular/angular.js/issues/5677), [#5679](https://github.com/angular/angular.js/issues/5679))
- **$locale:** minor grammar amends for the locale `locale_lt`
  ([95be253f](https://github.com/angular/angular.js/commit/95be253fe55d35336d425d3d600a36158fc3519d),
   [#6164](https://github.com/angular/angular.js/issues/6164))
- **$q:** make $q.reject support `finally` and `catch`
  ([074b0675](https://github.com/angular/angular.js/commit/074b0675a1f97dce07f520f1ae6198ed3c604000),
   [#6048](https://github.com/angular/angular.js/issues/6048), [#6076](https://github.com/angular/angular.js/issues/6076))
- **docs:** clarify doc for "args" in $broadcast and $emit
  ([caed2dfe](https://github.com/angular/angular.js/commit/caed2dfe4feeac5d19ecea2dbb1456b7fde21e6d),
   [#6047](https://github.com/angular/angular.js/issues/6047))
- **filterFilter:** don't interpret dots in predicate object fields as paths
  ([339a1658](https://github.com/angular/angular.js/commit/339a1658cd9bfa5e322a01c45aa0a1df67e3a842),
   [#6005](https://github.com/angular/angular.js/issues/6005), [#6009](https://github.com/angular/angular.js/issues/6009))
- **http:** make jshint happy
  ([6609e3da](https://github.com/angular/angular.js/commit/6609e3da76dd898cfe85f75f23ab2e39fee65fe5))
- **jqLite:** trim HTML string in jqLite constructor
  ([36d37c0e](https://github.com/angular/angular.js/commit/36d37c0e3880c774d20c014ade60d2331beefa15),
   [#6053](https://github.com/angular/angular.js/issues/6053))
- **mocks:**
  - rename mock.animate to ngAnimateMock and ensure it contains all test helper code for ngAnimate
  ([4224cd51](https://github.com/angular/angular.js/commit/4224cd5182bc93e4a210f75e0a4e4de7f3c544e8),
   [#5822](https://github.com/angular/angular.js/issues/5822), [#5917](https://github.com/angular/angular.js/issues/5917))
  - remove usage of $animate.flushNext in favor of queuing
  ([906fdad0](https://github.com/angular/angular.js/commit/906fdad0f95465842e336e057ea97d0633712189))
  - always call functions injected with `inject` with `this` set to the current spec
  ([3bf43903](https://github.com/angular/angular.js/commit/3bf43903397c703aa2e9ba1e1a48dbc9e8286ee2),
   [#6102](https://github.com/angular/angular.js/issues/6102))
  - refactor currentSpec to work w/ Jasmine 2
  ([95f0bf9b](https://github.com/angular/angular.js/commit/95f0bf9b526fda8964527c6d4aef1ad50a47f1f3),
   [#5662](https://github.com/angular/angular.js/issues/5662))
- **ngMock:** return false from mock $interval.cancel() when no argument is supplied
  ([dd24c783](https://github.com/angular/angular.js/commit/dd24c78373b5d24ecb3b9d19e61e1b3b6c74d155),
   [#6103](https://github.com/angular/angular.js/issues/6103))
- **ngResource:**
  - don't filter "$"-prefixed properties from ngResource requests/responses
  ([d2e4e499](https://github.com/angular/angular.js/commit/d2e4e499862aeca157dbe7a7422c465e7c79205e),
   [#5666](https://github.com/angular/angular.js/issues/5666), [#6080](https://github.com/angular/angular.js/issues/6080), [#6033](https://github.com/angular/angular.js/issues/6033))
  - don't append number to '$' in url param value when encoding URI
  ([ce1f1f97](https://github.com/angular/angular.js/commit/ce1f1f97f0ebf77941b2bdaf5e8352d33786524d),
   [#6003](https://github.com/angular/angular.js/issues/6003), [#6004](https://github.com/angular/angular.js/issues/6004))

## Breaking Changes

The animation mock module has been renamed from `mock.animate` to `ngAnimateMock`. In addition to the rename, animations will not block within test code even when ngAnimateMock is used. However, all function calls to $animate will be recorded into `$animate.queue` and are available within test code to assert animation calls. In addition, `$animate.triggerReflow()` is now only available when `ngAnimateMock` is used.


<a name="1.2.11"></a>
# 1.2.11 cryptocurrency-hyperdeflation (2014-02-03)

## Bug Fixes

- **$compile:** retain CSS classes added in cloneAttachFn on asynchronous directives
  ([5ed721b9](https://github.com/angular/angular.js/commit/5ed721b9b5e95ae08450e1ae9d5202e7f3f79295),
   [#5439](https://github.com/angular/angular.js/issues/5439), [#5617](https://github.com/angular/angular.js/issues/5617))
- **$http:** update httpBackend to use ActiveXObject on IE8 if necessary
  ([ef210e5e](https://github.com/angular/angular.js/commit/ef210e5e119db4f5bfc9d2428b19f9b335c4f976),
   [#5677](https://github.com/angular/angular.js/issues/5677), [#5679](https://github.com/angular/angular.js/issues/5679))
- **$q:** make $q.reject support `finally` and `catch`
  ([074b0675](https://github.com/angular/angular.js/commit/074b0675a1f97dce07f520f1ae6198ed3c604000),
   [#6048](https://github.com/angular/angular.js/issues/6048), [#6076](https://github.com/angular/angular.js/issues/6076))
- **filterFilter:** don't interpret dots in predicate object fields as paths
  ([339a1658](https://github.com/angular/angular.js/commit/339a1658cd9bfa5e322a01c45aa0a1df67e3a842),
   [#6005](https://github.com/angular/angular.js/issues/6005), [#6009](https://github.com/angular/angular.js/issues/6009))
- **mocks:** refactor currentSpec to work w/ Jasmine 2
  ([95f0bf9b](https://github.com/angular/angular.js/commit/95f0bf9b526fda8964527c6d4aef1ad50a47f1f3),
   [#5662](https://github.com/angular/angular.js/issues/5662))
- **ngResource:** don't append number to '$' in url param value when encoding URI
  ([ce1f1f97](https://github.com/angular/angular.js/commit/ce1f1f97f0ebf77941b2bdaf5e8352d33786524d),
   [#6003](https://github.com/angular/angular.js/issues/6003), [#6004](https://github.com/angular/angular.js/issues/6004))

<a name="1.2.10"></a>
# 1.2.10 augmented-serendipity (2014-01-24)


## Bug Fixes

- **$parse:** do not use locals to resolve object properties
  ([f09b6aa5](https://github.com/angular/angular.js/commit/f09b6aa5b58c090e3b8f8811fb7735e38d4b7623),
   [#5838](https://github.com/angular/angular.js/issues/5838), [#5862](https://github.com/angular/angular.js/issues/5862))
- **a:** don't call preventDefault on click when a SVGAElement has an xlink:href attribute
  ([e0209169](https://github.com/angular/angular.js/commit/e0209169bf1463465ad07484421620748a4d3908),
   [#5896](https://github.com/angular/angular.js/issues/5896), [#5897](https://github.com/angular/angular.js/issues/5897))
- **input:** use Chromium's email validation regexp
  ([79e519fe](https://github.com/angular/angular.js/commit/79e519fedaec54390a8bdacfb1926bfce57a1eb6),
   [#5899](https://github.com/angular/angular.js/issues/5899), [#5924](https://github.com/angular/angular.js/issues/5924))
- **ngRoute:** pipe preceding route param no longer masks ? or * operator
  ([fd6bac7d](https://github.com/angular/angular.js/commit/fd6bac7de56f728a89782dc80c78f7d5c21bbc65),
   [#5920](https://github.com/angular/angular.js/issues/5920))


## Features

- **$animate:** provide support for a close callback
  ([ca6b7d0f](https://github.com/angular/angular.js/commit/ca6b7d0fa2e355ebd764230260758cee9a4ebe1e),
   [#5685](https://github.com/angular/angular.js/issues/5685), [#5053](https://github.com/angular/angular.js/issues/5053), [#4993](https://github.com/angular/angular.js/issues/4993))


<a name="1.2.9"></a>
# 1.2.9 enchanted-articulacy (2014-01-15)


## Bug Fixes

- **$animate:**
  - ensure the final closing timeout respects staggering animations
  ([ed53100a](https://github.com/angular/angular.js/commit/ed53100a0dbc9119d5dfc8b7248845d4f6989df2))
  - prevent race conditions for class-based animations when animating on the same CSS class
  ([4aa9df7a](https://github.com/angular/angular.js/commit/4aa9df7a7ae533531dfae1e3eb9646245d6b5ff4),
   [#5588](https://github.com/angular/angular.js/issues/5588))
  - correctly detect and handle CSS transition changes during class addition and removal
  ([7d5d62da](https://github.com/angular/angular.js/commit/7d5d62dafe11620082c79da35958f8014eeb008c))
  - avoid accidentally matching substrings when resolving the presence of className tokens
  ([524650a4](https://github.com/angular/angular.js/commit/524650a40ed20f01571e5466475749874ee67288))
- **$http:** ensure default headers PUT and POST are different objects
  ([e1cfb195](https://github.com/angular/angular.js/commit/e1cfb1957feaf89408bccf48fae6f529e57a82fe),
   [#5742](https://github.com/angular/angular.js/issues/5742), [#5747](https://github.com/angular/angular.js/issues/5747), [#5764](https://github.com/angular/angular.js/issues/5764))
- **$rootScope:** prevent infinite $digest by checking if asyncQueue is empty when decrementing ttl
  ([2cd09c9f](https://github.com/angular/angular.js/commit/2cd09c9f0e7766bcd191662841b7b1ffc3b6dc3f),
   [#2622](https://github.com/angular/angular.js/issues/2622))


## Features

- **$animate:**
  - provide support for DOM callbacks
  ([dde1b294](https://github.com/angular/angular.js/commit/dde1b2949727c297e214c99960141bfad438d7a4))
  - use requestAnimationFrame instead of a timeout to issue a reflow
  ([4ae3184c](https://github.com/angular/angular.js/commit/4ae3184c5915aac9aa00889aa2153c8e84c14966),
   [#4278](https://github.com/angular/angular.js/issues/4278), [#4225](https://github.com/angular/angular.js/issues/4225))

## Breaking Changes

- **$http:** due to [e1cfb195](https://github.com/angular/angular.js/commit/e1cfb1957feaf89408bccf48fae6f529e57a82fe),
  it is now necessary to separately specify default HTTP headers for PUT, POST and PATCH requests, as these no longer share a single object.

  To migrate your code, follow the example below:

  Before:

  ```
  // Will apply to POST, PUT and PATCH methods
  $httpProvider.defaults.headers.post = {
    "X-MY-CSRF-HEADER": "..."
  };
  ```

  After:

  ```
  // POST, PUT and PATCH default headers must be specified seperately,
  // as they do not share data.
  $httpProvider.defaults.headers.post =
    $httpProvider.defaults.headers.put =
    $httpProviders.defaults.headers.patch = {
      "X-MY-CSRF-HEADER": "..."
    };
  ```

<a name="1.2.8"></a>
# 1.2.8 interdimensional-cartography (2014-01-10)


## Bug Fixes

- **$http:**
  - return responseText on IE8 for requests with responseType set
  ([a9cccbe1](https://github.com/angular/angular.js/commit/a9cccbe14f1bd9048f5dab4443f58c804d4259a1),
   [#4464](https://github.com/angular/angular.js/issues/4464), [#4738](https://github.com/angular/angular.js/issues/4738), [#5636](https://github.com/angular/angular.js/issues/5636))
  - Allow status code 0 from any protocol
  ([28fc80bb](https://github.com/angular/angular.js/commit/28fc80bba0107075ab371fd0a7634a38891626b2),
   [#1356](https://github.com/angular/angular.js/issues/1356), [#5547](https://github.com/angular/angular.js/issues/5547))
  - cancelled JSONP requests will not print error in the console
  ([95e1b2d6](https://github.com/angular/angular.js/commit/95e1b2d6121b4e26cf87dcf6746a7b8cb4c25e7f),
   [#5615](https://github.com/angular/angular.js/issues/5615), [#5616](https://github.com/angular/angular.js/issues/5616))
- **$location:** return '/' for root path in hashbang mode
  ([63cd873f](https://github.com/angular/angular.js/commit/63cd873fef3207deef30c7a7ed66f4b8f647dc12),
   [#5650](https://github.com/angular/angular.js/issues/5650), [#5712](https://github.com/angular/angular.js/issues/5712))
- **$parse:** fix CSP nested property evaluation, and issue that prevented its tests from failing
  ([3b1a4fe0](https://github.com/angular/angular.js/commit/3b1a4fe0c83c7898ecd7261ab4213998ee7be0ec),
   [#5591](https://github.com/angular/angular.js/issues/5591), [#5592](https://github.com/angular/angular.js/issues/5592))
- **closure:** add Closure externs for angular.$q.Promise.finally
  ([caeb7402](https://github.com/angular/angular.js/commit/caeb7402651702cd13df2f1594e9827439a8b760),
   [#4757](https://github.com/angular/angular.js/issues/4757))
- **ngMock window.inject:** Remove Error 'stack' property changes
  ([7e916455](https://github.com/angular/angular.js/commit/7e916455b36dc9ca4d4afc1e44cade90006d00e3))


## Features

- **select:** allow multiline ng-options
  ([43a2f3d0](https://github.com/angular/angular.js/commit/43a2f3d0bf435e3626cd679caff4281cfb3415bd),
   [#5602](https://github.com/angular/angular.js/issues/5602))

<a name="1.2.7"></a>
# 1.2.7 emoji-clairvoyance (2014-01-03)


## Bug Fixes

- **$animate:**
  - ensue class-based animations are always skipped before structural post-digest tasks are run
  ([bc492c0f](https://github.com/angular/angular.js/commit/bc492c0fc17257ddf2bc5964e205379aa766b3d8),
   [#5582](https://github.com/angular/angular.js/issues/5582))
  - remove trailing `s` from computed transition duration styles
  ([50bf0296](https://github.com/angular/angular.js/commit/50bf029625d603fc652f0f413e709f43803743db))
- **$http:**
  ([3d38fff8](https://github.com/angular/angular.js/commit/3d38fff8b4ea2fd60fadef2028ea4dcddfccb1a4))
  - use ActiveX XHR when making PATCH requests on IE8
  ([6c17d02b](https://github.com/angular/angular.js/commit/6c17d02bc4cc02f478775d62e1f9f77da9da82ad),
   [#2518](https://github.com/angular/angular.js/issues/2518), [#5043](https://github.com/angular/angular.js/issues/5043))
  - fix 'type mismatch' error on IE8 after each request
  ([fd9a03e1](https://github.com/angular/angular.js/commit/fd9a03e147aac7e952c6dda1f381fd4662276ba2))
  - Ignore multiple calls to onreadystatechange with readyState=4
  ([4f572366](https://github.com/angular/angular.js/commit/4f57236614415eea919221ea5f99c4d8689b3267),
   [#5426](https://github.com/angular/angular.js/issues/5426))
- **$injector:** remove the `INSTANTIATING` flag properly when done
  ([186a5912](https://github.com/angular/angular.js/commit/186a5912288acfff0ee59dae29af83c37c987921),
   [#4361](https://github.com/angular/angular.js/issues/4361), [#5577](https://github.com/angular/angular.js/issues/5577))
- **$location:**
  - remove base href domain if the URL begins with '//'
  ([760f2fb7](https://github.com/angular/angular.js/commit/760f2fb73178e56c37397b3c5876f7dac96f0455),
   [#5606](https://github.com/angular/angular.js/issues/5606))
  - fix $location.path() behavior when $locationChangeStart is triggered by the browser
  ([cf686285](https://github.com/angular/angular.js/commit/cf686285c22d528440e173fdb65ad1052d96df3c),
   [#4989](https://github.com/angular/angular.js/issues/4989), [#5089](https://github.com/angular/angular.js/issues/5089), [#5118](https://github.com/angular/angular.js/issues/5118), [#5580](https://github.com/angular/angular.js/issues/5580))
  - re-assign history after BFCache back on Android browser
  ([bddd46c8](https://github.com/angular/angular.js/commit/bddd46c8ecf49cfe6c999cd6b4a69b7d7e1f9a33),
   [#5425](https://github.com/angular/angular.js/issues/5425))
- **$resource:** prevent URL template from collapsing into an empty string
  ([131e4014](https://github.com/angular/angular.js/commit/131e4014b831ac81b7979c4523da81ebc5861c70),
   [#5455](https://github.com/angular/angular.js/issues/5455), [#5493](https://github.com/angular/angular.js/issues/5493))
- **$sanitize:** consider the `size` attribute as a valid/allowed attribute
  ([056c8493](https://github.com/angular/angular.js/commit/056c8493521988dbb330c6636135b505737da918),
   [#5522](https://github.com/angular/angular.js/issues/5522))
- **Scope:** don't let watch deregistration mess up the dirty-checking digest loop
  ([884ef0db](https://github.com/angular/angular.js/commit/884ef0dbcdfe614cedc824d079361b53e675d033),
   [#5525](https://github.com/angular/angular.js/issues/5525))
- **input:**
  - use apply on the change event only when one isn't already in progress
  ([a80049fd](https://github.com/angular/angular.js/commit/a80049fd0ac858eeeb645a4209cb2a661d0b4c33),
   [#5293](https://github.com/angular/angular.js/issues/5293))
  - prevent double $digest when using jQuery trigger.
  ([1147f219](https://github.com/angular/angular.js/commit/1147f21999edf9a434cd8d24865a6455e744d858),
   [#5293](https://github.com/angular/angular.js/issues/5293))
- **ngRepeat:** allow for more flexible coding style in ngRepeat expression
  ([c9705b75](https://github.com/angular/angular.js/commit/c9705b755645a4bfe066243f2ba15a733c3787e1),
   [#5537](https://github.com/angular/angular.js/issues/5537), [#5598](https://github.com/angular/angular.js/issues/5598))
- **ngRoute:** instantiate controller when template is empty
  ([498365f2](https://github.com/angular/angular.js/commit/498365f219f65d6c29bdf2f03610a4d3646009bb),
   [#5550](https://github.com/angular/angular.js/issues/5550))
- **ngShow/ngHide, ngIf:** functions with zero args should be truthy
  ([01c5be46](https://github.com/angular/angular.js/commit/01c5be4681e34cdc5f5c461b7a618fefe8038919),
   [#5414](https://github.com/angular/angular.js/issues/5414))


## Performance Improvements

- **Scope:** limit propagation of $broadcast to scopes that have listeners for the event
  ([80e7a455](https://github.com/angular/angular.js/commit/80e7a4558490f7ffd33d142844b9153a5ed00e86),
   [#5341](https://github.com/angular/angular.js/issues/5341), [#5371](https://github.com/angular/angular.js/issues/5371))

<a name="1.2.6"></a>
# 1.2.6 taco-salsafication (2013-12-19)


## Bug Fixes

- **$animate:** use a scheduled timeout in favor of a fallback property to close transitions
  ([54637a33](https://github.com/angular/angular.js/commit/54637a335f885110efaa702a3bab29c77644b36c),
   [#5255](https://github.com/angular/angular.js/issues/5255), [#5241](https://github.com/angular/angular.js/issues/5241), [#5405](https://github.com/angular/angular.js/issues/5405))
- **$compile:** remove invalid IE exceptional case for `href`
  ([c7a1d1ab](https://github.com/angular/angular.js/commit/c7a1d1ab0b663edffc1ac7b54deea847e372468d),
   [#5479](https://github.com/angular/angular.js/issues/5479))
- **$location:** parse xlink:href for SVGAElements
  ([bc3ff2ce](https://github.com/angular/angular.js/commit/bc3ff2cecd0861766a9e8606f3cc2c582d9875df),
   [#5472](https://github.com/angular/angular.js/issues/5472), [#5198](https://github.com/angular/angular.js/issues/5198), [#5199](https://github.com/angular/angular.js/issues/5199), [#4098](https://github.com/angular/angular.js/issues/4098), [#1420](https://github.com/angular/angular.js/issues/1420))
- **$log:** should work in IE8
  ([4f5758e6](https://github.com/angular/angular.js/commit/4f5758e6669222369889c9e789601d25ff885530),
   [#5400](https://github.com/angular/angular.js/issues/5400))
- **$parse:** return `undefined` if an intermediate property's value is `null`
  ([26d43cac](https://github.com/angular/angular.js/commit/26d43cacdc106765bd928d41600352198f887aef),
   [#5480](https://github.com/angular/angular.js/issues/5480))
- **closure:** add type definition for `Scope#$watchCollection`
  ([8f329ffb](https://github.com/angular/angular.js/commit/8f329ffb829410e1fd8f86a766929134e736e3e5),
   [#5475](https://github.com/angular/angular.js/issues/5475))
- **forEach:** allow looping over result of `querySelectorAll` in IE8
  ([274a6734](https://github.com/angular/angular.js/commit/274a6734ef1fff543cc50388a0958d1988baeb57))
- **input:** do not hold input for composition on Android
  ([3dc18037](https://github.com/angular/angular.js/commit/3dc18037e8db8766641a4d39f0fee96077db1fcb),
   [#5308](https://github.com/angular/angular.js/issues/5308))
- **jqLite:** support unbind self within handler
  ([2f91cfd0](https://github.com/angular/angular.js/commit/2f91cfd0d2986899c38641100c1851b2f9d3888a))
- **ngRepeat:** allow multiline expressions
  ([cbb3ce2c](https://github.com/angular/angular.js/commit/cbb3ce2c309052b951d0cc87e4c6daa9c48a3dd8),
   [#5000](https://github.com/angular/angular.js/issues/5000))
- **select:** invalidate when `multiple`, `required`, and model is `[]`
  ([5c97731a](https://github.com/angular/angular.js/commit/5c97731a22ed87d64712e673efea0e8a05eae65f),
   [#5337](https://github.com/angular/angular.js/issues/5337))


## Features

- **jqLite:** provide support for `element.one()`
  ([937caab6](https://github.com/angular/angular.js/commit/937caab6475e53a7ea0206e992f8a52449232e78))
- **ngAnimate:** provide configuration support to match specific className values to trigger animations
  ([cef084ad](https://github.com/angular/angular.js/commit/cef084ade9072090259d8c679751cac3ffeaed51),
   [#5357](https://github.com/angular/angular.js/issues/5357), [#5283](https://github.com/angular/angular.js/issues/5283))


## Performance Improvements

- **compile:** add class 'ng-scope' before cloning and other micro-optimizations
  ([f3a796e5](https://github.com/angular/angular.js/commit/f3a796e522afdbd3b640d14426edb2fbfab463c5),
   [#5471](https://github.com/angular/angular.js/issues/5471))
- **$parse:** use a faster path when the number of path parts is low
  ([f4462319](https://github.com/angular/angular.js/commit/864b2596b246470cca9d4e223eaed720f4462319))
- use faster check for `$$` prefix
  ([06c5cfc7](https://github.com/angular/angular.js/commit/cb29632a5802e930262919b3db64ca4806c5cfc7))

<a name="1.2.5"></a>
# 1.2.5 singularity-expansion (2013-12-13)


## Bug Fixes

- **$compile:** allow literals in isolate scope references
  ([43072e38](https://github.com/angular/angular.js/commit/43072e3812e32b89b97ad03144577cba50d4b776),
   [#5296](https://github.com/angular/angular.js/issues/5296))
- **angular-mocks:** use copy of mock data in $httpBackend
  ([f69dc162](https://github.com/angular/angular.js/commit/f69dc16241c8b631123ad0b09674f0a5e0ff32fe))
- **closure:** add missing FormController extern definitions
  ([1d5e18b0](https://github.com/angular/angular.js/commit/1d5e18b062c3e33b2a8d96aa58d905ed2cd48649),
   [#5303](https://github.com/angular/angular.js/issues/5303))
- **ngInclude:** add template to DOM before linking other directives
  ([30a8b7d0](https://github.com/angular/angular.js/commit/30a8b7d0b5d4882c2bf3b20eb696a02f5b667726),
   [#5247](https://github.com/angular/angular.js/issues/5247))
- **ngView:** add template to DOM before linking other directives
  ([f8944efe](https://github.com/angular/angular.js/commit/f8944efe70b81e02704df9b53ea2546c80c73d3b))


## Performance Improvements

- **$injector:** remove invoke optimization that doesn't work
  ([05e4fd34](https://github.com/angular/angular.js/commit/05e4fd3488b89e670c36869f18defe26deac2efa),
   [#5388](https://github.com/angular/angular.js/issues/5388))
- **$resource:** use shallow copy instead of angular.copy
  ([fcd2a813](https://github.com/angular/angular.js/commit/fcd2a8131a3cb3e59a616bf31e61510b5c3a97d3),
   [#5300](https://github.com/angular/angular.js/issues/5300))
- **a:** do not link when href or name exists in template
  ([f3de5b6e](https://github.com/angular/angular.js/commit/f3de5b6eac90baf649506072162f36dbc6d2f028),
   [#5362](https://github.com/angular/angular.js/issues/5362))
- **jqLite:** implement and use the `empty` method in place of `html(‘’)`
  ([3410f65e](https://github.com/angular/angular.js/commit/3410f65e790a81d457b4f4601a1e760a6f8ede5e),
   [#4457](https://github.com/angular/angular.js/issues/4457))

## Breaking Changes

- **angular-mocks:** due to [f69dc162](https://github.com/angular/angular.js/commit/f69dc16241c8b631123ad0b09674f0a5e0ff32fe),
  some tests that rely on identity comparison rather than equality comparison in checking mock http responses will be broken,
  since now each mock response is a copy of the original response. This is usually fixable by changing a `.toBe()` comparison
  to `toEqual()` inside of tests.

<a name="1.2.4"></a>
# 1.2.4 wormhole-blaster (2013-12-06)


## Bug Fixes

- **$animate:**
  - ensure animations work with directives that share a transclusion
  ([958d3d56](https://github.com/angular/angular.js/commit/958d3d56b1899a2cfc7b18c0292e5a1d8c64d0a5),
   [#4716](https://github.com/angular/angular.js/issues/4716), [#4871](https://github.com/angular/angular.js/issues/4871), [#5021](https://github.com/angular/angular.js/issues/5021), [#5278](https://github.com/angular/angular.js/issues/5278))
  - ensure ms durations are properly rounded
  ([93901bdd](https://github.com/angular/angular.js/commit/93901bdde4bb9f0ba114ebb33b8885808e1823e1),
   [#5113](https://github.com/angular/angular.js/issues/5113), [#5162](https://github.com/angular/angular.js/issues/5162))
- **$compile:**
  - update cloned elements if the template arrives after the cloning
  ([b0972a2e](https://github.com/angular/angular.js/commit/b0972a2e75909e41dbac6e4413ada7df2d51df3a))
  - ensure the isolated local watch `lastValue` is always in sync
  ([2d0f6ccb](https://github.com/angular/angular.js/commit/2d0f6ccba896fe34141d6d4f59eef6fba580c5c2),
   [#5182](https://github.com/angular/angular.js/issues/5182))
- **$rootScope:**
  - ensure that when the $destroy event is broadcast on $rootScope that it does something
  ([d802ed1b](https://github.com/angular/angular.js/commit/d802ed1b3680cfc1751777fac465b92ee29944dc),
   [#5169](https://github.com/angular/angular.js/issues/5169))
  - ensure the phase is cleared within a digest if an exception is raised by a watcher
  ([d3c486dd](https://github.com/angular/angular.js/commit/d3c486dd6dfa8d5dca32a3e28aa685fb7260c878))
- **$sanitize:** don't rely on YARR regex engine executing immediately in order to prevent object mutation
  ([81b81856](https://github.com/angular/angular.js/commit/81b81856ee43d2876927c4e1f774affa87e99707),
   [#5193](https://github.com/angular/angular.js/issues/5193), [#5192](https://github.com/angular/angular.js/issues/5192))
- **closure:** closure compiler shouldn't rename .defaults.transformRequest
  ([f01087f8](https://github.com/angular/angular.js/commit/f01087f802839637843115cbcf99702e09d866f6))
- **input:** ensure ngModelWatch() triggers second digest pass when appropriate
  ([b6d54393](https://github.com/angular/angular.js/commit/b6d5439343b9801f7f2a009d0de09cba9aa21a1d),
   [#5258](https://github.com/angular/angular.js/issues/5258), [#5282](https://github.com/angular/angular.js/issues/5282))
- **isElement:** return boolean value rather than `truthy` value.
  ([2dbb6f9a](https://github.com/angular/angular.js/commit/2dbb6f9a54eb5ff5847eed11c85ac4cf119eb41c),
   [#4519](https://github.com/angular/angular.js/issues/4519), [#4534](https://github.com/angular/angular.js/issues/4534))
- **jqLite:** ignore incompatible nodes on find()
  ([1169b544](https://github.com/angular/angular.js/commit/1169b5445691e1495354d235a3badf05240e3904),
   [#4120](https://github.com/angular/angular.js/issues/4120))
- **ngInit:** evaluate ngInit before ngInclude
  ([0e50810c](https://github.com/angular/angular.js/commit/0e50810c53428f4c1f5bfdba9599df54cb7a6c6e),
   [#5167](https://github.com/angular/angular.js/issues/5167), [#5208](https://github.com/angular/angular.js/issues/5208))
- **ngSanitize:** prefer textContent to innerText to avoid layout trashing
  ([bf1972dc](https://github.com/angular/angular.js/commit/bf1972dc1e8ffbeaddfa53df1d49bc5a2177f09c))


## Performance Improvements

- **$parse:** micro-optimization for ensureSafeObject function
  ([689dfb16](https://github.com/angular/angular.js/commit/689dfb167924a61aef444ce7587fb987d8080990),
   [#5246](https://github.com/angular/angular.js/issues/5246))
- **Scope:** short-circuit after dirty-checking last dirty watcher
  ([d070450c](https://github.com/angular/angular.js/commit/d070450cd2b3b3a3aa34b69d3fa1f4cc3be025dd),
   [#5272](https://github.com/angular/angular.js/issues/5272), [#5287](https://github.com/angular/angular.js/issues/5287))



<a name="1.2.3"></a>
# 1.2.3 unicorn-zapper (2013-11-27)


## Bug Fixes

- **$animate:**
- ensure blocked keyframe animations are unblocked before the DOM operation
  ([2efe8230](https://github.com/angular/angular.js/commit/2efe82309ac8ff4f67df8b6e40a539ea31e15804),
   [#5106](https://github.com/angular/angular.js/issues/5106))
- ensure animations are disabled during bootstrap to prevent unwanted structural animations
  ([eed23332](https://github.com/angular/angular.js/commit/eed2333298412fbad04eda97ded3487c845b9eb9),
   [#5130](https://github.com/angular/angular.js/issues/5130))
- **$sanitize:** use the same whitelist mechanism as `$compile` does
  ([33352348](https://github.com/angular/angular.js/commit/333523483f3ce6dd3177b697a5e5a7177ca364c8),
   [#3748](https://github.com/angular/angular.js/issues/3748))
- **input:** react to form auto completion, through the `change` event, on modern browsers
  ([a090400f](https://github.com/angular/angular.js/commit/a090400f09d7993d102f527609879cdc74abae60),
   [#1460](https://github.com/angular/angular.js/issues/1460))
- **$attrs:** add `$attrs.$attr` to externs so that it isn't renamed on js minification
  ([bcca8054](https://github.com/angular/angular.js/commit/bcca80548dde85ffe3838c943ba8e5c2deb1c721))


## Features

No new features in this release

## Breaking Changes

There are no breaking changes in this release (promise!)



<a name="1.2.2"></a>
# 1.2.2 consciousness-inertia (2013-11-22)


## Bug Fixes

- **$animate:**
  - ensure keyframe animations are blocked around the reflow
  ([6760d7a3](https://github.com/angular/angular.js/commit/6760d7a315d7ea5cbd4f8ab74b200f754a2041f4),
   [#5018](https://github.com/angular/angular.js/issues/5018))
  - ensure transition animations are unblocked before the dom operation occurs
  ([062fbed8](https://github.com/angular/angular.js/commit/062fbed8fc3f7bc55433f8c6915c27520e6f63c5),
   [#5014](https://github.com/angular/angular.js/issues/5014),
   [#4265](https://github.com/angular/angular.js/issues/4265))
  - ensure addClass/removeClass animations do not snap during reflow
  ([76e4db6f](https://github.com/angular/angular.js/commit/76e4db6f3d15199ac1fbe85f9cfa6079a1c4fa56),
   [#4892](https://github.com/angular/angular.js/issues/4892))
  - ensure the DOM operation isn't run twice
  ([7067a8fb](https://github.com/angular/angular.js/commit/7067a8fb0b18d5b5489006e1960cee721a88b4d2),
   [#4949](https://github.com/angular/angular.js/issues/4949))
- **$compile:**
  - secure form[action] & iframe[srcdoc]
  ([0421cb42](https://github.com/angular/angular.js/commit/0421cb4200e672818ed10996e92311404c150c3a),
   [#4927](https://github.com/angular/angular.js/issues/4927),
   [#4933](https://github.com/angular/angular.js/issues/4933))
  - ensure CSS classes are added and removed only when necessary
  ([0cd7e8f2](https://github.com/angular/angular.js/commit/0cd7e8f22721f62b62440bb059ae764ebbe7b42a))
- **$httpBackend:** only IE8 and below can't use `script.onload` for JSONP
  ([a3172a28](https://github.com/angular/angular.js/commit/a3172a285fd74b5aa6c8d68a4988c767c06f549c),
   [#4523](https://github.com/angular/angular.js/issues/4523),
   [#4527](https://github.com/angular/angular.js/issues/4527),
   [#4922](https://github.com/angular/angular.js/issues/4922))
- **$parse:** allow for new lines in expr when promise unwrapping is on
  ([40647b17](https://github.com/angular/angular.js/commit/40647b179c473f3f470bb1b3237d6f006269582f),
   [#4718](https://github.com/angular/angular.js/issues/4718))
- **$resource:** Always return a resource instance when calling class methods on resources.
  ([f6ecf9a3](https://github.com/angular/angular.js/commit/f6ecf9a3c9090593faf5fa50586c99a56b51c776),
   [#4545](https://github.com/angular/angular.js/issues/4545),
   [#5061](https://github.com/angular/angular.js/issues/5061))
- **httpBackend:** should not read response data when request is aborted
  ([6f1050df](https://github.com/angular/angular.js/commit/6f1050df4fa885bd59ce85adbef7350ea93911a3),
   [#4913](https://github.com/angular/angular.js/issues/4913),
   [#4940](https://github.com/angular/angular.js/issues/4940))
- **loader:** expose `$$minErr` to modules such as`ngResource`
  ([9e89a31b](https://github.com/angular/angular.js/commit/9e89a31b129e40c805178535c244899ffafb77d8),
   [#5050](https://github.com/angular/angular.js/issues/5050))
- **ngAnimate:**
  - correctly retain and restore existing styles during and after animation
  ([c42d0a04](https://github.com/angular/angular.js/commit/c42d0a041890b39fc98afd357ec1307a3a36208d),
   [#4869](https://github.com/angular/angular.js/issues/4869))
  - use a fallback CSS property that doesn't break existing styles
  ([1d50663b](https://github.com/angular/angular.js/commit/1d50663b38ba042e8d748ffa6d48cfb5e93cfd7e),
   [#4902](https://github.com/angular/angular.js/issues/4902),
   [#5030](https://github.com/angular/angular.js/issues/5030))
- **ngClass:** ensure that ngClass only adds/removes the changed classes
  ([6b8bbe4d](https://github.com/angular/angular.js/commit/6b8bbe4d90640542eed5607a8c91f6b977b1d6c0),
   [#4960](https://github.com/angular/angular.js/issues/4960),
   [#4944](https://github.com/angular/angular.js/issues/4944))
- **ngController:** fix issue with ngInclude on the same element
  ([6288cf5c](https://github.com/angular/angular.js/commit/6288cf5ca471b0615a026fdb4db3ba242c9d8f88),
   [#4431](https://github.com/angular/angular.js/issues/4431))
- **ngInclude:**
  - Don't throw when the ngInclude element contains content with directives.
  ([0a7cbb33](https://github.com/angular/angular.js/commit/0a7cbb33b06778833a4d99b1868cc07690a827a7))
  - allow ngInclude to load scripts when jQuery is included
  ([c47abd0d](https://github.com/angular/angular.js/commit/c47abd0dd7490576f4b84ee51ebaca385c1036da),
   [#3756](https://github.com/angular/angular.js/issues/3756))
- **ngMock:** fixes httpBackend expectation with body object
  ([4d16472b](https://github.com/angular/angular.js/commit/4d16472b918a3482942d76f1e273a5aa01f65e83),
   [#4956](https://github.com/angular/angular.js/issues/4956))
- **ngView:** Don't throw when the ngView element contains content with directives.
  ([e6521e74](https://github.com/angular/angular.js/commit/e6521e7491242504250b57dd0ee66af49e653c33),
   [#5069](https://github.com/angular/angular.js/issues/5069))
- **tests:** Correct tests for IE11
  ([57924234](https://github.com/angular/angular.js/commit/579242346c4202ea58fc2cae6df232289cbea0bb),
   [#5046](https://github.com/angular/angular.js/issues/5046))
- **input:** hold listener during text composition
  ([a4e6d962](https://github.com/angular/angular.js/commit/a4e6d962d78b26f5112d48c4f88c1e6234d0cae7),
   [#4684](https://github.com/angular/angular.js/issues/4684))




<a name="1.2.1"></a>
# 1.2.1 underscore-empathy (2013-11-14)


## Bug Fixes

- **$compile:**
  - accessing controllers of transcluded directives from children
  ([90f87072](https://github.com/angular/angular.js/commit/90f87072e83234ae366cfeb3c281503c31dad738),
   [#4935](https://github.com/angular/angular.js/issues/4935))
  - correctly handle interpolated style in replace templates
  ([e1254b26](https://github.com/angular/angular.js/commit/e1254b266dfa2d4e3756e4317152dbdbcabe44be),
   [#4882](https://github.com/angular/angular.js/issues/4882))
- **$resource:** don't use $parse for @dotted.member
  ([9577702e](https://github.com/angular/angular.js/commit/9577702e8d2519c1a60f5ac4058e63bd7b919815))
- **bootstrap:** make IE8 happy
  ([a61b65d0](https://github.com/angular/angular.js/commit/a61b65d01b468502fe53d68818949d3fcc9f20f6))
- **loader:** don't rely on internal APIs
  ([8425e9fe](https://github.com/angular/angular.js/commit/8425e9fe383c17f6a5589c778658c5fc0570ae8f),
   [#4437](https://github.com/angular/angular.js/issues/4437), [#4874](https://github.com/angular/angular.js/issues/4874))
- **minErr:** remove references to internal APIs
  ([94764ee0](https://github.com/angular/angular.js/commit/94764ee08910726db1db7a1101c3001500306dea))
- **ngIf:** don't create multiple elements when changing from a truthy value to another thruthy value
  ([4612705e](https://github.com/angular/angular.js/commit/4612705ec297bc6ba714cb7a98f1be6aff77c4b8),
   [#4852](https://github.com/angular/angular.js/issues/4852))
- **urlUtils:**
  - make removal of windows drive from path safer
  ([89f435de](https://github.com/angular/angular.js/commit/89f435de847635e3ec339726e6f83cf3f0ee9091),
   [#4939](https://github.com/angular/angular.js/issues/4939))
  - return right path for file:// on windows
  ([f925e8ca](https://github.com/angular/angular.js/commit/f925e8caa6c51a7d45ca9ead30601ec2e9d4464c),
   [#4680](https://github.com/angular/angular.js/issues/4680))


## Features

- **$parse:** revert hiding "private" properties
  ([4ab16aaa](https://github.com/angular/angular.js/commit/4ab16aaaf762e9038803da1f967ac8cb6650727d),
   [#4926](https://github.com/angular/angular.js/issues/4926), [#4842](https://github.com/angular/angular.js/issues/4842), [#4865](https://github.com/angular/angular.js/issues/4865), [#4859](https://github.com/angular/angular.js/issues/4859), [#4849](https://github.com/angular/angular.js/issues/4849))



<a name="1.2.0"></a>
# 1.2.0 timely-delivery (2013-11-08)



## Features


- **animations:**
  - ensure CSS transitions can work with inherited CSS class definitions
  ([9d69a0a7](https://github.com/angular/angular.js/commit/9d69a0a7c75c937c0a49bb705d31252326b052df))
  - provide support for staggering animations with CSS
  ([74848307](https://github.com/angular/angular.js/commit/74848307443c00ab07552336c56ddfa1e9ef6eff))
- **$parse:** secure expressions by hiding "private" properties
  ([3d6a89e8](https://github.com/angular/angular.js/commit/3d6a89e8888b14ae5cb5640464e12b7811853c7e))
- **docs:**
  - provide index pages for each angular module
  ([a7e12b79](https://github.com/angular/angular.js/commit/a7e12b7959212f2fa88fe17d5a045cc9d8b22922))
  - add forward slash shortcut key for search bar
  ([74912802](https://github.com/angular/angular.js/commit/74912802c644ca929e39a7583cb7a9a05f12e91f))
- **jqLite:** expose isolateScope() getter similar to scope()
  ([27e9340b](https://github.com/angular/angular.js/commit/27e9340b3c25b512e45213b39811098d07e12e3b))
- **misc:** add externs file for Closure Compiler
  ([9d0a6977](https://github.com/angular/angular.js/commit/9d0a69772c39bfc751ca2000c3b4b3381e51fe93))



## Bug Fixes

- **$animate:**
  - don't force animations to be enabled
  ([98adc9e0](https://github.com/angular/angular.js/commit/98adc9e0383dc05efad168f30a0725cb67f5eda8))
  - only apply the fallback property if any transition animations are detected
  ([94700807](https://github.com/angular/angular.js/commit/9470080762aecca5285d0f5cac4ae01540bbad4c))
  - avoid hanging animations if the active CSS transition class is missing
  ([b89584db](https://github.com/angular/angular.js/commit/b89584db10b63f346cbfd03f67fb92504e5bf362),
   [#4732](https://github.com/angular/angular.js/issues/4732), [#4490](https://github.com/angular/angular.js/issues/4490))
  - ensure staggering animations understand multiple delay values
  ([41a2d5b3](https://github.com/angular/angular.js/commit/41a2d5b30f4feb90651eb577cf44852a6d2be72c))
  - ensure the active class is not applied if cancelled during reflow
  ([e53ff431](https://github.com/angular/angular.js/commit/e53ff431e1472c0b2d5405d267d4e403ca31087e),
   [#4699](https://github.com/angular/angular.js/issues/4699))
  - use direct DOM comparison when checking for $rootElement
  ([d434eabe](https://github.com/angular/angular.js/commit/d434eabec3955f8d56c859c93befe711bfa1de27),
   [#4679](https://github.com/angular/angular.js/issues/4679))
  - ensure former nodes are fully cleaned up when a follow-up structural animation takes place
  ([7f0767ac](https://github.com/angular/angular.js/commit/7f0767acaba1ec3c8849244a604b0d1c8c376446),
   [#4435](https://github.com/angular/angular.js/issues/4435))
  - ensure enable/disable animations work when the document node is used
  ([6818542c](https://github.com/angular/angular.js/commit/6818542c694aec6c811fb2fe2f86f7d16544c39b),
   [#4669](https://github.com/angular/angular.js/issues/4669))
  - skip unnecessary addClass/removeClass animations
  ([76b628bc](https://github.com/angular/angular.js/commit/76b628bcb3511210d312ed667e5c14d908a9fed1),
   [#4401](https://github.com/angular/angular.js/issues/4401), [#2332](https://github.com/angular/angular.js/issues/2332))
  - ensure animations work properly when the $rootElement is being animated
  ([2623de14](https://github.com/angular/angular.js/commit/2623de1426219dc799f63a3d155911f93fc03461),
   [#4397](https://github.com/angular/angular.js/issues/4397), [#4231](https://github.com/angular/angular.js/issues/4231))
  - only cancel class-based animations if the follow-up class contains CSS transition/keyframe animation code
  ([f5289fe8](https://github.com/angular/angular.js/commit/f5289fe84ffc1f2368dae7bd14c420abbe76749e),
   [#4463](https://github.com/angular/angular.js/issues/4463), [#3784](https://github.com/angular/angular.js/issues/3784))
- **$compile:**
  - don't leak isolate scope state when replaced directive is used multiple times
  ([b5af198f](https://github.com/angular/angular.js/commit/b5af198f0d5b0f2b3ddb31ea12f700f3e0616271))
  - correct isolate scope distribution to controllers
  ([3fe4491a](https://github.com/angular/angular.js/commit/3fe4491a6bf57ddeb312b8a30cf1706f6f1d2355))
  - replaced element has isolate scope
  ([97c7a4e3](https://github.com/angular/angular.js/commit/97c7a4e3791d7cb05c3317cc5f0c49ab93810bf6))
  - only pass isolate scope to children that belong to the isolate directive
  ([d0efd5ee](https://github.com/angular/angular.js/commit/d0efd5eefcc0aaf167c766513e152b74dd31bafe))
  - make isolate scope truly isolate
  ([909cabd3](https://github.com/angular/angular.js/commit/909cabd36d779598763cc358979ecd85bb40d4d7),
   [#1924](https://github.com/angular/angular.js/issues/1924), [#2500](https://github.com/angular/angular.js/issues/2500))
  - don't instantiate controllers twice for element transclude directives
  ([18ae985c](https://github.com/angular/angular.js/commit/18ae985c3a3147b589c22f6ec21bacad2f578e2b),
   [#4654](https://github.com/angular/angular.js/issues/4654))
  - attribute bindings should not break due to terminal directives
  ([79223eae](https://github.com/angular/angular.js/commit/79223eae5022838893342c42dacad5eca83fabe8),
   [#4525](https://github.com/angular/angular.js/issues/4525), [#4528](https://github.com/angular/angular.js/issues/4528), [#4649](https://github.com/angular/angular.js/issues/4649))
  - instantiate controllers when re-entering compilation
  ([faf5b980](https://github.com/angular/angular.js/commit/faf5b980da09da2b4c28f1feab33f87269f9f0ba),
   [#4434](https://github.com/angular/angular.js/issues/4434), [#4616](https://github.com/angular/angular.js/issues/4616))
- **$injector:** allow a constructor function to return a function
  ([c22adbf1](https://github.com/angular/angular.js/commit/c22adbf160f32c1839fbb35382b7a8c6bcec2927))
- **$parse:** check function call context to be safe
  ([6d324c76](https://github.com/angular/angular.js/commit/6d324c76f0d3ad7dae69ce01b14e0564938fb15e),
   [#4417](https://github.com/angular/angular.js/issues/4417))
- **angular-mocks:** add inline dependency annotation
  ([6d23591c](https://github.com/angular/angular.js/commit/6d23591c31f2b41097ceaa380af09998e4a62f09),
   [#4448](https://github.com/angular/angular.js/issues/4448))
- **animateSpec:** run digest to enable animations before tests
  ([aea76f0d](https://github.com/angular/angular.js/commit/aea76f0d5c43dc17f1319d0a45d2ce50fddf72e4))
- **bootstrap-prettify:** share $animate and $$postDigestQueue with demo apps
  ([1df3da36](https://github.com/angular/angular.js/commit/1df3da361d62726bf1dafe629a7fca845b6a8733))
- **csp:**
  - fix csp auto-detection and stylesheet injection
  ([08f376f2](https://github.com/angular/angular.js/commit/08f376f2ea3d3bb384f10e3c01f7d48ed21ce351),
   [#917](https://github.com/angular/angular.js/issues/917), [#2963](https://github.com/angular/angular.js/issues/2963), [#4394](https://github.com/angular/angular.js/issues/4394), [#4444](https://github.com/angular/angular.js/issues/4444))
  - don't inline css in csp mode
  ([a86cf20e](https://github.com/angular/angular.js/commit/a86cf20e67202d614bbcaf038c5e04db94483256)
- **docModuleComponents:** implement anchor scroll when content added
  ([eb51b024](https://github.com/angular/angular.js/commit/eb51b024c9b77527420014cdf7dbb292b5b9dd6b),
   [#4703](https://github.com/angular/angular.js/issues/4703))
- **input:** keep track of min/max attars on-the-fly
  ([4b653aea](https://github.com/angular/angular.js/commit/4b653aeac1aca7ac551738870a2446b6810ca0df))
- **ngAnimate:** fix cancelChildAnimations throwing exception
  ([b9557b0a](https://github.com/angular/angular.js/commit/b9557b0a86206d938a738ea470736d011dff7e1a),
   [#4548](https://github.com/angular/angular.js/issues/4548))
- **ngClassSpec:** clear animation enable fn from postDigestQueue
  ([ffa9d0a6](https://github.com/angular/angular.js/commit/ffa9d0a6db137cba4090e569b8ed4e25a711314e))
- **ngEventDirectives:** parse expression only once during compile phase.
  ([9a828738](https://github.com/angular/angular.js/commit/9a828738cd2e959bc2a198989e96c8e416d28b71))
- **ngIf:**
  - destroy child scope when destroying DOM
  ([9483373c](https://github.com/angular/angular.js/commit/9483373c331343648e079420b3eb1f564d410ff2))
  - ngIf removes elements dynamically added to it
  ([e19067c9](https://github.com/angular/angular.js/commit/e19067c9bbac3c3bb450c80f73eb5518bd0db1a1))
- **ngInclude:** only run anchorScroll after animation is done
  ([d378f550](https://github.com/angular/angular.js/commit/d378f5500ab2eef0779338336c6a95656505ebb8),
   [#4723](https://github.com/angular/angular.js/issues/4723))
- **ngMock:** throw more descriptive errors for $animate.flushNext()
  ([6fb19157](https://github.com/angular/angular.js/commit/6fb191570ee72f087e8bb6b1d8f5eea0f585886c))
- **ngModel:** deregister from the form on scope not DOM destruction
  ([8f989d65](https://github.com/angular/angular.js/commit/8f989d652f70fd147f66a18411070c7b939e242e),
   [#4226](https://github.com/angular/angular.js/issues/4226), [#4779](https://github.com/angular/angular.js/issues/4779))
- **ngScenario:** correctly disable animations for end 2 end tests
  ([9d004585](https://github.com/angular/angular.js/commit/9d0045856351e9db48ddf66f66e210d9cc53d24a))
- **ngView:**
  - only run anchorScroll after animation is done
  ([da344daa](https://github.com/angular/angular.js/commit/da344daa4023556f8abbef6d8ad87a16362b5861))
  - ensure the new view element is placed after the old view element
  ([3f568b22](https://github.com/angular/angular.js/commit/3f568b22f9bec09192588e3cae937db5c2e757f9),
   [#4362](https://github.com/angular/angular.js/issues/4362))
- **ngdocs:**
  - create mock Doc objects correctly
  ([d4493fda](https://github.com/angular/angular.js/commit/d4493fda2c4c2ff1fdfc264bfb479741abc781c7))
  - `shortDescription()` should not error if no `description`
  ([4c8fa353](https://github.com/angular/angular.js/commit/4c8fa353245b9c32261860caff18f002d294e19f))
  - remove the side search bar
  ([6c20ec19](https://github.com/angular/angular.js/commit/6c20ec193f11aa647be1b2ad2ac5b3e7c2894bd7))



## Breaking Changes

- **$compile:**
  - due to [d0efd5ee](https://github.com/angular/angular.js/commit/d0efd5eefcc0aaf167c766513e152b74dd31bafe),
  Child elements that are defined either in the application template or in some other
  directives template do not get the isolate scope. In theory, nobody should rely on this behavior, as
  it is very rare - in most cases the isolate directive has a template.

  - due to [909cabd3](https://github.com/angular/angular.js/commit/909cabd36d779598763cc358979ecd85bb40d4d7),
  Directives without isolate scope do not get the isolate scope from an isolate directive on the
  same element. If your code depends on this behavior (non-isolate directive needs to access state
  from within the isolate scope), change the isolate directive to use scope locals to pass these explicitly.

  **Before**

  ```
  <input ng-model="$parent.value" ng-isolate>

  .directive('ngIsolate', function() {
    return {
      scope: {},
      template: '{{value}}'
    };
  });
  ```

  **After**

  ```
  <input ng-model="value" ng-isolate>

  .directive('ngIsolate', function() {
    return {
      scope: {value: '=ngModel'},
      template: '{{value}}
    };
  });
  ```

  Closes [#1924](https://github.com/angular/angular.js/issues/1924) and
  [#2500](https://github.com/angular/angular.js/issues/2500)

  - due to [79223eae](https://github.com/angular/angular.js/commit/79223eae5022838893342c42dacad5eca83fabe8),

  Previously, the interpolation priority was `-100` in 1.2.0-rc.2, and `100` before 1.2.0-rc.2.
  Before this change the binding was setup in the post-linking phase.

  Now the attribute interpolation (binding) executes as a directive with priority 100 and the
  binding is set up in the pre-linking phase.

  Closes [#4525](https://github.com/angular/angular.js/issues/4525),
  [#4528](https://github.com/angular/angular.js/issues/4528), and
  [#4649](https://github.com/angular/angular.js/issues/4649)


- **$parse:** due to [3d6a89e8](https://github.com/angular/angular.js/commit/3d6a89e8888b14ae5cb5640464e12b7811853c7e),

  This commit introduces the notion of "private" properties (properties
  whose names begin and/or end with an underscore) on the scope chain.
  These properties will not be available to Angular expressions (i.e. {{
  }} interpolation in templates and strings passed to `$parse`)  They are
  freely available to JavaScript code (as before).

  **Motivation**

  Angular expressions execute in a limited context. They do not have
  direct access to the global scope, `window`, `document` or the Function
  constructor. However, they have direct access to names/properties on
  the scope chain. It has been a long standing best practice to keep
  sensitive APIs outside of the scope chain (in a closure or your
  controller.) That's easier said that done for two reasons:

  1. JavaScript does not have a notion of private properties so if you need
  someone on the scope chain for JavaScript use, you also expose it to
  Angular expressions
  2. the new "controller as" syntax that's now in increased usage exposes the
  entire controller on the scope chain greatly increasing the exposed surface.

  Though Angular expressions are written and controlled by the developer, they:

  1. Typically deal with user input
  2. Don't get the kind of test coverage that JavaScript code would

  This commit provides a way, via a naming convention, to
  allow publishing/restricting properties from controllers/scopes to
  Angular expressions enabling one to only expose those properties that
  are actually needed by the expressions.

- **csp:** due to [08f376f2](https://github.com/angular/angular.js/commit/08f376f2ea3d3bb384f10e3c01f7d48ed21ce351),
  triggering ngCsp directive via `ng:csp` attribute is not supported any more.
  Please use `data-ng-csp` instead.

- **jqLite:** due to [27e9340b](https://github.com/angular/angular.js/commit/27e9340b3c25b512e45213b39811098d07e12e3b),
  `jqLite.scope()` (commonly used through `angular.element(node).scope()`) does not return the
  isolate scope on the element that triggered directive with isolate scope. Use
  `jqLite.isolateScope()` instead.





<a name="1.2.0-rc.3"></a>
# 1.2.0-rc.3 ferocious-twitch (2013-10-14)


## Features

- **$interval:** add a service wrapping setInterval
  ([2b5ce84f](https://github.com/angular/angular.js/commit/2b5ce84fca7b41fca24707e163ec6af84bc12e83))
- **$sce:** simpler patterns for `$sceDelegateProviders` white/blacklists
  ([93ce5923](https://github.com/angular/angular.js/commit/93ce5923e92f6d2db831d8715ec62734821c70ce),
   [#4006](https://github.com/angular/angular.js/issues/4006))
- **$filter:** allow map of filters to be registered
  ([4033cf28](https://github.com/angular/angular.js/commit/4033cf28142664c52aa7b4bc95340ac913397ac8),
   [#4036](https://github.com/angular/angular.js/issues/4036),
   [#4091](https://github.com/angular/angular.js/issues/4091))
- **$compile:** support `tel:` links in `a[href]`
  ([e7730297](https://github.com/angular/angular.js/commit/e773029717f11d727af609a139b173a135c79eab))

- **Directives:**
  - **ngRepeat:** support repeating over `ngInclude` and other directives that replace repeated nodes
    ([9efa46ae](https://github.com/angular/angular.js/commit/9efa46ae640cde17487c341daa9a75c0bd79da02),
     [#3104](https://github.com/angular/angular.js/issues/3104))
  - **event directives:** add `ngCopy`, `ngCut`, and `ngPaste`
  ([147c6929](https://github.com/angular/angular.js/commit/147c6929a264a7b077a5f2cfc5aa9a0b9513acd7),
   [#4172](https://github.com/angular/angular.js/issues/4172))

- **Misc:**
  - jQuery 1.10.x support
  ([e0c134b8](https://github.com/angular/angular.js/commit/e0c134b8bfa282379daec6a7137512d58f956443),
   [#3764](https://github.com/angular/angular.js/issues/3764))
  - **minErr:** linkify error messages on minErr docs pages
  ([6aaae062](https://github.com/angular/angular.js/commit/6aaae062171bfc8e5046c3eae99bc9d63037120a))
  - **tutorial:** add step 12 on animations to the phonecat tutorial
  ([ad525645](https://github.com/angular/angular.js/commit/ad5256452bb8f1d481d78e7ae15a59d288f0d8e9))



## Bug Fixes

- **$compile:**
  - abort compilation when duplicate element transclusion
  ([63c5334c](https://github.com/angular/angular.js/commit/63c5334c84b7269428c710226764d1f08a36e0d4),
   [#3893](https://github.com/angular/angular.js/issues/3893),
   [#4217](https://github.com/angular/angular.js/issues/4217),
   [#3307](https://github.com/angular/angular.js/issues/3307))
  - make order directives w/ same priority deterministic
  ([4357da85](https://github.com/angular/angular.js/commit/4357da857587d3c28790e7dc654664bec5808768))
  - fix (reverse) directive postLink fn execution order
  ([31f190d4](https://github.com/angular/angular.js/commit/31f190d4d53921d32253ba80d9ebe57d6c1de82b),
   [#3558](https://github.com/angular/angular.js/issues/3558))
  - don't terminate compilation for regular transclusion directives
  ([fe214501](https://github.com/angular/angular.js/commit/fe2145016cb057c92f9f01b32c58b4d7259eb6ee))
  - ng-attr to support dash separated attribute names
  ([8e6e3eba](https://github.com/angular/angular.js/commit/8e6e3ebad991eaf57a7885549ea3b91932d495c9))
  - allow interpolations for non-event handlers attrs
  ([8e1276c0](https://github.com/angular/angular.js/commit/8e1276c011b33b90af47494dc5e76baf86468a5a))
  - link parents before traversing
  ([742271ff](https://github.com/angular/angular.js/commit/742271ffa3a518d9e8ef2cb97c24b45b44e3378d),
   [#3792](https://github.com/angular/angular.js/issues/3792),
   [#3923](https://github.com/angular/angular.js/issues/3923),
   [#3935](https://github.com/angular/angular.js/issues/3935),
   [#3927](https://github.com/angular/angular.js/issues/3927))
  - collect ranges on multiple directives on one element
  ([6a8edc1d](https://github.com/angular/angular.js/commit/6a8edc1d43aca7c5a92f86309b1bb1d5f9968442),
   [#4002](https://github.com/angular/angular.js/issues/4002))
- **$parse:**
  - deprecate promise unwrapping and make it an opt-in
  ([5dc35b52](https://github.com/angular/angular.js/commit/5dc35b527b3c99f6544b8cb52e93c6510d3ac577),
   [#4158](https://github.com/angular/angular.js/issues/4158),
   [#4270](https://github.com/angular/angular.js/issues/4270))
  - disallow access to window and dom in expressions
  ([be0b4856](https://github.com/angular/angular.js/commit/be0b4856699334ff51bacf2d1fd3394663d6bd28))
- **$httpBackend:**
  - set headers with falsy values
  ([e9a22241](https://github.com/angular/angular.js/commit/e9a222418a029d830698444cf95bf13f8ad75805),
   [#2984](https://github.com/angular/angular.js/issues/2984))
  - don't send empty string bodies
  ([0d0330ad](https://github.com/angular/angular.js/commit/0d0330adc24a68cd6891a030a56d3ce3bbced03c),
   [#2149](https://github.com/angular/angular.js/issues/2149))
- **$location:**
  - prevent infinite digest error in IE7
  ([d7071148](https://github.com/angular/angular.js/commit/d70711481e6311c9cd283d650f07ca0cca72ecc2),
   [#2802](https://github.com/angular/angular.js/issues/2802))
  - re-assign location after BFCache back
  ([2ebf9316](https://github.com/angular/angular.js/commit/2ebf93163027abc55ba27f673be3b8dc1281c068),
   [#4044](https://github.com/angular/angular.js/issues/4044))
- **$log:** prevent logging `undefined` for $log in IE
  ([4ff1a650](https://github.com/angular/angular.js/commit/4ff1a65031e985bf930f6761c1ecf46e4db98d6e),
   [#1705](https://github.com/angular/angular.js/issues/1705))
- **Scope:**
  - `$evalAsync` executes on the right scope
  ([10cc1a42](https://github.com/angular/angular.js/commit/10cc1a42c925749f88433546d41d35ba07a88e6f))
  - make `stopPropagation` only stop its own event
  ([47f7bd70](https://github.com/angular/angular.js/commit/47f7bd706efc5f2944d182e46c1b1d324298ff36),
   [#4204](https://github.com/angular/angular.js/issues/4204))

- **Filters:**
  - **date:** allow negative millisecond value strings
  ([025c9219](https://github.com/angular/angular.js/commit/025c92190376414c15f15fd20a75b41489a4e70a))

- **Directives:**
  - correct priority of structural directives (ngRepeat, ngSwitchWhen, ngIf, ngInclude, ngView)
  ([b7af76b4](https://github.com/angular/angular.js/commit/b7af76b4c5aa77648cc1bfd49935b48583419023))
  - **input:** `false` is no longer an empty value by default
  ([b56b21a8](https://github.com/angular/angular.js/commit/b56b21a898b3c77589a48a290271f9dc181dafe8),
   [#3490](https://github.com/angular/angular.js/issues/3490))
  - **ngBindHtml:** watch string value instead of wrapper
  ([e2068ad4](https://github.com/angular/angular.js/commit/e2068ad426075ac34c06c12e2fac5f594cc81969),
   [#3932](https://github.com/angular/angular.js/issues/3932))
  - **ngOptions:** ignore object properties which start with $
  ([aa3c54c7](https://github.com/angular/angular.js/commit/aa3c54c73f7470999535294899a1c33cd193f455))
  - **ngRepeat:** correctly track elements even when the collection is initially undefined
  ([31c56f54](https://github.com/angular/angular.js/commit/31c56f540045b5270f5b8e235873da855caf3486),
   [#4145](https://github.com/angular/angular.js/issues/4145),
   [#3964](https://github.com/angular/angular.js/issues/3964))
  - **ngTransclude:** detect ngTranslude usage without a transclusion directive
  ([5a1a6b86](https://github.com/angular/angular.js/commit/5a1a6b86a8dbcd8aa4fe9c59fad8d005eead686c),
   [#3759](https://github.com/angular/angular.js/issues/3759))


- **jqLite:**
  - ignore class methods on comment elements
  ([64fd2c42](https://github.com/angular/angular.js/commit/64fd2c421ed582c16812d164a8a6f031b8e66287))
  - use get/setAttribute so that jqLite works on SVG nodes
  ([c785267e](https://github.com/angular/angular.js/commit/c785267eb8780d8b7658ef93ebb5ebddd566294d),
   [#3858](https://github.com/angular/angular.js/issues/3858))

- **Misc:**
  - **isArrayLike:** correctly handle string primitives
  ([5b8c7884](https://github.com/angular/angular.js/commit/5b8c78843e8d62a7a67cead8bf04c76aa8ee411d),
   [#3356](https://github.com/angular/angular.js/issues/3356))
  - protect calls to hasOwnProperty in public API
  ([7a586e5c](https://github.com/angular/angular.js/commit/7a586e5c19f3d1ecc3fefef084ce992072ee7f60),
   [#3331](https://github.com/angular/angular.js/issues/3331))

- **ngRoute:**
  - **ngView:** IE8 regression due to expando on non-element nodes
  ([255e8c13](https://github.com/angular/angular.js/commit/255e8c13cf0fd78f1c4d7c279be7bf47c2402956),
   [#3971](https://github.com/angular/angular.js/issues/3971))
  - **$route:** parametrized routes do not match against locations that would not valorize each parameters.
  ([0ff86c32](https://github.com/angular/angular.js/commit/0ff86c323359fba1a60bacab178e3c68528f8e1f))

- **ngResource:**
  - pass transformed value to both callbacks and promises
  ([e36e28eb](https://github.com/angular/angular.js/commit/e36e28ebd4a6c144e47d11fba8e211d8d5a9d03e),
   [#3817](https://github.com/angular/angular.js/issues/3817))
  - remove request body from $delete
  ([8336b3a2](https://github.com/angular/angular.js/commit/8336b3a286f8469d4cd7c412c41ca8c1a31fecf0),
   [#4280](https://github.com/angular/angular.js/issues/4280))

- **ngSanitize:**
  - sanitize DOCTYPE declarations correctly
  ([e66c23fe](https://github.com/angular/angular.js/commit/e66c23fe55f8571a014b0686c8dbca128e7a8240),
   [#3931](https://github.com/angular/angular.js/issues/3931))
  - sanitizer should not accept <!--> as a valid comment
  ([21e9e8cf](https://github.com/angular/angular.js/commit/21e9e8cf68ef007136da6cc212d2f1f252fb668a))

- **ngTouch:**
  - ngClick does not pass touchend event when jQuery is loaded
  ([9fd92cc3](https://github.com/angular/angular.js/commit/9fd92cc3c93a6378e8887fd46fd4ad182a375544))
  - add $event to ng-swipe
  ([507d8021](https://github.com/angular/angular.js/commit/507d8021b1c91cc0cefc0418e61b04597ad1030b),
   [#4071](https://github.com/angular/angular.js/issues/4071),
   [#4321](https://github.com/angular/angular.js/issues/4321))

- **ngAnimate:**
  - ensure that a timeStamp is created if not provided by the browser event
  ([cd216c4c](https://github.com/angular/angular.js/commit/cd216c4c30adfebb3ef633f18fab2d98e8c52ebc),
   [#3053](https://github.com/angular/angular.js/issues/3053))
  - perform internal caching on getComputedStyle to boost the performance of CSS3 transitions/animations
  ([b1e604e3](https://github.com/angular/angular.js/commit/b1e604e38ceec1714174fb54cc91590a7fe99a92),
   [#4011](https://github.com/angular/angular.js/issues/4011),
   [#4124](https://github.com/angular/angular.js/issues/4124))
  - ensure structural animations skip all child animations even if no animation is present during compile
  ([cc584607](https://github.com/angular/angular.js/commit/cc5846073e57ef190182026d7e5a8e2770d9b770),
   [#3215](https://github.com/angular/angular.js/issues/3215))
  - cancel any ongoing child animations during move and leave animations
  ([3f31a7c7](https://github.com/angular/angular.js/commit/3f31a7c7691993893f0724076816f6558643bd91))
  - ensure elapsedTime always considers delay values
  ([079dd939](https://github.com/angular/angular.js/commit/079dd93991ac79b5f9af6efb7fe2b3600195f10c))
  - ensure transition-property is not changed when only keyframe animations are in use
  ([2df3c9f5](https://github.com/angular/angular.js/commit/2df3c9f58def9584455f7c4bfdabbd12aab58bf9),
   [#3933](https://github.com/angular/angular.js/issues/3933))
  - avoid completing the animation asynchronously unless CSS transtiions/animations are present
  ([2a63dfa6](https://github.com/angular/angular.js/commit/2a63dfa6cc7889888f4296fff2944e74ff30b3af),
   [#4023](https://github.com/angular/angular.js/issues/4023),
   [#3940](https://github.com/angular/angular.js/issues/3940))
  - ensure that delays are always considered before an animation closes
  ([0a63adce](https://github.com/angular/angular.js/commit/0a63adce687d28ada90ea930d5e69883cc11cba5),
   [#4028](https://github.com/angular/angular.js/issues/4028))
  - check elapsedTime on current event
  ([d50ed6bf](https://github.com/angular/angular.js/commit/d50ed6bfb8c4982401923ff535fe932ef4f387a2))
  - support addClass/removeClass animations on SVG nodes
    ([c785267e](https://github.com/angular/angular.js/commit/c785267eb8780d8b7658ef93ebb5ebddd566294d),
     [#3858](https://github.com/angular/angular.js/issues/3858))

- **ngScenario:**
  - remove redundant assignment
  ([a80e96ce](https://github.com/angular/angular.js/commit/a80e96cea184b392505f0a292785a5c66d45e165),
   [#4315](https://github.com/angular/angular.js/issues/4315))
  - fix error message description
  ([f8f8f754](https://github.com/angular/angular.js/commit/f8f8f754b02459bb789247476cc0da63d2d7370f))
  - provide event parameters as object
  ([28f56a38](https://github.com/angular/angular.js/commit/28f56a383e9d1ff378e3568a3039e941c7ffb1d8))
  - include "not " in error messages if test is inverted
  ([3589f178](https://github.com/angular/angular.js/commit/3589f17824376e9db4e8d002caeb4483943eeb18),
   [#3840](https://github.com/angular/angular.js/issues/3840))


## Breaking Changes

- **$compile:** due to [31f190d4](https://github.com/angular/angular.js/commit/31f190d4d53921d32253ba80d9ebe57d6c1de82b),
  the order of postLink fn is now mirror opposite of the order in which corresponding preLinking and compile functions execute.

  Previously the compile/link fns executed in this order controlled via priority:

  - CompilePriorityHigh, CompilePriorityMedium, CompilePriorityLow
  - compile child nodes
  - PreLinkPriorityHigh, PreLinkPriorityMedium, PreLinkPriorityLow
  - link child nodes
  - PostLinkPriorityHigh, PostLinkPriorityMedium, PostLinkPriorityLow

  This was changed to:

  - CompilePriorityHigh, CompilePriorityMedium, CompilePriorityLow
  - compile child nodes
  - PreLinkPriorityHigh, PreLinkPriorityMedium, PreLinkPriorityLow
  - link child nodes
  - PostLinkPriorityLow, PostLinkPriorityMedium , PostLinkPriorityHigh

  Very few directives in practice rely on order of postLinking function (unlike on the order of compile functions), so
  in the rare case of this change affecting an existing directive, it might be necessary to convert it to a preLinking
  function or give it negative priority (look at the diff of this commit to see how an internal attribute interpolation
  directive was adjusted).

- **$parse:**
  - due to [5dc35b52](https://github.com/angular/angular.js/commit/5dc35b527b3c99f6544b8cb52e93c6510d3ac577),
  $parse and templates in general will no longer automatically unwrap promises. This feature has been deprecated and if absolutely needed, it can be reenabled during transitional period via `$parseProvider.unwrapPromises(true)` api.
  - due to [b6a37d11](https://github.com/angular/angular.js/commit/b6a37d112b3e1478f4d14a5f82faabf700443748),
  feature added in rc.2 that unwraps return values from functions if the values are promises (if promise unwrapping is enabled - see previous point), was reverted due to breaking a popular usage pattern.

- **directives:** due to [b7af76b4](https://github.com/angular/angular.js/commit/b7af76b4c5aa77648cc1bfd49935b48583419023),
  the priority of ngRepeat, ngSwitchWhen, ngIf, ngInclude and ngView has changed. This could affect directives that explicitly specify their priority.

  In order to make ngRepeat, ngSwitchWhen, ngIf, ngInclude and ngView work together in all common scenarios their directives are being adjusted to achieve the following precedence:

  ```
  Directive        | Old Priority | New Priority
  =============================================
  ngRepeat         | 1000         | 1000
  ---------------------------------------------
  ngSwitchWhen     | 500          | 800
  ---------------------------------------------
  ngIf             | 1000         | 600
  ---------------------------------------------
  ngInclude/ngView | 1000         | 400
  ```

- **form/ngForm** due to [7a586e5c](https://github.com/angular/angular.js/commit/7a586e5c19f3d1ecc3fefef084ce992072ee7f60),
  Inputs with name equal to "hasOwnProperty" are not allowed inside form or ngForm directives.

  Before, inputs whose name was "hasOwnProperty" were quietly ignored and not added to the scope.  Now a badname exception is thrown.

  Using "hasOwnProperty" for an input name would be very unusual and bad practice.

  Either do not include such an input in a `form` or `ngForm` directive or change the name of the input.


- **ngScenario:** due to [28f56a38](https://github.com/angular/angular.js/commit/28f56a383e9d1ff378e3568a3039e941c7ffb1d8),
  browserTrigger now uses an eventData object instead of direct parameters for mouse events.
  To migrate, place the `keys`,`x` and `y` parameters inside of an object and place that as the third parameter for the browserTrigger function.





<a name="1.2.0-rc.2"></a>
# 1.2.0-rc.2 barehand-atomsplitting (2013-09-04)

## Features

- **Scope:** asynchronously auto-flush `$evalAsync` queue when outside of `$digest` cycle
  ([6b91aa0a](https://github.com/angular/angular.js/commit/6b91aa0a18098100e5f50ea911ee135b50680d67),
   [#3539](https://github.com/angular/angular.js/issues/3539), [#2438](https://github.com/angular/angular.js/issues/2438))
- **minErr:** log minerr doc url in development builds
  ([37123cd2](https://github.com/angular/angular.js/commit/37123cd2858b4e318ed8109af745312df4848577),
   [#3566](https://github.com/angular/angular.js/issues/3566))
- **ngMock:**
  - allow passing an object literal as shorthand to module
  ([f737c97d](https://github.com/angular/angular.js/commit/f737c97df02918eb5b19bf5c8248fa3e20f9b361))
  - add support for creating dynamic style sheets within test code
  ([fb3a7db0](https://github.com/angular/angular.js/commit/fb3a7db0809b959d50be4cb93a65a91200071dd5))



## Bug Fixes

- **$http:** allow empty responses to be cached
  ([8e48c4ff](https://github.com/angular/angular.js/commit/8e48c4ff6abf7083a04cf20312d2b106f4ba5b2c),
   [#3809](https://github.com/angular/angular.js/issues/3809))
- **$injector:** don't parse fns with no args
  ([44b6b72e](https://github.com/angular/angular.js/commit/44b6b72e5e9d193ec878ac7a4f25a00815f68cca))
- **$parse:** handle promises returned from parsed function calls
  ([3a658220](https://github.com/angular/angular.js/commit/3a65822023119b71deab5e298c7ef2de204caa13),
   [#3503](https://github.com/angular/angular.js/issues/3503))
- **$q:**
  - reject should catch & forward exceptions thrown in error callbacks
  ([5d9f4205](https://github.com/angular/angular.js/commit/5d9f42050a11015adbd5dc4dde73818919e93a99))
  - fix forwarding resolution when callbacks aren't functions
  ([7d188d63](https://github.com/angular/angular.js/commit/7d188d630c63fde05d8765d0ad2d75a5baa8e5d3),
   [#3535](https://github.com/angular/angular.js/issues/3535))
- **$location:** fix history problems on Boxee box
  ([eefcdad0](https://github.com/angular/angular.js/commit/eefcdad013b56d5d3a05c0b2137a5860091b2575))
- **$timeout:** clean deferreds immediately after callback exec/cancel
  ([920a3804](https://github.com/angular/angular.js/commit/920a3804136d49cdaf7bc2712f5832bc50409dc9))

- **Directives:**
  - **ngTransclude:**
     - clear the transclusion point before transcluding
      ([eed299a3](https://github.com/angular/angular.js/commit/eed299a31b5a6dd0363133c5f9271bf33d090c94))
     - make the transclusion available to parent post-link function
      ([bf79bd41](https://github.com/angular/angular.js/commit/bf79bd4194eca2118ae1c492c08dbd217f5ae810))
  - **ngView:** ensure `ngClass` works with together with `ngView`'s transclusion behavior
    ([40c0220c](https://github.com/angular/angular.js/commit/40c0220c47c620070b30aec6ec4552c68a8689eb))

- **Filters:**
  - **filter:** filter on false properties
    ([3bc4e7fd](https://github.com/angular/angular.js/commit/3bc4e7fd20372c0cad8298bff019b32681b16026),
     [#2797](https://github.com/angular/angular.js/issues/2797))
  - **orderBy:** remove redundant if statement
    ([5e45fd4a](https://github.com/angular/angular.js/commit/5e45fd4ac6ff7c00d34deb099fca12301cafd7b0))

- **Misc:**
  - parse IE11 UA string correctly
    ([427ee93f](https://github.com/angular/angular.js/commit/427ee93f11d0ef64b8844f9b43b2a0f21f2be2cb),
     [#3682](https://github.com/angular/angular.js/issues/3682))

- **i18n:** remove obsolete locale files
  ([6382e21f](https://github.com/angular/angular.js/commit/6382e21fb28541a2484ac1a241d41cf9fbbe9d2c))

- **ngAnimate:**
  - ensure that `ngClass` is always compiled before enter, leave and move animations are applied
  ([36ad40b1](https://github.com/angular/angular.js/commit/36ad40b18cfdd0690411a5169aa94e222946b5cf),
   [#3727](https://github.com/angular/angular.js/issues/3727), [#3603](https://github.com/angular/angular.js/issues/3603))
  - cut down on extra `$timeout` calls
  ([4382df03](https://github.com/angular/angular.js/commit/4382df03fa1962aed027742c1b463406c40653c9))
  - skip `ngAnimate` animations if the provided element already has transitions applied to it
  ([7c605ddf](https://github.com/angular/angular.js/commit/7c605ddf1c57c9f162827713ca5b0fbb12de5fa5),
   [#3587](https://github.com/angular/angular.js/issues/3587))
  - only apply a timeout when transitions or keyframe animations are used
  ([ee2f3d21](https://github.com/angular/angular.js/commit/ee2f3d21da6c9fccfe1e6a4ea8a65627519c8bf2),
   [#3613](https://github.com/angular/angular.js/issues/3613))
  - ensure older versions of webkit work for animations
  ([b1a43cd0](https://github.com/angular/angular.js/commit/b1a43cd04e8727df5bef3197f5fda3b98ecab740))

- **ngMocks:** `$logProvider` should not use internal APIs
  ([baaa73ee](https://github.com/angular/angular.js/commit/baaa73ee1ef25fa506ff7aaab3159d710acdafdb),
   [#3612](https://github.com/angular/angular.js/issues/3612))



## Breaking Changes

- **i18n:** due to [6382e21f](https://github.com/angular/angular.js/commit/6382e21fb28541a2484ac1a241d41cf9fbbe9d2c),
  some uncommon region-specific local files were removed.




<a name="1.0.8"></a>
# 1.0.8 bubble-burst (2013-08-22)

Contains only these fixes cherry-picked from [v1.2.0rc1](#1.2.0rc1).

## Bug Fixes

- **$compile:**
  - don't check attr.specified on non-ie7
  ([78efa0e3](https://github.com/angular/angular.js/commit/78efa0e36c1cb9fe293190381baa5a3fe5b3d1cb),
   [#3231](https://github.com/angular/angular.js/issues/3231), [#2160](https://github.com/angular/angular.js/issues/2160))
  - empty normalized href should pass sanitation check
  ([3b2c6f09](https://github.com/angular/angular.js/commit/3b2c6f09cb857b86641cefde5b92d84d58c1118d),
   [#2219](https://github.com/angular/angular.js/issues/2219))
- **$http:** ensure case-insensitive header overriding
  ([25d9f5a8](https://github.com/angular/angular.js/commit/25d9f5a804b7a6a61db6e84e594b1b5fe7ea14bf))
- **$location:**
  - default to / for the url base if no `base[href]`
  ([cbe31d8d](https://github.com/angular/angular.js/commit/cbe31d8dfd12ce973c574bfc825ffc0ffb8eb7c4),
   [#2762](https://github.com/angular/angular.js/issues/2762))
  - prevent infinite digest error due to IE bug
  ([97abb124](https://github.com/angular/angular.js/commit/97abb124738e0ca5d00d807d65c482f7890feadd),
   [#2802](https://github.com/angular/angular.js/issues/2802))
  - don't crash on invalid query parameters
  ([b9dcb35e](https://github.com/angular/angular.js/commit/b9dcb35e9bc64cb2f48f3a349ead66c501cbdc48))
- **$parse:** move global getter out of parse.js
  ([099138fb](https://github.com/angular/angular.js/commit/099138fb9a94178d3d82568fbda28d0c87443de9))
- **$q:** call `reject()` even if `$exceptionHandler` rethrows
  ([d59027c4](https://github.com/angular/angular.js/commit/d59027c40ed73fa9e114706d0c5a885785311dec))
- **$timeout:** clean deferreds immediately after callback exec/cancel
  ([ac69392c](https://github.com/angular/angular.js/commit/ac69392cd7f939ebbd37765e377051d4c05df4a5))
- **$sanitize:** match URI schemes case-insensitively
  ([fcd761b9](https://github.com/angular/angular.js/commit/fcd761b9d7c3c91673efce9b980ac5e7973adf3d),
   [#3210](https://github.com/angular/angular.js/issues/3210))
- **Scope:** watches can be safely unregistered inside watch handlers
  ([a4ec2979](https://github.com/angular/angular.js/commit/a4ec297925f052bf9ea1aba9f584eaaf7472fb93),
   [#2915](https://github.com/angular/angular.js/issues/2915))

- **ngMock**
  - $timeout should forward delay argument
  ([a5fb372e](https://github.com/angular/angular.js/commit/a5fb372e1e6aed8cdb1f572f1df3d6fe89388f3e))

- **jqLite:**
  - return array from multi select in val()
  ([01cd3495](https://github.com/angular/angular.js/commit/01cd34957e778a2fa8d26e2805c2dd5a7f986465))
  - forgive unregistration of a non-registered handler
  ([ac5b9055](https://github.com/angular/angular.js/commit/ac5b9055f6d7224e5e8e49941c0fc9cb16c64a7e))
  - prepend array in correct order
  ([63414b96](https://github.com/angular/angular.js/commit/63414b965397a9fd7d2f49e8dea4b848e0d6707e))
  - correctly monkey-patch core jQuery methods
  ([815053e4](https://github.com/angular/angular.js/commit/815053e403ace666b2383643227ecde5f36742c5))

- **Directives:**
  - **form:** pick the right attribute name for ngForm
    ([dc1e55ce](https://github.com/angular/angular.js/commit/dc1e55ce1a314b6c1ad4b9d5b4a31226e1fa1e18),
     [#2997](https://github.com/angular/angular.js/issues/2997))
  - **input:** fix the email regex to accept TLDs up to 6 characters long
    ([ad76e77f](https://github.com/angular/angular.js/commit/ad76e77fce09d0aee28b5ca1a328d5df8596b935))
  - **ngCloak:** hide element even when CSS 'display' is set
    ([06b0930b](https://github.com/angular/angular.js/commit/06b0930b6a821bdfed78875f821baf1b8ede2442))
  - **ngSubmit:** expose $event to ngSubmit callback
    ([b0d5f062](https://github.com/angular/angular.js/commit/b0d5f062e316370c7ac57cfd628d085015a8187d))
  - **ngValue:** made ngValue to write value attribute to element
    ([3b898664](https://github.com/angular/angular.js/commit/3b898664eea9913b6b25261d7310a61de476d173))

- **Filters:**
  - **number:** always convert scientific notation to decimal
    ([408e8682](https://github.com/angular/angular.js/commit/408e868237d80f9332f2c540f91b2809d9938fbc))
  - **orderBy:** remove redundant if statement
    ([ec1cece2](https://github.com/angular/angular.js/commit/ec1cece270e293e7c55556fc68afee9a2ad40641))

- **i18n:** Do not transform arrays into objects
  ([751c77f8](https://github.com/angular/angular.js/commit/751c77f87b34389c5b85a23c71080d367c42d31b))

- **jqLite:**
  - return array from multi select in val()
  ([01cd3495](https://github.com/angular/angular.js/commit/01cd34957e778a2fa8d26e2805c2dd5a7f986465))
  - forgive unregistration of a non-registered handler
  ([ac5b9055](https://github.com/angular/angular.js/commit/ac5b9055f6d7224e5e8e49941c0fc9cb16c64a7e))
  - prepend array in correct order
  ([63414b96](https://github.com/angular/angular.js/commit/63414b965397a9fd7d2f49e8dea4b848e0d6707e))
  - correctly monkey-patch core jQuery methods
  ([815053e4](https://github.com/angular/angular.js/commit/815053e403ace666b2383643227ecde5f36742c5))

- **Misc:**
  - **angular.copy:** change angular.copy to correctly clone RegExp
    ([5cca077e](https://github.com/angular/angular.js/commit/5cca077e4a40a26cc2deee2a86a215f575f25b22),
     [#3473](https://github.com/angular/angular.js/issues/3473), [#3474](https://github.com/angular/angular.js/issues/3474))
  - **angular.equals:**
      - add support for regular expressions
      ([a357649d](https://github.com/angular/angular.js/commit/a357649da5d9f0633fa8e8a249f58dfc1105698e),
       [#2685](https://github.com/angular/angular.js/issues/2685))
      - {} and [] should not be considered equivalent
      ([da1f7c76](https://github.com/angular/angular.js/commit/da1f7c762d36b646c107260f74daf3a0ab5f91f5))
  - **angular.toJson:** skip JSON.stringify for undefined
    ([332a3c79](https://github.com/angular/angular.js/commit/332a3c7984229a7e3a9a8a277f92942299616fdb))



<a name="1.2.0rc1"></a>
# 1.2.0rc1 spooky-giraffe (2013-08-13)

[Full Commit Log](https://github.com/angular/angular.js/compare/v1.1.5...master)


## Features

- **ngAnimate:** complete rewrite of animations
  ([81923f1e](https://github.com/angular/angular.js/commit/81923f1e41560327f7de6e8fddfda0d2612658f3))

- **$sce:** new $sce service for Strict Contextual Escaping and lots of other security enhancements
  ([bea9422e](https://github.com/angular/angular.js/commit/bea9422ebfc8e80ee28ad81afc62d2e432c85cbb))

- **minErr:** add error message minification and better error messages
  ([c8fcf3b3](https://github.com/angular/angular.js/commit/c8fcf3b369dbe866815e18e0fa4d71f3e679bc5f),
   [09fa0656](https://github.com/angular/angular.js/commit/09fa0656b49321681f28453abef566d0cbe0eb22),
   [b8ea7f6a](https://github.com/angular/angular.js/commit/b8ea7f6aba2e675b85826b0bee1f21ddd7b866a5))

- **$compile:**
  - support animation hooks bindings to class attributes
  ([f2dfa891](https://github.com/angular/angular.js/commit/f2dfa8916f8ed855d55187f5400c4c2566ce9a1b))
  - support multi-element directive
  ([e46100f7](https://github.com/angular/angular.js/commit/e46100f7097d9a8f174bdb9e15d4c6098395c3f2))
  - support "Controller as" instance syntax for directives
  ([b3777f27](https://github.com/angular/angular.js/commit/b3777f275c6bd2bd4a88963fd03828eb7cf3aca8))

- **$http:** accept function as headers value
  ([a7150f12](https://github.com/angular/angular.js/commit/a7150f1256f2a97a931b3c0d16eab70f45e81cae))

- **$q:**
  - add `.catch()` as shorthand for defining promise error handlers
  ([a207665d](https://github.com/angular/angular.js/commit/a207665dad69248139b150cd3fe8ba13059bffb4),
   [#2048](https://github.com/angular/angular.js/issues/2048),
   [#3476](https://github.com/angular/angular.js/issues/3476))
  - added support for promise notification
  ([2a5c3555](https://github.com/angular/angular.js/commit/2a5c3555829da51f55abd810a828c73b420316d3))

- **$resource:**
  - support an unescaped URL port in the url template
  ([b94ca12f](https://github.com/angular/angular.js/commit/b94ca12fa0b027d8592f5717e038b7b116c59384),
   [#2778](https://github.com/angular/angular.js/issues/2778))
  - expose promise as `$promise` instead of only `$then`
  ([05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d))

- **$route:** express style route matching (support for optional params and new wildcard syntax)
  ([04cebcc1](https://github.com/angular/angular.js/commit/04cebcc133c8b433a3ac5f72ed19f3631778142b))

- **jqLite:** switch bind/unbind to more recent jQuery on/off
  ([f1b94b4b](https://github.com/angular/angular.js/commit/f1b94b4b599ab701bc75b55bbbbb73c5ef329a93))

- **Misc:**
  - add source maps to all min files
  ([908071af](https://github.com/angular/angular.js/commit/908071afbf32c46fe9110e4a67e104bbd4b3a56b),
   [#1714](https://github.com/angular/angular.js/issues/1714))

- **Directives:**
  - add `ngFocus` and `ngBlur` directives
  ([2bb27d49](https://github.com/angular/angular.js/commit/2bb27d4998805fd89db25192f53d26d259ae615f),
   [#1277](https://github.com/angular/angular.js/issues/1277))

  - **ngRepeat:** add $even and $odd props to iterator
  ([52b8211f](https://github.com/angular/angular.js/commit/52b8211fd0154b9d6b771a83573a161f5580d92c))

  - **ngForm:** supports namespaces in form names
  ([8ea802a1](https://github.com/angular/angular.js/commit/8ea802a1d23ad8ecacab892a3a451a308d9c39d7))

  - **ngBindHtml:** combine ng-bind-html and ng-bind-html-unsafe
  ([dae69473](https://github.com/angular/angular.js/commit/dae694739b9581bea5dbc53522ec00d87b26ae55))

  - **ngPluralize:** add alternative mapping using attributes
  ([a170fc1a](https://github.com/angular/angular.js/commit/a170fc1a749effa98bfd1c2e1b30297ed47b451b),
   [#2454](https://github.com/angular/angular.js/issues/2454))

- **ngMobile/ngTouch:**
  - emit `swipeleft` and `swiperight` events
  ([ab189142](https://github.com/angular/angular.js/commit/ab189142988043d0513bb796c3b54ca7d07f242d))
  - refactor swipe logic from `ngSwipe` directive to `$swipe` service.
  ([f4c6b2c7](https://github.com/angular/angular.js/commit/f4c6b2c7894cb2d82ac69a1500a27785360b81c3))

- **ngMock:**
  - $timeout.flushNext can expect specific timeout delays
  ([462ed033](https://github.com/angular/angular.js/commit/462ed033d512ae94cb188efc9453de84ace4e17e))
  - support delay limit for $timeout.flush
  ([b7fdabc4](https://github.com/angular/angular.js/commit/b7fdabc4bf2a9dd11a57f98c5229d834c4589bab))
  - support a matching function for data param
  ([08daa779](https://github.com/angular/angular.js/commit/08daa7797bce5207916251d4a0ab3d5c93e5529a))




- **scenario:** expose jQuery for usage outside of angular scenario
  ([3fdbe81a](https://github.com/angular/angular.js/commit/3fdbe81a337c39027929c415e719493755cd8583))

- **ngDocs:**
  - provide support for user to jump between different versions of the angularjs doc
  ([46dfb92a](https://github.com/angular/angular.js/commit/46dfb92afd185c93f60ca90a72653f33d7cb18e8))
  - add links to source for API
  ([52d6a599](https://github.com/angular/angular.js/commit/52d6a5990225439ac9141398d83e0d4e6134b576))
  - support popover, foldouts and foldover annotations
  ([ef229688](https://github.com/angular/angular.js/commit/ef22968810d555f78d3bbf7b5428757690c8cc70))
  - provide documentation for the new ngRepeat repeater syntax
  ([b3650457](https://github.com/angular/angular.js/commit/b36504577c538b745e6270e77d86af90285e2ae6))
  - provide support for inline variable hinting
  ([21c70729](https://github.com/angular/angular.js/commit/21c70729d9269de85df3434c431c2f18995b0f7b))


## Bug Fixes

- **$compile:**
  - correct controller instantiation for async directives
  ([c173ca41](https://github.com/angular/angular.js/commit/c173ca412878d537b18df01f39e400ea48a4b398),
   [#3493](https://github.com/angular/angular.js/issues/3493),
   [#3482](https://github.com/angular/angular.js/issues/3482),
   [#3537](https://github.com/angular/angular.js/issues/3537),
   [#3540](https://github.com/angular/angular.js/issues/3540))
  - always instantiate controllers before pre-link fns run
  ([5c560117](https://github.com/angular/angular.js/commit/5c560117425e7b3f7270389274476e843d6f69ec),
   [#3493](https://github.com/angular/angular.js/issues/3493),
   [#3482](https://github.com/angular/angular.js/issues/3482),
   [#3514](https://github.com/angular/angular.js/issues/3514))
  - always instantiate controllers in parent->child order
  ([45f9f623](https://github.com/angular/angular.js/commit/45f9f62367221b2aa097ba1d87d744e50140ddc7),
   [#2738](https://github.com/angular/angular.js/issues/2738))
  - don't check attr.specified on non-ie7
  ([f9ea69f6](https://github.com/angular/angular.js/commit/f9ea69f6567c22ff328fd1f7b07847883757bfa6),
   [#3231](https://github.com/angular/angular.js/issues/3231),
   [#2160](https://github.com/angular/angular.js/issues/2160))
  - allow `data:` image URIs in `img[src]` bindings
  ([3e39ac7e](https://github.com/angular/angular.js/commit/3e39ac7e1b10d4812a44dad2f959a93361cd823b))
  - empty normalized href url should pass sanitation check
  ([fc8c9baa](https://github.com/angular/angular.js/commit/fc8c9baa399c33956133cdb6892fc7007430d299),
   [#2219](https://github.com/angular/angular.js/issues/2219))
  - prevent infinite loop w/ replace+transclude directives
  ([69f42b76](https://github.com/angular/angular.js/commit/69f42b76548d00f52b231ec91150e4f0b008c730),
   [#2155](https://github.com/angular/angular.js/issues/2155))
  - reject multi-expression interpolations for `src` attribute
  ([38deedd6](https://github.com/angular/angular.js/commit/38deedd6e3d806eb8262bb43f26d47245f6c2739))
  - disallow interpolations for DOM event handlers
  ([39841f2e](https://github.com/angular/angular.js/commit/39841f2ec9b17b3b2920fd1eb548d444251f4f56))
  - sanitize values bound to `img[src]`
  ([1adf29af](https://github.com/angular/angular.js/commit/1adf29af13890d61286840177607edd552a9df97))
  - support multi-element group over text nodes
  ([b28f9694](https://github.com/angular/angular.js/commit/b28f96949ac477b1fe43c81df7cedc21c7ab184c))
  - correct component transclusion on compilation root.
  ([15e1a29c](https://github.com/angular/angular.js/commit/15e1a29cd08993b599f390e83a249ec17f753972))

- **$http:**
  - allow interceptors to completely override headers
  ([514dc0eb](https://github.com/angular/angular.js/commit/514dc0eb16a8fe3fa7c44094d743714f73754321),
   [#2770](https://github.com/angular/angular.js/issues/2770))
  - treat headers as case-insensitive when overriding defaults
  ([53359d54](https://github.com/angular/angular.js/commit/53359d549e364759d5b382c229f7d326799bf418))

- **$location:**
  - don't initialize url hash in hashbang mode unnecessarily
  ([d4d34aba](https://github.com/angular/angular.js/commit/d4d34aba6efbd98050235f5b264899bb788117df))
  - prevent infinite digest error due to IE bug
  ([dca23173](https://github.com/angular/angular.js/commit/dca23173e25a32cb740245ca7f7b01a84805f43f),
   [#2802](https://github.com/angular/angular.js/issues/2802))
  - in html5 mode, default to / for the url base if no `base[href]`
  ([aef09800](https://github.com/angular/angular.js/commit/aef098006302689d2d75673be828e31903ee7c3c),
   [#2762](https://github.com/angular/angular.js/issues/2762))
  - fix parameter handling on search()
  ([705c9d95](https://github.com/angular/angular.js/commit/705c9d95bc3157547ac6008d2f0a6a0c0e0ca60a))

- **$parse:**
  - unwrap promise when setting a field
  ([61906d35](https://github.com/angular/angular.js/commit/61906d3517428b6d52d3284b8d26d1a46e01dad7),
   [#1827](https://github.com/angular/angular.js/issues/1827))
  - disallow access to Function constructor
  ([5349b200](https://github.com/angular/angular.js/commit/5349b20097dc5cdff0216ee219ac5f6e6ef8c219))

- **$q:** call `reject()` even if `$exceptionHandler` rethrows
  ([664526d6](https://github.com/angular/angular.js/commit/664526d69c927370c93a06745ca38de7cd03a7be))

- **$resource:** check whether response matches action.isArray
  ([a644ca7b](https://github.com/angular/angular.js/commit/a644ca7b4e6ba84a467bcabed8f99386eda7fb14),
   [#2255](https://github.com/angular/angular.js/issues/2255))

- **$sanitize:** match URI schemes case-insensitively
  ([7fef06fe](https://github.com/angular/angular.js/commit/7fef06fef9b6af4436f9fed10bd29d0a63707614),
   [#3210](https://github.com/angular/angular.js/issues/3210))

- **Scope:**
  - ensure that isolate scopes use the main evalAsync queue
  ([3967f5f7](https://github.com/angular/angular.js/commit/3967f5f7d6c8aa7b41a5352b12f457e2fbaa251a))
  - watches can now be safely unregistered inside watch handlers
  ([8bd6619b](https://github.com/angular/angular.js/commit/8bd6619b7efa485b020fec96c76047e480469871),
   [#2915](https://github.com/angular/angular.js/issues/2915))

- **jqLite:**
  - properly detect unsupported calls for on()/off()
  ([3824e400](https://github.com/angular/angular.js/commit/3824e40011df1c0fdf5964d78776f1a12a29c144),
   [4f5dfbc3](https://github.com/angular/angular.js/commit/4f5dfbc362d9683177708ebcc00c98cf594d1287),
   [#3501](https://github.com/angular/angular.js/issues/3501))
  - return array from multi select in val()
  ([306a6134](https://github.com/angular/angular.js/commit/306a613440175c7fd61d1d6eb249d1e53a46322e))
  - forgive unregistration of a non-registered handler
  ([ab59cc6c](https://github.com/angular/angular.js/commit/ab59cc6c44705b1244a77eba999d736f9eb3c6ae))
  - support space-separated events in off
  ([bdd4e982](https://github.com/angular/angular.js/commit/bdd4e982b7fee9811b40b545c21a74711686875c),
   [#3256](https://github.com/angular/angular.js/issues/3256))
  - prepend array in correct order
  ([fd87eb0c](https://github.com/angular/angular.js/commit/fd87eb0ca5e14f213d8b31280d444dbc29c20c50))
  - allow override of jqLite.triggerHandler event object
  ([0cac8729](https://github.com/angular/angular.js/commit/0cac8729fb3824ebb07cee84ef78b43900c7e75d))
  - added optional name arg in removeData
  ([e1a050e6](https://github.com/angular/angular.js/commit/e1a050e6b26aca4d0e6e7125d3f6c1c8fc1d92cb))
  - correctly monkey-patch core jQuery methods
  ([da5f537c](https://github.com/angular/angular.js/commit/da5f537ccdb0a7b4155f13f7a70ca7981ad6f689))


- **i18n:** Do not transform arrays into objects
  ([b3d7a038](https://github.com/angular/angular.js/commit/b3d7a038d774d823ef861b76fb8bfa22e60a3df5))

- **ngMobile/ngTouch:**
  - emit click event for touchy clicks
  ([fb7d891d](https://github.com/angular/angular.js/commit/fb7d891dacdcb9f799061d5fbb96cdd2dd912196),
   [#3219](https://github.com/angular/angular.js/issues/3219),
   [#3218](https://github.com/angular/angular.js/issues/3218),
   [#3137](https://github.com/angular/angular.js/issues/3137))
  - prevent ngClick when item disabled
  ([e0340243](https://github.com/angular/angular.js/commit/e03402433d2524fd3a74bbfce984f843794996ce),
   [#3124](https://github.com/angular/angular.js/issues/3124),
   [#3132](https://github.com/angular/angular.js/issues/3132))
  - ngClick should prevent unwanted opening of the soft keyboard
  ([0bbd20f2](https://github.com/angular/angular.js/commit/0bbd20f255b2954b5c41617fe718cf6eca36a972))

- **ngMock:**
  - keep withCredentials on passThrough
  ([3079a6f4](https://github.com/angular/angular.js/commit/3079a6f4e097a777414b8c3a8a87b8e1e20b55b5))
  - keep mock.$log the api in sync with $log
  ([f274c0a6](https://github.com/angular/angular.js/commit/f274c0a66b28711d3b9cc7b0775e97755dd971e8),
   [#2343](https://github.com/angular/angular.js/issues/2343))

- **ngScenario:** select().option(val) should prefer exact value match
  ([22a9b1ac](https://github.com/angular/angular.js/commit/22a9b1ac07f98d07e1e5d71ce961411b5fa9b42d),
   [#2856](https://github.com/angular/angular.js/issues/2856))

- **Directives:**
  - **ngRepeat:**
      - handle iteration over identical obj values
   ([47a2a982](https://github.com/angular/angular.js/commit/47a2a9829f0a847bbee61cd142c43000d73ea98b),
   [#2787](https://github.com/angular/angular.js/issues/2787),
   [#2806](https://github.com/angular/angular.js/issues/2806))
      - support growing over multi-element groups
  ([4953b497](https://github.com/angular/angular.js/commit/4953b49761a791d9ea74bcbe78769fec15d91083))

  - **ngShowHide:** change the .ng-hide CSS class to use an !important flag
  ([246c1439](https://github.com/angular/angular.js/commit/246c1439b502b06823650505cbe4a3848b6fa5a3))

  - **ngSubmit:** expose $event to ngSubmit callback
  ([3371fc25](https://github.com/angular/angular.js/commit/3371fc254a9698eae35bb6f8f1ee9c434ae761e2))

  - **ngValue:** made ngValue to write value attribute to element
  ([09a1e7af](https://github.com/angular/angular.js/commit/09a1e7af129880cab89a2f709f22a7286f52371e))

  - **ngView:** ensure ngView is terminal and uses its own manual transclusion system
  ([87405e25](https://github.com/angular/angular.js/commit/87405e25ae935eefd673e70ffd6144a5f455b662))

  - **ngCloak:** hide ngCloak-ed element even when CSS 'display' is set
  ([3ffddad1](https://github.com/angular/angular.js/commit/3ffddad100e993403d13137387d0685466b46b2b))

  - **`input[email]`:** fix the email regex to accept TLDs up to 6 characters long
  ([af731354](https://github.com/angular/angular.js/commit/af731354b0b600f87f15e1573e64a7f7acc70f3d))

  - **form:** pick the right attribute name for ngForm
  ([0fcd1e3b](https://github.com/angular/angular.js/commit/0fcd1e3b1fa6244d02f08631d9ef81bf79996fab),
   [#2997](https://github.com/angular/angular.js/issues/2997))

  - **select:** don't support binding to `select[multiple]`
  ([d87fa004](https://github.com/angular/angular.js/commit/d87fa0042375b025b98c40bff05e5f42c00af114),
   [#3230](https://github.com/angular/angular.js/issues/3230))

- **Filters:**
  - **numberFilter:** always convert scientific notation to decimal
  ([a13c01a8](https://github.com/angular/angular.js/commit/a13c01a8e48ea4a0d59394eb94f1b12c50cfef61))

- **Misc:**
  - detect transition/animation on older Android browsers
  ([ef5bc6c7](https://github.com/angular/angular.js/commit/ef5bc6c7c3336a64bae64fe9739cb1789907c906))
  - handle duplicate params in parseKeyValue/toKeyValue
  ([80739409](https://github.com/angular/angular.js/commit/807394095b991357225a03d5fed81fea5c9a1abe))
  - don't crash on invalid query parameters
  ([8264d080](https://github.com/angular/angular.js/commit/8264d08085adc2ab57f6598b9fc9f6e263c8b4f3))
  - change angular.copy to correctly clone RegExp
  ([f80730f4](https://github.com/angular/angular.js/commit/f80730f497cb1ecb78a814f01df79b69223ad633),
   [#3473](https://github.com/angular/angular.js/issues/3473),
   [#3474](https://github.com/angular/angular.js/issues/3474))
  - angular.equals now supports for regular expressions
  ([724819e3](https://github.com/angular/angular.js/commit/724819e3cfd8aeda1f724fb527db2b57494be9b7),
   [#2685](https://github.com/angular/angular.js/issues/2685))
  - angular.equals should not match keys defined in the prototype chain
  ([7829c50f](https://github.com/angular/angular.js/commit/7829c50f9e89e779980f6d60a397aedfc7eaec61))
  - angular.equals should not consider {} and [] to be equivalent
  ([1dcafd18](https://github.com/angular/angular.js/commit/1dcafd18afed4465ee13db91cedc8fecc3aa2c96))
  - angular.bootstrap should throw an error when bootstrapping a bootstrapped element
  ([3ee744cc](https://github.com/angular/angular.js/commit/3ee744cc63a24b127d6a5f632934bb6ed2de275a))
  - angular.toJson should skip JSON.stringify for undefined
  ([5a294c86](https://github.com/angular/angular.js/commit/5a294c8646452d6e49339d145faeae4f31dcd0fc))
  - change css wrapping in grunt to prepend styles to the top of the head tag
  ([fbad068a](https://github.com/angular/angular.js/commit/fbad068aeb229fd3dd2a3004879584c728fed735))


## Breaking Changes

- **ngAnimate:** due to [81923f1e](https://github.com/angular/angular.js/commit/81923f1e41560327f7de6e8fddfda0d2612658f3),
  too many things changed, we'll write up a separate doc with migration instructions and will publish it at <http://yearofmoo.com>. Please check out the [ngAnimate module docs](http://ci.angularjs.org/job/angular.js-angular-master/lastSuccessfulBuild/artifact/build/docs/api/ngAnimate) and [$animate api docs](http://ci.angularjs.org/job/angular.js-angular-master/lastSuccessfulBuild/artifact/build/docs/api/ng.$animate) in the meantime.

- **$compile:**
  - due to [1adf29af](https://github.com/angular/angular.js/commit/1adf29af13890d61286840177607edd552a9df97) and [3e39ac7e](https://github.com/angular/angular.js/commit/3e39ac7e1b10d4812a44dad2f959a93361cd823b),
  `img[src]` URLs are now being sanitized and a whitelist configured via `$compileProvider` can be used to configure what safe urls look like.

    By default all common protocol prefixes are whitelisted including `data:` URIs with mime types `image/*`. Therefore this change is expected to have no impact on apps that don't contain malicious image links.

  - due to [38deedd6](https://github.com/angular/angular.js/commit/38deedd6e3d806eb8262bb43f26d47245f6c2739),
  binding more than a single expression to `*[src]` or `*[ng-src]` with the exception of `<a>` and `<img>` elements is not supported.

    Concatenating expressions makes it hard to understand whether some combination of concatenated values are unsafe to use and potentially subject to XSS vulnerabilities. To simplify the task of auditing for XSS issues, we now require that a single expression be used for `*[src/ng-src]` bindings such as bindings for `iframe[src]`, `object[src]`, etc. (but not `img[src/ng-src]` since that value is sanitized).

   This change ensures that the possible pool of values that are used for data-binding is easier to trace down.

    To migrate your code, follow the example below:

        Before:
            JS:
                scope.baseUrl = 'page';
                scope.a = 1;
                scope.b = 2;
            HTML:
                <!-- Are a and b properly escaped here? Is baseUrl
                     controlled by user? -->
                <iframe src="{{baseUrl}}?a={{a}&b={{b}}">

        After:
            JS:
                var baseUrl = "page";
                scope.getIframeSrc = function() {
                  // There are obviously better ways to do this.  The
                  // key point is that one will think about this and do
                  // it the right way.
                  var qs = ["a", "b"].map(function(value, name) {
                      return encodeURIComponent(name) + "=" +
                             encodeURIComponent(value);
                    }).join("&");
                  // baseUrl isn't on scope so it isn't bound to a user
                  // controlled value.
                  return baseUrl + "?" + qs;
                }
            HTML: <iframe src="{{getIframeSrc()}}">

  - due to [39841f2e](https://github.com/angular/angular.js/commit/39841f2ec9b17b3b2920fd1eb548d444251f4f56),
  Interpolations inside DOM event handlers are disallowed.

    DOM event handlers execute arbitrary Javascript code. Using an interpolation for such handlers means that the interpolated value is a JS string that is evaluated.  Storing or generating such strings is error prone and leads to XSS vulnerabilities. On the other hand, `ngClick` and other Angular specific event handlers evaluate Angular expressions in non-window (Scope) context which makes them much safer.

    To migrate the code follow the example below:

    Before:

        JS:   scope.foo = 'alert(1)';
        HTML: <div onclick="{{foo}}">

    After:

        JS:   scope.foo = function() { alert(1); }
        HTML: <div ng-click="foo()">

  - due to [e46100f7](https://github.com/angular/angular.js/commit/e46100f7097d9a8f174bdb9e15d4c6098395c3f2), existing directives
    with name ending with `"-start"` or `"-end"` will stop working.

    This change was necessary to enable multi-element directives. The best fix is to rename existing directives, so that they
    don't end with these suffixes.

- **$q:** due to [f078762d](https://github.com/angular/angular.js/commit/f078762d48d0d5d9796dcdf2cb0241198677582c),
  the `always` method is now exposed as `finally`.

    The reason for this change is to align `$q` with the Q promise library, despite the fact that this makes it a bit more difficult to use with non-ES5 browsers, like IE8.

    `finally` also goes well together with `catch` api that was added to $q recently and is part of the DOM promises standard.

    To migrate the code follow the example below:

    Before:

    ```
    $http.get('/foo').always(doSomething);
    ```

    After:

    ```
    $http.get('/foo').finally(doSomething);
    ```

    or for IE8 compatible code:

    ```
    $http.get('/foo')['finally'](doSomething);
    ```

- **$resource:**
  - due to [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d),
  resource instance does not have a `$then` function anymore. Use the `$promise.then` instead.

    Before:

    ```
    Resource.query().$then(callback);
    ```

    After:

    ```
    Resource.query().$promise.then(callback);
    ```

  - due to [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d), instance methods return the promise rather than the instance itself.

    Before:

    ```
    resource.$save().chaining = true;
    ```

    After:

    ```
    resource.$save();
    resource.chaining = true;
    ```

  - due to [05772e15](https://github.com/angular/angular.js/commit/05772e15fbecfdc63d4977e2e8839d8b95d6a92d), on success, the resource promise is resolved with the resource instance rather than http response object.

    Use interceptor api to access the http response object.

    Before:

    ```
    Resource.query().$then(function(response) {...});
    ```

    After:

    ```
    var Resource = $resource('/url', {}, {
      get: {
        method: 'get',
        interceptor: {
          response: function(response) {
            // expose response
            return response;
          }
        }
      }
    });
    ```

- **$route:**
  - due to [04cebcc1](https://github.com/angular/angular.js/commit/04cebcc133c8b433a3ac5f72ed19f3631778142b),
  the syntax for named wildcard parameters in routes has changed from `*wildcard` to `:wildcard*`

    To migrate the code, follow the example below.  Here, `*highlight` becomes
    `:highlight*`:

    Before:

    ```
    $routeProvider.when('/Book1/:book/Chapter/:chapter/*highlight/edit',
              {controller: noop, templateUrl: 'Chapter.html'});
    ```

    After:

    ```
    $routeProvider.when('/Book1/:book/Chapter/:chapter/:highlight*/edit',
            {controller: noop, templateUrl: 'Chapter.html'});
    ```

  - due to [5599b55b](https://github.com/angular/angular.js/commit/5599b55b04788c2e327d7551a4a699d75516dd21),
  applications that use `$route` will now need to load an angular-route.js file and define a dependency on the ngRoute module.

    Before:

    ```
    ...
    <script src="angular.js"></script>
    ...
    var myApp = angular.module('myApp', ['someOtherModule']);
    ...
    ```

    After:

    ```
    ...
    <script src="angular.js"></script>
    <script src="angular-route.js"></script>
    ...
    var myApp = angular.module('myApp', ['ngRoute', 'someOtherModule']);
    ...
    ```

- **$location:** due to [80739409](https://github.com/angular/angular.js/commit/807394095b991357225a03d5fed81fea5c9a1abe),
  `$location.search` now supports multiple keys with the same value provided that the values are stored in an array in `$location.search`.

    Before this change:
    - `parseKeyValue` only took the last key overwriting all the previous keys;
    - `toKeyValue` joined the keys together in a comma delimited string.

    This was deemed buggy behavior. If your server relied on this behavior then either the server should be fixed, or a simple serialization of the array should be done on the client before passing it to $location.

- **ngBindHtml, sce:** due to [dae69473](https://github.com/angular/angular.js/commit/dae694739b9581bea5dbc53522ec00d87b26ae55),

    `ngHtmlBindUnsafe` has been removed and replaced by `ngHtmlBind` (which has been moved from `ngSanitize` module to the core `ng` module).  `ngBindHtml` provides `ngHtmlBindUnsafe` like behavior (evaluate an expression and innerHTML the result into the DOM) when bound to the result of `$sce.trustAsHtml(string)`. When bound to a plain string, the string is sanitized via `$sanitize` before being innerHTML'd.  If the `$sanitize` service isn't available (`ngSanitize` module is not loaded) and the bound expression evaluates to a value that is not trusted an exception is thrown.

- **ngForm:** due to [8ea802a1](https://github.com/angular/angular.js/commit/8ea802a1d23ad8ecacab892a3a451a308d9c39d7),

    If you have form names that will evaluate as an expression:

    ```
    <form name="ctrl.form">
    ```

    And if you are accessing the form from your controller:

    Before:

    ```
    function($scope) {
      $scope['ctrl.form'] // form controller instance
    }
    ```

    After:

    ```
    function($scope) {
      $scope.ctrl.form // form controller instance
    }
    ```

    This makes it possible to access a form from a controller using the new "controller as" syntax. Supporting the previous behavior offers no benefit.

- **ngView:** due to [7d69d52a](https://github.com/angular/angular.js/commit/7d69d52acff8578e0f7d6fe57a6c45561a05b182),
  previously ngView only updated its content, after this change ngView will recreate itself every time a new content is included. This ensures that a single rootElement for all the included contents always exists, which makes definition of css styles for animations much easier.

- **ngInclude:** due to [aa2133ad](https://github.com/angular/angular.js/commit/aa2133ad818d2e5c27cbd3933061797096356c8a),
  previously ngInclude only updated its content, after this change ngInclude will recreate itself every time a new content is included. This ensures that a single rootElement for all the included contents always exists, which makes definition of css styles for animations much easier.

- **select:** due to [d87fa004](https://github.com/angular/angular.js/commit/d87fa0042375b025b98c40bff05e5f42c00af114),
  binding to `select[multiple]` directly or via ngMultiple (ng-multiple) directive is not supported. This feature never worked with two-way data-binding, so it's not expected that anybody actually depends on it.

- **ngMobile:** due to [94ec84e7](https://github.com/angular/angular.js/commit/94ec84e7b9c89358dc00e4039009af9e287bbd05),
  since all the code in the ngMobile module is touch related, we are renaming the module to ngTouch.

    To migrate, please replace all references to "ngMobile" with "ngTouch" and "angular-mobile.js" to "angular-touch.js".




<a name="1.1.5"></a>
# 1.1.5 triangle-squarification (2013-05-22)

_Note: 1.1.x releases are [considered unstable](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html).
They pass all tests but we reserve the right to change new features/apis in between minor releases. Check them
out and please give us feedback._

_Note: This release also contains all bug fixes available in [1.0.7](#1.0.7)._


## Features

- **$animator:**
  - provide support for custom animation events
  ([c53d4c94](https://github.com/angular/angular.js/commit/c53d4c94300c97dd005f9a0cbdbfa387294b9026))
  - allow to globally disable and enable animations
  ([5476cb6e](https://github.com/angular/angular.js/commit/5476cb6e9b6d7a16e3a86585bc2db5e63b16cd4d))
- **$http:**
  - add support for aborting via timeout promises
  ([9f4f5937](https://github.com/angular/angular.js/commit/9f4f5937112655a9881d3281da8e72035bc8b180),
   [#1159](https://github.com/angular/angular.js/issues/1159))
  - add a default content type header for PATCH requests
  ([f9b897de](https://github.com/angular/angular.js/commit/f9b897de4b5cc438515cbb54519fbdf6242f5858))
  - add timeout support for JSONP requests
  ([cda7b711](https://github.com/angular/angular.js/commit/cda7b71146f6748116ad5bbc9050ee7e79a9ce2b))

- **$parse:** add support for ternary operators to parser
  ([6798fec4](https://github.com/angular/angular.js/commit/6798fec4390a72b7943a49505f8a245b6016c84b))

- **$q:** add $q.always() method
  ([6605adf6](https://github.com/angular/angular.js/commit/6605adf6d96cee2ef53dfad24e99d325df732cab))

- **$controller:** support "Controller as" syntax
  ([cd38cbf9](https://github.com/angular/angular.js/commit/cd38cbf975b501d846e6149d1d993972a1af0053),
   [400f9360](https://github.com/angular/angular.js/commit/400f9360bb2f7553c5bd3b1f256a5f3db175b7bc))

- **$injector:** add `has` method for querying
  ([80341cb9](https://github.com/angular/angular.js/commit/80341cb9badd952fdc80094df4123629313b4cc4),
   [#2556](https://github.com/angular/angular.js/issues/2556))

- **Directives:**
  - **ngAnimate:**
     - add support for CSS3 Animations with working delays and multiple durations
     ([14757874](https://github.com/angular/angular.js/commit/14757874a7cea7961f31211b245c417bd4b20512))
     - cancel previous incomplete animations when new animations take place
     ([4acc28a3](https://github.com/angular/angular.js/commit/4acc28a310d006c62afe0de8ec82fed21c98c2d6))
  - **ngSrcset:** add new ngSrcset directive
  ([d551d729](https://github.com/angular/angular.js/commit/d551d72924f7c43a043e4760ff05d7389e310f99),
   [#2601](https://github.com/angular/angular.js/issues/2601))
  - **ngIf:** add directive to remove and recreate DOM elements
    ([2f96fbd1](https://github.com/angular/angular.js/commit/2f96fbd17577685bc013a4f7ced06664af253944))
  - **select:** match options by expression other than object identity
  ([c32a859b](https://github.com/angular/angular.js/commit/c32a859bdb93699cc080f9affed4bcff63005a64))
  - **ngInclude:** $includeContentRequested event
  ([af0eaa30](https://github.com/angular/angular.js/commit/af0eaa304748f330739a4b0aadb13201126c5407))

- **Mobile:**
  - **ngClick:** Add a CSS class while the element is held down via a tap
  ([52a55ec6](https://github.com/angular/angular.js/commit/52a55ec61895951999cb0d74e706725b965e9c9f))
  - **ngSwipe:** Add ngSwipeRight/Left directives to ngMobile
  ([5e0f876c](https://github.com/angular/angular.js/commit/5e0f876c39099adb6a0300c429b8df1f6b544846))

- **docs:**
  - Add FullText search to replace Google search in docs
  ([3a49b7ee](https://github.com/angular/angular.js/commit/3a49b7eec4836ec9dc1588e6cedda942755dc7bf))
  - external links to github, plunkr and jsfiddle available for code examples
  ([c8197b44](https://github.com/angular/angular.js/commit/c8197b44eb0b4d49acda142f4179876732e1c751))
  - add variable type hinting with colors
  ([404c9a65](https://github.com/angular/angular.js/commit/404c9a653a1e28de1c6dda996875d6616812313a))
  - support for HTML table generation from docs code
  ([b3a62b2e](https://github.com/angular/angular.js/commit/b3a62b2e19b1743df52034d4d7a0405e6a65f925))

- **scenario runner:** adds mousedown and mouseup event triggers to scenario
  ([629fb373](https://github.com/angular/angular.js/commit/629fb37351ce5778a40a8bc8cd7c1385b382ce75))


  ## Bug Fixes

  - **$animator:** remove dependency on window.setTimeout
    ([021bdf39](https://github.com/angular/angular.js/commit/021bdf3922b6525bd117e59fb4945b30a5a55341))

  - **$controller:** allow dots in a controller name
    ([de2cdb06](https://github.com/angular/angular.js/commit/de2cdb0658b8b8cff5a59e26c5ec1c9b470efb9b))

  - **$location:**
      - prevent navigation when event isDefaultPrevented
      ([2c69a673](https://github.com/angular/angular.js/commit/2c69a6735e8af5d1b9b73fd221274d374e8efdea))
      - compare against actual instead of current URL
      ([a348e90a](https://github.com/angular/angular.js/commit/a348e90aa141921b914f87ec930cd6ebf481a446))
      - prevent navigation if already on the URL
      ([4bd7bedf](https://github.com/angular/angular.js/commit/4bd7bedf48c0c1ebb62f6bd8c85e8ea00f94502b))
      - fix URL interception in hash-bang mode
      ([58ef3230](https://github.com/angular/angular.js/commit/58ef32308f45141c8f7f7cc32a6156cd328ba692),
       [#1051](https://github.com/angular/angular.js/issues/1051))
      - correctly rewrite Html5 urls
      ([77ff1085](https://github.com/angular/angular.js/commit/77ff1085554675f1a8375642996e5b1e51f9ed2d))

  - **$resource:**
      - null default param results in TypeError
      ([cefbcd47](https://github.com/angular/angular.js/commit/cefbcd470d4c9020cc3487b2326d45058ef831e2))
      - collapse empty suffix parameters correctly
      ([53061363](https://github.com/angular/angular.js/commit/53061363c7aa1ab9085273d269c6f04ac2162336))

  - **$rootScope:** ensure $watchCollection correctly handles arrayLike objects
    ([6452707d](https://github.com/angular/angular.js/commit/6452707d4098235bdbde34e790aee05a1b091218))

  - **date filter:** correctly format dates with more than 3 sub-second digits
    ([4f2e3606](https://github.com/angular/angular.js/commit/4f2e36068502f18814fee0abd26951124881f951))

  - **jqLite:** pass a dummy event into triggerHandler
    ([0401a7f5](https://github.com/angular/angular.js/commit/0401a7f598ef9a36ffe1f217e1a98961046fa551))

  - **Directives:**
      - **ngAnimate:**
         - eval ng-animate expression on each animation
         ([fd21c750](https://github.com/angular/angular.js/commit/fd21c7502f0a25364a810c26ebeecb678e5783c5))
         - prevent animation on initial page load
         ([570463a4](https://github.com/angular/angular.js/commit/570463a465fae02efc33e5a1fa963437cdc275dd))
         - skip animation on first render
         ([1351ba26](https://github.com/angular/angular.js/commit/1351ba2632b5011ad6eaddf004a7f0411bea8453))
      - **ngPattern:** allow modifiers on inline ng-pattern
        ([12b6deb1](https://github.com/angular/angular.js/commit/12b6deb1ce99df64e2fc91a06bf05cd7f4a3a475),
         [#1437](https://github.com/angular/angular.js/issues/1437))
      - **ngRepeat:**
         - correctly iterate over array-like objects
         ([1d8e11dd](https://github.com/angular/angular.js/commit/1d8e11ddfbd6b08ff02df4331f6df125f49da3dc),
          [#2546](https://github.com/angular/angular.js/issues/2546))
         - prevent initial duplicates
         ([a0bc71e2](https://github.com/angular/angular.js/commit/a0bc71e27107c58282e71415c4e8d89e916ae99c))
      - **ngView:** accidentally compiling leaving content
      ([9956baed](https://github.com/angular/angular.js/commit/9956baedd73d5e8d0edd04c9eed368bd3988444b))

  - **scenario runner:** correct bootstrap issue on IE
    ([ab755a25](https://github.com/angular/angular.js/commit/ab755a25f9ca3f3f000623071d8de3ddc4b1d78e))



## Breaking Changes

- **$animator/ngAnimate:** due to [11f712bc](https://github.com/angular/angular.js/commit/11f712bc3e310302eb2e8691cf6d110bdcde1810),
  css transition classes changed from `foo-setup`/`foo-start` to `foo`/`foo-active`

  The CSS transition classes have changed suffixes. To migrate rename

        .foo-setup {...} to .foo {...}
        .foo-start {...} to .foo-active {...}

  or for type: enter, leave, move, show, hide

        .foo-type-setup {...} to .foo-type {...}
        .foo-type-start {...} to .foo-type-active {...}

- **$resource:** due to [53061363](https://github.com/angular/angular.js/commit/53061363c7aa1ab9085273d269c6f04ac2162336),
  a `/` followed by a `.`, in the last segment of the URL template is now collapsed into a single `.` delimiter.

  For example: `users/.json` will become `users.json`. If your server relied upon this sequence then it will no longer
  work. In this case you can now escape the `/.` sequence with `/\.`




<a name="1.0.7"></a>
# 1.0.7 monochromatic-rainbow (2013-05-22)


## Bug Fixes

- **$browser:** should use first value for a cookie.
  ([3952d35a](https://github.com/angular/angular.js/commit/3952d35abe334a0e6afd1f6e34a74d984d1e9d24),
   [#2635](https://github.com/angular/angular.js/issues/2635))

- **$cookieStore:** $cookieStore.get now parses blank string as blank string
  ([cf4729fa](https://github.com/angular/angular.js/commit/cf4729faa3e6e0a5178e2064a6f3cfd345686554))

- **$location:** back-button should fire $locationChangeStart
  ([dc9a5806](https://github.com/angular/angular.js/commit/dc9a580617a838b63cbf5feae362b6f9cf5ed986),
   [#2109](https://github.com/angular/angular.js/issues/2109))

- **$parse:** Fix context access and double function call
  ([7812ae75](https://github.com/angular/angular.js/commit/7812ae75d578314c1a285e9644fc75812940eb1d),
   [#2496](https://github.com/angular/angular.js/issues/2496))

- **dateFilter:** correctly format ISODates on Android<=2.1
  ([f046f6f7](https://github.com/angular/angular.js/commit/f046f6f73c910998a94f30a4cb4ed087b6325485),
   [#2277](https://github.com/angular/angular.js/issues/2277))

- **jqLite:** correct implementation of mouseenter/mouseleave event
  ([06f2b2a8](https://github.com/angular/angular.js/commit/06f2b2a8cf7e8216ad9ef05f73426271c2d97faa),
   [#2131](https://github.com/angular/angular.js/issues/2131))

- **angular.copy/angular.extend:** do not copy $$hashKey in copy/extend functions.
  ([6d0b325f](https://github.com/angular/angular.js/commit/6d0b325f7f5b9c1f3cfac9b73c6cd5fc3d1e2af0),
   [#1875](https://github.com/angular/angular.js/issues/1875))

- **i18n:** escape all chars above \u007f in locale files
  ([695c54c1](https://github.com/angular/angular.js/commit/695c54c17b3299cd6170c45878b41cb46a577cd2),
   [#2417](https://github.com/angular/angular.js/issues/2417))

- **Directives:**
  - **ngPluralize:** handle the empty string as a valid override
  ([67a4a25b](https://github.com/angular/angular.js/commit/67a4a25b890fada0043c1ff98e5437d793f44d0c),
   [#2575](https://github.com/angular/angular.js/issues/2575))
  - **select:** ensure empty option is not lost in IE9
  ([4622af3f](https://github.com/angular/angular.js/commit/4622af3f075204e2d5ab33d5bd002074f2d940c9),
   [#2150](https://github.com/angular/angular.js/issues/2150))
  - **ngModel:** use paste/cut events in IE to support context menu
  ([363e4cbf](https://github.com/angular/angular.js/commit/363e4cbf649de4c5206f1904ee76f89301ceaab0),
   [#1462](https://github.com/angular/angular.js/issues/1462))
  - **ngClass:** should remove classes when object is the same but property has changed
  ([0ac969a5](https://github.com/angular/angular.js/commit/0ac969a5ee1687cfd4517821943f34fe948bb3fc))

- **PhoneCat Tutorial:** renamed Testacular to Karma
  ([angular-phonecat](https://github.com/angular/angular-phonecat))



<a name="1.1.4"></a>
# 1.1.4 quantum-manipulation (2013-04-03)

_Note: 1.1.x releases are [considered unstable](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html).
They pass all tests but we reserve the right to change new features/apis in between minor releases. Check them
out and please give us feedback._

_Note: This release also contains all bug fixes available in [1.0.6](#1.0.6)._


## Features

- **$compile:**
  - allow directives to modify interpolated attributes
  ([fe8d893b](https://github.com/angular/angular.js/commit/fe8d893b839e9b14e3e55a3a0523cc1e6355bdd5))
  - support for dynamic template generation
  ([eb53423a](https://github.com/angular/angular.js/commit/eb53423a41136fcda0c5e711f2d104952080354b))
  - add attribute binding support via ngAttr*
  ([cf17c6af](https://github.com/angular/angular.js/commit/cf17c6af475eace31cf52944afd8e10d3afcf6c0),
   [#1050](https://github.com/angular/angular.js/issues/1050), [#1925](https://github.com/angular/angular.js/issues/1925))
  - `'=?'` makes `'='` binding optional
  ([ac899d0d](https://github.com/angular/angular.js/commit/ac899d0da59157fa1c6429510791b6c3103d9401),
   [#909](https://github.com/angular/angular.js/issues/909), [#1435](https://github.com/angular/angular.js/issues/1435))

- **$q:** `$q.all()` now accepts hash
  ([e27bb6eb](https://github.com/angular/angular.js/commit/e27bb6eb132a68665c8fca3f5a216b19b1129ba6))

- **$resource:** ability to override url in resource actions
  ([60f1f099](https://github.com/angular/angular.js/commit/60f1f099fc7e5197808cd6acb7407cdc40f50a3f))

- **$route:** add `caseInsensitiveMatch` option for url matching
  ([5e18a15f](https://github.com/angular/angular.js/commit/5e18a15fb01d2e81adda68503754289fa9655082))

- **http:**
  - support request/response promise chaining
  ([4ae46814](https://github.com/angular/angular.js/commit/4ae46814ff4e7c0bbcdbbefc0a97277283a84065))
  - set custom default cache in $http.defaults.cache
  ([99f3b70b](https://github.com/angular/angular.js/commit/99f3b70b2d316f5bb39e21249e752c29f49c90ab))


- **JQLite:** `ready()` now supports `document.readyState=='complete'`
  ([753fc9e5](https://github.com/angular/angular.js/commit/753fc9e58d5e554d4930548558efecc283557eeb))

- **Scenario:** autodisable animations when running e2e tests
  ([fec4ef38](https://github.com/angular/angular.js/commit/fec4ef38815340e8e5a6b65fd6c08f5c74e701d8))

- **Scope:** add `$watchCollection` method for observing collections
  ([5eb96855](https://github.com/angular/angular.js/commit/5eb968553a1130461ab8704535691e00eb154ac2))

- **angular.bootstrap:** support deferred bootstrap (mainly useful for tools like test runners and Batarang)
  ([603fe0d1](https://github.com/angular/angular.js/commit/603fe0d19608ffe1915d8bc23bf412912e7ee1ac))

- **ngMobile:** add ngMobile module with mobile-specific ngClick
  ([707c65d5](https://github.com/angular/angular.js/commit/707c65d5a228b44ab3aea2fad95516fe6c57169a))

- **Directives:**
  - **ngKeypress:** add ngKeypress directive for handling keypress event
  ([f20646bc](https://github.com/angular/angular.js/commit/f20646bce5f0c914992a78fc2556bda136c27ac9))
  - **ngSwitch:** Preserve the order of the elements not in the ng-switch
  ([e88d6179](https://github.com/angular/angular.js/commit/e88d6179c3a6a137e75fa09de906fc83c6515db2),
   [#1074](https://github.com/angular/angular.js/issues/1074))
  - **ngAnimate:** add support for animation
  ([0b6f1ce5](https://github.com/angular/angular.js/commit/0b6f1ce5f89f47f9302ff1e8cd8f4b92f837c413))
  - **ngRepeat:** add support for custom tracking of items
  ([61f2767c](https://github.com/angular/angular.js/commit/61f2767ce65562257599649d9eaf9da08f321655))


## Breaking Changes

- **$route:** due to [6f71e809](https://github.com/angular/angular.js/commit/6f71e809141bf89501e55c378921d6e7ec9512bc),
  in $routeChangeStart event, nextRoute.$route property is gone. Use the nextRoute object itself instead of nextRoute.$route.

- **ngRepeat:** due to [61f2767c](https://github.com/angular/angular.js/commit/61f2767ce65562257599649d9eaf9da08f321655), it is now considered an error to have two identical items (identified by the new "track by" expression) in a collection that is fed into the repeater. This behavior was previously tolerated.

- **ngSwitch:** due to [e88d6179](https://github.com/angular/angular.js/commit/e88d6179c3a6a137e75fa09de906fc83c6515db2),
  elements not in the ng-switch were rendered after the ng-switch elements.  Now they are rendered in-place.

  Templates with ngSwitch directives and nested non-ngSwitchWhen elements should be updated to preserve render order.

  For example: The following was previously rendered with `<li>1</li>` after `<li>2</li>`:

        <ul ng-switch="select">
          <li>1</li>
          <li ng-switch-when="option">2</li>
        </ul>

  To keep the old behavior, use:

        <ul ng-switch="select">
          <li ng-switch-when="1">2</li>
          <li>1</li>
        </ul>



<a name="1.0.6"></a>
# 1.0.6 universal-irreversibility (2013-04-04)


## Bug Fixes

- **$compile:**
  - compile replace directives in external template
  ([398691be](https://github.com/angular/angular.js/commit/398691beb3fc40a481afa258d181de06ec0d153c),
   [#1859](https://github.com/angular/angular.js/issues/1859))
  - whitelist file:// in url sanitization
  ([7b236b29](https://github.com/angular/angular.js/commit/7b236b29aa3a6f6dfe722815e0a2667d9b7f0899))
  - handle elements with no childNodes property
  ([bec614fd](https://github.com/angular/angular.js/commit/bec614fd90c48c3921a4b659912008574e553b40))
- **$http:** don't encode URL query substring "null" to "+"
  ([86d191ed](https://github.com/angular/angular.js/commit/86d191ed4aea9015adc71b852223475c5c762c34))
- **$httpBackend:** prevent DOM err due to dereferencing .responseText
  ([509ec745](https://github.com/angular/angular.js/commit/509ec745fdbb54b54672fbf8595a4958c16f2b53),
   [#1922](https://github.com/angular/angular.js/issues/1922))
- **$location:**
  - parse FirefoxOS packaged app urls
  ([3a81dd8b](https://github.com/angular/angular.js/commit/3a81dd8bddbade81c4c9f734813458d0d969a4bf),
   [#2112](https://github.com/angular/angular.js/issues/2112))
  - correctly rewrite html5 url to hashbang url
  ([9befe370](https://github.com/angular/angular.js/commit/9befe37014141fbfdf0cded318d28322fc058c13))
- **$route:** make nextRoute.$route private
  ([6f71e809](https://github.com/angular/angular.js/commit/6f71e809141bf89501e55c378921d6e7ec9512bc),
   [#1907](https://github.com/angular/angular.js/issues/1907))
- **mocks:** prevent NPE when module definition outside of it.
  ([5c735eb4](https://github.com/angular/angular.js/commit/5c735eb4ab07144a62949472ed388cb185099201))
- **dateFilter:** correct timezone date filter for 1/2 hour offsets
  ([1c1cd4fd](https://github.com/angular/angular.js/commit/1c1cd4fdf6b6d7511c7b8dc61b8042011dc54830))







<a name="1.1.3"></a>
# 1.1.3 radioactive-gargle (2013-02-20)

_Note: 1.1.x releases are [considered unstable](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html).
They pass all tests but we reserve the right to change new features/apis in between minor releases. Check them
out and please give us feedback._

_Note: This release also contains all bug fixes available in [1.0.5](#1.0.5)._


## Bug Fixes

- **$compile:**
  - initialize interpolated attributes before directive linking
  ([bb8448c0](https://github.com/angular/angular.js/commit/bb8448c011127306df08c7479b66e5afe7a0fa94))
  - interpolate @ locals before the link function runs
  ([2ed53087](https://github.com/angular/angular.js/commit/2ed53087d7dd06d728e333a449265f7685275548))
- **$http:**
  - do not encode special characters `@$:,` in params
  ([288b69a3](https://github.com/angular/angular.js/commit/288b69a314e9bd14458b6647532eb62aad5c5cdf))
- **$resource:**
  - params should expand array values properly
  ([2a212344](https://github.com/angular/angular.js/commit/2a2123441c2b749b8f316a24c3ca3f77a9132a01))



## Features

- **$http:** allow overriding the XSRF header and cookie name
  ([8155c3a2](https://github.com/angular/angular.js/commit/8155c3a29ea0eb14806913b8ac08ba7727e1969c))
- **$parse:** added `constant` and `literal` properties
  ([1ed63858](https://github.com/angular/angular.js/commit/1ed638582d2f2c7f89384d9712f4cfac52cc5b70))
- **$resource:** expose promise based api via $then and $resolved
  ([dba6bc73](https://github.com/angular/angular.js/commit/dba6bc73e802fdae685a9f351d3e23c7efa8568a))
- **$routeProvider:** add support to catch-all parameters in routes
  ([7eafbb98](https://github.com/angular/angular.js/commit/7eafbb98c64c0dc079d7d3ec589f1270b7f6fea5))
- **Scope:**
  - expose transcluded and isolate scope info for batarang
  ([649b8922](https://github.com/angular/angular.js/commit/649b892205615a144dafff9984c0e6ab10ed341d))
  - only evaluate constant $watch expressions once
  ([1d7a95df](https://github.com/angular/angular.js/commit/1d7a95df565192fc02a18b0b297b39dd615eaeb5))
- **angular.noConflict:** added api to restore previous angular namespace reference
  ([12ba6cec](https://github.com/angular/angular.js/commit/12ba6cec4fb79521101744e02a7e09f9fbb591c4))
- **Directives:**
  - **ngSwitch:** support multiple matches on ngSwitchWhen and ngSwitchDefault
  ([0af17204](https://github.com/angular/angular.js/commit/0af172040e03811c59d01682968241e3df226774),
   [#1074](https://github.com/angular/angular.js/issues/1074))
- **Filters:**
  - **date:** add `[.,]sss` formatter for milliseconds
  ([df744f3a](https://github.com/angular/angular.js/commit/df744f3af46fc227a934f16cb63c7a6038e7133b))
  - **filter:** add comparison function to filter
  ([ace54ff0](https://github.com/angular/angular.js/commit/ace54ff08c4593195b49eadb04d258e6409d969e))


## Breaking Changes

- **$http:** due to [288b69a3](https://github.com/angular/angular.js/commit/288b69a314e9bd14458b6647532eb62aad5c5cdf),
  $http now follows RFC3986 and does not encode special characters like `$@,:` in params.
  If your application needs to encode these characters, encode them manually, before sending the request.
- **$resource:** due to [2a212344](https://github.com/angular/angular.js/commit/2a2123441c2b749b8f316a24c3ca3f77a9132a01),
  if the server relied on the buggy behavior of serializing arrays as http query arguments then
  either the backend should be fixed or a simple serialization of the array should be done
  on the client before calling the resource service.




<a name="1.0.5"></a>
# 1.0.5 flatulent-propulsion (2013-02-20)


## Bug Fixes

- **$compile:**
  - sanitize values bound to `a[href]`
  ([9532234b](https://github.com/angular/angular.js/commit/9532234bf1c408af9a6fd2c4743fdb585b920531))
  - rename $compileNote to compileNode
  ([92ca7efa](https://github.com/angular/angular.js/commit/92ca7efaa4bc4f37da3008b234e19343a1fa4207),
   [#1941](https://github.com/angular/angular.js/issues/1941))
  - should not leak memory when there are top level empty text nodes
  ([791804bd](https://github.com/angular/angular.js/commit/791804bdbfa6da7a39283623bd05628a01cd8720))
  - allow startingTag method to handle text / comment nodes
  ([755beb2b](https://github.com/angular/angular.js/commit/755beb2b66ce9f9f9a218f2355bbaf96d94fbc15))
- **$cookies:** set cookies on Safari&IE when `base[href]` is undefined
  ([70909245](https://github.com/angular/angular.js/commit/7090924515214752b919b0c5630b3ea5e7c77223),
   [#1190](https://github.com/angular/angular.js/issues/1190))
- **$http:**
  - patch for Firefox bug w/ CORS and response headers
  ([e19b04c9](https://github.com/angular/angular.js/commit/e19b04c9ec985821edf1269c628cfa261f81d631),
   [#1468](https://github.com/angular/angular.js/issues/1468))
- **$resource:**
  - update RegExp to allow urlParams with out leading slash
  ([b7e1fb05](https://github.com/angular/angular.js/commit/b7e1fb0515798e1b4f3f2426f6b050951bee2617))
- **Directives:**
  - **a:** workaround IE bug affecting mailto urls
  ([37e8b122](https://github.com/angular/angular.js/commit/37e8b12265291918396bfee65d444a8f63697b73),
   [#1949](https://github.com/angular/angular.js/issues/1949))
  - **ngClass:** keep track of old ngClass value manually
  ([5f5d4fea](https://github.com/angular/angular.js/commit/5f5d4feadbfa9d8ecc8150041dfd2bca2b2e9fea),
   [#1637](https://github.com/angular/angular.js/issues/1637))
  - **ngSwitch:** make ngSwitch compatible with controller backwards-compatibility module
  ([9b7c1d0f](https://github.com/angular/angular.js/commit/9b7c1d0f7ce442d4ad2ec587e66d2d335e64fa4e))
- **Filters:**
  - **date:**  invert timezone sign and always display sign
  ([b001c8ec](https://github.com/angular/angular.js/commit/b001c8ece5472626bf49cf82753e8ac1aafd2513),
   [#1261](https://github.com/angular/angular.js/issues/1261))
  - **number:** fix formatting when "0" passed as fractionSize
  ([f5835963](https://github.com/angular/angular.js/commit/f5835963d5982003a713dd354eefd376ed39ac02))
- **scenario runner:** include error messages in XML output
  ([d46fe3c2](https://github.com/angular/angular.js/commit/d46fe3c23fa269dcc10249148f2af14f3db6b066))
- **Misc:**
  - don't use instanceof to detect arrays
  ([3c2aee01](https://github.com/angular/angular.js/commit/3c2aee01b0b299995eb92f4255159585b0f53c10),
   [#1966](https://github.com/angular/angular.js/issues/1966))
  - angular.forEach should correctly iterate over objects with length prop
  ([ec54712f](https://github.com/angular/angular.js/commit/ec54712ff3dab1ade44f94fa82d67edeffa79a1d),
   [#1840](https://github.com/angular/angular.js/issues/1840))



<a name="1.1.2"></a>
# 1.1.2 tofu-animation (2013-01-22)

_Note: 1.1.x releases are [considered unstable](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html).
They pass all tests but we reserve the right to change new features/apis in between minor releases. Check them
out and please give us feedback._

_Note: This release also contains all bug fixes available in [1.0.4](#1.0.4)._

## Features

- **$compile:** support modifying the DOM structure in postlink fn
  ([cdf6fb19](https://github.com/angular/angular.js/commit/cdf6fb19c85560b30607e71dc2b19fde54760faa))
- **$log:** add $log.debug()
  ([9e991ddb](https://github.com/angular/angular.js/commit/9e991ddb1de13adf520eda459950be5b90b5b6d9),
   [#1592](https://github.com/angular/angular.js/issues/1592))
- **$parse:** allow strict equality in angular expressions
  ([a179a9a9](https://github.com/angular/angular.js/commit/a179a9a96eda5c566bda8a70ac8a75822c936a68),
   [#908](https://github.com/angular/angular.js/issues/908))
- **$resource:**
  - allow dynamic default parameters
  ([cc42c99b](https://github.com/angular/angular.js/commit/cc42c99bec6a03d6c41b8e1d29ba2b1f5c16b87d))
  - support all $http.config actions
  ([af89daf4](https://github.com/angular/angular.js/commit/af89daf4641f57b92be6c1f3635f5a3237f20c71))
- **$route:** allow using functions as template params in 'when'
  ([faf02f0c](https://github.com/angular/angular.js/commit/faf02f0c4db7962f863b0da2a82c8cafab2c706f))
- **$timeout-mock:** add verifyNoPendingTasks method
  ([f0c6ebc0](https://github.com/angular/angular.js/commit/f0c6ebc07653f6267acec898ccef5677884e3081),
   [#1245](https://github.com/angular/angular.js/issues/1245))
- **directive:**
  - added ngOpen boolean directive
  ([b8bd4d54](https://github.com/angular/angular.js/commit/b8bd4d5460d9952e9a3bb14992636b17859bd457))
  - ngKeydown, ngKeyup
  ([e03182f0](https://github.com/angular/angular.js/commit/e03182f018f5069acd5e883ce2e9349b83f2d03f),
   [#1035](https://github.com/angular/angular.js/issues/1035))
- **limitTo filter:** limitTo filter accepts strings
  ([9e96d983](https://github.com/angular/angular.js/commit/9e96d983451899ef0cef3e68395c8f6c1ef83bbe),
   [#653](https://github.com/angular/angular.js/issues/653))
- **scenario:**
  - add mouseover method to the ngScenario dsl
  ([2f437e89](https://github.com/angular/angular.js/commit/2f437e89781cb2b449abb685e36b26ca1cf0fff5))
  - fail when an option to select does not exist
  ([15183f3e](https://github.com/angular/angular.js/commit/15183f3e1fbee031c9595206163962788f98b298))


## Breaking Changes

- **date:** due to [cc821502](https://github.com/angular/angular.js/commit/cc821502bca64d15e1c576bf20a62b28b3d9a88a),
  string input without timezone info is now parsed as local time/date



<a name="1.0.4"></a>
# 1.0.4 bewildering-hair (2013-01-22)

## Bug Fixes

- **$compile:**
  - do not wrap empty root text nodes in spans
  ([49f9e4ce](https://github.com/angular/angular.js/commit/49f9e4cef13e68ff85b3c160cf8fac6e7cd042a3),
   [#1059](https://github.com/angular/angular.js/issues/1059))
  - safely create transclude comment nodes
  ([74dd2f79](https://github.com/angular/angular.js/commit/74dd2f7980ea8ec434a6e0565d857c910653ed9b),
   [#1740](https://github.com/angular/angular.js/issues/1740))
- **$injector:**
  - remove bogus fn arg
  ([b6b7c5a1](https://github.com/angular/angular.js/commit/b6b7c5a1d66073937709158da8c2d688cb45c9f6),
   [#1711](https://github.com/angular/angular.js/issues/1711))
  - provider can now be defined in the array format
  ([2c405f41](https://github.com/angular/angular.js/commit/2c405f417125c80c387a51baece8bf6e1e0c0a81),
   [#1452](https://github.com/angular/angular.js/issues/1452))
- **$resource:**
  - HTTP method should be case-insensitive
  ([8991680d](https://github.com/angular/angular.js/commit/8991680d8ab632dda60cd70c780868c803c74509),
   [#1403](https://github.com/angular/angular.js/issues/1403))
  - correct leading slash removal in resource URLs
  ([b2f46251](https://github.com/angular/angular.js/commit/b2f46251aca76c8568ee7d4bab54edbc9d7a186a))
- **$route:**
  - support route params not separated with slashes.
  ([c6392616](https://github.com/angular/angular.js/commit/c6392616ea5245bd0d2f77dded0b948d9e2637c8))
  - correctly extract $routeParams from urls
  ([30a9da5d](https://github.com/angular/angular.js/commit/30a9da5dc159dd1e19b677914356925c7ebdf632))
- **Scope:** ensure that a scope is destroyed only once
  ([d6da505f](https://github.com/angular/angular.js/commit/d6da505f4e044f8a487ac27a3ec707c11853ee0a),
   [#1627](https://github.com/angular/angular.js/issues/1627))
- **angular.equals:**
  - consistently compare undefined object props
  ([5ae63fd3](https://github.com/angular/angular.js/commit/5ae63fd385295d5a7bbdc79466f59727dcab1c85),
   [3c2e1c5e](https://github.com/angular/angular.js/commit/3c2e1c5e4d12529b1d69a6173c38097527dccc4f),
   [#1648](https://github.com/angular/angular.js/issues/1648))
- **date filter:** parse string input as local time unless TZ is specified
  ([cc821502](https://github.com/angular/angular.js/commit/cc821502bca64d15e1c576bf20a62b28b3d9a88a),
   [#847](https://github.com/angular/angular.js/issues/847))
- **jqLite:**
  - children() should only return elements
  ([febb4c1c](https://github.com/angular/angular.js/commit/febb4c1c35cf767ae31fc9fef1f4b4f026ac9de0))
  - make next() ignore non-element nodes
  ([76a6047a](https://github.com/angular/angular.js/commit/76a6047af690781b8238ba7924279470ba76d081))
- **scenario:** don't trigger input events on IE9
  ([8b9e6c35](https://github.com/angular/angular.js/commit/8b9e6c3501746edb2c9e2d585e8e0eaeb8ba8327))
- **Directives:**
  - **ngRepeat:** correctly apply $last if repeating over object
  ([7e746015](https://github.com/angular/angular.js/commit/7e746015ea7dec3e9eb81bc4678fa9b6a83bc47c),
   [#1789](https://github.com/angular/angular.js/issues/1789))
  - **ngSwitch:** don't leak when destroyed while not attached
  ([a26234f7](https://github.com/angular/angular.js/commit/a26234f7183013e2fcc9b35377e181ad96dc9917),
   [#1621](https://github.com/angular/angular.js/issues/1621))
  - **select:** support optgroup + select[multiple] combo
  ([26adeb11](https://github.com/angular/angular.js/commit/26adeb119bc4fafa6286de484626b8de4170abc9),
   [#1553](https://github.com/angular/angular.js/issues/1553))


## Features

- **$compile:** support modifying the DOM structure in postlink fn
  ([cdf6fb19](https://github.com/angular/angular.js/commit/cdf6fb19c85560b30607e71dc2b19fde54760faa))



<a name="1.1.1"></a>
# 1.1.1 pathological-kerning (2012-11-26)

_Note: 1.1.x releases are [considered unstable](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html).
They pass all tests but we reserve the right to change new features/apis in between minor releases. Check them
out and please give us feedback._

_Note: This release also contains all bug fixes available in [1.0.3](#1.0.3)._


## Features

- **$cacheFactory:** cache.put now returns the added value
  ([168db339](https://github.com/angular/angular.js/commit/168db33985aa025eb48bc21087717ab70da0bd72))
- **$http:** Allow setting withCredentials on defaults
  ([209b67df](https://github.com/angular/angular.js/commit/209b67df6a49fe1646ce63c5e7d11ed26e8abbc1),
   [#1095](https://github.com/angular/angular.js/issues/1095))
- **$resource:** support custom headers per action
  ([fbdab513](https://github.com/angular/angular.js/commit/fbdab513dd48f667ad857030cf4b3481ecdd9097),
   [#736](https://github.com/angular/angular.js/issues/736))
- **$sanitize:** support telephone links
  ([04450c48](https://github.com/angular/angular.js/commit/04450c48dfea065e1c9e4ab8adad94993ed1b037))
- **FormController:** add ability to reset a form to pristine state
  ([733a97ad](https://github.com/angular/angular.js/commit/733a97adf87bf8f7ec6be22b37c4676cf7b5fc2b),
   [#856](https://github.com/angular/angular.js/issues/856))
- **jqLite:** add triggerHandler()
  ([650fd933](https://github.com/angular/angular.js/commit/650fd933df614ac733cd43fe31d81d622a2ce2bc))
- **linky filter:** allow optional 'target' argument
  ([610927d7](https://github.com/angular/angular.js/commit/610927d77b77700c5c61accd503a2af0fa51cfe6),
   [#1443](https://github.com/angular/angular.js/issues/1443))
- **angular-mocks:** support mocha in angular mocks
  ([92558fe4](https://github.com/angular/angular.js/commit/92558fe4119fb1ee793d781de1888abef181c7f6))
- **ngModel:** support ngTrim attribute on input
  ([d519953a](https://github.com/angular/angular.js/commit/d519953a4b219035587e3fcb2e9cc52e02b408ca))
- **scenario:** add dblclick method to the ngScenario dsl
  ([8cb9c99e](https://github.com/angular/angular.js/commit/8cb9c99ec064fd95567118d29bfa4a19b8613ab3))
- **CSP:** update to the latest CSP api
  ([af7e0bd0](https://github.com/angular/angular.js/commit/af7e0bd0a7c286667c526cb7e0c733d3ee5f17fd),
   [#1577](https://github.com/angular/angular.js/issues/1577))


## Bug Fixes

- **$http:**
  - config.param should expand array values properly (see breaking change notes below)
    ([79af2bad](https://github.com/angular/angular.js/commit/79af2badcb087881e3fd600f6ae5bf3f86a2daf8),
     [#1363](https://github.com/angular/angular.js/issues/1363))
  - prevent CORS preflight checks by removing `X-Requested-With` from header defaults (see breaking
    change notes below)
    ([3a75b112](https://github.com/angular/angular.js/commit/3a75b1124d062f64093a90b26630938558909e8d),
     [#1004](https://github.com/angular/angular.js/issues/1004))
  - prevent CORS preflight checks by not setting `X-XSFR-TOKEN` header for cross domain requests (see
    breaking change notes below)
    ([fce100a4](https://github.com/angular/angular.js/commit/fce100a46c5681562253c3a856d67bbd35fbc2f2),
     [#1096](https://github.com/angular/angular.js/issues/1096))


## Refactorings

- **$evalAsync:** have only one global async queue
  ([331cd5a8](https://github.com/angular/angular.js/commit/331cd5a8cb5efdafe8ad7eb386aed4033cfc1bb3))


## Breaking Changes

- Due to fix for [#1363](https://github.com/angular/angular.js/issues/1363) it's possible but unlikely
  that $http will start generating different URLs for requests. This affects only cases when a request
  is made with a parameter, value of which is an array. If the server relied on the buggy behavior then
  either the backend should be fixed or a simple serialization of the array should be done on the client
  before calling the $http service.

- Due to fix for [#1004](https://github.com/angular/angular.js/issues/1004) the `X-Requested-With` header
  is not set by $http service any more. If anyone actually uses this header it's quite easy to add
  it back via:

  ```
    myAppModule.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);
  ```

- Due to fix for [#1096](https://github.com/angular/angular.js/issues/1096) `X-XSFR-TOKEN` header is
  no longer send for cross domain requests. This shouldn't affect any known production service. If we are
  wrong, please let us know ;-)



<a name="1.0.3"></a>
# 1.0.3 bouncy-thunder (2012-11-26)


## Bug Fixes

- **$cacheFactory:** return undefined when removing non-existent entry
  ([55d15806](https://github.com/angular/angular.js/commit/55d15806fb14b1d98b5ca2770bbbb59e11548c62),
   [#1497](https://github.com/angular/angular.js/issues/1497))
- **$compile:**
  - prevent double attr interpolation w/ templateUrl
    ([fc115bfd](https://github.com/angular/angular.js/commit/fc115bfd0d18017f4bcef1e39fb22d97a98f8ab1),
     [#1166](https://github.com/angular/angular.js/issues/1166))
  - reference local in isolate scope
    ([8db47ca7](https://github.com/angular/angular.js/commit/8db47ca7d4303e3e45a838219a1f6e9be8770ed4),
     [#1272](https://github.com/angular/angular.js/issues/1272))
  - don't look for class directives in empty string
    ([54b3875b](https://github.com/angular/angular.js/commit/54b3875ba5cb6ce8ddac61ace33c1b2f600875ff))
  - compilation should not recurse into empty nodes
    ([008a782b](https://github.com/angular/angular.js/commit/008a782bc8ed8a7ebcb63d563d1420fd1b312452))
- **$injector:** more conservative annotation parsing
- **$location:** reset $location.$$replace with every watch call
    ([a32bc40f](https://github.com/angular/angular.js/commit/a32bc40fd75ca46e3581ad7a6e3a24a31df6e266),
     [#1111](https://github.com/angular/angular.js/issues/1111))
  ([d9eff86e](https://github.com/angular/angular.js/commit/d9eff86ef77dd76208cef21e882239d4db0eac1e))
- **$parser:** string concatenation with undefined model
  ([42c38b29](https://github.com/angular/angular.js/commit/42c38b29f7dcb3327fe58e630b8e2973676989e0),
   [#988](https://github.com/angular/angular.js/issues/988))
- **$resource:**
  - prevent default params to be shared between actions
    ([94e1c039](https://github.com/angular/angular.js/commit/94e1c0391c351b6f691fad8abed2828fa20548b2))
  - allow falsy values in URL parameters
    ([4909d1d3](https://github.com/angular/angular.js/commit/4909d1d39d61d6945a0820a5a7276c1e657ba262))
  - ignore undefined parameters
    ([10e1c759](https://github.com/angular/angular.js/commit/10e1c759f4602d993a76b0eacf6a2d04c8880017),
     [#875](https://github.com/angular/angular.js/issues/875),
     [#782](https://github.com/angular/angular.js/issues/782))
- **Scope:**
  - workaround for Chrome's memleak
    ([bd524fc4](https://github.com/angular/angular.js/commit/bd524fc4e5fc0feffe85632a7a6560da6bd9b762),
     [#1313](https://github.com/angular/angular.js/issues/1313))
  - allow removing a listener during event
    ([e6966e05](https://github.com/angular/angular.js/commit/e6966e05f508d1d2633b9ff327fea912b12555ac))
- **$route:** support inline annotation on .resolve
  ([b0a05a75](https://github.com/angular/angular.js/commit/b0a05a7531ed7235aa6d2c4e3ea11373e1fc73f1))
- **FormController:** propagate dirty state to parent forms
  ([04329151](https://github.com/angular/angular.js/commit/04329151d2df833f803629cefa781aa6409fe6a5))
- **a:** prevent Opera from incorrectly navigating on link click
  ([c81d8176](https://github.com/angular/angular.js/commit/c81d8176cc55cd15acae05259ead73f90a01f0b7))
- **jqLite:**
  - support append on document fragment
    ([96ed9ff5](https://github.com/angular/angular.js/commit/96ed9ff59a454486c88bdf92ad9d28ab8864b85e))
  - fire $destroy event via triggerHandler (this makes AngularJS compatible with **jQuery 1.8.x**)
    ([b9a9f91f](https://github.com/angular/angular.js/commit/b9a9f91fbf99b71cfde434b6277f4c7d2533556f),
     [#1512](https://github.com/angular/angular.js/issues/1512))
- **Filters**
  - **currency:** Handle not-quite-zero values
    ([bca1604c](https://github.com/angular/angular.js/commit/bca1604c12262b66ce3b8004994fb4841fb8b87d),
     [#1469](https://github.com/angular/angular.js/issues/1469))
  - **date:**
     - make timezone optional
       ([9473780e](https://github.com/angular/angular.js/commit/9473780e77a960ba27644ca76c2413924cc8972e))
     - support sub-second precision on dateFilter
       ([f299fd51](https://github.com/angular/angular.js/commit/f299fd512248321b426a5ab924a329aa1b691280))
- **Directives**
  - **ngClass:** works with class interpolation
    ([cebd015f](https://github.com/angular/angular.js/commit/cebd015f78c5e21bd37d4bc055dbcdc21dac2ef2),
     [#1016](https://github.com/angular/angular.js/issues/1016))
  - **ngClassOdd/ngClassEven:** support shrinking/reordering in repeaters
    ([d859dcec](https://github.com/angular/angular.js/commit/d859dcecea654d1d858cd756c6efb8435a453197),
     [6c67719d](https://github.com/angular/angular.js/commit/6c67719dfa6ff3f2a15a8e1e7660cf2e6e9155b0),
     [#1076](https://github.com/angular/angular.js/issues/1076))
  - **ngModel:** sync ngModel state with scope state
    ([e6d9bea4](https://github.com/angular/angular.js/commit/e6d9bea4f3b2eb28851298d3dc3a30d46062d58a),
     [#933](https://github.com/angular/angular.js/issues/933))
  - **ngRepeat:** now works better with primitive types
    ([e6d9bea4](https://github.com/angular/angular.js/commit/e6d9bea4f3b2eb28851298d3dc3a30d46062d58a),
     [#933](https://github.com/angular/angular.js/issues/933))
  - **ngSrc:** don't set src if value is empty string
    ([b6e4a711](https://github.com/angular/angular.js/commit/b6e4a71166c7f00f4140fd7ea8f0cd81b4487a3f))
  - **select:** select option with a label of 0 is not shown
    ([b3cae4f4](https://github.com/angular/angular.js/commit/b3cae4f457f1688346bbd0b08cccc9c504f83406),
     [#1401](https://github.com/angular/angular.js/issues/1401))
- **scenario:**
  - emit RunnerBegin event
    ([95276a7e](https://github.com/angular/angular.js/commit/95276a7e1047c7a3ac6613d8612c62f544388fc9))
  - NPE when no angular loaded in test page
    ([84c13d96](https://github.com/angular/angular.js/commit/84c13d96ff6e993b2ee9ff6bf49614fc1d514b04))
  - support data-ng and x-ng based attributes
  ([249a1d84](https://github.com/angular/angular.js/commit/249a1d84e7ac3b8528d317b8b0a80acb5dd9a271),
   [#1020](https://github.com/angular/angular.js/issues/1020))


## Docs

- add plunkr support
  ([7c67b2fb](https://github.com/angular/angular.js/commit/7c67b2fb6afbc18f3593c64a5f339f04f9003f3c))
- various small documentation fixes and improvements


## Refactorings

- name all anonymous watch functions in Angular
  ([ca30fce2](https://github.com/angular/angular.js/commit/ca30fce28ca13284bfa1c926e810ed75cdcde499),
   [#1119](https://github.com/angular/angular.js/issues/1119))




<a name="1.1.0"></a>
# 1.1.0 increase-gravatas (2012-08-31)

_Note: 1.1.x releases unlike 1.0.x are considered unstable.
[More info](http://blog.angularjs.org/2012/07/angularjs-10-12-roadmap.html)_

This release also contains all bug fixes available in [1.0.2](#1.0.2).

## Features

- **$http:** support custom reponseType
  ([e0a54f6b](https://github.com/angular/angular.js/commit/e0a54f6b206dc2b6595f2bc3a17c5932e7477545),
  [#1013](https://github.com/angular/angular.js/issues/1013))
- **$interpolate:**
  - provide contextual error messages
    ([d804bbcd](https://github.com/angular/angular.js/commit/d804bbcd51ec83bee1f4a3ccd42c3bd7eb38a988))
  - expose start/end symbols in run phase
    ([58f121a5](https://github.com/angular/angular.js/commit/58f121a5c293ed57043e22ed526fdf99642fca81))
- **$sniffer:** auto detect CSP mode (currently requires Chrome on dev channel)
  ([167aa0c2](https://github.com/angular/angular.js/commit/167aa0c29c998be33c49d33302e099b36d1ce0be))



<a name="1.0.2"></a>
# 1.0.2 debilitating-awesomeness (2012-08-31)


## Bug Fixes

- **$compile:** denormalize directive templates
  ([dfe99836](https://github.com/angular/angular.js/commit/dfe99836cd98c2a1b0f9bde6216bd44088de275a))
- **$interpolate:** $interpolateProvider.endSymbol() returns startSymbol
  ([20348717](https://github.com/angular/angular.js/commit/20348717640c0ef405c9fdcc8fec5b566efc48b3))
- **jqLite:** better support for xhtml
  ([d3fa7a2e](https://github.com/angular/angular.js/commit/d3fa7a2e9e93c9dae13d852b28c878f7d6b7c420),
   [#1301](https://github.com/angular/angular.js/issues/1301))
- **mocks:** free up memory after every spec
  ([1a8642aa](https://github.com/angular/angular.js/commit/1a8642aac2de40dccdab464e58dc164006c300bb))
- **e2e test runner:** Adding meta tag to avoid cache issues
  ([5318588d](https://github.com/angular/angular.js/commit/5318588d6e8ee9a31f4002affd6858d25305aabf))
- Directives:
  - **form:** prevent page reload when form destroyed
    ([054d40f3](https://github.com/angular/angular.js/commit/054d40f338f9000cddcf7f0513af37328b88ef41),
     [#1238](https://github.com/angular/angular.js/issues/1238))
  - **ngList:** remove data bound flicker
    ([fa62ea81](https://github.com/angular/angular.js/commit/fa62ea810f6c701e898dd07c6c9228f13d5b5e02))
  - **ngPluralize:** fixes ng-pluralize when using non-standard start/end symbols
    ([e85774f7](https://github.com/angular/angular.js/commit/e85774f709b9f681b0ff8d829b07568b0f844a62),
     [#1134](https://github.com/angular/angular.js/issues/1134))
  - **option:** support option elements in datalist
    ([9767f7bd](https://github.com/angular/angular.js/commit/9767f7bdd3e1ce6f65bdea992d67369ead13d813),
     [#1165](https://github.com/angular/angular.js/issues/1165))


## Docs

- Conceptual Overview of AngularJS (high level overview of how things work):
  <http://docs.angularjs.org/guide/concepts>
  ([7a5f25f6](https://github.com/angular/angular.js/commit/7a5f25f6671eb5f51b06615d74a05855ab79f31e))
- Lots of spelling, grammar and other fixes:
  [9a710c78](https://github.com/angular/angular.js/commit/9a710c788d880785d2b02a9c5411eb15e9c278bf),
  [847d2da0](https://github.com/angular/angular.js/commit/847d2da0f8d1e265eda7b4dd3e7eb52ac86d784e),
  [dbefd671](https://github.com/angular/angular.js/commit/dbefd671e41c3bda481850bb7e566349e275d759),
  [cab5e1d9](https://github.com/angular/angular.js/commit/cab5e1d9b363eac6fd31b15c5b86f30993e2f147),
  [f00b6cca](https://github.com/angular/angular.js/commit/f00b6cca024a9418f353651f29c984f934575bd9),
  [2e365168](https://github.com/angular/angular.js/commit/2e3651686c2bd84cf464ecc236c8ad77e61179df),
  [536de148](https://github.com/angular/angular.js/commit/536de148214290f0b4a0595fa16c00da5e527e79),
  [a1107e81](https://github.com/angular/angular.js/commit/a1107e81ebf2254caf75718de2e3ec773cce0c56),
  [5ef9ed87](https://github.com/angular/angular.js/commit/5ef9ed87d82b109715a87e9aa1b1d5b63f515d3a),
  [8c81a0f3](https://github.com/angular/angular.js/commit/8c81a0f3728b9308854ceb9bf392ec467b95d8eb),
  [bde931af](https://github.com/angular/angular.js/commit/bde931afd5cf2483df236e06992666a0a4182794),
  [6553fe68](https://github.com/angular/angular.js/commit/6553fe68d17d42ec25e0c592ceaa1077cc0ec4f6),
  [13b5fd1b](https://github.com/angular/angular.js/commit/13b5fd1b9d60f1a9187da8a89db9272284ccdac4),
  [17209d5b](https://github.com/angular/angular.js/commit/17209d5b4a579edf8425715b5cdf25bc5cd96711),
  [31c82560](https://github.com/angular/angular.js/commit/31c825607dd524241c811ca3e401b119c810e977),
  [ab6937e2](https://github.com/angular/angular.js/commit/ab6937e2518bfd77d9fe42e3d2e11fe4a7a16814),
  [fbfda241](https://github.com/angular/angular.js/commit/fbfda241f616bcfe8273f501dd49120a3cb35fab),
  [206371b7](https://github.com/angular/angular.js/commit/206371b7372c242db234ca8da12d1c7a8a322d54),
  [b6b92bd8](https://github.com/angular/angular.js/commit/b6b92bd866e1d6d066f1c9bf1937496cd3e28664),
  [79f2d843](https://github.com/angular/angular.js/commit/79f2d843a8458bfdc23fe9f179a1416fe21f7533),
  [64a9cd8f](https://github.com/angular/angular.js/commit/64a9cd8f4fac1c518869a1c955fe60bd6ef76439),
  [7f6e1326](https://github.com/angular/angular.js/commit/7f6e1326f3a7a6a2ba2dbd48dd6571ebe929a7c1),
  [1fd2b3d4](https://github.com/angular/angular.js/commit/1fd2b3d402f36e395a1fe9ea7e3f91a1b2833426),
  [d56d69cc](https://github.com/angular/angular.js/commit/d56d69cc8319f69135a17a9bb5ae394123b33c51),
  [01e726b2](https://github.com/angular/angular.js/commit/01e726b2fa3fb0d2584c9bb8df116ff3a9f05879),
  [16136216](https://github.com/angular/angular.js/commit/161362164532af3578c9e3e8b52cd80b15345add),
  [92a3d282](https://github.com/angular/angular.js/commit/92a3d2821856c75eb95f8ec6ccf26d6a9b37fdd9),
  [4c585019](https://github.com/angular/angular.js/commit/4c5850195699b1d982963f25399d24bf8b815f81),
  [c076fe08](https://github.com/angular/angular.js/commit/c076fe08cf47e8af4b5e8845aed917ebb7dbd593),
  [2473412b](https://github.com/angular/angular.js/commit/2473412ba55f7c47f2ca24311312ce95ee11949e),
  [1f2d5000](https://github.com/angular/angular.js/commit/1f2d50000e82630bfce6eb9cf0a8da752fd1e826),
  [5026315d](https://github.com/angular/angular.js/commit/5026315d6f4495d636d86ae2a022fb55cc0ca211),
  [f0a090dd](https://github.com/angular/angular.js/commit/f0a090ddf256d0c144e705c0cdf4216d824140f9),
  [6d9313a6](https://github.com/angular/angular.js/commit/6d9313a68d82654d389c0b2c3e4af148382f14be)) and more!



<a name="1.0.1"></a>
# 1.0.1 thorium-shielding (2012-06-25)


## Bug Fixes

- **$location:** don't throw exception while url rewriting if element was removed
  ([3da4194f](https://github.com/angular/angular.js/commit/3da4194f98fa0c1ad1e5ab159719e4b25799e6d4),
   [#1058](https://github.com/angular/angular.js/issues/1058))
- **$location:** prevent ie from getting into redirect loop
  ([ffb27013](https://github.com/angular/angular.js/commit/ffb270130a4aaf3ddc2eb9d6211b46e1da136184),
   [#1075](https://github.com/angular/angular.js/issues/1075),
   [#1079](https://github.com/angular/angular.js/issues/1079),
   [#1085](https://github.com/angular/angular.js/issues/1085))



<a name="1.0.0"></a>
# 1.0.0 temporal-domination (2012-06-13)


## Bug Fixes

- **$location:**
  - correctly parse link urls in hashbang mode with a prefix
   ([0f44964e](https://github.com/angular/angular.js/commit/0f44964e5e0f7e37d7fa3216bb10fd61fbf52ae2),
    [#1037](https://github.com/angular/angular.js/issues/1037))
  - fix link click interception in hash-bang mode
   ([6593a3e0](https://github.com/angular/angular.js/commit/6593a3e0823f3c08079f05010f9628fc4503cd43),
    [#1051](https://github.com/angular/angular.js/issues/1051))


<a name="1.0.0rc12"></a>
# 1.0.0rc12 regression-extermination (2012-06-12)

## Bug Fixes

- **$location:** correctly parse link urls in hashbang mode
  ([74fa65ec](https://github.com/angular/angular.js/commit/74fa65ecb7c4e2df966a179952b35700912e065f),
   [#1037](https://github.com/angular/angular.js/issues/1037))


## Cleanup

- **$defer:** remove deprecated `$defer` service
  ([9af7a919](https://github.com/angular/angular.js/commit/9af7a9198e2d30608ea6c40eedde03e44a6ef569))
- **docs:** simplify api urls
  ([f16150d5](https://github.com/angular/angular.js/commit/f16150d5f1b20b3d633b4402095ea89baa4be042))



<a name="1.0.0rc11"></a>
# 1.0.0rc11 promise-resolution (2012-06-10)

## Features

- **$route:**
  - allow defining route async dependencies as promises and defer route change until all promises
    are resolved
    ([885fb0dd](https://github.com/angular/angular.js/commit/885fb0dd0743859a8985c23e4d0c1855a2be711e))
  - rename template -> tempalteUrl and add support for inline templates
    ([0a6e464a](https://github.com/angular/angular.js/commit/0a6e464a93d9a1e76a624b356054ce9ca4015f55))
- **$compile:** simplify isolate scope bindings and introduce true two-way data-binding between
  parent scope and isolate scope
  ([c3a41ff9](https://github.com/angular/angular.js/commit/c3a41ff9fefe894663c4d4f40a83794521deb14f))
- **$injector:** provide API for retrieving function annotations
  ([4361efb0](https://github.com/angular/angular.js/commit/4361efb03b79e71bf0cea92b94ff377ed718bad4))
- **$location:** add $locatonChange[start|success] event - since events are cancelable, it's now
  possible to cancel route and location changes.
  ([92a2e180](https://github.com/angular/angular.js/commit/92a2e1807657c69e1372106b0727675a30f4cbd7))
- **$rootElement:** expose application root element as $rootElement service
  ([85632cb4](https://github.com/angular/angular.js/commit/85632cb44c95617d73c369f3a03fb476a4d5c8a2))


## Bug Fixes

- **$compile:** correctly merge class attr for replace directives (contributed by Max Martinsson,
   [fb99b539](https://github.com/angular/angular.js/commit/fb99b539b4d851773b43f1564f7032adb157c0db),
   [#1006](https://github.com/angular/angular.js/issues/1006))
- **$http:** add utf-8 to default Content-Type header (post/put)
  ([10f80d7d](https://github.com/angular/angular.js/commit/10f80d7d2918f98262090b425ecc294d9518aa7e))
- **$timeout:** allow calling $timeout.cancel() with undefined (contributed by Ali Mills,
   [1904596e](https://github.com/angular/angular.js/commit/1904596e0c2330299e92f092bd7a6ceca8e97c30))
- **jqLite:** don't eat event exceptions
  ([416a7830](https://github.com/angular/angular.js/commit/416a7830403a579cc57cf3a0198193790dcd0bc6))


## Breaking Changes

- **$beforeRouteChange and $afterRouteChange events were renamed to $routeChangeStart and
  $routeChangeSuccess**

  This was done to make the naming consistent with $location events and also get events to
  categorize and order nicely just by alphabetical sorting.

  ([7c242821](https://github.com/angular/angular.js/commit/7c2428218893f59c6a4499667488009ca67f3385))


- **`template` option in $route definition was renamed to `templateUrl`**

  The `template` options in $route definition now represents the actual template string. To provide
  the template url use `templateUrl` option instead. This was done to unify the directive and $route
  definitions.

  To migrate just rename `template` to `templateUrl`.
  ([0a6e464a](https://github.com/angular/angular.js/commit/0a6e464a93d9a1e76a624b356054ce9ca4015f55))


- **isolate scope bindings definition has changed**

  To migrate the code follow the example below:

  Before:

        scope: {
          myAttr: 'attribute',
          myBind: 'bind',
          myExpression: 'expression',
          myEval: 'evaluate',
          myAccessor: 'accessor'
        }

  After:

        scope: {
          myAttr: '@',
          myBind: '@',
          myExpression: '&',
          // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
          myAccessor: '=' // in directive's template change myAccessor() to myAccessor
        }


- **the inject option for the directive controller injection was removed**

  The removed `inject` wasn't generally useful for directives so there should be no code using it.
  ([c3a41ff9](https://github.com/angular/angular.js/commit/c3a41ff9fefe894663c4d4f40a83794521deb14f))



<a name="1.0.0rc10"></a>
# 1.0.0rc10 tesseract-giftwrapping (2012-05-23)

## Features

- **$timeout:** add `$timeout` service that supersedes `$defer`
  ([4511d39c](https://github.com/angular/angular.js/commit/4511d39cc748288df70bdc258f98a8f36652e683),
   [#704](https://github.com/angular/angular.js/issues/704),
   [#532](https://github.com/angular/angular.js/issues/532))
- **scope:** add `event.preventDefault()` and `event.defaultPrevented`
  ([84542d24](https://github.com/angular/angular.js/commit/84542d2431d20de42d6ec27c9d3435dd72dbe2ee))


## Bug Fixes

- **ngRepeat:** expose `$first`, `$middle` and `$last` instead of `$position`
  ([1d388676](https://github.com/angular/angular.js/commit/1d388676e3b97b6171fc498e82545bd437ee6fd1),
   [#912](https://github.com/angular/angular.js/issues/912))
- **jqLite:** use the same expando store structure as jQuery
  ([acf095d1](https://github.com/angular/angular.js/commit/acf095d1783e30e750d046ef24e81b5a0a31fbd4))
- **$rootScope:** infinite digest exception does not clear $$phase
  ([5989a1ed](https://github.com/angular/angular.js/commit/5989a1eda2b9e289b467ef9741fb1476549c8fd9),
   [#979](https://github.com/angular/angular.js/issues/979))


## Breaking Changes

- **ngRepeat - `$position` is not exposed in repeater scopes any more**

  To update, search for `/\$position/` and replace it with one of `$first`, `$middle` or `$last`.
  ([1d388676](https://github.com/angular/angular.js/commit/1d388676e3b97b6171fc498e82545bd437ee6fd1))

- **scope event's `cancel` method was renamed to `stopPropagation`**

  The name was corrected in order to align better with DOM terminology.
  To update, search for `/\.\s*cancel\s*(/` and replace it with `.stopPropagation(` or
  `.preventDefault(` (or both) depending on what you actually need.
  ([91db9920](https://github.com/angular/angular.js/commit/91db99208e197a73584a88a8d835eeb55c466335))


## Deprecation Warnings

- **`$defer` service has been deprecated in favor of `$timeout` service**

  The `$defer` service will be removed before 1.0 final, so please migrate your code.
  ([4511d39c](https://github.com/angular/angular.js/commit/4511d39cc748288df70bdc258f98a8f36652e683))




<a name="1.0.0rc9"></a>
# 1.0.0rc9 eggplant-teleportation (2012-05-14)


## Bug Fixes

- **$location:**
  - single quote in url causes infinite digest in FF
    ([679cb8a7](https://github.com/angular/angular.js/commit/679cb8a74a684454fe38fa9e1ddad396bb598c52),
     [#920](https://github.com/angular/angular.js/issues/920))
  - support urls with any protocol
    ([c1533ef5](https://github.com/angular/angular.js/commit/c1533ef5762199bea18d3bf3bcba7fcf89272931))
  - don't use buggy history.pushState api on Android < 4
    ([7b739c97](https://github.com/angular/angular.js/commit/7b739c97028be2a5d5aef679ef1f8064cd10d386),
     [#904](https://github.com/angular/angular.js/issues/904))
  - work around Opera's base href issue
    ([b99f65f6](https://github.com/angular/angular.js/commit/b99f65f64d1e54315b3210d78a9a9adbcf34c96c),
     [#938](https://github.com/angular/angular.js/issues/938))
- **docs app:** get docs app to work on IE8
  ([aa025348](https://github.com/angular/angular.js/commit/aa02534865c8e43dcef9e218b12c8c717c837205))



<a name="1.0.0rc8"></a>
# 1.0.0rc8 blooming-touch (2012-05-06)

## Features

- **jqLite:** support data() getter and data(obj) setter
  ([ee579a07](https://github.com/angular/angular.js/commit/ee579a071a91cbade729d3cb97e097568e71f8fc))


## Bug Fixes

- **$compile:**
  - have $observe return registration function
    ([7f0eb151](https://github.com/angular/angular.js/commit/7f0eb1516165fcb73f1c9953018b7c9b70acfae1))
  - ignore ws when checking if template has single root
    ([9c0418cf](https://github.com/angular/angular.js/commit/9c0418cf1abd609bf0ffbe71fbdfa75905cf8e0f),
     [#910](https://github.com/angular/angular.js/issues/910))
  - fix replaceWith
    ([b431ee38](https://github.com/angular/angular.js/commit/b431ee38509724ba9098a7be7a8d6c5dcded4fe9))
  - attach scope to the directive element when templateUrl and replace=true
    ([705f4bbf](https://github.com/angular/angular.js/commit/705f4bbf115d2408e33b25f56edbf1f383aabb82))
  - prevent duplicate directive controller instantiation
    ([843f762c](https://github.com/angular/angular.js/commit/843f762c573e38a044f920c5575c6feb46bc7226),
     [#876](https://github.com/angular/angular.js/issues/876))
- **$parse:** support methods on falsy primitive types
  ([499a76a0](https://github.com/angular/angular.js/commit/499a76a08cc7a7604dab5e1dd9cca675b8e29333))
- **ngModel:** use keydown/change events on IE9 instead of input
  ([49dfdf8f](https://github.com/angular/angular.js/commit/49dfdf8f0238ef8c473fcb44694f6b5696ecde70),
   [#879](https://github.com/angular/angular.js/issues/879))
- **ngSrc,ngHref:** binding should set element prop as well as attr
  ([b24cc63b](https://github.com/angular/angular.js/commit/b24cc63bcbd45741d21757653f05d54db09e0f20),
   [#935](https://github.com/angular/angular.js/issues/935))
- **scenario:** make browser().location() working if ng-app on other than <html>
  ([5bcb749a](https://github.com/angular/angular.js/commit/5bcb749abb91dba0847cb9bc900777a67fd55aa8))
- **select:** don't interfere with selection if not databound
  ([3bd3cc57](https://github.com/angular/angular.js/commit/3bd3cc571dcd721f9d71f971aefee23115a5e458),
   [#926](https://github.com/angular/angular.js/issues/926))


## Docs

- Brand new bootstrap-based skin for api docs: <http://docs.angularjs.org/>


<a name="1.0.0rc7"></a>
# 1.0.0rc7 rc-generation (2012-04-30)

## Features

- **$parse:** CSP compatibility
  ([2b87c814](https://github.com/angular/angular.js/commit/2b87c814ab70eaaff6359ce1a118f348c8bd2197),
   [#893](https://github.com/angular/angular.js/issues/893))


## Bug Fixes

- **jqlite:**
  - correctly reset event properties in IE8
  ([a18926f9](https://github.com/angular/angular.js/commit/a18926f986166048a21097636f03ab29f107b154))
  - mouseenter on FF no longer throws exceptions
  ([43d15f83](https://github.com/angular/angular.js/commit/43d15f830f9d419c41c41f0682e47e86839e3917))


## Docs

- Tutorial has been finally updated to AngularJS v1.0! Check it out and provide feedback to make it
  even better: <http://docs.angularjs.org/tutorial>
- <http://docs-next.angularjs.org> now redirects to <http://docs.angularjs.org>



<a name="v1.0.0rc6"></a>
# v1.0.0rc6 runny-nose (2012-04-20)


## Bug Fixes

- **select:** properly handle empty & unknown options without ngOptions
  ([904b69c7](https://github.com/angular/angular.js/commit/904b69c745ea4afc1d6ecd2a5f3138c6f947b157))
- **compiler:** reading comment throws error in ie
  ([46bb08a9](https://github.com/angular/angular.js/commit/46bb08a9d0780fafef6dc5c1140c71912462887a))
- **document:** accidental clobbering of document.getAttribute
  ([eafe15f5](https://github.com/angular/angular.js/commit/eafe15f54c686d5c83f777fd319f4c568e209432),
   [#877](https://github.com/angular/angular.js/issues/877))
- **script:** Incorrectly reading script text on ie
  ([94dd6857](https://github.com/angular/angular.js/commit/94dd68570952f6f31abfa351b1159afcd3588a57))


## Features

- **$resource:** support HTTP PATCH method
  ([e61fd1b4](https://github.com/angular/angular.js/commit/e61fd1b43a55496c11c63da7ca2fc05b88d44043),
   [#887](https://github.com/angular/angular.js/issues/887))
- **jquery:** jquery 1.7.2 support
  ([8ebe5ccd](https://github.com/angular/angular.js/commit/8ebe5ccd9ace7807bedc7317d605370fe82b773d))



<a name="1.0.0rc5"></a>
# 1.0.0rc5 reality-distortion (2012-04-12)


## Bug Fixes

- **$location:** properly rewrite urls in html5 mode with base url set + don't rewrite links to
  different base paths
  ([6d7e7fde](https://github.com/angular/angular.js/commit/6d7e7fdea6c3d6551ff40c150aa42e1375d2cb5f),
   [0a5050eb](https://github.com/angular/angular.js/commit/0a5050eb3c1f1ed84134f23a44b97a7261114060))
- **e2eRunner:** $browser.location should delegate to apps $location
  ([df72852f](https://github.com/angular/angular.js/commit/df72852f3496d7640bb4f70837338e464b7ed69f))
- **input.radio:** support 2-way binding in a repeater
  ([93d62860](https://github.com/angular/angular.js/commit/93d62860e988a09fb64e594f50f6cd55a1fc5748),
   [#869](https://github.com/angular/angular.js/issues/869))
- **ngBindHtml:** clear contents when model is falsy
  ([10daefc6](https://github.com/angular/angular.js/commit/10daefc6f466a21d9418437666461c80cf24fcfe),
   [#864](https://github.com/angular/angular.js/issues/864))
- lots of doc fixes


## Features

- **$http:** expose the defaults config as $http.defaults
  ([dceafd32](https://github.com/angular/angular.js/commit/dceafd32ee140c8af5c7a0ca6cb808395fffeed3))
- **docs:** steps 0-4 of the Tutorial have been updated and improved


## Breaking Changes

- `ng-ext-link` directive was removed because it's unnecessary
  ([6d7e7fde](https://github.com/angular/angular.js/commit/6d7e7fdea6c3d6551ff40c150aa42e1375d2cb5f))

    apps that relied on ng-ext-link should simply replace it with `target="_self"`

- `$browser.addCss` was removed - it was never meant to be a public api
  ([13d5528a](https://github.com/angular/angular.js/commit/13d5528a5f5a2f0feee5c742788a914d2371841e))

    apps the depend on this functionality should write a simple utility function specific to the app
    (see this diff for hints).

- `$browser.addJs` method was removed - it was never meant to be a public api
  ([fbaa1968](https://github.com/angular/angular.js/commit/fbaa1968b7c596ccb63ea8b4be1d3bd92eda50d8))

    apps that depended on this functionality should either use many of the existing script loaders or
    create a simple helper method specific to the app.

- `$sanitize` service, `ngBindHtml` directive and `linky` filter were moved to the `ngSanitize` module
  ([5bcd7198](https://github.com/angular/angular.js/commit/5bcd7198664dca2bf85ddf8b3a89f417cd4e4796))

    apps that depend on any of these will need to load `angular-sanitize.js` and include `ngSanitize`
    in their dependency list: `var myApp = angular.module('myApp', ['ngSanitize']);`






<a name="1.0.0rc4"></a>
# 1.0.0rc4 insomnia-induction (2012-04-05)


## Bug Fixes

- **$compile:** relax the restriction that directives can not add siblings
  ([7e86eacf](https://github.com/angular/angular.js/commit/7e86eacf301934335c22908ec6dbd1a083d88fab))
- **$location:** search setter should not double-encode the value
  ([59fa40ec](https://github.com/angular/angular.js/commit/59fa40ec0e851759d35fb0ea5fd01019d1403049),
   [#751](https://github.com/angular/angular.js/issues/751))
- **$q:** $q.reject should forward callbacks if missing
  ([c0b78478](https://github.com/angular/angular.js/commit/c0b78478a0e64942a69aba7c1bfa4eb01c0e9a5e),
   [#845](https://github.com/angular/angular.js/issues/845))
- **build:** move `'use strict';` flag into the angular closure
  ([637817e3](https://github.com/angular/angular.js/commit/637817e3ba48d149e7a9628533d21e81c650d988))
- **Directives**:
  - **ngModel:** update model on each key stroke (revert ngModelInstant)
    ([06d09550](https://github.com/angular/angular.js/commit/06d0955074f79de553cc34fbf945045dc458e064))
  - **booleanAttrs:** always convert the model to boolean before setting the element property
    ([dcb8e076](https://github.com/angular/angular.js/commit/dcb8e0767fbf0a7a55f3b0045fd01b2532ea5441))
  - **form:** preperly clean up when invalid widget is removed
    ([21b77ad5](https://github.com/angular/angular.js/commit/21b77ad5c231ab0e05eb89f22005f7ed8d40a6c1))
  - **ngHref:** copy even if no binding
    ([2f5dba48](https://github.com/angular/angular.js/commit/2f5dba488e855bcdbb9304aa809efcb9de7b43e9))
  - **ngInclude:** fire $includeContentLoaded on proper (child) scope
    ([199ac269](https://github.com/angular/angular.js/commit/199ac269869a57bb63d60c9b3f510d546bf0c9b2))


## Features

- **$http:** add `withCredentials` config option
  ([86182a94](https://github.com/angular/angular.js/commit/86182a9415b9209662b16c25c180b958ba7e6cf9))
- **$route:** allow chaining of whens and otherwise
  ([15ecc6f3](https://github.com/angular/angular.js/commit/15ecc6f3668885ebc5c7130dd34e00059ddf79ae))
- **ngInclude:** allow ngInclude as css class
  ([428f2b56](https://github.com/angular/angular.js/commit/428f2b563663315df4f235ca19cef4bdcf82e2ab))


## Docs
- reintroduced the tutorial docs - currently only steps 0-3 are up to date and the code is not split
  up into step specific commits yet. See
  [this branch](https://github.com/angular/angular-phonecat/tree/v1.0-update) instead.
- various other doc fixes


## Breaking Changes

We removed two useless features:

- $routeProvider.when used to return the route definition object but now it returns self
  ([15ecc6f3](https://github.com/angular/angular.js/commit/15ecc6f3668885ebc5c7130dd34e00059ddf79ae))
- ngInclude does not have scope attribute anymore
  ([5f70d615](https://github.com/angular/angular.js/commit/5f70d615a5f7e102424c6adc15d7a6f697870b6e))
- ngModelInstant directive is no more and ngModel behaves just as ngModelInstant used to. This
  doesn't really break anything, just remember to remove all ngModelInstant references from your
  template as they serve no purpose now.
  ([06d09550](https://github.com/angular/angular.js/commit/06d0955074f79de553cc34fbf945045dc458e064))



<a name="1.0.0rc3"></a>
# 1.0.0rc3 barefoot-telepathy (2012-03-29)


## Bug Fixes

- **$compile:**
  - properly clone attr.$observers in ng-repeat
    ([f2106692](https://github.com/angular/angular.js/commit/f2106692b1ebf00aa5f8b2accd75f014b6cd4faa))
  - create new (isolate) scopes for directives on root elements
    ([5390fb37](https://github.com/angular/angular.js/commit/5390fb37d2c01937922613fc57df4986af521787),
      [#817](https://github.com/angular/angular.js/issues/817))
- **angular.forEach:** should ignore prototypically inherited properties
  ([8d7e6948](https://github.com/angular/angular.js/commit/8d7e6948496ff26ef1da8854ba02fcb8eebfed61),
   [#813](https://github.com/angular/angular.js/issues/813))
- **initialization:** use jQuery#ready for initialization if available
  ([cb2ad9ab](https://github.com/angular/angular.js/commit/cb2ad9abf24e6f855cc749efe3155bd7987ece9d),
   [#818](https://github.com/angular/angular.js/issues/818))
- **$q:** resolve all of nothing to nothing
  ([ac75079e](https://github.com/angular/angular.js/commit/ac75079e2113949d5d64adbcf23d56f3cf295d41))


## Features

- **$compile:** do not interpolate boolean attribute directives, rather evaluate them
  ([a08cbc02](https://github.com/angular/angular.js/commit/a08cbc02e78e789a66e9af771c410e8ad1646e25))
- **$controller:** support controller registration via $controllerProvider
  ([d54dfecb](https://github.com/angular/angular.js/commit/d54dfecb00fba41455536c5ddd55310592fdaf84))
- **$http:**
  - make the `transformRequest` and `transformResponse` default to an array
    ([a8a750ab](https://github.com/angular/angular.js/commit/a8a750ab05bdff73ba3af0b98f3f284ff8d1e743))
  - added `params` parameter
    ([73c85930](https://github.com/angular/angular.js/commit/73c8593077155a9f2e8ef42efd4c497eba0bef4f))
- **TzDate:** add support for toISOString method
  ([da9f4dfc](https://github.com/angular/angular.js/commit/da9f4dfcf4f3d0c21821d8474ac0bb19a3c51415))
- **jqLite:** make injector() and scope() work with the document object
  ([5fdab52d](https://github.com/angular/angular.js/commit/5fdab52dd7c269f99839f4fa6b5854d9548269fa))
- **ngValue:** directive that allows radio inputs to have non string values
  ([09e175f0](https://github.com/angular/angular.js/commit/09e175f02cca0f4a295fd0c9b980cd8f432e722b),
   [#816](https://github.com/angular/angular.js/issues/816))


## Breaking Changes

- `$resource`, `$cookies` and `$cookieStore` services are now distributed as separate modules, see
  `angular-resource.js` and `angular-cookies.js`.
  ([798bca62](https://github.com/angular/angular.js/commit/798bca62c6f64775b85deda3713e7b6bcc7a4b4d),
   [7b22d59b](https://github.com/angular/angular.js/commit/7b22d59b4a16d5c50c2eee054178ba17f8038880))
- angular.fromJson doesn't deserialize date strings into date objects.
  ([ac4318a2](https://github.com/angular/angular.js/commit/ac4318a2fa5c6d306dbc19466246292a81767fca))
- angular.toJson always use native JSON.parse and JSON.stringify - this might break code that
  consumes the output in whitespace-sensitive way
  ([35125d25](https://github.com/angular/angular.js/commit/35125d25137ac2da13ed1ca3e652ec8f2c945053))
- IE7 and older have are now required to polyfill the JSON global object
  ([87f5c6e5](https://github.com/angular/angular.js/commit/87f5c6e5b716100e203ec59c5874c3e927f83fa0))
- boolean attr directives (ng-disabled, ng-required, etc) are evaluated rather than interpolated
  ([a08cbc02](https://github.com/angular/angular.js/commit/a08cbc02e78e789a66e9af771c410e8ad1646e25))
- `ng-bind-attr` directive removed
  ([55027132](https://github.com/angular/angular.js/commit/55027132f3d57e5dcf94683e6e6bd7b0aae0087d))
- any app that depends on $sniffer service should use Modernizr instead
  ([aaedefb9](https://github.com/angular/angular.js/commit/aaedefb92e6bec6626e173e5155072c91471596a))



<a name="1.0.0rc2"></a>
# 1.0.0rc2 silence-absorption (2012-03-20)

## Features

- **$route:** when matching consider trailing slash as optional
  ([a4fe51da](https://github.com/angular/angular.js/commit/a4fe51da3ba0dc297ecd389e230d6664f250c9a6))
- **jqLite:** add .controller() method
  ([6c5a05ad](https://github.com/angular/angular.js/commit/6c5a05ad49a1e083570c3dfe331403398f899dbe))
- **scope.$eval:** allow passing locals to the expression
  ([192ff61f](https://github.com/angular/angular.js/commit/192ff61f5d61899e667c6dbce4d3e6e399429d8b))
- **input[type=radio]:** allow the value attribute to be interpolated
  ([ade6c452](https://github.com/angular/angular.js/commit/ade6c452753145c84884d17027a7865bf4b34b0c))


## Bug Fixes

- **$http:** don't send Content-Type header when no data
  ([1a5bebd9](https://github.com/angular/angular.js/commit/1a5bebd927ecd22f9c34617642fdf58fe3f62efb),
   [#749](https://github.com/angular/angular.js/issues/749))
- **$resource:** support escaping of ':' in resource url
  ([6d6f8753](https://github.com/angular/angular.js/commit/6d6f875345e01f2c6c63ef95164f6f39e923da15))
- **$compile:**
  - don't touch static element attributes
    ([9cb2195e](https://github.com/angular/angular.js/commit/9cb2195e61a78e99020ec19d687a221ca88b5900))
  - merge interpolated css class when replacing an element
    ([f49eaf8b](https://github.com/angular/angular.js/commit/f49eaf8bf2df5f4e0e82d6c89e849a4f82c8d414))
  - allow transclusion of root elements
    ([9918b748](https://github.com/angular/angular.js/commit/9918b748be01266eb10db39d51b4d3098d54ab66))
- **$log:** avoid console.log.apply calls in IE
  ([15213ec2](https://github.com/angular/angular.js/commit/15213ec212769837cb2b7e781ffc5bfd598d27ca),
    [#805](https://github.com/angular/angular.js/issues/805))
- **json:** added support for iso8061 timezone
  ([5ac14f63](https://github.com/angular/angular.js/commit/5ac14f633a69f49973b5512780c6ec7752405967))
- **e2e runner:** fix typo that caused errors on IE8
  ([ee5a5352](https://github.com/angular/angular.js/commit/ee5a5352fd4b94cedee6ef20d4bf2d43ce77e00b),
   [#806](https://github.com/angular/angular.js/issues/806))
- **directives:**
  - **select:** multiselect failes to update view on selection insert
    ([6ecac8e7](https://github.com/angular/angular.js/commit/6ecac8e71a84792a434d21db2c245b3648c55f18))
  - **ngForm:** alias name||ngForm
    ([823adb23](https://github.com/angular/angular.js/commit/823adb231995e917bc060bfa49453e2a96bac2b6))
  - **ngView:** publish the controller
    ([21e74c2d](https://github.com/angular/angular.js/commit/21e74c2d2e8e985b23711785287feb59965cbd90))
  - **ngRepeat:** correct variable reference in error message
    ([935c1018](https://github.com/angular/angular.js/commit/935c1018da05dbf3124b2dd33619c4a3c82d7a2a))
  - various doc fixes (some contributed by Daniel Zen)



<a name="1.0.0rc1"></a>
# 1.0.0rc1 moiré-vision (2012-03-13)

## $compile rewrite

The compiler was completely rewritten from scratch using ideas from this
[design document](https://docs.google.com/document/d/1PNh4lxlYpSRK2RhEwD4paJLMwdcnddcYJn3rsDsdayc/edit).
Please check out the [$compile] and
[$compileProvider.directive](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive)
docs. The biggest improvements and changes are listed below.

- the compiler now transparently supports several directive syntaxes. For example while before there
  was just one way to use `ng:include` directive: `<ng:include src="someSrc"></ng:include>`. The new
  compiler treats all of the following as equivalent:

  - `<ng:include src="someSrc"></ng:include>`
  - `<ng-include src="someSrc"></ng-include>`
  - `<x-ng-include src="someSrc"></x-ng-include>`
  - `<div ng:include src="someSrc"></div>`
  - `<div ng-include src="someSrc"></div>`
  - `<div data-ng-include src="someSrc"></div>`
  - `<div ng:include="someSrc"></div>`
  - `<div ng-include="someSrc"></div>`
  - `<div data-ng-include="someSrc"></div>`
  - `<div class="ng-include: someSrc"></div>`

  This will give template creators great flexibility to consider the tradeoffs between html code
  validity and code conciseness and pick the syntax that works the best for them.

- we are switching all of our code/docs/examples to use `ng-foo` directive name style instead of
  `ng:foo`. The new compiler doesn't distinguish between these and other name styles (all of them
  are [equally supported](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive)),
  the main difference is that `ng-foo` is easier to select with css selectors. Check out the
  [Internet Explorer Compatibility](http://docs-next.angularjs.org/guide/ie)
  doc to learn about various IE-related requirements for different directive naming styles.

- `angular.directive`, `angular.widget`, `angular.attrWidget` were merged into a single concept: a
  `directive` which is registered via
  [myModule.directive](http://docs-next.angularjs.org/api/angular.Module#directive) or
  [$compileProvider.directive](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive).
  You can control execution priority of multiple directives on the same element (previously the main
  difference between a attribute widget and a directive) via a directive priority setting.

- previously the linking functions of directives were called top to bottom following the DOM tree,
  to enable a linking fn to work child DOM nodes that were already processed by child linking fns
  the order was changed as follows: compile functions run top to bottom following the DOM tree, but
  linking functions run bottom-up following the DOM tree. In some rare cases it is desirable for
  linking fns to be called top to bottom and for these it is possible to register "prelinking"
  functions (check out
  [the docs](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive)
  for the return value of the compile function).

- `angular.markup` and `angular.attrMarkup` were replaced with interpolation via `$interpolate`
  service.

  - In the past `{{foo}}` markup was getting translated to `<span ng-bind="foo"></span>` during the
    early stage of template compilation. Addition of this extra node was in some cases undesirable
    and caused problems. The new compiler with the help of the $interpolate service removes the need
    for these artificial nodes.

  - As a side-effect of not using artificial nodes available for all bindings, the `html` filter
    which used to innerHTML (sanitized) html into the artificial node was converted into a directive.
    So instead of `{{ someRawHtml | html }}` use `<div ng-bind-html="someRawHtml"></div>` and
    instead of `{{ someRawHtml | html:"unsafe" }}` use `<div ng-bind-html-unsafe="someRawHtml"></div>`.
    Please check out the
    [ng-bind-html](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngBindHtml)
    and
    [ng-bind-html-unsafe](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngBindHtmlUnsafe)
    directive docs.

  - Custom markup has been used by developers only to switch from `{{ }}` markup to `(( ))` or
    something similar in order to avoid conflicts with server-side templating libraries. We made it
    easier to do this kind of customization by making the start and end symbol of the interpolation
    configurable via [$interpolateProvider](http://docs-next.angularjs.org/api/angular.module.ng.$interpolateProvider).

- [template loader](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.script)
  loads template fragments from script elements and populates the $templateCache with them. Templates
  loaded in this way can be then used with `ng-include`, `ng-view` as well as directive templates
  (see the `templateUrl` property of the
  [directive config object](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive)).


## Forms / input controls / two-way data binding

The implementation of forms and input bindings was modified to address issues around composability,
ease of adding custom validation and formatting. Please check out the
[forms dev guide article](http://docs-next.angularjs.org/guide/dev_guide.forms) to learn about forms,
form control bindings and input validation. The biggest changes are listed below.

- any directive can add formatter/parser (validators, convertors) to an input type. This allows
  better composability of input types with custom validators and formatters. So instead of creating
  new custom input type for everything, it's now possible to take existing input type and add an
  additional formatter and/or validator to it via a custom directive.

- inputs propagates changes only on the blur event by default (use new `ng-model-instant` directive
  if you want to propagate changes on each keystroke).

- no more custom input types, use directives to customize existing types.

- removed $formFactory.

- removed parallel scope hierarchy (forms, widgets).

- removed `list` input type (use `ng-list` directive instead).

- removed integer input type.


## Controller-scope separation

Controllers are now standalone objects, created using the "new" operator, and not mixed with scope
object anymore. This addresses many issues including:
[#321](https://github.com/angular/angular.js/issues/321) and
[#425](https://github.com/angular/angular.js/issues/425).

The [design doc](https://docs.google.com/document/pub?id=1SsgVj17ec6tnZEX3ugsvg0rVVR11wTso5Md-RdEmC0k)
explains the reasoning for this major change and how it solves many issues.

### Before:

<pre>
function MyCtrl() {
  var self = this;

  this.model = 'some model of any type';

  this.fnUsedFromTemplate = function() {
    someApiThatTakesCallback(function callbackFn() {
      self.model = 'updatedModel';
    });
  };
}
</pre>

### After:

<pre>
function MyCtrl($scope) {
  $scope.model = 'some model of any type';

  $scope.fnUsedFromTemplate = function() {
    someApiThatTakesCallback(function() {
      $scope.model = 'updatedModel';
    });
  }
}
</pre>

Temporary backwards compatibility: Load the following module in your app to recreate the previous
behavior and migrate your controllers one at a time: <https://gist.github.com/1649788>


## $route service changes

- As advertised in the past we moved the $route configuration from the run phase of the application
  to the config phase. This means that instead of defining routes via `$route.when`/`$route.otherwise`
  you should use `$routeProvider.when`/`$routeProvider.otherwise` instead.

- route scope is now being created by the `ng-view` rather than by `$route`, this resolved many
  issues we've previously faced. For more info, read the
  [commit message](https://github.com/angular/angular.js/commit/60743fc52aea9eabee58258a31f4ba465013cb4e).

- removed `$route.parent()` - it's unnecessary because the scope is properly created in the scope
  hierarchy by `ng-view`.

- new `$viewContentLoaded` and `$includeContentLoaded` events which directives can use to be
  notified when a template content is (re)loaded.

- `ng-view` now has `onload` attribute which behaves similarly to the one on `ng-include`.


## Directives

- `ng-model` binding on select[multiple] element should support binding to an array
  ([commit](https://github.com/angular/angular.js/commit/85b2084f578652cc0dcba46c689683fc550554fe))
- event object is now accessible as `$event` in `ng-click` and other directives
  ([commit](https://github.com/angular/angular.js/commit/1752c8c44a7058e974ef208e583683eac8817789),
   issue [#259](https://github.com/angular/angular.js/issues/259)
- `ng-class` directive now support map of classnames and conditions
  e.g. `<div ng-class="{'hide': !visible, 'warning': isAlert()}"...` (contributed by Kai Groner)
  ([commit](https://github.com/angular/angular.js/commit/56bcc04c54ed24c19204f68de52b8c30c00e08f0))


## Scope changes

- `scope.$emit`/`$broadcast` return the event object, add cancelled property
  ([commit](https://github.com/angular/angular.js/commit/6e635012fb30905e5fe659a024864e275f1c14b5))

- `scope.$new()` takes one argument - a boolean indicating if the newly-created child scope should be
  isolated (not prototypically inheriting from the current scope). Previously the first argument was
  reference to the controller constructor, but because of the scope/controller separation the
  controllers should be instantiated via the `$controller` service.
  ([commit](https://github.com/angular/angular.js/commit/78656fe0dfc99c341ce02d71e7006e9c05b1fe3f))

- fn signature change for change listener functions registered via `scope.$watch` - this means that
  the scope object can be listed in the arguments list only if it's needed and skipped otherwise.
  ([commit](https://github.com/angular/angular.js/commit/0196411dbe179afe24f4faa6d6503ff3f69472da))

  - before: `scope.$watch('someModel', function(scope, newVal, oldVal) {})`
  - after: `scope.$watch('someModel', function(newVal, oldVal, scope) {})`

- `scope.$watch` now compares object by reference and only if extra boolean flag is passed
  comparison by equality is used. This was done to avoid unintended performance issues.
  ([commit](https://github.com/angular/angular.js/commit/d6e3e1baabc3acc930e4fda387b62cbd03e64577))

  - before: `scope.$watch('expression', function(scope, newVal, oldVal) {})`
  - after: `scope.$watch('expression', function(newVal, oldVal, scope) {}, true)`

- `scope.$destroy` doesn't cause the `$destroy` event to be emitted any more - this event was
   primarily used by the old forms implementation and is not needed any more. We are considering
   broadcasting this event in the future, which could then be used by directives and child scopes to
   be notified of their scope destruction.


## New directives:

- [ng-mouseleave](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngMouseleave)
- [ng-mousemove](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngMousemove)
- [ng-mouseover](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngMouseover)
- [ng-mouseup](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngMouseup)
- [ng-mousedown](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngMousedown)
- [ng-dblclick](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngDblclick)
- [ng-model-instant](http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive.ngModelInstant)


## $injector / modules

- `$injector.instantiate` should return the object returned from constructor if one was returned
  ([commit](https://github.com/angular/angular.js/commit/776739299b698a965ef818eeda75d4eddd10c491))
- `$injector.instantiate` should support array annotations for Type argument (e.g. instantiate(['dep1', 'dep2', Type]))
  ([commit](https://github.com/angular/angular.js/commit/eb92735c9ea3e5ddc747b66d8e895b6187a5f9e0))
- quickly fail if circular dependencies are detected during instantiation
  ([commit](https://github.com/angular/angular.js/commit/fbcb7fdd141c277d326dc3ed34545210c4d5628f))
- added [$provide.constant](http://docs-next.angularjs.org/api/angular.module.AUTO.$provide#constant)
  to enable registration of constants that are available in both the config and run phase
  ([commit](https://github.com/angular/angular.js/commit/80edcadb1dd418dcf5adf85704c6693940c8bb28))
- `$provide.service` was renamed to $provide.provider
  ([commit](https://github.com/angular/angular.js/commit/00d4427388eeec81d434f9ee96bb7ccc70190923))
- `$provide.service` takes a constructor fn and creates a service instance by using $injector.instantiate


## New services:

- [$sanitize](http://docs-next.angularjs.org/api/angular.module.ng.$sanitize)
- [$interpolate](http://docs-next.angularjs.org/api/angular.module.ng.$interpolate)


## jqLite (angular.element)

- added `contents()` ([commit](https://github.com/angular/angular.js/commit/97dae0d0a0226ee527771578bfad1342d51bf4dd))
- added `wrap()` ([commit](https://github.com/angular/angular.js/commit/4a051efb89cf33e30d56f1227d1f6084ead4cd42))
- fix memory leaking in IE8 (remove monkey patched methods on Event)
  ([commit](https://github.com/angular/angular.js/commit/3173d8603db4ae1c2373e13a7a490988126bb1e7),
   [commit](https://github.com/angular/angular.js/commit/230f29d0a78a04a6963514da8b1e34cc03e553d0))


## Docs

- new [Modules dev guide article](http://docs-next.angularjs.org/guide/module)


## Small bug fixes

- fix incorrect comparison of dates by angular.equals
  ([commit](https://github.com/angular/angular.js/commit/ffa84418862a9f768ce5b9b681916438f14a0d79))
- `scope.$watch` support watching functions
  ([commit](https://github.com/angular/angular.js/commit/7da2bdb82a72dffc8c72c1becf6f62aae52d32ce),
   [commit](https://github.com/angular/angular.js/commit/39b3297fc34b6b15bb3487f619ad1e93c4480741))
- `$http` should not json-serialize File objects, instead just send them raw
  ([commit](https://github.com/angular/angular.js/commit/5b0d0683584e304db30462f3448d9f090120c444))
- `$compile` should ignore content of style and script elements
  ([commit](https://github.com/angular/angular.js/commit/4c1c50fd9bfafaa89cdc66dfde818a3f8f4b0c6b),
   [commit](https://github.com/angular/angular.js/commit/d656d11489a0dbce0f549b20006052b215c4b500))
- `TzDate#getDay()` should take into account the timezone offset (contributed by Stephane Bisson)
  ([commit](https://github.com/angular/angular.js/commit/e86bafecd212789cde61050073a69c1e49ffd011))


## Small features

- `$parse` service now supports local vars in expressions
  ([commit](https://github.com/angular/angular.js/commit/761b2ed85ad9685c35f85513e17363abf17ce6b3))



<a name="0.10.6"></a>
# 0.10.6 bubblewrap-cape (2012-01-17) #

## Features:

- [Dependency injection subsystem][guide2.di] rewrite. This is a huge change to the Angular core
  that was necessary for many reasons. Please read the full
  [design doc](https://docs.google.com/document/d/1hJnIqWhSt7wCacmWBB01Bmc6faZ8XdXJAEeiJwjZmqs/edit?hl=en_US)
  to understand the changes and reasoning behind them.
- Added [angular.bootstrap] for manual bootstrapping of the app. Also see
  [Initializing Angular App][bootstrapping] doc.
- Helper functions [inject] and [module] that make testing with DI and jasmine a lot easier.
- [jqLite][jqLite2] and jQuery were extended with helper method `injector()` that simplifies the
  access to the application injector during debugging.
- Rewrite of $xhr service and its dependencies, which was replaced with [$http] service.
  The $browser.xhr and its mock were replaced by [$httpBackend] and its
  [unit testing][unit-testing $httpBackend] and [end-to-end testing][e2e-testing $httpBackend]
  mocks. The $resource service api and functionality was preserved, with the exception of caching,
  which is not happening automatically as it used it in the past (verifyCache has no effect).
- [$q] - Q-like deferred/promise implementation
  ([commit](https://github.com/angular/angular.js/commit/1cdfa3b9601c199ec0b45096b38e26350eca744f))
- Transparent data-binding to promises in templates. [Example](http://jsfiddle.net/IgorMinar/aNSWu/)
  ([commit](https://github.com/angular/angular.js/commit/78b6e8a446c0e38075c14b724f3cdf345c01fa06))
- New [$anchorScroll] service that watches url hash and navigates to the html anchor even if the
  content was loaded via [ng:view]  (for [ng:include] you have to opt into this behavior using
  autoscroll attribute)
- New LRU cache factory - [$cacheFactory] service
- jQuery 1.7 compatibility


## Bug Fixes:

- Directive names are now case insensitive
  ([commit](https://github.com/angular/angular.js/commit/1e00db8daa5c09e7f8f9134f5c94b9a18c7dc425))
- $location#url setter fix (Issue [#648](https://github.com/angular/angular.js/issues/648))
- [ng:include] - prevent race conditions by ignoring stale http callbacks
  ([commit](https://github.com/angular/angular.js/commit/1d14760c6d3eefb676f5670bc323b2a7cadcdbfa))
- [ng:repeat] - support repeating over array with null
  ([commit](https://github.com/angular/angular.js/commit/cd9a7b9608707c34bec2316ee8c789a617d22a7b))
- [angular.copy] - throw Error if source and destination are identical
  ([commit](https://github.com/angular/angular.js/commit/08029c7b72a857ffe52f302ed79ae12db9efcc08))
- Forms should not prevent POST submission if the action attribute is present
  ([commit](https://github.com/angular/angular.js/commit/c9f2b1eec5e8a9eaf10faae8a8accf0b771096e0))


## Breaking Changes:

- App bootstrapping works differently (see [angular.bootstrap] and [ng:app] and [bootstrapping])
- scope.$service is no more (because injector creates scope and not the other way around),
  if you really can't get services injected and need to fetch them manually then, get hold of
  [$injector] service and call $injector.get('serviceId')
- angular.service style service registration was replaced with module system, please see
  [angular.module] api and [DI documentation][guide2.di] for more info.
- the $xhr service was replaced with [$http] with promise based apis.
- [unit-testing $httpBackend]'s expect method (the replacement for $browser.xhr.expect) is stricter -
  the order of requests matters and a single request expectation can handle only a single request.
- compiler
  - compiler is a service, so use [$compile] instead of angular.compile to compile templates
  - $compile (nee angular.compile) returns the linking function which takes one mandatory argument -
    the scope. previously this argument was optional and if missing, the compiler would create a new
    root scope, this was a source of bugs and was removed
- filters
  - filters need to be registered either via [moduleName.filter][angular.Module] or
    [$filterProvider.filter][$filterProvider]
  - filters don't have access to the dom element
  - currency filter doesn't make negative values red
  - json filter doesn't print out stuff in monospace
- type augmentation via angular.Array, and angular.Object is gone. As a replacement use filters
  ([filter], [limitTo], [orderBy]), ES5 apis (e.g. Array#indexOf), or create custom filters (e.g.
  as a replacement for $count and $sum).
- [$browser.defer.flush] now throws an exception when queue is empty
  ([commit](https://github.com/angular/angular.js/commit/63cca9afbcf7a772086eb4582d2f409c39e0ed12))
- scope.$apply and scope.$digest throws an exception if called while $apply or $digest is already
  in progress (this is a programming error, you should never need to do this)
  ([commit](https://github.com/angular/angular.js/commit/0bf611087b2773fd36cf95c938d1cda8e65ffb2b))


<a name="0.10.5"></a>
# 0.10.5 steel-fist (11-11-08) #

## Features:

- [ng:autobind]: drop angular.js file name restrictions
  ([commit](https://github.com/angular/angular.js/commit/d7ba5bc83ba9a8937384ea677331c5156ed6772d))
- [Scope]: better logging of infinite digest error
  ([commit](https://github.com/angular/angular.js/commit/ef875ad0cf4349144cb4674e050dd160564f6dd9),
  issue [#621](https://github.com/angular/angular.js/issues/621))
- enable [widget] styling in IE8 and below using
  [html5shiv](http://code.google.com/p/html5shiv/)-like approach
  ([commit](https://github.com/angular/angular.js/commit/163c799effd5cfadc57990f4d4127651bae3fbdb),
  issue [#584](https://github.com/angular/angular.js/issues/584))
- [ng:style]: compatibility + perf improvements
  ([commit](https://github.com/angular/angular.js/commit/e2663f62b0fbb8b9ce2e706b821a135e0bc7e885))


## Bug Fixes:
- [ng:view]: ignore stale xhr callbacks - fixes issues caused by race-conditions which occurred when
  user navigated to a new route before the current route finished loading
  (issue [#619](https://github.com/angular/angular.js/issues/619))
- [ng:form] should always be a block level (css) element
  ([commit](https://github.com/angular/angular.js/commit/02dc81bae0011b7ae4190363be5fdd5db420aca9))
- Fixes for [e2e test runner]'s `$location` dsl
  ([commit](https://github.com/angular/angular.js/commit/dc8ffa51b7ebe5fb9bc1c89087c8b3c9e65d1006))
- [ng:repeat] when iterating over arrays ignore non-array properties + when iterating over objects
  sort keys alphabetically
  ([commit](https://github.com/angular/angular.js/commit/3945f884c5777e629b57c9ab0e93b9d02b9840d0))

## Docs:
- experimental [disqus.com](http://disqus.com/) integration for all docs-next.angularjs.org pages
  ([commit](https://github.com/angular/angular.js/commit/28ed5ba46595a371bd734b92a6e4bb40d1013741),
  contributed by Dan Doyon)
- [e2e test runner] docs were moved to the dev guide



<a name="0.10.4"></a>
# 0.10.4 human-torch (2011-10-22) #

## Features:

- New validation options for
  [input widgets](http://docs-next.angularjs.org/api/angular.widget.input): `ng:minlength` and
  `ng:maxlength`
  ([commit](https://github.com/angular/angular.js/commit/78f394fd17be581c84ecd526bb786ed1681d35cb))
  (contributed by Konstantin Stepanov)
- HTML sanitizer was updated to recognize all safe HTML5 elements
  (Issue [#89](https://github.com/angular/angular.js/issues/89))
- [ng:options]' blank option is now compiled and data-bound as any other template
  (Issue [#562](https://github.com/angular/angular.js/issues/562))
  (contributed by tehek)
- [$defer](http://docs-next.angularjs.org/api/angular.service.$defer) service now exposes `cancel`
  method for task cancellation
  ([commit](https://github.com/angular/angular.js/commit/ad90c3574f8365ee4a1a973d5e43c64fe9fcda2c))


## Bug Fixes:

- [ng:options] should select correct element when '?'-option (invalid value) was previously selected
  (Issue [#599](https://github.com/angular/angular.js/issues/599)) (contributed by Tehek)
- Fix data-binding of radio button's value property
  (Issue [#316](https://github.com/angular/angular.js/issues/316))
- Input with type `password` should no be turned into a readable text field
  ([commit](https://github.com/angular/angular.js/commit/e82e64d57b65d9f3c4f2e8831f30b615a069b7f6))
  (contributed by Konstantin Stepanov)
- [ng:repeat] should ignore object properties starting with `$`
  ([commit](https://github.com/angular/angular.js/commit/833eb3c84445110dc1dad238120573f08ed8d102))
- Correctly parse out inlined regexp from the input field's `ng:pattern` attribute.
  ([commit](https://github.com/angular/angular.js/commit/5d43439dbe764a4c7227f51b34a81b044f13901b))
- $location service in html5 mode should correctly rewrite links that contain nested elements
  ([commit](https://github.com/angular/angular.js/commit/9b85757102fbd44e88d0a3909fdf8b90f191b593))


## Breaking Changes:

- the [date] filter now uses 'mediumDate' format if none is specified. This was done to deal with
  browser inconsistencies (each browser used to use different format)
  (Issue [#605](https://github.com/angular/angular.js/issues/605),
   [commit](https://github.com/angular/angular.js/commit/c6c3949b14f4003ecab291243edfca61262f2c3d),
   [commit](https://github.com/angular/angular.js/commit/e175db37c6f52bba4080efeec22a7120a896099e))
- calling the linker function returned by [angular.compile][compile] doesn't automatically run
  `$digest` on the linked scope any more. This behavior was briefly introduced in 0.10.3 but was
  causing issues and inefficiencies in production apps so we reverted it. See:
  [commit](https://github.com/angular/angular.js/commit/f38010d3a2f457a53798212ef72418637dabe189)




<a name="0.10.3"></a>
# 0.10.3 shattering-heartbeat (2011-10-13) #

## Features:

- New forms, validation, support for HTML5 input widgets. Please check out:
  - [Forms overview](http://docs-next.angularjs.org/guide/dev_guide.forms)
  - [form widget](http://docs-next.angularjs.org/api/angular.widget.form)
  - [input widget](http://docs-next.angularjs.org/api/angular.widget.input)
  - [$formFactory service](http://docs-next.angularjs.org/api/angular.service.$formFactory)
  - [angular.inputType](http://docs-next.angularjs.org/api/angular.inputType)
  - [commit](https://github.com/angular/angular.js/commit/4f78fd692c0ec51241476e6be9a4df06cd62fdd6)

- [ng:repeat] now has element-model affinity, which makes it more friendly to third-party code that
  is not aware of angular's DOM manipulation. This is also the pre-requisite for supporting
  animations.
  ([commit](https://github.com/angular/angular.js/commit/75f11f1fc46c35a28c0905f7316ea6779145e2fb))


## Bug Fixes:

- The select widget with [ng:options] directive now correctly displays selected option (regression
  from 0.10.2).
- Fix for jqLite's removeClass, which under certain circumstances could clobber class names.
  ([commit](https://github.com/angular/angular.js/commit/b96e978178a6acbf048aa6db466ed845e1395445))
- Other small fixes and documentation improvements.


## Breaking Changes:

- Due to changes in how forms and validation works the following were replaced with new apis:
  - `angular.formatter` - use `angular.inputType` or form's `$createWidget`
  - `angular.validator` - use `angular.inputType` or form's `$createWidget`
  - changes to `<input>` and `<select>` elements
    - `ng:model` directive is now required for data-binding to kick in
    - the `name` attribute is now optional and is used only as an alias when accessing the input
      widget via the form object.
    - view can't affect the model without a user interaction, so the `value` attribute of the
      `<input>` element and `selected` attribute of the `<option>` element if specified in the
      template is ignored.
- Removed decoration of DOM elements when:
  - an exception occurs - when an exception happens, it will be passed to the $exceptionHandler
    service, which can decide what to do with it.
  - an input widget contains invalid input - in this case the forms validation apis can be used to
    display a customized error message.
- The $hover service was removed (it was needed only for the DOM decoration described above).




<a name="0.10.2"></a>
# 0.10.2 sneaky-seagull (2011-10-08) #

## Features:

- jQuery 1.6.4 support (Issue [#556](https://github.com/angular/angular.js/issues/556))
- [jqLite](http://docs-next.angularjs.org/api/angular.element) improvements:
  - Added support for `prop` method
    ([commit](https://github.com/angular/angular.js/commit/3800d177030d20c5c3d04e3601f892c46e723dc2))
  - Added support for `unbind` method
    ([commit](https://github.com/angular/angular.js/commit/6b7ddf414de82720bbf547b2fa661bf5fcec7bb6))


## Bug Fixes:

- Added support for short-circuiting of && and || operators in in angular expressions
  (Issue [#433](https://github.com/angular/angular.js/issues/433))
- Fix for [$limitTo] to properly handle excessive limits (contributed by tehek)
  (Issue [#571](https://github.com/angular/angular.js/issues/571))
- [jqLite]'s css() method now converts dash-separated css property names to camelCase in order to
  support dash-separated properties on Firefox
  (Issue [#569](https://github.com/angular/angular.js/issues/569))
- action defaults for [$resource]s now take precedence over resource defaults (contributed by
  Marcello Nuccio)
  ([commit](https://github.com/angular/angular.js/commit/bf5e5f7bc9ebc7dc6cf8fdf3c4923498b22a8654))
- Fixed escaping issues in [$route] matcher
  ([commit](https://github.com/angular/angular.js/commit/2bc39bb0b4f81b77597bb52f8572d231cf4f83e2))
- Fixed two issues in $browser.defer.cancel mock
  ([commit](https://github.com/angular/angular.js/commit/62ae7fccbc524ff498779564294ed6e1a7a3f51c),
   [commit](https://github.com/angular/angular.js/commit/8336f3f0ba89b529057027711ab4babd6c2cb649))
- Fix for ng:options, which under certain circumstances didn't select the right option element
  ([commit](https://github.com/angular/angular.js/commit/555f4152909e1c0bd5400737a62dc5d63ecd32d3))


## Docs:

- migrated the docs app to use [$location]'s HTML5 mode (hashbang urls no more)
  ([commit](https://github.com/angular/angular.js/commit/13f92de6246a0af8450fde84b209211a56397fda))


## Breaking Changes

- If Angular is being used with jQuery older than 1.6, some features might not work properly. Please
  upgrade to jQuery version 1.6.4.

## Breaking Changes
- ng:repeat no longer has ng:repeat-index property. This is because the elements now have
  affinity to the underlying collection, and moving items around in the collection would move
  ng:repeat-index property rendering it meaningless.


<a name="0.10.1"></a>
# 0.10.1 inexorable-juggernaut (2011-09-09) #

## Features

- complete rewrite of the $location service with HTML5 support, many API and semantic changes.
  Please see:
  - [$location service API docs](http://docs-next.angularjs.org/#!/api/angular.module.ng.$location)
  - [$location service dev guide article](http://docs-next.angularjs.org/#!/guide/dev_guide.services.$location)
  - [location.js source file](https://github.com/angular/angular.js/blob/master/src/service/location.js)
  - breaking changes section of this changelog


## Bug Fixes

- $xhr should not covert HTTP status 0 to 200
  ([commit](https://github.com/angular/angular.js/commit/b0eb831bce7d0ea066fd0758124793ed3db6d692))
- fixed several doc examples that were broken on IE
- ng:change should be called after the new val is set
  (Issue [#547](https://github.com/angular/angular.js/issues/547))
- currency filter should return an empty string for non-numbers


## Breaking Changes

- $location related changes - for complete list of api changes see:
  [Migrating from earlier AngularJS releases](http://docs-next.angularjs.org/#!/guide/dev_guide.services.$location)
  - $location api changes:
    - $location.href -> $location.absUrl()
    - $location.hash -> $location.url()
    - $location.hashPath -> $location.path()
    - $location.hashSearch -> $location.search()
    - $location.search -> no equivalent, use $window.location.search (this is so that we can work in
      hashBang and html5 mode at the same time, check out the docs)
    - $location.update() / $location.updateHash() -> use $location.url()
    - n/a -> $location.replace() - new api for replacing history record instead of creating a new one

  - $location semantic changes:
    - all url pieces are always in sync ($location.path(), $location.url(), $location.search(), ...) -
      this was previously true only if you used update* methods instead of direct assignment
      ($location.hashPath = 'foo')
    - we now use (window.history.pushState || onHashChange event || polling) for detecting url changes
      in the browser (we use the best one available).



<a name="0.10.0"></a>
# 0.10.0 chicken-hands (2011-09-02) #

## Features

- complete rewrite of the Scope implementation with several API and semantic changes. Please see:
  - [angular.scope API docs](http://docs-next.angularjs.org/#!/api/angular.scope)
  - [scopes dev guide article](http://docs-next.angularjs.org/#!/guide/scopes)
  - [scope.js source file](https://github.com/angular/angular.js/blob/master/src/Scope.js)
  - breaking changes section of this changelog
- added event system to scopes (see [$on], [$emit] and [$broadcast])
- added i18n and l10n support for date, currency and number filters see [i18n] docs for more info
- added localizable [ng:pluralize] widget
- added [ng:cloak] directive for hiding uncompiled templates


## Bug Fixes

- make [ng:class] friendly towards other code adding/removing classes
  ([commit](https://github.com/angular/angular.js/commit/2a8fe56997fddbad673748ce02abf649a709c4ca))
- several [jqLite] bugfixes and improvements
- [ng:href], [ng:src] and friends now work properly when no expression is present in the attribute
  value.
  (Issue [#534](https://github.com/angular/angular.js/issues/534))
- expose missing [lowercase], [uppercase] and [isDate] APIs.


## Docs

- many (but not all just yet) api docs were proof-read and improved


## Breaking Changes:

- many scope related changes:
  - $onEval is no more (use $watch with a fn as the only param if you really miss it)
  - $eval without params doesn't trigger model mutation observations (use $apply/$digest instead)
  - $digest propagates through the scope tree automatically (this is the desired behavior anyway)
  - $watch various API changes
    - scope is now the first argument passed into the $watch listener
    - `this` in the $watch listener is undefined instead of current scope
    - objects and arrays are watched and compared by equality and not just identity
    - the initial execution of the $watch listener now executes asynchronously with respect to the
      code registering it via $watch
    - exceptionHandler argument is no more
    - initRun argument is no more
  - angular.scope does not create child scopes by taking parent as the first argument - use $new
    instead
  - scope.$set and scope.$get were removed, use direct property assignment instead or $eval
- $route.onChange was removed and replaced with $beforeRouteChange, $afterRouteChange and
  $routeUpdate events that can be used together with the new $routeParams service
- `angular.equals()` now uses `===` instead of `==` when comparing primitives



<a name="0.9.19"></a>
# 0.9.19 canine-psychokinesis (2011-08-20) #

## Features
- added error handling support for JSONP requests (see error callback param of the [$xhr] service)
  ([commit](https://github.com/angular/angular.js/commit/05e2c3196c857402a9aa93837b565e0a2736af23))
- exposed http response headers in the [$xhr] and [$resource] callbacks
  ([commit](https://github.com/angular/angular.js/commit/4ec1d8ee86e3138fb91543ca0dca28463895c090)
  contributed by Karl Seamon)
- added `reloadOnSearch` [$route] param support to prevent unnecessary controller reloads and
  resulting flicker
  ([commit](https://github.com/angular/angular.js/commit/e004378d100ce767a1107180102790a9a360644e))


## Bug Fixes
- fixed memory leak found in [ng:options] directive
  ([commit](https://github.com/angular/angular.js/commit/6aa04b1db48853340d720e0a1a3e325ac523a06f))
- make ng:class-even/odd compatible with ng:class
  (Issue [#508](https://github.com/angular/angular.js/issues/508))
- fixed error handling for resources that didn't work in certain situations
  ([commit](https://github.com/angular/angular.js/commit/c37bfde9eb31556ee1eb146795b0c1f1504a4a26)
  contributed by Karl Seamon)


## Docs
- [jsFiddle](http://jsfiddle.net/) integration for all docs.angularjs.org examples (contributed by
  Dan Doyon).


## Breaking Changes
- removed [jqLite] show/hide support. See the
  [commit](https://github.com/angular/angular.js/commit/4c8eaa1eb05ba98d30ff83f4420d6fcd69045d99)
  message for details. Developers should use jquery or jqLite's `css('display', 'none')` and
  `css('display', 'block'/'inline'/..)` instead


<a name="0.9.18"></a>
# 0.9.18 jiggling-armfat (2011-07-29) #

### Features
- [ECMAScript 5 Strict Mode](https://developer.mozilla.org/en/JavaScript/Strict_mode) compliance
- [jqLite]
  - added `show()`, `hide()` and `eq()` methods to jqlite
    ([commit](https://github.com/angular/angular.js/commit/7a3fdda9650a06792d9278a8cef06d544d49300f))
- added $defer.cancel to support cancellation of tasks defered via the [$defer] service
- [date] filter
  - added support for `full`, `long`, `medium` and `short` date-time format flags
    ([commit](https://github.com/angular/angular.js/commit/3af1e7ca2ee8c2acd69e5bcbb3ffc1bf51239285))
  - added support for `z` flag, which stands for short string timezone identifier, e.g. PST
  - internal improvements to enable localization of date filter output
- [number] filter
  - internal improvements to enable localization of number filter output
- [currency] filter
  - support for custom currency symbols via an optional param
  - internal improvements to enable localization of number filter output
- added [angular.version] for exposing the version of the loaded angular.js file
- updated angular.js and angular.min.js file headers with angular version and shorter & updated
  license info
- [ng:options]
  - support binding to expression (Issue [#449](https://github.com/angular/angular.js/issues/449))
  - support iterating over objects (Issue [#448](https://github.com/angular/angular.js/issues/448))
  - support ng:change (Issue [#463](https://github.com/angular/angular.js/issues/463))
  - support option groups (`<optgroup>`)
    (Issue [#450](https://github.com/angular/angular.js/issues/450))
- [$xhr] and [$resource] support for per-request error callbacks (Issue
  [#408](https://github.com/angular/angular.js/issues/408)) (contributed by Karl Seamon)


### Bug Fixes
- make injector compatible with Rhino (HtmlUnit) (contributed by M√•rten Dolk)
  [commit](https://github.com/angular/angular.js/commit/77ba539f630c57b17d71dbf1e9c5667a7eb603b7)
- `ie-compat.js` fixes and improvements related to fetching this file on the fly on legacy browsers
- [jqLite]
  - fix `bind()` when binding to more events separated by space
    [commit](https://github.com/angular/angular.js/commit/9ee9ca13da3883d06733637f9048a83d94e6f1f8)
  - non-existing attributes should return undefined just like in jQuery
    [commit](https://github.com/angular/angular.js/commit/10da625ed93511dbf5d4e61ca4e42f6f2d478959)
  - set event.target for IE<8
    [commit](https://github.com/angular/angular.js/commit/ce80576e0b8ac9ed5a5b1f1a4dbc2446434a0002)
- improved implementation of [ng:show] and [ng:hide] directives by using jqLite/jQuery hide and
  show methods
- [ng:options]
  - fix incorrect re-growing of options on datasource change
    (Issue [#464](https://github.com/angular/angular.js/issues/464))


### Docs
- added full offline support for docs (click on the link in the footer of docs.angularjs.org)
- many content improvements and corrections across all docs (reference api, tutorial, dev guide)
- many small design improvements


### Other
- doubled our e2e test suite by running all angular e2e tests with jqLite in addition to jQuery


### Breaking changes
- [commit](https://github.com/angular/angular.js/commit/3af1e7ca2ee8c2acd69e5bcbb3ffc1bf51239285)
  removed support for the `MMMMM` (long month name), use `MMMM` instead. This was done to align
  Angular with
  [Unicode Technical Standard #35](http://unicode.org/reports/tr35/#Date_Format_Patterns) used by
  Closure, as well as, future DOM apis currently being proposed to w3c.
- `$xhr.error`'s `request` argument has no `callback` property anymore, use `success` instead



<a name="0.9.17"></a>
# <angular/> 0.9.17 vegetable-reanimation (2011-06-30) #

### New Features
- New [ng:options] directive to better bind a model to `<select>` and `<option>` elements.
- New [ng:disabled], [ng:selected], [ng:checked], [ng:multiple] and [ng:readonly] directives.
- Added support for string representation of month and day in [date] filter.
- Added support for `prepend()` to [jqLite].
- Added support for configurable HTTP header defaults for the [$xhr] service.


### Bug Fixes
- Number filter would return incorrect value when fractional part had leading zeros.
- Issue #338: Show error when template with with multiple DOM roots is being compiled.
- Issue #399: return unsorted array if no predicate.
- Fixed issues with incorrect value of $position in ng:repeat when collection size changes.
- Fixed JSONP support in [$xhr] which didn't work without jquery since v0.9.13.


### Documentation
- various small fixes and improvements


### Breaking changes
- $service now has $service.invoke for method injection ($service(self, fn) no longer works)
- injection name inference no longer supports method curry and linking functions. Both must be
  explicitly specified using $inject property.
- Dynamic iteration (ng:repeat) on `<option>` elements is no longer supported. Use ng:options
- Removal of index formatter (`ng:format="index"`) since its only use was with repeated `<options>`
  (see above).
- Calling [$orderBy] without a predicate now returns the original unsorted array, instead of
  ordering by natural order.



<a name="0.9.16"></a>
# <angular/> 0.9.16 weather-control (2011-06-07) #

### Features
- [JsTD Scenario Adapter] for running scenario tests with jstd (from command line and in multiple
  browsers)


### Documentation
- brand new template for <http://docs.angularjs.org/>
- brand new tutorial that describes how to build a typical angular app
  <http://docs.angularjs.org/#!/tutorial>
- lots of new content for the dev guide (still work in progress)
  <http://docs.angularjs.org/#!/guide>


### Bug Fixes
- ng:href produces unclickable links on IE7 [#352](https://github.com/angular/angular.js/issues/352)
- IE 8 in compatibility mode breaks routing [#353](https://github.com/angular/angular.js/issues/353)
- IE translates a 204 response code to 1223 [#357](https://github.com/angular/angular.js/issues/357)
- Fixed unit test in IE7 [#360](https://github.com/angular/angular.js/pull/360)
- Fixed unit tests on FF4, Opera [#364](https://github.com/angular/angular.js/pull/364)
- Fixed opera date.toISOString issue [#367](https://github.com/angular/angular.js/pull/367)


### Breaking changes
- html scenario runner requires ng:autotest script attribute to start tests automatically
  ([example](https://github.com/angular/angular.js/blob/master/example/personalLog/scenario/runner.html#L5))



<a name="0.9.15"></a>
# <angular/> 0.9.15 lethal-stutter (2011-04-11) #

### Features
- IE9 support


### Bug Fixes
- reverted [ng:view] sync cache fix due to regression in the order of initialization of parent
  and child controllers. (commits 9bd2c396 and 3d388498)
- [$resource] success callback is now executed whenever the http status code is `<200,300>`


### Docs
- fixed intentation code that caused some of the snippets on docs.angularjs.org to be mangled.
- many small improvements of the api docs.



<a name="0.9.14"></a>
# <angular/> 0.9.14 key-maker (2011-04-01) #

### Performance
- [ng:repeat] grows (adds children) significantly faster. (commit 15ec78f5)
- [$xhr.cache] optionally executes callbacks synchronously. (commit c06c5a36)
- [ng:view] and [ng:include] use sync [$xhr.cache]


### Bug Fixes
- Fixed [$resource] encoding of query params. (commits e1d122a4, 78a0f410)


### House cleaning
- code cleanup
- better minification (min is now 2.5% or almost 1kb smaller)
- minor documentation fixes
- JsTestDriver 1.3.2 upgrade with fixed coverage support



<a name="0.9.13"></a>
# <angular/> 0.9.13 curdling-stare (2011-03-13) #

### New Features
- Added XSRF protection for the [$xhr] service. (commit c578f8c3)
- Targeted auto-bootstrap – [ng:autobind] now takes an optional value which specifies an element id
  to be compiled instead of compiling the entire html document. (commit 9d5c5337)


### Bug Fixes
- Fixed IE7 regression which prevented angular from bootstrapping in this browser.
- Cookies which contain unescaped '=' are now visible via the [$cookies] service. (commit 26bad2bf)
- [$xhr] service now executes "success" callback for all 2xx responses, not just 200.
  (commit 5343deb3)
- Always remove the script tag after successful JSONP request. (commit 0084cb5c)
- Removal of all `document.write` statements to make angular compabile with async script loaders.
  (commit 3224862a)


### Breaking changes
- The `post` parameter of [$browser.xhr][$browser] is now non-optional. Since everyone should be
  using the [$xhr] service instead of $browser.xhr, this should not break anyone. If you do use
  $browser.xhr then just add null for the post value argument where post was not passed in.




<a name="0.9.12"></a>
# <angular/> 0.9.12 thought-implanter (2011-03-03) #

### API
- Added a delay parameter to the [$defer] service. (commit edbe9d8c)
- Added `scope()` method to [angular.element][element] (jQuery) instances to retrieve a [scope]
  associated with a given DOM element. (commit 0a5c00ab)
- Added inference of DI dependencies from function signature. This feature is experimental, check
  out [dependency injection][guide.di] docs. (commit 7d4aee31)


### New Features
- Angular now correctly recognizes and uses jQuery even if it was loaded after angular's script.
  More info at [angular.element][element]. (commit a004d487)
- All built-in angular services are now lazy-loaded. (commit a070ff5a)
- To make styling of custom html tags created via [widgets][widget] and [directives][directive]
  easier, all of these elements now contain a css class with name in form of
  `<namespace>-<directive/widget name>`, e.g. `<ng:include class="ng-include">`. (commit c7998f5f)
- [$xhr] service now automatically detects and strips google-style JSON security prefix from http
  responses. (commit cd139f57)


### Bug Fixes
- Rewrite of JQuery lite implementation for better supports operations on multiple nodes when
  matched by a selector and remove other bugs. (commit 00cc9eb3)
- Corrected an issue where properties inherited from \_\_proto\_\_ show up in ng:repeat.
  (commit 9e67da42)
- Fixed url encoding issue affecting [$resource] service. (commits e9ce2259 + 9e30baad)
- Removed `$eval()` call from the [$cookies] factory function, which was causing duplicate
  instances of singleton services to be created. (commit 65585a2d)


### Docs
- New docs [contribution guidelines][contribute].
- New [description of release artifacts][downloading].
- Lots of improvements and other new content.


### Breaking changes
- Removed the `$init()` method that used to be called after compilation of a template. This should
  affect only fraction of angular apps because the api was primarily being used by low level widgets
  tests.

  The old way of compiling the DOM element was angular.compile(element).$init(); The $init was there
  to allow the users to do any work to the scope before the view would be bound. This is a left over
  from not having proper MVC. The new recommended way to deal with initializing scope is to put it
  in the root constructor controller. To migrate simply remove the call to $init() and move any code
  you had before $init() to the root controller.

  (commit 23b255a8)
- Changed [angular.compile][compile] API from `angular.compile(element[, scope])` to
  `angular.compile(element)([scope], [cloneAttachFn])` (commits ef4bb28b + 945056b1)
- Removed ng:watch directives since it encourages logic in the UI. (commit 87cbf9f5)




<a name="0.9.11"></a>
# <angular/> 0.9.11 snow-maker  (2011-02-08) #

### Documentation
- completed migration of docs from the wiki site to
  [http://docs.angularjs.org/](http://docs.angularjs.org/)
- many, but by far not all, docs were updated, improved and cleaned up

### Features
- [$route] service now supports these features:
  - route not found handling via `#otherwise()`
  - redirection support via `#when('/foo', {redirectTo: '/bar'})` (including param interpolation)
  - setting the parent scope for scopes created by the service via `#parent()`
  - reloading the current route via `#reload()`

### API
- added `angular.element(...).scope()` method to retrieve scope for a given element.

### Bug Fixes
- <option> value attribute gets clobbered when the element contains new line character(s).
- <ng:view> widget now works when nested inside an <ng:include> widget
- other various small fixes

### Breaking changes
- mock [`$browser`](http://docs.angularjs.org/#!/api/angular.mock.service.$browser) now throws an
  exception if the `flush()` method is called when there are no requests to be flushed. If you
  experience `No xhr requests to be flushed!` errors in your tests, it's because you called
  `$browser.xhr.flush()` unexpectedly. To make the error go away, either make sure your code makes a
  request via the `$xhr` service or remove all unneeded `flush()` calls.


<a name="0.9.10"></a>
# <angular/> 0.9.10 flea-whisperer  (2011-01-26) #

### Features
- new [`ng:view`](http://docs.angularjs.org/#!/api/angular.widget.ng-view) widget to simplify integration
with the `$route` service
- the content of all standard HTML widgets is now being processed
  (e.g. `<button>{{foo}}</button>` works now) (commit 1d7b9d56)
- new [`$log`](http://docs.angularjs.org/#!/api/angular.mock.service.$log) and
  [`$exceptionHandler`](http://docs.angularjs.org/#!/api/angular.mock.service.$exceptionHandler) service
  mocks now part of `angular-mocks.js` (commit f5d08963)

### Bug Fixes
- `<select>` (one/multiple) could not chose from a list of objects (commit 347be5ae)
- null and other falsy values should not be rendered in the view (issue #242)

### Docs
- rewrite of several major portions of angular.service.*, angular.Array.*, angular.Object.* docs
- added support for [sitemap]((http://docs.angularjs.org/sitemap.xml) to make the docs indexable by
  search crawlers
- transition of Developer Guide docs from the wiki into docs.angularjs.org
- lots of improvements related to formatting of the content of docs.anguarjs.org


<a name="0.9.9"></a>
# <angular/> 0.9.9 time-shift (2011-01-13) #

### Security
- Added a just in case security check for JSON parsing. (commit 5f080193)
- Completed security review with the Google Security Team.

### Performance
- $location and $cookies services are now lazily initialized to avoid the polling overhead when
  not needed.
- $location service now listens for `onhashchange` events (if supported by browser) instead of
  constant polling. (commit 16086aa3)
- input widgets known listens on keydown events instead of keyup which improves perceived
  performance (commit 47c454a3)
- angular boots significantly sooner by listening for DOMContentLoaded event instead of
  window.load when supported by browser (commit c79aba92)
- new service $updateView which may be used in favor of $root.$eval() to run a complete eval on
  the entire document. This service bulks and throttles DOM updates to improve performance.
  (commit 47c454a3)

### Docs
- Major improvements to the doc parser (commit 4f22d686)
- Docs now offline enabled (all dependencies are bundled in the tarball) (commit 4f5d5029)
- Added support for navigating the docs app with keyboard shortcuts (tab and ctrl+alt+s)

### Bugfixes
- `angular.Object.equals` now properly handless comparing an object with a null (commit b0be87f6)
- Several issues were addressed in the `$location` service (commit 23875cb3)
- angular.filter.date now properly handles some corner-cases (issue #159 - fix contributed by Vojta)

### Breaking changes
- API for accessing registered services ‚Äî `scope.$inject` ‚Äî was renamed to
  [`scope.$service`](http://docs.angularjs.org/#!/api/angular.scope.$service). (commit b2631f61)

- Support for `eager-published` services was removed. This change was done to make explicit
  dependency declaration always required in order to allow making relatively expensive services
  lazily initialized (e.g. $cookie, $location), as well as remove 'magic' and reduce unnecessary
  scope namespace pollution. (commit 3ea5941f)

  Complete list of affected services:

  - $location
  - $route
  - $cookies
  - $window
  - $document
  - $exceptionHandler
  - $invalidWidgets

  To temporarily preserve the 'eager-published' status for these services, you may use `ng:init`
  (e.g. `ng:init="$location = $service('$location'), ...`) in the view or more correctly create
  a service like this:

      angular.service('published-svc-shim', function($location, $route, $cookies, $window,
          $document, $exceptionHandler, $invalidWidgets) {
        this.$location = $location;
        this.$route = $route;
        this.$cookies = $cookies;
        this.$window = $window;
        this.$document = $document;
        this.$exceptionHandler = $exceptionHandler;
        this.$invalidWidgets = $invalidWidgets;
      }, {$inject: ['$location', '$route', '$cookies', '$window', '$document', '$exceptionHandler',
                    '$invalidWidgets'],
          $eager: true});

- In the light of the `eager-published` change, to complete the cleanup we renamed `$creation`
  property of services to `$eager` with its value being a boolean.
  To transition, please rename all `$creation: 'eager'` declarations to `$eager: true`.
  (commit 1430c6d6)

- `angular.foreach` was renamed to `angular.forEach` to make the api consistent. (commit 0a6cf70d)

- The `toString` method of the `angular.service.$location` service was removed. (commit 23875cb3)


<a name="0.9.8"></a>
# <angular/> 0.9.8 astral-projection (2010-12-23) #

### Docs/Getting started
- angular-seed project to get you hacking on an angular apps quickly
  https://github.com/angular/angular-seed

### Performance
- Delegate JSON parsing to native parser (JSON.parse) if available

### Bug Fixes
- Ignore input widgets which have no name (issue #153)


<a name="0.9.7"></a>
# <angular/> 0.9.7 sonic-scream (2010-12-10) #

### Bug Fixes
- $defer service should always call $eval on the root scope after a callback runs (issue #189)
- fix for failed assignments of form obj[0].name=value (issue #169)
- significant parser improvements that resulted in lower memory usage
  (commit 23fc73081feb640164615930b36ef185c23a3526)

### Docs
- small docs improvements (mainly docs for the $resource service)

### Breaking changes
- Angular expressions in the view used to support regular expressions. This feature was rarely
  used and added unnecessary complexity. It not a good idea to have regexps in the view anyway,
  so we removed this support. If you had any regexp in your views, you will have to move them to
  your controllers. (commit e5e69d9b90850eb653883f52c76e28dd870ee067)


<a name="0.9.6"></a>
# <angular/> 0.9.6 night-vision (2010-12-06) #

### Security
- several improvements in the HTML sanitizer code to prevent code execution via `href`s and other
  attributes.
  Commits:
  - 41d5938883a3d06ffe8a88a51efd8d1896f7d747
  - 2bbced212e2ee93948c45360fee00b2e3f960392

### Docs
- set up http://docs.angularjs.org domain, the docs for the latest release will from now on be
  deployed here.
- docs app UI polishing with dual scrolling and other improvements

### Bug Fixes
- `select` widget now behaves correctly when its `option` items are created via `ng:repeat`
  (issue #170)
- fix for async xhr cache issue #152 by adding `$browser.defer` and `$defer` service

### Breaking Changes
- Fix for issue #152 might break some tests that were relying on the incorrect behavior. The
  breakage will usually affect code that tests resources, xhr or services/widgets build on top of
  these. All that is typically needed to resolve the issue is adding a call to
  `$browser.defer.flush()` in your test just before the point where you expect all cached
  resource/xhr requests to return any results. Please see 011fa39c2a0b5da843395b538fc4e52e5ade8287
  for more info.
- The HTML sanitizer is slightly more strict now. Please see info in the "Security" section above.


<a name="0.9.5"></a>
# <angular/> 0.9.5 turkey-blast (2010-11-25) #

### Docs
- 99% of the content from the angular wiki is now in the docs

### Api
- added `angular.Array.limitTo` to make it easy to select first or last few items of an array


<a name="0.9.4"></a>
# <angular/> 0.9.4 total-recall (2010-11-18) #

### Docs
- searchable docs
- UI improvements
- we now have ~85% of the wiki docs migrated to ng docs
- some but not all docs were updated along the way


### Api
- ng:include now supports `onload` attribute (commit cc749760)

### Misc
- Better error handling - compilation exception now contain stack trace (commit b2d63ac4)


<a name="0.9.3"></a>
# <angular/> 0.9.3 cold-resistance (2010-11-10) #

### Docs
- prettier docs app with syntax highlighting for examples, etc
- added documentation, examples and scenario tests for many more apis including:
  - all directives
  - all formatters
  - all validators
  - some widgets

### Api
- date filter now accepts strings that angular.String.toDate can convert to Date objects
- angular.String.toDate supports ISO8061 formatted strings with all time fractions being optional
- ng:repeat now exposes $position with values set to 'first', 'middle' or 'last'
- ng:switch now supports ng:switch-default as fallback switch option

### Breaking changes
- we now support ISO 8601 extended format datetime strings (YYYY-MM-DDTHH:mm:ss.SSSZ) as defined
  in EcmaScript 5 throughout angular. This means that the following apis switched from
  YYYY-MM-DDTHH:mm:ssZ to YYYY-MM-DDTHH:mm:ss.SSSZ (note the added millis) when representing dates:
  - angular.Date.toString
  - angular.String.fromDate
  - JSON serialization and deserialization (used by json filter, $xhr and $resource)
- removed SSN validator. It's unlikely that most people will need it and if they do, it can be added
  simple RegExp validator.


<a name="0.9.2"></a>
# <angular/> 0.9.2 faunal-mimicry (2010-11-03) #

### Docs
- created documentation framework based on jsdoc syntax (commit 659af29a)
  - jsdoc parser
  - template generator
  - json generator
  - angular doc viewer app
  - scenario runner for all example code
- documentation for all angular filters (commits 1fe7e3a1 & 1ba8c2a33)
  - docs
  - example code
  - scenario tests for example code

### Testability
#### Scenario Runner
- binding DSL in Scenario can now match bindings without specifying filters
- dsl statements now accept a label argument to make test output more readable (issue #94)
- dsl element() statement now implements most of the jQuery API (issue #106)
- new browser() dsl statement for getting info about the emulated browser running the app
  (issue #109)
- scenario runner is now compatible with IE8 (issue #93)
- scenario runner checks if URL would return a non-success status code (issue #100)
- binding() DSL now accepts regular expressions
- new textarea() scenario runner DSL for entering text into textareas

### Misc
- lots of small bugfixes

### Breaking changes
#### Scenario Runner
- navigating to about:blank is no longer supported. It results in a sandbox error
- navigateTo() is now browser().navigateTo(). Old code must be updated
- file:// URLs are no longer supported for running a scenario. You must use a web server that
  implements HEAD


<a name="0.9.1"></a>
# <angular/> 0.9.1 repulsion-field (2010-10-26) #

### Security
- added html sanitizer to fix the last few known security issues (issues #33 and #34)

### API
- new ng:submit directive for creating onSubmit handlers on forms (issue #76)
- the date filter now accepts milliseconds as well as date strings (issue #78)
- the html filter now supports 'unsafe' option to bypass html sanitization

### Testability
- lots of improvements related to the scenario runner (commit 40d7e66f)

### Demo
- added a new demo application: Personal Log (src example/personalLog)

### Chores
- lots of fixes to get all tests pass on IE
- added TzDate type to allow us to create timezone independent tests (issue #88)

### Breaking changes
- $cookieStore service is not globally published any more, if you use it, you must request it via
  $inject as any other non-global service
- html filter now sanitizes html content for XSS attacks which may result in different behavior


<a name="0.9.0"></a>
# <angular/> 0.9.0 dragon-breath (2010-10-20) #

### Security
- angular.fromJson not safer (issue #57)
- readString consumes invalid escapes (issue #56)
- use new Function instead of eval (issue #52)

### Speed
- css cleanup + inline all css and images in the main js (issue #64)

### Testability
- initial version of the built-in end-to-end scenario runner (issues #50, #67, #70)

### API
- allow ng:controller nesting (issue #39)
- new built-in date format filter (issue #45)
- $location needs method you call on updates (issue #32)


### Chores
- release versioning + file renaming (issue #69)

### Breaking changes
- $location.parse was replaced with $location.update
- all css and img files were inlined into the main js file, to support IE7 and older app must host
  angular-ie-compat.js file

### Big Thanks to Our Community Contributors
- Vojta Jina




[lowercase]: http://docs.angularjs.org/#!/api/angular.lowercase
[uppercase]: http://docs.angularjs.org/#!/api/angular.uppercase
[isDate]: http://docs.angularjs.org/#!/api/angular.isDate
[scope]: http://docs.angularjs.org/#!/api/angular.scope
[compile]: http://docs.angularjs.org/#!/api/angular.compile
[element]: http://docs.angularjs.org/#!/api/angular.element
[widget]: http://docs.angularjs.org/#!/api/angular.widget
[ng:repeat]: http://docs.angularjs.org/#!/api/angular.widget.@ng:repeat
[ng:view]: http://docs.angularjs.org/#!/api/angular.widget.ng-view
[ng:include]: http://docs.angularjs.org/#!/api/angular.widget.ng-include
[ng:options]: http://docs.angularjs.org/#!/api/angular.directive.ng-options
[ng:disabled]: http://docs.angularjs.org/#!/api/angular.directive.ng-disabled
[ng:selected]: http://docs.angularjs.org/#!/api/angular.directive.ng-selected
[ng:checked]: http://docs.angularjs.org/#!/api/angular.directive.ng-checked
[ng:multiple]: http://docs.angularjs.org/#!/api/angular.directive.ng-multiple
[ng:readonly]: http://docs.angularjs.org/#!/api/angular.directive.ng-readonly
[ng:show]: http://docs.angularjs.org/#!/api/angular.directive.ng-show
[ng:hide]: http://docs.angularjs.org/#!/api/angular.directive.ng-hide
[ng:class]: http://docs.angularjs.org/#!/api/angular.directive.ng-class
[ng:src]: http://docs.angularjs.org/#!/api/angular.directive.ng-src
[ng:href]: http://docs.angularjs.org/#!/api/angular.directive.ng-href
[ng:style]: http://docs.angularjs.org/#!/api/angular.directive.ng-style
[$defer]: http://docs.angularjs.org/#!/api/angular.module.ng.$defer
[$cookies]: http://docs.angularjs.org/#!/api/angular.module.ng.$cookies
[$xhr]: http://docs.angularjs.org/#!/api/angular.module.ng.$xhr
[$xhr.cache]: http://docs.angularjs.org/#!/api/angular.module.ng.$xhr.cache
[$resource]: http://docs.angularjs.org/#!/api/angular.module.ng.$resource
[$route]: http://docs.angularjs.org/#!/api/angular.module.ng.$route
[$orderBy]: http://docs.angularjs.org/#!/api/angular.Array.orderBy
[date]: http://docs.angularjs.org/#!/api/angular.filter.date
[number]: http://docs.angularjs.org/#!/api/angular.filter.number
[currency]: http://docs.angularjs.org/#!/api/angular.filter.currency
[directive]: http://docs.angularjs.org/#!/api/angular.directive
[ng:autobind]: http://docs.angularjs.org/#!/api/angular.directive.ng-autobind
[guide.di]: http://docs.angularjs.org/#!/guide/dev_guide.di
[downloading]: http://docs.angularjs.org/#!/misc/downloading
[contribute]: http://docs.angularjs.org/#!/misc/contribute
[jqLite]: http://docs.angularjs.org/#!/api/angular.element
[angular.version]: http://docs.angularjs.org/#!/api/angular.version
[Jstd Scenario Adapter]: https://github.com/angular/angular.js/blob/master/src/jstd-scenario-adapter/Adapter.js
[i18n]: http://docs-next.angularjs.org/#!/guide/dev_guide.i18n
[ng:pluralize]: http://docs-next.angularjs.org/#!/api/angular.widget.ng-pluralize
[ng:form]: http://docs-next.angularjs.org/api/angular.widget.form
[ng:cloak]: http://docs-next.angularjs.org/#!/api/angular.directive.ng-cloak
[$on]: http://docs-next.angularjs.org/#!/api/angular.scope.$on
[$emit]: http://docs-next.angularjs.org/#!/api/angular.scope.$emit
[$broadcast]: http://docs-next.angularjs.org/#!/api/angular.scope.$broadcast
[$limitTo]: http://docs-next.angularjs.org/api/angular.Array.limitTo
[$location]: http://docs-next.angularjs.org/api/angular.service.$location
[e2e test runner]: http://docs-next.angularjs.org/guide/dev_guide.e2e-testing
[$injector]: http://docs-next.angularjs.org/api/angular.module.AUTO.$injector
[$http]: http://docs-next.angularjs.org/api/angular.module.ng.$http
[$httpBackend]: http://docs-next.angularjs.org/api/angular.module.ng.$httpBackend
[unit-testing $httpBackend]: http://docs-next.angularjs.org/api/angular.module.ngMock.$httpBackend
[e2e-testing $httpBackend]: http://docs-next.angularjs.org/api/angular.module.ngMockE2E.$httpBackend
[$q]: http://docs-next.angularjs.org/api/angular.module.ng.$q
[angular.bootstrap]: http://docs-next.angularjs.org/api/angular.bootstrap
[$anchorScroll]: http://docs-next.angularjs.org/api/angular.module.ng.$anchorScroll
[$cacheFactory]: http://docs-next.angularjs.org/api/angular.module.ng.$cacheFactory
[bootstrapping]: http://docs-next.angularjs.org/guide/bootstrap
[angular.copy]: http://docs-next.angularjs.org/api/angular.copy
[ng:app]: http://docs-next.angularjs.org/api/angular.directive.ng-app
[$compile]: http://docs-next.angularjs.org/api/angular.module.ng.$compile
[$filterProvider]: http://docs-next.angularjs.org/api/angular.module.ng.$filterProvider
[angular.Module]: http://docs-next.angularjs.org/api/angular.Module
[angular.module]: http://docs-next.angularjs.org/api/angular.module
[filter]: http://docs-next.angularjs.org/api/angular.module.ng.$filter.filter
[limitTo]: http://docs-next.angularjs.org/api/angular.module.ng.$filter.limitTo
[orderBy]: http://docs-next.angularjs.org/api/angular.module.ng.$filter.orderBy
[$browser.defer.flush]: http://docs-next.angularjs.org/api/angular.module.ngMock.$browser#defer.flush
[inject]: http://docs-next.angularjs.org/api/angular.mock.inject
[module]: http://docs-next.angularjs.org/api/angular.mock.module
[guide2.di]: http://docs-next.angularjs.org/guide/dev_guide.di
[jqLite2]: http://docs.angularjs.org/#!/api/angular.element


[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/CHANGELOG.md?pixel)](https://github.com/igrigorik/ga-beacon)
