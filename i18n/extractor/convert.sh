#!/bin/bash

BASE_DIR=`dirname $0`
cd $BASE_DIR


/usr/bin/env jasmine-node spec/ --noColor | grep -v '/lib/jasmine' && node externalize_to_rdb.js $1 $2
