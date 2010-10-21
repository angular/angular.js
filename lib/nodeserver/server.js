var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events');

function main() {
  new HttpServer({
    'GET': (function() { 
      var servlet = new StaticServlet();
      return servlet.handleRequest.bind(servlet)
    })()
  }).start(8000); 
}

function escapeHtml(value) {
  return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt').
    replace('"', '&quot;');
}

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * @param {Object} Map of method => Handler function
 */
function HttpServer(handlers) {
  this.handlers = handlers;
  this.server = http.createServer(this.handleRequest_.bind(this));
}

HttpServer.prototype.start = function(port) {
  this.port = port;
  this.server.listen(port);
  sys.puts('Http Server running at http://127.0.0.1:' + port + '/');
};

HttpServer.prototype.parseUrl_ = function(urlString) {
  var parsed = url.parse(urlString);
  parsed.pathname = url.resolve('/', parsed.pathname);
  return url.parse(url.format(parsed), true);
};

HttpServer.prototype.handleRequest_ = function(req, res) {
  sys.puts(req.method + ' ' + req.url);
  req.url = this.parseUrl_(req.url);
  var handler = this.handlers[req.method];
  if (!handler) {
    res.writeHead(501, 'Not Implemented');
    res.end();
  } else {
    handler.call(this, req, res);
  }
};


/**
 * Handles static content.
 */
function  StaticServlet() {}

StaticServlet.MimeMap = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png'
};

StaticServlet.prototype.handleRequest = function(req, res) {
  var self = this;
  var path = ('./' + req.url.pathname).replace('//','/');
  var parts = path.split('/');
  if (parts[parts.length-1].charAt(0) === '.')
    return self.sendForbidden_(res, path);
  fs.stat(path, function(err, stat) {
    if (err) 
      return self.sendMissing_(res, path);
    if (stat.isDirectory())
      return self.sendDirectory_(res, path);
    return self.sendFile_(res, path);
  });
}

StaticServlet.prototype.sendError_ = function(res, error) {
  res.writeHead(500, 'Internal Server Error', {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>Internal Server Error</title>\n');
  res.write('<h1>500 Internal Server Error</h1>');
  res.write('<pre>' + escapeHtml(sys.inspect(error)) + '</pre>');
  sys.puts('500 Internal Server Error');
  sys.puts(sys.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function(res, path) {
  res.writeHead(404, 'Not Found', {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>404 Not Found</title>\n');
  res.write('<h1>404 Not Found</h1>');
  res.end();
  sys.puts('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function(res, path) {
  res.writeHead(403, 'Forbidden', {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>403 Forbidden</title>\n');
  res.write('<h1>403 Forbidden</h1>');
  res.end();
  sys.puts('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendFile_ = function(res, path) {
  var self = this;
  var file = fs.createReadStream(path);
  res.writeHead(200, {
    'Content-Type': StaticServlet.
      MimeMap[path.split('.').pop()] || 'text/plain'
  });
  file.on('data', res.write.bind(res));
  file.on('close', function() {
    res.end();
  });
  file.on('error', function(error) {
    self.sendError_(res, error);
  });
};

StaticServlet.prototype.sendDirectory_ = function(res, path) {
  var self = this;
  fs.readdir(path, function(err, files) {
    if (err) 
      return self.sendError_(res, error);
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    path = path.substring(2);
    res.write('<!doctype html>\n');
    res.write('<title>' + escapeHtml(path) + '</title>\n');
    res.write('<style>\n');
    res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
    res.write('</style>\n');
    res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
    res.write('<ol>');
    files.sort();
    for (var i=0; i < files.length; ++i) {
      if (files[i].charAt(0) !== '.') {
        res.write('<li><a href="' + 
          escapeHtml(files[i]) + '">' + 
          escapeHtml(files[i]) + '</a></li>');
      }
    }
    res.write('</ol>');
    res.end();
  });
};

// Must be last, 
main();
