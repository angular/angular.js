#!/bin/bash

rake compile
gzip -c < build/angular.min.js > build/angular.min.js.gzip
ls -l build/angular.min.*
