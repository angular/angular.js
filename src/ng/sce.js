'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* exported $SceProvider, $SceDelegateProvider */

var $sceMinErr = minErr('$sce');

var SCE_CONTEXTS = {
  // HTML is used when there's HTML rendered (e.g. ng-bind-html, iframe srcdoc binding).
  HTML: 'html',

  // Style statements or stylesheets. Currently unused in AngularJS.
  CSS: 'css',

  // An URL used in a context where it does not refer to a resource that loads code. Currently
  // unused in AngularJS.
  URL: 'url',

  // RESOURCE_URL is a subtype of URL used where the referred-to resource could be interpreted as
  // code. (e.g. ng-include, script src binding, templateUrl)
  RESOURCE_URL: 'resourceUrl',

  // Script. Currently unused in AngularJS.
  JS: 'js'
};

// Helper functions follow.

var UNDERSCORE_LOWERCASE_REGEXP = /_([a-z])/g;

function snakeToCamel(name) {
  return name
    .replace(UNDERSCORE_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

function adjustMatcher(matcher) {
  if (matcher === 'self') {
    return matcher;
  } else if (isString(matcher)) {
    // Strings match exactly except for 2 wildcards - '*' and '**'.
    // '*' matches any character except those from the set ':/.?&'.
    // '**' matches any character (like .* in a RegExp).
    // More than 2 *'s raises an error as it's ill defined.
    if (matcher.indexOf('***') > -1) {
      throw $sceMinErr('iwcard',
          'Illegal sequence *** in string matcher.  String: {0}', matcher);
    }
    matcher = escapeForRegexp(matcher).
                  replace(/\\\*\\\*/g, '.*').
                  replace(/\\\*/g, '[^:/.?&;]*');
    return new RegExp('^' + matcher + '$');
  } else if (isRegExp(matcher)) {
    // The only other type of matcher allowed is a Regexp.
    // Match entire URL / disallow partial matches.
    // Flags are reset (i.e. no global, ignoreCase or multiline)
    return new RegExp('^' + matcher.source + '$');
  } else {
    throw $sceMinErr('imatcher',
        'Matchers may only be "self", string patterns or RegExp objects');
  }
}


function adjustMatchers(matchers) {
  var adjustedMatchers = [];
  if (isDefined(matchers)) {
    forEach(matchers, function(matcher) {
      adjustedMatchers.push(adjustMatcher(matcher));
    });
  }
  return adjustedMatchers;
}


/**
 * @ngdoc service
 * @name $sceDelegate
 * @kind function
 *
 * @description
 *
 * `$sceDelegate` is a service that is used by the `$sce` service to provide {@link ng.$sce Strict
 * Contextual Escaping (SCE)} services to AngularJS.
 *
 * For an overview of this service and the functionnality it provides in AngularJS, see the main
 * page for {@link ng.$sce SCE}. The current page is targeted for developers who need to alter how
 * SCE works in their application, which shouldn't be needed in most cases.
 *
 * <div class="alert alert-danger">
 * AngularJS strongly relies on contextual escaping for the security of bindings: disabling or
 * modifying this might cause cross site scripting (XSS) vulnerabilities. For libraries owners,
 * changes to this service will also influence users, so be extra careful and document your changes.
 * </div>
 *
 * Typically, you would configure or override the {@link ng.$sceDelegate $sceDelegate} instead of
 * the `$sce` service to customize the way Strict Contextual Escaping works in AngularJS.  This is
 * because, while the `$sce` provides numerous shorthand methods, etc., you really only need to
 * override 3 core functions (`trustAs`, `getTrusted` and `valueOf`) to replace the way things
 * work because `$sce` delegates to `$sceDelegate` for these operations.
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} to configure this service.
 *
 * The default instance of `$sceDelegate` should work out of the box with little pain.  While you
 * can override it completely to change the behavior of `$sce`, the common case would
 * involve configuring the {@link ng.$sceDelegateProvider $sceDelegateProvider} instead by setting
 * your own whitelists and blacklists for trusting URLs used for loading AngularJS resources such as
 * templates.  Refer {@link ng.$sceDelegateProvider#resourceUrlWhitelist
 * $sceDelegateProvider.resourceUrlWhitelist} and {@link
 * ng.$sceDelegateProvider#resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
 */

/**
 * @ngdoc provider
 * @name $sceDelegateProvider
 * @this
 *
 * @description
 *
 * The `$sceDelegateProvider` provider allows developers to configure the {@link ng.$sceDelegate
 * $sceDelegate service}, used as a delegate for {@link ng.$sce Strict Contextual Escaping (SCE)}.
 *
 * The `$sceDelegateProvider` allows one to get/set the whitelists and blacklists used to ensure
 * that the URLs used for sourcing AngularJS templates and other script-running URLs are safe (all
 * places that use the `$sce.RESOURCE_URL` context). See
 * {@link ng.$sceDelegateProvider#resourceUrlWhitelist $sceDelegateProvider.resourceUrlWhitelist}
 * and
 * {@link ng.$sceDelegateProvider#resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist},
 *
 * For the general details about this service in AngularJS, read the main page for {@link ng.$sce
 * Strict Contextual Escaping (SCE)}.
 *
 * **Example**:  Consider the following case. <a name="example"></a>
 *
 * - your app is hosted at url `http://myapp.example.com/`
 * - but some of your templates are hosted on other domains you control such as
 *   `http://srv01.assets.example.com/`, `http://srv02.assets.example.com/`, etc.
 * - and you have an open redirect at `http://myapp.example.com/clickThru?...`.
 *
 * Here is what a secure configuration for this scenario might look like:
 *
 * ```
 *  angular.module('myApp', []).config(function($sceDelegateProvider) {
 *    $sceDelegateProvider.resourceUrlWhitelist([
 *      // Allow same origin resource loads.
 *      'self',
 *      // Allow loading from our assets domain.  Notice the difference between * and **.
 *      'http://srv*.assets.example.com/**'
 *    ]);
 *
 *    // The blacklist overrides the whitelist so the open redirect here is blocked.
 *    $sceDelegateProvider.resourceUrlBlacklist([
 *      'http://myapp.example.com/clickThru**'
 *    ]);
 *  });
 * ```
 * Note that an empty whitelist will block every resource URL from being loaded, and will require
 * you to manually mark each one as trusted with `$sce.trustAsResourceUrl`. However, templates
 * requested by {@link ng.$templateRequest $templateRequest} that are present in
 * {@link ng.$templateCache $templateCache} will not go through this check. If you have a mechanism
 * to populate your templates in that cache at config time, then it is a good idea to remove 'self'
 * from that whitelist. This helps to mitigate the security impact of certain types of issues, like
 * for instance attacker-controlled `ng-includes`.
 */

function $SceDelegateProvider() {
  this.SCE_CONTEXTS = SCE_CONTEXTS;

  // Resource URLs can also be trusted by policy.
  var resourceUrlWhitelist = ['self'],
      resourceUrlBlacklist = [];

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#resourceUrlWhitelist
   * @kind function
   *
   * @param {Array=} whitelist When provided, replaces the resourceUrlWhitelist with the value
   *     provided.  This must be an array or null.  A snapshot of this array is used so further
   *     changes to the array are ignored.
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.
   *
   * @return {Array} The currently set whitelist array.
   *
   * @description
   * Sets/Gets the whitelist of trusted resource URLs.
   *
   * The **default value** when no whitelist has been explicitly set is `['self']` allowing only
   * same origin resource requests.
   *
   * <div class="alert alert-warning">
   * **Note:** the default whitelist of 'self' is not recommended if your app shares its origin
   * with other apps! It is a good idea to limit it to only your application's directory.
   * </div>
   */
  this.resourceUrlWhitelist = function(value) {
    if (arguments.length) {
      resourceUrlWhitelist = adjustMatchers(value);
    }
    return resourceUrlWhitelist;
  };

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#resourceUrlBlacklist
   * @kind function
   *
   * @param {Array=} blacklist When provided, replaces the resourceUrlBlacklist with the value
   *     provided.  This must be an array or null.  A snapshot of this array is used so further
   *     changes to the array are ignored.</p><p>
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.</p><p>
   *     The typical usage for the blacklist is to **block
   *     [open redirects](http://cwe.mitre.org/data/definitions/601.html)** served by your domain as
   *     these would otherwise be trusted but actually return content from the redirected domain.
   *     </p><p>
   *     Finally, **the blacklist overrides the whitelist** and has the final say.
   *
   * @return {Array} The currently set blacklist array.
   *
   * @description
   * Sets/Gets the blacklist of trusted resource URLs.
   *
   * The **default value** when no whitelist has been explicitly set is the empty array (i.e. there
   * is no blacklist.)
   */

  this.resourceUrlBlacklist = function(value) {
    if (arguments.length) {
      resourceUrlBlacklist = adjustMatchers(value);
    }
    return resourceUrlBlacklist;
  };

  this.$get = ['$injector', function($injector) {

    var htmlSanitizer = function htmlSanitizer(html) {
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    };

    if ($injector.has('$sanitize')) {
      htmlSanitizer = $injector.get('$sanitize');
    }


    function matchUrl(matcher, parsedUrl) {
      if (matcher === 'self') {
        return urlIsSameOrigin(parsedUrl) || urlIsSameOriginAsBaseUrl(parsedUrl);
      } else {
        // definitely a regex.  See adjustMatchers()
        return !!matcher.exec(parsedUrl.href);
      }
    }

    function isResourceUrlAllowedByPolicy(url) {
      var parsedUrl = urlResolve(url.toString());
      var i, n, allowed = false;
      // Ensure that at least one item from the whitelist allows this url.
      for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
          allowed = true;
          break;
        }
      }
      if (allowed) {
        // Ensure that no item from the blacklist blocked this url.
        for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
          if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
            allowed = false;
            break;
          }
        }
      }
      return allowed;
    }

    function generateHolderType(Base) {
      var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function() {
          return trustedValue;
        };
      };
      if (Base) {
        holderType.prototype = new Base();
      }
      holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
      };
      holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
      };
      return holderType;
    }

    var trustedValueHolderBase = generateHolderType(),
        byType = {};

    byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

    /**
     * @ngdoc method
     * @name $sceDelegate#trustAs
     *
     * @description
     * Returns a trusted representation of the parameter for the specified context. This trusted
     * object will later on be used as-is, without any security check, by bindings or directives
     * that require this security context.
     * For instance, marking a string as trusted for the `$sce.HTML` context will entirely bypass
     * the potential `$sanitize` call in corresponding `$sce.HTML` bindings or directives, such as
     * `ng-bind-html`. Note that in most cases you won't need to call this function: if you have the
     * sanitizer loaded, passing the value itself will render all the HTML that does not pose a
     * security risk.
     *
     * See {@link ng.$sceDelegate#getTrusted getTrusted} for the function that will consume those
     * trusted values, and {@link ng.$sce $sce} for general documentation about strict contextual
     * escaping.
     *
     * @param {string} type The context in which this value is safe for use, e.g. `$sce.URL`,
     *     `$sce.RESOURCE_URL`, `$sce.HTML`, `$sce.JS` or `$sce.CSS`.
     *
     * @param {*} value The value that should be considered trusted.
     * @return {*} A trusted representation of value, that can be used in the given context.
     */
    function trustAs(type, trustedValue) {
      var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (!Constructor) {
        throw $sceMinErr('icontext',
            'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
            type, trustedValue);
      }
      if (trustedValue === null || isUndefined(trustedValue) || trustedValue === '') {
        return trustedValue;
      }
      // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
      // mutable objects, we ensure here that the value passed in is actually a string.
      if (typeof trustedValue !== 'string') {
        throw $sceMinErr('itype',
            'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
            type);
      }
      return new Constructor(trustedValue);
    }

    /**
     * @ngdoc method
     * @name $sceDelegate#valueOf
     *
     * @description
     * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}.
     *
     * If the passed parameter is not a value that had been returned by {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}, it must be returned as-is.
     *
     * @param {*} value The result of a prior {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}
     *     call or anything else.
     * @return {*} The `value` that was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns
     *     `value` unchanged.
     */
    function valueOf(maybeTrusted) {
      if (maybeTrusted instanceof trustedValueHolderBase) {
        return maybeTrusted.$$unwrapTrustedValue();
      } else {
        return maybeTrusted;
      }
    }

    /**
     * @ngdoc method
     * @name $sceDelegate#getTrusted
     *
     * @description
     * Takes any input, and either returns a value that's safe to use in the specified context, or
     * throws an exception.
     *
     * In practice, there are several cases. When given a string, this function runs checks
     * and sanitization to make it safe without prior assumptions. When given the result of a {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`} call, it returns the originally supplied
     * value if that value's context is valid for this call's context. Finally, this function can
     * also throw when there is no way to turn `maybeTrusted` in a safe value (e.g., no sanitization
     * is available or possible.)
     *
     * @param {string} type The context in which this value is to be used (such as `$sce.HTML`).
     * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} call, or anything else (which will not be considered trusted.)
     * @return {*} A version of the value that's safe to use in the given context, or throws an
     *     exception if this is impossible.
     */
    function getTrusted(type, maybeTrusted) {
      if (maybeTrusted === null || isUndefined(maybeTrusted) || maybeTrusted === '') {
        return maybeTrusted;
      }
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      // If maybeTrusted is a trusted class instance or subclass instance, then unwrap and return
      // as-is.
      if (constructor && maybeTrusted instanceof constructor) {
        return maybeTrusted.$$unwrapTrustedValue();
      }
      // Otherwise, if we get here, then we may either make it safe, or throw an exception. This
      // depends on the context: some are sanitizatible (HTML), some use whitelists (RESOURCE_URL),
      // some are impossible to do (JS). This step isn't implemented for CSS and URL, as AngularJS
      // has no corresponding sinks.
      if (type === SCE_CONTEXTS.RESOURCE_URL) {
        // RESOURCE_URL uses a whitelist.
        if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
          return maybeTrusted;
        } else {
          throw $sceMinErr('insecurl',
              'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
              maybeTrusted.toString());
        }
      } else if (type === SCE_CONTEXTS.HTML) {
        // htmlSanitizer throws its own error when no sanitizer is available.
        return htmlSanitizer(maybeTrusted);
      }
      // Default error when the $sce service has no way to make the input safe.
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    }

    return { trustAs: trustAs,
             getTrusted: getTrusted,
             valueOf: valueOf };
  }];
}


