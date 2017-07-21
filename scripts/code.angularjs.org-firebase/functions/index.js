'use strict';

const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const path = require('path');

const gcsBucketId = `${process.env.GCLOUD_PROJECT}.appspot.com`;

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
  let fileName;

  if (isDocsPath && filePathSegments.length === 2) {
    fileName = 'index.html';
    filePathSegments = [version, 'docs', fileName];
  } else {
    fileName = lastSegment;
  }

  if (!fileName) {
    //Root
    return getDirectoryListing('/').catch(sendErrorResponse);
  }

  downloadSource = path.join.apply(null, filePathSegments);

  downloadAndSend(downloadSource).catch(error => {
    if (isDocsPath && error.code === 404) {
      fileName = 'index.html';
      filePathSegments = [version, 'docs', fileName];
      downloadSource = path.join.apply(null, filePathSegments);

      return downloadAndSend(downloadSource);
    }

    return Promise.reject(error);
  }).catch(error => {

    // If file not found, try the path as a directory
    return error.code === 404 ? getDirectoryListing(request.path.slice(1)) : Promise.reject(error);
  }).catch(sendErrorResponse);

  function downloadAndSend(downloadSource) {

    const file = bucket.file(downloadSource);

    return file.getMetadata().then(data => {
      return new Promise((resolve, reject) => {

        const readStream = file.createReadStream()
          .on('error', error => {
            reject(error);
          })
          .on('response', () => {
            resolve(response);
          });

        response
          .status(200)
          .set({
            'Content-Type': data[0].contentType,
            'Cache-Control': `public, max-age=${BROWSER_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}`
          });

          readStream.pipe(response);
      });

    });
  }

  function sendErrorResponse(error) {
    let code = 500;
    let message = `General error. Please try again later.
      If the error persists, please create an issue in the
      <a href="https://github.com/angular/angular.js/issues">AngularJS Github repository</a>`;

    if (error.code === 404) {
      message = 'File or directory not found';
      code = 404;
    }

    return response.status(code).send(message);
  }

  function getDirectoryListing(path) {
    if (!path.endsWith('/')) path += '/';

    const getFilesOptions = {
      delimiter: '/',
      autoPaginate: false
    };

    if (path !== '/') getFilesOptions.prefix = path;

    let fileList = [];
    let directoryList = [];

    return getContent(getFilesOptions).then(() => {
      let contentList = '';

      directoryList.forEach(directoryPath => {
        const dirName = directoryPath.split('/').reverse()[1];
        contentList += `<a href="${dirName}/">${dirName}/</a><br>`;
      });

      fileList.forEach(file => {
        const fileName = file.metadata.name.split('/').pop();
        contentList += `<a href="${fileName}">${fileName}</a><br>`;
      });

      // A trailing slash in the base creates correct relative links when the url is accessed
      // without trailing slash
      const base = request.originalUrl.endsWith('/') ? request.originalUrl : request.originalUrl + '/';

      let directoryListing = `
        <base href="${base}">
        <h1>Index of ${path}</h1>
        <hr>
        <pre>${contentList}</pre>`;

      return response
        .status(200)
        .set({
          'Cache-Control': `public, max-age=${BROWSER_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}`
        })
        .send(directoryListing);
    });

    function getContent(options) {
      return bucket.getFiles(options).then(data => {
        const files = data[0];
        const nextQuery = data[1];
        const apiResponse = data[2];

        if (!files.length && (!apiResponse || !apiResponse.prefixes)) {
          return Promise.reject({
            code: 404
          });
        }

        fileList = fileList.concat(files);

        if (apiResponse && apiResponse.prefixes) {
          directoryList = directoryList.concat(apiResponse.prefixes);
        }

        if (nextQuery) {
          // If the results are paged, get the next page
          return getContent(nextQuery);
        }

        return true;
      });

    }
  }
}

function deleteOldSnapshotZip(event) {
  const object = event.data;

  const bucketId = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  const bucket = gcs.bucket(bucketId);

  if (event.eventType === 'providers/cloud.storage/eventTypes/object.change' &&
      contentType === 'application/zip' &&
      filePath.startsWith('snapshot/')
    ) {

    bucket.getFiles({
      prefix: 'snapshot/',
      delimiter: '/',
      autoPaginate: false
    }).then(function(data) {
      const files = data[0];

      const oldZipFiles = files.filter(file => {
        return file.metadata.name !== filePath && file.metadata.contentType === 'application/zip';
      });

      oldZipFiles.forEach(function(file) {
        file.delete();
      });

    });
  }
}

exports.sendStoredFile = functions.https.onRequest(sendStoredFile);
exports.deleteOldSnapshotZip = functions.storage.object().onChange(deleteOldSnapshotZip);
