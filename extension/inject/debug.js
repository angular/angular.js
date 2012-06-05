
var inject = function () {
  if (document.head) {

    document.head.insertBefore(
      (function () {
        var fn = function (window) {
          //alert('script');
          var patch = function () {
            if (window.angular && typeof window.angular.bootstrap === 'function') {
              window.angular.bootstrap = function () {
                alert('nope.');
              };
              console.log(angular);
            } else {
              setTimeout(patch, 1);
            }
          };

          patch();
        };

        var script = window.document.createElement('script');
        script.innerHTML = '(' + fn.toString() + '(window))';
        
        return script;
      }()),
      document.head.firstChild);

  } else {
    setTimeout(inject, 1);
  }
};

inject();
