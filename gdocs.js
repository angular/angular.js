#!/usr/bin/env node

'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');

var collections = {
  'guide': 'https://docs.google.com/feeds/default/private/full/folder%3A0B9PsajIPqzmANGUwMGVhZmYtMTk1ZC00NTdmLWIxMDAtZGI5YWNlZjQ2YjZl/contents',
  'api': 'https://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDYjMwYTc2YWUtZTgzYy00YjIxLThlZDYtYWJlOTFlNzE2NzEw/contents',
  'tutorial': 'https://docs.google.com/feeds/default/private/full/folder%3A0B9PsajIPqzmAYWMxYWE3MzYtYzdjYS00OGQxLWJhZjItYzZkMzJiZTRhZjFl/contents',
  'cookbook': 'https://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDNzkxZWM5ZTItN2M5NC00NWIxLTg2ZDMtMmYwNDY1NWM1MGU4/contents',
  'misc': 'https://docs.google.com/feeds/default/private/full/folder%3A0B7Ovm8bUYiUDZjVlNmZkYzQtMjZlOC00NmZhLWI5MjAtMGRjZjlkOGJkMDBi/contents'
};

console.log('Google Docs...');

var flag = process && process.argv[2];
if (flag == '--login') {
  var username = process.argv[3];
  if (username) {
    askPassword(function(password){
      login(username, password);
    });
  } else {
    console.log('Missing username!');
  }
} else if (flag == '--fetch') {
  var collection = process.argv[3];
  if (collection) {
    fetch(collection, collections[collection]);
  } else {
    for (collection in collections)
      fetch(collection, collections[collection]);
  }
} else {
  help();
}

function help() {
  console.log('Synopsys');
  console.log('gdocs.js --login <username>');
  console.log('gdocs.js --fetch [<docs collection>]');
  process.exit(-1);
}


function fetch(collection, url){
  console.log('fetching a list of docs in collection ' + collection + '...');
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
          download(collection, title, exportUrl);
        }
      });
    }
  );
}

function download(collection, name, url) {
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

      // strip out all text annotations
      data = data.replace(/\[[a-zA-Z]{1,2}\]/mg, '');

      // strip out all docos comments
      data = data.replace(/^[^\s_]+:\n\S+[\S\s]*$/m, '');

      // fix smart-quotes
      data = data.replace(/[“”]/g, '"');
      data = data.replace(/[‘’]/g, "'");


      data = data + '\n';

      //this should be a bug in Google Doc API, hence need to remove this once the bug is fixed
      data = data.replace(/\n\n/g, '\n');

      fs.writeFileSync('docs/content/' + collection + '/' + name, reflow(data, 100));
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

function getAuthToken() {
  var pwdFile = 'tmp/gdocs.auth';
  try {
    fs.statSync(pwdFile);
    return fs.readFileSync(pwdFile);
  } catch (e) {
    console.log('Please log in first...');
  }
}

function request(method, url, options, response) {
  url = url.match(/http(s?):\/\/(.+?)(\/.*)/);
  var isHttps = url[1];
  var req = (isHttps ? https : http).request({
    host: url[2],
    port: (url[1] ? 443 : 80),
    path: url[3],
    method: method
  }, function(res){
    var data;
    switch (res.statusCode) {
      case 200:
        data = [];
        res.setEncoding('utf8');
        res.on('end', function () { response(data.join('')); });
        res.on('close', function () { response(data.join('')); });  // https
        res.on('data', function (chunk) { data.push(chunk); });
        res.on('error', function (e) { console.log(e); });
        break;
      case 401:
        console.log('Eror: Login credentials expired! Please login.');
        break;
      default:
        data = [];
        console.log('ERROR: ', res.statusCode);
        console.log('REQUEST URL: ', url[0]);
        console.log('REQUEST POST: ', options.data);
        console.log('REQUEST HEADERS: ', options.headers);
        console.log('RESPONSE HEADERS: ', res.headers);
        res.on('end', function (){ console.log('BODY: ', data.join('')); });
        res.on('close', function (){ console.log('BODY: ', data.join('')); }); // https
        res.on('data', function (chunk) { data.push(chunk); });
        res.on('error', function (e){ console.log(e); });
    }
  });
  for(var header in options.headers) {
    req.setHeader(header, options.headers[header]);
  }
  if (options.data)
    req.write(encodeData(options.data));
  req.on('end', function() {
    console.log('end');
  });
  req.end();
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
  var password = "";
  stdin.on("data", function(c) {
    c = c + "";
    switch (c) {
      case "\n":
      case "\r":
      case "\u0004":
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
  });

}

function reflow(text, margin) {
  var lines = [];
  text.split(/\n/).forEach(function(line) {
    var col = 0;
    var reflowLine = '';
    function flush() {
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
