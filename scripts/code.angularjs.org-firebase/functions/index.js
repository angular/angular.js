'use strict';

const functions = require('firebase-functions');
const {Storage} = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage();
const gcsBucketId = `${process.env.GCLOUD_PROJECT}.appspot.com`;

const BROWSER_CACHE_DURATION = 60 * 10;
const CDN_CACHE_DURATION = 60 * 60 * 12;

function sendStoredFile(request, response) {
  // Request paths will be URI-encoded, so we need to decode them to match the file names in the
  // storage bucket. Failing to do so will result in a 404 error from the bucket and `index.html`
  // will be returned instead.
  // Example of path requiring decoding: `.../input%5Btext%5D.html` --> `.../input[text].html`
  const requestPath = decodeURI(request.path || '/');
  let filePathSegments = requestPath.split('/').filter((segment) => {
    // Remove empty leading or trailing path parts
    return segment !== '';
  });

  const version = filePathSegments[0];
  const isDocsPath = filePathSegments[1] === 'docs';
  const lastSegment = filePathSegments[filePathSegments.length - 1];
  const bucket = storage.bucket(gcsBucketId);

  let downloadSource;
  let fileName;

  if (isDocsPath && filePathSegments.length === 2) {
    fileName = 'index.html';
    filePathSegments = [version, 'docs', fileName];
  } else {
    fileName = lastSegment;
  }

  if (!fileName) {
    // Root
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
          .on('error', reject)
          .on('finish', resolve);

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
    if (response.headersSent) {
      return response;
    }

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

      if (path === '/') {
        // Let the latest versions appear first
        directoryList.reverse();
      }

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

      const directoryListing = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <base href="${base}">
          </head>
          <body>
            <h1>Index of ${path}</h1>
            <hr>
            <pre>${contentList}</pre>
          </body>
        </html>`;

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

        if (
          // we got no files or directories from previous query pages
          !fileList.length && !directoryList.length &&
          // this query page has no file or directories
          !files.length && (!apiResponse || !apiResponse.prefixes)) {
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

const snapshotRegex = /^snapshot(-stable)?\//;

/**
 * The build folder contains a zip file that is unique per build.
 * When a new zip file is uploaded into snapshot or snapshot-stable,
 * delete the previous zip file.
 */
function deleteOldSnapshotZip(object) {
  const bucketId = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  const bucket = storage.bucket(bucketId);

  const snapshotFolderMatch = filePath.match(snapshotRegex);

  if (!snapshotFolderMatch ||	contentType !== 'application/zip') {
    return;
  }

  bucket.getFiles({
    prefix: snapshotFolderMatch[0],
    delimiter: '/',
    autoPaginate: false
  }).then(function(data) {
    const files = data[0];

    const oldZipFiles = files.filter(file => {
      return file.metadata.name !== filePath && file.metadata.contentType === 'application/zip';
    });

    console.info(`found ${oldZipFiles.length} old zip files to delete`);

    oldZipFiles.forEach(function(file) {
      file.delete();
    });

  });
}

exports.sendStoredFile = functions.https.onRequest(sendStoredFile);
exports.deleteOldSnapshotZip = functions.storage.object().onFinalize(deleteOldSnapshotZip);
