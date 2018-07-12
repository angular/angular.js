'use strict';

module.exports = {
  name: 'step',
  transforms: function(doc, tag, value) {
    if (doc.docType !== 'tutorial') {
      throw new Error('Invalid tag, step.  You should only use this tag on tutorial docs');
    }
    return parseInt(value,10);
  }
};