/**
 * @ngdoc provider
 * @name $sceProvider
 * @this
 *
 * @description
 *
 * The $sceProvider provider allows developers to configure the {@link ng.$sce $sce} service.
 * -   enable/disable Strict Contextual Escaping (SCE) in a module
 * -   override the default implementation with a custom delegate
 *
 * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
 */

/**
 * @ngdoc service
 * @name $sce
 * @kind function
 *
 * @description
 *
 * `$sce` is a service that provides Strict Contextual Escaping services to AngularJS.
 *
 * # Strict Contextual Escaping
 *
 * Strict Contextual Escaping (SCE) is a mode in which AngularJS constrains bindings to only render
 * trusted values. Its goal is to assist in writing code in a way that (a) is secure by default, and
 * (b) makes auditing for security vulnerabilities such as XSS, clickjacking, etc. a lot easier.
 *
 * ## Overview
 *
 * To systematically block XSS security bugs, AngularJS treats all values as untrusted by default in
 * HTML or sensitive URL bindings. When binding untrusted values, AngularJS will automatically
 * run security checks on them (sanitizations, whitelists, depending on context), or throw when it
 * cannot guarantee the security of the result. That behavior depends strongly on contexts: HTML
 * can be sanitized, but template URLs cannot, for instance.
 *
 * To illustrate this, consider the `ng-bind-html` directive. It renders its value directly as HTML:
 * we call that the *context*. When given an untrusted input, AngularJS will attempt to sanitize it
 * before rendering if a sanitizer is available, and throw otherwise. To bypass sanitization and
 * render the input as-is, you will need to mark it as trusted for that context before attempting
 * to bind it.
 *
 * As of version 1.2, AngularJS ships with SCE enabled by default.
 *
 * ## In practice
 *
 * Here's an example of a binding in a privileged context:
 *
 * ```
 * <input ng-model="userHtml" aria-label="User input">
 * <div ng-bind-html="userHtml"></div>
 * ```
 *
 * Notice that `ng-bind-html` is bound to `userHtml` controlled by the user.  With SCE
 * disabled, this application allows the user to render arbitrary HTML into the DIV, which would
 * be an XSS security bug. In a more realistic example, one may be rendering user comments, blog
 * articles, etc. via bindings. (HTML is just one example of a context where rendering user
 * controlled input creates security vulnerabilities.)
 *
 * For the case of HTML, you might use a library, either on the client side, or on the server side,
 * to sanitize unsafe HTML before binding to the value and rendering it in the document.
 *
 * How would you ensure that every place that used these types of bindings was bound to a value that
 * was sanitized by your library (or returned as safe for rendering by your server?)  How can you
 * ensure that you didn't accidentally delete the line that sanitized the value, or renamed some
 * properties/fields and forgot to update the binding to the sanitized value?
 *
 * To be secure by default, AngularJS makes sure bindings go through that sanitization, or
 * any similar validation process, unless there's a good reason to trust the given value in this
 * context.  That trust is formalized with a function call. This means that as a developer, you
 * can assume all untrusted bindings are safe. Then, to audit your code for binding security issues,
 * you just need to ensure the values you mark as trusted indeed are safe - because they were
 * received from your server, sanitized by your library, etc. You can organize your codebase to
 * help with this - perhaps allowing only the files in a specific directory to do this.
 * Ensuring that the internal API exposed by that code doesn't markup arbitrary values as safe then
 * becomes a more manageable task.
 *
 * In the case of AngularJS' SCE service, one uses {@link ng.$sce#trustAs $sce.trustAs}
 * (and shorthand methods such as {@link ng.$sce#trustAsHtml $sce.trustAsHtml}, etc.) to
 * build the trusted versions of your values.
 *
 * ## How does it work?
 *
 * In privileged contexts, directives and code will bind to the result of {@link ng.$sce#getTrusted
 * $sce.getTrusted(context, value)} rather than to the value directly.  Think of this function as
 * a way to enforce the required security context in your data sink. Directives use {@link
 * ng.$sce#parseAs $sce.parseAs} rather than `$parse` to watch attribute bindings, which performs
 * the {@link ng.$sce#getTrusted $sce.getTrusted} behind the scenes on non-constant literals. Also,
 * when binding without directives, AngularJS will understand the context of your bindings
 * automatically.
 *
 * As an example, {@link ng.directive:ngBindHtml ngBindHtml} uses {@link
 * ng.$sce#parseAsHtml $sce.parseAsHtml(binding expression)}.  Here's the actual code (slightly
 * simplified):
 *
 * ```
 * var ngBindHtmlDirective = ['$sce', function($sce) {
 *   return function(scope, element, attr) {
 *     scope.$watch($sce.parseAsHtml(attr.ngBindHtml), function(value) {
 *       element.html(value || '');
 *     });
 *   };
 * }];
 * ```
 *
 * ## Impact on loading templates
 *
 * This applies both to the {@link ng.directive:ngInclude `ng-include`} directive as well as
 * `templateUrl`'s specified by {@link guide/directive directives}.
 *
 * By default, AngularJS only loads templates from the same domain and protocol as the application
 * document.  This is done by calling {@link ng.$sce#getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on the template URL.  To load templates from other domains and/or
 * protocols, you may either {@link ng.$sceDelegateProvider#resourceUrlWhitelist whitelist
 * them} or {@link ng.$sce#trustAsResourceUrl wrap it} into a trusted value.
 *
 * *Please note*:
 * The browser's
 * [Same Origin Policy](https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest)
 * and [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/)
 * policy apply in addition to this and may further restrict whether the template is successfully
 * loaded.  This means that without the right CORS policy, loading templates from a different domain
 * won't work on all browsers.  Also, loading templates from `file://` URL does not work on some
 * browsers.
 *
 * ## This feels like too much overhead
 *
 * It's important to remember that SCE only applies to interpolation expressions.
 *
 * If your expressions are constant literals, they're automatically trusted and you don't need to
 * call `$sce.trustAs` on them (e.g.
 * `<div ng-bind-html="'<b>implicitly trusted</b>'"></div>`) just works. The `$sceDelegate` will
 * also use the `$sanitize` service if it is available when binding untrusted values to
 * `$sce.HTML` context. AngularJS provides an implementation in `angular-sanitize.js`, and if you
 * wish to use it, you will also need to depend on the {@link ngSanitize `ngSanitize`} module in
 * your application.
 *
 * The included {@link ng.$sceDelegate $sceDelegate} comes with sane defaults to allow you to load
 * templates in `ng-include` from your application's domain without having to even know about SCE.
 * It blocks loading templates from other domains or loading templates over http from an https
 * served document.  You can change these by setting your own custom {@link
 * ng.$sceDelegateProvider#resourceUrlWhitelist whitelists} and {@link
 * ng.$sceDelegateProvider#resourceUrlBlacklist blacklists} for matching such URLs.
 *
 * This significantly reduces the overhead.  It is far easier to pay the small overhead and have an
 * application that's secure and can be audited to verify that with much more ease than bolting
 * security onto an application later.
 *
 * <a name="contexts"></a>
 * ## What trusted context types are supported?
 *
 * | Context             | Notes          |
 * |---------------------|----------------|
 * | `$sce.HTML`         | For HTML that's safe to source into the application.  The {@link ng.directive:ngBindHtml ngBindHtml} directive uses this context for bindings. If an unsafe value is encountered, and the {@link ngSanitize.$sanitize $sanitize} service is available (implemented by the {@link ngSanitize ngSanitize} module) this will sanitize the value instead of throwing an error. |
 * | `$sce.CSS`          | For CSS that's safe to source into the application.  Currently, no bindings require this context. Feel free to use it in your own directives. |
 * | `$sce.URL`          | For URLs that are safe to follow as links.  Currently unused (`<a href=`, `<img src=`, and some others sanitize their urls and don't constitute an SCE context.) |
 * | `$sce.RESOURCE_URL` | For URLs that are not only safe to follow as links, but whose contents are also safe to include in your application.  Examples include `ng-include`, `src` / `ngSrc` bindings for tags other than `IMG`, `VIDEO`, `AUDIO`, `SOURCE`, and `TRACK` (e.g. `IFRAME`, `OBJECT`, etc.)  <br><br>Note that `$sce.RESOURCE_URL` makes a stronger statement about the URL than `$sce.URL` does (it's not just the URL that matters, but also what is at the end of it), and therefore contexts requiring values trusted for `$sce.RESOURCE_URL` can be used anywhere that values trusted for `$sce.URL` are required. |
 * | `$sce.JS`           | For JavaScript that is safe to execute in your application's context.  Currently, no bindings require this context.  Feel free to use it in your own directives. |
 *
 *
 * Be aware that `a[href]` and `img[src]` automatically sanitize their URLs and do not pass them
 * through {@link ng.$sce#getTrusted $sce.getTrusted}. There's no CSS-, URL-, or JS-context bindings
 * in AngularJS currently, so their corresponding `$sce.trustAs` functions aren't useful yet. This
 * might evolve.
 *
 * ## Format of items in {@link ng.$sceDelegateProvider#resourceUrlWhitelist resourceUrlWhitelist}/{@link ng.$sceDelegateProvider#resourceUrlBlacklist Blacklist} <a name="resourceUrlPatternItem"></a>
 *
 *  Each element in these arrays must be one of the following:
 *
 *  - **'self'**
 *    - The special **string**, `'self'`, can be used to match against all URLs of the **same
 *      domain** as the application document using the **same protocol**.
 *  - **String** (except the special value `'self'`)
 *    - The string is matched against the full *normalized / absolute URL* of the resource
 *      being tested (substring matches are not good enough.)
 *    - There are exactly **two wildcard sequences** - `*` and `**`.  All other characters
 *      match themselves.
 *    - `*`: matches zero or more occurrences of any character other than one of the following 6
 *      characters: '`:`', '`/`', '`.`', '`?`', '`&`' and '`;`'.  It's a useful wildcard for use
 *      in a whitelist.
 *    - `**`: matches zero or more occurrences of *any* character.  As such, it's not
 *      appropriate for use in a scheme, domain, etc. as it would match too much.  (e.g.
 *      http://**.example.com/ would match http://evil.com/?ignore=.example.com/ and that might
 *      not have been the intention.)  Its usage at the very end of the path is ok.  (e.g.
 *      http://foo.example.com/templates/**).
 *  - **RegExp** (*see caveat below*)
 *    - *Caveat*:  While regular expressions are powerful and offer great flexibility,  their syntax
 *      (and all the inevitable escaping) makes them *harder to maintain*.  It's easy to
 *      accidentally introduce a bug when one updates a complex expression (imho, all regexes should
 *      have good test coverage).  For instance, the use of `.` in the regex is correct only in a
 *      small number of cases.  A `.` character in the regex used when matching the scheme or a
 *      subdomain could be matched against a `:` or literal `.` that was likely not intended.   It
 *      is highly recommended to use the string patterns and only fall back to regular expressions
 *      as a last resort.
 *    - The regular expression must be an instance of RegExp (i.e. not a string.)  It is
 *      matched against the **entire** *normalized / absolute URL* of the resource being tested
 *      (even when the RegExp did not have the `^` and `$` codes.)  In addition, any flags
 *      present on the RegExp (such as multiline, global, ignoreCase) are ignored.
 *    - If you are generating your JavaScript from some other templating engine (not
 *      recommended, e.g. in issue [#4006](https://github.com/angular/angular.js/issues/4006)),
 *      remember to escape your regular expression (and be aware that you might need more than
 *      one level of escaping depending on your templating engine and the way you interpolated
 *      the value.)  Do make use of your platform's escaping mechanism as it might be good
 *      enough before coding your own.  E.g. Ruby has
 *      [Regexp.escape(str)](http://www.ruby-doc.org/core-2.0.0/Regexp.html#method-c-escape)
 *      and Python has [re.escape](http://docs.python.org/library/re.html#re.escape).
 *      Javascript lacks a similar built in function for escaping.  Take a look at Google
 *      Closure library's [goog.string.regExpEscape(s)](
 *      http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962).
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} for an example.
 *
 * ## Show me an example using SCE.
 *
 * <example module="mySceApp" deps="angular-sanitize.js" name="sce-service">
 * <file name="index.html">
 *   <div ng-controller="AppController as myCtrl">
 *     <i ng-bind-html="myCtrl.explicitlyTrustedHtml" id="explicitlyTrustedHtml"></i><br><br>
 *     <b>User comments</b><br>
 *     By default, HTML that isn't explicitly trusted (e.g. Alice's comment) is sanitized when
 *     $sanitize is available.  If $sanitize isn't available, this results in an error instead of an
 *     exploit.
 *     <div class="well">
 *       <div ng-repeat="userComment in myCtrl.userComments">
 *         <b>{{userComment.name}}</b>:
 *         <span ng-bind-html="userComment.htmlComment" class="htmlComment"></span>
 *         <br>
 *       </div>
 *     </div>
 *   </div>
 * </file>
 *
 * <file name="script.js">
 *   angular.module('mySceApp', ['ngSanitize'])
 *     .controller('AppController', ['$http', '$templateCache', '$sce',
 *       function AppController($http, $templateCache, $sce) {
 *         var self = this;
 *         $http.get('test_data.json', {cache: $templateCache}).then(function(response) {
 *           self.userComments = response.data;
 *         });
 *         self.explicitlyTrustedHtml = $sce.trustAsHtml(
 *             '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
 *             'sanitization.&quot;">Hover over this text.</span>');
 *       }]);
 * </file>
 *
 * <file name="test_data.json">
 * [
 *   { "name": "Alice",
 *     "htmlComment":
 *         "<span onmouseover='this.textContent=\"PWN3D!\"'>Is <i>anyone</i> reading this?</span>"
 *   },
 *   { "name": "Bob",
 *     "htmlComment": "<i>Yes!</i>  Am I the only other one?"
 *   }
 * ]
 * </file>
 *
 * <file name="protractor.js" type="protractor">
 *   describe('SCE doc demo', function() {
 *     it('should sanitize untrusted values', function() {
 *       expect(element.all(by.css('.htmlComment')).first().getAttribute('innerHTML'))
 *           .toBe('<span>Is <i>anyone</i> reading this?</span>');
 *     });
 *
 *     it('should NOT sanitize explicitly trusted values', function() {
 *       expect(element(by.id('explicitlyTrustedHtml')).getAttribute('innerHTML')).toBe(
 *           '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
 *           'sanitization.&quot;">Hover over this text.</span>');
 *     });
 *   });
 * </file>
 * </example>
 *
 *
 *
 * ## Can I disable SCE completely?
 *
 * Yes, you can.  However, this is strongly discouraged.  SCE gives you a lot of security benefits
 * for little coding overhead.  It will be much harder to take an SCE disabled application and
 * either secure it on your own or enable SCE at a later stage.  It might make sense to disable SCE
 * for cases where you have a lot of existing code that was written before SCE was introduced and
 * you're migrating them a module at a time. Also do note that this is an app-wide setting, so if
 * you are writing a library, you will cause security bugs applications using it.
 *
 * That said, here's how you can completely disable SCE:
 *
 * ```
 * angular.module('myAppWithSceDisabledmyApp', []).config(function($sceProvider) {
 *   // Completely disable SCE.  For demonstration purposes only!
 *   // Do not use in new projects or libraries.
 *   $sceProvider.enabled(false);
 * });
 * ```
 *
 */

