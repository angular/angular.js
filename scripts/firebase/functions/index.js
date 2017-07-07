'use strict';

const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const path = require('path');

const LOCAL_TMP_FOLDER = '/tmp/';

function sendStoredFile(request, response) {
  let filePathSegments = request.path.split('/').filter((segment) => {
    return segment !== '';
  });

  const version = filePathSegments[0];
  const isDocsPath = filePathSegments[1] === 'docs';
  const lastSegment = filePathSegments[filePathSegments.length - 1];
  let downloadPath;
  let fileName;

  if (isDocsPath && filePathSegments.length === 2) {
    fileName = 'index.html';
    filePathSegments = [version, 'docs', fileName];
  } else {
    fileName = lastSegment;
  }

  downloadPath = path.join.apply(null, filePathSegments);

  const bucket = gcs.bucket('ng-i-1121e.appspot.com');

  downloadAndSend().catch(error => {

    if (isDocsPath && error.code === 404) {
      fileName = 'index.html';
      filePathSegments = [version, 'docs', fileName];
      downloadPath = path.join.apply(null, filePathSegments);
      return downloadAndSend();
    }

    return Promise.reject(error);
  }).catch(error => {
    let message = 'General error';
    if (error.code === 404) {
      if (fileName.split('.').length === 1) {
        message = 'Directory listing is not supported';
      } else {
        message = 'File not found';
      }
    }

    return response.status(error.code).send(message);
  });

  function downloadAndSend() {
    return bucket.file(downloadPath).download({
      destination: `/tmp/${fileName}`
    }).then(() => {
      return response.status(200).set({
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=300, s-maxage=600'
      }).sendFile(`${LOCAL_TMP_FOLDER}${fileName}`);
    });
  }
}

exports.sendStoredFile = functions.https.onRequest(sendStoredFile);
