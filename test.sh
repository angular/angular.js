#!/bin/bash
if [ ! -e test.dissable ]; then
  java -jar lib/jstd-jasmine/jstestdriver/JsTestDriver.jar --tests all $@
fi
