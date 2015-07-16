/**
 * @ngdoc module
 * @name ngLocale
 *
 * @description
 * There is a different `ngLocale` module for each of the locales found in the closure library.
 * See {@link i18n}
 * Each module exposes a `$locale` service, which provides localization rules for various Angular components.
 * Right now the only required property of the `$locale` service is:
 *
 * * `id` – `{string}` – locale id formatted as `languageId-countryId` (e.g. `en-us`)
 *
 * But most locales expose a number of other useful members such as:
 *
 * * `DATETIME_FORMATS` property
 * * `NUMBER_FORMATS` property
 * * `pluralCat` member
 */