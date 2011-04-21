#!/bin/sh
java -Xmx1g -jar lib/jstestdriver/JsTestDriver.jar --config jsTestDriver-coverage.conf --testOutput=tmp/lcov --tests all $@
genhtml -o tmp/coverage-html/ tmp/lcov/jsTestDriver.conf-coverage.dat
echo "done! check out tmp/coverage-html/index.html"
