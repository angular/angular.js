'use strict';

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var semver = require('semver');
var _ = require('lodash');

var process = require('process');
// We are only interested in whether this environment variable exists, hence the !!
var NO_REMOTE_REQUESTS = !!process.env['NG1_BUILD_NO_REMOTE_VERSION_REQUESTS'];
var versionSource = NO_REMOTE_REQUESTS ? 'local' : 'remote';

var currentPackage, previousVersions, cdnVersion;


/**
 * Load information about this project from the package.json
 * @return {Object} The package information
 */
var getPackage = function() {
  // Search up the folder hierarchy for the first package.json
  var packageFolder = path.resolve('.');
  while (!fs.existsSync(path.join(packageFolder, 'package.json'))) {
    var parent = path.dirname(packageFolder);
    if (parent === packageFolder) { break; }
    packageFolder = parent;
  }
  return JSON.parse(fs.readFileSync(path.join(packageFolder,'package.json'), 'UTF-8'));
};


/**
 * Parse the github URL for useful information
 * @return {Object} An object containing the github owner and repository name
 */
var getGitRepoInfo = function() {
  var GITURL_REGEX = /^https:\/\/github.com\/([^/]+)\/(.+).git$/;
  var match = GITURL_REGEX.exec(currentPackage.repository.url);
  var git = {
    owner: match[1],
    repo: match[2]
  };
  return git;
};



/**
 * Extract the code name from the tagged commit's message - it should contain the text of the form:
 * "codename(some-code-name)"
 * @param  {String} tagName Name of the tag to look in for the codename
 * @return {String}         The codename if found, otherwise null/undefined
 */
var getCodeName = function(tagName) {
  var gitCatOutput = shell.exec('git cat-file -p ' + tagName, {silent:true}).stdout;
  var tagMessage = gitCatOutput.match(/^.*codename.*$/mg)[0];
  var codeName = tagMessage && tagMessage.match(/codename\((.*)\)/)[1];
  if (!codeName) {
    throw new Error('Could not extract release code name. The message of tag ' + tagName +
      ' must match \'*codename(some release name)*\'');
  }
  return codeName;
};


/**
 * Compute a build segment for the version, from the Jenkins build number and current commit SHA
 * @return {String} The build segment of the version
 */
function getBuild() {
  var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).stdout.replace('\n', '');
  return 'sha.' + hash;
}

function checkBranchPattern(version, branchPattern) {
  // check that the version starts with the branch pattern minus its asterisk
  // e.g. branchPattern = '1.6.*'; version = '1.6.0-rc.0' => '1.6.' === '1.6.'
  return version.slice(0, branchPattern.length - 1) === branchPattern.replace('*', '');
}

/**
 * If the current commit is tagged as a version get that version
 * @return {SemVer} The version or null
 */
var getTaggedVersion = function() {
  var gitTagResult = shell.exec('git describe --exact-match', {silent:true});

  if (gitTagResult.code === 0) {
    var tag = gitTagResult.stdout.trim();
    var version = semver.parse(tag);

    if (version && checkBranchPattern(version.version, currentPackage.branchPattern)) {
      version.codeName = getCodeName(tag);
      version.full = version.version;
      version.branch = 'v' + currentPackage.branchPattern.replace('*', 'x');
      return version;
    }
  }

  return null;
};

/**
 * Get a collection of all the previous versions sorted by semantic version
 * @return {Array.<SemVer>} The collection of previous versions
 */
