#!/bin/sh

underscore=$(dirname $0)
github='http://github.com/documentcloud/underscore/raw/master'

wget $github/underscore-min.js -O $underscore/underscore-min.js
wget $github/underscore.js -O $underscore/underscore.js
