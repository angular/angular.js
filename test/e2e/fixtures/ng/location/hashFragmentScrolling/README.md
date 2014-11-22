Regression test for [#8675](https://github.com/angular/angular.js/issues/8675).

Makes sure that hash fragment links actually jump to the relevant document fragment when `$location`
is injected and configured to operate in hashbang mode. In order to use this fix, you need to inject
the `$anchorScroll` service somewhere in your application, and also add the following config block
to your application:

```js
function($locationProvider) {
  $locationProvider.fixHashFragmentLinks(true);
}
```
