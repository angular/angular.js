'use strict';

const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const path = require('path');

const gcsBucketId = `${process.env.GCLOUD_PROJECT}.appspot.com`;
const LOCAL_TMP_FOLDER = '/tmp/';

const BROWSER_CACHE_DURATION = 300;
const CDN_CACHE_DURATION = 600;

function sendStoredFile(request, response) {
  let filePathSegments = request.path.split('/').filter((segment) => {
    // Remove empty leading or trailing path parts
    return segment !== '';
  });

  const version = filePathSegments[0];
  const isDocsPath = filePathSegments[1] === 'docs';
  const lastSegment = filePathSegments[filePathSegments.length - 1];
  const bucket = gcs.bucket(gcsBucketId);

  let downloadSource;
  let downloadDestination;
  let fileName;

  if (isDocsPath && filePathSegments.length === 2) {
    fileName = 'index.html';
    filePathSegments = [version, 'docs', fileName];
  } else {
    fileName = lastSegment;
  }

  downloadSource = path.join.apply(null, filePathSegments);
  downloadDestination = `${LOCAL_TMP_FOLDER}${fileName}`;

  downloadAndSend(downloadSource, downloadDestination).catch(error => {
    if (isDocsPath && error.code === 404) {
      fileName = 'index.html';
      filePathSegments = [version, 'docs', fileName];
      downloadSource = path.join.apply(null, filePathSegments);
      downloadDestination = `${LOCAL_TMP_FOLDER}${fileName}`;

      return downloadAndSend(downloadSource, downloadDestination);
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

  function downloadAndSend(downloadSource, downloadDestination) {
    return bucket.file(downloadSource).download({
      destination: downloadDestination
    }).then(() => {
      return response.status(200)
        .set({
          'Cache-Control': `public, max-age=${BROWSER_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}`
        })
        .sendFile(downloadDestination);
    });
  }
}

exports.sendStoredFile = functions.https.onRequest(sendStoredFile);
