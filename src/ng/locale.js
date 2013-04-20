'use strict';

/**
 * @ngdoc object
 * @name ng.$locale
 *
 * @description
 * $locale service provides localization rules for various Angular components. As of right now the
 * only public api is:
 *
 * * `id` – `{string}` – locale id formatted as `languageId-countryId` (e.g. `en-us`)
 */
function $LocaleProvider(){
  var localeLocationPattern = 'angular/i18n/angular-locale_{{locale}}.js';

  function loadScript(url, callback) {
    var script = document.createElement('script'),
      head = document.getElementsByTagName('head')[0];

    script.type = 'text/javascript';
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' ||
            script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // Others
      script.onload = function () {
        callback();
      };
    }
    script.src = url;
    script.async = false;
    head.insertBefore(script, head.firstChild);
  }

  function loadLocale(localeUrl, $locale) {
    loadScript(localeUrl, function () {
      // Force a start to the new module
      var injector = bootstrap('<div></div>', ['ngLocale']),
        externalLocale = injector.get('$locale'),
        $rootScope = injector.get('$rootScope'),
        $rootElement = injector.get('$rootElement');

      forEach(externalLocale, function (value, key) {
        $locale[key] = externalLocale[key];
      });

      // release the injector
      dealoc($rootScope);
      dealoc($rootElement);
    });
  }

  /**
   * @ngdoc method
   * @name ng.$localeProvider#localeLocationPattern
   * @methodOf ng.$localeProvider
   * @description
   * Expression to denote the location from where to retrieve the locale.
   * Defaults to `angular/i18n/angular-locale_{{locale}}.js`.
   *
   * @param {string=} value new expression to set the retrieve path.
   * @returns {string|self} Returns the expression when used as getter and self if used as setter.
   */
  this.localeLocationPattern = function(value) {
    if (value) {
      localeLocationPattern = value;
      return this;
    } else {
      return localeLocationPattern;
    }
  };

  this.$get = ['$interpolate', function($interpolate) {
    var localeLocation = $interpolate(localeLocationPattern);

    return {
      id: 'en-us',

      NUMBER_FORMATS: {
      DECIMAL_SEP: '.',
        GROUP_SEP: ',',
        PATTERNS: [
          { // Decimal Pattern
            minInt: 1,
            minFrac: 0,
            maxFrac: 3,
            posPre: '',
            posSuf: '',
            negPre: '-',
            negSuf: '',
            gSize: 3,
            lgSize: 3
          },{ //Currency Pattern
            minInt: 1,
            minFrac: 2,
            maxFrac: 2,
            posPre: '\u00A4',
            posSuf: '',
            negPre: '(\u00A4',
            negSuf: ')',
            gSize: 3,
            lgSize: 3
          }
        ],
        CURRENCY_SYM: '$'
      },

      DATETIME_FORMATS: {
        MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'
                .split(','),
        SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
        DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
        SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
        AMPMS: ['AM','PM'],
        medium: 'MMM d, y h:mm:ss a',
        short: 'M/d/yy h:mm a',
        fullDate: 'EEEE, MMMM d, y',
        longDate: 'MMMM d, y',
        mediumDate: 'MMM d, y',
        shortDate: 'M/d/yy',
        mediumTime: 'h:mm:ss a',
        shortTime: 'h:mm a'
      },

      pluralCat: function(num) {
        if (num === 1) {
          return 'one';
        }
        return 'other';
      },

      set: function(value) {
        loadLocale(localeLocation({locale: value}), this);
      }
    };
  }];
}
