var html = document.querySelector('html');
html.setAttribute('ng-app', '');

var buttonDiv = document.createElement('div');
buttonDiv.setAttribute('ng-show', 'true');
buttonDiv.innerHTML = 'Hello!';

var hplogo = document.getElementById('hplogo');
hplogo.insertBefore(buttonDiv, hplogo.childNodes[0]);
