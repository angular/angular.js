var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var semver = require('semver');
var _ = require('lodash');

var currentPackage, previousVersions, cdnVersion;


/**
 * Load information about this project from the package.json
 * @return {Object} The package information
 */
var getPackage = function() {
  // Search up the folder hierarchy for the first package.json
  var packageFolder = path.resolve('.');
  while ( !fs.existsSync(path.join(packageFolder, 'package.json')) ) {
    var parent = path.dirname(packageFolder);
    if ( parent === packageFolder) { break; }
    packageFolder = parent;
  }
  return JSON.parse(fs.readFileSync(path.join(packageFolder,'package.json'), 'UTF-8'));
};


/**
 * Parse the github URL for useful information
 * @return {Object} An object containing the github owner and repository name
 */
var getGitRepoInfo = function() {
  var GITURL_REGEX = /^https:\/\/github.com\/([^\/]+)\/(.+).git$/;
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
  var gitCatOutput = shell.exec('git cat-file -p '+ tagName, {silent:true}).output;
  var tagMessage = gitCatOutput.match(/^.*codename.*$/mg)[0];
  var codeName = tagMessage && tagMessage.match(/codename\((.*)\)/)[1];
  if (!codeName) {
    throw new Error("Could not extract release code name. The message of tag "+tagName+
      " must match '*codename(some release name)*'");
  }
  return codeName;
};


/**
 * Compute a build segment for the version, from the Jenkins build number and current commit SHA
 * @return {String} The build segment of the version
 */
function getBuild() {
  var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');
  return 'sha.'+hash;
}


/**
 * If the current commit is tagged as a version get that version
 * @return {SemVer} The version or null
 */
var getTaggedVersion = function() {
  var gitTagResult = shell.exec('git describe --exact-match', {silent:true});

  if ( gitTagResult.code === 0 ) {
    var tag = gitTagResult.output.trim();
    var version = semver.parse(tag);

    if ( version && semver.satisfies(version, currentPackage.branchVersion)) {
      version.codeName = getCodeName(tag);
      version.full = version.version;
      return version;
    }
  }

  return null;
};

/**
 * Stable versions have an even minor version and have no prerelease
 * @param  {SemVer}  version The version to test
 * @return {Boolean}         True if the version is stable
 */
var isStable = function(version) {
  return semver.satisfies(version, '1.0 || 1.2') && version.prerelease.length === 0;
};

/**
 * Get a collection of all the previous versions sorted by semantic version
 * @return {Array.<SemVer>} The collection of previous versions
 */
var getPreviousVersions =  function() {
  // always use the remote tags as the local clone might
  // not contain all commits when cloned with git clone --depth=...
  // Needed e.g. for Travis
  var repo_url = currentPackage.repository.url;
  var tagResults = shell.exec('git ls-remote --tags ' + repo_url,
                              {silent: true});
  if ( tagResults.code === 0 ) {
    return _(tagResults.output.match(/v[0-9].*[0-9]$/mg))
      .map(function(tag) {
        var version = semver.parse(tag);
        return version;
      })
      .filter()
      .map(function(version) {
        version.isStable = isStable(version);

        version.docsUrl = 'http://code.angularjs.org/' + version.version + '/docs';
        // Versions before 1.0.2 had a different docs folder name
        if ( version.major < 1 || (version.major === 1 && version.minor === 0 && version.dot < 2 ) ) {
          version.docsUrl += '-' + version.version;
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
        // Note: need to use shell.exec and curl here
        // as version-infos returns its result synchronously...
        var cdnResult = shell.exec('curl http://ajax.googleapis.com/ajax/libs/angularjs/'+version+'/angular.min.js '+
                  '--head --write-out "%{http_code}" -o /dev/null -silent',
                                    {silent: true});
        if ( cdnResult.code === 0 ) {
          var statusCode = cdnResult.output.trim();
          if (statusCode === '200') {
            cdnVersion = version;
          }
        }
      }
      return cdnVersion;
    }, null);
}

/**
 * Get the unstable snapshot version
 * @return {SemVer} The snapshot version
 */
var getSnapshotVersion = function() {
  version = _(previousVersions)
    .filter(function(tag) {
      return semver.satisfies(tag, currentPackage.branchVersion);
    })
    .last();

  if ( !version ) {
    // a snapshot version before the first tag on the branch
    version = semver(currentPackage.branchVersion.replace('*','0-beta.1'));
  }

  // We need to clone to ensure that we are not modifying another version
  version = semver(version.raw);

  var jenkinsBuild = process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER;
  if (!version.prerelease || !version.prerelease.length) {
    // last release was a non beta release. Increment the patch level to
    // indicate the next release that we will be doing.
    // E.g. last release was 1.3.0, then the snapshot will be
    // 1.3.1-build.1, which is lesser than 1.3.1 accorind the semver!

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

  return version;
};


exports.currentPackage = currentPackage = getPackage();
exports.gitRepoInfo = gitRepoInfo = getGitRepoInfo();
exports.previousVersions = previousVersions = getPreviousVersions();
exports.cdnVersion = cdnVersion = getCdnVersion();
exports.currentVersion = getTaggedVersion() || getSnapshotVersion();
