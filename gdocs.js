#!/usr/bin/env node

var http = require('http');
var https = require('https');
var fs = require('fs');

var collections = {
  'guide': 'http://docs.google.com/feeds/default/private/full/folder%3A0B9PsajIPqzmANGUwMGVhZmYtMTk1ZC00NTdmLWIxMDAtZGI5YWNlZjQ2YjZl/contents',
  'api': 'http://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDYjMwYTc2YWUtZTgzYy00YjIxLThlZDYtYWJlOTFlNzE2NzEw/contents',
  'tutorial': 'http://docs.google.com/feeds/default/private/full/folder%3A0B9PsajIPqzmAYWMxYWE3MzYtYzdjYS00OGQxLWJhZjItYzZkMzJiZTRhZjFl/contents',
  'cookbook': 'http://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDNzkxZWM5ZTItN2M5NC00NWIxLTg2ZDMtMmYwNDY1NWM1MGU4/contents',
  'misc': 'http://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDZjVlNmZkYzQtMjZlOC00NmZhLWI5MjAtMGRjZjlkOGJkMDBi/contents'
}

console.log('Google Docs...');

var flag = process && process.argv[2];
if (flag == '--login')
  askPassword(function(password){
    login(process.argv[3], password);
  });
else if (flag == '--fetch') {
  var collection = process.argv[3];
  if (collection) {
    fetch(collection, collections[collection]);
  } else {
    for (collection in collections)
      fetch(collection, collections[collection]);
  }
} else
  help();

function help(){
  console.log('Synopsys');
  console.log('gdocs.js --login <username>');
  console.log('gdocs.js --fetch [<docs collection>]');
  process.exit(-1);
};


function fetch(name, url){
  //https://docs.google.com/feeds/default/private/full/folder%3Afolder_id/contents
  console.log('fetching a list of docs in collection ' + name + '...');
  request('GET', url, {
        headers: {
          'Gdata-Version': '3.0',
          'Authorization': 'GoogleLogin auth=' + getAuthToken()
        }
      },
      function(chunk){
        var entries = chunk.split('<entry');
        entries.shift();
        entries.forEach(function(entry){
          var title = entry.match(/<title>(.*?)<\/title>/)[1];
          if (title.match(/\.ngdoc$/)) {
            var exportUrl = entry.match(/<content type='text\/html' src='(.*?)'\/>/)[1];
            download(title, exportUrl);
          }
        });
      }
    );
}

function download(name, url) {
  console.log('Downloading:', name, '...');
  request('GET', url + '&exportFormat=txt',
      {
        headers: {
          'Gdata-Version': '3.0',
          'Authorization': 'GoogleLogin auth=' + getAuthToken()
        }
      },
      function(data){
        data = data.replace('\ufeff', '');
        data = data.replace(/\r\n/mg, '\n');
        data = data.replace(/^ /mg, '  '); //for some reason gdocs drop first space for indented lines

        // strip out all text annotation comments
        data = data.replace(/^\[a\][\S\s]*/m, '');

        // strip out all text annotations
        data = data.replace(/\[\w{1,3}\]/mg, '');

        // fix smart-quotes
        data = data.replace(/[“”]/g, '"');
        data = data.replace(/[‘’]/g, "'");


        data = data + '\n';
        fs.writeFileSync('docs/' + name, reflow(data, 100));
      }
    );
}

/**
 * token=$(curl
 *    -s https://www.google.com/accounts/ClientLogin
 *    -d Email=...username...
 *    -d Passwd=...password...
 *    -d accountType=GOOGLE
 *    -d service=writely
 *    -d Gdata-version=3.0 | cut -d "=" -f 2)
 */
function login(username, password){
  request('POST', 'https://www.google.com/accounts/ClientLogin',
      {
        data: {
          Email: username,
          Passwd: password,
          accountType: 'GOOGLE',
          service: 'writely',
          'Gdata-version': '3.0'
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      },
      function(chunk){
        var token;
        chunk.split('\n').forEach(function(line){
          var parts = line.split('=');
          if (parts[0] == 'Auth') {
            token = parts[1];
          }
        });
        if (token) {
          fs.writeFileSync('tmp/gdocs.auth', token);
          console.log("logged in, token saved in 'tmp/gdocs.auth'");
        } else {
          console.log('failed to log in');
        }
      }
    );
}

function getAuthToken(){
  return fs.readFileSync('tmp/gdocs.auth');
}

function request(method, url, options, response) {
  var url = url.match(/http(s?):\/\/(.+?)(\/.*)/);
  var request = (url[1] ? https : http).request({
    host: url[2],
    port: (url[1] ? 443 : 80),
    path: url[3],
    method: method
  }, function(res){
    var data = [];
    res.setEncoding('utf8');
    res.on('end', function(){
      response(data.join(''));
    });
    res.on('data', function (chunk) {
      data.push(chunk);
    });
  });
  for(var header in options.headers) {
    request.setHeader(header, options.headers[header]);
  }
  if (options.data)
    request.write(encodeData(options.data));
  request.on('end', function(){
    console.log('end');
  });
  request.end();
}

function encodeData(obj) {
  var pairs = [];
  for(var key in obj) {
    pairs.push(key + '=' + obj[key]);
  }
  return pairs.join('&') + '\n';
}

function askPassword(callback) {
  var stdin = process.openStdin(),
      stdio = process.binding("stdio");

  stdio.setRawMode();

  console.log('Enter your password:');
  var password = ""
  stdin.on("data", function (c) {
    c = c + "";
    switch (c) {
      case "\n": case "\r": case "\u0004":
        stdio.setRawMode(false);
        stdin.pause();
        callback(password);
        break;
      case "\u0003":
        process.exit();
        break;
      default:
        password += c;
        break;
    }
  })

}

function reflow(text, margin) {
  var lines = [];
  text.split(/\n/).forEach(function(line) {
    var col = 0;
    var reflowLine = '';
    function flush(){
      reflowLine = reflowLine.replace(/\s*$/, '');
      lines.push(reflowLine);
      reflowLine = '';
      col = 0;
    }
    line.replace(/\s*\S*\s*/g, function(chunk){
      if (col + chunk.length > margin) flush();
      reflowLine += chunk;
      col += chunk.length;
    });
    flush();
  });
  return lines.join('\n');
}
