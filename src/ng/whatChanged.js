'use strict';

/**
 * Work out what changed between two generic colletions
 * @param original {object} collection that has a get method
 * @param changed {object} collection that has a get method
 */
function whatChanged(original, changed) {
  var objTracker = new ObjectTracker(original, changed);
  var changes = new ChangeTracker(original, changed);

  var index = 0, changedItem, originalItem;
  while(index < original.length() && index < changed.length()) {
    changedItem = changed.get(index);
    originalItem = original.get(index);
    if ( originalItem !== changedItem ) {
      // Something has changed...
      if ( !angular.isObject(originalItem) ) {
        // Original item is not an object
        if ( !angular.isObject(changedItem) ) {
          // Neither is Changed item - so we add a modifications at this index
          changes.pushModification(index);
        } else {
          // Changed item is an object - so add a deletion for the original primitive...
          changes.pushDeletion(index);
          // ...and store the new object index for later
          objTracker.addNewEntry(index);
        }
      } else {
        // Original item is an object
        if ( !angular.isObject(changedItem) ) {
          // Changed item is not an object - so add an addition for the new primitive...
          changes.pushAddition(index);
          // ...and store the old object index for later
          objTracker.addOldEntry(index);
        } else {
          // Both Original and Changed items are objects - so store both items for later
          objTracker.addOldEntry(index);
          objTracker.addNewEntry(index);
        }
      }
    }
    index++;
  }

  while ( index < changed.length() ) {
    if ( !angular.isObject(changed.get(index)) ) {
      changes.pushAddition(index);
    } else {
      objTracker.addNewEntry(index);
    }
    index++;
  }
  while ( index < original.length() ) {
    if ( !angular.isObject(originalItem) ) {
      changes.pushDeletion(index);
    } else {
      objTracker.addOldEntry(index);
    }
    index++;
  }

  var entries = objTracker.entries;
  for(var key in entries) {
    if ( !entries.hasOwnProperty(key) ) {
      continue;
    }
    var entry = entries[key];
    index = 0;
    while(index < entry.oldIndexes.length && index < entry.newIndexes.length) {
      changes.pushMove(entry.oldIndexes[index], entry.newIndexes[index]);
      index++;
    }
    while(index < entry.oldIndexes.length) {
      changes.pushDeletion(entry.oldIndexes[index]);
      index++;
    }
    while(index < entry.newIndexes.length) {
      changes.pushAddition(entry.newIndexes[index]);
      index++;
    }
  }
  return changes;
};

function $WhatChangedProvider() {
  this.$get = function() {
    return function(original, changed) {
      var flattened;
      if ( isArray(original) && isArray(changed) ) {
        flattened = new FlattenedChanges(whatChanged(new WrappedArray(original), new WrappedArray(changed)));
      } else {
        flattened = new FlattenedChanges(whatChanged(new WrappedObject(original), new WrappedObject(changed)));
      }
      return flattened.changes;
    };
  };
}
