# Angular Bower Script

Script for updating the Angular bower repos from a code.angularjs.org package

Requires `node` (for parsing `bower.json`) and `wget` (for fetching the `angular.zip` from `code.angularjs.org`)


## Instructions

You need to run `./init.sh` the first time you use this script to clone all the repos.

For subsequent updates:

```shell
./publish.sh NEW_VERSION
```

Where `NEW_VERSION` is a version number like `1.2.3`.


## License
MIT

