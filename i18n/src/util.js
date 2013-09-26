exports.findLocaleId = function findLocaleId(str, type) {
  if (type === 'num') {
    return (str.match(/^NumberFormatSymbols_(.+)$/) || [])[1];
  } else if (type == 'datetime') {
    return (str.match(/^DateTimeSymbols_(.+)$/) || [])[1];
  }
}