var getPreviousVersions =  function() {
  // If we are allowing remote requests then use the remote tags as the local clone might
  // not contain all commits when cloned with git clone --depth=...
  // Otherwise just use the tags in the local repository
  var repo_url = currentPackage.repository.url;
  var query = NO_REMOTE_REQUESTS ? 'git tag' : 'git ls-remote --tags ' + repo_url;
  var tagResults = shell.exec(query, {silent: true});
  if (tagResults.code === 0) {
    return _(tagResults.stdout.match(/v[0-9].*[0-9]$/mg))
      .map(function(tag) {
        var version = semver.parse(tag);
        return version;
      })
      .filter()
      .map(function(version) {
        // angular.js didn't follow semantic version until 1.20rc1
        if ((version.major === 1 && version.minor === 0 && version.prerelease.length > 0) || (version.major === 1 && version.minor === 2 && version.prerelease[0] === 'rc1')) {
          version.version = [version.major, version.minor, version.patch].join('.') + version.prerelease.join('');
          version.raw = 'v' + version.version;
        }
        version.docsUrl = 'http://code.angularjs.org/' + version.version + '/docs';
        // Versions before 1.0.2 had a different docs folder name
        if (version.major < 1 || (version.major === 1 && version.minor === 0 && version.patch < 2)) {
          version.docsUrl += '-' + version.version;
          version.isOldDocsUrl = true;
        }
        return version;
      })
      .sort(semver.compare)
      .value();
  } else {
    return [];
  }
};

var getCdnVersion = function() {
  return _(previousVersions)
    .filter(function(tag) {
      return semver.satisfies(tag, currentPackage.branchVersion);
    })
    .reverse()
    .reduce(function(cdnVersion, version) {
      if (!cdnVersion) {
        if (NO_REMOTE_REQUESTS) {
          // We do not want to make any remote calls to the CDN so just use the most recent version
          cdnVersion = version;
        } else {
          // Note: need to use shell.exec and curl here
          // as version-infos returns its result synchronously...
          var cdnResult = shell.exec('curl http://ajax.googleapis.com/ajax/libs/angularjs/' + version + '/angular.min.js ' +
                    '--head --write-out "%{http_code}" -silent',
                                      {silent: true});
          if (cdnResult.code === 0) {
            // --write-out appends its content to the general request response, so extract it
            var statusCode = cdnResult.stdout.split('\n').pop().trim();
            if (statusCode === '200') {
              cdnVersion = version;
            }
          }
        }
      }
      return cdnVersion;
    }, null);
};

/**
 * Get the unstable snapshot version
 * @return {SemVer} The snapshot version
 */
var getSnapshotVersion = function() {
  var version = _(previousVersions)
    .filter(function(tag) {
      return semver.satisfies(tag, currentPackage.branchVersion);
    })
    .last();

  if (!version) {
    // a snapshot version before the first tag on the branch
    version = semver(currentPackage.branchPattern.replace('*','0-beta.1'));
  }

  // We need to clone to ensure that we are not modifying another version
  version = semver(version.raw);

  var jenkinsBuild = process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER;
  if (!version.prerelease || !version.prerelease.length) {
    // last release was a non beta release. Increment the patch level to
    // indicate the next release that we will be doing.
    // E.g. last release was 1.3.0, then the snapshot will be
    // 1.3.1-build.1, which is lesser than 1.3.1 according to the semver!

    // If the last release was a beta release we don't update the
    // beta number by purpose, as otherwise the semver comparison
    // does not work any more when the next beta is released.
    // E.g. don't generate 1.3.0-beta.2.build.1
    // as this is bigger than 1.3.0-beta.2 according to semver
    version.patch++;
  }
  version.prerelease = jenkinsBuild ? ['build', jenkinsBuild] : ['local'];
  version.build = getBuild();
  version.codeName = 'snapshot';
  version.isSnapshot = true;
  version.format();
  version.full = version.version + '+' + version.build;
  version.branch = 'master';

  return version;
};


exports.currentPackage = currentPackage = getPackage();
exports.gitRepoInfo = getGitRepoInfo();
exports.previousVersions = previousVersions = getPreviousVersions();
exports.cdnVersion = cdnVersion = getCdnVersion();
exports.currentVersion = getTaggedVersion() || getSnapshotVersion();

if (NO_REMOTE_REQUESTS) {
  console.log('==============================================================================================');
  console.log('Running with no remote requests for version data:');
  console.log(' - this is due to the "NG1_BUILD_NO_REMOTE_VERSION_REQUESTS" environment variable being defined.');
  console.log(' - be aware that the generated docs may not have valid or the most recent version information.');
  console.log('==============================================================================================');
}

console.log('CDN version (' + versionSource + '):', cdnVersion ? cdnVersion.raw : 'No version found.');
console.log('Current version (' + versionSource + '):', exports.currentVersion.raw);
