var http = require('http'),
    url = require('url'),
    join = require('path').join,
    exists = require('path').exists,
    extname = require('path').extname,
    join = require('path').join,
    fs = require('fs'),
    port = process.argv[2] || 3000

var mime = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
}

http.createServer(function(req, res){
  console.log('  \033[90m%s \033[36m%s\033[m', req.method, req.url)

  var pathname = url.parse(req.url).pathname,
      path = join(process.cwd(), pathname)

  function notFound() {
    res.statusCode = 404
    res.end("404 Not Found\n")
  }

  function error(err) {
    res.statusCode = 500
    res.end(err.message + "\n")
  }

  exists(path, function(exists){
    if (!exists) return notFound()

    fs.stat(path, function(err, stat){
      if (err) return error()
      if (stat.isDirectory()) path = join(path, 'index.html')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Content-Type', mime[path.split('.').slice(-1)] || 'application/octet-stream')
      fs.createReadStream(path).pipe(res)
    })
  })
}).listen(port)

console.log('\n  Server listening on %d\n', port)
