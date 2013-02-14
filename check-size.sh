#!/bin/bash

#TODO(i): UNCOMMENT
#rake minify
gzip -c < build/angular.min.js > build/angular.min.js.gzip
gzip -c < build/angular.mmin.js > build/angular.mmin.js.gzip
gzip -c < build/angular.mmin2.js > build/angular.mmin2.js.gzip
ls -l build/angular.m*
