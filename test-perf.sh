#!/bin/sh
tests=$1
norecompile=$2

if [[ $tests = "" ]]; then
  tests="all"
fi

if [[ $norecompile = "" ]]; then
  rake compile
fi

java -jar lib/jstestdriver/JsTestDriver.jar --tests "$tests" --config jsTestDriver-perf.conf
