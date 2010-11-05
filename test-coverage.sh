#!/bin/sh
tests=$1
if [[ $tests = "" ]]; then
  tests="all"
fi

java -Xmx1g -jar lib/jstestdriver/JsTestDriver.jar --config jsTestDriver-coverage.conf --testOutput=tmp/lcov --tests "$tests"
