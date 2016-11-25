#!/bin/bash

node_modules/.bin/grunt minify
gzip -c < build/angular.min.js > build/angular.min.js.gzip
ls -l build/angular.min.*
