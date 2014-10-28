module.exports = {
  name: 'sortOrder',
  transforms: function(doc, tag, value) {
    return parseInt(value, 10);
  }
};