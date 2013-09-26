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
     - clear the translusion point before transcluding
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

  To keep the old behaviour, use:

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
  - **ngSwitch:** make ngSwitch compatible with controller backwards-compatiblity module
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
- **$parser:** string concatination with undefined model
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
  the scope object can be listed in the arguments list only if its needed and skipped otherwise.
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
- [ng:view]: ignore stale xhr callbacks - fixes issues caused by race-conditions which occured when
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
- added $defer.cancel to support cancelation of tasks defered via the [$defer] service
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
- <select> (one/multiple) could not chose from a list of objects (commit 347be5ae)
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
- `select` widget now behaves correctly when it's `option` items are created via `ng:repeat`
  (issue #170)
- fix for async xhr cache issue #152 by adding `$browser.defer` and `$defer` service

### Breaking Changes
- Fix for issue #152 might break some tests that were relying on the incorrect behavior. The
  breakage will usually affect code that tests resources, xhr or services/widgets build on top of
  these. All that is typically needed to resolve the issue is adding a call to
  `$browser.defer.flush()` in your test just before the point where you expect all cached
  resource/xhr requests to return any results. Please see 011fa39c2a0b5da843395b538fc4e52e5ade8287
  for more info.
- The HTML sanitizer is slightly more strinct now. Please see info in the "Security" section above.


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
- angular.String.toDate supports ISO8061 formated strings with all time fractions being optional
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
- scenarior runner checks if URL would return a non-success status code (issue #100)
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
- added TzDate type to allow us to create timezone idependent tests (issue #88)

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
