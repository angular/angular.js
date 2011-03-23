#!/bin/sh
tests=$1
if [[ $tests = "" ]]; then
  tests="all"
fi

java -Xmx1g -jar lib/jstestdriver/JsTestDriver.jar --config jsTestDriver-coverage.conf --testOutput=tmp/lcov --tests "$tests"
genhtml -o tmp/coverage-html/ tmp/lcov/jsTestDriver.conf-coverage.dat
echo "done! check out tmp/coverage-html/index.html"
