module.exports = {
  name: 'step',
  transformFn: function(doc, tag) {
    if ( doc.docType !== 'tutorial' ) {
      throw new Error('Invalid tag, step.  You should only use this tag on tutorial docs');
    }
    return parseInt(tag.description,10);
  }
};
