'use strict';

function registerSensorService(eventType) {
    ngMobile.factory("$"+angular.lowercase(eventType.replace("Device","")),
            ["$timeout","$window",function ($timeout, $window) {
                return {
                    //TODO: (un-)register correct wording?
                    register  : function (callback) {
                        if (!angular.isUndefined(window[eventType + 'Event'])) {
                            $window.addEventListener(angular.lowercase(eventType), callback);
                        }
                    },
                    unregister: function (callback) {
                        $window.removeEventListener(
                            angular.lowercase(eventType),
                            callback);
                    }
                };
            }]);
}

//https://dvcs.w3.org/hg/dap/raw-file/tip/sensor-api/Overview.html#datatypes
angular.forEach([
    "DeviceOrientation","DeviceMotion","DeviceHumidity","DeviceLight",
    "DeviceNoise","DevicePressure","DeviceProximity","DeviceTemperature"],
    function(eventName){
        registerSensorService(eventName);
    });

