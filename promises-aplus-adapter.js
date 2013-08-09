describe('Promises/A+ Tests',function(){

    var $q = qFactory(setTimeout, noop);
    var adapter = {
        rejected: function(reason){
            var deferred = $q.defer();

                deferred.reject(reason);
            return deferred.promise;
        },
        fulfilled: function(value){
            var deferred = $q.defer();
                deferred.resolve(value);
            return deferred.promise;
        },
        pending : function(){
            var deferred = $q.defer();

            return {
                promise: deferred.promise,
                fulfill: deferred.resolve,
                reject: deferred.reject
            };
        }
    };


    PromisesAplusTests.mocha(adapter);

});