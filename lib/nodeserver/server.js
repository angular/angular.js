var sys = require('sys'),
    http = require('http'),
    fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {});
  sys.p('GET ' + req.url);
  var file = fs.createReadStream('.' + req.url);
  file.addListener('data', bind(res, res.write));
  file.addListener('error', function( error ){
    sys.p(error);
    res.end();
  });
  file.addListener('close', bind(res, res.end));
}).listen(8000);
sys.puts('Server running at http://127.0.0.1:8000/');

function bind(_this, _fn) {
 return function(){
   return _fn.apply(_this, arguments);
 };
}