function $SceProvider() {
  var enabled = true;

  /**
   * @ngdoc method
   * @name $sceProvider#enabled
   * @kind function
   *
   * @param {boolean=} value If provided, then enables/disables SCE application-wide.
   * @return {boolean} True if SCE is enabled, false otherwise.
   *
   * @description
   * Enables/disables SCE and returns the current value.
   */
  this.enabled = function(value) {
    if (arguments.length) {
      enabled = !!value;
    }
    return enabled;
  };


  /* Design notes on the default implementation for SCE.
   *
   * The API contract for the SCE delegate
   * -------------------------------------
   * The SCE delegate object must provide the following 3 methods:
   *
   * - trustAs(contextEnum, value)
   *     This method is used to tell the SCE service that the provided value is OK to use in the
   *     contexts specified by contextEnum.  It must return an object that will be accepted by
   *     getTrusted() for a compatible contextEnum and return this value.
   *
   * - valueOf(value)
   *     For values that were not produced by trustAs(), return them as is.  For values that were
   *     produced by trustAs(), return the corresponding input value to trustAs.  Basically, if
   *     trustAs is wrapping the given values into some type, this operation unwraps it when given
   *     such a value.
   *
   * - getTrusted(contextEnum, value)
   *     This function should return the a value that is safe to use in the context specified by
   *     contextEnum or throw and exception otherwise.
   *
   * NOTE: This contract deliberately does NOT state that values returned by trustAs() must be
   * opaque or wrapped in some holder object.  That happens to be an implementation detail.  For
   * instance, an implementation could maintain a registry of all trusted objects by context.  In
   * such a case, trustAs() would return the same object that was passed in.  getTrusted() would
   * return the same object passed in if it was found in the registry under a compatible context or
   * throw an exception otherwise.  An implementation might only wrap values some of the time based
   * on some criteria.  getTrusted() might return a value and not throw an exception for special
   * constants or objects even if not wrapped.  All such implementations fulfill this contract.
   *
   *
   * A note on the inheritance model for SCE contexts
   * ------------------------------------------------
   * I've used inheritance and made RESOURCE_URL wrapped types a subtype of URL wrapped types.  This
   * is purely an implementation details.
   *
   * The contract is simply this:
   *
   *     getTrusted($sce.RESOURCE_URL, value) succeeding implies that getTrusted($sce.URL, value)
   *     will also succeed.
   *
   * Inheritance happens to capture this in a natural way. In some future, we may not use
   * inheritance anymore. That is OK because no code outside of sce.js and sceSpecs.js would need to
   * be aware of this detail.
   */

  this.$get = ['$parse', '$sceDelegate', function(
                $parse,   $sceDelegate) {
    // Support: IE 9-11 only
    // Prereq: Ensure that we're not running in IE<11 quirks mode.  In that mode, IE < 11 allow
    // the "expression(javascript expression)" syntax which is insecure.
    if (enabled && msie < 8) {
      throw $sceMinErr('iequirks',
        'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' +
        'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
        'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
    }

    var sce = shallowCopy(SCE_CONTEXTS);

    /**
     * @ngdoc method
     * @name $sce#isEnabled
     * @kind function
     *
     * @return {Boolean} True if SCE is enabled, false otherwise.  If you want to set the value, you
     *     have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
     *
     * @description
     * Returns a boolean indicating if SCE is enabled.
     */
    sce.isEnabled = function() {
      return enabled;
    };
    sce.trustAs = $sceDelegate.trustAs;
    sce.getTrusted = $sceDelegate.getTrusted;
    sce.valueOf = $sceDelegate.valueOf;

    if (!enabled) {
      sce.trustAs = sce.getTrusted = function(type, value) { return value; };
      sce.valueOf = identity;
    }

    /**
     * @ngdoc method
     * @name $sce#parseAs
     *
     * @description
     * Converts AngularJS {@link guide/expression expression} into a function.  This is like {@link
     * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
     * wraps the expression in a call to {@link ng.$sce#getTrusted $sce.getTrusted(*type*,
     * *result*)}
     *
     * @param {string} type The SCE context in which this result will be used.
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */
    sce.parseAs = function sceParseAs(type, expr) {
      var parsed = $parse(expr);
      if (parsed.literal && parsed.constant) {
        return parsed;
      } else {
        return $parse(expr, function(value) {
          return sce.getTrusted(type, value);
        });
      }
    };

    /**
     * @ngdoc method
     * @name $sce#trustAs
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}. As such, returns a
     * wrapped object that represents your value, and the trust you have in its safety for the given
     * context. AngularJS can then use that value as-is in bindings of the specified secure context.
     * This is used in bindings for `ng-bind-html`, `ng-include`, and most `src` attribute
     * interpolations. See {@link ng.$sce $sce} for strict contextual escaping.
     *
     * @param {string} type The context in which this value is safe for use, e.g. `$sce.URL`,
     *     `$sce.RESOURCE_URL`, `$sce.HTML`, `$sce.JS` or `$sce.CSS`.
     *
     * @param {*} value The value that that should be considered trusted.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in the context you specified.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsHtml
     *
     * @description
     * Shorthand method.  `$sce.trustAsHtml(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.HTML, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.HTML` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.HTML` context (like `ng-bind-html`).
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsCss
     *
     * @description
     * Shorthand method.  `$sce.trustAsCss(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.CSS, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.CSS` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant
     *     of your `value` in `$sce.CSS` context. This context is currently unused, so there are
     *     almost no reasons to use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsUrl
     *
     * @description
     * Shorthand method.  `$sce.trustAsUrl(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.URL, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.URL` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.URL` context. That context is currently unused, so there are almost no reasons
     *     to use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.trustAsResourceUrl(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.RESOURCE_URL` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.RESOURCE_URL` context (template URLs in `ng-include`, most `src` attribute
     *     bindings, ...)
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsJs
     *
     * @description
     * Shorthand method.  `$sce.trustAsJs(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.JS, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.JS` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.JS` context. That context is currently unused, so there are almost no reasons to
     *     use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#getTrusted
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted`}.  As such,
     * takes any input, and either returns a value that's safe to use in the specified context,
     * or throws an exception. This function is aware of trusted values created by the `trustAs`
     * function and its shorthands, and when contexts are appropriate, returns the unwrapped value
     * as-is. Finally, this function can also throw when there is no way to turn `maybeTrusted` in a
     * safe value (e.g., no sanitization is available or possible.)
     *
     * @param {string} type The context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sce#trustAs
     *     `$sce.trustAs`} call, or anything else (which will not be considered trusted.)
     * @return {*} A version of the value that's safe to use in the given context, or throws an
     *     exception if this is impossible.
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedHtml
     *
     * @description
     * Shorthand method.  `$sce.getTrustedHtml(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.HTML, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.HTML, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedCss
     *
     * @description
     * Shorthand method.  `$sce.getTrustedCss(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.CSS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.CSS, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedUrl
     *
     * @description
     * Shorthand method.  `$sce.getTrustedUrl(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.URL, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.URL, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.getTrustedResourceUrl(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to pass to `$sceDelegate.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.RESOURCE_URL, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedJs
     *
     * @description
     * Shorthand method.  `$sce.getTrustedJs(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.JS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.JS, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsHtml
     *
     * @description
     * Shorthand method.  `$sce.parseAsHtml(expression string)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.HTML, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsCss
     *
     * @description
     * Shorthand method.  `$sce.parseAsCss(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.CSS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsUrl
     *
     * @description
     * Shorthand method.  `$sce.parseAsUrl(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.parseAsResourceUrl(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.RESOURCE_URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsJs
     *
     * @description
     * Shorthand method.  `$sce.parseAsJs(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.JS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    // Shorthand delegations.
    var parse = sce.parseAs,
        getTrusted = sce.getTrusted,
        trustAs = sce.trustAs;

    forEach(SCE_CONTEXTS, function(enumValue, name) {
      var lName = lowercase(name);
      sce[snakeToCamel('parse_as_' + lName)] = function(expr) {
        return parse(enumValue, expr);
      };
      sce[snakeToCamel('get_trusted_' + lName)] = function(value) {
        return getTrusted(enumValue, value);
      };
      sce[snakeToCamel('trust_as_' + lName)] = function(value) {
        return trustAs(enumValue, value);
      };
    });

    return sce;
  }];
}
