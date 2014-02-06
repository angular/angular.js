'use strict';

var ngAnimationdetectDirective = ngDirective(function(scope, element, attr) {
    var el = element;
    var pfx = ["webkit", "moz", "MS", "o", ""];
    var PrefixedEvent = function(element, type, callback) {
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.bind(pfx[p] + type, callback);
        }
    }
    // handle animation events
    var AnimationListener = function(e) {
        console.log("Animation '" + e.animationName + "' type '" + e.type + "' at " + e.elapsedTime.toFixed(2) + " seconds");
        if (e.type.toLowerCase().indexOf("animationend") >= 0) {

        }
    }

    PrefixedEvent(el, "AnimationStart", AnimationListener);
    PrefixedEvent(el, "AnimationIteration", AnimationListener);
    PrefixedEvent(el, "AnimationEnd", AnimationListener);
});