'use strict';

const functions = require('firebase-functions');
const fs = require('fs');

const BROWSER_CACHE_DURATION = 60 * 60;
const CDN_CACHE_DURATION = 60 * 60 * 12;

const headers = {
  'Cache-Control': `public max-age=${BROWSER_CACHE_DURATION} s-maxage=${CDN_CACHE_DURATION}`
};

const buildSnapshot = data => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <base href="/">
    </head>
    <body>
      ${data}
    </body>
  </html>`;

function sendFile(request, response) {

  const snapshotRequested = typeof request.query._escaped_fragment_ !== 'undefined';
  const filePath = `content/${snapshotRequested ? `partials${request.path}` : 'index'}.html`;

  if (snapshotRequested) {
    fs.readFile(filePath, {encoding: 'utf8'}, (error, data) => {
      if (error) {
        response
          .status(404)
          .end();
      } else {
        response
          .set(headers)
          .send(buildSnapshot(data));
      }
    });
  } else {
    response
      .set(headers)
      .sendFile(filePath, {root: __dirname});
  }
}

exports.sendFile = functions.https.onRequest(sendFile);
