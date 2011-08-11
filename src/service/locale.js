'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$locale
 *
 * @description
 * $locale service provides locale specific info including:
 *
 *   * `IDENTIFIER`: country and region code of the current locale. (e.g. en\_US)
 *   * `NUMBER_FORMATS`: includes decimal and group separators, decimal and currency patterns and
 *      currency symbol of current locale.
 *   * `DATETIME_FORMATS`: includes all datetime related symbols and formats such as localized
 *      months and weekday names. It also includes long, medium, short date/time formats.
 *
 *
 */
angularServiceInject('$locale', function() {
  return {
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
      long: 'MMMM d, y h:mm:ss a z',
      medium: 'MMM d, y h:mm:ss a',
      short: 'M/d/yy h:mm a',
      fullDate: 'EEEE, MMMM d, y',
      longDate: 'MMMM d, y',
      mediumDate: 'MMM d, y',
      shortDate: 'M/d/yy',
      longTime: 'h:mm:ss a z',
      mediumTime: 'h:mm:ss a',
      shortTime: 'h:mm a'
    }
  };
}, {$locale: 'en-US', $regLocale: 'en'});
