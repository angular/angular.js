/* global qFactory: false */
'use strict';

var isFunction = function isFunction(value){return typeof value == 'function';};
var isPromiseLike = function isPromiseLike(obj) {return obj && isFunction(obj.then);};

var $q = qFactory(process.nextTick, function noopExceptionHandler() {});

exports.fulfilled = $q.resolve;
exports.rejected = $q.reject;
exports.pending = function () {
    var deferred = $q.defer();

    return {
        promise: deferred.promise,
        fulfill: deferred.resolve,
        reject: deferred.reject
    };
};
