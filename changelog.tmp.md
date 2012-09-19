<a name="v1.0.0rc3"></a>
# v1.0.0rc3 (2012-03-27)


## Bug Fixes

- **$compile:**
  - create new (isolate) scopes for directives on root elements ([5390fb37](https://github.com/angular/angular.js/commit/5390fb37d2c01937922613fc57df4986af521787), closes [#817](https://github.com/angular/angular.js/issues/817))
  - don't touch static element attributes ([9cb2195e](https://github.com/angular/angular.js/commit/9cb2195e61a78e99020ec19d687a221ca88b5900))
  - Merge interpolated css class when replacing an element ([f49eaf8b](https://github.com/angular/angular.js/commit/f49eaf8bf2df5f4e0e82d6c89e849a4f82c8d414))
- **$http:**
  - don't send Content-Type header when no data ([1a5bebd9](https://github.com/angular/angular.js/commit/1a5bebd927ecd22f9c34617642fdf58fe3f62efb), closes [#749](https://github.com/angular/angular.js/issues/749))
- **$log:**
  - avoid console.log.apply calls in IE ([15213ec2](https://github.com/angular/angular.js/commit/15213ec212769837cb2b7e781ffc5bfd598d27ca), closes [#805](https://github.com/angular/angular.js/issues/805))
- **$resource:**
  - support escaping of ':' in resource url ([6d6f8753](https://github.com/angular/angular.js/commit/6d6f875345e01f2c6c63ef95164f6f39e923da15))
- **compiler:**
  - allow transclusion of root elements ([9918b748](https://github.com/angular/angular.js/commit/9918b748be01266eb10db39d51b4d3098d54ab66))
- **e2e runner:**
  - fix typo that caused errors on IE8 ([ee5a5352](https://github.com/angular/angular.js/commit/ee5a5352fd4b94cedee6ef20d4bf2d43ce77e00b), closes [#806](https://github.com/angular/angular.js/issues/806))
- **forEach:**
  - should ignore prototypically inherited properties ([8d7e6948](https://github.com/angular/angular.js/commit/8d7e6948496ff26ef1da8854ba02fcb8eebfed61), closes [#813](https://github.com/angular/angular.js/issues/813))
- **forms:**
  - Remove double registering of form ([1faafa31](https://github.com/angular/angular.js/commit/1faafa31582c4e9413f48dc7d12f5b681f9fe9fd))
  - Set ng-valid/ng-invalid correctly ([08bfea18](https://github.com/angular/angular.js/commit/08bfea183a850b29da270eac47f80b598cbe600f))
- **init:**
  - use jQuery#ready for init if available ([cb2ad9ab](https://github.com/angular/angular.js/commit/cb2ad9abf24e6f855cc749efe3155bd7987ece9d), closes [#818](https://github.com/angular/angular.js/issues/818))
- **json:**
  - added support for iso8061 timezone ([5ac14f63](https://github.com/angular/angular.js/commit/5ac14f633a69f49973b5512780c6ec7752405967))
- **matchers.toHaveClass:**
  - Correct reference to angular.mock.dump ([f701ce08](https://github.com/angular/angular.js/commit/f701ce08f9d63be05fc3b92f57ad473e1e749b2d))
- **ng-switch:**
  - properly destroy child scopes ([2315d9b3](https://github.com/angular/angular.js/commit/2315d9b3610994b36c44e4a97fb1427d59471ce8))
- **ngDocSpec:**
  - fix broken tests ([53b6f522](https://github.com/angular/angular.js/commit/53b6f522a56eea314cbd084816e08f24b2c7879f))
- **ngForm:**
  - alias name||ngForm ([823adb23](https://github.com/angular/angular.js/commit/823adb231995e917bc060bfa49453e2a96bac2b6))
- **ngRepeat:**
  - correct variable reference in error message ([935c1018](https://github.com/angular/angular.js/commit/935c1018da05dbf3124b2dd33619c4a3c82d7a2a))
- **ngView:**
  - controller not published ([21e74c2d](https://github.com/angular/angular.js/commit/21e74c2d2e8e985b23711785287feb59965cbd90))
- **q:**
  - resolve all of nothing to nothing ([ac75079e](https://github.com/angular/angular.js/commit/ac75079e2113949d5d64adbcf23d56f3cf295d41))
- **select:**
  - multiselect failes to update view on selection insert ([6ecac8e7](https://github.com/angular/angular.js/commit/6ecac8e71a84792a434d21db2c245b3648c55f18))


## Features

- **$compile:**
  - do not interpolate boolean attributes, rather evaluate them ([a08cbc02](https://github.com/angular/angular.js/commit/a08cbc02e78e789a66e9af771c410e8ad1646e25))
- **$controller:**
  - support controller registration via $controllerProvider ([d54dfecb](https://github.com/angular/angular.js/commit/d54dfecb00fba41455536c5ddd55310592fdaf84))
- **$route:**
  - when matching consider trailing slash as optional ([a4fe51da](https://github.com/angular/angular.js/commit/a4fe51da3ba0dc297ecd389e230d6664f250c9a6), closes [#784](https://github.com/angular/angular.js/issues/784))
- **assertArgFn:**
  - should support array annotated fns ([4b8d9260](https://github.com/angular/angular.js/commit/4b8d926062eb4d4483555bdbdec4656f585ab40b))
- **http:**
  - added params parameter ([73c85930](https://github.com/angular/angular.js/commit/73c8593077155a9f2e8ef42efd4c497eba0bef4f))
- **injector:**
  - infer _foo_ as foo ([f13dd339](https://github.com/angular/angular.js/commit/f13dd3393dfb7a33565c9360342c193bc0bddcb6))
- **input.radio:**
  - Allow value attribute to be interpolated ([ade6c452](https://github.com/angular/angular.js/commit/ade6c452753145c84884d17027a7865bf4b34b0c))
- **jqLite:**
  - make injector() and scope() work with the document object ([5fdab52d](https://github.com/angular/angular.js/commit/5fdab52dd7c269f99839f4fa6b5854d9548269fa))
  - add .controller() method ([6c5a05ad](https://github.com/angular/angular.js/commit/6c5a05ad49a1e083570c3dfe331403398f899dbe))
- **ngValue:**
  - allow radio inputs to have non string values ([09e175f0](https://github.com/angular/angular.js/commit/09e175f02cca0f4a295fd0c9b980cd8f432e722b), closes [#816](https://github.com/angular/angular.js/issues/816))
- **scope:**
  - broadcast $destroy event on scope destruction ([9b1aff90](https://github.com/angular/angular.js/commit/9b1aff905b638aa274a5fc8f88662df446d374bd))
- **scope.$eval:**
  - Allow passing locals to the expression ([192ff61f](https://github.com/angular/angular.js/commit/192ff61f5d61899e667c6dbce4d3e6e399429d8b))


## Breaking Changes

- boolean attrs are evaluated rather than interpolated ([a08cbc02](https://github.com/angular/angular.js/commit/a08cbc02e78e789a66e9af771c410e8ad1646e25))
- ng-bind-attr directive removed ([55027132](https://github.com/angular/angular.js/commit/55027132f3d57e5dcf94683e6e6bd7b0aae0087d))
- any app that depends on this service and its fallback to Modernizr, please ([aaedefb9](https://github.com/angular/angular.js/commit/aaedefb92e6bec6626e173e5155072c91471596a))

