# Vendor Libraries

Libraries that are not available via yarn / the npm registry, are checked into git in the `vendor`
folder.

Currently this affects the following libraries:

## closure-compiler

Version: `20140814`

The closure-compiler is available on npm, but not the version we are using.

## ng-closure-runner

Version: `0.2.4`

This project has never been published to npm.

# Updating the libraries

If a different version becomes available, it must be manually downloaded and replaced in the
repository.

Should yarn support requiring zip archives in the future (see
[yarn github issue: Zip support](https://github.com/yarnpkg/yarn/issues/1483)),
we can remove the libraries from the repository and add them to the package.json.
