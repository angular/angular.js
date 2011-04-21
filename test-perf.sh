#!/bin/sh

norecompile=$1

if [[ $norecompile = "" ]]; then
  rake compile
fi

java -jar lib/jstestdriver/JsTestDriver.jar --tests all --config jsTestDriver-perf.conf $@
